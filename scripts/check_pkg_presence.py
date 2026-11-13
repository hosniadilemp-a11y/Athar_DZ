import os

WIN_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\windows_cpu"
LINUX_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\wheels\linux_cpu"

def scan(d):
    files = os.listdir(d)
    packages = set()
    for f in files:
        if f.endswith(".whl"):
            pkg_name = f.split("-")[0].lower()
            packages.add(pkg_name)
    return files, packages

win_files, win_pkgs = scan(WIN_DIR)
lin_files, lin_pkgs = scan(LINUX_DIR)

targets = ["pyarabic", "sentencepiece", "soundfile", "librosa", "transformers", "torch", "accelerate", "safetensors", "camel_tools", "sacremoses"]
print(f"Total Windows wheels: {len(win_files)}")
print(f"Total Linux wheels: {len(lin_files)}")
print("\nTarget package check:")
for t in targets:
    in_win = t in win_pkgs
    in_lin = t in lin_pkgs
    print(f"  - {t:<15} : Win={'YES' if in_win else 'MISSING':<8} | Linux={'YES' if in_lin else 'MISSING'}")
