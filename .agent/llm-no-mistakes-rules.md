# LLM Reliability Rules — Avoid Mistakes

Scope: every task performed by an AI agent in this repository (code, design, docs, analysis).
These rules are mandatory and operate in synergy with `.agent/README.md`, `phase1-implementation-rules.md`, `security-rules.md`, `ui-ux-rules.md`, and `repo-structure-rules.md`. When unsure, stop and ask. Do not guess.

---

## 1. Prime directive

1. Correct beats fast. A wrong answer delivered confidently is worse than a question.
2. Do exactly what was asked. No more, no less.
3. Never claim something is done, working, or verified unless you actually checked it.
4. Never invent. If you do not know, say "I don't know" and say how to find out.

## 2. Source of truth hierarchy

When sources conflict, use this order and report the conflict:

1. The user's latest explicit instruction
2. `DECISIONS.md` (the approved decision log)
3. `SPECIFICATION.md` (features, numbers, IDs, naming)
4. Companion rule files (`.agent/README.md`, `ui-ux-rules.md`, `phase1-implementation-rules.md`, `security-rules.md`, `repo-structure-rules.md`)
5. Existing code and files in the repo
6. Your own general knowledge (lowest trust)

Never silently pick one. Write: "Spec says X, file says Y. Using X. Confirm?"

## 3. Before you act

1. Read every file you will touch, fully. Do not edit from memory or from a summary.
2. If a file is mentioned but missing (e.g. `style.css`, `maquette-i18n.js`), say it is missing. Do not assume its content.
3. Restate the task in one or two sentences, including what is OUT of scope.
4. List the files you will change before changing them.
5. For tasks with more than 3 steps, write a short plan and execute phase by phase.
6. If the request is ambiguous and a wrong guess is expensive, ask ONE focused question. If a wrong guess is cheap, pick the most reasonable reading, state it, and continue.

## 4. Scope control

- Change only what the task requires. No drive-by refactors, renames, reformatting, or "improvements".
- Do not add features that are not in the request or `SPECIFICATION.md`.
- Do not remove features. Relocate or hide them and report it.
- Do not add dependencies, libraries, or build tools without asking.
- Do not touch unrelated files. If you notice a problem elsewhere, list it in the report instead of fixing it.
- One phase at a time. After each phase: short summary, then wait for approval if the user asked for phased work.

## 5. Never invent

Do not fabricate any of these. Verify or mark as unverified:

- Function names, API endpoints, CLI flags, library versions, config keys
- File paths and file contents you have not opened
- Numbers, statistics, percentages, dates, case IDs, tool counts
- Legal references, article numbers, legal procedures (Code de Procédure Pénale, etc.). Mark every legal item "to be verified by a legal professional".
- Citations and URLs. Use only ones you retrieved or the user supplied.
- Test results, build results, screenshots you did not run or see

If a value is a placeholder, label it `PLACEHOLDER` visibly. If sample data is fictional, label it `SAMPLE`.

## 6. Editing rules

- Prefer small, targeted edits over full rewrites. Never rewrite a whole file to change a few lines.
- Preserve existing formatting, indentation, naming style, and comments unless the task is about them.
- Re-read the exact text before replacing it. Match it exactly.
- Do not leave dead code, commented-out blocks, debug prints, or TODOs that you introduced.
- Do not truncate files with "...rest unchanged". Output complete content or use a precise edit.
- Never overwrite user-provided originals. Work on a copy when the task transforms a file.
- Keep changes reversible. Describe how to undo non-trivial changes.

## 7. Consistency checks (mandatory for this project)

Before finishing, verify these match `SPECIFICATION.md`, `DECISIONS.md`, and `doc/maquette.html` across every file you touched:

- Case ID format
- Total tool count (76 tools catalog, 16 OSINT, 16 SNA, 9 Police) and category count
- Layer names (5 layers per D1: VERIFIED, OSINT_RAW, INFRA, HYPOTHESIS, FLOWS)
- Panel placement (Left accordion with 4 groups, center canvas, right dual-mode inspector)
- Phase gating fidelity: buttons for future phases (Phase 2..6) are grayed out with "Phase N" badge per Decision D10
- Percentages and scores shown in more than one place
- Language list (FR / AR / EN) and RTL behavior

If the spec itself is inconsistent, report it. Do not "fix" the spec without approval.

## 8. Verification (do not skip)

Match the check to the artifact:

- Code: run it, run tests, run the linter. Report the actual output.
- HTML/CSS/JS: open or render it, check the console for errors, check at 1366px, 1920px, and RTL.
- Data or numbers: recompute them. Do not trust your first pass.
- Docs: re-read against the request. Check every link, path, and name.
- Accessibility: tab through the keyboard path, check contrast and focus.

If you cannot run something (no browser, no runtime, missing files), say exactly what you could not verify. Never write "tested" or "works" for something you did not execute.

## 9. Ask vs assume

Ask first when:
- The action is destructive or hard to undo (delete, overwrite, migrate, rename across files)
- Two readings of the request lead to very different work
- A required file, credential, or decision is missing
- The request conflicts with the spec or these rules

Assume and state the assumption when:
- The choice is cheap to change later
- A sensible default exists (state it in one line)

## 10. Security, privacy, and legal safety

This project handles forensic and personal data. Treat it as sensitive.

- Never hard-code secrets, API keys, tokens, or passwords. Use environment variables or a vault reference.
- Never log or print personal data (names, phone numbers, accounts) unless the feature requires it.
- Use fictional sample data in mockups, tests, and docs. No real persons, real numbers, or real case data.
- Do not weaken security for convenience (disabling auth, TLS checks, sandboxing, WORM/immutability).
- Do not write code that bypasses legal process or accesses systems without authorization. Features must keep the human review step and the audit trail.
- Never present AI output as evidence or fact. Keep fact, hypothesis, and AI inference clearly separated.
- Destructive commands (`rm -rf`, `DROP`, force push, bulk overwrite) require explicit user confirmation.

## 11. Communication

- Be direct and specific. No filler, no flattery, no vague praise.
- Lead with the result, then details.
- Use the user's language. Keep technical terms in their original form.
- Distinguish clearly: **Done**, **Not done**, **Could not verify**, **Needs decision**.
- Do not hide problems. If something failed or was skipped, say it in the first lines.
- Do not over-apologize. State what went wrong, fix it, move on.
- Keep reports short. Do not recap every step.

## 12. Error recovery

When something fails:

1. Read the actual error message. Do not guess the cause.
2. Form one hypothesis, test it, then change one thing at a time.
3. Do not retry the same failing action unchanged more than once.
4. If two attempts fail, stop, summarize what you tried, and ask.
5. Never fake a pass: do not delete tests, silence errors, or hard-code expected values to make a check succeed.
6. If you made a mistake, say so, state the impact, and fix it.

## 13. Phased work protocol

For any large task:

1. Phase 0: audit. List problems and the plan. No changes.
2. Each later phase: do the work, run the checks, output a short change summary (files changed, what, why, checks run).
3. Wait for approval between phases when requested.
4. Keep a running list of open issues and decisions.

## 14. Final self-check (run before every final answer)

- [ ] I did what was asked, nothing extra
- [ ] I read every file I edited
- [ ] No invented names, numbers, paths, or references
- [ ] All values match `SPECIFICATION.md`, or the conflict is reported
- [ ] I ran or rendered the result, and the report states what was and was not verified
- [ ] No secrets, no real personal data
- [ ] No unrelated changes
- [ ] The UI/UX rules were followed (`ui-ux-rules.md`)
- [ ] Open issues and assumptions are listed at the top of the report

## 15. Report template

```
Result: <one sentence>
Changed: <files and what changed>
Verified: <what you actually ran or checked, with outcome>
Not verified: <what you could not check and why>
Assumptions: <list>
Conflicts / issues found: <list>
Needs your decision: <list or "none">
```
