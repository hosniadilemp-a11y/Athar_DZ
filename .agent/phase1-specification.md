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
- **Circular Graph Studio (`GraphCanvasAdapter`):** Custom React + SVG/HTML circular nodes (`56px` standard, `68px` pivot), layer border colors + dashed hypothesis border, right-click & keyboard (`Shift+F10` / `...`) context menu, Drag & Drop + keyboard node creation from Left Accordion, Link creation mode, undo/redo store (Zustand), and accessible list/table alternative.
- **All 16 SNA Algorithms (`12 + 4`):** Implemented as pure deterministic Python functions (`NetworkX`) via `GET|POST /api/v1/cases/{case_id}/sna/{algo}` and callable from the SNA panel.
- **Views & Ergonomics:** Slidable & resizable Left/Right panels (`[` / `]`, `col-resize`, `localStorage`), Timeline view, GIS Map view (plotting valid WGS84 GPS nodes), Dark/Light themes via `tokens.css`, FR/AR(RTL)/EN i18n, Audit viewer, PDF/JSON report export.

### Excluded from Phase 1 (Deferred to Phases 2–6)
- Active OSINT execution / scraping (`Phase 3`)
- Police Judiciaire / DGSN operator requisitions & MinIO WORM (`Phase 2–3`)
- AI Copilot Text-to-Cypher & Darija audio transcription (`Phase 5`)
- Social platform profiling & Phone Farm (`SRV-FARM-01`) (`Phase 3–4`)
- *UI Behavior:* These buttons use `aria-disabled="true"` with a visible `"Phase N"` badge and open an informational notice on click/Enter.

---

## 2. Milestones (1A → 1G)

| Milestone | Scope | Exit Criteria |
| :--- | :--- | :--- |
| **1A Foundation** | `docker-compose.yml`, `.env.example`, `/health` (Neo4j/PG/Redis), empty FastAPI & React/TS shells, `tokens.css` | `docker compose up --build` all green, `tsc`, `eslint`, `pytest` pass |
| **1B Data** | Single-source registry (37 nodes, 47 relations, 5 layers), generated TS types, Neo4j constraints, PG/PostGIS schema, idempotent 100-node seed | Seed idempotent, layer count tests (`11/8/8/4/6 = 37`) pass |
| **1C Graph API** | `/api/v1/cases/{case_id}/...`, impact rule (`visible_count`/`total_count`), expand, CRUD, layer change w/ reason, SHA-256 audit chain + verify | `pytest`, `ruff`, `mypy` clean; audit tamper test passes |
| **1D Canvas** | `GraphCanvasAdapter`, `CircularGraphCanvas`, Zustand slices + undo/redo, context menu (mouse + keyboard), inspector, table alternative | Keyboard walkthrough + axe clean, `tsc`, `eslint`, `vitest`, `build` pass |
| **1E SNA (16x)** | 16 pure deterministic algorithms, shipped 1 by 1 with hand-computed + edge-case tests, SNA panel with method/params display | All 16 registered, tested, and timed on the 100-node seed |
| **1F Views & Polish** | Left accordion (5 layers, 37 DnD/kbd, link mode, filters, queries), Timeline, GIS Map, PDF/JSON export, FR/AR/EN + RTL, Dark/Light | `ui-ux-rules.md` Definition of Done passes on every screen |
| **1G Hardening** | Full test suite, `pip-audit`, `npm audit`, performance & accessibility measurements, README (run/test/limits) | All milestone checklists in `phase1-implementation-rules.md` §10 green |

---

## 3. Forensic Layer Mapping (37 Types across 5 Layers)
- **Layer 1 (`VERIFIED` — 11):** `affaire`, `magistrat`, `unite`, `document_judiciaire`, `scelle_numerique`, `preuve_merkle`, `image_preuve`, `enregistrement_vocal`, `wilaya`, `daira`, `commune`
- **Layer 2 (`OSINT_RAW` — 8):** `telephone`, `compte_social`, `publication_sociale`, `canal_telegram`, `message_chat`, `adresse_email`, `site_web`, `session_recherche`
- **Layer 3 (`INFRA` — 8):** `carte_sim`, `appareil_mobile`, `antenne_bts`, `identifiant_infrastructure`, `fichier_apk`, `serveur_c2`, `certificat_tls`, `artefact_dfir`
- **Layer 4 (`HYPOTHESIS` — 4):** `personne`, `entreprise`, `vehicule`, `empreinte_faciale`
- **Layer 5 (`FLOWS` — 6):** `telecom_cdr`, `compte_bancaire`, `transaction_financiere`, `guichet_gab`, `crypto_wallet`, `transaction_crypto`
