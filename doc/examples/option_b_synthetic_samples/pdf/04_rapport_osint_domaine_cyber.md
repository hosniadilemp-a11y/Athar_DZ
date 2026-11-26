# Ground Truth — `04_rapport_osint_domaine_cyber.pdf`

> Note technique cyber/OSINT (URLs, IPv4, Telegram, Crypto, Suspect).

## Metadata

- **title**: `NOTE TECHNIQUE OSINT CYBER N° OSINT-2026-04`
- **author**: `Cellule Analyse Cyber Fictive`
- **pages**: `1`
- **embedded_images**: `0`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `telephone` | `+213661550188` | +213661550188 | 1 | `quick` | Téléphone récupération |
| `site_web` | `https://baridimob-verif-fictif.example.com/login` | https://baridimob-verif-fictif.example.com/login | 1 | `quick` | Domaine phishing principal |
| `site_web` | `https://cdn-pay-fictif.example.net` | https://cdn-pay-fictif.example.net | 1 | `quick` | Serveur CDN secondaire |
| `identifiant_infrastructure` | `198.51.100.42` | 198.51.100.42 | 1 | `quick` | IPv4 serveur C2 |
| `identifiant_infrastructure` | `203.0.113.77` | 203.0.113.77 | 1 | `quick` | IPv4 relais API |
| `adresse_email` | `admin-ops@hosting-fictif.example.org` | admin-ops@hosting-fictif.example.org | 1 | `quick` | Email registrar WHOIS |
| `canal_telegram` | `@alerte_dz_fictif` | @alerte_dz_fictif | 1 | `quick` | Canal Telegram |
| `crypto_wallet` | `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh` | bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh | 1 | `quick` | Wallet BTC |
| `crypto_wallet` | `TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE` | TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE | 1 | `quick` | Wallet TRC20 |
| `personne` | `Walid Cherif` | Walid Cherif | 1 | `step_by_step` | Suspect principal (Stage 3) |
| `wilaya` | `Alger` | Alger | 1 | `step_by_step` | Wilaya (Stage 3) |
