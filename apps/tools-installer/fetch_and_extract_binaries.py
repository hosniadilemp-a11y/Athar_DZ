import os
import shutil
import subprocess
import sys
import tarfile
import zipfile
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

def run_curl(url, dest_file):
    dest_file = Path(dest_file)
    dest_file.parent.mkdir(parents=True, exist_ok=True)
    if dest_file.exists() and dest_file.stat().st_size > 100000:
        print(f"[EXISTS] {dest_file.name} ({dest_file.stat().st_size / (1024*1024):.1f} MB)")
        return True
    print(f"[CURL] Downloading {dest_file.name}...")
    cmd = ["curl.exe", "-L", "--retry", "3", "--retry-delay", "2", "-o", str(dest_file), url]
    res = subprocess.run(cmd)
    if res.returncode == 0 and dest_file.exists() and dest_file.stat().st_size > 1000:
        print(f"[SAVED] {dest_file.name} ({dest_file.stat().st_size / (1024*1024):.1f} MB)")
        return True
    print(f"[FAILED] curl failed for {dest_file.name}")
    return False

def main():
    print("=== Fetching Missing Binaries via High-Speed Curl ===")

    # 1. Gephi Toolkit
    gephi_jar = BASE / "bin/gephi/gephi-toolkit.jar"
    run_curl("https://github.com/gephi/gephi-toolkit/releases/download/v0.10.1/gephi-toolkit-0.10.1-all.jar", gephi_jar)

    # 2. Amass Windows + Linux
    amass_win = BASE / "downloads/osint_amass/amass_windows_amd64.tar.gz"
    amass_lin = BASE / "downloads/osint_amass/amass_linux_amd64.tar.gz"
    if run_curl("https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_windows_amd64.tar.gz", amass_win):
        out_win = BASE / "bin/osint_amass/windows_amd64"
        out_win.mkdir(parents=True, exist_ok=True)
        try:
            with tarfile.open(amass_win, "r:*") as t:
                t.extractall(out_win)
            print("  [EXTRACTED] Amass Windows")
        except Exception as e:
            print(f"  [EXTRACT ERR] {e}")

    if run_curl("https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_linux_amd64.tar.gz", amass_lin):
        out_lin = BASE / "bin/osint_amass/linux_amd64"
        out_lin.mkdir(parents=True, exist_ok=True)
        try:
            with tarfile.open(amass_lin, "r:*") as t:
                t.extractall(out_lin)
            print("  [EXTRACTED] Amass Linux")
        except Exception as e:
            print(f"  [EXTRACT ERR] {e}")

    # 3. FFmpeg Windows + Linux
    ff_win = BASE / "downloads/forensic_ffmpeg/ffmpeg-release-essentials.zip"
    ff_lin = BASE / "downloads/forensic_ffmpeg/ffmpeg-release-amd64-static.tar.xz"
    if run_curl("https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip", ff_win):
        out_ff_win = BASE / "bin/forensic_ffmpeg/windows_amd64"
        out_ff_win.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(ff_win) as z:
                for member in z.infolist():
                    if member.filename.endswith(("ffmpeg.exe", "ffprobe.exe", "ffplay.exe")):
                        base_name = os.path.basename(member.filename)
                        with z.open(member) as source, open(out_ff_win / base_name, "wb") as target:
                            shutil.copyfileobj(source, target)
            print("  [EXTRACTED] FFmpeg Windows executables")
        except Exception as e:
            print(f"  [EXTRACT ERR] {e}")

    if run_curl("https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz", ff_lin):
        out_ff_lin = BASE / "bin/forensic_ffmpeg/linux_amd64"
        out_ff_lin.mkdir(parents=True, exist_ok=True)
        try:
            with tarfile.open(ff_lin, "r:*") as t:
                for member in t.getmembers():
                    if member.name.endswith(("/ffmpeg", "/ffprobe")):
                        member.name = os.path.basename(member.name)
                        t.extract(member, out_ff_lin)
            print("  [EXTRACTED] FFmpeg Linux executables")
        except Exception as e:
            print(f"  [EXTRACT ERR] {e}")

    # 4. Standalone llama.cpp
    llama_zip = BASE / "downloads/llama_cpp/llama-b3800-bin-win-avx2-x64.zip"
    if run_curl("https://github.com/ggerganov/llama.cpp/releases/download/b3800/llama-b3800-bin-win-avx2-x64.zip", llama_zip):
        out_llama = BASE / "bin/llama_cpp/windows_amd64"
        out_llama.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(llama_zip) as z:
                z.extractall(out_llama)
            print("  [EXTRACTED] llama.cpp Windows binaries")
        except Exception as e:
            print(f"  [EXTRACT ERR] {e}")

    print("=== Binary Fetch Complete ===")

if __name__ == "__main__":
    main()
