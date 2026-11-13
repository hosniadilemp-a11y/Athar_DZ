import json
import shutil
import subprocess
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

audit_results = {
    "binaries": {},
    "repos": {},
    "wheels": {"win": 0, "lin": 0, "packages_found": []},
    "docker": {},
    "models": {},
    "missing_to_download": []
}

# 1. Check Binaries
bin_checks = [
    ("osint_subfinder", BASE / "bin/osint_subfinder/windows_amd64/subfinder.exe"),
    ("osint_dnsx", BASE / "bin/osint_dnsx/windows_amd64/dnsx.exe"),
    ("osint_httpx", BASE / "bin/osint_httpx/windows_amd64/httpx.exe"),
    ("osint_katana", BASE / "bin/osint_katana/windows_amd64/katana.exe"),
    ("osint_nuclei", BASE / "bin/osint_nuclei/windows_amd64/nuclei.exe"),
    ("osint_trufflehog", BASE / "bin/osint_trufflehog/windows_amd64/trufflehog.exe"),
    ("osint_phoneinfoga", BASE / "bin/osint_phoneinfoga/windows_amd64/phoneinfoga.exe"),
    ("osint_cyberchef", BASE / "bin/osint_cyberchef/index.html"),
    ("osint_gowitness", BASE / "downloads/osint_gowitness/windows/gowitness-3.2.2-windows-amd64.exe"),
    ("osint_amass", BASE / "bin/osint_amass/windows_amd64/amass.exe"),
    ("forensic_adb", BASE / "bin/platform-tools/windows_amd64/platform-tools/adb.exe"),
    ("forensic_scrcpy", BASE / "bin/forensic_scrcpy/windows_amd64/scrcpy-win64-v5.0.1/scrcpy.exe"),
    ("forensic_jadx", BASE / "bin/forensic_jadx/windows_amd64/bin/jadx.bat"),
    ("forensic_exiftool", BASE / "bin/exiftool/windows_amd64/exiftool.exe"),
    ("forensic_ffmpeg", BASE / "bin/ffmpeg/windows_amd64/ffmpeg.exe"),
    ("forensic_ghidra", BASE / "bin/ghidra/ghidraRun.bat"),
    ("sna_gephi_toolkit", BASE / "bin/gephi/gephi-toolkit.jar")
]

for name, p in bin_checks:
    exists = p.exists()
    audit_results["binaries"][name] = {"exists": exists, "path": str(p)}
    if not exists:
        audit_results["missing_to_download"].append(f"binary:{name}")

# 2. Check Repos
repo_checks = [
    "osint_blackbird_repo", "osint_nuclei_templates", "osint_sherlock_repo",
    "osint_maigret_repo", "osint_theharvester_repo", "osint_holehe_repo",
    "osint_ghunt_repo", "osint_toutatis_repo", "osint_ignorant_repo",
    "osint_socialscan_repo", "osint_auto_archiver_repo", "osint_waymore_repo",
    "forensic_sherloq_repo", "forensic_aleapp_repo", "forensic_ileapp_repo",
    "osint_shadowfinder_repo"
]

for r in repo_checks:
    p = BASE / "repos" / r
    exists = (p / ".git").exists() or p.exists()
    audit_results["repos"][r] = {"exists": exists, "path": str(p)}
    if not exists:
        audit_results["missing_to_download"].append(f"repo:{r}")

# 3. Check Wheels
win_wheels = list((BASE / "wheels/windows_cpu").glob("*.whl"))
lin_wheels = list((BASE / "wheels/linux_cpu").glob("*.whl"))
audit_results["wheels"]["win"] = len(win_wheels)
audit_results["wheels"]["lin"] = len(lin_wheels)

critical_pkgs = [
    "networkx", "igraph", "leidenalg", "cdlib", "scikit-learn", "scipy",
    "pandas", "polars", "pygraphistry", "celery", "volatility3", "frida",
    "yara-python", "flare-capa", "imagehash", "ctranslate2", "torch", "transformers"
]
found_names = [w.name.lower() for w in win_wheels]
missing_wheels = []
for cp in critical_pkgs:
    if not any(cp.lower() in fn for fn in found_names):
        missing_wheels.append(cp)
        audit_results["missing_to_download"].append(f"wheel:{cp}")

# 4. Check Docker Images
if shutil.which("docker"):
    try:
        res = subprocess.run(["docker", "images", "--format", "{{.Repository}}:{{.Tag}}"], capture_output=True, text=True)
        installed_images = set(res.stdout.splitlines())
        target_images = [
            "neo4j:5.20.0", "timescale/timescaledb-ha:pg16", "redis:7.2.5-alpine",
            "postgres:16-alpine", "mongo:7.0", "qdrant/qdrant:v1.9.3",
            "python:3.12-slim", "node:20-alpine", "temporalio/auto-setup:1.24.2",
            "archivebox/archivebox:latest", "opensanctions/yente:latest", "ollama/ollama:latest"
        ]
        for img in target_images:
            has_img = img in installed_images
            audit_results["docker"][img] = has_img
            if not has_img:
                audit_results["missing_to_download"].append(f"docker:{img}")
    except Exception as e:
        audit_results["docker"]["error"] = str(e)

print(json.dumps(audit_results, indent=2))
Path("Athar_DZ/apps/tools-installer/audit_summary.json").write_text(json.dumps(audit_results, indent=2))
