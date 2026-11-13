import json
import os
import sys
import time
import urllib.request
from pathlib import Path

BASE_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/models")
STATUS_FILE = BASE_DIR / "models_download_status.json"

MODELS = [
    {
        "id": "llm_qwen25_coder_7b",
        "name": "Qwen 2.5 Coder 7B Instruct (Q4_K_M)",
        "category": "llm",
        "file": "llm/qwen2.5-coder-7b-instruct-q4_k_m.gguf",
        "url": "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf",
        "expected_bytes": 4683072224,
    },
    {
        "id": "llm_qwen25_7b",
        "name": "Qwen 2.5 7B Instruct (Q4_K_M)",
        "category": "llm",
        "file": "llm/Qwen2.5-7B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf",
        "expected_bytes": 4683072224,
    },
    {
        "id": "llm_llama31_8b",
        "name": "Meta Llama 3.1 8B Instruct (Q4_K_M)",
        "category": "llm",
        "file": "llm/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
        "expected_bytes": 4920800000,
    },
    {
        "id": "llm_qwen25_14b",
        "name": "Qwen 2.5 14B Instruct (Q4_K_M)",
        "category": "llm",
        "file": "llm/Qwen2.5-14B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Qwen2.5-14B-Instruct-GGUF/resolve/main/Qwen2.5-14B-Instruct-Q4_K_M.gguf",
        "expected_bytes": 8988160000,
    },
    {
        "id": "stt_whisper_large_v3",
        "name": "Faster-Whisper Large-v3 (CTranslate2)",
        "category": "stt",
        "file": "whisper/faster-whisper-large-v3/model.bin",
        "url": "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/model.bin",
        "expected_bytes": 3087340000,
        "companion_urls": [
            ("whisper/faster-whisper-large-v3/config.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/config.json"),
            ("whisper/faster-whisper-large-v3/tokenizer.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/tokenizer.json"),
            ("whisper/faster-whisper-large-v3/vocabulary.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/vocabulary.json"),
        ]
    },
    {
        "id": "embed_bge_m3",
        "name": "BAAI BGE-M3 Multi-Lingual Embeddings",
        "category": "embeddings",
        "file": "embeddings/bge-m3/pytorch_model.bin",
        "url": "https://huggingface.co/BAAI/bge-m3/resolve/main/pytorch_model.bin",
        "expected_bytes": 2271100000,
        "companion_urls": [
            ("embeddings/bge-m3/config.json", "https://huggingface.co/BAAI/bge-m3/resolve/main/config.json"),
        ]
    },
    {
        "id": "vision_yolo_v8x",
        "name": "Ultralytics YOLOv8x Object Detection Weights",
        "category": "vision",
        "file": "vision/yolov8x.pt",
        "url": "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8x.pt",
        "expected_bytes": 136860000,
    },
    {
        "id": "vision_yolo_v8m",
        "name": "Ultralytics YOLOv8m Object Detection Weights",
        "category": "vision",
        "file": "vision/yolov8m.pt",
        "url": "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8m.pt",
        "expected_bytes": 52140000,
    }
]

def load_status():
    if STATUS_FILE.exists():
        try:
            return json.loads(STATUS_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

def save_status(status):
    STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp = STATUS_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(status, indent=2), encoding="utf-8")
    temp.replace(STATUS_FILE)

def download_file_resumable(url, target_path, expected_bytes=0, model_id=None, status_dict=None):
    target_path = Path(target_path)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    part_path = target_path.with_name(target_path.name + ".part")

    if target_path.exists():
        size = target_path.stat().st_size
        if expected_bytes == 0 or size >= (expected_bytes * 0.95):
            print(f"[EXISTS] {target_path.name} ({size / (1024*1024):.1f} MB)")
            if status_dict is not None and model_id:
                status_dict[model_id] = {
                    "status": "done",
                    "file": str(target_path),
                    "bytes": size,
                    "mb": round(size / (1024*1024), 1)
                }
                save_status(status_dict)
            return True

    existing_bytes = part_path.stat().st_size if part_path.exists() else 0
    headers = {"User-Agent": "Athar-Tools-Downloader/1.0"}
    if existing_bytes > 0:
        headers["Range"] = f"bytes={existing_bytes}-"
        print(f"[RESUME] {target_path.name} from {existing_bytes / (1024*1024):.1f} MB...")
    else:
        print(f"[START] {target_path.name}...")

    req = urllib.request.Request(url, headers=headers)
    t0 = time.time()
    last_update = t0
    total_bytes = existing_bytes

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            content_length = resp.headers.get("Content-Length")
            if content_length:
                total_expected = existing_bytes + int(content_length)
            else:
                total_expected = expected_bytes or 0

            mode = "ab" if existing_bytes > 0 else "wb"
            with open(part_path, mode) as f:
                while True:
                    chunk = resp.read(1024 * 512)
                    if not chunk:
                        break
                    f.write(chunk)
                    total_bytes += len(chunk)
                    now = time.time()
                    if now - last_update >= 3.0:
                        last_update = now
                        elapsed = now - t0
                        speed = (total_bytes - existing_bytes) / (elapsed + 0.001) / (1024 * 1024)
                        pct = (total_bytes / total_expected * 100) if total_expected else 0
                        print(f"  {target_path.name}: {total_bytes / (1024*1024):.1f}/{total_expected / (1024*1024):.1f} MB ({pct:.1f}%) @ {speed:.2f} MB/s")
                        if status_dict is not None and model_id:
                            status_dict[model_id] = {
                                "status": "downloading",
                                "file": str(target_path),
                                "bytes_done": total_bytes,
                                "bytes_total": total_expected,
                                "speed_mb_s": round(speed, 2),
                                "pct": round(pct, 1)
                            }
                            save_status(status_dict)

        part_path.replace(target_path)
        final_size = target_path.stat().st_size
        print(f"[DONE] {target_path.name} ({final_size / (1024*1024):.1f} MB)")
        if status_dict is not None and model_id:
            status_dict[model_id] = {
                "status": "done",
                "file": str(target_path),
                "bytes": final_size,
                "mb": round(final_size / (1024*1024), 1)
            }
            save_status(status_dict)
        return True
    except Exception as e:
        print(f"[ERROR] {target_path.name}: {e}")
        if status_dict is not None and model_id:
            status_dict[model_id] = {
                "status": "error",
                "error": str(e),
                "bytes_done": total_bytes
            }
            save_status(status_dict)
        return False

def main():
    BASE_DIR.mkdir(parents=True, exist_ok=True)
    status = load_status()

    # Sort so smaller models (YOLO, companions) finish first for immediate utility
    sorted_models = sorted(MODELS, key=lambda m: m["expected_bytes"])

    print(f"=== Athar DZ Sovereign Models Downloader ===")
    print(f"Destination: {BASE_DIR}")
    print(f"Models in queue: {len(sorted_models)}")

    for m in sorted_models:
        print(f"\nProcessing {m['name']} [{m['id']}]...")
        # Download companions first if any
        for comp_rel, comp_url in m.get("companion_urls", []):
            comp_path = BASE_DIR / comp_rel
            download_file_resumable(comp_url, comp_path, 0, f"{m['id']}_companion", status)

        main_path = BASE_DIR / m["file"]
        success = download_file_resumable(
            m["url"],
            main_path,
            m["expected_bytes"],
            m["id"],
            status
        )
        if not success:
            print(f"Warning: Failed to download {m['name']}, continuing to next...")

    print("\n=== All queued models processed ===")

if __name__ == "__main__":
    main()
