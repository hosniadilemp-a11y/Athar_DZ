import urllib.request
import json

url = "https://huggingface.co/api/models?search=text2cypher&limit=20"
req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        models = json.loads(r.read())
        for m in models:
            print(f"- {m['id']} (likes: {m.get('likes', 0)})")
except Exception as e:
    print(f"Error: {e}")
