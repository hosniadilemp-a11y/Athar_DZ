import urllib.request
import json

repos = [
    "hatmimr/albert-base-arabic-ner",
    "Babelscape/wikineural-multilingual-ner",
    "BAAI/bge-reranker-v2-m3",
    "MoritzLaurer/mDeBERTa-v3-base-mnli-xnli",
    "microsoft/trocr-base-handwritten"
]

for r in repos:
    url = f"https://huggingface.co/api/models/{r}"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            files = [s["rfilename"] for s in data.get("siblings", [])]
            print(f"\n{r}:")
            for f in files:
                if any(ext in f for ext in [".bin", ".safetensors", ".json", ".txt", ".model"]):
                    print("  ", f)
    except Exception as e:
        print(f"Error {r}: {e}")
