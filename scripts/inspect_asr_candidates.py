import urllib.request
import json

MODELS_TO_CHECK = [
    "algerian-nlp/Hadra-ASR-whisper-small",
    "touati-kamel/whisper-algerian-darja-small",
    "attoucheaziz/whisper-algerian-darja-merged",
    "khier12/800min_whisper_small_FT_Algerian_Dialect",
    "hananeek2/whisper-algerian-ggml",
    "snakers4/silero-vad"
]

for m in MODELS_TO_CHECK:
    try:
        url = f"https://huggingface.co/api/models/{m}"
        req = urllib.request.Request(url, headers={"User-Agent": "AtharDZ/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            siblings = data.get("siblings", [])
            rfiles = [s["rfilename"] for s in siblings if not s["rfilename"].startswith(".")]
            print(f"=== {m} ===")
            print(f"  Files count: {len(rfiles)}")
            weights = [f for f in rfiles if f.endswith(('.safetensors', '.bin', '.ggml', '.bin', '.onnx'))]
            print(f"  Weights: {weights}")
    except Exception as e:
        print(f"=== {m} === ERROR: {e}")
