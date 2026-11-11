# scripts/arch_panel_layer4.py
"""
Tab 5: Layer 4 - Analytics GDS & Algorithmes SNA
Detailed architecture SVG and technical specifications.
"""

def get_panel_layer4():
    return '''    <!-- ====================================================================
         TAB 5: LAYER 4 - ANALYTICS GDS & ALGORITHMES SNA
         ==================================================================== -->
    <div id="panel-arch-layer4" class="arch-tab-panel">
      <section>
        <h2 class="section-title">5. Layer 4 : Moteur Analytics &amp; Graph Data Science (GDS 2.6)</h2>
        <p class="section-subtitle">
          Extraction d'intelligence topologique en mémoire vive : détection mathématique des mules financières, découpage en cellules criminelles hermétiques et prédiction de complicités latentes.
        </p>

        <div class="card" style="border-left:4px solid #a855f7;margin-bottom:1.5rem;">
          <h3 style="color:#a855f7;margin-bottom:0.5rem;">🎯 Rôle de l'Intelligence Topologique (Zéro Biais Humain)</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Dans les réseaux d'escroquerie sophistiqués (comme l'affaire Candy Wheels), les commanditaires n'apparaissent presque jamais en contact direct avec les victimes. Ils opèrent derrière des couches successives de comptes bancaires "mules" (comptes BaridiMob loués à des étudiants ou des tiers). Les méthodes d'investigation traditionnelles par filtrage SQL échouent à démasquer ces structures. Layer 4 projette le graphe de l'affaire dans un catalogue <strong>Neo4j GDS 2.6 in-memory</strong> et applique des algorithmes SOTA de théorie des graphes (Brandes Betweenness, Louvain Modularity, Adamic-Adar) pour hiérarchiser les suspects en fractions de seconde.
          </p>
        </div>

        <!-- Layer 4 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 430" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l4-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#a855f7"/>
              </marker>
              <marker id="arr-l4-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
              </marker>
            </defs>

            <!-- SUB-BLOCK 1: IN-MEMORY GRAPH CATALOG PROJECTION -->
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#171026" stroke="#a855f7" stroke-width="1.8"/>
              <text x="15" y="24" fill="#a855f7" font-size="11.5" font-weight="bold">1. PROJECTION GDS IN-MEMORY</text>
              <text x="15" y="40" fill="#d8b4fe" font-size="8.5">• GDS Graph Catalog in-memory (RAM vive)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• gds.graph.project('affaire_subgraph')</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Filtrage sous-graphe temporel &amp; par Wilaya</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Représentation orientée et pondérée (DZD)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
              <text x="22" y="122" fill="#e9d5ff" font-size="8.5" font-weight="bold">⚡ Kernel C++ Multi-Threadé</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Parallélisation OpenMP sur 16 cœurs CPU</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Estimation mémoire préalable (Memory Estimator)</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Zéro impact sur les lectures transactionnelles</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Libération automatique de la RAM après calcul</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#211336"/>
              <text x="22" y="221" fill="#a855f7" font-size="8" font-family="monospace">Neo4j GDS 2.6 • Port Bolt Interne</text>
            </g>

            <!-- SUB-BLOCK 2: BRANDES CENTRALITY & COMMUNITY DETECTION -->
            <g transform="translate(330, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#1b122c" stroke="#a855f7" stroke-width="1.8"/>
              <text x="15" y="24" fill="#a855f7" font-size="11.5" font-weight="bold">2. CENTRALITÉ &amp; COMMUNAUTÉS</text>
              <text x="15" y="40" fill="#d8b4fe" font-size="8.5">• Algorithme Brandes Betweenness Centrality</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Détection des points d'étranglement (mules)</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Louvain Modularity (Partitionnement optimal Q)</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Label Propagation Algorithm (LPA rapide)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
              <text x="22" y="122" fill="#e9d5ff" font-size="8.5" font-weight="bold">👥 Isolation des Cellules Étanches</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Regroupement automatique par réseau criminel</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Score flottant standardisé [0.0 à 1.0]</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Analyse de résilience : suppression de nœud</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Détection des structures en étoile (Hub-and-Spoke)</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#211336"/>
              <text x="22" y="221" fill="#a855f7" font-size="8" font-family="monospace">Complexité O(V * E) • &lt;80ms sur 50k nœuds</text>
            </g>

            <!-- SUB-BLOCK 3: LINK PREDICTION & ROLE CLASSIFICATION -->
            <g transform="translate(640, 20)">
              <rect x="0" y="0" width="280" height="235" rx="8" fill="#1f1433" stroke="#a855f7" stroke-width="1.8"/>
              <text x="15" y="24" fill="#a855f7" font-size="11.5" font-weight="bold">3. PRÉDICTION &amp; RÔLES PÉNAUX</text>
              <text x="15" y="40" fill="#d8b4fe" font-size="8.5">• Indice Adamic-Adar (Co-contacts rares)</text>
              <text x="15" y="58" fill="#cbd5e1" font-size="8">• Common Neighbors &amp; Resource Allocation</text>
              <text x="15" y="74" fill="#cbd5e1" font-size="8">• Découverte de relations de complicité cachées</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Modèle de classification supervisée (Random Forest)</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#291a42" stroke="#a855f7" stroke-width="0.8"/>
              <text x="22" y="122" fill="#e9d5ff" font-size="8.5" font-weight="bold">🏷️ 4 Rôles Pénaux Automatiques</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">['neutre', 'operationnel', 'soutien', 'leader']</text>

              <text x="15" y="165" fill="#cbd5e1" font-size="8">• Profilage territorial : Secteur_Activite</text>
              <text x="15" y="181" fill="#cbd5e1" font-size="8">• Calcul d'épicentre Wilaya / Daira / Commune</text>
              <text x="15" y="197" fill="#cbd5e1" font-size="8">• Score de confiance probatoire attaché à l'arête</text>
              <rect x="15" y="208" width="250" height="18" rx="3" fill="#211336"/>
              <text x="22" y="221" fill="#a855f7" font-size="8" font-family="monospace">Attributs Dérivés: _class, _betweenness</text>
            </g>

            <!-- SUB-BLOCK 4: WRITE-BACK PIPELINE DIRECT TO LAYER 3 -->
            <g transform="translate(20, 280)">
              <rect x="0" y="0" width="900" height="135" rx="8" fill="#140d1a" stroke="#f43f5e" stroke-width="2"/>
              <text x="15" y="25" fill="#f43f5e" font-size="12" font-weight="bold">4. PIPELINE D'ÉCRITURE RETOUR EN PERSISTANCE (WRITE-BACK DIRECT DANS LAYER 3 NEO4J)</text>
              <text x="15" y="42" fill="#fda4af" font-size="9">Les propriétés calculées par GDS sont écrites directement dans la base Neo4j sans passer par l'API Gateway, puis notifiées au Studio via Redis Pub/Sub.</text>

              <!-- Step 1 -->
              <g transform="translate(15, 55)">
                <rect x="0" y="0" width="265" height="65" rx="5" fill="#241424" stroke="#38bdf8" stroke-width="1"/>
                <text x="12" y="18" fill="#38bdf8" font-size="9" font-weight="bold">1. In-Memory Graph Computation</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Exécution ultra-rapide des algorithmes en C++</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Calcul des scores _betweenness &amp; _communityId</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Aucune latence I/O disque</text>
              </g>

              <!-- Arrow -->
              <path d="M 290 87 L 315 87" stroke="#f43f5e" stroke-width="2" marker-end="url(#arr-l4-rose)"/>

              <!-- Step 2 -->
              <g transform="translate(325, 55)">
                <rect x="0" y="0" width="265" height="65" rx="5" fill="#241424" stroke="#f43f5e" stroke-width="1"/>
                <text x="12" y="18" fill="#f43f5e" font-size="9" font-weight="bold">2. gds.*.write (Écriture Atomique)</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Mutation directe des nœuds Neo4j sur disque</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Persistance des attributs d'intelligence criminelle</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Écriture par lots (batches de 10 000)</text>
              </g>

              <!-- Arrow -->
              <path d="M 600 87 L 625 87" stroke="#38bdf8" stroke-width="2" marker-end="url(#arr-l4-purple)"/>

              <!-- Step 3 -->
              <g transform="translate(635, 55)">
                <rect x="0" y="0" width="250" height="65" rx="5" fill="#141a29" stroke="#38bdf8" stroke-width="1"/>
                <text x="12" y="18" fill="#38bdf8" font-size="9" font-weight="bold">3. Re-render Immédiat Layer 6</text>
                <text x="12" y="32" fill="#cbd5e1" font-size="7.5">Événement Redis Pub/Sub vers NVL WebGL</text>
                <text x="12" y="45" fill="#94a3b8" font-size="7.5">Les nœuds pivots grossissent automatiquement</text>
                <text x="12" y="58" fill="#34d399" font-size="7">● Mise à jour visuelle &lt;16ms</text>
              </g>
            </g>

            <!-- Connectors Between Sub-Blocks -->
            <path d="M 300 135 L 330 135" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-l4-purple)"/>
            <path d="M 610 135 L 640 135" stroke="#a855f7" stroke-width="2" marker-end="url(#arr-l4-purple)"/>
            <path d="M 470 255 L 470 280" stroke="#f43f5e" stroke-width="2" marker-end="url(#arr-l4-rose)"/>
          </svg>
        </div>

        <!-- Tech Stack Evaluation Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Composants Technologiques de Layer 4 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie / Algorithme</th>
              <th>Version / Référence</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j GDS</strong></td>
              <td><span class="badge-ver">v2.6 Enterprise</span></td>
              <td>Bibliothèque d'algorithmes de théorie des graphes optimisée en mémoire vive</td>
              <td>
                <ul class="pros-list">
                  <li>Calculs parallélisés en C++ sans verrouiller le moteur transactionnel</li>
                  <li>Plus de 65 algorithmes prêts à l'emploi (centralité, clustering, plongements)</li>
                  <li>Estimation de la RAM préalable pour éviter les pannes OOM (Out Of Memory)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Nécessite une allocation RAM importante sur le serveur de base</li>
                  <li>Mitigation : déchargement automatique des graphes projetés dès la fin du calcul</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Betweenness Centrality (Brandes)</strong></td>
              <td><span class="badge-ver">Algorithme de Brandes (2001)</span></td>
              <td>Détection des intermédiaires obligatoires, passerelles et mules financières</td>
              <td>
                <ul class="pros-list">
                  <li>Met en évidence les comptes bancaires par lesquels transitent tous les fonds</li>
                  <li>Fonctionne même si le suspect n'a que peu de connexions directes</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Complexité en O(V * E) prohibitive sur les graphes de plusieurs millions de nœuds</li>
                  <li>Mitigation : échantillonnage par Betweenness approximée (k-pivot sampling)</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Louvain Modularity</strong></td>
              <td><span class="badge-ver">Blondel et al. (2008)</span></td>
              <td>Découpage de l'organisation criminelle en cellules étanches (communautés)</td>
              <td>
                <ul class="pros-list">
                  <li>Découverte non supervisée du nombre optimal de sous-groupes criminels</li>
                  <li>Révèle les branches régionales (ex: cellule Alger vs cellule Oran)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Sensible à l'ordre de parcours initial des nœuds</li>
                  <li>Mitigation : exécution avec 10 itérations et sélection de la modularité Q maximale</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Adamic-Adar Link Prediction</strong></td>
              <td><span class="badge-ver">Lada Adamic (2003)</span></td>
              <td>Prédiction de complicité entre deux suspects n'ayant pas de communication directe observée</td>
              <td>
                <ul class="pros-list">
                  <li>Pondère plus fortement les contacts communs discrets que les contacts populaires</li>
                  <li>Idéal pour relier deux chefs de réseau qui évitent de s'appeler directement</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Génère des faux positifs si deux personnes partagent un contact public (ex: livreur)</li>
                  <li>Mitigation : filtrage préalable des nœuds à très haut degré (Degree &gt; 500)</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
