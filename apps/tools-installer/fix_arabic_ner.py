import subprocess
from pathlib import Path

target_dir = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/models/hf/CAMeL-Lab__bert-base-arabic-camelbert-mix-ner")
target_dir.mkdir(parents=True, exist_ok=True)

vocab_file = target_dir / "vocab.txt"
part_file = target_dir / "vocab.txt.part"

if part_file.exists():
    part_file.unlink()

url = "https://huggingface.co/CAMeL-Lab/bert-base-arabic-camelbert-mix-ner/resolve/main/vocab.txt"
print(f"Downloading {url} to {vocab_file}...")

cmd = ["curl.exe", "-L", "-o", str(vocab_file), url]
subprocess.run(cmd, check=True)

print(f"Downloaded vocab.txt: size = {vocab_file.stat().st_size} bytes")

# Also check other files in CAMeL-Lab
files = ["config.json", "pytorch_model.bin", "special_tokens_map.json", "tokenizer_config.json", "vocab.txt"]
for f in files:
    fp = target_dir / f
    print(f"  {f}: {'OK' if fp.exists() and fp.stat().st_size > 0 else 'MISSING'} ({fp.stat().st_size if fp.exists() else 0} bytes)")
