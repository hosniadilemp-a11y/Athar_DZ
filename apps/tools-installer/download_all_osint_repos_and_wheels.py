import json
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path

BASE_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
REPOS_DIR = BASE_DIR / "repos"
WHEELS_WIN = BASE_DIR / "wheels" / "windows_cpu"
WHEELS_LIN = BASE_DIR / "wheels" / "linux_cpu"
STATUS_FILE = BASE_DIR / "osint_download_status.json"

REPOS_DIR.mkdir(parents=True, exist_ok=True)
WHEELS_WIN.mkdir(parents=True, exist_ok=True)
WHEELS_LIN.mkdir(parents=True, exist_ok=True)

OSINT_REPOS = [
    {"id": "osint_sherlock_repo", "name": "Sherlock Project", "url": "https://github.com/sherlock-project/sherlock.git"},
    {"id": "osint_maigret_repo", "name": "Maigret OSINT", "url": "https://github.com/soxoj/maigret.git"},
    {"id": "osint_theharvester_repo", "name": "theHarvester", "url": "https://github.com/laramies/theHarvester.git"},
    {"id": "osint_holehe_repo", "name": "Holehe Email OSINT", "url": "https://github.com/megadose/holehe.git"},
    {"id": "osint_ghunt_repo", "name": "GHunt v2", "url": "https://github.com/mxrch/GHunt.git"},
    {"id": "osint_toutatis_repo", "name": "Toutatis Instagram", "url": "https://github.com/megadose/toutatis.git"},
    {"id": "osint_ignorant_repo", "name": "Ignorant Phone OSINT", "url": "https://github.com/megadose/ignorant.git"},
    {"id": "osint_socialscan_repo", "name": "SocialScan", "url": "https://github.com/iojw/socialscan.git"},
    {"id": "osint_auto_archiver_repo", "name": "Bellingcat Auto-Archiver", "url": "https://github.com/bellingcat/auto-archiver.git"},
    {"id": "osint_waymore_repo", "name": "Waymore Archive Hunter", "url": "https://github.com/xnl-h4ck3r/waymore.git"}
]

CORE_OSINT_PACKAGES = [
    "maigret",
    "sherlock-project",
    "holehe",
    "ignorant",
    "h8mail",
    "telethon",
    "instaloader",
    "toutatis",
    "yt-dlp",
    "phonenumbers",
    "schwifty",
    "followthemoney",
    "scrapy",
    "bbot",
    "ghunt",
    "auto-archiver",
    "playwright",
    "socialscan",
    "waymore",
    "shodan",
    "censys",
    "dnspython",
    "tldextract",
    "aiohttp",
    "beautifulsoup4",
    "selenium",
    "requests"
]

def save_status(status):
    temp = STATUS_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(status, indent=2), encoding="utf-8")
    temp.replace(STATUS_FILE)

def main():
    status = {"repos": {}, "wheels": {"win": 0, "lin": 0}, "errors": []}
    print("=== Step 1: Cloning OSINT Repositories ===")
    all_requirements = set(CORE_OSINT_PACKAGES)

    for r in OSINT_REPOS:
        target_dir = REPOS_DIR / r["id"]
        print(f"\nProcessing {r['name']} -> {target_dir.name}...")
        try:
            if (target_dir / ".git").exists():
                print(f"  [EXISTS] Pulling updates for {r['name']}...")
                subprocess.run(["git", "-C", str(target_dir), "pull", "--ff-only"], check=False, capture_output=True)
            else:
                print(f"  [CLONE] Cloning {r['url']}...")
                res = subprocess.run(["git", "clone", "--depth", "1", r["url"], str(target_dir)], capture_output=True, text=True)
                if res.returncode != 0:
                    print(f"  [ERROR] Git clone failed: {res.stderr}")
                    status["errors"].append({"repo": r["id"], "error": res.stderr[:200]})
            
            # Parse requirements.txt if present
            req_file = target_dir / "requirements.txt"
            if req_file.exists():
                for line in req_file.read_text(encoding="utf-8", errors="ignore").splitlines():
                    clean = line.split("#", 1)[0].strip()
                    if clean and not clean.startswith(("-", "git+", "http", "@")):
                        all_requirements.add(clean)

            status["repos"][r["id"]] = {"status": "cloned", "path": str(target_dir)}
            save_status(status)
        except Exception as e:
            print(f"  [EXCEPTION] {e}")
            status["errors"].append({"repo": r["id"], "error": str(e)})

    print(f"\n=== Step 2: Downloading Companion Python Wheels ({len(all_requirements)} packages) ===")
    sorted_pkgs = sorted(all_requirements)
    
    # Download for Windows
    print("\n--- Downloading for Windows (AMD64 / Python 3.12) ---")
    for pkg in sorted_pkgs:
        print(f"  [WIN] {pkg}...")
        cmd_win = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir", "--dest", str(WHEELS_WIN),
            "--platform", "win_amd64", "--python-version", "3.12",
            "--only-binary=:all:", pkg
        ]
        res = subprocess.run(cmd_win, capture_output=True, text=True)
        if res.returncode != 0:
            # Fallback to pure/sdist
            fallback = [
                sys.executable, "-m", "pip", "download",
                "--no-cache-dir", "--dest", str(WHEELS_WIN),
                "--no-deps", pkg
            ]
            subprocess.run(fallback, capture_output=True)

    # Download for Linux
    print("\n--- Downloading for Linux (manylinux2014_x86_64 / Python 3.12) ---")
    for pkg in sorted_pkgs:
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

    win_count = len(list(WHEELS_WIN.glob("*.whl")))
    lin_count = len(list(WHEELS_LIN.glob("*.whl")))
    status["wheels"] = {"win": win_count, "lin": lin_count}
    status["status"] = "done"
    save_status(status)
    print(f"\n=== FINISHED: Windows wheels: {win_count}, Linux wheels: {lin_count} ===")

if __name__ == "__main__":
    main()
