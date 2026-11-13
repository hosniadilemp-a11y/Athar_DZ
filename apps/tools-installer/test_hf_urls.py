import urllib.request

urls = [
    ("Qwen2.5-7B-Instruct (Q4_K_M)", "https://huggingface.co/Qwen/Qwen2.5-7B-Instruct-GGUF/resolve/main/qwen2.5-7b-instruct-q4_k_m.gguf"),
    ("Qwen2.5-Coder-7B-Instruct (Q4_K_M)", "https://huggingface.co/Qwen/Qwen2.5-Coder-7B-Instruct-GGUF/resolve/main/qwen2.5-coder-7b-instruct-q4_k_m.gguf"),
    ("Qwen2.5-14B-Instruct (Q4_K_M)", "https://huggingface.co/Qwen/Qwen2.5-14B-Instruct-GGUF/resolve/main/qwen2.5-14b-instruct-q4_k_m.gguf"),
    ("Llama-3.1-8B-Instruct (Q4_K_M)", "https://huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF/resolve/main/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf"),
    ("Faster-Whisper Large-v3 model.bin", "https://huggingface.co/Systran/faster-whisper-large-v3/resolve/main/model.bin"),
    ("BGE-M3 pytorch_model.bin", "https://huggingface.co/BAAI/bge-m3/resolve/main/pytorch_model.bin"),
    ("YOLOv8x.pt", "https://github.com/ultralytics/assets/releases/download/v8.2.0/yolov8x.pt"),
]

for name, url in urls:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Athar-Tools-Downloader/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            size_mb = int(resp.headers.get("Content-Length", 0)) / (1024 * 1024)
            print(f"OK [Status {resp.status}] {name}: {size_mb:.1f} MB -> {resp.url}")
    except Exception as e:
        print(f"FAILED {name}: {e}")
