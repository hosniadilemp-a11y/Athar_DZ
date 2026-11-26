# Phase 2A-HTML — Échantillons HTML Synthétiques & Vérité Terrain (`.md`)

Générés de façon reproductible par `scripts/generate_phase2_html_samples.py`.
Toutes les entités (noms, téléphones `+213 555 01xx`, domaines `example.*`, IP RFC 5737, RIP, plaques, traceurs) sont **100 % fictives** et 100 % hors-ligne.

| Page HTML | Vérité Terrain (`.md`) | SHA-256 (préfixe) |
|---|---|---|
| `01_profil_osint_social.html` | `01_profil_osint_social.md` | `e01d0d2177243e08...` |
| `02_page_phishing_baridimob.html` | `02_page_phishing_baridimob.md` | `0b88d14b2f32841a...` |
| `03_annonce_marketplace_scam.html` | `03_annonce_marketplace_scam.md` | `4a7b6145fd8bab5f...` |
| `04_export_canal_telegram_web.html` | `04_export_canal_telegram_web.md` | `4956b7b061b485c5...` |
| `05_site_societe_ecran_mentions.html` | `05_site_societe_ecran_mentions.md` | `d2b20ac7043ff0a2...` |

## Vérification locale
```bash
cd doc/examples/option_b_synthetic_samples/html && sha256sum -c SHA256SUMS.txt
```
