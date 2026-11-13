"""
Athar DZ — Unified Downloader for All Missing Audit Tools
Downloads and installs:
1. GoWitness (Windows + Linux)
2. FFmpeg (Linux static build)
3. GeoLite2 IP Geolocation Databases (.mmdb)
4. Tesseract OCR Language Models (Arabic, French, English)
5. OpenSanctions Sovereign Dataset (entities.ftm.json)
6. Python SNA & Graph Wheels (igraph, leidenalg, cdlib)
7. Qwen 2.5 3B Instruct Edge Model (Q4_K_M GGUF)
"""

import json
import os
import shutil
import subprocess
import sys
import tarfile
import zipfile
from pathlib import Path

BASE_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
BIN_DIR = BASE_DIR / "bin"
MODELS_DIR = BASE_DIR / "models"
GEO_DIR = BASE_DIR / "datasets/geoip"
SANCTIONS_DIR = BASE_DIR / "datasets/opensanctions"
OCR_DIR = BASE_DIR / "models/tessdata"
WHEELS_WIN = BASE_DIR / "wheels/windows_cpu"
WHEELS_LIN = BASE_DIR / "wheels/linux_cpu"

# Ensure directories exist
for d in [BIN_DIR, MODELS_DIR / "llm", GEO_DIR, SANCTIONS_DIR, OCR_DIR, WHEELS_WIN, WHEELS_LIN]:
    d.mkdir(parents=True, exist_ok=True)

def run_curl(url, dest_path, min_bytes=1000):
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size >= min_bytes:
        print(f"  [EXISTS] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.2f} MB)")
        return True
    
    part_path = dest_path.with_suffix(dest_path.suffix + ".part")
    print(f"  [CURL] Downloading {url} -> {dest_path.name}...")
    cmd = [
        "curl.exe", "-L", "-C", "-",
        "--retry", "10", "--retry-delay", "2",
        "--speed-time", "20", "--speed-limit", "1000",
        "-o", str(part_path), url
    ]
    res = subprocess.run(cmd)
    if res.returncode == 0 and part_path.exists() and part_path.stat().st_size >= min_bytes:
        if dest_path.exists():
            dest_path.unlink()
        part_path.rename(dest_path)
        print(f"  [SUCCESS] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.2f} MB)")
        return True
    else:
        print(f"  [FAILED] Download failed for {url}")
        return False

def step1_gowitness():
    print("\n=== 1. Downloading GoWitness (Web Recon / Screenshots) ===")
    gowitness_win_dir = BIN_DIR / "osint_gowitness/windows_amd64"
    gowitness_lin_dir = BIN_DIR / "osint_gowitness/linux_amd64"
    gowitness_win_dir.mkdir(parents=True, exist_ok=True)
    gowitness_lin_dir.mkdir(parents=True, exist_ok=True)

    # GoWitness v3.0.5 releases
    win_url = "https://github.com/sensepost/gowitness/releases/download/3.0.5/gowitness-3.0.5-windows-amd64.exe"
    lin_url = "https://github.com/sensepost/gowitness/releases/download/3.0.5/gowitness-3.0.5-linux-amd64"

    run_curl(win_url, gowitness_win_dir / "gowitness.exe", min_bytes=5000000)
    run_curl(lin_url, gowitness_lin_dir / "gowitness", min_bytes=5000000)

def step2_ffmpeg_linux():
    print("\n=== 2. Downloading FFmpeg Static Build (Linux AMD64) ===")
    lin_dir = BIN_DIR / "forensic_ffmpeg/linux_amd64"
    lin_dir.mkdir(parents=True, exist_ok=True)
    target_bin = lin_dir / "ffmpeg"
    if target_bin.exists() and target_bin.stat().st_size > 10000000:
        print(f"  [EXISTS] Linux ffmpeg ({target_bin.stat().st_size / (1024*1024):.1f} MB)")
        return

    tar_path = lin_dir / "ffmpeg-release-amd64-static.tar.xz"
    url = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
    if run_curl(url, tar_path, min_bytes=20000000):
        print("  [EXTRACT] Extracting Linux ffmpeg...")
        try:
            with tarfile.open(tar_path, "r:xz") as tar:
                for member in tar.getmembers():
                    if member.name.endswith("/ffmpeg") or member.name.endswith("/ffprobe"):
                        member.name = Path(member.name).name
                        tar.extract(member, path=lin_dir)
            print("  [SUCCESS] Linux ffmpeg & ffprobe extracted successfully")
        except Exception as e:
            print(f"  [ERROR] Tar extract error: {e}")

def step3_geoip():
    print("\n=== 3. Downloading GeoLite2 IP Geolocation Databases (.mmdb) ===")
    # P3TERX/GeoLite.mmdb provides direct open mmdb files updated regularly
    dbs = [
        ("GeoLite2-City.mmdb", "https://raw.githubusercontent.com/P3TERX/GeoLite.mmdb/download/GeoLite2-City.mmdb"),
        ("GeoLite2-Country.mmdb", "https://raw.githubusercontent.com/P3TERX/GeoLite.mmdb/download/GeoLite2-Country.mmdb"),
        ("GeoLite2-ASN.mmdb", "https://raw.githubusercontent.com/P3TERX/GeoLite.mmdb/download/GeoLite2-ASN.mmdb")
    ]
    for name, url in dbs:
        dest = GEO_DIR / name
        run_curl(url, dest, min_bytes=1000000)

def step4_tesseract():
    print("\n=== 4. Downloading Tesseract OCR Language Datasets (Arabic, French, English) ===")
    tess_langs = [
        ("ara.traineddata", "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/ara.traineddata"),
        ("fra.traineddata", "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/fra.traineddata"),
        ("eng.traineddata", "https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/eng.traineddata")
    ]
    for name, url in tess_langs:
        dest = OCR_DIR / name
        run_curl(url, dest, min_bytes=500000)

def step5_opensanctions():
    print("\n=== 5. Downloading OpenSanctions Dataset (for Offline Yente) ===")
    # Target dataset for offline PEP & Sanctions screening
    dest = SANCTIONS_DIR / "entities.ftm.json"
    url = "https://data.opensanctions.org/datasets/latest/default/entities.ftm.json"
    run_curl(url, dest, min_bytes=50000000)

def step6_sna_wheels():
    print("\n=== 6. Downloading Python SNA & Graph Analytics Wheels ===")
    sna_pkgs = ["python-igraph", "leidenalg", "cdlib", "scikit-network"]
    
    # Windows
    print("  --- Windows (win_amd64 / py3.12) ---")
    for pkg in sna_pkgs:
        cmd = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir", "--dest", str(WHEELS_WIN),
            "--platform", "win_amd64", "--python-version", "3.12",
            "--only-binary=:all:", pkg
        ]
        subprocess.run(cmd, capture_output=True)

    # Linux
    print("  --- Linux (manylinux2014_x86_64 / py3.12) ---")
    for pkg in sna_pkgs:
        cmd = [
            sys.executable, "-m", "pip", "download",
            "--no-cache-dir", "--dest", str(WHEELS_LIN),
            "--platform", "manylinux2014_x86_64", "--python-version", "3.12",
            "--only-binary=:all:", pkg
        ]
        subprocess.run(cmd, capture_output=True)

def step7_edge_model():
    print("\n=== 7. Downloading Qwen 2.5 3B Instruct Edge Model (Q4_K_M GGUF) ===")
    dest = MODELS_DIR / "llm" / "Qwen2.5-3B-Instruct-Q4_K_M.gguf"
    url = "https://huggingface.co/bartowski/Qwen2.5-3B-Instruct-GGUF/resolve/main/Qwen2.5-3B-Instruct-Q4_K_M.gguf"
    run_curl(url, dest, min_bytes=1900000000)

def main():
    print("*"*65)
    print("ATHAR DZ — STARTING DOWNLOAD OF ALL AUDIT MISSING ASSETS")
    print("*"*65)
    step1_gowitness()
    step2_ffmpeg_linux()
    step3_geoip()
    step4_tesseract()
    step5_opensanctions()
    step6_sna_wheels()
    step7_edge_model()
    print("\n" + "*"*65)
    print("ALL MISSING AUDIT ASSETS DOWNLOAD PROCESS COMPLETE")
    print("*"*65)

if __name__ == "__main__":
    main()
