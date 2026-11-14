"""
Athar DZ - Update Sidebar Navigation across all HTML files in doc/
and add prominent Dashboard Card to index.html
"""
import os
import glob

DOC_DIR = r"c:\Users\adel\Documents\IC\Athar_DZ\doc"
HTML_FILES = glob.glob(os.path.join(DOC_DIR, "*.html"))

NAV_ITEM_SNIPPET = '      <li><a href="tools-cache-inventory.html"><span>📦 09. Outils Téléchargés &amp; Justification</span><span class="nav-badge" style="background:#10b981;color:#fff;">100% Hors-Ligne</span></a></li>'

for fpath in HTML_FILES:
    fname = os.path.basename(fpath)
    if fname == "tools-cache-inventory.html":
        continue
    
    with open(fpath, "r", encoding="utf-8") as f:
        html = f.read()

    # Check if already added
    if "tools-cache-inventory.html" in html:
        print(f"[SKIP] Already in {fname}")
        continue

    # Look for maquette.html link in nav-links
    target_needle = '<li><a href="maquette.html"'
    if target_needle in html:
        # Find closing </li> of maquette
        pos = html.find(target_needle)
        end_li = html.find("</li>", pos)
        if end_li != -1:
            end_li += 5
            html = html[:end_li] + "\n" + NAV_ITEM_SNIPPET + html[end_li:]
            with open(fpath, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"[OK] Added nav item to {fname}")
        else:
            print(f"[WARN] Could not find end of li in {fname}")
    else:
        print(f"[WARN] Needle not found in {fname}")

# Now add prominent summary card in index.html if not already present
index_path = os.path.join(DOC_DIR, "index.html")
with open(index_path, "r", encoding="utf-8") as f:
    idx_content = f.read()

CARD_MARKUP = """
    <!-- Chapter 09 Highlight Card -->
    <div style="background:linear-gradient(135deg, rgba(16,185,129,0.12), rgba(56,189,248,0.1));border:1px solid #10b981;border-radius:10px;padding:1.25rem;margin:1.5rem 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
        <div>
          <span class="badge" style="background:#10b981;color:#0b0f17;font-weight:800;font-size:0.72rem;padding:3px 8px;border-radius:4px;">100% SOUVERAIN &amp; AIR-GAPPED</span>
          <h3 style="color:#f8fafc;font-size:1.15rem;margin:0.5rem 0 0.25rem;">📦 09. Répertoire Exhaustif des Outils Téléchargés &amp; Matrice de Justification SOTA</h3>
          <p style="color:#cbd5e1;font-size:0.83rem;margin:0;max-width:800px;">
            115+ outils, modèles d'IA (Darija STT, Sentiment, LLMs 32B/14B), binaires forensiques et 439 roues Python sont intégralement téléchargés et vérifiés dans <code>Athar_DZ/.athar-tools/</code> avec justification scientifique comparative face aux baselines.
          </p>
        </div>
        <div>
          <a href="tools-cache-inventory.html" class="btn btn-primary" style="background:#10b981;border-color:#10b981;color:#0b0f17;font-weight:700;text-decoration:none;padding:0.65rem 1.25rem;border-radius:6px;display:inline-block;">
            Consulter l'Inventaire &amp; Justification &rarr;
          </a>
        </div>
      </div>
    </div>
"""

if "<!-- Chapter 09 Highlight Card -->" not in idx_content:
    # Insert right after header or KPI grid
    pos_grid = idx_content.find("</header>")
    if pos_grid != -1:
        pos_grid += 9
        idx_content = idx_content[:pos_grid] + CARD_MARKUP + idx_content[pos_grid:]
        with open(index_path, "w", encoding="utf-8") as f:
            f.write(idx_content)
        print("[OK] Injected highlight card into index.html")

print("[SUCCESS] All navigation sidebars and index.html updated.")
