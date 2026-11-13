import os
import sys
import subprocess

WIN_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\windows_cpu"
LINUX_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\linux_cpu"

os.makedirs(WIN_DIR, exist_ok=True)
os.makedirs(LINUX_DIR, exist_ok=True)

PACKAGES = [
    "pyarabic",
    "sacremoses",
    "sentencepiece",
    "transformers",
    "accelerate",
    "safetensors",
    "soundfile"
]

print("=== Downloading Windows Wheels ===", flush=True)
cmd_win = [
    sys.executable, "-m", "pip", "download",
    "--dest", WIN_DIR,
] + PACKAGES

try:
    print(f"Running: {' '.join(cmd_win)}", flush=True)
    res = subprocess.run(cmd_win, capture_output=True, text=True)
    print(res.stdout, flush=True)
    if res.stderr:
        print("[STDERR]", res.stderr, flush=True)
except Exception as e:
    print(f"Error downloading Windows wheels: {e}", flush=True)

print("\n=== Downloading Linux manylinux Wheels ===", flush=True)
cmd_linux = [
    sys.executable, "-m", "pip", "download",
    "--dest", LINUX_DIR,
    "--platform", "manylinux2014_x86_64",
    "--only-binary=:all:",
    "--python-version", "3.11"
] + PACKAGES

try:
    print(f"Running: {' '.join(cmd_linux)}", flush=True)
    res = subprocess.run(cmd_linux, capture_output=True, text=True)
    print(res.stdout, flush=True)
    if res.stderr:
        print("[STDERR]", res.stderr, flush=True)
except Exception as e:
    print(f"Error downloading Linux wheels: {e}", flush=True)

print("=== Wheels Download Complete ===", flush=True)
