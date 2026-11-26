#!/usr/bin/env python3
"""
Realistic Sample Generator for Athar Option B Raw File Drop Testing.

Produces 13 genuinely viewable/playable, varied-size files (~16 KB to ~3 MB) across all 9
forensic families from doc/SPECIFICATION.md §12.4, mixing verified Public Domain / CC BY-SA
Wikimedia Commons media with rich deterministic local synthesis (Pillow, Matplotlib, NumPy,
OpenCV, SQLite3, RFC 5322 email + PNG attachment, and multi-folder ZIP evidence archive).

Strictly fictional entities only (+213 555 01xx, example.com, fictional RIPs/plates).
"""

from __future__ import annotations

import csv
import datetime as dt
import hashlib
import io
import json
import math
import random
import sqlite3
import urllib.error
import urllib.request
import wave
import zipfile
from email.message import EmailMessage
from pathlib import Path

import cv2
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.backends.backend_pdf import PdfPages  # noqa: E402
import numpy as np  # noqa: E402
from PIL import Image, ImageDraw, ImageFont, TiffImagePlugin  # noqa: E402


REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "doc" / "examples" / "option_b_synthetic_samples"

USER_AGENT = "Mozilla/5.0 (compatible; AtharResearch/1.0)"

PUBLIC_ASSETS = {
    "alger_port_jpg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Alger_port.jpg",
        "source": "Wikimedia Commons — File:Alger port.jpg",
        "license": "CC BY-SA 4.0",
    },
    "speech_mp3": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/9/93/Remarks_by_President_Ronald_Reagan_during_video_taping_for_Horatio_Alger._Map_Room._-_DPLA_-_23fe0884188fa016fb9ad7350fcf746e.mp3",
        "source": "Wikimedia Commons / DPLA — Horatio Alger Remarks",
        "license": "Public domain",
    },
    "fr_word_ogg": {
        "url": "https://upload.wikimedia.org/wikipedia/commons/0/07/Fr-arsenalisation.ogg",
        "source": "Wikimedia Commons — File:Fr-arsenalisation.ogg (Lingua Libre)",
        "license": "CC BY-SA 3.0",
    },
}

FONT_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_MONO = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"


def load_font(path: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype(path, size=size)
    except OSError:
        return ImageFont.load_default()


def download_bytes(url: str, timeout: int = 20) -> bytes | None:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if getattr(resp, "status", 200) == 200:
                return resp.read()
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        print(f"[WARN] Download failed for {url}: {exc}")
    return None


def fmt_size(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    if num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    return f"{num_bytes / (1024 * 1024):.2f} MB"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


# ---------------------------------------------------------------------------
# 1 & 2. Images: Real Wikimedia Algiers Port JPEG + EXIF & BaridiMob Receipt PNG
# ---------------------------------------------------------------------------


def build_photo_jpeg(out_path: Path) -> str:
    raw = download_bytes(PUBLIC_ASSETS["alger_port_jpg"]["url"])
    source_note = "Public download (Wikimedia Commons, CC BY-SA 4.0) + synthetic EXIF"

    if raw:
        try:
            img = Image.open(io.BytesIO(raw)).convert("RGB")
        except Exception:
            raw = None

    if not raw:
        source_note = "Synthetic Pillow render (offline fallback) + synthetic EXIF"
        w, h = 1600, 1066
        img = Image.new("RGB", (w, h), (14, 24, 42))
        draw = ImageDraw.Draw(img)
        for y in range(h):
            t = y / h
            c = (
                int(14 + 28 * (1 - t)),
                int(24 + 48 * (1 - t)),
                int(42 + 74 * (1 - t)),
            )
            draw.line([(0, y), (w, y)], fill=c)
        # Stylized harbor skyline & cranes
        draw.rectangle([0, 660, w, h], fill=(12, 32, 52))
        rng = random.Random(42)
        for x in range(80, 1480, 110):
            bh = rng.randint(120, 260)
            draw.rectangle([x, 660 - bh, x + 78, 660], fill=(32, 46, 70), outline=(65, 88, 120))
            for wy in range(660 - bh + 20, 645, 28):
                for wx in range(x + 12, x + 68, 18):
                    if rng.random() > 0.35:
                        draw.rectangle([wx, wy, wx + 8, wy + 12], fill=(246, 196, 92))
        font_lg = load_font(FONT_SANS, 28)
        draw.text((48, 42), "VUE PORT ALGER — PIECE PHOTOGRAPHIQUE SYNTHETIQUE FICTIVE", fill=(235, 242, 255), font=font_lg)

    # Inject clean Exif metadata via Pillow
    exif = Image.Exif()
    exif[0x010F] = "Samsung"  # Make
    exif[0x0110] = "SM-A546B"  # Model
    exif[0x0131] = "Athar Synthetic EXIF Injector 1.0"  # Software
    exif[0x0132] = "2026:11:18 14:22:09"  # DateTime
    exif[0x013B] = "Fixture Test Enquete (Fictional)"  # Artist
    exif_ifd = exif.get_ifd(0x8769)
    exif_ifd[0x9003] = "2026:11:18 14:22:09"  # DateTimeOriginal
    exif_ifd[0x9004] = "2026:11:18 14:22:09"  # DateTimeDigitized
    gps_ifd = exif.get_ifd(0x8825)
    gps_ifd[0x0001] = "N"
    gps_ifd[0x0002] = (
        TiffImagePlugin.IFDRational(36, 1),
        TiffImagePlugin.IFDRational(45, 1),
        TiffImagePlugin.IFDRational(1368, 100),
    )  # 36.7538 N
    gps_ifd[0x0003] = "E"
    gps_ifd[0x0004] = (
        TiffImagePlugin.IFDRational(3, 1),
        TiffImagePlugin.IFDRational(3, 1),
        TiffImagePlugin.IFDRational(3168, 100),
    )  # 3.0588 E

    img.save(out_path, format="JPEG", quality=92, exif=exif.tobytes())
    return source_note


def build_receipt_png(out_path: Path) -> None:
    w, h = 1080, 1600
    img = Image.new("RGB", (w, h), (242, 245, 250))
    draw = ImageDraw.Draw(img)

    font_title = load_font(FONT_SANS, 40)
    font_h2 = load_font(FONT_SANS, 28)
    font_body = load_font(FONT_SANS, 24)
    font_mono = load_font(FONT_MONO, 22)
    font_small = load_font(FONT_SANS, 19)
    font_stamp = load_font(FONT_SANS, 64)

    # Top header banner
    draw.rectangle([0, 0, w, 170], fill=(15, 52, 118))
    draw.rectangle([0, 156, w, 170], fill=(234, 179, 8))
    draw.text((54, 42), "BARIDIMOB — REÇU DE VIREMENT", fill=(255, 255, 255), font=font_title)
    draw.text((54, 98), "SPÉCIMEN FICTIF POUR TEST OCR FORENSIQUE ATHAR", fill=(219, 234, 254), font=font_small)

    # Main white card
    draw.rounded_rectangle([54, 210, w - 54, 1490], radius=24, fill=(255, 255, 255), outline=(203, 213, 225), width=2)

    # Green verified status pill
    draw.rounded_rectangle([94, 250, 560, 312], radius=28, fill=(209, 250, 229), outline=(16, 185, 129), width=2)
    draw.text((126, 266), "OPERATION EXECUTEE (FICTIVE)", fill=(6, 95, 70), font=font_body)

    # Amount highlight
    draw.text((94, 348), "MONTANT TRANSFERE", fill=(100, 116, 139), font=font_small)
    draw.text((94, 382), "185 000,00 DZD", fill=(15, 23, 42), font=load_font(FONT_SANS, 56))
    draw.line([(94, 468), (w - 94, 468)], fill=(226, 232, 240), width=2)

    rows = [
        ("Référence transaction", "BM-20261118-009481-TEST"),
        ("Date & Heure (UTC+1)", "18/11/2026 à 14:19:44"),
        ("Compte émetteur (RIP)", "00799999000012345678"),
        ("Titulaire émetteur", "SARL ATLAS FICTIF"),
        ("Compte bénéficiaire (RIP)", "00799999000098765432"),
        ("Titulaire bénéficiaire", "KARIM EXEMPLE (FICTIF)"),
        ("Téléphone associé", "+213 555 0102"),
        ("Motif / Libellé", "Acompte facture #FAC-2026-009"),
        ("Statut conformité", "Document synthétique non réel"),
    ]

    y = 500
    for k, v in rows:
        draw.text((94, y), k, fill=(100, 116, 139), font=font_small)
        draw.text((94, y + 28), v, fill=(15, 23, 42), font=font_mono if "RIP" in k or "Ref" in k or "+213" in v else font_h2)
        draw.line([(94, y + 74), (w - 94, y + 74)], fill=(241, 245, 249), width=2)
        y += 88

    # Deterministic synthetic QR block at bottom left
    qr_x, qr_y, cell = 94, 1310, 8
    rng = random.Random(12345)
    for r in range(18):
        for c in range(18):
            is_finder = (r < 5 and c < 5) or (r < 5 and c >= 13) or (r >= 13 and c < 5)
            fill_black = is_finder or (rng.random() > 0.48)
            if fill_black:
                draw.rectangle(
                    [qr_x + c * cell, qr_y + r * cell, qr_x + (c + 1) * cell - 1, qr_y + (r + 1) * cell - 1],
                    fill=(15, 23, 42),
                )
    draw.text((264, 1326), "Empreinte contrôle QR synthétique", fill=(71, 85, 105), font=font_body)
    draw.text((264, 1364), "ATHAR-OPTION-B-RECEIPT-2026", fill=(100, 116, 139), font=font_mono)
    draw.text((264, 1404), "Strictement fictif — aucune valeur légale", fill=(185, 28, 28), font=font_small)

    # Subtle diagonal "SPÉCIMEN FICTIF" watermark layer
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    odraw = ImageDraw.Draw(overlay)
    for wy in (420, 860, 1220):
        odraw.text((190, wy), "SPECIMEN FICTIF", fill=(220, 38, 38, 42), font=font_stamp)
    rotated = Image.alpha_composite(img.convert("RGBA"), overlay.rotate(18, expand=False)).convert("RGB")
    rotated.save(out_path, format="PNG", optimize=True)


# ---------------------------------------------------------------------------
# 3, 4, 5. Audio: 15s Realistic Telecom Call WAV + Wikimedia MP3 + OGG
# ---------------------------------------------------------------------------


def build_realistic_call_wav(out_path: Path) -> None:
    sr = 44100
    dur = 15.0
    t = np.linspace(0, dur, int(sr * dur), endpoint=False, dtype=np.float64)
    sig = np.zeros_like(t)

    # Segment 1 (0.0 - 2.0s): DTMF dialing "+213 555 0102"
    dtmf = {
        "0": (941, 1336),
        "5": (770, 1336),
        "1": (697, 1209),
        "2": (697, 1336),
    }
    digits = "05550102"
    for i, d in enumerate(digits):
        s = int((0.15 + i * 0.21) * sr)
        e = int((0.15 + i * 0.21 + 0.12) * sr)
        f1, f2 = dtmf[d]
        seg_t = t[s:e]
        env = np.hanning(len(seg_t))
        sig[s:e] += 0.22 * env * (np.sin(2 * math.pi * f1 * seg_t) + np.sin(2 * math.pi * f2 * seg_t))

    # Segment 2 (2.2 - 5.2s): French/EU telephone ringback tone (440 Hz, 1s on / 1s off)
    for start_r in (2.2, 4.0):
        s, e = int(start_r * sr), int((start_r + 0.95) * sr)
        seg_t = t[s:e]
        env = np.hanning(len(seg_t)) ** 0.25
        sig[s:e] += 0.28 * env * np.sin(2 * math.pi * 440.0 * seg_t)

    # Segment 3 (5.6 - 14.6s): Dual-speaker simulated harmonic voice cadence + GSM comfort ambience
    rng = np.random.default_rng(2026)
    speech_spans = [
        (5.6, 7.6, 135.0),
        (7.9, 10.1, 195.0),
        (10.4, 12.6, 132.0),
        (12.9, 14.6, 198.0),
    ]
    for st, en, base_f0 in speech_spans:
        s, e = int(st * sr), int(en * sr)
        seg_t = t[s:e] - st
        f0 = base_f0 + 18.0 * np.sin(2 * math.pi * 1.4 * seg_t)
        phase = 2 * math.pi * np.cumsum(f0) / sr
        voicing = (
            0.45 * np.sin(phase)
            + 0.30 * np.sin(2 * phase)
            + 0.18 * np.sin(3 * phase)
            + 0.10 * np.sin(5 * phase)
        )
        syllables = 0.5 + 0.5 * np.sin(2 * math.pi * 3.8 * seg_t) ** 2
        sig[s:e] += 0.32 * voicing * syllables * np.hanning(len(seg_t)) ** 0.15

    # Gentle telephone comfort noise floor
    sig += rng.normal(0.0, 0.008, size=len(sig))
    sig = np.clip(sig, -0.95, 0.95)
    pcm = (sig * 32767.0).astype("<i2")

    with wave.open(str(out_path), "wb") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(pcm.tobytes())


def download_public_optional(key: str, out_path: Path) -> bool:
    raw = download_bytes(PUBLIC_ASSETS[key]["url"], timeout=30)
    if raw and len(raw) > 1024:
        out_path.write_bytes(raw)
        return True
    return False


# ---------------------------------------------------------------------------
# 6. Multi-page Rich Forensic PDF Invoice + Cashflow Chart + Ledger (Matplotlib)
# ---------------------------------------------------------------------------


def build_rich_pdf(out_path: Path) -> None:
    with PdfPages(out_path) as pdf:
        # Page 1: Styled Commercial Invoice
        fig, ax = plt.subplots(figsize=(8.27, 11.69))
        ax.axis("off")
        ax.set_xlim(0, 100)
        ax.set_ylim(0, 140)

        ax.add_patch(plt.Rectangle((5, 123), 90, 12, facecolor="#0f3460", edgecolor="none"))
        ax.text(8, 130, "SARL ATLAS IMPORT-EXPORT (FICTIF)", color="white", fontsize=15, fontweight="bold")
        ax.text(8, 125.5, "RC: 16/00-0999999B26  |  NIF: 000016099999999  |  Alger (Document Test Synthétique)", color="#cbd5e1", fontsize=8.5)

        ax.text(5, 117, "FACTURE PRO-FORMA / COMMERCIALE N° FAC-2026-009", fontsize=12.5, fontweight="bold", color="#0f172a")
        ax.text(5, 113, "Date: 18/11/2026    |    Émetteur RIP: 00799999000012345678    |    Tél: +213 555 0101", fontsize=9, color="#334155")
        ax.text(5, 109.5, "Client destinataire: EURL NORD LOGISTIQUE (FICTIF) — example.com", fontsize=9, color="#334155")

        line_items = [
            ("REF-01", "Lot matériel électronique industriel (fictif)", "12", "85 000 DZD", "1 020 000 DZD"),
            ("REF-02", "Prestation transit douanier portuaire simulée", "1", "245 000 DZD", "245 000 DZD"),
            ("REF-03", "Location conteneur frigorifique 40 pieds (fictif)", "4", "130 000 DZD", "520 000 DZD"),
            ("REF-04", "Frais manutention & stockage entrepôt test", "15", "22 000 DZD", "330 000 DZD"),
            ("REF-05", "Assurance fret maritime simulée (police #000)", "1", "110 000 DZD", "110 000 DZD"),
            ("REF-06", "Transport routier Alger-Oran (véhicule 16-00999-126)", "2", "145 000 DZD", "290 000 DZD"),
            ("REF-07", "Conditionnement palettes export synthétique", "20", "9 000 DZD", "180 000 DZD"),
            ("REF-08", "Frais dossier administratif fictif", "1", "150 000 DZD", "150 000 DZD"),
        ]

        ax.add_patch(plt.Rectangle((5, 99), 90, 5.5, facecolor="#e2e8f0", edgecolor="#94a3b8"))
        ax.text(6.5, 101, "Code", fontsize=8.5, fontweight="bold")
        ax.text(17, 101, "Désignation", fontsize=8.5, fontweight="bold")
        ax.text(58, 101, "Qté", fontsize=8.5, fontweight="bold")
        ax.text(66, 101, "PU HT", fontsize=8.5, fontweight="bold")
        ax.text(80, 101, "Total HT", fontsize=8.5, fontweight="bold")

        y = 94
        for idx, (code, desc, qty, pu, tot) in enumerate(line_items):
            bg = "#f8fafc" if idx % 2 == 0 else "#ffffff"
            ax.add_patch(plt.Rectangle((5, y - 1.5), 90, 5.5, facecolor=bg, edgecolor="#e2e8f0"))
            ax.text(6.5, y, code, fontsize=8, family="monospace")
            ax.text(17, y, desc, fontsize=8)
            ax.text(59, y, qty, fontsize=8)
            ax.text(66, y, pu, fontsize=8, family="monospace")
            ax.text(80, y, tot, fontsize=8, family="monospace")
            y -= 6

        ax.add_patch(plt.Rectangle((54, 34), 41, 12, facecolor="#f1f5f9", edgecolor="#64748b"))
        ax.text(56, 42, "TOTAL NET A PAYER :  2 845 000,00 DZD", fontsize=10, fontweight="bold", color="#0f172a")
        ax.text(56, 37, "Règlement par virement : RIP 00799999000012345678", fontsize=8, color="#334155")

        ax.text(
            50,
            68,
            "SPÉCIMEN FICTIF",
            fontsize=38,
            color="#dc2626",
            alpha=0.22,
            ha="center",
            va="center",
            rotation=24,
            fontweight="bold",
        )
        ax.text(5, 10, "Document généré automatiquement pour tests Athar Option B (données 100% fictives).", fontsize=8, color="#64748b")
        pdf.savefig(fig, bbox_inches="tight")
        plt.close(fig)

        # Page 2: Monthly Fictional Financial Flow Chart
        fig, ax1 = plt.subplots(figsize=(8.27, 6.2))
        months = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"]
        amounts = [420, 510, 480, 950, 620, 1480, 710, 530, 890, 1650, 2845, 760]
        cum = np.cumsum(amounts)
        bars = ax1.bar(months, amounts, color="#2563eb", alpha=0.82, label="Flux mensuels fictifs (kDZD)")
        bars[10].set_color("#dc2626")
        ax1.set_title("Évolution Synthétique des Flux Financiers Suspects (Données Fictives 2026)", fontsize=12, fontweight="bold")
        ax1.set_ylabel("Montant mensuel (kDZD)", color="#1e3a8a")
        ax1.grid(axis="y", linestyle="--", alpha=0.4)

        ax2 = ax1.twinx()
        ax2.plot(months, cum, color="#f59e0b", marker="o", linewidth=2.2, label="Cumul annuel (kDZD)")
        ax2.set_ylabel("Cumul (kDZD)", color="#b45309")
        ax1.annotate("Pic virement FAC-2026-009", xy=(10, 2845), xytext=(6.2, 2650),
                     arrowprops={"arrowstyle": "->", "color": "#dc2626"}, fontsize=9, color="#991b1b", fontweight="bold")
        fig.tight_layout()
        pdf.savefig(fig)
        plt.close(fig)

        # Page 3: Counterparty Audit Ledger
        fig, ax = plt.subplots(figsize=(8.27, 8.0))
        ax.axis("off")
        ax.set_title("Annexe 2 — Grand Livre des Contreparties Synthétiques (Fictif)", fontsize=12, fontweight="bold", pad=16)
        cols = ["Date", "Contrepartie Fictive", "RIP / CCP", "Montant (DZD)", "Statut Test"]
        rows_tbl = [
            ["2026-06-14", "EURL NORD LOGISTIQUE", "00799999000098765432", "1 480 000,00", "Rapprochement"],
            ["2026-10-03", "TRANSIT SUD EXEMPLE", "00799999000044556677", "1 650 000,00", "À vérifier"],
            ["2026-11-12", "SARL ATLAS FICTIF", "00799999000012345678", "420 000,00", "Rapprochement"],
            ["2026-11-18", "KARIM EXEMPLE (MULE)", "00799999000098765432", "185 000,00", "Alerte OCR"],
            ["2026-11-18", "SARL ATLAS FICTIF", "00799999000012345678", "2 845 000,00", "Facture Ref"],
        ]
        table = ax.table(cellText=rows_tbl, colLabels=cols, loc="center", cellLoc="left")
        table.auto_set_font_size(False)
        table.set_fontsize(8.5)
        table.scale(1.0, 2.0)
        pdf.savefig(fig, bbox_inches="tight")
        plt.close(fig)


# ---------------------------------------------------------------------------
# 7. Large 1,500-row Telecom CDR CSV
# ---------------------------------------------------------------------------


def build_cdr_csv(out_path: Path, max_rows: int = 1500) -> list[list[str]]:
    rng = random.Random(20261118)
    msisdns = [f"+21355501{i:02d}" for i in range(1, 13)]
    imeis = [f"35000000000{1001 + i}" for i in range(12)]
    cells = [
        ("DZ-16-4091", "36.7538", "3.0588", "Alger Port"),
        ("DZ-16-4092", "36.7612", "3.0510", "Alger Centre"),
        ("DZ-16-4095", "36.7310", "3.0844", "Hussein Dey"),
        ("DZ-16-4110", "36.7740", "2.9920", "Bab El Oued"),
        ("DZ-31-2044", "35.6971", "-0.6308", "Oran Port"),
        ("DZ-25-1108", "36.3650", "6.6147", "Constantine"),
        ("DZ-09-3012", "36.4700", "2.8277", "Blida"),
        ("DZ-06-2201", "36.7509", "5.0567", "Bejaia"),
    ]
    start = dt.datetime(2026, 10, 20, 6, 0, 0, tzinfo=dt.timezone.utc)
    rows: list[list[str]] = []
    with out_path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        header = [
            "record_id", "timestamp_utc", "msisdn_source", "msisdn_target",
            "imei", "imsi_synthetic", "cell_id", "cell_lat", "cell_lon",
            "cell_zone", "azimuth_deg", "event_type", "duration_sec", "direction",
        ]
        writer.writerow(header)
        for idx in range(1, max_rows + 1):
            src_idx = rng.randrange(len(msisdns))
            dst_idx = (src_idx + rng.randint(1, len(msisdns) - 1)) % len(msisdns)
            cell_id, lat, lon, zone = rng.choice(cells)
            ts = start + dt.timedelta(minutes=idx * 28 + rng.randint(0, 20))
            ev_type = rng.choices(["VOICE", "SMS", "DATA_SESSION"], weights=[0.6, 0.28, 0.12])[0]
            dur = 0 if ev_type == "SMS" else rng.randint(8, 620)
            direction = rng.choice(["OUTBOUND", "INBOUND"])
            row = [
                f"CDR-FICT-{idx:05d}",
                ts.strftime("%Y-%m-%dT%H:%M:%SZ"),
                msisdns[src_idx],
                msisdns[dst_idx],
                imeis[src_idx],
                f"6030100000{src_idx:05d}",
                cell_id,
                lat,
                lon,
                zone,
                str(rng.choice([0, 120, 240])),
                ev_type,
                str(dur),
                direction,
            ]
            writer.writerow(row)
            rows.append(row)
    return rows


# ---------------------------------------------------------------------------
# 8. Rich Self-Contained OSINT Web Capture HTML (~45 KB)
# ---------------------------------------------------------------------------


def build_osint_html(out_path: Path) -> None:
    posts_html = []
    topics = [
        ("Arrivée conteneur test au port fictif #AlgerPort — logistique prête.", "Alger Port (Fictif)"),
        ("Confirmation réception bordereau #FAC-2026-009 via example.com.", "Alger Centre"),
        ("Déplacement prévu vers Oran demain matin sur véhicule utilitaire 16-00999-126.", "Axe Est-Ouest"),
        ("Nouveau contact commercial temporaire: +213 555 0105.", "Blida"),
        ("Clôture inventaire fictif entrepôt zone B — vérification scellés OK.", "Hussein Dey"),
    ]
    for i in range(18):
        text, loc = topics[i % len(topics)]
        day = 18 - (i // 2)
        posts_html.append(
            f"""
            <article class="post-card" data-post-id="post-{1000 + i}">
              <header class="post-head">
                <strong>@khalid_atlas_fictif</strong>
                <time datetime="2026-11-{day:02d}T1{i % 9}:20:00Z">2026-11-{day:02d} 1{i % 9}:20</time>
                <span class="loc-badge">{loc}</span>
              </header>
              <p>{text} [Publication #{i + 1} — jeu de données synthétique Option B]</p>
              <footer class="post-meta">Likes: {12 + i * 3} · Partages: {i % 7} · Source: example.com/archive/{1000 + i}</footer>
            </article>
            """
        )

    followers_html = "".join(
        f'<li><code>@compte_test_{i:02d}</code> — <span class="muted">fictif_{i:02d}@example.com</span></li>'
        for i in range(1, 26)
    )

    json_ld = json.dumps(
        {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Khalid Atlas Fictif",
            "alternateName": "@khalid_atlas_fictif",
            "telephone": "+213 555 0199",
            "email": "khalid.fictif@example.com",
            "url": "https://social.example.com/u/khalid_atlas_fictif",
            "workLocation": {"@type": "Place", "name": "Alger Port (Test)", "geo": {"latitude": 36.7538, "longitude": 3.0588}},
        },
        ensure_ascii=False,
        indent=2,
    )

    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Archive OSINT Fictive — @khalid_atlas_fictif (example.com)</title>
  <meta property="og:title" content="Khalid Atlas Fictif (@khalid_atlas_fictif)" />
  <meta property="og:site_name" content="SocialArchive Example.com" />
  <meta name="analytics-tracker" content="UA-000000-1" />
  <script type="application/ld+json">{json_ld}</script>
  <style>
    body {{ font-family: system-ui, sans-serif; background: #0b1220; color: #e2e8f0; margin: 0; padding: 24px; }}
    .wrap {{ max-width: 880px; margin: 0 auto; }}
    .banner {{ background: linear-gradient(120deg, #1d4ed8, #0f172a); border-radius: 12px; padding: 24px; border: 1px solid #334155; }}
    .grid {{ display: grid; grid-template-columns: 2fr 1fr; gap: 18px; margin-top: 18px; }}
    .post-card, .side-card {{ background: #111c33; border: 1px solid #25334a; border-radius: 10px; padding: 14px; margin-bottom: 12px; }}
    .post-head {{ display: flex; justify-content: space-between; gap: 8px; font-size: 13px; color: #93c5fd; }}
    .loc-badge {{ background: #1e293b; color: #34d399; padding: 2px 8px; border-radius: 999px; font-size: 11px; }}
    .post-meta, .muted {{ color: #94a3b8; font-size: 12px; }}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="banner">
      <svg width="64" height="64" viewBox="0 0 64 64" aria-label="Avatar fictif">
        <circle cx="32" cy="32" r="30" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2" />
        <text x="32" y="39" text-anchor="middle" fill="#ffffff" font-size="22" font-family="sans-serif">KA</text>
      </svg>
      <h1>Khalid Atlas Fictif (<code>@khalid_atlas_fictif</code>)</h1>
      <p>Archive Web OSINT autonome (strictement fictive) · Tel : +213 555 0199 · Domaine : example.com</p>
      <p>Traceurs détectables (fictifs) : <code>UA-000000-1</code> · <code>fb-pixel-000000</code></p>
    </section>
    <div class="grid">
      <main>
        <h2>Publications archivées (18)</h2>
        {"".join(posts_html)}
      </main>
      <aside>
        <div class="side-card">
          <h3>Relations OSINT simulées (25)</h3>
          <ul>{followers_html}</ul>
        </div>
      </aside>
    </div>
  </div>
</body>
</html>
"""
    out_path.write_text(html, encoding="utf-8")


# ---------------------------------------------------------------------------
# 9. Genuine 8-second 720p CCTV Video MP4 (OpenCV)
# ---------------------------------------------------------------------------


def build_cctv_mp4(out_path: Path) -> None:
    w, h, fps = 1280, 720, 24
    total_frames = fps * 8  # 192 frames = 8 seconds
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(str(out_path), fourcc, float(fps), (w, h))
    if not writer.isOpened():
        raise RuntimeError("OpenCV VideoWriter failed to open mp4v stream")

    base_ts = dt.datetime(2026, 11, 18, 14, 22, 1)
    rng = np.random.default_rng(77)
    try:
        for f_idx in range(total_frames):
            frame = np.zeros((h, w, 3), dtype=np.uint8)
            # Twilight port asphalt background gradient + slight CCTV sensor grain
            frame[:, :] = (28, 32, 38)
            cv2.rectangle(frame, (0, 0), (w, 240), (36, 26, 20), -1)
            # Harbor buildings silhouette
            for bx in range(40, 1220, 140):
                cv2.rectangle(frame, (bx, 110), (bx + 100, 240), (50, 44, 42), -1)
                cv2.rectangle(frame, (bx + 15, 130), (bx + 35, 155), (140, 200, 230), -1)

            # Road / quay lane markings
            cv2.line(frame, (0, 240), (w, 240), (95, 95, 100), 3)
            for lx in range(30, w, 120):
                cv2.rectangle(frame, (lx, 465), (lx + 65, 475), (180, 185, 190), -1)

            # Moving fictional utility van across the scene
            prog = f_idx / max(1, total_frames - 1)
            van_x = int(-240 + prog * (w + 300))
            van_y = 330 + int(6 * math.sin(prog * 6.0))
            van_w, van_h = 280, 140

            # Van body + cab + wheels
            cv2.rectangle(frame, (van_x, van_y), (van_x + 205, van_y + van_h - 18), (225, 230, 235), -1)
            cv2.rectangle(frame, (van_x + 205, van_y + 38), (van_x + van_w, van_y + van_h - 18), (210, 218, 225), -1)
            cv2.rectangle(frame, (van_x + 215, van_y + 48), (van_x + 266, van_y + 82), (40, 60, 80), -1)
            cv2.circle(frame, (van_x + 55, van_y + van_h - 12), 24, (20, 20, 22), -1)
            cv2.circle(frame, (van_x + 235, van_y + van_h - 12), 24, (20, 20, 22), -1)
            # Fictional plate / markings
            cv2.putText(frame, "16-00999-126", (van_x + 24, van_y + 72), cv2.FONT_HERSHEY_SIMPLEX, 0.65, (30, 50, 120), 2)
            cv2.putText(frame, "FICTIF TEST", (van_x + 36, van_y + 102), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (70, 70, 80), 1)

            # Motion tracking green bounding box when van is inside frame
            if 0 <= van_x <= w - 40:
                bx1 = max(0, van_x - 8)
                bx2 = min(w - 1, van_x + van_w + 8)
                cv2.rectangle(frame, (bx1, van_y - 10), (bx2, van_y + van_h + 10), (40, 220, 110), 2)
                cv2.putText(frame, "VEHICULE TEST #01 (96%)", (bx1, max(30, van_y - 18)), cv2.FONT_HERSHEY_SIMPLEX, 0.58, (60, 240, 130), 2)

            # Slight realistic sensor noise + camera HUD overlay
            noise = rng.integers(-6, 7, size=(h, w, 3), dtype=np.int16)
            frame = np.clip(frame.astype(np.int16) + noise, 0, 255).astype(np.uint8)

            cv2.rectangle(frame, (18, 16), (620, 56), (10, 12, 16), -1)
            cur_ts = (base_ts + dt.timedelta(seconds=f_idx // fps)).strftime("%Y-%m-%d %H:%M:%S")
            cv2.putText(frame, f"CAM-ALGER-PORT-04 | {cur_ts} | FICTIF", (28, 43), cv2.FONT_HERSHEY_SIMPLEX, 0.62, (235, 245, 255), 2)

            if (f_idx // 12) % 2 == 0:
                cv2.circle(frame, (w - 95, 36), 9, (30, 30, 235), -1)
            cv2.putText(frame, "REC", (w - 78, 44), cv2.FONT_HERSHEY_SIMPLEX, 0.72, (240, 240, 255), 2)
            cv2.putText(frame, "36.7538N 3.0588E | ATHAR SYNTHETIC CCTV TEST", (20, h - 22), cv2.FONT_HERSHEY_SIMPLEX, 0.55, (180, 195, 215), 1)

            writer.write(frame)
    finally:
        writer.release()


# ---------------------------------------------------------------------------
# 10 & 11. Rich Mobile DFIR JSON + Real Populated SQLite Database
# ---------------------------------------------------------------------------


def build_dfir_json(out_path: Path) -> None:
    rng = random.Random(9001)
    base_ts = dt.datetime(2026, 11, 1, 8, 0, 0, tzinfo=dt.timezone.utc)

    packages = [
        {"package": f"com.example.fictif.app{i:02d}", "version": f"{1 + i % 4}.{i % 10}.0", "permissions": ["INTERNET", "ACCESS_FINE_LOCATION"]}
        for i in range(1, 31)
    ]
    wifi = [
        {
            "ssid": rng.choice(["FICTIONAL_CAFE_ALGER", "PORT_GUEST_TEST", "BUREAU_ATLAS_NET", "ORAN_HOTEL_FICTIF"]) + f"_{i}",
            "bssid": f"02:00:00:00:{i // 256:02x}:{i % 256:02x}",
            "rssi_dbm": rng.randint(-82, -38),
            "last_seen_utc": (base_ts + dt.timedelta(hours=i * 7)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        for i in range(1, 51)
    ]
    gps_fixes = [
        {
            "timestamp_utc": (base_ts + dt.timedelta(hours=i * 3)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "latitude": round(36.74 + rng.uniform(-0.04, 0.04), 6),
            "longitude": round(3.05 + rng.uniform(-0.05, 0.05), 6),
            "accuracy_m": rng.randint(5, 35),
            "provider": rng.choice(["gps", "fused"]),
        }
        for i in range(1, 121)
    ]
    calls = [
        {
            "timestamp_utc": (base_ts + dt.timedelta(hours=i * 4)).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "peer_msisdn": f"+21355501{rng.randint(1, 12):02d}",
            "direction": rng.choice(["INCOMING", "OUTGOING", "MISSED"]),
            "duration_sec": rng.randint(0, 420),
        }
        for i in range(1, 101)
    ]
    browser = [
        {
            "url": f"https://portal{i % 5}.example.com/dossier/fictif/{100 + i}",
            "title": f"Consultation Facture Fictive #{100 + i}",
            "visited_utc": (base_ts + dt.timedelta(hours=i * 5)).strftime("%Y-%m-%dT%H:%M:%SZ"),
        }
        for i in range(1, 61)
    ]

    payload = {
        "extraction_tool": "ALEAPP-Synthetic-Fixture",
        "case_reference": "EXEMPLE-FICTIF-2026",
        "disclaimer": "Donnees 100% fictives pour test Option B Athar",
        "device_info": {
            "manufacturer": "FictionalMobile",
            "model": "FM-Test-01",
            "android_version": "14",
            "imei_synthetic": "350000000009999",
            "owner_msisdn": "+2135550101",
        },
        "summary_counts": {
            "installed_packages": len(packages),
            "wifi_networks": len(wifi),
            "gps_fixes": len(gps_fixes),
            "call_logs": len(calls),
            "browser_history": len(browser),
        },
        "installed_packages": packages,
        "wifi_networks": wifi,
        "gps_locations": gps_fixes,
        "call_logs": calls,
        "browser_history": browser,
    }
    out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def build_dfir_sqlite(out_path: Path) -> None:
    if out_path.exists():
        out_path.unlink()
    rng = random.Random(202602)
    conn = sqlite3.connect(str(out_path))
    try:
        cur = conn.cursor()
        cur.executescript(
            """
            CREATE TABLE contacts (
                id INTEGER PRIMARY KEY,
                display_name TEXT NOT NULL,
                msisdn TEXT NOT NULL,
                email TEXT,
                note TEXT
            );
            CREATE TABLE messages (
                id INTEGER PRIMARY KEY,
                thread_id INTEGER NOT NULL,
                sender_msisdn TEXT NOT NULL,
                recipient_msisdn TEXT NOT NULL,
                sent_utc TEXT NOT NULL,
                body TEXT NOT NULL
            );
            CREATE TABLE call_log (
                id INTEGER PRIMARY KEY,
                peer_msisdn TEXT NOT NULL,
                direction TEXT NOT NULL,
                started_utc TEXT NOT NULL,
                duration_sec INTEGER NOT NULL
            );
            CREATE TABLE wifi_networks (
                id INTEGER PRIMARY KEY,
                ssid TEXT NOT NULL,
                bssid TEXT NOT NULL,
                last_connected_utc TEXT NOT NULL
            );
            CREATE TABLE gps_locations (
                id INTEGER PRIMARY KEY,
                recorded_utc TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                label TEXT NOT NULL
            );
            """
        )

        names = [
            ("Amine B. (Fictif)", "+2135550101", "amine@example.com"),
            ("Karim Exemple (Fictif)", "+2135550102", "karim@example.com"),
            ("Nabil Transit (Fictif)", "+2135550103", "nabil@example.com"),
            ("Salim Logistique (Fictif)", "+2135550104", "salim@example.com"),
            ("Compte Compta Fictif", "+2135550105", "compta@atlas-fictif.example.com"),
        ]
        for idx, (nm, tel, mail) in enumerate(names, 1):
            cur.execute("INSERT INTO contacts VALUES (?, ?, ?, ?, ?)", (idx, nm, tel, mail, "Contact test fictif"))

        base_ts = dt.datetime(2026, 11, 1, 9, 0, 0, tzinfo=dt.timezone.utc)
        msg_templates = [
            "Virement fictif confirmé pour #FAC-2026-009 (185 000 DZD).",
            "Le conteneur test est arrivé quai 4 Alger Port.",
            "Envoie le reçu BaridiMob spécimen au bureau.",
            "Rendez-vous demain 14h près de l'entrepôt fictif.",
        ]
        for i in range(1, 121):
            s = rng.choice(names)[1]
            r = rng.choice(names)[1]
            ts = (base_ts + dt.timedelta(minutes=i * 75)).strftime("%Y-%m-%dT%H:%M:%SZ")
            cur.execute("INSERT INTO messages VALUES (?, ?, ?, ?, ?, ?)", (i, (i % 5) + 1, s, r, ts, msg_templates[i % len(msg_templates)]))

        for i in range(1, 121):
            p = rng.choice(names)[1]
            ts = (base_ts + dt.timedelta(minutes=i * 95)).strftime("%Y-%m-%dT%H:%M:%SZ")
            cur.execute("INSERT INTO call_log VALUES (?, ?, ?, ?, ?)", (i, p, rng.choice(["INCOMING", "OUTGOING"]), ts, rng.randint(10, 380)))

        for i in range(1, 41):
            ts = (base_ts + dt.timedelta(hours=i * 8)).strftime("%Y-%m-%dT%H:%M:%SZ")
            cur.execute("INSERT INTO wifi_networks VALUES (?, ?, ?, ?)", (i, f"FICTIONAL_NET_{i:02d}", f"02:00:00:01:00:{i:02x}", ts))

        for i in range(1, 121):
            ts = (base_ts + dt.timedelta(hours=i * 2)).strftime("%Y-%m-%dT%H:%M:%SZ")
            cur.execute(
                "INSERT INTO gps_locations VALUES (?, ?, ?, ?, ?)",
                (i, ts, round(36.75 + rng.uniform(-0.03, 0.03), 6), round(3.05 + rng.uniform(-0.03, 0.03), 6), "Position fictive"),
            )

        conn.commit()
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# 12. Real RFC 5322 Email (.eml) with Attached BaridiMob PNG Receipt
# ---------------------------------------------------------------------------


def build_eml_with_attachment(out_path: Path, attachment_png: Path) -> None:
    msg = EmailMessage()
    msg["Return-Path"] = "<compta@atlas-fictif.example.com>"
    msg["Received"] = "from mail.atlas-fictif.example.com (192.0.2.15) by mx.example.com with ESMTPS; Wed, 18 Nov 2026 15:10:02 +0100"
    msg["From"] = "Comptabilite Fictive <compta@atlas-fictif.example.com>"
    msg["To"] = "Direction Fictive <direction@nord-fictif.example.com>"
    msg["Subject"] = "Avis de virement fictif #REF-2026-009 (+ recu BaridiMob)"
    msg["Date"] = "Wed, 18 Nov 2026 15:10:00 +0100"
    msg["Message-ID"] = "<20261118151000.009@atlas-fictif.example.com>"
    msg["Authentication-Results"] = "mx.example.com; dkim=pass header.d=atlas-fictif.example.com; spf=pass"

    plain = (
        "Bonjour,\r\n\r\n"
        "Veuillez trouver ci-joint le recu SPECIMEN FICTIF concernant l'operation:\r\n"
        "- Reference : BM-20261118-009481-TEST\r\n"
        "- Montant   : 185 000,00 DZD\r\n"
        "- RIP       : 00799999000012345678\r\n\r\n"
        "Message synthetique destine au test d'ingestion Option B.\r\n"
    )
    html = """<html><body style="font-family: sans-serif; color: #0f172a;">
      <h2>Confirmation de virement fictif — #REF-2026-009</h2>
      <p>Veuillez trouver en pièce jointe la capture <strong>SPÉCIMEN FICTIF</strong> :</p>
      <ul>
        <li><strong>RIP émetteur :</strong> <code>00799999000012345678</code></li>
        <li><strong>Montant :</strong> 185 000,00 DZD</li>
        <li><strong>Téléphone contact fictif :</strong> +213 555 0102</li>
      </ul>
      <p style="color: #64748b; font-size: 12px;">Document de test généré par scripts/generate_option_b_samples.py.</p>
    </body></html>"""

    msg.set_content(plain)
    msg.add_alternative(html, subtype="html")
    msg.add_attachment(
        attachment_png.read_bytes(),
        maintype="image",
        subtype="png",
        filename="10_recu_baridimob_fictif.png",
    )
    out_path.write_bytes(msg.as_bytes())


# ---------------------------------------------------------------------------
# 13. Multi-folder ZIP Evidence Archive
# ---------------------------------------------------------------------------


def build_zip_bundle(out_path: Path, source_files: dict[str, Path], cdr_path: Path) -> None:
    cdr_lines = cdr_path.read_text(encoding="utf-8").splitlines()[:251]
    with zipfile.ZipFile(out_path, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        zf.writestr(
            "manifest.txt",
            "Archive d'echantillons fictifs Athar Option B\nDossier: EXEMPLE-FICTIF-2026\nContenu: PDF, PNG, SQLite, HTML, CDR\n",
        )
        zf.writestr(
            "note_enqueteur.md",
            "# Note Synthétique Fictive\n\nCette archive regroupe plusieurs pièces hétérogènes fictives pour tester l'extracteur récursif d'archives.\n",
        )
        zf.writestr(
            "index_rip.csv",
            "rip,titulaire_fictif,banque\n00799999000012345678,SARL ATLAS FICTIF,Banque Exemple\n00799999000098765432,KARIM EXEMPLE,Banque Exemple\n",
        )
        zf.writestr("telecoms/cdr_extrait_250.csv", "\n".join(cdr_lines) + "\n")
        for arc_name, real_path in source_files.items():
            zf.write(real_path, arcname=arc_name)


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    photo_note = build_photo_jpeg(OUT_DIR / "01_photo_suspect_exif.jpg")
    build_receipt_png(OUT_DIR / "10_recu_baridimob_fictif.png")
    build_realistic_call_wav(OUT_DIR / "02_appel_darija_sample.wav")
    has_mp3 = download_public_optional("speech_mp3", OUT_DIR / "02b_audio_public_wikimedia.mp3")
    has_ogg = download_public_optional("fr_word_ogg", OUT_DIR / "02c_prononciation_fr_public.ogg")
    build_rich_pdf(OUT_DIR / "03_facture_sarl_fictive.pdf")
    build_cdr_csv(OUT_DIR / "04_cdr_operateur_fictif.csv", max_rows=1500)
    build_osint_html(OUT_DIR / "05_profil_osint_capture.html")
    build_cctv_mp4(OUT_DIR / "06_camerasurveillance_frame.mp4")
    build_dfir_json(OUT_DIR / "07_journal_forensique_android.json")
    build_dfir_sqlite(OUT_DIR / "07b_extraction_mobile_fictive.sqlite")
    build_eml_with_attachment(
        OUT_DIR / "08_alerte_virement_fictif.eml",
        OUT_DIR / "10_recu_baridimob_fictif.png",
    )
    build_zip_bundle(
        OUT_DIR / "09_dossier_pieces_scellees.zip",
        {
            "documents/facture_sarl_fictive.pdf": OUT_DIR / "03_facture_sarl_fictive.pdf",
            "images/recu_baridimob_fictif.png": OUT_DIR / "10_recu_baridimob_fictif.png",
            "dfir/extraction_mobile_fictive.sqlite": OUT_DIR / "07b_extraction_mobile_fictive.sqlite",
            "osint/profil_osint_capture.html": OUT_DIR / "05_profil_osint_capture.html",
        },
        OUT_DIR / "04_cdr_operateur_fictif.csv",
    )

    catalog: list[tuple[str, str, str, str]] = [
        ("01_photo_suspect_exif.jpg", "image", "image/jpeg", photo_note),
        ("10_recu_baridimob_fictif.png", "image", "image/png", "Synthetic Pillow BaridiMob receipt (1080x1600)"),
        ("02_appel_darija_sample.wav", "audio", "audio/wav", "Synthetic 15s 44.1kHz PCM WAV (DTMF + ringback + speech)"),
    ]
    if has_mp3:
        catalog.append(("02b_audio_public_wikimedia.mp3", "audio", "audio/mpeg", f"Public download ({PUBLIC_ASSETS['speech_mp3']['source']}, {PUBLIC_ASSETS['speech_mp3']['license']})"))
    if has_ogg:
        catalog.append(("02c_prononciation_fr_public.ogg", "audio", "audio/ogg", f"Public download ({PUBLIC_ASSETS['fr_word_ogg']['source']}, {PUBLIC_ASSETS['fr_word_ogg']['license']})"))

    catalog.extend([
        ("03_facture_sarl_fictive.pdf", "document", "application/pdf", "Synthetic 3-page invoice + chart + ledger (Matplotlib PDF)"),
        ("04_cdr_operateur_fictif.csv", "tabular_cdr", "text/csv", "Synthetic 1,500-row telecom CDR dataset"),
        ("05_profil_osint_capture.html", "web_osint", "text/html", "Synthetic standalone HTML5 OSINT profile archive"),
        ("06_camerasurveillance_frame.mp4", "video", "video/mp4", "Synthetic 8s 1280x720@24fps CCTV tracking MP4 (OpenCV)"),
        ("07_journal_forensique_android.json", "dfir_mobile", "application/json", "Synthetic mobile DFIR JSON extraction (300+ records)"),
        ("07b_extraction_mobile_fictive.sqlite", "dfir_mobile", "application/x-sqlite3", "Synthetic populated 5-table SQLite3 mobile extraction"),
        ("08_alerte_virement_fictif.eml", "email", "message/rfc822", "Synthetic RFC 5322 email with PNG attachment"),
        ("09_dossier_pieces_scellees.zip", "archive", "application/zip", "Multi-folder evidence ZIP archive bundling PDF/PNG/SQLite/HTML/CSV"),
    ])

    sha_lines: list[str] = []
    table_rows: list[str] = []
    for filename, family, mime, origin in catalog:
        fpath = OUT_DIR / filename
        digest = sha256_file(fpath)
        sz = fpath.stat().st_size
        sha_lines.append(f"{digest}  {filename}")
        table_rows.append(f"| `{filename}` | `{family}` | `{mime}` | {fmt_size(sz)} | {origin} | `{digest}` |")

    (OUT_DIR / "SHA256SUMS.txt").write_text("\n".join(sha_lines) + "\n", encoding="utf-8")

    readme = "\n".join(
        [
            "# Échantillons Réalistes — Test Option B (Glisser-Déposer Brut)",
            "",
            "Ces fichiers sont générés/assemblés de manière reproductible par `scripts/generate_option_b_samples.py`.",
            "Toutes les données d'enquête (noms, numéros `+213 555 01xx`, `example.com`, RIP, plaques) sont **100 % fictives**.",
            "Les médias publics téléchargés depuis Wikimedia Commons respectent leurs licences d'origine (Public Domain / CC BY-SA).",
            "",
            "| Fichier | Famille Ch. 12.4 | MIME | Taille | Origine / Licence | SHA-256 |",
            "|---|---|---|---|---|---|",
            *table_rows,
            "",
            "## Vérification locale des empreintes",
            "```bash",
            "cd doc/examples/option_b_synthetic_samples && sha256sum -c SHA256SUMS.txt",
            "```",
            "",
        ]
    )
    (OUT_DIR / "README.md").write_text(readme, encoding="utf-8")
    print(f"Generated/verified {len(catalog)} realistic Option B files in {OUT_DIR}")


if __name__ == "__main__":
    main()
