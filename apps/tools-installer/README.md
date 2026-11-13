# Athar DZ — Cross-Platform Tools Installer & Progress Monitor

Zero-dependency Python 3.10+ downloader and progress monitor for all **Athar DZ** tools (OSINT, SNA, Forensics/DFIR, Docker images, and Sovereign AI models) across **Windows & Linux** and **NVIDIA GPU (CUDA) & CPU** profiles.

## Quick Start

### Web Dashboard (Recommended)
- **Windows:** Double-click `launch_windows.bat` or run:
  ```powershell
  python apps/tools-installer/installer.py
  ```
- **Linux:**
  ```bash
  chmod +x apps/tools-installer/launch_linux.sh
  ./apps/tools-installer/launch_linux.sh
  ```
Opens `http://127.0.0.1:8765` with live SSE progress bars, speed (MB/s), ETA, profile presets, and resumable `state.json`.

### Headless CLI Mode (Linux Servers / Automation)
```bash
# Quick verification bundle (<100 MB)
python apps/tools-installer/installer.py --cli --profile smoke_test

# Estimate sizes and duration without downloading
python apps/tools-installer/installer.py --cli --profile core,osint_sna --os linux --compute gpu --estimate-only

# Download full GPU stack
python apps/tools-installer/installer.py --cli --profile core,osint_sna,dfir_mobile,polyglot_ai --compute gpu
```

## Notes
- Set `GITHUB_TOKEN` in your environment if you pull many GitHub releases in one session to avoid unauthenticated GitHub API rate limits (60 req/hr).
- All Python packages install into an isolated `<dest>/venv` so system Python is untouched.
