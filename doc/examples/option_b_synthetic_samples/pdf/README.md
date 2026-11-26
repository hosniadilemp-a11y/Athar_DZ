# Phase 2A — Échantillons PDF Synthétiques & Vérité Terrain (`.md`)

Générés de façon reproductible par `scripts/generate_phase2_pdf_samples.py`.
Toutes les entités (noms, téléphones `+213 555 01xx`, domaines `example.*`, RIP, plaques) sont **100 % fictives**.

| Document PDF | Vérité Terrain (`.md`) | Scénario Forensique | SHA-256 (préfixe) |
|---|---|---|---|
| `01_pv_plainte_escroquerie.pdf` | `01_pv_plainte_escroquerie.md` | PV de plainte OPJ (Alger / Kouba) | `a33d7ab3fbeebe49...` |
| `02_facture_societe_ecran.pdf` | `02_facture_societe_ecran.md` | Facture société écran (Oran / Bir El Djir) | `8a2079248c820b37...` |
| `03_releve_bancaire_baridimob.pdf` | `03_releve_bancaire_baridimob.md` | Relevé CCP/BaridiMob 2 pages (Blida) | `62526780914b0e16...` |
| `04_rapport_osint_domaine_cyber.pdf` | `04_rapport_osint_domaine_cyber.md` | Rapport OSINT cyber & crypto (Alger) | `1a987cd32bfac062...` |
| `05_pv_perquisition_saisie.pdf` | `05_pv_perquisition_saisie.md` | PV de perquisition + image intégrée (Constantine / Sétif) | `a78852f6ecc970bd...` |

## Vérification locale
```bash
cd doc/examples/option_b_synthetic_samples/pdf && sha256sum -c SHA256SUMS.txt
```
