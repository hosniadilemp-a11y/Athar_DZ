import subprocess
import tarfile
from pathlib import Path

DEST_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/bin/forensic_ffmpeg/linux_amd64")
DEST_DIR.mkdir(parents=True, exist_ok=True)

tar_file = DEST_DIR / "ffmpeg-linux64.tar.xz"
url = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz"

print(f"Downloading Linux FFmpeg from {url}...")
cmd = [
    "curl.exe", "-L", "-C", "-",
    "--retry", "5", "--retry-delay", "2",
    "-o", str(tar_file), url
]
res = subprocess.run(cmd)

if res.returncode == 0 and tar_file.exists():
    print(f"Downloaded tar.xz ({tar_file.stat().st_size / (1024*1024):.1f} MB). Extracting...")
    try:
        with tarfile.open(tar_file, "r:xz") as tar:
            for member in tar.getmembers():
                if member.name.endswith("/bin/ffmpeg") or member.name.endswith("/bin/ffprobe"):
                    member.name = Path(member.name).name
                    tar.extract(member, path=DEST_DIR)
                    print(f"  Extracted: {member.name}")
        print("Linux FFmpeg extraction complete!")
    except Exception as e:
        print(f"Extraction error: {e}")
