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
- [Chapitre 09 : Topologie Physique 3 Serveurs, Attributs GPS & Panneaux Ajustables](#chapitre-09--topologie-physique-3-serveurs-attributs-gps--panneaux-ajustables)
- [Chapitre 10 : Sources de Collecte (OSN, RSS, Streaming) & Fusion d'Entités Multi-Sources](#chapitre-10--sources-de-collecte-osn-rss-streaming--fusion-dentités-multi-sources)

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
  - *Elasticsearch 8.14 (Lucene Inverted Index & BM25)* : Moteur d'indexation plein-texte multilingue (analyseurs morphologiques Arabe/Darija/Français, recherche floue `fuzzy` et phonétique pour la Data Fusion), stockage JSON polymorphe (`flattened`) des dumps de scrapers OSN, flux RSS et transcriptions de streaming.
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


---

## Chapitre 09 : Topologie Physique 3 Serveurs, Attributs GPS & Panneaux Ajustables

### 9.1 Architecture Physique en 3 Serveurs Séparés
L'infrastructure de production est physiquement isolée en 3 serveurs indépendants sur des VLANs cloisonnés :
1. **Serveur 1 : Studio App Server (`SRV-STUDIO-01`, VLAN 20)** : Interface Web Studio NVL WebGL, passerelle API FastAPI & RBAC, orchestrateur Celery, moteur d'IA locale (Llama-3-8B Text-to-Cypher), et passerelle d'ingestion SHA-256.
2. **Serveur 2 : Polyglot Data & Storage Server (`SRV-DATA-01`, VLAN 30)** : Entrepôt de données hébergeant Neo4j 5.20+ Enterprise, PostgreSQL 16 + TimescaleDB + PostGIS, Qdrant 1.9 Rust, MinIO Enterprise S3 (WORM Compliance), Elasticsearch 8.14 et Redis 7.2.
3. **Serveur 3 : Phone Farm Automation Server (`SRV-FARM-01`, VLAN 40)** : Appliance physique dédiée aux racks USB 3.0 industriels, flotte de smartphones Android (ADB / Scrcpy), banques de cartes SIM DZ (Djezzy, Mobilis, Ooredoo) et démon d'interception SMS/OTP.

### 9.2 Protocoles de Communication Inter-Applicative
- **Studio App $\leftrightarrow$ Data Server** : Pilotes natifs binaires chiffrés mTLS (`Bolt TLS`, `PostgreSQL Wire + PgBouncer`, `gRPC Qdrant`, `S3 REST HTTPS`, `RESP3`).
- **Studio App $\leftrightarrow$ Phone Farm** : **gRPC over mTLS (Protobuf)** pour les commandes synchrones (`SendSMS`, `GetSIMStatus`), **NATS Core / Redis Streams** pour la remontée asynchrone instantanée des SMS/OTP sans polling, et **WebRTC / H.264** pour le streaming vidéo d'écran.
- **Cloisonnement Forensique** : **Zéro accès direct** entre la Phone Farm (`SRV-FARM-01`) et le Data Server (`SRV-DATA-01`). Tout flux collecté transite obligatoirement par la passerelle d'ingestion du Studio pour vérification d'intégrité, désinfection et hachage SHA-256 avant persistance.

### 9.3 Attributs Géospatiaux (GPS) pour la Vue Carte SIG
Les entités suivantes portent des coordonnées géographiques (`gps_lat`, `gps_lon`, `azimuth_deg`, `rayon_couverture_m`, `exif_gps_lat/lon`) afin d'être projetées sur la **Carte SIG** (`view_map`) :
- `Antenne_BTS`, `Telecom_CDR`, `Guichet_GAB`, `Vehicule`, `Image_Preuve`, `Unite`, `Commune`, et `Personne` (barycentre spatio-temporel calculé).

### 9.4 Ergonomie des Panneaux Latéraux Coulissants & Ajustables
Les panneaux gauche (Accordéon) et droit (Inspecteur contextuel) de l'application web sont **coulissants** (repliables via boutons ou raccourcis clavier `[` et `]`) et **ajustables** en largeur via des poignées séparatrices (`col-resize`, avec persistance `localStorage`), tout en garantissant au minimum 50% de largeur au canevas central.

---

## Chapitre 10 : Sources de Collecte (OSN, RSS, Streaming) & Fusion d'Entités Multi-Sources

### 10.1 Sources de Données OSINT, Réseaux Sociaux (OSN), Flux RSS & Streaming Continu
Le pipeline d'acquisition (Layer 1 & Layer 2) couvre trois familles de sources ouvertes et flux continus :

1. **Réseaux Sociaux & Plateformes Communautaires (OSN)** :
   - **Facebook** : Profils, Pages, Groupes publics/fermés, annonces *Facebook Marketplace* et *Meta Ad Library*.
   - **Instagram** : Profils, publications, Reels, Stories archivées, graphes d'abonnés et commentaires.
   - **X (Twitter)** : Flux de publications, threads, métadonnées de comptes, géolocalisations et discussions *Spaces*.
   - **Telegram** : Chaînes publiques et groupes d'intérêt via protocole MTProto (messages, médias, listes de membres, transferts).
   - **TikTok** : Profils utilisateurs (`secUid`), vidéos courtes, pistes audio associées et arbres de commentaires.
   - **YouTube** : Chaînes, vidéos, commentaires, sous-titres et métadonnées de publication via crawler dédié.
   - **Reddit** : Subreddits, fils de discussion, historiques d'auteurs et liens externes partagés.
   - **4chan & Forums Anonymes** : Surveillance et archivage de boards/threads éphémères, extraction de médias et d'empreintes de fichiers.

2. **Flux Syndiqués & Crawlers Web (Flux RSS / Atom)** :
   - Collecte périodique automatisée de flux **RSS / Atom** (portails d'actualités nationaux et régionaux, communiqués officiels, blogs spécialisés, flux d'alertes cyber et moniteurs de fuites).
   - Crawlers web ciblés avec archivage probatoire automatique au format **ISO 28500 WARC** et scellement SHA-256.

3. **Surveillance de Chaînes & Plateformes de Streaming en Temps Réel (Streaming Collection)** :
   - Connecteurs d'écoute continue pour les flux **Live & Streaming** (*YouTube Live, TikTok Live, Facebook Live, Twitch, flux HLS / RTMP / IPTV*).
   - Segmentation temporelle automatique des flux audio/vidéo en fenêtres horodatées UTC, extraction des images clés (*keyframes*), transcription vocale à la volée (*Faster-Whisper Darija / Arabe / Français*), diarisation des locuteurs (*PyAnnote*) et indexation des chats en direct.

### 10.2 Stratégie de Data Fusion : Harmonisation des Noms d'Attributs (Schema Mapping) & Résolution d'Entités
Lors de l'ingestion multi-sources (OSN Facebook/Instagram/Reddit/4chan/X/Telegram/YouTube/TikTok, Flux RSS, Streaming, réquisitions CDR et fichiers CSV/JSON), chaque outil ou plateforme nomme ses champs différemment (ex. `num`, `tele`, `phone`, `phone_number`, `msisdn` pour un numéro de téléphone). Le moteur de **Data Fusion** unifie d'abord **la nomenclature des attributs (Schema Harmonization)** avant de fusionner **les entités (Entity Resolution)**.

#### A. Dictionnaire Canonique d'Unification des Attributs (Attribute Alias Mapping)
Le pipeline d'ingestion (Layer 2 — Pydantic v2 `AliasChoices` + Normaliseur Canonique) applique la table de correspondance déterministe suivante pour projeter tout JSON/CSV externe vers les attributs canoniques du modèle GFPG :

| Concept Forensique | Noms d'Attributs Bruts Hétérogènes (Sources OSN, Scrapers, CDR, APIs) | Attribut Canonique Unifié (GFPG) | Règle de Normalisation & Validation |
| :--- | :--- | :--- | :--- |
| **Numéro de Téléphone** | `num`, `tele`, `tel`, `phone`, `phone_number`, `msisdn`, `mobile`, `contact_phone`, `whatsapp_num`, `caller_id`, `numero_telephone`, `gsm` | **`numero_e164`** | Format international strict `E.164` (`+213555019283`), retrait des espaces, tirets et préfixes `00213`/`0`. |
| **Identité / Nom Personne** | `nom`, `name`, `full_name`, `fullname`, `person_name`, `display_name`, `author_name`, `suspect_name`, `victim_name`, `nom_prenom` | **`nom_complet`** | Normalisation Unicode `NFKC`, retrait du *tashkeel* arabe, translittération bidirectionnelle Latin $\leftrightarrow$ Arabe. |
| **Pseudonyme Réseau Social** | `username`, `handle`, `screen_name`, `user_login`, `nick`, `nickname`, `pseudo`, `social_handle`, `tg_username`, `ig_handle`, `tiktok_id` | **`pseudo_reseau`** | Minuscules canoniques sans `@` préfixe + conservation de la plateforme source (`platform`). |
| **ID Immuable Plateforme** | `uid`, `user_id`, `author_id`, `account_id`, `peer_id`, `sec_uid`, `fb_id`, `channel_id`, `pk`, `external_id` | **`platform_uid`** | Chaîne ASCII immuable identifiant le compte même après changement de `@handle`. |
| **Compte Bancaire / CCP** | `rip`, `ccp`, `iban`, `account_num`, `account_number`, `bank_account`, `baridimob_rip`, `rib`, `num_compte`, `wallet_id` | **`rip_algerie_poste`** / **`iban`** | Normalisation sur 20 chiffres (RIP Algérie Poste `00799999...`) avec vérification de clé modulo 97. |
| **Adresse Crypto** | `wallet`, `crypto_address`, `btc_addr`, `usdt_address`, `trc20_addr`, `eth_address`, `deposit_address`, `addr` | **`adresse_wallet`** | Validation de checksum (Tron Base58 `T...`, EVM `0x...`, Bitcoin Bech32). |
| **Coordonnées GPS** | `lat`, `latitude`, `gps_lat`, `y`, `coord_lat`, `geo_lat`, `exif_lat` / `lon`, `lng`, `long`, `longitude`, `gps_lon`, `x`, `coord_lon` | **`gps_lat`**, **`gps_lon`** | Flottants WGS84 validés (`lat` $\in [-90, 90]$, `lon` $\in [-180, 180]$) synchronisés avec PostGIS `POINT`. |
| **Localisation Algérie** | `wilaya`, `province`, `state`, `gov`, `wiliya_activiti` / `daira`, `district` / `commune`, `city`, `ville`, `municipality`, `localite` | **`wilaya`**, **`daira`**, **`commune`** | Résolution sur le référentiel officiel des 58 Wilayas, Daïras et 1541 Communes d'Algérie. |
| **Horodatage d'Événement** | `date`, `time`, `timestamp`, `created_at`, `published_at`, `post_date`, `datetime`, `time_utc`, `event_time`, `call_date` | **`horodatage_utc`** | Conversion systématique en **ISO 8601 UTC** (`YYYY-MM-DDTHH:mm:ssZ`). |
| **Contenu Textuel / Transcription** | `text`, `body`, `content`, `message`, `msg`, `caption`, `post_text`, `description`, `comment_body`, `transcript`, `darija_text` | **`contenu_texte`** | Indexation plein-texte dans **Elasticsearch 8.14** (analyseurs Arabe, Darija et Français). |
| **Appareil & Réseau** | `imei`, `device_id`, `tac` / `imsi`, `iccid`, `sim_id` / `ip`, `ip_address`, `src_ip`, `remote_ip`, `host_ip` | **`imei`**, **`imsi`**, **`adresse_ip`** | Validation Luhn sur IMEI (15 chiffres), normalisation IPv4/IPv6. |
| **Immatriculation Véhicule** | `plate`, `license_plate`, `matricule`, `immatriculation`, `veh_plate`, `num_chassis`, `vin` | **`immatriculation_dz`** | Format canonique algérien (`XXXXX-XXX-WW`) avec extraction du code wilaya (`01`–`58`). |
| **Empreinte Cryptographique** | `hash`, `sha256`, `file_hash`, `hash_sha256`, `digest`, `checksum_sha256`, `evidence_hash` | **`empreinte_sha256`** | Chaîne hexadécimale 64 caractères minuscules vérifiée côté serveur. |

#### B. Pipeline de Résolution d'Entités (Entity Resolution en 4 Étapes)
Une fois les noms d'attributs harmonisés :
1. **Étape 1 — Normalisation des Valeurs & Translittération Bilingue (FR/AR/Darija)** : Unification phonétique et orthographique (`Mohamed` / `Mohammed` / `M'hamed` / `محمد` ; `Benali` / `Ben Ali` / `بن علي`).
2. **Étape 2 — Appariement Hybride via Elasticsearch 8.14 ($S_{\text{fusion}} \in [0, 1]$)** :
   - *Clés Dures (Hard Keys)* : Match exact sur `numero_e164`, `rip_algerie_poste`, `platform_uid`, `empreinte_sha256`.
   - *Clés Souples (Soft Keys)* : Requête Elasticsearch `bool` combinant `fuzzy` (distance de Levenshtein), analyseur phonétique franco-arabe sur `nom_complet` et similarité sur `pseudo_reseau`.
3. **Étape 3 — Gouvernance Forensique ISO 27037 (Validation Humaine Review-Run)** : Aucune fusion automatique n'écrase un nœud du Calque 1 (`VERIFIED`). Les candidats à la fusion sont présentés dans la file **Clues Inbox (Review-Run)** pour arbitrage OPJ avec inscription au registre d'audit SHA-256.
4. **Étape 4 — Golden Record & Lineage Réversible** : Conservation de tous les alias (`aliases[]`) et des attributs bruts d'origine (`raw_attributes_lineage[]`) permettant la dissociation (`Split`) à tout moment.

---

### 10.3 Étude Comparative & Justification : Elasticsearch 8.14 vs MongoDB 7.0
Dans le Tier de Stockage Polyglotte (Layer 3 / `SRV-DATA-01`), **Elasticsearch 8.14** remplace MongoDB pour l'indexation des collectes OSINT, des flux RSS, des transcriptions de streaming et le moteur de Data Fusion :

| Critère Technique & Opérationnel | **Elasticsearch 8.14 (Choix Retenu)** | **MongoDB 7.0 (Écarté)** | Justification pour Athar DZ |
| :--- | :--- | :--- | :--- |
| **Recherche Plein-Texte Arabe, Darija & Français** | **Natif & Avancé** : Tokenizers morphologiques arabes (racines, normalisation hamza/ya/tashkeel), elision/stemming français, scoring **BM25**. | **Limité en On-Premise** : Pas d'analyse morphologique arabe avancée hors MongoDB Atlas Cloud (incompatible avec l'exigence 100 % air-gapped). | Indispensable pour fouiller des millions de posts Facebook/Telegram et transcriptions vocales en Darija. |
| **Data Fusion & Résolution Floue (`Fuzzy` / Phonétique)** | **Natif** : Requêtes `fuzzy` (automates de Levenshtein rapides), filtres phonétiques et scoring multi-attributs pondéré en $< 15\text{ ms}$. | Nécessite des expressions régulières (`$regex`) provoquant des scans complets de collection (`COLLSCAN`). | Accélère drastiquement le rapprochement des variantes de noms et pseudonymes inter-OSN. |
| **Flux Continus (RSS, Streaming, Logs DFIR)** | **Architecture Data Streams / ILM** : Ingestion quasi temps-réel (NRT) et agrégations temporelles (`date_histogram`) instantanées. | Moins performant sur les agrégations textuelles et temporelles combinées à grande échelle. | Idéal pour la veille temps réel sur chaînes YouTube/TikTok/Telegram et flux RSS. |
| **Dumps JSON Hétérogènes des 76 Outils** | Type **`flattened`** + `_source` compressé (ZSTD/LZ4) acceptant tout JSON imbriqué sans explosion de mapping. | Stockage BSON sans schéma. | Elasticsearch offre à la fois la flexibilité JSON sans schéma (`flattened`) et la puissance d'un moteur de recherche inversé Lucene. |

---

### 10.4 Architecture Logique : Patron Clean Architecture (Ports & Adapters)
Pour garantir l'indépendance totale de la logique d'enquête vis-à-vis des moteurs de bases de données (Neo4j, PostgreSQL/TimescaleDB, Elasticsearch, Qdrant, MinIO, Redis), le backend et le frontend suivent les principes de la **Clean Architecture** en 4 cercles concentriques (règle d'inversion de dépendance orientée vers le centre) :
1. **Cercle 1 — Enterprise Domain (`domain/`)** : Entités forensiques pures, registre unique des 37 types de nœuds et 47 relations, dictionnaire canonique de Data Fusion des attributs, règles d'immuabilité ISO 27037 et interfaces abstraites (**Ports** : `GraphRepositoryPort`, `AuditLedgerPort`, `SearchEnginePort`, `EvidenceStoragePort`). Zéro dépendance externe.
2. **Cercle 2 — Application Use Cases (`services/`)** : Orchestration des cas d'usage métier (`ExpandPersonNetworkUseCase`, `RunSnaAlgorithmUseCase`, `FuseMultiSourceEntityUseCase`, `PromoteToVerifiedUseCase`, `VerifyAuditChainUseCase`) + 16 algorithmes SNA purs (`services/sna/`). Ne dépend que du Cercle 1 (`domain/`).
3. **Cercle 3 — Interface Adapters (`api/v1/`, `schemas/`)** : Contrôleurs HTTP FastAPI, schémas de validation et d'harmonisation d'attributs Pydantic v2 (`AliasChoices`), sérialiseurs JSON/Cypher et côté Frontend l'adaptateur `GraphCanvasAdapter` isolant le moteur de rendu graphique.
4. **Cercle 4 — Frameworks & Drivers (`db/`, `core/`)** : Adaptateurs concrets implémentant les Ports du domaine (`Neo4jGraphAdapter`, `PostgresAuditAdapter`, `ElasticsearchSearchAdapter`, `RedisCacheAdapter`).
