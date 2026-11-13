import os

base = r"c:\Users\adel\Documents\IC\Athar_DZ\.athar-tools\models\algerian"
for item in sorted(os.listdir(base)):
    p = os.path.join(base, item)
    if os.path.isdir(p):
        sz = sum(os.path.getsize(os.path.join(r, f)) for r, _, fs in os.walk(p) for f in fs)
        print(f"{item:<50} : {sz / (1024*1024):.2f} MB")
