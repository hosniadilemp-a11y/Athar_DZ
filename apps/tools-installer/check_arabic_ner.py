import urllib.request
import json

arabic_candidates = [
    "marefa-nlp/marefa-ner",
    "aubmindlab/bert-base-arabertv02",
    "mohammed/arabic-ner",
    "CAMeL-Lab/bert-base-arabic-camelbert-mix-ner",
    "PlanTL-GOB-ES/roberta-base-bne-capitel-ner"
]

for r in arabic_candidates:
    url = f"https://huggingface.co/api/models/{r}"
    req = urllib.request.Request(url, headers={"User-Agent": "Athar-Tools/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
            files = [s["rfilename"] for s in data.get("siblings", [])]
            print(f"OK {r}: {len(files)} files")
    except Exception as e:
        print(f"Failed {r}: {e}")
