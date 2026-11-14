import os
import shutil

src_dir = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\models\algerian\MohammedNasri__whisper-algerian-dialect"
dst_dir = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\models\algerian_stt\attoucheaziz__whisper-algerian-darja-merged"

for fname in ["vocab.json", "merges.txt", "normalizer.json", "special_tokens_map.json"]:
    src_f = os.path.join(src_dir, fname)
    dst_f = os.path.join(dst_dir, fname)
    if os.path.exists(src_f) and not os.path.exists(dst_f):
        shutil.copy2(src_f, dst_f)
        print(f"Copied {fname} to attoucheaziz.")
