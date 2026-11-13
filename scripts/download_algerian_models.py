import os
import sys
import json
import time
import urllib.request
import urllib.error

def log(msg):
    print(msg, flush=True)

MODELS = [
    "alger-ia/dziribert",
    "alger-ia/dziribert_sentiment",
    "MohammedNasri/whisper-algerian-dialect",
    "Chaima-KHENAFIF/algerian-darija-script-detector",
    "Chaima-KHENAFIF/darija-latin-to-arabic-translator"
]

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools", "models", "algerian"))
os.makedirs(BASE_DIR, exist_ok=True)

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AtharDZ/1.0"

def get_model_info(model_id):
    url = f"https://huggingface.co/api/models/{model_id}"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            return data
    except Exception as e:
        log(f"[ERROR] Failed to query info for {model_id}: {e}")
        return None

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
                chunk_size = 64 * 1024
                last_log = time.time()
                while True:
                    chunk = response.read(chunk_size)
                    if not chunk:
                        break
                    out_file.write(chunk)
                    downloaded += len(chunk)
                    if time.time() - last_log > 3:
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

def process_model(model_id):
    log(f"\n==================================================")
    log(f"Processing Model: {model_id}")
    log(f"==================================================")
    sanitized_name = model_id.replace("/", "__")
    model_dir = os.path.join(BASE_DIR, sanitized_name)
    os.makedirs(model_dir, exist_ok=True)

    info = get_model_info(model_id)
    if not info:
        return False

    siblings = info.get("siblings", [])
    log(f"Found {len(siblings)} files in repository metadata.")

    desired_exts = (
        ".json", ".bin", ".safetensors", ".txt", ".model", ".py", ".yaml", ".yml", ".md"
    )

    success_all = True
    for s in siblings:
        rpath = s.get("rfilename", "")
        if rpath.startswith(".") or "/." in rpath:
            continue
        if not any(rpath.endswith(ext) for ext in desired_exts):
            continue

        file_url = f"https://huggingface.co/{model_id}/resolve/main/{rpath}"
        dest_file = os.path.join(model_dir, rpath.replace("/", os.sep))
        os.makedirs(os.path.dirname(dest_file), exist_ok=True)

        res = download_file(file_url, dest_file)
        if not res:
            success_all = False

    return success_all

def main():
    log(f"Starting Algerian Dialect & Slang Models Download Pipeline")
    log(f"Target Directory: {BASE_DIR}")
    results = {}
    for m in MODELS:
        ok = process_model(m)
        results[m] = ok

    log("\n\n================ SUMMARY ================")
    for m, ok in results.items():
        status = "SUCCESS" if ok else "FAILED"
        log(f"  - {m}: {status}")

if __name__ == "__main__":
    main()
