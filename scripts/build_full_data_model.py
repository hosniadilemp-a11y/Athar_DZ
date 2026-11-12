# scripts/build_full_data_model.py
"""
Builds the comprehensive, production-grade Chapter 04: Data Model & Metadata Graph
Incorporates all 37 Node Types, 47 Relationships, Polyglot Storage Architecture,
and interactive visual ontologies.
"""

import os
import sys

# Ensure current script directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from data_model_definitions import DOMAINS, DATABASES, NODES, RELATIONSHIPS
from generate_ontology_svg import generate_svg_ontology
from update_app_js_ontology import update_app_js

def get_html_head():
    return '''<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>04. Modèle de Données &amp; Graphe des Métadonnées — Athar DZ / AegisInvestigate</title>
  <link rel="stylesheet" href="assets/style.css" />
  <style>
    .onto-filter-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
      margin-bottom: 0.75rem;
      align-items: center;
    }
    .onto-btn {
      background: #0f172a;
      border: 1px solid #23344d;
      color: #94a3b8;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.45rem 0.85rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.15s ease;
    }
    .onto-btn:hover {
      background: #172540;
      color: #f1f5f9;
      border-color: #38bdf8;
    }
    .onto-btn.active {
      background: #1e293b;
      color: #38bdf8;
      border-color: #38bdf8;
      box-shadow: 0 0 8px rgba(56, 189, 248, 0.25);
    }
    .tech-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.81rem;
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
    .onto-node-g {
      transition: all 0.2s ease;
    }
    .onto-node-g:hover rect.onto-node-rect {
      filter: brightness(1.25);
    }
    .search-filter-box {
      background: #090e17;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 0.75rem 1rem;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .search-filter-input {
      background: #040810;
      border: 1px solid #23344d;
      color: #f8fafc;
      font-size: 0.82rem;
      padding: 0.45rem 0.8rem;
      border-radius: 6px;
      flex: 1;
      min-width: 220px;
    }
    .search-filter-input:focus {
      outline: none;
      border-color: #38bdf8;
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
      <li><a href="data-model.html" class="active"><span>🕸️ 04. Data Model &amp; Metadata Graph</span><span class="nav-badge">Ontology</span></a></li>
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

  <!-- Main Content -->
  <main class="main-content">
    <header class="page-header">
      <div class="page-eyebrow">Chapitre 04 &bull; Modèle de Données Universel (GFPG) &amp; Ontologie Judiciaire</div>
      <h1>Graphe des Métadonnées, Ontologie Complète des Nœuds &amp; Persistance Polyglotte</h1>
      <p>
        Spécification formelle exhaustive des <strong>37 types de nœuds d'investigation</strong>, des <strong>47 types de relations directionnelles</strong>, de la hiérarchie territoriale algérienne et de la matrice d'attribution physique aux <strong>6 moteurs de bases de données</strong> de la plateforme (Neo4j, PostgreSQL/TimescaleDB, Qdrant, MinIO WORM, MongoDB, Redis).
      </p>
    </header>
'''

def build_section_1_svg_and_filters():
    svg_content = generate_svg_ontology()

    # Build domain filter buttons
    domain_buttons = []
    for d_key, d_info in DOMAINS.items():
        active_cls = " active" if d_key == "all" else ""
        btn = f'''<button class="onto-btn onto-domain-btn{active_cls}" data-domain="{d_key}" onclick="filterOntoDomain('{d_key}')">
          <span>{d_info['icon']}</span> {d_info['name']}
        </button>'''
        domain_buttons.append(btn)

    # Build DB filter buttons
    db_buttons = []
    for db_key, db_info in DATABASES.items():
        active_cls = " active" if db_key == "all" else ""
        btn = f'''<button class="onto-btn onto-db-btn{active_cls}" data-db="{db_key}" onclick="filterOntoDatabase('{db_key}')">
          <span style="color:{db_info['color']};">●</span> {db_info['name']}
        </button>'''
        db_buttons.append(btn)

    return f'''    <!-- ====================================================================
         SECTION 1: GRAPHE VISUEL MAÎTRE DE L'ONTOLOGIE & MÉTADONNÉES
         ==================================================================== -->
    <section>
      <h2 class="section-title">1. Graphe Visuel Maître de l'Ontologie Judiciaire &amp; Métadonnées (37 Nœuds &amp; 47 Relations)</h2>
      <p class="section-subtitle">
        Explorez visuellement l'ensemble des 37 types d'entités, leurs liaisons sémantiques et leur moteur de persistance dédié. Cliquez sur un nœud pour afficher son profil canonique complet, son exemple dans l'affaire Candy Wheels, ses attributs et ses règles de stockage.
      </p>

      <div style="background:#090e17;border:1px solid #1e293b;border-radius:12px;padding:1.25rem;margin-bottom:1.75rem;">
        
        <!-- Filter Bar 1: Operational Domains -->
        <div style="margin-bottom:0.75rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
            <strong style="font-size:0.75rem;text-transform:uppercase;color:#94a3b8;letter-spacing:0.5px;">Filtrer par Domaine d'Investigation :</strong>
            <span style="font-size:0.7rem;color:#64748b;">8 Domaines Opérationnels</span>
          </div>
          <div class="onto-filter-toolbar">
            {''.join(domain_buttons)}
          </div>
        </div>

        <!-- Filter Bar 2: Polyglot Database Engines -->
        <div style="margin-bottom:0.9rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.4rem;">
            <strong style="font-size:0.75rem;text-transform:uppercase;color:#38bdf8;letter-spacing:0.5px;">Filtrer par Moteur de Base de Données (Persistance) :</strong>
            <span style="font-size:0.7rem;color:#64748b;">6 Moteurs Polyglottes Spécialisés</span>
          </div>
          <div class="onto-filter-toolbar">
            {''.join(db_buttons)}
          </div>
        </div>

        <!-- Dynamic Filter Status Banner -->
        <div id="onto-filter-banner" style="background:#050912;border:1px dashed #24354f;border-radius:6px;padding:0.6rem 0.9rem;margin-bottom:1rem;">
          <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;">
            <span style="color:#cbd5e1;">Filtre Actif : <strong style="color:#38bdf8;">Tous les Domaines</strong> &bull; <strong style="color:#10b981;">Toutes les Bases de Données</strong></span>
            <span class="badge badge-blue" style="font-size:0.72rem;">37 Nœuds Visibles sur 37</span>
          </div>
        </div>

        <!-- Master Ontological SVG Canvas -->
        <div style="background:#040711;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.25rem;overflow-x:auto;">
          {svg_content}
        </div>

        <!-- Live Interactive Node Inspector Card -->
        <div id="ontology-detail-box" style="background:#060a14;border:1px solid #1e293b;border-radius:8px;padding:1.25rem;">
          <!-- Populated dynamically by selectOntologyEntity('personne') on load -->
        </div>

      </div>
    </section>
'''

def build_section_2_polyglot_matrix():
    return '''    <!-- ====================================================================
         SECTION 2: ARCHITECTURE DE PERSISTANCE POLYGLOTTE
         ==================================================================== -->
    <section>
      <h2 class="section-title">2. Architecture de Persistance Polyglotte &amp; Spécialisation des Bases de Données</h2>
      <p class="section-subtitle">
        Justifications physiques, algorithmiques et juridiques du partitionnement des données entre 6 moteurs de persistance complémentaires.
      </p>

      <div class="card" style="border-left:4px solid #f43f5e;margin-bottom:1.5rem;">
        <h3 style="color:#f43f5e;margin-bottom:0.5rem;">🎯 Pourquoi une Base de Données Unique est Inopérante en Cyber-Investigation</h3>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
          Une enquête judiciaire manipule des natures de données diamétralement opposées : des graphes récursifs multi-sauts, des séries temporelles massives de bornage cellulaire, des vecteurs biométriques d'embeddings, des scellés numériques binaires inaltérables, et des flux de scraping polymorphes sans schéma préalable.<br/>
          Une base relationnelle standard (ex: PostgreSQL) s'effondre en &gt;15 secondes dès le 3ème saut relationnel ; à l'inverse, une base graphe pure (Neo4j) n'est pas adaptée au stockage de téraoctets d'archives WARC ou d'enregistrements audio OPUS. <strong>Chaque donnée est assignée à son moteur physique optimal :</strong>
        </p>
      </div>

      <table class="tech-table">
        <thead>
          <tr>
            <th>Moteur de Persistance</th>
            <th>Nature des Données Prises en Charge</th>
            <th>Structure Physique &amp; Indexation</th>
            <th>Protocole &amp; Ports</th>
            <th>Justification Mathématique / Légale</th>
            <th>Latence SLA &amp; Capacité</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Neo4j 5.20+ Enterprise</strong><br/><span class="badge-ver">Graph Database</span></td>
            <td>Topologie criminelle, personnes, liens de parenté, co-implications, appels téléphoniques, transferts de fonds</td>
            <td>Pointeurs mémoire doublement chaînés (Index-Free Adjacency). Traversée de relation en $O(k)$ indépendamment de la taille globale du graphe.</td>
            <td>Protocole binaire Bolt v5.4<br/><code>Port 7687</code></td>
            <td>Permet le calcul en temps réel de centralité d'intermédiarité (Brandes) et la détection de cellules criminelles hermétiques (Louvain).</td>
            <td>Sub-5ms sur requêtes 5-sauts<br/>Capacité : 50 000+ nœuds à 60 FPS</td>
          </tr>
          <tr>
            <td><strong>PostgreSQL 16 + TimescaleDB</strong><br/><span class="badge-ver">Relational &amp; Time-Series</span></td>
            <td>Dossiers judiciaires, comptes enquêteurs, permissions RBAC Wilayas, CDRs d'antennes BTS, livre d'audit Merkle</td>
            <td>Tables relationnelles ACID strictes, Row-Level Security (RLS) cryptographique, Hypertables partitionnées par tranches de 24h.</td>
            <td>PostgreSQL Wire Protocol<br/><code>Port 5432</code></td>
            <td>Garantit la non-répudiation des actes de procédure (Article 68 CPP algérien) et l'intégrité référentielle absolue des registres de scellés.</td>
            <td>&lt;1ms sur requêtes d'affaires<br/>Insertion de 80k CDRs/sec</td>
          </tr>
          <tr>
            <td><strong>Qdrant 1.9 (Rust)</strong><br/><span class="badge-ver">Vector Database</span></td>
            <td>Embeddings faciaux ArcFace (512-d), empreintes vocales PyAnnote 3.1 (192-d), vecteurs sémantiques d'annonces scam</td>
            <td>Graphe de proximité hiérarchique HNSW (Hierarchical Navigable Small World) avec métrique de distance cosinus SIMD et filtrage par métadonnées de dossier.</td>
            <td>gRPC over HTTP/2 (Protobuf v3)<br/><code>Port 6334</code></td>
            <td>Rapprochement biométrique 1-to-N ultra-rapide sans déperdition de précision (FAR &lt; 0.001%) tout en respectant le secret de l'instruction (100% on-premise).</td>
            <td>&lt;8ms sur collection de 2M vecteurs<br/>Quantification scalaire mémoire</td>
          </tr>
          <tr>
            <td><strong>MinIO Enterprise S3</strong><br/><span class="badge-ver">Object Storage WORM</span></td>
            <td>Scellés numériques légaux, images de disques durs E01/RAW, archives web WARC ISO 28500, fichiers audio WhatsApp originaux, rapports PDF/A-3b</td>
            <td>Système de stockage d'objets avec verrouillage S3 Object Lock en mode COMPLIANCE strict et horodatage RFC 3161.</td>
            <td>Amazon S3 REST API (HTTPS)<br/><code>Port 9000</code></td>
            <td>Conformité stricte à la norme ISO 27037 : interdiction cryptographique et matérielle d'effacer ou de modifier un scellé pendant 10 ans.</td>
            <td>Débit continu jusqu'à 2.5 Go/s<br/>Erasure Coding 16 disques</td>
          </tr>
          <tr>
            <td><strong>MongoDB 7.0 WiredTiger</strong><br/><span class="badge-ver">Document BSON Store</span></td>
            <td>Dépotoir sans schéma des 76 briques OSINT, arbres syntaxiques DOM des fausses boutiques, réponses brutes d'APIs tierces, profils Telegram</td>
            <td>Dépôt polymorphe BSON avec compression par bloc Snappy (gain de 70% d'espace disque) et Change Streams réactifs.</td>
            <td>MongoDB Wire Protocol TCP<br/><code>Port 27017</code></td>
            <td>Absorbe les variations imprévisibles de structure des données extraites du web sans jamais faire échouer le pipeline d'ingestion.</td>
            <td>35 000 écritures BSON / sec<br/>Schema-on-read instantané</td>
          </tr>
          <tr>
            <td><strong>Redis 7.2 Stack</strong><br/><span class="badge-ver">In-Memory Cache &amp; Bus</span></td>
            <td>Sessions actives, verrous distribués Redlock, files Celery prioritaires, flux temps réel WebSockets du Studio, quotas anti-ban Token-Bucket</td>
            <td>Structures de données en mémoire vive avec persistance AOF (Append-Only File) et exécution de scripts Lua atomiques.</td>
            <td>Protocole RESP3 over TCP<br/><code>Port 6379</code></td>
            <td>Fournit une latence sub-milliseconde indispensable pour rafraîchir le canvas NVL WebGL à 60 FPS dès la découverte d'un indice sur le terrain.</td>
            <td>120 000 opérations / sec<br/>Latence P99 &lt; 0.5 milliseconde</td>
          </tr>
        </tbody>
      </table>
    </section>
'''

def build_section_3_nodes_catalog():
    rows = []
    for node_id, node in NODES.items():
        dom_info = DOMAINS[node['domain']]
        props_str = ", ".join([f"<code>{p['name']}</code>" for p in node['schemaProps'][:3]])
        if len(node['schemaProps']) > 3:
            props_str += f" <em>(+{len(node['schemaProps']) - 3} autres)</em>"

        gps_badge = '<br/><span class="badge" style="background:rgba(16,185,129,0.12);color:#34d399;border:1px solid #10b981;font-size:0.65rem;margin-top:3px;display:inline-block;">📍 Carte SIG (GPS)</span>' if node.get('gpsPlottable') else ''
        rows.append(f'''        <tr data-category="{node['domain']}">
          <td><strong>{node['icon']} {node['label']}</strong><br/><span style="color:#94a3b8;font-size:0.73rem;font-family:monospace;">(:{node['label']})</span>{gps_badge}</td>
          <td><span class="badge" style="background:rgba(255,255,255,0.06);color:{dom_info['color']};border:1px solid {dom_info['color']};font-size:0.7rem;">{dom_info['name']}</span></td>
          <td>{node['plainMeaning']}</td>
          <td>{props_str}</td>
          <td><span class="badge badge-blue" style="font-size:0.7rem;font-family:monospace;">{node['dbBadge']}</span></td>
          <td><span style="color:#34d399;font-weight:600;font-size:0.75rem;">&lt; 5 ms</span></td>
        </tr>''')

    return f'''    <!-- ====================================================================
         SECTION 3: DICTIONNAIRE EXHAUSTIF DES 37 TYPES DE NŒUDS
         ==================================================================== -->
    <section>
      <h2 class="section-title">3. Dictionnaire Exhaustif des 37 Types de Nœuds (Ontologie Canonique GFPG)</h2>
      <p class="section-subtitle">
        Inventaire détaillé des 37 sommets du modèle de données d'Athar DZ, de leurs clés canoniques et de leur moteur de persistance attitré.
      </p>

      <div class="search-filter-box">
        <input type="text" id="node-search-input" class="search-filter-input" placeholder="🔍 Rechercher un type de nœud (ex: Personne, BaridiMob, CDR, APK, Wilaya)..." onkeyup="filterTable('node-search-input', 'nodes-catalog-table', 'node-domain-select')" />
        <select id="node-domain-select" class="search-filter-input" style="max-width:260px;" onchange="filterTable('node-search-input', 'nodes-catalog-table', 'node-domain-select')">
          <option value="all">Tous les Domaines (8 Catégories)</option>
          <option value="territory">1. Judiciaire &amp; Territoire DZ</option>
          <option value="actors">2. Personnes &amp; Entités Morales</option>
          <option value="telecom">3. Télécoms &amp; Forensique Mobile</option>
          <option value="finance">4. Finances &amp; BaridiMob</option>
          <option value="socmint">5. SOCMINT, Web &amp; Trackers</option>
          <option value="cyber">6. Cyber &amp; Malwares</option>
          <option value="biometrics">7. Biométrie &amp; Médias</option>
          <option value="legal">8. Chaîne de Preuve &amp; WORM</option>
        </select>
      </div>

      <table class="tech-table" id="nodes-catalog-table">
        <thead>
          <tr>
            <th>Type d'Entité &amp; Label Cypher</th>
            <th>Domaine Opérationnel</th>
            <th>Rôle &amp; Définition Judiciaire</th>
            <th>Attributs Canoniques Clés</th>
            <th>Moteur de Stockage Dédié</th>
            <th>Latence SLA</th>
          </tr>
        </thead>
        <tbody>
          {''.join(rows)}
        </tbody>
      </table>
    </section>
'''

def build_section_4_relationships_catalog():
    rows = []
    for rel in RELATIONSHIPS:
        src_node = NODES[rel['source']]
        tgt_node = NODES[rel['target']]
        rows.append(f'''        <tr>
          <td><strong>{src_node['icon']} {src_node['label']}</strong></td>
          <td><code style="color:#38bdf8;font-weight:700;font-size:0.77rem;">[:{rel['edge']}]</code></td>
          <td><strong>{tgt_node['icon']} {tgt_node['label']}</strong></td>
          <td><span class="badge badge-purple" style="font-size:0.7rem;">{rel['cardinality']}</span></td>
          <td><span style="font-family:monospace;font-size:0.74rem;color:#cbd5e1;">{rel['props']}</span></td>
          <td>{rel['desc']}</td>
        </tr>''')

    return f'''    <!-- ====================================================================
         SECTION 4: DICTIONNAIRE EXHAUSTIF DES 47+ RELATIONS DIRECTIONNELLES
         ==================================================================== -->
    <section>
      <h2 class="section-title">4. Dictionnaire Exhaustif des 47+ Relations Directionnelles (Arêtes Graphe)</h2>
      <p class="section-subtitle">
        Typologie formelle des arêtes orientées et pondérées reliant les entités, propriétés temporelles portées et sémantique criminalistique.
      </p>

      <div class="search-filter-box">
        <input type="text" id="rel-search-input" class="search-filter-input" placeholder="🔍 Filtrer les relations par nom ou nœud (ex: VIREMENT, BORNE, COMMUNIQUE, MALWARE)..." onkeyup="filterTable('rel-search-input', 'relations-catalog-table', null)" />
      </div>

      <table class="tech-table" id="relations-catalog-table">
        <thead>
          <tr>
            <th>Nœud Source</th>
            <th>Type d'Arête Cypher</th>
            <th>Nœud Cible</th>
            <th>Cardinalité</th>
            <th>Propriétés Portées par l'Arête</th>
            <th>Signification &amp; Rôle Procédural</th>
          </tr>
        </thead>
        <tbody>
          {''.join(rows)}
        </tbody>
      </table>
    </section>
'''

def build_section_5_algerian_hierarchy_and_styling():
    return '''    <!-- ====================================================================
         SECTION 5: HIÉRARCHIE TERRITORIALE ALGÉRIENNE & ATTRIBUTS DÉRIVÉS
         ==================================================================== -->
    <section>
      <h2 class="section-title">5. Hiérarchie Territoriale Algérienne &amp; Attributs d'Intelligence Criminelle Dérivés</h2>
      <p class="section-subtitle">
        Modélisation formelle de l'ancrage juridictionnel algérien (Wilaya, Daïra, Commune, Unité, Affaire) et calcul en temps réel des attributs d'intelligence criminelle (GDS 2.6).
      </p>

      <!-- 5.1 Algerian Administrative & Judicial Hierarchy Ontological Subgraph -->
      <div class="card" style="border-left:4px solid var(--accent-emerald);margin-bottom:1.5rem;">
        <div class="card-title"><span>🇩🇿</span> 5.1 Sous-Graphe Ontologique de l'Organisation Judiciaire Algérienne</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Chaque dossier criminel (<code>Affaire</code>) est obligatoirement ancré dans l'arborescence juridictionnelle et administrative algérienne, permettant le filtrage territorial en cascade (<code>/all_wilaya</code>, <code>/dairas/</code>, <code>/communes/</code>, <code>/all_affaire_types/</code>) et le respect de la compétence territoriale du Code de Procédure Pénale :
        </p>

        <!-- SVG Administrative Hierarchy -->
        <div style="background:#090d16;padding:1rem;border-radius:8px;margin-bottom:0.75rem;overflow-x:auto;">
          <svg viewBox="0 0 850 110" style="min-width:750px;width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-green" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981" />
              </marker>
            </defs>
            <!-- Nodes -->
            <g transform="translate(20, 25)">
              <rect width="130" height="55" rx="8" fill="#132338" stroke="#38bdf8" stroke-width="1.5" />
              <text x="65" y="24" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">🏛️ Wilaya (58)</text>
              <text x="65" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">code_wilaya (01..58)</text>
            </g>

            <line x1="150" y1="52" x2="190" y2="52" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)" />
            <text x="170" y="44" fill="#10b981" font-size="8" font-family="monospace" text-anchor="middle">appartient</text>

            <g transform="translate(190, 25)">
              <rect width="130" height="55" rx="8" fill="#132338" stroke="#38bdf8" stroke-width="1.5" />
              <text x="65" y="24" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">🏘️ Daira</text>
              <text x="65" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">id_daira, nom_ar</text>
            </g>

            <line x1="320" y1="52" x2="360" y2="52" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)" />
            <text x="340" y="44" fill="#10b981" font-size="8" font-family="monospace" text-anchor="middle">appartient</text>

            <g transform="translate(360, 25)">
              <rect width="130" height="55" rx="8" fill="#132338" stroke="#38bdf8" stroke-width="1.5" />
              <text x="65" y="24" fill="#38bdf8" font-size="11" font-weight="bold" text-anchor="middle">📍 Commune</text>
              <text x="65" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">code_postal (1541)</text>
            </g>

            <line x1="490" y1="52" x2="530" y2="52" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)" />
            <text x="510" y="44" fill="#10b981" font-size="8" font-family="monospace" text-anchor="middle">situer</text>

            <g transform="translate(530, 25)">
              <rect width="130" height="55" rx="8" fill="#142e2b" stroke="#10b981" stroke-width="1.5" />
              <text x="65" y="24" fill="#10b981" font-size="11" font-weight="bold" text-anchor="middle">🏢 Unité (PJ / GN)</text>
              <text x="65" y="42" fill="#94a3b8" font-size="9" text-anchor="middle">type_unite, brigade</text>
            </g>

            <line x1="660" y1="52" x2="700" y2="52" stroke="#10b981" stroke-width="2" marker-end="url(#arr-green)" />
            <text x="680" y="44" fill="#10b981" font-size="8" font-family="monospace" text-anchor="middle">Traiter</text>

            <g transform="translate(700, 25)">
              <rect width="130" height="55" rx="8" fill="#2b1a14" stroke="#f97316" stroke-width="2" />
              <text x="65" y="24" fill="#f97316" font-size="11" font-weight="bold" text-anchor="middle">📁 Affaire Pénale</text>
              <text x="65" y="42" fill="#fed7aa" font-size="9" text-anchor="middle">num_parquet, statut</text>
            </g>
          </svg>
        </div>
      </div>

      <!-- 5.2 Forensic Entity Styling Specification -->
      <div class="card" style="border-left:4px solid var(--accent-blue);margin-bottom:1.5rem;">
        <div class="card-title"><span>🎨</span> 5.2 Spécification des Styles des Nœuds du Studio (config_style.json)</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Conformément au moteur <code>@neo4j-nvl/react</code> et à la charte graphique de <code>frontend-master</code>, chaque entité possède une couleur de remplissage, un diamètre et une icône normalisée :
        </p>

        <table class="tech-table">
          <thead>
            <tr>
              <th>Type d'Entité</th>
              <th>Couleur Hexadécimale</th>
              <th>Diamètre Standard</th>
              <th>Icône Système (/public/icon/)</th>
              <th>Attribut d'Affichage Principal (labelKey)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Personne / Suspect</strong></td>
              <td><span style="color:#f43f5e;font-weight:700;">#f43f5e (Rose / Rouge)</span></td>
              <td><code>130px - 140px</code></td>
              <td><code>/icon/Personne.png</code></td>
              <td><code>nom_complet</code> ou <code>alias</code></td>
            </tr>
            <tr>
              <td><strong>Numéro Téléphone</strong></td>
              <td><span style="color:#f97316;font-weight:700;">#f97316 (Orange)</span></td>
              <td><code>110px</code></td>
              <td><code>/icon/Telephone.png</code></td>
              <td><code>numero_e164</code> (ex: +213555...)</td>
            </tr>
            <tr>
              <td><strong>Compte Bancaire / BaridiMob</strong></td>
              <td><span style="color:#eab308;font-weight:700;">#eab308 (Or / Ambre)</span></td>
              <td><code>115px</code></td>
              <td><code>/icon/BaridiMob.png</code></td>
              <td><code>rip_algerie_poste</code> (20 digits)</td>
            </tr>
            <tr>
              <td><strong>Compte Réseau Social</strong></td>
              <td><span style="color:#0ea5e9;font-weight:700;">#0ea5e9 (Cyan / Bleu)</span></td>
              <td><code>105px</code></td>
              <td><code>/icon/Social.png</code></td>
              <td><code>pseudo_reseau</code> (@...)</td>
            </tr>
            <tr>
              <td><strong>Note Vocale / Audio</strong></td>
              <td><span style="color:#10b981;font-weight:700;">#10b981 (Émeraude)</span></td>
              <td><code>100px</code></td>
              <td><code>/icon/Audio.png</code></td>
              <td><code>duree_et_locuteur</code></td>
            </tr>
            <tr>
              <td><strong>Véhicule</strong></td>
              <td><span style="color:#8b5cf6;font-weight:700;">#8b5cf6 (Violet)</span></td>
              <td><code>110px</code></td>
              <td><code>/icon/Vehicule.png</code></td>
              <td><code>immatriculation_dz</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 5.3 Derived Criminal Intelligence Attributes -->
      <div class="card" style="border-left:4px solid var(--accent-purple);">
        <div class="card-title"><span>🏷️</span> 5.3 Attributs Dérivés d'Intelligence Criminelle (Calculés en Temps Réel)</div>
        <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.75rem;">
          Le moteur analytique <code>PIC-main</code> calcule et écrit directement sur les nœuds du graphe des attributs d'aide à la décision judiciaire, affichés sous forme de badges sur le canvas NVL :
        </p>

        <div style="background:#090d16;padding:1rem;border-radius:8px;font-size:0.8rem;color:#cbd5e1;line-height:1.6;">
          <ul style="padding-left:1.2rem;margin:0;">
            <li><code style="color:#a855f7;">_Lvl_of_Implications</code> : Tableau d'entiers <code>[1, 2, 3]</code> mesurant le niveau d'implication directe ou indirecte du suspect à travers les sauts de graphe de l'affaire.</li>
            <li><code style="color:#a855f7;">_class</code> : Tableau de classification pénale automatique : <code>['neutre']</code>, <code>['operationeel']</code> (homme de main/opérateur terrain), <code>['soutien']</code> (fournisseur logistique, puces SIM, prête-nom), ou <code>['leader']</code> (cerveau / donneur d'ordre).</li>
            <li><code style="color:#a855f7;">_betweennessCentrality</code> : Valeur flottante normalisée entre <code>0.0</code> et <code>1.0</code> via GDS Brandes. Détecte les pivots indispensables au fonctionnement du syndicat criminel.</li>
            <li><code style="color:#a855f7;">_comune_Activite</code>, <code style="color:#a855f7;">_daira_activiti</code>, <code style="color:#a855f7;">_wiliya_Activiti</code> : Rayon d'action géographique calculé automatiquement par projection spatio-temporelle des bornages télécoms et retraits GAB du suspect.</li>
          </ul>
        </div>
      </div>
    </section>
'''

def build_section_6_gfpg_spec():
    return '''    <!-- ====================================================================
         SECTION 6: MODÈLE UNIVERSEL GÉNÉRALISÉ GFPG
         ==================================================================== -->
    <section>
      <h2 class="section-title">6. Modèle Universel Généralisé (GFPG : Generalized Forensic Property Graph)</h2>
      <p class="section-subtitle">
        Formalisation mathématique du graphe criminalistique étendu aux contraintes probatoires, fenêtres temporelles et scellements WORM.
      </p>

      <div style="background:#090d16;border:1px solid #1e293b;border-radius:8px;padding:1.25rem;margin-bottom:1.5rem;font-size:0.83rem;color:#cbd5e1;line-height:1.6;">
        <h4 style="color:#38bdf8;margin:0 0 0.5rem;font-size:0.95rem;">Définition Formelle du Graphe Forensique</h4>
        <p style="margin-bottom:0.75rem;">
          Un graphe d'enquête forensique $\\mathcal{G}_{GFPG}$ est un 8-uplet mathématique :
        </p>
        <div style="background:#050811;padding:0.75rem;border-radius:6px;border:1px solid #23344d;font-family:monospace;color:#f8fafc;margin-bottom:0.75rem;font-size:0.85rem;">
          G = (V, E, &lambda;<sub>V</sub>, &lambda;<sub>E</sub>, &mu;<sub>V</sub>, &mu;<sub>E</sub>, &tau;, &sigma;)
        </div>
        <ul style="padding-left:1.2rem;margin:0;">
          <li><strong>V</strong> : Ensemble des 37 types de sommets d'investigation (Personnes, Téléphones, RIPs, etc.).</li>
          <li><strong>E</strong> : Ensemble des 47+ types d'arêtes relationnelles orientées.</li>
          <li><strong>&lambda;<sub>V</sub> : V &rarr; Labels</strong> : Fonction d'étiquetage typologique des sommets.</li>
          <li><strong>&lambda;<sub>E</sub> : E &rarr; Types</strong> : Fonction d'étiquetage des relations.</li>
          <li><strong>&mu;<sub>V</sub>, &mu;<sub>E</sub></strong> : Fonctions d'attribution des propriétés clés/valeurs.</li>
          <li><strong>&tau; = [t<sub>start</sub>, t<sub>end</sub>]</strong> : Fenêtre d'intervalle de validité chronologique de chaque indice.</li>
          <li><strong>&sigma; = SHA256(V, E)</strong> : Empreinte de scellement cryptographique WORM garantissant la non-altération devant la cour d'assises.</li>
        </ul>
      </div>

      <!-- Concrete Cypher Production Script Example -->
      <div class="card" style="border-left:4px solid var(--accent-cyan);">
        <div class="card-title"><span>💻</span> Requête Cypher d'Investigation Réelle (Candy Wheels)</div>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.5rem;">
          Exemple de requête Cypher exécutée via Bolt v5 traversant les 5 sauts entre l'annonce Facebook, la mule BaridiMob et le chef de réseau :
        </p>
        <pre style="background:#040711;border:1px solid #1e293b;border-radius:6px;padding:1rem;color:#e2e8f0;font-size:0.75rem;line-height:1.5;overflow-x:auto;"><code>// Requête de démasquage du cerveau criminel derrière une fausse annonce de pneus
MATCH (post:Publication_Sociale {id_post: "fb_ad_981240"})
MATCH (post)-[:RETOURN_VERS_SITE_WEB]->(site:Site_Web)
MATCH (site)-[:EMBARQUE_PIXEL_TRACKER]->(pixel:Identifiant_Infrastructure)
MATCH (twin_site:Site_Web)-[:EMBARQUE_PIXEL_TRACKER]->(pixel)
MATCH (twin_site)-[:DISTRIBUE_APPLICATION_APK]->(apk:Fichier_APK)
MATCH (apk)-[:CIBLE_COMPTE_BARIDIMOB]->(compte:Compte_Bancaire)
MATCH (compte)-[:EFFECTUE_VIREMENT_VERS]->(mule_compte:Compte_Bancaire)
MATCH (mule_personne:Personne)-[:DETIENT_COMPTE_BANCAIRE]->(mule_compte)
MATCH (mule_personne)-[:COMMUNIQUE_AVEC*1..2]->(leader:Personne {_class: 'leader'})
RETURN post, site, pixel, twin_site, apk, compte, mule_compte, mule_personne, leader;</code></pre>
      </div>
    </section>
'''

def get_html_footer():
    return '''  </main>

  <script src="assets/app.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof selectOntologyEntity === 'function') {
        selectOntologyEntity('personne');
      }
    });
  </script>
</body>
</html>
'''

def build_data_model_html():
    print("Building comprehensive doc/data-model.html...")
    
    # 1. Update app.js first
    update_app_js()
    
    # 2. Build full HTML
    html = (
        get_html_head()
        + build_section_1_svg_and_filters()
        + build_section_2_polyglot_matrix()
        + build_section_3_nodes_catalog()
        + build_section_4_relationships_catalog()
        + build_section_5_algerian_hierarchy_and_styling()
        + build_section_6_gfpg_spec()
        + get_html_footer()
    )
    
    output_path = os.path.join(os.path.dirname(current_dir), "doc", "data-model.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"Successfully generated {output_path} ({len(html)} bytes with all 37 nodes, 47 relations, and 6 DB mappings).")
    return html

if __name__ == "__main__":
    build_data_model_html()
