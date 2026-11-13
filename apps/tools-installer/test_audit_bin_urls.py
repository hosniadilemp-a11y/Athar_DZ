import urllib.request
import json

urls = [
    ("Amass Windows", "https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_windows_amd64.zip"),
    ("Amass Linux", "https://github.com/owasp-amass/amass/releases/download/v4.2.0/amass_Linux_amd64.tar.gz"),
    ("Gephi Toolkit JAR", "https://github.com/gephi/gephi-toolkit/releases/download/v0.10.1/gephi-toolkit-0.10.1-all.jar"),
    ("Ghidra Zip", "https://github.com/NationalSecurityAgency/ghidra/releases/download/Ghidra_11.2_build/ghidra_11.2_PUBLIC_20240924.zip"),
    ("FFmpeg Win Static", "https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip"),
    ("FFmpeg Linux Static", "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz")
]

for name, url in urls:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            mb = int(resp.headers.get("Content-Length", 0)) / (1024 * 1024)
            print(f"OK [Status {resp.status}] {name}: {mb:.1f} MB -> {resp.url[:60]}...")
    except Exception as e:
        print(f"FAILED {name}: {e}")
