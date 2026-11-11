import json

# Read base generate_i18n.py
with open('doc/generate_i18n.py', 'r', encoding='utf-8') as f:
    orig_code = f.read()

# Extract translations and tools_catalog
namespace = {}
# Execute up to tools_catalog
exec(orig_code.split("js_content = f\"\"\"")[0], namespace)

translations = namespace['translations']
tools_catalog = namespace['tools_catalog']

# Import the new menu keys from update_i18n
import sys
sys.path.append('doc')
import update_i18n

# Merge menu keys into translations
translations['fr'].update(update_i18n.menu_keys_fr)
translations['ar'].update(update_i18n.menu_keys_ar)
translations['en'].update(update_i18n.menu_keys_en)

# Generate updated maquette-i18n.js
js_body = f"""/**
 * AegisInvestigate — Multilingual Engine & Forensic Workspace Controller
 * Conforms to SPECIFICATION.md, WCAG 2.2 AA, and Nielsen's Heuristics.
 * 62 Tools Inventory across 6 Operational Categories.
 */

const I18N_TRANSLATIONS = {json.dumps(translations, indent=2, ensure_ascii=False)};
const TOOLS_CATALOG = {json.dumps(tools_catalog, indent=2, ensure_ascii=False)};

// Application State
const appState = {{
  lang: 'fr',
  theme: 'dark',
  mode: 'analyze', // 'collect' | 'analyze' | 'report'
  canvasView: 'graph', // 'graph' | 'timeline' | 'map'
  activeScreen: 2, // 1 to 5
  stealth: true,
  selectedNodeId: 'node-suspect',
  leftPanelCollapsed: false,
  rightPanelCollapsed: false,
  activeLayerFilter: 'all',
  activeTypeFilter: 'all',
  openMenuId: null,
  propertiesModalOpen: false,
  insertModalOpen: false,
  llmModalOpen: false,
  importModalOpen: false,
  commandPaletteOpen: false,
  auditModalOpen: false
}};

// Lucide SVG Icons Library (Zero Emojis)
function getLucideSvg(name, size = 16, className = '') {{
  const s = size;
  const c = className ? `class="${{className}}"` : '';
  const icons = {{
    'shield': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    'search': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    'network': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/></svg>`,
    'calendar': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
    'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    'lock': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    'file-text': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`,
    'layers': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    'filter': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    'check': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="20 6 9 17 4 12"/></svg>`,
    'alert-triangle': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    'x': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>`,
    'user': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'phone': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    'globe': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    'terminal': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>`,
    'scale': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
    'play': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
    'eye': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'eye-off': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
    'sun': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`,
    'moon': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
    'history': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
    'sparkles': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>`,
    'database': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>`,
    'credit-card': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
    'plus': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>`,
    'chevron-down': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><polyline points="6 9 12 15 18 9"/></svg>`,
    'sliders': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="1" x2="7" y1="14" y2="14"/><line x1="9" x2="15" y1="8" y2="8"/><line x1="17" x2="23" y1="16" y2="16"/></svg>`,
    'cpu': `<svg xmlns="http://www.w3.org/2000/svg" width="${{s}}" height="${{s}}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${{c}}><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" x2="9" y1="1" y2="4"/><line x1="15" x2="15" y1="1" y2="4"/><line x1="9" x2="9" y1="20" y2="23"/><line x1="15" x2="15" y1="20" y2="23"/><line x1="20" x2="23" y1="9" y2="9"/><line x1="20" x2="23" y1="14" y2="14"/><line x1="1" x2="4" y1="9" y2="9"/><line x1="1" x2="4" y1="14" y2="14"/></svg>`
  }};
  return icons[name] || icons['shield'];
}}

// Helper for i18n lookup
function t(key) {{
  const dict = I18N_TRANSLATIONS[appState.lang] || I18N_TRANSLATIONS['fr'];
  return dict[key] || key;
}}

// Update all DOM elements with data-i18n
function applyI18n() {{
  const dict = I18N_TRANSLATIONS[appState.lang] || I18N_TRANSLATIONS['fr'];
  document.querySelectorAll('[data-i18n]').forEach(el => {{
    const k = el.getAttribute('data-i18n');
    if (dict[k]) {{
      if (el.tagName === 'INPUT' && el.type === 'text') {{
        el.placeholder = dict[k];
      }} else {{
        el.textContent = dict[k];
      }}
    }}
  }});

  // Update HTML dir and lang
  const root = document.documentElement;
  root.lang = appState.lang;
  if (appState.lang === 'ar') {{
    root.setAttribute('dir', 'rtl');
    document.body.classList.add('rtl');
  }} else {{
    root.setAttribute('dir', 'ltr');
    document.body.classList.remove('rtl');
  }}
}}

// Language Switcher
function setLanguage(lang) {{
  if (['fr', 'ar', 'en'].includes(lang)) {{
    appState.lang = lang;
    applyI18n();
    renderInspector();
    renderSuggestedTools();
  }}
}}

// Theme Switcher
function toggleTheme() {{
  appState.theme = appState.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', appState.theme);
  if (appState.theme === 'light') {{
    document.body.classList.add('theme-light');
  }} else {{
    document.body.classList.remove('theme-light');
  }}
}}

// Stealth Toggle
function toggleStealth() {{
  appState.stealth = !appState.stealth;
  const badge = document.getElementById('stealth-warning-badge');
  if (badge) {{
    badge.style.display = appState.stealth ? 'none' : 'inline-flex';
  }}
}}

// Top Desktop Menu Dropdown Toggle
function toggleMenu(menuId) {{
  if (appState.openMenuId === menuId) {{
    closeAllMenus();
  }} else {{
    closeAllMenus();
    const target = document.getElementById(menuId);
    if (target) {{
      target.classList.add('is-open');
      const trigger = document.getElementById(`btn-${{menuId}}`);
      if (trigger) trigger.classList.add('active');
      appState.openMenuId = menuId;
    }}
  }}
}}

function closeAllMenus() {{
  document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('is-open'));
  document.querySelectorAll('.menubar-btn').forEach(b => b.classList.remove('active'));
  appState.openMenuId = null;
}}

// Menu Action Dispatcher
function triggerMenuAction(action) {{
  closeAllMenus();
  if (action === 'new_case' || action === 'properties') {{
    openPropertiesModal();
  }} else if (action === 'insert_clue') {{
    openInsertModal();
  }} else if (action === 'llm_settings') {{
    openLLMSettingsModal();
  }} else if (action === 'import') {{
    openImportModal();
  }} else if (action === 'export_report') {{
    setScreen(5);
  }} else if (action === 'view_graph') {{
    setScreen(2); setCanvasView('graph');
  }} else if (action === 'view_timeline') {{
    setScreen(4); setCanvasView('timeline');
  }} else if (action === 'view_map') {{
    setScreen(4); setCanvasView('map');
  }} else if (action === 'toggle_layers') {{
    toggleLeftPanel();
  }} else if (action === 'fullscreen') {{
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {{}});
    else document.exitFullscreen().catch(() => {{}});
  }} else if (action.startsWith('tool_')) {{
    const toolName = action.replace('tool_', '').replace(/_/g, ' ');
    runSimulatedTool(toolName);
  }} else {{
    showToast(`Action exécutée : ${{action}}`);
  }}
}}

// Toggle Panels
function toggleLeftPanel() {{
  appState.leftPanelCollapsed = !appState.leftPanelCollapsed;
  const panel = document.getElementById('panel-left');
  if (panel) panel.classList.toggle('collapsed', appState.leftPanelCollapsed);
}}

// Modal Handlers
function openPropertiesModal() {{
  appState.propertiesModalOpen = true;
  const el = document.getElementById('properties-modal');
  if (el) el.style.display = 'flex';
}}
function closePropertiesModal() {{
  appState.propertiesModalOpen = false;
  const el = document.getElementById('properties-modal');
  if (el) el.style.display = 'none';
}}

function openInsertModal() {{
  appState.insertModalOpen = true;
  const el = document.getElementById('insert-modal');
  if (el) el.style.display = 'flex';
}}
function closeInsertModal() {{
  appState.insertModalOpen = false;
  const el = document.getElementById('insert-modal');
  if (el) el.style.display = 'none';
}}

function openLLMSettingsModal() {{
  appState.llmModalOpen = true;
  const el = document.getElementById('llm-settings-modal');
  if (el) el.style.display = 'flex';
}}
function closeLLMSettingsModal() {{
  appState.llmModalOpen = false;
  const el = document.getElementById('llm-settings-modal');
  if (el) el.style.display = 'none';
}}

function openImportModal() {{
  appState.importModalOpen = true;
  const el = document.getElementById('import-modal');
  if (el) el.style.display = 'flex';
}}
function closeImportModal() {{
  appState.importModalOpen = false;
  const el = document.getElementById('import-modal');
  if (el) el.style.display = 'none';
}}

// Switch focused Screen (1 to 5)
function setScreen(num) {{
  appState.activeScreen = num;
  document.querySelectorAll('.screen-pill-btn').forEach(btn => {{
    btn.classList.toggle('active', parseInt(btn.dataset.screen) === num);
  }});

  const screenViews = ['view-overview', 'view-graph-canvas', 'view-inbox-review', 'view-timeline-map', 'view-report-export'];
  screenViews.forEach((id, idx) => {{
    const el = document.getElementById(id);
    if (el) {{
      if (idx + 1 === num) {{
        el.classList.remove('is-hidden');
        if (id === 'view-graph-canvas') el.classList.add('is-flex-flush');
      }} else {{
        el.classList.add('is-hidden');
        el.classList.remove('is-flex-flush');
      }}
    }}
  }});

  if (num === 2) {{
    selectNode('node-suspect');
  }}
}}

// Global Mode Switcher (Collect | Analyze | Report)
function setAppMode(mode) {{
  appState.mode = mode;
  document.querySelectorAll('.mode-tab-btn').forEach(btn => {{
    btn.classList.toggle('active', btn.dataset.mode === mode);
  }});
  if (mode === 'report') setScreen(5);
  else if (mode === 'collect') setScreen(3);
  else setScreen(2);
}}

// Canvas View Switcher (Graph | Timeline | Map)
function setCanvasView(view) {{
  appState.canvasView = view;
  document.querySelectorAll('.canvas-segmented-btn').forEach(btn => {{
    btn.classList.toggle('active', btn.dataset.view === view);
  }});
  if (view === 'timeline' || view === 'map') {{
    setScreen(4);
  }} else {{
    setScreen(2);
  }}
}}

// Select Node on Canvas and drive Inspector & Suggested Tools
function selectNode(nodeId) {{
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.canvas-node-card').forEach(card => {{
    card.classList.toggle('selected', card.id === nodeId);
  }});
  renderInspector();
  renderSuggestedTools();
}}

// Render Inspector contents based on selected node
function renderInspector() {{
  const container = document.getElementById('inspector-content-pane');
  if (!container) return;

  if (!appState.selectedNodeId) {{
    container.innerHTML = `
      <div class="empty-inspector-state">
        ${{getLucideSvg('search', 32, 'muted-icon')}}
        <p class="empty-title">${{t('inspector_empty_title')}}</p>
        <p class="empty-desc">${{t('inspector_empty_desc')}}</p>
      </div>
    `;
    return;
  }}

  if (appState.selectedNodeId === 'node-suspect') {{
    container.innerHTML = `
      <div class="inspector-card candidate-hypothesis-card">
        <div class="candidate-header">
          <span class="hypothesis-badge">${{getLucideSvg('sparkles', 14)}} ${{t('candidate_subject_title')}}</span>
          <span class="chip chip-warning">Hypothèse IA • Non vérifié</span>
        </div>
        <div class="judicial-disclaimer-box">
          ${{getLucideSvg('alert-triangle', 16, 'text-warning')}}
          <p>${{t('candidate_presumption_notice')}}</p>
        </div>
        <div class="metric-score-breakdown">
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_biometrics_label')}}</span>
            <span class="metric-value font-mono">89%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_voice_label')}}</span>
            <span class="metric-value font-mono">94%</span>
          </div>
          <div class="metric-row">
            <span class="metric-name">${{t('candidate_centrality_label')}}</span>
            <span class="metric-value font-mono">0.89</span>
          </div>
        </div>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_identifier')}}</span><span class="meta-val font-mono">Amine B. (31 ans, Oran)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-purple">Calque 4 (Hypothèse)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">3b4f...a891</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_source')}}</span><span class="meta-val">Entity Resolution Engine</span></div>
        </div>
        <div class="candidate-actions">
          <button class="btn btn-secondary" onclick="openAuditModal('promote')">${{getLucideSvg('check', 14)}} ${{t('btn_promote_verified')}}</button>
          <button class="btn btn-ghost text-danger" onclick="openAuditModal('discard')">${{getLucideSvg('x', 14)}} ${{t('btn_discard_hypothesis')}}</button>
        </div>
      </div>
    `;
  }} else if (appState.selectedNodeId === 'node-phone') {{
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-cyan">${{getLucideSvg('phone', 14)}} Téléphone E.164</span>
          <span class="font-mono text-muted">Node #03</span>
        </div>
        <h4 class="inspector-entity-title font-mono">+213 555 019 283</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_entity_type')}}</span><span class="meta-val">Ligne Mobile (Ooredoo Algérie)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-cyan">Calque 2 (OSINT Brut)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">7f1a...c209</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_timestamp')}}</span><span class="meta-val">10 Nov 2026 • 10:18 UTC</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_confidence')}}</span><span class="meta-val chip chip-success">98% (Vérifié)</span></div>
        </div>
      </div>
    `;
  }} else {{
    container.innerHTML = `
      <div class="inspector-card">
        <div class="inspector-header">
          <span class="chip chip-emerald">${{getLucideSvg('lock', 14)}} Annonce Marché</span>
          <span class="font-mono text-muted">Node #01</span>
        </div>
        <h4 class="inspector-entity-title">Annonce FB Marketplace #98124</h4>
        <div class="metadata-table">
          <div class="meta-row"><span class="meta-key">${{t('prop_layer')}}</span><span class="meta-val chip chip-emerald">Calque 1 (Preuve Scellée)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_hash')}}</span><span class="meta-val font-mono">e3b0...b855 (RFC 3161)</span></div>
          <div class="meta-row"><span class="meta-key">${{t('prop_timestamp')}}</span><span class="meta-val">10 Nov 2026 • 10:15 UTC</span></div>
        </div>
      </div>
    `;
  }}
}}

// Render Suggested Tools based on selected node
function renderSuggestedTools() {{
  const container = document.getElementById('suggested-tools-container');
  if (!container) return;

  let compatibleTools = [];
  if (appState.selectedNodeId === 'node-phone') {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('PhoneNumber')).slice(0, 4);
  }} else if (appState.selectedNodeId === 'node-suspect') {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('CandidateSubject')).slice(0, 4);
  }} else {{
    compatibleTools = TOOLS_CATALOG.filter(t => t.inputs.includes('SocialPost') || t.inputs.includes('URL')).slice(0, 4);
  }}

  container.innerHTML = compatibleTools.map(tool => `
    <div class="suggested-tool-item">
      <div class="tool-item-info">
        <div class="tool-title-row">
          <span class="tool-name">${{tool.name}}</span>
          <span class="chip chip-neutral">${{tool.req === 'offline' ? 'Docker Local' : (tool.req === 'free_key' ? 'Clé API' : 'Session Infiltrée')}}</span>
        </div>
        <p class="tool-desc">${{tool.desc}}</p>
      </div>
      <button class="btn btn-secondary btn-sm" onclick="runSimulatedTool('${{tool.name}}')">
        ${{getLucideSvg('play', 12)}} ${{t('btn_run_brick')}}
      </button>
    </div>
  `).join('');
}}

// Run simulated tool and dispatch to arbitration inbox
function runSimulatedTool(toolName) {{
  showToast(`${{t('toast_tool_success')}} (${{toolName}})`);
  const badge = document.getElementById('inbox-pending-counter');
  if (badge) badge.textContent = '4';
}}

// Toast helper
function showToast(msg) {{
  const toast = document.getElementById('app-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), 3200);
}}

// Audit modal (Promote / Discard)
function openAuditModal(action) {{
  appState.auditModalOpen = true;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'flex';
}}

function closeAuditModal() {{
  appState.auditModalOpen = false;
  const modal = document.getElementById('audit-modal');
  if (modal) modal.style.display = 'none';
}}

function confirmAuditAction() {{
  closeAuditModal();
  showToast(t('toast_clue_added'));
  setScreen(5);
}}

// Command Palette
function openCommandPalette() {{
  appState.commandPaletteOpen = true;
  const modal = document.getElementById('command-palette-modal');
  if (modal) {{
    modal.style.display = 'flex';
    const input = document.getElementById('cmd-input');
    if (input) {{
      input.value = '';
      input.focus();
      filterCommandPalette('');
    }}
  }}
}}

function closeCommandPalette() {{
  appState.commandPaletteOpen = false;
  const modal = document.getElementById('command-palette-modal');
  if (modal) modal.style.display = 'none';
}}

function filterCommandPalette(query) {{
  const container = document.getElementById('cmd-results-list');
  if (!container) return;
  const q = query.toLowerCase().trim();
  const filtered = TOOLS_CATALOG.filter(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.cat.includes(q));

  container.innerHTML = filtered.slice(0, 8).map(tool => `
    <div class="cmd-result-item" onclick="selectCommandTool('${{tool.name}}')">
      <div class="cmd-icon-box">${{getLucideSvg('terminal', 16)}}</div>
      <div class="cmd-text-box">
        <div class="cmd-name">${{tool.name}}</div>
        <div class="cmd-desc">${{tool.desc}}</div>
      </div>
      <span class="chip chip-neutral font-mono text-xs">${{tool.req}}</span>
    </div>
  `).join('');
}}

function selectCommandTool(toolName) {{
  closeCommandPalette();
  runSimulatedTool(toolName);
}}

// Close menus when clicking outside
document.addEventListener('click', (e) => {{
  if (!e.target.closest('.menubar-item')) {{
    closeAllMenus();
  }}
}});

// Keyboard Shortcuts Listener
document.addEventListener('keydown', (e) => {{
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {{
    e.preventDefault();
    openCommandPalette();
  }} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {{
    e.preventDefault();
    openPropertiesModal();
  }} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {{
    e.preventDefault();
    showToast(t('m_save') + ' : ' + t('case_id'));
  }} else if (e.key === 'Escape') {{
    closeAllMenus();
    closeCommandPalette();
    closeAuditModal();
    closePropertiesModal();
    closeInsertModal();
    closeLLMSettingsModal();
    closeImportModal();
  }}
}});

// Initialize app on DOM ready
document.addEventListener('DOMContentLoaded', () => {{
  applyI18n();
  setScreen(2);
}});
"""

with open('doc/assets/maquette-i18n.js', 'w', encoding='utf-8') as f:
    f.write(js_body)

print("Updated maquette-i18n.js written successfully, length:", len(js_body))
