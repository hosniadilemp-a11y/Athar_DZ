# Ground Truth — `01_pv_plainte_escroquerie.pdf`

> PV de plainte OPJ pour escroquerie en ligne (données 100 % fictives).

## Metadata

- **title**: `PV DE PLAINTE N° 2026-FICTIF-01`
- **author**: `OPJ Brigade Cybercriminalite Fictive - Alger`
- **pages**: `1`
- **embedded_images**: `0`
- **locations**: `Alger; Kouba`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `telephone` | `+2135550101` | +2135550101 | 1 | `quick` | Téléphone du plaignant |
| `telephone` | `+213661550102` | +213661550102 | 1 | `quick` | Téléphone du suspect |
| `compte_bancaire` | `00799999001234567890` | RIP 00799999001234567890 | 1 | `quick` | Compte BaridiMob destinataire (inclut CCP 0012345678) |
| `adresse_email` | `ventes.atlas.fictif@example.com` | ventes.atlas.fictif@example.com | 1 | `quick` | Courriel de contact |
| `site_web` | `https://pneus-promo-fictif.example.com/offre-2026` | https://pneus-promo-fictif.example.com/offre-2026 | 1 | `quick` | URL annonce frauduleuse |
| `transaction_financiere` | `185000 DZD` | 185000 DZD | 1 | `step_by_step` | Montant du virement déclaré (Stage 2) |
| `personne` | `Karim Mansouri` | Karim Mansouri | 1 | `step_by_step` | Plaignant (Stage 3) |
| `personne` | `Yacine Benali` | Yacine Benali | 1 | `step_by_step` | Suspect mis en cause (Stage 3) |

## Expected Relations

| relation_type | source_type | source_value | target_type | target_value | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `UTILISE_EMAIL` | `site_web` | `https://pneus-promo-fictif.example.com/offre-2026` | `adresse_email` | `ventes.atlas.fictif@example.com` | `quick` | Site lié au courriel |
| `UTILISE_TELEPHONE` | `personne` | `Karim Mansouri` | `telephone` | `+2135550101` | `step_by_step` | Plaignant -> téléphone |
| `UTILISE_TELEPHONE` | `personne` | `Yacine Benali` | `telephone` | `+213661550102` | `step_by_step` | Suspect -> téléphone |
| `DETIENT_COMPTE_BANCAIRE` | `personne` | `Yacine Benali` | `compte_bancaire` | `00799999001234567890` | `step_by_step` | Coréférence suspect -> compte destinataire |
| `IMPLIQUE_TRANSACTION` | `compte_bancaire` | `00799999001234567890` | `transaction_financiere` | `185000 DZD` | `step_by_step` | Compte destinataire -> montant préjudice |
