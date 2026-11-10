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

  // Layer 4
  sandbox_workers: {
    layer: 'Layer 4: Execution Sandbox & Distributed Workers',
    name: 'Isolated OSINT & Forensic Execution Sandbox',
    tech: 'Celery Distributed Task Queue, Rootless Docker Engine, Playwright Headless Pool, Residential Proxy Mesh',
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

  // Layer 5: Storage Engines
  storage_postgres: {
    layer: 'Layer 5: Polyglot Storage Tier — Relational & Case State',
    name: 'PostgreSQL 15 Case Relational Database',
    tech: 'PostgreSQL 15 with asyncpg driver, SQLModel / SQLAlchemy ORM',
    protocol: 'PostgreSQL Wire Protocol over TCP',
    port: '55432 (Exposed) -> 5432 (Internal)',
    throughput: '15 000 write operations/sec • ACID Compliance Level: SERIALIZABLE',
    resilience: 'Write-Ahead Logging (WAL) • Continuous archiving and point-in-time recovery (PITR)',
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
    name: 'JanusGraph 1.0 & Neo4j Criminal Knowledge Graph',
    tech: 'JanusGraph 1.0 (Gremlin) / Neo4j 5 (Cypher) backed by ScyllaDB & Apache Solr',
    protocol: 'Apache TinkerPop Gremlin-Bytecode / Neo4j Bolt v5',
    port: '8182 (JanusGraph Gremlin Server) / 7687 (Neo4j Bolt)',
    throughput: 'Sub-millisecond 3-hop criminal neighborhood traversals across 500M edges',
    resilience: 'Distributed multi-datacenter replication via ScyllaDB • Solr cluster failover',
    payload: `g.V().has('Phone', 'number', '+213555019283')
 .in('MENTIONS_PHONE')
 .out('HOSTED_ON')
 .in('HOSTED_ON')
 .path().by('label')`
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

function selectArchNode(nodeKey) {
  const node = ARCHITECTURE_SPEC_NODES[nodeKey];
  const inspector = document.getElementById('arch-live-inspector');
  if (!node || !inspector) return;

  // Highlight active diagram node
  document.querySelectorAll('.arch-shema-node').forEach(el => {
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
});
