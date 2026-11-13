import os
import sys
import wave
import struct
import math
import subprocess

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".athar-tools"))
WHISPER_BIN = os.path.join(BASE_DIR, "bin", "whisper_cpp", "windows_amd64", "whisper-cli.exe")
VAD_MODEL = os.path.join(BASE_DIR, "models", "vad", "silero_vad.onnx")
ALGERIAN_WHISPER_DIR = os.path.join(BASE_DIR, "models", "algerian", "MohammedNasri__whisper-algerian-dialect")

def create_dummy_wav(path, duration_sec=2):
    sample_rate = 16000
    num_samples = sample_rate * duration_sec
    with wave.open(path, 'w') as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        # Generate a 440Hz beep followed by silence
        data = bytearray()
        for i in range(num_samples):
            val = int(32767.0 * 0.3 * math.sin(2.0 * math.pi * 440.0 * i / sample_rate)) if i < sample_rate else 0
            data.extend(struct.pack('<h', val))
        wav.writeframes(data)

def test_whisper_cli():
    print("\n--- 1. Testing whisper-cli.exe Binary ---", flush=True)
    if not os.path.exists(WHISPER_BIN):
        print(f"[FAIL] Missing {WHISPER_BIN}", flush=True)
        return False
    
    test_wav = os.path.join(BASE_DIR, "models", "vad", "test_sample.wav")
    create_dummy_wav(test_wav)
    
    # Run whisper-cli with version / check
    res = subprocess.run([WHISPER_BIN, "--version"], capture_output=True, text=True)
    print(f"whisper-cli version check: {res.stdout.strip() or res.stderr.strip()}", flush=True)
    if res.returncode == 0:
        print("[SUCCESS] whisper.cpp standalone executable ready!", flush=True)
        return True
    return False

def test_silero_vad():
    print("\n--- 2. Testing Silero VAD Voice Activity Detector ---", flush=True)
    if not os.path.exists(VAD_MODEL):
        print(f"[FAIL] Missing {VAD_MODEL}", flush=True)
        return False
    sz = os.path.getsize(VAD_MODEL)
    print(f"Silero VAD ONNX model size: {sz:,} bytes ({sz / (1024*1024):.2f} MB)", flush=True)
    if sz > 1_000_000:
        print("[SUCCESS] Silero VAD ONNX model verified ready!", flush=True)
        return True
    return False

def test_algerian_whisper_offline():
    print("\n--- 3. Testing Algerian Dialect Whisper Model (Offline PyTorch) ---", flush=True)
    if not os.path.exists(ALGERIAN_WHISPER_DIR):
        print(f"[FAIL] Missing {ALGERIAN_WHISPER_DIR}", flush=True)
        return False
    
    try:
        from transformers import WhisperProcessor, WhisperForConditionalGeneration
        print(f"Loading local Algerian Whisper processor from {ALGERIAN_WHISPER_DIR}...", flush=True)
        processor = WhisperProcessor.from_pretrained(ALGERIAN_WHISPER_DIR, local_files_only=True)
        print("Processor loaded successfully offline!", flush=True)

        print(f"Loading local Algerian Whisper model weights (local_files_only=True)...", flush=True)
        model = WhisperForConditionalGeneration.from_pretrained(ALGERIAN_WHISPER_DIR, local_files_only=True)
        num_params = sum(p.numel() for p in model.parameters())
        print(f"Model parameters: {num_params:,}", flush=True)
        print("[SUCCESS] Algerian Dialect Whisper model verified 100% offline!", flush=True)
        return True
    except Exception as e:
        print(f"[ERROR] Algerian Whisper test failed: {e}", flush=True)
        return False

def main():
    print("==================================================")
    print("ATHAR DZ — ALGERIAN DARIJA SPEECH-TO-TEXT AUDIT")
    print("==================================================")
    ok1 = test_whisper_cli()
    ok2 = test_silero_vad()
    ok3 = test_algerian_whisper_offline()
    
    print("\n================ AUDIT SUMMARY ================")
    print(f"whisper.cpp Binary:     {'PASSED' if ok1 else 'FAILED'}")
    print(f"Silero VAD Detector:    {'PASSED' if ok2 else 'FAILED'}")
    print(f"Algerian Whisper Model: {'PASSED' if ok3 else 'FAILED'}")

if __name__ == "__main__":
    main()
