# scripts/arch_panel_layer6.py
"""
Tab 7: Layer 6 - Tier Présentation & Studio d'Enquête Dual-Canvas NVL WebGL
Detailed architecture SVG and technical specifications.
"""

def get_panel_layer6():
    return '''    <!-- ====================================================================
         TAB 7: LAYER 6 - PRÉSENTATION & STUDIO D'ENQUÊTE DUAL-CANVAS
         ==================================================================== -->
    <div id="panel-arch-layer6" class="arch-tab-panel">
      <section>
        <h2 class="section-title">7. Layer 6 : Tier Présentation &amp; Studio d'Enquête Dual-Canvas NVL WebGL</h2>
        <p class="section-subtitle">
          Poste de travail judiciaire haute performance accéléré par GPU : rendu fluide de 50 000+ nœuds à 60 FPS, minimap radar synchronisée, défilement temporel chronologique et export certifié conforme CPP.
        </p>

        <div class="card" style="border-left:4px solid #38bdf8;margin-bottom:1.5rem;">
          <h3 style="color:#38bdf8;margin-bottom:0.5rem;">🎯 Conception Orientée Enquêteur Judiciaire (Zéro Jargon Informatique)</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            L'enquêteur de police judiciaire ou le juge d'instruction ne doit pas avoir à manipuler de requêtes Cypher ou de scripts Python. Layer 6 encapsule toute la complexité des 5 couches inférieures dans une interface visuelle réactive, fluide et intuitive. Grâce au moteur <strong>Neo4j NVL WebGL</strong>, la navigation reste instantanée même sur des dossiers volumineux comportant des dizaines de milliers d'appels et de transactions. Les calculs de disposition physique sont déportés dans des <strong>Web Workers en arrière-plan</strong>, évitant tout gel de l'écran pendant les démonstrations au tribunal.
          </p>
        </div>

        <!-- Layer 6 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 430" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l6-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-l6-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0284c7"/>
              </marker>
            </defs>

            <!-- SUB-BLOCK 1: NVL WEBGL ENGINE & MINIMAP -->
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#0c1929" stroke="#38bdf8" stroke-width="1.8"/>
              <text x="15" y="24" fill="#38bdf8" font-size="11.5" font-weight="bold">1. MOTEUR RENDU NVL WEBGL</text>
              <text x="15" y="40" fill="#7dd3fc" font-size="8.5">• Neo4j NVL WebGL Engine (@neo4j-nvl/react)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Accélération matérielle GPU (Shader WebGL 2.0)</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• 50 000+ nœuds à 60 FPS sans dégradation</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Mise à l'échelle dynamique LOD (Level-of-Detail)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#132338" stroke="#38bdf8" stroke-width="0.8"/>
              <text x="22" y="122" fill="#bae6fd" font-size="8.5" font-weight="bold">🗺️ Dual-Canvas Minimap Synchronisée</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Vue radar macroscopique avec viewport interactif</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Courbure automatique des multi-arêtes parallèles</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Billboarding haute netteté des icônes de nœuds</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Zoom infini et panoramique par glissement</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#10253d"/>
              <text x="22" y="221" fill="#38bdf8" font-size="8" font-family="monospace">Frame Budget : &lt;16ms (60 Hz)</text>
            </g>

            <!-- SUB-BLOCK 2: ASYNC LAYOUT WORKERS -->
            <g transform="translate(330, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#0f1f33" stroke="#0ea5e9" stroke-width="1.8"/>
              <text x="15" y="24" fill="#0ea5e9" font-size="11.5" font-weight="bold">2. WORKERS PHYSIQUES DÉPORTÉS</text>
              <text x="15" y="40" fill="#7dd3fc" font-size="8.5">• Package @neo4j-nvl/layout-workers</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Calcul de disposition physique en Web Worker</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Thread principal UI 100% libre et réactif</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Algorithme Barnes-Hut (Force-directed O(N log N))</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
              <text x="22" y="122" fill="#38bdf8" font-size="8.5" font-weight="bold">⚙️ 4 Modes de Disposition au Choix</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Force-Directed • Hiérarchique • Circulaire • Radial</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Amortissement inertiel pour stabilisation douce</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Épinglage manuel des cibles prioritaires</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Transfert mémoire via ArrayBuffer sans copie</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#10253d"/>
              <text x="22" y="221" fill="#0ea5e9" font-size="8" font-family="monospace">HTML5 WebWorker • 0 blocage DOM</text>
            </g>

            <!-- SUB-BLOCK 3: TIMELINE SLIDER & COPILOT -->
            <g transform="translate(640, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#141a29" stroke="#38bdf8" stroke-width="1.8"/>
              <text x="15" y="24" fill="#38bdf8" font-size="11.5" font-weight="bold">3. TIME SLIDER &amp; COPILOT</text>
              <text x="15" y="40" fill="#7dd3fc" font-size="8.5">• Curseur temporel dynamique BarScroll.js</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Reconstitution chronologique des infractions</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Découpage par fenêtres : jour, semaine, mois</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Filtrage instantané des arêtes (_first_seen)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#162a40" stroke="#38bdf8" stroke-width="0.8"/>
              <text x="22" y="122" fill="#bae6fd" font-size="8.5" font-weight="bold">💬 Assistant Conversationnel Copilot</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Questions guidées en français / arabe dialectal</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Menu contextuel de nœud (NodeTypeCibled)</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Expansion ciblée : /api/get_possible_relations/</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Révélation instantanée du réseau de complicité</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#10253d"/>
              <text x="22" y="221" fill="#38bdf8" font-size="8" font-family="monospace">APOC Temporal Filter • WSS Bus</text>
            </g>

            <!-- SUB-BLOCK 4: LEGAL EVIDENCE EXPORT RFC 3161 -->
            <g transform="translate(20, 280)">
              <rect x="0" y="0" width="900" height="135" rx="8" fill="#101726" stroke="#38bdf8" stroke-width="2"/>
              <text x="15" y="25" fill="#38bdf8" font-size="12" font-weight="bold">4. GÉNÉRATEUR DE PROCÈS-VERBAL LÉGAL &amp; DOSSIER DE PLAIDOIRIE (RFC 3161 / ISO 27037)</text>
              <text x="15" y="42" fill="#7dd3fc" font-size="9">Exportation en 1 clic d'un dossier judiciaire complet prêt pour la déposition devant le juge d'instruction ou la cour d'assises.</text>

              <!-- Card 1 -->
              <g transform="translate(15, 55)">
                <rect x="0" y="0" width="270" height="65" rx="5" fill="#16263b" stroke="#38bdf8" stroke-width="1"/>
                <text x="12" y="18" fill="#38bdf8" font-size="9" font-weight="bold">📄 Rapport PDF/A-3b Normé CPP</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Synthèse rédigée sans jargon informatique</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Chronologie des faits, préjudice total en DZD</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Conforme réquisitions judiciaires</text>
              </g>

              <!-- Card 2 -->
              <g transform="translate(310, 55)">
                <rect x="0" y="0" width="270" height="65" rx="5" fill="#16263b" stroke="#10b981" stroke-width="1"/>
                <text x="12" y="18" fill="#10b981" font-size="9" font-weight="bold">🔏 Racine d'Arbre de Merkle &amp; SHA-256</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Scellement cryptographique de tous les indices</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Preuve mathématique d'inviolabilité WORM</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Vérifiable par logiciel tiers au tribunal</text>
              </g>

              <!-- Card 3 -->
              <g transform="translate(605, 55)">
                <rect x="0" y="0" width="280" height="65" rx="5" fill="#16263b" stroke="#a855f7" stroke-width="1"/>
                <text x="12" y="18" fill="#a855f7" font-size="9" font-weight="bold">📸 Export Vectoriel SVG &amp; GraphML</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Impression grand format du schéma de réseau</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Fiches individuelles des cibles avec photos</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Résolution vectorielle infinie 300 DPI</text>
              </g>
            </g>

            <!-- Inter-block Connectors -->
            <path d="M 300 135 L 330 135" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l6-cyan)"/>
            <path d="M 610 135 L 640 135" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arr-l6-blue)"/>
            <path d="M 470 255 L 470 280" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l6-cyan)"/>
          </svg>
        </div>

        <!-- Tech Stack Evaluation Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Composants Technologiques de Layer 6 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version / Bibliothèque</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j NVL WebGL</strong></td>
              <td><span class="badge-ver">@neo4j-nvl/react v1.x</span></td>
              <td>Moteur de rendu graphique accéléré matériellement sur GPU WebGL 2.0</td>
              <td>
                <ul class="pros-list">
                  <li>Fluidité 60 FPS permanente même avec 50 000 nœuds et 100 000 arêtes</li>
                  <li>Prise en charge native du style personnalisé (couleurs par label, icônes)</li>
                  <li>Intégration transparente avec le State Management React 19</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Nécessite un matériel client avec support WebGL 2.0 basique</li>
                  <li>Mitigation : mode dégradé Canvas 2D automatique sur postes bureautiques anciens</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Layout Workers</strong></td>
              <td><span class="badge-ver">@neo4j-nvl/layout-workers</span></td>
              <td>Exécution déportée des algorithmes de disposition physique en Web Workers</td>
              <td>
                <ul class="pros-list">
                  <li>Élimine tout freeze de l'interface utilisateur lors de calculs lourds</li>
                  <li>Calculs multi-cœurs en arrière-plan sans bloquer les clics de l'enquêteur</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Surcoût de communication de données entre Worker et Thread UI</li>
                  <li>Mitigation : transfert par SharedArrayBuffer sans sérialisation JSON</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Module d'Interrogation Orientée</strong></td>
              <td><span class="badge-ver">PIC-main / frontend-master</span></td>
              <td>Questions judiciaires prédéfinies et interrogation ciblée (<code>NodeTypeCibled</code>)</td>
              <td>
                <ul class="pros-list">
                  <li>L'enquêteur clique sur des questions en français (ex: "Trouver les complices communs")</li>
                  <li>Aucune connaissance du langage Cypher ou SQL requise</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Doit être enrichi au fil des nouveaux types d'infractions</li>
                  <li>Mitigation : panneau de création de requêtes modèles pour le Chef de Brigade</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Curseur Temporel APOC</strong></td>
              <td><span class="badge-ver">BarScroll.js (TimelineBar)</span></td>
              <td>Navigation interactive chronologique dans le graphe d'infraction</td>
              <td>
                <ul class="pros-list">
                  <li>Reconstitution vivante de l'affaire devant le magistrat instructeur</li>
                  <li>Met en évidence la chronologie exacte des virements et contacts téléphoniques</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Exige que chaque arête possède les propriétés _first_seen et _last_seen</li>
                  <li>Mitigation : injection automatique des horodatages par le pipeline de Layer 2</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
