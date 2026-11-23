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

### 11.2 Problématique Topologique & Algorithme d'Extraction Ciblée ("Stop-at-Actors BFS")

#### La Problématique de Non-Convexité des Graphes Criminels
Les graphes d'investigation ne sont pas partitionnés en composantes connexes isolées. En raison de la présence d'entités relais à forte centralité (antennes relais BTS 4G, pages Facebook publiques, commerçants ou guichets postaux GAB partagés) :
- **Écueil du parcours naïf (Composante connexe complète)** : Extraire toutes les connexions directes et indirectes sans filtre aspire jusqu'à 80-90% du graphe global de l'affaire dans l'onglet, générant un effet d'encombrement (« hairball ») rendant l'onglet inutile.
- **Écueil du 1-hop strict** : Limiter l'extraction aux voisins directs omet des chaînes médiées fondamentales (ex: `Personne -> Téléphone -> Carte SIM -> Enregistrement vocal` ou `Personne -> Compte BaridiMob -> Transaction -> Compte Récepteur`).

#### L'Algorithme "Actor Sphere" (Frontière d'Arrêt aux Acteurs Humains/Moraux)
Pour résoudre ce dilemme, l'extraction de sous-graphe focalisé repose sur la distinction ontologique entre **Entités Sujets/Acteurs** (`personne`, `entreprise`) et **Entités Médiatrices/Actifs/Traces** (`telephone`, `carte_sim`, `compte_bancaire`, `vehicule`, `image_preuve`, `scelle_numerique`, `enregistrement_vocal`, `transaction_financiere`, etc.) :

1. **Parcours Traversant Libre (Objets & Traces)** : En partant du nœud racine $P_1$, l'algorithme de parcours en largeur (BFS) franchit librement toutes les arêtes vers des nœuds qui ne sont pas de type `personne` ou `entreprise`.
2. **Mur de Coupure aux Acteurs Tiers (Actor Cutoff Boundary)** : Dès qu'une liaison atteint un autre nœud Acteur $P_2 \neq P_1$ :
   - Le nœud $P_2$ est **inclus** dans le sous-graphe pour matérialiser le lien relationnel.
   - L'expansion récursive s'**arrête strictement** à $P_2$ (l'algorithme ne déploie pas le patrimoine ou les contacts personnels de $P_2$).
   - $P_2$ est affiché avec un indicateur visuel de frontière (*Anchor Node* avec badge *« +N entités masquées »*).
3. **Traitement des Collisions d'Actifs Partagés (Shared Asset Nodes)** : Lorsqu'un actif matériel ou financier (ex: un véhicule partagé ou un compte bancaire conjoint) est lié simultanément à $P_1$ et $P_2$, le nœud apparaît au centre de l'onglet avec une mise en surbrillance dorée (*Collision Marker*).
4. **Amortissement des Nœuds Hubs d'Infrastructure (Hub Dampening)** : Les entités d'infrastructure générale à degré élevé ($d(v) > 20$, telles que les antennes BTS ou les sites web grand public) sont intégrées à l'onglet mais n'étendent pas leur voisinage, évitant l'aspiration de contacts collatéraux hors du périmètre de l'enquête.

---

## Chapitre 12 : Ingestion Universelle Drag-and-Drop & Station de Dépouillement Forensique Multi-Formats

### 12.1 Ergonomie & Cibles de Dépôt Contextuelles (Contextual Drop Targets)
La plateforme intègre un moteur de glisser-déposer (Drag & Drop) universel conforme aux standards d'ergonomie W3C HTML5 Drag and Drop API et aux exigences de preuve judiciaire ISO/IEC 27037 :

1. **Dépôt sur Fond de Canevas ou Boîte d'Indices (Canvas / Staging Drop)** :
   - Déclenche un surlignage lumineux de la zone d'ingestion (`canvas-drop-zone-overlay`).
   - Calcule immédiatement l'empreinte cryptographique SHA-256 du fichier côté client avant tout envoi réseau.
   - Ouvre la **Station de Dépouillement Forensique** pour analyse automatisée, extraction d'entités et validation par l'enquêteur.
2. **Dépôt Direct sur un Nœud Existant (Targeted Entity Drop)** :
   - Si une image est déposée directement sur un nœud `personne` : ouverture d'un menu d'action rapide permettant d'assigner l'image comme **photo d'identité principale (avatar)**, d'extraire son vecteur biométrique ArcFace 512-d (`empreinte_faciale`), ou de l'associer comme pièce probatoire liée (`image_preuve` avec arête `ASSOCIE_A`).
   - Si un document PDF ou un fichier audio est déposé sur une entité : rattachement probatoire direct sous forme de scellé lié à l'entité cible.

---

### 12.2 Taxonomie Complète des Formats Ingestibles & Pipelines d'Extraction

Le tableau normatif ci-dessous détaille le traitement forensique automatisé appliqué selon l'extension et le type MIME du fichier ingéré :

| Famille de Fichiers | Extensions Détectées | Moteurs & Outils d'Extraction Locaux | Données & Attributs Extraits | Nœuds & Relations Générés dans Athar |
| :--- | :--- | :--- | :--- | :--- |
| **1. Photographies & Captures d'Écran** | `.jpg`, `.jpeg`, `.png`, `.webp`, `.heic`, `.tiff` | • **ExifTool 12.84**<br>• **InsightFace / ArcFace**<br>• **PaddleOCR v2.7** | Coordonnées GPS latitude/longitude, modèle d'appareil photo, date/heure de capture, texte OCR (reçus, chèques, tickets), vecteurs faciaux 512-d, empreinte pHash anti-doublon. | • Nœud `image_preuve`<br>• Nœud `empreinte_faciale` (`CONTIENT_VISAGE`)<br>• Si GPS : projection sur `MapView`<br>• Si reçu financier : proposition de nœud `transaction_financiere`. |
| **2. Notes Vocales & Fichiers Audio** | `.opus`, `.m4a`, `.ogg`, `.mp3`, `.wav` | • **Faster-Whisper (fine-tuné Darija)**<br>• **PyAnnote Audio 3.1** | Transcription textuelle intégrale de l'arabe dialectal algérien (Darija), séparation acoustique locuteur victime / suspect (diarisation), détection de montants en DZD et toponymes de wilayas. | • Nœud `enregistrement_vocal`<br>• Propriété `transcription_texte`<br>• Relations `VOIX_DE` vers `personne`, `TRANSMIS_PAR` vers `telephone`. |
| **3. Procès-Verbaux & Documents Texte** | `.pdf`, `.docx`, `.doc`, `.odt`, `.txt` | • **PyMuPDF / pdfplumber**<br>• **python-docx**<br>• **CAMeL Tools / Arabic-NER / Qwen 2.5** | Texte intégral, métadonnées auteur/imprimante, entités nommées (noms de suspects, matricules de police, numéros de comptes CCP/BaridiMob à 20 chiffres, numéros de téléphone mobiles algériens 05/06/07, immatriculations véhicules). | • Nœud `document_judiciaire` ou `scelle_numerique`<br>• Propositions d'instanciation de nœuds `personne`, `telephone`, `compte_bancaire`, `vehicule`. |
| **4. Relevés Télécom & Extractions Bancaires** | `.csv`, `.xlsx`, `.xls`, `.tsv` | • **Moteur Heuristique Polars / Pandas**<br>• **Validateurs RegEx E.164 / RIP** | Détection automatique de schéma CDR (Call Detail Record) ou relevés bancaires : colonnes Appelant, Appelé, Horodatage, Durée d'appel, Identifiant Cell-ID BTS, Montants débit/crédit. | • Génération en masse d'arêtes `COMMUNIQUE_AVEC` entre nœuds `telephone`<br>• Horodatage pour la `TimelineView`<br>• Nœuds `antenne_bts` positionnés par géolocalisation. |
| **5. Pages Web & Captures OSINT** | `.html`, `.htm`, `.mhtml`, `.warc`, `.url` | • **Trafilatura**<br>• **ArchiveBox ISO 28500**<br>• **BeautifulSoup4** | Titre de page, métadonnées OpenGraph, e-mails de contact, identifiants de suivi publicitaire (`UA-*`, Pixel Meta), liens sociaux (Telegram, Facebook, Instagram), horodatage de capture. | • Nœud `site_web`<br>• Nœuds satellites : `compte_social`, `adresse_email`, `telephone`, `identifiant_infrastructure`. |
| **6. Vidéosurveillance & Vidéos** | `.mp4`, `.mkv`, `.avi`, `.mov` | • **FFmpeg 6.1**<br>• **YOLOv8**<br>• **InsightFace** | Horodatage de flux vidéo, métadonnées conteneur, découpage automatisé des images clés (*keyframes*) sur transition de plan, détection de visages et plaques d'immatriculation. | • Nœud principal `scelle_numerique`<br>• Images clés dérivées en `image_preuve` liées par `EXTRAIT_DE`<br>• Rapprochement avec les suspects du dossier. |
| **7. Fichiers DFIR & Extractions Mobiles** | `.apk`, `.sqlite`, `.db`, `.pcap`, `.plist` | • **Jadx / Androguard**<br>• **SQLite3 Driver**<br>• **Scapy / TShark** | • APK : Nom de package, permissions Android, URLs de Command & Control (C2), clés de signature keystore.<br>• SQLite : Messages extraits de `msgstore.db` (WhatsApp) ou Telegram.<br>• PCAP : Requêtes DNS, adresses IP de destination, certificats TLS. | • Nœuds `fichier_apk`, `serveur_c2`, `canal_telegram`, `message_chat`, `certificat_tls`, `identifiant_infrastructure`. |
| **8. E-mails & Correspondances Brutes** | `.eml`, `.msg`, `.mbox` | • **Python email parser**<br>• **mail-parser** | En-têtes SMTP de routage, adresses IP source dans `Received:`, statuts d'authentification SPF/DKIM/DMARC, sujet, horodatage d'expédition, pièces jointes binaires extraites. | • Nœuds `adresse_email` (émetteur et destinataires)<br>• Nœud `identifiant_infrastructure` pour l'adresse IP de relais<br>• Réinjection récursive des pièces jointes. |
| **9. Conteneurs d'Archives** | `.zip`, `.tar.gz`, `.rar`, `.7z` | • **ZipFile Sécurisé** (filtre anti-Path Traversal / Zip-Slip) | Arborescence de répertoires, intégrité d'archivage, décompression isolée en sandbox temporaire (`/tmp/athar_ingest_sandbox`). | • Nœud racine `scelle_numerique` (empreinte SHA-256 de l'archive)<br>• Arborescence de pièces jointes filles créées et liées par `EXTRAIT_DE`. |

---

### 12.3 La Station de Dépouillement Forensique (Forensic Ingestion Station)

Pour préserver l'admissibilité des preuves au regard du Code de Procédure Pénale algérien et de la norme **ISO/IEC 27037 (Conduite relative aux preuves numériques)**, l'ingestion n'injecte jamais directement des nœuds sans validation humaine. 

Elle s'articule autour d'un flux d'interaction en 4 étapes séquentielles :

1. **Étape 1 — Scellement Cryptographique & Enregistrement d'Audit** :
   - Dès la réception des octets du fichier, l'application génère l'empreinte `SHA-256` et préserve le nom de fichier original, la taille en octets et la date de dernière modification.
   - Un jeton d'horodatage RFC 3161 est sollicité et consigné dans le journal d'audit Merkle.
2. **Étape 2 — Extraction d'Entités en Arrière-Plan** :
   - Le worker approprié (OCR, Whisper Darija, NER texte, parseur de relevés) s'exécute localement.
   - Une boîte de dialogue modale haute fidélité s'affiche à l'écran : **« Station de Dépouillement Forensique — [Nom du Fichier] »**.
3. **Étape 3 — Tableau de Réconciliation & Désambiguïsation (Pre-Flight Review)** :
   - Le système dresse la liste des entités découvertes avec une proposition de rapprochement automatique :
     - *Exemple 1* : Un numéro de téléphone `0555019283` correspond exactement à un nœud déjà existant sur le graphe $\rightarrow$ option par défaut : **Rattacher au nœud existant** (enrichissement de métadonnées).
     - *Exemple 2* : Un nom `Amine B.` détecté avec un score de similarité floue de 92% avec le suspect principal $\rightarrow$ l'enquêteur choisit par bouton radio : `[Fusionner avec Amine B.]` ou `[Créer une nouvelle entité distincte]`.
     - *Exemple 3* : Faux positifs potentiels $\rightarrow$ cases à cocher permettant à l'OPJ de désélectionner les entités non pertinentes avant injection.
4. **Étape 4 — Affectation de Calque & Déversement Sécurisé** :
   - Par défaut, les nouvelles entités issues d'extractions automatisées sont versées dans le **Calque 2 (`OSINT_RAW`)** ou **Calque 4 (`HYPOTHESIS`)**.
   - L'élévation directe en **Calque 1 (`VERIFIED`)** impose la saisie d'un motif de certification d'officier de police judiciaire (`reason`) consigné dans le registre légal.

---

### 12.4 Architecture en Microservices Composables & Coopératifs (Chained Microservices)

Pour éviter les architectures monolithiques lourdes et permettre une scalabilité horizontale sur des nœuds GPU/CPU hétérogènes, le moteur d'ingestion (Option B) repose sur une **chaîne de microservices coopératifs et composables** :

```
[Fichier Déposé (ex: Photo)]
            │
            ▼
┌────────────────────────────────────────────────────────┐
│  Microservice 1 : Ingress & Ordonnanceur Média         │
│  • Valide le type MIME, calcule le SHA-256             │
│  • Fan-out / Dispatche vers les services spécialisés   │
└───────────┬────────────────────┬───────────────────┬───┘
            │                    │                   │
            ▼                    ▼                   ▼
┌───────────────────────┐ ┌──────────────┐ ┌────────────────────────┐
│ Microservice 2 :      │ │Microservice 3│ │ Microservice 4 :       │
│ Extraction Faciale    │ │OCR, Textes   │ │ Détection d'Objets     │
│ & Biométrie           │ │& Plaques ALPR│ │ (YOLOv8 / Grounding)   │
│ (InsightFace/ArcFace) │ │(PaddleOCR)   │ │ (Voiture, Camion, Tel) │
└───────────┬───────────┘ └──────┬───────┘ └─────────┬──────────────┘
            │                    │                   │
            └────────────────────┼───────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────┐
│  Microservice 5 : Binder Sémantique & Corrélation      │
│  • Associe la plaque "16-118-208" au nœud "Voiture"    │
│  • Associe le visage recadré au nœud "Personne"        │
│  • Synthétise les propositions d'entités structurées   │
└────────────────────────────────┬───────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────┐
│  Microservice 6 : Résolution d'Entités & Indexation    │
│  • Requête Elasticsearch (BM25/Fuzzy) & Qdrant (ArcFace│
│  • Classement : Ajoutés au Graphe vs Bassin Non-Inclus │
└────────────────────────────────────────────────────────┘
```

#### Exemple Concret de Coopération Multi-Services sur une Image :
1. **Microservice d'Extraction Faciale (`srv-face`)** : Isole 2 visages, génère les imagettes recadrées et leurs vecteurs 512-d. Il appelle le microservice vectoriel Qdrant pour vérifier s'ils correspondent à un suspect connu.
2. **Microservice OCR & Plaques (`srv-ocr-alpr`)** : Détecte un texte imprimé *"Hôtel El-Djazair"* et une plaque d'immatriculation algérienne *"04821 116 16"*.
3. **Microservice Détecteur d'Objets (`srv-yolo-objects`)** : Repère une voiture noire (SUV), un téléphone portable sur une table et une liasse de billets.
4. **Microservice Binder Sémantique (`srv-feature-binder`)** : Ce service fait coopérer les résultats :
   - La boîte englobante de la plaque d'immatriculation est située **à l'intérieur** de la boîte de la voiture $\rightarrow$ il fusionne la détection pour proposer un nœud unique `vehicule` (Modèle: SUV Noir, Immatriculation: *04821 116 16*), plutôt que deux entités déconnectées !

---

### 12.5 Gestion Anti-Saturation : Groupement par Catégories & Bassin d'Indices Non-Inclus (Pending Clues Pool)

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
   - Elles sont stockées dans le dossier d'affaire sous le statut `status: PENDING_NON_INCLUDED` et indexées dans **Elasticsearch 8.14** (pour les textes/labels/métadonnées) et **Qdrant** (pour les empreintes de visages/véhicules).
   - **Recherche Rétroactive & Découverte Croisée** : 
     Si, 2 semaines plus tard, l'enquêteur intercepte une écoute mentionnant *"un SUV noir immatriculé 16"*, la recherche globale dans Athar lui signale :
     > 💡 **Recoupement Trouvé :** *Un véhicule correspondant (Plaque 04821 116 16) a été détecté dans l'arrière-plan de la photo #IMG-089 versée le 23/11. Voulez-vous promouvoir cette entité sur le graphe actif ?*

---

### 12.6 Généralisation aux Autres Types de Fichiers

La chaîne de microservices coopératifs et le bassin d'indices non-inclus s'appliquent identiquement à tous les formats :

| Type de Fichier | Chaîne de Microservices Coopératifs | Entités Prioritaires (Graphe) | Bassin d'Indices Non-Inclus (Index Recherche) |
| :--- | :--- | :--- | :--- |
| **Audio / Vocaux** | `srv-audio-clean` $\rightarrow$ `srv-whisper-darija` $\rightarrow$ `srv-pyannote-diarize` $\rightarrow$ `srv-voiceprint` $\rightarrow$ `srv-arabic-ner` | Locuteurs principaux (Victime, Escroc), montants et lieux clés de RDV. | Bruits de fond (sirène, adhan, musique), locuteurs tertiaires, mots isolés. |
| **Documents PDF/Word** | `srv-doc-parser` $\rightarrow$ `srv-layout-lm` $\rightarrow$ `srv-ner-qwen` $\rightarrow$ `srv-geo-resolver` | Suspects nommés, comptes bancaires, numéros de téléphone visés par la plainte. | Greffiers, articles de loi cités, signatures, 40 mentions administratives secondaires. |
| **Relevés CDR (CSV)** | `srv-cdr-csv-parser` $\rightarrow$ `srv-operator-id` $\rightarrow$ `srv-bts-geocoder` $\rightarrow$ `srv-frequency-analyzer` | Les 5 correspondants les plus fréquents du suspect et les bornages suspects. | Les 4 500 autres appels ordinaires du mois, consultables par filtre horaire/numéro. |
| **Captures Web HTML** | `srv-web-trafilatura` $\rightarrow$ `srv-tracker-extractor` $\rightarrow$ `srv-social-links` $\rightarrow$ `srv-whois-ip` | Titulaire de la page, profil Telegram/WhatsApp de contact, identifiant Google Analytics pivot. | Les 150 liens hypertextes sortants, cookies tiers et ressources CSS archivés en WARC. |
| **Vidéos MP4** | `srv-ffmpeg-keyframes` $\rightarrow$ `srv-bytetrack` $\rightarrow$ `srv-yolo-alpr` $\rightarrow$ `srv-insightface` | Individus et véhicules interagissant directement sur la scène de l'infraction. | Les centaines d'autres passants et voitures en circulation durant l'enregistrement. |

---

### 12.7 Unification de l'Ingestion OSINT & Orchestration Événementielle Récursive (Event Loops)

Le pipeline de microservices d'extraction n'est pas un système isolé réservé aux seuls fichiers glissés-déposés par l'enquêteur : **il s'applique de manière unifiée à tous les artefacts rapatriés par les 76 briques OSINT de la plateforme**.

#### Architecture de la Boucle Récursive (Feedback Loop Temporal.io) :
Lorsqu'un connecteur OSINT (ex. `brick.socmint.facebook_dumper` ou scraper Instagram/Telegram) collecte le profil d'une cible, il rapatrie un faisceau d'objets multimédias bruts (par exemple : **3 photographies**, **4 publications textuelles** et **1 vidéo**). 

1. **Phase 1 — Ingestion & Dispatch Parallèle (Fan-Out)** :
   - L'orchestrateur de workflow **Temporal.io v1.24** instancie un workflow d'affaire et dispatche chaque objet vers son microservice d'analyse spécialisé :
     - Les 4 publications texte $\rightarrow$ transmises au modèle NER arabe/français (`CAMeL-Lab` / `Qwen 2.5`).
     - La vidéo $\rightarrow$ transmise à `FFmpeg` (découpage de keyframes) puis `YOLOv8x` (détection d'objets mobiles).
     - Les 3 photographies $\rightarrow$ envoyées en parallèle vers `InsightFace` (biométrie), `PaddleOCR` (textes/plaques) et `YOLOv8x`.

2. **Phase 2 — Rapprochement & Détection d'Entités Inconnues** :
   - Supposons que sur la **Photo #1**, `InsightFace` isole **3 visages** :
     - **Visage 1** : L'interrogation de la base vectorielle **Qdrant** révèle une similarité de 94% avec le suspect principal déjà fiché (Amine B.). Le système associe la photo à sa fiche comme confirmation de présence.
     - **Visages 2 et 3** : Le vecteur ArcFace 512-d ne correspond à aucun profil existant dans le dossier. Il s'agit de **complices ou contacts non identifiés**.

3. **Phase 3 — Déclenchement Événementiel Récursif (Tool Chaining)** :
   - Au lieu de laisser ces visages sans suite, l'orchestrateur émet un événement `UNMATCHED_FACE_DETECTED`.
   - Cet événement déclenche automatiquement un sous-workflow d'investigation :
     - Appel aux outils de recherche inversée d'images et reconnaissance faciale OSINT (PimEyes / Maigret / OSINT Search).
     - Recherche de comptes sociaux associés aux silhouettes découvertes.

4. **Phase 4 — Versement dans le Bassin d'Indices Non-Inclus de l'Onglet Suspect** :
   - Conformément aux règles anti-saturation et à la norme ISO 27037, les profils potentiellement découverts ne sont **pas directement injectés sur le graphe principal**.
   - Ils sont déposés dans le **Bassin d'Indices en Attente rattaché à l'onglet d'Amine B.** :
     - *« 2 personnes inconnues identifiées sur la photo #IMG-01 avec Amine B. ; l'outil Maigret a détecté 1 profil Instagram correspondant (@karim_dz23). Voulez-vous investiguer ou ajouter cette liaison ? »*
   - L'officier de police judiciaire peut d'un clic dans son onglet : **[➕ Inclure au sous-graphe]** ou **[✕ Écarter / Fausse piste]**.
