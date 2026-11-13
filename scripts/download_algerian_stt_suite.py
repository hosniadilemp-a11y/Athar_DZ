import os
import sys
import json
import time
import zipfile
import tarfile
import urllib.request
import urllib.error

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AtharDZ/1.0"
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools"))
BIN_DIR = os.path.join(BASE_DIR, "bin", "whisper_cpp")
MODELS_DIR = os.path.join(BASE_DIR, "models", "algerian_stt")
VAD_DIR = os.path.join(BASE_DIR, "models", "vad")

os.makedirs(BIN_DIR, exist_ok=True)
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(VAD_DIR, exist_ok=True)

def log(msg):
    print(msg, flush=True)

def download_file(url, dest_path, expected_size=None):
    if os.path.exists(dest_path):
        current_size = os.path.getsize(dest_path)
        if expected_size is not None and current_size == expected_size and current_size > 0:
            log(f"  [EXISTS & VERIFIED] {os.path.basename(dest_path)} ({current_size:,} bytes)")
            return True
        elif expected_size is None and current_size > 0:
            log(f"  [EXISTS] {os.path.basename(dest_path)} ({current_size:,} bytes)")
            return True

    log(f"  [DOWNLOADING] {os.path.basename(dest_path)} from {url}...")
    part_path = dest_path + ".part"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})

    retries = 3
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=30) as response, open(part_path, "wb") as out_file:
                total_length = response.headers.get("content-length")
                if total_length:
                    total_length = int(total_length)
                
                downloaded = 0
                chunk_size = 128 * 1024
                last_log = time.time()
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    out_file.write(chunk)
                    downloaded += len(chunk)
                    if time.time() - last_log > 4:
                        if total_length:
                            pct = (downloaded / total_length) * 100
                            log(f"    progress: {downloaded:,} / {total_length:,} bytes ({pct:.1f}%)")
                        else:
                            log(f"    progress: {downloaded:,} bytes")
                        last_log = time.time()
            
            if os.path.exists(dest_path):
                os.remove(dest_path)
            os.rename(part_path, dest_path)
            actual_size = os.path.getsize(dest_path)
            log(f"  [COMPLETED] {os.path.basename(dest_path)} ({actual_size:,} bytes)")
            return True
        except Exception as e:
            log(f"    [ATTEMPT {attempt+1} FAILED] {e}")
            if os.path.exists(part_path):
                try:
                    os.remove(part_path)
                except:
                    pass
            time.sleep(2)

    log(f"  [FAILED] Could not download {url}")
    return False

def setup_whisper_cpp():
    log("\n==================================================")
    log("Step 1: Setting up whisper.cpp Dual-OS Binaries")
    log("==================================================")
    
    # 1. Windows x64
    win_dir = os.path.join(BIN_DIR, "windows_amd64")
    os.makedirs(win_dir, exist_ok=True)
    win_zip = os.path.join(win_dir, "whisper-bin-x64.zip")
    win_cli = os.path.join(win_dir, "whisper-cli.exe")
    if not os.path.exists(win_cli):
        url_win = "https://github.com/ggml-org/whisper.cpp/releases/download/b5454/whisper-bin-x64.zip"
        if download_file(url_win, win_zip):
            log("  Extracting Windows whisper.cpp archive...")
            with zipfile.ZipFile(win_zip, 'r') as zf:
                zf.extractall(win_dir)
            if os.path.exists(win_zip):
                os.remove(win_zip)
            log("  [READY] Windows whisper.cpp binaries extracted.")
    else:
        log(f"  [EXISTS] {win_cli}")

    # 2. Linux x64
    lin_dir = os.path.join(BIN_DIR, "linux_amd64")
    os.makedirs(lin_dir, exist_ok=True)
    lin_tar = os.path.join(lin_dir, "whisper-bin-ubuntu-x64.tar.gz")
    lin_cli = os.path.join(lin_dir, "whisper-cli")
    if not os.path.exists(lin_cli):
        url_lin = "https://github.com/ggml-org/whisper.cpp/releases/download/b5454/whisper-bin-ubuntu-x64.tar.gz"
        if download_file(url_lin, lin_tar):
            log("  Extracting Linux whisper.cpp archive...")
            with tarfile.open(lin_tar, "r:gz") as tf:
                tf.extractall(lin_dir)
            if os.path.exists(lin_tar):
                os.remove(lin_tar)
            log("  [READY] Linux whisper.cpp binaries extracted.")
    else:
        log(f"  [EXISTS] {lin_cli}")

def setup_silero_vad():
    log("\n==================================================")
    log("Step 2: Setting up Silero VAD Voice Activity Detector")
    log("==================================================")
    vad_path = os.path.join(VAD_DIR, "silero_vad.onnx")
    url = "https://raw.githubusercontent.com/snakers4/silero-vad/master/src/silero_vad/data/silero_vad.onnx"
    download_file(url, vad_path)

def process_hf_model(model_id, target_subfolder=None):
    log(f"\n==================================================")
    log(f"Downloading ASR Model: {model_id}")
    log(f"==================================================")
    sub = target_subfolder or model_id.replace("/", "__")
    dest_dir = os.path.join(MODELS_DIR, sub)
    os.makedirs(dest_dir, exist_ok=True)

    info_url = f"https://huggingface.co/api/models/{model_id}"
    req = urllib.request.Request(info_url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        log(f"[ERROR] Failed to query {model_id}: {e}")
        return False

    siblings = data.get("siblings", [])
    log(f"Found {len(siblings)} files in {model_id}")
    desired_exts = (".json", ".bin", ".safetensors", ".txt", ".model", ".py", ".yaml", ".yml", ".md")

    success_all = True
    for s in siblings:
        rpath = s.get("rfilename", "")
        if rpath.startswith(".") or "/." in rpath:
            continue
        if not any(rpath.endswith(ext) for ext in desired_exts):
            continue
        # Avoid redundant nested checkpoints if root has model
        if "checkpoint-" in rpath and not rpath.endswith(".json"):
            continue

        file_url = f"https://huggingface.co/{model_id}/resolve/main/{rpath}"
        dest_file = os.path.join(dest_dir, rpath.replace("/", os.sep))
        os.makedirs(os.path.dirname(dest_file), exist_ok=True)
        res = download_file(file_url, dest_file)
        if not res:
            success_all = False

    return success_all

def main():
    log("ATHAR DZ — ALGERIAN DARIJA SPEECH-TO-TEXT (ASR) PIPELINE")
    
    # 1. whisper.cpp binaries (Win & Linux)
    setup_whisper_cpp()

    # 2. Silero VAD ONNX model
    setup_silero_vad()

    # 3. Dedicated Algerian Darija ASR models
    asr_models = [
        "hananeek2/whisper-algerian-ggml",
        "attoucheaziz/whisper-algerian-darja-merged",
        "khier12/800min_whisper_small_FT_Algerian_Dialect"
    ]
    
    results = {}
    for m in asr_models:
        results[m] = process_hf_model(m)

    log("\n\n================ SUMMARY ================")
    for m, ok in results.items():
        log(f"  - {m}: {'SUCCESS' if ok else 'FAILED'}")

if __name__ == "__main__":
    main()
