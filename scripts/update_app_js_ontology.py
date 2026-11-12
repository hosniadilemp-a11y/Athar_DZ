# scripts/update_app_js_ontology.py
"""
Updates doc/assets/app.js to integrate all 37 Node Types in ONTOLOGY_ENTITIES,
with deep technical properties, database storage justifications, and interactive filter functions.
"""

import json
from data_model_definitions import NODES, DOMAINS, DATABASES

def update_app_js():
    with open("doc/assets/app.js", "r", encoding="utf-8") as f:
        content = f.read()

    # Build the full JavaScript ONTOLOGY_ENTITIES dictionary
    js_dict_entries = []
    for node_id, node in NODES.items():
        entry_str = f"""  "{node_id}": {{
    icon: {json.dumps(node['icon'])},
    name: {json.dumps(node['name'])},
    domain: {json.dumps(node['domain'])},
    domainName: {json.dumps(DOMAINS[node['domain']]['name'])},
    primaryDb: {json.dumps(node['primaryDb'])},
    primaryDbName: {json.dumps(node['primaryDbName'])},
    dbTag: {json.dumps(node['dbTag'])},
    dbBadge: {json.dumps(node['dbBadge'])},
    color: {json.dumps(node['color'])},
    plainMeaning: {json.dumps(node['plainMeaning'])},
    exampleValue: {json.dumps(node['exampleValue'])},
    storageJustification: {json.dumps(node['storageJustification'])},
    schemaProps: {json.dumps(node['schemaProps'])},
    connectedClues: {json.dumps(node['connectedClues'])},
    availableTools: {json.dumps(node['availableTools'])}
  }}"""
        js_dict_entries.append(entry_str)

    entities_code = "const ONTOLOGY_ENTITIES = {\n" + ",\n".join(js_dict_entries) + "\n};\n"

    new_functions = """
let currentOntoDomainFilter = 'all';
let currentOntoDbFilter = 'all';

function selectOntologyEntity(key) {
  const box = document.getElementById('ontology-detail-box');
  if (!box || !ONTOLOGY_ENTITIES[key]) return;
  const e = ONTOLOGY_ENTITIES[key];

  // Highlight selected SVG node
  document.querySelectorAll('.onto-node-g').forEach(el => {
    const isSelected = el.getAttribute('data-node') === key;
    const rect = el.querySelector('rect.onto-node-rect');
    if (rect) {
      rect.style.strokeWidth = isSelected ? '3.5' : '1.5';
      rect.style.filter = isSelected ? 'drop-shadow(0 0 10px ' + e.color + ')' : 'none';
    }
  });

  const propsRows = (e.schemaProps || []).map(p => `
    <tr>
      <td style="color:#38bdf8;font-family:monospace;font-size:0.75rem;padding:0.35rem 0.6rem;">${p.name}</td>
      <td style="color:#fbbf24;font-size:0.72rem;padding:0.35rem 0.6rem;">${p.type}</td>
      <td style="font-size:0.72rem;padding:0.35rem 0.6rem;">${p.required ? '<span style="color:#ef4444;font-weight:700;">Requis</span>' : '<span style="color:#94a3b8;">Optionnel</span>'}</td>
      <td style="color:#cbd5e1;font-size:0.75rem;padding:0.35rem 0.6rem;">${p.desc}</td>
    </tr>
  `).join('');

  box.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem;flex-wrap:wrap;gap:0.75rem;">
      <div style="display:flex;align-items:center;gap:0.85rem;">
        <span style="font-size:2.2rem;background:#141f36;padding:0.4rem 0.6rem;border-radius:10px;border:1px solid #23344d;">${e.icon}</span>
        <div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.25rem;">
            <span class="badge" style="background:rgba(255,255,255,0.08);color:${e.color};border:1px solid ${e.color};font-size:0.7rem;">${e.domainName}</span>
            <span class="badge" style="background:#090d16;color:#38bdf8;border:1px solid #0284c7;font-size:0.7rem;font-family:monospace;">🗄️ ${e.dbBadge}</span>
          </div>
          <h3 style="font-size:1.25rem;color:${e.color};margin:0;font-weight:800;">${e.name}</h3>
          <div style="font-size:0.8rem;color:#94a3b8;margin-top:0.2rem;">Exemple Concret (Affaire Athar) : <strong style="color:#f1f5f9;">${e.exampleValue}</strong></div>
        </div>
      </div>
      <div style="text-align:right;">
        <span class="badge badge-emerald" style="font-size:0.72rem;">● Modèle Conforme GFPG</span>
      </div>
    </div>

    <!-- Legal & Forensic Plain Meaning -->
    <div style="background:#0c1322;border:1px solid #1e293b;border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;">
      <strong style="color:#38bdf8;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;display:block;margin-bottom:0.35rem;">🎯 Rôle dans l'Instruction Judiciaire :</strong>
      <p style="font-size:0.85rem;color:#cbd5e1;line-height:1.55;margin:0;">${e.plainMeaning}</p>
    </div>

    <!-- Storage Architecture Rationale -->
    <div style="background:linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(244, 63, 94, 0.06));border:1px solid #0284c7;border-left:4px solid #38bdf8;border-radius:8px;padding:0.85rem 1rem;margin-bottom:1rem;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
        <strong style="color:#38bdf8;font-size:0.78rem;text-transform:uppercase;letter-spacing:0.5px;">🗄️ Justification du Stockage Polyglotte (${e.dbTag}) :</strong>
        <span style="font-family:monospace;font-size:0.7rem;color:#94a3b8;">Moteur : ${e.primaryDbName}</span>
      </div>
      <p style="font-size:0.82rem;color:#e2e8f0;line-height:1.5;margin:0;">${e.storageJustification}</p>
    </div>

    <!-- Schema Properties Table -->
    <div style="margin-bottom:1rem;">
      <strong style="color:#94a3b8;font-size:0.76rem;text-transform:uppercase;display:block;margin-bottom:0.4rem;">📐 Attributs Canoniques &amp; Schéma de Données :</strong>
      <div style="background:#090d16;border:1px solid #1e293b;border-radius:6px;overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:0.78rem;">
          <thead>
            <tr style="background:#111a2e;color:#cbd5e1;text-align:left;border-bottom:1px solid #1e293b;">
              <th style="padding:0.4rem 0.6rem;">Propriété</th>
              <th style="padding:0.4rem 0.6rem;">Type</th>
              <th style="padding:0.4rem 0.6rem;">Statut</th>
              <th style="padding:0.4rem 0.6rem;">Description</th>
            </tr>
          </thead>
          <tbody>
            ${propsRows}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Connections & Tools Grid -->
    <div class="grid-2" style="margin-bottom:0;gap:0.75rem;">
      <div style="background:#090d16;padding:0.85rem;border-radius:8px;border:1px solid #1e293b;">
        <strong style="font-size:0.74rem;text-transform:uppercase;color:#38bdf8;display:block;margin-bottom:0.4rem;">🔗 Relations dans le Graphe d'Enquête</strong>
        <ul style="padding-left:1.1rem;font-size:0.78rem;color:#cbd5e1;margin:0;line-height:1.5;">
          ${(e.connectedClues || []).map(c => `<li>${c}</li>`).join('')}
        </ul>
      </div>
      <div style="background:#090d16;padding:0.85rem;border-radius:8px;border:1px solid #1e293b;">
        <strong style="font-size:0.74rem;text-transform:uppercase;color:#10b981;display:block;margin-bottom:0.4rem;">🧰 Outils &amp; Algorithmes Déclenchés</strong>
        <ul style="padding-left:1.1rem;font-size:0.78rem;color:#cbd5e1;margin:0;line-height:1.5;">
          ${(e.availableTools || []).map(t => `<li>${t}</li>`).join('')}
        </ul>
      </div>
    </div>
  `;
}

function filterOntoDomain(domainKey) {
  currentOntoDomainFilter = domainKey;
  applyOntoFilters();
}

function filterOntoDatabase(dbKey) {
  currentOntoDbFilter = dbKey;
  applyOntoFilters();
}

function applyOntoFilters() {
  // Update button states
  document.querySelectorAll('.onto-domain-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-domain') === currentOntoDomainFilter);
  });
  document.querySelectorAll('.onto-db-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-db') === currentOntoDbFilter);
  });

  // Filter SVG nodes
  let visibleCount = 0;
  document.querySelectorAll('.onto-node-g').forEach(el => {
    const dom = el.getAttribute('data-domain');
    const db = el.getAttribute('data-db');
    const matchDom = (currentOntoDomainFilter === 'all') || (dom === currentOntoDomainFilter);
    const matchDb = (currentOntoDbFilter === 'all') || (db === currentOntoDbFilter);
    const visible = matchDom && matchDb;
    el.style.opacity = visible ? '1' : '0.15';
    el.style.pointerEvents = visible ? 'auto' : 'none';
    if (visible) visibleCount++;
  });

  // Filter SVG edges
  document.querySelectorAll('.onto-edge-g').forEach(el => {
    const src = el.getAttribute('data-src');
    const tgt = el.getAttribute('data-tgt');
    const srcNode = ONTOLOGY_ENTITIES[src];
    const tgtNode = ONTOLOGY_ENTITIES[tgt];
    if (!srcNode || !tgtNode) return;

    const srcMatchDom = (currentOntoDomainFilter === 'all') || (srcNode.domain === currentOntoDomainFilter);
    const tgtMatchDom = (currentOntoDomainFilter === 'all') || (tgtNode.domain === currentOntoDomainFilter);
    const matchDom = srcMatchDom && tgtMatchDom;

    const srcMatchDb = (currentOntoDbFilter === 'all') || (srcNode.primaryDb === currentOntoDbFilter);
    const tgtMatchDb = (currentOntoDbFilter === 'all') || (tgtNode.primaryDb === currentOntoDbFilter);
    const matchDb = srcMatchDb || tgtMatchDb;

    el.style.opacity = (matchDom && matchDb) ? '0.6' : '0.08';
  });

  // Update status banner
  const banner = document.getElementById('onto-filter-banner');
  if (banner) {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.8rem;">
        <span style="color:#cbd5e1;">Filtre Actif : 
          <strong style="color:#38bdf8;">Domaine = ${currentOntoDomainFilter.toUpperCase()}</strong> | 
          <strong style="color:#10b981;">Base de Données = ${currentOntoDbFilter.toUpperCase()}</strong>
        </span>
        <span class="badge badge-blue" style="font-size:0.72rem;">${visibleCount} Nœud(s) Visible(s) sur 37</span>
      </div>
    `;
  }
}
"""

    # Locate and replace old ONTOLOGY_ENTITIES and selectOntologyEntity
    start_tag = "// VISUAL ONTOLOGY EXPLORER (For data-model.html)"
    end_tag = "// Generic Table Filter"

    start_idx = content.find(start_tag)
    end_idx = content.find(end_tag)

    if start_idx == -1 or end_idx == -1:
        print("ERROR: Could not locate ontology block in app.js!")
        return False

    new_content = content[:start_idx] + "// VISUAL ONTOLOGY EXPLORER (For data-model.html) - 37 NODES FULL REGISTRY\n" + entities_code + new_functions + "\n" + content[end_idx:]

    with open("doc/assets/app.js", "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Successfully updated doc/assets/app.js with 37 ontology entities! New size: {len(new_content)} bytes.")
    return True

if __name__ == "__main__":
    update_app_js()
