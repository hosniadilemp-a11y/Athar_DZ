"""
Athar DZ — Full Offline Arsenal Audit
Performs a ground-truth check of all required files, binaries, repositories,
wheels, Docker images, and AI models across OSINT, SNA, DFIR, and AI stacks.
"""

import json
import os
import subprocess
import sys
from pathlib import Path

BASE_DIR = Path("c:/Users/adel/Documents/IC/Athar_DZ/.athar-tools")

AUDIT_SPEC = {
    "osint_binaries": [
        {"name": "OWASP Amass (Win)", "path": BASE_DIR / "bin/osint_amass/windows_amd64/amass_windows_amd64/amass.exe"},
        {"name": "OWASP Amass (Linux)", "path": BASE_DIR / "bin/osint_amass/linux_amd64/amass_linux_amd64/amass"},
        {"name": "Subfinder (Win)", "path": BASE_DIR / "bin/osint_subfinder/windows_amd64/subfinder.exe"},
        {"name": "Subfinder (Linux)", "path": BASE_DIR / "bin/osint_subfinder/linux_amd64/subfinder"},
        {"name": "Dnsx (Win)", "path": BASE_DIR / "bin/osint_dnsx/windows_amd64/dnsx.exe"},
        {"name": "Dnsx (Linux)", "path": BASE_DIR / "bin/osint_dnsx/linux_amd64/dnsx"},
        {"name": "Httpx (Win)", "path": BASE_DIR / "bin/osint_httpx/windows_amd64/httpx.exe"},
        {"name": "Httpx (Linux)", "path": BASE_DIR / "bin/osint_httpx/linux_amd64/httpx"},
        {"name": "Katana (Win)", "path": BASE_DIR / "bin/osint_katana/windows_amd64/katana.exe"},
        {"name": "Katana (Linux)", "path": BASE_DIR / "bin/osint_katana/linux_amd64/katana"},
        {"name": "Nuclei (Win)", "path": BASE_DIR / "bin/osint_nuclei/windows_amd64/nuclei.exe"},
        {"name": "Nuclei (Linux)", "path": BASE_DIR / "bin/osint_nuclei/linux_amd64/nuclei"},
        {"name": "TruffleHog (Win)", "path": BASE_DIR / "bin/osint_trufflehog/windows_amd64/trufflehog.exe"},
        {"name": "TruffleHog (Linux)", "path": BASE_DIR / "bin/osint_trufflehog/linux_amd64/trufflehog"},
        {"name": "PhoneInfoga (Win)", "path": BASE_DIR / "bin/osint_phoneinfoga/windows_amd64/phoneinfoga.exe"},
        {"name": "PhoneInfoga (Linux)", "path": BASE_DIR / "bin/osint_phoneinfoga/linux_amd64/phoneinfoga"},
        {"name": "GoWitness (Win)", "path": BASE_DIR / "bin/osint_gowitness/windows_amd64/gowitness.exe"},
        {"name": "GoWitness (Linux)", "path": BASE_DIR / "bin/osint_gowitness/linux_amd64/gowitness"},
        {"name": "CyberChef (Web Standalone)", "path": BASE_DIR / "bin/osint_cyberchef/CyberChef_v11.5.0.html"}
    ],
    "osint_repos": [
        {"name": "Sherlock Project", "path": BASE_DIR / "repos/osint_sherlock_repo"},
        {"name": "Maigret OSINT", "path": BASE_DIR / "repos/osint_maigret_repo"},
        {"name": "theHarvester", "path": BASE_DIR / "repos/osint_theharvester_repo"},
        {"name": "Holehe Email OSINT", "path": BASE_DIR / "repos/osint_holehe_repo"},
        {"name": "GHunt v2", "path": BASE_DIR / "repos/osint_ghunt_repo"},
        {"name": "Blackbird OSINT", "path": BASE_DIR / "repos/osint_blackbird_repo"},
        {"name": "Nuclei Templates (7000+ rules)", "path": BASE_DIR / "repos/osint_nuclei_templates"},
        {"name": "Auto-Archiver (Bellingcat)", "path": BASE_DIR / "repos/osint_auto_archiver_repo"},
        {"name": "Waymore Archive Hunter", "path": BASE_DIR / "repos/osint_waymore_repo"},
        {"name": "Toutatis Instagram", "path": BASE_DIR / "repos/osint_toutatis_repo"},
        {"name": "Ignorant Phone OSINT", "path": BASE_DIR / "repos/osint_ignorant_repo"},
        {"name": "SocialScan", "path": BASE_DIR / "repos/osint_socialscan_repo"},
        {"name": "ShadowFinder (Bellingcat Shadow Geolocation)", "path": BASE_DIR / "repos/osint_shadowfinder_repo"}
    ],
    "sna_tools": [
        {"name": "Gephi Toolkit JAR (ForceAtlas2 Layout Engine)", "path": BASE_DIR / "bin/gephi/gephi-toolkit.jar"}
    ],
    "forensic_tools": [
        {"name": "FFmpeg Static (Win)", "path": BASE_DIR / "bin/forensic_ffmpeg/windows_amd64/ffmpeg.exe"},
        {"name": "FFprobe Static (Win)", "path": BASE_DIR / "bin/forensic_ffmpeg/windows_amd64/ffprobe.exe"},
        {"name": "FFmpeg Static (Linux)", "path": BASE_DIR / "bin/forensic_ffmpeg/linux_amd64/ffmpeg"},
        {"name": "FFprobe Static (Linux)", "path": BASE_DIR / "bin/forensic_ffmpeg/linux_amd64/ffprobe"},
        {"name": "Android ADB (Win)", "path": BASE_DIR / "bin/platform-tools/windows_amd64/platform-tools/adb.exe"},
        {"name": "Android ADB (Linux)", "path": BASE_DIR / "bin/platform-tools/linux_amd64/platform-tools/adb"},
        {"name": "Scrcpy Live Display (Win)", "path": BASE_DIR / "bin/forensic_scrcpy/windows_amd64/scrcpy-win64-v5.0.1/scrcpy.exe"},
        {"name": "Scrcpy Server JAR", "path": BASE_DIR / "bin/forensic_scrcpy/windows_amd64/scrcpy-win64-v5.0.1/scrcpy-server"},
        {"name": "JADX Decompiler CLI (Win)", "path": BASE_DIR / "bin/forensic_jadx/windows_amd64/bin/jadx.bat"},
        {"name": "JADX Decompiler GUI (Win)", "path": BASE_DIR / "bin/forensic_jadx/windows_amd64/bin/jadx-gui.bat"},
        {"name": "ExifTool (Win)", "path": BASE_DIR / "bin/exiftool/windows_amd64/exiftool.exe"},
        {"name": "ExifTool (Linux)", "path": BASE_DIR / "bin/exiftool/linux_amd64/exiftool"},
        {"name": "Sherloq Digital Image Forensic Repo", "path": BASE_DIR / "repos/forensic_sherloq_repo"},
        {"name": "ALEAPP Android Forensic Parser Repo", "path": BASE_DIR / "repos/forensic_aleapp_repo"},
        {"name": "iLEAPP iOS Forensic Parser Repo", "path": BASE_DIR / "repos/forensic_ileapp_repo"}
    ],
    "ai_models": [
        {"name": "Qwen 2.5 14B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/Qwen2.5-14B-Instruct-Q4_K_M.gguf", "min_bytes": 8500000000},
        {"name": "Meta Llama 3.1 8B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf", "min_bytes": 4500000000},
        {"name": "Qwen 2.5 7B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/Qwen2.5-7B-Instruct-Q4_K_M.gguf", "min_bytes": 4400000000},
        {"name": "Qwen 2.5 Coder 7B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/qwen2.5-coder-7b-instruct-q4_k_m.gguf", "min_bytes": 4400000000},
        {"name": "Qwen 2.5 32B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/Qwen2.5-32B-Instruct-Q4_K_M.gguf", "min_bytes": 19000000000},
        {"name": "Gemma 2 27B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/gemma-2-27b-it-Q4_K_M.gguf", "min_bytes": 16000000000},
        {"name": "Qwen 2.5 3B Instruct (Q4_K_M GGUF)", "path": BASE_DIR / "models/llm/Qwen2.5-3B-Instruct-Q4_K_M.gguf", "min_bytes": 1800000000},
        {"name": "Faster-Whisper Large v3 (model.bin)", "path": BASE_DIR / "models/whisper/faster-whisper-large-v3/model.bin", "min_bytes": 2800000000},
        {"name": "BGE-M3 Multilingual Embedding", "path": BASE_DIR / "models/embeddings/bge-m3/pytorch_model.bin", "min_bytes": 2100000000},
        {"name": "YOLOv8x Object Detector", "path": BASE_DIR / "models/vision/yolov8x.pt", "min_bytes": 120000000},
        {"name": "YOLOv8m Object Detector", "path": BASE_DIR / "models/vision/yolov8m.pt", "min_bytes": 45000000},
        {"name": "InsightFace Buffalo_L (w600k_r50.onnx)", "path": BASE_DIR / "models/insightface/buffalo_l/w600k_r50.onnx", "min_bytes": 160000000},
        {"name": "InsightFace Buffalo_L (det_10g.onnx)", "path": BASE_DIR / "models/insightface/buffalo_l/det_10g.onnx", "min_bytes": 15000000},
        {"name": "BAAI BGE Reranker v2 M3 (model.safetensors)", "path": BASE_DIR / "models/hf/BAAI__bge-reranker-v2-m3/model.safetensors", "min_bytes": 2000000000},
        {"name": "WikiNeural Multilingual NER (model.safetensors)", "path": BASE_DIR / "models/hf/Babelscape__wikineural-multilingual-ner/model.safetensors", "min_bytes": 600000000},
        {"name": "mDeBERTa-v3 Zero-Shot Classifier (model.safetensors)", "path": BASE_DIR / "models/hf/MoritzLaurer__mDeBERTa-v3-base-mnli-xnli/model.safetensors", "min_bytes": 500000000},
        {"name": "TrOCR Handwritten (model.safetensors)", "path": BASE_DIR / "models/hf/microsoft__trocr-base-handwritten/model.safetensors", "min_bytes": 1200000000},
        {"name": "CAMeL-Lab Arabic NER (pytorch_model.bin)", "path": BASE_DIR / "models/hf/CAMeL-Lab__bert-base-arabic-camelbert-mix-ner/pytorch_model.bin", "min_bytes": 400000000},
        {"name": "CAMeL-Lab Arabic NER (vocab.txt)", "path": BASE_DIR / "models/hf/CAMeL-Lab__bert-base-arabic-camelbert-mix-ner/vocab.txt", "min_bytes": 200000}
    ],
    "sovereign_datasets": [
        {"name": "OpenSanctions Dataset (entities.ftm.json)", "path": BASE_DIR / "datasets/opensanctions/entities.ftm.json", "min_bytes": 2000000000},
        {"name": "GeoLite2 City Database", "path": BASE_DIR / "datasets/geoip/GeoLite2-City.mmdb", "min_bytes": 40000000},
        {"name": "GeoLite2 Country Database", "path": BASE_DIR / "datasets/geoip/GeoLite2-Country.mmdb", "min_bytes": 3000000},
        {"name": "GeoLite2 ASN Database", "path": BASE_DIR / "datasets/geoip/GeoLite2-ASN.mmdb", "min_bytes": 7000000},
        {"name": "Tesseract Arabic OCR", "path": BASE_DIR / "models/tessdata/ara.traineddata", "min_bytes": 1000000},
        {"name": "Tesseract French OCR", "path": BASE_DIR / "models/tessdata/fra.traineddata", "min_bytes": 1000000},
        {"name": "Tesseract English OCR", "path": BASE_DIR / "models/tessdata/eng.traineddata", "min_bytes": 3000000}
    ],
    "local_engines": [
        {"name": "llama.cpp CLI (Win AVX2)", "path": BASE_DIR / "bin/llama_cpp/windows_amd64/llama-cli.exe"},
        {"name": "llama.cpp REST Server (Win AVX2)", "path": BASE_DIR / "bin/llama_cpp/windows_amd64/llama-server.exe"}
    ]
}

TARGET_DOCKER_IMAGES = [
    "ollama/ollama:latest",
    "temporalio/auto-setup:1.24.2",
    "ghcr.io/opensanctions/yente:latest",
    "neo4j:5.20.0",
    "timescale/timescaledb-ha:pg16",
    "mongo:7.0",
    "postgres:16-alpine",
    "redis:7.2.5-alpine",
    "qdrant/qdrant:v1.9.3",
    "python:3.12-slim",
    "node:20-alpine",
    "archivebox/archivebox:latest"
]

def check_docker_images():
    try:
        res = subprocess.run(["docker", "images", "--format", "{{.Repository}}:{{.Tag}}"], capture_output=True, text=True)
        if res.returncode == 0:
            lines = set(res.stdout.strip().splitlines())
            return lines
    except Exception as e:
        print(f"Docker check failed: {e}")
    return set()

def audit():
    results = {"ready": [], "missing": [], "in_progress": []}
    
    # 1. Audit Files and Directories
    for category, items in AUDIT_SPEC.items():
        for item in items:
            p = item["path"]
            min_b = item.get("min_bytes", 100)
            if p.exists():
                if p.is_file():
                    sz = p.stat().st_size
                    if sz >= min_b:
                        results["ready"].append({"category": category, "name": item["name"], "path": str(p), "size_mb": sz / (1024*1024)})
                    else:
                        results["in_progress"].append({"category": category, "name": item["name"], "path": str(p), "current_mb": sz / (1024*1024)})
                elif p.is_dir():
                    # check if dir is non-empty
                    file_count = len(list(p.glob("*")))
                    if file_count > 0:
                        results["ready"].append({"category": category, "name": item["name"], "path": str(p), "files": file_count})
                    else:
                        results["missing"].append({"category": category, "name": item["name"], "path": str(p)})
            else:
                # check for .part
                part_p = Path(str(p) + ".part")
                if part_p.exists():
                    results["in_progress"].append({"category": category, "name": item["name"], "path": str(p), "current_mb": part_p.stat().st_size / (1024*1024)})
                else:
                    results["missing"].append({"category": category, "name": item["name"], "path": str(p)})

    # 2. Audit Docker Images
    docker_images = check_docker_images()
    for img in TARGET_DOCKER_IMAGES:
        if img in docker_images:
            results["ready"].append({"category": "docker_images", "name": img, "status": "pulled"})
        else:
            results["missing"].append({"category": "docker_images", "name": img, "status": "not_pulled"})

    # 3. Audit Wheels
    win_wheels = list((BASE_DIR / "wheels/windows_cpu").glob("*.whl")) if (BASE_DIR / "wheels/windows_cpu").exists() else []
    lin_wheels = list((BASE_DIR / "wheels/linux_cpu").glob("*.whl")) if (BASE_DIR / "wheels/linux_cpu").exists() else []
    results["wheels"] = {
        "windows_count": len(win_wheels),
        "linux_count": len(lin_wheels)
    }

    # Print Report
    print("="*60)
    print("ATHAR DZ — COMPREHENSIVE OFFLINE ARSENAL AUDIT")
    print("="*60)
    print(f"Ready Assets:        {len(results['ready'])}")
    print(f"In-Progress Assets:  {len(results['in_progress'])}")
    print(f"Missing Assets:      {len(results['missing'])}")
    print(f"Windows Wheels:      {len(win_wheels)}")
    print(f"Linux Wheels:        {len(lin_wheels)}")
    print("="*60)

    if results["in_progress"]:
        print("\n--- IN-PROGRESS ASSETS ---")
        for item in results["in_progress"]:
            print(f"  [IN-PROGRESS] {item['category'].upper()} | {item['name']} ({item.get('current_mb', 0):.1f} MB on disk)")

    if results["missing"]:
        print("\n--- MISSING ASSETS (MUST BE DOWNLOADED) ---")
        for item in results["missing"]:
            print(f"  [MISSING] {item['category'].upper()} | {item['name']}")

    # Save to disk
    audit_file = BASE_DIR / "full_audit_ground_truth.json"
    audit_file.write_text(json.dumps(results, indent=2), encoding="utf-8")
    print(f"\nAudit saved to {audit_file}")

if __name__ == "__main__":
    audit()
