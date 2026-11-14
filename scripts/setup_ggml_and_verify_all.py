import os
import sys
import shutil
import time
import urllib.request

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools"))
WHISPER_CPP_MODELS = os.path.join(BASE_DIR, "models", "whisper_cpp")
ALGERIAN_STT_DIR = os.path.join(BASE_DIR, "models", "algerian_stt")

os.makedirs(WHISPER_CPP_MODELS, exist_ok=True)

# 1. Clean up empty hananeek2 folder if present
empty_folder = os.path.join(ALGERIAN_STT_DIR, "hananeek2__whisper-algerian-ggml")
if os.path.exists(empty_folder):
    shutil.rmtree(empty_folder, ignore_errors=True)
    print("Cleaned up empty folder.")

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AtharDZ/1.0"

def download_file(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 1000:
        print(f"  [EXISTS] {os.path.basename(dest_path)} ({os.path.getsize(dest_path):,} bytes)", flush=True)
        return True

    print(f"  [DOWNLOADING] {os.path.basename(dest_path)} from {url}...", flush=True)
    part_path = dest_path + ".part"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp, open(part_path, "wb") as f:
            total = resp.headers.get("content-length")
            total = int(total) if total else None
            downloaded = 0
            last_log = time.time()
            while True:
                chunk = resp.read(128 * 1024)
                if not chunk:
                    break
                f.write(chunk)
                downloaded += len(chunk)
                if time.time() - last_log > 5:
                    if total:
                        print(f"    progress: {downloaded:,} / {total:,} bytes ({downloaded/total*100:.1f}%)", flush=True)
                    else:
                        print(f"    progress: {downloaded:,} bytes", flush=True)
                    last_log = time.time()
        if os.path.exists(dest_path):
            os.remove(dest_path)
        os.rename(part_path, dest_path)
        print(f"  [COMPLETED] {os.path.basename(dest_path)} ({os.path.getsize(dest_path):,} bytes)", flush=True)
        return True
    except Exception as e:
        print(f"  [ERROR] {e}", flush=True)
        if os.path.exists(part_path):
            try: os.remove(part_path)
            except: pass
        return False

# Download ggml-base.bin and ggml-small.bin for whisper.cpp
print("=== Downloading GGML baseline models for whisper-cli ===", flush=True)
download_file("https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin", os.path.join(WHISPER_CPP_MODELS, "ggml-base.bin"))
download_file("https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small.bin", os.path.join(WHISPER_CPP_MODELS, "ggml-small.bin"))

print("=== GGML Setup Complete ===", flush=True)
