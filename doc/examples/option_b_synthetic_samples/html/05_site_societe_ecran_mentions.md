# Ground Truth — `05_site_societe_ecran_mentions.html`

> Site vitrine et mentions légales d'une société écran fictive avec tableau HTML bancaire, GAB, tracker GA4 et logo base64.

## Metadata

- **title**: `EURL Numidia Logistique Fictive — Mentions Légales`
- **lang**: `fr`
- **canonical_url**: `https://numidia-log-fictif.example.com/mentions-legales`
- **embedded_images**: `1`
- **forms_count**: `0`
- **scripts_count**: `1`
- **json_ld_blocks**: `0`
- **comments_count**: `0`
- **locations**: `Constantine; El Khroub; Blida`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site_web` | `https://numidia-log-fictif.example.com/mentions-legales` | https://numidia-log-fictif.example.com/mentions-legales | `head:canonical` | `quick` | URL canonique mentions légales |
| `identifiant_infrastructure` | `G-FICTIF2026` | G-FICTIF2026 | `script:tracker` | `quick` | Tracker GA4 fictif |
| `adresse_email` | `contact@numidia-log-fictif.example.com` | contact@numidia-log-fictif.example.com | `body:link` | `quick` | Email société |
| `telephone` | `+2135550162` | +2135550162 | `body:text` | `quick` | Téléphone société |
| `compte_bancaire` | `00799999006655443322` | RIP 00799999006655443322 | `body:table#0:r1` | `quick` | RIP dans tableau HTML |
| `compte_bancaire` | `00799999009876543210` | RIP 00799999009876543210 | `body:table#0:r2` | `quick` | RIP croisé Facture 02 & Relevé 03 |
| `image_preuve` | `embedded_html_img_1` | Image intégrée HTML #1 | `body:img#0` | `step_by_step` | Logo base64 intégré (Stage 1) |
| `transaction_financiere` | `540000 DZD` | 540000 DZD | `body:table#0:r1` | `step_by_step` | Montant tableau HTML (Stage 2) |
| `transaction_financiere` | `185000 DZD` | 185000 DZD | `body:table#0:r2` | `step_by_step` | Montant croisé PV 01 & Relevé 03 (Stage 2) |
| `entreprise` | `EURL Numidia Logistique Fictive` | EURL Numidia Logistique Fictive | `body:text` | `step_by_step` | Société mentions légales (Stage 3) |
| `personne` | `Samira Khelifi` | Samira Khelifi | `body:text` | `step_by_step` | Directrice mentionnée (Stage 3) |
| `guichet_gab` | `GAB-CST-04` | GAB-CST-04 | `body:table#0:r1` | `step_by_step` | Guichet GAB dans tableau (Stage 3) |
| `guichet_gab` | `GAB-BLIDA-0904` | GAB-BLIDA-0904 | `body:table#0:r2` | `step_by_step` | Guichet GAB croisé Relevé 03 (Stage 3) |

## Expected Relations

| relation_type | source_type | source_value | target_type | target_value | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `EMBARQUE_PIXEL_TRACKER` | `site_web` | `https://numidia-log-fictif.example.com/mentions-legales` | `identifiant_infrastructure` | `G-FICTIF2026` | `quick` | Tracker GA4 sur site |
| `DIRIGE_ENTREPRISE` | `personne` | `Samira Khelifi` | `entreprise` | `EURL Numidia Logistique Fictive` | `step_by_step` | Directrice -> société |
