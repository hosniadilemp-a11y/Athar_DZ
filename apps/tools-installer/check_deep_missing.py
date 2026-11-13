import os
from pathlib import Path

BASE_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

def check():
    items = {
        "gowitness": list(BASE_DIR.glob("**/gowitness*")),
        "ffmpeg_linux": list(BASE_DIR.glob("**/forensic_ffmpeg/**/linux*/**/ffmpeg*")),
        "ileapp": list(BASE_DIR.glob("**/repos/*ileapp*")),
        "aleapp": list(BASE_DIR.glob("**/repos/*aleapp*")),
        "geolite2": list(BASE_DIR.glob("**/*.mmdb")),
        "tesseract": list(BASE_DIR.glob("**/*.traineddata")),
        "opensanctions": list(BASE_DIR.glob("**/opensanctions*")) + list(BASE_DIR.glob("**/yente*")) + list(BASE_DIR.glob("**/*ftm.json*"))
    }
    for k, v in items.items():
        print(f"{k}: {len(v)} matches")
        for p in v[:5]:
            print(f"   {p}")

if __name__ == "__main__":
    check()
