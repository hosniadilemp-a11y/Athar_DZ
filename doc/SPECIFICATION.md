# Athar DZ (AegisInvestigate) — Full Technical & Functional Specification Suite v2.5

> **"Photoshop for Criminal & OSINT Investigations"**  
> Plateforme souveraine d'investigation criminelle, d'orchestration OSINT et d'analyse de réseaux sociaux (SNA/GDS) conçue pour la **Police Judiciaire, les Brigades de Cybercriminalité et les Magistrats Instructeurs**.

---

## Sommaire de la Spécification (12 Chapitres Normatifs)

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
- [Chapitre 11 : Système Multi-Onglets d'Enquête & Extraction de Sous-Graphes Ciblés ("Actor Sphere")](#chapitre-11--système-multi-onglets-denquête--extraction-de-sous-graphes-ciblés-actor-sphere)
- [Chapitre 12 : Ingestion Universelle Drag-and-Drop & Station de Dépouillement Forensique Multi-Formats](#chapitre-12--ingestion-universelle-drag-and-drop--station-de-dépouillement-forensique-multi-formats)
- [Chapitre 13 : Implémentation Phase 2A (PDF/HTML/NER GPU), Règles de Validation D16–D20 & Ergonomie UI](#chapitre-13--implémentation-phase-2a-pdfhtmlner-gpu-règles-de-validation-d16d20--ergonomie-ui) — voir aussi [`EXTRACTION_LOGIC.md`](EXTRACTION_LOGIC.md)

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

### 10.2 Stratégie Générale de Gestion des Étiquetages Hétérogènes Multi-Sources (Schema Mapping & Data Fusion)
Lorsque la plateforme ingère des données issues de sources hétérogènes (OSN Facebook/Instagram/Reddit/4chan/X/Telegram/YouTube/TikTok, Flux RSS, Streaming, réquisitions opérateurs ou imports CSV/JSON), un même concept forensique est étiqueté sous des noms d'attributs très différents selon la source (à titre d'exemple : un numéro de téléphone peut apparaître sous les clés `num`, `tele`, `tel`, `phone`, `phone_number` ou `msisdn` alors que le modèle interne attend `numero_e164`).

Pour résoudre ce problème de manière générique lors de l'implémentation du pipeline d'ingestion (Layer 2), l'architecture retient une stratégie en **4 mécanismes complémentaires** :

1. **Mécanisme 1 — Registre Déclaratif d'Alias par Source (Canonical Schema Mapping Registry)** :
   - Chaque attribut canonique de l'ontologie GFPG définit une liste extensible d'alias reconnus (`AliasChoices` dans Pydantic v2).
   - *Exemples illustratifs* :
     - Téléphonie : `{num, tele, tel, phone, phone_number, msisdn, mobile, contact_phone, whatsapp_num}` $\rightarrow$ **`numero_e164`**
     - Identité : `{nom, name, full_name, fullname, display_name, author_name, nom_prenom}` $\rightarrow$ **`nom_complet`**
     - Compte OSN : `{username, handle, screen_name, user_login, nick, pseudo}` $\rightarrow$ **`pseudo_reseau`**
     - Identifiant technique : `{uid, user_id, author_id, peer_id, sec_uid, fb_id}` $\rightarrow$ **`platform_uid`**
     - Coordonnées & Temps : `{lat, latitude, y}` / `{lon, lng, longitude, x}` $\rightarrow$ **`gps_lat`, `gps_lon`** ; `{date, time, timestamp, created_at}` $\rightarrow$ **`horodatage_utc`**.

2. **Mécanisme 2 — Détection Heuristique & Empreinte de Format (Schema-Agnostic Field Inference)** :
   - Lorsqu'un fichier ou flux externe utilise un nom de colonne inédit (hors dictionnaire d'alias), le moteur d'ingestion combine :
     - **La similarité lexicale du nom de champ** (normalisation `snake_case`, retrait des préfixes/suffixes, correspondance floue sur le nom de clé).
     - **La signature structurelle de la valeur (Value Pattern Fingerprinting)** : détection par expressions régulières et validateurs typés (ex. séquence téléphonique algérienne/internationale $\rightarrow$ `numero_e164` ; clé de 20 chiffres `00799999...` $\rightarrow$ `rip_algerie_poste` ; chaîne hexadécimale 64 caractères $\rightarrow$ `empreinte_sha256` ; adresse Tron/EVM $\rightarrow$ `adresse_wallet`).
   - En cas d'incertitude sur un champ lors d'un import, un **assistant d'appariement de colonnes (Schema Mapping Assistant)** propose l'association à l'enquêteur pour validation.

3. **Mécanisme 3 — Canonisation des Valeurs & Résolution d'Entités (Value Normalization & Entity Resolution)** :
   - Une fois l'attribut rattaché à sa clé canonique, sa valeur est normalisée (conversion E.164 `+213...`, dates en ISO 8601 UTC, normalisation Unicode `NFKC` et translittération phonétique Franco-Arabe/Darija pour les noms).
   - Le moteur **Elasticsearch 8.14** exécute ensuite le rapprochement multi-critères (correspondance exacte sur clés dures `numero_e164`/`platform_uid` + recherche floue `fuzzy` Levenshtein et phonétique sur `nom_complet`/`pseudo_reseau`), et soumet les propositions de fusion dans la file **Review-Run (Clues Inbox)** sans jamais écraser automatiquement un nœud `VERIFIED` (conformité ISO/IEC 27037).

4. **Mécanisme 4 — Préservation Intégrale du Schéma Brut d'Origine (Raw Payload Lineage)** :
   - Pour garantir l'admissibilité judiciaire et éviter toute perte d'information, les clés et valeurs d'origine telles que reçues de la source (`{"tele": "0555...", "author_name": "..."}`) sont conservées sans altération dans un champ d'audit `raw_source_attributes` (stocké sous le type `flattened` dans Elasticsearch 8.14) lié à l'empreinte SHA-256 de la collecte.

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

## Chapitre 11 : Système Multi-Onglets d'Enquête & Extraction de Sous-Graphes Ciblés ("Actor Sphere")

### 11.1 Vision Ergonomique & Architecture Multi-Onglets
Dans le cadre d'investigations judiciaires complexes à forte densité de nœuds, l'enquêteur doit pouvoir isoler temporairement un suspect ou une filière d'acteurs sans perdre la vue d'ensemble du dossier. 

Inspiré de l'ergonomie des documents à onglets des suites graphiques (Photoshop / GIMP) et des stations forensiques (Maltego / Palantir Gotham) :
- **Barre d'Onglets Supérieure** : Positionnée entre la barre de menu secondaire (`AppSubBar`) et la barre d'outils du canevas (`Toolbar`).
- **Onglet Maître Fixe** : L'onglet `[ 🌐 Dossier Général ]` représente le graphe complet de l'affaire et ne peut être fermé.
- **Onglets Dérivés Focalisés** : Créés par clic-droit sur un nœud d'acteur $\rightarrow$ *« Ouvrir dans un nouvel onglet d'investigation »*, ou via le bouton `[+]` avec filtre personnalisé (ex: *« [👤 Suspect : Amine B. (9 nœuds)] »*).
- **Indépendance d'État Visuel** : Chaque onglet conserve son propre niveau de zoom/pan (`viewport`), son algorithme de disposition (`layout` : Organique, Hiérarchique, Étoile, Grille), et son filtrage des 5 calques actifs.
- **Source Unique de Vérité (SSOT)** : Les nœuds et relations manipulés dans un onglet partagent le même magasin de données (`GraphStore`). Toute modification de propriété, ajout d'annotation judiciaire, ou promotion au calque `VERIFIED` (avec motif ISO 27037) se répercute instantanément dans l'ensemble des onglets ouverts et dans le journal d'audit central.

---

### 11.2 Problématique Topologique & Algorithme d'Extraction Asymétrique Orientée ("Directional Asymmetric Traversal with Boundary Person Anchors")

#### La Problématique de Non-Convexité des Graphes Criminels
Les graphes d'investigation judiciaire ne sont pas partitionnés en composantes convexes ou étanches. En raison de la présence d'entités relais à forte centralité (antennes relais BTS 4G, pages Facebook publiques, commerçants ou guichets postaux GAB partagés) :
- **Écueil du parcours naïf (Composante connexe complète)** : Extraire toutes les connexions directes et indirectes sans filtre aspire jusqu'à 80-90% du graphe global de l'affaire dans l'onglet, générant un effet d'encombrement (« hairball ») rendant l'onglet illisible et inutile.
- **Écueil du 1-hop strict non orienté** : Limiter l'extraction aux voisins directs omet des chaînes médiées fondamentales (ex: `Personne -> Téléphone -> Carte SIM -> Enregistrement vocal` ou `Personne -> Compte BaridiMob -> Transaction -> Compte Récepteur`).

#### L'Algorithme d'Extraction Asymétrique Orientée
Pour résoudre ce dilemme, l'extraction de sous-graphe focalisé applique une règle de parcours directionnelle stricte, asymétrique entre arêtes entrantes et arêtes sortantes :

```
[Flux Entrants : 1-Hop Strict]                      [Flux Sortants : Traversée Orientée jusqu'aux Acteurs Frontières]
 (u1) ──[COMMUNIQUE_AVEC]──►                        ──► (Tel) ──► (SIM) ──► (Enregistrement) ──► [Feuille]
 (u2) ────────[PAYE]───────► ┌───────────────────┐
 (u3) ──────[CONDUIT]──────► │ Nœud Focal (Cible)│ ──► (Compte) ──► (Transaction) ──► [Personne Frontière P2]
                             └───────────────────┘                              (Liaison explicite préservée)
```

1. **Arêtes Entrantes (In-Edges, $u \to \text{Cible}$) — 1-Hop Strict** :
   - Sélectionne **exclusivement les voisins directs à 1 saut** disposant d'une arête pointant vers le nœud focal.
   - Cela capture immédiatement tous les flux qui convergent vers l'entité (appels reçus, virements bancaires entrants, véhicules immatriculés au nom du suspect, scellés judiciaires directement rattachés).
   - L'algorithme ne remonte aucun antécédent des nœuds entrants, évitant l'aspiration des réseaux amont.

2. **Arêtes Sortantes (Out-Edges, $\text{Cible} \to v_1 \to v_2 \dots$) — Traversée Orientée avec Arrêt aux Acteurs** :
   - L'algorithme se propage librement vers l'aval le long des arêtes sortantes (projections d'activités émises par le suspect) à travers toutes les entités médiatrices et traces (`telephone`, `carte_sim`, `compte_bancaire`, `vehicule`, `transaction_financiere`, `image_preuve`, `scelle_numerique`, `enregistrement_vocal`).
   - **Frontière d'Arrêt aux Acteurs Humains/Moraux (`Personne`, `Entreprise`)** :
     - Dès qu'un chemin sortant atteint un autre nœud d'acteur tiers $P_2 \neq P_1$, **le nœud $P_2$ est inclus dans le sous-graphe** et **la relation exacte qui le relie est explicitement tracée**.
     - L'expansion s'arrête strictement à $P_2$ : ses relations propres, son patrimoine et ses contacts personnels ne sont pas aspirés dans l'onglet.
     - $P_2$ est affiché avec un indicateur visuel de frontière (*Anchor Node* avec badge distinctif `[Frontière]`).
   - **Feuilles Terminales** : Si une branche n'atteint aucun autre acteur, elle s'arrête naturellement à son nœud feuille ($d_{\text{out}}(v) = 0$).

3. **Préservation Intégrale des Liaisons vers les Personnes Frontières (Endpoint Person Links)** :
   - Contrairement aux approches qui tronquent l'affichage avant d'atteindre le tiers, l'algorithme garantit que la personne terminale et son lien d'arrivée sont parfaitement visibles sur le canevas. L'enquêteur comprend instantanément le cheminement complet de l'action criminelle sans extrapolation.

4. **Traitement des Collisions d'Actifs Partagés (Shared Asset Nodes)** :
   - Lorsqu'un actif matériel ou financier (ex: un véhicule partagé ou un compte bancaire conjoint) est lié simultanément au suspect focal et à un autre acteur, le nœud apparaît avec une mise en surbrillance dorée (*Collision Marker*).

5. **Amortissement des Nœuds Hubs d'Infrastructure (Hub Dampening)** :
   - Les entités d'infrastructure générale à degré élevé ($d(v) > 20$, telles que les antennes BTS ou les sites web publics) sont intégrées à l'onglet mais n'étendent pas leur voisinage, évitant l'aspiration de contacts collatéraux hors du périmètre de l'enquête.

---

### 11.3 Supervision dans l'Onglet Isolé : Processus Actifs, Découvertes Cachées & Arbre d'Exécution

Lorsqu'un nœud est isolé dans son onglet dédié, l'enquêteur dispose d'une station de supervision à 3 panneaux :
1. **Le Canevas du Sous-Graphe Faisceau (Graphe de Connaissances)** : La projection topologique filtrée selon la règle directionnelle asymétrique.
2. **Le Tiroir d'Arbitrage des Indices Non-Inclus (Pending Clues Drawer)** : Présente toutes les entités secondaires découvertes par les outils d'analyse (ex: passants en arrière-plan, véhicules sans lien prouvé, numéros secondaires) rattachées au suspect mais en attente d'incorporation. L'enquêteur peut d'un clic : `[➕ Tout Inclure]` ou `[✕ Tout Écarter]`.
3. **Le Panneau de l'Arbre des Processus (Process Discovery Tree)** : Affiche l'arborescence complète des calculs et pipelines exécutés sur l'objet focal, ses étapes franchies et ses découvertes en cascade, séparé rigoureusement du graphe de connaissances métier.

---

## Chapitre 12 : Ingestion Universelle Drag-and-Drop & Architecture Quadruple (Blackboard, Dataflow, EDA, Plugins)

### 12.1 Ergonomie d'Ingestion Non-Intrusive & Popover à 3 Modes

Conformément aux normes forensiques **ISO/IEC 27037** et aux règles anti-saturation du dossier judiciaire, le glisser-déposer d'un fichier sur le canevas **ne déclenche jamais d'analyse lourde aveugle ou intrusive**.

#### Déroulement de l'Ingestion sur le Canevas :
1. **Création Immédiate du Nœud d'Objet Brut** :
   - Dès le dépôt d'un fichier (image, audio, document, vidéo, relevé), l'application calcule instantanément son empreinte cryptographique **SHA-256 côté client** et crée sur le canevas un nœud d'élément probatoire (`scelle_numerique` / `element_brut`).
   - Le nœud affiche son nom d'origine, son type MIME et sa taille en octets.
2. **Affichage du Popover Contextuel de Découverte des Processus** :
   - Un popover ciblé s'ouvre au-dessus du nœud nouvellement créé, présentant **l'inventaire complet des processus forensiques exécutables** sur ce format précis (ex: extraction EXIF, détection de visages, reconnaissance faciale, détection de plaques ALPR, détection d'objets YOLO).
   - L'enquêteur se voit proposer **3 options d'exécution claires** :
     - 🚀 **Option 1 : Analyse Rapide (Quick Analysis)** : Exécute uniquement les processus d'extraction légers et prioritaires (métadonnées EXIF, vignettes, hachages, OCR préliminaire des gros titres). Analyse quasi-instantanée avec faible consommation GPU/CPU.
     - 🔍 **Option 2 : Analyse Complète Étape par Étape (Step-by-Step Human-in-the-Loop)** : Analyse exhaustive mais progressive. À chaque étape intermédiaire terminée (ex: détection de 3 visages et 1 véhicule), le système marque une pause et présente visuellement les résultats à l'enquêteur. Ce dernier valide expressément les prochaines étapes à lancer (ex: lancer la biométrie ArcFace sur le visage #1 uniquement, ou lancer la requête ALPR sur la plaque lue).
     - ⚡ **Option 3 : Analyse Complète Autonome Récursive (Autonomous Recursive Analysis)** : L'enquêteur délègue le contrôle total au système. Le moteur de calcul déroule de manière autonome et récursive tous les processus d'extraction et de recoupement jusqu'à saturation informationnelle (arrêt lorsqu'aucune nouvelle entité n'est détectable).
3. **Exécution Différée & Contrôle dans l'Inspecteur Latéral** :
   - L'enquêteur peut à tout moment fermer ou quitter le popover (`Échap` ou clic extérieur) sans déclencher d'analyse.
   - Le nœud demeure intact sur le canevas avec un badge discret : **« En cours d'investigation »** (`Active Investigation`) ou *« En attente d'analyse »*.
   - L'ensemble des processus disponibles, le choix des 3 modes et le bouton de lancement restent en permanence accessibles dans le **Menu Latéral Inspecteur** du nœud.
   - Dès qu'un traitement est lancé, l'inspecteur affiche une **barre de progression en temps réel** (`ProgressBar`) détaillant l'avancement pourcentage par pourcentage et l'étape active.

---

### 12.2 L'Architecture Hybride Quadruple (The 4-Pattern Architecture)

Pour orchestrer ces traitements complexes sans rupture de la chaîne de preuve judiciaire et sans couplage monolithique, Athar combine de manière synergique **quatre patrons d'architecture logicielle majeurs** :

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        1. PATRON BLACKBOARD (Tableau Partagé)                          │
│  • GraphStore (Neo4j)        • Base Vectorielle (Qdrant)    • Registre de Cas WORM     │
│  • Full-Text (Elasticsearch) • Objets Bruts (MinIO S3)      • Bassin d'Indices Attente │
└───────────────────────▲────────────────────────────────────────▲───────────────────────┘
                        │ Assertions & Hypothèses        │ Lectures d'État
┌───────────────────────┴────────────────────────────────────────┴───────────────────────┐
│                    2. DYNAMIC DATAFLOW ENGINE (Moteur de DAGs)                         │
│  • Construction dynamique de graphes de tâches (DAG) selon type MIME & Mode sélectionné │
│  • Résolution des dépendances, branchements conditionnels, fan-out & jointures         │
└───────────────────────▲────────────────────────────────────────▲───────────────────────┘
                        │ Déclenchements & Transitions   │ Événements & Résultats
┌───────────────────────┴────────────────────────────────────────┴───────────────────────┐
│                  3. EVENT-DRIVEN ARCHITECTURE (Bus Événementiel)                       │
│  • Redis Streams / PubSub   • WebSockets (Frontend Live)   • Broker de Messages        │
│  • Événements : NodeDropped, ProcessValidated, StageCompleted, UnmatchedEntityFound     │
└───────────────────────▲────────────────────────────────────────▲───────────────────────┘
                        │ Contrat d'Exécution SPI        │ Retours de Tâches
┌───────────────────────┴────────────────────────────────────────┴───────────────────────┐
│                    4. PLUGIN ARCHITECTURE (Moteurs d'Analyse SPI)                      │
│  • InsightFace / ArcFace    • Faster-Whisper Darija        • PaddleOCR / ALPR          │
│  • YOLOv8x Object Detector  • Trafilatura / WARC OSINT     • Jadx / PyMuPDF            │
│  • Déclaration de capacités, prérequis GPU/CPU, entrées/sorties typées                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Définition des Quatre Composants :
1. **Blackboard (Tableau Partagé)** :
   - Représente l'état global et unifié des connaissances forensiques de l'affaire.
   - Il stocke l'ensemble des faits vérifiés (`VERIFIED`), des extractions brutes (`OSINT_RAW`), des hypothèses de travail (`HYPOTHESIS`), des vecteurs biométriques (Qdrant), des scellés binaires WORM (MinIO) et des candidats en attente (`Pending Clues Pool`).
   - Les moteurs d'analyse n'interagissent jamais directement entre eux : ils lisent les données requises sur le Blackboard et y écrivent leurs découvertes et assertions sous forme d'événements horodatés.

2. **Dynamic Dataflow Engine (Moteur de Flux de Données Dynamique)** :
   - Construit à la volée un graphe acyclique dirigé (DAG) représentant la chaîne de calculs à exécuter pour un objet donné.
   - S'adapte dynamiquement au mode choisi (Rapide, Pas à Pas, Récursif) :
     - En **Mode Rapide**, il élague le DAG pour ne conserver que les tâches de surface.
     - En **Mode Pas à Pas**, il matérialise des barrières de synchronisation (*Human Checkpoints*) imposant la validation de l'enquêteur avant de dériver le graphe de calcul aval.
     - En **Mode Récursif**, il étend dynamiquement le DAG au fur et à mesure que de nouveaux objets sont découverts.
   - Il gère les jointures sémantiques complexes : si le plugin OCR détecte une plaque d'immatriculation dont les coordonnées spatiales sont incluses dans la boîte englobante d'un véhicule détecté par le plugin YOLO, le Dataflow Engine assemble ces deux résultats en un nœud unique `vehicule` enrichi de sa plaque.

3. **Event-Driven Architecture (Architecture Pilotée par les Événements)** :
   - Assure la communication asynchrone non-bloquante entre le frontend, l'ordonnanceur et les workers d'analyse.
   - Émet des signaux standardisés : `NODE_DROPPED`, `PROCESS_CONFIGURED`, `TASK_STARTED`, `PROGRESS_TICK`, `STAGE_COMPLETED`, `CANDIDATE_FOUND`, `INVESTIGATION_SATURATED`.
   - Alimente en temps réel la barre de progression de l'inspecteur et le badge « En cours d'investigation » via WebSockets.

4. **Plugin Architecture (Architecture de Plugins & SPI)** :
   - Définit une interface unifiée (Forensic Service Provider Interface - SPI) pour l'ensemble des 88 moteurs forensiques locaux.
   - Chaque plugin déclare :
     - Ses formats d'entrée acceptés (ex: `image/jpeg`, `audio/ogg`, `application/pdf`).
     - Ses exigences matérielles (CPU multi-cœurs, VRAM GPU CUDA, RAM minimale).
     - Son schéma de sortie typé (bounding boxes, vecteurs 512-d, transcriptions horodatées, entités NER).
     - Sa méthode d'exécution isolée (worker process ou container Docker sandboxed).

---

### 12.3 Distinction Fondamentale : Graphe de Connaissances vs Arbre des Processus (Process Tree)

Pour préserver la clarté judiciaire et la navigabilité de l'enquête, l'application établit une séparation visuelle et sémantique absolue entre deux graphes de nature différente :

| Dimension de Comparaison | **Graphe de Connaissances Métier (Knowledge Graph)** | **Arbre des Processus Forensiques (Process Tree)** |
| :--- | :--- | :--- |
| **Objet Modélisé** | La réalité criminelle réelle de l'affaire (Personnes, Téléphones, Sociétés, Comptes bancaires, Scènes de crime, Véhicules). | La chaîne computationnelle algorithmique d'analyse (Fichiers sources, Plugins, Découpages, Algorithmes, Inférences). |
| **Nature des Nœuds** | Entités ontologiques judiciaires (`personne`, `compte_bancaire`, `vehicule`, `scelle_numerique`). | Tâches de traitement, étapes de calcul, plugins exécutés, résultats intermédiaires bruts. |
| **Nature des Arêtes** | Relations probatoires (`COMMUNIQUE_AVEC`, `PROPRIETAIRE_DE`, `VIREMENT_VERS`, `CONDUIT`). | Dépendances de données (`INPUT_OF`, `GENERATED_BY`, `BRANCH_TO`, `RESOLVED_AS`). |
| **Emplacement dans l'Interface** | Canevas central principal (Mode Onglet Général ou Onglet Isolé Suspect). | Vue dédiée de traçabilité, Panneau latéral d'investigation ou Sous-vue d'analyse de l'objet isolé. |
| **Comportement Dynamique** | Ne croît qu'avec des faits vérifiés ou validés expressément par l'enquêteur. | Se ramifie dynamiquement et interactivement à chaque nouvelle découverte algorithmique. |

#### Fonctionnement de l'Arbre des Processus (Process Discovery Tree) :
Pour chaque objet déposé ou analysé, l'enquêteur peut ouvrir son **Arbre des Processus**. L'arbre grandit visuellement et interactivement au fur et à mesure des étapes :
- **Nœud Racine** : Le fichier brut déposé (ex: `photo_scene_crime.jpg`, SHA-256: `3a7f...`).
- **Nœuds Niveau 1** : Les plugins initiaux déclenchés (`Plugin ExifTool`, `Plugin YOLOv8x`, `Plugin InsightFace`, `Plugin PaddleOCR`).
- **Nœuds Niveau 2 (Découvertes)** :
  - Sous YOLO : `Détection Véhicule (SUV Noir, Confiance 96%)`.
  - Sous PaddleOCR : `Texte Plaque "16-118-208"`.
  - Sous InsightFace : `Visage Découpé #1 (Confiance 98%)`, `Visage Découpé #2 (Confiance 89%)`.
- **Nœuds Niveau 3 (Analyses Secondaires & Recoupements)** :
  - Sous Visage #1 : `ArcFace 512-d` $\rightarrow$ `Comparaison Qdrant` $\rightarrow$ `Match Suspect Amine B. (94%)`.
  - Sous Visage #2 : `ArcFace 512-d` $\rightarrow$ `Comparaison Qdrant` $\rightarrow$ `Inconnu dans le dossier` $\rightarrow$ `Tâche OSINT Maigret / PimEyes`.
  - Sous Véhicule + Plaque : `Moteur de Jointure Sémantique` $\rightarrow$ `Nœud Candidat Véhicule Enrichi`.
L'enquêteur peut cliquer sur n'importe quel nœud de l'arbre pour inspecter les métadonnées de calcul, la durée d'inférence, le score de confiance et les tenseurs bruts.

---

### 12.4 Taxonomie Complète des Formats Ingestibles & Plugins d'Extraction

Le tableau normatif ci-dessous détaille le traitement forensique appliqué selon le type de fichier ingéré via les plugins SPI :

| Famille de Fichiers | Extensions Détectées | Plugins SPI & Moteurs Locaux | Données & Attributs Extraits | Nœuds & Relations Générés dans Athar |
| :--- | :--- | :--- | :--- | :--- |
| **1. Photographies & Captures d'Écran** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.tiff` | • **ExifTool 12.84**<br>• **InsightFace / ArcFace**<br>• **PaddleOCR v2.7**<br>• **YOLOv8x Object Detector** | Coordonnées GPS latitude/longitude, modèle d'appareil photo, date/heure de capture, texte OCR (reçus, chèques, tickets), vecteurs faciaux 512-d, empreinte pHash anti-doublon. | • Nœud `image_preuve`<br>• Nœud `empreinte_faciale` (`CONTIENT_VISAGE`)<br>• Si GPS : projection sur `MapView`<br>• Si reçu financier : proposition de nœud `transaction_financiere`. |
| **2. Notes Vocales & Fichiers Audio** | `.opus`, `.m4a`, `.ogg`, `.mp3`, `.wav` | • **Faster-Whisper (fine-tuné Darija)**<br>• **PyAnnote Audio 3.1** | Transcription textuelle intégrale de l'arabe dialectal algérien (Darija), séparation acoustique locuteur victime / suspect (diarisation), détection de montants en DZD et toponymes de wilayas. | • Nœud `enregistrement_vocal`<br>• Propriété `transcription_texte`<br>• Relations `VOIX_DE` vers `personne`, `TRANSMIS_PAR` vers `telephone`. |
| **3. Procès-Verbaux & Documents Texte** | `.pdf`, `.docx`, `.doc`, `.odt`, `.txt` | • **PyMuPDF / pdfplumber**<br>• **python-docx**<br>• **CAMeL Tools / Arabic-NER / Qwen 2.5** | Texte intégral, métadonnées auteur/imprimante, entités nommées (noms de suspects, matricules de police, numéros de comptes CCP/BaridiMob à 20 chiffres, numéros de téléphone mobiles algériens 05/06/07, immatriculations véhicules). | • Nœud `document_judiciaire` ou `scelle_numerique`<br>• Propositions d'instanciation de nœuds `personne`, `telephone`, `compte_bancaire`, `vehicule`. |
| **4. Relevés Télécom & Extractions Bancaires** | `.csv`, `.xlsx`, `.xls`, `.tsv` | • **Moteur Heuristique Polars / Pandas**<br>• **Validateurs RegEx E.164 / RIP** | Détection automatique de schéma CDR (Call Detail Record) ou relevés bancaires : colonnes Appelant, Appelé, Horodatage, Durée d'appel, Identifiant Cell-ID BTS, Montants débit/crédit. | • Génération en masse d'arêtes `COMMUNIQUE_AVEC` entre nœuds `telephone`<br>• Horodatage pour la `TimelineView`<br>• Nœuds `antenne_bts` positionnés par géolocalisation. |
| **5. Pages Web & Captures OSINT** | `.html`, `.htm`, `.mhtml`, `.warc`, `.url` | • **Trafilatura**<br>• **ArchiveBox ISO 28500**<br>• **BeautifulSoup4** | Titre de page, métadonnées OpenGraph, e-mails de contact, identifiants de suivi publicitaire (`UA-*`, Pixel Meta), liens sociaux (Telegram, Facebook, Instagram), horodatage de capture. | • Nœud `site_web`<br>• Nœuds satellites : `compte_social`, `adresse_email`, `telephone`, `identifiant_infrastructure`. |
| **6. Vidéosurveillance & Vidéos** | `.mp4`, `.mkv`, `.avi`, `.mov` | • **FFmpeg 6.1**<br>• **YOLOv8**<br>• **InsightFace** | Horodatage de flux vidéo, métadonnées conteneur, découpage automatisé des images clés (*keyframes*) sur transition de plan, détection de visages et plaques d'immatriculation. | • Nœud principal `scelle_numerique`<br>• Images clés dérivées en `image_preuve` liées par `EXTRAIT_DE`<br>• Rapprochement avec les suspects du dossier. |
| **7. Fichiers DFIR & Extractions Mobiles** | `.apk`, `.sqlite`, `.db`, `.pcap`, `.plist` | • **Jadx / Androguard**<br>• **SQLite3 Driver**<br>• **Scapy / TShark** | • APK : Nom de package, permissions Android, URLs de Command & Control (C2), clés de signature keystore.<br>• SQLite : Messages extraits de `msgstore.db` (WhatsApp) ou Telegram.<br>• PCAP : Requêtes DNS, adresses IP de destination, certificats TLS. | • Nœuds `fichier_apk`, `serveur_c2`, `canal_telegram`, `message_chat`, `certificat_tls`, `identifiant_infrastructure`. |
| **8. E-mails & Correspondances Brutes** | `.eml`, `.msg`, `.mbox` | • **Python email parser**<br>• **mail-parser** | En-têtes SMTP de routage, adresses IP source dans `Received:`, statuts d'authentification SPF/DKIM/DMARC, sujet, horodatage d'expédition, pièces jointes binaires extraites. | • Nœuds `adresse_email` (émetteur et destinataires)<br>• Nœud `identifiant_infrastructure` pour l'adresse IP de relais<br>• Réinjection récursive des pièces jointes. |
| **9. Conteneurs d'Archives** | `.zip`, `.tar.gz`, `.rar`, `.7z` | • **ZipFile Sécurisé** (filtre anti-Path Traversal / Zip-Slip) | Arborescence de répertoires, intégrité d'archivage, décompression isolée en sandbox temporaire (`/tmp/athar_ingest_sandbox`). | • Nœud racine `scelle_numerique` (empreinte SHA-256 de l'archive)<br>• Arborescence de pièces jointes filles créées et liées par `EXTRAIT_DE`. |

---

### 12.5 La Station de Dépouillement Forensique (Pre-Flight Review & Scellement ISO 27037)

Pour préserver l'admissibilité des preuves au regard du Code de Procédure Pénale algérien et de la norme **ISO/IEC 27037 (Conduite relative aux preuves numériques)**, l'ingestion n'injecte jamais directement des nœuds sans validation humaine. 

Elle s'articule autour d'un flux d'interaction en 4 étapes séquentielles :

1. **Étape 1 — Scellement Cryptographique & Enregistrement d'Audit** :
   - Dès la réception des octets du fichier, l'application génère l'empreinte `SHA-256` et préserve le nom de fichier original, la taille en octets et la date de dernière modification.
   - Un jeton d'horodatage RFC 3161 est sollicité et consigné dans le journal d'audit Merkle.
2. **Étape 2 — Extraction d'Entités par le Dynamic Dataflow Engine** :
   - Le moteur instancie le DAG approprié (OCR, Whisper Darija, NER texte, parseur de relevés) selon le mode sélectionné par l'enquêteur.
   - Les plugins SPI exécutent les calculs dans des environnements locaux isolés et publient leurs tenseurs et entités brutes sur le Blackboard.
3. **Étape 3 — Tableau de Réconciliation & Désambiguïsation (Pre-Flight Review)** :
   - Le système dresse la liste des entités découvertes avec une proposition de rapprochement automatique :
     - *Exemple 1* : Un numéro de téléphone `0555019283` correspond exactement à un nœud déjà existant sur le graphe $\rightarrow$ option par défaut : **Rattacher au nœud existant** (enrichissement de métadonnées).
     - *Exemple 2* : Un nom `Amine B.` détecté avec un score de similarité floue de 92% avec le suspect principal $\rightarrow$ l'enquêteur choisit par bouton radio : `[Fusionner avec Amine B.]` ou `[Créer une nouvelle entité distincte]`.
     - *Exemple 3* : Faux positifs potentiels $\rightarrow$ cases à cocher permettant à l'OPJ de désélectionner les entités non pertinentes avant injection.
4. **Étape 4 — Affectation de Calque & Déversement Sécurisé** :
   - Par défaut, les nouvelles entités issues d'extractions automatisées sont versées dans le **Calque 2 (`OSINT_RAW`)** ou **Calque 4 (`HYPOTHESIS`)**.
   - L'élévation directe en **Calque 1 (`VERIFIED`)** impose la saisie d'un motif de certification d'officier de police judiciaire (`reason`) consigné dans le registre légal.

---

### 12.6 Coopération Multimodale des Plugins sur le Blackboard (Scénario Photo & Binders Sémantiques)

Grâce au patron Blackboard et au moteur de flux dynamique, les plugins forensiques SPI coopèrent sans couplage direct point-à-point :

```
[Fichier Déposé (ex: Photo)]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│  Dynamic Dataflow Engine : DAG Instantiation           │
│  • Valide le type MIME, horodate, calcule le SHA-256   │
│  • Dispatche les tâches vers les Plugins SPI adéquats  │
└───────────┬────────────────────┬───────────────────┬───┘
            │                    │                   │
            ▼                    ▼                   ▼
┌───────────────────────┐ ┌──────────────┐ ┌────────────────────────┐
│ Plugin SPI Visages :  │ │Plugin SPI OCR│ │ Plugin SPI Objets :    │
│ Détection & Biométrie │ │& Plaques     │ │ Détection Spatiale     │
│ (InsightFace/ArcFace) │ │(PaddleOCR)   │ │ (YOLOv8x Detection)    │
└───────────┬───────────┘ └──────┬───────┘ └─────────┬──────────────┘
            │                    │                   │
            └────────────────────┼───────────────────┘
                                 ▼ Assertions d'État
┌────────────────────────────────────────────────────────┐
│  BLACKBOARD : Espace d'État Forensique Partagé         │
│  • Stocke les boîtes englobantes, vecteurs & textes    │
└────────────────────────────────┬───────────────────────┘
                                 │
                                 ▼ Déclencheur EDA
┌────────────────────────────────────────────────────────┐
│  Dataflow Engine : Binder Sémantique & Corrélation     │
│  • Intersection IoU : Boîte Plaque ∈ Boîte Véhicule    │
│  • Fusionne en 1 Nœud Candidat "Véhicule Immatriculé"  │
│  • Indexe le Visage 512-d dans Qdrant vs Suspects      │
└────────────────────────────────┬───────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────┐
│  Arbitrage Enquêteur : Graphe vs Bassin Non-Inclus     │
└────────────────────────────────────────────────────────┘
```

#### Exemple Concret de Coopération sur une Scène Complexe :
1. **Plugin Détection Faciale (`plugin-insightface`)** : Isole 2 visages, génère les imagettes recadrées et leurs vecteurs ArcFace 512-d. Il les publie sur le Blackboard.
2. **Plugin OCR & Plaques (`plugin-paddleocr-alpr`)** : Détecte une chaîne textuelle *"Hôtel El-Djazair"* et une plaque algérienne *"04821 116 16"* avec leurs coordonnées spatiales normalisées $(x_1, y_1, x_2, y_2)$.
3. **Plugin Détecteur d'Objets (`plugin-yolo-v8`)** : Détecte un SUV noir, un smartphone sur une table et une liasse de billets.
4. **Étape de Synthèse & Binder Sémantique du Dataflow Engine** :
   - Le moteur constate géométriquement que la boîte englobante de la plaque d'immatriculation est incluse dans le contour du SUV.
   - Au lieu de créer deux nœuds déconnectés, il synthétise une entité unique et cohérente : un nœud `vehicule` (Attributs : Type SUV, Couleur Noire, Immatriculation : *04821 116 16*).
   - Les visages sont immédiatement comparés aux profils fichés dans Qdrant pour identifier s'il s'agit d'un suspect connu ou de nouvelles cibles.

---

### 12.7 Gestion Anti-Saturation : Groupement par Catégories & Bassin d'Indices Non-Inclus (Pending Clues Pool)

#### Le Risque d'Engorgement du Graphe
Une photo de rue ou une vidéo de surveillance peut révéler 15 piétons en arrière-plan, 12 voitures stationnées, 6 enseignes de magasins et 4 numéros de téléphone partiels. 
**Verser automatiquement ces 37 entités sur le canevas d'investigation détruirait instantanément la lisibilité du dossier pénal.**

#### La Solution en Deux Niveaux :

1. **Groupement Hiérarchique dans la Boîte de Dialogue** :
   Les propositions d'entités sont présentées à l'enquêteur sous forme d'accordéons catégorisés avec badges de confiance :
   - 📁 **Acteurs & Visages Clés (2)** *(Déplié par défaut)* :
     - ☑️ *Suspect potentiel 1 (Visage net, face caméra)*
     - ☐ *Passant en arrière-plan (Flou, score 45%)*
   - 📁 **Véhicules & Plaques Immatriculées (1)** *(Déplié par défaut)* :
     - ☑️ *SUV Noir - Plaque 04821 116 16*
   - 📁 **Indices Matériels Remarquables (2)** *(Déplié par défaut)* :
     - ☑️ *Smartphone sur table*
     - ☑️ *Liasse de billets DZD*
   - 📁 **Arrière-Plan & Éléments Secondaires (18)** *(Replié par défaut)* :
     - ☐ *12 Véhicules stationnés au loin*
     - ☐ *6 Piétons anonymes*

2. **Le Bassin d'Indices Secondaires Non-Inclus (Searchable Staging Pool)** :
   - Les entités que l'enquêteur choisit de **ne pas cocher** ne sont **pas supprimées**.
   - Elles sont stockées sur le Blackboard dans le dossier d'affaire sous le statut `status: PENDING_NON_INCLUDED` et indexées dans **Elasticsearch 8.14** (pour les textes/labels/métadonnées) et **Qdrant** (pour les empreintes de visages/véhicules).
   - **Recherche Rétroactive & Découverte Croisée** : 
     Si, 2 semaines plus tard, l'enquêteur intercepte une écoute mentionnant *"un SUV noir immatriculé 16"*, la recherche globale dans Athar lui signale :
     > 💡 **Recoupement Trouvé :** *Un véhicule correspondant (Plaque 04821 116 16) a été détecté dans l'arrière-plan de la photo #IMG-089 versée le 23/11. Voulez-vous promouvoir cette entité sur le graphe actif ?*

---

### 12.8 Généralisation Multimodale aux Autres Types de Fichiers

Le couplage Blackboard + Dynamic Dataflow Engine + Plugins SPI s'applique identiquement à tous les formats :

| Type de Fichier | Chaîne de Plugins Dataflow | Entités Prioritaires (Graphe) | Bassin d'Indices Non-Inclus (Index Recherche) |
| :--- | :--- | :--- | :--- |
| **Audio / Vocaux** | `plugin-audio-clean` $\rightarrow$ `plugin-whisper-darija` $\rightarrow$ `plugin-pyannote-diarize` $\rightarrow$ `plugin-voiceprint` $\rightarrow$ `plugin-arabic-ner` | Locuteurs principaux (Victime, Escroc), montants et lieux clés de RDV. | Bruits de fond (sirène, adhan, musique), locuteurs tertiaires, mots isolés. |
| **Documents PDF/Word** | `plugin-doc-parser` $\rightarrow$ `plugin-layout-lm` $\rightarrow$ `plugin-ner-qwen` $\rightarrow$ `plugin-geo-resolver` | Suspects nommés, comptes bancaires, numéros de téléphone visés par la plainte. | Greffiers, articles de loi cités, signatures, 40 mentions administratives secondaires. |
| **Relevés CDR (CSV)** | `plugin-cdr-csv-parser` $\rightarrow$ `plugin-operator-id` $\rightarrow$ `plugin-bts-geocoder` $\rightarrow$ `plugin-frequency-analyzer` | Les 5 correspondants les plus fréquents du suspect et les bornages suspects. | Les 4 500 autres appels ordinaires du mois, consultables par filtre horaire/numéro. |
| **Captures Web HTML** | `plugin-web-trafilatura` $\rightarrow$ `plugin-tracker-extractor` $\rightarrow$ `plugin-social-links` $\rightarrow$ `plugin-whois-ip` | Titulaire de la page, profil Telegram/WhatsApp de contact, identifiant Google Analytics pivot. | Les 150 liens hypertextes sortants, cookies tiers et ressources CSS archivés en WARC. |
| **Vidéos MP4** | `plugin-ffmpeg-keyframes` $\rightarrow$ `plugin-bytetrack` $\rightarrow$ `plugin-yolo-alpr` $\rightarrow$ `plugin-insightface` | Individus et véhicules interagissant directement sur la scène de l'infraction. | Les centaines d'autres passants et voitures en circulation durant l'enregistrement. |

---

### 12.9 Unification de l'Ingestion OSINT, Orchestration Événementielle Récursive & Expansion de l'Arbre des Processus

Le pipeline de calcul Dataflow n'est pas un système isolé réservé aux seuls fichiers glissés-déposés par l'enquêteur : **il s'applique de manière unifiée à tous les artefacts rapatriés par les 76 briques OSINT de la plateforme**.

#### Architecture de la Boucle Récursive (Feedback Loop Temporal.io / EDA) :
Lorsqu'un connecteur OSINT (ex. `brick.socmint.facebook_dumper` ou scraper Instagram/Telegram) collecte le profil d'une cible, il rapatrie un faisceau d'objets multimédias bruts (par exemple : **3 photographies**, **4 publications textuelles** et **1 vidéo**). 

1. **Phase 1 — Ingestion & Dispatch Parallèle (Fan-Out)** :
   - L'orchestrateur de workflow **Temporal.io v1.24** instancie un workflow d'affaire et le Dynamic Dataflow Engine dispatche chaque objet vers les plugins SPI spécialisés :
     - Les 4 publications texte $\rightarrow$ transmises au plugin NER arabe/français (`CAMeL-Lab` / `Qwen 2.5`).
     - La vidéo $\rightarrow$ transmise au plugin `FFmpeg` (découpage de keyframes) puis `YOLOv8x` (détection d'objets mobiles).
     - Les 3 photographies $\rightarrow$ envoyées en parallèle vers `InsightFace` (biométrie), `PaddleOCR` (textes/plaques) et `YOLOv8x`.
   - L'**Arbre des Processus** s'enrichit immédiatement des branches initiales d'exécution.

2. **Phase 2 — Rapprochement & Détection d'Entités Inconnues** :
   - Supposons que sur la **Photo #1**, `InsightFace` isole **3 visages** :
     - **Visage 1** : L'interrogation de la base vectorielle **Qdrant** révèle une similarité de 94% avec le suspect principal déjà fiché (Amine B.). Le système associe la photo à sa fiche comme confirmation de présence.
     - **Visages 2 et 3** : Le vecteur ArcFace 512-d ne correspond à aucun profil existant dans le dossier. Il s'agit de **complices ou contacts non identifiés**.

3. **Phase 3 — Déclenchement Événementiel Récursif (EDA Tool Chaining)** :
   - Au lieu de laisser ces visages sans suite, l'architecture EDA émet un événement `UNMATCHED_FACE_DETECTED`.
   - En **Mode 3 (Récursif)** ou après validation en **Mode 2 (Pas à Pas)**, cet événement déclenche automatiquement un sous-workflow d'investigation :
     - Appel aux plugins de recherche inversée d'images et reconnaissance faciale OSINT (PimEyes / Maigret / OSINT Search).
     - Recherche de comptes sociaux associés aux silhouettes découvertes.
   - L'**Arbre des Processus** dérive de nouvelles branches interactives filles sous chaque visage.

4. **Phase 4 — Versement dans le Bassin d'Indices Non-Inclus de l'Onglet Suspect** :
   - Conformément aux règles anti-saturation et à la norme ISO 27037, les profils potentiellement découverts ne sont **pas directement injectés sur le graphe principal**.
   - Ils sont déposés dans le **Bassin d'Indices en Attente rattaché à l'onglet d'Amine B.** :
     - *« 2 personnes inconnues identifiées sur la photo #IMG-01 avec Amine B. ; l'outil Maigret a détecté 1 profil Instagram correspondant (@karim_dz23). Voulez-vous investiguer ou ajouter cette liaison ? »*
   - L'officier de police judiciaire peut d'un clic dans son onglet : **[➕ Inclure au sous-graphe]** ou **[✕ Écarter / Fausse piste]**.

---

## Chapitre 13 : Implémentation Phase 2A (PDF/HTML/NER GPU), Règles de Validation D16–D20 & Ergonomie UI

> **Référence technique détaillée :** [`doc/EXTRACTION_LOGIC.md`](EXTRACTION_LOGIC.md) et [`.agent/investigation-validation-rules.md`](../.agent/investigation-validation-rules.md).

### 13.1 Extension Ontologique à 50 Relations Directionnelles (D16–D18)
À l'ontologie socle de 37 types de nœuds et 47 relations s'ajoutent 3 relations canoniques livrées avec Phase 2A :
- **#48 `EXTRAIT_DE`** : Relie toute entité extraite (`personne`, `telephone`, `compte_bancaire`, `publication_sociale`, `message_chat`, `serveur_c2`, `fichier_apk`, etc.) à la pièce probatoire source (`scelle_numerique` / `document_judiciaire`).
- **#49 `UTILISE_EMAIL`** : Relie `personne`, `entreprise`, `compte_social` ou `site_web` à `adresse_email`.
- **#50 `IMPLIQUE_TRANSACTION`** : Relie `personne`, `entreprise` ou `compte_bancaire` à `transaction_financiere`.

Par ailleurs (Décision **D18**), les mentions géographiques algériennes (`wilaya`, `commune`) détectées dans les pièces PDF/HTML sont injectées en **attributs de contexte** (`wilaya`, `wilayas_mentionnees`, `commune`, `communes_donnees`) sur les entités co-occurrentes et métadonnées de pièce, sans créer de nœuds géographiques orphelins à valider.

### 13.2 Pipeline d'Extraction Statique PDF & HTML Hors-Ligne + NER Bilingue GPU
- **PDF (`pdf_extractor.py`)** : PyMuPDF + pdfplumber en Mode 1 (`Rapide`, 1 passe) et Mode 2 (`Complète`, 3 paliers validés par l'OPJ), avec normalisation Unicode NFKC des ligatures arabes et unification RIP BaridiMob (`00799999...`) + CCP 10 chiffres.
- **HTML (`html_extractor.py`)** : Parsing DOM 100 % hors-ligne via `BeautifulSoup4` + `lxml`, zéro requête réseau (anti-SSRF), nettoyage XSS et aperçu isolé par `<iframe sandbox="">` (`FilePreviewModal`).
- **NER Hors-Ligne sur GPU** : Double exécution `CAMeL-Lab/bert-base-arabic-camelbert-mix-ner` (arabe) et `Babelscape/wikineural-multilingual-ner` (`wikineural_ner.py`, français/anglais/latin en `float16`), couplée au filtrage par coréférence de rôle (`Plaignant`, `Suspect`, `Gérant`, `Titulaire`).
- **Tables de Staging PostgreSQL** : Stockage non-intrusif dans `extraction_runs`, `extracted_candidates` et `extracted_relation_candidates`, avec gestion CRUD complète (`PATCH`/`DELETE` audités) sur toutes les arêtes du graphe.

### 13.3 Gouvernance de Validation, Confiance 100 % & Isolement Strict (D19–D20)
1. **Isolement des Candidats (`Dossier Général` vs Onglet Isolé)** : Les entités candidates en attente et leurs prévisualisations fantômes ne s'affichent **jamais** dans le `Dossier Général` (`master`) ; elles sont exclusivement présentées dans l'onglet d'isolement de la pièce source (`actor_sphere`) et dans `CandidateValidationPanel`, doté de filtres par catégorie d'entité (`Acteurs`, `Télécoms`, `Finances`, `SOCMINT`, `Cyber`, etc.) et de groupes de relations sémantiques pliables.
2. **Périmètre Strict de Validation (D20)** : Seules les entités extraites et les relations sémantiques **entre entités extraites** exigent une validation humaine explicite (`PENDING`). En revanche :
   - La validation d'une entité extraite promeut automatiquement son lien `EXTRAIT_DE` vers la pièce glissée en `VERIFIED` (`100 %`).
   - Toute liaison créée manuellement par l'enquêteur est créée par défaut en `VERIFIED` (`100 %`), sauf modification ultérieure.
3. **Confiance 100 % & Changement de Calque Direct (D19)** : Toute entité affiche une confiance par défaut de `100 %` (`getDisplayedEntityConfidence`) tant que l'enquêteur ne la modifie pas manuellement. Un score à `100 %` sélectionne automatiquement `VERIFIED`, et le changement de calque s'opère directement sans modale bloquante tout en générant une entrée chaînée ISO 27037 avec motif automatique.
4. **Continuité Spatiale & Physique Live** : Tout nouveau nœud réagit directement à la simulation physique de forces, et toute entité candidate validée conserve exactement sa position `(X, Y)` avant et après validation (`candidatePositions` + `reconcileOptimisticNodeId`).

### 13.4 KPI Réels, Cascade Territoriale & Isolation Modale (`.agent/ui-ux-rules.md` §§16–17)
- **KPI Réels du Dossier (`caseMetrics.ts`)** : La `Synthèse de l'Affaire` et la `Boîte d'Arbitrage des Indices` sont calculées en temps réel à partir des données de l'enquête active (Préjudice DZD, Victimes/Plaintes, Suspects, Wilayas, Objets Analysés, À Investiguer / À Valider), sans aucune valeur de démonstration figée.
- **Cascade Administrative Responsive** : Sélecteur `Wilaya → Daïra → Commune` sur grille CSS fluide `.geo-cascade-grid` (`auto-fit, minmax(175px, 1fr)`).
- **Isolation Modale Complète (`ModalPortal`)** : Portail vers `document.body`, attribut HTML `inert` sur `.studio-shell`, piégeage de tabulation `Tab`/`Shift+Tab`, garde `hasOpenModal()` sur les événements clavier/molette du canevas, et confirmation par touche `Entrée` sur la modale de suppression (`DeleteNodesModal`).
