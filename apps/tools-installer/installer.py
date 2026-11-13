#!/usr/bin/env python3
"""
Athar DZ — Zero-Dependency Cross-Platform Tools Installer & Progress Monitor.

Supports targeting Windows, Linux, or Both; CPU, NVIDIA GPU (CUDA), or Both;
parallel per-source worker pools (Docker, GitHub, PyPI, HTTP, AI, Node/Sys);
offline cross-platform Python wheel downloading (including companion Python
libraries for GitHub OSINT/DFIR tools); Web UI (HTTP + SSE); and headless CLI.
"""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import platform
import queue
import re
import shutil
import subprocess
import sys
import tarfile
import threading
import time
import urllib.error
import urllib.request
import webbrowser
import zipfile
from typing import Any, Callable


APP_DIR = Path(__file__).resolve().parent
CATALOG_PATH = APP_DIR / "catalog.json"
UI_PATH = APP_DIR / "ui.html"
DEFAULT_DEST = APP_DIR.parent.parent / ".athar-tools"

CHANNEL_WORKERS = {
    "docker": 2,
    "github": 3,
    "pypi": 2,
    "http": 3,
    "ai": 2,
    "node_sys": 2,
}


def get_source_channel(method: str) -> str:
    if method == "docker_pull":
        return "docker"
    if method in ("github_release", "git_clone"):
        return "github"
    if method == "pip_install":
        return "pypi"
    if method == "http_file":
        return "http"
    if method in ("ollama_pull", "hf_snapshot"):
        return "ai"
    return "node_sys"


def load_catalog(path: Path = CATALOG_PATH) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


def normalize_os(raw: str | None = None) -> str:
    val = (raw or "").strip().lower()
    if val in ("both", "all", "windows+linux", "win+linux"):
        return "both"
    if val in ("windows", "win", "win32"):
        return "windows"
    if val in ("linux", "posix"):
        return "linux"
    sys_name = platform.system().lower()
    if "windows" in sys_name:
        return "windows"
    return "linux"


def normalize_arch(raw: str | None = None) -> str:
    val = (raw or "").strip().lower()
    if val in ("amd64", "x86_64", "x64"):
        return "amd64"
    if val in ("arm64", "aarch64"):
        return "arm64"
    mach = platform.machine().lower()
    if mach in ("arm64", "aarch64"):
        return "arm64"
    return "amd64"


def normalize_compute(raw: str | None = None, has_gpu: bool | None = None) -> str:
    val = (raw or "").strip().lower()
    if val in ("both", "all", "cpu+gpu", "gpu+cpu"):
        return "both"
    if val in ("gpu", "cuda"):
        return "gpu"
    if val == "cpu":
        return "cpu"
    if has_gpu is None:
        has_gpu = detect_gpu()["has_nvidia"]
    return "gpu" if has_gpu else "cpu"


def detect_gpu() -> dict[str, Any]:
    nvsmi = shutil.which("nvidia-smi")
    if not nvsmi:
        return {"has_nvidia": False, "name": None, "vram_mb": None}
    try:
        out = subprocess.check_output(
            [nvsmi, "--query-gpu=name,memory.total", "--format=csv,noheader,nounits"],
            stderr=subprocess.DEVNULL,
            text=True,
            timeout=5,
        ).strip()
        if out:
            first = out.splitlines()[0].split(",")
            name = first[0].strip()
            vram = int(float(first[1].strip())) if len(first) > 1 else None
            return {"has_nvidia": True, "name": name, "vram_mb": vram}
    except Exception:
        pass
    return {"has_nvidia": False, "name": None, "vram_mb": None}


def detect_environment(dest_dir: Path | None = None) -> dict[str, Any]:
    host_os = normalize_os("auto")
    host_arch = normalize_arch("auto")
    gpu = detect_gpu()
    target_path = dest_dir or DEFAULT_DEST
    probe = target_path if target_path.exists() else target_path.parent
    while not probe.exists() and probe.parent != probe:
        probe = probe.parent
    disk_free_gb = 0.0
    try:
        usage = shutil.disk_usage(probe)
        disk_free_gb = round(usage.free / (1024**3), 2)
    except OSError:
        pass

    bins = {
        "docker": bool(shutil.which("docker")),
        "git": bool(shutil.which("git")),
        "python": True,
        "node": bool(shutil.which("node")),
        "npm": bool(shutil.which("npm")),
        "ollama": bool(shutil.which("ollama")),
        "winget": bool(shutil.which("winget")) if host_os == "windows" else False,
        "apt": bool(shutil.which("apt-get")) if host_os == "linux" else False,
    }

    return {
        "os": host_os,
        "arch": host_arch,
        "cpu_count": os.cpu_count() or 1,
        "gpu": gpu,
        "recommended_compute": "gpu" if gpu["has_nvidia"] else "cpu",
        "disk_free_gb": disk_free_gb,
        "bins": bins,
        "python_version": platform.python_version(),
        "default_dest": str(DEFAULT_DEST),
        "channels": dict(CHANNEL_WORKERS),
    }


def _os_multiplier(tool: dict[str, Any], target_oses: list[str]) -> int:
    method = tool["method"]
    spec = tool.get("spec", {})
    compat = [o for o in target_oses if o in tool.get("os_support", ["windows", "linux"])]
    if not compat:
        return 0
    if method in ("github_release", "pip_install", "system_pkg"):
        return len(compat)
    if method == "http_file" and ("windows_url" in spec or "linux_url" in spec):
        return len(compat)
    return 1


def resolve_plan(
    catalog: dict[str, Any],
    selected_ids: list[str],
    target_os: str,
    target_arch: str,
    compute: str,
    mbps: float = 50.0,
) -> dict[str, Any]:
    target_oses = ["windows", "linux"] if target_os == "both" else [target_os]
    computes = ["cpu", "gpu"] if compute == "both" else [compute]
    selected_set = set(selected_ids)
    items: list[dict[str, Any]] = []
    total_download_mb = 0.0
    total_disk_mb = 0.0
    skipped_os_count = 0
    channel_counts: dict[str, int] = {k: 0 for k in CHANNEL_WORKERS}

    for tool in catalog.get("tools", []):
        if tool["id"] not in selected_set:
            continue
        compat_oses = [o for o in target_oses if o in tool.get("os_support", ["windows", "linux"])]
        os_ok = len(compat_oses) > 0
        os_mult = _os_multiplier(tool, target_oses)

        if not os_ok:
            dl_mb = 0.0
            dk_mb = 0.0
        elif tool.get("compute") == "cpu_gpu" and len(computes) == 2:
            # Estimate combined CPU + GPU variant footprint without double-counting shared weights when identical
            cpu_dl = float(tool["size_mb_cpu"])
            gpu_dl = float(tool["size_mb_gpu"])
            cpu_dk = float(tool["disk_mb_cpu"])
            gpu_dk = float(tool["disk_mb_gpu"])
            if cpu_dl == gpu_dl:
                dl_mb = cpu_dl * os_mult
                dk_mb = cpu_dk * os_mult
            else:
                dl_mb = (cpu_dl + gpu_dl) * os_mult
                dk_mb = (cpu_dk + gpu_dk) * os_mult
        else:
            c = computes[0]
            dl_mb = float(tool["size_mb_gpu"] if c == "gpu" else tool["size_mb_cpu"]) * os_mult
            dk_mb = float(tool["disk_mb_gpu"] if c == "gpu" else tool["disk_mb_cpu"]) * os_mult

        channel = tool.get("source_channel") or get_source_channel(tool["method"])
        entry = {
            **tool,
            "channel": channel,
            "os_compatible": os_ok,
            "compatible_oses": compat_oses,
            "resolved_computes": computes if tool.get("compute") == "cpu_gpu" else [computes[0]],
            "resolved_size_mb": round(dl_mb, 1),
            "resolved_disk_mb": round(dk_mb, 1),
            "skip_reason": None if os_ok else f"Requires {'/'.join(tool.get('os_support', []))}",
        }
        items.append(entry)
        if os_ok:
            total_download_mb += dl_mb
            total_disk_mb += dk_mb
            channel_counts[channel] = channel_counts.get(channel, 0) + 1
        else:
            skipped_os_count += 1

    mbps_safe = max(1.0, float(mbps))
    eff_mb_per_sec = (mbps_safe / 8.0) * 0.85
    eta_seconds = int(round(total_download_mb / eff_mb_per_sec)) if total_download_mb > 0 else 0

    return {
        "target_os": target_os,
        "target_oses": target_oses,
        "target_arch": target_arch,
        "compute": compute,
        "computes": computes,
        "items": items,
        "active_count": len(items) - skipped_os_count,
        "skipped_os_count": skipped_os_count,
        "total_download_mb": round(total_download_mb, 1),
        "total_disk_mb": round(total_disk_mb, 1),
        "eta_seconds": eta_seconds,
        "channel_counts": channel_counts,
    }


def _http_headers() -> dict[str, str]:
    headers = {"User-Agent": "AtharDZ-ToolsInstaller/1.0"}
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")
    if token:
        headers["Authorization"] = f"Bearer {token.strip()}"
    return headers


def resolve_github_release_asset(
    repo: str,
    asset_pattern: str,
    timeout: int = 25,
) -> tuple[str, str, int]:
    api_url = f"https://api.github.com/repos/{repo}/releases/latest"
    req = urllib.request.Request(api_url, headers={**_http_headers(), "Accept": "application/vnd.github+json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    regex = re.compile(asset_pattern, re.IGNORECASE)
    for asset in data.get("assets", []):
        name = asset.get("name", "")
        if name.lower().endswith((".txt", ".gpg", ".asc", ".sha256", ".sig")):
            continue
        if regex.search(name):
            return asset["browser_download_url"], name, int(asset.get("size") or 0)

    available = [a.get("name", "") for a in data.get("assets", [])][:12]
    raise RuntimeError(f"No asset matching '{asset_pattern}' in {repo} latest release. Available: {available}")


def _safe_extract_zip(archive_path: Path, dest_dir: Path) -> None:
    dest_resolved = dest_dir.resolve()
    with zipfile.ZipFile(archive_path, "r") as zf:
        for member in zf.infolist():
            target = (dest_resolved / member.filename).resolve()
            if not str(target).startswith(str(dest_resolved)):
                raise RuntimeError(f"Unsafe zip entry path blocked: {member.filename}")
        zf.extractall(dest_resolved)


def _safe_extract_tar(archive_path: Path, dest_dir: Path) -> None:
    dest_resolved = dest_dir.resolve()
    with tarfile.open(archive_path, "r:*") as tf:
        for member in tf.getmembers():
            target = (dest_resolved / member.name).resolve()
            if not str(target).startswith(str(dest_resolved)):
                raise RuntimeError(f"Unsafe tar entry path blocked: {member.name}")
        if sys.version_info >= (3, 12):
            tf.extractall(dest_resolved, filter="data")
        else:
            tf.extractall(dest_resolved)


def extract_archive(archive_path: Path, dest_dir: Path) -> None:
    dest_dir.mkdir(parents=True, exist_ok=True)
    name = archive_path.name.lower()
    if name.endswith(".zip"):
        _safe_extract_zip(archive_path, dest_dir)
    elif name.endswith((".tar.gz", ".tgz", ".tar.xz", ".txz", ".tar.bz2")):
        _safe_extract_tar(archive_path, dest_dir)


def stream_download_file(
    url: str,
    dest_path: Path,
    cancel_event: threading.Event,
    progress_cb: Callable[[int, int, float], None],
    expected_bytes: int = 0,
    timeout: int = 120,
    max_retries: int = 3,
) -> Path:
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    part_path = dest_path.with_suffix(dest_path.suffix + ".part")
    last_err: Exception | None = None

    for attempt in range(1, max_retries + 1):
        if cancel_event.is_set():
            raise InterruptedError("Cancelled by user")
        existing = part_path.stat().st_size if part_path.exists() else 0
        headers = _http_headers()
        if existing > 0:
            headers["Range"] = f"bytes={existing}-"

        req = urllib.request.Request(url, headers=headers)
        downloaded = existing
        start_t = time.monotonic()
        last_emit = start_t
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                status = getattr(resp, "status", 200)
                if status == 206:
                    content_len = int(resp.headers.get("Content-Length") or 0)
                    total = existing + content_len if content_len else (expected_bytes or 0)
                    mode = "ab"
                else:
                    existing = 0
                    downloaded = 0
                    total = int(resp.headers.get("Content-Length") or expected_bytes or 0)
                    mode = "wb"

                with part_path.open(mode) as fh:
                    while True:
                        if cancel_event.is_set():
                            raise InterruptedError("Cancelled by user")
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        fh.write(chunk)
                        downloaded += len(chunk)
                        now = time.monotonic()
                        if now - last_emit >= 0.15:
                            elapsed = max(0.05, now - start_t)
                            speed_mb_s = ((downloaded - existing) / (1024 * 1024)) / elapsed
                            progress_cb(downloaded, total, speed_mb_s)
                            last_emit = now

            elapsed = max(0.05, time.monotonic() - start_t)
            speed_mb_s = ((downloaded - existing) / (1024 * 1024)) / elapsed
            progress_cb(downloaded, downloaded if total == 0 else total, speed_mb_s)
            os.replace(part_path, dest_path)
            return dest_path
        except InterruptedError:
            raise
        except Exception as exc:
            last_err = exc
            if attempt < max_retries:
                time.sleep(1.5 * attempt)

    raise RuntimeError(f"Download failed after {max_retries} attempts: {last_err}")


def pip_platform_tag(target_os: str, target_arch: str) -> str:
    if target_os == "windows":
        return "win_arm64" if target_arch == "arm64" else "win_amd64"
    return "manylinux2014_aarch64" if target_arch == "arm64" else "manylinux2014_x86_64"


def write_offline_wheel_scripts(dest_dir: Path) -> None:
    wheels_root = dest_dir / "wheels"
    wheels_root.mkdir(parents=True, exist_ok=True)
    win_bat = wheels_root / "install_wheels_windows.bat"
    win_bat.write_text(
        "@echo off\r\n"
        "setlocal\r\n"
        "set MODE=%1\r\n"
        "if \"%MODE%\"==\"\" set MODE=cpu\r\n"
        "python -m venv \"%~dp0..\\venv\"\r\n"
        "\"%~dp0..\\venv\\Scripts\\python.exe\" -m pip install --no-index --find-links=\"%~dp0windows_%MODE%\" \"%~dp0windows_%MODE%\\*\"\r\n",
        encoding="utf-8",
    )
    lin_sh = wheels_root / "install_wheels_linux.sh"
    lin_sh.write_text(
        "#!/usr/bin/env bash\n"
        "set -euo pipefail\n"
        "MODE=\"${1:-cpu}\"\n"
        "DIR=\"$(cd \"$(dirname \"$0\")\" && pwd)\"\n"
        "python3 -m venv \"$DIR/../venv\"\n"
        "\"$DIR/../venv/bin/python\" -m pip install --no-index --find-links=\"$DIR/linux_$MODE\" \"$DIR/linux_$MODE\"/*\n",
        encoding="utf-8",
    )


class DownloadManager:
    def __init__(self, catalog: dict[str, Any]) -> None:
        self.catalog = catalog
        self._lock = threading.RLock()
        self._cancel_event = threading.Event()
        self._active_procs: set[subprocess.Popen[str]] = set()
        self._subscribers: list[queue.Queue[tuple[str, dict[str, Any]]]] = []
        self._running = False
        self._job_thread: threading.Thread | None = None
        self._last_config: dict[str, Any] = {}
        self._items_state: dict[str, dict[str, Any]] = {}
        self._logs: list[dict[str, Any]] = []
        self._venv_lock = threading.Lock()
        self._gh_cache_lock = threading.Lock()
        self._gh_cache: dict[tuple[str, str], tuple[str, str, int]] = {}
        self._dest_dir = DEFAULT_DEST
        self._load_state_from_disk(DEFAULT_DEST)

    def _state_file(self, dest_dir: Path) -> Path:
        return dest_dir / "state.json"

    def _load_state_from_disk(self, dest_dir: Path) -> None:
        sf = self._state_file(dest_dir)
        if sf.exists():
            try:
                data = json.loads(sf.read_text(encoding="utf-8"))
                self._items_state = data.get("items", {})
                self._last_config = data.get("last_config", {})
            except Exception:
                self._items_state = {}

    def _save_state_to_disk(self) -> None:
        with self._lock:
            self._dest_dir.mkdir(parents=True, exist_ok=True)
            sf = self._state_file(self._dest_dir)
            tmp = sf.with_suffix(".json.tmp")
            payload = {
                "updated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
                "dest_dir": str(self._dest_dir),
                "last_config": self._last_config,
                "items": self._items_state,
            }
            tmp.write_text(json.dumps(payload, indent=2), encoding="utf-8")
            os.replace(tmp, sf)

    def subscribe(self) -> queue.Queue[tuple[str, dict[str, Any]]]:
        q: queue.Queue[tuple[str, dict[str, Any]]] = queue.Queue(maxsize=512)
        with self._lock:
            self._subscribers.append(q)
        return q

    def unsubscribe(self, q: queue.Queue[tuple[str, dict[str, Any]]]) -> None:
        with self._lock:
            if q in self._subscribers:
                self._subscribers.remove(q)

    def _emit(self, event_name: str, payload: dict[str, Any]) -> None:
        with self._lock:
            dead: list[queue.Queue[tuple[str, dict[str, Any]]]] = []
            for q in self._subscribers:
                try:
                    q.put_nowait((event_name, payload))
                except queue.Full:
                    dead.append(q)
            for d in dead:
                self._subscribers.remove(d)

    def log(self, level: str, message: str, item_id: str | None = None) -> None:
        entry = {
            "ts": time.strftime("%H:%M:%S"),
            "level": level,
            "item_id": item_id,
            "message": message,
        }
        with self._lock:
            self._logs.append(entry)
            if len(self._logs) > 500:
                self._logs = self._logs[-500:]
        self._emit("log", entry)

    def get_snapshot(self) -> dict[str, Any]:
        with self._lock:
            return {
                "running": self._running,
                "dest_dir": str(self._dest_dir),
                "last_config": self._last_config,
                "items": dict(self._items_state),
                "logs": list(self._logs[-120:]),
            }

    def reset_state(self, dest_dir: Path | None = None) -> None:
        with self._lock:
            if self._running:
                raise RuntimeError("Cannot reset while downloads are running.")
            if dest_dir:
                self._dest_dir = dest_dir
            self._items_state = {}
            self._logs = []
            sf = self._state_file(self._dest_dir)
            if sf.exists():
                sf.unlink()
        self._emit("state_reset", {"items": {}})

    def cancel(self) -> None:
        self._cancel_event.set()
        with self._lock:
            procs = list(self._active_procs)
        for p in procs:
            try:
                p.terminate()
            except Exception:
                pass
        self.log("warn", "Cancellation requested by user.")

    def _update_item(self, item_id: str, **fields: Any) -> None:
        with self._lock:
            cur = self._items_state.get(item_id, {})
            cur.update(fields)
            self._items_state[item_id] = cur
            snapshot = dict(cur)
        self._emit("item_update", {"id": item_id, **snapshot})

    def _run_subprocess(
        self,
        cmd: list[str],
        item_id: str,
        cwd: Path | None = None,
        env: dict[str, str] | None = None,
    ) -> None:
        self.log("info", f"$ {' '.join(cmd)}", item_id)
        proc = subprocess.Popen(
            cmd,
            cwd=str(cwd) if cwd else None,
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
        )
        with self._lock:
            self._active_procs.add(proc)
        try:
            assert proc.stdout is not None
            for line in proc.stdout:
                if self._cancel_event.is_set():
                    proc.terminate()
                    raise InterruptedError("Cancelled by user")
                clean = line.strip()
                if clean:
                    self._update_item(item_id, message=clean[:140])
                    self.log("debug", clean[:240], item_id)
            rc = proc.wait()
            if rc != 0:
                raise RuntimeError(f"Command exited with code {rc}")
        finally:
            with self._lock:
                self._active_procs.discard(proc)

    def _ensure_venv(self, dest_dir: Path, item_id: str) -> Path:
        venv_dir = dest_dir / "venv"
        py_bin = venv_dir / ("Scripts/python.exe" if platform.system().lower().startswith("win") else "bin/python")
        with self._venv_lock:
            if not py_bin.exists():
                self.log("info", f"Creating managed Python venv at {venv_dir}", item_id)
                subprocess.check_call([sys.executable, "-m", "venv", str(venv_dir)])
        return py_bin

    def _resolve_gh_cached(self, repo: str, pattern: str) -> tuple[str, str, int]:
        key = (repo, pattern)
        with self._gh_cache_lock:
            if key in self._gh_cache:
                return self._gh_cache[key]
        res = resolve_github_release_asset(repo, pattern)
        with self._gh_cache_lock:
            self._gh_cache[key] = res
        return res

    def _download_wheels_cross_platform(
        self,
        packages: list[str],
        target_oses: list[str],
        target_arch: str,
        computes: list[str],
        item_id: str,
        dest_dir: Path,
        spec: dict[str, Any],
        is_compute_adaptive: bool,
        install_host_venv: bool = True,
    ) -> list[str]:
        """Downloads Python wheels for all selected (OS, compute) targets into dest/wheels/<os>_<compute>."""
        write_offline_wheel_scripts(dest_dir)
        downloaded_targets: list[str] = []
        comp_targets = computes if is_compute_adaptive else [computes[0]]

        # Separate git+https dependencies (need source/venv rather than binary-only wheel lookup)
        pypi_pkgs = [p for p in packages if not p.startswith("git+")]
        git_pkgs = [p for p in packages if p.startswith("git+")]

        for t_os in target_oses:
            plat = pip_platform_tag(t_os, target_arch)
            for comp in comp_targets:
                if self._cancel_event.is_set():
                    raise InterruptedError("Cancelled by user")
                pkgs = spec.get(f"packages_{comp}") or pypi_pkgs
                index_url = spec.get(f"index_url_{comp}")
                wheel_dir = dest_dir / "wheels" / f"{t_os}_{comp}"
                wheel_dir.mkdir(parents=True, exist_ok=True)
                self._update_item(
                    item_id,
                    message=f"Downloading Python wheels ({t_os}/{comp})...",
                )
                if pkgs:
                    cmd = [
                        sys.executable,
                        "-m",
                        "pip",
                        "download",
                        "--no-cache-dir",
                        "--timeout",
                        "120",
                        "--retries",
                        "5",
                        "--dest",
                        str(wheel_dir),
                        "--platform",
                        plat,
                        "--python-version",
                        "3.12",
                        "--only-binary=:all:",
                    ]
                    if index_url:
                        cmd.extend(["--extra-index-url", index_url])
                    cmd.extend(pkgs)
                    try:
                        self._run_subprocess(cmd, item_id)
                    except RuntimeError:
                        # Fallback per-package for sdist-only packages
                        self.log("warn", f"Batch binary wheel lookup failed for {t_os}/{comp}; retrying per-package...", item_id)
                        for pkg in pkgs:
                            single_cmd = [
                                sys.executable, "-m", "pip", "download",
                                "--no-cache-dir", "--timeout", "120", "--retries", "5",
                                "--dest", str(wheel_dir),
                                "--platform", plat, "--python-version", "3.12", "--only-binary=:all:",
                            ]
                            if index_url:
                                single_cmd.extend(["--extra-index-url", index_url])
                            single_cmd.append(pkg)
                            try:
                                self._run_subprocess(single_cmd, item_id)
                            except RuntimeError:
                                sdist_cmd = [
                                    sys.executable, "-m", "pip", "download",
                                    "--no-cache-dir", "--timeout", "120", "--retries", "5",
                                    "--dest", str(wheel_dir), "--no-deps", pkg,
                                ]
                                self._run_subprocess(sdist_cmd, item_id)
                downloaded_targets.append(f"{t_os}_{comp}")

        host_os = normalize_os("auto")
        if install_host_venv and host_os in target_oses:
            host_comp = "gpu" if ("gpu" in comp_targets and detect_gpu()["has_nvidia"]) else comp_targets[0]
            pkgs_install = spec.get(f"packages_{host_comp}") or packages
            index_url = spec.get(f"index_url_{host_comp}")
            py_bin = self._ensure_venv(dest_dir, item_id)
            with self._venv_lock:
                cmd = [
                    str(py_bin), "-m", "pip", "install", "--no-cache-dir",
                    "--timeout", "120", "--retries", "5", "--upgrade",
                ]
                if index_url:
                    cmd.extend(["--extra-index-url", index_url])
                cmd.extend(pkgs_install + git_pkgs)
                self._run_subprocess(cmd, item_id)
                post_cmd = spec.get("post_venv_cmd")
                if post_cmd:
                    self._run_subprocess([str(py_bin), "-m", *post_cmd], item_id)

        return downloaded_targets

    def _execute_item(
        self,
        item: dict[str, Any],
        target_os: str,
        target_arch: str,
        compute: str,
        dest_dir: Path,
        dry_run: bool,
        install_venv: bool,
    ) -> None:
        item_id = item["id"]
        if not item["os_compatible"]:
            self._update_item(
                item_id,
                status="skipped",
                pct=100,
                bytes_done=0,
                bytes_total=0,
                speed_mb_s=0.0,
                message=item["skip_reason"] or "Incompatible OS",
            )
            self.log("warn", f"Skipped {item['name']}: {item['skip_reason']}", item_id)
            return

        target_oses: list[str] = item["compatible_oses"]
        computes: list[str] = item["resolved_computes"]
        expected_bytes = int(item["resolved_size_mb"] * 1024 * 1024)
        self._update_item(
            item_id,
            status="downloading",
            pct=0,
            bytes_done=0,
            bytes_total=expected_bytes,
            speed_mb_s=0.0,
            message=f"[{item['channel']}] Starting ({'+'.join(target_oses)} / {'+'.join(computes)})...",
        )

        if dry_run:
            time.sleep(0.15)
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                speed_mb_s=0.0,
                message=f"[DRY-RUN] {item['channel']} | {'+'.join(target_oses)} / {'+'.join(computes)} ({item['resolved_size_mb']} MB)",
            )
            self.log("info", f"[DRY-RUN] {item['name']} ({item['channel']}) -> {'+'.join(target_oses)}/{'+'.join(computes)}", item_id)
            return

        method = item["method"]
        spec = item.get("spec", {})

        if method == "github_release":
            repo = spec["repo"]
            patterns = spec.get("asset_patterns", {})
            out_paths: list[str] = []
            total_os = len(target_oses)
            for idx, t_os in enumerate(target_oses):
                os_arch_key = f"{t_os}_{target_arch}"
                pattern = patterns.get(os_arch_key) or patterns.get(f"{t_os}_amd64")
                if not pattern:
                    raise RuntimeError(f"No asset pattern for {os_arch_key} in {repo}")
                self._update_item(item_id, message=f"[{t_os}] Resolving {repo} release...")
                dl_url, asset_name, asset_size = self._resolve_gh_cached(repo, pattern)
                dl_target = dest_dir / "downloads" / item_id / t_os / asset_name
                self.log("info", f"Downloading {asset_name} ({t_os}/{target_arch}) from {repo}", item_id)

                def on_prog(done: int, total: int, speed: float, base_idx: int = idx) -> None:
                    t = total or asset_size or 1
                    frac = (base_idx + min(0.99, done / t)) / total_os
                    self._update_item(
                        item_id,
                        status="downloading",
                        pct=min(99, int(frac * 100)),
                        bytes_done=done,
                        bytes_total=t,
                        speed_mb_s=round(speed, 2),
                        message=f"[{t_os}] {done / (1024*1024):.1f}/{t / (1024*1024):.1f} MB ({speed:.2f} MB/s)",
                    )

                stream_download_file(dl_url, dl_target, self._cancel_event, on_prog, asset_size)
                out_path = dl_target
                if spec.get("extract"):
                    self._update_item(item_id, status="extracting", message=f"[{t_os}] Extracting {asset_name}...")
                    extract_dir = dest_dir / "bin" / item_id / f"{t_os}_{target_arch}"
                    extract_archive(dl_target, extract_dir)
                    out_path = extract_dir
                out_paths.append(str(out_path))

            if spec.get("companion_pip"):
                self._download_wheels_cross_platform(
                    spec["companion_pip"], target_oses, target_arch, computes, item_id, dest_dir, spec, False, install_venv
                )

            self._update_item(
                item_id,
                status="done",
                pct=100,
                speed_mb_s=0.0,
                artifact_path="; ".join(out_paths),
                message=f"Ready ({'+'.join(target_oses)})",
            )
            self.log("info", f"Completed {item['name']} for {'+'.join(target_oses)}", item_id)

        elif method == "git_clone":
            if not shutil.which("git"):
                raise RuntimeError("git is not installed on PATH.")
            repo_url = spec["repo_url"]
            repo_dir = dest_dir / "repos" / item_id
            if (repo_dir / ".git").exists():
                self._run_subprocess(["git", "-C", str(repo_dir), "pull", "--ff-only"], item_id)
            else:
                repo_dir.parent.mkdir(parents=True, exist_ok=True)
                self._run_subprocess(["git", "clone", "--depth", "1", repo_url, str(repo_dir)], item_id)

            # Download companion Python libraries (for Windows & Linux, CPU & GPU)
            companion = list(spec.get("companion_pip") or [])
            req_txt = repo_dir / "requirements.txt"
            if not companion and req_txt.exists():
                for line in req_txt.read_text(encoding="utf-8", errors="ignore").splitlines():
                    clean = line.split("#", 1)[0].strip()
                    if clean and not clean.startswith(("-", "git+")):
                        companion.append(clean)
            wheel_info = ""
            if companion:
                targets = self._download_wheels_cross_platform(
                    companion, target_oses, target_arch, computes, item_id, dest_dir, spec, False, install_venv
                )
                wheel_info = f" + wheels ({', '.join(targets)})"

            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=str(repo_dir),
                message=f"Cloned {repo_dir.name}{wheel_info}",
            )

        elif method == "http_file":
            per_os_urls = "windows_url" in spec or "linux_url" in spec
            url_targets = [(t_os, spec.get(f"{t_os}_url") or spec.get("url")) for t_os in target_oses] if per_os_urls else [("shared", spec.get("url"))]
            out_paths = []
            for idx, (label, url) in enumerate(url_targets):
                if not url:
                    raise RuntimeError(f"No download URL for {label}")
                filename = spec.get("filename") or url.rstrip("/").split("/")[-1]
                subdir = spec.get("subdir", "downloads")
                if per_os_urls:
                    dl_target = dest_dir / "downloads" / item_id / label / filename if spec.get("extract") else dest_dir / subdir / label / filename
                    extract_dir = dest_dir / subdir / f"{label}_{target_arch}"
                else:
                    dl_target = dest_dir / "downloads" / item_id / filename if spec.get("extract") else dest_dir / subdir / filename
                    extract_dir = dest_dir / subdir

                def on_prog_http(done: int, total: int, speed: float, base_idx: int = idx, n: int = len(url_targets), lbl: str = label) -> None:
                    t = total or expected_bytes or 1
                    frac = (base_idx + min(0.99, done / t)) / n
                    self._update_item(
                        item_id,
                        status="downloading",
                        pct=min(99, int(frac * 100)),
                        bytes_done=done,
                        bytes_total=t,
                        speed_mb_s=round(speed, 2),
                        message=f"[{lbl}] {done / (1024*1024):.1f}/{t / (1024*1024):.1f} MB ({speed:.2f} MB/s)",
                    )

                self.log("info", f"Downloading {url}", item_id)
                stream_download_file(url, dl_target, self._cancel_event, on_prog_http, expected_bytes)
                out_path = dl_target
                if spec.get("extract"):
                    self._update_item(item_id, status="extracting", message=f"[{label}] Extracting {filename}...")
                    extract_archive(dl_target, extract_dir)
                    out_path = extract_dir
                out_paths.append(str(out_path))

            self._update_item(
                item_id,
                status="done",
                pct=100,
                speed_mb_s=0.0,
                artifact_path="; ".join(out_paths),
                message=f"Saved ({'+'.join(lbl for lbl, _ in url_targets)})",
            )

        elif method == "docker_pull":
            if not shutil.which("docker"):
                raise RuntimeError("docker CLI not found on PATH.")
            image = spec["image"]
            self._run_subprocess(["docker", "pull", image], item_id)
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=image,
                message=f"Pulled {image}",
            )

        elif method == "pip_install":
            pkgs = spec.get("packages") or spec.get("packages_cpu") or []
            targets = self._download_wheels_cross_platform(
                pkgs,
                target_oses,
                target_arch,
                computes,
                item_id,
                dest_dir,
                spec,
                item.get("compute") == "cpu_gpu",
                install_venv,
            )
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=str(dest_dir / "wheels"),
                message=f"Wheels ready: {', '.join(targets)}",
            )

        elif method == "npm_install":
            if not shutil.which("npm"):
                raise RuntimeError("npm is not installed on PATH.")
            project_dir = (APP_DIR / spec["project_rel"]).resolve()
            if not project_dir.exists():
                raise RuntimeError(f"Frontend directory not found: {project_dir}")
            npm_cmd = "npm.cmd" if platform.system().lower().startswith("win") else "npm"
            self._run_subprocess([npm_cmd, "install", "--no-audit", "--no-fund"], item_id, cwd=project_dir)
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=str(project_dir / "node_modules"),
                message="npm dependencies installed",
            )

        elif method == "ollama_pull":
            if not shutil.which("ollama"):
                raise RuntimeError("ollama CLI not found on PATH. Install Ollama or pull docker_ollama first.")
            model = spec["model"]
            self._run_subprocess(["ollama", "pull", model], item_id)
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=model,
                message=f"Pulled Ollama model {model}",
            )

        elif method == "hf_snapshot":
            py_bin = self._ensure_venv(dest_dir, item_id)
            repo_id = spec["repo_id"]
            model_dir = dest_dir / "models" / repo_id.replace("/", "__")
            with self._venv_lock:
                self._run_subprocess([str(py_bin), "-m", "pip", "install", "-q", "huggingface_hub"], item_id)
            dl_script = (
                "from huggingface_hub import snapshot_download; "
                f"snapshot_download(repo_id={repo_id!r}, local_dir={str(model_dir)!r})"
            )
            self._run_subprocess([str(py_bin), "-c", dl_script], item_id)
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                artifact_path=str(model_dir),
                message=f"Downloaded HF model {repo_id}",
            )

        elif method == "system_pkg":
            host_os = normalize_os("auto")
            if host_os not in target_oses:
                self._update_item(item_id, status="skipped", pct=100, message=f"Native installer requires {host_os}")
                return
            if host_os == "windows" and shutil.which("winget") and spec.get("windows_winget"):
                pkg = spec["windows_winget"]
                self._run_subprocess(
                    ["winget", "install", "--id", pkg, "-e", "--accept-package-agreements", "--accept-source-agreements"],
                    item_id,
                )
            elif host_os == "linux" and shutil.which("apt-get") and spec.get("linux_apt"):
                pkgs = spec["linux_apt"].split()
                prefix = ["sudo", "-n"] if os.geteuid() != 0 and shutil.which("sudo") else []
                self._run_subprocess([*prefix, "apt-get", "install", "-y", *pkgs], item_id)
            else:
                raise RuntimeError("Automated system package manager unavailable; install manually.")
            self._update_item(
                item_id,
                status="done",
                pct=100,
                bytes_done=expected_bytes,
                bytes_total=expected_bytes,
                message="Installed system package",
            )
        else:
            raise RuntimeError(f"Unsupported install method: {method}")

    def start(
        self,
        selected_ids: list[str],
        target_os: str,
        target_arch: str,
        compute: str,
        dest_dir: Path,
        dry_run: bool = False,
        install_venv: bool = True,
        channel_workers: dict[str, int] | None = None,
    ) -> dict[str, Any]:
        with self._lock:
            if self._running:
                raise RuntimeError("A download job is already running.")
            self._running = True
            self._cancel_event.clear()
            self._dest_dir = dest_dir
            workers_cfg = {**CHANNEL_WORKERS, **(channel_workers or {})}
            self._last_config = {
                "selected_ids": selected_ids,
                "target_os": target_os,
                "target_arch": target_arch,
                "compute": compute,
                "dest_dir": str(dest_dir),
                "dry_run": dry_run,
                "install_venv": install_venv,
                "channel_workers": workers_cfg,
            }

        plan = resolve_plan(self.catalog, selected_ids, target_os, target_arch, compute)
        for item in plan["items"]:
            self._update_item(
                item["id"],
                channel=item["channel"],
                status="queued",
                pct=0,
                bytes_done=0,
                bytes_total=int(item["resolved_size_mb"] * 1024 * 1024),
                speed_mb_s=0.0,
                message=f"Queued [{item['channel']}]",
            )

        self.log(
            "info",
            f"Starting multi-source job: {plan['active_count']} items ({plan['total_download_mb']} MB) "
            f"[OS={target_os}/{target_arch}, Compute={compute}, DryRun={dry_run}] -> {dest_dir}",
        )

        def runner() -> None:
            pools: dict[str, ThreadPoolExecutor] = {}
            try:
                by_channel: dict[str, list[dict[str, Any]]] = {}
                for item in plan["items"]:
                    by_channel.setdefault(item["channel"], []).append(item)

                all_futures = {}
                for ch, ch_items in by_channel.items():
                    max_w = max(1, min(6, int(workers_cfg.get(ch, 2))))
                    pool = ThreadPoolExecutor(max_workers=max_w, thread_name_prefix=f"athar-{ch}")
                    pools[ch] = pool
                    self.log("info", f"Channel '{ch}' launched {max_w} parallel worker(s) for {len(ch_items)} item(s).")
                    for item in ch_items:
                        fut = pool.submit(
                            self._execute_item,
                            item,
                            target_os,
                            target_arch,
                            compute,
                            dest_dir,
                            dry_run,
                            install_venv,
                        )
                        all_futures[fut] = item

                for fut in as_completed(all_futures):
                    item = all_futures[fut]
                    item_id = item["id"]
                    try:
                        fut.result()
                    except InterruptedError:
                        self._update_item(item_id, status="cancelled", speed_mb_s=0.0, message="Cancelled")
                    except Exception as exc:
                        self._update_item(item_id, status="failed", speed_mb_s=0.0, message=str(exc)[:180])
                        self.log("error", f"Failed {item['name']}: {exc}", item_id)
                    finally:
                        self._save_state_to_disk()
            finally:
                for pool in pools.values():
                    pool.shutdown(wait=False)
                with self._lock:
                    self._running = False
                self._save_state_to_disk()
                self._emit("job_done", self.get_snapshot())
                self.log("info", "All source channels finished.")

        self._job_thread = threading.Thread(target=runner, daemon=True)
        self._job_thread.start()
        return plan

    def wait(self) -> None:
        if self._job_thread:
            self._job_thread.join()


def make_handler(manager: DownloadManager):
    class Handler(BaseHTTPRequestHandler):
        protocol_version = "HTTP/1.1"

        def log_message(self, format: str, *args: Any) -> None:  # noqa: A002
            return

        def _send_json(self, data: Any, status: int = 200) -> None:
            body = json.dumps(data).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def _read_json_body(self) -> dict[str, Any]:
            length = int(self.headers.get("Content-Length") or 0)
            raw = self.rfile.read(length) if length > 0 else b"{}"
            return json.loads(raw.decode("utf-8"))

        def do_GET(self) -> None:
            if self.path in ("/", "/index.html"):
                body = UI_PATH.read_bytes()
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
                return

            if self.path == "/api/bootstrap":
                snap = manager.get_snapshot()
                env = detect_environment(Path(snap["dest_dir"]))
                self._send_json({"env": env, "catalog": manager.catalog, "state": snap})
                return

            if self.path == "/api/events":
                self.send_response(HTTPStatus.OK)
                self.send_header("Content-Type", "text/event-stream")
                self.send_header("Cache-Control", "no-cache")
                self.send_header("Connection", "keep-alive")
                self.end_headers()
                q = manager.subscribe()
                try:
                    init_payload = json.dumps(manager.get_snapshot())
                    self.wfile.write(f"event: snapshot\ndata: {init_payload}\n\n".encode("utf-8"))
                    self.wfile.flush()
                    while True:
                        try:
                            ev, payload = q.get(timeout=10)
                            msg = f"event: {ev}\ndata: {json.dumps(payload)}\n\n".encode("utf-8")
                            self.wfile.write(msg)
                            self.wfile.flush()
                        except queue.Empty:
                            self.wfile.write(b": keepalive\n\n")
                            self.wfile.flush()
                except (BrokenPipeError, ConnectionResetError, OSError):
                    pass
                finally:
                    manager.unsubscribe(q)
                return

            self._send_json({"error": "Not found"}, 404)

        def do_POST(self) -> None:
            try:
                body = self._read_json_body()
                if self.path == "/api/estimate":
                    target_os = normalize_os(body.get("os"))
                    target_arch = normalize_arch(body.get("arch"))
                    compute = normalize_compute(body.get("compute"))
                    mbps = float(body.get("mbps") or 50.0)
                    plan = resolve_plan(manager.catalog, body.get("selected_ids", []), target_os, target_arch, compute, mbps)
                    self._send_json(plan)
                    return

                if self.path == "/api/start":
                    target_os = normalize_os(body.get("os"))
                    target_arch = normalize_arch(body.get("arch"))
                    compute = normalize_compute(body.get("compute"))
                    dest_dir = Path(body.get("dest_dir") or DEFAULT_DEST).expanduser().resolve()
                    plan = manager.start(
                        selected_ids=body.get("selected_ids", []),
                        target_os=target_os,
                        target_arch=target_arch,
                        compute=compute,
                        dest_dir=dest_dir,
                        dry_run=bool(body.get("dry_run", False)),
                        install_venv=bool(body.get("install_venv", True)),
                        channel_workers=body.get("channel_workers"),
                    )
                    self._send_json({"ok": True, "plan": plan})
                    return

                if self.path == "/api/cancel":
                    manager.cancel()
                    self._send_json({"ok": True})
                    return

                if self.path == "/api/retry":
                    snap = manager.get_snapshot()
                    cfg = snap.get("last_config") or {}
                    failed_ids = [
                        k for k, v in snap.get("items", {}).items() if v.get("status") in ("failed", "cancelled")
                    ]
                    if not failed_ids:
                        self._send_json({"ok": False, "error": "No failed items to retry."}, 400)
                        return
                    plan = manager.start(
                        selected_ids=failed_ids,
                        target_os=cfg.get("target_os", normalize_os("auto")),
                        target_arch=cfg.get("target_arch", normalize_arch("auto")),
                        compute=cfg.get("compute", "cpu"),
                        dest_dir=Path(cfg.get("dest_dir", snap["dest_dir"])),
                        dry_run=bool(cfg.get("dry_run", False)),
                        install_venv=bool(cfg.get("install_venv", True)),
                        channel_workers=cfg.get("channel_workers"),
                    )
                    self._send_json({"ok": True, "plan": plan})
                    return

                if self.path == "/api/reset":
                    dest_raw = body.get("dest_dir")
                    manager.reset_state(Path(dest_raw).expanduser().resolve() if dest_raw else None)
                    self._send_json({"ok": True})
                    return

                self._send_json({"error": "Not found"}, 404)
            except Exception as exc:
                self._send_json({"ok": False, "error": str(exc)}, 400)

    return Handler


def run_cli(args: argparse.Namespace, catalog: dict[str, Any]) -> int:
    target_os = normalize_os(args.os)
    target_arch = normalize_arch(args.arch)
    compute = normalize_compute(args.compute)
    dest_dir = Path(args.dest).expanduser().resolve()

    if args.ids:
        selected_ids = [s.strip() for s in args.ids.split(",") if s.strip()]
    else:
        profiles = set(p.strip() for p in args.profile.split(",") if p.strip())
        selected_ids = [t["id"] for t in catalog["tools"] if profiles & set(t.get("profiles", []))]

    plan = resolve_plan(catalog, selected_ids, target_os, target_arch, compute, args.mbps)
    print("=== Athar DZ Tools Installer (CLI) ===")
    print(f"Target: OS={target_os}/{target_arch} | Compute={compute.upper()} | Dest={dest_dir}")
    print(f"Channels: {plan['channel_counts']}")
    print(f"Selected: {plan['active_count']} active ({plan['skipped_os_count']} skipped for OS)")
    print(f"Estimated Download: {plan['total_download_mb']} MB | Disk: {plan['total_disk_mb']} MB | ETA @ {args.mbps} Mbps: {plan['eta_seconds']}s")
    if args.estimate_only:
        return 0

    manager = DownloadManager(catalog)
    q = manager.subscribe()
    manager.start(
        selected_ids=selected_ids,
        target_os=target_os,
        target_arch=target_arch,
        compute=compute,
        dest_dir=dest_dir,
        dry_run=args.dry_run,
        install_venv=not args.wheels_only,
    )

    while True:
        try:
            ev, payload = q.get(timeout=0.5)
            if ev == "item_update":
                st = payload.get("status")
                if st in ("done", "failed", "skipped", "cancelled"):
                    print(f"[{st.upper():9s}] {payload['id']:28s} | {payload.get('message', '')}")
            elif ev == "job_done":
                break
        except queue.Empty:
            if not manager.get_snapshot()["running"]:
                break

    manager.wait()
    snap = manager.get_snapshot()
    failed = [k for k, v in snap["items"].items() if v.get("status") == "failed"]
    done = [k for k, v in snap["items"].items() if v.get("status") == "done"]
    skipped = [k for k, v in snap["items"].items() if v.get("status") == "skipped"]
    print(f"\nSummary: {len(done)} done, {len(skipped)} skipped, {len(failed)} failed.")
    return 1 if failed else 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Athar DZ Tools Downloader & Progress Monitor")
    parser.add_argument("--cli", action="store_true", help="Run headlessly in CLI mode")
    parser.add_argument("--profile", default="smoke_test", help="Comma-separated profile IDs")
    parser.add_argument("--ids", default="", help="Comma-separated specific tool IDs")
    parser.add_argument("--os", default="both", choices=["auto", "windows", "linux", "both"])
    parser.add_argument("--arch", default="auto", choices=["auto", "amd64", "arm64"])
    parser.add_argument("--compute", default="both", choices=["auto", "gpu", "cpu", "both"])
    parser.add_argument("--dest", default=str(DEFAULT_DEST), help="Target installation directory")
    parser.add_argument("--mbps", type=float, default=50.0, help="Connection speed in Mbps for ETA calculation")
    parser.add_argument("--dry-run", action="store_true", help="Simulate downloads without writing tools")
    parser.add_argument("--wheels-only", action="store_true", help="Download wheels only without installing into local venv")
    parser.add_argument("--estimate-only", action="store_true", help="Print size/time estimate and exit")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args()

    catalog = load_catalog()
    if args.cli:
        return run_cli(args, catalog)

    manager = DownloadManager(catalog)
    server = ThreadingHTTPServer((args.host, args.port), make_handler(manager))
    url = f"http://{args.host}:{args.port}/"
    print(f"Athar DZ Tools Installer running at {url} (Ctrl+C to stop)")
    if not args.no_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        manager.cancel()
        server.shutdown()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
