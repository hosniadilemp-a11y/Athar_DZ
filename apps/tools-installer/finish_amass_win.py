import subprocess
import tarfile
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
amass_win = BASE / "downloads/osint_amass/amass_windows_amd64.tar.gz"
out_dir = BASE / "bin/osint_amass/windows_amd64"
out_dir.mkdir(parents=True, exist_ok=True)

url = "https://github.com/owasp-amass/amass/releases/download/v5.1.3/amass_windows_amd64.tar.gz"

cmd = ["curl.exe", "-L", "-C", "-", "--retry", "10", "-o", str(amass_win), url]
print("Resuming Amass Windows download...")
subprocess.run(cmd)

if amass_win.exists():
    try:
        with tarfile.open(amass_win, "r:*") as t:
            t.extractall(out_dir)
        print("Amass Windows extracted successfully!")
    except Exception as e:
        print("Extract failed:", e)
