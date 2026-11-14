import os
import subprocess
import wave
import numpy as np
from scipy import signal

DEST_DIR = os.path.abspath("Athar_DZ/apps/studio-app/frontend/public/audio")
os.makedirs(DEST_DIR, exist_ok=True)

TRACKS = [
    {
        "id": "evid_a01",
        "voice": "Microsoft Hortense Desktop",
        "rate": -1,
        "text": "Khouya Karim, salam alaykoum. Les quatre pneus Michelin rahoum reserves au depot de Boufarik. Verser les soixante-quatre mille dinars sur le compte BaridiMob et envoyer le recu sur WhatsApp.",
    },
    {
        "id": "evid_a02",
        "voice": "Microsoft Hortense Desktop",
        "rate": 0,
        "text": "Youcef, ecoute-moi bien. La cellule pneus rapporte six-cents mille dinars par jour. Mais les plaintes s'accumulent sur Facebook. Ferme les trois pages demain matin et laisse Sofiane lancer les trois nouveaux sites.",
    },
    {
        "id": "evid_a03",
        "voice": "Microsoft Hortense Desktop",
        "rate": 1,
        "text": "Boss, le nouveau script de Sofiane pour les faux rendez-vous marche tres bien. Les operateurs a Constantine ont repondu a plus de quatre-vingts clients ce matin. Nous avons encaisse deux virgule quatre millions de dinars d'acomptes.",
    },
    {
        "id": "evid_a04",
        "voice": "Microsoft Hortense Desktop",
        "rate": 0,
        "text": "Allo Kamel, l'argent d'Oran est arrive sur BaridiMob. Retire deux-cents mille dinars au bureau de poste de Bab El Oued et laisse le reste pour Sofiane.",
    },
]

def apply_wiretap_filter(input_path: str, output_path: str):
    """Apply telephone bandpass (300-3400Hz) and subtle radio static."""
    with wave.open(input_path, 'rb') as wf:
        n_channels = wf.getnchannels()
        sampwidth = wf.getsampwidth()
        framerate = wf.getframerate()
        n_frames = wf.getnframes()
        raw_bytes = wf.readframes(n_frames)

    # Convert to float numpy array
    dtype = np.int16 if sampwidth == 2 else np.uint8
    audio = np.frombuffer(raw_bytes, dtype=dtype).astype(np.float32)

    # If stereo, average to mono
    if n_channels == 2:
        audio = audio.reshape(-1, 2).mean(axis=1)

    # Normalize
    max_val = np.max(np.abs(audio)) or 1.0
    audio = audio / max_val

    # Bandpass filter (AMR telephone wiretap characteristic)
    nyquist = framerate / 2.0
    low = 350.0 / nyquist
    high = 3200.0 / nyquist
    b, a = signal.butter(4, [low, high], btype='band')
    filtered = signal.lfilter(b, a, audio)

    # Add mild wiretap hiss / telephone radio noise
    noise = np.random.normal(0, 0.008, size=len(filtered))
    filtered = filtered + noise

    # Soft compression / clipping
    filtered = np.tanh(filtered * 1.4)
    filtered = filtered / np.max(np.abs(filtered))

    # Convert back to int16 PCM
    out_pcm = (filtered * 32767.0).astype(np.int16)

    with wave.open(output_path, 'wb') as wf_out:
        wf_out.setnchannels(1)
        wf_out.setsampwidth(2)
        wf_out.setframerate(framerate)
        wf_out.writeframes(out_pcm.tobytes())

for t in TRACKS:
    tmp_raw = os.path.join(DEST_DIR, f"{t['id']}_raw.wav")
    final_wav = os.path.join(DEST_DIR, f"{t['id']}.wav")
    
    # Generate SAPI speech using PowerShell
    escaped_text = t['text'].replace("'", "''")
    ps_cmd = (
        f"Add-Type -AssemblyName System.Speech; "
        f"$s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
        f"$s.SelectVoice('{t['voice']}'); "
        f"$s.Rate = {t['rate']}; "
        f"$s.SetOutputToWaveFile('{tmp_raw}'); "
        f"$s.Speak('{escaped_text}'); "
        f"$s.Dispose()"
    )
    subprocess.run(["powershell", "-NoProfile", "-Command", ps_cmd], check=True)
    
    # Apply DSP filter
    apply_wiretap_filter(tmp_raw, final_wav)
    if os.path.exists(tmp_raw):
        os.remove(tmp_raw)
    
    print(f"Generated {final_wav} ({os.path.getsize(final_wav)} bytes)")

print("All audio files successfully generated!")
