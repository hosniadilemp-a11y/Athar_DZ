import zipfile
import shutil
from pathlib import Path

base = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
win_zip = base / "downloads/forensic_exiftool/windows/download"
win_dest = base / "bin/exiftool/windows_amd64"
win_dest.mkdir(parents=True, exist_ok=True)

with zipfile.ZipFile(win_zip, 'r') as z:
    z.extractall(win_dest)
print("Extracted ExifTool Windows:")
for f in win_dest.glob("*"):
    print(" ", f.name)

# On Windows ExifTool is usually exiftool(-k).exe; rename or copy to exiftool.exe
k_exe = win_dest / "exiftool(-k).exe"
std_exe = win_dest / "exiftool.exe"
if k_exe.exists() and not std_exe.exists():
    shutil.copy2(k_exe, std_exe)
    print("Created standard exiftool.exe!")
