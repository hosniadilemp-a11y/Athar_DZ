#!/usr/bin/env python3
"""
Integrate 100-node forensic graph into doc/maquette.html and doc/assets/maquette-i18n.js
"""

import os
import json
import subprocess

print("[*] Integrating 100-node graph into Athar DZ Maquette...")

# Read the generated case data
with open("doc/assets/mock-case-candy-wheels.json", "r", encoding="utf-8") as f:
    case_data = json.load(f)

nodes = case_data["graph_representation"]["nodes"]
edges = case_data["graph_representation"]["edges"]

print(f"[+] Loaded {len(nodes)} nodes and {len(edges)} edges.")

# -----------------------------------------------------------------------------
# JAVASCRIPT CODE FOR THE 100-NODE GRAPH CONTROLLER
# -----------------------------------------------------------------------------
JS_GRAPH_CONTROLLER = """

// ============================================================================
// 100-NODE FORENSIC GRAPH CONTROLLER FOR ATHAR DZ (CASE #2026-SCAM-089)
// ============================================================================

let graph100State = {
  selectedNodeId: 'suspect_boss_tarek',
  searchQuery: '',
  activeBranch: 'all', // all | pneus | visas | electro | audio | finance
  layerFilters: {
    1: true, // Preuves & Victimes
    2: true, // OSINT Brut
    3: true, // Infrastructure & Code
    4: true  // Réseau Criminel
  }
};

function init100NodeCanvas() {
  const container = document.getElementById('canvas-svg-container');
  if (!container || !window.CASE_CANDY_WHEELS) return;

  const graph = window.CASE_CANDY_WHEELS.graph_representation;
  if (!graph || !graph.nodes) return;

  // Build the Filter Toolbar Header
  const filterToolbarHtml = `
    <div class="graph-100-toolbar" style="position:sticky;top:0;left:0;right:0;z-index:30;background:rgba(15,23,42,0.94);backdrop-filter:blur(8px);border-bottom:1px solid var(--border-color);padding:0.45rem 0.8rem;display:flex;align-items:center;justify-content:space-between;gap:0.6rem;flex-wrap:wrap;">
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <span class="chip chip-warning font-mono" id="graph-node-counter" style="font-weight:700;">100 / 100 Nœuds Visibles</span>
        <div class="btn-group" role="group" aria-label="Filtres Calques">
          <button class="btn btn-sm btn-layer-1" id="btn-layer-1" onclick="toggleLayer100(1)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(16,185,129,0.15);color:#10b981;border:1px solid #10b981;">✓ Calque 1 : Preuves (25)</button>
          <button class="btn btn-sm btn-layer-2" id="btn-layer-2" onclick="toggleLayer100(2)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(56,189,248,0.15);color:#38bdf8;border:1px solid #38bdf8;">✓ Calque 2 : OSINT (30)</button>
          <button class="btn btn-sm btn-layer-3" id="btn-layer-3" onclick="toggleLayer100(3)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(148,163,184,0.15);color:#cbd5e1;border:1px solid #64748b;">✓ Calque 3 : Infra (25)</button>
          <button class="btn btn-sm btn-layer-4" id="btn-layer-4" onclick="toggleLayer100(4)" style="font-size:0.72rem;padding:0.25rem 0.5rem;background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid #a855f7;">✓ Calque 4 : Réseau (20)</button>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:0.4rem;flex-wrap:wrap;">
        <div style="display:flex;gap:0.25rem;">
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('all')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">Tous</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('pneus')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🚗 Pneus</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('visas')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🇪🇺 Visas</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('electro')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">📱 Électro</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('audio')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🎙️ Vocaux</button>
          <button class="btn btn-ghost btn-sm" onclick="setBranch100('finance')" style="font-size:0.7rem;padding:0.2rem 0.45rem;">🪙 Finances</button>
        </div>
        <input type="text" id="graph-search-100" placeholder="🔍 Filtrer les 100 nœuds..." oninput="handleSearch100(this.value)" style="background:#0f172a;border:1px solid var(--border-color);color:#f8fafc;padding:0.25rem 0.55rem;border-radius:4px;font-size:0.74rem;width:170px;" />
      </div>
    </div>
  `;

  // Render SVG Canvas wrapper
  let svgContent = `<svg id="svg-edges-100" class="canvas-edges-layer" style="min-width:2350px;min-height:2000px;position:absolute;top:0;left:0;pointer-events:none;z-index:5;" aria-hidden="true">`;
  
  // Build lookup map for coordinates
  const nodeMap = {};
  graph.nodes.forEach(n => { nodeMap[n.id] = n; });

  // Render Lines
  graph.edges.forEach(e => {
    const fromN = nodeMap[e.from];
    const toN = nodeMap[e.to];
    if (fromN && toN) {
      const x1 = fromN.x + 115;
      const y1 = fromN.y + 40;
      const x2 = toN.x + 115;
      const y2 = toN.y + 40;
      const isDashed = (fromN.layer === 4 || toN.layer === 4) ? 'stroke-dasharray="4,4"' : '';
      const color = fromN.layer === 1 ? '#10b981' : fromN.layer === 2 ? '#38bdf8' : fromN.layer === 3 ? '#64748b' : '#a855f7';
      svgContent += `<line id="edge-${e.from}-${e.to}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.6" opacity="0.45" ${isDashed} class="edge-line-100" data-from="${e.from}" data-to="${e.to}" />`;
    }
  });
  svgContent += `</svg>`;

  // Render 100 Node Cards
  let nodesHtml = `<div id="nodes-layer-100" style="position:relative;min-width:2350px;min-height:2000px;z-index:10;padding-top:40px;">`;
  
  graph.nodes.forEach(n => {
    const layerClass = n.layer === 1 ? 'layer-1' : n.layer === 2 ? 'layer-2' : n.layer === 3 ? 'layer-3' : 'layer-4';
    const chipColor = n.layer === 1 ? 'chip-emerald' : n.layer === 2 ? 'chip-cyan' : n.layer === 3 ? 'chip-neutral' : 'chip-purple';
    const layerName = n.layer === 1 ? 'Preuve Scellée' : n.layer === 2 ? 'OSINT' : n.layer === 3 ? 'Infra/Code' : 'Hypothèse';
    
    nodesHtml += `
      <div class="canvas-node-card ${layerClass} node-card-100"
           id="node-100-${n.id}"
           data-id="${n.id}"
           data-layer="${n.layer}"
           data-label="${n.label.toLowerCase()}"
           data-subtitle="${n.subtitle.toLowerCase()}"
           style="position:absolute;left:${n.x}px;top:${n.y + 45}px;width:230px;cursor:pointer;transition:transform 0.15s, box-shadow 0.15s;"
           onclick="select100Node('${n.id}')">
        <div class="node-header-row" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.25rem;">
          <span class="node-type-label" style="font-size:0.7rem;display:flex;align-items:center;gap:0.3rem;">
            <span>${n.icon}</span> <span>${n.type}</span>
          </span>
          <span class="chip ${chipColor} text-xs font-mono" style="padding:1px 4px;font-size:0.65rem;">${layerName}</span>
        </div>
        <div class="node-title-text" style="font-weight:700;font-size:0.78rem;color:#f8fafc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
          ${n.label}
        </div>
        <div class="node-subtitle-text" style="font-size:0.68rem;color:#94a3b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px;">
          ${n.subtitle}
        </div>
      </div>
    `;
  });
  nodesHtml += `</div>`;

  container.innerHTML = filterToolbarHtml + svgContent + nodesHtml;

  // Auto-select Kingpin Boss by default
  select100Node('suspect_boss_tarek');
}

function select100Node(nid) {
  graph100State.selectedNodeId = nid;

  // Highlight selected node
  document.querySelectorAll('.node-card-100').forEach(c => {
    const isSelected = c.getAttribute('data-id') === nid;
    c.classList.toggle('selected', isSelected);
    c.style.borderColor = isSelected ? '#f59e0b' : '';
    c.style.transform = isSelected ? 'scale(1.04)' : 'scale(1)';
    c.style.zIndex = isSelected ? '25' : '10';
  });

  // Highlight connected edges
  document.querySelectorAll('.edge-line-100').forEach(l => {
    const from = l.getAttribute('data-from');
    const to = l.getAttribute('data-to');
    if (from === nid || to === nid) {
      l.setAttribute('stroke-width', '3.2');
      l.setAttribute('opacity', '1');
      l.setAttribute('stroke', '#f59e0b');
    } else {
      l.setAttribute('stroke-width', '1.4');
      l.setAttribute('opacity', '0.25');
    }
  });

  render100Inspector(nid);
}

function render100Inspector(nid) {
  const container = document.getElementById('inspector-content-pane') || document.getElementById('inspector-content-container');
  if (!container || !window.CASE_CANDY_WHEELS) return;

  const graph = window.CASE_CANDY_WHEELS.graph_representation;
  const node = graph.nodes.find(n => n.id === nid);
  if (!node) return;

  const layerBadge = node.layer === 1 
    ? '<span class="chip chip-emerald">Calque 1 • Preuve Scellée RFC 3161</span>' 
    : node.layer === 2 
    ? '<span class="chip chip-cyan">Calque 2 • Découverte OSINT Brute</span>' 
    : node.layer === 3 
    ? '<span class="chip chip-neutral">Calque 3 • Infrastructure & Télécoms</span>' 
    : '<span class="chip chip-danger">Calque 4 • Hypothèse Judiciaire</span>';

  let metaRows = '';
  Object.entries(node.meta).forEach(([k, v]) => {
    metaRows += `<div class="meta-row"><span class="meta-key">${k} :</span><span class="meta-val font-mono">${v}</span></div>`;
  });

  // Action buttons tailored to entity type
  let actionButtonsHtml = '';
  if (node.type === 'AUDIO_RECORDING') {
    actionButtonsHtml = `
      <div style="background:rgba(16,185,129,0.1);border:1px solid #10b981;border-radius:6px;padding:0.6rem;margin-top:0.6rem;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.3rem;">
          <span style="font-size:0.74rem;font-weight:700;color:#10b981;">▶ Lecteur Forensique Audio Darija</span>
          <span class="font-mono text-xs">Biométrie: 96%</span>
        </div>
        <div style="font-size:0.72rem;color:#cbd5e1;font-style:italic;margin-bottom:0.4rem;">
          "Khouya Karim, salam alaykoum. Les 4 pneus Michelin rahoum réservés..."
        </div>
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Lecture en cours de la note vocale scellée...')">
          🔊 Réécouter l'Enregistrement Original
        </button>
      </div>
    `;
  } else if (node.type === 'KINGPIN' || node.type === 'LIEUTENANT') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;display:flex;flex-direction:column;gap:0.35rem;">
        <button class="btn btn-primary btn-sm w-full" onclick="showToast('Mandat d\\'arrêt international généré pour le parquet')">
          ⚖️ Délivrer Mandat d'Arrêt & Dépôt
        </button>
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Réquisition transmise à Binance et Cellule FIU')">
          🪙 Ordonner Gel Compte & Portefeuille USDT
        </button>
      </div>
    `;
  } else if (node.type === 'BANK_ACCOUNT' || node.type === 'MULE') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-primary btn-sm w-full" onclick="showToast('Réquisition transmise à Algérie Poste BaridiMob')">
          🚫 Bloquer Compte BaridiMob & Saisie Solde
        </button>
      </div>
    `;
  } else if (node.type === 'MALWARE_APK' || node.type === 'CODE_REPO') {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Décompilation binaire & rapport de signatures extrait')">
          🔍 Inspecter Code Décompilé (JADX-GUI)
        </button>
      </div>
    `;
  } else {
    actionButtonsHtml = `
      <div style="margin-top:0.6rem;">
        <button class="btn btn-secondary btn-sm w-full" onclick="showToast('Entité versée au registre des scellés')">
          🔒 Figer et Certifier l'Empreinte (SHA-256)
        </button>
      </div>
    `;
  }

  container.innerHTML = `
    <div class="inspector-card candidate-hypothesis-card" style="padding:0.75rem;">
      <div class="candidate-header" style="margin-bottom:0.5rem;">
        <span class="hypothesis-badge">${node.icon} ${node.type}</span>
        ${layerBadge}
      </div>
      <h3 style="font-size:0.95rem;font-weight:800;color:#f8fafc;margin:0 0 0.2rem 0;">${node.label}</h3>
      <p style="font-size:0.75rem;color:#94a3b8;margin:0 0 0.6rem 0;">${node.subtitle}</p>
      
      <div class="metadata-table">
        <div class="meta-row"><span class="meta-key">Identifiant Nœud :</span><span class="meta-val font-mono">${node.id}</span></div>
        <div class="meta-row"><span class="meta-key">Position Canvas :</span><span class="meta-val font-mono">X: ${node.x}px • Y: ${node.y}px</span></div>
        ${metaRows}
      </div>

      ${actionButtonsHtml}
    </div>
  `;
}

function toggleLayer100(layerNum) {
  graph100State.layerFilters[layerNum] = !graph100State.layerFilters[layerNum];
  const btn = document.getElementById(`btn-layer-${layerNum}`);
  if (btn) {
    btn.style.opacity = graph100State.layerFilters[layerNum] ? '1' : '0.4';
  }
  applyFilters100();
}

function setBranch100(branch) {
  graph100State.activeBranch = branch;
  applyFilters100();
  showToast(`Filtre activé : ${branch.toUpperCase()}`);
}

function handleSearch100(val) {
  graph100State.searchQuery = (val || '').toLowerCase().trim();
  applyFilters100();
}

function applyFilters100() {
  let visibleCount = 0;
  const q = graph100State.searchQuery;
  const br = graph100State.activeBranch;

  document.querySelectorAll('.node-card-100').forEach(c => {
    const l = parseInt(c.getAttribute('data-layer'), 10);
    const lbl = c.getAttribute('data-label') || '';
    const sub = c.getAttribute('data-subtitle') || '';
    const nid = c.getAttribute('data-id') || '';

    // Layer check
    let passLayer = graph100State.layerFilters[l];

    // Branch check
    let passBranch = true;
    if (br === 'pneus') passBranch = lbl.includes('pneu') || sub.includes('pneu') || nid.includes('pneu') || nid.includes('amine') || nid.includes('youcef');
    else if (br === 'visas') passBranch = lbl.includes('visa') || sub.includes('visa') || nid.includes('visa') || nid.includes('nadia') || nid.includes('tls');
    else if (br === 'electro') passBranch = lbl.includes('electro') || lbl.includes('tv') || lbl.includes('iphone') || nid.includes('farid') || nid.includes('gold');
    else if (br === 'audio') passBranch = nid.includes('audio') || lbl.includes('vocal');
    else if (br === 'finance') passBranch = nid.includes('rip') || nid.includes('baridimob') || nid.includes('wallet') || nid.includes('binance') || nid.includes('cashier');

    // Search query check
    let passQuery = true;
    if (q) {
      passQuery = lbl.includes(q) || sub.includes(q) || nid.includes(q);
    }

    const show = passLayer && passBranch && passQuery;
    c.style.display = show ? 'block' : 'none';
    if (show) visibleCount++;
  });

  // Update edges visibility
  document.querySelectorAll('.edge-line-100').forEach(l => {
    const from = l.getAttribute('data-from');
    const to = l.getAttribute('data-to');
    const fromEl = document.getElementById(`node-100-${from}`);
    const toEl = document.getElementById(`node-100-${to}`);
    const showEdge = fromEl && toEl && fromEl.style.display !== 'none' && toEl.style.display !== 'none';
    l.style.display = showEdge ? 'block' : 'none';
  });

  const counterEl = document.getElementById('graph-node-counter');
  if (counterEl) {
    counterEl.textContent = `${visibleCount} / 100 Nœuds Visibles`;
  }
}

// Hook into maquette screen switcher
const originalSetScreen = window.setScreen;
window.setScreen = function(num) {
  if (typeof originalSetScreen === 'function') {
    originalSetScreen(num);
  }
  if (num === 2) {
    setTimeout(init100NodeCanvas, 50);
  }
};

// Also trigger on load if screen 2 is active
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    init100NodeCanvas();
  }, 120);
});

"""

# Append the controller to doc/assets/maquette-i18n.js
with open("doc/assets/maquette-i18n.js", "a", encoding="utf-8") as f:
    f.write(JS_GRAPH_CONTROLLER)

print("[+] Appended 100-node graph controller to doc/assets/maquette-i18n.js!")

# -----------------------------------------------------------------------------
# UPDATE doc/maquette.html: Screen 2 container and KPI badges
# -----------------------------------------------------------------------------
with open("doc/maquette.html", "r", encoding="utf-8") as f:
    html = f.read()

# Replace the static nodes inside view-graph-canvas with a responsive canvas container
old_canvas_block = '''        <!-- SCREEN 2: Graph Canvas Screen with Interactive SVG Nodes -->
        <div class="screen-view-pane is-flex-flush" id="view-graph-canvas">
          <div class="graph-canvas-wrapper" id="canvas-svg-container">'''

if old_canvas_block in html:
    print("[+] Found canvas container in maquette.html.")

# Update the badge to say 100 nodes
html = html.replace(
    '<span class="font-mono text-xs font-semibold" data-i18n="case_id">Dossier #2026-SCAM-089</span>',
    '<span class="font-mono text-xs font-semibold" data-i18n="case_id">Dossier #2026-SCAM-089 (100 Nœuds)</span>'
)

with open("doc/maquette.html", "w", encoding="utf-8") as f:
    f.write(html)

print("[+] Synchronized doc/maquette.html!")
