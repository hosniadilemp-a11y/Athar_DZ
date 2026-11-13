import urllib.request
import json

def get_repo_files(repo_id):
    url = f"https://huggingface.co/api/models/{repo_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            return [s["rfilename"] for s in data.get("siblings", [])]
    except Exception as e:
        return [f"ERR: {e}"]

print("bartowski/Qwen2.5-7B-Instruct-GGUF:")
for f in get_repo_files("bartowski/Qwen2.5-7B-Instruct-GGUF"):
    if "Q4_K_M" in f:
        print("  ", f)

print("bartowski/Qwen2.5-14B-Instruct-GGUF:")
for f in get_repo_files("bartowski/Qwen2.5-14B-Instruct-GGUF"):
    if "Q4_K_M" in f:
        print("  ", f)

print("DavidLanz/text2cypher-gemma-2-9b:")
for f in get_repo_files("DavidLanz/text2cypher-gemma-2-9b"):
    print("  ", f)
