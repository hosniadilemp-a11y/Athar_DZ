# Phase 2A-HTML — Échantillons HTML Synthétiques & Vérité Terrain (`.md`)

Générés de façon reproductible par `scripts/generate_phase2_html_samples.py`.
Toutes les entités (noms, téléphones `+213 555 01xx`, domaines `example.*`, IP RFC 5737, RIP, plaques, traceurs) sont **100 % fictives** et 100 % hors-ligne.

| Page HTML | Vérité Terrain (`.md`) | SHA-256 (préfixe) |
|---|---|---|
| `01_profil_osint_social.html` | `01_profil_osint_social.md` | `6d83ea4074dd0e14...` |
| `02_page_phishing_baridimob.html` | `02_page_phishing_baridimob.md` | `86ce7e224d3c6017...` |
| `03_annonce_marketplace_scam.html` | `03_annonce_marketplace_scam.md` | `d4498df341d2a9ea...` |
| `04_export_canal_telegram_web.html` | `04_export_canal_telegram_web.md` | `dab38a14fc676294...` |
| `05_site_societe_ecran_mentions.html` | `05_site_societe_ecran_mentions.md` | `6766d298380d5296...` |

## Vérification locale
```bash
cd doc/examples/option_b_synthetic_samples/html && sha256sum -c SHA256SUMS.txt
```
