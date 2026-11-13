import urllib.request
import json

url = "https://huggingface.co/api/models/CAMeL-Lab/bert-base-arabic-camelbert-mix-ner"
req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        data = json.loads(resp.read())
        for s in data.get("siblings", []):
            print(" ", s["rfilename"])
except Exception as e:
    print("Error:", e)
