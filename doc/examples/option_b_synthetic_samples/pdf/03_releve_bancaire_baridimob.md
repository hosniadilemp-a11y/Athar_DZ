# Ground Truth — `03_releve_bancaire_baridimob.pdf`

> Relevé multi-pages CCP / BaridiMob avec virements et retrait GAB (Blida).

## Metadata

- **title**: `RELEVE OPERATIONS CCP / BARIDIMOB FICTIF`
- **author**: `Centre National Cheques Postaux Fictif`
- **pages**: `2`
- **embedded_images**: `0`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `compte_bancaire` | `00799999004455667788` | RIP 00799999004455667788 | 1 | `quick` | RIP principal titulaire |
| `compte_bancaire` | `00799999001122334455` | RIP 00799999001122334455 | 1 | `quick` | RIP destinataire 1 |
| `compte_bancaire` | `00799999005566778899` | RIP 00799999005566778899 | 1 | `quick` | RIP destinataire 2 |
| `telephone` | `+2135550144` | +2135550144 | 1 | `quick` | Téléphone OTP |
| `transaction_financiere` | `95000 DZD` | 95000 DZD | 1 | `step_by_step` | Virement 2026-10-12 (Stage 2) |
| `transaction_financiere` | `140000 DZD` | 140000 DZD | 1 | `step_by_step` | Virement 2026-10-14 (Stage 2) |
| `transaction_financiere` | `60000 DZD` | 60000 DZD | 2 | `step_by_step` | Retrait GAB 2026-10-18 (Stage 2) |
| `transaction_financiere` | `210000 DZD` | 210000 DZD | 2 | `step_by_step` | Virement 2026-10-21 (Stage 2) |
| `guichet_gab` | `GAB-BLIDA-0904` | GAB-BLIDA-0904 | 2 | `step_by_step` | Guichet automatique (Stage 3) |
| `personne` | `Farid Ziani` | Farid Ziani | 1 | `step_by_step` | Titulaire compte (Stage 3) |
| `personne` | `Mourad Saidi` | Mourad Saidi | 1 | `step_by_step` | Bénéficiaire 1 (Stage 3) |
| `personne` | `Hichem Toumi` | Hichem Toumi | 1 | `step_by_step` | Bénéficiaire 2 (Stage 3) |
| `wilaya` | `Blida` | Blida | 1 | `step_by_step` | Wilaya (Stage 3) |
