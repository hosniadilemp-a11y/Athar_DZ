"""
Athar DZ - Sovereign Offline Benchmark Datasets & Baseline Models Downloader
Downloads empirical datasets for Algerian Darija/sentiment/transliteration benchmarks
and baseline comparator models (Whisper-tiny, AraBERT-v02) to substantiate the justification matrix.
"""
import os
import sys
import time
import urllib.request
import json

BASE_DIR = os.path.abspath(r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools")
DATASETS_DIR = os.path.join(BASE_DIR, "datasets", "evaluation")
BASELINES_DIR = os.path.join(BASE_DIR, "models", "baselines")

os.makedirs(DATASETS_DIR, exist_ok=True)
os.makedirs(BASELINES_DIR, exist_ok=True)

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

def download_file(url, dest_path):
    if os.path.exists(dest_path) and os.path.getsize(dest_path) > 0:
        print(f"  [OK] Already exists: {os.path.basename(dest_path)} ({os.path.getsize(dest_path) / 1024 / 1024:.2f} MB)")
        return
    print(f"  Downloading: {url} -> {dest_path}")
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as response, open(dest_path, 'wb') as out_file:
        chunk_size = 1024 * 1024 # 1 MB
        downloaded = 0
        while True:
            chunk = response.read(chunk_size)
            if not chunk:
                break
            out_file.write(chunk)
            downloaded += len(chunk)
    print(f"  [DONE] {os.path.basename(dest_path)} ({os.path.getsize(dest_path) / 1024 / 1024:.2f} MB)")

def download_dataset_sepidmnorozy():
    target_dir = os.path.join(DATASETS_DIR, "algerian_sentiment")
    os.makedirs(target_dir, exist_ok=True)
    files = ["train.csv", "test.csv", "dev.csv"]
    for f in files:
        url = f"https://huggingface.co/datasets/sepidmnorozy/Algerian_sentiment/raw/main/{f}"
        download_file(url, os.path.join(target_dir, f))

def download_dataset_darijadz():
    target_dir = os.path.join(DATASETS_DIR, "darijadz_corpus")
    os.makedirs(target_dir, exist_ok=True)
    url = "https://huggingface.co/datasets/nasrellahkharroubi/DarijaDz/raw/main/youtube_corpus.jsonl"
    download_file(url, os.path.join(target_dir, "youtube_corpus.jsonl"))

def download_dataset_ayoub():
    target_dir = os.path.join(DATASETS_DIR, "ayoub_darija")
    os.makedirs(target_dir, exist_ok=True)
    url = "https://huggingface.co/datasets/ayoubkirouane/Algerian-Darija/resolve/main/data/train-00000-of-00001.parquet"
    download_file(url, os.path.join(target_dir, "train-00000-of-00001.parquet"))

def download_dataset_arabizi():
    target_dir = os.path.join(DATASETS_DIR, "arabizi_transliteration")
    os.makedirs(target_dir, exist_ok=True)
    url = "https://huggingface.co/datasets/arbml/Arabizi_Transliteration/resolve/main/data/train-00000-of-00001-600f00d132ab2179.parquet"
    download_file(url, os.path.join(target_dir, "arabizi_train.parquet"))

def download_model_files(repo_id, file_list, target_dir):
    os.makedirs(target_dir, exist_ok=True)
    print(f"\nDownloading repo [{repo_id}] into {target_dir}...")
    for f in file_list:
        url = f"https://huggingface.co/{repo_id}/resolve/main/{f}"
        download_file(url, os.path.join(target_dir, f))

def main():
    print("=== Athar DZ: Downloading Evaluation Benchmark Datasets ===")
    download_dataset_sepidmnorozy()
    download_dataset_darijadz()
    download_dataset_ayoub()
    download_dataset_arabizi()

    print("\n=== Athar DZ: Downloading Baseline Comparator Models ===")
    # 1. OpenAI Whisper Tiny (Baseline STT)
    whisper_tiny_files = [
        "config.json", "generation_config.json", "model.safetensors", 
        "normalizer.json", "preprocessor_config.json", "special_tokens_map.json", 
        "tokenizer.json", "tokenizer_config.json", "vocab.json", "merges.txt"
    ]
    download_model_files("openai/whisper-tiny", whisper_tiny_files, os.path.join(BASELINES_DIR, "whisper-tiny"))

    # 2. AraBERT v02 (Baseline MSA BERT)
    arabert_files = [
        "config.json", "model.safetensors", "special_tokens_map.json", 
        "tokenizer_config.json", "vocab.txt"
    ]
    download_model_files("aubmindlab/bert-base-arabertv02", arabert_files, os.path.join(BASELINES_DIR, "bert-base-arabertv02"))

    print("\n[SUCCESS] All evaluation datasets and baseline comparator models downloaded.")

if __name__ == "__main__":
    main()
