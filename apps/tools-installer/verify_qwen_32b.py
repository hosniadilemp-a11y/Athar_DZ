import urllib.request

url = "https://huggingface.co/bartowski/Qwen2.5-32B-Instruct-GGUF/resolve/main/Qwen2.5-32B-Instruct-Q4_K_M.gguf"
req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Qwen 2.5 32B: Status {resp.status}, Size {int(resp.headers.get('Content-Length', 0))/(1024*1024):.1f} MB -> {resp.url}")
except Exception as e:
    print("Error:", e)
