# UI/UX Rules — AegisInvestigate / Athar DZ

Scope: every change to HTML, CSS, JS, React components, mockups, or design assets.
Use together with `.agent/README.md`, `llm-no-mistakes-rules.md`, `phase1-implementation-rules.md`, `security-rules.md`, and `repo-structure-rules.md`.
Precedence: user instruction > approved entry in `DECISIONS.md` > these rules. If a rule conflicts with a user request, say so and ask before breaking it.

Standards baseline: WCAG 2.2 AA, Nielsen's 10 heuristics, 8-pt spacing grid, W3C design-token structure, and high-fidelity parity with `doc/maquette.html`.

---

## 1. Core principles

1. One screen = one job. Never show every feature at once.
2. Progressive disclosure. Show 5-7 choices at a time, hide the rest behind search, "Show all", or a secondary screen.
3. Context drives the UI. What the user selected decides what the side panel shows.
4. Each action has ONE primary location. Do not duplicate buttons across menu, toolbar, panel, and modal.
5. Normal state is quiet. Only abnormal state (error, warning, stealth OFF, offline) is loud.
6. Working modes and reporting modes are separate (Collect / Analyze / Report).
7. Canvas is the product. It must get at least 60% of viewport width at 1366px.

## 2. Layout (fixed shell)

| Zone | Size | Allowed content |
|---|---|---|
| Top bar | 48px | Logo, case switcher, command palette (Ctrl+K), mode switch, language, user |
| Left panel | 240px, collapsible | Layers (with counts), collapsed Filters. Nothing else |
| Canvas | flex | Segmented control Graph / Timeline / Map, floating tool palette, optional minimap |
| Right panel | 340px, collapsible, context-driven | No selection: case overview + Inbox. Node selected: Inspector + Suggested tools. Two nodes: Compare action |
| Status bar | 24px | Job queue, sync state, audit-log indicator only |

- Total vertical chrome <= 100px.
- Maximum 3 views on the canvas switcher. Vault, Storyboard, and Report live elsewhere (right panel section or Report mode).
- Panels collapse below 1280px width. No toolbar may overflow or wrap.
- KPIs belong in the case overview. Maximum 2 in the header.
- No menu bar with hover flyouts. Use the command palette plus one "..." menu. If a menu bar is required: File, Edit, View, Help only.

## 3. Design tokens (no raw values)

- All colors, sizes, spacing, radii, shadows, z-index, and durations come from CSS variables in `tokens.css`.
- Forbidden outside `tokens.css`: hex colors, rgb()/hsl() literals, raw px for spacing or font size, magic z-index numbers.
- Forbidden everywhere: inline `style=""` attributes.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48. Nothing else.
- Radii: 4px and 8px only.
- Two themes: dark (default) and light. Light theme is mandatory because reports are printed.
- Naming: `--color-bg-surface`, `--color-text-secondary`, `--space-3`, `--radius-md`. Name by role, not by value.

## 4. Color

- Neutral gray ramp (8 steps) for ~90% of the UI.
- ONE interactive accent (blue). Used only for clickable/focus/selected.
- Four status colors, used only for status: success, warning, danger, info.
- Four muted layer colors, used only on graph nodes and the layer list.
- One color = one meaning. Never reuse a layer color for a button, badge, or KPI.
- Never use color alone. Pair with an icon, label, shape, or border style.
- Hypothesis/AI content: dashed border + icon + text label "Hypothesis". Not just purple.
- Contrast: text >= 4.5:1, large text and UI components >= 3:1. Check secondary text especially.

## 5. Typography

- UI font: Inter. Mono (hashes, IDs, phone numbers, SHA-256): JetBrains Mono. Arabic: IBM Plex Sans Arabic or Noto Sans Arabic.
- Scale: 12 / 13 / 14 / 16 / 20 / 24 px. Minimum 12px, no exceptions.
- Max 3 text sizes per panel.
- Uppercase tiny labels are forbidden. Use sentence case.
- Truncate with ellipsis plus tooltip. Never clip silently.

## 6. Icons

- One icon set only: Lucide (or Phosphor if Lucide is unavailable). SVG, 16 or 20px, `currentColor`.
- No emojis in UI, buttons, menus, tables, or reports.
- Icon-only buttons require `aria-label` and a tooltip.

## 7. Components

Build once, reuse everywhere. No one-off copies.

- Button: primary / secondary / ghost / danger. Sizes sm 28 / md 32 / lg 40. One primary button per view.
- Segmented control, Tabs, Panel, Modal, Toast, Table, Chip, Tooltip, Command palette.
- Node card: icon + label + max one sub-line. Entity type = icon/shape. Layer = border style/color. Confidence = small chip. Hypothesis = dashed border + icon.
- Edge: label shown on hover or selection only.
- Inbox item states: new, added, dismissed. Each state has a distinct icon and text, not only opacity.
- Confidence chip: always shows method on hover or click. Never a bare percentage.
- Evidence hash chip: mono font, truncated middle, copy button, full value on focus.
- Requirement chip for tools (offline / free key / sock-puppet / paid): one neutral chip style with icon. Not one color per type.

## 8. Interaction and states

- Real elements only: `<button>`, `<a>`, `<input>`, `<select>`. Never `<div onclick>`.
- No hover-only interactions. Everything reachable by keyboard and touch.
- Hit target >= 32px (absolute minimum 24px).
- Every interactive element defines: default, hover, focus-visible, active, disabled, loading. Data views also define: empty, loading, error.
- Destructive actions need confirmation or an undo toast. Show what will be affected.
- Long jobs show progress and can be cancelled.
- Animation: 100-200ms, only for state change. No looping animations. Respect `prefers-reduced-motion`.

## 9. Accessibility (WCAG 2.2 AA)

- Full keyboard path must work: command palette -> select node -> run tool -> review inbox item -> promote or discard.
- Visible focus ring (min 2px, 3:1 contrast) on every focusable element.
- Logical tab order. Focus trapped in modals, returned on close.
- Landmarks: `header`, `nav`, `main`, `aside`. Headings in order.
- Dynamic updates (new inbox clue, job finished) announced with `aria-live="polite"`.
- Graph canvas has a list/table alternative for screen readers and keyboard users.

## 10. i18n and RTL (FR / AR / EN)

- Every visible string comes from the i18n dictionary. Zero hard-coded text in markup or JS.
- Use CSS logical properties: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `text-align: start`. Do not write per-direction `[dir="rtl"]` overrides unless unavoidable.
- Mirror layout and directional icons (arrows, chevrons) in RTL. Do not mirror logos, numbers, charts, or media.
- Keep phone numbers, hashes, IDs, and URLs LTR inside RTL text (`dir="ltr"` or `<bdi>`).
- Allow 30-40% text expansion. Test with the longest French string.
- Dates, numbers, and currency use `Intl` formatting per locale.

## 11. Judicial and forensic safety patterns

- Fact vs hypothesis must be visually AND textually distinct everywhere (graph, lists, reports).
- Never present an AI or inferred result as fact. Label: "Candidate / Hypothesis - requires human validation". Show method and sources next to any score.
- Automation never promotes anything to Verified. Tool results go to the Inbox for review (Review-Run).
- Primary buttons must not trigger bulk automation. "Run suggested playbook" is secondary and routes to the review queue.
- Every promote / discard / merge / delete records who, when, why. Show this in an audit trail.
- Show personal data of persons only after the user opens the entity. No suspect name or photo in global chrome.
- Stealth/OPSEC: show an indicator only when protection is OFF or degraded.
- Reports: include case ID, date, author, and evidence hashes. Numbers in the report must match the case data.

## 12. Mockup and demo rules

- A mockup shows ONE focused scenario per screen. Make separate screens instead of one all-in-one screen.
- Demo steppers, "Simulation", and "Mockup active" badges are NOT part of the product UI. Put them in a presenter overlay outside the app frame.
- Use clearly fictional sample data (fake names, reserved numbers such as +213 555 01xx, example.com domains).
- Sample data must stay consistent across all screens: case ID, counts, percentages, dates, tool count. Take them from `SPECIFICATION.md`.
- Never leave placeholder text like "lorem ipsum" or "TBD" in a deliverable.

## 13. Forbidden list

- Emojis as icons
- Inline styles
- Hard-coded colors outside tokens
- Hover-only menus or flyouts
- `div`/`span` as buttons
- Font size below 12px
- Permanent pulsing or looping animations
- More than one primary button per view
- Same action in more than one primary location
- Color as the only signal
- Lists of 20+ items shown without search or grouping
- Raw percentages without method
- Auto-promotion of unverified data

## 14. Definition of done (verify and report pass/fail)

- [ ] Vertical chrome <= 100px; canvas >= 60% width at 1366px
- [ ] Layout matches section 2; no toolbar overflow at 1366, 1440, 1920, and in RTL
- [ ] 0 inline styles; 0 hex or raw px outside `tokens.css`
- [ ] One icon set; 0 emojis
- [ ] Each color has exactly one meaning
- [ ] All text >= 12px; contrast AA verified
- [ ] Every control is a real element, keyboard operable, with visible focus
- [ ] 100% of visible strings in FR / AR / EN
- [ ] RTL verified visually
- [ ] No duplicated primary actions
- [ ] Fact vs hypothesis visually distinct; no AI score without method
- [ ] Numbers and IDs consistent with `SPECIFICATION.md`
- [ ] `prefers-reduced-motion` respected

## 15. Desktop Forensic Studio Shell & Phase Gating Ergonomics

1. **Parity with Master Mockup (`doc/maquette.html`)**:
   - The application workspace must reflect the full desktop forensic studio layout established in `doc/maquette.html`.
   - Native 32px desktop menubar (`.desktop-menubar`) with 8 categorized menus (`Dossier`, `Édition`, `Insérer`, `Outils OSINT`, `Réseaux Sociaux`, `Police Judiciaire`, `Affichage`, `Assistant IA`).
   - 44px sub-bar (`.app-subbar`) with case selector, OPSEC stealth indicator, and command palette (`Ctrl+K`) search bar.
   - Left accordion panel (240px) with 4 structured groups: Calques d'Enquête, Création & Liaisons (37 items), Filtres par Nature, Questions Métier, plus bottom audit footer.
   - Right panel: context-aware dual mode. When nothing is selected, displays Case Overview KPIs + Clues Inbox (Review-Run queue). When an entity is selected, displays the complete forensic Inspector with properties, cryptographic evidence hashes (SHA-256 with copy), and suggested tools.

2. **Phase Gating (Decision D10 & User Mandate)**:
   - All modules, tools, and menu items defined in the full specification and mockup must be present in the UI.
   - Any functionality not scheduled for the current phase (Phase 1) MUST be rendered as grayed-out / disabled:
     - Class `.is-future-phase` or attribute `aria-disabled="true"`.
     - Visual styling: muted text, grayscale filter (80%), reduced opacity (0.55).
     - A visible phase badge indicating its milestone (e.g., `Phase 2`, `Phase 3`, `Phase 5`).
     - Never use native HTML `disabled` that drops keyboard and click events. When activated by click or Enter, trigger an informative notice explaining the feature's scheduled phase.

---

## 16. Real Investigation Data & Compound Geo / Selector UX (Anti-Regression Rules)

1. **Zero Hardcoded Demo Metrics or Static Clues in Runtime Views**:
   - Never display hardcoded case KPI strings (`1 450 000 DZD`, `6 Victimes`, `Alger, Oran, Blida`, `100% SHA-256`, etc.) or `useState([...])` static clue lists inside `InspectorPanel`, overview dashboards, or `translations.ts`.
   - All case summary counters (**Préjudice Estimé**, **Victimes & Plaintes**, **Suspects**, **Wilayas Impliquées**, **Objets Analysés**, **À Investiguer**, **Éléments à Valider**) and the **Boîte d'Arbitrage des Indices** MUST derive strictly from the active investigation's store/API data, showing `0`, `—`, or an explicit empty state when no records exist.
2. **Valid Design Tokens Only (No Broken Padding or Corner Radii)**:
   - Never use undefined variables (`--space-2-5`, `--radius-xs`) anywhere in stylesheets or JSX. Every spacing, color, typography, and radius token MUST exist in `src/styles/tokens.css`.
3. **Responsive Compound Selectors (`Localisation Administrative : Wilaya → Daïra → Commune`)**:
   - Never place searchable cascading dropdowns inside rigid `1fr 1fr 1fr` sub-150px inline-styled columns or below `12px` font size (`fontSize: 10px/10.5px/11px`).
   - Always use reusable CSS classes (`.geo-cascade-grid`, `.geo-select-wrap`, `.geo-select-dropdown`, `.geo-select-option`) with:
     - `grid-template-columns: repeat(auto-fit, minmax(175px, 1fr))` so fields wrap cleanly on narrow panels or modals without clipping labels or placeholders;
     - Minimum `var(--text-xs)` (`12px`) font size, minimum `var(--target-size-min)` (`32px`) interactive hit targets, valid `var(--radius-sm)` / `var(--radius-md)` corners, and opaque hover/focus-visible dropdown rows (`min-width: 100%`).


---

## 17. Modal Focus Isolation & Event Containment

1. **Portal + `inert` Background Isolation**:
   - Every blocking modal (`aria-modal="true"`) MUST render through `ModalPortal` so it portals into `document.body` outside the graph canvas DOM tree, applies `inert` to `.studio-shell`, auto-focuses the dialog/primary button, traps `Tab`/`Shift+Tab`, and stops `wheel`, `mousedown`, and `contextmenu` propagation.
2. **Global Shortcut & Canvas Listener Guard**:
   - Global `window` keydown listeners and background canvas wheel/keyboard handlers MUST check `hasOpenModal()` and return early while any blocking modal is open.
3. **Enter Confirmation on Alert/Delete Modals**:
   - Confirmation dialogs (e.g., `DeleteNodesModal`) MUST confirm on `Enter` (when focus is not on an explicit Cancel/Close button) and dismiss on `Escape`.
