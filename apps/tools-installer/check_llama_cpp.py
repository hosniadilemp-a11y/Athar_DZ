import urllib.request
import json

url = "https://api.github.com/repos/ggml-org/llama.cpp/releases/latest"
req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        rel = json.loads(r.read())
        print(f"Latest ggml-org/llama.cpp release: {rel['tag_name']}")
        for a in rel.get("assets", []):
            name = a["name"]
            if any(k in name.lower() for k in ["cuda", "avx2", "bin-ubuntu", "bin-linux"]):
                mb = a["size"] / (1024 * 1024)
                print(f"  {name} ({mb:.1f} MB) -> {a['browser_download_url']}")
except Exception as e:
    print("Error:", e)
