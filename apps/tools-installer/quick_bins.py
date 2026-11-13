import os
import shutil
import subprocess
import tarfile
import zipfile
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

def run(cmd):
    print("RUN:", " ".join(cmd))
    subprocess.run(cmd, check=False)

# 1. Amass Win
amass_win = BASE / "downloads/osint_amass/amass_windows_amd64.tar.gz"
amass_win.parent.mkdir(parents=True, exist_ok=True)
if not amass_win.exists():
    run(["curl.exe", "-L", "-o", str(amass_win), "https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_windows_amd64.tar.gz"])
if amass_win.exists() and amass_win.stat().st_size > 1000:
    ext_win = BASE / "bin/osint_amass/windows_amd64"
    ext_win.mkdir(parents=True, exist_ok=True)
    try:
        with tarfile.open(amass_win, "r:*") as t:
            t.extractall(ext_win)
        print("Amass Win extracted")
    except Exception as e:
        print("Amass Win extract err:", e)

# 2. Amass Linux
amass_lin = BASE / "downloads/osint_amass/amass_linux_amd64.tar.gz"
if not amass_lin.exists():
    run(["curl.exe", "-L", "-o", str(amass_lin), "https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_linux_amd64.tar.gz"])
if amass_lin.exists() and amass_lin.stat().st_size > 1000:
    ext_lin = BASE / "bin/osint_amass/linux_amd64"
    ext_lin.mkdir(parents=True, exist_ok=True)
    try:
        with tarfile.open(amass_lin, "r:*") as t:
            t.extractall(ext_lin)
        print("Amass Linux extracted")
    except Exception as e:
        print("Amass Lin extract err:", e)

# 3. FFmpeg Windows
ff_win = BASE / "downloads/forensic_ffmpeg/ffmpeg-release-essentials.zip"
ff_win.parent.mkdir(parents=True, exist_ok=True)
if not ff_win.exists() or ff_win.stat().st_size < 10000000:
    run(["curl.exe", "-L", "-o", str(ff_win), "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"])
if ff_win.exists() and ff_win.stat().st_size > 10000000:
    ext_ff = BASE / "bin/forensic_ffmpeg/windows_amd64"
    ext_ff.mkdir(parents=True, exist_ok=True)
    try:
        with zipfile.ZipFile(ff_win) as z:
            for member in z.infolist():
                if member.filename.endswith(("ffmpeg.exe", "ffprobe.exe")):
                    bname = os.path.basename(member.filename)
                    with z.open(member) as s, open(ext_ff / bname, "wb") as d:
                        shutil.copyfileobj(s, d)
        print("FFmpeg Win extracted")
    except Exception as e:
        print("FFmpeg extract err:", e)

# 4. llama.cpp Win
llama_zip = BASE / "downloads/llama_cpp/llama-b3800-bin-win-avx2-x64.zip"
llama_zip.parent.mkdir(parents=True, exist_ok=True)
if not llama_zip.exists():
    run(["curl.exe", "-L", "-o", str(llama_zip), "https://github.com/ggerganov/llama.cpp/releases/download/b3800/llama-b3800-bin-win-avx2-x64.zip"])
if llama_zip.exists() and llama_zip.stat().st_size > 100000:
    ext_llama = BASE / "bin/llama_cpp/windows_amd64"
    ext_llama.mkdir(parents=True, exist_ok=True)
    try:
        with zipfile.ZipFile(llama_zip) as z:
            z.extractall(ext_llama)
        print("llama.cpp Win extracted")
    except Exception as e:
        print("llama.cpp extract err:", e)

print("ALL QUICK BINS DONE")
