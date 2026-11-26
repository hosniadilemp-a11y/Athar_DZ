# Ground Truth — `01_profil_osint_social.html`

> Capture HTML d'un profil réseau social OSINT avec JSON-LD, traceurs et posts archivés (données 100 % fictives).

## Metadata

- **title**: `Profil OSINT Fictif — @karim_auto_fictif (example.com)`
- **lang**: `fr`
- **canonical_url**: `https://social.example.com/u/karim_auto_fictif`
- **embedded_images**: `0`
- **forms_count**: `0`
- **scripts_count**: `2`
- **json_ld_blocks**: `1`
- **comments_count**: `0`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site_web` | `https://social.example.com/u/karim_auto_fictif` | https://social.example.com/u/karim_auto_fictif | `head:canonical` | `quick` | URL canonique du profil |
| `identifiant_infrastructure` | `UA-481200-1` | UA-481200-1 | `script:tracker` | `quick` | Tracker Google Analytics |
| `identifiant_infrastructure` | `fb-pixel-991122334455` | Meta Pixel 991122334455 | `script:tracker` | `quick` | Pixel Meta fbq |
| `telephone` | `+2135550112` | +2135550112 | `body:text` | `quick` | Téléphone principal profil |
| `telephone` | `+2135550113` | +2135550113 | `body:text` | `quick` | Téléphone secondaire dans post |
| `adresse_email` | `karim.auto.fictif@example.com` | karim.auto.fictif@example.com | `body:link` | `quick` | Email profil |
| `vehicule` | `04821-116-16` | 04821-116-16 | `body:text` | `quick` | Plaque algérienne dans publication |
| `compte_social` | `@karim_auto_fictif` | @karim_auto_fictif | `script:ld+json#0` | `step_by_step` | Identifiant social JSON-LD (Stage 2) |
| `publication_sociale` | `post-201` | Post #post-201 (@karim_auto_fictif) | `body:article#0` | `step_by_step` | Publication archivée 1 (Stage 3) |
| `publication_sociale` | `post-202` | Post #post-202 (@karim_auto_fictif) | `body:article#1` | `step_by_step` | Publication archivée 2 (Stage 3) |
| `personne` | `Karim Mansouri` | Karim Mansouri | `script:ld+json#0` | `step_by_step` | Personne JSON-LD (Stage 3) |
| `wilaya` | `Alger` | Alger | `body:text` | `step_by_step` | Wilaya (Stage 3) |
| `commune` | `Hussein Dey` | Hussein Dey | `body:text` | `step_by_step` | Commune (Stage 3) |
