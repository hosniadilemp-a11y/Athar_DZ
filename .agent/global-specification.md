# Global Specification — Athar DZ / AegisInvestigate

> **Scope:** Complete system architecture, polyglot data model, 3-server physical topology, 76 OSINT/DFIR capabilities, 16 SNA functions, and 6-phase delivery roadmap.  
> **Normative References:** `doc/SPECIFICATION.md`, `.agent/ui-ux-rules.md`, `.agent/llm-no-mistakes-rules.md`, `DECISIONS.md`.

---

## 1. System Mission & Judicial Compliance
Athar DZ / AegisInvestigate is a visual criminal investigation and digital forensics studio designed for Judicial Police Officers (OPJ), criminal analysts, brigade chiefs, and magistrates.
- **Zero CS Jargon:** Investigators interact with legal concepts (cases, verified evidence, hypotheses, financial flows), never raw database or CLI internals.
- **ISO 27037 Chain of Custody:** Every digital artifact is SHA-256 hashed, immutable once sealed (WORM), and tracked in an append-only hash-chained audit ledger.
- **Human-in-the-Loop:** AI, SNA scores, and OSINT captures are always presented as **Candidate / Hypothesis** with method, parameters, and source. Only a human actor with a recorded reason can promote an item to **Verified**.

---

## 2. Three-Server Physical Topology
1. **Server 1 — Studio App Server (`SRV-STUDIO-01`, VLAN 20):**
   - Frontend Web Studio (`React 19` + `TypeScript`, WebGL/SVG canvas)
   - Backend API & Orchestrator (`Python 3.12`, `FastAPI`, `Pydantic v2`, `Celery`)
   - Local Sovereign AI (`Ollama` / `Llama-3-8B` Text-to-Cypher, `Faster-Whisper` Darija, `PyAnnote`, `ArcFace`)
2. **Server 2 — Polyglot Data & Storage Server (`SRV-DATA-01`, VLAN 30):**
   - **Neo4j 5.20+:** Master property graph topology & GDS projections (`Bolt TLS`)
   - **PostgreSQL 16 + PostGIS (+ TimescaleDB in prod):** Judicial cases, users/RBAC, Wilaya RLS, audit logs, geospatial geometries, high-volume CDRs
   - **Qdrant 1.9:** 512-d facial & 192-d voice biometric vector embeddings (`gRPC`)
   - **MinIO S3 Enterprise:** Immutable WORM Object Lock (`COMPLIANCE` mode) + RFC 3161 timestamps
   - **Elasticsearch 8.14:** Full-text multilingual search engine (Arabic/Darija/French morphological & phonetic analyzers, BM25, fuzzy entity resolution) & flattened JSON OSINT dump store
   - **Redis 7.2 Stack:** Ephemeral session state, Pub/Sub WebSocket bus, token-bucket rate limiters
3. **Server 3 — Phone Farm Automation Server (`SRV-FARM-01`, VLAN 40):**
   - Physical Android device racks (`ADB` / `Scrcpy` WebRTC) and multi-SIM GSM modems (Djezzy, Mobilis, Ooredoo)
   - Communicates with Studio App via **gRPC over mTLS**, **NATS/Redis Streams**, and **WebRTC**
   - **Zero Direct Access** to `SRV-DATA-01` (all incoming raw data is sanitized and SHA-256 hashed by `SRV-STUDIO-01`)

---

## 3. Canonical Data Model (GFPG — Generalized Forensic Property Graph)
- **37 Canonical Node Types** across **8 Operational Domains**:
  1. *Judiciaire & Territoire DZ (6):* `wilaya`, `daira`, `commune`, `unite`, `affaire`, `magistrat`
  2. *Acteurs Humains & Moraux (3):* `personne`, `entreprise`, `vehicule`
  3. *Télécoms & Forensique Mobile (5):* `telephone`, `carte_sim`, `appareil_mobile`, `antenne_bts`, `telecom_cdr`
  4. *Finances Criminelles & BaridiMob (5):* `compte_bancaire`, `transaction_financiere`, `guichet_gab`, `crypto_wallet`, `transaction_crypto`
  5. *SOCMINT, Web & Trackers (7):* `compte_social`, `publication_sociale`, `canal_telegram`, `message_chat`, `adresse_email`, `site_web`, `identifiant_infrastructure`
  6. *Cyber, Malwares & Forensique (5):* `fichier_apk`, `serveur_c2`, `certificat_tls`, `artefact_dfir`, `session_recherche`
  7. *Biométrie & Médias Numériques (3):* `enregistrement_vocal`, `empreinte_faciale`, `image_preuve`
  8. *Chaîne de Preuve & Scellés WORM (3):* `document_judiciaire`, `scelle_numerique`, `preuve_merkle`
- **50 Directional Relationship Types** (47 base ontology relations + 3 Phase 2A relations: `EXTRAIT_DE`, `UTILISE_EMAIL`, `IMPLIQUE_TRANSACTION` per Decisions D16–D18) with strict allowed source/target types, timestamp, weight, and provenance.
- **Note on Geographic Extraction (D18):** `wilaya` and `commune` remain canonical graph node types for territorial modeling, but PDF/HTML automated extractors attach them exclusively as entity/document metadata attributes (`wilaya`, `wilayas_mentionnees`, `commune`, `communes_donnees`) rather than emitting detached territory nodes.
- **8 Geoplottable GPS Node Types:** `antenne_bts`, `telecom_cdr`, `guichet_gab`, `vehicule`, `image_preuve`, `unite`, `commune`, `personne` (WGS84 `gps_lat`/`gps_lon` synced with PostGIS).

---

## 4. Analytical & Investigative Capabilities
- **16 Social Network Analysis (SNA) Algorithms (12 Core + 4 Complementary):**
  - *12 Core:* Link Prediction (`adamic_adar`, `jaccard`), Betweenness Centrality (Brandes), Community Detection (`louvain`, `label_propagation`), Role Classification (`node_classification`), Top-K Nodes (`top_k`), Threshold Path Expansion (`threshold_expand`), Temporal Subgraph (`temporal_subgraph`), Territorial Profiling (`activity_sector`), Shortest Path (`shortest_path_dijkstra`), K-Core (`k_core`), Structural Embeddings (`structural_embeddings`), Personalized PageRank (`personalized_pagerank`).
  - *4 Complementary:* Ego-Network N-Hop (`ego_network`), Articulation Points & Bridges (`articulation_points`), Closeness & Eigenvector Centrality (`closeness_eigenvector`), Temporal Diff (`temporal_diff`).
- **76 OSINT & DFIR Tools** across phone, social, domain/IP, financial, media/biometrics, and mobile forensics (deployed incrementally in Phases 2–5).

---

## 5. Six-Phase Incremental Roadmap & Dual-Track Process Factory

Le développement est organisé selon un **modèle d'ingénierie parallèle à deux pistes** :
- **Piste 1 (Socle Plateforme & Orchestration Studio) :** Évolution incrémentale de l'application et de l'infrastructure de données (Phases 1 à 6).
- **Piste 2 (Usine de Processus Forensiques & Catalogue Public — Process Factory) :** Développement, test déterministe sur jeux étalons et publication continue des plugins conformes au standard `ForensicPluginSPI` dans le registre public (`ProcessRegistry`), consommables immédiatement par le Popover d'Ingestion et l'Arbre des Processus sans attendre de refonte applicative.

### Découpage Révisé des 6 Phases :
- **Phase 1 (`v0.1 — Livrée / COMPLETED`):** Studio d'Enquête Visuel, Accordéon 37 nœuds, Nœuds Circulaires SVG, 5 Calques, 16 outils SNA, Socle FastAPI + Neo4j + PostgreSQL/PostGIS + Redis, Scénario 100 nœuds Candy Wheels, Surface UI d'ingestion non-intrusive avec Popover 3 Modes (Option B) et commutation multi-onglets (Option A).
- **Phase 2 (`v0.2` — Incrément 2A/2A+ Livré ; Infrastructure WORM/ES Planifiée) :**
  - *Livré (Phase 2A PDF/HTML + NER GPU, Décisions D16–D20) :* Extraction statique hors-ligne PDF (`PyMuPDF` + `pdfplumber` Modes 1 & 2) et HTML (`BeautifulSoup4` + `lxml`, anti-SSRF/XSS, `<iframe sandbox="">`), double NER GPU local (`CAMeL-Lab` arabe + `WikiNEuRal` multilingue), tables de staging PostgreSQL (`extraction_runs`, `extracted_candidates`, `extracted_relation_candidates`), `CandidateValidationPanel` dans les onglets isolés (`actor_sphere`) avec filtres par catégorie et CRUD relations (`PATCH`/`DELETE`), règles D19/D20 (`EXTRAIT_DE` auto-vérifié, liaisons manuelles `VERIFIED` 100 % par défaut, changement de calque direct audité).
  - *Planifié (Phase 2 Core) :* Blackboard WORM (MinIO S3 Compliance ISO 27037 + RFC 3161), Elasticsearch 8.14 (Plein-texte Arabe/FR + Bassin d'Indices Non-Inclus `PENDING_NON_INCLUDED`), Contrat backend ForensicPluginSPI & ProcessRegistry complet et ingestion Images/EXIF (*Lot A : ExifTool, OCR, Barcode/QR*).
- **Phase 3 (`v0.3`):** Bus Événementiel (EDA - Redis Streams + WebSockets), Workflows Temporal.io v1.24 (fan-out et boucles récursives), **Process Discovery Tree interactif** en direct, **Algorithme Actor Sphere complet** (traversée asymétrique orientée), intégration SPI des 76 briques OSINT (*Lot B : PhoneInfoga, Maigret, bbot, scrapers sociaux*).
- **Phase 4 (`v0.4`):** Dynamic Dataflow Multimodal, Base vectorielle Qdrant intégrée au Blackboard (ArcFace 512-d), Binders sémantiques spatiaux (Plaque ALPR $\in$ Voiture YOLO), plugins Vision lourds GPU CUDA (*Lot C : InsightFace Buffalo_L, YOLOv8x, PaddleOCR ALPR Algérie, Sherloq*).
- **Phase 5 (`v0.5`):** Télécoms Massifs (Relevés CDR millions de lignes via Polars + TimescaleDB), Triangulation cellulaire Voronoi, détection de co-déplacements et contradictions d'alibi, Cartographie SIG synchronisée (MapLibre GL JS + Deck.gl), Criminalistique vocale souveraine (*Lot D : Faster-Whisper Darija Algérien, PyAnnote Audio 3.1*).
- **Phase 6 (`v1.0`):** Mode 3 Récursif Autonome (saturation continue), Copilot IA Souverain 100% Local (Ollama / Qwen 2.5 32B / Llama 3 Text-to-Cypher), Générateur officiel du PV de Synthèse Judiciaire (PDF A4 numéroté ISO), Multi-tenancy 58 Wilayas (RLS PostgreSQL) et durcissement production.
