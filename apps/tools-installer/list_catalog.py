import json
from pathlib import Path

cat_file = Path("Athar_DZ/apps/tools-installer/catalog.json")
data = json.loads(cat_file.read_text(encoding="utf-8"))

print(f"Total tools: {len(data['tools'])}")
for t in data["tools"]:
    print(f"[{t['category']}] {t['id']} -> {t['name']} (method={t.get('method')})")
