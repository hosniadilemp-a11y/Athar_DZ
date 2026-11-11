#!/usr/bin/env python3
"""
Generates Chapter 06: Forensics (DFIR) & Social Network Analysis (SNA / SNS) Functions
(doc/forensics-sna.html).
Features 2 tabs:
- Tab 1: Police Judiciaire & DFIR Arsenal (12 Tools with GitHub, I/O, Storage, Resources, Priority)
- Tab 2: SOTA Social Network Analysis Functions (Directly the judicial graph functions:
  Link Prediction, Betweenness, Louvain Community Detection, Role Classification, Top-K, etc.)
"""

import sys
import os

HTML_CONTENT = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>06. Police Forensics (DFIR) &amp; SNA Investigation Functions — Athar DZ / AegisInvestigate</title>
  <link rel="stylesheet" href="assets/style.css" />
  <style>
    .forensic-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid #1e293b;
      margin-bottom: 1.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .forensic-tab-btn {
      background: #0f172a;
      border: 1px solid #23344d;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.65rem 1.25rem;
      border-radius: 8px 8px 0 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
      transition: all 0.2s ease;
    }
    .forensic-tab-btn:hover {
      background: #172540;
      color: #f1f5f9;
      border-color: #38bdf8;
    }
    .forensic-tab-btn.active {
      background: #141f36;
      color: #38bdf8;
      border-color: #38bdf8 #38bdf8 #141f36;
      border-bottom: 2px solid #38bdf8;
      margin-bottom: -2px;
    }
    .forensic-panel {
      display: none;
    }
    .forensic-panel.active {
      display: block;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      margin: 1rem 0;
      background: #0d1524;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #1e293b;
    }
    .data-table th {
      background: #111d33;
      color: #e2e8f0;
      padding: 0.75rem 0.85rem;
      text-align: left;
      font-weight: 700;
      border-bottom: 1px solid #23344d;
    }
    .data-table td {
      padding: 0.75rem 0.85rem;
      border-bottom: 1px solid #172540;
      color: #cbd5e1;
      vertical-align: top;
      line-height: 1.45;
    }
    .data-table tr:hover {
      background: rgba(56, 189, 248, 0.04);
    }
    .prio-pill {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
    }
    .prio-p1 { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid #ef4444; }
    .prio-p2 { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid #f59e0b; }
    .prio-p3 { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #0284c7; }
    .func-card {
      background: #0d1524;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
      transition: all 0.2s ease;
    }
    .func-card:hover {
      border-color: #38bdf8;
      box-shadow: 0 4px 14px rgba(56, 189, 248, 0.08);
    }
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
      <li><a href="osint-arsenal.html"><span>🧰 05. OSINT Investigation Arsenal</span><span class="nav-badge">76 Tools</span></a></li>
      <li><a href="forensics-sna.html" class="active"><span>🚔 06. Forensics (DFIR) &amp; SNA Functions</span><span class="nav-badge">SOTA Funcs</span></a></li>
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
      <div class="page-eyebrow">Chapter 06 &bull; Judicial Forensics &amp; Graph Intelligence Functions</div>
      <h1>Police Judiciaire (DFIR) &amp; SOTA Social Network Analysis (SNA / SNS)</h1>
      <p>
        Exhaustive specification of scientific digital forensics tools (DFIR) for sealed physical evidence, alongside the <strong>Twelve Core Social Network Analysis (SNA / SNS) Functions</strong> directly implemented in the backend and frontend to uncover hidden criminal accomplices.
      </p>
    </header>

    <!-- Top Tabs: Forensics DFIR vs SNA Functions -->
    <div class="forensic-tabs">
      <button class="forensic-tab-btn active" data-tab="dfir" onclick="switchForensicTab('dfir')">
        <span>🚔</span> 1. Police Judiciaire &amp; DFIR (12 Outils Scientifiques)
      </button>
      <button class="forensic-tab-btn" data-tab="sna" onclick="switchForensicTab('sna')">
        <span>🕸️</span> 2. Fonctions Réseau SNA / SNS (GDS &amp; Algorithmes)
      </button>
    </div>

    <!-- ====================================================================
         TAB 1: POLICE JUDICIAIRE & FORENSIQUE NUMÉRIQUE (DFIR)
         ==================================================================== -->
    <div id="panel-forensic-dfir" class="forensic-panel active">
      <section>
        <h2 class="section-title">1. Arsenal Scientifique de Police Judiciaire &amp; DFIR (12 Outils SOTA)</h2>
        <p class="section-subtitle">
          Outils forensiques conformes aux normes ISO 27037 pour l'analyse des scellés matériels saisis (téléphones, disques durs, dumps de mémoire vive et malwares APK).
        </p>

        <div class="table-container" style="overflow-x:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th style="min-width:170px;">Outil Scientifique</th>
                <th style="min-width:180px;">Entrée (Input)</th>
                <th style="min-width:180px;">Sortie (Output)</th>
                <th style="min-width:140px;">Stockage Polyglotte</th>
                <th style="min-width:130px;">Ressources</th>
                <th style="min-width:100px;">Priorité</th>
              </tr>
            </thead>
            <tbody id="forensics-tbody">
              <!-- Dynamically populated or static fallback -->
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <!-- ====================================================================
         TAB 2: FONCTIONS D'ANALYSE DE RÉSEAUX SOCIAUX (SNA / SNS)
         ==================================================================== -->
    <div id="panel-forensic-sna" class="forensic-panel">
      <section>
        <h2 class="section-title">2. Fonctions SOTA d'Analyse de Réseaux Sociaux (SNA / SNS &amp; Graphes)</h2>
        <p class="section-subtitle">
          Spécification formelle des <strong>12 fonctions mathématiques et topologiques</strong> intégrées dans le backend <code>PIC-main</code> et visualisées dans <code>frontend-master</code> pour orienter l'enquête criminelle.
        </p>

        <!-- 12 Function Cards Grid -->
        <div style="display:flex;flex-direction:column;gap:1.25rem;">

          <!-- 1. Link Prediction -->
          <div class="func-card" style="border-left:4px solid #38bdf8;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#38bdf8;margin:0;font-size:1rem;">1. Prédiction de Liens Cachés (Link Prediction)</h3>
              <span class="badge badge-blue">API: /api/link_prediction/</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Révèle les complicités occultes et les liens de collaboration criminelle latents entre deux suspects qui ne se sont jamais contactés directement mais partagent les mêmes intermédiaires (mules, téléphones, lieux).
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Adamic-Adar, Resource Allocation, Jaccard</div>
              <div><strong>Entrée Graphe :</strong> Paires de nœuds <code>(s1:Suspect, s2:Suspect)</code> non reliés</div>
              <div><strong>Sortie Canvas :</strong> Arête en pointillés <code>[:LIKELY_COLLABORATOR]</code> avec score [0..1]</div>
              <div><strong>Composants Codebase :</strong> <code>AnalysisAlgorithms/LinkPrediction.js</code></div>
            </div>
          </div>

          <!-- 2. Betweenness Centrality -->
          <div class="func-card" style="border-left:4px solid #f59e0b;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#f59e0b;margin:0;font-size:1rem;">2. Centralité d'Intermédiarité (Betweenness Centrality &amp; Mules)</h3>
              <span class="badge badge-amber">Fonction: calculate_betweenness_centrality</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Identifie immédiatement les passeurs d'argent (mules BaridiMob) et les lignes de communication pivots qui contrôlent le flux d'informations ou de fonds entre sous-groupes étanches.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Brandes (GDS Projection avec normalisation Min-Max)</div>
              <div><strong>Entrée Graphe :</strong> Sous-graphe complet de l'affaire projeté en RAM</div>
              <div><strong>Sortie Canvas :</strong> Propriété <code>_betweennessCentrality</code> &amp; taille de nœud proportionnelle</div>
              <div><strong>Composants Codebase :</strong> <code>Centrality.js</code> / <code>graph/analyse/view.py</code></div>
            </div>
          </div>

          <!-- 3. Community Detection (Louvain) -->
          <div class="func-card" style="border-left:4px solid #10b981;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#10b981;margin:0;font-size:1rem;">3. Détection de Cellules Criminelles (Louvain &amp; Label Propagation)</h3>
              <span class="badge badge-emerald">Module: AnalysisAlgorithms/Community.js</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Partitionne automatiquement un méga-réseau de 200+ suspects en cellules spécialisées étanches (branche fausses annonces pneus, branche faux visas, branche blanchiment crypto TRC-20).
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Louvain Modularity Optimization + Label Propagation (LPA)</div>
              <div><strong>Entrée Graphe :</strong> Graphe non orienté pondéré par intensité des contacts</div>
              <div><strong>Sortie Canvas :</strong> Coloriage distinct par cluster (<code>randomColor</code>) et hulls visuels</div>
              <div><strong>Composants Codebase :</strong> <code>AnalysisAlgorithms/Community.js</code></div>
            </div>
          </div>

          <!-- 4. Criminal Role Classification -->
          <div class="func-card" style="border-left:4px solid #a855f7;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#a855f7;margin:0;font-size:1rem;">4. Classification des Rôles Pénaux (Node_clasification)</h3>
              <span class="badge badge-purple">Backend: graph/analyse/view.py</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Classe chaque individu selon son niveau d'implication multi-sauts (<code>_Lvl_of_Implications</code>) pour orienter les mandats du Procureur vers les cerveaux et non les simples victimes ou exécutants.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Classification heuristique par degré, flux financiers et niveau de saut</div>
              <div><strong>Entrée Graphe :</strong> Nœuds personnes avec flux DZD entrants/sortants</div>
              <div><strong>Sortie Canvas :</strong> Badges de rôle : <code>neutre</code>, <code>operationeel</code>, <code>soutien</code>, <code>leader</code></div>
              <div><strong>Composants Codebase :</strong> <code>VisualisationModule/Parser.js</code> (Role badge renderer)</div>
            </div>
          </div>

          <!-- 5. Top-K Nodes Ranking -->
          <div class="func-card" style="border-left:4px solid #ec4899;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#ec4899;margin:0;font-size:1rem;">5. Classement des Cibles Prioritaires (Top-K Nodes)</h3>
              <span class="badge" style="background:#831843;color:#fbcfe8;">Module: AnalysisAlgorithms/TopK_Nodes.js</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Extrait en 1 clic les K suspects les plus critiques (ex: Top 5 des receleurs ou Top 3 des titulaires de comptes recevant le plus de fonds frauduleux).
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Degré pondéré, PageRank, Closeness Centrality</div>
              <div><strong>Entrée Graphe :</strong> Nœuds du type sélectionné (Personne, Compte, Téléphone)</div>
              <div><strong>Sortie Canvas :</strong> Tableau classé décroissant et surbrillance automatique</div>
              <div><strong>Composants Codebase :</strong> <code>AnalysisAlgorithms/TopK_Nodes.js</code></div>
            </div>
          </div>

          <!-- 6. Threshold Path Expansion -->
          <div class="func-card" style="border-left:4px solid #06b6d4;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#06b6d4;margin:0;font-size:1rem;">6. Expansion Contrôlée par Seuil (Threshold Path Expansion)</h3>
              <span class="badge badge-cyan">API: /api/expand_path_from_node/</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Évite l'effet "pelote de laine" où l'expansion d'un nœud affiche 500 contacts non pertinents. L'enquêteur définit un seuil de confiance minimum et un nombre maximal de sauts.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> APOC Path Expand avec filtrage de prédicat dynamique</div>
              <div><strong>Entrée Graphe :</strong> Nœud source + curseur seuil [0.0..1.0] + profondeur max (1 à 5)</div>
              <div><strong>Sortie Canvas :</strong> Nouveaux nœuds découverts avec animation d'apparition progressive</div>
              <div><strong>Composants Codebase :</strong> <code>AttributeAnalysis.js</code> / <code>Centrality.js</code></div>
            </div>
          </div>

          <!-- 7. Temporal APOC Slicing -->
          <div class="func-card" style="border-left:4px solid #f97316;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#f97316;margin:0;font-size:1rem;">7. Découpage Temporel Dynamique (Temporal APOC Subgraph Expansion)</h3>
              <span class="badge" style="background:#7c2d12;color:#fed7aa;">API: /api/filter_affaire_relations/</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Reconstitue la chronologie exacte de l'escroquerie. L'enquêteur glisse la barre temporelle pour observer comment l'escroc a d'abord ouvert le compte, puis diffusé les annonces, puis transféré les fonds.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Filtrage par intervalle de validité [valid_from, valid_to]</div>
              <div><strong>Entrée Graphe :</strong> Graphe complet de l'affaire + curseur de date <code>TimelineBar</code></div>
              <div><strong>Sortie Canvas :</strong> Masquage des arêtes futures et mise en surbrillance des faits du jour</div>
              <div><strong>Composants Codebase :</strong> <code>AnalyseTempSpatiale/BarScroll.js</code></div>
            </div>
          </div>

          <!-- 8. Activity Sector Profiling -->
          <div class="func-card" style="border-left:4px solid #10b981;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#10b981;margin:0;font-size:1rem;">8. Profilage Territorial du Suspect (Secteur_Activite)</h3>
              <span class="badge badge-emerald">Backend: Secteur_Activite</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Calcule la zone de mobilité criminelle d'un suspect à partir de ses relais BTS, retraits d'argent et points de livraison pour déterminer la juridiction compétente.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Agrégation spatiale par rattachement Wilaya / Daïra / Commune</div>
              <div><strong>Entrée Graphe :</strong> Événements géolocalisés (CDRs, GAB, IP Algérie Télécom)</div>
              <div><strong>Sortie Canvas :</strong> Propriétés <code>_wiliya_Activiti</code>, <code>_daira_activiti</code>, <code>_comune_Activite</code></div>
              <div><strong>Composants Codebase :</strong> Suspect Inspector dans <code>GraphVisualization.js</code></div>
            </div>
          </div>

          <!-- 9. Shortest Path (Money Trail) -->
          <div class="func-card" style="border-left:4px solid #eab308;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#eab308;margin:0;font-size:1rem;">9. Traçage du Chemin d'Argent (Shortest Path Dijkstra)</h3>
              <span class="badge badge-amber">Algorithme: Weighted Shortest Path</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Établit le lien direct et inattaquable entre le versement initial d'une victime et le portefeuille crypto final ou compte d'épargne du donneur d'ordre, même à travers 5 comptes intermédiaires.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Dijkstra avec pondération inverse du montant transféré</div>
              <div><strong>Entrée Graphe :</strong> Nœud Victime et Nœud Suspect Cible</div>
              <div><strong>Sortie Canvas :</strong> Surbrillance jaune vive de la chaîne de transactions</div>
              <div><strong>Composants Codebase :</strong> Menu Contextuel Arête (<code>contextmenuRelarion.js</code>)</div>
            </div>
          </div>

          <!-- 10. K-Core Decomposition -->
          <div class="func-card" style="border-left:4px solid #8b5cf6;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#8b5cf6;margin:0;font-size:1rem;">10. Élagage du Bruit &amp; Noyau Dur (K-Core Decomposition)</h3>
              <span class="badge badge-purple">Algorithme: K-Cores GDS</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Élimine tous les contacts périphériques éphémères (acheteurs occasionnels, faux numéros) pour ne laisser apparaître sur le plateau que le noyau dur interconnecté de l'organisation criminelle.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Décomposition récursive en K-coeurs (k=2, k=3, k=4)</div>
              <div><strong>Entrée Graphe :</strong> Graphe global de cas complexe</div>
              <div><strong>Sortie Canvas :</strong> Filtre visuel masquant les degrés inférieurs à K</div>
              <div><strong>Composants Codebase :</strong> <code>AttributAanalysis/AttributeAnalysis.js</code></div>
            </div>
          </div>

          <!-- 11. FastRP Node Embeddings -->
          <div class="func-card" style="border-left:4px solid #38bdf8;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#38bdf8;margin:0;font-size:1rem;">11. Plongements Topologiques Rapides (FastRP Embeddings)</h3>
              <span class="badge badge-blue">Algorithme: Fast Random Projection</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> Encode la position structurelle d'un suspect dans un vecteur 128 dimensions pour comparer son comportement criminel avec d'autres profils dans la base nationale Qdrant.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> FastRP (GDS In-Memory Linear Complexity)</div>
              <div><strong>Entrée Graphe :</strong> Projection bipartie de suspects et d'infractions</div>
              <div><strong>Sortie Canvas :</strong> Regroupement par similarité structurelle dans le canvas</div>
              <div><strong>Composants Codebase :</strong> Backend <code>PIC-main</code> GDS Pipeline</div>
            </div>
          </div>

          <!-- 12. Personalized PageRank -->
          <div class="func-card" style="border-left:4px solid #f43f5e;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.4rem;">
              <h3 style="color:#f43f5e;margin:0;font-size:1rem;">12. Propagation d'Influence Ciblée (Personalized PageRank)</h3>
              <span class="badge badge-rose">Algorithme: PPR GDS</span>
            </div>
            <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:0.6rem;">
              <strong>Utilité Judiciaire :</strong> À partir d'un suspect pivot identifié, calcule la probabilité de marche aléatoire pour trouver les individus qui gravitent le plus étroitement autour de lui dans la hiérarchie.
            </p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.6rem;font-size:0.78rem;background:#090d16;padding:0.65rem;border-radius:6px;">
              <div><strong>Algorithmes :</strong> Random Walk with Restart (RWR / PPR)</div>
              <div><strong>Entrée Graphe :</strong> Nœud source sourceNodeId + paramètre damping factor (0.85)</div>
              <div><strong>Sortie Canvas :</strong> Dégradé de halo d'influence autour de la cible</div>
              <div><strong>Composants Codebase :</strong> <code>AnalysisAlgorithms/TopK_Nodes.js</code></div>
            </div>
          </div>

        </div>
      </section>
    </div>

  </main>

  <script src="assets/tools-catalog.js"></script>
  <script src="assets/app.js"></script>
  <script>
    function switchForensicTab(tabId) {
      document.querySelectorAll('.forensic-tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
      });
      document.querySelectorAll('.forensic-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === 'panel-forensic-' + tabId);
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      if (typeof renderForensicToolsTable === 'function') {
        renderForensicToolsTable();
      }
    });
  </script>
</body>
</html>
"""

with open("doc/forensics-sna.html", "w", encoding="utf-8") as f:
    f.write(HTML_CONTENT)

print("Successfully written doc/forensics-sna.html!")
