import urllib.request

url = "https://huggingface.co/bartowski/gemma-2-27b-it-GGUF/resolve/main/gemma-2-27b-it-Q4_K_M.gguf"
req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print(f"Gemma 2 27B: Status {resp.status}, Size {int(resp.headers.get('Content-Length', 0))/(1024*1024):.1f} MB -> {resp.url}")
except Exception as e:
    print("Error:", e)
