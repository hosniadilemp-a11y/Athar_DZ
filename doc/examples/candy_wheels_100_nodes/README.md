# Exemple de Scénario d'Investigation : Opération « CANDY WHEELS » (100 Nœuds)

Ce dossier archive le jeu de données d'exercice à grande échelle (**100 nœuds forensiques** et **129 relations de preuve**) développé pour la plateforme **Athar DZ (أثر)**.

---

## 1. Structure des Fichiers

| Fichier | Description |
| :--- | :--- |
| `mock-case-candy-wheels.json` | Jeu de données JSON complet machine-readable (100 nœuds, 129 arêtes, métadonnées forensiques complètes). |
| `mock-case-candy-wheels.js` | Module JavaScript client exportant `window.CASE_CANDY_WHEELS`. |
| `Rapport_Investigation_ATHAR-2026-SCAM-089.pdf` | Rapport judiciaire officiel scellé de 5 pages A4 conforme au Code de Procédure Pénale. |
| `rapport_investigation_ATHAR-2026-SCAM-089.html` | Code source HTML et CSS d'impression du procès-verbal de synthèse. |
| `generate_100_nodes_mock.py` | Script générateur du graphe des 100 nœuds et de la topologie multi-calques. |
| `integrate_100_nodes_mock.py` | Contrôleur d'intégration dynamique pour le canevas d'Athar DZ. |
| `build_case_pdf_and_data.py` | Script de compilation du rapport PDF via Chrome headless. |

---

## 2. Découpage des 100 Nœuds par Calque

* **Calque 1 — Preuves Vérifiées & Scellés (25 nœuds) :**
  * 10 Victimes déclarantes (Karim, Meriem, Djamel, Salim, Amina, Rachid, Tahar, Mourad, Fatima, Omar).
  * 5 Registres de plaintes des wilayas (Alger, Oran, Blida, Constantine, Sétif).
  * 10 Pièces scellées (Vocaux WhatsApp/Telegram A-01..A-04, Chatlogs T-01, D-01, APKs, reçus BaridiMob).
* **Calque 2 — Découvertes OSINT Brutes (30 nœuds) :**
  * 10 Pages et profils sociaux (Facebook, Instagram, Ouedkniss).
  * 6 Publications et annonces Marketplace frauduleuses.
  * 8 Lignes téléphoniques E.164.
  * 6 Espaces de coordination clandestins (Serveur Discord C2, Salon `#commandes-scripts`, Canaux Telegram Pneus, Visas, Électro et VIP Direction).
* **Calque 3 — Infrastructure, Télécoms & Code (25 nœuds) :**
  * 8 Noms de domaine et boutiques miroirs.
  * 5 Serveurs web, IPs d'hébergement et cluster MongoDB.
  * 4 Bornages BTS et Cell-ID des opérateurs télécoms (Mobilis, Djezzy, Ooredoo).
  * 4 Dépôts Git, commits fuités et certificats Keystore de signature d'APK.
  * 4 Comptes financiers et portefeuille Binance USDT TRC-20.
* **Calque 4 — Réseau Criminel & Hiérarchie (20 nœuds) :**
  * 3 Dirigeants (Le Boss Tarek H. « El-Hadj », le Développeur Sofiane K., le Caissier Kamel V.).
  * 3 Lieutenants de cellules (Youcef R., Nadia M., Farid T.).
  * 6 Opérateurs de terrain.
  * 4 Mules financières BaridiMob.
  * 4 Entités de blanchiment (sociétés écrans, comptoir P2P Binance et syndicat global 33,5M DZD).

---

## 3. Rechargement du Scénario

Pour réinjecter ce scénario dans la maquette, il suffit d'exécuter :
```bash
python3 doc/examples/candy_wheels_100_nodes/generate_100_nodes_mock.py
python3 doc/examples/candy_wheels_100_nodes/integrate_100_nodes_mock.py
```
