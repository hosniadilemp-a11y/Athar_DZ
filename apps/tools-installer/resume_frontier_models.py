import os
import subprocess
import sys
import time
from pathlib import Path

DEST_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/models/llm")

MODELS = [
    {
        "name": "Qwen2.5-32B-Instruct-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/Qwen2.5-32B-Instruct-GGUF/resolve/main/Qwen2.5-32B-Instruct-Q4_K_M.gguf",
        "expected_bytes": 19851336576
    },
    {
        "name": "gemma-2-27b-it-Q4_K_M.gguf",
        "url": "https://huggingface.co/bartowski/gemma-2-27b-it-GGUF/resolve/main/gemma-2-27b-it-Q4_K_M.gguf",
        "expected_bytes": 16645381632
    }
]

def download_model(m):
    final_file = DEST_DIR / m["name"]
    part_file = DEST_DIR / (m["name"] + ".part")
    expected = m["expected_bytes"]

    # If prematurely named to final file, rename back to part
    if final_file.exists():
        size = final_file.stat().st_size
        if size < (expected * 0.95):
            print(f"Renaming premature {final_file.name} ({size/(1024*1024):.1f} MB) back to .part")
            if part_file.exists():
                part_file.unlink()
            final_file.rename(part_file)
        else:
            print(f"[ALREADY COMPLETE] {final_file.name} ({size/(1024*1024):.1f} MB)")
            return True

    while True:
        current_bytes = part_file.stat().st_size if part_file.exists() else 0
        if current_bytes >= (expected * 0.95):
            print(f"Download complete: {current_bytes} bytes. Renaming to {final_file.name}")
            part_file.rename(final_file)
            return True

        pct = (current_bytes / expected) * 100
        print(f"[CURL RESUME] {m['name']} from {current_bytes/(1024*1024):.1f} MB / {expected/(1024*1024):.1f} MB ({pct:.1f}%)...")
        cmd = [
            "curl.exe", "-L", "-C", "-",
            "--retry", "20", "--retry-delay", "3",
            "--speed-time", "30", "--speed-limit", "1000",
            "-o", str(part_file),
            m["url"]
        ]
        subprocess.run(cmd)
        time.sleep(2)

def main():
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    for m in MODELS:
        print(f"\n=== Processing {m['name']} ===")
        download_model(m)
    print("\n=== ALL FRONTIER MODELS COMPLETE ===")

if __name__ == "__main__":
    main()
