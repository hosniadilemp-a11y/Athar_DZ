import io
import os
import shutil
import subprocess
import sys
import time
import urllib.request
import zipfile
import tarfile
from pathlib import Path

# Ensure unbuffered output
sys.stdout.reconfigure(line_buffering=True)

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

def get_url(url, timeout=45):
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(url, headers=headers)
    return urllib.request.urlopen(req, timeout=timeout)

def download_file(url, dest_path):
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size > 5000:
        print(f"  [EXISTS] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.1f} MB)")
        return True
    print(f"  [DOWNLOADING] {dest_path.name} from {url}...")
    try:
        with get_url(url, timeout=120) as resp, open(dest_path, "wb") as f:
            shutil.copyfileobj(resp, f)
        size_mb = dest_path.stat().st_size / (1024 * 1024)
        print(f"  [SAVED] {dest_path.name} ({size_mb:.1f} MB)")
        return True
    except Exception as e:
        print(f"  [ERROR] {dest_path.name}: {e}")
        if dest_path.exists():
            dest_path.unlink()
        return False

def download_repo_zip(repo_id, zip_urls):
    dest_dir = BASE / "repos" / repo_id
    if (dest_dir / ".git").exists() or (dest_dir / "setup.py").exists() or (dest_dir / "pyproject.toml").exists() or (dest_dir / "README.md").exists():
        print(f"  [EXISTS] {repo_id}")
        return True
    print(f"  [DOWNLOADING REPO] {repo_id}...")
    for url in zip_urls:
        try:
            with get_url(url, timeout=60) as resp:
                data = resp.read()
            with zipfile.ZipFile(io.BytesIO(data)) as z:
                # Top folder in zip
                top_dir = z.namelist()[0].split('/')[0]
                dest_dir.mkdir(parents=True, exist_ok=True)
                for member in z.infolist():
                    if member.is_dir():
                        continue
                    # Strip top folder
                    parts = member.filename.split('/', 1)
                    if len(parts) > 1 and parts[1]:
                        target_file = dest_dir / parts[1]
                        target_file.parent.mkdir(parents=True, exist_ok=True)
                        with z.open(member) as source, open(target_file, "wb") as dest:
                            shutil.copyfileobj(source, dest)
            print(f"  [EXTRACTED REPO] {repo_id} successfully")
            return True
        except Exception as e:
            print(f"    Failed {url}: {e}")
    return False

def main():
    print("=== Athar DZ Robust Tools Downloader ===")
    
    # 1. Missing Repositories
    print("\n--- 1. Repositories (Zip extraction) ---")
    repos = [
        ("forensic_aleapp_repo", [
            "https://github.com/abrignoni/ALEAPP/archive/refs/heads/main.zip",
            "https://github.com/abrignoni/ALEAPP/archive/refs/heads/master.zip"
        ]),
        ("forensic_ileapp_repo", [
            "https://github.com/abrignoni/iLEAPP/archive/refs/heads/main.zip",
            "https://github.com/abrignoni/iLEAPP/archive/refs/heads/master.zip"
        ]),
        ("osint_shadowfinder_repo", [
            "https://github.com/bellingcat/ShadowFinder/archive/refs/heads/main.zip",
            "https://github.com/bellingcat/ShadowFinder/archive/refs/heads/master.zip"
        ]),
    ]
    for r_id, urls in repos:
        download_repo_zip(r_id, urls)

    # 2. Amass Binaries
    print("\n--- 2. OWASP Amass Binaries ---")
    amass_win = BASE / "downloads/osint_amass/amass_windows_amd64.zip"
    amass_lin = BASE / "downloads/osint_amass/amass_linux_amd64.tar.gz"
    
    # Amass v4.2.0 or v5 release
    amass_win_url = "https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Windows_bdist_x86_64.zip"
    amass_lin_url = "https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Linux_bdist_x86_64.tar.gz"
    
    if download_file(amass_win_url, amass_win):
        ext_win = BASE / "bin/osint_amass/windows_amd64"
        ext_win.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(amass_win) as z:
                z.extractall(ext_win)
            print("  [EXTRACTED] Amass Windows")
        except Exception as e:
            print(f"  [EXTRACT ERR] Amass Win: {e}")

    if download_file(amass_lin_url, amass_lin):
        ext_lin = BASE / "bin/osint_amass/linux_amd64"
        ext_lin.mkdir(parents=True, exist_ok=True)
        try:
            with tarfile.open(amass_lin, "r:*") as t:
                t.extractall(ext_lin)
            print("  [EXTRACTED] Amass Linux")
        except Exception as e:
            print(f"  [EXTRACT ERR] Amass Lin: {e}")

    # 3. Gephi Toolkit JAR
    print("\n--- 3. Gephi Toolkit Graph Engine (JAR) ---")
    gephi_jar = BASE / "bin/gephi/gephi-toolkit.jar"
    gephi_url = "https://github.com/gephi/gephi-toolkit/releases/download/v0.10.1/gephi-toolkit-0.10.1-all.jar"
    download_file(gephi_url, gephi_jar)

    # 4. FFmpeg static builds
    print("\n--- 4. FFmpeg Static Binaries ---")
    # Gyan essentials release
    ff_win = BASE / "downloads/forensic_ffmpeg/ffmpeg-release-essentials.zip"
    ff_win_url = "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"
    if download_file(ff_win_url, ff_win):
        ext_ff = BASE / "bin/forensic_ffmpeg/windows_amd64"
        ext_ff.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(ff_win) as z:
                for member in z.infolist():
                    if member.filename.endswith(("ffmpeg.exe", "ffprobe.exe", "ffplay.exe")):
                        filename = os.path.basename(member.filename)
                        with z.open(member) as source, open(ext_ff / filename, "wb") as target:
                            shutil.copyfileobj(source, target)
            print("  [EXTRACTED] FFmpeg Windows executables")
        except Exception as e:
            print(f"  [EXTRACT ERR] FFmpeg Win: {e}")

    # Linux static build
    ff_lin = BASE / "downloads/forensic_ffmpeg/ffmpeg-release-amd64-static.tar.xz"
    ff_lin_url = "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
    if download_file(ff_lin_url, ff_lin):
        ext_lin = BASE / "bin/forensic_ffmpeg/linux_amd64"
        ext_lin.mkdir(parents=True, exist_ok=True)
        try:
            with tarfile.open(ff_lin, "r:*") as t:
                for member in t.getmembers():
                    if member.name.endswith(("/ffmpeg", "/ffprobe")):
                        member.name = os.path.basename(member.name)
                        t.extract(member, ext_lin)
            print("  [EXTRACTED] FFmpeg Linux executables")
        except Exception as e:
            print(f"  [EXTRACT ERR] FFmpeg Lin: {e}")

    # 5. Standalone llama.cpp Server & CLI Binaries (Offline GGUF Server)
    print("\n--- 5. Standalone llama.cpp Binaries (Windows CUDA & Linux) ---")
    llama_win_zip = BASE / "downloads/llama_cpp/llama-b3900-bin-win-cuda-cu12.4-x64.zip"
    llama_win_url = "https://github.com/ggerganov/llama.cpp/releases/download/b3900/llama-b3900-bin-win-cuda-cu12.4-x64.zip"
    # fallback to AVX2 if cuda build is large or specific
    llama_avx_zip = BASE / "downloads/llama_cpp/llama-b3900-bin-win-avx2-x64.zip"
    llama_avx_url = "https://github.com/ggerganov/llama.cpp/releases/download/b3900/llama-b3900-bin-win-avx2-x64.zip"
    
    if download_file(llama_win_url, llama_win_zip) or download_file(llama_avx_url, llama_avx_zip):
        used_zip = llama_win_zip if llama_win_zip.exists() else llama_avx_zip
        ext_llama = BASE / "bin/llama_cpp/windows_amd64"
        ext_llama.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(used_zip) as z:
                z.extractall(ext_llama)
            print(f"  [EXTRACTED] llama.cpp Windows server & cli ({used_zip.name})")
        except Exception as e:
            print(f"  [EXTRACT ERR] llama.cpp: {e}")

    print("\n=== PIPELINE FINISHED ===")

if __name__ == "__main__":
    main()
