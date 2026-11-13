import urllib.request

urls = [
    ("Qwen2.5-7B (bartowski)", "https://huggingface.co/bartowski/Qwen2.5-7B-Instruct-GGUF/resolve/main/Qwen2.5-7B-Instruct-Q4_K_M.gguf"),
    ("Qwen2.5-14B (bartowski)", "https://huggingface.co/bartowski/Qwen2.5-14B-Instruct-GGUF/resolve/main/Qwen2.5-14B-Instruct-Q4_K_M.gguf"),
    ("Whisper config.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/config.json"),
    ("Whisper tokenizer.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/tokenizer.json"),
    ("Whisper vocabulary.json", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/vocabulary.json"),
    ("BGE-M3 config.json", "https://huggingface.co/BAAI/bge-m3/resolve/main/config.json"),
    ("YOLOv8m.pt", "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8m.pt"),
]

for name, url in urls:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Athar-Tools-Downloader/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            size_mb = int(resp.headers.get("Content-Length", 0)) / (1024 * 1024)
            print(f"OK [Status {resp.status}] {name}: {size_mb:.2f} MB")
    except Exception as e:
        print(f"FAILED {name}: {e}")
