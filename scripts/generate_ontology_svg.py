# scripts/generate_ontology_svg.py
"""
Generates the comprehensive, high-resolution Master Ontological Graph SVG (1350x920)
depicting all 37 Node Types, 8 Operational Domains, Database Storage Badges,
and 47+ Directional Relationships.
"""

from data_model_definitions import DOMAINS, DATABASES, NODES, RELATIONSHIPS

# Node Center Coordinates and Dimensions (x, y, w, h)
COORDS = {
    # 1. Judiciaire & Territoire (x: 20..380, y: 20..260)
    "wilaya": (35, 55, 160, 44),
    "daira": (215, 55, 165, 44),
    "commune": (215, 115, 165, 44),
    "unite": (35, 115, 160, 44),
    "magistrat": (35, 185, 160, 44),
    "affaire": (215, 185, 165, 54),

    # 2. Acteurs & Entités (x: 415..835, y: 20..260)
    "personne": (435, 120, 205, 58),
    "entreprise": (660, 55, 160, 44),
    "vehicule": (660, 130, 160, 44),

    # 7. Biométrie & Médias (x: 855..1330, y: 20..260)
    "enregistrement_vocal": (875, 55, 205, 50),
    "empreinte_faciale": (1105, 55, 210, 50),
    "image_preuve": (990, 145, 205, 50),

    # 3. Télécoms & Mobiles (x: 20..380, y: 295..605)
    "telephone": (215, 330, 165, 48),
    "carte_sim": (35, 330, 160, 48),
    "appareil_mobile": (35, 415, 160, 48),
    "antenne_bts": (215, 415, 165, 48),
    "telecom_cdr": (125, 500, 175, 50),

    # 4. Finances & BaridiMob (x: 415..835, y: 295..605)
    "compte_bancaire": (435, 330, 185, 50),
    "crypto_wallet": (640, 330, 180, 50),
    "transaction_financiere": (435, 420, 185, 48),
    "guichet_gab": (640, 420, 180, 48),
    "transaction_crypto": (540, 510, 185, 48),

    # 5. SOCMINT, Web & Trackers (x: 855..1330, y: 295..605)
    "compte_social": (875, 330, 195, 48),
    "publication_sociale": (1095, 330, 220, 48),
    "canal_telegram": (875, 415, 195, 48),
    "message_chat": (1095, 415, 220, 48),
    "adresse_email": (875, 500, 195, 48),
    "site_web": (1095, 500, 220, 48),
    "identifiant_infrastructure": (985, 555, 220, 44),

    # 6. Cyber, Malwares & Forensique (x: 20..595, y: 625..895)
    "fichier_apk": (35, 665, 165, 50),
    "serveur_c2": (220, 665, 165, 50),
    "certificat_tls": (405, 665, 175, 50),
    "artefact_dfir": (120, 755, 175, 48),
    "session_recherche": (320, 755, 185, 48),

    # 8. Chaîne de Preuve & Scellés (x: 615..1330, y: 625..895)
    "document_judiciaire": (645, 675, 205, 54),
    "scelle_numerique": (875, 675, 215, 54),
    "preuve_merkle": (1110, 675, 205, 54)
}

ZONES = [
    {"id": "zone_territory", "title": "1. 🏛️ ORGANISATION JUDICIAIRE & TERRITOIRE DZ", "color": "#10b981", "x": 20, "y": 20, "w": 380, "h": 260},
    {"id": "zone_actors", "title": "2. 👥 ACTEURS HUMAINS, MORAUX & IDENTITÉS", "color": "#f43f5e", "x": 415, "y": 20, "w": 425, "h": 260},
    {"id": "zone_biometrics", "title": "7. 🎙️ BIOMÉTRIE MULTIMODALE & MÉDIAS FORENSIQUES", "color": "#a855f7", "x": 855, "y": 20, "w": 475, "h": 260},
    {"id": "zone_telecom", "title": "3. 📱 TÉLÉCOMS, BORNAGE & FORENSIQUE MOBILE", "color": "#f97316", "x": 20, "y": 295, "w": 380, "h": 310},
    {"id": "zone_finance", "title": "4. 💳 FINANCES CRIMINELLES, BARIDIMOB & CRYPTO", "color": "#eab308", "x": 415, "y": 295, "w": 425, "h": 310},
    {"id": "zone_socmint", "title": "5. 🌐 SOCMINT, WEB ÉCOSYSTÈME & TRACKERS", "color": "#06b6d4", "x": 855, "y": 295, "w": 475, "h": 310},
    {"id": "zone_cyber", "title": "6. 🛡️ CYBER MALWARES, C2 & FORENSIQUE TECHNIQUE", "color": "#22c55e", "x": 20, "y": 625, "w": 580, "h": 270},
    {"id": "zone_legal", "title": "8. ⚖️ CHAÎNE DE PREUVE & SCELLÉS NUMÉRIQUES WORM", "color": "#e11d48", "x": 615, "y": 625, "w": 715, "h": 270}
]

def generate_svg_ontology():
    svg = ['''<svg viewBox="0 0 1350 920" xmlns="http://www.w3.org/2000/svg" id="master-onto-svg" style="min-width:1200px;width:100%;height:auto;font-family:system-ui,-apple-system,sans-serif;user-select:none;">
  <defs>
    <!-- Arrowhead markers -->
    <marker id="m-arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
    </marker>
    <marker id="m-arrow-emerald" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
    </marker>
    <marker id="m-arrow-amber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#eab308"/>
    </marker>
    <marker id="m-arrow-rose" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
    </marker>
    <marker id="m-arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f97316"/>
    </marker>
    <marker id="m-arrow-purple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7"/>
    </marker>
    <marker id="m-arrow-crimson" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e11d48"/>
    </marker>
    <marker id="m-arrow-cyan" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4"/>
    </marker>
    <filter id="shadow-node" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000" flood-opacity="0.5"/>
    </filter>
  </defs>
''']

    # 1. Render Zone Enclosures
    svg.append('  <!-- ==================== 8 OPERATIONAL DOMAIN ZONES ==================== -->')
    for z in ZONES:
        svg.append(f'''  <g class="onto-zone-group" id="{z['id']}">
    <rect x="{z['x']}" y="{z['y']}" width="{z['w']}" height="{z['h']}" rx="8" fill="#0b111c" stroke="{z['color']}" stroke-width="1.2" stroke-dasharray="5,3" opacity="0.6"/>
    <rect x="{z['x']}" y="{z['y']}" width="{z['w']}" height="22" rx="8" fill="{z['color']}" fill-opacity="0.12"/>
    <text x="{z['x'] + 12}" y="{z['y'] + 15}" fill="{z['color']}" font-size="9" font-weight="bold" letter-spacing="0.5">{z['title']}</text>
  </g>''')

    # 2. Render Relationships (Edges)
    svg.append('\n  <!-- ==================== 47+ DIRECTIONAL RELATIONSHIP EDGES ==================== -->')
    for rel in RELATIONSHIPS:
        src = rel["source"]
        tgt = rel["target"]
        if src not in COORDS or tgt not in COORDS:
            continue
        sx, sy, sw, sh = COORDS[src]
        tx, ty, tw, th = COORDS[tgt]

        # Calculate connection points
        scx = sx + sw / 2
        scy = sy + sh / 2
        tcx = tx + tw / 2
        tcy = ty + th / 2

        # Choose best boundary anchors
        dx = tcx - scx
        dy = tcy - scy

        if abs(dx) > abs(dy):
            # Horizontal dominant
            start_x = sx + sw if dx > 0 else sx
            start_y = scy
            end_x = tx if dx > 0 else tx + tw
            end_y = tcy
        else:
            # Vertical dominant
            start_x = scx
            start_y = sy + sh if dy > 0 else sy
            end_x = tcx
            end_y = ty if dy > 0 else ty + th

        # Edge color by domain of source
        src_node = NODES[src]
        edge_color = src_node["color"]
        marker_color = "blue"
        if edge_color == "#10b981": marker_color = "emerald"
        elif edge_color == "#f43f5e": marker_color = "rose"
        elif edge_color == "#f97316": marker_color = "orange"
        elif edge_color == "#eab308": marker_color = "amber"
        elif edge_color == "#06b6d4": marker_color = "cyan"
        elif edge_color == "#22c55e": marker_color = "emerald"
        elif edge_color == "#a855f7": marker_color = "purple"
        elif edge_color == "#e11d48": marker_color = "crimson"

        edge_label = rel["edge"]
        svg.append(f'''  <g class="onto-edge-g" data-src="{src}" data-tgt="{tgt}" data-edge="{edge_label}">
    <path class="onto-edge-path" d="M {start_x:.1f} {start_y:.1f} Q {(start_x + end_x)/2:.1f} {(start_y + end_y)/2:.1f} {end_x:.1f} {end_y:.1f}" stroke="{edge_color}" stroke-width="1.3" fill="none" opacity="0.45" marker-end="url(#m-arrow-{marker_color})"/>
  </g>''')

    # 3. Render Node Cards
    svg.append('\n  <!-- ==================== 37 STANDARDIZED NODE CARDS ==================== -->')
    for node_id, node in NODES.items():
        x, y, w, h = COORDS[node_id]
        dom = node["domain"]
        db = node["primaryDb"]
        color = node["color"]
        icon = node["icon"]
        name = node["label"]
        db_badge = node["dbBadge"]

        # Database tag color
        db_color = "#38bdf8"
        if "PostgreSQL" in db_badge: db_color = "#0ea5e9"
        if "TimescaleDB" in db_badge: db_color = "#10b981"
        if "Qdrant" in db_badge: db_color = "#a855f7"
        if "MinIO" in db_badge: db_color = "#f43f5e"
        if "MongoDB" in db_badge: db_color = "#22c55e"
        if "Redis" in db_badge: db_color = "#f59e0b"

        svg.append(f'''  <g class="onto-node-g onto-node-{dom} onto-db-{db}" data-node="{node_id}" data-domain="{dom}" data-db="{db}" onclick="selectOntologyEntity('{node_id}')" style="cursor:pointer;" filter="url(#shadow-node)">
    <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="#131c2b" stroke="{color}" stroke-width="1.5" class="onto-node-rect"/>
    <text x="{x + 8}" y="{y + 24}" font-size="14">{icon}</text>
    <text x="{x + 28}" y="{y + 20}" fill="#f8fafc" font-size="9.5" font-weight="bold" class="onto-node-title">{name}</text>
    
    <!-- Primary DB Badge -->
    <rect x="{x + 28}" y="{y + 26}" width="{w - 34}" height="15" rx="3" fill="#0b111c" stroke="{db_color}" stroke-width="0.7"/>
    <text x="{x + 32}" y="{y + 37}" fill="{db_color}" font-size="7.5" font-family="monospace" font-weight="600">{db_badge}</text>
  </g>''')

    svg.append('</svg>')
    return '\n'.join(svg)

if __name__ == "__main__":
    s = generate_svg_ontology()
    print(f"Generated SVG length: {len(s)} bytes with all 37 nodes and 47+ edges.")
