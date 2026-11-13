import urllib.request
import json

def get_repo_files(repo_id):
    url = f"https://huggingface.co/api/models/{repo_id}"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
            files = [s["rfilename"] for s in data.get("siblings", [])]
            return files
    except Exception as e:
        return [f"ERR: {e}"]

print("Qwen2.5-7B-Instruct-GGUF files:")
files_7b = get_repo_files("Qwen/Qwen2.5-7B-Instruct-GGUF")
for f in files_7b[:10]:
    if "q4" in f.lower() or "gguf" in f.lower():
        print("  ", f)

print("Qwen2.5-14B-Instruct-GGUF files:")
files_14b = get_repo_files("Qwen/Qwen2.5-14B-Instruct-GGUF")
for f in files_14b[:10]:
    if "q4" in f.lower() or "gguf" in f.lower():
        print("  ", f)
