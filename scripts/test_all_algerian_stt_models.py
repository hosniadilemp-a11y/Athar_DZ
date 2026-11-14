import os
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools"))
MODELS_TO_VERIFY = [
    {
        "name": "attoucheaziz/whisper-algerian-darja-merged",
        "path": os.path.join(BASE_DIR, "models", "algerian_stt", "attoucheaziz__whisper-algerian-darja-merged")
    },
    {
        "name": "khier12/800min_whisper_small_FT_Algerian_Dialect",
        "path": os.path.join(BASE_DIR, "models", "algerian_stt", "khier12__800min_whisper_small_FT_Algerian_Dialect")
    },
    {
        "name": "MohammedNasri/whisper-algerian-dialect",
        "path": os.path.join(BASE_DIR, "models", "algerian", "MohammedNasri__whisper-algerian-dialect")
    }
]

def verify_model(m_info):
    name = m_info["name"]
    path = m_info["path"]
    print(f"\n==================================================", flush=True)
    print(f"Testing Model: {name}", flush=True)
    print(f"==================================================", flush=True)
    
    if not os.path.exists(path):
        print(f"[FAIL] Missing path: {path}", flush=True)
        return False

    try:
        from transformers import WhisperProcessor, WhisperForConditionalGeneration
        print("  1. Loading Processor (local_files_only=True)...", flush=True)
        proc = WhisperProcessor.from_pretrained(path, local_files_only=True)
        print("  Processor loaded successfully!", flush=True)
        
        print("  2. Loading Model (local_files_only=True)...", flush=True)
        model = WhisperForConditionalGeneration.from_pretrained(path, local_files_only=True)
        params = sum(p.numel() for p in model.parameters())
        print(f"  [SUCCESS] Model loaded offline! Parameters: {params:,}", flush=True)
        return True
    except Exception as e:
        print(f"  [ERROR] {e}", flush=True)
        return False

def main():
    print("ATHAR DZ — ALGERIAN STT OFFLINE AUDIT", flush=True)
    results = {}
    for m in MODELS_TO_VERIFY:
        ok = verify_model(m)
        results[m["name"]] = ok

    print("\n================ SUMMARY ================", flush=True)
    for k, v in results.items():
        print(f"  - {k:<50}: {'PASSED' if v else 'FAILED'}", flush=True)

if __name__ == "__main__":
    main()
