# AegisInvestigate — Full Technical & Functional Specification

> **"Photoshop for Criminal & OSINT Investigations"**  
> A self-hosted, forensic-grade criminal investigation and OSINT orchestration platform combining a **Multi-Layered Knowledge Graph Studio**, a **Dual-Mode (Non-LLM Deterministic + Optional LLM Copilot) Automation Engine**, and **76+ Containerized OSINT & Forensic Bricks**.

---

## 1. Product Vision & Core Architectural Pillars

### 1.1 The "Photoshop for Investigations" Paradigm
Traditional OSINT tools either dump raw text logs or flood a single graph canvas with hundreds of unverified nodes, destroying evidentiary clarity. **AegisInvestigate** introduces non-destructive **Investigation Layers** and a synchronized 4-view workspace:

1. **Multi-Layered Canvas**:
   - **Layer 1 — Verified Forensic Evidence (`VERIFIED`)**: Locked, court-admissible entities and links verified by an investigator and backed by SHA-256 + RFC 3161 timestamped artifacts.
   - **Layer 2 — Raw OSINT Discovery (`OSINT_RAW`)**: Automated output from OSINT Bricks awaiting analyst triage. Can be toggled off at any moment or promoted to Layer 1 with one click.
   - **Layer 3 — Infrastructure, Telecom & Financial Overlays (`INFRA`)**: Technical pivots (IPs, ASNs, MongoDB ObjectIds, Meta Pixels, CDR cell towers, crypto hops).
   - **Layer 4 — Hypotheses & AI Inferences (`HYPOTHESIS`)**: Candidate suspect clusters, fuzzy alias matches, and LLM-proposed links (rendered with dashed borders).
2. **Synchronized Multi-Viewport**:
   - **Knowledge Graph Canvas** (Cytoscape.js + Sigma.js WebGL)
   - **Chronological Forensic Timeline** (Vis-Timeline / Timesketch model)
   - **Geospatial Intelligence Map** (MapLibre GL JS for cell towers, EXIF GPS, GeoCLIP heatmaps, ALPR sightings)
   - **Evidence Locker & History Stack** (Non-destructive undo/redo checkpoint DAG and raw artifact viewer)

---

### 1.2 Dual-Mode Intelligence: Works 100% Without LLM & Accelerated With LLM

| Capability | Mode A: Non-LLM Deterministic Engine (Always Active) | Mode B: Optional LLM Copilot (Local Ollama/vLLM or Cloud API) |
| :--- | :--- | :--- |
| **Clue Extraction** | Deterministic Regex + AST parsers for URLs, E.164 Phones, Emails, IBAN/CCP, Crypto addresses, MongoDB ObjectIds, UUIDs, Tracker IDs, EXIF. | Multilingual & unstructured extraction (e.g., parsing French/Arabic/Darija scam posts, voice note transcripts, obfuscated phone numbers, modus operandi). |
| **Tool Recommendation** | Strict **Typed Capability Graph** matching (`Brick.input_entities` $\cap$ `Node.type`) weighted by the active **Case Profile**. | Context-aware ranking that reads the full case summary and explains *why* a specific brick sequence is highest priority. |
| **Multi-Brick Chaining** | Pre-built deterministic DAG Playbooks + BFS pathfinding across Brick input/output schemas. | Dynamic synthesis of custom multi-step DAG Playbooks tailored to novel scam or crime patterns. |
| **Execution Control** | Investigator configures each Brick or Playbook as **`Auto-Run`** (immediate execution for passive/safe bricks) or **`Review-Run`** (1-click human approval queue). | All LLM-proposed automations are presented as visual pipelines that the user can choose to **`Auto-Run`** or **`Review-Run`**. |

---

## 2. End-to-End Walkthrough: The "Facebook Tyre Scam" Investigation

Below is the step-by-step trace of how AegisInvestigate processes a real-world e-commerce scam case:

1. **Seed Clues Entered by Investigator (Stage 1)**:
   - Investigator creates `Case #2026-SCAM-089` (Profile: *Online Scam & Fraud*) and adds two clues to **Layer 1 (`VERIFIED`)**:
     - `SocialAccount`: `fb.com/pneus.promo.dz`
     - `SocialPost`: Facebook Marketplace Ad `#98124` (*"Liquidation 4 Michelin Tyres -60%"*)
2. **Automated Extraction & Forensic Preservation (Stage 2)**:
   - `brick.socmint.post_archiver` (`Auto-Run`) captures a full WARC archive, DOM snapshot, and PNG screenshot of the post and profile into the **MinIO WORM Vault** with a `SHA-256` digest.
   - `brick.socmint.ioc_extractor` (`Auto-Run`) extracts:
     - `URL`: `https://promo-pneus-express.shop/order?uid=672f9a10c8b4a100129b4412`
     - `PhoneNumber`: `+213 555 019 283`
     - `Image`: 3 attached warehouse tyre photos (flagged by `brick.media.reverse_image_search` as stolen stock photos).
3. **Branch A — Link, Database ID & Infrastructure Pivot (Stage 3A)**:
   - On the newly created `URL` node, the Capability Engine proposes the **Web & DB-ID Brick Chain**:
     - `brick.web.dom_db_id_extractor` parses the URL query parameters and JavaScript bundle, extracting:
       - `DatabaseID`: MongoDB ObjectId `672f9a10c8b4a100129b4412`
       - `TrackerID`: Meta Pixel `88419203314` + exposed Supabase project URL
     - `brick.web.objectid_uuid_decoder` deterministically decodes the 24-hex MongoDB ObjectId into its exact creation timestamp (`2026-11-01 14:22:08 UTC`) and 5-byte server/process fingerprint (`c8b4a10012`).
     - `brick.web.dns_whois_history` + `brick.web.shodan_censys_host` uncover the origin IP (`185.199.108.153`) and JARM TLS fingerprint.
     - `brick.web.tracker_reverse_pivot` queries URLScan/PublicWWW for Meta Pixel `88419203314`, discovering **2 sibling scam domains** operated by the same actor.
4. **Branch B — Phone Number to OSN Accounts Pivot (Stage 3B)**:
   - On the `PhoneNumber (+213 555 019 283)` node, the Capability Engine proposes the **Phone & Identity Brick Chain**:
     - `brick.identity.phoneinfoga` (`Auto-Run`) identifies the carrier (Ooredoo Algeria) and search footprints.
     - `brick.identity.ignorant` (`Review-Run`) checks social media registration endpoints and confirms active Instagram and Snapchat bindings.
     - `brick.socmint.telegram_lookup` & `brick.socmint.whatsapp_business` (`Review-Run`, routed via the **Encrypted Sock-Puppet Vault**) resolve the phone number to:
       - Telegram account `@amine_import` (permanent numeric ID `519283741`)
       - WhatsApp Business profile with avatar photo
       - Instagram account `@auto_pieces_pro` (matched via `toutatis` masked recovery phone check + **89% ArcFace facial similarity** on avatars via `brick.media.deepface_biometrics`).
5. **Identity Resolution & Judicial Requisition Export (Stage 4)**:
   - The Entity Resolution Engine links the OSN cluster and infrastructure cluster into a candidate `SuspectCluster` on **Layer 4 (`HYPOTHESIS`)**.
   - Once reviewed by the investigator, the cluster is promoted to **Layer 1 (`VERIFIED`)**, and `brick.police.dossier_requisition_gen` exports a court-ready PDF dossier and formal judicial requisitions for the telecom carrier and hosting registrar.

---

## 3. Complete Technology Stack Specification

### 3.1 Presentation Layer (Investigation Studio UI)
- **Framework**: React 19 + Next.js (App Router) + TypeScript 5
- **Graph Visualization**:
  - **Cytoscape.js** (Compound nodes, Dagre/Cola/Cose-Bilkent layouts, interactive context menus for graphs up to 5,000 elements)
  - **Sigma.js + Graphology (WebGL)** (High-density rendering for 50,000+ node CDR telecom or crypto transaction graphs)
- **Synchronized Timeline**: `vis-timeline` + custom WebGL brush scrubber
- **GEOINT Map**: `MapLibre GL JS` + `Deck.gl` (offline vector tiles, cell tower azimuth cones, GeoCLIP probability heatmaps, trajectory polylines)
- **State & Real-Time**: `Zustand` (Canvas & Layer state + History Undo/Redo DAG), `TanStack Query`, native WebSockets (JSON-Patch live streaming)

### 3.2 Backend Core, Analysis & Orchestration Services
- **API & Core Services**: Python 3.12 + **FastAPI** + **Pydantic v2** + **SQLAlchemy 2.0 (Async)**
- **Workflow & Brick Orchestration**: **Temporal.io** (durable DAG execution, exponential retries, human-in-the-loop `Review-Run` signals) + **Redis Streams / RabbitMQ** (event-driven choreography)
- **Graph Analytics & Entity Resolution**: `NetworkX`, `igraph`, `Neo4j GDS`, `RapidFuzz` (Jaro-Winkler), `phonenumbers` (E.164 canonicalization), `ImageHash` (pHash/dHash)
- **Optional LLM Router**: **LiteLLM** gateway supporting:
  - **100% Local / Air-Gapped LLMs**: `Ollama` or `vLLM` running `Qwen-2.5-14B/32B-Instruct`, `Llama-3.3-70B`, or `Mistral-Small`
  - **Cloud APIs (When Permitted)**: OpenAI, Anthropic Claude, Google Gemini

### 3.3 Storage Layer (Polyglot Persistence)
1. **Neo4j 5.x Enterprise (Knowledge Graph Database)**: Stores all case entities, typed relationships, layer assignments, temporal intervals, confidence scores, and enables index-free adjacency graph traversals across criminal syndicates.
2. **PostgreSQL 16 + TimescaleDB (Relational, Audit & Telecom Core)**: Stores cases, RBAC permissions, the deterministic Brick Capability Registry, workflow state, partitioned CDR hyper-tables, and the **Immutable Hash-Chained Forensic Audit Ledger**.
3. **MongoDB 7.x (Unstructured OSINT & Scraping Depot)**: Stores raw polymorphic BSON document dumps from 500+ scrapers, website HTML DOMs, Meta tracking pixels, and unstructured API payloads with Snappy block compression.
4. **MinIO S3 (Forensic Evidence Vault)**: Stores WARC web archives, screenshots, intercepted voice notes, CDR spreadsheets, and court artifacts under **S3 Object Lock (WORM Compliance Mode)**.
5. **Qdrant (Vector Database)**: Stores 512-d facial recognition vectors (`ArcFace`), speaker voiceprints (`PyAnnote 3.1`), image geolocation vectors (`GeoCLIP`), and document chunk embeddings with native single-stage metadata filtering.
6. **Redis 7 Stack (Cache, Event Bus & Rate-Limit Broker)**: Enforces distributed token-bucket rate limits (`CL.THROTTLE`) per OSINT source and per sock-puppet account, Celery task queue brokering, and sub-millisecond WebSocket fan-out.

### 3.4 OPSEC & Containerized Brick Sandbox
- **Container Isolation**: Every OSINT tool runs as a rootless, ephemeral Docker container (`--cap-drop=ALL`, `--security-opt=no-new-privileges`, read-only root filesystem) spawned via a restricted Docker Socket Proxy.
- **Network Egress Tiers**:
  - `OFFLINE_LOCAL`: `--network=none` (ExifTool, Sherloq, ObjectId decoder, DeepFace, Faster-Whisper, PyAnnote).
  - `PASSIVE_API`: Routed via API gateway to passive caches (Shodan, URLScan, Wayback, VirusTotal).
  - `RESIDENTIAL_PROXY / TOR`: Active target queries routed through `Gluetun` WireGuard VPN / Tor SOCKS5 / rotating residential proxies.
- **Sock-Puppet Session Vault**: AES-256-GCM encrypted credential and cookie vault managing covert accounts for Telegram (`Telethon`), Instagram (`Instaloader`/`Osintgram`), Facebook (`Playwright`), and WhatsApp, with automatic 2FA TOTP generation and cooldown tracking.

### 3.5 Mobile Device Farm & GSM SIM Bank Subsystem (Physical & Virtual Hardware Architecture)
To penetrate mobile-only walled gardens (WhatsApp Business, Telegram, Truecaller, Viber, BaridiMob) that block standard headless scrapers and desktop emulators, the platform integrates a dedicated mobile infrastructure:
1. **ReDroid Virtual Android 13 Containers**:
   - Containerized Android 13 instances running inside Docker on the host Linux kernel via binder IPC, Ashmem, and GPU acceleration.
   - Requires zero heavy QEMU hardware emulation, allowing 20+ isolated Android instances per workstation with <1.5 GB RAM per instance.
   - Supports automated container recycling upon dirty state or session termination.
2. **Physical 4G GSM SIM Bank (Algerian Carriers)**:
   - Dedicated multi-port SIM bank hardware (CH340 USB/IP serial interface) hosting rotating physical SIM cards from Mobilis, Djezzy, and Ooredoo.
   - An asynchronous daemon monitors incoming AT unsolicited result codes (`+CMTI: "SM", <index>`) to read incoming SMS verification codes in <3 seconds.
   - Auto-forwards 2FA OTP tokens directly into Appium authentication handlers without human investigator intervention.
3. **Appium 2.x & Scrcpy WebRTC Low-Latency Mirroring**:
   - **Automated Workflow**: Appium 2.x drives UI automation (navigating WhatsApp chat threads, opening media catalogs, downloading voice notes, and capturing screenshot proof).
   - **Human-in-the-Loop Mirroring**: `scrcpy-server` streams 60 FPS video directly to the investigator's browser via WebSockets / WebRTC with <30ms latency, enabling real-time touch, pinch-to-zoom, and text input from the web UI.
4. **Zygisk & Magisk Anti-Root Cloaking**:
   - Injects Shamiko / Zygisk modules into the Android zygote process to conceal root binaries, ADB debugging flags, and containerization artifacts from banking and security-hardened apps (e.g. BaridiMob, WhatsApp).
5. **Mitmproxy HTTPS Interception & Certificate Pinning Bypass**:
   - Injects a qualified local root CA into the system trust store (`/system/etc/security/cacerts/`) via an ephemeral Magisk overlay, enabling real-time decryption and extraction of API JSON payloads, uploaded media, and WebSocket streams.

---

### 3.6 Exhaustive Software Engineering Benchmark: Why Every Chosen Database and Tool is Superior for Crime Investigation

| Subsystem / Tier | Selected Technology | Direct Alternatives Compared | Why Selected Engine is Superior for Digital Investigations |
| :--- | :--- | :--- | :--- |
| **Knowledge Graph Database** | **Neo4j 5.x Enterprise** (Cypher + GDS) | PostgreSQL Recursive CTEs, JanusGraph + ScyllaDB, NetworkX | **Native Index-Free Adjacency:** $O(1)$ memory pointer-hopping per hop vs $O(\log N)$ or multi-table JOINs. Uncovers cross-case criminal syndicates across 6+ degrees of separation in sub-millisecond time. In-memory Graph Data Science algorithms (*Louvain, PageRank, Betweenness*) automatically pinpoint money mules and syndicate ringleaders. |
| **Raw OSINT Ingestion Store** | **MongoDB 7.x** (WiredTiger BSON) | PostgreSQL JSONB, Apache Cassandra / ScyllaDB | **Polymorphic Ingestion:** Seamlessly absorbs chaotic, rapidly mutating HTML DOMs, HTTP headers, tracking pixels, and unstructured JSON dumps from 500+ scrapers with zero schema migration overhead. Snappy compression yields ~70% disk savings on text dumps. Change Streams trigger real-time clue extraction reactively. |
| **Relational Core & Case Ledger** | **PostgreSQL 16 + TimescaleDB** | MySQL 8.x, SQLite 3, CockroachDB | **ACID Serializability & Legal Proof:** Row-Level Security (RLS) guarantees multi-tenant precinct isolation. TimescaleDB hyper-tables partition millions of telecom Call Detail Records (CDRs) by time/BTS cell tower for instant spatial overlap analysis. Forward row-chaining (SHA-256 Merkle hashes) creates an unalterable audit ledger. |
| **Forensic Evidence Safe (WORM)** | **MinIO S3 Enterprise** (Object Lock) | Local ext4/ZFS filesystem, Ceph / GlusterFS | **ISO 27037 Compliance:** S3 Object Lock in `COMPLIANCE` mode guarantees hardware-independent Write-Once-Read-Many storage. Neither suspects, attackers, nor the system administrator can modify or delete captured screenshots, WARC archives, or voice notes until retention expires. |
| **Biometric & Semantic Vector Search** | **Qdrant Vector Engine** (Rust) | Milvus, Pinecone, Pgvector | **Sub-8ms Single-Stage Filtered HNSW:** Natively integrates payload filtering into graph traversal (e.g. search 512-d ArcFace facial embeddings *only* within Algiers 2026 scam cases) without recall degradation. Rust engine provides zero GC latency spikes. 100% on-premise air-gapped deployment preserves judicial sovereignty. |
| **In-Memory Pub/Sub & Rate Limiter** | **Redis 7 Stack** (RESP3 Streams) | RabbitMQ, Apache Kafka | **Sub-Millisecond Synchronization:** Fans out newly discovered clues to the Cytoscape graph canvas over WebSockets in <1ms. Distributed token-bucket rate limiting (`CL.THROTTLE`) shields sock-puppet accounts from anti-scraping bans across social media networks. |
| **Durable Workflow Orchestrator** | **Temporal.io** | Apache Airflow, Celery (alone), Prefect | **Durable Event-Sourced State:** Forensic investigation pipelines often span days or weeks awaiting human review (`Review-Run`) or telecom subpoena responses. Temporal preserves workflow state without holding server threads, surviving system crashes and power outages with deterministic replay. |
| **Dialect Voice Forensics** | **Faster-Whisper + PyAnnote 3.1** | Google Cloud Speech-to-Text, OpenAI Whisper API | **Air-Gapped Algerian Darija Model:** CTranslate2 optimization delivers 4x faster transcription on local GPUs. Tuned for North African Arabic/French code-switching, transcribing monetary amounts (*"مية الف"*, *"عشرين مليون"*) and Algerian communes. PyAnnote diarization generates voiceprints for cross-case matching. |
| **Sovereign Local LLM Router** | **LiteLLM + Ollama / vLLM** | Direct OpenAI / Anthropic Cloud APIs | **Judicial Confidentiality:** Enforces a strict air-gap policy where no criminal intelligence, victim depositions, or suspect PII ever leaves the police precinct's local network. Unified OpenAI-compatible interface allows hot-swapping open models (DeepSeek R1, Llama 3.3, Qwen 2.5). |

---

### 3.7 The 14 Investigation Element Types & Polyglot Database Storage Matrix

Every piece of evidence collected by investigators or produced by tools is typed according to an atomic 14-element ontology and mapped to specialized storage engines:

| Element Type | Normalized Schema | Forensic Utility | Primary Database | Secondary Projection | Serialization Format |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`PERSON`** | Full Name, Alias, NIN ID, DOB | Central suspect, victim, witness, or money mule. | **Neo4j 5.x** (Node) | **PostgreSQL 16** (`persons`) | Bolt v5 / JSON relational |
| **`PHONE_NUMBER`** | E.164 (`+213555019283`), MCC-MNC | Target phone line, carrier footprint, 2FA receptor. | **Neo4j 5.x** (Node) | **Redis 7** (Rate-limit) / **Postgres** | Bolt v5 / B-Tree Unique Index |
| **`SOCIAL_ACCOUNT`** | Numeric UID, Handle, Platform | Fraudulent seller account or infiltration target. | **Neo4j 5.x** (Node) | **MongoDB 7.x** (Profile BSON) | Bolt v5 / Snappy BSON |
| **`SOCIAL_POST`** | Canonical URL, Post UID, Date | Scam listing, sponsored ad, fraudulent offer. | **Neo4j 5.x** (Node) | **MinIO S3** (WARC/PNG) / **MongoDB** | S3 Multipart / BSON DOM tree |
| **`EMAIL_ADDRESS`** | RFC 5322 Lowercase, Domain MX | Recovery email, registrar contact, compromised PII. | **Neo4j 5.x** (Node) | **PostgreSQL 16** (`breaches`) | Bolt v5 / Relational Index |
| **`WEB_DOMAIN`** | FQDN, Normalized URL, IP, JARM | Scam boutique, phishing site, C2 server. | **Neo4j 5.x** (Node) | **MongoDB 7.x** (DOM) / **MinIO** | Bolt v5 / BSON Wire Protocol |
| **`INFRASTRUCTURE_ID`** | Meta Pixel, GA4, MongoDB ObjectId | Shared hidden fingerprint linking twin scam shops. | **Neo4j 5.x** (Node) | **MongoDB 7.x** (Index) | Bolt v5 / BSON Index |
| **`BANK_ACCOUNT`** | Algérie Poste RIP (20 digits), CCP | Money transfer destination for extorted funds. | **Neo4j 5.x** (Node) | **PostgreSQL 16** (`bank_tx`) | Bolt v5 / Relational Ledger |
| **`CRYPTO_WALLET`** | Public Address (BTC, ETH, TRC20) | Capital flight, USDT mule laundering. | **Neo4j 5.x** (Node) | **PostgreSQL 16** (`crypto_tx`) | Bolt v5 / Bipartite Edge Graph |
| **`VEHICLE`** | Algerian Plate (`04829-116-16`), VIN | Delivery vehicle or getaway car on CCTV. | **Neo4j 5.x** (Node) | **PostgreSQL 16** (`vehicles`) | Bolt v5 / Relational Map |
| **`AUDIO_RECORDING`** | OPUS/WAV binary, Duration, Darija | WhatsApp voice notes negotiating scam payoffs. | **MinIO S3** (WORM Audio) | **Qdrant** (192-d voice) / **Neo4j** | S3 Object Lock / gRPC Vectors |
| **`IMAGE_ARTIFACT`** | JPEG/PNG binary, SHA-256, EXIF | Avatar photo, forged receipt, warehouse photo. | **MinIO S3** (WORM Media) | **Qdrant** (512-d ArcFace) / **Neo4j** | S3 Object Lock / HNSW Cosine |
| **`TELECOM_CDR`** | Line, BTS Tower ID, Azimuth, Time | Carrier call detail records for alibi verification. | **TimescaleDB** (Hyper-table) | **Neo4j** (Co-movement edges) | SQL Hypertables / PostGIS |
| **`LEGAL_DOCUMENT`** | PV Number, TSA Seal, Merkle Root | Final prosecution package for magistrate. | **MinIO S3** (PDF/A-3b WORM) | **PostgreSQL 16** (Audit Merkle) | S3 Object Lock / Merkle Proof |

---

### 3.8 Graph Database Attributes & Universal Metamodel Generalization (GFPG)

#### Can We Generalize the Model?
**Yes, completely.** Through the **Generalized Forensic Property Graph (GFPG)** pattern, Athar DZ decouples schema evolution from database migrations:
1. **Universal Core Attributes**: Every node inherits from `InvestigationEntity`:
   - `uuid: UUIDv4` (Immutable primary key)
   - `canonical_value: String` (Normalized unique indexed value, e.g., E.164 phone or lowercase email)
   - `entity_type: Enum` (One of the 14 types)
   - `layer: Enum` (1: VERIFIED, 2: OSINT_RAW, 3: INFRA, 4: HYPOTHESIS)
   - `confidence_score: Float` (0.0 to 1.0)
   - `source_tool: String` (Originating brick)
   - `source_artifact_sha256: Hash` (Cryptographic proof seal in MinIO S3)
   - `case_ids: List[String]` (Cross-case linkage for syndicate discovery)
   - `first_seen_at / last_seen_at: Timestamps`
   - `status: Enum` (`ACTIVE`, `ARCHIVED`, `DISCARDED`)
2. **Universal Relationship Attributes**: Every relationship inherits from `InvestigationRelationship`:
   - `uuid: UUIDv4`
   - `type: Enum` (`USES_PHONE`, `TRANSFERS_FUNDS`, `REGISTERED_ON`, `COMMUNICATES_WITH`, `CO_LOCATED_WITH`, `SUSPECTED_ALIAS_OF`)
   - `weight: Float` (Monetary amount in DZD, interaction count, or ArcFace similarity score)
   - `confidence: Float` (0.0 to 1.0)
   - `valid_from / valid_to: Timestamps`
   - `evidence_warc_ref: String` (Proof artifact URI)
3. **Zero-Migration Extensibility**: Adding novel crime clues (e.g. `Drone_Telemetry` or `Smart_Contract_Address`) requires only a new `brick.yaml` manifest. Neo4j dynamically indexes new property keys without altering existing table structures.

---

## 4. Standardized OSINT, Forensic & Social Network Analysis Specification

Every tool in `bricks/<domain>/<brick_name>/` consists of:
1. `brick.yaml`: Declarative capability manifest (`input_entities`, `output_entities`, `storage_destination`, `resources`, `case_profiles`, `default_policy`, `opsec_tier`).
2. `Dockerfile`: Lightweight rootless container encapsulating the tool.
3. `runner.py` / `entrypoint`: Standardized JSON I/O envelope.

### 4.1 Deterministic Brick Scoring Formula (No-LLM Required)
When an investigator selects a clue $e$ of type $T(e)$ in a case with profile $C$:
$$\text{Score}(b, e, C) = \mathbb{I}\big(T(e) \in \text{Inputs}(b)\big) \times \Big( w_{\text{case}}(b, C) \cdot \text{Conf}(e) \cdot \text{Gain}(b) - \lambda_{\text{opsec}} \cdot \text{Risk}(b) \Big)$$

---

### 4.2 Classic Judicial Police & Digital Forensics Arsenal (DFIR) - 12 SOTA Tools

| Forensic Tool | Scientific Discipline | GitHub Repository | Required Hardware | Input Format | Output Format | Polyglot Storage | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Autopsy / TSK** | Disk & Filesystem Forensics | `sleuthkit/autopsy` | 4 Cores, 16 GB RAM | `.dd`, `.raw`, `.E01`, `.vmdk` | Restored deleted files, MFT, Web history | **MinIO S3** (WORM) & **Neo4j** | **P0 (Vital)** |
| **Volatility 3** | Volatile RAM Forensics | `volatilityfoundation/volatility3` | 4 Cores, 8-16 GB RAM | `.raw`, `.dmp`, `.vmem` | Hidden processes, active sockets, LSA secrets | **PostgreSQL 16** & **Neo4j** | **P0 (Vital)** |
| **Plaso (log2timeline)** | Unified Super-Timeline | `log2timeline/plaso` | 4-8 Cores, 16 GB RAM | `.evtx`, syslog, MFT, prefetch | L2T CSV microsecond super-timeline | **TimescaleDB** & **MinIO S3** | **P1 (High)** |
| **Wireshark / Zeek** | Network Packet Inspection | `wireshark/wireshark` | 2-4 Cores, 8 GB RAM | `.pcap`, `.pcapng` | Reassembled TCP streams, DNS, TLS certs | **MongoDB 7.x** & **MinIO S3** | **P1 (High)** |
| **Bulk_Extractor** | Raw Disk Feature Extraction | `simsong/bulk_extractor` | 4 Cores, 4 GB RAM | Raw binary, unallocated space | Histograms of emails, URLs, CC, phones | **Neo4j 5.x** & **PostgreSQL 16** | **P1 (High)** |
| **ExifTool Pro** | Media Metadata Extraction | `exiftool/exiftool` | 0.2 CPU, 64 MB RAM | JPEG, PNG, MP4, MOV, PDF | GPS Lat/Lon, camera serial, edit software | **Neo4j 5.x**, **MapLibre**, **MinIO** | **P0 (Vital)** |
| **Sherloq** | Image Forgery Detection | `GuidoBartoli/sherloq` | 1-2 Cores, 4 GB RAM | Altered receipts, fake IDs | Error Level Analysis (ELA), clone masks | **MinIO S3** & **PostgreSQL 16** | **P1 (High)** |
| **PhotoDNA / Hashdb** | Contraband Hash Matching | `threatstream/hashdb` | 2 Cores, 4 GB RAM | Suspect images and binaries | Match certificates against Interpol/NSRL | **Qdrant** & **Redis 7 Stack** | **P0 (Vital)** |
| **Guymager / FTK** | Bit-Stream Physical Imaging | `dewim/guymager` | 2 Cores, 4 GB RAM | Hard drives, USB, SD, SIM | Certified `.E01` bit-stream copy with SHA-256 | **MinIO S3 WORM** (10-yr retention) | **P0 (Vital)** |
| **TrOCR & Tesseract** | Handwritten Complaint OCR | `microsoft/unilm/trocr` | 2 Cores / 1 GPU, 4 GB RAM | Scanned paper complaints, receipts | UTF-8 text, extracted DZD sums, BaridiMob RIPs | **MongoDB 7.x** & **Neo4j 5.x** | **P1 (High)** |
| **YOLOv8-ALPR DZ** | Algerian Plate Recognition | `JaidedAI/EasyOCR` | 1 GPU CUDA, 4 GB RAM | CCTV video stills, warehouse photos | Plate string (`04829-116-16`), Wilaya code | **Neo4j 5.x** & **MapLibre GL** | **P1 (High)** |
| **Lynis & YASAT** | Server Compromise Audit | `CISOfy/lynis` | 1 Core, 512 MB RAM | Seized Linux web servers | IoC backdoors, hidden cron jobs, rootkits | **MongoDB 7.x** & **PostgreSQL 16** | **P2 (Medium)** |

---

### 4.3 State-of-the-Art Social Network Analysis (SNA / SNS) & Graph Algorithms - 14 SOTA Tools

| SNA / SNS Tool | Algorithmic Paradigm | Reference / Repository | Required Hardware | Input Data | Extracted Output | Storage Engine | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Graphistry** | GPU Graph Visualization | `graphistry/pygraphistry` | NVIDIA GPU (8 GB+ VRAM) | 10M+ transaction/call edges | 60 FPS WebGL graph, visual cliques | **WebGL Client** & **Neo4j 5.x** | **P0 (Vital)** |
| **Gephi Toolkit** | ForceAtlas2 & Centralities | `gephi/gephi-toolkit` | 2-4 Cores, 8 GB RAM (JVM) | Adjacency matrices, GraphML | Modularity, Betweenness, network diameter | **Neo4j 5.x** & **Redis 7** | **P1 (High)** |
| **NetworkX / igraph** | Forensic Graph Theory | `networkx/networkx` | 2 Cores, 4 GB RAM | Phone call graphs, BaridiMob RIP hops | Shortest path, articulation points, k-core | **Neo4j 5.x** & **PostgreSQL 16** | **P0 (Vital)** |
| **Stanford SNAP** | Extreme-Scale Graph Mining | `snap-stanford/snap` | 8 Cores, 32 GB RAM | Nationwide CDR and banking logs | Link prediction probabilities, structural gaps | **PostgreSQL 16** & **Neo4j 5.x** | **P1 (High)** |
| **SocialMapper** | Cross-Platform Face Mapping | `SpiderLabs/social_mapper` | 2 Cores, 4 GB RAM | Suspect name and seed photo | Profiles on FB, Instagram, LinkedIn, VK | **Neo4j 5.x**, **Qdrant**, **MinIO** | **P0 (Vital)** |
| **Maigret** | 3,000+ Account Enumerator | `soxoj/maigret` | 1-2 Cores, 2 GB RAM | Handle / username | Account URLs, bio extracts, avatar photos | **MongoDB 7.x** & **Neo4j 5.x** | **P0 (Vital)** |
| **Toutatis** | Instagram ID Extractor | `megadose/toutatis` | 0.5 Core, 256 MB RAM | Instagram username | Obfuscated recovery phone & email | **Neo4j 5.x** (Candidate link) | **P0 (Vital)** |
| **Telethon / TG-Tracker** | Closed Group Infiltrator | `LonamiWebs/Telethon` | 1 Core, 1 GB RAM | Closed Telegram channel link | Full member roster, numeric IDs, chat logs | **MongoDB 7.x**, **MinIO**, **Neo4j** | **P0 (Vital)** |
| **Instaloader** | Instagram Media Harvester | `instaloader/instaloader` | 1 Core, 1 GB RAM | Instagram profile or tag | High-res photos, stories, tagged users, GPS | **MinIO S3**, **MongoDB**, **Neo4j** | **P1 (High)** |
| **Bellingcat Archiver** | Multi-Platform Preserver | `bellingcat/auto-archiver` | 2 Cores, 4 GB RAM | Social media post URL | WARC web archive, raw video, screenshots | **MinIO S3 WORM** & **PostgreSQL** | **P0 (Vital)** |
| **Louvain / Leiden** | Community Partitioning | Neo4j GDS Library | In-memory GDS (4-8 GB RAM) | Complete multi-case entity graph | Criminal cell partitioning, modularity $Q$ | **Neo4j 5.x** (`community_id`) | **P0 (Vital)** |
| **PageRank** | Authority & Kingpin Ranking | Neo4j GDS Library | In-memory GDS (2-4 GB RAM) | Directional communication graph | Rank score (0.0 to 1.0) pinpointing leaders | **Neo4j 5.x** (`pagerank_score`) | **P0 (Vital)** |
| **Betweenness** | Choke-Point / Mule Detection | Neo4j GDS Library | In-memory GDS | Financial transaction graph | High-betweenness money mules and couriers | **Neo4j 5.x** (`betweenness`) | **P0 (Vital)** |
| **Link Prediction** | Hidden Link Probability | Neo4j GDS (Adamic-Adar) | In-memory GDS | Incomplete crime graph | Candidate relationship probabilities on Layer 4 | **Neo4j 5.x** (Dashed Layer 4 edges) | **P1 (High)** |

---

## 4. Standardized OSINT "Brick" Plugin Specification

Every tool in `bricks/<domain>/<brick_name>/` consists of:
1. `brick.yaml`: Declarative capability manifest (`input_entities`, `output_entities`, `case_profiles`, `default_policy`, `opsec_tier`).
2. `Dockerfile`: Lightweight container encapsulating the tool (Go, Python, Rust, Node, or Perl).
3. `runner.py` / `entrypoint`: Reads `BrickInputEnvelope` JSON from `stdin`, executes the tool, saves raw evidence to `/output/artifacts/`, and prints a standardized `BrickOutputEnvelope` JSON to `stdout`.

### Deterministic Brick Scoring Formula (No-LLM Required)
When an investigator selects a clue $e$ of type $T(e)$ in a case with profile $C$:
$$\text{Score}(b, e, C) = \mathbb{I}\big(T(e) \in \text{Inputs}(b)\big) \times \Big( w_{\text{case}}(b, C) \cdot \text{Conf}(e) \cdot \text{Gain}(b) - \lambda_{\text{opsec}} \cdot \text{Risk}(b) \Big)$$
where:
- $\mathbb{I}(T(e) \in \text{Inputs}(b)) \in \{0, 1\}$ enforces strict type compatibility.
- $w_{\text{case}}(b, C) \in [0, 1]$ is the relevance weight of brick $b$ for case profile $C$.
- $\text{Conf}(e) \in [0, 1]$ is the evidentiary confidence of the input clue.
- $\text{Gain}(b)$ is the historical information gain (expected number of high-value output pivots).
- $\text{Risk}(b)$ reflects active network noise or rate-limit cost.


---

## 5. Incremental Development Roadmap (6 Runnable App Releases)

To validate features with real police and investigators early, development is broken down into 6 progressive milestones where **every milestone delivers a runnable, packaged Docker application**:

- **Phase 1: Visual Case Board & Layered Studio (Weeks 1–3) &bull; `App v0.1`**
  - Runnable local workbench with Case creation, drag-and-drop Clue Cards, link drawing, and Photoshop Layers (Verified Facts vs. Theories).
- **Phase 2: Evidence Safe & Automatic Clue Extractor (Weeks 4–6) &bull; `App v0.2`**
  - MinIO S3 WORM evidence vault integration. Pasting text or URLs automatically freezes the page, captures a certified screenshot, and extracts phones and links onto the board.
- **Phase 3: Essential Online Search Tools (Weeks 7–9) &bull; `App v0.3`**
  - Dockerized tool execution: Phone carrier & registered social apps lookup, 2,500+ site username scan, website hidden order code decoder, and twin scam site reverse search.
- **Phase 4: Media Forensics & Biometric Face Matcher (Weeks 10–12) &bull; `App v0.4`**
  - EXIF metadata reader, Sherloq photo tampering checker, reverse image search, DeepFace facial comparison across profile pictures, and Faster-Whisper audio transcription.
- **Phase 5: Police Fieldwork, Telecom CDR & Geo-Map (Weeks 13–15) &bull; `App v0.5`**
  - Telecom CDR Excel parser, cell tower triangulation, co-traveler detection, alibi contradiction solver, and synchronized MapLibre crime map.
- **Phase 6: AI Copilot, Covert Session Vault & Court Report Exporter (Weeks 16–18) &bull; `App v1.0`**
  - Optional local/cloud LLM copilot, encrypted sock-puppet account vault, automated multi-tool playbook composer, and 1-click court dossier PDF exporter.

---

## 6. Interactive Application Maquette

A full-screen, interactive HTML simulation of the actual software running the Tyre Scam case is available at [`doc/maquette.html`](maquette.html). It allows detectives to test the live graph canvas, step through investigation stages 1 to 4, inspect certified evidence snapshots, switch to the Timeline, Map, and Court Dossier views, and trigger simulated online tools.

---

## 7. Complete 62-Tool Inventory & Practical Setup Protocol

The system organizes its 62 specialized investigation tools into 6 operational categories, classified according to technical prerequisites to provide complete transparency for non-computer-science investigators:

### 7.1 Prerequisite Breakdown
1. **🟢 Direct & Gratuit (Local / Offline Docker) — 46 Tools (74%)**:
   - Zero configuration, zero third-party dependencies, 100% free and offline. Runs in rootless local Docker containers.
   - *Key Examples:* ArchiveBox (web freezer), ExifTool (photo GPS/camera metadata), ArcFace 512-d (biometric face comparison), Faster-Whisper (offline audio STT), Schwifty (IBAN/BIC resolver), Yente / FollowTheMoney (Interpol & OFAC sanctions screening), TrOCR (handwritten deposition OCR).
2. **🔑 Clé API Gratuite — 10 Tools (16%)**:
   - Requires a free developer access token generated via simple web signup (no credit card required).
   - Once pasted by the unit administrator into the encrypted credential vault, the tool is immediately usable by all detectives.
   - *Key Examples:* Meta Ad Library (sponsored ads tracker), Caller-ID / Truecaller Sync (reverse directory), Google Analytics Tag Reverse Hunter, Subfinder (passive domain discovery), Shodan & Censys (host and SSL certificates), DeHashed (compromised breach databases), OpenCorporates (corporate registry).
3. **👤 Compte d'Infiltration / Sock-Puppet — 5 Tools (8%)**:
   - Utilizes dedicated undercover accounts (disposable SIM cards / dedicated investigative personas) stored in the encrypted session vault.
   - Traffic is automatically routed through residential WireGuard VPN / proxy nodes to prevent revealing the station's IP address.
   - *Key Examples:* Telegram User & Group Extractor, WhatsApp Business Catalog Inspector, Instagram Profile & Story Analyzer, Social Mapper (multi-platform face cross-referencer), GHunt v2 (Google Account & Maps reviewer).
4. **💳 Abonnement Commercial Optionnel — 1 Tool (2%)**:
   - *PimEyes:* Facial search engine across the public web. *Default built-in free alternative:* Local ArcFace 512-d compares all profile photos in the case without any recurring fees.

---

## 8. Left-Dock Clue Inbox & Judicial Arbitration Workflow

To preserve evidentiary integrity and avoid cluttering the visual graph with false positives or unvetted OSINT data, AegisInvestigate implements an **Inbox & Arbitration Pipeline**:

```
[ Automated Background Tool / Scanner ]
                   │
                   ▼ (Outputs Candidate Clue with Confidence Score)
[ 📥 Boîte de Réception des Nouveaux Indices (Dock Gauche) ]
                   │
                   ├─► Click Clue Card ➔ Opens Evidentiary Detail Drawer
                   │   ├── Source Tool & Exact Timestamp
                   │   ├── Raw Cryptographic Proof & Extracted Value
                   │   ├── Confidence Score (e.g., 98%)
                   │   └── Forensic Metadata Table
                   │
                   ├─► [➕ Ajouter au Graphe]
                   │   ├── Promotes Clue to Investigation Graph Canvas
                   │   ├── Creates Dynamic Visual Node & Typed SVG Edge to Parent
                   │   ├── Logs Action into Legal Audit Journal
                   │   └── Updates Active Clues Badge
                   │
                   └─► [✕ Écarter (Non pertinent)]
                       ├── Marks Clue as Discarded / False Positive
                       └── Preserves Discard Rationale in Audit Ledger
```

---

## 9. 8 Recommended High-Value Modules for Judicial & Police Units

Based on real-world operational challenges encountered by cybercrime divisions, gendarmerie research sections, and investigating magistrates:

1. **Infiltration Silencieuse des Canaux Telegram & Groupes WhatsApp Fermés**:
   - *Engine:* Headless Telethon / Baileys sessions operating behind rotating residential proxies.
   - *Capability:* Exports member lists, phone numbers, avatars, message histories, and forward chains from closed fraud or contraband groups without alerting channel administrators.
2. **Bornage Multi-Antennes Relais (CDR) & Analyse de Trajectoires Croisées**:
   - *Engine:* GeoPandas + OpenCellID BTS mapping + spatio-temporal clustering.
   - *Capability:* Ingests Excel call detail records from Mobilis, Djezzy, and Ooredoo, computes intersection probabilities between suspect lines, and identifies burner phones co-moving with primary devices.
3. **Traitement Vocal & Retranscription Darija / Arabe Maghrébin**:
   - *Engine:* Faster-Whisper fine-tuned on North African Arabic dialects + PyAnnote 3.1 speaker diarization.
   - *Capability:* Accurately transcribes WhatsApp voice notes in Algerian Darija, separating speakers and highlighting monetary amounts, delivery rendezvous points, and accomplice names.
4. **Reconnaissance Automatique de Plaques LAPI (Matricules DZ / Internationaux)**:
   - *Engine:* YOLOv8-LAPI + EasyOCR tailored to Algerian license plate formats (`04829-116-16`).
   - *Capability:* Detects and transcribes vehicle registrations visible in suspect warehouse photos or surveillance footage, automatically linking them to national vehicle registration records.
5. **Détecteur de Comptes Bancaires & Postaux Mulets (Algérie Poste BaridiMob / RIP / Swift)**:
   - *Engine:* NetworkX / Graphology bipartite transaction graph.
   - *Capability:* Cross-references CCP accounts and BaridiMob RIP numbers across different independent complaint files to identify shared "money mules" and commercial bank conduits.
6. **Détecteur de Voix Clonées par IA & Deepfakes Audio**:
   - *Engine:* WavLM / RawNet acoustic feature spectrogram analyzer.
   - *Capability:* Analyzes distress or kidnapping audio notes to scientifically certify whether an audio recording is a genuine human voice or an AI-synthesized voice clone (e.g. ElevenLabs, VALL-E).
7. **Générateur Automatique de Réquisitions Judiciaires Conformes au CPP**:
   - *Engine:* Templated docx/PDF generator formatted according to the Algerian Code of Criminal Procedure (Code de Procédure Pénale).
   - *Capability:* Generates court-ready legal orders in 1 click for telecom carriers (subscriber identity, cell dump), financial institutions (account freeze, transaction history), and online platforms (Meta, Telegram, Google IP access logs).
8. **Chasseur de Stealer Logs & Surveillance du Dark Web**:
   - *Engine:* In-memory Bloom filters querying curated RedLine, Vidar, Lumma, and Raccoon malware stealer databases.
   - *Capability:* Detects whether suspect email addresses or admin portal credentials appear in credential dumps, uncovering the suspect's underlying residential IP address and personal browsing history.
