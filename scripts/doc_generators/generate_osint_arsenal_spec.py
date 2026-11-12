#!/usr/bin/env python3
"""
Generates Chapter 05: OSINT Investigation Arsenal (doc/osint-arsenal.html)
Features a clean, structured tabular list of 76 OSINT tools with inputs, outputs,
storage destinations, requirements, and hardware resources.
"""

import sys
import os

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>05. OSINT Investigation Arsenal (76 Tools) — Athar DZ / AegisInvestigate</title>
  <link rel="stylesheet" href="assets/style.css" />
  <style>
    .cat-pill-bar {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
    }
    .filter-pill {
      background: #0f172a;
      border: 1px solid #23344d;
      color: #94a3b8;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.45rem 0.85rem;
      border-radius: 9999px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .filter-pill:hover, .filter-pill.active {
      background: #1e293b;
      color: #38bdf8;
      border-color: #38bdf8;
    }
    .table-tools-full {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      background: #0d1524;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .table-tools-full th {
      background: #111d33;
      color: #e2e8f0;
      padding: 0.75rem 0.85rem;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid #23344d;
    }
    .table-tools-full td {
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid #172540;
      color: #cbd5e1;
      vertical-align: middle;
      line-height: 1.45;
    }
    .table-tools-full tr:hover {
      background: rgba(56, 189, 248, 0.04);
    }
    .dest-pill {
      display: inline-block;
      font-size: 0.72rem;
      padding: 2px 6px;
      border-radius: 4px;
      background: #1e293b;
      border: 1px solid #334155;
      font-family: var(--font-mono, monospace);
    }
    .dest-neo { color: #38bdf8; border-color: #0284c7; }
    .dest-pg { color: #10b981; border-color: #059669; }
    .dest-mongo { color: #06b6d4; border-color: #0891b2; }
    .dest-minio { color: #f59e0b; border-color: #d97706; }
    .dest-qdrant { color: #a855f7; border-color: #9333ea; }
    .dest-redis { color: #ec4899; border-color: #db2777; }
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
      <li><a href="architecture.html"><span>🏗️ 02. Six-Layer Visual Architecture</span><span class="nav-badge">6 Layers</span></a></li>
      <li><a href="interfaces-roles.html"><span>👥 03. Interfaces &amp; Roles</span><span class="nav-badge">4 Views</span></a></li>
      <li><a href="data-model.html"><span>🕸️ 04. Data Model &amp; Metadata Graph</span><span class="nav-badge">Ontology</span></a></li>
      <li><a href="osint-arsenal.html" class="active"><span>🧰 05. OSINT Investigation Arsenal</span><span class="nav-badge">76 Tools</span></a></li>
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
      <div class="page-eyebrow">Chapter 05 &bull; Technical Arsenal &amp; OSINT Bricks Catalog</div>
      <h1>Full Inventory of 76 OSINT &amp; Web Investigation Tools</h1>
      <p>
        A structured, clean, filterable catalog of all available open-source intelligence tools. Each tool specifies its <strong>Starting Clue (Input)</strong>, <strong>Discovered Evidence (Output)</strong>, <strong>Polyglot Database Storage Destination</strong>, and <strong>Hardware / Operational Prerequisites</strong>.
      </p>
    </header>

    <!-- KPI Summary Cards -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(210px, 1fr));gap:0.75rem;margin-bottom:1.5rem;">
      <div class="card" style="border-left:4px solid #10b981;padding:0.75rem;">
        <div style="font-size:0.75rem;color:var(--text-muted);">🟢 DIRECT &amp; SOUVERAIN (LOCAL)</div>
        <div style="font-size:1.3rem;font-weight:800;color:#10b981;margin-top:0.2rem;"><span id="count-direct">36</span> Outils</div>
        <div style="font-size:0.72rem;color:#94a3b8;">100% hors-ligne, zéro clé requise</div>
      </div>
      <div class="card" style="border-left:4px solid #38bdf8;padding:0.75rem;">
        <div style="font-size:0.75rem;color:var(--text-muted);">🔑 AVEC CLÉ D'API GRATUITE</div>
        <div style="font-size:1.3rem;font-weight:800;color:#38bdf8;margin-top:0.2rem;"><span id="count-key">18</span> Outils</div>
        <div style="font-size:0.72rem;color:#94a3b8;">Inscription simple sans frais</div>
      </div>
      <div class="card" style="border-left:4px solid #f97316;padding:0.75rem;">
        <div style="font-size:0.75rem;color:var(--text-muted);">👤 VIA COMPTE COUVERTURE</div>
        <div style="font-size:1.3rem;font-weight:800;color:#f97316;margin-top:0.2rem;"><span id="count-account">14</span> Outils</div>
        <div style="font-size:0.72rem;color:#94a3b8;">Piloté par la Phone Farm 4G</div>
      </div>
      <div class="card" style="border-left:4px solid #ec4899;padding:0.75rem;">
        <div style="font-size:0.75rem;color:var(--text-muted);">💳 AVEC ABONNEMENT PAYANT</div>
        <div style="font-size:1.3rem;font-weight:800;color:#ec4899;margin-top:0.2rem;"><span id="count-paid">8</span> Outils</div>
        <div style="font-size:0.72rem;color:#94a3b8;">Services premium spécialisés</div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <section>
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;margin-bottom:1rem;">
        <div style="display:flex;gap:0.5rem;flex:1;min-width:280px;">
          <input type="text" id="tool-search-input" placeholder="🔍 Rechercher un outil, une entrée (téléphone, URL...) ou une techno..." onkeyup="filterToolsInventory()" style="background:#090d16;border:1px solid #1e293b;color:#f8fafc;padding:0.55rem 0.85rem;border-radius:6px;width:100%;font-size:0.82rem;" />
        </div>
        <div style="display:flex;gap:0.5rem;">
          <select id="req-filter-select" onchange="filterToolsInventory()" style="background:#090d16;border:1px solid #1e293b;color:#f8fafc;padding:0.55rem 0.85rem;border-radius:6px;font-size:0.82rem;">
            <option value="all">Tous les Prérequis</option>
            <option value="DIRECT">🟢 Direct &amp; Gratuit (Local)</option>
            <option value="KEY_FREE">🔑 Clé d'API Gratuite</option>
            <option value="ACCOUNT">👤 Compte Couverture Phone Farm</option>
            <option value="PAID">💳 Abonnement Payant</option>
          </select>
          <button class="btn" onclick="activateAllTools(true)">Tout Activer</button>
          <button class="btn" onclick="activateDirectOnly()">Activer Direct Seul</button>
          <button class="btn btn-primary" onclick="exportToolsConfig()">Exporter Config JSON</button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="cat-pill-bar">
        <button class="filter-pill active" onclick="filterByCategory('all')">Tous les Outils (76)</button>
        <button class="filter-pill" onclick="filterByCategory('socmint')">📢 Réseaux Sociaux &amp; Annonces (10)</button>
        <button class="filter-pill" onclick="filterByCategory('phone')">📱 Téléphones &amp; Messageries (8)</button>
        <button class="filter-pill" onclick="filterByCategory('web')">🌐 Sites Web &amp; Infrastructure (11)</button>
        <button class="filter-pill" onclick="filterByCategory('geo')">🗺️ Géolocalisation &amp; Imagerie (8)</button>
        <button class="filter-pill" onclick="filterByCategory('financial')">💳 Finances, BaridiMob &amp; Crypto (9)</button>
        <button class="filter-pill" onclick="filterByCategory('leak')">🔓 Fuites de Données &amp; Breach (8)</button>
        <button class="filter-pill" onclick="filterByCategory('audio')">🎙️ Audio, Voix Darija &amp; Médias (8)</button>
        <button class="filter-pill" onclick="filterByCategory('mobile')">🤖 Mobile, APK &amp; Téléphonie (14)</button>
      </div>

      <!-- Structured Table View -->
      <div class="table-container" style="overflow-x:auto;">
        <table class="table-tools-full">
          <thead>
            <tr>
              <th style="width:40px;text-align:center;">Actif</th>
              <th style="min-width:220px;">Outil &amp; Mission Judiciaire</th>
              <th style="min-width:130px;">Catégorie</th>
              <th style="min-width:260px;">Entrée (Input) &rarr; Sortie (Output)</th>
              <th style="min-width:150px;">Stockage Polyglotte</th>
              <th style="min-width:140px;">Prérequis Accès</th>
            </tr>
          </thead>
          <tbody id="tools-tbody">
            <!-- Dynamically populated by tools-catalog.js -->
          </tbody>
        </table>
      </div>
    </section>
  </main>

  <script src="assets/tools-catalog.js"></script>
  <script src="assets/app.js"></script>
</body>
</html>
"""

with open("doc/osint-arsenal.html", "w", encoding="utf-8") as f:
    f.write(HTML_CONTENT)

print("Successfully written doc/osint-arsenal.html!")
