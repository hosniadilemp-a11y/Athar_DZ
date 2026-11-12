#!/usr/bin/env python3
"""
Updates doc/assets/maquette-i18n.js with:
1. Accordion toggle handler: toggleAccordion()
2. Toolbox domain filter: filterToolboxDomain()
3. Drag & Drop canvas initialization and modal openers
4. Manual Node Creation logic: confirmCreateNode()
5. Manual Link Creation mode: toggleLinkCreationMode(), handleCanvasNodeClick(), confirmCreateEdge()
6. Support for .canvas-node-circle in selectNode() and clearSelection()
"""

import sys

with open("doc/assets/maquette-i18n.js", "r", encoding="utf-8") as f:
    js = f.read()

# 1. Update selectNode and clearSelection to support .canvas-node-circle
old_select = """function selectNode(nodeId) {
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.canvas-node-card').forEach(c => {
    c.classList.toggle('selected', c.id === nodeId);
  });
  renderNodeInspector(nodeId);
}

function clearSelection() {
  appState.selectedNodeId = null;
  document.querySelectorAll('.canvas-node-card').forEach(c => {
    c.classList.remove('selected');
  });
  renderEmptyRightPanel();
}"""

new_select = """function selectNode(nodeId) {
  appState.selectedNodeId = nodeId;
  document.querySelectorAll('.canvas-node-circle, .canvas-node-card').forEach(c => {
    c.classList.toggle('selected', c.id === nodeId);
  });
  renderNodeInspector(nodeId);
}

function clearSelection() {
  appState.selectedNodeId = null;
  document.querySelectorAll('.canvas-node-circle, .canvas-node-card').forEach(c => {
    c.classList.remove('selected');
  });
  renderEmptyRightPanel();
}"""

if old_select in js:
    js = js.replace(old_select, new_select)
    print("Updated selectNode and clearSelection with .canvas-node-circle support.")
else:
    print("WARNING: Could not find exact selectNode block, using regex or continuing...")

# Mapping dictionary for Lucide icon SVGs inside JS
NEW_FUNCTIONS = """
// ============================================================================
// ACCORDION MENU CONTROLLER (PANEL-LEFT)
// ============================================================================
function toggleAccordion(sectionId) {
  const btn = document.getElementById(`acc-btn-${sectionId}`);
  const panel = document.getElementById(`acc-panel-${sectionId}`);
  if (!btn || !panel) return;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !isExpanded);
  panel.classList.toggle('is-open', !isExpanded);
}

function filterToolboxDomain(domainKey) {
  document.querySelectorAll('.toolbox-domain-chip').forEach(c => {
    c.classList.toggle('active', c.getAttribute('data-toolbox-domain') === domainKey);
  });
  let visibleCount = 0;
  document.querySelectorAll('.node-drag-item').forEach(item => {
    const d = item.getAttribute('data-domain');
    const matches = (domainKey === 'all') || (d === domainKey);
    item.style.display = matches ? 'flex' : 'none';
    if (matches) visibleCount++;
  });
  const label = document.getElementById('toolbox-count-label');
  if (label) label.textContent = `${visibleCount} types`;
}

// ============================================================================
// DRAG & DROP NODE CREATION CONTROLLER
// ============================================================================
function handleNodeDragStart(event, nodeType) {
  event.dataTransfer.setData('text/plain', nodeType);
  event.dataTransfer.effectAllowed = 'copy';
}

function initCanvasDropZone() {
  const canvas = document.getElementById('canvas-svg-container');
  if (!canvas) return;

  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', (e) => {
    if (e.target === canvas) {
      canvas.classList.remove('drag-over');
    }
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    const nodeType = e.dataTransfer.getData('text/plain');
    if (!nodeType) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(20, Math.min(rect.width - 80, e.clientX - rect.left - 28));
    const y = Math.max(40, Math.min(rect.height - 100, e.clientY - rect.top - 28));

    openCreateNodeModal(nodeType, x, y);
  });
}

const NODE_LABELS_FR = {
  wilaya: "Wilaya (Collectivité)",
  daira: "Daïra (Circonscription)",
  commune: "Commune d'Algérie",
  unite: "Unité d'Enquête (Brigade/PJ)",
  affaire: "Affaire Judiciaire",
  magistrat: "Magistrat Instructeur",
  personne: "Personne (Suspect/Contact)",
  entreprise: "Entreprise / Société Écran",
  vehicule: "Véhicule Suspect",
  telephone: "Téléphone (MSISDN +213)",
  carte_sim: "Carte SIM (IMSI)",
  appareil_mobile: "Appareil Mobile (IMEI)",
  antenne_bts: "Antenne-Relais Télécom (BTS)",
  telecom_cdr: "Journal d'Appels (CDR)",
  compte_bancaire: "Compte Bancaire / RIP",
  transaction_financiere: "Virement BaridiMob",
  guichet_gab: "Guichet Automatique (GAB)",
  crypto_wallet: "Portefeuille Crypto",
  transaction_crypto: "Transaction Blockchain",
  compte_social: "Compte Réseau Social",
  publication_sociale: "Publication / Annonce",
  canal_telegram: "Canal Telegram",
  message_chat: "Message Instantané",
  adresse_email: "Adresse Email",
  site_web: "Site Web / Fausse Boutique",
  identifiant_infrastructure: "Tracker / Pixel Meta",
  fichier_apk: "Binaire APK Malveillant",
  serveur_c2: "Serveur C2 Pirate",
  certificat_tls: "Certificat TLS/SSL",
  artefact_dfir: "Fichier Registre DFIR",
  session_recherche: "Session de Recherche",
  enregistrement_vocal: "Note Vocale Darija",
  empreinte_faciale: "Empreinte Faciale 512-d",
  image_preuve: "Cliché de Surveillance",
  document_judiciaire: "Procès-Verbal Judiciaire",
  scelle_numerique: "Scellé Numérique WORM",
  preuve_merkle: "Preuve Cryptographique"
};

const NODE_ICONS_LUCIDE = {
  wilaya: 'landmark', daira: 'map-pin', commune: 'map', unite: 'shield', affaire: 'folder-archive', magistrat: 'scale',
  personne: 'user', entreprise: 'building-2', vehicule: 'car', telephone: 'phone', carte_sim: 'credit-card', appareil_mobile: 'smartphone',
  antenne_bts: 'radio', telecom_cdr: 'activity', compte_bancaire: 'wallet', transaction_financiere: 'arrow-right-left', guichet_gab: 'banknote',
  crypto_wallet: 'boxes', transaction_crypto: 'git-commit', compte_social: 'at-sign', publication_sociale: 'message-square',
  canal_telegram: 'send', message_chat: 'message-circle', adresse_email: 'mail', site_web: 'globe', identifiant_infrastructure: 'hash',
  fichier_apk: 'file-code', serveur_c2: 'server', certificat_tls: 'key', artefact_dfir: 'hard-drive', session_recherche: 'search',
  enregistrement_vocal: 'mic', empreinte_faciale: 'scan-face', image_preuve: 'image', document_judiciaire: 'file-text',
  scelle_numerique: 'lock', preuve_merkle: 'binary'
};

function openCreateNodeModal(nodeType, x, y) {
  const modal = document.getElementById('modal-create-node');
  if (!modal) return;
  document.getElementById('new-node-type').value = nodeType;
  document.getElementById('new-node-pos-x').value = Math.round(x);
  document.getElementById('new-node-pos-y').value = Math.round(y);
  
  const displayEl = document.getElementById('new-node-type-display');
  const valInput = document.getElementById('new-node-value');
  const lblInput = document.getElementById('new-node-label');
  
  const typeName = NODE_LABELS_FR[nodeType] || nodeType.toUpperCase();
  if (displayEl) displayEl.textContent = typeName;
  if (valInput) {
    valInput.value = '';
    valInput.placeholder = "Saisir la valeur de l'entité (" + typeName + ")...";
  }
  if (lblInput) lblInput.value = '';

  modal.style.display = 'flex';
  if (valInput) valInput.focus();
}

function closeCreateNodeModal() {
  const modal = document.getElementById('modal-create-node');
  if (modal) modal.style.display = 'none';
}

let customNodeIndex = 1;
function confirmCreateNode(event) {
  if (event) event.preventDefault();
  const nodeType = document.getElementById('new-node-type').value;
  const posX = parseInt(document.getElementById('new-node-pos-x').value, 10) || 200;
  const posY = parseInt(document.getElementById('new-node-pos-y').value, 10) || 150;
  const val = document.getElementById('new-node-value').value.trim();
  const label = document.getElementById('new-node-label').value.trim() || val;
  const layerStr = document.getElementById('new-node-layer').value;
  const layerNum = parseInt(layerStr.replace('layer-', ''), 10) || 2;

  if (!val) {
    showToast("Erreur : La valeur de l'entité est requise");
    return;
  }

  const newNodeId = `node-custom-${customNodeIndex++}`;
  
  // Register in ATHAR_CASE_NODES
  ATHAR_CASE_NODES[newNodeId] = {
    id: newNodeId,
    type: nodeType,
    typeLabel: NODE_LABELS_FR[nodeType] || nodeType,
    name: val,
    layer: layerNum,
    certitude: layerNum === 1 ? '100% Scellé RFC 3161' : (layerNum === 4 ? 'Hypothèse IA' : '90% OSINT'),
    hash: 'sha256:' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join(''),
    date: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    officer: 'Insp. Benali (Création Manuelle)',
    desc: "Entité créée manuellement pour enrichir l'instruction judiciaire du dossier #2026-SCAM-089.",
    metadata: {
      'Type Canonique': nodeType,
      'Identifiant': val,
      'Mode Création': 'Glisser-Déposer Manuel',
      'Horodatage': new Date().toLocaleTimeString()
    }
  };

  // Build DOM button
  const canvas = document.getElementById('canvas-svg-container');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `canvas-node-circle ${layerStr}`;
  btn.id = newNodeId;
  btn.style.left = `${posX}px`;
  btn.style.top = `${posY}px`;
  btn.setAttribute('aria-label', `${label} : ${val}`);
  btn.onclick = () => handleCanvasNodeClick(newNodeId);

  // Status badge dot
  let badgeClass = 'badge-dot-osint';
  let badgeText = '●';
  if (layerNum === 1) { badgeClass = 'badge-dot-verified'; badgeText = '✓'; }
  else if (layerNum === 3) { badgeClass = 'badge-dot-infra'; badgeText = '⚙'; }
  else if (layerNum === 4) { badgeClass = 'badge-dot-hypothesis'; badgeText = '✦'; }

  // Lucide icon
  const iconName = NODE_ICONS_LUCIDE[nodeType] || 'shield';
  const iconSvg = getLucideSvg(iconName, 22);

  btn.innerHTML = `
    <span class="node-circle-badge-dot ${badgeClass}">${badgeText}</span>
    <div class="node-circle-icon">${iconSvg}</div>
    <div class="node-circle-label-wrap">
      <span class="node-circle-title">${val}</span>
      <span class="node-circle-sub">${label}</span>
    </div>
  `;

  canvas.appendChild(btn);
  closeCreateNodeModal();
  selectNode(newNodeId);
  showToast(`Nœud (${val}) ajouté au dossier d'enquête`);
}

// ============================================================================
// MANUAL LINK CREATION CONTROLLER
// ============================================================================
let linkCreationState = {
  active: false,
  sourceNodeId: null,
  targetNodeId: null
};

function toggleLinkCreationMode() {
  linkCreationState.active = !linkCreationState.active;
  linkCreationState.sourceNodeId = null;
  linkCreationState.targetNodeId = null;
  
  const btn = document.getElementById('btn-toggle-link-mode');
  const banner = document.getElementById('canvas-connection-banner');
  const textEl = document.getElementById('canvas-connection-text');
  
  if (btn) btn.classList.toggle('active', linkCreationState.active);
  if (banner) banner.classList.toggle('is-visible', linkCreationState.active);
  if (textEl) textEl.innerHTML = '<strong>Mode Liaison Actif :</strong> Cliquez sur le premier nœud (Source)...';
  
  document.querySelectorAll('.canvas-node-circle').forEach(c => {
    c.classList.remove('connecting-source', 'connecting-target');
  });

  if (linkCreationState.active) {
    showToast('Mode Liaison activé : Cliquez sur le premier nœud');
  }
}

function cancelLinkCreation() {
  linkCreationState.active = false;
  linkCreationState.sourceNodeId = null;
  linkCreationState.targetNodeId = null;
  const btn = document.getElementById('btn-toggle-link-mode');
  const banner = document.getElementById('canvas-connection-banner');
  if (btn) btn.classList.remove('active');
  if (banner) banner.classList.remove('is-visible');
  document.querySelectorAll('.canvas-node-circle').forEach(c => {
    c.classList.remove('connecting-source', 'connecting-target');
  });
}

function handleCanvasNodeClick(nodeId) {
  if (!linkCreationState.active) {
    selectNode(nodeId);
    return;
  }

  // Link mode is active
  if (!linkCreationState.sourceNodeId) {
    linkCreationState.sourceNodeId = nodeId;
    const nodeEl = document.getElementById(nodeId);
    if (nodeEl) nodeEl.classList.add('connecting-source');
    const textEl = document.getElementById('canvas-connection-text');
    const srcNode = ATHAR_CASE_NODES[nodeId];
    const srcName = srcNode ? (srcNode.name || srcNode.typeLabel) : nodeId;
    if (textEl) textEl.innerHTML = `<strong>Source :</strong> ${srcName} &rarr; Cliquez sur le second nœud (Cible)...`;
  } else if (linkCreationState.sourceNodeId === nodeId) {
    showToast('Veuillez sélectionner un nœud cible distinct');
  } else {
    linkCreationState.targetNodeId = nodeId;
    const nodeEl = document.getElementById(nodeId);
    if (nodeEl) nodeEl.classList.add('connecting-target');
    openCreateEdgeModal(linkCreationState.sourceNodeId, nodeId);
  }
}

function openCreateEdgeModal(srcId, tgtId) {
  const modal = document.getElementById('modal-create-edge');
  if (!modal) return;
  document.getElementById('edge-source-id').value = srcId;
  document.getElementById('edge-target-id').value = tgtId;
  
  const srcNode = ATHAR_CASE_NODES[srcId];
  const tgtNode = ATHAR_CASE_NODES[tgtId];
  
  const srcNameEl = document.getElementById('edge-source-name');
  const tgtNameEl = document.getElementById('edge-target-name');
  if (srcNameEl) srcNameEl.textContent = srcNode ? (srcNode.name || srcNode.typeLabel) : srcId;
  if (tgtNameEl) tgtNameEl.textContent = tgtNode ? (tgtNode.name || tgtNode.typeLabel) : tgtId;

  modal.style.display = 'flex';
}

function closeCreateEdgeModal() {
  const modal = document.getElementById('modal-create-edge');
  if (modal) modal.style.display = 'none';
  cancelLinkCreation();
}

function confirmCreateEdge(event) {
  if (event) event.preventDefault();
  const srcId = document.getElementById('edge-source-id').value;
  const tgtId = document.getElementById('edge-target-id').value;
  const relType = document.getElementById('new-edge-type').value;
  const weight = parseFloat(document.getElementById('new-edge-weight').value) || 0.8;

  const srcEl = document.getElementById(srcId);
  const tgtEl = document.getElementById(tgtId);
  if (!srcEl || !tgtEl) return;

  const svg = document.getElementById('canvas-edges-layer');
  if (svg) {
    const x1 = srcEl.offsetLeft + srcEl.offsetWidth / 2;
    const y1 = srcEl.offsetTop + srcEl.offsetHeight / 2;
    const x2 = tgtEl.offsetLeft + tgtEl.offsetWidth / 2;
    const y2 = tgtEl.offsetTop + tgtEl.offsetHeight / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('class', weight < 0.6 ? 'canvas-edge-line dashed' : 'canvas-edge-line');
    line.setAttribute('marker-end', weight < 0.6 ? 'url(#arrow-hypothesis)' : 'url(#arrow-solid)');
    
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = `[:${relType}] (Poids: ${weight * 100}%)`;
    line.appendChild(title);
    
    svg.appendChild(line);
  }

  closeCreateEdgeModal();
  showToast(`Liaison [:${relType}] établie entre les deux entités`);
}

function runSimulatedQuery(queryText) {
  showToast(`Exécution de la requête : "${queryText}"`);
  selectNode('node-phone');
}
"""

# Append functions before initialization listener
init_idx = js.find("document.addEventListener('DOMContentLoaded', () => {")
if init_idx != -1:
    js = js[:init_idx] + NEW_FUNCTIONS + "\n" + js[init_idx:]
    # Also add initCanvasDropZone() inside DOMContentLoaded
    dom_content_call = "  applyI18n();\n  initMenubarEvents();\n  initCanvasDropZone();\n"
    js = js.replace("  applyI18n();\n  initMenubarEvents();\n", dom_content_call)
    print("Added new functions and initialized canvas dropzone.")
else:
    js += NEW_FUNCTIONS
    print("Appended new functions to end of file.")

with open("doc/assets/maquette-i18n.js", "w", encoding="utf-8") as f:
    f.write(js)

print("Successfully updated doc/assets/maquette-i18n.js! New size:", len(js))
