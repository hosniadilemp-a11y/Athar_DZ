# Phase 1 Specification — App v0.1 (Visual Investigation Studio & SNA Core)

> **Scope:** Exact technical & functional specification for Phase 1 (`App v0.1`), delivered in gated milestones **1A to 1G**.  
> **Rule Files:** `.agent/phase1-implementation-rules.md`, `.agent/ui-ux-rules.md`, `.agent/llm-no-mistakes-rules.md`, `.agent/SKILL.md`.  
> **Blocking Open Decisions:** See `DECISIONS.md` (D1–D10).

---

## 1. Phase 1 Objectives & Scope Boundaries

### Included in Phase 1 (`v0.1`)
- **2-Tier Dockerized Infrastructure:** App Tier (`backend` FastAPI + `frontend` React 19/TypeScript) and Data Tier (`neo4j:5.20`, `postgis/postgis:16-3.4`, `redis:7.2`) with pinned versions, healthchecks, and named volumes.
- **Canonical Data Registry:** Single source of truth for all **37 node types** (mapped to **5 forensic layers**: 11 / 8 / 8 / 4 / 6) and **47 directional relationships**, exported/generated cleanly to TypeScript.
- **100-Node Seed Dataset:** Idempotent startup seeding from `doc/examples/candy_wheels_100_nodes/mock-case-candy-wheels.json` into Neo4j and PostgreSQL (fictional data only).
- **Case & Graph REST API (`/api/v1/cases/{case_id}/...`):** Case CRUD, impact-filtered graph retrieval (`impact_only=true`), 1-hop/2-hop neighborhood expansion, node/edge CRUD, layer promotion (with mandatory human reason), contextual tool proposals, and hash-chained append-only audit ledger.
- **Circular Graph Studio (`GraphCanvasAdapter`):** Custom React + SVG/HTML circular nodes (`56px` standard, `68px` pivot), layer border colors + dashed hypothesis border, right-click & keyboard (`Shift+F10` / `...`) context menu, Drag & Drop + keyboard node creation from Left Accordion, Link creation mode, undo/redo store (Zustand), accessible list/table alternative, and coordinate pinning (`pinnedNodeIds`).
- **All 16 SNA Algorithms (`12 + 4`):** Implemented as pure deterministic Python functions (`NetworkX`) via `GET|POST /api/v1/cases/{case_id}/sna/{algo}` and callable from the SNA panel.
- **Views & Ergonomics:** Slidable & resizable Left/Right panels (`[` / `]`, `col-resize`, `localStorage`), Timeline view, GIS Map view (plotting valid WGS84 GPS nodes), Dark/Light themes via `tokens.css`, FR/AR(RTL)/EN i18n, Audit viewer, PDF/JSON report export.
- **Surface UI Ingestion & Tabs (Options A & B — Phase 1 Boundaries) :**
  - *Option B (Surface Ingestion) :* Glisser-déposer de fichiers bruts sur le canevas, calcul SHA-256 client immédiat, création du nœud `scelle_numerique` sur le canevas et ouverture du Popover contextuel à 3 Modes (Rapide, Pas à Pas, Récursif). Le clic sur lancer affiche la notice explicative D10 (*« Disponible en Phase 2 / Phase N »*), place le badge *« En cours d'investigation »* sur le nœud et affiche la barre de progression dans l'inspecteur.
  - *Option A (Surface Multi-Tab) :* Barre d'onglets de travail (`[🌐 Dossier Général]` et `[👤 Suspect : Amine B.]`) active dans `useGraphStore.ts` pour commuter l'affichage du sous-graphe focalisé.

### Excluded from Phase 1 (Deferred to Phases 2–6)
- Moteur d'archivage MinIO WORM S3 & RFC 3161 (`Phase 2`)
- Moteur plein-texte Elasticsearch 8.14 & Bassin d'indices non-inclus opérationnel (`Phase 2`)
- Contrat backend `ForensicPluginSPI` & registre `ProcessRegistry` (`Phase 2`)
- Active OSINT execution / scraping & Temporal.io event loops (`Phase 3`)
- Process Discovery Tree interactif connecté au bus EDA (`Phase 3`)
- Dynamic Dataflow multimodal GPU & Qdrant vector DB ArcFace 512-d (`Phase 4`)
- Traitement de masse CDR Polars & Transcription Darija Faster-Whisper (`Phase 5`)
- AI Copilot Text-to-Cypher & Saturation continue en Mode 3 récursif (`Phase 6`)
- *UI Behavior:* These non-Phase 1 buttons use `aria-disabled="true"` with a visible `"Phase N"` badge and open an informational notice on click/Enter (Decision D10).

---

## 2. Milestones (1A → 1G Status & Execution)

| Milestone | Scope | Exit Criteria | Status |
| :--- | :--- | :--- | :---: |
| **1A Foundation** | `docker-compose.yml`, `.env.example`, `/health` (Neo4j/PG/Redis), FastAPI & React/TS shells, `tokens.css` | `docker compose up --build` all green, `tsc`, `eslint`, `pytest` pass | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1B Data** | Single-source registry (37 nodes, 47 relations, 5 layers), generated TS types, Neo4j constraints, PG/PostGIS schema, idempotent 100-node seed | Seed idempotent, layer count tests (`11/8/8/4/6 = 37`) pass | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1C Graph API** | `/api/v1/cases/{case_id}/...`, impact rule (`visible_count`/`total_count`), expand, CRUD, layer change w/ reason, SHA-256 audit chain + verify | `pytest` 42 passed, audit tamper test passes | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1D Canvas** | `GraphCanvasAdapter`, `CircularGraphCanvas`, Zustand slices + undo/redo, context menu, inspector, table alternative, pinning (`pinnedNodeIds`) | Keyboard walkthrough clean, `tsc`, `vitest` 33 passed, `build` clean | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1E SNA (16x)** | 16 pure deterministic algorithms in Python NetworkX, SNA panel with method/params display | All 16 registered, tested, and timed on 100-node seed | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1F Views & Polish** | Left accordion (5 layers, 37 DnD/kbd), Timeline, GIS Map, PDF/JSON export, FR/AR/EN + RTL, Dark/Light, disabled Phase N badges | `ui-ux-rules.md` DoD passes on every view | <span style="color:#10b981;">✔ COMPLETED</span> |
| **1G Hardening & UI Hooks** | Full test suite, `pip-audit`, `npm audit`, accessibility pass, Option A tab toggle, Option B surface popover 3 modes | All milestone checklists green; Phase 1 closed cleanly | <span style="color:#10b981;">✔ COMPLETED</span> |

---

## 3. Forensic Layer Mapping (37 Types across 5 Layers)
- **Layer 1 (`VERIFIED` — 11):** `affaire`, `magistrat`, `unite`, `document_judiciaire`, `scelle_numerique`, `preuve_merkle`, `image_preuve`, `enregistrement_vocal`, `wilaya`, `daira`, `commune`
- **Layer 2 (`OSINT_RAW` — 8):** `telephone`, `compte_social`, `publication_sociale`, `canal_telegram`, `message_chat`, `adresse_email`, `site_web`, `session_recherche`
- **Layer 3 (`INFRA` — 8):** `carte_sim`, `appareil_mobile`, `antenne_bts`, `identifiant_infrastructure`, `fichier_apk`, `serveur_c2`, `certificat_tls`, `artefact_dfir`
- **Layer 4 (`HYPOTHESIS` — 4):** `personne`, `entreprise`, `vehicule`, `empreinte_faciale`
- **Layer 5 (`FLOWS` — 6):** `telecom_cdr`, `compte_bancaire`, `transaction_financiere`, `guichet_gab`, `crypto_wallet`, `transaction_crypto`
