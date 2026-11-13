# AI Agent Guidelines & Repository Governance

All AI coding assistants and automation agents operating in this repository must comply with the unified governance rules located in [`.agent/README.md`](.agent/README.md).

### Core Rulebooks
- **Master Orchestrator**: [`.agent/README.md`](.agent/README.md)
- **Reliability & Anti-Hallucination**: [`.agent/llm-no-mistakes-rules.md`](.agent/llm-no-mistakes-rules.md)
- **Phase 1 Implementation & Milestone Gating**: [`.agent/phase1-implementation-rules.md`](.agent/phase1-implementation-rules.md)
- **Forensic Security & Evidentiary Safety**: [`.agent/security-rules.md`](.agent/security-rules.md)
- **UI/UX & Desktop Ergonomics**: [`.agent/ui-ux-rules.md`](.agent/ui-ux-rules.md)
- **Repository Structure & Tier Boundaries**: [`.agent/repo-structure-rules.md`](.agent/repo-structure-rules.md)
- **Architectural Decisions Log**: [`DECISIONS.md`](DECISIONS.md)

### Key Rules
1. **Mock Parity**: The desktop forensic interface must match [`doc/maquette.html`](doc/maquette.html) in styling, layout, desktop menubar, sub-bar, and dual-mode inspector.
2. **Phase Gating (Decision D10)**: Non-Phase 1 buttons and tools must be styled gray (`aria-disabled="true"`) with a visible `Phase N` badge, opening an explanation on click.
3. **Forensic Integrity**: Never automatically promote evidence to Verified without human reason and ISO 27037 audit entry.
4. **Verification**: Always quote actual terminal execution outputs (`npm test`, `tsc --noEmit`, `pytest`).
