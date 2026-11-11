# scripts/arch_panel_layer2.py
"""
Tab 3: Layer 2 - Ingestion, Orchestration de Workflows & Pipeline de Normalisation
Detailed architecture SVG and technical specifications.
Direct persistence to Layer 3 explicitly formalized.
"""

def get_panel_layer2():
    return '''    <!-- ====================================================================
         TAB 3: LAYER 2 - INGESTION & PIPELINE DE NORMALISATION POLYGLOTTE
         ==================================================================== -->
    <div id="panel-arch-layer2" class="arch-tab-panel">
      <section>
        <h2 class="section-title">3. Layer 2 : Ingestion, Orchestration de Workflows &amp; Pipeline de Normalisation</h2>
        <p class="section-subtitle">
          Passerelle d'entrée sécurisée, orchestration asynchrone des tâches d'investigation, validation stricte RBAC et persistance directe dans le tier de stockage polyglotte.
        </p>

        <div class="card" style="border-left:4px solid #0ea5e9;margin-bottom:1.5rem;">
          <h3 style="color:#0ea5e9;margin-bottom:0.5rem;">🎯 Mission Opérationnelle du Layer 2 &amp; Règle d'Accès Direct au Stockage</h3>
          <p style="font-size:0.83rem;color:var(--text-secondary);line-height:1.55;">
            Les données récoltées sur le terrain ou par scraping OSINT arrivent sous des formats chaotiques : chaînes brutes, pages HTML volumineuses, numéros de téléphone mal formatés (ex: <code>0555019283</code> vs <code>+213 555 01 92 83</code>), reçus bancaires froissés. Layer 2 garantit la validation cryptographique de l'enquêteur (JWT + RBAC), distribue les charges sur des files asynchrones Celery/Redis, normalise chaque entité dans son format canonique E.164 / SHA-256 et scelle les preuves au format WORM ISO 28500.<br/>
            <strong>Règle d'accès direct au stockage :</strong> Layer 2 persiste et interroge <strong>DIRECTEMENT</strong> les 6 moteurs du <strong>Layer 3</strong> (PostgreSQL, Neo4j, MinIO, MongoDB, Qdrant, Redis) via des pilotes natifs asynchrones (asyncpg, Bolt, boto3, Motor, gRPC), <strong>sans jamais transiter par Layer 1 ni par Layer 4/5</strong> pour les opérations CRUD ou la restitution au Studio d'Enquête (Layer 6).
          </p>
        </div>

        <!-- Layer 2 Specific High-Resolution Architecture SVG -->
        <div style="background:#060a12;border:1px solid #1a2538;border-radius:8px;padding:0.75rem;margin-bottom:1.5rem;overflow-x:auto;">
          <svg viewBox="0 0 940 440" xmlns="http://www.w3.org/2000/svg" style="min-width:880px;font-family:system-ui,-apple-system,sans-serif;">
            <defs>
              <marker id="arr-l2-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9"/>
              </marker>
              <marker id="arr-l2-blue" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8"/>
              </marker>
              <marker id="arr-l2-rose" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#f43f5e"/>
              </marker>
            </defs>

            <!-- SUB-BOX 1: INGRESS & SECURITY GATEWAY -->
            <g transform="translate(20, 25)">
              <rect x="0" y="0" width="280" height="230" rx="8" fill="#0c1929" stroke="#0ea5e9" stroke-width="1.8"/>
              <text x="15" y="25" fill="#0ea5e9" font-size="11.5" font-weight="bold">1. API GATEWAY &amp; SÉCURITÉ INGRESS</text>
              <text x="15" y="42" fill="#94a3b8" font-size="8.5">• Nginx Reverse Proxy (Terminaison TLS 1.3)</text>
              <text x="15" y="58" fill="#94a3b8" font-size="8.5">• FastAPI 0.111.x (Python 3.11 Async / Uvicorn)</text>
              <text x="15" y="74" fill="#94a3b8" font-size="8.5">• Casdoor / Keycloak (OAuth2 / OIDC JWT)</text>
              <text x="15" y="90" fill="#94a3b8" font-size="8.5">• Intercepteur d'audit non-répudiable SHA-256</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
              <text x="22" y="122" fill="#38bdf8" font-size="8.5" font-weight="bold">🛡️ RBAC &amp; RLS Judiciaire Granulaire</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Filtrage multi-wilayas étanche (01 à 58)</text>

              <text x="15" y="165" fill="#94a3b8" font-size="8.5">• Validation automatique schémas OpenAPI v3</text>
              <text x="15" y="181" fill="#94a3b8" font-size="8.5">• Passerelle WebSockets Multiplexée</text>
              <text x="15" y="197" fill="#94a3b8" font-size="8.5">• Débit SLA : 3 500 req/sec (P99 &lt;12ms)</text>
              <rect x="15" y="208" width="250" height="16" rx="3" fill="#10253d"/>
              <text x="22" y="220" fill="#38bdf8" font-size="7.5" font-family="monospace">REST Port 48997 • Casdoor Port 45910</text>
            </g>

            <!-- SUB-BOX 2: WORKFLOW ORCHESTRATOR & CELERY -->
            <g transform="translate(330, 25)">
              <rect x="0" y="0" width="280" height="230" rx="8" fill="#0f1f33" stroke="#0ea5e9" stroke-width="1.8"/>
              <text x="15" y="25" fill="#0ea5e9" font-size="11.5" font-weight="bold">2. ORCHESTRATEUR DE WORKFLOWS</text>
              <text x="15" y="42" fill="#94a3b8" font-size="8.5">• Celery 5.4 Task Distributed Cluster</text>
              <text x="15" y="58" fill="#94a3b8" font-size="8.5">• Temporal.io v1.24 Machine à États Finis</text>
              <text x="15" y="74" fill="#94a3b8" font-size="8.5">• Broker de messages Redis 7.2 Streams</text>
              <text x="15" y="90" fill="#94a3b8" font-size="8.5">• Gestion déterministe des reprises sur panne</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
              <text x="22" y="122" fill="#38bdf8" font-size="8.5" font-weight="bold">⚡ 3 Niveaux de Files de Priorité</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">High: OTP/WebRTC • Normal: OSINT • Low: OCR/WARC</text>

              <text x="15" y="165" fill="#94a3b8" font-size="8.5">• Dead-Letter Queue (DLQ) automatique</text>
              <text x="15" y="181" fill="#94a3b8" font-size="8.5">• Supervision en direct via Flower UI</text>
              <text x="15" y="197" fill="#94a3b8" font-size="8.5">• Capacité : 10 000 transitions/sec</text>
              <rect x="15" y="208" width="250" height="16" rx="3" fill="#10253d"/>
              <text x="22" y="220" fill="#38bdf8" font-size="7.5" font-family="monospace">Temporal Port 7233 • Redis Streams 6379</text>
            </g>

            <!-- SUB-BOX 3: CANONICAL NORMALIZATION & TOKEN BUCKET -->
            <g transform="translate(640, 25)">
              <rect x="0" y="0" width="280" height="230" rx="8" fill="#0d1b2a" stroke="#0ea5e9" stroke-width="1.8"/>
              <text x="15" y="25" fill="#0ea5e9" font-size="11.5" font-weight="bold">3. NORMALISATION &amp; ANTI-BAN</text>
              <text x="15" y="42" fill="#94a3b8" font-size="8.5">• Pydantic v2 Canonical Validation Engine</text>
              <text x="15" y="58" fill="#94a3b8" font-size="8.5">• E.164 Phone Normalizer (+213 xx xx xx xx)</text>
              <text x="15" y="74" fill="#94a3b8" font-size="8.5">• Algérie Poste BaridiMob RIP Luhn Check</text>
              <text x="15" y="90" fill="#94a3b8" font-size="8.5">• Normalisation temporelle Africa/Algiers</text>

              <rect x="15" y="105" width="250" height="42" rx="4" fill="#132338" stroke="#0ea5e9" stroke-width="0.8"/>
              <text x="22" y="122" fill="#38bdf8" font-size="8.5" font-weight="bold">🛡️ Token Bucket &amp; Proxy Mesh</text>
              <text x="22" y="137" fill="#cbd5e1" font-size="7.5">Quotas stricts anti-blocage (Facebook, Truecaller)</text>

              <text x="15" y="165" fill="#94a3b8" font-size="8.5">• Rotation dynamique de proxies résidentiels</text>
              <text x="15" y="181" fill="#94a3b8" font-size="8.5">• Circuit-breaker sur HTTP 429 / 403</text>
              <text x="15" y="197" fill="#94a3b8" font-size="8.5">• Déduplication stricte par empreinte SHA-256</text>
              <rect x="15" y="208" width="250" height="16" rx="3" fill="#10253d"/>
              <text x="22" y="220" fill="#38bdf8" font-size="7.5" font-family="monospace">Standard Universel GFPG (14 Entités)</text>
            </g>

            <!-- SUB-BOX 4: DIRECT STORAGE PERSISTENCE CONNECTORS -->
            <g transform="translate(20, 275)">
              <rect x="0" y="0" width="900" height="145" rx="8" fill="#140d1a" stroke="#f43f5e" stroke-width="2"/>
              <text x="15" y="25" fill="#f43f5e" font-size="12" font-weight="bold">4. PASSERELLES D'ACCÈS DIRECT AU STOCKAGE POLYGLOTTE (LAYER 3 DIRECT DRIVERS)</text>
              <text x="15" y="42" fill="#fda4af" font-size="9">Connexions asynchrones directes : aucun intermédiaire entre Layer 2 et les 6 moteurs de persistance de Layer 3.</text>

              <!-- Connector 1: Neo4j Bolt -->
              <g transform="translate(15, 55)">
                <rect x="0" y="0" width="135" height="75" rx="5" fill="#241424" stroke="#38bdf8" stroke-width="1"/>
                <text x="10" y="18" fill="#38bdf8" font-size="9.5" font-weight="bold">Neo4j Bolt Pool</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">neo4j-python-driver</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">Sessions Bolt asynchrones</text>
                <text x="10" y="58" fill="#38bdf8" font-size="7.5">Port 7687 • &lt;5ms</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Écriture nœuds/arêtes</text>
              </g>

              <!-- Connector 2: PostgreSQL asyncpg -->
              <g transform="translate(165, 55)">
                <rect x="0" y="0" width="135" height="75" rx="5" fill="#141a29" stroke="#0ea5e9" stroke-width="1"/>
                <text x="10" y="18" fill="#0ea5e9" font-size="9.5" font-weight="bold">PostgreSQL Pool</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">asyncpg / SQLAlchemy 2.0</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">Pool 50 connexions réutilisables</text>
                <text x="10" y="58" fill="#0ea5e9" font-size="7.5">Port 5432 • ACID</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Insertion CDRs &amp; Audit</text>
              </g>

              <!-- Connector 3: Qdrant gRPC -->
              <g transform="translate(315, 55)">
                <rect x="0" y="0" width="135" height="75" rx="5" fill="#17122b" stroke="#a855f7" stroke-width="1"/>
                <text x="10" y="18" fill="#a855f7" font-size="9.5" font-weight="bold">Qdrant Client</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">qdrant-client gRPC</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">Protobuf v3 multiplexé</text>
                <text x="10" y="58" fill="#a855f7" font-size="7.5">Port 6334 • &lt;8ms</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Indexation biométrique</text>
              </g>

              <!-- Connector 4: MinIO boto3 -->
              <g transform="translate(465, 55)">
                <rect x="0" y="0" width="135" height="75" rx="5" fill="#241417" stroke="#f43f5e" stroke-width="1"/>
                <text x="10" y="18" fill="#f43f5e" font-size="9.5" font-weight="bold">MinIO S3 Client</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">boto3 / aioboto3 S3</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">Object Lock Compliance</text>
                <text x="10" y="58" fill="#f43f5e" font-size="7.5">Port 9000 • WORM</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Dépôt scellés légaux</text>
              </g>

              <!-- Connector 5: MongoDB Motor -->
              <g transform="translate(615, 55)">
                <rect x="0" y="0" width="135" height="75" rx="5" fill="#0d1f17" stroke="#10b981" stroke-width="1"/>
                <text x="10" y="18" fill="#10b981" font-size="9.5" font-weight="bold">MongoDB Motor</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">motor.motor_asyncio</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">BSON non-bloquant</text>
                <text x="10" y="58" fill="#10b981" font-size="7.5">Port 27017 • Wire</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Dumps scrapers bruts</text>
              </g>

              <!-- Connector 6: Redis RESP3 -->
              <g transform="translate(765, 55)">
                <rect x="0" y="0" width="120" height="75" rx="5" fill="#241014" stroke="#e11d48" stroke-width="1"/>
                <text x="10" y="18" fill="#f43f5e" font-size="9.5" font-weight="bold">Redis Pool</text>
                <text x="10" y="32" fill="#cbd5e1" font-size="7.5">redis-py asyncio</text>
                <text x="10" y="45" fill="#94a3b8" font-size="7.5">Protocole RESP3</text>
                <text x="10" y="58" fill="#f43f5e" font-size="7.5">Port 6379 • &lt;0.5ms</text>
                <text x="10" y="70" fill="#34d399" font-size="7">● Pub/Sub &amp; Quotas</text>
              </g>
            </g>

            <!-- Inter-block Arrows -->
            <path d="M 300 135 L 330 135" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arr-l2-cyan)"/>
            <path d="M 610 135 L 640 135" stroke="#0ea5e9" stroke-width="2" marker-end="url(#arr-l2-cyan)"/>
            <path d="M 470 255 L 470 275" stroke="#f43f5e" stroke-width="2.5" marker-end="url(#arr-l2-rose)"/>
          </svg>
        </div>

        <!-- Technical Deep-Dive Narrative -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin:1.5rem 0 0.6rem;">Architecture Technique &amp; Mécanismes de Traitement du Layer 2</h3>
        <p style="font-size:0.82rem;color:var(--text-secondary);line-height:1.55;">
          Layer 2 est le centre opérationnel garantissant la robustesse, la conformité légale et la performance d'exécution de toutes les requêtes :
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(280px, 1fr));gap:1rem;margin-bottom:1.5rem;">
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#0ea5e9;margin:0 0 0.4rem;font-size:0.9rem;">1. Règle d'Accès Direct &amp; Élimination des Hops</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Contrairement à un pipeline rigide en cascade, Layer 2 gère directement un ensemble de connexions persistantes vers Layer 3. Une requête du magistrat pour afficher les métadonnées d'une affaire s'exécute directement sur PostgreSQL (0.8ms) ; une recherche de co-implication 3-sauts interroge directement Neo4j (4.2ms) via Bolt. Aucun passage par Layer 1 ou Layer 4/5 n'est imposé.
            </p>
          </div>
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#38bdf8;margin:0 0 0.4rem;font-size:0.9rem;">2. Algorithme Token-Bucket Distribué</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Chaque outil d'interrogation externe (ex: API Facebook, recherche inversée Truecaller) dispose d'un bucket de jetons synchronisé sur Redis (script Lua atomique). Lorsqu'un quota est atteint, la tâche Celery est automatiquement suspendue avec un délai de retry exponentiel jitterisé, évitant tout bannissement d'adresses IP judiciaires.
            </p>
          </div>
          <div style="background:#0c1322;border:1px solid #1e293b;border-radius:6px;padding:0.9rem;">
            <h4 style="color:#10b981;margin:0 0 0.4rem;font-size:0.9rem;">3. Normalisation Pydantic v2 &amp; Standard GFPG</h4>
            <p style="color:#cbd5e1;font-size:0.78rem;line-height:1.45;margin:0;">
              Tous les indices bruts sont validés contre 14 modèles canoniques (PERSON, PHONE_NUMBER, BANK_ACCOUNT, etc.). Les numéros de téléphone sont normalisés en E.164 (+213), les comptes BaridiMob sont validés par l'algorithme officiel d'Algérie Poste (RIP 20 chiffres + clé 2 chiffres), et les horodatages sont convertis en ISO-8601 UTC+1.
            </p>
          </div>
        </div>

        <!-- Tech Stack Evaluation Table -->
        <h3 style="color:#f8fafc;font-size:1.05rem;margin-bottom:0.6rem;">Composants Technologiques de Layer 2 (Versions, Rôles, Avantages &amp; Limites)</h3>
        <table class="tech-table">
          <thead>
            <tr>
              <th>Technologie</th>
              <th>Version</th>
              <th>Rôle dans l'Architecture</th>
              <th>Avantages (Pros)</th>
              <th>Inconvénients &amp; Mitigations (Cons)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>FastAPI</strong></td>
              <td><span class="badge-ver">v0.111.x (Python 3.11)</span></td>
              <td>Passerelle API Ingress, validation des schémas Pydantic v2 et passerelle WebSocket</td>
              <td>
                <ul class="pros-list">
                  <li>Performance asynchrone maximale basée sur Starlette et Uvicorn</li>
                  <li>Génération automatique de la documentation OpenAPI / Swagger</li>
                  <li>Contrôle strict des permissions RBAC sur chaque route judiciaire</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Requiert une gestion rigoureuse des workers asynchrones sous forte charge</li>
                  <li>Mitigation : Gunicorn avec 8 Uvicorn workers et reverse-proxy Nginx</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Celery</strong></td>
              <td><span class="badge-ver">v5.4.0</span></td>
              <td>Distribution asynchrone des tâches d'investigation et gestion des files d'attente</td>
              <td>
                <ul class="pros-list">
                  <li>Routage fin des tâches sur des files prioritaires (urgente, standard, batch)</li>
                  <li>Reprise automatique sur erreur avec politique de backoff exponentiel</li>
                  <li>Intégration native avec Redis Streams et RabbitMQ</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Surveillance complexe de l'état des workers distribués</li>
                  <li>Mitigation : tableau de bord Flower et sondes Prometheus intégrées</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Temporal.io</strong></td>
              <td><span class="badge-ver">v1.24.x</span></td>
              <td>Orchestration des workflows d'enquête complexes à longue durée de vie</td>
              <td>
                <ul class="pros-list">
                  <li>Exécution déterministe résiliente aux redémarrages de serveurs</li>
                  <li>Gestion native des pauses pour validation humaine par l'enquêteur</li>
                  <li>Historique d'exécution immuable et auditable devant le tribunal</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Courbe d'apprentissage élevée pour les développeurs Python</li>
                  <li>Mitigation : encapsulation des workflows dans des decorators standardisés</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td><strong>Pydantic</strong></td>
              <td><span class="badge-ver">v2.7.x (Core Rust)</span></td>
              <td>Validation canonique des données et sérialisation haute performance</td>
              <td>
                <ul class="pros-list">
                  <li>Validation 5x à 20x plus rapide grâce au moteur écrit en Rust</li>
                  <li>Typage strict empêchant l'injection de données corrompues dans Neo4j</li>
                  <li>Conversion automatique des formats locaux algériens (dates, montants DZD)</li>
                </ul>
              </td>
              <td>
                <ul class="cons-list">
                  <li>Rejette impitoyablement les entrées mal formées sans fallback automatique</li>
                  <li>Mitigation : pipeline de pré-nettoyage Regex tolérant avant validation</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
'''
