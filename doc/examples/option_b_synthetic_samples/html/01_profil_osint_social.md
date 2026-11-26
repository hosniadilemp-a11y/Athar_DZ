# Ground Truth — `01_profil_osint_social.html`

> Capture HTML d'un profil réseau social OSINT avec JSON-LD, traceurs, posts archivés et recoupements cross-pièces (données 100 % fictives).

## Metadata

- **title**: `Profil OSINT Fictif — @karim_auto_fictif (example.com)`
- **lang**: `fr`
- **canonical_url**: `https://social.example.com/u/karim_auto_fictif`
- **embedded_images**: `0`
- **forms_count**: `0`
- **scripts_count**: `2`
- **json_ld_blocks**: `1`
- **comments_count**: `0`
- **locations**: `Alger; Hussein Dey`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site_web` | `https://social.example.com/u/karim_auto_fictif` | https://social.example.com/u/karim_auto_fictif | `head:canonical` | `quick` | URL canonique du profil |
| `site_web` | `https://pneus-promo-fictif.example.com/offre-2026` | https://pneus-promo-fictif.example.com/offre-2026 | `body:link` | `quick` | Offre promotionnelle (recoupement PV 01) |
| `identifiant_infrastructure` | `UA-481200-1` | UA-481200-1 | `script:tracker` | `quick` | Tracker Google Analytics |
| `identifiant_infrastructure` | `fb-pixel-991122334455` | Meta Pixel 991122334455 | `script:tracker` | `quick` | Pixel Meta fbq |
| `telephone` | `+2135550112` | +2135550112 | `body:text` | `quick` | Téléphone principal profil |
| `telephone` | `+2135550113` | +2135550113 | `body:text` | `quick` | Téléphone secondaire dans post |
| `telephone` | `+213661550102` | +213661550102 | `body:text` | `quick` | Téléphone partenaire (recoupement PV 01 & Facture 02) |
| `adresse_email` | `karim.auto.fictif@example.com` | karim.auto.fictif@example.com | `body:link` | `quick` | Email profil |
| `vehicule` | `04821-116-16` | 04821-116-16 | `body:text` | `quick` | Plaque algérienne dans publication |
| `compte_social` | `@karim_auto_fictif` | @karim_auto_fictif | `script:ld+json#0` | `step_by_step` | Identifiant social JSON-LD (Stage 2) |
| `publication_sociale` | `post-201` | Post #post-201 (@karim_auto_fictif) | `body:article#0` | `step_by_step` | Publication archivée 1 (Stage 3) |
| `publication_sociale` | `post-202` | Post #post-202 (@karim_auto_fictif) | `body:article#1` | `step_by_step` | Publication archivée 2 (Stage 3) |
| `personne` | `Karim Mansouri` | Karim Mansouri | `script:ld+json#0` | `step_by_step` | Personne JSON-LD (Stage 3) |
| `personne` | `Yacine Benali` | Yacine Benali | `body:text` | `step_by_step` | Gérant partenaire croisé (Stage 3) |

## Expected Relations

| relation_type | source_type | source_value | target_type | target_value | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `EMBARQUE_PIXEL_TRACKER` | `site_web` | `https://social.example.com/u/karim_auto_fictif` | `identifiant_infrastructure` | `UA-481200-1` | `quick` | Tracker GA sur page |
| `EMBARQUE_PIXEL_TRACKER` | `site_web` | `https://social.example.com/u/karim_auto_fictif` | `identifiant_infrastructure` | `fb-pixel-991122334455` | `quick` | Pixel Meta sur page |
| `POSSEDE_PROFIL_SOCIAL` | `personne` | `Karim Mansouri` | `compte_social` | `@karim_auto_fictif` | `quick` | JSON-LD Person -> alternateName |
| `UTILISE_TELEPHONE` | `personne` | `Karim Mansouri` | `telephone` | `+2135550112` | `quick` | JSON-LD Person -> telephone |
| `UTILISE_EMAIL` | `personne` | `Karim Mansouri` | `adresse_email` | `karim.auto.fictif@example.com` | `quick` | JSON-LD Person -> email |
| `PUBLIE_ANNONCE_SCAM` | `compte_social` | `@karim_auto_fictif` | `publication_sociale` | `post-201` | `step_by_step` | Article DOM -> compte social |
| `MENTIONNE_TELEPHONE` | `publication_sociale` | `post-201` | `telephone` | `+2135550113` | `step_by_step` | Téléphone dans post-201 |
| `UTILISE_TELEPHONE` | `personne` | `Yacine Benali` | `telephone` | `+213661550102` | `step_by_step` | Gérant -> téléphone dans post-202 |
