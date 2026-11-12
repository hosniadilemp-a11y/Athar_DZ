#!/usr/bin/env python3
"""
Updates doc/maquette.html and doc/assets/maquette-i18n.js to implement:
1. Left Panel Accordion Menu (4 sections: Layers, Node & Link Creation Toolbox, Nature Filters, Guided Queries).
2. Complete Drag & Drop Toolbox for all 37 Forensic Node Types across 8 Domains.
3. Manual Link Creation Mode (Edge connector between any two nodes with 47 GFPG relations).
4. Circular Icon Node presentation on the Canvas (56px circles, Lucide SVGs, layer halos, hypothesis dashed ring, external labels).
"""

import os
import re
import sys

# Load node and relationship definitions
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "scripts"))
import data_model_definitions as dmd

# Mapping of all 37 node types to their canonical Lucide SVG paths (20x20 currentColor)
LUCIDE_ICONS = {
    "landmark": '<line x1="2" x2="22" y1="22" y2="22"/><line x1="12" x2="12" y1="2" y2="10"/><path d="M4 22V10l8-8 8 8v12"/><path d="M18 22V12"/><path d="M6 22V12"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "map": '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
    "shield": '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    "folder-archive": '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="2"/><path d="M12 15v3"/>',
    "scale": '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    "user": '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    "building-2": '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>',
    "car": '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "credit-card": '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    "smartphone": '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
    "radio": '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19.1"/>',
    "activity": '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    "wallet": '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    "arrow-right-left": '<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',
    "banknote": '<rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
    "boxes": '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l6 3.43a2 2 0 0 0 1.97 0l6-3.43a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L11 9.49a2 2 0 0 0-1.97 0z"/><path d="m7 16.5 5 2.86 5-2.86"/><path d="M12 2v7.5"/>',
    "git-commit": '<circle cx="12" cy="12" r="3"/><line x1="3" x2="9" y1="12" y2="12"/><line x1="15" x2="21" y1="12" y2="12"/>',
    "at-sign": '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    "message-square": '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    "send": '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    "message-circle": '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "globe": '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    "hash": '<line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/>',
    "file-code": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><polyline points="10 13 8 15 10 17"/><polyline points="14 13 16 15 14 17"/>',
    "server": '<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
    "key": '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    "hard-drive": '<line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "mic": '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',
    "scan-face": '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="9" cy="9" r="1"/><circle cx="15" cy="9" r="1"/><path d="M10 14h4"/>',
    "image": '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    "file-text": '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/>',
    "lock": '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    "binary": '<rect x="14" y="14" width="4" height="6" rx="2"/><rect x="6" y="4" width="4" height="6" rx="2"/><path d="M6 20h4"/><path d="M14 10h4"/><path d="M6 14h2v6"/><path d="M14 4h2v6"/>'
}

NODE_TO_ICON_NAME = {
    "wilaya": "landmark",
    "daira": "map-pin",
    "commune": "map",
    "unite": "shield",
    "affaire": "folder-archive",
    "magistrat": "scale",
    "personne": "user",
    "entreprise": "building-2",
    "vehicule": "car",
    "telephone": "phone",
    "carte_sim": "credit-card",
    "appareil_mobile": "smartphone",
    "antenne_bts": "radio",
    "telecom_cdr": "activity",
    "compte_bancaire": "wallet",
    "transaction_financiere": "arrow-right-left",
    "guichet_gab": "banknote",
    "crypto_wallet": "boxes",
    "transaction_crypto": "git-commit",
    "compte_social": "at-sign",
    "publication_sociale": "message-square",
    "canal_telegram": "send",
    "message_chat": "message-circle",
    "adresse_email": "mail",
    "site_web": "globe",
    "identifiant_infrastructure": "hash",
    "fichier_apk": "file-code",
    "serveur_c2": "server",
    "certificat_tls": "key",
    "artefact_dfir": "hard-drive",
    "session_recherche": "search",
    "enregistrement_vocal": "mic",
    "empreinte_faciale": "scan-face",
    "image_preuve": "image",
    "document_judiciaire": "file-text",
    "scelle_numerique": "lock",
    "preuve_merkle": "binary"
}

def render_lucide_svg(icon_name, size=16, extra_class=""):
    paths = LUCIDE_ICONS.get(icon_name, LUCIDE_ICONS["shield"])
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{extra_class}">{paths}</svg>'

def build_accordion_toolbox_html():
    """Generates the Accordion Left Panel with 4 sections including the 37-node drag-and-drop toolbox."""
    
    # Generate 37 draggable node items
    node_items = []
    for node_id, node in dmd.NODES.items():
        icon_name = NODE_TO_ICON_NAME.get(node_id, "shield")
        icon_svg = render_lucide_svg(icon_name, 14)
        node_items.append(f'''              <div class="node-drag-item" data-node-type="{node_id}" data-domain="{node['domain']}" draggable="true" ondragstart="handleNodeDragStart(event, '{node_id}')" title="Glisser vers le canevas : {node['name']}">
                <div class="node-drag-meta">
                  <span class="node-drag-icon">{icon_svg}</span>
                  <span style="font-size:12px;font-weight:500;">{node['label']}</span>
                </div>
                <span class="node-drag-db-badge">{node['dbBadge'].split('/')[0].strip()}</span>
              </div>''')

    toolbox_items_html = "\n".join(node_items)

    return f'''      <!-- Left Panel: 240px, Collapsible Accordion Navigation -->
      <aside class="panel-left" id="panel-left" aria-label="Panneau accordéon des calques, outils et filtres">
        
        <!-- Accordion Item 1: Calques d'Investigation -->
        <div class="accordion-group">
          <button type="button" class="accordion-header-btn" id="acc-btn-layers" aria-expanded="true" aria-controls="acc-panel-layers" onclick="toggleAccordion('layers')">
            <div class="accordion-title-left">
              {render_lucide_svg('layers', 14)}
              <span data-i18n="nav_layers_title">Calques d'Enquête</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <span class="chip chip-neutral font-mono text-xs">4/4</span>
              <span class="accordion-chevron-icon">{render_lucide_svg('chevron-down', 12)}</span>
            </div>
          </button>
          <div class="accordion-panel-content is-open" id="acc-panel-layers" role="region" aria-labelledby="acc-btn-layers">
            <div class="layer-list" role="list">
              <button type="button" class="layer-row-item layer-1" role="listitem" onclick="setScreen(2)" aria-label="Calque 1: Preuves Scellées">
                <div class="layer-meta">
                  {render_lucide_svg('lock', 13, 'text-success')}
                  <span data-i18n="layer_1_verified">1. Preuves Scellées</span>
                </div>
                <span class="chip chip-neutral font-mono text-xs">2</span>
              </button>
              <button type="button" class="layer-row-item layer-2" role="listitem" onclick="setScreen(2)" aria-label="Calque 2: Découvertes OSINT">
                <div class="layer-meta">
                  {render_lucide_svg('globe', 13, 'text-info')}
                  <span data-i18n="layer_2_osint">2. Découvertes OSINT</span>
                </div>
                <span class="chip chip-neutral font-mono text-xs">3</span>
              </button>
              <button type="button" class="layer-row-item layer-3" role="listitem" onclick="setScreen(2)" aria-label="Calque 3: Infrastructure">
                <div class="layer-meta">
                  {render_lucide_svg('server', 13)}
                  <span data-i18n="layer_3_infra">3. Infrastructure &amp; Pivots</span>
                </div>
                <span class="chip chip-neutral font-mono text-xs">2</span>
              </button>
              <button type="button" class="layer-row-item layer-4" role="listitem" onclick="setScreen(2)" aria-label="Calque 4: Hypothèses IA">
                <div class="layer-meta">
                  {render_lucide_svg('sparkles', 13, 'text-hypothesis')}
                  <span data-i18n="layer_4_hypothesis">4. Hypothèses IA</span>
                </div>
                <span class="chip chip-neutral font-mono text-xs">1</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Accordion Item 2: Boîte à Outils de Création de Nœuds (Drag & Drop) & Liaisons -->
        <div class="accordion-group">
          <button type="button" class="accordion-header-btn" id="acc-btn-toolbox" aria-expanded="true" aria-controls="acc-panel-toolbox" onclick="toggleAccordion('toolbox')">
            <div class="accordion-title-left">
              {render_lucide_svg('plus-circle', 14, 'text-info')}
              <span>Création &amp; Liaisons</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <span class="chip chip-neutral font-mono text-xs">37</span>
              <span class="accordion-chevron-icon">{render_lucide_svg('chevron-down', 12)}</span>
            </div>
          </button>
          <div class="accordion-panel-content is-open" id="acc-panel-toolbox" role="region" aria-labelledby="acc-btn-toolbox">
            
            <!-- Link Creation Mode Toggle -->
            <button type="button" class="link-tool-btn" id="btn-toggle-link-mode" onclick="toggleLinkCreationMode()" aria-pressed="false" title="Cliquer pour connecter deux nœuds sur le canevas">
              {render_lucide_svg('link-2', 13)}
              <span id="link-tool-btn-label">Mode Création de Liaison</span>
            </button>

            <!-- 8 Domain Category Filters -->
            <div class="toolbox-domain-selector" role="tablist" aria-label="Filtrer les entités par domaine">
              <button type="button" class="toolbox-domain-chip active" data-toolbox-domain="all" onclick="filterToolboxDomain('all')">Tous</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="territory" onclick="filterToolboxDomain('territory')">Territoire</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="actors" onclick="filterToolboxDomain('actors')">Acteurs</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="telecom" onclick="filterToolboxDomain('telecom')">Télécoms</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="finance" onclick="filterToolboxDomain('finance')">Finances</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="socmint" onclick="filterToolboxDomain('socmint')">SOCMINT</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="cyber" onclick="filterToolboxDomain('cyber')">Cyber</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="biometrics" onclick="filterToolboxDomain('biometrics')">Biométrie</button>
              <button type="button" class="toolbox-domain-chip" data-toolbox-domain="legal" onclick="filterToolboxDomain('legal')">Preuve</button>
            </div>

            <div style="font-size:11px;color:var(--color-neutral-400);margin-bottom:6px;display:flex;justify-content:space-between;align-items:center;">
              <span>Glisser l'élément vers le canevas :</span>
              <span class="font-mono" id="toolbox-count-label">37 types</span>
            </div>

            <!-- Drag & Drop Node Items List -->
            <div class="toolbox-nodes-grid" id="toolbox-nodes-grid" role="list">
{toolbox_items_html}
            </div>
          </div>
        </div>

        <!-- Accordion Item 3: Filtres par Nature & Statut -->
        <div class="accordion-group">
          <button type="button" class="accordion-header-btn" id="acc-btn-filters" aria-expanded="false" aria-controls="acc-panel-filters" onclick="toggleAccordion('filters')">
            <div class="accordion-title-left">
              {render_lucide_svg('filter', 14)}
              <span data-i18n="nav_filters_title">Filtres par Nature</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <span class="chip chip-neutral font-mono text-xs">8</span>
              <span class="accordion-chevron-icon">{render_lucide_svg('chevron-down', 12)}</span>
            </div>
          </button>
          <div class="accordion-panel-content" id="acc-panel-filters" role="region" aria-labelledby="acc-btn-filters">
            <div class="filter-chips-grid">
              <button type="button" class="filter-btn active" data-filter="all"><span data-i18n="filter_all">Tous</span> (8)</button>
              <button type="button" class="filter-btn" data-filter="phone"><span data-i18n="filter_phone">Téléphonie</span> (1)</button>
              <button type="button" class="filter-btn" data-filter="social"><span data-i18n="filter_social">Réseaux</span> (3)</button>
              <button type="button" class="filter-btn" data-filter="web"><span data-i18n="filter_web">Web / Serveurs</span> (2)</button>
              <button type="button" class="filter-btn" data-filter="person"><span data-i18n="filter_person">Sujets</span> (1)</button>
            </div>
          </div>
        </div>

        <!-- Accordion Item 4: Requêtes Guidées & Questions Métier -->
        <div class="accordion-group">
          <button type="button" class="accordion-header-btn" id="acc-btn-queries" aria-expanded="false" aria-controls="acc-panel-queries" onclick="toggleAccordion('queries')">
            <div class="accordion-title-left">
              {render_lucide_svg('help-circle', 14)}
              <span>Questions Métier</span>
            </div>
            <div style="display:flex;align-items:center;gap:4px;">
              <span class="chip chip-neutral font-mono text-xs">Cypher</span>
              <span class="accordion-chevron-icon">{render_lucide_svg('chevron-down', 12)}</span>
            </div>
          </button>
          <div class="accordion-panel-content" id="acc-panel-queries" role="region" aria-labelledby="acc-btn-queries">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button type="button" class="btn btn-ghost btn-sm btn-align-start w-full text-xs" onclick="runSimulatedQuery('Qui encaisse l\'argent BaridiMob ?')">
                {render_lucide_svg('wallet', 12, 'text-warning')} Qui encaisse l'argent ?
              </button>
              <button type="button" class="btn btn-ghost btn-sm btn-align-start w-full text-xs" onclick="runSimulatedQuery('Téléphones et puces communs ?')">
                {render_lucide_svg('phone', 12, 'text-info')} Téléphones communs ?
              </button>
              <button type="button" class="btn btn-ghost btn-sm btn-align-start w-full text-xs" onclick="runSimulatedQuery('Bornages suspects dans la Daïra ?')">
                {render_lucide_svg('radio', 12, 'text-success')} Bornages suspects Oran ?
              </button>
            </div>
          </div>
        </div>

        <!-- Bottom Audit Ledger Button (Fixed Footer) -->
        <div class="panel-left-footer">
          <button type="button" class="btn btn-secondary btn-sm w-full btn-align-start" onclick="setScreen(5)" aria-label="Consulter le registre d'audit forensique">
            {render_lucide_svg('history', 14)}
            <span data-i18n="nav_history_btn">Registre d'Audit Forensique</span>
          </button>
        </div>
      </aside>'''

def build_circular_nodes_canvas_html():
    """Generates the circular nodes on the canvas instead of rectangular cards."""
    
    # 8 Circular Nodes for the mock case
    nodes_html = f'''            <!-- Active Link Creation Banner -->
            <div class="canvas-connection-banner" id="canvas-connection-banner">
              {render_lucide_svg('link-2', 15, 'text-warning')}
              <span id="canvas-connection-text"><strong>Mode Liaison Actif :</strong> Cliquez sur le nœud source...</span>
              <button type="button" class="btn btn-ghost btn-sm" onclick="cancelLinkCreation()" style="padding:2px 6px;margin-inline-start:8px;">Annuler</button>
            </div>

            <!-- SVG Edges Connection Layer (Calculated between circle centers cx, cy) -->
            <svg class="canvas-edges-layer" id="canvas-edges-layer" aria-hidden="true">
              <defs>
                <marker id="arrow-solid" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#334155"/>
                </marker>
                <marker id="arrow-hypothesis" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc"/>
                </marker>
              </defs>
              <!-- Edge 1: Post FB (68, 98) -> Phone (318, 98) -->
              <line x1="68" y1="98" x2="318" y2="98" class="canvas-edge-line" marker-end="url(#arrow-solid)" />
              <!-- Edge 2: Post FB (68, 98) -> URL (318, 248) -->
              <line x1="68" y1="98" x2="318" y2="248" class="canvas-edge-line" marker-end="url(#arrow-solid)" />
              <!-- Edge 3: URL (318, 248) -> MongoDB ID (568, 248) -->
              <line x1="318" y1="248" x2="568" y2="248" class="canvas-edge-line" marker-end="url(#arrow-solid)" />
              <!-- Edge 4: URL (318, 248) -> Meta Pixel (568, 378) -->
              <line x1="318" y1="248" x2="568" y2="378" class="canvas-edge-line" marker-end="url(#arrow-solid)" />
              <!-- Edge 5: Phone (318, 98) -> Telegram (318, 398) -->
              <line x1="318" y1="98" x2="318" y2="398" class="canvas-edge-line" marker-end="url(#arrow-solid)" />
              <!-- Edge 6 (Hypothesis): Phone (318, 98) -> Candidate Suspect (568, 98) -->
              <line x1="318" y1="98" x2="568" y2="98" class="canvas-edge-line dashed" marker-end="url(#arrow-hypothesis)" />
            </svg>

            <!-- Circular Node 1: Post FB Marketplace (Layer 1 Verified) -->
            <button type="button" class="canvas-node-circle layer-1 node-pos-1" id="node-post" onclick="handleCanvasNodeClick('node-post')" aria-label="Annonce FB: Post Marketplace #98124 - Liquidation 4 Pneus Michelin">
              <span class="node-circle-badge-dot badge-dot-verified" title="Vérifié RFC 3161">✓</span>
              <div class="node-circle-icon text-success">
                {render_lucide_svg('message-square', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title" data-i18n="node_post_title">Post Marketplace #98124</span>
                <span class="node-circle-sub" data-i18n="node_post_sub">Pneus Michelin DZ</span>
              </div>
            </button>

            <!-- Circular Node 2: Page Facebook (Layer 1 Verified) -->
            <button type="button" class="canvas-node-circle layer-1 node-pos-2" id="node-page" onclick="handleCanvasNodeClick('node-page')" aria-label="Page FB: fb.com/pneus.promo.dz">
              <span class="node-circle-badge-dot badge-dot-verified" title="Vérifié RFC 3161">✓</span>
              <div class="node-circle-icon text-success">
                {render_lucide_svg('at-sign', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title">fb.com/pneus.promo.dz</span>
                <span class="node-circle-sub" data-i18n="node_page_sub">Admin: Algérie • 2.4k fans</span>
              </div>
            </button>

            <!-- Circular Node 3: Phone Number (Layer 2 OSINT Raw) -->
            <button type="button" class="canvas-node-circle layer-2 node-pos-3" id="node-phone" onclick="handleCanvasNodeClick('node-phone')" aria-label="Téléphone: +213 555 019 283">
              <span class="node-circle-badge-dot badge-dot-osint" title="OSINT Brut">●</span>
              <div class="node-circle-icon text-info">
                {render_lucide_svg('phone', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title font-mono" dir="ltr">+213 555 019 283</span>
                <span class="node-circle-sub" data-i18n="node_phone_sub">Ooredoo DZ • Actif</span>
              </div>
            </button>

            <!-- Circular Node 4: Scam Shop URL (Layer 2 OSINT Raw) -->
            <button type="button" class="canvas-node-circle layer-2 node-pos-4" id="node-url" onclick="handleCanvasNodeClick('node-url')" aria-label="URL Boutique: promo-pneus-express.shop">
              <span class="node-circle-badge-dot badge-dot-osint" title="OSINT Brut">●</span>
              <div class="node-circle-icon text-info">
                {render_lucide_svg('globe', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title font-mono" dir="ltr">promo-pneus.shop</span>
                <span class="node-circle-sub" dir="ltr">IP: 185.199.108.153</span>
              </div>
            </button>

            <!-- Circular Node 5: MongoDB ObjectId (Layer 3 Infra) -->
            <button type="button" class="canvas-node-circle layer-3 node-pos-5" id="node-mongoid" onclick="handleCanvasNodeClick('node-mongoid')" aria-label="MongoDB ID: 672f9a10c8b4a100...">
              <span class="node-circle-badge-dot badge-dot-infra" title="Infrastructure">⚙</span>
              <div class="node-circle-icon" style="color:var(--color-layer-3-infra);">
                {render_lucide_svg('hard-drive', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title font-mono" dir="ltr">672f9a10c8b4...</span>
                <span class="node-circle-sub" dir="ltr">MongoDB BSON UTC</span>
              </div>
            </button>

            <!-- Circular Node 6: Meta Pixel (Layer 3 Infra) -->
            <button type="button" class="canvas-node-circle layer-3 node-pos-6" id="node-pixel" onclick="handleCanvasNodeClick('node-pixel')" aria-label="Meta Pixel: Pixel #88419203314">
              <span class="node-circle-badge-dot badge-dot-infra" title="Infrastructure">⚙</span>
              <div class="node-circle-icon" style="color:var(--color-layer-3-infra);">
                {render_lucide_svg('hash', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title font-mono" dir="ltr">Pixel #88419203314</span>
                <span class="node-circle-sub" data-i18n="node_pixel_sub">2 sites jumeaux</span>
              </div>
            </button>

            <!-- Circular Node 7: Telegram Account (Layer 2 OSINT Raw) -->
            <button type="button" class="canvas-node-circle layer-2 node-pos-7" id="node-telegram" onclick="handleCanvasNodeClick('node-telegram')" aria-label="Telegram: @amine_import">
              <span class="node-circle-badge-dot badge-dot-osint" title="OSINT Brut">●</span>
              <div class="node-circle-icon text-info">
                {render_lucide_svg('send', 22)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title font-mono" dir="ltr">@amine_import</span>
                <span class="node-circle-sub" dir="ltr">ID: 519283741</span>
              </div>
            </button>

            <!-- Circular Node 8: Candidate Subject (Layer 4 Hypothesis - Selected by default) -->
            <button type="button" class="canvas-node-circle layer-4 selected node-pos-8 node-focal" id="node-suspect" onclick="handleCanvasNodeClick('node-suspect')" aria-label="Sujet Candidat: Amine B. (31 ans) - Hypothèse IA">
              <span class="node-circle-badge-dot badge-dot-hypothesis" title="Hypothèse IA">✦</span>
              <div class="node-circle-icon text-hypothesis">
                {render_lucide_svg('user', 26)}
              </div>
              <div class="node-circle-label-wrap">
                <span class="node-circle-title" style="color:var(--color-layer-4-hypothesis);font-weight:700;">Amine B. (31 ans)</span>
                <span class="node-circle-sub" title="Biométrie Faciale ArcFace 512-d (92%) recoupée avec CDR Ooredoo" data-i18n="node_suspect_sub">ArcFace (92%) • CDR</span>
              </div>
            </button>'''

    return nodes_html

def build_creation_modals_html():
    """Generates the accessible modals for manual node creation and manual edge creation."""
    return f'''  <!-- Modal: Création Manuelle de Nœud Forensique (Drag & Drop) -->
  <div class="modal-overlay" id="modal-create-node" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-create-node-title">
    <div class="modal-card" style="max-width:440px;">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="node-drag-icon" id="create-node-modal-icon">{render_lucide_svg('plus-circle', 16, 'text-info')}</div>
          <h3 class="modal-title" id="modal-create-node-title">Ajouter une Entité au Dossier</h3>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeCreateNodeModal()" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="modal-body" style="padding:16px;">
        <form id="form-create-node" onsubmit="confirmCreateNode(event)">
          <input type="hidden" id="new-node-type" value="telephone" />
          <input type="hidden" id="new-node-pos-x" value="200" />
          <input type="hidden" id="new-node-pos-y" value="150" />

          <div style="margin-bottom:12px;">
            <label style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Type d'Entité Sélectionné :</label>
            <div id="new-node-type-display" style="padding:6px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;font-size:13px;color:var(--color-accent-text);font-weight:600;">
              Téléphone (MSISDN +213)
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label for="new-node-value" style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Valeur / Identifiant Judiciaire <span style="color:var(--color-status-danger);">*</span> :</label>
            <input type="text" id="new-node-value" required class="input-text font-mono" style="width:100%;box-sizing:border-box;padding:8px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;color:var(--color-neutral-100);font-size:13px;" placeholder="Ex: +213 661 123 456, RIP 007999..." />
          </div>

          <div style="margin-bottom:12px;">
            <label for="new-node-label" style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Libellé de Référence (Optionnel) :</label>
            <input type="text" id="new-node-label" class="input-text" style="width:100%;box-sizing:border-box;padding:8px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;color:var(--color-neutral-100);font-size:13px;" placeholder="Ex: Téléphone de contact complice, Faux profil..." />
          </div>

          <div style="margin-bottom:16px;">
            <label for="new-node-layer" style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Calque Forensique &amp; Degré de Preuve :</label>
            <select id="new-node-layer" style="width:100%;box-sizing:border-box;padding:8px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;color:var(--color-neutral-100);font-size:13px;">
              <option value="layer-1">1. Preuve Scellée (100% RFC 3161)</option>
              <option value="layer-2" selected>2. Découverte OSINT (Extrait du Web/Réseau)</option>
              <option value="layer-3">3. Infrastructure &amp; Pivots (IP, Serveur, Hash)</option>
              <option value="layer-4">4. Hypothèse IA / Enquêteur (À valider)</option>
            </select>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="closeCreateNodeModal()">Annuler</button>
            <button type="submit" class="btn btn-primary btn-sm">{render_lucide_svg('plus', 13)} Créer le Nœud</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <!-- Modal: Création Manuelle de Relation d'Investigation (Link Connector) -->
  <div class="modal-overlay" id="modal-create-edge" style="display:none;" role="dialog" aria-modal="true" aria-labelledby="modal-create-edge-title">
    <div class="modal-card" style="max-width:440px;">
      <div class="modal-header">
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="node-drag-icon text-warning">{render_lucide_svg('link-2', 16)}</div>
          <h3 class="modal-title" id="modal-create-edge-title">Connecter Deux Nœuds</h3>
        </div>
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeCreateEdgeModal()" aria-label="Fermer la modale">✕</button>
      </div>
      <div class="modal-body" style="padding:16px;">
        <form id="form-create-edge" onsubmit="confirmCreateEdge(event)">
          <input type="hidden" id="edge-source-id" value="" />
          <input type="hidden" id="edge-target-id" value="" />

          <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:8px;align-items:center;margin-bottom:14px;background:var(--color-neutral-900);padding:10px;border-radius:6px;border:1px solid var(--color-neutral-700);">
            <div style="text-align:center;">
              <span style="font-size:10px;color:var(--color-neutral-400);display:block;">SOURCE</span>
              <strong style="font-size:12px;color:var(--color-neutral-100);" id="edge-source-name">Nœud A</strong>
            </div>
            <div style="color:var(--color-status-warning);">{render_lucide_svg('arrow-right', 16)}</div>
            <div style="text-align:center;">
              <span style="font-size:10px;color:var(--color-neutral-400);display:block;">CIBLE</span>
              <strong style="font-size:12px;color:var(--color-neutral-100);" id="edge-target-name">Nœud B</strong>
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label for="new-edge-type" style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Type de Relation Judiciaire (47 GFPG) <span style="color:var(--color-status-danger);">*</span> :</label>
            <select id="new-edge-type" required style="width:100%;box-sizing:border-box;padding:8px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;color:var(--color-accent-text);font-family:var(--font-mono);font-size:12px;font-weight:700;">
              <option value="COMMUNIQUE_AVEC">[:COMMUNIQUE_AVEC] (Téléphonie / SMS)</option>
              <option value="TITULAIRE_DE">[:TITULAIRE_DE] (Attribution Ligne)</option>
              <option value="INSEREE_DANS">[:INSEREE_DANS] (Carte SIM -> Mobile)</option>
              <option value="BORNE_SUR">[:BORNE_SUR] (Bornage BTS Antenne)</option>
              <option value="POSSEDE_COMPTE">[:POSSEDE_COMPTE] (Titulaire Bancaire/RIP)</option>
              <option value="EMET_VIREMENT">[:EMET_VIREMENT] (Flux BaridiMob Sortant)</option>
              <option value="RECOIT_VIREMENT">[:RECOIT_VIREMENT] (Flux BaridiMob Entrant)</option>
              <option value="RETRAIT_GAB">[:RETRAIT_GAB] (Retrait Espèces Automate)</option>
              <option value="CONTROLE_WALLET">[:CONTROLE_WALLET] (Portefeuille Crypto)</option>
              <option value="OPERE_COMPTE">[:OPERE_COMPTE] (Gestion Faux Profil)</option>
              <option value="PUBLIE">[:PUBLIE] (Publication Offre Fraude)</option>
              <option value="MEMBRE_DE">[:MEMBRE_DE] (Canal Télégram Clandestin)</option>
              <option value="INFECTE_PAR">[:INFECTE_PAR] (Compromission Trojan APK)</option>
              <option value="COMMUNIQUE_AVEC_C2">[:COMMUNIQUE_AVEC_C2] (Exfiltration Pirate)</option>
              <option value="CORRESPOND_A">[:CORRESPOND_A] (Rapprochement Biométrique)</option>
              <option value="CONSTATE_PAR">[:CONSTATE_PAR] (Procès-Verbal Judiciaire)</option>
              <option value="ASSOCIE_A">[:ASSOCIE_A] (Liaison Générale Recoupée)</option>
            </select>
          </div>

          <div style="margin-bottom:12px;">
            <label for="new-edge-weight" style="display:block;font-size:12px;color:var(--color-neutral-300);margin-bottom:4px;font-weight:600;">Degré de Certitude / Force du Lien :</label>
            <select id="new-edge-weight" style="width:100%;box-sizing:border-box;padding:8px 10px;background:var(--color-neutral-900);border:1px solid var(--color-neutral-700);border-radius:4px;color:var(--color-neutral-100);font-size:13px;">
              <option value="1.0">100% — Preuve Scellée / Relevé Bancaire Officiel</option>
              <option value="0.8" selected>80% — Recoupement OSINT Multi-Sources</option>
              <option value="0.5">50% — Indice Circonstanciel / Hypothèse</option>
            </select>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:8px;">
            <button type="button" class="btn btn-secondary btn-sm" onclick="closeCreateEdgeModal()">Annuler</button>
            <button type="submit" class="btn btn-primary btn-sm">{render_lucide_svg('link', 13)} Établir la Liaison</button>
          </div>
        </form>
      </div>
    </div>
  </div>'''

def update_maquette_html():
    maquette_path = "doc/maquette.html"
    with open(maquette_path, "r", encoding="utf-8") as f:
        html = f.read()

    # 1. Replace Left Panel <aside class="panel-left"> ... </aside>
    aside_start = html.find('<aside class="panel-left"')
    aside_end = html.find('</aside>', aside_start) + len('</aside>')
    if aside_start == -1 or aside_end == -1:
        print("ERROR: Could not locate panel-left in maquette.html")
        return False

    new_left_panel = build_accordion_toolbox_html()
    html = html[:aside_start] + new_left_panel + html[aside_end:]

    # 2. In Screen 2 (view-graph-canvas), replace from <svg class="canvas-edges-layer" to last node
    canvas_container_start = html.find('<div class="graph-canvas-wrapper" id="canvas-svg-container">')
    if canvas_container_start == -1:
        print("ERROR: Could not locate canvas-svg-container")
        return False

    floating_palette_start = html.find('<!-- Floating Tool Palette Bottom-Left -->', canvas_container_start)
    if floating_palette_start == -1:
        print("ERROR: Could not locate floating palette")
        return False

    # Find where <svg class="canvas-edges-layer" starts
    svg_start = html.find('<!-- SVG Edges Connection Layer', canvas_container_start)
    if svg_start == -1:
        svg_start = html.find('<svg class="canvas-edges-layer"', canvas_container_start)

    new_canvas_content = build_circular_nodes_canvas_html() + "\n\n            "
    html = html[:svg_start] + new_canvas_content + html[floating_palette_start:]

    # 3. Add modals right before </body>
    if 'id="modal-create-node"' not in html:
        body_end = html.rfind('</body>')
        modals_html = build_creation_modals_html() + "\n\n"
        html = html[:body_end] + modals_html + html[body_end:]

    with open(maquette_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Successfully updated doc/maquette.html! New size: {len(html)} bytes.")
    return True

if __name__ == "__main__":
    success = update_maquette_html()
    if not success:
        sys.exit(1)
