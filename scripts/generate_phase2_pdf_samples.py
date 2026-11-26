#!/usr/bin/env python3
"""Generate 5 synthetic Algerian forensic PDF documents and ground-truth .md files.

All entities (names, phone numbers +213 555 01xx, example.com domains, RIPs, plates)
are 100% fictional for Phase 2A static PDF extraction testing and benchmarking.
"""

from __future__ import annotations

import hashlib
import io
from pathlib import Path

import fitz  # PyMuPDF
from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parent.parent / "doc" / "examples" / "option_b_synthetic_samples" / "pdf"


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def make_seized_evidence_png() -> bytes:
    """Create a synthetic forensic sketch/photo PNG to embed inside PDF #5."""
    img = Image.new("RGB", (640, 260), color=(24, 32, 48))
    draw = ImageDraw.Draw(img)
    draw.rectangle([16, 16, 624, 244], outline=(16, 185, 129), width=3)
    draw.text((34, 34), "ANNEXE PHOTOGRAPHIQUE - SCELLE FICTIF #PERQ-2026-05", fill=(248, 250, 252))
    draw.rectangle([40, 80, 300, 210], fill=(38, 52, 74), outline=(56, 189, 248), width=2)
    draw.text((55, 100), "TERMINAL SAISI #1", fill=(56, 189, 248))
    draw.text((55, 130), "IMEI: 351234567890123", fill=(226, 232, 240))
    draw.text((55, 155), "MSISDN: +213 555 0171", fill=(226, 232, 240))
    draw.rectangle([330, 80, 600, 210], fill=(38, 52, 74), outline=(245, 158, 11), width=2)
    draw.text((345, 100), "VEHICULE SAISI #1", fill=(245, 158, 11))
    draw.text((345, 130), "PLAQUE: 09124-121-25", fill=(226, 232, 240))
    draw.text((345, 155), "WILAYA: CONSTANTINE", fill=(226, 232, 240))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def write_pdf_pages(
    out_pdf: Path,
    *,
    title: str,
    author: str,
    subject: str,
    pages_lines: list[list[str]],
    embedded_png: tuple[int, fitz.Rect, bytes] | None = None,
) -> None:
    """Render clean UTF-8 selectable text pages with PyMuPDF and optional embedded image."""
    doc = fitz.open()
    doc.set_metadata(
        {
            "title": title,
            "author": author,
            "subject": subject,
            "creator": "Athar Synthetic Forensic Benchmark Generator v2A",
            "producer": "PyMuPDF",
        }
    )

    for page_idx, lines in enumerate(pages_lines):
        page = doc.new_page(width=595, height=842)  # A4
        page.draw_rect(fitz.Rect(36, 32, 559, 68), color=(0.12, 0.25, 0.42), fill=(0.94, 0.96, 0.99))
        page.insert_text(
            fitz.Point(46, 54),
            f"{title} — Page {page_idx + 1}/{len(pages_lines)} (DONNEES 100% FICTIVES)",
            fontsize=10.5,
            fontname="helv",
            color=(0.08, 0.16, 0.28),
        )
        y = 94
        for line in lines:
            if line.startswith("## "):
                y += 6
                page.insert_text(fitz.Point(42, y), line[3:], fontsize=11.5, fontname="hebo", color=(0.08, 0.20, 0.36))
                y += 18
            elif line == "---":
                page.draw_line(fitz.Point(42, y - 4), fitz.Point(552, y - 4), color=(0.75, 0.8, 0.86), width=0.8)
                y += 10
            else:
                page.insert_text(fitz.Point(42, y), line, fontsize=9.8, fontname="helv", color=(0.12, 0.14, 0.18))
                y += 15

        if embedded_png is not None and embedded_png[0] == page_idx:
            page.insert_image(embedded_png[1], stream=embedded_png[2])

    doc.save(out_pdf, deflate=True)
    doc.close()


def format_ground_truth_md(
    *,
    pdf_name: str,
    description: str,
    title: str,
    author: str,
    pages: int,
    embedded_images: int,
    entities: list[tuple[str, str, str, int, str, str]],
) -> str:
    """Format expected metadata and entities as a clean Markdown benchmark file."""
    lines = [
        f"# Ground Truth — `{pdf_name}`",
        "",
        f"> {description}",
        "",
        "## Metadata",
        "",
        f"- **title**: `{title}`",
        f"- **author**: `{author}`",
        f"- **pages**: `{pages}`",
        f"- **embedded_images**: `{embedded_images}`",
        "",
        "## Expected Entities",
        "",
        "| entity_type | normalized_value | label | page | min_mode | notes |",
        "| :--- | :--- | :--- | :---: | :--- | :--- |",
    ]
    for etype, norm, label, page, min_mode, notes in entities:
        lines.append(f"| `{etype}` | `{norm}` | {label} | {page} | `{min_mode}` | {notes} |")
    lines.append("")
    return "\n".join(lines)


def build_samples() -> list[tuple[str, str, str]]:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old_txt in OUT_DIR.glob("*.txt"):
        if old_txt.name != "SHA256SUMS.txt":
            old_txt.unlink()

    manifest: list[tuple[str, str, str]] = []

    # ------------------------------------------------------------------
    # 1. PV de Plainte Escroquerie
    # ------------------------------------------------------------------
    pdf1 = OUT_DIR / "01_pv_plainte_escroquerie.pdf"
    write_pdf_pages(
        pdf1,
        title="PV DE PLAINTE N° 2026-FICTIF-01",
        author="OPJ Brigade Cybercriminalite Fictive - Alger",
        subject="Escroquerie commerciale en ligne (Piece synthetique)",
        pages_lines=[
            [
                "## PROCES-VERBAL D'AUDITION ET DE PLAINTE",
                "Reference dossier : ATHAR-FICTIF-2026-P01 | Date : 2026-11-12",
                "Unite saisie : Brigade de Recherches d'Alger - Commune de Kouba (Wilaya d'Alger)",
                "---",
                "## 1. IDENTITE DU PLAIGNANT ET DU MIS EN CAUSE",
                "Plaignant : Karim Mansouri, commercant domicilie a Kouba, Alger.",
                "Telephone plaignant : +213 555 0101",
                "Suspect : Yacine Benali, vendeur presume sur reseau social.",
                "Telephone suspect : 0661 55 01 02",
                "Courriel de contact utilise : ventes.atlas.fictif@example.com",
                "---",
                "## 2. FAITS ET SUPPORTS NUMERIQUES DECLARES",
                "Le plaignant declare avoir consulte l'annonce frauduleuse publiee sur :",
                "Site web : https://pneus-promo-fictif.example.com/offre-2026",
                "Apres echange telephonique, le suspect a exige un acompte par virement BaridiMob.",
                "Compte destinataire RIP BaridiMob : 00799999001234567890",
                "Numero de compte CCP associe : CCP 0012345678",
                "Montant du prejudice declare : 185000 DZD (virement effectue le 2026-11-10).",
                "Le present PV est etabli uniquement a des fins de test forensique synthetique.",
            ]
        ],
    )
    md1 = OUT_DIR / "01_pv_plainte_escroquerie.md"
    md1.write_text(
        format_ground_truth_md(
            pdf_name=pdf1.name,
            description="PV de plainte OPJ pour escroquerie en ligne (données 100 % fictives).",
            title="PV DE PLAINTE N° 2026-FICTIF-01",
            author="OPJ Brigade Cybercriminalite Fictive - Alger",
            pages=1,
            embedded_images=0,
            entities=[
                ("telephone", "+2135550101", "+2135550101", 1, "quick", "Téléphone du plaignant"),
                ("telephone", "+213661550102", "+213661550102", 1, "quick", "Téléphone du suspect"),
                ("compte_bancaire", "00799999001234567890", "RIP 00799999001234567890", 1, "quick", "Compte BaridiMob destinataire"),
                ("compte_bancaire", "0012345678", "CCP 0012345678", 1, "quick", "Compte CCP associé"),
                ("adresse_email", "ventes.atlas.fictif@example.com", "ventes.atlas.fictif@example.com", 1, "quick", "Courriel de contact"),
                ("site_web", "https://pneus-promo-fictif.example.com/offre-2026", "https://pneus-promo-fictif.example.com/offre-2026", 1, "quick", "URL annonce frauduleuse"),
                ("transaction_financiere", "185000 DZD", "185000 DZD", 1, "step_by_step", "Montant du virement déclaré (Stage 2)"),
                ("personne", "Karim Mansouri", "Karim Mansouri", 1, "step_by_step", "Plaignant (Stage 3)"),
                ("personne", "Yacine Benali", "Yacine Benali", 1, "step_by_step", "Suspect mis en cause (Stage 3)"),
                ("wilaya", "Alger", "Alger", 1, "step_by_step", "Wilaya (Stage 3)"),
                ("commune", "Kouba", "Kouba", 1, "step_by_step", "Commune (Stage 3)"),
            ],
        ),
        encoding="utf-8",
    )
    manifest.append((pdf1.name, md1.name, "PV de plainte OPJ (Alger / Kouba)"))

    # ------------------------------------------------------------------
    # 2. Facture Societe Ecran
    # ------------------------------------------------------------------
    pdf2 = OUT_DIR / "02_facture_societe_ecran.pdf"
    write_pdf_pages(
        pdf2,
        title="FACTURE PROFORMA N° FAC-2026-0842",
        author="Service Comptable Fictif Oran",
        subject="Facture commerciale et bon de livraison (Piece synthetique)",
        pages_lines=[
            [
                "## FACTURE COMMERCIALE ET BON DE LIVRAISON",
                "Emetteur : SARL Atlas Import Fictif",
                "Registre Commerce : RC 16/00-0912345B24 | NIF : 002416091234567",
                "Gerant : Nabil Khelifi | Contact : 0770 55 01 09",
                "Email facturation : facturation@atlas-import-fictif.example.com",
                "Siege d'expedition : Bir El Djir, Wilaya d'Oran",
                "---",
                "## CLIENT DESTINATAIRE ET LOGISTIQUE",
                "Client : EURL Nord Logistique Fictive",
                "Directrice : Samira Boudiaf",
                "Vehicule livreur immatricule : 04821-116-16",
                "---",
                "## DETAIL DES PRESTATIONS FACTUREES",
                "2026-11-04 | Lot 120 equipements pneumatiques | Montant : 420000 DZD",
                "2026-11-04 | Frais transport inter-wilayas    | Montant : 135000 DZD",
                "Total TTC facture regle par virement : 555000 DZD",
                "Reglement a effectuer sur RIP BaridiMob : 00799999009876543210",
            ]
        ],
    )
    md2 = OUT_DIR / "02_facture_societe_ecran.md"
    md2.write_text(
        format_ground_truth_md(
            pdf_name=pdf2.name,
            description="Facture commerciale entre deux sociétés fictives (Oran / Bir El Djir).",
            title="FACTURE PROFORMA N° FAC-2026-0842",
            author="Service Comptable Fictif Oran",
            pages=1,
            embedded_images=0,
            entities=[
                ("telephone", "+213770550109", "+213770550109", 1, "quick", "Téléphone contact fournisseur"),
                ("adresse_email", "facturation@atlas-import-fictif.example.com", "facturation@atlas-import-fictif.example.com", 1, "quick", "Email facturation"),
                ("compte_bancaire", "00799999009876543210", "RIP 00799999009876543210", 1, "quick", "RIP BaridiMob règlement"),
                ("vehicule", "04821-116-16", "04821-116-16", 1, "quick", "Plaque immatriculation véhicule livreur"),
                ("transaction_financiere", "420000 DZD", "420000 DZD", 1, "step_by_step", "Ligne facture 1 (Stage 2)"),
                ("transaction_financiere", "135000 DZD", "135000 DZD", 1, "step_by_step", "Ligne facture 2 (Stage 2)"),
                ("transaction_financiere", "555000 DZD", "555000 DZD", 1, "step_by_step", "Total TTC (Stage 2)"),
                ("entreprise", "SARL Atlas Import Fictif", "SARL Atlas Import Fictif", 1, "step_by_step", "Société émettrice (Stage 3)"),
                ("entreprise", "EURL Nord Logistique Fictive", "EURL Nord Logistique Fictive", 1, "step_by_step", "Société cliente (Stage 3)"),
                ("personne", "Nabil Khelifi", "Nabil Khelifi", 1, "step_by_step", "Gérant (Stage 3)"),
                ("personne", "Samira Boudiaf", "Samira Boudiaf", 1, "step_by_step", "Directrice (Stage 3)"),
                ("wilaya", "Oran", "Oran", 1, "step_by_step", "Wilaya (Stage 3)"),
                ("commune", "Bir El Djir", "Bir El Djir", 1, "step_by_step", "Commune (Stage 3)"),
            ],
        ),
        encoding="utf-8",
    )
    manifest.append((pdf2.name, md2.name, "Facture société écran (Oran / Bir El Djir)"))

    # ------------------------------------------------------------------
    # 3. Releve Bancaire / BaridiMob (2 pages)
    # ------------------------------------------------------------------
    pdf3 = OUT_DIR / "03_releve_bancaire_baridimob.pdf"
    write_pdf_pages(
        pdf3,
        title="RELEVE OPERATIONS CCP / BARIDIMOB FICTIF",
        author="Centre National Cheques Postaux Fictif",
        subject="Releve de transactions multi-pages (Piece synthetique)",
        pages_lines=[
            [
                "## RELEVE DE COMPTE CCP / BARIDIMOB",
                "Titulaire : Farid Ziani | Wilaya : Blida",
                "RIP Principal : 00799999004455667788",
                "Numero OTP lie au compte : +213 555 0144",
                "---",
                "## TABLEAU DES VIREMENTS SORTANTS (PAGE 1)",
                "2026-10-12 | Virement BaridiMob vers RIP 00799999001122334455 | 95000 DZD",
                "Beneficiaire : Mourad Saidi",
                "2026-10-14 | Virement BaridiMob vers RIP 00799999005566778899 | 140000 DZD",
                "Beneficiaire : Hichem Toumi",
            ],
            [
                "## SUITE DES OPERATIONS ET RETRAITS GAB (PAGE 2)",
                "2026-10-18 | Retrait especes guichet GAB-BLIDA-0904 | 60000 DZD",
                "2026-10-21 | Virement vers RIP 00799999001122334455 | 210000 DZD",
                "---",
                "Fin de releve synthetique - Donnees 100% fictives.",
            ],
        ],
    )
    md3 = OUT_DIR / "03_releve_bancaire_baridimob.md"
    md3.write_text(
        format_ground_truth_md(
            pdf_name=pdf3.name,
            description="Relevé multi-pages CCP / BaridiMob avec virements et retrait GAB (Blida).",
            title="RELEVE OPERATIONS CCP / BARIDIMOB FICTIF",
            author="Centre National Cheques Postaux Fictif",
            pages=2,
            embedded_images=0,
            entities=[
                ("compte_bancaire", "00799999004455667788", "RIP 00799999004455667788", 1, "quick", "RIP principal titulaire"),
                ("compte_bancaire", "00799999001122334455", "RIP 00799999001122334455", 1, "quick", "RIP destinataire 1"),
                ("compte_bancaire", "00799999005566778899", "RIP 00799999005566778899", 1, "quick", "RIP destinataire 2"),
                ("telephone", "+2135550144", "+2135550144", 1, "quick", "Téléphone OTP"),
                ("transaction_financiere", "95000 DZD", "95000 DZD", 1, "step_by_step", "Virement 2026-10-12 (Stage 2)"),
                ("transaction_financiere", "140000 DZD", "140000 DZD", 1, "step_by_step", "Virement 2026-10-14 (Stage 2)"),
                ("transaction_financiere", "60000 DZD", "60000 DZD", 2, "step_by_step", "Retrait GAB 2026-10-18 (Stage 2)"),
                ("transaction_financiere", "210000 DZD", "210000 DZD", 2, "step_by_step", "Virement 2026-10-21 (Stage 2)"),
                ("guichet_gab", "GAB-BLIDA-0904", "GAB-BLIDA-0904", 2, "step_by_step", "Guichet automatique (Stage 3)"),
                ("personne", "Farid Ziani", "Farid Ziani", 1, "step_by_step", "Titulaire compte (Stage 3)"),
                ("personne", "Mourad Saidi", "Mourad Saidi", 1, "step_by_step", "Bénéficiaire 1 (Stage 3)"),
                ("personne", "Hichem Toumi", "Hichem Toumi", 1, "step_by_step", "Bénéficiaire 2 (Stage 3)"),
                ("wilaya", "Blida", "Blida", 1, "step_by_step", "Wilaya (Stage 3)"),
            ],
        ),
        encoding="utf-8",
    )
    manifest.append((pdf3.name, md3.name, "Relevé CCP/BaridiMob 2 pages (Blida)"))

    # ------------------------------------------------------------------
    # 4. Rapport OSINT Domaine & Cyber
    # ------------------------------------------------------------------
    pdf4 = OUT_DIR / "04_rapport_osint_domaine_cyber.pdf"
    write_pdf_pages(
        pdf4,
        title="NOTE TECHNIQUE OSINT CYBER N° OSINT-2026-04",
        author="Cellule Analyse Cyber Fictive",
        subject="Infrastructure phishing et actifs crypto (Piece synthetique)",
        pages_lines=[
            [
                "## SYNTHESE D'INVESTIGATION TECHNIQUE OSINT",
                "Localisation operationnelle presumee : Wilaya d'Alger",
                "Suspect : Walid Cherif (pseudonyme utilise : dz_phantom_fictif)",
                "Telephone de recuperation : 0661 55 01 88",
                "---",
                "## INFRASTRUCTURE WEB ET RESEAU",
                "Domaine phishing principal : https://baridimob-verif-fictif.example.com/login",
                "Serveur secondaire CDN : https://cdn-pay-fictif.example.net",
                "Adresse IPv4 serveur C2 : 198.51.100.42",
                "Adresse IPv4 relais API : 203.0.113.77",
                "Email registrar WHOIS : admin-ops@hosting-fictif.example.org",
                "---",
                "## MESSAGERIE ET PORTEFEUILLES CRYPTO",
                "Canal Telegram diffuseur : @alerte_dz_fictif",
                "Lien invitation : https://t.me/alerte_dz_fictif",
                "Portefeuille Bitcoin (BTC) : bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                "Portefeuille USDT (TRC20) : TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE",
            ]
        ],
    )
    md4 = OUT_DIR / "04_rapport_osint_domaine_cyber.md"
    md4.write_text(
        format_ground_truth_md(
            pdf_name=pdf4.name,
            description="Note technique cyber/OSINT (URLs, IPv4, Telegram, Crypto, Suspect).",
            title="NOTE TECHNIQUE OSINT CYBER N° OSINT-2026-04",
            author="Cellule Analyse Cyber Fictive",
            pages=1,
            embedded_images=0,
            entities=[
                ("telephone", "+213661550188", "+213661550188", 1, "quick", "Téléphone récupération"),
                ("site_web", "https://baridimob-verif-fictif.example.com/login", "https://baridimob-verif-fictif.example.com/login", 1, "quick", "Domaine phishing principal"),
                ("site_web", "https://cdn-pay-fictif.example.net", "https://cdn-pay-fictif.example.net", 1, "quick", "Serveur CDN secondaire"),
                ("identifiant_infrastructure", "198.51.100.42", "198.51.100.42", 1, "quick", "IPv4 serveur C2"),
                ("identifiant_infrastructure", "203.0.113.77", "203.0.113.77", 1, "quick", "IPv4 relais API"),
                ("adresse_email", "admin-ops@hosting-fictif.example.org", "admin-ops@hosting-fictif.example.org", 1, "quick", "Email registrar WHOIS"),
                ("canal_telegram", "@alerte_dz_fictif", "@alerte_dz_fictif", 1, "quick", "Canal Telegram"),
                ("crypto_wallet", "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 1, "quick", "Wallet BTC"),
                ("crypto_wallet", "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", 1, "quick", "Wallet TRC20"),
                ("personne", "Walid Cherif", "Walid Cherif", 1, "step_by_step", "Suspect principal (Stage 3)"),
                ("wilaya", "Alger", "Alger", 1, "step_by_step", "Wilaya (Stage 3)"),
            ],
        ),
        encoding="utf-8",
    )
    manifest.append((pdf4.name, md4.name, "Rapport OSINT cyber & crypto (Alger)"))

    # ------------------------------------------------------------------
    # 5. PV de Perquisition & Saisie (+ Embedded Image)
    # ------------------------------------------------------------------
    pdf5 = OUT_DIR / "05_pv_perquisition_saisie.pdf"
    png_bytes = make_seized_evidence_png()
    write_pdf_pages(
        pdf5,
        title="PV DE PERQUISITION ET INVENTAIRE DES SCELLES N° 2026-05",
        author="OPJ Section Economique Fictive - Constantine",
        subject="Saisie terminaux mobiles, vehicules et especes avec planche photo",
        pages_lines=[
            [
                "## PROCES-VERBAL DE PERQUISITION ET DE SAISIE",
                "Lieu d'intervention : Constantine et peripherie de Setif",
                "Suspect : Sofiane Brahimi",
                "Temoin : Amel Haddad",
                "Courriel identifie sur poste saisi : sofiane.b.fictif@example.com",
                "---",
                "## INVENTAIRE DES BIENS ET TERMINAUX SAISIS",
                "1. Vehicule utilitaire saisi - Immatriculation : 09124-121-25",
                "2. Vehicule berline saisi - Immatriculation : 11209-119-19",
                "3. Smartphone #1 : ligne +213 555 0171 | IMEI : 351234567890123",
                "4. Smartphone #2 : ligne 0770 55 01 72 | IMEI : 359876543210987",
                "5. Somme en especes saisie sous scelle : 750000 DZD",
                "---",
                "## PLANCHE PHOTOGRAPHIQUE INTEGRÉE AU PV :",
            ]
        ],
        embedded_png=(0, fitz.Rect(48, 390, 548, 594), png_bytes),
    )
    md5 = OUT_DIR / "05_pv_perquisition_saisie.md"
    md5.write_text(
        format_ground_truth_md(
            pdf_name=pdf5.name,
            description="PV de perquisition multi-saisies avec 1 image intégrée (Constantine / Sétif).",
            title="PV DE PERQUISITION ET INVENTAIRE DES SCELLES N° 2026-05",
            author="OPJ Section Economique Fictive - Constantine",
            pages=1,
            embedded_images=1,
            entities=[
                ("vehicule", "09124-121-25", "09124-121-25", 1, "quick", "Véhicule saisi 1"),
                ("vehicule", "11209-119-19", "11209-119-19", 1, "quick", "Véhicule saisi 2"),
                ("telephone", "+2135550171", "+2135550171", 1, "quick", "Smartphone 1"),
                ("telephone", "+213770550172", "+213770550172", 1, "quick", "Smartphone 2"),
                ("adresse_email", "sofiane.b.fictif@example.com", "sofiane.b.fictif@example.com", 1, "quick", "Courriel sur poste saisi"),
                ("transaction_financiere", "750000 DZD", "750000 DZD", 1, "step_by_step", "Espèces saisies (Stage 2)"),
                ("image_preuve", "embedded_image_p1_1", "Image integree p.1 #1", 1, "step_by_step", "Planche photo intégrée (Stage 1)"),
                ("appareil_mobile", "351234567890123", "IMEI 351234567890123", 1, "step_by_step", "Smartphone 1 IMEI (Stage 3)"),
                ("appareil_mobile", "359876543210987", "IMEI 359876543210987", 1, "step_by_step", "Smartphone 2 IMEI (Stage 3)"),
                ("personne", "Sofiane Brahimi", "Sofiane Brahimi", 1, "step_by_step", "Suspect (Stage 3)"),
                ("personne", "Amel Haddad", "Amel Haddad", 1, "step_by_step", "Témoin (Stage 3)"),
                ("wilaya", "Constantine", "Constantine", 1, "step_by_step", "Wilaya 1 (Stage 3)"),
                ("wilaya", "Setif", "Setif", 1, "step_by_step", "Wilaya 2 (Stage 3)"),
            ],
        ),
        encoding="utf-8",
    )
    manifest.append((pdf5.name, md5.name, "PV de perquisition + image intégrée (Constantine / Sétif)"))

    # Checksums & README
    sha_lines: list[str] = []
    rows: list[str] = []
    for pdf_name, md_name, desc in manifest:
        pdf_path = OUT_DIR / pdf_name
        md_path = OUT_DIR / md_name
        pdf_sha = sha256_file(pdf_path)
        md_sha = sha256_file(md_path)
        sha_lines.append(f"{pdf_sha}  {pdf_name}")
        sha_lines.append(f"{md_sha}  {md_name}")
        rows.append(f"| `{pdf_name}` | `{md_name}` | {desc} | `{pdf_sha[:16]}...` |")

    (OUT_DIR / "SHA256SUMS.txt").write_text("\n".join(sha_lines) + "\n", encoding="utf-8")
    (OUT_DIR / "README.md").write_text(
        "\n".join(
            [
                "# Phase 2A — Échantillons PDF Synthétiques & Vérité Terrain (`.md`)",
                "",
                "Générés de façon reproductible par `scripts/generate_phase2_pdf_samples.py`.",
                "Toutes les entités (noms, téléphones `+213 555 01xx`, domaines `example.*`, RIP, plaques) sont **100 % fictives**.",
                "",
                "| Document PDF | Vérité Terrain (`.md`) | Scénario Forensique | SHA-256 (préfixe) |",
                "|---|---|---|---|",
                *rows,
                "",
                "## Vérification locale",
                "```bash",
                "cd doc/examples/option_b_synthetic_samples/pdf && sha256sum -c SHA256SUMS.txt",
                "```",
            ]
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Generated {len(manifest)} PDFs and {len(manifest)} ground-truth .md files in {OUT_DIR}")


if __name__ == "__main__":
    build_samples()
