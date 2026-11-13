import os
import sys
import json

ALGERIAN_MODELS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools", "models", "algerian"))

TEST_CASES = [
    {
        "id": "darija_arabizi_1",
        "text": "ya khey rak rayeh l'dar wela mazal chkoune hada el hagar",
        "desc": "Arabizi street slang (bully/neighborhood slang)"
    },
    {
        "id": "darija_arabic_snitch",
        "text": "هذا البياع راهو يدور عند الحومة، بالاك راه يبلغ للبوليس",
        "desc": "Arabic script criminal/informant slang (al-bayya3 / el houma)"
    },
    {
        "id": "darija_arabizi_num",
        "text": "3labali bli rak t'9asserni mais ana 9atlek sah",
        "desc": "Arabizi with numerals (3=ayn, 9=qaf)"
    },
    {
        "id": "darija_sentiment_pos",
        "text": "الله يبارك خدمة نقية و بزاف شابة ربي يحفظكم",
        "desc": "Positive Darija sentiment"
    },
    {
        "id": "darija_sentiment_neg",
        "text": "كارثة حقيقية، سلعة مغشوشة و هردونا في دراهمنا",
        "desc": "Negative / fraud complaint Darija"
    }
]

def test_dziribert():
    print("\n--- Testing alger-ia/dziribert Tokenizer & Model Offline ---")
    model_path = os.path.join(ALGERIAN_MODELS_DIR, "alger-ia__dziribert")
    if not os.path.exists(model_path):
        print(f"[FAIL] Directory missing: {model_path}")
        return False

    try:
        from transformers import AutoTokenizer, AutoModel
        print(f"Loading local tokenizer from {model_path} (local_files_only=True)...")
        tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
        print(f"Vocab size: {len(tokenizer)}")

        for tc in TEST_CASES:
            tokens = tokenizer.tokenize(tc["text"])
            encoded = tokenizer.encode(tc["text"])
            print(f"[{tc['id']}] {tc['desc']}")
            print(f"  Input:    {tc['text']}")
            print(f"  Tokens:   {tokens[:10]}... (total {len(tokens)})")
            print(f"  IDs:      {encoded[:10]}...")

        print("[SUCCESS] dziribert tokenization completed successfully offline!")
        return True
    except Exception as e:
        print(f"[ERROR] dziribert test failed: {e}")
        return False

def test_dziribert_sentiment():
    print("\n--- Testing alger-ia/dziribert_sentiment Offline ---")
    model_path = os.path.join(ALGERIAN_MODELS_DIR, "alger-ia__dziribert_sentiment")
    if not os.path.exists(model_path):
        print(f"[FAIL] Directory missing: {model_path}")
        return False

    try:
        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        print(f"Loading sentiment model from {model_path} (local_files_only=True)...")
        tokenizer = AutoTokenizer.from_pretrained(model_path, local_files_only=True)
        model = AutoModelForSequenceClassification.from_pretrained(model_path, local_files_only=True)
        
        # Test positive and negative
        test_samples = [
            ("الله يبارك خدمة نقية و بزاف شابة", "Expected Positive"),
            ("كارثة حقيقية و هردونا في دراهمنا", "Expected Negative")
        ]
        
        for text, exp in test_samples:
            inputs = tokenizer(text, return_tensors="pt")
            outputs = model(**inputs)
            logits = outputs.logits
            pred_class = logits.argmax().item()
            labels = model.config.id2label if hasattr(model.config, 'id2label') else {}
            label_name = labels.get(pred_class, str(pred_class))
            print(f"  Input: '{text}' -> Predicted: {label_name} ({exp})")

        print("[SUCCESS] dziribert_sentiment inference verified offline!")
        return True
    except Exception as e:
        print(f"[ERROR] dziribert_sentiment test failed: {e}")
        return False

def main():
    print("==================================================")
    print("ATHAR DZ — ALGERIAN DIALECT & SLANG OFFLINE TEST")
    print("==================================================")
    ok1 = test_dziribert()
    ok2 = test_dziribert_sentiment()
    print("\n================ TEST SUMMARY ================")
    print(f"dziribert:           {'PASSED' if ok1 else 'FAILED'}")
    print(f"dziribert_sentiment: {'PASSED' if ok2 else 'FAILED'}")

if __name__ == "__main__":
    main()
