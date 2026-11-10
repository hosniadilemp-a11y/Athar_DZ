// AegisInvestigate — Interactive Software Engineering Architecture Inspector
// Provides deep-dive technical specs on click: Protocols, Data Payloads, Latency, and Fault-Tolerance.

const ARCHITECTURE_SPEC_NODES = {
  // Layer 1
  ui_client: {
    layer: 'Layer 1: Visual Presentation Layer',
    name: 'Investigation Desktop Studio (React 19 + Cytoscape.js)',
    tech: 'React 19, Cytoscape.js (Graph), MapLibre GL (GIS), WaveSurfer.js (Audio Darija), BlockSuite',
    protocol: 'HTTPS / WSS (WebSockets RFC 6455)',
    port: '3000 (UI) -> 48997 (API Gateway)',
    throughput: '60 FPS Canvas rendering • < 16ms interaction frame budget',
    resilience: 'Offline local state caching in IndexedDB • Automatic WebSocket reconnection with exponential backoff',
    payload: `{
  "action": "ADD_CLUE_NODE",
  "caseId": "2026-SCAM-089",
  "node": {
    "id": "voice_darija_node",
    "type": "AUDIO_RECORDING",
    "layer": "VERIFIED_FACT",
    "confidence": 0.96,
    "properties": {
      "language": "ar-DZ-darija",
      "durationSec": 34,
      "amountDZD": 10000,
      "location": "Bab Ezzouar, Algiers"
    }
  }
}`
  },

  // Layer 2
  gateway_api: {
    layer: 'Layer 2: API Gateway & Security Ingress',
    name: 'Unified API Gateway & Legal Audit Interceptor',
    tech: 'FastAPI (Python 3.11 Async), Uvicorn, Casdoor / Keycloak (OAuth2 / OIDC JWT), RFC 3161 Timestamping',
    protocol: 'HTTP/2 REST + WebSocket Multiplexing + TLS 1.3',
    port: '48997 (REST/Docs), 45910 (Casdoor IAM)',
    throughput: '3 500 req/sec • P99 Latency < 12ms',
    resilience: 'Token bucket rate-limiting • Circuit breaker pattern on downstream microservices',
    payload: `{
  "sub": "investigator_adel_m",
  "role": "JUDICIAL_POLICE_OFFICER",
  "clearance": "CONFIDENTIAL_DEFENSE",
  "caseAccess": ["2026-SCAM-089"],
  "auditSignature": "rsa-sha256-sig-9f82b1...38a",
  "timestamp": "2026-11-10T10:15:22.184Z"
}`
  },

  // Layer 3
  brain_orchestrator: {
    layer: 'Layer 3: Dual-Mode Detective Brain',
    name: 'Investigation Workflow Orchestrator & Rule Matcher',
    tech: 'Temporal.io State Machine, Deterministic Rule Engine, Optional Local LMM (Ollama / vLLM)',
    protocol: 'gRPC over HTTP/2 (Protobuf v3) + Internal Event Bus',
    port: '7233 (Temporal Frontend), 11434 (Local LMM Engine)',
    throughput: '10 000 workflow state transitions/sec • Zero state loss on restart',
    resilience: 'Deterministic event-sourcing replay • Automatic retry policies on tool timeout',
    payload: `{
  "workflowId": "wf-case-phone-enrichment-089",
  "step": "DISPATCH_PARALLEL_TOOLS",
  "tools": [
    "tool_phone_whatsapp_tg",
    "tool_audio_darija_algeria",
    "tool_telecom_cdr_analyzer"
  ],
  "policy": "REQUIRE_INVESTIGATOR_CONFIRMATION",
  "timeoutSeconds": 30
}`
  },

  // Layer 4: Execution Sandbox & Distributed Workers
  sandbox_workers: {
    layer: 'Layer 4: Execution Sandbox & Distributed Workers',
    name: 'Isolated OSINT & Forensic Execution Sandbox',
    tech: 'Celery Distributed Task Queue, Rootless Docker Engine, Playwright Headless Pool, Residential Proxy Mesh, Bellingcat/Maigret/GHunt',
    protocol: 'AMQP / Redis Streams + Ephemeral UNIX Domain Sockets',
    port: '63379 (Redis Broker), Dynamic Container Sockets',
    throughput: '120 concurrent headless browser sessions • 500 API queries/min across proxies',
    resilience: 'Dead-Letter Queue (DLQ) for failed scrapes • Tor/Proxy circuit rotation upon HTTP 429/403',
    payload: `{
  "taskId": "celery-task-98a12f-48b",
  "tool": "tool_audio_darija_algeria",
  "inputUri": "s3://case-2026-scam-089/audio/whatsapp_vocal_01.ogg",
  "model": "faster-whisper-large-v3-maghreb",
  "diarization": true,
  "nerEntities": ["DZD_AMOUNT", "BARIDIMOB_ACCOUNT", "ALGERIAN_COMMUNE"]
}`
  },

  // Layer 4B: Phone Farm & SIM Bank
  phone_farm: {
    layer: 'Layer 4B: Mobile Device Farm & GSM SIM Bank',
    name: 'Ferme de Smartphones Réels & Virtuels (Hardware/Virtual Device Farm)',
    tech: 'ReDroid (Android 13 in Docker), Appium 2.x, Scrcpy (WebRTC 60 FPS), ADB over TCP, GSM 4G SIM Bank (Mobilis/Djezzy/Ooredoo), Mitmproxy Root CA, Zygisk Root Cloaking',
    protocol: 'ADB Wire Protocol (TCP 5555), WebRTC / WSS (Scrcpy Screen Mirroring), Appium WebDriver REST (4723), AT Commands TTY (/dev/ttyUSB0)',
    port: '5555 (ADB), 4723 (Appium), 8000 (WebRTC Scrcpy Video), 8080 (Mitmproxy)',
    throughput: '60 FPS ultra-low latency (<30ms) interactive screen stream • Automated SMS OTP reception in < 3s',
    resilience: 'Ephemeral container rotation on dirty state • Isolated network namespaces with per-device VPN KillSwitch • Hardware SIM hot-swapping',
    payload: `{
  "deviceFarmAction": "AUTOMATED_APP_INTERROGATION",
  "deviceId": "redroid_sim_ooredoo_04",
  "targetApp": "com.whatsapp.w4b",
  "gsmSimSlot": "SIM_SLOT_02 (Ooredoo +213 555 019 283)",
  "automationScript": "appium_grab_voice_notes.py",
  "liveScreenStream": "wss://engine.athar.dz/stream/device/04/scrcpy",
  "extractedEvidence": {
    "audioFile": "vocal_darija_kouba_order.opus",
    "sha256": "8f14b2a90184b2...d014",
    "otpSmsReceived": "WhatsApp Code 489-012"
  }
}`
  },

  // Layer 5: Storage Engines
  storage_postgres: {
    layer: 'Layer 5: Polyglot Storage Tier — Relational & Case State',
    name: 'PostgreSQL 16 Case Relational Database & Immutable Audit Ledger',
    tech: 'PostgreSQL 16 with asyncpg driver, SQLModel / SQLAlchemy ORM, TimescaleDB CDR partitioning',
    protocol: 'PostgreSQL Wire Protocol over TCP',
    port: '55432 (Exposed) -> 5432 (Internal)',
    throughput: '15 000 write operations/sec • ACID Compliance Level: SERIALIZABLE',
    resilience: 'Write-Ahead Logging (WAL) • Continuous archiving and point-in-time recovery (PITR) • Cryptographic row-chaining',
    payload: `CREATE TABLE case_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id VARCHAR(64) NOT NULL REFERENCES cases(id),
  clue_type VARCHAR(32) NOT NULL,
  source_tool VARCHAR(64) NOT NULL,
  confidence_pct NUMERIC(5,2) NOT NULL,
  sha256_hash CHAR(64) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`
  },

  storage_graph: {
    layer: 'Layer 5: Polyglot Storage Tier — Knowledge Graph',
    name: 'Neo4j 5.x & JanusGraph Criminal Knowledge Graph',
    tech: 'Neo4j 5.x Enterprise (Cypher + Neo4j GDS) / JanusGraph 1.0 (Gremlin) backed by ScyllaDB & Apache Solr',
    protocol: 'Neo4j Bolt v5 Protocol / Apache TinkerPop Gremlin-Bytecode',
    port: '7687 (Neo4j Bolt) / 8182 (JanusGraph Gremlin Server)',
    throughput: 'Sub-millisecond 3-to-6 hop criminal neighborhood traversals across 500M edges (Index-Free Adjacency)',
    resilience: 'Distributed Raft consensus (Neo4j Causal Cluster) • Multi-datacenter replication via ScyllaDB',
    payload: `// Cypher: Find cross-case criminal links between Phone and Bank Accounts
MATCH (p:Phone {number: '+213555019283'})<-[:USES_PHONE]-(s:Suspect)
MATCH (s)-[:OWNS_ACCOUNT]->(b:BaridiMobAccount)
MATCH (otherCase:Case)-[:HAS_EVIDENCE]->(b)
RETURN s.alias, b.rip, collect(otherCase.reference) AS linked_cases;`
  },

  storage_mongodb: {
    layer: 'Layer 5: Polyglot Storage Tier — Raw OSINT & Document Store',
    name: 'MongoDB 7.x Raw Scraping & Unstructured Ingestion Store',
    tech: 'MongoDB 7.x BSON Document Engine, WiredTiger Storage Engine with Snappy Compression',
    protocol: 'MongoDB Wire Protocol over TCP',
    port: '27017 (Internal MongoDB Port)',
    throughput: '35 000 unindexed BSON document writes/sec • Dynamic polymorphic document schemas',
    resilience: 'Replica Set with Raft-like election • Change Streams triggering downstream clue extraction workers',
    payload: `{
  "_id": ObjectId("672f9a10c8b4a100129b4412"),
  "sourceUrl": "https://promo-pneus-express.shop/order",
  "ingestedAt": ISODate("2026-11-01T14:22:08Z"),
  "rawHeaders": { "server": "nginx/1.24", "cf-ray": "8e14b901a" },
  "domAst": {
    "forms": [{ "action": "/checkout", "method": "POST" }],
    "metaPixels": ["88419203314"],
    "embeddedPhones": ["+213555019283"]
  },
  "warcRef": "s3://case-2026-scam-089/warc/promo-pneus.warc.gz"
}`
  },

  storage_qdrant: {
    layer: 'Layer 5: Polyglot Storage Tier — Biometric & Semantic Vectors',
    name: 'Qdrant Vector Engine (Biometric Face, Voice & Semantic Search)',
    tech: 'Qdrant Vector DB (Engine in Rust), HNSW Graph Indexing, Cosine Distance Metrics',
    protocol: 'gRPC over HTTP/2 / REST JSON',
    port: '6333 (REST), 6334 (gRPC)',
    throughput: '< 8ms nearest neighbor search across 2 000 000 512-dimensional facial/voice vectors',
    resilience: 'Write-ahead log (WAL) • In-memory quantization • Strict payload filtering by Case ID',
    payload: `{
  "collection_name": "suspect_biometrics",
  "vector": [0.0412, -0.0891, 0.1284, "... 512-d ArcFace / PyAnnote embedding ..."],
  "filter": {
    "must": [{ "key": "case_id", "match": { "value": "2026-SCAM-089" } }]
  },
  "top": 5,
  "with_payload": true
}`
  },

  storage_minio: {
    layer: 'Layer 5: Polyglot Storage Tier — Evidence WORM Storage',
    name: 'MinIO S3 Immutable WORM Evidence Safe',
    tech: 'MinIO High-Performance Object Storage with Object Locking (WORM Compliance)',
    protocol: 'Amazon S3 REST API (HTTPS Multipart)',
    port: '9000 (S3 API), 9001 (Web Console)',
    throughput: 'Up to 2.5 GB/s throughput • Cryptographic tamper-proof file locking',
    resilience: 'Erasure coding (16-drive parity) • Immutable retention flags prevent deletion by suspects or rogue users',
    payload: `{
  "bucket": "case-2026-scam-089-certified",
  "object": "evidence/snapshot_fb_98124.warc",
  "contentLength": 1492084,
  "contentType": "application/warc",
  "x-amz-object-lock-mode": "COMPLIANCE",
  "x-amz-object-lock-retain-until-date": "2036-11-10T00:00:00Z",
  "sha256": "4a12e88b90123f81e3a99071c771c..."
}`
  },

  storage_redis: {
    layer: 'Layer 5: Polyglot Storage Tier — Cache & In-Memory Event Bus',
    name: 'Redis 7 Stack (In-Memory Pub/Sub, Distributed Lock & Token-Bucket)',
    tech: 'Redis 7 Stack Engine, Redis Streams, In-Memory Ephemeral Storage',
    protocol: 'RESP3 (REdis Serialization Protocol) over TCP',
    port: '63379 (Exposed) -> 6379 (Internal)',
    throughput: '120 000 ops/sec • P99 Latency < 0.8ms',
    resilience: 'RDB Snapshots + AOF (Append-Only File) • Token-bucket rate limiters per OSINT target • Distributed Redlock mutex',
    payload: `// Redis Stream publication on new suspect clue discovery
XADD stream:case:2026-SCAM-089:clues *
  clue_id "voice_darija_01"
  type "AUDIO_RECORDING"
  amount_dzd "10000"
  location "Bab Ezzouar"
  confidence "0.96";

// Distributed token-bucket rate limiter for Ooredoo/Mobilis API
CL.THROTTLE rate:ooredoo:requests 100 60 1;`
  },

  // Layer 6
  legal_court_export: {
    layer: 'Layer 6: Legal Evidence & Court Export',
    name: 'Cryptographic Chain-of-Custody & Court Package Generator',
    tech: 'RFC 3161 Timestamping Authority, Merkle Tree Prover, WeasyPrint PDF Engine, WARC ISO 28500',
    protocol: 'PKI X.509 Cryptographic Signatures + PDF/A-3b Archival Export',
    port: 'Internal Kernel & Export Service',
    throughput: 'Instantaneous cryptographic verification • Sub-second certified PDF dossier generation',
    resilience: 'Cryptographic non-repudiation verified by independent court magistrate software',
    payload: `{
  "courtDocument": "PROCES_VERBAL_SYNTHESE_2026_089.PDF",
  "rfc3161Timestamp": "2026-11-10T10:15:22.000Z",
  "tsaProvider": "Algeria PKI / Qualified Trust Authority",
  "sha256RootMerkle": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "admissibleInCourt": true
}`
  }
};

const ARCHITECTURE_FLOWS = {
  all: {
    name: 'Tous les Flux Interconnectés',
    badge: '13 Canaux Actifs',
    color: '#38bdf8',
    desc: 'Visualisation globale de l\'ensemble des 13 flux de communication asynchrones, RPC et temps réel reliant les 7 couches de la plateforme.',
    activeNodes: ['ui_client', 'gateway_api', 'brain_orchestrator', 'sandbox_workers', 'phone_farm', 'storage_graph', 'storage_postgres', 'storage_mongodb', 'storage_minio', 'storage_qdrant', 'storage_redis', 'legal_court_export'],
    activeEdges: ['e_ui_gw', 'e_gw_brain', 'e_brain_workers', 'e_brain_phone', 'e_sim_phone', 'e_phone_voice', 'e_workers_mongo', 'e_workers_minio', 'e_workers_neo', 'e_workers_pg', 'e_voice_qdrant', 'e_redis_push', 'e_storage_court']
  },
  whatsapp_voice: {
    name: 'Flux 1 : Infiltration WhatsApp, Baie SIM & Transcription Darija',
    badge: 'Mobile + Speech AI',
    color: '#f97316',
    desc: 'L\'enquêteur saisit un numéro suspect. ReDroid initialise WhatsApp Business, la baie SIM 4G reçoit l\'OTP SMS en <3s, le vocal Darija est intercepté via Mitmproxy, transcrit par Faster-Whisper, et l\'empreinte vocale est projetée dans Qdrant.',
    activeNodes: ['ui_client', 'gateway_api', 'brain_orchestrator', 'phone_farm', 'sandbox_workers', 'storage_qdrant', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_brain', 'e_brain_phone', 'e_sim_phone', 'e_phone_voice', 'e_voice_qdrant', 'e_workers_neo', 'e_redis_push']
  },
  web_scam: {
    name: 'Flux 2 : Capture Web WORM, DOM BSON & Pivot Neo4j',
    badge: 'Forensique Web',
    color: '#06b6d4',
    desc: 'Pistage d\'une boutique frauduleuse. Playwright génère une capture WARC scellée dans MinIO WORM (ISO 28500), dépose le DOM dans MongoDB 7.x et extrait le Meta Pixel et le JARM TLS vers le graphe Neo4j.',
    activeNodes: ['ui_client', 'gateway_api', 'brain_orchestrator', 'sandbox_workers', 'storage_minio', 'storage_mongodb', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_brain', 'e_brain_workers', 'e_workers_minio', 'e_workers_mongo', 'e_workers_neo', 'e_redis_push']
  },
  telecom_cdr: {
    name: 'Flux 3 : Bornage Télécom Mobilis/Djezzy & Alibis TimescaleDB',
    badge: 'Big Data CDR',
    color: '#10b981',
    desc: 'Traitement des listings d\'appels (CDR). PostgreSQL + TimescaleDB partitionne des millions d\'événements d\'antennes relais (BTS) et calcule les chevauchements spatio-temporels pour invalider un faux alibi.',
    activeNodes: ['ui_client', 'gateway_api', 'brain_orchestrator', 'sandbox_workers', 'storage_postgres', 'storage_graph', 'storage_redis'],
    activeEdges: ['e_ui_gw', 'e_gw_brain', 'e_brain_workers', 'e_workers_pg', 'e_workers_neo', 'e_redis_push']
  },
  court_export: {
    name: 'Flux 4 : Scellement Légal RFC 3161 & Export du Procès-Verbal',
    badge: 'Chaîne de Garde',
    color: '#ec4899',
    desc: 'Génération du dossier pour le parquet. Compilation des preuves scellées (MinIO), des liens de causalité (Neo4j), calcul de la racine d\'arbre de Merkle et signature qualifiée RFC 3161 sur le PDF/A-3b.',
    activeNodes: ['ui_client', 'gateway_api', 'storage_minio', 'storage_graph', 'storage_postgres', 'legal_court_export'],
    activeEdges: ['e_ui_gw', 'e_workers_minio', 'e_workers_neo', 'e_workers_pg', 'e_storage_court']
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

  // Update SVG Edge labels
  document.querySelectorAll('.flow-edge-badge').forEach(badge => {
    const edgeId = badge.getAttribute('data-edge');
    const isActive = flow.activeEdges.includes(edgeId);
    badge.style.opacity = isActive ? '1' : '0.15';
  });

  // Update SVG Nodes
  document.querySelectorAll('.svg-node').forEach(node => {
    const nodeKey = node.getAttribute('data-node');
    const isActive = flow.activeNodes.includes(nodeKey);
    node.style.opacity = isActive ? '1' : '0.25';
  });

  // Update HTML Grid Nodes
  document.querySelectorAll('.arch-shema-node').forEach(el => {
    const nodeKey = el.getAttribute('data-node');
    const isActive = flow.activeNodes.includes(nodeKey);
    el.style.opacity = isActive ? '1' : '0.35';
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

  // Highlight active diagram nodes (both HTML grid & SVG canvas)
  document.querySelectorAll('.arch-shema-node').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-node') === nodeKey);
  });
  document.querySelectorAll('.svg-node').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-node') === nodeKey);
  });

  inspector.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #1e293b;padding-bottom:0.75rem;margin-bottom:1rem;">
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
        <span style="font-size:0.65rem;color:#64748b;font-family:var(--font-mono);">FORMAT JSON / SQL STRICT</span>
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
