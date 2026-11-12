# scripts/arch_panel_global.py
"""
Tab 1: Global Architecture Panel (Six-Plane Decoupled Flow)
Corrects the previous architectural inconsistency: Layer 2 connects DIRECTLY to Layer 3 Storage.
"""

def get_panel_global():
    return '''    <!-- ====================================================================
         TAB 1: VUE GLOBALE INTERACTIVE (SIX-PLANE DECOUPLED FLOW)
         ==================================================================== -->
    <div id="panel-arch-global" class="arch-tab-panel active">
      <section>
        <h2 class="section-title">1. Vue Globale : Architecture des 6 Couches Logicielles &amp; Flux Inter-Services</h2>
        <p class="section-subtitle">
          Architecture découplée de haute précision : accès direct au stockage persistant, ingestion périphérique par Phone Farm Android, et exécution d'intelligence en mémoire (GDS &amp; IA locale).
        </p>

        <!-- Inconsistency Resolution Notice Banner -->
        <div class="fix-banner">
          <h3><span>✅</span> Résolution de l'Incohérence Architecturale &amp; Règle d'Accès Direct au Tier de Stockage</h3>
          <p>
            <strong>Correction fondamentale :</strong> Dans la modélisation précédente, un schéma de flux linéaire erroné laissait entendre que la couche d'orchestration (Layer 2) devait obligatoirement transiter par la Phone Farm mobile (Layer 1) puis par les moteurs d'intelligence (Layer 4 &amp; 5) pour accéder au stockage (Layer 3). Cette anomalie est désormais résolue :
            <strong>Layer 2 (API Gateway &amp; Pipeline) communique DIRECTEMENT avec Layer 3 (Stockage Polyglotte)</strong> via des protocoles natifs haute performance (Bolt, asyncpg, S3 REST, BSON, gRPC, RESP3). La couche <strong>Layer 1</strong> constitue une périphérie d'acquisition externe déclenchée par des tâches asynchrones, tandis que les couches <strong>Layer 4</strong> (GDS) et <strong>Layer 5</strong> (IA) opèrent directement sur les moteurs de données (en mémoire vive et vectorielle) sous l'autorité de l'orchestrateur.
          </p>
        </div>

        <!-- Interactive Software Engineering Architecture Explorer -->
        <div class="arch-interactive-canvas">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;flex-wrap:wrap;gap:0.75rem;">
            <div>
              <h3 style="color:#f8fafc;margin:0 0 0.35rem;font-size:1.1rem;">Schéma Interactif d'Ingénierie Logicielle (Architecture en 6 Couches Découplées)</h3>
              <p style="font-size:0.8rem;color:var(--text-secondary);margin:0;">
                Cliquez sur un composant pour inspecter son profil technique en direct (protocoles, ports, débits SLA, tolérance aux pannes, charges utiles JSON).
              </p>
            </div>
            <span class="badge badge-emerald">Mode Interactif Live</span>
          </div>

          <!-- Flow Filter Toolbar -->
          <div class="arch-flow-toolbar">
            <div class="arch-flow-filters">
              <button class="flow-btn active" data-flow="all" onclick="filterArchFlow('all')">
                <span>🌐</span> Tous les Flux (13 Canaux)
              </button>
              <button class="flow-btn" data-flow="whatsapp_voice" onclick="filterArchFlow('whatsapp_voice')">
                <span>📱</span> Infiltration WhatsApp &amp; Voix Darija
              </button>
              <button class="flow-btn" data-flow="web_scam" onclick="filterArchFlow('web_scam')">
                <span>🕸️</span> Capture Web WORM &amp; Scraping BSON
              </button>
              <button class="flow-btn" data-flow="telecom_cdr" onclick="filterArchFlow('telecom_cdr')">
                <span>📶</span> Bornage Télécom &amp; CDR TimescaleDB
              </button>
              <button class="flow-btn" data-flow="court_export" onclick="filterArchFlow('court_export')">
                <span>⚖️</span> Scellement Légal RFC 3161 &amp; PDF/A
              </button>
            </div>
            <button id="flow-anim-toggle" class="flow-btn" style="border-color:#38bdf8;color:#38bdf8;" onclick="toggleFlowAnimation()">
              ⏸️ Mettre en Pause les Flux
            </button>
          </div>

          <!-- Dynamic Flow Explanatory Banner -->
          <div id="arch-flow-banner" style="background:#0b111c;border:1px dashed #24354f;border-radius:6px;padding:0.75rem 1rem;margin-bottom:1rem;">
            <!-- Populated dynamically by architecture-interactive.js -->
          </div>

          <!-- Global Interactive SVG Architecture Schema -->
          <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.25rem;overflow-x:auto;">
            <svg viewBox="0 0 1000 880" xmlns="http://www.w3.org/2000/svg" class="arch-svg-canvas" style="min-width:920px;font-family:system-ui,-apple-system,sans-serif;">
              <defs>
                <marker id="arr-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
                </marker>
                <marker id="arr-emerald" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
                </marker>
                <marker id="arr-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7"/>
                </marker>
                <marker id="arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
                </marker>
                <marker id="arr-orange" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f97316"/>
                </marker>
                <marker id="arr-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
                </marker>
                <filter id="glow-bus" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="glow"/>
                  <feComposite in="SourceGraphic" in2="glow" operator="over"/>
                </filter>
              </defs>

              <!-- ============================================================ -->
              <!-- LAYER 6: PRESENTATION & INVESTIGATION STUDIO DUAL-CANVAS    -->
              <!-- ============================================================ -->
              <g class="svg-node" data-node="ui_client" onclick="selectArchNode('ui_client')">
                <rect x="30" y="20" width="940" height="95" rx="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>
                <text x="50" y="46" fill="#38bdf8" font-size="13" font-weight="bold">LAYER 6 : TIER PRÉSENTATION &amp; STUDIO D'ENQUÊTE DUAL-CANVAS NVL WEBGL</text>
                <text x="50" y="66" fill="#94a3b8" font-size="10">Neo4j NVL WebGL Engine (@neo4j-nvl/react) • Minimap Synchronisée • Layout-Workers WebWorkers • Chatbot Ollama DavidLanz</text>
                <rect x="50" y="78" width="165" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
                <text x="60" y="94" fill="#e2e8f0" font-size="9.5" font-weight="600">🖥️ Canvas NVL WebGL (60 FPS)</text>
                <rect x="225" y="78" width="155" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
                <text x="235" y="94" fill="#e2e8f0" font-size="9.5" font-weight="600">🗺️ Dual-Canvas Minimap</text>
                <rect x="390" y="78" width="165" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
                <text x="400" y="94" fill="#e2e8f0" font-size="9.5" font-weight="600">💬 Copilot Text-to-Cypher</text>
                <rect x="565" y="78" width="165" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
                <text x="575" y="94" fill="#e2e8f0" font-size="9.5" font-weight="600">⏳ Curseur Temporel (APOC)</text>
                <rect x="740" y="78" width="210" height="24" rx="4" fill="#1e293b" stroke="#38bdf8" stroke-width="0.8"/>
                <text x="750" y="94" fill="#e2e8f0" font-size="9.5" font-weight="600">⚖️ Export PV Scellé RFC 3161</text>
              </g>

              <!-- EDGE: UI <-> Gateway (HTTPS / WSS) -->
              <path id="e_ui_gw" data-edge="e_ui_gw" class="arch-flow-edge animated" d="M 500 115 L 500 155" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#arr-cyan)"/>
              <rect x="420" y="125" width="160" height="18" rx="4" fill="#090d16" stroke="#38bdf8" stroke-width="0.8"/>
              <text x="430" y="137" fill="#38bdf8" font-size="8.5" font-family="monospace">HTTPS / WSS (Port 48997)</text>

              <!-- ============================================================ -->
              <!-- LAYER 2: API GATEWAY & WORKFLOW ORCHESTRATION TIER          -->
              <!-- ============================================================ -->
              <g class="svg-node" data-node="gateway_api" onclick="selectArchNode('gateway_api')">
                <rect x="30" y="155" width="940" height="95" rx="8" fill="#0c1929" stroke="#0ea5e9" stroke-width="2"/>
                <text x="50" y="180" fill="#0ea5e9" font-size="13" font-weight="bold">LAYER 2 : API GATEWAY, INGESTION &amp; ORCHESTRATEUR DE WORKFLOWS</text>
                <text x="50" y="198" fill="#94a3b8" font-size="10">FastAPI ASGI Ingress • JWT RBAC Casdoor/Keycloak • Celery 5.4 Priority Workers • Event Bus Redis 7.2 Streams • Normalisation Pydantic v2</text>
                <rect x="50" y="212" width="180" height="25" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
                <text x="60" y="228" fill="#38bdf8" font-size="9">🚪 FastAPI Ingress Gateway</text>
                <rect x="240" y="212" width="180" height="25" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
                <text x="250" y="228" fill="#38bdf8" font-size="9">⚡ Celery Asynchronous Queue</text>
                <rect x="430" y="212" width="180" height="25" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
                <text x="440" y="228" fill="#38bdf8" font-size="9">🔄 Event Bus (Redis Streams)</text>
                <rect x="620" y="212" width="170" height="25" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
                <text x="630" y="228" fill="#38bdf8" font-size="9">📐 Normaliseur Pydantic v2</text>
                <rect x="800" y="212" width="150" height="25" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
                <text x="810" y="228" fill="#38bdf8" font-size="9">🛡️ Token Bucket Anti-Ban</text>
              </g>

              <!-- ============================================================ -->
              <!-- DIRECT PERSISTENCE HIGHWAY: LAYER 2 -> LAYER 3               -->
              <!-- (Resolves Inconsistency: No Hop through Layer 1 or Layer 4/5) -->
              <!-- ============================================================ -->
              <!-- Central Vertical Data Bus -->
              <path id="e_gw_storage_direct" data-edge="e_gw_storage_direct" class="arch-flow-edge animated" d="M 500 250 L 500 580" stroke="#f43f5e" stroke-width="4" marker-end="url(#arr-rose)"/>
              <g transform="translate(415, 395)">
                <rect x="0" y="0" width="170" height="42" rx="6" fill="#17111c" stroke="#f43f5e" stroke-width="1.5" filter="url(#glow-bus)"/>
                <text x="85" y="16" fill="#fda4af" font-size="9" font-weight="bold" text-anchor="middle">BUS DIRECT PERSISTANCE</text>
                <text x="85" y="32" fill="#f43f5e" font-size="8" font-family="monospace" text-anchor="middle">Bolt • SQL • S3 • BSON • REST</text>
              </g>

              <!-- ============================================================ -->
              <!-- LEFT WING: LAYER 1 - COVERT ACQUISITION & PHONE FARM         -->
              <!-- ============================================================ -->
              <!-- Command Edge: Layer 2 -> Layer 1 -->
              <path id="e_gw_phone_cmd" data-edge="e_gw_phone_cmd" class="arch-flow-edge animated" d="M 200 250 L 200 295" stroke="#f97316" stroke-width="2" marker-end="url(#arr-orange)"/>
              <text x="125" y="275" fill="#f97316" font-size="8" font-family="monospace">Ordre Tâche Celery / ADB</text>

              <g class="svg-node" data-node="phone_farm" onclick="selectArchNode('phone_farm')">
                <rect x="30" y="295" width="370" height="245" rx="8" fill="#140f0a" stroke="#f97316" stroke-width="2"/>
                <text x="45" y="320" fill="#f97316" font-size="12" font-weight="bold">LAYER 1 : ACQUISITION FORENSIQUE &amp; PHONE FARM</text>
                <text x="45" y="338" fill="#fed7aa" font-size="9">Infiltration sécurisée d'écosystèmes mobiles fermés (WhatsApp, Telegram, BaridiMob)</text>

                <rect x="45" y="350" width="340" height="38" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
                <text x="55" y="367" fill="#fed7aa" font-size="9" font-weight="bold">📶 Banque Modems GSM USB 4G Algériens</text>
                <text x="55" y="380" fill="#cbd5e1" font-size="8">Puces SIM Mobilis / Djezzy / Ooredoo • Interception SMS OTP &lt;1.5s</text>

                <rect x="45" y="395" width="340" height="38" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
                <text x="55" y="412" fill="#fed7aa" font-size="9" font-weight="bold">📲 Ferme ReDroid Android 13 Conteneurisée</text>
                <text x="55" y="425" fill="#cbd5e1" font-size="8">AOSP 13 GPU Passthrough • Cloaking Magisk + Zygisk • ADB over TCP</text>

                <rect x="45" y="440" width="340" height="38" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
                <text x="55" y="457" fill="#fed7aa" font-size="9" font-weight="bold">🎥 Scrcpy WebRTC 60 FPS Low-Latency</text>
                <text x="55" y="470" fill="#cbd5e1" font-size="8">Stream H.264 interactif &lt;30ms • Injection tactile &amp; clavier en temps réel</text>

                <rect x="45" y="485" width="340" height="42" rx="4" fill="#2c1f14" stroke="#f97316" stroke-width="0.8"/>
                <text x="55" y="502" fill="#fed7aa" font-size="9" font-weight="bold">🛡️ Mitmproxy 10.3 TLS &amp; Rétro-Ingénierie APK</text>
                <text x="55" y="518" fill="#cbd5e1" font-size="8">Frida Universal SSL Unpinning • Jadx/Ghidra décompilation APK BaridiMob</text>
              </g>

              <!-- Edge: Layer 1 -> Layer 2 Stream / OTP -->
              <path id="e_phone_gw_stream" data-edge="e_phone_gw_stream" class="arch-flow-edge animated" d="M 240 295 L 240 250" stroke="#f97316" stroke-width="1.8" stroke-dasharray="3,3" marker-end="url(#arr-orange)"/>
              <text x="250" y="275" fill="#f97316" font-size="8" font-family="monospace">SMS OTP / Vocaux WebRTC</text>

              <!-- Direct Evidence Storage Edges: Layer 1 -> Layer 3 -->
              <path id="e_phone_minio_worm" data-edge="e_phone_minio_worm" class="arch-flow-edge animated" d="M 120 540 L 120 580" stroke="#f59e0b" stroke-width="2" marker-end="url(#arr-amber)"/>
              <text x="60" y="562" fill="#f59e0b" font-size="8" font-family="monospace">Dépôt Scellé WORM (MinIO)</text>

              <path id="e_phone_mongo_raw" data-edge="e_phone_mongo_raw" class="arch-flow-edge animated" d="M 320 540 L 320 580" stroke="#10b981" stroke-width="2" marker-end="url(#arr-emerald)"/>
              <text x="325" y="562" fill="#10b981" font-size="8" font-family="monospace">Dépôt BSON Brut (MongoDB)</text>

              <!-- ============================================================ -->
              <!-- RIGHT WING: INTELLIGENCE & ANALYTICS (LAYER 4 & LAYER 5)    -->
              <!-- ============================================================ -->
              <!-- Trigger Edges: Layer 2 -> Layer 4 & Layer 5 -->
              <path id="e_gw_gds_trigger" data-edge="e_gw_gds_trigger" class="arch-flow-edge animated" d="M 700 250 L 700 295" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)"/>
              <text x="630" y="275" fill="#a855f7" font-size="8" font-family="monospace">Déclencheur GDS &amp; IA</text>

              <g transform="translate(600, 295)">
                <!-- LAYER 4: GDS GRAPH SCIENCE -->
                <g class="svg-node" data-node="engine_gds" onclick="selectArchNode('engine_gds')">
                  <rect x="0" y="0" width="180" height="245" rx="8" fill="#171026" stroke="#a855f7" stroke-width="2"/>
                  <text x="12" y="24" fill="#a855f7" font-size="11" font-weight="bold">LAYER 4 : GDS 2.6 ANALYTICS</text>
                  <text x="12" y="40" fill="#d8b4fe" font-size="8.5">Projection Graphe In-Memory</text>

                  <rect x="10" y="50" width="160" height="34" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
                  <text x="16" y="66" fill="#e9d5ff" font-size="8.5" font-weight="bold">🌉 Betweenness Brandes</text>
                  <text x="16" y="78" fill="#cbd5e1" font-size="7.5">Détection mules financières</text>

                  <rect x="10" y="90" width="160" height="34" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
                  <text x="16" y="106" fill="#e9d5ff" font-size="8.5" font-weight="bold">👥 Louvain / Communautés</text>
                  <text x="16" y="118" fill="#cbd5e1" font-size="7.5">Clustering cellules étanches</text>

                  <rect x="10" y="130" width="160" height="34" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
                  <text x="16" y="146" fill="#e9d5ff" font-size="8.5" font-weight="bold">🔗 Prédiction de Liens</text>
                  <text x="16" y="158" fill="#cbd5e1" font-size="7.5">Adamic-Adar / Co-implication</text>

                  <rect x="10" y="170" width="160" height="34" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
                  <text x="16" y="186" fill="#e9d5ff" font-size="8.5" font-weight="bold">🏷️ Classification Rôles</text>
                  <text x="16" y="198" fill="#cbd5e1" font-size="7.5">Opérationnel, Soutien, Leader</text>

                  <rect x="10" y="210" width="160" height="26" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
                  <text x="16" y="226" fill="#e9d5ff" font-size="8" font-weight="bold">📍 Profilage Wilaya BTS/GAB</text>
                </g>

                <!-- LAYER 5: SOVEREIGN LOCAL AI -->
                <g class="svg-node" data-node="engine_ai" onclick="selectArchNode('engine_ai')">
                  <rect x="190" y="0" width="180" height="245" rx="8" fill="#0d1b2a" stroke="#38bdf8" stroke-width="2"/>
                  <text x="202" y="24" fill="#38bdf8" font-size="11" font-weight="bold">LAYER 5 : IA SOUVERAINE</text>
                  <text x="202" y="40" fill="#7dd3fc" font-size="8.5">Inférence 100% Locale (Zero Cloud)</text>

                  <rect x="200" y="50" width="160" height="34" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
                  <text x="206" y="66" fill="#bae6fd" font-size="8.5" font-weight="bold">🤖 Ollama Text-to-Cypher</text>
                  <text x="206" y="78" fill="#cbd5e1" font-size="7.5">Gemma-2-9b + boucle AST</text>

                  <rect x="200" y="90" width="160" height="34" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
                  <text x="206" y="106" fill="#bae6fd" font-size="8.5" font-weight="bold">🎙️ Faster-Whisper Darija</text>
                  <text x="206" y="118" fill="#cbd5e1" font-size="7.5">Audio ar-DZ + extraction DZD</text>

                  <rect x="200" y="130" width="160" height="34" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
                  <text x="206" y="146" fill="#bae6fd" font-size="8.5" font-weight="bold">👥 PyAnnote Audio 3.1</text>
                  <text x="206" y="158" fill="#cbd5e1" font-size="7.5">Diarisation &amp; empreintes 192-d</text>

                  <rect x="200" y="170" width="160" height="34" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
                  <text x="206" y="186" fill="#bae6fd" font-size="8.5" font-weight="bold">👤 ArcFace 512-d Face</text>
                  <text x="206" y="198" fill="#cbd5e1" font-size="7.5">Similarité cosinus sub-8ms</text>

                  <rect x="200" y="210" width="160" height="26" rx="4" fill="#162c46" stroke="#38bdf8" stroke-width="0.8"/>
                  <text x="206" y="226" fill="#bae6fd" font-size="8" font-weight="bold">🛡️ Détecteur Deepfake Audio</text>
                </g>
              </g>

              <!-- Layer 4 <-> Layer 3 Neo4j Bolt In-Memory Projection -->
              <path id="e_gds_neo_bolt" data-edge="e_gds_neo_bolt" class="arch-flow-edge animated" d="M 680 540 L 680 580" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-purple)"/>
              <text x="635" y="562" fill="#a855f7" font-size="8" font-family="monospace">Bolt Graph Projection</text>

              <!-- Layer 5 <-> Layer 3 Vector & Audio Connection -->
              <path id="e_ai_qdrant_vec" data-edge="e_ai_qdrant_vec" class="arch-flow-edge animated" d="M 860 540 L 860 580" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-cyan)"/>
              <text x="815" y="562" fill="#38bdf8" font-size="8" font-family="monospace">gRPC Vectors &amp; MinIO</text>

              <!-- ============================================================ -->
              <!-- LAYER 3: SPECIALIZED POLYGLOT STORAGE TIER (6 DEDICATED)    -->
              <!-- ============================================================ -->
              <g>
                <rect x="30" y="580" width="940" height="270" rx="8" fill="#17111c" stroke="#f43f5e" stroke-width="2"/>
                <text x="50" y="605" fill="#f43f5e" font-size="13" font-weight="bold">LAYER 3 : TIER DE STOCKAGE POLYGLOTTE SPÉCIALISÉ (6 MOTEURS COMPLÉMENTAIRES DÉDIÉS)</text>
                <text x="50" y="623" fill="#fda4af" font-size="10">Accès direct et indépendant : chaque moteur est optimisé mathématiquement pour son modèle de données judiciaire (Index-Free Adjacency, ACID, HNSW, WORM).</text>

                <!-- Database 1: Neo4j 5.20+ -->
                <g class="svg-node" data-node="storage_graph" onclick="selectArchNode('storage_graph')" transform="translate(50, 635)">
                  <rect x="0" y="0" width="140" height="195" rx="6" fill="#241424" stroke="#38bdf8" stroke-width="1.4"/>
                  <text x="12" y="24" fill="#38bdf8" font-size="11" font-weight="bold">🕸️ Neo4j 5.20+</text>
                  <text x="12" y="40" fill="#94a3b8" font-size="8.5">Graphe &amp; Relations</text>
                  <text x="12" y="60" fill="#cbd5e1" font-size="8">• Index-free adjacency</text>
                  <text x="12" y="75" fill="#cbd5e1" font-size="8">• Traversée O(k) sub-ms</text>
                  <text x="12" y="90" fill="#cbd5e1" font-size="8">• Requêtes Cypher pures</text>
                  <text x="12" y="105" fill="#cbd5e1" font-size="8">• Plugin APOC étendu</text>
                  <text x="12" y="120" fill="#cbd5e1" font-size="8">• GDS in-memory catalog</text>
                  <rect x="10" y="145" width="120" height="22" rx="3" fill="#141f36"/>
                  <text x="15" y="160" fill="#38bdf8" font-size="8" font-family="monospace">Bolt Port 7687</text>
                  <text x="12" y="185" fill="#34d399" font-size="7.5">● Sub-5ms 5-hops</text>
                </g>

                <!-- Database 2: PostgreSQL 16 + TimescaleDB -->
                <g class="svg-node" data-node="storage_postgres" onclick="selectArchNode('storage_postgres')" transform="translate(205, 635)">
                  <rect x="0" y="0" width="140" height="195" rx="6" fill="#141a29" stroke="#0ea5e9" stroke-width="1.4"/>
                  <text x="12" y="24" fill="#0ea5e9" font-size="11" font-weight="bold">🐘 PostgreSQL 16</text>
                  <text x="12" y="40" fill="#94a3b8" font-size="8.5">ACID &amp; TimescaleDB</text>
                  <text x="12" y="60" fill="#cbd5e1" font-size="8">• Dossiers &amp; comptes</text>
                  <text x="12" y="75" fill="#cbd5e1" font-size="8">• RLS Multi-Wilayas</text>
                  <text x="12" y="90" fill="#cbd5e1" font-size="8">• Hypertables CDR BTS</text>
                  <text x="12" y="105" fill="#cbd5e1" font-size="8">• Arbre de Merkle audit</text>
                  <text x="12" y="120" fill="#cbd5e1" font-size="8">• Partitionnement jour</text>
                  <rect x="10" y="145" width="120" height="22" rx="3" fill="#0c1929"/>
                  <text x="15" y="160" fill="#0ea5e9" font-size="8" font-family="monospace">SQL Port 5432</text>
                  <text x="12" y="185" fill="#34d399" font-size="7.5">● ACID Strict CPP</text>
                </g>

                <!-- Database 3: Qdrant 1.9 Rust -->
                <g class="svg-node" data-node="storage_qdrant" onclick="selectArchNode('storage_qdrant')" transform="translate(360, 635)">
                  <rect x="0" y="0" width="140" height="195" rx="6" fill="#17122b" stroke="#a855f7" stroke-width="1.4"/>
                  <text x="12" y="24" fill="#a855f7" font-size="11" font-weight="bold">🎯 Qdrant 1.9 Rust</text>
                  <text x="12" y="40" fill="#94a3b8" font-size="8.5">Index Vectoriel HNSW</text>
                  <text x="12" y="60" fill="#cbd5e1" font-size="8">• ArcFace 512-d visages</text>
                  <text x="12" y="75" fill="#cbd5e1" font-size="8">• PyAnnote 192-d voix</text>
                  <text x="12" y="90" fill="#cbd5e1" font-size="8">• Similarité cosinus</text>
                  <text x="12" y="105" fill="#cbd5e1" font-size="8">• Filtrage strict dossier</text>
                  <text x="12" y="120" fill="#cbd5e1" font-size="8">• Quantification mémoire</text>
                  <rect x="10" y="145" width="120" height="22" rx="3" fill="#24153b"/>
                  <text x="15" y="160" fill="#a855f7" font-size="8" font-family="monospace">gRPC Port 6334</text>
                  <text x="12" y="185" fill="#34d399" font-size="7.5">● &lt;8ms sur 2M vecteurs</text>
                </g>

                <!-- Database 4: MinIO S3 Enterprise WORM -->
                <g class="svg-node" data-node="storage_minio" onclick="selectArchNode('storage_minio')" transform="translate(515, 635)">
                  <rect x="0" y="0" width="140" height="195" rx="6" fill="#241417" stroke="#f43f5e" stroke-width="1.4"/>
                  <text x="12" y="24" fill="#f43f5e" font-size="11" font-weight="bold">🗄️ MinIO S3 WORM</text>
                  <text x="12" y="40" fill="#94a3b8" font-size="8.5">Coffre-fort Immuable</text>
                  <text x="12" y="60" fill="#cbd5e1" font-size="8">• Object Lock Compliance</text>
                  <text x="12" y="75" fill="#cbd5e1" font-size="8">• Scellés SHA-256</text>
                  <text x="12" y="90" fill="#cbd5e1" font-size="8">• Horodatage RFC 3161</text>
                  <text x="12" y="105" fill="#cbd5e1" font-size="8">• Archives WARC ISO</text>
                  <text x="12" y="120" fill="#cbd5e1" font-size="8">• Enregistrements voix</text>
                  <rect x="10" y="145" width="120" height="22" rx="3" fill="#38131a"/>
                  <text x="15" y="160" fill="#f43f5e" font-size="8" font-family="monospace">S3 REST Port 9000</text>
                  <text x="12" y="185" fill="#34d399" font-size="7.5">● Immuabilité ISO 27037</text>
                </g>

                <!-- Database 5: MongoDB 7.0 WiredTiger -->
                <g class="svg-node" data-node="storage_mongodb" onclick="selectArchNode('storage_mongodb')" transform="translate(670, 635)">
                  <rect x="0" y="0" width="140" height="195" rx="6" fill="#0d1f17" stroke="#10b981" stroke-width="1.4"/>
                  <text x="12" y="24" fill="#10b981" font-size="11" font-weight="bold">🍃 MongoDB 7.0</text>
                  <text x="12" y="40" fill="#94a3b8" font-size="8.5">Dépôt Document BSON</text>
                  <text x="12" y="60" fill="#cbd5e1" font-size="8">• Dumps scrapers bruts</text>
                  <text x="12" y="75" fill="#cbd5e1" font-size="8">• DOM HTML polymorphe</text>
                  <text x="12" y="90" fill="#cbd5e1" font-size="8">• Compression Snappy 70%</text>
                  <text x="12" y="105" fill="#cbd5e1" font-size="8">• Schema-on-read rapide</text>
                  <text x="12" y="120" fill="#cbd5e1" font-size="8">• Change streams temps réel</text>
                  <rect x="10" y="145" width="120" height="22" rx="3" fill="#143323"/>
                  <text x="15" y="160" fill="#10b981" font-size="8" font-family="monospace">Wire TCP Port 27017</text>
                  <text x="12" y="185" fill="#34d399" font-size="7.5">● 35k writes/sec</text>
                </g>

                <!-- Database 6: Redis 7.2 Stack -->
                <g class="svg-node" data-node="storage_redis" onclick="selectArchNode('storage_redis')" transform="translate(825, 635)">
                  <rect x="0" y="0" width="125" height="195" rx="6" fill="#241014" stroke="#e11d48" stroke-width="1.4"/>
                  <text x="10" y="24" fill="#f43f5e" font-size="11" font-weight="bold">⚡ Redis 7.2</text>
                  <text x="10" y="40" fill="#94a3b8" font-size="8.5">In-Memory Cache &amp; Bus</text>
                  <text x="10" y="60" fill="#cbd5e1" font-size="8">• Pub/Sub WebSockets</text>
                  <text x="10" y="75" fill="#cbd5e1" font-size="8">• Streams d'événements</text>
                  <text x="10" y="90" fill="#cbd5e1" font-size="8">• Quotas Anti-Ban</text>
                  <text x="10" y="105" fill="#cbd5e1" font-size="8">• Verrous Redlock</text>
                  <text x="10" y="120" fill="#cbd5e1" font-size="8">• Sessions enquêteurs</text>
                  <rect x="8" y="145" width="108" height="22" rx="3" fill="#3b111a"/>
                  <text x="12" y="160" fill="#f43f5e" font-size="8" font-family="monospace">RESP3 Port 6379</text>
                  <text x="10" y="185" fill="#34d399" font-size="7.5">● Latence &lt;0.5ms</text>
                </g>
              </g>

              <!-- Real-time Push Edge: Redis -> UI WebSockets -->
              <path id="e_redis_websocket" data-edge="e_redis_websocket" class="arch-flow-edge animated" d="M 960 635 L 960 115" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4,4" marker-end="url(#arr-rose)"/>
              <text x="860" y="270" fill="#e11d48" font-size="8" font-family="monospace">Push WebSocket Temps Réel (Redis Pub/Sub)</text>
            </svg>
          </div>

          <!-- Dynamic Live Node Inspector -->
          <div id="arch-live-inspector" style="background:#080d16;border:1px solid #1e293b;border-radius:8px;padding:1.25rem;">
            <!-- Populated dynamically by selectArchNode(nodeKey) in architecture-interactive.js -->
          </div>
        </div>

        <!-- Six-Layer Architectural Summary Matrix Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Matrice Synthétique des 6 Couches d'Ingénierie Logicielle</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Couche</th>
              <th>Dénomination Opérationnelle</th>
              <th>Technologies Clés</th>
              <th>Rôle dans le Pipeline Judiciaire</th>
              <th>Mode d'Interconnexion &amp; Protocoles</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge badge-blue">Layer 6</span></td>
              <td><strong>Présentation &amp; Studio Dual-Canvas</strong></td>
              <td><code>@neo4j-nvl/react</code>, WebGL, WebWorkers, React 19, TimelineBar</td>
              <td>Exploration visuelle jusqu'à 50k nœuds à 60 FPS, minimap radar, requêtage copilot en langage naturel</td>
              <td>HTTPS / WSS vers Layer 2 (Port 48997) • Mises à jour temps réel via Redis Pub/Sub</td>
            </tr>
            <tr>
              <td><span class="badge badge-cyan">Layer 2</span></td>
              <td><strong>Ingress API Gateway &amp; Orchestrateur</strong></td>
              <td>FastAPI, Celery 5.4, Temporal.io, Pydantic v2, Casdoor JWT RBAC</td>
              <td>Point d'entrée unique, vérification des habilitations, dispatch de tâches, normalisation E.164 / SHA-256</td>
              <td><strong>Accès direct au Stockage (Layer 3)</strong> via Bolt/SQL/S3/BSON • Pilotage de Layer 1 par Celery</td>
            </tr>
            <tr>
              <td><span class="badge badge-orange">Layer 1</span></td>
              <td><strong>Acquisition Forensique &amp; Phone Farm</strong></td>
              <td>ReDroid Android 13, Modems USB SIM 4G DZ, Scrcpy WebRTC, Mitmproxy</td>
              <td>Infiltration de messageries chiffrées (WhatsApp/TG), réception d'OTP SMS, flux vidéo 60 FPS &lt;30ms</td>
              <td>Périphérie d'acquisition : pousse les flux vers Layer 2 et scelle les preuves brutes dans MinIO/MongoDB</td>
            </tr>
            <tr>
              <td><span class="badge badge-purple">Layer 4</span></td>
              <td><strong>Analytics Graph Data Science (GDS)</strong></td>
              <td>Neo4j GDS 2.6, Betweenness Brandes, Louvain Modularity, Link Prediction</td>
              <td>Identification de mules financières, segmentation de cellules criminelles étanches, classification des rôles</td>
              <td>Opère en mémoire vive directement sur Neo4j 5.20+ via le protocole Bolt interne</td>
            </tr>
            <tr>
              <td><span class="badge badge-emerald">Layer 5</span></td>
              <td><strong>IA Souveraine Locale &amp; Biométrie</strong></td>
              <td>Ollama Gemma-2-9b, Faster-Whisper Darija DZ, PyAnnote 3.1, ArcFace 512-d</td>
              <td>Transcription phonétique Darija, diarisation multi-locuteurs, reconnaissance faciale, Text-to-Cypher sécurisé</td>
              <td>Traitement 100% on-premise (VRAM locale) • Interroge MinIO pour l'audio et Qdrant pour les vecteurs</td>
            </tr>
            <tr>
              <td><span class="badge badge-rose">Layer 3</span></td>
              <td><strong>Tier de Stockage Polyglotte (6 Moteurs)</strong></td>
              <td>Neo4j, PostgreSQL/TimescaleDB, Qdrant, MinIO WORM, MongoDB, Redis Stack</td>
              <td>Persistance immuable WORM, relations graphe sans index, séries temporelles CDR, indexation vectorielle HNSW</td>
              <td>Desservi directement par Layer 2, Layer 4 et Layer 5 selon les besoins spécifiques de chaque moteur</td>
            </tr>
          </tbody>
        </table>

        <!-- 3-Server Physical Topology & Inter-App Communication Matrix -->
        <h3 style="color:#f8fafc;margin-top:2.2rem;margin-bottom:0.6rem;font-size:1.15rem;">2. Topologie Physique en 3 Serveurs Découplés &amp; Protocoles de Communication</h3>
        <p style="font-size:0.84rem;color:var(--text-secondary);margin-bottom:1rem;line-height:1.6;">
          Pour garantir la sécurité de la chaîne de garde judiciaire (ISO 27037) et isoler les risques opérationnels de l'acquisition mobile, le système physique est physiquement scindé en <strong>3 serveurs indépendants</strong> reliés par un réseau privé chiffré mTLS :
        </p>

        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:1rem;margin-bottom:1.25rem;overflow-x:auto;">
          <svg viewBox="0 0 960 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;min-width:820px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="srv-arr-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="srv-arr-amber" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f59e0b"/>
              </marker>
              <marker id="srv-arr-red" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ef4444"/>
              </marker>
            </defs>

            <!-- SERVER 1: STUDIO APP SERVER -->
            <rect x="20" y="30" width="270" height="240" rx="8" fill="#0d1524" stroke="#38bdf8" stroke-width="2"/>
            <rect x="20" y="30" width="270" height="36" rx="8" fill="#0c263f"/>
            <text x="155" y="53" fill="#38bdf8" font-size="13" font-weight="bold" text-anchor="middle">SERVEUR 1 : STUDIO APP (SRV-STUDIO-01)</text>
            <text x="35" y="88" fill="#f1f5f9" font-size="11" font-weight="bold">• Interface Web Studio (NVL WebGL)</text>
            <text x="35" y="108" fill="#cbd5e1" font-size="11">• Passerelle API FastAPI &amp; RBAC</text>
            <text x="35" y="128" fill="#cbd5e1" font-size="11">• Orchestrateur Celery &amp; Ingestion</text>
            <text x="35" y="148" fill="#cbd5e1" font-size="11">• Copilot IA Local (Llama-3 / Cypher)</text>
            <text x="35" y="168" fill="#cbd5e1" font-size="11">• Calcul d'Empreintes SHA-256</text>
            <rect x="35" y="190" width="240" height="62" rx="4" fill="#070a0f" stroke="#1e293b"/>
            <text x="45" y="210" fill="#94a3b8" font-size="10" font-family="monospace">VLAN 20 • 32 vCPU / 64 Go RAM</text>
            <text x="45" y="228" fill="#34d399" font-size="10" font-family="monospace">Seul point d'accès autorisé aux données</text>

            <!-- SERVER 2: DATA & STORAGE SERVER -->
            <rect x="345" y="30" width="280" height="240" rx="8" fill="#0d1524" stroke="#10b981" stroke-width="2"/>
            <rect x="345" y="30" width="280" height="36" rx="8" fill="#072b20"/>
            <text x="485" y="53" fill="#10b981" font-size="13" font-weight="bold" text-anchor="middle">SERVEUR 2 : DATA &amp; STORAGE (SRV-DATA-01)</text>
            <text x="360" y="88" fill="#f1f5f9" font-size="11" font-weight="bold">• Neo4j 5.20+ Enterprise &amp; GDS</text>
            <text x="360" y="108" fill="#cbd5e1" font-size="11">• PostgreSQL 16 + TimescaleDB + PostGIS</text>
            <text x="360" y="128" fill="#cbd5e1" font-size="11">• Qdrant 1.9 Rust (Vecteurs 512-d)</text>
            <text x="360" y="148" fill="#cbd5e1" font-size="11">• MinIO S3 Enterprise (WORM Compliance)</text>
            <text x="360" y="168" fill="#cbd5e1" font-size="11">• MongoDB 7.0 &amp; Redis 7.2 Stack</text>
            <rect x="360" y="190" width="250" height="62" rx="4" fill="#070a0f" stroke="#1e293b"/>
            <text x="370" y="210" fill="#94a3b8" font-size="10" font-family="monospace">VLAN 30 • 64 vCPU / 256 Go RAM</text>
            <text x="370" y="228" fill="#34d399" font-size="10" font-family="monospace">8x NVMe RAID-10 + 48 To ZFS WORM</text>

            <!-- SERVER 3: PHONE FARM SERVER -->
            <rect x="680" y="30" width="260" height="240" rx="8" fill="#0d1524" stroke="#f59e0b" stroke-width="2"/>
            <rect x="680" y="30" width="260" height="36" rx="8" fill="#332107"/>
            <text x="810" y="53" fill="#f59e0b" font-size="13" font-weight="bold" text-anchor="middle">SERVEUR 3 : PHONE FARM (SRV-FARM-01)</text>
            <text x="695" y="88" fill="#f1f5f9" font-size="11" font-weight="bold">• Racks USB 3.0 Industriels (uhubctl)</text>
            <text x="695" y="108" fill="#cbd5e1" font-size="11">• Flotte Mobiles Android (ADB / Scrcpy)</text>
            <text x="695" y="128" fill="#cbd5e1" font-size="11">• Banques de SIM DZ (Djezzy/Mobilis)</text>
            <text x="695" y="148" fill="#cbd5e1" font-size="11">• Phone Farm Daemon (SMS / OTP)</text>
            <text x="695" y="168" fill="#cbd5e1" font-size="11">• Streaming Vidéo WebRTC H.264</text>
            <rect x="695" y="190" width="230" height="62" rx="4" fill="#070a0f" stroke="#1e293b"/>
            <text x="705" y="210" fill="#94a3b8" font-size="10" font-family="monospace">VLAN 40 • 16 vCPU / 32 Go RAM</text>
            <text x="705" y="228" fill="#f87171" font-size="10" font-family="monospace">Zéro accès direct aux DBs !</text>

            <!-- Arrow 1: Studio <-> Data -->
            <line x1="290" y1="120" x2="345" y2="120" stroke="#38bdf8" stroke-width="2.5" marker-end="url(#srv-arr-blue)" marker-start="url(#srv-arr-blue)"/>
            <text x="317" y="110" fill="#38bdf8" font-size="9" font-weight="bold" text-anchor="middle">mTLS</text>

            <!-- Arrow 2: Studio <-> Phone Farm (over top arch) -->
            <path d="M 155 30 L 155 12 L 810 12 L 810 30" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#srv-arr-amber)" marker-start="url(#srv-arr-amber)"/>
            <rect x="350" y="2" width="270" height="18" rx="4" fill="#090d16" stroke="#f59e0b"/>
            <text x="485" y="14" fill="#fbbf24" font-size="10" font-weight="bold" text-anchor="middle">gRPC mTLS + NATS Streams + WebRTC</text>

            <!-- Blocked Arrow: Data x-x Phone Farm -->
            <line x1="625" y1="150" x2="680" y2="150" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 4"/>
            <text x="652" y="142" fill="#ef4444" font-size="14" font-weight="bold" text-anchor="middle">✖</text>
            <text x="652" y="170" fill="#ef4444" font-size="9" font-weight="bold" text-anchor="middle">BLOQUÉ</text>
          </svg>
        </div>

        <table class="tech-table">
          <thead>
            <tr>
              <th>Lien Inter-Serveurs</th>
              <th>Protocole &amp; Format</th>
              <th>Usage &amp; Justification Technique</th>
              <th>Sécurité &amp; Isolation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Studio App &harr; Data Server</strong></td>
              <td><code>Bolt TLS</code>, <code>PG Wire (PgBouncer)</code>, <code>gRPC</code>, <code>S3 HTTPS</code></td>
              <td>Requêtage haute vitesse des bases polyglottes (adjacence sans index Neo4j, séries CDR TimescaleDB, vecteurs HNSW Qdrant, scellés MinIO).</td>
              <td>VLAN 20 &harr; VLAN 30, authentification mutuelle mTLS (Ed25519), RLS multi-wilayas.</td>
            </tr>
            <tr>
              <td><strong>Studio App &harr; Phone Farm (Sync)</strong></td>
              <td><code>gRPC over mTLS (HTTP/2 Protobuf)</code></td>
              <td>Envoi de commandes synchrones strictement typées : envoi de sonde SMS, redémarrage port USB, capture écran, statut des puces SIM.</td>
              <td>VLAN 20 &harr; VLAN 40 uniquement sur port 50051 avec certificats clients.</td>
            </tr>
            <tr>
              <td><strong>Phone Farm &rarr; Studio App (Async)</strong></td>
              <td><code>NATS Core / Redis Streams</code> + <code>WebRTC</code></td>
              <td>Réception en temps réel (&lt;1ms) des SMS/OTP entrants sans <em>polling</em> et streaming vidéo H.264 de l'écran du mobile dans le navigateur.</td>
              <td>Flux unidirectionnel poussé vers la file de validation de l'application.</td>
            </tr>
            <tr>
              <td><strong>Phone Farm &harr; Data Server</strong></td>
              <td><span class="badge" style="background:rgba(239,68,68,0.15);color:#f87171;border:1px solid #ef4444;">ACCÈS INTERDIT (BLOQUÉ)</span></td>
              <td>La Phone Farm ne peut jamais écrire directement dans Neo4j, PostgreSQL ou MinIO pour éviter toute corruption ou injection malveillante.</td>
              <td>Firewall Drop strict. Toute donnée est désinfectée et hachée SHA-256 par le Studio.</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
