import os

WHEELS_WIN = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\windows"
WHEELS_LINUX = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\linux"

def check_wheels(folder):
    if not os.path.exists(folder):
        print(f"Folder not found: {folder}")
        return []
    files = os.listdir(folder)
    return files

win_files = check_wheels(WHEELS_WIN)
linux_files = check_wheels(WHEELS_LINUX)

print(f"Windows wheels count: {len(win_files)}")
print(f"Linux wheels count: {len(linux_files)}")

keywords = ["arabic", "sentencepiece", "sacremoses", "soundfile", "librosa", "transformers", "torch", "accelerate"]
for kw in keywords:
    win_matches = [f for f in win_files if kw in f.lower()]
    linux_matches = [f for f in linux_files if kw in f.lower()]
    print(f"Keyword '{kw}': Win={len(win_matches)}, Linux={len(linux_matches)}")
