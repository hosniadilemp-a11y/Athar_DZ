# scripts/arch_common.py
"""
Common HTML layout components for Chapter 02: Six-Layer Visual Architecture
"""

def get_html_head():
    return '''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>02. Architecture Système en 6 Couches &amp; Infrastructure d'Ingénierie — Athar DZ / AegisInvestigate</title>
  <link rel="stylesheet" href="assets/style.css" />
  <style>
    .arch-subnav-tabs {
      display: flex;
      gap: 0.4rem;
      border-bottom: 2px solid #1e293b;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .arch-subnav-btn {
      background: #0f172a;
      border: 1px solid #23344d;
      color: #94a3b8;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 0.6rem 1.1rem;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.45rem;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .arch-subnav-btn:hover {
      background: #172540;
      color: #f1f5f9;
      border-color: #38bdf8;
    }
    .arch-subnav-btn.active {
      background: #141f36;
      color: #38bdf8;
      border-color: #38bdf8 #38bdf8 #141f36;
      border-bottom: 2px solid #38bdf8;
      margin-bottom: -2px;
    }
    .arch-tab-panel {
      display: none;
    }
    .arch-tab-panel.active {
      display: block;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tech-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      margin: 1rem 0;
      background: #0d1524;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .tech-table th {
      background: #111d33;
      color: #e2e8f0;
      padding: 0.65rem 0.85rem;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid #23344d;
    }
    .tech-table td {
      padding: 0.65rem 0.85rem;
      border-bottom: 1px solid #172540;
      color: #cbd5e1;
      vertical-align: top;
      line-height: 1.45;
    }
    .tech-table tr:hover {
      background: rgba(56, 189, 248, 0.04);
    }
    .badge-ver {
      background: #1e293b;
      color: #38bdf8;
      border: 1px solid #0284c7;
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      padding: 1px 5px;
      border-radius: 4px;
      white-space: nowrap;
    }
    .pros-list { color: #86efac; list-style: none; padding-left: 0; margin: 0; }
    .pros-list li::before { content: "✔ "; color: #10b981; }
    .cons-list { color: #fca5a5; list-style: none; padding-left: 0; margin: 0; }
    .cons-list li::before { content: "⚠ "; color: #ef4444; }

    .svg-node {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .svg-node:hover rect {
      filter: brightness(1.25);
    }
    .svg-node.active rect {
      stroke-width: 2.5px !important;
      filter: drop-shadow(0 0 10px currentColor);
    }
    .fix-banner {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(14, 165, 233, 0.1));
      border: 1px solid #10b981;
      border-left: 5px solid #10b981;
      border-radius: 8px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
    }
    .fix-banner h3 {
      color: #10b981;
      margin: 0 0 0.4rem 0;
      font-size: 0.98rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .fix-banner p {
      color: #cbd5e1;
      font-size: 0.82rem;
      margin: 0;
      line-height: 1.5;
    }
  </style>
</head>
<body>
'''

def get_sidebar():
    return '''  <!-- Sidebar Navigation -->
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">Æ</div>
      <div class="brand-text">
        <h1>AegisInvestigate</h1>
        <span>Visual Investigation Studio</span>
      </div>
    </div>

    <div class="nav-section">Specification Portal</div>
    <ul class="nav-links">
      <li><a href="index.html"><span>🏠 01. Framework Summary &amp; Objective</span><span class="nav-badge">Overview</span></a></li>
      <li><a href="architecture.html" class="active"><span>🏗️ 02. Six-Layer Visual Architecture</span><span class="nav-badge">6 Layers</span></a></li>
      <li><a href="interfaces-roles.html"><span>👥 03. Interfaces &amp; Roles</span><span class="nav-badge">4 Views</span></a></li>
      <li><a href="data-model.html"><span>🕸️ 04. Data Model &amp; Metadata Graph</span><span class="nav-badge">Ontology</span></a></li>
      <li><a href="osint-arsenal.html"><span>🧰 05. OSINT Investigation Arsenal</span><span class="nav-badge">76 Tools</span></a></li>
      <li><a href="forensics-sna.html"><span>🚔 06. Forensics (DFIR) &amp; SNA Functions</span><span class="nav-badge">SOTA Funcs</span></a></li>
      <li><a href="roadmap-phases.html"><span>🚀 07. Incremental Development Phases</span><span class="nav-badge">6 Releases</span></a></li>
      <li><a href="maquette.html" class="maquette-cta"><span>🖥️ 08. Interactive Application Mock</span><span class="nav-badge">Live Studio</span></a></li>
    </ul>

    <div class="nav-section">Markdown Reference</div>
    <ul class="nav-links">
      <li><a href="SPECIFICATION.md"><span>📄 Full Technical Spec (.md)</span></a></li>
      <li><a href="GITHUB_AUDIT.md"><span>📄 GitHub Starter Audit (.md)</span></a></li>
    </ul>

    <div class="sidebar-footer">
      <div><strong>Conception:</strong> Enquêteurs Judiciaires (Zéro Jargon CS)</div>
      <div><strong>Chaîne de Preuve:</strong> Scellés WORM RFC 3161 / ISO 27037</div>
      <div><strong>Intelligence:</strong> GDS In-Memory + IA Locale Souveraine</div>
    </div>
  </aside>
'''

def get_page_header_and_tabs():
    return '''  <!-- Main Content -->
  <main class="main-content">
    <header class="page-header">
      <div class="page-eyebrow">Chapitre 02 &bull; Architecture Système &amp; Infrastructure d'Ingénierie Logicielle</div>
      <h1>Architecture Visuelle en Six Couches, Stockage Polyglotte &amp; Flux Inter-Services</h1>
      <p>
        Schéma d'ingénierie logicielle interactif et modulaire détaillant les <strong>Six Couches Opérationnelles</strong> de la plateforme : de l'infiltration mobile discrète via Phone Farm Android et l'ingestion polyglotte, au travers du stockage persistant spécialisé à 6 moteurs, des algorithmes Graph Data Science (GDS) et de l'IA locale souveraine, jusqu'au moteur de rendu accéléré matériel <strong>Neo4j NVL WebGL Dual-Canvas</strong>.
      </p>
    </header>

    <!-- Top Navigation Tabs for Architecture -->
    <div class="arch-subnav-tabs">
      <button class="arch-subnav-btn active" data-tab="global" onclick="switchArchTab('global')">
        <span>🌐</span> 1. Vue Globale (Six-Plane Flow)
      </button>
      <button class="arch-subnav-btn" data-tab="layer1" onclick="switchArchTab('layer1')">
        <span>📱</span> 2. Layer 1: Phone Farm &amp; Acquisition
      </button>
      <button class="arch-subnav-btn" data-tab="layer2" onclick="switchArchTab('layer2')">
        <span>⚙️</span> 3. Layer 2: Ingestion &amp; Pipeline
      </button>
      <button class="arch-subnav-btn" data-tab="layer3" onclick="switchArchTab('layer3')">
        <span>🗄️</span> 4. Layer 3: Stockage Polyglotte (6 Engines)
      </button>
      <button class="arch-subnav-btn" data-tab="layer4" onclick="switchArchTab('layer4')">
        <span>🕸️</span> 5. Layer 4: Analytics GDS &amp; SNA
      </button>
      <button class="arch-subnav-btn" data-tab="layer5" onclick="switchArchTab('layer5')">
        <span>🤖</span> 6. Layer 5: IA Souveraine &amp; Biométrie
      </button>
      <button class="arch-subnav-btn" data-tab="layer6" onclick="switchArchTab('layer6')">
        <span>🖥️</span> 7. Layer 6: Présentation NVL WebGL
      </button>
    </div>
'''

def get_html_footer():
    return '''  </main>

  <script src="assets/app.js"></script>
  <script src="assets/architecture-interactive.js"></script>
  <script>
    function switchArchTab(tabId) {
      document.querySelectorAll('.arch-subnav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });
      document.querySelectorAll('.arch-tab-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === 'panel-arch-' + tabId);
      });
    }
  </script>
</body>
</html>
'''
