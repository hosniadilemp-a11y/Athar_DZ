import urllib.request
import json

def check_file(repo_id, pattern):
    url = f"https://huggingface.co/api/models/{repo_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            files = [s["rfilename"] for s in data.get("siblings", []) if pattern.lower() in s["rfilename"].lower()]
            return files
    except Exception as e:
        return [f"ERR: {e}"]

print("Qwen 2.5 32B GGUF files (Q4_K_M):")
for f in check_file("bartowski/Qwen2.5-32B-Instruct-GGUF", "q4_k_m"):
    print("  ", f)

print("Gemma 2 27B GGUF files (Q4_K_M):")
for f in check_file("bartowski/gemma-2-27b-it-GGUF", "q4_k_m"):
    print("  ", f)
