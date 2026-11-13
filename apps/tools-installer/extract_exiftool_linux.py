import tarfile
import shutil
from pathlib import Path

base = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")
lin_tar = base / "downloads/forensic_exiftool/linux/download"
lin_dest = base / "bin/exiftool/linux_amd64"
lin_dest.mkdir(parents=True, exist_ok=True)

try:
    with tarfile.open(lin_tar, "r:*") as t:
        t.extractall(lin_dest)
    print("Extracted ExifTool Linux:")
    for f in lin_dest.glob("*"):
        print(" ", f.name)
        if f.is_dir() and "Image-ExifTool" in f.name:
            for sub in f.glob("*"):
                shutil.copy2(sub, lin_dest / sub.name) if sub.is_file() else None
except Exception as e:
    print("Error:", e)
