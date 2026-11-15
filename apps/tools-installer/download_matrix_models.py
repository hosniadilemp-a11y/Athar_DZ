# -*- coding: utf-8 -*-
"""
Athar DZ - Matrix Models Background Download Runner
Sequentially downloads the curated big models for 32GB RAM & AirLLM:
1. mixtral-8x7b-moe (20.4 GB)
2. qwen-72b-iq2 (26.2 GB)
3. llama-405b-q2 (138 GB - 4 parts)
"""

import sys
import time
from pathlib import Path

# Add installer dir to path
sys.path.insert(0, str(Path(__file__).parent))
from hf_downloader import download_tool, CURATED_HF_TOOLS

QUEUE = ["mixtral-8x7b-moe", "qwen-72b-iq2", "llama-405b-q2"]

def main():
    print("=" * 80)
    print("ATHAR DZ: MATRIX BIG MODELS DOWNLOAD RUNNER")
    print(f"Target Queue: {QUEUE}")
    print("=" * 80)

    for tid in QUEUE:
        print(f"\n>>> [QUEUE] Commencing download for: {tid} ({CURATED_HF_TOOLS[tid]['size_mb']} MB)")
        t0 = time.time()
        ok = download_tool(tid)
        elapsed = time.time() - t0
        status_str = "SUCCESS" if ok else "FAILED"
        print(f">>> [RESULT] {tid}: {status_str} (Elapsed: {elapsed / 60:.2f} min)")

    print("\n" + "=" * 80)
    print("ATHAR DZ: ALL MATRIX MODEL DOWNLOADS TERMINATED")
    print("=" * 80)

if __name__ == "__main__":
    main()
