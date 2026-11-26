# Forensics Validation, Extraction & Manual Link Rules

Scope: all graph node/edge creation, SPI extraction pipelines (`extracted_candidates`, `extracted_relation_candidates`), and canvas validation workflows across backend (`FastAPI`, PostgreSQL, Neo4j) and frontend (`React`, `Zustand`).
Governed by **Decisions D19 & D20** in [`DECISIONS.md`](../DECISIONS.md).

---

## 1. Dragged Source File → Validated Entity Link (`EXTRAIT_DE`) Auto-Validation

- Whenever an investigator drags or adds a source evidence entity (file, PDF, HTML, image, or document node) and runs extraction on it, validating or merging any extracted candidate entity **automatically validates** its `EXTRAIT_DE` provenance link back to that dragged source entity.
- The resulting `EXTRAIT_DE` edge **MUST** be created directly as validated proof:
  - `layer = "VERIFIED"`
  - `confidence = 1.0` (100%)
- No second manual confirmation step is required for `EXTRAIT_DE` provenance edges.

## 2. Strict Human Validation Scope for Extracted Information

- **ONLY** the following two classes of machine-extracted records require explicit investigator validation (`PENDING` → `VALIDATED` / `MERGED` / `REJECTED`):
  1. **Extracted Entities** (`extracted_candidates`), which are staged on the canvas as preview ghost nodes and in **Indices extraits à valider** before promotion.
  2. **Semantic Relations Between Extracted Entities** (`extracted_relation_candidates`), which connect extracted entities to each other inside **Relations sémantiques détectées** and as dashed preview edges on the canvas.
- Validating or merging two extracted entities **MUST NOT** silently auto-promote semantic relations connecting them; those inter-entity semantic relations remain `PENDING` until explicitly validated, edited, or rejected by the investigator.

## 3. Manual Link Creation Defaults to 100% Validated (`VERIFIED`)

- Any relation manually created by the investigator between two nodes on the graph (`POST /api/v1/cases/{case_id}/edges`, `CreateRelationModal`, `useGraphStore.createManualEdge`) defaults to:
  - `confidence = 1.0` (`100%`)
  - `layer = "VERIFIED"`
- Those defaults hold unless the investigator explicitly selects another confidence score or layer (`calque`) during creation or updates the edge afterward in **InspectorPanel**.

## 4. Confidence 100% ↔ `VERIFIED` & Frictionless Layer Transitions (Decision D19)

- Whenever an investigator creates or updates a node, staged candidate, staged relation, or canonical graph edge with confidence set to `100%` (`>= 1.0`), its layer (`calque`) automatically resolves to `VERIFIED` (unless the user explicitly selects a different target layer).
- Changing a node or edge's layer (`calque`) executes directly without any blocking modal or mandatory manual reason prompt; every transition still writes an immutable hash-chained ISO 27037 audit ledger event with an automatic default justification when no custom reason is provided.
