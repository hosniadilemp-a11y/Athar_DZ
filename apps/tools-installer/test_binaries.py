import subprocess
from pathlib import Path

bin_dir = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/bin")
dl_dir = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools/downloads")

tests = [
    ("Subfinder", bin_dir / "osint_subfinder/windows_amd64/subfinder.exe", ["-version"]),
    ("Dnsx", bin_dir / "osint_dnsx/windows_amd64/dnsx.exe", ["-version"]),
    ("Httpx", bin_dir / "osint_httpx/windows_amd64/httpx.exe", ["-version"]),
    ("Katana", bin_dir / "osint_katana/windows_amd64/katana.exe", ["-version"]),
    ("Nuclei", bin_dir / "osint_nuclei/windows_amd64/nuclei.exe", ["-version"]),
    ("Trufflehog", bin_dir / "osint_trufflehog/windows_amd64/trufflehog.exe", ["--version"]),
    ("PhoneInfoga", bin_dir / "osint_phoneinfoga/windows_amd64/phoneinfoga.exe", ["version"]),
    ("Gowitness", dl_dir / "osint_gowitness/windows/gowitness-3.2.2-windows-amd64.exe", ["version"]),
    ("Scrcpy", bin_dir / "forensic_scrcpy/windows_amd64/scrcpy-win64-v5.0.1/scrcpy.exe", ["--version"]),
    ("ADB", bin_dir / "platform-tools/windows_amd64/platform-tools/adb.exe", ["version"]),
    ("ExifTool", bin_dir / "exiftool/windows_amd64/exiftool.exe", ["-ver"]),
]

for name, exe, args in tests:
    if not exe.exists():
        print(f"[MISSING] {name} at {exe}")
        continue
    try:
        res = subprocess.run([str(exe), *args], capture_output=True, text=True, timeout=10)
        output = (res.stdout or res.stderr).strip().splitlines()
        first_line = output[0] if output else "OK (no output)"
        print(f"[SUCCESS] {name}: {first_line[:80]}")
    except Exception as e:
        print(f"[ERROR] {name}: {e}")
