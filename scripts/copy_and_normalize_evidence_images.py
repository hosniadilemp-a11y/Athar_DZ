import os
import shutil
import glob

SOURCE_DIR = os.path.abspath(r"C:\Users\adel\.gemini\antigravity\brain\a409ca4f-6b24-45f2-8e81-f096ebd5ece8")
TARGET_DIR = os.path.abspath(r"C:\Users\adel\Documents\IC\Athar_DZ\apps\studio-app\frontend\public\images\evidence")
os.makedirs(TARGET_DIR, exist_ok=True)

TARGET_MAP = {
    "suspect_tarek_hadj": "suspect_tarek_hadj.jpg",
    "suspect_youcef_hacker_clean": "suspect_youcef_hacker.jpg",
    "suspect_youcef_hacker": "suspect_youcef_hacker.jpg",
    "suspect_nadia_dina": "suspect_nadia_dina.jpg",
    "victim_karim_zerrouki": "victim_karim_zerrouki.jpg",
    "suspect_car_peugeot208": "suspect_car_peugeot208.jpg",
    "baridimob_edahabia_card": "baridimob_edahabia_card.jpg",
}

def sync_images():
    for prefix, target_name in TARGET_MAP.items():
        pattern = os.path.join(SOURCE_DIR, f"{prefix}*.jpg")
        matches = glob.glob(pattern)
        if matches:
            # Sort by modification time descending to take the newest
            matches.sort(key=os.path.getmtime, reverse=True)
            newest = matches[0]
            dst = os.path.join(TARGET_DIR, target_name)
            # Only copy if dst doesn't exist or src is newer
            if not os.path.exists(dst) or os.path.getmtime(newest) > os.path.getmtime(dst):
                shutil.copy2(newest, dst)
                print(f"Copied {os.path.basename(newest)} -> {target_name} ({os.path.getsize(dst)} bytes)")

if __name__ == "__main__":
    sync_images()
