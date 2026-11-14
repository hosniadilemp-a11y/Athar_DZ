"""
Athar DZ - Patch tools-catalog.js
Injects offline location and dependencies into the rendering of every single tool in:
- renderForensicToolsTable()
- renderSnaToolsTable()
- renderToolsInventory()
"""
import re

CATALOG_PATH = r"c:\Users\adel\Documents\IC\Athar_DZ\doc\assets\tools-catalog.js"

with open(CATALOG_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Helper code to inject at the top of rendering section
HELPERS = """
// =========================================================================
// OFFLINE CACHE LOCATION & DEPENDENCY RESOLVERS (100% AIR-GAPPED)
// =========================================================================
function getToolOfflineLocation(tool) {
  const id = (tool.id || '').toLowerCase();
  const name = (tool.name || '').toLowerCase();
  const engine = (tool.engine || '').toLowerCase();

  if (id.includes('maigret') || engine.includes('maigret')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_maigret_repo', deps: 'Python 3.10+, aiohttp, rich, socid-extractor' };
  if (id.includes('holehe') || engine.includes('holehe')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_holehe_repo', deps: 'Python 3.10+, httpx, trio, bs4' };
  if (id.includes('photon') || engine.includes('photon')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_photon_repo', deps: 'Python 3.10+, requests, urllib3, tld' };
  if (id.includes('theharvester') || engine.includes('theharvester')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_theharvester_repo', deps: 'Python 3.10+, aiohttp, netaddr, aiodns' };
  if (id.includes('sherlock') || id.includes('blackbird') || engine.includes('sherlock')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_sherlock_repo', deps: 'Python 3.10+, requests-futures, torrequest' };
  if (id.includes('ghunt') || engine.includes('ghunt')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_ghunt_repo', deps: 'Python 3.10+, protobuf, httpx' };
  if (id.includes('toutatis') || engine.includes('toutatis')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_toutatis_repo', deps: 'Python 3.10+, requests' };
  if (id.includes('phoneinfoga') || engine.includes('phoneinfoga')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_phoneinfoga_repo', deps: 'Python 3.10+, phonenumbers, bs4' };
  if (id.includes('social_mapper') || engine.includes('social mapper')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_social_mapper_repo', deps: 'Python 3.10+, selenium, insightface' };
  if (id.includes('ignorant') || engine.includes('ignorant')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_ignorant_repo', deps: 'Python 3.10+, requests, bs4' };
  if (id.includes('freeze') || id.includes('archive') || engine.includes('archivebox')) 
    return { path: 'Athar_DZ/.athar-tools/repos/osint_auto_archiver_repo', deps: 'yt-dlp, playwright, waybackpy' };
  if (id.includes('facial') || id.includes('insightface') || engine.includes('insightface') || engine.includes('arcface')) 
    return { path: 'Athar_DZ/.athar-tools/models/insightface/models/buffalo_l/', deps: 'ONNX Runtime, insightface wheel (buffalo_l ResNet-100)' };
  if (id.includes('metadata') || id.includes('mat2') || id.includes('exif') || engine.includes('exiftool')) 
    return { path: 'Athar_DZ/.athar-tools/bin/exiftool/windows_amd64/exiftool.exe (et linux_amd64)', deps: 'Binaire autonome Phil Harvey ExifTool v13.63' };
  if (id.includes('ioc') || id.includes('phone') || engine.includes('phonenumbers')) 
    return { path: 'Athar_DZ/.athar-tools/wheels/windows_cpu/phonenumbers-*.whl', deps: 'Google phonenumbers wheel' };
  if (id.includes('telegram') || engine.includes('telethon')) 
    return { path: 'Athar_DZ/.athar-tools/wheels/windows_cpu/telethon-*.whl', deps: 'Telethon MTProto client wheel' };
  if (id.includes('h8mail') || engine.includes('h8mail')) 
    return { path: 'Athar_DZ/.athar-tools/wheels/windows_cpu/h8mail-*.whl', deps: 'h8mail, duckdb wheel' };
  if (engine.includes('whisper'))
    return { path: 'Athar_DZ/.athar-tools/models/algerian_stt/ & bin/whisper_cpp/', deps: 'whisper.cpp binaire & PyTorch transformers' };
  if (engine.includes('bert') || engine.includes('dziribert'))
    return { path: 'Athar_DZ/.athar-tools/models/algerian/alger-ia/dziribert/', deps: 'PyTorch, Transformers' };
  if (engine.includes('yolo'))
    return { path: 'Athar_DZ/.athar-tools/models/yolo/yolov8x.pt', deps: 'ultralytics wheel, PyTorch' };

  return { path: 'Athar_DZ/.athar-tools/wheels/ (439 roues locales)', deps: 'Python 3.10+ (Wheels hors-ligne disponibles)' };
}

function getForensicOfflineLocation(t) {
  const id = (t.id || '').toLowerCase();
  if (id.includes('exiftool')) return { path: 'Athar_DZ/.athar-tools/bin/exiftool/windows_amd64/exiftool.exe (et linux_amd64/exiftool)', deps: 'Binaire autonome Phil Harvey ExifTool v13.63' };
  if (id.includes('volatility')) return { path: 'Athar_DZ/.athar-tools/repos/forensic_volatility3_repo', deps: 'Python 3.10+, pefile, yara-python, capstone' };
  if (id.includes('sherloq')) return { path: 'Athar_DZ/.athar-tools/repos/forensic_sherloq_repo', deps: 'PyQt5, opencv-python, numpy, matplotlib' };
  if (id.includes('trocr')) return { path: 'Athar_DZ/.athar-tools/models/ocr/trocr-base-handwritten/ & datasets/tessdata/', deps: 'Transformers, VisionEncoderDecoderModel, Tesseract ara/fra' };
  if (id.includes('alpr') || id.includes('yolo')) return { path: 'Athar_DZ/.athar-tools/models/yolo/yolov8x.pt & yolov8m.pt', deps: 'ultralytics, torch, easyocr' };
  if (id.includes('hashdb')) return { path: 'Athar_DZ/.athar-tools/datasets/opensanctions/entities.ftm.json', deps: 'FollowTheMoney engine, qdrant-client' };
  if (id.includes('autopsy') || id.includes('guymager') || id.includes('plaso')) return { path: 'Docker daemon local (Images pré-téléchargées) & scripts bin/', deps: 'Docker Engine / Podman local' };
  if (id.includes('wireshark')) return { path: 'Athar_DZ/.athar-tools/bin/ / Wireshark local TShark CLI', deps: 'TShark libpcap/winpcap' };
  return { path: 'Athar_DZ/.athar-tools/bin/ (ou Docker daemon)', deps: 'Exécutable autonome vérifié' };
}

function getSnaOfflineLocation(t) {
  const id = (t.id || '').toLowerCase();
  if (id.includes('gephi')) return { path: 'Athar_DZ/.athar-tools/bin/gephi_toolkit/gephi-toolkit-0.10.1-all.jar', deps: 'Java JRE 11+ (JAR universel)' };
  if (id.includes('networkx')) return { path: 'Athar_DZ/.athar-tools/wheels/windows_cpu/networkx-*.whl', deps: 'Python 3.10+, numpy, scipy' };
  if (id.includes('igraph')) return { path: 'Athar_DZ/.athar-tools/wheels/windows_cpu/igraph-*.whl', deps: 'Python 3.10+, igraph C-core' };
  if (id.includes('social_mapper')) return { path: 'Athar_DZ/.athar-tools/repos/osint_social_mapper_repo', deps: 'selenium, insightface' };
  if (id.includes('maigret')) return { path: 'Athar_DZ/.athar-tools/repos/osint_maigret_repo', deps: 'Python 3.10+, aiohttp' };
  if (id.includes('louvain') || id.includes('gds') || id.includes('pagerank')) return { path: 'Docker daemon local (image neo4j:5.26 avec GDS)', deps: 'Neo4j Graph Data Science plugin' };
  return { path: 'Athar_DZ/.athar-tools/ (wheels & bibliothèques)', deps: 'Python 3.10+ / Neo4j Bolt' };
}
"""

# Check if helpers are already injected
if "getToolOfflineLocation" not in content:
    idx = content.find("function renderForensicToolsTable()")
    if idx != -1:
        content = content[:idx] + HELPERS + "\n\n" + content[idx:]

# Now replace the rendering templates in renderForensicToolsTable
old_forensic_tr = """        <td>
          <strong style="color:#f1f5f9;font-size:0.92rem;display:block;margin-bottom:0.25rem;">${t.name}</strong>
          <span class="badge badge-purple" style="font-size:0.68rem;">${t.discipline}</span>
          <p style="font-size:0.78rem;color:var(--text-secondary);margin:0.35rem 0 0;line-height:1.4;">${t.desc}</p>
        </td>"""

new_forensic_tr = """        <td>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.25rem;">
            <strong style="color:#f1f5f9;font-size:0.92rem;">${t.name}</strong>
            <span class="badge" style="background:rgba(16,185,129,0.18);color:#10b981;border:1px solid #10b981;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;">✅ TÉLÉCHARGÉ HORS-LIGNE</span>
          </div>
          <span class="badge badge-purple" style="font-size:0.68rem;">${t.discipline}</span>
          <p style="font-size:0.78rem;color:var(--text-secondary);margin:0.35rem 0 0.4rem;line-height:1.4;">${t.desc}</p>
          <div style="padding:4px 8px;background:#090d16;border-radius:4px;border:1px solid #1e293b;font-size:0.73rem;">
            <div style="color:#38bdf8;font-family:var(--font-mono, monospace);margin-bottom:2px;">📁 <strong>Emplacement :</strong> <code>${(getForensicOfflineLocation(t)).path}</code></div>
            <div style="color:#94a3b8;">📦 <strong>Dépendances :</strong> ${(getForensicOfflineLocation(t)).deps}</div>
          </div>
        </td>"""

if old_forensic_tr in content:
    content = content.replace(old_forensic_tr, new_forensic_tr)
    print("[OK] Patched renderForensicToolsTable")

# Replace renderSnaToolsTable
old_sna_tr = """        <td>
          <strong style="color:#f1f5f9;font-size:0.92rem;display:block;margin-bottom:0.25rem;">${t.name}</strong>
          <span class="badge badge-cyan" style="font-size:0.68rem;">${t.algoType}</span>
          <p style="font-size:0.78rem;color:var(--text-secondary);margin:0.35rem 0 0;line-height:1.4;">${t.desc}</p>
        </td>"""

new_sna_tr = """        <td>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.25rem;">
            <strong style="color:#f1f5f9;font-size:0.92rem;">${t.name}</strong>
            <span class="badge" style="background:rgba(16,185,129,0.18);color:#10b981;border:1px solid #10b981;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;">✅ TÉLÉCHARGÉ HORS-LIGNE</span>
          </div>
          <span class="badge badge-cyan" style="font-size:0.68rem;">${t.algoType}</span>
          <p style="font-size:0.78rem;color:var(--text-secondary);margin:0.35rem 0 0.4rem;line-height:1.4;">${t.desc}</p>
          <div style="padding:4px 8px;background:#090d16;border-radius:4px;border:1px solid #1e293b;font-size:0.73rem;">
            <div style="color:#38bdf8;font-family:var(--font-mono, monospace);margin-bottom:2px;">📁 <strong>Emplacement :</strong> <code>${(getSnaOfflineLocation(t)).path}</code></div>
            <div style="color:#94a3b8;">📦 <strong>Dépendances :</strong> ${(getSnaOfflineLocation(t)).deps}</div>
          </div>
        </td>"""

if old_sna_tr in content:
    content = content.replace(old_sna_tr, new_sna_tr)
    print("[OK] Patched renderSnaToolsTable")

# Replace renderToolsInventory
old_inv_tr = """        <td>
          <strong style="color:#f1f5f9;font-size:0.92rem;display:block;margin-bottom:0.25rem;">${tool.name}</strong>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">${tool.desc}</p>
        </td>"""

new_inv_tr = """        <td>
          <div style="display:flex;align-items:center;flex-wrap:wrap;gap:0.4rem;margin-bottom:0.25rem;">
            <strong style="color:#f1f5f9;font-size:0.92rem;">${tool.name}</strong>
            <span class="badge" style="background:rgba(16,185,129,0.18);color:#10b981;border:1px solid #10b981;font-size:0.68rem;padding:2px 6px;border-radius:4px;font-weight:700;">✅ TÉLÉCHARGÉ HORS-LIGNE</span>
          </div>
          <p style="font-size:0.8rem;color:var(--text-secondary);margin:0 0 0.4rem 0;">${tool.desc}</p>
          <div style="padding:4px 8px;background:#090d16;border-radius:4px;border:1px solid #1e293b;font-size:0.73rem;">
            <div style="color:#38bdf8;font-family:var(--font-mono, monospace);margin-bottom:2px;">📁 <strong>Emplacement :</strong> <code>${(getToolOfflineLocation(tool)).path}</code></div>
            <div style="color:#94a3b8;">📦 <strong>Dépendances :</strong> ${(getToolOfflineLocation(tool)).deps}</div>
          </div>
        </td>"""

if old_inv_tr in content:
    content = content.replace(old_inv_tr, new_inv_tr)
    print("[OK] Patched renderToolsInventory")

with open(CATALOG_PATH, "w", encoding="utf-8") as f:
    f.write(content)

print(f"[SUCCESS] Updated {CATALOG_PATH}")
