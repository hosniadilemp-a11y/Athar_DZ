# Ground Truth — `02_page_phishing_baridimob.html`

> Page de phishing BaridiMob fictive avec formulaire d'exfiltration, IP C2, APK et commentaires HTML cachés.

## Metadata

- **title**: `BaridiMob Vérification Sécurité — Portail Fictif`
- **lang**: `fr`
- **canonical_url**: ``
- **embedded_images**: `0`
- **forms_count**: `1`
- **scripts_count**: `1`
- **json_ld_blocks**: `0`
- **comments_count**: `1`

## Expected Entities

| entity_type | normalized_value | label | locator | min_mode | notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `site_web` | `https://collect-otp-fictif.example.com/api/steal` | https://collect-otp-fictif.example.com/api/steal | `form:action#0` | `quick` | Cible POST du formulaire phishing |
| `site_web` | `https://cdn-apk-fictif.example.net/downloads/baridimob-update-fictif.apk` | https://cdn-apk-fictif.example.net/downloads/baridimob-update-fictif.apk | `body:link` | `quick` | URL distribution APK |
| `fichier_apk` | `baridimob-update-fictif.apk` | baridimob-update-fictif.apk | `body:link` | `quick` | Package APK malveillant fictif |
| `serveur_c2` | `198.51.100.88` | 198.51.100.88 | `script:inline#0` | `quick` | IPv4 serveur C2 dans script |
| `identifiant_infrastructure` | `GTM-FICTIF26` | GTM-FICTIF26 | `script:tracker` | `quick` | Google Tag Manager fictif |
| `adresse_email` | `dev.phish.fictif@example.org` | dev.phish.fictif@example.org | `html:comment#0` | `quick` | Email développeur en commentaire HTML |
| `canal_telegram` | `@baridi_support_fictif` | @baridi_support_fictif | `html:comment#0` | `quick` | Canal Telegram en commentaire HTML |
| `compte_bancaire` | `00799999004455667788` | RIP 00799999004455667788 | `html:comment#0` | `quick` | RIP mule en commentaire HTML |
| `telephone` | `+2135550124` | +2135550124 | `body:link` | `quick` | Faux numéro assistance |
