# Phase 1 (v0.1) Implementation Rules

Scope: every task that implements the "Plan d'Implémentation Détaillé — Phase 1 (App v0.1) [Révisé]".
Use together with `.agent/README.md`, `ui-ux-rules.md`, `llm-no-mistakes-rules.md`, `security-rules.md`, and `repo-structure-rules.md`. If rules conflict, the stricter rule wins, and you report the conflict.

---

## 0. Precedence and decision log

Order of authority:

1. The user's latest explicit instruction
2. `DECISIONS.md` (the decision log, section 1). An approved decision overrides everything below it
3. The Phase 1 plan
4. `SPECIFICATION.md`
5. Companion rule files (`.agent/README.md`, `ui-ux-rules.md`, `llm-no-mistakes-rules.md`, `security-rules.md`, `repo-structure-rules.md`)
6. Existing code

- Where the plan and the spec disagree and `DECISIONS.md` has no approved entry, do NOT choose silently. Record the conflict as an open decision and ask.
- An open decision blocks only the work it affects. Continue with unaffected work.
- Never edit `SPECIFICATION.md`, the plan, or the other rule files to make a conflict disappear. Propose the edit and wait for approval.

## 1. Known defects in the plan (resolve before touching the affected area)

Create `DECISIONS.md` at the repo root with one entry per item. Each entry has: ID, problem, options, recommendation, status (OPEN / APPROVED), approver, date.

| ID | Problem | Affects | Recommended resolution |
|---|---|---|---|
| D1 | Plan adds a 5th layer (FLOWS, amber `#f59e0b`). `ui-ux-rules.md` allows 4 layer colors, and `SPECIFICATION.md` defines 4 layers. Amber is also the "warning" status color. Slate `#64748b` for INFRA is nearly identical to the neutral gray ramp. Emerald for VERIFIED is close to the "success" status color. | Layers, tokens, canvas, legend | Approve 5 layers. Update `ui-ux-rules.md` to "five layer colors". Pick a FLOWS hue that is not the warning color. Replace slate with a hue distinct from the neutral ramp. Make layer color differ from status colors, and always pair color with icon and border style. |
| D2 | Plan targets Neo4j NVL (`@neo4j-nvl/react`) in Phase 4. `SPECIFICATION.md` states Cytoscape.js + Sigma.js. | Canvas adapter | Keep the `GraphCanvasAdapter` interface. Decide which library is the Phase 4 target. Do not install either in Phase 1. |
| D3 | Product name: plan says "Athar DZ", the spec and maquette say "AegisInvestigate". | Titles, i18n, package names | Pick one name. Put it in one i18n key and one config constant. |
| D4 | Plan mentions TimescaleDB (Layer 5 description) but Docker has only `postgis/postgis:16-3.4`. | Docker, CDR storage | Either add TimescaleDB to Docker and justify it, or remove the mention. Do not assume it exists. |
| D5 | API paths are inconsistent: `/api/v1/cases/{id}/sna/{algo}` includes the case, `/graph?impact_only=true` does not. | API, frontend client | Scope everything under `/api/v1/cases/{case_id}/...`. |
| D6 | Property names contain typos and mixed styles: `_comune_Activite`, `_daira_activiti`, `_wiliya_Activiti`, `_Lvl_of_Implications`, `_betweennessCentrality`; role value `operationeel`. | Data model, SNA output, JSON seed | Use ASCII `snake_case`: `commune_activity`, `daira_activity`, `wilaya_activity`, `implication_level`, `betweenness_centrality`; role values `leader`, `operationnel`, `soutien`, `neutre`. If the seed JSON uses the old names, translate in ONE serializer module. Never scatter both spellings. |
| D7 | Phase 1 in `SPECIFICATION.md` is "Case Board + Layers" (weeks 1-3). The plan adds Neo4j, PostGIS, Redis, 16 SNA tools, map, and timeline. | Planning | Split into internal milestones (section 2). Do not attempt one giant change. |
| D8 | No authentication or user model in Phase 1, but the audit ledger needs "who". | Audit, API | Use a configured `ACTOR_ID` placeholder from env, clearly marked as non-authenticated. Do not invent a login system. |
| D9 | "~18 critical nodes" and "18 / 100" are hard-coded expectations. The impact filter depends on `betweenness_centrality`, which SNA computes. | Impact view, tests | The impact set is computed by a documented rule on stored properties. The UI displays the count returned by the API. Tests assert the count derived from the seed with the rule applied, and the seed is the single source of that number. |
| D10 | Disabled modules show a message on click, but native `disabled` buttons do not fire click events and are skipped by keyboard. | Left accordion, menus | Use `aria-disabled="true"` plus a visible "Phase N" badge. Style with grayed-out/muted colors so the full studio layout from `doc/maquette.html` is completely preserved. Click or Enter opens an explanatory message. |

If you find another contradiction, add a new D-entry. Do not resolve it yourself.

## 2. Milestones (vertical slices, one at a time)

Each milestone ends with a runnable state, passing checks, and a report. Do not start the next until the user approves.

- **1A Foundation**: Docker Compose, `.env.example`, health endpoints, empty FastAPI and React shells, `tokens.css`, CI commands.
- **1B Data**: node/edge type registry (37 types, 47 relations), layer mapping, Neo4j and Postgres schema, idempotent seed of the 100-node case.
- **1C Graph API**: case CRUD, graph read with impact filter, expand, node/edge CRUD, layer change, audit ledger, tool proposals per node type.
- **1D Canvas**: `GraphCanvasAdapter`, circular nodes, layers, pan/zoom/drag, impact view, context menu, undo/redo, inspector.
- **1E SNA**: 16 algorithms, one at a time (section 6), with the SNA panel.
- **1F Views and polish**: timeline, map, left accordion drag & drop, filters, i18n FR/AR/EN, themes, report export, audit viewer, disabled-module badges.
- **1G Hardening**: full test run, accessibility pass, performance check, docs.

## 3. Architecture rules

- Strict tier separation. App tier: `backend`, `frontend`. Data tier: `neo4j`, `postgres` (PostGIS), `redis`. The app never reads data-tier files directly. All access goes through the network and credentials from env.
- Pin image versions exactly as in the plan (`neo4j:5.20`, `postgis/postgis:16-3.4`, `redis:7.2`). Pin Python and Node dependencies in lockfiles. Do not use `latest`.
- Every service has a healthcheck. `backend` waits for healthy data services. Data lives in named volumes, never inside containers.
- Frontend never talks to Neo4j directly. All graph data flows through the API.
- The canvas is built behind `GraphCanvasAdapter` (`nodes`, `edges`, `onNodeRightClick`, `onExpandNode`, plus select, drag, viewport events). No business logic inside the adapter. Swapping the renderer later must not touch the rest of the UI.
- Do not install libraries not named in the plan or spec without asking. If you need one, state why and wait for approval.

## 4. Data model rules

- One registry file is the single source of truth for node types: type key, French and English and Arabic label, icon name (Lucide), layer, default properties, allowed relations. The 37 types and 5-layer mapping in the plan are the starting content.
- Verify counts by code, not by eye: layer 1 = 11, layer 2 = 8, layer 3 = 8, layer 4 = 4, layer 5 = 6, total = 37. Add a test that fails if a type is missing, duplicated, or in two layers.
- Relations: 47 types, each with allowed source and target types. Reject edges that violate the registry. Add a test.
- Backend and frontend share the registry by generation (an exported JSON or generated TS types). Do not hand-copy it into both.
- Every node has: `id` (UUID), `case_id`, `type`, `layer`, `label`, `confidence` (0..1 or null), `provenance` (tool or user), `created_at`, `updated_at`, and a `properties` map. Every edge has: `id`, `case_id`, `type`, `source_id`, `target_id`, `layer`, `confidence`, `provenance`, timestamps.
- Dates: UTC ISO 8601 in storage and API. Convert for display only.
- Phone numbers: store in E.164. Coordinates: WGS84, validated ranges (lat -90..90, lon -180..180), stored in PostGIS geometry as well as the node properties. Keep the two in sync in one function.
- Seed data is fictional. Use reserved or obviously fake values (`+213 555 01xx`, `example.com`). No real persons, plates, accounts, or CCP numbers.
- The seed is idempotent. Running it twice must not duplicate anything. It runs on first start only when the case does not exist. Provide a command to reset in development only.

## 5. Backend rules

- Python 3.12, FastAPI, Pydantic v2, async SQLAlchemy 2.0, official Neo4j async driver. Type hints everywhere. `mypy --strict` or `pyright` must pass.
- Cypher: parameterized queries only. Never build Cypher with f-strings or string concatenation of user input. Labels and relationship types come from the registry allowlist, not from the request.
- Validate all inputs with Pydantic: ranges (`depth` 1..4, `confidence` 0..1, `k` 1..100), enum values, max lengths, max list sizes. Reject unknown fields.
- Every query is scoped by `case_id`. A request must never read or write another case's data. Add a test for it.
- Errors: one JSON shape `{ "error": { "code", "message", "details" } }`, correct HTTP codes (400, 404, 409, 422, 500). Do not leak stack traces or Cypher.
- Pagination and limits on every list endpoint. Timeouts on SNA and Cypher calls.
- CORS: only the configured frontend origin. No wildcard.
- Config from environment through one settings class. No secrets in code, compose files, logs, or git. `.env.example` has placeholders only.
- Neo4j and Postgres must stay consistent. Define which is authoritative for what (graph structure in Neo4j, cases/audit/users/timeline in Postgres) in a short doc, and write operations that touch both in one function with failure handling. Do not leave half-written state.

### Audit ledger

- Append-only. No update or delete code path exists for audit rows.
- Each entry: `id`, `case_id`, `actor_id`, `action`, `entity_type`, `entity_id`, `before`, `after`, `reason`, `timestamp`, `prev_hash`, `hash` (SHA-256 over canonical JSON plus `prev_hash`).
- Written in the same transaction as the change when possible. If not possible, the change fails when the audit write fails.
- Provide a verification function that recomputes the chain and reports the first broken link. Test it, including a tampered row.
- Actions that must be logged: create, update, delete or hide, layer change, edge create or delete, SNA run, seed, export, case open and save.

### Forensic integrity

- Layer 1 (VERIFIED) nodes are immutable by default. They cannot be deleted. They can be hidden from a view only. Editing them requires a reason and creates a new audit entry with before and after.
- Moving a node into VERIFIED requires: a human actor, a non-empty reason, and an audit entry. It never happens as a side effect of SNA, import, seed re-run, or any automation.
- Delete means soft delete (`deleted_at`, `deleted_by`, reason), except in dev reset.

## 6. SNA rules (16 algorithms)

Implement and ship one algorithm at a time. Each one is done only when all items below are true.

For every algorithm:

1. Registered in a single table: key, label (FR/EN/AR), parameters with types and bounds, which node types it accepts, output schema, complexity note.
2. Endpoint: `GET|POST /api/v1/cases/{case_id}/sna/{algo}`. The `algo` path value is checked against the registry allowlist (404 for unknown).
3. Pure function over a graph snapshot: `run(graph, params) -> result`. No DB calls inside the algorithm. The service layer loads the snapshot.
4. Deterministic: fix random seeds, sort inputs. Same input gives same output.
5. Output states the method name and parameters used, so the UI can display method and source (required by `ui-ux-rules.md` section 11).
6. Unit test on a tiny hand-built graph with a result you computed by hand or from a documented reference. Plus tests for empty graph, single node, disconnected graph, invalid params.
7. Behaves safely on bad input (missing node, node of wrong type): clear 4xx, no crash.
8. Runs within the timeout on the 100-node seed. Report the measured time.

Algorithm-specific rules:

- `adamic_adar`, `jaccard`: output suggested edges as HYPOTHESIS-layer, dashed, with score 0..1 and `LIKELY_COLLABORATOR`. Never create persisted VERIFIED edges.
- `betweenness`: results stored as `betweenness_centrality`. Say whether it is normalized. Node size 68px only from the UI mapping, not stored.
- `louvain`, `label_propagation`: community ids are stable per run. State the resolution and seed.
- `node_classification`: roles (`leader`, `operationnel`, `soutien`, `neutre`) are labelled as analytic hypotheses with the rule used. Never present a role as a legal finding. Show the features and thresholds that produced the label.
- `top_k`: state the metric (PageRank or weighted degree) and ties handling.
- `threshold_expand`: `confidence` 0..1, `depth` 1..4. Hard cap on returned nodes, and say when the cap truncated the result.
- `temporal_subgraph`, `temporal_diff`: dates validated, inclusive or exclusive bounds documented, UTC.
- `activity_sector`: only uses nodes with valid coordinates. Report how many nodes were skipped.
- `shortest_path_dijkstra`: states the weight definition. Returns "no path" explicitly instead of an error or empty success.
- `k_core`, `articulation_points`, `ego_network`, `closeness_eigenvector`: document behavior on disconnected graphs. Eigenvector must handle non-convergence and report it.
- `structural_embeddings`: this is a simplified approximation (spectral / simplified Node2Vec). Name it as such in the output and the UI. Do not call it Node2Vec if it is not.
- `personalized_pagerank`: start node required, validated to exist in the case.
- SNA outputs are results to review. They go to the review state (hypothesis or analysis overlay). They never change VERIFIED data and never mark a person as guilty or a leader without the analytic-hypothesis label.
- Heavy computation must not block the API event loop. Run in a thread or process executor, or a worker.

## 7. Frontend rules

- React 19, TypeScript `strict: true`, no `any` (use `unknown` plus narrowing). `tsc --noEmit`, ESLint, and `npm run build` must pass with zero errors and zero new warnings.
- All rules in `ui-ux-rules.md` apply. This section adds Phase 1 specifics.
- Tokens: layer colors, node sizes (56px, 68px), spacing, radii, and z-index live in `tokens.css`. The hex values in the plan are inputs for `tokens.css` only, never inline in components or `studio.css`. `studio.css` may only reference variables.
- Shell layout follows `ui-ux-rules.md` section 2, extended by the plan: left accordion, center canvas, right inspector, with resizable panels (resizers also keyboard operable: `[` and `]` shortcuts plus arrow keys on the resizer handle, with `role="separator"` and `aria-valuenow`).
- State: one store (Zustand per the spec) with separated slices: graph, selection, view, layers, history. The undo/redo stack stores command objects, and each command is reversible. Test undo/redo for move, create, delete, layer change.
- Server state through TanStack Query, with the API client generated or typed from backend schemas. Do not duplicate types by hand if a generated type exists.
- Impact view:
  - The visible node set comes from the API (`impact_only=true`). The label "Vue Impact: X / Y nodes" uses the returned numbers, never hard-coded.
  - "Expand 1-hop / 2-hop" calls the API, merges results without duplicating nodes, and keeps node positions stable for existing nodes.
  - Provide a visible, labeled control to switch between Impact view and All nodes, with a warning when the count is large.
- Circular nodes: layer shown by border color and style, with VERIFIED solid, HYPOTHESIS dashed (2.5px), others solid, plus a layer icon or badge so color is not the only cue. Icon centered (Lucide). Label below with ellipsis and tooltip. Confidence chip only when relevant.
- Context menu (right click):
  - Also opens by keyboard (`ContextMenu` key or `Shift+F10`) and by a visible "..." button on the selected node or the inspector. Right-click only is not acceptable.
  - Real `role="menu"` and `role="menuitem"`, arrow-key navigation, `Esc` to close, focus returns to the node.
  - Items depend on node type and layer. Items not available in Phase 1 show `aria-disabled` and a "Phase N" badge (decision D10).
  - Destructive items (delete/hide) ask for confirmation, show what will be affected, and offer undo.
  - Changing layer to VERIFIED opens a dialog requiring a reason. No one-click promotion.
- Drag & drop from the toolbox: HTML5 DnD for pointer users AND a keyboard alternative (select the type, press Enter, choose position or "add at center"). Drop validates type against the registry.
- Link mode (47 relations): only allowed relation types are offered for the selected source/target pair, from the registry. Invalid pairs show a clear message.
- Provide an accessible alternative to the canvas: a list or table view of nodes and edges with the same selection and actions (required by `ui-ux-rules.md` section 9).
- Timeline and Map views read the same store and selection as the graph. Selecting in one highlights in the others. Map shows only nodes with valid coordinates and says how many were skipped.
- i18n: FR / AR (RTL) / EN. All type labels, relation labels, layer names, algorithm names, errors, and badges come from dictionaries. Check text expansion and RTL on the canvas toolbar and context menu. Keep coordinates, hashes, phone numbers LTR.
- Themes: Dark and Light, both verified for contrast, including layer colors on both backgrounds.
- Performance budget: 100-node case renders and pans smoothly at 1366x768. Memoize node components, avoid re-rendering all nodes on hover, avoid layout thrash. Measure and report, do not claim.

## 8. Judicial safety rules (Phase 1 specifics)

- Persons, roles, and scores are hypotheses unless a human promoted them with a reason. The UI and the exports must say so.
- Never show an SNA score or biometric-like value without its method, parameters, and source.
- No automatic promotion, deletion of evidence, or bulk change without per-action confirmation and an audit entry.
- Export (PDF/JSON) includes: case ID, export date, actor, layer of each item, evidence hashes where present, and the audit-chain verification result. Numbers in an export are generated from data, never typed.
- The report must distinguish VERIFIED facts from hypotheses visually and in text.
- All sample data is fictional, and the UI labels the seeded case as sample data.

## 9. Security rules

- No secrets in repo. `.env` is git-ignored. `.env.example` has placeholders.
- Do not expose Neo4j (7474/7687), Postgres, or Redis ports to the host in the default compose file unless needed for development, and then bind to `127.0.0.1`.
- Run containers as non-root where the image allows. Read-only filesystems where practical.
- Sanitize all rendered text (React escapes by default; never use `dangerouslySetInnerHTML` with data).
- File export names are sanitized. No path built from user input.
- Dependency check: run `pip-audit` and `npm audit` and report high and critical findings. Do not "fix" by upgrading blindly. Report and ask.

## 10. Testing and verification

Run and report actual output for each:

- Backend: `pytest` (unit + API + seed + SNA + audit chain), `ruff`, `mypy` or `pyright`.
- Frontend: `tsc --noEmit`, `eslint`, `vitest` (components, store, undo/redo, registry), `npm run build`.
- Integration: `docker compose up --build`, health checks green, seed loaded once, the API reachable from the frontend, a full flow works: open case, impact view, right-click expand, change layer with reason, run one SNA algorithm, export.
- Accessibility: keyboard-only walkthrough of the flow above, plus an automated check (axe) on the main screens. Contrast check for both themes.
- RTL and 1366 / 1440 / 1920 widths checked visually.
- Tests must assert real behavior. Do not weaken a test, mock away the thing under test, or hard-code expected output to get green.
- A test count in a report must come from the runner output, not from memory.

A milestone is done only when:

- [ ] All checks above pass and the output is quoted in the report
- [ ] No open D-decision blocks the delivered scope
- [ ] `ui-ux-rules.md` Definition of Done passes for touched screens
- [ ] No inline styles, no hex outside `tokens.css`, no emoji, no hard-coded strings
- [ ] No TODO or placeholder left that was introduced in this milestone
- [ ] README section for the milestone: how to run, how to test, known limits

## 11. Forbidden

- Starting code while a blocking decision for that area is OPEN
- Silent choices between plan and spec
- Copying typos from the plan into code
- Hard-coding counts (18, 100, 37, 16, 47) outside the registry or tests derived from data
- String-built Cypher or SQL
- Cross-case reads or writes
- Deleting or silently editing VERIFIED data
- Automatic promotion to VERIFIED
- Right-click-only or drag-only features
- Native `disabled` on buttons that must explain themselves
- Emojis as icons
- Naming a simplified algorithm after the full one
- Unpinned images or dependencies
- Real personal data in seed, tests, or docs
- Reporting "done" or "tested" without quoted command output

## 12. Report format for each milestone

```
Milestone: <1A..1G>
Result: <one sentence>
Decisions used: <D-ids and status>
Files changed: <list>
Commands run and outcome: <command -> pass/fail, with counts from the runner>
Measured: <render time, SNA times, bundle size>
Not verified: <what and why>
Open decisions / risks: <list>
Next milestone needs: <approvals or inputs>
```
