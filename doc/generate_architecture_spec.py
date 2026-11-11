#!/usr/bin/env python3
"""
Generates the comprehensive, tabbed, highly detailed Chapter 02: Visual System Architecture
incorporating all verified codebase features from PIC-main and frontend-master.
"""

import sys
import os

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>02. Six-Layer Visual Architecture & Infrastructure — Athar DZ / AegisInvestigate</title>
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
  </style>
</head>
<body>

  <!-- Sidebar Navigation -->
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
      <div><strong>Designed For:</strong> Investigators (Zero CS Jargon)</div>
      <div><strong>Proof Standard:</strong> Automatic Legal Snapshots</div>
      <div><strong>Intelligence:</strong> Standard Rules + Optional AI</div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-content">
    <header class="page-header">
      <div class="page-eyebrow">Chapter 02 &bull; Visual System Architecture &amp; Infrastructure</div>
      <h1>Six-Layer Visual Architecture, Storage &amp; Service Communication</h1>
      <p>
        An interactive, modular software engineering blueprint detailing the platform's <strong>Six Operational Layers</strong>: from covert Android phone farm infiltration and polyglot ingestion, through specialized multi-engine storage, Graph Data Science analytics, and sovereign local AI, to the high-performance <strong>Neo4j NVL WebGL Dual-Canvas</strong> presentation tier.
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

    <!-- ====================================================================
         TAB 1: VUE GLOBALE INTERACTIVE (SIX-PLANE FLOW)
         ==================================================================== -->
    <div id="panel-arch-global" class="arch-tab-panel active">
      <section>
        <h2 class="section-title">1. Vue Globale : Architecture des 6 Couches Logicielles</h2>
        <p class="section-subtitle">
          Explorez les interconnexions synchrones et asynchrones entre les couches. Filtrez les flux d'investigation en temps réel pour inspecter les protocoles, les files d'attente et la résilience du système.
        </p>

        <!-- Interactive Software Engineering Architecture Explorer -->
        <div class="arch-interactive-canvas">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;">
            <div>
              <h3 style="color:#f8fafc;margin:0 0 0.35rem;font-size:1.1rem;">Schéma Interactif d'Ingénierie Logicielle (Six-Plane Architecture)</h3>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">
                Interconnexions directes entre le Studio Enquêteur (NVL WebGL), l'Ingress sécurisé, l'Orchestrateur, les Briques OSINT, la Phone Farm et le Tier de Stockage Polyglotte.
              </p>
            </div>
            <span class="badge badge-emerald">Mode Interactif Live</span>
          </div>

          <!-- Flow Filter Toolbar -->
          <div class="arch-flow-toolbar">
            <div class="arch-flow-filters">
              <button class="flow-btn active" data-flow="all" onclick="filterArchFlow('all')">
                <span>🌐</span> Tous les Flux
              </button>
              <button class="flow-btn" data-flow="whatsapp_voice" onclick="filterArchFlow('whatsapp_voice')">
                <span>📱</span> Infiltration WhatsApp &amp; Voix Darija
              </button>
              <button class="flow-btn" data-flow="web_scam" onclick="filterArchFlow('web_scam')">
                <span>🕸️</span> Capture Web WORM &amp; Scraping BSON
              </button>
              <button class="flow-btn" data-flow="telecom_cdr" onclick="filterArchFlow('telecom_cdr')">
                <span>📶</span> Bornage Télécom &amp; CDR TimescaleDB
              </button>
              <button class="flow-btn" data-flow="court_export" onclick="filterArchFlow('court_export')">
                <span>⚖️</span> Scellement Légal RFC 3161 &amp; PDF/A
              </button>
            </div>
            <button id="flow-anim-toggle" class="flow-btn" style="border-color:#38bdf8;color:#38bdf8;" onclick="toggleFlowAnimation()">
              ⏸️ Mettre en Pause les Flux
            </button>
          </div>

          <!-- Dynamic Flow Explanatory Banner -->
          <div id="arch-flow-banner" style="background:#0b111c;border:1px dashed #24354f;border-radius:6px;padding:0.75rem 1rem;margin-bottom:1rem;">
            <!-- Populated dynamically by architecture-interactive.js -->
          </div>

          <!-- Global Interactive SVG Architecture Schema -->
          <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.25rem;overflow-x:auto;">
            <svg viewBox="0 0 1000 780" xmlns="http://www.w3.org/2000/svg" class="arch-svg-canvas" style="min-width:900px;font-family:system-ui,-apple-system,sans-serif;">
              <defs>
                <marker id="arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
                </marker>
                <marker id="arr-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
                </marker>
                <marker id="arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7"/>
                </marker>
                <marker id="arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <marker id="arr-orange" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f97316"/>
                </marker>
                <marker id="arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
                </marker>
              </defs>

              <!-- PLANE 1: Presentation & Dual-Canvas NVL WebGL -->
              <g class="flow-group" data-group="ui">
                <rect x="30" y="20" width="940" height="90" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <text x="50" y="48" fill="#38bdf8" font-size="13" font-weight="bold">LAYER 6 : TIER PRÉSENTATION &amp; STUDIO D'ENQUÊTE DUAL-CANVAS</text>
                <text x="50" y="68" fill="#94a3b8" font-size="10">Neo4j NVL WebGL Engine (@neo4j-nvl/react) • Minimap Synchronisée • Layout-Workers WebWorkers • Chatbot Ollama DavidLanz</text>
                <rect x="50" y="80" width="160" height="22" rx="4" fill="#1e293b"/>
                <text x="60" y="95" fill="#e2e8f0" font-size="9" font-weight="600">🖥️ NVL Graph Canvas</text>
                <rect x="220" y="80" width="150" height="22" rx="4" fill="#1e293b"/>
                <text x="230" y="95" fill="#e2e8f0" font-size="9" font-weight="600">🗺️ Dual-Canvas Minimap</text>
                <rect x="380" y="80" width="150" height="22" rx="4" fill="#1e293b"/>
                <text x="390" y="95" fill="#e2e8f0" font-size="9" font-weight="600">💬 Text-to-Cypher Copilot</text>
                <rect x="540" y="80" width="160" height="22" rx="4" fill="#1e293b"/>
                <text x="550" y="95" fill="#e2e8f0" font-size="9" font-weight="600">⏳ Sliced Timeline Slider</text>
                <rect x="710" y="80" width="160" height="22" rx="4" fill="#1e293b"/>
                <text x="720" y="95" fill="#e2e8f0" font-size="9" font-weight="600">⚖️ Export PV Conforme CPP</text>
              </g>

              <!-- DOWNWARD CONNECTOR: UI -> Ingress Gateway -->
              <path class="flow-edge flow-main" d="M 500 110 L 500 150" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)" stroke-dasharray="4"/>
              <text x="510" y="135" fill="#38bdf8" font-size="9" font-family="monospace">HTTPS / WSS (WebSocket)</text>

              <!-- PLANE 2: Ingress & Orchestration Tier -->
              <g class="flow-group" data-group="ingress">
                <rect x="30" y="150" width="940" height="85" rx="8" fill="#0c1929" stroke="#0ea5e9" stroke-width="1.5"/>
                <text x="50" y="175" fill="#0ea5e9" font-size="12" font-weight="bold">LAYER 2 : API GATEWAY &amp; ORCHESTRATEUR DE WORKFLOWS</text>
                <text x="50" y="193" fill="#94a3b8" font-size="10">FastAPI Gateway • JWT Auth &amp; RBAC • Celery Workers • Broker Redis 7 / RabbitMQ • Normalisation Pydantic v2</text>
                <rect x="50" y="202" width="170" height="24" rx="4" fill="#132338"/>
                <text x="60" y="218" fill="#38bdf8" font-size="9">🚪 FastAPI Ingress Gateway</text>
                <rect x="230" y="202" width="170" height="24" rx="4" fill="#132338"/>
                <text x="240" y="218" fill="#38bdf8" font-size="9">⚡ Celery Asynchronous Queue</text>
                <rect x="410" y="202" width="190" height="24" rx="4" fill="#132338"/>
                <text x="420" y="218" fill="#38bdf8" font-size="9">🔄 Event Bus (Redis 7 Streams)</text>
                <rect x="610" y="202" width="170" height="24" rx="4" fill="#132338"/>
                <text x="620" y="218" fill="#38bdf8" font-size="9">🛡️ Token Bucket Anti-Ban</text>
              </g>

              <!-- DOWNWARD CONNECTOR: Orchestrator -> OSINT & Phone Farm -->
              <path class="flow-edge flow-main" d="M 280 235 L 280 275" stroke="#f97316" stroke-width="2" marker-end="url(#arr-orange)"/>
              <path class="flow-edge flow-main" d="M 720 235 L 720 275" stroke="#10b981" stroke-width="2" marker-end="url(#arr-emerald)"/>

              <!-- PLANE 3: Investigation Arsenal & Phone Farm -->
              <g class="flow-group" data-group="tools">
                <rect x="30" y="275" width="460" height="110" rx="8" fill="#1a140d" stroke="#f97316" stroke-width="1.5"/>
                <text x="50" y="298" fill="#f97316" font-size="12" font-weight="bold">LAYER 1 : ACQUISITION FORENSIQUE &amp; PHONE FARM</text>
                <text x="50" y="315" fill="#fdba74" font-size="9.5">Phone Farm Android 13 • Modem GSM SIM 4G DZ • Scrcpy WebRTC • Infiltration WhatsApp</text>
                <rect x="50" y="325" width="190" height="22" rx="4" fill="#2c1f14"/>
                <text x="60" y="340" fill="#fed7aa" font-size="8.5">📲 Modem SIM DZ (Mobilis/Djezzy/Oor)</text>
                <rect x="250" y="325" width="180" height="22" rx="4" fill="#2c1f14"/>
                <text x="260" y="340" fill="#fed7aa" font-size="8.5">🤖 ReDroid Containers &amp; Appium</text>
                <rect x="50" y="353" width="190" height="22" rx="4" fill="#2c1f14"/>
                <text x="60" y="368" fill="#fed7aa" font-size="8.5">🎮 Scrcpy 60 FPS WebRTC Stream</text>
                <rect x="250" y="353" width="180" height="22" rx="4" fill="#2c1f14"/>
                <text x="260" y="368" fill="#fed7aa" font-size="8.5">🛡️ Zygisk Anti-Root Cloaking</text>

                <rect x="510" y="275" width="460" height="110" rx="8" fill="#0d1f18" stroke="#10b981" stroke-width="1.5"/>
                <text x="530" y="298" fill="#10b981" font-size="12" font-weight="bold">ARSENAL OSINT &amp; BRIQUES SPÉCIALISÉES (76 OUTILS)</text>
                <text x="530" y="315" fill="#86efac" font-size="9.5">Web Scrapers • SOCMINT • Fuites Git &amp; Dépôts • Réseau Discord/Telegram • Forensic DFIR</text>
                <rect x="530" y="325" width="200" height="22" rx="4" fill="#143026"/>
                <text x="540" y="340" fill="#bbf7d0" font-size="8.5">🕸️ Playwright Scrapers (FB/TikTok/Insta)</text>
                <rect x="740" y="325" width="200" height="22" rx="4" fill="#143026"/>
                <text x="750" y="340" fill="#bbf7d0" font-size="8.5">📱 PhoneInfoga &amp; Truecaller Reverse</text>
                <rect x="530" y="353" width="200" height="22" rx="4" fill="#143026"/>
                <text x="540" y="368" fill="#bbf7d0" font-size="8.5">🔍 Jadx-GUI / Ghidra Decompiler APK</text>
                <rect x="740" y="353" width="200" height="22" rx="4" fill="#143026"/>
                <text x="750" y="368" fill="#bbf7d0" font-size="8.5">📸 ArchiveBox WARC Snapshot (ISO 28500)</text>
              </g>

              <!-- DOWNWARD CONNECTOR: Acquisition -> AI & Analytics -->
              <path class="flow-edge flow-main" d="M 280 385 L 280 425" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)"/>
              <path class="flow-edge flow-main" d="M 720 385 L 720 425" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)"/>

              <!-- PLANE 4: Analytics GDS & Sovereign AI -->
              <g class="flow-group" data-group="ai">
                <rect x="30" y="425" width="460" height="110" rx="8" fill="#1c1228" stroke="#a855f7" stroke-width="1.5"/>
                <text x="50" y="448" fill="#a855f7" font-size="12" font-weight="bold">LAYER 4 : MOTEUR ANALYTICS &amp; GDS GRAPH SCIENCE</text>
                <text x="50" y="465" fill="#d8b4fe" font-size="9.5">Neo4j GDS 2.6 • Betweenness Centrality • Louvain Modularity • Link Prediction • Rôles Criminels</text>
                <rect x="50" y="475" width="200" height="22" rx="4" fill="#2d1c42"/>
                <text x="60" y="490" fill="#e9d5ff" font-size="8.5">🌉 Betweenness Centrality (Mules)</text>
                <rect x="260" y="475" width="180" height="22" rx="4" fill="#2d1c42"/>
                <text x="270" y="490" fill="#e9d5ff" font-size="8.5">👥 Louvain / Label Propagation</text>
                <rect x="50" y="503" width="200" height="22" rx="4" fill="#2d1c42"/>
                <text x="60" y="518" fill="#e9d5ff" font-size="8.5">🔗 Link Prediction (Co-offending)</text>
                <rect x="260" y="503" width="180" height="22" rx="4" fill="#2d1c42"/>
                <text x="270" y="518" fill="#e9d5ff" font-size="8.5">🏷️ Rôles: Opérationnel, Soutien, Leader</text>

                <rect x="510" y="425" width="460" height="110" rx="8" fill="#131e33" stroke="#38bdf8" stroke-width="1.5"/>
                <text x="530" y="448" fill="#38bdf8" font-size="12" font-weight="bold">LAYER 5 : IA SOUVERAINE &amp; BIOMÉTRIE MULTIMODALE</text>
                <text x="530" y="465" fill="#7dd3fc" font-size="9.5">Ollama LLM Text-to-Cypher • Faster-Whisper Darija DZ • PyAnnote 3.1 • ArcFace DeepFace 512-d</text>
                <rect x="530" y="475" width="200" height="22" rx="4" fill="#1b2f4f"/>
                <text x="540" y="490" fill="#bae6fd" font-size="8.5">🎙️ Faster-Whisper (Darija Algérienne)</text>
                <rect x="740" y="475" width="200" height="22" rx="4" fill="#1b2f4f"/>
                <text x="750" y="490" fill="#bae6fd" font-size="8.5">👥 PyAnnote 3.1 (Diarisation Locuteurs)</text>
                <rect x="530" y="503" width="200" height="22" rx="4" fill="#1b2f4f"/>
                <text x="540" y="518" fill="#bae6fd" font-size="8.5">👤 ArcFace 512-d (Biométrie Faciale)</text>
                <rect x="740" y="503" width="200" height="22" rx="4" fill="#1b2f4f"/>
                <text x="750" y="518" fill="#bae6fd" font-size="8.5">🤖 Ollama (DavidLanz/text2cypher)</text>
              </g>

              <!-- DOWNWARD CONNECTOR: Processing -> Storage Tier -->
              <path class="flow-edge flow-main" d="M 500 535 L 500 575" stroke="#f43f5e" stroke-width="2" marker-end="url(#arr-rose)"/>
              <text x="510" y="560" fill="#f43f5e" font-size="9" font-family="monospace">Persistance Polyglotte Atomique</text>

              <!-- PLANE 5: Polyglot Storage Tier -->
              <g class="flow-group" data-group="storage">
                <rect x="30" y="575" width="940" height="175" rx="8" fill="#17111c" stroke="#f43f5e" stroke-width="2"/>
                <text x="50" y="600" fill="#f43f5e" font-size="13" font-weight="bold">LAYER 3 : TIER DE STOCKAGE POLYGLOTTE SPÉCIALISÉ (6 MOTEURS COMPLÉMENTAIRES)</text>
                <text x="50" y="618" fill="#fda4af" font-size="10">Chaque type de données est affecté à son moteur mathématique optimal, garantissant performance sub-milliseconde et conformité légale CPP.</text>

                <g transform="translate(50, 630)">
                  <rect x="0" y="0" width="138" height="95" rx="6" fill="#261725" stroke="#38bdf8"/>
                  <text x="10" y="22" fill="#38bdf8" font-size="11" font-weight="bold">🕸️ Neo4j 5.20+</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">Graphe &amp; Relations</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• Index-free adjacency</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Recommandations GDS</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• Protocole Bolt &lt;5ms</text>
                </g>

                <g transform="translate(200, 630)">
                  <rect x="0" y="0" width="138" height="95" rx="6" fill="#261725" stroke="#10b981"/>
                  <text x="10" y="22" fill="#10b981" font-size="11" font-weight="bold">📋 PostgreSQL 16</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">+ TimescaleDB CDRs</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• ACID &amp; RLS Wilayas</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Audit Merkle SHA-256</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• Hyper-tables télécom</text>
                </g>

                <g transform="translate(350, 630)">
                  <rect x="0" y="0" width="138" height="95" rx="6" fill="#261725" stroke="#06b6d4"/>
                  <text x="10" y="22" fill="#06b6d4" font-size="11" font-weight="bold">🍃 MongoDB 7.0</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">Dépôt Brut OSINT</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• BSON polymorphe</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Snappy compress 70%</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• Zero migration</text>
                </g>

                <g transform="translate(500, 630)">
                  <rect x="0" y="0" width="138" height="95" rx="6" fill="#261725" stroke="#f59e0b"/>
                  <text x="10" y="22" fill="#f59e0b" font-size="11" font-weight="bold">🔒 MinIO WORM S3</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">Coffre-fort Scellés</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• S3 Object Lock</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Horodatage RFC 3161</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• WARC ISO 28500</text>
                </g>

                <g transform="translate(650, 630)">
                  <rect x="0" y="0" width="138" height="95" rx="6" fill="#261725" stroke="#a855f7"/>
                  <text x="10" y="22" fill="#a855f7" font-size="11" font-weight="bold">🎯 Qdrant 1.9</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">Moteur Vectoriel</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• Moteur Rust HNSW</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Vecteurs visage/voix</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• Filtrage payload &lt;8ms</text>
                </g>

                <g transform="translate(800, 630)">
                  <rect x="0" y="0" width="145" height="95" rx="6" fill="#261725" stroke="#ec4899"/>
                  <text x="10" y="22" fill="#ec4899" font-size="11" font-weight="bold">⚡ Redis 7 Stack</text>
                  <text x="10" y="38" fill="#94a3b8" font-size="8.5">Bus Temps-Réel</text>
                  <text x="10" y="55" fill="#cbd5e1" font-size="7.5">• Pub/Sub WebSocket</text>
                  <text x="10" y="68" fill="#cbd5e1" font-size="7.5">• Anti-ban Token Bucket</text>
                  <text x="10" y="81" fill="#cbd5e1" font-size="7.5">• Broker Celery RESP3</text>
                </g>
              </g>
            </svg>
          </div>
        </div>
      </section>
    </div>

    <!-- ====================================================================
         TAB 2: LAYER 1 - ACQUISITION FORENSIQUE & PHONE FARM
         ==================================================================== -->
    <div id="panel-arch-layer1" class="arch-tab-panel">
      <section>
        <h2 class="section-title">2. Layer 1 : Acquisition Forensique &amp; Phone Farm Android</h2>
        <p class="section-subtitle">
          Infiltration des écosystèmes fermés 100% mobiles (WhatsApp, Telegram, BaridiMob, TikTok) et gestion physique des cartes SIM algériennes sans déclencher de bannissement de sécurité.
        </p>

        <div class="card" style="border-left:4px solid #f97316;margin-bottom:1.5rem;">
          <h3 style="color:#f97316;margin-bottom:0.5rem;">🎯 Mission Opérationnelle du Layer 1</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Les réseaux criminels modernes (notamment en Algérie) évitent le web statique pour communiquer exclusivement via des messageries chiffrées de bout en bout sur mobile. Layer 1 fournit une infrastructure matérielle et conteneurisée permettant aux enquêteurs de piloter des instances Android réelles, d'intercepter les SMS de validation OTP des opérateurs nationaux (Mobilis, Djezzy, Ooredoo) et de capturer des flux vidéo WebRTC à 60 FPS sans latence perceptible (&lt;30ms).
          </p>
        </div>

        <!-- Layer 1 Specific Diagram -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 900 240" xmlns="http://www.w3.org/2000/svg" style="min-width:800px;font-family:system-ui,-apple-system,sans-serif;">
            <rect x="20" y="20" width="240" height="200" rx="8" fill="#140f0a" stroke="#f97316" stroke-width="1.5"/>
            <text x="35" y="45" fill="#f97316" font-size="11" font-weight="bold">BANQUE MODEMS SIM 4G DZ</text>
            <text x="35" y="65" fill="#fed7aa" font-size="8.5">• SIM800C / SIM7600G-H USB</text>
            <text x="35" y="85" fill="#fed7aa" font-size="8.5">• Puces Mobilis, Djezzy, Ooredoo</text>
            <text x="35" y="105" fill="#fed7aa" font-size="8.5">• Daemon AT Commands (/dev/ttyUSB)</text>
            <text x="35" y="130" fill="#fca5a5" font-size="8.5">⚡ Interception SMS 2FA en &lt;1.5s</text>
            <text x="35" y="150" fill="#fed7aa" font-size="8.5">• Rotation dynamique des APN 4G</text>
            <text x="35" y="175" fill="#94a3b8" font-size="8">• Push direct dans Redis Queue</text>

            <path d="M 260 120 L 320 120" stroke="#f97316" stroke-width="2" marker-end="url(#arr-orange)"/>
            <text x="265" y="112" fill="#f97316" font-size="8" font-family="monospace">OTP Codes</text>

            <rect x="330" y="20" width="270" height="200" rx="8" fill="#1a140d" stroke="#f97316" stroke-width="1.5"/>
            <text x="345" y="45" fill="#f97316" font-size="11" font-weight="bold">CONTENEURS ANDROID (ReDroid)</text>
            <text x="345" y="65" fill="#fed7aa" font-size="8.5">• Android 13 AOSP GPU Passthrough</text>
            <text x="345" y="85" fill="#fed7aa" font-size="8.5">• Magisk + Zygisk Root Cloaking</text>
            <text x="345" y="105" fill="#fed7aa" font-size="8.5">• Contournement détection émulateur</text>
            <text x="345" y="125" fill="#fed7aa" font-size="8.5">• Appium 2.x UiAutomator2 Daemon</text>
            <text x="345" y="150" fill="#38bdf8" font-size="8.5">🎮 Scrcpy WebRTC Server (Port 5555)</text>
            <text x="345" y="175" fill="#fed7aa" font-size="8.5">• Mitmproxy 10.3 Déchiffrement TLS</text>

            <path d="M 600 120 L 660 120" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
            <text x="605" y="112" fill="#38bdf8" font-size="8" font-family="monospace">WebRTC 60 FPS</text>

            <rect x="670" y="20" width="210" height="200" rx="8" fill="#0c1726" stroke="#38bdf8" stroke-width="1.5"/>
            <text x="685" y="45" fill="#38bdf8" font-size="11" font-weight="bold">POSTE ENQUÊTEUR (STUDIO)</text>
            <text x="685" y="65" fill="#94a3b8" font-size="8.5">• Canvas WebGL interactif</text>
            <text x="685" y="85" fill="#94a3b8" font-size="8.5">• Clics &amp; saisie clavier miroir</text>
            <text x="685" y="105" fill="#94a3b8" font-size="8.5">• Écoute vocale WhatsApp live</text>
            <text x="685" y="130" fill="#86efac" font-size="8.5">📸 Capture d'écran certifiée WORM</text>
            <text x="685" y="150" fill="#94a3b8" font-size="8.5">• Extraction automatique des vocaux</text>
            <text x="685" y="175" fill="#94a3b8" font-size="8.5">• Découverte d'indices en direct</text>
          </svg>
        </div>

        <!-- Layer 1 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 1 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>ReDroid</strong></td>
              <td><span class="badge-ver">Android 13 (v2024.04)</span></td>
              <td>Conteneurs Android légers avec accélération GPU physique</td>
              <td>
                <ul class="pros-list">
                  <li>Consomme 10x moins de RAM qu'un émulateur QEMU/AVD classique</li>
                  <li>Démarrage d'une instance en &lt;4 secondes</li>
                  <li>Isolation stricte par conteneur Docker étanche</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Requiert translation binaire ARM-sur-x86 (libndk/houdini)</li>
                  <li>Mitigation : compilation d'images Docker multi-arch optimisées</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Scrcpy WebRTC</strong></td>
              <td><span class="badge-ver">v2.4</span></td>
              <td>Streaming vidéo ultra-faible latence (&lt;30ms) du téléphone vers le navigateur web</td>
              <td>
                <ul class="pros-list">
                  <li>Fluidité native 60 images par seconde sans lag</li>
                  <li>Pass-through direct des événements souris et tactile</li>
                  <li>Aucun client lourd requis sur le poste de l'enquêteur</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Consommation bande-passante si 20+ flux simultanés</li>
                  <li>Mitigation : limitation de débit adaptative à 1080p@30fps</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Banque Modems SIM 4G</strong></td>
              <td><span class="badge-ver">SIM7600G-H USB</span></td>
              <td>Puces SIM réelles des 3 opérateurs nationaux (Mobilis, Djezzy, Ooredoo)</td>
              <td>
                <ul class="pros-list">
                  <li>Indétectable comme numéro virtuel VoIP par WhatsApp/Meta</li>
                  <li>Réception instantanée des codes SMS 2FA via commandes AT</li>
                  <li>Permet l'assignation de proxies 4G résidentiels algériens</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Maintenance physique du matériel (recharges puces SIM)</li>
                  <li>Mitigation : module d'alerte solde SMS automatisé</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Zygisk / Magisk</strong></td>
              <td><span class="badge-ver">v27.0</span></td>
              <td>Camouflage du statut root et masquage d'empreinte d'émulateur</td>
              <td>
                <ul class="pros-list">
                  <li>Permet l'exécution d'applications bancaires strictes (BaridiMob)</li>
                  <li>Empêche WhatsApp de bannir le compte pour "système non officiel"</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Mises à jour fréquentes des détections Play Integrity de Google</li>
                  <li>Mitigation : profils Zygisk-Shamiko testés en sandbox d'abord</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Mitmproxy</strong></td>
              <td><span class="badge-ver">v10.3.1</span></td>
              <td>Interception et déchiffrement des payloads HTTP/TLS des applications</td>
              <td>
                <ul class="pros-list">
                  <li>Extraction automatique des clés API, tokens de session et pièces jointes</li>
                  <li>Capture des URLs directes des vocaux et photos haute résolution</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Certificate Pinning strict sur certaines applications récentes</li>
                  <li>Mitigation : scripts Frida d'unpinning SSL injectés automatiquement</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- ====================================================================
         TAB 3: LAYER 2 - INGESTION & PIPELINE DE NORMALISATION POLYGLOTTE
         ==================================================================== -->
    <div id="panel-arch-layer2" class="arch-tab-panel">
      <section>
        <h2 class="section-title">3. Layer 2 : Ingestion &amp; Pipeline de Normalisation Polyglotte</h2>
        <p class="section-subtitle">
          Passerelle d'entrée sécurisée, orchestration asynchrone des tâches d'investigation et nettoyage canonique des indices bruts selon le standard GFPG.
        </p>

        <div class="card" style="border-left:4px solid #0ea5e9;margin-bottom:1.5rem;">
          <h3 style="color:#0ea5e9;margin-bottom:0.5rem;">🎯 Mission Opérationnelle du Layer 2</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Les données récoltées sur le terrain ou par scraping OSINT arrivent sous des formats chaotiques : chaînes brutes, pages HTML volumineuses, numéros de téléphone mal formatés (ex: <code>0555019283</code> vs <code>+213 555 01 92 83</code>), reçus bancaires froissés. Layer 2 garantit la validation cryptographique de l'enquêteur (JWT + RBAC), distribue les charges sur des files asynchrones Celery/Redis, normalise chaque entité dans son format canonique E.164 / SHA-256 et scelle les preuves au format WORM ISO 28500.
          </p>
        </div>

        <!-- Layer 2 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 2 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>FastAPI</strong></td>
              <td><span class="badge-ver">v0.111.x (Python 3.11)</span></td>
              <td>Passerelle API Ingress, validation des schémas Pydantic v2 et passerelle WebSocket</td>
              <td>
                <ul class="pros-list">
                  <li>Performance asynchrone maximale basée sur Starlette et Uvicorn</li>
                  <li>Génération automatique de la documentation OpenAPI / Swagger</li>
                  <li>Contrôle strict des permissions RBAC sur chaque route judiciaire</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Requiert une gestion rigoureuse des workers asynchrones sous forte charge</li>
                  <li>Mitigation : Gunicorn avec 8 Uvicorn workers et reverse-proxy Nginx</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Celery + Redis 7</strong></td>
              <td><span class="badge-ver">Celery 5.4 / Redis 7.2</span></td>
              <td>Distribution asynchrone des tâches d'investigation et files de priorités</td>
              <td>
                <ul class="pros-list">
                  <li>Traitement en arrière-plan sans bloquer l'interface de l'enquêteur</li>
                  <li>Mécanisme de retry automatique avec backoff exponentiel sur panne</li>
                  <li>Files d'attente prioritaires (Priorité 1: Scellement WORM ; Priorité 3: Scraping passif)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>États volatils en cas de coupure de courant si non configuré en AOF</li>
                  <li>Mitigation : persistance Redis Append-Only File (AOF) chaque seconde</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Temporal.io</strong></td>
              <td><span class="badge-ver">v1.24.x</span></td>
              <td>Moteur d'orchestration de workflows durables multi-jours</td>
              <td>
                <ul class="pros-list">
                  <li>Survit aux redémarrages serveur et pannes réseaux sans perte d'état</li>
                  <li>Permet d'attendre l'approbation humaine de l'enquêteur (Human-in-the-Loop)</li>
                  <li>Historique d'événements immuable (Event Sourcing) conforme à l'audit CPP</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Complexité d'infrastructure supplémentaire</li>
                  <li>Mitigation : réservé aux workflows critiques (ex: réquisitions et infiltrations)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Pydantic</strong></td>
              <td><span class="badge-ver">v2.8.x (Rust Core)</span></td>
              <td>Validation et sérialisation canonique des 14 types d'éléments d'enquête</td>
              <td>
                <ul class="pros-list">
                  <li>Validation 15x plus rapide grâce au cœur écrit en Rust</li>
                  <li>Garantit que tout numéro est converti au format E.164 avant écriture</li>
                  <li>Empêche l'injection de données corrompues dans les bases de données</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Refuse strictement les formats non conformes</li>
                  <li>Mitigation : modules de prétraitement tolérants aux fautes de frappe</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>ArchiveBox</strong></td>
              <td><span class="badge-ver">v0.7.2</span></td>
              <td>Scellement de pages web au format international WARC ISO 28500</td>
              <td>
                <ul class="pros-list">
                  <li>Capture complète du DOM HTML, images, CSS et certificats TLS originaux</li>
                  <li>Admissibilité internationale incontestable en audience judiciaire</li>
                  <li>Génère simultanément PDF vectoriel, capture PNG et fichier WARC</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Taille de fichier conséquente (10 à 50 Mo par page archivée)</li>
                  <li>Mitigation : déduplication et stockage compressé dans MinIO S3</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- ====================================================================
         TAB 4: LAYER 3 - STOCKAGE POLYGLOTTE SPÉCIALISÉ (6 MOTEURS)
         ==================================================================== -->
    <div id="panel-arch-layer3" class="arch-tab-panel">
      <section>
        <h2 class="section-title">4. Layer 3 : Tier de Stockage Polyglotte Spécialisé (6 Moteurs)</h2>
        <p class="section-subtitle">
          Séparation rigoureuse des responsabilités de stockage : aucun moteur universel n'existe en forensique numérique. Chaque type de donnée est confié à son moteur mathématique optimal.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(290px, 1fr));gap:1rem;margin-bottom:1.5rem;">
          <div class="card" style="border-top:3px solid #38bdf8;">
            <strong style="color:#38bdf8;font-size:0.95rem;">🕸️ 1. Neo4j 5.20+ Enterprise</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> Graphe de Connaissances Criminelles &amp; Rapprochements Multi-Sauts.<br/>
              Pointeurs physiques directs en mémoire vive (index-free adjacency) permettant de traverser 8 degrés de complicité en moins de 5ms.
            </p>
          </div>
          <div class="card" style="border-top:3px solid #10b981;">
            <strong style="color:#10b981;font-size:0.95rem;">📋 2. PostgreSQL 16 + TimescaleDB</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> État ACID des Dossiers, Bornage Télécom &amp; Ledger Merkle.<br/>
              Isolation stricte par Wilaya (RLS), hyper-tables partitionnées pour des millions de CDRs télécoms, et chaînage SHA-256 non-répudiable des logs d'audit.
            </p>
          </div>
          <div class="card" style="border-top:3px solid #06b6d4;">
            <strong style="color:#06b6d4;font-size:0.95rem;">🍃 3. MongoDB 7.0 (WiredTiger)</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> Dépôt Polymorphe de Scraping Brut &amp; Payloads JSON.<br/>
              Absorbe les réponses de 76 briques OSINT sans schéma fixe ni migration. Compression Snappy réduisant l'empreinte disque de 70%.
            </p>
          </div>
          <div class="card" style="border-top:3px solid #f59e0b;">
            <strong style="color:#f59e0b;font-size:0.95rem;">🔒 4. MinIO S3 Enterprise (WORM)</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> Coffre-Fort Immuable de Scellés Numériques (ISO 27037).<br/>
              Object Lock en mode COMPLIANCE avec horodatage RFC 3161 : il est mathématiquement impossible de modifier ou supprimer un fichier scellé.
            </p>
          </div>
          <div class="card" style="border-top:3px solid #a855f7;">
            <strong style="color:#a855f7;font-size:0.95rem;">🎯 5. Qdrant 1.9 (Rust HNSW)</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> Recherche Vectorielle Sub-8ms Visages &amp; Empreintes Vocales.<br/>
              Recherche de similarité cosinus avec filtrage par payload (ex: chercher ce visage suspect uniquement dans les dossiers d'Oran en 2026).
            </p>
          </div>
          <div class="card" style="border-top:3px solid #ec4899;">
            <strong style="color:#ec4899;font-size:0.95rem;">⚡ 6. Redis 7.2 Stack</strong>
            <p style="font-size:0.8rem;color:var(--text-secondary);margin-top:0.3rem;">
              <strong>Rôle :</strong> Bus Événementiel Temps-Réel &amp; Verrous Anti-Ban.<br/>
              Propagation WebSocket instantanée vers le Studio Enquêteur et algorithme Token-Bucket limitant la cadence de requêtes sur les réseaux sociaux.
            </p>
          </div>
        </div>

        <!-- Layer 3 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Matrice Comparée des Moteurs de Stockage de Layer 3</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Moteur de Base</th>
              <th>Version</th>
              <th>Type de Données Traitées</th>
              <th>Avantages Déterminants (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j Enterprise</strong></td>
              <td><span class="badge-ver">v5.20.0 (Bolt)</span></td>
              <td>Graphe d'entités (GFPG), relations de complicité, transferts d'argent</td>
              <td>
                <ul class="pros-list">
                  <li>Index-free adjacency : complexité de traversée O(k) indépendante de N</li>
                  <li>Cypher expressif et lisible pour les réquisitions judiciaires</li>
                  <li>Bibliothèque native Graph Data Science (GDS) en mémoire</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Inadapté au stockage de gros payloads binaires ou documents non structurés</li>
                  <li>Mitigation : stockage des payloads dans Mongo/S3, seul le pointeur _id est dans Neo4j</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>PostgreSQL + TimescaleDB</strong></td>
              <td><span class="badge-ver">PG 16.3 / Timescale 2.15</span></td>
              <td>Identités civiles, infractions CPP, relevés CDRs télécoms, journal d'audit</td>
              <td>
                <ul class="pros-list">
                  <li>Garantie ACID absolue, transactions financières sérialisables</li>
                  <li>Row-Level Security (RLS) étanche par Wilaya et unité d'enquête</li>
                  <li>Hyper-tables découpées par temps pour des requêtes CDR en &lt;15ms</li>
                  <li>Chaînage cryptographique SHA-256 Merkle entre lignes d'audit</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Requêtes récursives sur graphes profonds (>3 sauts) très lentes</li>
                  <li>Mitigation : délégation des requêtes de réseau à Neo4j</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>MongoDB</strong></td>
              <td><span class="badge-ver">v7.0.9 (WiredTiger)</span></td>
              <td>Dumps bruts HTML/JSON de 76 outils OSINT, cookies, headers HTTP</td>
              <td>
                <ul class="pros-list">
                  <li>Absorbe les variations de schéma brut sans altération de table</li>
                  <li>Compression Snappy réduisant l'espace disque de 70%</li>
                  <li>Change Streams permettant le déclenchement réactif des analyseurs</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Pas de transactions ACID multi-dossiers complexes</li>
                  <li>Mitigation : cantonné au rôle de zone de staging et d'archives brutes</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>MinIO S3</strong></td>
              <td><span class="badge-ver">RELEASE.2024-05</span></td>
              <td>Captures d'écran certifiées, notes vocales, APKs saisis, rapports PDF/A</td>
              <td>
                <ul class="pros-list">
                  <li>Mode WORM (Write-Once-Read-Many) conforme ISO 27037</li>
                  <li>Téléchargement sécurisé via URLs présignées à durée limitée</li>
                  <li>Calcul et vérification des empreintes SHA-256 à chaque accès</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Nécessite du stockage disque NVMe pour les accès rapides</li>
                  <li>Mitigation : tiering automatique vers stockage HDD pour les scellés clos</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Qdrant</strong></td>
              <td><span class="badge-ver">v1.9.2 (Rust)</span></td>
              <td>Vecteurs d'embeddings faciaux ArcFace (512-d) et x-vectors vocaux</td>
              <td>
                <ul class="pros-list">
                  <li>Recherche de similarité cosinus sub-8ms sur 10M de visages</li>
                  <li>Filtrage par payload en une seule passe sans surcoût mémoire</li>
                  <li>Écrit en Rust : empreinte mémoire minimale et zéro GC pause</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Précision dépendante de la qualité du modèle d'embedding source</li>
                  <li>Mitigation : double vérification humaine obligatoire sur les scores &lt;0.85</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Redis Stack</strong></td>
              <td><span class="badge-ver">v7.2.4</span></td>
              <td>Sessions utilisateurs, tokens JWT, notifications WebSocket, rate-limiters</td>
              <td>
                <ul class="pros-list">
                  <li>Latence sub-milliseconde en mémoire pure</li>
                  <li>Algorithme de Token Bucket empêchant le bannissement d'IPs d'enquête</li>
                  <li>Support natif des flux d'événements Redis Streams</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Données purement volatiles par défaut</li>
                  <li>Mitigation : réplication maître-esclave et persistance AOF activée</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- ====================================================================
         TAB 5: LAYER 4 - MOTEUR ANALYTICS & GDS GRAPH SCIENCE
         ==================================================================== -->
    <div id="panel-arch-layer4" class="arch-tab-panel">
      <section>
        <h2 class="section-title">5. Layer 4 : Moteur Algorithmique &amp; Analytics GDS (SNA)</h2>
        <p class="section-subtitle">
          Le cerveau analytique de la plateforme : détection de cellules criminelles étanches, démasquage des mules financières et classification automatique des rôles criminels via Neo4j Graph Data Science et les modules Python validés de <code>PIC-main</code>.
        </p>

        <div class="card" style="border-left:4px solid #a855f7;margin-bottom:1.5rem;">
          <h3 style="color:#a855f7;margin-bottom:0.5rem;">🎯 Fonctions Réseau Spécifiques Utilisées en Investigation</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">
            <div>
              <strong style="color:#e9d5ff;">🔗 Prédiction de Liens (Link Prediction) :</strong><br/>
              Point d'API <code>/api/link_prediction/</code>. Calcule la probabilité de complicité occulte entre deux suspects non connectés directement via les indices d'Adamic-Adar et de Resource Allocation.
            </div>
            <div>
              <strong style="color:#e9d5ff;">🌉 Centralité d'Intermédiarité (Betweenness) :</strong><br/>
              Fonction <code>calculate_betweenness_centrality</code>. Normalisation Min-Max [0.0, 1.0]. Identifie immédiatement les passeurs d'argent (mules BaridiMob) et téléphones relais faisant le pont entre cellules.
            </div>
            <div>
              <strong style="color:#e9d5ff;">👥 Détection de Communautés (Louvain &amp; Label Propagation) :</strong><br/>
              Module <code>AnalysisAlgorithms/Community.js</code>. Détecte automatiquement les branches spécialisées (branche fausses annonces, branche faux visas, branche blanchiment) par maximisation de la modularité.
            </div>
            <div>
              <strong style="color:#e9d5ff;">🏷️ Classification des Rôles Criminels (Node_clasification) :</strong><br/>
              Attribut <code>_class</code> calculé d'après <code>_Lvl_of_Implications</code>. Classe automatiquement chaque individu en : <em>Neutre</em>, <em>Opérationnel</em> (homme de main), <em>Soutien</em> (fournisseur de SIM/cartes), ou <em>Leader</em> (donneur d'ordre).
            </div>
            <div>
              <strong style="color:#e9d5ff;">📍 Profilage Territorial (Secteur_Activite) :</strong><br/>
              Attributs <code>_wiliya_Activiti</code>, <code>_daira_activiti</code>, <code>_comune_Activite</code>. Calcule le rayon d'action géographique d'un suspect à partir de ses bornages, annonces et retraits GAB.
            </div>
            <div>
              <strong style="color:#e9d5ff;">⏳ Expansion Temporelle Sliced (APOC Filter) :</strong><br/>
              Point d'API <code>/api/filter_affaire_relations/</code>. Permet à l'enquêteur de déplacer le curseur temporel (<code>BarScroll.js</code>) pour voir le réseau criminel se tisser jour après jour.
            </div>
          </div>
        </div>

        <!-- Layer 4 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 4 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j Graph Data Science (GDS)</strong></td>
              <td><span class="badge-ver">v2.6.4</span></td>
              <td>Calcul en mémoire des métriques de centralité, de clustering et de plongements vectoriels</td>
              <td>
                <ul class="pros-list">
                  <li>Projections en graphe mémoire ultra-rapides sans impacter la base transactionnelle</li>
                  <li>Algorithme de Brandes pour Betweenness Centrality optimisé multi-threads</li>
                  <li>FastRP &amp; Node2Vec générant des vecteurs de graphe pour le machine learning</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Consommation RAM importante lors de projections sur des millions de nœuds</li>
                  <li>Mitigation : libération explicite de la mémoire (<code>gds.graph.drop</code>) après chaque calcul</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>NetworkX</strong></td>
              <td><span class="badge-ver">v3.3 (Python)</span></td>
              <td>Validation hors-ligne, calculs d'isomorphisme de sous-graphes et tests d'intégrité</td>
              <td>
                <ul class="pros-list">
                  <li>Grande flexibilité pour prototyper de nouveaux indices de complicité</li>
                  <li>Nombreuses métriques académiques disponibles immédiatement</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Monothreadé en Python, lent au-delà de 50 000 sommets</li>
                  <li>Mitigation : utilisé uniquement sur les sous-graphes filtrés d'un dossier précis</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>APOC Core (Awesome Procedures)</strong></td>
              <td><span class="badge-ver">v5.20.0</span></td>
              <td>Procédures d'extension Cypher pour l'expansion conditionnelle et temporelle</td>
              <td>
                <ul class="pros-list">
                  <li>Expansion de chemins avec seuil de confiance et profondeur maximale (<code>apoc.path.expandConfig</code>)</li>
                  <li>Filtrage par dates et attributs dérivés directement dans la requête Cypher</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Requiert des configurations de sécurité strictes pour interdire les accès système non autorisés</li>
                  <li>Mitigation : liste blanche restreinte aux seules procédures forensiques sûres</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- ====================================================================
         TAB 6: LAYER 5 - IA SOUVERAINE & BIOMÉTRIE MULTIMODALE
         ==================================================================== -->
    <div id="panel-arch-layer5" class="arch-tab-panel">
      <section>
        <h2 class="section-title">6. Layer 5 : IA Souveraine Locale &amp; Biométrie Multimodale</h2>
        <p class="section-subtitle">
          Intelligence artificielle 100% souveraine et hermétique (air-gapped) : aucune transmission de données judiciaires vers des clouds étrangers. Traitement de la Darija algérienne, reconnaissance biométrique et assistant Text-to-Cypher.
        </p>

        <div class="card" style="border-left:4px solid #38bdf8;margin-bottom:1.5rem;">
          <h3 style="color:#38bdf8;margin-bottom:0.5rem;">🎯 Piliers de l'IA Souveraine Judiciaire</h3>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">
            <div>
              <strong style="color:#7dd3fc;">💬 Text-to-Cypher Souverain (Chatbot Ollama) :</strong><br/>
              Modèle local <code>hf.co/DavidLanz/text2cypher-gemma-2-9b</code> intégré dans <code>graph/chatbot/view.py</code>. L'enquêteur pose une question en français ou arabe (« Qui a reçu de l'argent de Karim ? ») ; le modèle génère le Cypher exact avec une boucle d'auto-correction syntaxique (<code>validate_query</code>).
            </div>
            <div>
              <strong style="color:#7dd3fc;">🎙️ Transcription &amp; Diarisation de la Darija Algérienne :</strong><br/>
              Modèle <code>Faster-Whisper</code> fine-tuné sur les dialectes algériens (arabe, français, berbère). <code>PyAnnote Audio 3.1</code> sépare les locuteurs et surligne automatiquement les montants financiers (DZD) et lieux de rendez-vous.
            </div>
            <div>
              <strong style="color:#7dd3fc;">👤 Rapprochement Biométrique Facial (ArcFace 512-d) :</strong><br/>
              Génération d'empreintes faciales 512 dimensions invariantes aux angles et à l'éclairage. Permet de certifier si la photo d'un profil Instagram correspond à la photo d'un suspect sur un compte Telegram clandestin.
            </div>
            <div>
              <strong style="color:#7dd3fc;">📑 Synthèse Judiciaire Automatique (&lt;Resume&gt;) :</strong><br/>
              Génère des résumés d'enquête clairs et chronologiques pour le Procureur de la République sans jargon informatique, structurant les faits de manière opposable en justice.
            </div>
          </div>
        </div>

        <!-- Layer 5 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 5 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ollama Server</strong></td>
              <td><span class="badge-ver">v0.3.x (Local)</span></td>
              <td>Serveur d'inférence LLM souverain hébergé sur station GPU locale</td>
              <td>
                <ul class="pros-list">
                  <li>Étanchéité réseau totale : aucune donnée ne quitte le réseau de la police</li>
                  <li>Inférence quantifiée 4-bit (GGUF) tournant sur GPU grand public (RTX 4090 / A5000)</li>
                  <li>Support du modèle spécialisé DavidLanz/text2cypher-gemma-2-9b</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Possibilité d'hallucination de syntaxe Cypher</li>
                  <li>Mitigation : fonction <code>validate_query</code> testant la syntaxe sur schéma avant exécution</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Faster-Whisper (Darija DZ)</strong></td>
              <td><span class="badge-ver">v1.0.2 (CTranslate2)</span></td>
              <td>Transcription hors-ligne des vocaux WhatsApp et écoutes téléphoniques</td>
              <td>
                <ul class="pros-list">
                  <li>4x plus rapide que Whisper vanilla avec 2x moins de VRAM</li>
                  <li>Entraîné sur le code-switching spécifique arabe dialectal / français / tamazight</li>
                  <li>Extraction directe des entités nommées (villes DZ, sommes en Dinars)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Bruit de fond élevé dans les messages vocaux de rue</li>
                  <li>Mitigation : prétraitement audio par filtre débruiteur (noisereduce / Demucs)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>PyAnnote Audio</strong></td>
              <td><span class="badge-ver">v3.1.1</span></td>
              <td>Diarisation du locuteur (qui parle quand) et extraction d'empreinte vocale</td>
              <td>
                <ul class="pros-list">
                  <li>Distingue clairement la voix de l'escroc de celle de la victime dans une note vocale</li>
                  <li>Génère des embeddings x-vectors pour identifier le même suspect sur plusieurs dossiers</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Exigeant en calcul GPU lors de longues conversations</li>
                  <li>Mitigation : découpage des fichiers audio en tranches de 30 secondes</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>DeepFace (ArcFace)</strong></td>
              <td><span class="badge-ver">v0.0.92</span></td>
              <td>Extraction d'embeddings faciaux 512 dimensions et score de concordance</td>
              <td>
                <ul class="pros-list">
                  <li>Précision de 99.8% sur le benchmark LFW, robuste aux variations d'angle et de barbe</li>
                  <li>Indexation directe des vecteurs dans Qdrant pour une recherche instantanée</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Photos de profil fortement compressées ou pixélisées</li>
                  <li>Mitigation : filtre de qualité d'image amont (détection de flou par laplacien)</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <!-- ====================================================================
         TAB 7: LAYER 6 - PRÉSENTATION NVL DUAL-CANVAS WEBGL
         ==================================================================== -->
    <div id="panel-arch-layer6" class="arch-tab-panel">
      <section>
        <h2 class="section-title">7. Layer 6 : Tier de Présentation (Neo4j NVL WebGL + Dual-Canvas)</h2>
        <p class="section-subtitle">
          Le poste de travail de l'enquêteur, modernisé selon les composants réels validés de <code>frontend-master</code> : moteur WebGL Neo4j NVL, minimap synchronisée, workers physiques en arrière-plan et sérialisation des états d'enquête.
        </p>

        <div class="card" style="border-left:4px solid #38bdf8;margin-bottom:1.5rem;">
          <h3 style="color:#38bdf8;margin-bottom:0.5rem;">🎯 Architecture Dual-Canvas &amp; Pipeline Web Workers</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
            Contrairement aux solutions traditionnelles (Cytoscape.js sur canvas 2D CPU), le Studio Enquêteur s'appuie sur le moteur matériel <strong>Neo4j NVL (@neo4j-nvl/react)</strong> accéléré par WebGL. Cela permet de manipuler 50 000 nœuds et relations avec une fluidité constante de 60 FPS.
          </p>
          <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:0.75rem;font-size:0.82rem;color:var(--text-secondary);line-height:1.5;">
            <div>
              <strong style="color:#38bdf8;">🖥️ Dual-Canvas Synchronisé :</strong><br/>
              Intégré dans <code>VisualisationModule/GraphCanvas.js</code> et <code>NvlVisualization.js</code>. L'écran principal affiche la zone de travail détaillée, tandis qu'un second canvas minimap affiche la vue globale macroscopique avec un cadre de vue interactif bidirectionnel.
            </div>
            <div>
              <strong style="color:#38bdf8;">⚙️ Layout-Workers en Web Workers :</strong><br/>
              Bibliothèque <code>@neo4j-nvl/layout-workers</code>. Les calculs de physique Force-Directed (FDG) et de placement circulaire sont déportés sur un thread Web Worker séparé, garantissant zéro freeze de l'interface lors de la manipulation du graphe.
            </div>
            <div>
              <strong style="color:#38bdf8;">🎨 Style Visuel &amp; Icônes Personnalisées :</strong><br/>
              Fichier de configuration <code>config_style.json</code> et point d'API <code>/api/node-config/</code>. Permet d'associer dynamiquement à chaque type d'entité sa couleur, son diamètre (90px à 140px) et son icône officielle dans <code>/public/icon/</code>.
            </div>
            <div>
              <strong style="color:#38bdf8;">💾 Persistance d'Affichage &amp; Export :</strong><br/>
              Point d'API <code>/api/visualizations/</code>. Sauvegarde les coordonnées spatiales exactes, les filtres actifs et les zooms de l'enquêteur pour reprise immédiate de la session d'enquête.
            </div>
          </div>
        </div>

        <!-- Layer 6 Tech Stack Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 6 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j NVL React</strong></td>
              <td><span class="badge-ver">@neo4j-nvl/react v1.1.x</span></td>
              <td>Moteur de rendu du graphe d'enquête accéléré matériellement par WebGL</td>
              <td>
                <ul class="pros-list">
                  <li>Fluidité 60 FPS jusqu'à 50 000+ sommets et arêtes simultanés</li>
                  <li>Intégration React native avec hooks d'événements (sélection, survol, drag)</li>
                  <li>Support direct du format de données Neo4j retourné par le backend Python</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Nécessite le support de WebGL 2.0 sur le navigateur de l'enquêteur</li>
                  <li>Mitigation : fallback automatique sur rendu Canvas standard si GPU absent</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>NVL Layout Workers</strong></td>
              <td><span class="badge-ver">@neo4j-nvl/layout-workers</span></td>
              <td>Exécution des algorithmes de disposition physique en arrière-plan (Web Workers)</td>
              <td>
                <ul class="pros-list">
                  <li>Aucun ralentissement du curseur ou de la saisie pendant la stabilisation physique</li>
                  <li>Support des algorithmes Force-Directed, Circulaire et Hiérarchique</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Temps de sérialisation des messages entre thread principal et worker</li>
                  <li>Mitigation : transfert par SharedArrayBuffer pour les graphes volumineux</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Module d'Interrogation Orientée</strong></td>
              <td><span class="badge-ver">PIC-main / frontend-master</span></td>
              <td>Questions judiciaires prédéfinies et interrogation ciblée (<code>NodeTypeCibled</code>)</td>
              <td>
                <ul class="pros-list">
                  <li>L'enquêteur clique sur des questions en français (ex: "Trouver les complices communs")</li>
                  <li>Aucune connaissance du langage Cypher ou SQL requise</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Doit être enrichi au fil des nouveaux types d'infractions</li>
                  <li>Mitigation : panneau de création de requêtes modèles pour le Chef de Brigade</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Curseur Temporel APOC</strong></td>
              <td><span class="badge-ver">BarScroll.js (TimelineBar)</span></td>
              <td>Navigation interactive chronologique dans le graphe d'infraction</td>
              <td>
                <ul class="pros-list">
                  <li>Reconstitution vivante de l'affaire devant le magistrat instructeur</li>
                  <li>Met en évidence la chronologie exacte des virements et contacts téléphoniques</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Exige que chaque arête possède les propriétés _first_seen et _last_seen</li>
                  <li>Mitigation : injection automatique des horodatages par le pipeline de Layer 2</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

  </main>

  <script src="assets/app.js"></script>
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
"""

with open("doc/architecture.html", "w", encoding="utf-8") as f:
    f.write(HTML_CONTENT)

print("Successfully written comprehensive tabbed doc/architecture.html!")
