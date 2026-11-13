import os
import shutil
import subprocess
import sys
import time
import urllib.request
import zipfile
import tarfile
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
STATUS_FILE = BASE / "audit_download_status.json"

WHEELS_WIN = BASE / "wheels/windows_cpu"
WHEELS_LIN = BASE / "wheels/linux_cpu"
WHEELS_WIN.mkdir(parents=True, exist_ok=True)
WHEELS_LIN.mkdir(parents=True, exist_ok=True)

MISSING_REPOS = [
    ("forensic_aleapp_repo", "https://github.com/abrignoni/ALEAPP.git"),
    ("forensic_ileapp_repo", "https://github.com/abrignoni/iLEAPP.git"),
    ("osint_shadowfinder_repo", "https://github.com/bellingcat/ShadowFinder.git")
]

MISSING_BINS = [
    {
        "id": "osint_amass",
        "win_url": "https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_windows_amd64.tar.gz",
        "lin_url": "https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_linux_amd64.tar.gz",
        "extract": True,
        "subdir": "bin/osint_amass"
    },
    {
        "id": "sna_gephi_toolkit",
        "shared_url": "https://github.com/gephi/gephi-toolkit/releases/download/v0.10.1/gephi-toolkit-0.10.1-all.jar",
        "dest_path": BASE / "bin/gephi/gephi-toolkit.jar"
    },
    {
        "id": "forensic_ffmpeg",
        "win_url": "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip",
        "lin_url": "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz",
        "extract": True,
        "subdir": "bin/ffmpeg"
    }
]

MISSING_WHEELS = [
    "networkx",
    "igraph",
    "leidenalg",
    "cdlib",
    "scikit-learn",
    "scipy",
    "pandas",
    "polars",
    "pygraphistry",
    "celery",
    "temporalio",
    "volatility3",
    "frida",
    "yara-python",
    "flare-capa",
    "imagehash",
    "ctranslate2",
    "transformers",
    "accelerate",
    "sentencepiece",
    "torch"
]

DOCKER_TARGETS = [
    "python:3.12-slim",
    "node:20-alpine",
    "temporalio/auto-setup:1.24.2",
    "archivebox/archivebox:latest",
    "opensanctions/yente:latest",
    "ollama/ollama:latest"
]

def download_file_simple(url, dest_path):
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size > 1000:
        print(f"  [EXISTS] {dest_path.name}")
        return True
    print(f"  [DOWNLOADING] {url} -> {dest_path.name}...")
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=60) as resp, open(dest_path, "wb") as f:
            shutil.copyfileobj(resp, f)
        print(f"  [SAVED] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.1f} MB)")
        return True
    except Exception as e:
        print(f"  [FAILED] {e}")
        return False

def main():
    print("=== Phase 1: Cloning Missing Repositories ===")
    for r_id, r_url in MISSING_REPOS:
        target = BASE / "repos" / r_id
        if (target / ".git").exists() or target.exists():
            print(f"  [EXISTS] {r_id}")
        else:
            print(f"  [CLONING] {r_url} -> {r_id}...")
            subprocess.run(["git", "clone", "--depth", "1", r_url, str(target)], check=False)

    print("\n=== Phase 2: Downloading Missing Binaries ===")
    for b in MISSING_BINS:
        print(f"Processing {b['id']}...")
        if "dest_path" in b:
            download_file_simple(b["shared_url"], b["dest_path"])
        else:
            # Windows
            if "win_url" in b:
                dl_win = BASE / "downloads" / b["id"] / "windows" / b["win_url"].split("/")[-1]
                ext_win = BASE / b["subdir"] / "windows_amd64"
                if download_file_simple(b["win_url"], dl_win) and b.get("extract"):
                    ext_win.mkdir(parents=True, exist_ok=True)
                    try:
                        if str(dl_win).endswith((".zip")):
                            with zipfile.ZipFile(dl_win, 'r') as z:
                                z.extractall(ext_win)
                        elif str(dl_win).endswith((".tar.gz", ".tgz")):
                            with tarfile.open(dl_win, 'r:*') as t:
                                t.extractall(ext_win)
                        print(f"  [EXTRACTED] {b['id']} (windows)")
                    except Exception as e:
                        print(f"  [EXTRACT ERR] {e}")

            # Linux
            if "lin_url" in b:
                dl_lin = BASE / "downloads" / b["id"] / "linux" / b["lin_url"].split("/")[-1]
                ext_lin = BASE / b["subdir"] / "linux_amd64"
                if download_file_simple(b["lin_url"], dl_lin) and b.get("extract"):
                    ext_lin.mkdir(parents=True, exist_ok=True)
                    try:
                        if str(dl_lin).endswith((".tar.gz", ".tgz", ".tar.xz")):
                            with tarfile.open(dl_lin, 'r:*') as t:
                                t.extractall(ext_lin)
                        elif str(dl_lin).endswith(".zip"):
                            with zipfile.ZipFile(dl_lin, 'r') as z:
                                z.extractall(ext_lin)
                        print(f"  [EXTRACTED] {b['id']} (linux)")
                    except Exception as e:
                        print(f"  [EXTRACT ERR] {e}")

    print("\n=== Phase 3: Downloading Missing Python Wheels ===")
    print("--- Windows (win_amd64 / Python 3.12) ---")
    for pkg in MISSING_WHEELS:
        print(f"  [WIN] {pkg}...")
        cmd_win = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir", "--dest", str(WHEELS_WIN),
            "--platform", "win_amd64", "--python-version", "3.12",
            "--only-binary=:all:", pkg
        ]
        res = subprocess.run(cmd_win, capture_output=True, text=True)
        if res.returncode != 0:
            fallback = [
                sys.executable, "-m", "pip", "download",
                "--no-cache-dir", "--dest", str(WHEELS_WIN),
                "--no-deps", pkg
            ]
            subprocess.run(fallback, capture_output=True)

    print("--- Linux (manylinux2014_x86_64 / Python 3.12) ---")
    for pkg in MISSING_WHEELS:
        print(f"  [LIN] {pkg}...")
        cmd_lin = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir", "--dest", str(WHEELS_LIN),
            "--platform", "manylinux2014_x86_64", "--python-version", "3.12",
            "--only-binary=:all:", pkg
        ]
        res = subprocess.run(cmd_lin, capture_output=True, text=True)
        if res.returncode != 0:
            fallback = [
                sys.executable, "-m", "pip", "download",
                "--no-cache-dir", "--dest", str(WHEELS_LIN),
                "--no-deps", pkg
            ]
            subprocess.run(fallback, capture_output=True)

    print("\n=== Phase 4: Pulling Missing Docker Images ===")
    if shutil.which("docker"):
        for img in DOCKER_TARGETS:
            print(f"  [DOCKER PULL] {img}...")
            subprocess.run(["docker", "pull", img], check=False)

    print("\n=== AUDIT DOWNLOAD PIPELINE COMPLETE ===")

if __name__ == "__main__":
    main()
