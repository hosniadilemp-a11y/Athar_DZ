import os
import subprocess
import json
from pathlib import Path

BASE = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

def get_dir_size(p):
    total = 0
    if not p.exists():
        return 0
    for f in p.rglob("*"):
        if f.is_file():
            total += f.stat().st_size
    return total

print("=== ATHAR TOOLS DISK AUDIT ===")

# Repos
repos_dir = BASE / "repos"
repos = [d.name for d in repos_dir.iterdir() if d.is_dir()] if repos_dir.exists() else []
print(f"\n[REPOSITORIES] Count: {len(repos)}")
for r in sorted(repos):
    size_mb = get_dir_size(repos_dir / r) / (1024 * 1024)
    print(f"  - {r}: {size_mb:.1f} MB")

# Binaries
bin_dir = BASE / "bin"
print(f"\n[BINARIES]")
if bin_dir.exists():
    for d in sorted(bin_dir.iterdir()):
        if d.is_dir():
            files = [f.name for f in d.rglob("*") if f.is_file()]
            print(f"  - {d.name}: {len(files)} files ({', '.join(files[:4])})")

# Models
models_dir = BASE / "models"
print(f"\n[MODELS]")
if models_dir.exists():
    for f in sorted(models_dir.rglob("*")):
        if f.is_file() and not f.name.endswith(".json"):
            size_mb = f.stat().st_size / (1024 * 1024)
            rel = f.relative_to(models_dir)
            if size_mb > 1024:
                print(f"  - {rel}: {size_mb/1024:.2f} GB")
            else:
                print(f"  - {rel}: {size_mb:.1f} MB")

# Wheels
w_win = BASE / "wheels/windows_cpu"
w_lin = BASE / "wheels/linux_cpu"
win_cnt = len(list(w_win.glob("*.whl"))) if w_win.exists() else 0
lin_cnt = len(list(w_lin.glob("*.whl"))) if w_lin.exists() else 0
print(f"\n[PYTHON WHEELS]")
print(f"  - Windows CPU: {win_cnt} wheels ({get_dir_size(w_win)/(1024*1024):.1f} MB)")
print(f"  - Linux CPU:   {lin_cnt} wheels ({get_dir_size(w_lin)/(1024*1024):.1f} MB)")

# Docker
print(f"\n[DOCKER IMAGES]")
try:
    res = subprocess.run(["docker", "images", "--format", "{{.Repository}}:{{.Tag}} ({{.Size}})"], capture_output=True, text=True)
    if res.returncode == 0:
        for line in res.stdout.strip().splitlines():
            print(f"  - {line}")
except Exception as e:
    print(f"  Docker check failed: {e}")
