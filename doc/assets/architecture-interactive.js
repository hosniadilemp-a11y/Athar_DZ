// AegisInvestigate — Interactive Software Engineering Architecture Inspector
// Provides deep-dive technical specs on click: Protocols, Data Payloads, Latency, and Fault-Tolerance.
// Synchronized with the 6-Layer Decoupled Architecture and Direct Persistence Highway.

const ARCHITECTURE_SPEC_NODES = {
  // Layer 6: Presentation Tier
  ui_client: {
    layer: 'Layer 6: Tier Présentation & Studio d\'Enquête Dual-Canvas',
    name: 'Investigation Desktop Studio (Neo4j NVL WebGL + Minimap Synchronisée)',
    tech: '@neo4j-nvl/react, WebGL 2.0 Shaders, React 19, @neo4j-nvl/layout-workers, BarScroll.js (Timeline)',
    protocol: 'HTTPS / WSS (WebSockets RFC 6455)',
    port: '48997 (WSS Gateway) • Local WebGL GPU Canvas',
    throughput: '60 FPS permanents sur 50 000+ nœuds • Budget de trame < 16ms (zéro lag)',
    resilience: 'Workers de disposition physique déportés en arrière-plan • Reconnexion WebSocket avec backoff exponentiel',
    payload: `{
  "action": "FOCUS_SUSPECT_NODE",
  "caseId": "2026-SCAM-089",
  "nodeId": "person_walid_b",
  "label": "Personne",
  "properties": {
    "nom_complet": "Walid BOUAZIZ",
    "numero_e164": "+213555019283",
    "_class": "operationnel",
    "_betweennessCentrality": 0.842,
    "_wiliya_Activiti": "16 - Alger"
  },
  "visualRender": {
    "color": "#f43f5e",
    "size": 135,
    "icon": "/icon/Personne.png"
  }
}`
  },

  // Layer 2: API Gateway & Orchestration
  gateway_api: {
    layer: 'Layer 2: Ingress API Gateway & Orchestrateur de Workflows',
    name: 'Passerelle API Ingress, Contrôle RBAC & Normalisation Canonique Pydantic v2',
    tech: 'FastAPI 0.111.x (Python 3.11 Async), Uvicorn, Casdoor / Keycloak (OAuth2 / OIDC JWT), Celery 5.4, Temporal.io v1.24',
    protocol: 'HTTP/2 REST + WebSockets Multiplexés + TLS 1.3 • Bolt & asyncpg directs vers Layer 3',
    port: '48997 (REST API), 45910 (Casdoor IAM), 7233 (Temporal)',
    throughput: '3 500 req/sec • Latence P99 < 12ms • 10 000 transitions d\'états workflows/sec',
    resilience: 'Token-Bucket distribué anti-ban • Circuit-breaker sur APIs tierces • Accès direct indépendant aux 6 moteurs de Layer 3',
    payload: `{
  "sub": "officier_investigateur_016",
  "role": "OFFICIER_POLICE_JUDICIAIRE",
  "wilayaScope": ["16", "09", "31"],
  "clearance": "SECRET_INSTRUCTION_CPP_ART11",
  "auditSignature": "rsa-sha256-sig-9f82b1...38a",
  "directPersistenceRules": {
    "neo4j": "bolt://cluster-graph:7687",
    "postgres": "postgresql+asyncpg://pg-cluster:5432/athar",
    "minio": "s3://minio:9000/scelles-compliance",
    "qdrant": "grpc://qdrant:6334",
    "mongodb": "mongodb://mongo:27017/osint_raw",
    "redis": "redis://redis-stack:6379"
  }
}`
  },

  // Layer 1: Phone Farm & Covert Mobile Acquisition
  phone_farm: {
    layer: 'Layer 1: Acquisition Forensique & Phone Farm Android',
    name: 'Ferme de Smartphones ReDroid Android 13 & Banque Modems SIM 4G DZ',
    tech: 'ReDroid (Android 13 AOSP GPU Passthrough), Magisk 26 + Zygisk Root Cloaking, Modems SIM USB (Mobilis/Djezzy/Ooredoo), Scrcpy WebRTC 60 FPS, Mitmproxy 10.3, Frida 16.x',
    protocol: 'AT Commands pyserial (/dev/ttyUSB0..31), ADB Wire TCP (5555), WebRTC / WSS (Scrcpy Video)',
    port: '5555 (ADB), 8000 (WebRTC Video), 8080 (Mitmproxy TLS)',
    throughput: 'Streaming vidéo 60 FPS ultra-faible latence (<30ms) • Réception OTP SMS en <1.5s',
    resilience: 'Isolation namespaces réseau par conteneur • KillSwitch VPN par défaut • Rotation automatique des profils matériels SM-S911B',
    payload: `{
  "action": "INTERCEPT_SMS_OTP",
  "operator": "Mobilis_DZ",
  "modemTty": "/dev/ttyUSB4",
  "targetService": "WhatsApp_Business_Activation",
  "receivedSms": {
    "sender": "WhatsApp",
    "otpCode": "849201",
    "rawPayload": "Votre code WhatsApp Business est le 849-201",
    "latencyMs": 1180,
    "pushedTo": "redis://stream:otp_events"
  }
}`
  },

  // Layer 4: Analytics GDS & SNA
  engine_gds: {
    layer: 'Layer 4: Moteur Analytics & Graph Data Science (GDS 2.6)',
    name: 'Neo4j Graph Data Science (GDS 2.6) In-Memory Analytics & SNA Algorithms',
    tech: 'Neo4j GDS 2.6 Enterprise C++ Kernel, Brandes Betweenness Centrality, Louvain Modularity, Adamic-Adar Link Prediction, Random Forest Role Classifier',
    protocol: 'Protocole Bolt interne en mémoire vive • Direct Memory Buffer',
    port: '7687 (Interne Neo4j Graph Data Science Catalog)',
    throughput: 'Calcul de centralité Brandes en <80ms sur 50 000 nœuds • Partitionnement Louvain en <120ms',
    resilience: 'Memory Estimator pré-projection prévenant les OOM • Déchargement dynamique des graphes in-memory après écriture retour (write-back)',
    payload: `{
  "gdsOperation": "gds.betweenness.write",
  "graphName": "affaire_scam_candy_wheels_projection",
  "configuration": {
    "writeProperty": "_betweennessCentrality",
    "concurrency": 8
  },
  "computedMetrics": {
    "nodeCount": 104,
    "relationshipCount": 182,
    "topBroker": {
      "nodeId": "compte_baridimob_mule_01",
      "score": 0.9412,
      "roleAssigned": "operationnel"
    }
  }
}`
  },

  // Layer 5: Sovereign Local AI & Biometrics
  engine_ai: {
    layer: 'Layer 5: IA Souveraine Locale, LLM & Biométrie Multimodale',
    name: 'Moteur d\'Inférence 100% Local (Ollama Text-to-Cypher, Faster-Whisper Darija, PyAnnote, ArcFace)',
    tech: 'Ollama Gemma-2-9b (Q4), CTranslate2 Faster-Whisper Large-v3 (ar-DZ), PyAnnote Audio 3.1, ArcFace DeepFace 512-d, RTX 4090 24 Go VRAM',
    protocol: 'gRPC HTTP/2, CTranslate2 Native C++, Ollama REST API',
    port: '11434 (Ollama), 6334 (Qdrant gRPC)',
    throughput: 'Inférence Text-to-Cypher <450ms • Transcription Darija 4x temps réel • Rapprochement facial Qdrant <8ms',
    resilience: 'Isolation mémoire VRAM GPU étanche (8Go LLM, 4Go Whisper, 2Go Diarisation, 2Go Visages) • Boucle AST validate_query anti-injection',
    payload: `{
  "speechInference": {
    "sourceAudio": "s3://scelles/2026-SCAM-089/audio_vocal_01.ogg",
    "detectedLanguage": "ar-DZ-darija",
    "transcription": "Khoya ba3atli 10 mlayen f BaridiMob Bab Ezzouar doka",
    "entitiesExtracted": {
      "amountDZD": 100000,
      "paymentChannel": "BaridiMob",
      "commune": "Bab Ezzouar",
      "wilaya": "16 - Alger"
    },
    "voicePrintVector": "qdrant://suspect_biometrics/point_98124"
  }
}`
  },

  // Layer 3: Polyglot Storage — Neo4j Graph
  storage_graph: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Graphe & Relations',
    name: 'Neo4j 5.20+ Enterprise Graph Database (Index-Free Adjacency)',
    tech: 'Neo4j 5.20+ Enterprise, Cypher JIT Engine, APOC Extended, Double-linked in-memory pointers',
    protocol: 'Protocole Bolt binaire v5.4',
    port: '7687 (Bolt), 7474 (HTTP Console)',
    throughput: 'Traversée de relations en O(k) sub-milliseconde • 150 000 lectures Cypher/sec',
    resilience: 'Raft Clustering haute disponibilité 3 instances • Snapshots incrémentaux point-in-time',
    payload: `// Cypher Query executed via Bolt in 3.8ms
MATCH (p:Personne {numero_e164: "+213555019283"})
MATCH path = (p)-[:COMMUNIQUE_AVEC|EFFECTUE_VIREMENT*1..3]-(c:Personne)
RETURN path, p._class, p._betweennessCentrality
LIMIT 100;`
  },

  // Layer 3: Polyglot Storage — PostgreSQL + TimescaleDB
  storage_postgres: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Relationnel & Séries Temporelles',
    name: 'PostgreSQL 16 + TimescaleDB (Dossiers ACID, RLS Multi-Wilayas & Hyper-tables CDRs)',
    tech: 'PostgreSQL 16 Enterprise, Extension TimescaleDB 2.14, Row-Level Security (RLS) cryptographique',
    protocol: 'PostgreSQL Wire Protocol TCP • Connexions asynchrones asyncpg',
    port: '5432 (SQL Standard)',
    throughput: 'Insertion de 80 000 CDRs d\'antennes BTS/sec • Temps de requête alibi <15ms',
    resilience: 'Streaming Replication synchrone • Journal d\'audit Merkle Tree SHA-256 non-répudiable',
    payload: `SELECT 
    cell_id, operator, timestamp_call, duration_sec, wilaya_code
FROM telecom_cdr_hypertables
WHERE caller_e164 = '+213555019283'
  AND timestamp_call BETWEEN '2026-11-01 00:00:00+01' AND '2026-11-02 23:59:59+01'
ORDER BY timestamp_call ASC;`
  },

  // Layer 3: Polyglot Storage — Qdrant Vector Engine
  storage_qdrant: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Vecteurs Biométriques & Sémantiques',
    name: 'Qdrant 1.9 Vector Search Engine (Moteur HNSW écrit en Rust)',
    tech: 'Qdrant Vector DB 1.9 (Rust), Distance Cosinus SIMD, Indexation HNSW, Quantification Scalaire',
    protocol: 'gRPC over HTTP/2 (Protobuf v3) + REST JSON',
    port: '6334 (gRPC), 6333 (REST)',
    throughput: 'Recherche k-NN sous les 8ms sur 2 000 000 d\'empreintes faciales 512-d',
    resilience: 'Write-Ahead Log (WAL) sur disque NVMe • Filtrage strict par métadonnées de dossier sans re-scan',
    payload: `{
  "collection_name": "facial_embeddings_512d",
  "vector": [0.0412, -0.0891, 0.1284, "... 512-d ArcFace ..."],
  "filter": {
    "must": [
      { "key": "case_id", "match": { "value": "2026-SCAM-089" } },
      { "key": "sexe", "match": { "value": "M" } }
    ]
  },
  "limit": 5,
  "with_payload": true
}`
  },

  // Layer 3: Polyglot Storage — MinIO WORM Evidence Vault
  storage_minio: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Coffre-fort Numérique WORM Immuable',
    name: 'MinIO Enterprise S3 Object Storage avec S3 Object Lock (Mode COMPLIANCE Strict)',
    tech: 'MinIO High-Performance Storage, S3 Object Lock COMPLIANCE, RFC 3161 Timestamping, Erasure Coding 16 disques',
    protocol: 'Amazon S3 REST API (HTTPS Chiffré TLS 1.3)',
    port: '9000 (S3 API), 9001 (Web Console)',
    throughput: 'Débit continu jusqu\'à 2.5 Go/s • Zéro altération possible de la preuve numérique',
    resilience: 'Parité Erasure Coding permettant la perte de 4 disques simultanés • Rétention 10 ans verrouillée par kernel',
    payload: `{
  "bucket": "scelles-judiciaires-2026",
  "object": "affaire_089/scelle_audio_vocal_01.ogg",
  "contentLength": 384912,
  "contentType": "audio/ogg; codecs=opus",
  "x-amz-object-lock-mode": "COMPLIANCE",
  "x-amz-object-lock-retain-until-date": "2036-11-10T00:00:00Z",
  "sha256": "8f9214b1a208c9038201948ba201938501284719284719284719283749102847"
}`
  },

  // Layer 3: Polyglot Storage — MongoDB Raw Scraping
  storage_mongodb: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Dépôt Document BSON Brut Polymorphe',
    name: 'MongoDB 7.0 WiredTiger (Ingestion sans schéma des dumps des 76 briques OSINT)',
    tech: 'MongoDB 7.0 BSON Document Engine, Moteur WiredTiger, Compression de blocs Snappy (gain 70%)',
    protocol: 'MongoDB Wire Protocol over TCP',
    port: '27017 (Wire Port Interne)',
    throughput: '35 000 écritures BSON sans schéma / seconde • Ingestion instantanée sans migration DDL',
    resilience: 'Replica Set 3 membres avec élection Raft • Change Streams déclenchant l\'extraction d\'IOCs',
    payload: `{
  "_id": "672f9a10c8b4a100129b4412",
  "toolSource": "tool_web_warc_snapshot",
  "urlTarget": "https://boutique-pneus-dz.shop",
  "ingestedAt": "2026-11-02T14:22:08Z",
  "rawDomAst": {
    "forms": [{ "action": "/payer_baridimob", "method": "POST" }],
    "metaPixels": ["88419203314"],
    "trackingIds": ["GA-9812401-2"]
  },
  "warcRef": "s3://scelles-judiciaires-2026/affaire_089/boutique.warc.gz"
}`
  },

  // Layer 3: Polyglot Storage — Redis 7.2 Stack
  storage_redis: {
    layer: 'Layer 3: Stockage Polyglotte Spécialisé — Cache Mémoire, Bus Temps Réel & Quotas',
    name: 'Redis 7.2 Stack Engine (In-Memory Pub/Sub, Redis Streams & Token-Bucket Anti-Ban)',
    tech: 'Redis 7.2 Stack, Redis Streams, Scripts Lua Atomiques, Protocole RESP3 ultra-rapide',
    protocol: 'RESP3 over TCP asynchrone',
    port: '6379 (Port Interne Redis)',
    throughput: '120 000 opérations/sec • P99 Latency < 0.5ms',
    resilience: 'Persistance AOF (Append-Only File) + Snapshots RDB • Verrous distribués Redlock multi-nœuds',
    payload: `// Publication Stream temps réel d'un nouvel indice découvert
XADD stream:affaire:2026-SCAM-089:clues *
  clue_id "voice_darija_01"
  type "AUDIO_RECORDING"
  amount_dzd "100000"
  commune "Bab Ezzouar"
  confidence "0.96";

// Quota anti-ban exécuté atomiquement via Script Lua
CL.THROTTLE rate:truecaller:queries 60 60 1;`
  },

  // Layer 6 / Legal: Tamper-Evident Court Package Generator
  legal_court_export: {
    layer: 'Layer 6 / Justice: Scellement Légal & Export Procès-Verbal RFC 3161',
    name: 'Générateur de Dossier de Plaidoirie Conforme CPP (PDF/A-3b & Arbre de Merkle)',
    tech: 'RFC 3161 Timestamping Authority, Calculateur d\'Arbre de Merkle SHA-256, Moteur WeasyPrint PDF/A-3b',
    protocol: 'Signature Cryptographique X.509 + Export PDF/A-3b ISO 19005-3',
    port: 'Service Interne de Signature Judiciaire',
    throughput: 'Compilation instantanée • Génération d\'un rapport certifié de 40 pages en <2.5s',
    resilience: 'Preuve mathématique non-répudiable vérifiable en audience sans connexion Internet',
    payload: `{
  "document": "PROCES_VERBAL_SYNTHESE_ATHAR_2026_089.PDF",
  "norme": "PDF/A-3b (ISO 19005-3)",
  "articleCPP": "Article 68 du Code de Procédure Pénale Algérien",
  "rootMerkleSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "rfc3161Timestamp": "2026-11-10T10:15:22.000Z",
  "admissibleDevantCourAssises": true
}`
  }
};

const ARCHITECTURE_FLOWS = {
  all: {
    name: 'Tous les Flux Interconnectés (13 Canaux Actifs)',
    badge: '13 Canaux Actifs',
    color: '#38bdf8',
    desc: 'Visualisation globale des flux asynchrones, RPC et temps réel reliant les 6 couches. Met en évidence l\'accès direct de Layer 2 au stockage (Layer 3) sans détour.',
    activeNodes: ['ui_client', 'gateway_api', 'phone_farm', 'engine_gds', 'engine_ai', 'storage_graph', 'storage_postgres', 'storage_mongodb', 'storage_minio', 'storage_qdrant', 'storage_redis', 'legal_court_export'],
    activeEdges: ['e_ui_gw', 'e_gw_storage_direct', 'e_gw_phone_cmd', 'e_phone_gw_stream', 'e_phone_minio_worm', 'e_phone_mongo_raw', 'e_gw_gds_trigger', 'e_gds_neo_bolt', 'e_gw_ai_trigger', 'e_ai_qdrant_vec', 'e_redis_websocket']
  },
  whatsapp_voice: {
    name: 'Flux 1 : Infiltration WhatsApp, Baie SIM & Transcription Darija',
    badge: 'Mobile + Speech AI',
    color: '#f97316',
    desc: 'L\'enquêteur commande une infiltration depuis le Studio (Layer 6). Layer 2 pilote la Phone Farm (Layer 1). Le modem 4G reçoit l\'OTP en <1.5s, le vocal WhatsApp est scellé dans MinIO WORM (Layer 3), transcrit en Darija par Layer 5, l\'empreinte vocale est indexée dans Qdrant (Layer 3), le nœud est persisté dans Neo4j (Layer 3) et notifié via Redis Pub/Sub au Studio.',
    activeNodes: ['ui_client', 'gateway_api', 'phone_farm', 'engine_ai', 'storage_minio', 'storage_qdrant', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_phone_cmd', 'e_phone_gw_stream', 'e_phone_minio_worm', 'e_gw_ai_trigger', 'e_ai_qdrant_vec', 'e_gw_storage_direct', 'e_redis_websocket']
  },
  web_scam: {
    name: 'Flux 2 : Capture Web WORM, DOM BSON & Pivot Neo4j',
    badge: 'Forensique Web',
    color: '#06b6d4',
    desc: 'Pistage d\'une boutique frauduleuse. Layer 2 déclenche un snapshot ArchiveBox dans Layer 1. L\'archive WARC est déposée dans MinIO WORM (Layer 3), le DOM HTML brut dans MongoDB (Layer 3), et les IOCs extraits (téléphones, pixels) sont écrits directement dans Neo4j (Layer 3) par Layer 2.',
    activeNodes: ['ui_client', 'gateway_api', 'phone_farm', 'storage_minio', 'storage_mongodb', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_phone_cmd', 'e_phone_minio_worm', 'e_phone_mongo_raw', 'e_phone_gw_stream', 'e_gw_storage_direct', 'e_redis_websocket']
  },
  telecom_cdr: {
    name: 'Flux 3 : Bornage Télécom Mobilis/Djezzy & Alibis TimescaleDB + GDS',
    badge: 'Big Data CDR & GDS',
    color: '#10b981',
    desc: 'Ingestion de listings d\'appels (CDRs). Layer 2 normalise les numéros en E.164 et les écrit directement dans PostgreSQL TimescaleDB (Layer 3). Layer 4 projette le graphe en mémoire pour calculer la Betweenness Centrality, et réécrit les scores dans Neo4j (Layer 3) pour affichage sur le slider temporel.',
    activeNodes: ['ui_client', 'gateway_api', 'storage_postgres', 'engine_gds', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_storage_direct', 'e_gw_gds_trigger', 'e_gds_neo_bolt', 'e_redis_websocket']
  },
  court_export: {
    name: 'Flux 4 : Scellement Légal RFC 3161 & Export du Procès-Verbal',
    badge: 'Chaîne de Garde',
    color: '#ec4899',
    desc: 'Génération du dossier pour le juge d\'instruction. Layer 2 interroge directement PostgreSQL pour les procès-verbaux, Neo4j pour les schémas de liens criminels, et MinIO pour les hashes de scellés. Calcul de la racine de Merkle et signature qualifiée RFC 3161 sur le PDF/A-3b.',
    activeNodes: ['ui_client', 'gateway_api', 'storage_minio', 'storage_graph', 'storage_postgres', 'legal_court_export'],
    activeEdges: ['e_ui_gw', 'e_gw_storage_direct', 'e_redis_websocket']
  }
};

let isAnimationPlaying = true;

function filterArchFlow(flowKey) {
  const flow = ARCHITECTURE_FLOWS[flowKey];
  if (!flow) return;

  // Update button active state
  document.querySelectorAll('.flow-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-flow') === flowKey);
  });

  // Update flow description banner
  const banner = document.getElementById('arch-flow-banner');
  if (banner) {
    banner.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.25rem;">
        <strong style="color:${flow.color};font-size:0.85rem;">${flow.name}</strong>
        <span class="badge" style="background:rgba(255,255,255,0.08);color:${flow.color};border:1px solid ${flow.color};font-size:0.68rem;">${flow.badge}</span>
      </div>
      <div style="font-size:0.77rem;color:#cbd5e1;line-height:1.45;">${flow.desc}</div>
    `;
  }

  // Update SVG Edge classes
  document.querySelectorAll('.arch-flow-edge').forEach(edge => {
    const edgeId = edge.getAttribute('data-edge') || edge.id;
    const isActive = flow.activeEdges.includes(edgeId);
    edge.classList.toggle('dimmed', !isActive);
    edge.classList.toggle('active', isActive);
  });

  // Update SVG Nodes
  document.querySelectorAll('.svg-node').forEach(node => {
    const nodeKey = node.getAttribute('data-node');
    const isActive = flow.activeNodes.includes(nodeKey);
    node.style.opacity = isActive ? '1' : '0.22';
  });
}

function toggleFlowAnimation() {
  isAnimationPlaying = !isAnimationPlaying;
  const btn = document.getElementById('flow-anim-toggle');
  document.querySelectorAll('.arch-flow-edge').forEach(edge => {
    edge.classList.toggle('animated', isAnimationPlaying);
  });
  if (btn) {
    btn.innerHTML = isAnimationPlaying ? '⏸️ Mettre en Pause les Flux' : '▶️ Animer les Flux d\'Indices';
  }
}

function selectArchNode(nodeKey) {
  const node = ARCHITECTURE_SPEC_NODES[nodeKey];
  const inspector = document.getElementById('arch-live-inspector');
  if (!node || !inspector) return;

  // Highlight active diagram nodes
  document.querySelectorAll('.svg-node').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-node') === nodeKey);
  });

  inspector.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem;flex-wrap:wrap;gap:0.5rem;">
      <div>
        <span class="badge badge-purple" style="font-size:0.68rem;text-transform:uppercase;">${node.layer}</span>
        <h3 style="color:#f8fafc;margin:0.25rem 0 0;font-size:1.15rem;">${node.name}</h3>
      </div>
      <span class="badge badge-emerald" style="font-size:0.72rem;">● Service Opérationnel</span>
    </div>

    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:0.75rem;margin-bottom:1rem;font-size:0.78rem;">
      <div style="background:#090d16;padding:0.65rem;border-radius:6px;border:1px solid #1e293b;">
        <span style="color:#64748b;font-weight:600;">Stack Technologique :</span>
        <div style="color:#38bdf8;margin-top:0.2rem;font-weight:600;">${node.tech}</div>
      </div>
      <div style="background:#090d16;padding:0.65rem;border-radius:6px;border:1px solid #1e293b;">
        <span style="color:#64748b;font-weight:600;">Protocole &amp; Ports :</span>
        <div style="color:#fbbf24;margin-top:0.2rem;font-family:var(--font-mono);font-size:0.74rem;">${node.protocol} &bull; ${node.port}</div>
      </div>
      <div style="background:#090d16;padding:0.65rem;border-radius:6px;border:1px solid #1e293b;">
        <span style="color:#64748b;font-weight:600;">Débit &amp; Latence SLA :</span>
        <div style="color:#34d399;margin-top:0.2rem;font-weight:600;">${node.throughput}</div>
      </div>
      <div style="background:#090d16;padding:0.65rem;border-radius:6px;border:1px solid #1e293b;">
        <span style="color:#64748b;font-weight:600;">Tolérance aux Pannes &amp; Résilience :</span>
        <div style="color:#c084fc;margin-top:0.2rem;font-size:0.73rem;">${node.resilience}</div>
      </div>
    </div>

    <div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.35rem;">
        <span style="font-size:0.72rem;color:#94a3b8;font-weight:700;text-transform:uppercase;">Exemple de Payload / Requête / Schéma de Données :</span>
        <span style="font-size:0.65rem;color:#64748b;font-family:var(--font-mono);">FORMAT STRICT / PRODUCTION</span>
      </div>
      <pre style="background:#020617;border:1px solid #1e293b;border-radius:6px;padding:0.85rem;color:#e2e8f0;font-size:0.73rem;line-height:1.45;overflow-x:auto;margin:0;"><code>${node.payload}</code></pre>
    </div>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('arch-live-inspector')) {
    selectArchNode('ui_client');
  }
  filterArchFlow('all');
});
