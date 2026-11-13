import os
import subprocess
import sys
import time
from pathlib import Path

DEST_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/models/llm")
FINAL_FILE = DEST_DIR / "Qwen2.5-14B-Instruct-Q4_K_M.gguf"
PART_FILE = DEST_DIR / "Qwen2.5-14B-Instruct-Q4_K_M.gguf.part"
URL = "https://huggingface.co/bartowski/Qwen2.5-14B-Instruct-GGUF/resolve/main/Qwen2.5-14B-Instruct-Q4_K_M.gguf"
EXPECTED_BYTES = 8988110976

def main():
    DEST_DIR.mkdir(parents=True, exist_ok=True)
    
    # If file was prematurely renamed to final name, move it back to part
    if FINAL_FILE.exists():
        size = FINAL_FILE.stat().st_size
        if size < (EXPECTED_BYTES * 0.95):
            print(f"Renaming premature {FINAL_FILE.name} ({size/(1024*1024):.1f} MB) back to .part")
            if PART_FILE.exists():
                PART_FILE.unlink()
            FINAL_FILE.rename(PART_FILE)
        else:
            print(f"[ALREADY COMPLETE] {FINAL_FILE.name} ({size/(1024*1024):.1f} MB)")
            return

    # Loop until 100% of bytes are transferred
    while True:
        current_bytes = PART_FILE.stat().st_size if PART_FILE.exists() else 0
        if current_bytes >= (EXPECTED_BYTES * 0.95):
            print(f"Download complete: {current_bytes} bytes. Renaming to {FINAL_FILE.name}")
            PART_FILE.rename(FINAL_FILE)
            break

        print(f"[CURL RESUME] Qwen 14B from {current_bytes/(1024*1024):.1f} MB / {EXPECTED_BYTES/(1024*1024):.1f} MB ({(current_bytes/EXPECTED_BYTES)*100:.1f}%)...")
        cmd = [
            "curl.exe", "-L", "-C", "-",
            "--retry", "20", "--retry-delay", "3",
            "--speed-time", "30", "--speed-limit", "1000",
            "-o", str(PART_FILE),
            URL
        ]
        res = subprocess.run(cmd)
        time.sleep(2)

if __name__ == "__main__":
    main()
