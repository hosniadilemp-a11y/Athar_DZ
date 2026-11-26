# Ground Truth — `03_annonce_marketplace_scam.html`

> Annonce marketplace frauduleuse fictive avec JSON-LD Product/Offer, image base64 intégrée, société et RIP.

## Metadata

- **title**: `Promo Véhicule & Pièces — SARL Atlas Motors Fictive (example.com)`
- **lang**: `fr`
- **canonical_url**: `https://souk-auto-fictif.example.com/annonce/8841`
- **embedded_images**: `1`
- **forms_count**: `0`
- **scripts_count**: `1`
- **json_ld_blocks**: `1`
- **comments_count**: `0`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site_web` | `https://souk-auto-fictif.example.com/annonce/8841` | https://souk-auto-fictif.example.com/annonce/8841 | `head:canonical` | `quick` | URL annonce canonique |
| `telephone` | `+2135550135` | +2135550135 | `body:link` | `quick` | Téléphone vendeur |
| `adresse_email` | `ventes@atlas-motors-fictif.example.com` | ventes@atlas-motors-fictif.example.com | `body:link` | `quick` | Email vendeur |
| `compte_bancaire` | `00799999008877665544` | RIP 00799999008877665544 | `body:text` | `quick` | RIP réception acompte |
| `vehicule` | `31045-120-31` | 31045-120-31 | `body:text` | `quick` | Plaque véhicule |
| `image_preuve` | `embedded_html_img_1` | Image intégrée HTML #1 | `body:img#0` | `step_by_step` | Image base64 embarquée (Stage 1) |
| `compte_social` | `@atlas_motors_dz` | @atlas_motors_dz | `body:text` | `step_by_step` | Compte vendeur (Stage 2) |
| `transaction_financiere` | `450000 DZD` | 450000 DZD | `script:ld+json#0` | `step_by_step` | Prix/acompte DZD (Stage 2) |
| `publication_sociale` | `annonce-8841` | Post #annonce-8841 | `body:article#0` | `step_by_step` | Annonce archivée (Stage 3) |
| `entreprise` | `SARL Atlas Motors Fictive` | SARL Atlas Motors Fictive | `script:ld+json#0` | `step_by_step` | Entreprise vendeuse (Stage 3) |
| `personne` | `Yacine Benali` | Yacine Benali | `body:text` | `step_by_step` | Gérant mentionné (Stage 3) |
| `wilaya` | `Oran` | Oran | `body:text` | `step_by_step` | Wilaya (Stage 3) |
| `commune` | `Bir El Djir` | Bir El Djir | `body:text` | `step_by_step` | Commune (Stage 3) |
