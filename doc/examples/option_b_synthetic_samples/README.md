# Échantillons Réalistes — Test Option B (Glisser-Déposer Brut)

Ces fichiers sont générés/assemblés de manière reproductible par `scripts/generate_option_b_samples.py`.
Toutes les données d'enquête (noms, numéros `+213 555 01xx`, `example.com`, RIP, plaques) sont **100 % fictives**.
Les médias publics téléchargés depuis Wikimedia Commons respectent leurs licences d'origine (Public Domain / CC BY-SA).

| Fichier | Famille Ch. 12.4 | MIME | Taille | Origine / Licence | SHA-256 |
|---|---|---|---|---|---|
| `01_photo_suspect_exif.jpg` | `image` | `image/jpeg` | 1.09 MB | Public download (Wikimedia Commons, CC BY-SA 4.0) + synthetic EXIF | `e10f48e820c801e9381cbb812a6e85043cd131507ce8b3e2615839916d434c58` |
| `10_recu_baridimob_fictif.png` | `image` | `image/png` | 124.9 KB | Synthetic Pillow BaridiMob receipt (1080x1600) | `a1f4becad29182d6a409e9436fde540a41275e8e00246a503eced95d80a974e3` |
| `02_appel_darija_sample.wav` | `audio` | `audio/wav` | 1.26 MB | Synthetic 15s 44.1kHz PCM WAV (DTMF + ringback + speech) | `d3785f5b559a789e78f40a0facbcbcf8a722a45f7f7c0a1197990ad5d993b5dd` |
| `02b_audio_public_wikimedia.mp3` | `audio` | `audio/mpeg` | 1.43 MB | Public download (Wikimedia Commons / DPLA — Horatio Alger Remarks, Public domain) | `d6f1bad69279c646577b01b20945cb97a85b12bf23831028b41dc1ab669f6cb8` |
| `02c_prononciation_fr_public.ogg` | `audio` | `audio/ogg` | 16.4 KB | Public download (Wikimedia Commons — File:Fr-arsenalisation.ogg (Lingua Libre), CC BY-SA 3.0) | `0fd71ff074ea0e3f60f321c6be813709558f6a328a685f6ca5192bb6867ce103` |
| `03_facture_sarl_fictive.pdf` | `document` | `application/pdf` | 54.2 KB | Synthetic 3-page invoice + chart + ledger (Matplotlib PDF) | `d480d9652f01ddf6aa68d01bcd5ee55bbd4e70492880fdde343835a5a65e595d` |
| `04_cdr_operateur_fictif.csv` | `tabular_cdr` | `text/csv` | 221.1 KB | Synthetic 1,500-row telecom CDR dataset | `8ef82d75fbcdeac1b0b178e0f037ebf371f24a3178db5ed037c4b772bb901389` |
| `05_profil_osint_capture.html` | `web_osint` | `text/html` | 15.7 KB | Synthetic standalone HTML5 OSINT profile archive | `f3fa7592385aaf20b2ac069cf16cf2080b446a6cfda57224c7d3938f9a3f376e` |
| `06_camerasurveillance_frame.mp4` | `video` | `video/mp4` | 2.11 MB | Synthetic 8s 1280x720@24fps CCTV tracking MP4 (OpenCV) | `e0553589c168e04d39e00817f6bf60672fa7b094fd5e8631371133f239dce7eb` |
| `07_journal_forensique_android.json` | `dfir_mobile` | `application/json` | 57.5 KB | Synthetic mobile DFIR JSON extraction (300+ records) | `a5b0509e1461802396317cb0c7a996bdb90881ca43f8585a777dc77c44475eff` |
| `07b_extraction_mobile_fictive.sqlite` | `dfir_mobile` | `application/x-sqlite3` | 56.0 KB | Synthetic populated 5-table SQLite3 mobile extraction | `7303f93c7286cfac5fd30d0833b91dc8b784d618e8d497bd6ccd431b7e90d1de` |
| `08_alerte_virement_fictif.eml` | `email` | `message/rfc822` | 170.9 KB | Synthetic RFC 5322 email with PNG attachment | `1e2cd55f9e1a90b7979d227626e859da4fddb50ca98d7586e14ad0232ac384e9` |
| `09_dossier_pieces_scellees.zip` | `archive` | `application/zip` | 167.6 KB | Multi-folder evidence ZIP archive bundling PDF/PNG/SQLite/HTML/CSV | `83240cc0265e1d06a935276a7dfe0810f53e0ba2f801e1a712803e562158662a` |

## Vérification locale des empreintes
```bash
cd doc/examples/option_b_synthetic_samples && sha256sum -c SHA256SUMS.txt
```
