# Antigravity & AI Agent Governance — Athar DZ (أثر)

> **Central Agent Orchestration Hub**: This document unifies and orchestrates all AI coding agents, rules, and workflows operating within the `Athar_DZ` repository.
> Every AI agent (Antigravity, Cursor, Gemini, Claude, Copilot) MUST follow this governance model.

---

## 1. Master Rulebook Hierarchy

When instructions or rulebooks conflict, agents MUST resolve them according to this strict hierarchy:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Latest Explicit User Instruction                         │
│    (Highest priority; cannot bypass safety/security bounds) │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. Architectural & Implementation Decisions (DECISIONS.md)  │
│    (Approved resolutions D1..D10 override lower specs)      │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. Phase Implementation Rules                               │
│    (.agent/phase1-implementation-rules.md)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 4. System Specification (doc/SPECIFICATION.md)              │
│    (Core data ontology, layers, tools, and algorithms)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 5. Core Operational Rulebooks (Stricter rule always wins)   │
│    • .agent/llm-no-mistakes-rules.md (Reliability)          │
│    • .agent/security-rules.md (Forensic integrity & safety) │
│    • .agent/repo-structure-rules.md (File placement)        │
│    • .agent/ui-ux-rules.md (Visual, WCAG AA, Tokens)        │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 6. Existing Code & Repository State                         │
└─────────────────────────────────────────────────────────────┘
```

> [!IMPORTANT]
> Never silently resolve conflicts. If `SPECIFICATION.md` says X and the implementation plan says Y without an approved decision in `DECISIONS.md`, record the decision as `OPEN` and ask the user before touching the affected area.

---

## 2. Core Rulebooks & Interconnections

All five `.agent` rule files form an integrated, non-overlapping operating model:

| Rulebook | Primary Scope | Enforced Standards | Companion Rules |
| :--- | :--- | :--- | :--- |
| **[`llm-no-mistakes-rules.md`](file:///c:/Users/adel/Documents/IC/Athar_DZ/.agent/llm-no-mistakes-rules.md)** | Agent reliability, anti-hallucination, verification | Zero invented paths/numbers, quoted verification outputs, strict rollback protocols. | `security-rules.md`<br>`phase1-implementation-rules.md`<br>`repo-structure-rules.md`<br>`ui-ux-rules.md` |
| **[`phase1-implementation-rules.md`](file:///c:/Users/adel/Documents/IC/Athar_DZ/.agent/phase1-implementation-rules.md)** | Phase 1 (v0.1) execution, SNA algorithms, milestone gating | 1A–1G gated milestones, 16 deterministic SNA algorithms, single registry source of truth, **Phase Gating (Decision D10)**. | `ui-ux-rules.md`<br>`llm-no-mistakes-rules.md`<br>`security-rules.md`<br>`repo-structure-rules.md` |
| **[`security-rules.md`](file:///c:/Users/adel/Documents/IC/Athar_DZ/.agent/security-rules.md)** | Forensic integrity, evidentiary safety, zero-trust | ISO 27037 audit hash-chain, WORM immutability, case isolation, parameterized Cypher/SQL, Algerian legal safety. | `phase1-implementation-rules.md`<br>`llm-no-mistakes-rules.md`<br>`repo-structure-rules.md` |
| **[`ui-ux-rules.md`](file:///c:/Users/adel/Documents/IC/Athar_DZ/.agent/ui-ux-rules.md)** | Desktop forensic UI, accessibility, design tokens | WCAG 2.2 AA, 8-pt grid, 0 inline styles, 0 emojis, CSS variables from `tokens.css`, FR/AR (RTL)/EN i18n, **Desktop Menubar & Mockup Parity**. | `phase1-implementation-rules.md`<br>`llm-no-mistakes-rules.md`<br>`repo-structure-rules.md` |
| **[`repo-structure-rules.md`](file:///c:/Users/adel/Documents/IC/Athar_DZ/.agent/repo-structure-rules.md)** | File organization, architecture boundaries | 2-tier app (App tier / Data tier), unidirectional dependencies, file line limits (<600 lines), generated artifacts fresh. | `phase1-implementation-rules.md`<br>`llm-no-mistakes-rules.md`<br>`security-rules.md` |

---

## 3. High-Fidelity Mockup Parity & Phase Gating (Decision D10)

The target visual layout and forensic user experience are defined by the master mockup:
- **Reference Mockup**: [`doc/maquette.html`](file:///c:/Users/adel/Documents/IC/Athar_DZ/doc/maquette.html)
- **Reference Stylesheet**: [`doc/assets/maquette.css`](file:///c:/Users/adel/Documents/IC/Athar_DZ/doc/assets/maquette.css)

### Mandatory UI Structure
1. **Desktop Native Menubar (32px)**: 8 menus (`Dossier`, `Édition`, `Insérer`, `Outils OSINT`, `Réseaux Sociaux`, `Police Judiciaire`, `Affichage`, `Assistant IA`) + Mode Switcher (`Collecter`, `Analyser`, `Rapporter`) + Spec link + Theme + Lang + User badge.
2. **Sub-Bar (44px)**: Case Selector + Stealth Alert Badge + Command Palette (`Ctrl+K`) search bar.
3. **Left Accordion Panel (240px)**:
   - Group 1: Calques d'Enquête (5 layers with counts).
   - Group 2: Création & Liaisons (Mode liaison toggle + 8 domain filter chips + 37 drag & drop items).
   - Group 3: Filtres par Nature (Entity filters).
   - Group 4: Questions Métier (Pre-packaged Cypher queries).
   - Footer: Registre d'Audit Forensique button.
4. **Canvas Sub-Header**: Analytical view switcher (`Graphe`, `Chronologie`, `Carte SIG`, `Table`, `Audit`) + Recommended Playbook Review-Run button + Impact View toggle.
5. **Right Inspector Panel (340px)**:
   - *No element selected*: Case Overview KPIs (loss, victims, locations, evidence) + Clues Inbox (Review-Run pending validation queue).
   - *Node selected*: Full Inspector (label, type, layer, confidence, evidence hash chip with copy, provenance, GPS, properties, suggested tools).
6. **Status Bar (24px)**: Case ID, node count, relation count, data service health, ISO 27037 sealing status.

### Phase Gating Standard (Graying Out Non-Phase 1 Features)
- Any button, menu item, or tool that is scheduled for a future phase (Phases 2 through 6) **MUST** be rendered in the UI with:
  - Class `.is-future-phase` or attribute `aria-disabled="true"`.
  - Muted, grayed-out styling (reduced opacity and grayscale).
  - A visible badge indicating its target phase (e.g., `Phase 2`, `Phase 3`, `Phase 5`).
  - An interactive click/Enter handler that displays an explanatory notification (explaining the milestone without throwing an unhandled error or native HTML button dead-end).
- Phase 1 active features (Graph board, 5 layers, 16 SNA algorithms, 37 node creation types, timeline, GIS map, audit ledger, export) remain fully active and interactive.

---

## 4. Mandatory Pre-Execution & Verification Protocol

Before finishing any task, the agent MUST execute and quote command results:
1. **Frontend**:
   - `npm test -- --run` (all vitest unit & component tests must pass)
   - `npx tsc --noEmit` (TypeScript strict mode, 0 errors, 0 warnings)
2. **Backend**:
   - `pytest` (API, domain registry, SNA deterministic suite, audit ledger chain)
3. **UI/UX Audit**:
   - Zero inline styles (`style="..."` forbidden outside dynamic node coords).
   - Zero hardcoded colors outside `tokens.css`.
   - Zero emojis in UI components.
   - All text translated in FR / AR (RTL) / EN.
   - Chrome vertical budget <= 100px.

---

## 5. Report Template for All Agent Deliverables

Every task report must conclude with this exact structure:

```markdown
Result: <One-sentence summary>
Changed: <List of files and what changed in each>
Verified: <Exact terminal commands executed and runner output>
Not verified: <Explicit list of unexecuted checks and reasons>
Phase Gating: <Confirmation that non-Phase 1 controls are grayed out with Phase badges>
Decisions used: <D-IDs referenced from DECISIONS.md>
```
