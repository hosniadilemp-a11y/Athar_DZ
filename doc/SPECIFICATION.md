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
1. **Neo4j 5.x (Knowledge Graph Database)**: Stores all case entities, typed relationships, layer assignments, temporal intervals, and confidence scores.
2. **PostgreSQL 16 (Relational & Audit Database)**: Stores cases, RBAC permissions, the deterministic Brick Capability Registry, workflow state, and the **Immutable Hash-Chained Forensic Audit Ledger**.
3. **MinIO S3 (Forensic Evidence Vault)**: Stores WARC web archives, screenshots, uploaded media, CDR files, and raw unmodified Brick JSON outputs in **S3 Object Lock (WORM Compliance Mode)**.
4. **Qdrant (Vector Database)**: Stores 512-d facial recognition vectors (`DeepFace`/`ArcFace`), image geolocation/similarity vectors (`CLIP`/`GeoCLIP`), and document chunk embeddings.
5. **Redis 7 Stack (Cache & Rate-Limit Broker)**: Enforces distributed token-bucket rate limits per OSINT source and per sock-puppet account, plus WebSocket pub/sub.

### 3.4 OPSEC & Containerized Brick Sandbox
- **Container Isolation**: Every OSINT tool runs as a rootless, ephemeral Docker container (`--cap-drop=ALL`, `--security-opt=no-new-privileges`, read-only root filesystem) spawned via a restricted Docker Socket Proxy.
- **Network Egress Tiers**:
  - `OFFLINE_LOCAL`: `--network=none` (ExifTool, Sherloq, ObjectId decoder, DeepFace, Whisper).
  - `PASSIVE_API`: Routed via API gateway to passive caches (Shodan, URLScan, Wayback, VirusTotal).
  - `RESIDENTIAL_PROXY / TOR`: Active target queries routed through `Gluetun` WireGuard VPN / Tor SOCKS5 / rotating residential proxies.
- **Sock-Puppet Session Vault**: AES-256-GCM encrypted credential and cookie vault managing covert accounts for Telegram (`Telethon`), Instagram (`Instaloader`/`Osintgram`), Facebook (`Playwright`), and WhatsApp, with automatic 2FA TOTP generation and cooldown tracking.

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
