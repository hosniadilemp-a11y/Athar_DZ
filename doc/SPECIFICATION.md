# Athar DZ (AegisInvestigate) — Full Technical & Functional Specification Suite v2.5

> **"Photoshop for Criminal & OSINT Investigations"**  
> Plateforme souveraine d'investigation criminelle, d'orchestration OSINT et d'analyse de réseaux sociaux (SNA/GDS) conçue pour la **Police Judiciaire, les Brigades de Cybercriminalité et les Magistrats Instructeurs**.

---

## Sommaire de la Spécification (8 Chapitres Normatifs)

- [Chapitre 01 : Résumé du Framework & Objectifs Stratégiques](#chapitre-01--résumé-du-framework--objectifs-stratégiques)
- [Chapitre 02 : Architecture Visuelle en 6 Couches & Technologies Polyglottes](#chapitre-02--architecture-visuelle-en-6-couches--technologies-polyglottes)
- [Chapitre 03 : Postes de Travail & Matrice des Rôles (RBAC)](#chapitre-03--postes-de-travail--matrice-des-rôles-rbac)
- [Chapitre 04 : Modèle de Données, Hiérarchie Algérienne & Modèle Universel GFPG](#chapitre-04--modèle-de-données-hiérarchie-algérienne--modèle-universel-gfpg)
- [Chapitre 05 : Arsenal OSINT & Briques de Collecte Web (76 Outils)](#chapitre-05--arsenal-osint--briques-de-collecte-web-76-outils)
- [Chapitre 06 : Outils Forensiques DFIR & Fonctions SOTA d'Analyse Réseau (SNA / SNS)](#chapitre-06--outils-forensiques-dfir--fonctions-sota-danalyse-réseau-sna--sns)
- [Chapitre 07 : Feuille de Route Agile en 6 Phases Incrémentales](#chapitre-07--feuille-de-route-agile-en-6-phases-incrémentales)
- [Chapitre 08 : Simulateur Interactif d'Application (Studio Maquette)](#chapitre-08--simulateur-interactif-dapplication-studio-maquette)

---

## Chapitre 01 : Résumé du Framework & Objectifs Stratégiques

### 1.1 Vision Produit : "Photoshop pour Enquêtes Criminelles"
Les solutions d'investigation traditionnelles pèchent par deux extrêmes : soit elles noient l'officier de police sous des lignes de logs informatiques incompréhensibles, soit elles créent un graphe surchargé de centaines de faux positifs où la preuve juridique se perd.

**Athar DZ** applique la métaphore intuitive des calques de Photoshop à l'enquête judiciaire :
1. **Calque 1 — Faits Vérifiés (`VERIFIED`)** : Plaintes officielles, dépositions de victimes, réquisitions bancaires et scellés numériques scellés SHA-256 + RFC 3161.
2. **Calque 2 — Découvertes OSINT Brutes (`OSINT_RAW`)** : Profils de réseaux sociaux, résultats de moteurs de recherche et scrapings web en attente de triage par l'OPJ.
3. **Calque 3 — Infrastructures & Télécoms (`INFRA`)** : Adresses IP, identifiants BTS (bornages), numéros IMEI, identifiants de bases de données et nœuds de serveurs.
4. **Calque 4 — Hypothèses & Déductions IA (`HYPOTHESIS`)** : Rapprochements biométriques faciaux (ArcFace), transcription vocale Darija (Faster-Whisper) et prédictions de liens de complicité.

### 1.2 Les 4 Piliers Fondamentaux
- **Souveraineté Nationale & Zéro Fuite Cloud** : Déploiement 100% sur site (on-premise), serveurs locaux hébergés au sein des services de sécurité (DGSN / Gendarmerie Nationale), inférence LLM locale (Ollama).
- **Admissibilité Judiciaire Absolue (CPP Algérien & ISO 27037)** : Chaque pièce découverte est immédiatement archivée en conteneur WORM ISO 28500 (WARC) avec empreinte SHA-256 et horodatage certifié RFC 3161.
- **Ergonomie pour Non-Informaticiens** : Traduction automatique de toute télémétrie technique en langage policier d'investigation, icônes parlantes et boutons d'action suggérés par l'IA.
- **Parcours d'Enquête End-to-End** : Du dépôt de plainte initial jusqu'à la génération automatique du Procès-Verbal de Synthèse conforme au Code de Procédure Pénale.

### 1.3 Cas Fil Rouge : L'Affaire « Candy Wheels DZ » (Escroquerie Facebook)
Scénario réel d'escroquerie aux pneus Michelin à -60% orchestrée sur Facebook Marketplace ayant touché 285+ victimes à Alger, Oran et Blida pour un préjudice de 33 500 000 DZD. L'enquête traverse 4 étapes clés :
1. *Post initial & Annonce trompeuse*
2. *Extraction du numéro WhatsApp pivot (+213 555 019 283) et du lien marchand*
3. *Rétro-ingénierie de l'APK AutoPneusDZ et découverte du keystore développeur*
4. *Identification du cerveau (« El-Hadj ») et démantèlement de la filière par analyse de centralité GDS*.

---

## Chapitre 02 : Architecture Visuelle en 6 Couches & Technologies Polyglottes

### 2.1 Schéma Directeur des 6 Couches
L'application est structurée en 6 couches étanches et hautement résilientes :
- **Layer 6 : Présentation & Studio d'Enquête** : Moteur GPU WebGL Neo4j NVL (`@neo4j-nvl/react`), Minimap synchronisée, Web Workers de disposition physique (`@neo4j-nvl/layout-workers`), interface bilingue arabe/français.
- **Layer 5 : IA Souveraine Locale & Biométrie** : Ollama local (`DavidLanz/text2cypher-gemma-2-9b`), boucle `validate_query`, Faster-Whisper fine-tuné sur la Darija algérienne, diarisation PyAnnote Audio 3.1, ArcFace 512-d via DeepFace.
- **Layer 4 : Moteur GDS & Analytics SNA** : Neo4j Graph Data Science 2.6 (Betweenness, Louvain, Link Prediction), classifieur de rôles pénaux (`Node_clasification`), profilage territorial (`Secteur_Activite`).
- **Layer 3 : Tier de Stockage Polyglotte Spécialisé** :
  - *Neo4j 5.20+ Enterprise* : Graphe de relations, index-free adjacency $O(k)$, requêtes Cypher.
  - *PostgreSQL 16 + TimescaleDB* : État transactionnel ACID, RLS multi-wilayas, hyper-tables CDRs télécoms, journal d'audit Merkle SHA-256.
  - *MongoDB 7.0 (WiredTiger)* : Dépôt BSON polymorphe sans schéma pour dumps de scrapers, compression Snappy 70%.
  - *MinIO S3 Enterprise (WORM)* : Coffre-fort de scellés immuables, Object Lock en mode COMPLIANCE, RFC 3161.
  - *Qdrant 1.9 (Rust)* : Moteur vectoriel HNSW, recherche faciale et vocale sub-8ms avec filtrage par dossier pénal.
  - *Redis 7.2 Stack* : Bus de messages temps-réel, Pub/Sub WebSockets vers le Studio, token-bucket anti-ban.
- **Layer 2 : Ingestion & Pipeline de Normalisation** : FastAPI Ingress Gateway (JWT, RBAC), Celery 5.4, Temporal.io v1.24, validation canonique Pydantic v2, ArchiveBox ISO 28500 WARC.
- **Layer 1 : Acquisition Forensique & Phone Farm Android** : Périphériques physiques et conteneurs ReDroid (Android 13), modems 4G SIM USB (Mobilis, Djezzy, Ooredoo) avec interception AT SMS OTP, streaming Scrcpy v2.4 WebRTC 60 FPS, Mitmproxy 10.3 et cloaking Zygisk/Magisk.

---

## Chapitre 03 : Postes de Travail & Matrice des Rôles (RBAC)

### 3.1 Les 4 Profils Opérationnels
1. **Studio Enquêteur (Field & Analyst Investigators)** :
   - Poste de travail graphique complet : canvas NVL WebGL, minimap macroscopique, menu contextuel de nœud (`/api/get_possible_relations/`, `/api/personne_criminal_network/`), interrogation ciblée (`NodeTypeCibled`), questions judiciaires pré-configurées, copilot conversationnel Text-to-Cypher, barre temporelle découpée (`BarScroll.js`).
2. **Administration & Sécurité (Admin App)** :
   - Gestion des comptes utilisateurs, attribution des rôles RBAC, gestion chiffrée des clés d'API (Meta, Shodan, Binance), consultation du registre d'audit cryptographique non-répudiable.
3. **Dashboard Exécutif Chef de Brigade & Magistrat Instructeur** :
   - Supervision globale de l'ensemble des dossiers instruits dans la juridiction, KPIs de préjudice financier (DZD) et taux de recouvrement, alertes de recoupement inter-affaires (Cross-Case Syndicate Matches) et signature électronique des réquisitions.
4. **Console Technique Enquêteur Cyber & CD (Phone Farm & IA)** :
   - Supervision matérielle de la banque de modems SIM et des conteneurs Android ReDroid, monitoring GPU/VRAM du serveur Ollama, santé des index Qdrant et laboratoire de rétro-ingénierie d'APKs malveillantes (Jadx/Ghidra).

---

## Chapitre 04 : Modèle de Données, Hiérarchie Algérienne & Modèle Universel GFPG

### 4.1 Hiérarchie Administrative & Territoriale Algérienne
```
(w:Wilaya) ⟵[:appartient]─ (d:Daira) ⟵[:appartient]─ (c:Commune) ⟵[:situer]─ (u:Unite) ⟵[:Traiter]─ (a:Affaire)
```
- Propriétés canoniques : `nom_francais`, `nom_arabe`, `code_wilaya` (01 à 58), `code_postal`, `type_unite` (Gendarmerie Nationale, Sûreté Nationale DGSN, Pôle Pénal Spécialisé).

### 4.2 Spécification du Style des Entités (config_style.json)
- Personne : `#f43f5e`, diamètre `130-140px`, `/icon/Personne.png`, clé `nom_complet`.
- Téléphone : `#f97316`, diamètre `110px`, `/icon/Telephone.png`, clé `numero_e164`.
- BaridiMob / Banque : `#eab308`, diamètre `115px`, `/icon/BaridiMob.png`, clé `rip_algerie_poste`.
- Réseau Social : `#0ea5e9`, diamètre `105px`, `/icon/Social.png`, clé `pseudo_reseau`.
- Note Vocale : `#10b981`, diamètre `100px`, `/icon/Audio.png`, clé `duree_et_locuteur`.
- Véhicule : `#8b5cf6`, diamètre `110px`, `/icon/Vehicule.png`, clé `immatriculation_dz`.

### 4.3 Attributs Dérivés d'Intelligence Criminelle
- `_Lvl_of_Implications` : Degré d'implication multi-sauts `[1, 2, 3]`.
- `_class` : Classification automatique `['neutre', 'operationeel', 'soutien', 'leader']`.
- `_betweennessCentrality` : Score flottant [0.0..1.0] calculé par GDS Brandes.
- `_wiliya_Activiti`, `_daira_activiti`, `_comune_Activite` : Rayon d'action calculé à partir des bornages télécoms et retraits GAB.

### 4.4 Les 14 Types d'Éléments d'Enquête & Stockage Polyglotte
`PERSON`, `PHONE_NUMBER`, `SOCIAL_ACCOUNT`, `SOCIAL_POST`, `EMAIL_ADDRESS`, `WEB_DOMAIN`, `INFRASTRUCTURE_ID`, `BANK_ACCOUNT`, `CRYPTO_WALLET`, `VEHICLE`, `AUDIO_RECORDING`, `IMAGE_ARTIFACT`, `TELECOM_CDR`, `LEGAL_DOCUMENT`.

---

## Chapitre 05 : Arsenal OSINT & Briques de Collecte Web (76 Outils)

Inventaire exhaustif structuré par catégorie dans [`doc/osint-arsenal.html`](osint-arsenal.html) :
1. **Réseaux Sociaux & Annonces (SOCMINT)** : 10 outils (Geler & Certifier WARC, Extracteur IOCs, Meta Transparency, Meta Ad Library, TikTok Scraper...).
2. **Téléphones & Messageries Instantanées** : 8 outils (PhoneInfoga, Truecaller Reverse, WhatsApp Business Catalog, Telegram MTProto Bot, Ignorant Phone...).
3. **Sites Web & Infrastructures d'Hébergement** : 11 outils (DOM Database ID Decoder, PublicWWW Tracker Hunter, DNS History, JARM TLS...).
4. **Géolocalisation & Imagerie Satellitaire** : 8 outils (ExifTool GPS, SunCalc, GeoCLIP, Overpass Turbo OSM, ALPR DZ...).
5. **Finances Criminelles, BaridiMob & Crypto** : 9 outils (Vérificateur BaridiMob Algérie Poste, Schwifty IBAN, TronScan TRC-20, Breadcrumbs...).
6. **Fuites de Données & Identifiants Compromis** : 8 outils (HaveIBeenPwned, DeHashed, BreachDirectory, IntelligenceX...).
7. **Audio, Voix Darija & Multimédia** : 8 outils (Faster-Whisper Darija, PyAnnote Diarization, ArcFace Face Matcher, Deepfake Audio Checker...).
8. **Forensique Mobile & Décompilation APK** : 14 outils (ReDroid Container, Jadx Decompiler, APK Certificate Fingerprinter, Mitmproxy TLS...).

---

## Chapitre 06 : Outils Forensiques DFIR & Fonctions SOTA d'Analyse Réseau (SNA / SNS)

### 6.1 Arsenal de Police Judiciaire & Forensique Numérique (DFIR - 12 Outils)
- `Autopsy / SleuthKit` : Analyse de systèmes de fichiers de disques durs saisis (E01/RAW).
- `Volatility 3` : Analyse médico-légale de mémoire vive RAM (mots de passe en clair, processus injectés).
- `ALEAPP / iLEAPP` : Parseurs spécialisés d'artefacts Android et iOS (bases SQLite chiffrées, logs d'appels).
- `Plaso / log2timeline` : Super-timeline criminalistique unifiée corrélant tous les événements système.
- `YARA-X & Capa` : Détection de signatures de malwares et identification des capacités de chevaux de Troie bancaires.
- `Ghidra & Jadx-GUI` : Rétro-ingénierie et décompilation de malwares ciblant BaridiMob (ex: AutoPneusDZ.apk).
- `Wireshark / TShark` : Capture et dissection de flux réseaux de serveurs de commande et contrôle (C2).
- `ExifTool` : Extraction de métadonnées invisibles et coordonnées GPS d'images saisies.

### 6.2 Les 12 Fonctions SOTA d'Analyse de Réseaux Sociaux (SNA / SNS)
1. `link_prediction` : Prédiction de liens de complicité latents via Adamic-Adar et co-implication (`/api/link_prediction/`).
2. `betweenness_centrality` : Détection des nœuds pivots et mules financières (`calculate_betweenness_centrality`).
3. `community_detection` : Découverte de cellules criminelles étanches via Louvain Modularity et Label Propagation (`AnalysisAlgorithms/Community.js`).
4. `node_classification` : Catégorisation pénale automatique (`operationeel`, `soutien`, `leader`).
5. `top_k_nodes` : Classement décroissant des cibles prioritaires par centralité (`AnalysisAlgorithms/TopK_Nodes.js`).
6. `threshold_path_expansion` : Expansion ciblée avec curseur de seuil de confiance (`/api/expand_path_from_node/`).
7. `temporal_subgraph_expansion` : Découpage chronologique dynamique APOC couplé à la barre temporelle (`/api/filter_affaire_relations/`).
8. `activity_sector_profiling` : Calcul territorial du secteur d'activité criminel (`Secteur_Activite`).
9. `shortest_path_dijkstra` : Traçage de la chaîne de blanchiment entre victime et compte de destination.
10. `k_core_decomposition` : Élagage du bruit périphérique pour révéler le noyau dur du réseau.
11. `fast_rp_embeddings` : Plongements vectoriels rapides pour clustering structurel non supervisé.
12. `personalized_pagerank` : Calcul d'influence hiérarchique orienté à partir d'un suspect pivot.

---

## Chapitre 07 : Feuille de Route Agile en 6 Phases Incrémentales

Chaque jalon livre une **application Docker opérationnelle et testable** :
- **Phase 1 : Socle Studio & Calques Visuels (`App v0.1`)** : Intégration du canvas Neo4j NVL WebGL, calques Photoshop (Faits vérifiés vs Hypothèses), chargement de dossiers.
- **Phase 2 : Coffre-fort Scellés WORM & Ingestion (`App v0.2`)** : Intégration MinIO S3 Object Lock, extraction automatique d'IOCs, horodatage RFC 3161.
- **Phase 3 : Arsenal OSINT Dockerisé & Phone Farm (`App v0.3`)** : Intégration des 76 briques, conteneurs ReDroid Android 13 et modems SIM 4G DZ.
- **Phase 4 : Moteur GDS, Centralité & Algorithmes SNA (`App v0.4`)** : Intégration des calculs Betweenness, Louvain, Link Prediction et classification des rôles.
- **Phase 5 : IA Souveraine Multimodale & Voix Darija (`App v0.5`)** : Déploiement d'Ollama (DavidLanz Text-to-Cypher), Faster-Whisper Darija fine-tuné et PyAnnote Diarization.
- **Phase 6 : Multi-Tenancy Wilayas & Production Hardened (`App v1.0`)** : Matrice RBAC complète, alertes inter-affaires transversales, audit Merkle et export PV CPP.

---

## Chapitre 08 : Simulateur Interactif d'Application (Studio Maquette)

Accessible directement via [`doc/maquette.html`](maquette.html) :
- Barre de menus native avec raccourcis clavier OS.
- Scénario Candy Wheels avec 9 pièces à conviction scellées (P-01 à P-09).
- Téléchargement du **Rapport de Synthèse Judiciaire Officiel (PDF)** scellé conforme au CPP algérien.
- Fiche suspect coulissante et comparateur de preuves en écran scindé.
