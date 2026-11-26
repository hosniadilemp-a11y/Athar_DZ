# Ground Truth — `03_releve_bancaire_baridimob.pdf`

> Relevé multi-pages CCP / BaridiMob avec virements croisés et retrait GAB (Blida).

## Metadata

- **title**: `RELEVE OPERATIONS CCP / BARIDIMOB FICTIF`
- **author**: `Centre National Cheques Postaux Fictif`
- **pages**: `2`
- **embedded_images**: `0`
- **locations**: `Blida`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `compte_bancaire` | `00799999004455667788` | RIP 00799999004455667788 | 1 | `quick` | RIP principal titulaire |
| `compte_bancaire` | `00799999001122334455` | RIP 00799999001122334455 | 1 | `quick` | RIP destinataire 1 |
| `compte_bancaire` | `00799999005566778899` | RIP 00799999005566778899 | 1 | `quick` | RIP destinataire 2 |
| `compte_bancaire` | `00799999009876543210` | RIP 00799999009876543210 | 2 | `quick` | RIP croisé Facture 02 |
| `compte_bancaire` | `00799999001234567890` | RIP 00799999001234567890 | 2 | `quick` | RIP croisé PV Plainte 01 |
| `telephone` | `+2135550144` | +2135550144 | 1 | `quick` | Téléphone OTP |
| `telephone` | `+213661550188` | +213661550188 | 2 | `quick` | Téléphone croisé Rapport OSINT 04 |
| `adresse_email` | `dev.phish.fictif@example.org` | dev.phish.fictif@example.org | 2 | `quick` | Email croisé HTML Phishing 02 |
| `transaction_financiere` | `95000 DZD` | 95000 DZD | 1 | `step_by_step` | Virement 2026-10-12 (Stage 2) |
| `transaction_financiere` | `140000 DZD` | 140000 DZD | 1 | `step_by_step` | Virement 2026-10-14 (Stage 2) |
| `transaction_financiere` | `60000 DZD` | 60000 DZD | 2 | `step_by_step` | Retrait GAB 2026-10-18 (Stage 2) |
| `transaction_financiere` | `210000 DZD` | 210000 DZD | 2 | `step_by_step` | Virement 2026-10-21 (Stage 2) |
| `transaction_financiere` | `185000 DZD` | 185000 DZD | 2 | `step_by_step` | Virement 2026-10-24 (Stage 2) |
| `guichet_gab` | `GAB-BLIDA-0904` | GAB-BLIDA-0904 | 2 | `step_by_step` | Guichet automatique (Stage 3) |
| `personne` | `Farid Ziani` | Farid Ziani | 1 | `step_by_step` | Titulaire compte (Stage 3) |
| `personne` | `Mourad Saidi` | Mourad Saidi | 1 | `step_by_step` | Bénéficiaire 1 (Stage 3) |
| `personne` | `Hichem Toumi` | Hichem Toumi | 1 | `step_by_step` | Bénéficiaire 2 (Stage 3) |
| `personne` | `Yacine Benali` | Yacine Benali | 2 | `step_by_step` | Bénéficiaire croisé (Stage 3) |

## Expected Relations

| relation_type | source_type | source_value | target_type | target_value | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `RECOIT_OTP_BARIDIMOB` | `telephone` | `+2135550144` | `compte_bancaire` | `00799999004455667788` | `quick` | Téléphone OTP lié au RIP |
| `EFFECTUE_VIREMENT_VERS` | `compte_bancaire` | `00799999004455667788` | `compte_bancaire` | `00799999001122334455` | `quick` | Virement sortant (95000 DZD) |
| `IMPLIQUE_TRANSACTION` | `compte_bancaire` | `00799999001122334455` | `transaction_financiere` | `95000 DZD` | `step_by_step` | Virement 95000 DZD |
| `IMPLIQUE_TRANSACTION` | `compte_bancaire` | `00799999005566778899` | `transaction_financiere` | `140000 DZD` | `step_by_step` | Virement 140000 DZD |
| `DETIENT_COMPTE_BANCAIRE` | `personne` | `Farid Ziani` | `compte_bancaire` | `00799999004455667788` | `step_by_step` | Titulaire -> RIP principal |
| `DETIENT_COMPTE_BANCAIRE` | `personne` | `Mourad Saidi` | `compte_bancaire` | `00799999001122334455` | `step_by_step` | Bénéficiaire -> RIP destinataire 1 |
| `UTILISE_TELEPHONE` | `personne` | `Yacine Benali` | `telephone` | `+213661550188` | `step_by_step` | Contact associé |
