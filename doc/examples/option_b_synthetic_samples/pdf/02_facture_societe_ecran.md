# Ground Truth — `02_facture_societe_ecran.pdf`

> Facture commerciale entre deux sociétés fictives (Oran / Bir El Djir).

## Metadata

- **title**: `FACTURE PROFORMA N° FAC-2026-0842`
- **author**: `Service Comptable Fictif Oran`
- **pages**: `1`
- **embedded_images**: `0`

## Expected Entities

| entity_type | normalized_value | label | page | min_mode | notes |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `telephone` | `+213770550109` | +213770550109 | 1 | `quick` | Téléphone contact fournisseur |
| `adresse_email` | `facturation@atlas-import-fictif.example.com` | facturation@atlas-import-fictif.example.com | 1 | `quick` | Email facturation |
| `compte_bancaire` | `00799999009876543210` | RIP 00799999009876543210 | 1 | `quick` | RIP BaridiMob règlement |
| `vehicule` | `04821-116-16` | 04821-116-16 | 1 | `quick` | Plaque immatriculation véhicule livreur |
| `transaction_financiere` | `420000 DZD` | 420000 DZD | 1 | `step_by_step` | Ligne facture 1 (Stage 2) |
| `transaction_financiere` | `135000 DZD` | 135000 DZD | 1 | `step_by_step` | Ligne facture 2 (Stage 2) |
| `transaction_financiere` | `555000 DZD` | 555000 DZD | 1 | `step_by_step` | Total TTC (Stage 2) |
| `entreprise` | `SARL Atlas Import Fictif` | SARL Atlas Import Fictif | 1 | `step_by_step` | Société émettrice (Stage 3) |
| `entreprise` | `EURL Nord Logistique Fictive` | EURL Nord Logistique Fictive | 1 | `step_by_step` | Société cliente (Stage 3) |
| `personne` | `Nabil Khelifi` | Nabil Khelifi | 1 | `step_by_step` | Gérant (Stage 3) |
| `personne` | `Samira Boudiaf` | Samira Boudiaf | 1 | `step_by_step` | Directrice (Stage 3) |
| `wilaya` | `Oran` | Oran | 1 | `step_by_step` | Wilaya (Stage 3) |
| `commune` | `Bir El Djir` | Bir El Djir | 1 | `step_by_step` | Commune (Stage 3) |
