# scripts/arch_panel_layer3.py
"""
Tab 4: Layer 3 - Tier de Stockage Polyglotte Spécialisé (6 Moteurs Complémentaires)
Detailed architecture SVG and technical specifications.
"""

def get_panel_layer3():
    return '''    <!-- ====================================================================
         TAB 4: LAYER 3 - TIER DE STOCKAGE POLYGLOTTE (6 MOTEURS COMPLÉMENTAIRES)
         ==================================================================== -->
    <div id="panel-arch-layer3" class="arch-tab-panel">
      <section>
        <h2 class="section-title">4. Layer 3 : Tier de Stockage Polyglotte Spécialisé (6 Moteurs Complémentaires)</h2>
        <p class="section-subtitle">
          Architecture de persistance hybride découplée : chaque nature d'indice judiciaire est confiée à son moteur physique optimal pour garantir performance sub-milliseconde et conformité légale CPP.
        </p>

        <div class="card" style="border-left:4px solid #f43f5e;margin-bottom:1.5rem;">
          <h3 style="color:#f43f5e;margin-bottom:0.5rem;">🎯 Pourquoi un Moteur Unique est une Erreur Fatale en Cyber-Investigation</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Une enquête judiciaire manipule simultanément des graphes relationnels complexes à 5 sauts, des milliards d'enregistrements temporels d'antennes 4G (CDRs), des embeddings faciaux à 512 dimensions, des enregistrements vocaux WhatsApp nécessitant une immuabilité légale stricte (WORM), et des dumps HTML volumineux et imprévisibles. Tenter de forcer toutes ces données dans une base relationnelle classique (PostgreSQL ou MySQL) entraîne un effondrement des temps de requête (&gt;15 secondes pour les jointures récursives) ou l'inadmissibilité des preuves devant la cour d'assises par manque de scellement cryptographique WORM. <strong>Layer 3 déploie 6 moteurs complémentaires interconnectés par un identifiant universel d'indice (Universal Evidence UID).</strong>
          </p>
        </div>

        <!-- Layer 3 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 450" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l3-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-l3-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
              </marker>
            </defs>

            <!-- 6 Dedicated Storage Engine Cards -->

            <!-- ENGINE 1: NEO4J -->
            <g transform="translate(20, 20)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#241424" stroke="#38bdf8" stroke-width="1.8"/>
              <text x="15" y="24" fill="#38bdf8" font-size="12" font-weight="bold">1. NEO4J 5.20+ ENTERPRISE</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Topologie Graphe &amp; Index-Free Adjacency</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• Pointeurs mémoire doublement chaînés</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Traversée de relations en O(k) sub-ms</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Optimiseur JIT de requêtes Cypher</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Bibliothèque APOC Extended intégrée</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Catalog in-memory pour GDS 2.6</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#141f36"/>
              <text x="22" y="153" fill="#38bdf8" font-size="8.5" font-family="monospace">Protocole Bolt • Port 7687</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Latence sub-milliseconde sur 5 sauts</text>
            </g>

            <!-- ENGINE 2: POSTGRESQL + TIMESCALEDB -->
            <g transform="translate(330, 20)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#141a29" stroke="#0ea5e9" stroke-width="1.8"/>
              <text x="15" y="24" fill="#0ea5e9" font-size="12" font-weight="bold">2. POSTGRESQL 16 + TIMESCALE</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Conformité ACID &amp; Séries Temporelles CDRs</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• Tables relationnelles : dossiers, magistrats</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Row-Level Security (RLS) par Wilaya DZ</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Hypertables TimescaleDB (milliards de CDRs)</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Partitionnement automatique jour / cellule BTS</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Arbre de Merkle d'audit cryptographique</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#0c1929"/>
              <text x="22" y="153" fill="#0ea5e9" font-size="8.5" font-family="monospace">PostgreSQL Wire • Port 5432</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Intégrité référentielle stricte CPP</text>
            </g>

            <!-- ENGINE 3: QDRANT VECTOR DB -->
            <g transform="translate(640, 20)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#17122b" stroke="#a855f7" stroke-width="1.8"/>
              <text x="15" y="24" fill="#a855f7" font-size="12" font-weight="bold">3. QDRANT 1.9 (MOTEUR RUST)</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Indexation Vectorielle HNSW &amp; Biométrie</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• Embeddings faciaux ArcFace (512-d)</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Empreintes vocales PyAnnote (192-d)</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Distance cosinus / produit scalaire SIMD</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Filtrage strict par métadonnées (Affaire/Wilaya)</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Quantification scalaire en mémoire vive</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#24153b"/>
              <text x="22" y="153" fill="#a855f7" font-size="8.5" font-family="monospace">gRPC Port 6334 • REST Port 6333</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Recherche k-NN &lt;8ms sur 2M visages</text>
            </g>

            <!-- ENGINE 4: MINIO WORM -->
            <g transform="translate(20, 230)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#241417" stroke="#f43f5e" stroke-width="1.8"/>
              <text x="15" y="24" fill="#f43f5e" font-size="12" font-weight="bold">4. MINIO S3 ENTERPRISE WORM</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Coffre-fort Immuable &amp; Scellés Légaux</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• S3 Object Lock en mode COMPLIANCE strict</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Rétention juridique verrouillée (10 ans)</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Scellement SHA-256 + Horodatage RFC 3161</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Archives WARC des fausses boutiques web</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Enregistrements audio bruts WhatsApp</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#38131a"/>
              <text x="22" y="153" fill="#f43f5e" font-size="8.5" font-family="monospace">S3 API Port 9000 • Console 9001</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Non-répudiation ISO 27037 garantie</text>
            </g>

            <!-- ENGINE 5: MONGODB -->
            <g transform="translate(330, 230)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#0d1f17" stroke="#10b981" stroke-width="1.8"/>
              <text x="15" y="24" fill="#10b981" font-size="12" font-weight="bold">5. MONGODB 7.0 WIREDTIGER</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Dépôt Polymorphe BSON &amp; Scraping Brut</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• Dépôt sans schéma pour les 76 briques OSINT</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Arbres DOM HTML et réponses d'APIs tierces</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Compression par bloc Snappy (gain 70% disque)</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Ingestion haute vélocité sans migration</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Change Streams pour extraction en continu</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#143323"/>
              <text x="22" y="153" fill="#10b981" font-size="8.5" font-family="monospace">Mongo Wire Protocol • Port 27017</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Ingestion de 35 000 docs BSON / sec</text>
            </g>

            <!-- ENGINE 6: REDIS STACK -->
            <g transform="translate(640, 230)">
              <rect x="0" y="0" width="280" height="190" rx="8" fill="#241014" stroke="#e11d48" stroke-width="1.8"/>
              <text x="15" y="24" fill="#e11d48" font-size="12" font-weight="bold">6. REDIS 7.2 STACK EN MÉMOIRE</text>
              <text x="15" y="40" fill="#94a3b8" font-size="8.5">Bus Temps Réel, Cache &amp; Quotas Anti-Ban</text>
              <text x="15" y="60" fill="#cbd5e1" font-size="8">• Pub/Sub WebSockets vers le Studio NVL (60 FPS)</text>
              <text x="15" y="75" fill="#cbd5e1" font-size="8">• Redis Streams pour la file de tâches Celery</text>
              <text x="15" y="90" fill="#cbd5e1" font-size="8">• Token-Bucket anti-ban distribué par script Lua</text>
              <text x="15" y="105" fill="#cbd5e1" font-size="8">• Verrous distribués Redlock multi-instances</text>
              <text x="15" y="120" fill="#cbd5e1" font-size="8">• Cache d'expansion de sous-graphe 30s</text>
              <rect x="15" y="138" width="250" height="22" rx="4" fill="#3b111a"/>
              <text x="22" y="153" fill="#e11d48" font-size="8.5" font-family="monospace">RESP3 Protocol • Port 6379</text>
              <text x="15" y="178" fill="#34d399" font-size="8">● Latence d'accès &lt;0.5 milliseconde</text>
            </g>
          </svg>
        </div>

        <!-- Cross-Engine Evidence Linkage Matrix Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Matrice de Corrélation d'un Indice Judiciaire à Travers les 6 Moteurs</h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.55;">
          Chaque élément de preuve récolté est indexé de manière cohérente à travers un identifiant universel <code>evidence_uid</code> (ex: Note Vocale WhatsApp d'extorsion) :
        </p>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Moteur</th>
              <th>Donnée Spécifique Stockée</th>
              <th>Format / Structure</th>
              <th>Rôle dans l'Instruction Pénale</th>
              <th>Latence d'Accès SLA</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Neo4j 5.20+</strong></td>
              <td>Nœud <code>(:NoteVocale)</code> relié à <code>(:Personne)</code> par <code>[:ENVOYEE_PAR]</code></td>
              <td>Propriétés Graphe (durée, horodatage, hash)</td>
              <td>Révélation des liens de causalité et co-implication</td>
              <td>&lt; 4 ms (Bolt)</td>
            </tr>
            <tr>
              <td><strong>PostgreSQL 16</strong></td>
              <td>Métadonnées d'acte de procédure, numéro de procès-verbal et officier saisissant</td>
              <td>Ligne relationnelle ACID + clé étrangère affaire</td>
              <td>Traçabilité légale et registre de scellés CPP</td>
              <td>&lt; 1 ms (SQL)</td>
            </tr>
            <tr>
              <td><strong>Qdrant 1.9</strong></td>
              <td>Vecteur 192-d de l'empreinte acoustique du suspect (PyAnnote 3.1)</td>
              <td>Point vectoriel HNSW avec payload <code>{case_id: "089"}</code></td>
              <td>Recoupement biométrique avec d'autres affaires non élucidées</td>
              <td>&lt; 8 ms (gRPC)</td>
            </tr>
            <tr>
              <td><strong>MinIO S3 WORM</strong></td>
              <td>Fichier binaire audio original chiffré <code>whatsapp_voice_01.ogg</code></td>
              <td>Objet S3 avec verrouillage COMPLIANCE et scellé RFC 3161</td>
              <td>Conservation inviolable de la preuve matérielle originale</td>
              <td>&lt; 15 ms (Streaming)</td>
            </tr>
            <tr>
              <td><strong>MongoDB 7.0</strong></td>
              <td>Dump JSON brut des métadonnées de messagerie extraites par Mitmproxy</td>
              <td>Document BSON non structuré avec logs réseau</td>
              <td>Reconstitution technique exhaustive en cas de contestation</td>
              <td>&lt; 2 ms (Wire)</td>
            </tr>
            <tr>
              <td><strong>Redis 7.2</strong></td>
              <td>Notification d'événement en temps réel <code>clue:discovered:voice_01</code></td>
              <td>Message Pub/Sub diffusé sur WebSocket NVL</td>
              <td>Apparition instantanée du nœud sur l'écran de l'enquêteur (60 FPS)</td>
              <td>&lt; 0.5 ms (RESP3)</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
