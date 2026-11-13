import urllib.request
import json

url = "https://api.github.com/repos/ggml-org/llama.cpp/releases?per_page=5"
req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        rels = json.loads(r.read())
        for rel in rels:
            print(f"Tag: {rel['tag_name']}")
            for a in rel.get("assets", []):
                name = a["name"]
                if any(k in name.lower() for k in ["win-cuda-cu12", "win-avx2-x64", "bin-ubuntu", "bin-linux"]):
                    print(f"   {name} ({a['size'] / (1024*1024):.1f} MB) -> {a['browser_download_url']}")
except Exception as e:
    print("Error:", e)
