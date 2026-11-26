#!/usr/bin/env python3
"""Generate 5 synthetic Algerian forensic HTML pages and ground-truth .md files.

All entities (names, phone numbers +213 555 01xx, example.* domains, RFC 5737 IPs,
RIPs, plates, trackers) are 100% fictional for Phase 2A-HTML offline extraction
testing and benchmarking. Zero external network resources are referenced.
"""

from __future__ import annotations

import base64
import hashlib
import io
from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = (
    Path(__file__).resolve().parent.parent
    / "doc"
    / "examples"
    / "option_b_synthetic_samples"
    / "html"
)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def make_inline_png_b64(header: str, line1: str, line2: str, accent: tuple[int, int, int]) -> str:
    """Create a deterministic offline PNG image encoded as a base64 data URI."""
    img = Image.new("RGB", (440, 140), color=(18, 26, 40))
    draw = ImageDraw.Draw(img)
    draw.rectangle([8, 8, 432, 132], outline=accent, width=2)
    draw.text((22, 22), header, fill=(248, 250, 252))
    draw.text((22, 58), line1, fill=(203, 213, 225))
    draw.text((22, 86), line2, fill=(148, 163, 184))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    raw_b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    return f"data:image/png;base64,{raw_b64}"


def format_ground_truth_md(
    *,
    html_name: str,
    description: str,
    title: str,
    lang: str,
    canonical_url: str,
    embedded_images: int,
    forms_count: int,
    scripts_count: int,
    json_ld_blocks: int,
    comments_count: int,
    entities: list[tuple[str, str, str, str, str, str]],
) -> str:
    """Format expected metadata and entities as a clean Markdown benchmark file."""
    lines = [
        f"# Ground Truth — `{html_name}`",
        "",
        f"> {description}",
        "",
        "## Metadata",
        "",
        f"- **title**: `{title}`",
        f"- **lang**: `{lang}`",
        f"- **canonical_url**: `{canonical_url}`",
        f"- **embedded_images**: `{embedded_images}`",
        f"- **forms_count**: `{forms_count}`",
        f"- **scripts_count**: `{scripts_count}`",
        f"- **json_ld_blocks**: `{json_ld_blocks}`",
        f"- **comments_count**: `{comments_count}`",
        "",
        "## Expected Entities",
        "",
        "| entity_type | normalized_value | label | locator | min_mode | notes |",
        "| :--- | :--- | :--- | :--- | :--- | :--- |",
    ]
    for etype, norm, label, locator, min_mode, notes in entities:
        lines.append(f"| `{etype}` | `{norm}` | {label} | `{locator}` | `{min_mode}` | {notes} |")
    lines.append("")
    return "\n".join(lines)


def build_samples() -> list[tuple[str, str, str]]:
    """Return list of (html_filename, html_content, ground_truth_md_content)."""
    samples: list[tuple[str, str, str]] = []

    # ------------------------------------------------------------------
    # 1. OSINT Social Profile Capture
    # ------------------------------------------------------------------
    s1_html = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Profil OSINT Fictif — @karim_auto_fictif (example.com)</title>
  <link rel="canonical" href="https://social.example.com/u/karim_auto_fictif" />
  <meta name="author" content="Archive OSINT Cellule Cyber Fictive" />
  <meta property="og:title" content="Karim Mansouri (@karim_auto_fictif)" />
  <meta property="og:site_name" content="SocialArchive Example.com" />
  <script type="application/ld+json">{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Karim Mansouri",
    "alternateName": "@karim_auto_fictif",
    "telephone": "+213 555 0112",
    "email": "karim.auto.fictif@example.com",
    "url": "https://social.example.com/u/karim_auto_fictif",
    "workLocation": {
      "@type": "Place",
      "name": "Hussein Dey, Alger",
      "geo": { "latitude": 36.7412, "longitude": 3.0956 }
    }
  }</script>
  <script>
    window.gaId = "UA-481200-1";
    function initTracker() { fbq('init', '991122334455'); }
  </script>
</head>
<body>
  <header>
    <h1>Karim Mansouri (@karim_auto_fictif)</h1>
    <p>Contact direct : <a href="tel:+2135550112">+213 555 0112</a> · <a href="mailto:karim.auto.fictif@example.com">karim.auto.fictif@example.com</a></p>
  </header>
  <main>
    <article class="post-card" data-post-id="post-201">
      <header><strong>@karim_auto_fictif</strong> <time datetime="2026-11-15T09:30:00Z">2026-11-15 09:30</time></header>
      <p>Livraison pièces auto prévue vers Hussein Dey, Alger sur véhicule immatriculé 04821-116-16. Appelez le +213 555 0113.</p>
    </article>
    <article class="post-card" data-post-id="post-202">
      <header><strong>@karim_auto_fictif</strong> <time datetime="2026-11-16T14:15:00Z">2026-11-16 14:15</time></header>
      <p>Nouvel arrivage disponible au dépôt fictif d'Alger — règlement uniquement sur place ou via portail officiel.</p>
    </article>
  </main>
</body>
</html>
"""
    s1_md = format_ground_truth_md(
        html_name="01_profil_osint_social.html",
        description="Capture HTML d'un profil réseau social OSINT avec JSON-LD, traceurs et posts archivés (données 100 % fictives).",
        title="Profil OSINT Fictif — @karim_auto_fictif (example.com)",
        lang="fr",
        canonical_url="https://social.example.com/u/karim_auto_fictif",
        embedded_images=0,
        forms_count=0,
        scripts_count=2,
        json_ld_blocks=1,
        comments_count=0,
        entities=[
            ("site_web", "https://social.example.com/u/karim_auto_fictif", "https://social.example.com/u/karim_auto_fictif", "head:canonical", "quick", "URL canonique du profil"),
            ("identifiant_infrastructure", "UA-481200-1", "UA-481200-1", "script:tracker", "quick", "Tracker Google Analytics"),
            ("identifiant_infrastructure", "fb-pixel-991122334455", "Meta Pixel 991122334455", "script:tracker", "quick", "Pixel Meta fbq"),
            ("telephone", "+2135550112", "+2135550112", "body:text", "quick", "Téléphone principal profil"),
            ("telephone", "+2135550113", "+2135550113", "body:text", "quick", "Téléphone secondaire dans post"),
            ("adresse_email", "karim.auto.fictif@example.com", "karim.auto.fictif@example.com", "body:link", "quick", "Email profil"),
            ("vehicule", "04821-116-16", "04821-116-16", "body:text", "quick", "Plaque algérienne dans publication"),
            ("compte_social", "@karim_auto_fictif", "@karim_auto_fictif", "script:ld+json#0", "step_by_step", "Identifiant social JSON-LD (Stage 2)"),
            ("publication_sociale", "post-201", "Post #post-201 (@karim_auto_fictif)", "body:article#0", "step_by_step", "Publication archivée 1 (Stage 3)"),
            ("publication_sociale", "post-202", "Post #post-202 (@karim_auto_fictif)", "body:article#1", "step_by_step", "Publication archivée 2 (Stage 3)"),
            ("personne", "Karim Mansouri", "Karim Mansouri", "script:ld+json#0", "step_by_step", "Personne JSON-LD (Stage 3)"),
            ("wilaya", "Alger", "Alger", "body:text", "step_by_step", "Wilaya (Stage 3)"),
            ("commune", "Hussein Dey", "Hussein Dey", "body:text", "step_by_step", "Commune (Stage 3)"),
        ],
    )
    samples.append(("01_profil_osint_social.html", s1_html, s1_md))

    # ------------------------------------------------------------------
    # 2. BaridiMob Phishing Page (Form, C2 IPv4, APK, HTML Comments)
    # ------------------------------------------------------------------
    s2_html = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>BaridiMob Vérification Sécurité — Portail Fictif</title>
  <meta name="description" content="Portail fictif de démonstration phishing BaridiMob" />
  <script>
    const gtmId = "GTM-FICTIF26";
    const c2Endpoint = "http://198.51.100.88:8443/gate";
  </script>
</head>
<body>
  <!-- dev: dev.phish.fictif@example.org | support t.me/baridi_support_fictif | mule RIP 00799999004455667788 -->
  <main>
    <h1>Mise à jour obligatoire de votre compte BaridiMob (Page Test Fictive)</h1>
    <form id="phish-form" action="https://collect-otp-fictif.example.com/api/steal" method="post">
      <label>Numéro carte / téléphone : <input type="text" name="phone" /></label>
      <button type="submit">Valider</button>
    </form>
    <p>Téléchargez l'application de sécurité :
      <a href="https://cdn-apk-fictif.example.net/downloads/baridimob-update-fictif.apk">baridimob-update-fictif.apk</a>
    </p>
    <footer>Assistance technique fictive : <a href="tel:+2135550124">+213 555 0124</a></footer>
  </main>
</body>
</html>
"""
    s2_md = format_ground_truth_md(
        html_name="02_page_phishing_baridimob.html",
        description="Page de phishing BaridiMob fictive avec formulaire d'exfiltration, IP C2, APK et commentaires HTML cachés.",
        title="BaridiMob Vérification Sécurité — Portail Fictif",
        lang="fr",
        canonical_url="",
        embedded_images=0,
        forms_count=1,
        scripts_count=1,
        json_ld_blocks=0,
        comments_count=1,
        entities=[
            ("site_web", "https://collect-otp-fictif.example.com/api/steal", "https://collect-otp-fictif.example.com/api/steal", "form:action#0", "quick", "Cible POST du formulaire phishing"),
            ("site_web", "https://cdn-apk-fictif.example.net/downloads/baridimob-update-fictif.apk", "https://cdn-apk-fictif.example.net/downloads/baridimob-update-fictif.apk", "body:link", "quick", "URL distribution APK"),
            ("fichier_apk", "baridimob-update-fictif.apk", "baridimob-update-fictif.apk", "body:link", "quick", "Package APK malveillant fictif"),
            ("serveur_c2", "198.51.100.88", "198.51.100.88", "script:inline#0", "quick", "IPv4 serveur C2 dans script"),
            ("identifiant_infrastructure", "GTM-FICTIF26", "GTM-FICTIF26", "script:tracker", "quick", "Google Tag Manager fictif"),
            ("adresse_email", "dev.phish.fictif@example.org", "dev.phish.fictif@example.org", "html:comment#0", "quick", "Email développeur en commentaire HTML"),
            ("canal_telegram", "@baridi_support_fictif", "@baridi_support_fictif", "html:comment#0", "quick", "Canal Telegram en commentaire HTML"),
            ("compte_bancaire", "00799999004455667788", "RIP 00799999004455667788", "html:comment#0", "quick", "RIP mule en commentaire HTML"),
            ("telephone", "+2135550124", "+2135550124", "body:link", "quick", "Faux numéro assistance"),
        ],
    )
    samples.append(("02_page_phishing_baridimob.html", s2_html, s2_md))

    # ------------------------------------------------------------------
    # 3. Marketplace Scam Listing (JSON-LD Offer, Inline Image, Company)
    # ------------------------------------------------------------------
    s3_img_uri = make_inline_png_b64(
        "CAPTURE ANNONCE SCAM FICTIVE",
        "SARL Atlas Motors Fictive — Oran",
        "Plaque: 31045-120-31 | 450 000 DZD",
        (244, 63, 94),
    )
    s3_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Promo Véhicule &amp; Pièces — SARL Atlas Motors Fictive (example.com)</title>
  <link rel="canonical" href="https://souk-auto-fictif.example.com/annonce/8841" />
  <script type="application/ld+json">{{
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Lot pièces moteur utilitaire — Offre Test",
    "offers": {{
      "@type": "Offer",
      "price": "450000",
      "priceCurrency": "DZD",
      "seller": {{
        "@type": "Organization",
        "name": "SARL Atlas Motors Fictive"
      }}
    }}
  }}</script>
</head>
<body>
  <article class="listing-card" data-post-id="annonce-8841">
    <h1>Lot pièces moteur — SARL Atlas Motors Fictive</h1>
    <img src="{s3_img_uri}" alt="Photo annonce fictive" />
    <p>Vendeur : @atlas_motors_dz · Gérant : Yacine Benali</p>
    <p>SARL Atlas Motors Fictive (RC: 16/00-2211445B26 | NIF: 002631009988776) — Bir El Djir, Oran.</p>
    <p>Acompte demandé : 450 000 DZD via BaridiMob RIP 00799999008877665544.</p>
    <p>Livraison véhicule : 31045-120-31 · Contact : <a href="tel:+2135550135">+213 555 0135</a> · <a href="mailto:ventes@atlas-motors-fictif.example.com">ventes@atlas-motors-fictif.example.com</a></p>
  </article>
</body>
</html>
"""
    s3_md = format_ground_truth_md(
        html_name="03_annonce_marketplace_scam.html",
        description="Annonce marketplace frauduleuse fictive avec JSON-LD Product/Offer, image base64 intégrée, société et RIP.",
        title="Promo Véhicule & Pièces — SARL Atlas Motors Fictive (example.com)",
        lang="fr",
        canonical_url="https://souk-auto-fictif.example.com/annonce/8841",
        embedded_images=1,
        forms_count=0,
        scripts_count=1,
        json_ld_blocks=1,
        comments_count=0,
        entities=[
            ("site_web", "https://souk-auto-fictif.example.com/annonce/8841", "https://souk-auto-fictif.example.com/annonce/8841", "head:canonical", "quick", "URL annonce canonique"),
            ("telephone", "+2135550135", "+2135550135", "body:link", "quick", "Téléphone vendeur"),
            ("adresse_email", "ventes@atlas-motors-fictif.example.com", "ventes@atlas-motors-fictif.example.com", "body:link", "quick", "Email vendeur"),
            ("compte_bancaire", "00799999008877665544", "RIP 00799999008877665544", "body:text", "quick", "RIP réception acompte"),
            ("vehicule", "31045-120-31", "31045-120-31", "body:text", "quick", "Plaque véhicule"),
            ("image_preuve", "embedded_html_img_1", "Image intégrée HTML #1", "body:img#0", "step_by_step", "Image base64 embarquée (Stage 1)"),
            ("compte_social", "@atlas_motors_dz", "@atlas_motors_dz", "body:text", "step_by_step", "Compte vendeur (Stage 2)"),
            ("transaction_financiere", "450000 DZD", "450000 DZD", "script:ld+json#0", "step_by_step", "Prix/acompte DZD (Stage 2)"),
            ("publication_sociale", "annonce-8841", "Post #annonce-8841", "body:article#0", "step_by_step", "Annonce archivée (Stage 3)"),
            ("entreprise", "SARL Atlas Motors Fictive", "SARL Atlas Motors Fictive", "script:ld+json#0", "step_by_step", "Entreprise vendeuse (Stage 3)"),
            ("personne", "Yacine Benali", "Yacine Benali", "body:text", "step_by_step", "Gérant mentionné (Stage 3)"),
            ("wilaya", "Oran", "Oran", "body:text", "step_by_step", "Wilaya (Stage 3)"),
            ("commune", "Bir El Djir", "Bir El Djir", "body:text", "step_by_step", "Commune (Stage 3)"),
        ],
    )
    samples.append(("03_annonce_marketplace_scam.html", s3_html, s3_md))

    # ------------------------------------------------------------------
    # 4. Telegram Web Channel Export (Messages, Crypto, RIP, Blida)
    # ------------------------------------------------------------------
    s4_html = """<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>Export Telegram Web — @p2p_dz_fictif</title>
  <meta property="og:url" content="https://t.me/p2p_dz_fictif" />
</head>
<body>
  <header class="tg-channel-head">
    <h1>Canal Telegram @p2p_dz_fictif</h1>
    <p>Admin : @walid_change_dz · Localisation : Boufarik, Blida</p>
  </header>
  <section class="tg-history">
    <div class="message" data-msg-id="msg-401" data-sender="@walid_change_dz">
      <time datetime="2026-11-20T10:12:00Z">2026-11-20 10:12</time>
      <p>Offre USDT TRC20 disponible : envoyez 320 000 DZD vers RIP 00799999001122334455 puis validez sur https://p2p-escrow-fictif.example.org/order/99</p>
    </div>
    <div class="message" data-msg-id="msg-402" data-sender="@walid_change_dz">
      <time datetime="2026-11-20T10:18:00Z">2026-11-20 10:18</time>
      <p>Adresses crypto fictives : TRC20 TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE et BTC bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh · Tél : +213 555 0148</p>
    </div>
  </section>
</body>
</html>
"""
    s4_md = format_ground_truth_md(
        html_name="04_export_canal_telegram_web.html",
        description="Export HTML statique d'un canal Telegram Web P2P crypto fictif (messages, wallets BTC/TRC20, RIP, Blida/Boufarik).",
        title="Export Telegram Web — @p2p_dz_fictif",
        lang="fr",
        canonical_url="",
        embedded_images=0,
        forms_count=0,
        scripts_count=0,
        json_ld_blocks=0,
        comments_count=0,
        entities=[
            ("canal_telegram", "@p2p_dz_fictif", "@p2p_dz_fictif", "head:meta", "quick", "Canal Telegram exporté"),
            ("site_web", "https://p2p-escrow-fictif.example.org/order/99", "https://p2p-escrow-fictif.example.org/order/99", "body:text", "quick", "Lien escrow frauduleux"),
            ("compte_bancaire", "00799999001122334455", "RIP 00799999001122334455", "body:text", "quick", "RIP de collecte DZD"),
            ("crypto_wallet", "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", "body:text", "quick", "Wallet TRON TRC-20"),
            ("crypto_wallet", "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", "body:text", "quick", "Wallet Bitcoin Bech32"),
            ("telephone", "+2135550148", "+2135550148", "body:text", "quick", "Téléphone de contact"),
            ("compte_social", "@walid_change_dz", "@walid_change_dz", "body:text", "step_by_step", "Administrateur canal (Stage 2)"),
            ("transaction_financiere", "320000 DZD", "320000 DZD", "body:text", "step_by_step", "Montant transaction P2P (Stage 2)"),
            ("message_chat", "msg-401", "Message #msg-401 (@walid_change_dz)", "body:message#0", "step_by_step", "Message Telegram 1 (Stage 3)"),
            ("message_chat", "msg-402", "Message #msg-402 (@walid_change_dz)", "body:message#1", "step_by_step", "Message Telegram 2 (Stage 3)"),
            ("wilaya", "Blida", "Blida", "body:text", "step_by_step", "Wilaya (Stage 3)"),
            ("commune", "Boufarik", "Boufarik", "body:text", "step_by_step", "Commune (Stage 3)"),
        ],
    )
    samples.append(("04_export_canal_telegram_web.html", s4_html, s4_md))

    # ------------------------------------------------------------------
    # 5. Shell Company Showcase & Legal Notice (Table, GAB, Tracker, Logo)
    # ------------------------------------------------------------------
    s5_logo_uri = make_inline_png_b64(
        "EURL NUMIDIA LOGISTIQUE FICTIVE",
        "Constantine / El Khroub",
        "RC 25/00-7788991B26",
        (16, 185, 129),
    )
    s5_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>EURL Numidia Logistique Fictive — Mentions Légales</title>
  <link rel="canonical" href="https://numidia-log-fictif.example.com/mentions-legales" />
  <script>
    window.ga4 = "G-FICTIF2026";
  </script>
</head>
<body>
  <header>
    <img src="{s5_logo_uri}" alt="Logo fictif Numidia Logistique" />
    <h1>EURL Numidia Logistique Fictive</h1>
  </header>
  <section class="mentions-legales">
    <p>Raison sociale : EURL Numidia Logistique Fictive · RC: 25/00-7788991B26 · NIF: 002625007788991</p>
    <p>Directrice : Samira Khelifi · Siège fictif : El Khroub, Constantine.</p>
    <p>Email officiel : <a href="mailto:contact@numidia-log-fictif.example.com">contact@numidia-log-fictif.example.com</a> · Tél : +213 555 0162</p>
  </section>
  <section class="coordonnees-bancaires">
    <h2>Relevé d'opérations et guichets (Données Test)</h2>
    <table>
      <thead>
        <tr><th>Date</th><th>Compte RIP</th><th>Guichet GAB</th><th>Montant</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>2026-11-19</td>
          <td>00799999006655443322</td>
          <td>GAB-CST-04</td>
          <td>540 000 DZD</td>
        </tr>
      </tbody>
    </table>
  </section>
</body>
</html>
"""
    s5_md = format_ground_truth_md(
        html_name="05_site_societe_ecran_mentions.html",
        description="Site vitrine et mentions légales d'une société écran fictive avec tableau HTML bancaire, GAB, tracker GA4 et logo base64.",
        title="EURL Numidia Logistique Fictive — Mentions Légales",
        lang="fr",
        canonical_url="https://numidia-log-fictif.example.com/mentions-legales",
        embedded_images=1,
        forms_count=0,
        scripts_count=1,
        json_ld_blocks=0,
        comments_count=0,
        entities=[
            ("site_web", "https://numidia-log-fictif.example.com/mentions-legales", "https://numidia-log-fictif.example.com/mentions-legales", "head:canonical", "quick", "URL canonique mentions légales"),
            ("identifiant_infrastructure", "G-FICTIF2026", "G-FICTIF2026", "script:tracker", "quick", "Tracker GA4 fictif"),
            ("adresse_email", "contact@numidia-log-fictif.example.com", "contact@numidia-log-fictif.example.com", "body:link", "quick", "Email société"),
            ("telephone", "+2135550162", "+2135550162", "body:text", "quick", "Téléphone société"),
            ("compte_bancaire", "00799999006655443322", "RIP 00799999006655443322", "body:table#0:r1", "quick", "RIP dans tableau HTML"),
            ("image_preuve", "embedded_html_img_1", "Image intégrée HTML #1", "body:img#0", "step_by_step", "Logo base64 intégré (Stage 1)"),
            ("transaction_financiere", "540000 DZD", "540000 DZD", "body:table#0:r1", "step_by_step", "Montant tableau HTML (Stage 2)"),
            ("entreprise", "EURL Numidia Logistique Fictive", "EURL Numidia Logistique Fictive", "body:text", "step_by_step", "Société mentions légales (Stage 3)"),
            ("personne", "Samira Khelifi", "Samira Khelifi", "body:text", "step_by_step", "Directrice mentionnée (Stage 3)"),
            ("guichet_gab", "GAB-CST-04", "GAB-CST-04", "body:table#0:r1", "step_by_step", "Guichet GAB dans tableau (Stage 3)"),
            ("wilaya", "Constantine", "Constantine", "body:text", "step_by_step", "Wilaya (Stage 3)"),
            ("commune", "El Khroub", "El Khroub", "body:text", "step_by_step", "Commune (Stage 3)"),
        ],
    )
    samples.append(("05_site_societe_ecran_mentions.html", s5_html, s5_md))

    return samples


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    samples = build_samples()
    checksum_lines: list[str] = []
    readme_rows: list[str] = []

    for html_name, html_content, md_content in samples:
        html_path = OUT_DIR / html_name
        md_name = html_name.replace(".html", ".md")
        md_path = OUT_DIR / md_name

        html_path.write_text(html_content, encoding="utf-8")
        md_path.write_text(md_content, encoding="utf-8")

        digest = sha256_file(html_path)
        checksum_lines.append(f"{digest}  {html_name}")
        checksum_lines.append(f"{sha256_file(md_path)}  {md_name}")
        readme_rows.append(
            f"| `{html_name}` | `{md_name}` | `{digest[:16]}...` |"
        )

    (OUT_DIR / "SHA256SUMS.txt").write_text("\n".join(checksum_lines) + "\n", encoding="utf-8")
    readme_content = "\n".join(
        [
            "# Phase 2A-HTML — Échantillons HTML Synthétiques & Vérité Terrain (`.md`)",
            "",
            "Générés de façon reproductible par `scripts/generate_phase2_html_samples.py`.",
            "Toutes les entités (noms, téléphones `+213 555 01xx`, domaines `example.*`, IP RFC 5737, RIP, plaques, traceurs) sont **100 % fictives** et 100 % hors-ligne.",
            "",
            "| Page HTML | Vérité Terrain (`.md`) | SHA-256 (préfixe) |",
            "|---|---|---|",
            *readme_rows,
            "",
            "## Vérification locale",
            "```bash",
            "cd doc/examples/option_b_synthetic_samples/html && sha256sum -c SHA256SUMS.txt",
            "```",
            "",
        ]
    )
    (OUT_DIR / "README.md").write_text(readme_content, encoding="utf-8")
    print(f"Generated {len(samples)} synthetic HTML benchmarks in {OUT_DIR}")


if __name__ == "__main__":
    main()
