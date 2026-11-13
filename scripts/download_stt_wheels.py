import os
import sys
import subprocess

WIN_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\windows_cpu"
LINUX_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\linux_cpu"

os.makedirs(WIN_DIR, exist_ok=True)
os.makedirs(LINUX_DIR, exist_ok=True)

AUDIO_PACKAGES = [
    "faster-whisper",
    "ctranslate2",
    "pydub",
    "librosa",
    "torchaudio",
    "onnxruntime",
    "jiwer"
]

print("=== Downloading Audio/STT Windows Wheels ===", flush=True)
cmd_win = [
    sys.executable, "-m", "pip", "download",
    "--dest", WIN_DIR,
] + AUDIO_PACKAGES

try:
    print(f"Running: {' '.join(cmd_win)}", flush=True)
    res = subprocess.run(cmd_win, capture_output=True, text=True)
    print(res.stdout, flush=True)
    if res.stderr:
        print("[STDERR]", res.stderr, flush=True)
except Exception as e:
    print(f"Error downloading Windows wheels: {e}", flush=True)

print("\n=== Downloading Audio/STT Linux manylinux Wheels ===", flush=True)
cmd_linux = [
    sys.executable, "-m", "pip", "download",
    "--dest", LINUX_DIR,
    "--platform", "manylinux2014_x86_64",
    "--only-binary=:all:",
    "--python-version", "3.11"
] + AUDIO_PACKAGES

try:
    print(f"Running: {' '.join(cmd_linux)}", flush=True)
    res = subprocess.run(cmd_linux, capture_output=True, text=True)
    print(res.stdout, flush=True)
    if res.stderr:
        print("[STDERR]", res.stderr, flush=True)
except Exception as e:
    print(f"Error downloading Linux wheels: {e}", flush=True)

print("=== Audio/STT Wheels Complete ===", flush=True)
