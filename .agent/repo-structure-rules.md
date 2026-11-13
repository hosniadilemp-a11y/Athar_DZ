# Repository Organization Rules

Scope: every action that creates, moves, renames, or deletes a file or folder, and every decision about where code lives.
Use with `.agent/README.md`, `llm-no-mistakes-rules.md`, `ui-ux-rules.md`, `security-rules.md`, and `phase1-implementation-rules.md`.
Precedence: user instruction > approved entry in `DECISIONS.md` > Phase 1 plan > `SPECIFICATION.md` > these rules.

`<slug>` means the product slug. It stays a placeholder until decision D3 (product name) is APPROVED. Do not hard-code a name in folder or package names before then.

---

## 1. Target structure

```
/
├─ .agent/
│  ├─ rules/                      # ui-ux-rules.md, llm-no-mistakes-rules.md,
│  │                              # phase1-implementation-rules.md, repo-structure-rules.md
│  └─ skills/
│     └─ phase1-implementation/SKILL.md
├─ backend/
│  ├─ app/
│  │  ├─ main.py                  # app factory only
│  │  ├─ core/                    # config (settings), logging, errors, security, constants
│  │  ├─ api/v1/                  # routers only: cases.py, graph.py, sna.py, audit.py, tools.py, export.py
│  │  ├─ schemas/                 # Pydantic request/response models
│  │  ├─ domain/                  # registry (node types, relations, layers), pure domain rules
│  │  ├─ services/                # business logic: graph, audit, export, impact rule
│  │  │  ├─ sna_engine.py         # dispatcher (plan-named file)
│  │  │  └─ sna/                  # one file per algorithm + registry.py
│  │  └─ db/
│  │     ├─ neo4j.py  postgres.py  redis.py
│  │     ├─ migrations/           # Alembic
│  │     └─ seed_candy_wheels.py  # plan-named file
│  ├─ tests/
│  │  ├─ unit/  api/  sna/  integration/
│  │  ├─ fixtures/                # tiny hand-built graphs
│  │  └─ test_api_phase1.py       # plan-named file
│  ├─ pyproject.toml  Dockerfile  .dockerignore
├─ frontend/
│  ├─ src/
│  │  ├─ app/                     # providers, router, shell layout
│  │  ├─ components/
│  │  │  ├─ ui/                   # primitives: Button, Chip, Modal, Tabs, Tooltip, SegmentedControl
│  │  │  ├─ left/                 # LeftAccordion.tsx (plan-named)
│  │  │  ├─ canvas/               # CircularGraphCanvas.tsx, NodeContextMenu.tsx (plan-named), adapter/
│  │  │  ├─ right/                # Inspector, Inbox
│  │  │  ├─ map/                  # GisMapView.tsx (plan-named)
│  │  │  └─ timeline/
│  │  ├─ store/                   # Zustand slices: graph, selection, view, layers, history
│  │  ├─ api/                     # typed client (generated from OpenAPI) + TanStack Query hooks
│  │  ├─ registry/                # GENERATED from the backend registry. Never hand-edit
│  │  ├─ i18n/                    # fr.json, ar.json, en.json, setup
│  │  ├─ hooks/  lib/  types/
│  │  └─ styles/                  # tokens.css, studio.css (plan-named)
│  ├─ tests/                      # vitest setup, e2e
│  ├─ package.json  package-lock.json  tsconfig.json  vite.config.ts  Dockerfile
├─ data/
│  └─ seed/                       # mock-case-candy-wheels.json (fictional data only)
├─ scripts/                       # one-off and dev tooling: data_model_definitions.py, generate_registry, reset_dev
├─ shared/
│  └─ generated/                  # registry.json and other generated artifacts (committed, marked GENERATED)
├─ doc/                           # SPECIFICATION.md, maquette.html, osint-arsenal.html, forensics-sna.html, ADRs
├─ docker-compose.yml
├─ .env.example
├─ .gitignore  .editorconfig
├─ DECISIONS.md
├─ CHANGELOG.md
└─ README.md
```

- Plan-named files (marked above) keep their exact paths. Do not rename or move them.
- Existing files that already live elsewhere (for example `scripts/data_model_definitions.py`) stay where they are until a decision approves a move. Update this tree only through a decision.
- This tree is the allowed shape. Adding a new top-level folder requires an approved decision.

## 2. Where does new code go (decision table)

| You are adding | Put it in | Not in |
|---|---|---|
| HTTP endpoint | `backend/app/api/v1/<resource>.py` (thin: validate, call service, return) | services, db |
| Request/response model | `backend/app/schemas/` | api files, domain |
| Business rule or orchestration | `backend/app/services/` | api, db |
| One SNA algorithm | `backend/app/services/sna/<algo>.py` (pure function) + entry in `sna/registry.py` | `sna_engine.py` body |
| Node/relation/layer definition | the registry source only (see section 5) | scattered constants |
| DB query or driver code | `backend/app/db/` | services |
| Settings, constants, error types | `backend/app/core/` | anywhere else |
| React primitive (generic) | `frontend/src/components/ui/` | feature folders |
| Feature component | the matching folder under `components/` | `ui/` |
| Global state | `frontend/src/store/<slice>.ts` | component-local files |
| API call | `frontend/src/api/` | components |
| User-visible text | `frontend/src/i18n/*.json` | components |
| Color, size, spacing | `frontend/src/styles/tokens.css` | components, `studio.css` |
| Test | next to its layer under `tests/` (backend) or `*.test.ts(x)` beside the file (frontend) | a root-level `tests` dump |
| Fictional sample data | `data/seed/` | code, tests inline |
| Dev utility script | `scripts/` | `backend/app/` |
| Documentation, mockups | `doc/` | root |
| Decision, changelog | `DECISIONS.md`, `CHANGELOG.md` | README |

If a thing fits no row, stop and ask. Do not invent a new folder.

## 3. Dependency direction (no cycles)

Backend (arrows mean "may import"):

```
api -> schemas, services, core
services -> domain, db, schemas, core
services/sna/* -> domain only (pure, no DB, no FastAPI)
db -> core, domain
domain -> (nothing from app)
core -> (nothing from app)
```

Frontend:

```
app -> components, store, api, i18n, styles
components/<feature> -> components/ui, store, api, hooks, lib, registry, i18n
components/ui -> lib, styles (never store or api)
store -> types, registry
api -> types
registry, types, i18n -> (nothing from src)
```

- No circular imports. If you need one, the code is in the wrong layer. Move it.
- Frontend never imports from `backend/`. Backend never imports from `frontend/`. Sharing happens only through `shared/generated/` and the OpenAPI schema.

## 4. Naming

- Python: files and modules `snake_case.py`; classes `PascalCase`; functions and variables `snake_case`; constants `UPPER_SNAKE`.
- TypeScript: React components and their files `PascalCase.tsx`; hooks `useThing.ts`; utilities `camelCase.ts`; types `PascalCase`; constants `UPPER_SNAKE`.
- CSS: custom properties `--kebab-case` named by role (`--color-layer-verified`, `--space-3`). No names by value (`--blue-500` for a role is forbidden).
- JSON, Cypher property names, API fields: ASCII `snake_case` (see D6 in the Phase 1 rules). Node labels in Cypher and node type keys: the registry spelling, one form only.
- Folders: lowercase, `kebab-case` or `snake_case` consistent within a tree (Python `snake_case`, frontend folders lowercase single words).
- API paths: `/api/v1/cases/{case_id}/...`, plural nouns, lowercase, kebab-case segments.
- Tests: `test_<unit>.py`, `<Unit>.test.tsx`.
- i18n keys: dotted lowercase (`layer.verified.name`, `menu.node.expand`).
- Forbidden names: `utils.py` or `helpers.ts` as a dumping ground, `common`, `misc`, `temp`, `new`, `final`, `v2`, `copy`, `old`, `backup`, `test2`. Name by responsibility.
- No product name in identifiers until D3 is approved. After approval, the name lives in one constant and one i18n key, never in file names or code identifiers except the package name.

## 5. Single sources of truth

| Data | Source | Consumers |
|---|---|---|
| 37 node types, 47 relations, layers, labels, icons | one registry source in the backend domain | frontend via `shared/generated/registry.json` and `frontend/src/registry/` (generated) |
| Design tokens | `frontend/src/styles/tokens.css` | everything else via `var(--...)` |
| Settings and secrets | environment variables via `backend/app/core/config.py` | everything else |
| API types | backend Pydantic schemas -> OpenAPI | frontend `src/api/` (generated) |
| Product name, version | one constant and one i18n key | UI, docs build |
| Seed data | `data/seed/*.json` | seed script and tests |

- Generated files carry a header `GENERATED - DO NOT EDIT` and the command that regenerates them. Provide one script to regenerate. CI or the verification step fails if generated files are stale.
- Never copy a registry, enum, or type list by hand into a second place.

## 6. File and function size and shape

- Python and TypeScript files: soft limit 400 lines, hard limit 600. Over the soft limit, propose a split. Over the hard limit, split before adding more.
- Function: soft limit 60 lines. React component: soft limit 250 lines.
- One responsibility per file. A router file contains routes. A service file contains business logic. A component file contains one main component (plus small private helpers).
- Split by responsibility, not by arbitrary line count. Keep the public import path of plan-named files stable by re-exporting.
- No god modules, no barrel files that hide cycles, no dead code, no commented-out code, no `TODO` without an owner and an issue reference.

## 7. Changing the structure

Before creating a file:
1. Search the repo for an existing file that already does it. Extend it instead of duplicating.
2. Check section 2 for the correct location.
3. Check the plan for a named path. If the plan names it, use that exact path.

Moving or renaming:
1. Use `git mv` so history is kept.
2. Update every import, path, Docker context, config, doc link, and test in the same change.
3. Run the full check set for the affected tier. Report the result.
4. Do not mix a move with a behavior change in one commit.

Deleting:
1. Prove it is unused (search for references, run tests).
2. Never delete evidence-related code paths, migrations that already ran, seed data used by tests, or generated registry files without approval.
3. List deleted files in the report.

Never:
- Create a new top-level folder, rename a plan-named file, or relocate an existing source-of-truth file without an approved decision.
- Put files in the repo root other than those listed in section 1.
- Create parallel variants of one thing (`maquette2.html`, `graph_new.py`). Edit the original or replace it with approval.

## 8. Repo hygiene and version control

- `.gitignore` covers: `.env`, `node_modules`, `__pycache__`, `.venv`, build output (`dist`, `build`), coverage output, IDE folders, OS files, Docker volumes, logs, exported reports, local databases.
- Never commit: secrets, real personal data, large binaries, database dumps, `node_modules`, build artifacts.
- Commit lockfiles (`package-lock.json`, the Python lock file). Pin versions. No `latest` tags.
- `.env.example` is committed with placeholders only. Every new env variable is added to it in the same change, with a comment.
- Branches: `main` is always runnable. Work on `phase1/<milestone>-<short-topic>` (for example `phase1/1b-registry`).
- Commits: Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`), small, one logical change, imperative subject under 72 characters. Reference the milestone or decision (`feat(registry): add 37 node types [1B, D6]`).
- Do not rewrite or force-push shared history. Never commit generated build output or secrets "temporarily".
- `CHANGELOG.md`: one entry per delivered milestone. `DECISIONS.md`: one entry per decision with status.
- Each milestone adds a README section: how to run, how to test, known limits.

## 9. Docker and configuration layout

- One `docker-compose.yml` at root for v0.1. Services: `backend`, `frontend` (App tier); `neo4j`, `postgres`, `redis` (Data tier). Tiers are separated by network and naming. Do not mix them.
- Each deployable has its own `Dockerfile` inside its folder (`backend/Dockerfile`, `frontend/Dockerfile`) and a `.dockerignore`.
- No credentials in compose or Dockerfiles. Use env references.
- Config files live next to what they configure and are named for it (`vite.config.ts`, `pyproject.toml`, `alembic.ini` under `backend/`). No duplicate configs.

## 10. Documentation placement

- `doc/` holds `SPECIFICATION.md`, mockups (`maquette.html`), reference pages, and ADRs (`doc/adr/NNNN-title.md`).
- Code documentation: docstrings and short module headers. No long prose in code files.
- Do not duplicate numbers or lists across docs. Link to the single source instead.
- When a doc contradicts the code or the registry, report it and propose the fix. Do not edit the spec to match code silently.

## 11. Structure verification (run before every report)

Run, and quote the output:

- Tree check: list new, moved, and deleted paths. Each must match section 1 or an approved decision.
- Layering check: no backend `domain` or `core` imports from other app layers; no `components/ui` imports from `store` or `api`; no cycles (use `import-linter` or `madge --circular`, or an equivalent).
- Size check: no file over the hard limit; list files over the soft limit.
- Generated check: regenerate the registry and API client, and confirm there is no diff.
- Hygiene check: `git status` shows no unexpected files; no secrets, no build output, no `.env`.
- Naming check: no forbidden names; no old misspelled property names outside the serializer.

Checklist:

- [ ] Every new file is in the right folder per section 2
- [ ] Plan-named paths unchanged
- [ ] Dependency direction respected, no cycles
- [ ] No duplicated source of truth, generated files fresh
- [ ] No file over the hard size limit
- [ ] Names follow section 4, no forbidden names, no product name in identifiers (until D3)
- [ ] `.env.example`, `README`, `CHANGELOG`, `DECISIONS.md` updated where needed
- [ ] Moves done with `git mv`, imports updated, tests green

## 12. Forbidden

- New top-level folders without a decision
- Renaming or moving plan-named files
- `utils`, `helpers`, `common`, `misc` junk drawers
- Duplicate or "v2"/"copy"/"final" file variants
- Hand-editing generated files
- Hand-copying the registry or types into a second place
- Frontend code importing backend code, or the reverse
- Business logic in routers or React components with no service/store layer
- DB access outside `backend/app/db/`
- Direct `fetch` calls in components (use `src/api/`)
- Mixing a file move with a behavior change in one commit
- Committing secrets, real data, build output, or dumps
- Leaving the repo root cluttered with scratch files
