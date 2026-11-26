---
name: phase1-implementation
description: Use when implementing, extending, or reviewing the Phase 1 (v0.1) investigation studio from the Phase 1 plan, including Docker infrastructure, FastAPI + Neo4j + PostgreSQL backend, the 100-node seed, the 16 SNA algorithms, and the React 19 + TypeScript circular graph canvas. Enforces gated, verified, milestone-by-milestone delivery.
---

# Skill: Phase 1 Implementation (gated and verified)

Follow this procedure for any Phase 1 task. It works with `phase1-implementation-rules.md`, `ui-ux-rules.md`, and `llm-no-mistakes-rules.md`. Read all three before starting. Where this skill says "report", use the report format in `phase1-implementation-rules.md` section 12.

## When to use

- The user asks to build, change, fix, test, or review any part of the Phase 1 plan.
- Do NOT use for Phase 2-6 features (OSINT execution, police modules, AI copilot, social profiling). If asked, say it is out of v0.1 scope and show the "Phase N" badge pattern instead.

## Operating principles

1. One milestone at a time (1A to 1G). Never mix milestones in one change.
2. Gate before code. Gate after code. No gate, no progress.
3. Verify with real command output. Quote it.
4. Smallest change that satisfies the task. No extras.
5. When unsure, stop and ask one precise question.

---

## Step 0. Intake (always)

1. Read, fully: the plan, `SPECIFICATION.md`, the three rule files, `DECISIONS.md` (if it exists), and every file you will touch.
2. List files referenced but missing (for example `mock-case-candy-wheels.json`, `scripts/data_model_definitions.py`, `forensics-sna.html`). Missing inputs block the dependent work. Ask the user to attach them. Never reconstruct their content from memory or imagination.
3. Restate the task in 2 sentences, name the milestone, and list what is out of scope.

Output: a short intake note. Wait only if something blocking is missing.

## Step 1. Decision gate

1. If `DECISIONS.md` does not exist, create it with D1 to D10 from `phase1-implementation-rules.md` section 1, all status OPEN, each with a recommendation.
2. Check which decisions affect the current milestone:
   - 1A: D3, D4
   - 1B: D1, D4, D6, D9
   - 1C: D5, D6, D8, D9
   - 1D: D1, D2, D9, D10
   - 1E: D6, D9
   - 1F: D1, D3, D10
3. If an affecting decision is OPEN, present it to the user with the recommendation and ask for approval. Do not start the affected work. You may start unaffected work.
4. Record approvals in `DECISIONS.md` with date.

Exit criteria: no OPEN decision affects the work you are about to do.

## Step 2. Plan the slice

Write a plan of at most 10 lines: files to create or change, tests to add, commands to run, and the exit criteria for this slice. For milestones larger than a day of work, split into sub-slices and deliver one at a time.

## Step 3. Implement by milestone

### 1A Foundation
- `docker-compose.yml` with App tier (`backend`, `frontend`) and Data tier (`neo4j:5.20`, `postgis/postgis:16-3.4`, `redis:7.2`), named volumes, healthchecks, `depends_on` with health conditions, internal network, no unnecessary host ports.
- `.env.example` with placeholders only. `.gitignore` covers `.env`.
- Backend: FastAPI app, settings class, `/health` that checks Neo4j, Postgres, Redis. Frontend: Vite + React 19 + TS strict shell with i18n and theme providers.
- `tokens.css` with all tokens (colors per decision D1, spacing, type, radii, z-index, node sizes).
- Exit: `docker compose up --build` reaches all-green health, frontend loads, `tsc`, `eslint`, `pytest` (health test) pass.

### 1B Data
- Node type registry (37) and relation registry (50) as the single source of truth, with the layer mapping, icons, and labels in FR/EN/AR.
- Export the registry to the frontend by generation.
- Neo4j constraints and indexes, Postgres migrations (Alembic), PostGIS extension.
- Seed script: idempotent, fictional, loads the case from the JSON in Neo4j and Postgres, writes an audit entry.
- Tests: counts per layer (11/8/8/4/6 = 37), no type in two layers, relation endpoints valid, seed idempotent, seed count equals the JSON count.
- Exit: running seed twice gives identical counts, tests pass, registry test fails when a type is removed (prove it by temporarily removing one, then restoring).

### 1C Graph API
- Endpoints under `/api/v1/cases/{case_id}/...`: case CRUD, graph (with `impact_only`), expand (1 or 2 hops), node and edge CRUD, layer change (requires reason), tool proposals by node type, audit list and verify.
- Impact rule implemented in one documented function. The response includes `visible_count` and `total_count`.
- Audit ledger with hash chain and verify function.
- Tests: every endpoint (success and failure), case isolation, layer change rules, VERIFIED immutability, impact count derived from the seed, expand merges without duplicates, audit tamper detection, injection attempts rejected.
- Exit: `pytest`, `ruff`, `mypy` clean. OpenAPI schema generated and typed client builds.

### 1D Canvas
- `GraphCanvasAdapter` interface and `CircularGraphCanvas` implementation, store slices, undo/redo commands.
- Nodes, layers styling, drag, pan, zoom, selection, impact view indicator from API numbers, expand via API.
- `NodeContextMenu` with keyboard access, type-aware items, disabled-with-badge pattern, destructive confirmations, reason dialog for promotion.
- Inspector: edit properties and GPS with validation, layer change with reason.
- List/table alternative view.
- Tests: store and undo/redo, context menu keyboard behavior, adapter contract test, component tests for node rendering per layer.
- Exit: keyboard-only walkthrough passes, axe clean on the screen, `tsc`, `eslint`, `vitest`, `build` pass.

### 1E SNA (loop, one algorithm per iteration)
For each of the 16 algorithms, in this order of simplicity: `ego_network`, `top_k`, `shortest_path_dijkstra`, `betweenness`, `closeness_eigenvector`, `articulation_points`, `k_core`, `louvain` + `label_propagation`, `personalized_pagerank`, `threshold_expand`, `temporal_subgraph`, `temporal_diff`, `activity_sector`, `node_classification`, `adamic_adar` + `jaccard`, `structural_embeddings`:

1. Add the registry entry (params, bounds, output schema).
2. Write the failing test on a tiny hand-computed graph.
3. Implement the pure function.
4. Add edge-case tests (empty, single node, disconnected, invalid params).
5. Wire the endpoint and the UI panel entry.
6. Run tests, measure time on the seed, record the result.
7. Commit-sized report line: algorithm, test count, time.

Do not start the next algorithm until the current one passes. Exit: 16/16 registered, each with tests, each documented, SNA panel lists them with method labels.

### 1F Views and polish
- Left accordion: layers toggles with counts from the API, toolbox with all 37 types (DnD plus keyboard), link mode, filters, business questions.
- Timeline and Map views with synchronized selection.
- Report export (PDF/JSON) generated from data with audit-chain verification result.
- Audit viewer. Disabled modules with Phase badges.
- Full i18n FR/AR/EN, RTL review, Dark/Light.
- Exit: `ui-ux-rules.md` Definition of Done passes on every screen.

### 1G Hardening
- Full test suite, `pip-audit`, `npm audit`, performance measurements, accessibility run, RTL and viewport screenshots, README with run/test/limits, final consistency check against the plan.
- Exit: the milestone checklist in `phase1-implementation-rules.md` section 10 is fully checked, with evidence.

## Step 4. Verify (every slice)

Run the commands from the rules, section 10, that apply to the slice. Capture the real output. If anything fails:

1. Read the error. Form one hypothesis. Change one thing. Re-run.
2. Two failed attempts on the same problem: stop, summarize, ask.
3. Never delete or weaken a test to pass. Never mock the unit under test.

## Step 5. Consistency sweep (every slice)

Verify by code or search, not by eye:

- Counts (37 types, 50 relations, 16 algorithms, 5 layers) match the registry.
- No hard-coded counts in UI or backend.
- No old misspelled property names outside the single serializer.
- No hex colors outside `tokens.css`; no inline styles; no emojis; all strings in dictionaries.
- Every list endpoint has pagination. Every Cypher call is parameterized. Every query is case-scoped.
- Product name appears only through the single constant or i18n key.

## Step 6. Report

Use the report format. Be direct. Lead with what is done, then what is not verified, then decisions needed. Do not recap steps.

## Stop conditions (stop and ask, do not improvise)

- A required input file or decision is missing
- The plan, spec, or rules conflict and no approved decision covers it
- A change would alter VERIFIED data semantics, the audit chain format, or the registry structure after approval
- A new dependency or service is needed
- Two consecutive failures on the same issue
- A request touches Phase 2-6 functionality
- The task would require real personal data

## Templates

### Decision entry
```
ID: D?
Problem:
Options: A) ... B) ...
Recommendation:
Impact if wrong:
Status: OPEN | APPROVED
Approved by / date:
```

### Algorithm checklist (copy per algorithm)
```
[ ] Registry entry (params, bounds, output schema, labels FR/EN/AR)
[ ] Pure function, deterministic
[ ] Unit tests: reference graph, empty, single, disconnected, invalid params
[ ] Endpoint wired, allowlist check, timeout
[ ] Output includes method and parameters
[ ] UI panel entry with method label
[ ] Time on seed measured: ___ ms
[ ] Does not modify VERIFIED data
```

### Slice plan
```
Milestone:
Files to create/change:
Tests to add:
Commands to run:
Exit criteria:
Out of scope:
Decisions required:
```
