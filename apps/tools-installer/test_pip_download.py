import subprocess
import sys
from pathlib import Path

dest_win = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/wheels/windows_cpu")
dest_lin = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/wheels/linux_cpu")
dest_win.mkdir(parents=True, exist_ok=True)
dest_lin.mkdir(parents=True, exist_ok=True)

pkgs = ["holehe", "ignorant", "instaloader"]

print("Testing pip download for Windows...")
cmd_win = [
    sys.executable, "-m", "pip", "download",
    "--no-cache-dir", "--dest", str(dest_win),
    "--platform", "win_amd64", "--python-version", "3.12",
    "--only-binary=:all:", *pkgs
]
res_win = subprocess.run(cmd_win, capture_output=True, text=True)
print("Win returncode:", res_win.returncode)
if res_win.returncode != 0:
    print("Win stderr tail:", res_win.stderr[-400:])

print("\nTesting pip download for Linux...")
cmd_lin = [
    sys.executable, "-m", "pip", "download",
    "--no-cache-dir", "--dest", str(dest_lin),
    "--platform", "manylinux2014_x86_64", "--python-version", "3.12",
    "--only-binary=:all:", *pkgs
]
res_lin = subprocess.run(cmd_lin, capture_output=True, text=True)
print("Lin returncode:", res_lin.returncode)
if res_lin.returncode != 0:
    print("Lin stderr tail:", res_lin.stderr[-400:])
