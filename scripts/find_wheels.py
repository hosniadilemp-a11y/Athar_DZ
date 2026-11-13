import os

for root, dirs, files in os.walk(r"c:\Users\adel\Documents\IC\Athar_DZ"):
    whls = [f for f in files if f.endswith(".whl")]
    if whls:
        print(f"{root}: {len(whls)} wheels")
