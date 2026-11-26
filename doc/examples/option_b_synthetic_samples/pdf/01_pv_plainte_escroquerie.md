# Ground Truth — `01_pv_plainte_escroquerie.pdf`

> PV de plainte OPJ pour escroquerie en ligne (données 100 % fictives).

## Metadata

- **title**: `PV DE PLAINTE N° 2026-FICTIF-01`
- **author**: `OPJ Brigade Cybercriminalite Fictive - Alger`
- **pages**: `1`
- **embedded_images**: `0`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `telephone` | `+2135550101` | +2135550101 | 1 | `quick` | Téléphone du plaignant |
| `telephone` | `+213661550102` | +213661550102 | 1 | `quick` | Téléphone du suspect |
| `compte_bancaire` | `00799999001234567890` | RIP 00799999001234567890 | 1 | `quick` | Compte BaridiMob destinataire |
| `compte_bancaire` | `0012345678` | CCP 0012345678 | 1 | `quick` | Compte CCP associé |
| `adresse_email` | `ventes.atlas.fictif@example.com` | ventes.atlas.fictif@example.com | 1 | `quick` | Courriel de contact |
| `site_web` | `https://pneus-promo-fictif.example.com/offre-2026` | https://pneus-promo-fictif.example.com/offre-2026 | 1 | `quick` | URL annonce frauduleuse |
| `transaction_financiere` | `185000 DZD` | 185000 DZD | 1 | `step_by_step` | Montant du virement déclaré (Stage 2) |
| `personne` | `Karim Mansouri` | Karim Mansouri | 1 | `step_by_step` | Plaignant (Stage 3) |
| `personne` | `Yacine Benali` | Yacine Benali | 1 | `step_by_step` | Suspect mis en cause (Stage 3) |
| `wilaya` | `Alger` | Alger | 1 | `step_by_step` | Wilaya (Stage 3) |
| `commune` | `Kouba` | Kouba | 1 | `step_by_step` | Commune (Stage 3) |
