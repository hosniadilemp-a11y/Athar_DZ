"""
Athar DZ — Sovereign Hugging Face Tools & Models Manager
Enables downloading, caching, and offline verification of high-value NLP, NER,
Reranker, and Large Language Models for air-gapped criminal investigation.
"""

import argparse
import json
import os
import sys
import time
import urllib.request
from pathlib import Path

BASE_MODELS_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/models")
HF_MODELS_DIR = BASE_MODELS_DIR / "hf"
HF_STATUS_FILE = BASE_MODELS_DIR / "hf_models_status.json"

CURATED_HF_TOOLS = {
    "arabic-ner": {
        "name": "CAMeL-Lab Arabic Named Entity Recognition (NER)",
        "repo": "CAMeL-Lab/bert-base-arabic-camelbert-mix-ner",
        "files": ["config.json", "pytorch_model.bin", "special_tokens_map.json", "tokenizer_config.json", "vocab.txt"],
        "dest_dir": HF_MODELS_DIR / "CAMeL-Lab__bert-base-arabic-camelbert-mix-ner",
        "size_mb": 440,
        "role": "Extracts suspects, victims, wilayas, dairas, and institutions from dialectal & standard Arabic PVs"
    },
    "multilingual-ner": {
        "name": "WikiNeural Multi-Lingual NER (French, Arabic, English)",
        "repo": "Babelscape/wikineural-multilingual-ner",
        "files": ["config.json", "model.safetensors", "special_tokens_map.json", "tokenizer.json", "tokenizer_config.json", "vocab.txt"],
        "dest_dir": HF_MODELS_DIR / "Babelscape__wikineural-multilingual-ner",
        "size_mb": 710,
        "role": "Extracts entities across code-switched French/Arabic police reports and BaridiMob slips"
    },
    "reranker-m3": {
        "name": "BAAI BGE Reranker v2 M3 (Cross-Encoder)",
        "repo": "BAAI/bge-reranker-v2-m3",
        "files": ["config.json", "model.safetensors", "sentencepiece.bpe.model", "special_tokens_map.json", "tokenizer.json", "tokenizer_config.json"],
        "dest_dir": HF_MODELS_DIR / "BAAI__bge-reranker-v2-m3",
        "size_mb": 1100,
        "role": "Cross-encoder scoring top suspect candidates and CDR transactions with high precision"
    },
    "zero-shot-classifier": {
        "name": "mDeBERTa-v3 Multi-Lingual Zero-Shot Classifier",
        "repo": "MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
        "files": ["config.json", "model.safetensors", "spm.model", "tokenizer.json", "tokenizer_config.json", "special_tokens_map.json"],
        "dest_dir": HF_MODELS_DIR / "MoritzLaurer__mDeBERTa-v3-base-mnli-xnli",
        "size_mb": 850,
        "role": "Zero-shot classification of evidence into criminal categories (fraud, drugs, weapons, smuggling)"
    },
    "trocr-handwritten": {
        "name": "Microsoft TrOCR Base Handwritten",
        "repo": "microsoft/trocr-base-handwritten",
        "files": ["config.json", "model.safetensors", "merges.txt", "vocab.json", "preprocessor_config.json", "generation_config.json", "special_tokens_map.json", "tokenizer_config.json"],
        "dest_dir": HF_MODELS_DIR / "microsoft__trocr-base-handwritten",
        "size_mb": 1350,
        "role": "Vision Transformer OCR for handwritten statements, bank counter slips, and suspect notes"
    },
    "gemma-27b": {
        "name": "Gemma 2 27B Instruct (Q4_K_M GGUF)",
        "repo": "bartowski/gemma-2-27b-it-GGUF",
        "file": "gemma-2-27b-it-Q4_K_M.gguf",
        "dest": BASE_MODELS_DIR / "llm" / "gemma-2-27b-it-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/gemma-2-27b-it-GGUF/resolve/main/gemma-2-27b-it-Q4_K_M.gguf",
        "size_mb": 15874,
        "role": "Flagship 27B reasoning model capable of hybrid GPU/CPU execution on 1 GPU 16GB + 32GB RAM"
    },
    "qwen-32b": {
        "name": "Qwen 2.5 32B Instruct (Q4_K_M GGUF)",
        "repo": "bartowski/Qwen2.5-32B-Instruct-GGUF",
        "file": "Qwen2.5-32B-Instruct-Q4_K_M.gguf",
        "dest": BASE_MODELS_DIR / "llm" / "Qwen2.5-32B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Qwen2.5-32B-Instruct-GGUF/resolve/main/Qwen2.5-32B-Instruct-Q4_K_M.gguf",
        "size_mb": 18931,
        "role": "Near-frontier 32B model for complex multi-jurisdictional financial fraud and syndicate mapping"
    }
}

def load_status():
    if HF_STATUS_FILE.exists():
        try:
            return json.loads(HF_STATUS_FILE.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}

def save_status(status):
    HF_STATUS_FILE.parent.mkdir(parents=True, exist_ok=True)
    temp = HF_STATUS_FILE.with_suffix(".tmp")
    temp.write_text(json.dumps(status, indent=2), encoding="utf-8")
    temp.replace(HF_STATUS_FILE)

def download_file(url, dest_path, min_bytes=100):
    dest_path = Path(dest_path)
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if dest_path.exists() and dest_path.stat().st_size >= min_bytes:
        print(f"  [EXISTS] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.1f} MB)")
        return True

    part_path = dest_path.with_name(dest_path.name + ".part")
    existing_bytes = part_path.stat().st_size if part_path.exists() else 0
    headers = {"User-Agent": "Athar-Tools-HF/1.0"}
    if existing_bytes > 0:
        headers["Range"] = f"bytes={existing_bytes}-"
        print(f"  [RESUME] {dest_path.name} from {existing_bytes / (1024*1024):.1f} MB...")
    else:
        print(f"  [START] {dest_path.name}...")

    req = urllib.request.Request(url, headers=headers)
    t0 = time.time()
    last_p = t0
    total = existing_bytes
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            cl = resp.headers.get("Content-Length")
            is_partial = resp.status == 206
            if is_partial and cl:
                exp = existing_bytes + int(cl)
                mode = "ab"
            else:
                exp = int(cl) if cl else 0
                mode = "wb"
                existing_bytes = 0
                total = 0

            with open(part_path, mode) as f:
                while True:
                    chunk = resp.read(1024 * 512)
                    if not chunk:
                        break
                    f.write(chunk)
                    total += len(chunk)
                    now = time.time()
                    if now - last_p >= 3.0:
                        last_p = now
                        spd = (total - existing_bytes) / (now - t0 + 0.001) / (1024 * 1024)
                        pct = (total / exp * 100) if exp else 0
                        print(f"    {dest_path.name}: {total / (1024*1024):.1f}/{exp / (1024*1024):.1f} MB ({pct:.1f}%) @ {spd:.2f} MB/s")
        part_path.replace(dest_path)
        print(f"  [DONE] {dest_path.name} ({dest_path.stat().st_size / (1024*1024):.1f} MB)")
        return True
    except Exception as e:
        print(f"  [ERROR] {dest_path.name}: {e}")
        return False

def download_tool(tool_id):
    if tool_id not in CURATED_HF_TOOLS:
        print(f"Unknown tool: {tool_id}. Available: {list(CURATED_HF_TOOLS.keys())}")
        return False
    info = CURATED_HF_TOOLS[tool_id]
    print(f"\n=======================================================")
    print(f"Downloading {info['name']}...")
    print(f"Role: {info['role']}")
    print(f"=======================================================")
    status = load_status()
    status[tool_id] = {"status": "downloading", "name": info["name"]}
    save_status(status)

    if "url" in info:
        # Single large GGUF file
        success = download_file(info["url"], info["dest"])
    else:
        # Multi-file repo snapshot
        success = True
        for f in info["files"]:
            url = f"https://huggingface.co/{info['repo']}/resolve/main/{f}"
            dest = info["dest_dir"] / f
            if not download_file(url, dest):
                success = False

    status[tool_id] = {"status": "done" if success else "error", "name": info["name"]}
    save_status(status)
    return success

def list_tools():
    status = load_status()
    print("\nCurated Hugging Face Tools & Models for Athar DZ:")
    print("=" * 80)
    for tid, info in CURATED_HF_TOOLS.items():
        st = status.get(tid, {}).get("status", "not downloaded")
        badge = "[READY]" if st == "done" else "[PENDING]"
        print(f"{badge} {tid:22} | {info['size_mb']:5} MB | {info['name']}")
        print(f"     Role: {info['role']}")
    print("=" * 80)

def main():
    parser = argparse.ArgumentParser(description="Athar DZ Hugging Face Tools Downloader")
    parser.add_argument("--list", action="store_true", help="List all curated HF tools and models")
    parser.add_argument("--tool", type=str, help="Tool ID to download (or 'all')")
    args = parser.parse_args()

    if args.list or not args.tool:
        list_tools()
        return

    if args.tool == "all":
        # Download smaller NLP/NER/Reranker/OCR tools first, then the 27B/32B giants
        order = ["arabic-ner", "multilingual-ner", "reranker-m3", "zero-shot-classifier", "trocr-handwritten", "gemma-27b", "qwen-32b"]
        for tid in order:
            download_tool(tid)
    else:
        download_tool(args.tool)

if __name__ == "__main__":
    main()
