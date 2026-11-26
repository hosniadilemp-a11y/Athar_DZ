# Ground Truth — `05_pv_perquisition_saisie.pdf`

> PV de perquisition multi-saisies avec 1 image intégrée et recoupements cross-pièces (Constantine / Sétif).

## Metadata

- **title**: `PV DE PERQUISITION ET INVENTAIRE DES SCELLES N° 2026-05`
- **author**: `OPJ Section Economique Fictive - Constantine`
- **pages**: `1`
- **embedded_images**: `1`
- **locations**: `Constantine; Setif`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `vehicule` | `09124-121-25` | 09124-121-25 | 1 | `quick` | Véhicule saisi 1 |
| `vehicule` | `11209-119-19` | 11209-119-19 | 1 | `quick` | Véhicule saisi 2 |
| `vehicule` | `04821-116-16` | 04821-116-16 | 1 | `quick` | Véhicule croisé Facture 02 & HTML 01 |
| `telephone` | `+2135550171` | +2135550171 | 1 | `quick` | Smartphone 1 |
| `telephone` | `+213770550172` | +213770550172 | 1 | `quick` | Smartphone 2 |
| `adresse_email` | `sofiane.b.fictif@example.com` | sofiane.b.fictif@example.com | 1 | `quick` | Courriel sur poste saisi |
| `adresse_email` | `ventes.atlas.fictif@example.com` | ventes.atlas.fictif@example.com | 1 | `quick` | Courriel croisé PV Plainte 01 |
| `compte_bancaire` | `00799999004455667788` | RIP 00799999004455667788 | 1 | `quick` | Carte BaridiMob croisée Relevé 03 & HTML 02 |
| `transaction_financiere` | `750000 DZD` | 750000 DZD | 1 | `step_by_step` | Espèces saisies (Stage 2) |
| `image_preuve` | `embedded_image_p1_1` | Image integree p.1 #1 | 1 | `step_by_step` | Planche photo intégrée (Stage 1) |
| `appareil_mobile` | `351234567890123` | IMEI 351234567890123 | 1 | `step_by_step` | Smartphone 1 IMEI (Stage 3) |
| `appareil_mobile` | `359876543210987` | IMEI 359876543210987 | 1 | `step_by_step` | Smartphone 2 IMEI (Stage 3) |
| `personne` | `Sofiane Brahimi` | Sofiane Brahimi | 1 | `step_by_step` | Suspect (Stage 3) |
| `personne` | `Amel Haddad` | Amel Haddad | 1 | `step_by_step` | Témoin (Stage 3) |
