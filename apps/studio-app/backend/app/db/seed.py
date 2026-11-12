"""Idempotent seed loader for the 100-node Candy Wheels forensic case."""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from neo4j import AsyncDriver, AsyncGraphDatabase
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

from app.core.config import get_settings
from app.db.neo4j_schema import init_neo4j_schema
from app.db.postgres_schema import init_postgres_schema
from app.domain.registry import NODE_TYPES, LayerId
from app.services.audit_service import compute_entry_hash

logger = logging.getLogger(__name__)

ATHAR_NAMESPACE = uuid.UUID("a74a1100-2026-4000-8000-000000000089")

# Canonical mapping from mock seed raw types to the 37 ontology types
RAW_TYPE_TO_CANONICAL: dict[str, str] = {
    "VICTIM": "personne",
    "SUSPECT": "personne",
    "KINGPIN": "personne",
    "LIEUTENANT": "personne",
    "MULE": "personne",
    "OPERATOR": "personne",
    "DEVELOPER": "personne",
    "PHONE_NUMBER": "telephone",
    "FB_PAGE": "compte_social",
    "INSTAGRAM": "compte_social",
    "FB_POST": "publication_sociale",
    "CLASSIFIED_AD": "publication_sociale",
    "TELEGRAM_GROUP": "canal_telegram",
    "DISCORD_SERVER": "canal_telegram",
    "DISCORD_CHANNEL": "canal_telegram",
    "CHAT_LOG": "message_chat",
    "WEBSITE": "site_web",
    "TELECOM_CELL": "antenne_bts",
    "MALWARE_APK": "fichier_apk",
    "C2_SERVER": "serveur_c2",
    "HOSTING_IP": "serveur_c2",
    "BOT_API": "serveur_c2",
    "DATABASE": "serveur_c2",
    "CERTIFICATE": "certificat_tls",
    "CODE_REPO": "artefact_dfir",
    "CODE_COMMIT": "artefact_dfir",
    "AD_TRACKER": "identifiant_infrastructure",
    "AUDIO_RECORDING": "enregistrement_vocal",
    "DOCUMENT": "document_judiciaire",
    "PROC_VERBAL": "document_judiciaire",
    "BANK_ACCOUNT": "compte_bancaire",
    "BANK_RECORD": "transaction_financiere",
    "CRYPTO_WALLET": "crypto_wallet",
    "CRYPTO_EXCHANGE": "crypto_wallet",
    "ORGANIZATION": "entreprise",
    "SHELL_COMPANY": "entreprise",
}

# Coordinate centroids for Algerian Wilayas present in the seed
WILAYA_GPS: dict[str, tuple[float, float]] = {
    "Alger": (36.7538, 3.0588),
    "Oran": (35.6987, -0.6349),
    "Blida": (36.4700, 2.8300),
    "Constantine": (36.3650, 6.6147),
    "Sétif": (36.1911, 5.4137),
    "Annaba": (36.9000, 7.7667),
    "Batna": (35.5559, 6.1741),
    "Tlemcen": (34.8783, -1.3150),
    "Mascara": (35.3964, 0.1403),
}


def deterministic_uuid(name: str) -> uuid.UUID:
    """Generate reproducible UUIDv5 scoped to Athar seed namespace."""
    return uuid.uuid5(ATHAR_NAMESPACE, name)


def clean_meta_keys(meta: dict[str, Any]) -> dict[str, Any]:
    """Sanitize typo-prone keys into clean ASCII snake_case per Decision D6."""
    clean: dict[str, Any] = {}
    key_mapping = {
        "_comune_Activite": "commune_activity",
        "_daira_activiti": "daira_activity",
        "_wiliya_Activiti": "wilaya_activity",
        "_Lvl_of_Implications": "implication_level",
        "_betweennessCentrality": "betweenness_centrality",
    }
    for k, v in meta.items():
        clean_key = key_mapping.get(k, k.lower().replace(" ", "_").replace("-", "_"))
        if k == "role" and v == "operationeel":
            v = "operationnel"
        clean[clean_key] = v
    return clean


async def seed_candy_wheels(
    json_path: Path | None = None,
    pg_engine: AsyncEngine | None = None,
    neo4j_driver: AsyncDriver | None = None,
    force: bool = False,
) -> dict[str, Any]:
    """Seed the 100-node Candy Wheels case idempotently into Postgres and Neo4j."""
    settings = get_settings()

    if json_path is None:
        json_path = Path(__file__).parent / "seed_data" / "mock-case-candy-wheels.json"
    if not json_path.exists():
        raise FileNotFoundError(f"Seed JSON file not found at: {json_path}")

    raw_data = json.loads(json_path.read_text(encoding="utf-8"))
    case_code = raw_data.get("case_code", "CANDY-WHEELS-DZ")
    case_id_raw = raw_data.get("case_id", "ATHAR-2026-SCAM-089")
    case_uuid = deterministic_uuid(case_id_raw)

    # 1. Initialize schemas
    created_engine = False
    if pg_engine is None:
        pg_engine = create_async_engine(settings.postgres_dsn)
        created_engine = True

    created_driver = False
    if neo4j_driver is None:
        neo4j_driver = AsyncGraphDatabase.driver(
            settings.neo4j_uri,
            auth=(settings.neo4j_user, settings.neo4j_password),
        )
        created_driver = True

    await init_postgres_schema(pg_engine)
    await init_neo4j_schema(neo4j_driver)

    # 2. Check if case already exists in PostgreSQL
    async with pg_engine.connect() as conn:
        res = await conn.execute(
            text("SELECT id FROM cases WHERE id = :id;"),
            {"id": case_uuid},
        )
        existing = res.scalar_one_or_none()

    if existing and not force:
        logger.info("Case %s already seeded. Skipping duplicate insert.", case_code)
        if created_engine:
            await pg_engine.dispose()
        if created_driver:
            await neo4j_driver.close()
        return {
            "status": "already_seeded",
            "case_id": str(case_uuid),
            "case_code": case_code,
            "nodes_count": len(raw_data["graph_representation"]["nodes"]),
            "edges_count": len(raw_data["graph_representation"]["edges"]),
        }

    if existing and force:
        logger.info("Force re-seeding: resetting records for case %s", case_code)
        async with pg_engine.begin() as conn:
            await conn.execute(text("DELETE FROM edges WHERE case_id = :id;"), {"id": case_uuid})
            await conn.execute(text("DELETE FROM nodes WHERE case_id = :id;"), {"id": case_uuid})
            await conn.execute(
                text("DELETE FROM audit_logs WHERE case_id = :id;"), {"id": case_uuid}
            )
            await conn.execute(text("DELETE FROM cases WHERE id = :id;"), {"id": case_uuid})
        async with neo4j_driver.session() as session:
            await session.run(
                "MATCH (n:Node {case_id: $case_id}) DETACH DELETE n;",
                {"case_id": str(case_uuid)},
            )
            await session.run(
                "MATCH (c:Case {id: $case_id}) DETACH DELETE c;",
                {"case_id": str(case_uuid)},
            )

    # 3. Prepare nodes and edges
    graph_rep = raw_data["graph_representation"]
    raw_nodes = graph_rep["nodes"]
    raw_edges = graph_rep["edges"]

    processed_nodes: list[dict[str, Any]] = []
    node_id_map: dict[str, uuid.UUID] = {}

    for n in raw_nodes:
        nid = n["id"]
        node_uuid = deterministic_uuid(f"node:{case_code}:{nid}")
        node_id_map[nid] = node_uuid

        raw_type = n["type"]
        canonical_type = RAW_TYPE_TO_CANONICAL.get(raw_type, "personne")
        node_def = NODE_TYPES[canonical_type]
        clean_meta = clean_meta_keys(n.get("meta", {}))

        # Assign GPS if applicable
        lat, lon = None, None
        if node_def.has_gps:
            wilaya_val = clean_meta.get("wilaya", "")
            for w_name, (w_lat, w_lon) in WILAYA_GPS.items():
                if w_name.lower() in str(wilaya_val).lower():
                    lat, lon = w_lat, w_lon
                    break
            if lat is None:
                lat, lon = 36.7538, 3.0588  # Default Alger

        processed_nodes.append(
            {
                "id": node_uuid,
                "case_id": case_uuid,
                "type": canonical_type,
                "layer": node_def.layer.value,
                "label": n["label"],
                "confidence": 1.0,
                "provenance": "SYSTEM_SEED",
                "properties": {
                    "raw_id": nid,
                    "raw_type": raw_type,
                    "subtitle": n.get("subtitle", ""),
                    "icon": node_def.icon,
                    **clean_meta,
                },
                "latitude": lat,
                "longitude": lon,
            }
        )

    processed_edges: list[dict[str, Any]] = []
    for e in raw_edges:
        src_raw = e["from"]
        tgt_raw = e["to"]
        edge_raw_label = e["label"]
        src_uuid = node_id_map[src_raw]
        tgt_uuid = node_id_map[tgt_raw]
        edge_uuid = deterministic_uuid(f"edge:{case_code}:{src_raw}:{edge_raw_label}:{tgt_raw}")

        clean_rel_type = edge_raw_label.upper().replace(" ", "_").replace("-", "_")

        processed_edges.append(
            {
                "id": edge_uuid,
                "case_id": case_uuid,
                "type": clean_rel_type,
                "source_id": src_uuid,
                "target_id": tgt_uuid,
                "layer": LayerId.VERIFIED.value,
                "confidence": 1.0,
                "provenance": "SYSTEM_SEED",
                "properties": {"raw_label": edge_raw_label},
            }
        )

    # 4. Write to PostgreSQL
    async with pg_engine.begin() as conn:
        # Case row
        await conn.execute(
            text(
                """
                INSERT INTO cases (id, code, title, description, status)
                VALUES (:id, :code, :title, :description, :status)
                ON CONFLICT (id) DO UPDATE SET
                    code = EXCLUDED.code,
                    title = EXCLUDED.title,
                    description = EXCLUDED.description;
                """
            ),
            {
                "id": case_uuid,
                "code": case_code,
                "title": raw_data.get("case_name", "Candy Wheels Case"),
                "description": raw_data.get("case_profile", ""),
                "status": "OPEN",
            },
        )

        # Node rows
        for p_node in processed_nodes:
            await conn.execute(
                text(
                    """
                    INSERT INTO nodes (
                        id, case_id, type, layer, label, confidence,
                        provenance, properties, latitude, longitude
                    ) VALUES (
                        :id, :case_id, :type, :layer, :label, :confidence,
                        :provenance, CAST(:properties AS JSONB), :latitude, :longitude
                    ) ON CONFLICT (id) DO NOTHING;
                    """
                ),
                {
                    **p_node,
                    "properties": json.dumps(p_node["properties"]),
                },
            )

        # Edge rows
        for p_edge in processed_edges:
            await conn.execute(
                text(
                    """
                    INSERT INTO edges (
                        id, case_id, type, source_id, target_id, layer,
                        confidence, provenance, properties
                    ) VALUES (
                        :id, :case_id, :type, :source_id, :target_id, :layer,
                        :confidence, :provenance, CAST(:properties AS JSONB)
                    ) ON CONFLICT (id) DO NOTHING;
                    """
                ),
                {
                    **p_edge,
                    "properties": json.dumps(p_edge["properties"]),
                },
            )

        # Audit ledger row
        audit_id = deterministic_uuid(f"audit:seed:{case_code}")
        prev_hash = "0" * 64
        seed_dt = datetime(2026, 1, 15, 10, 0, 0, tzinfo=timezone.utc)
        audit_payload = {
            "action": "SEED_CASE",
            "case_code": case_code,
            "nodes_count": len(processed_nodes),
            "edges_count": len(processed_edges),
        }
        reason = "Idempotent seed of Operation Candy Wheels forensic case"
        computed_hash = compute_entry_hash(
            prev_hash=prev_hash,
            action="SEED_CASE",
            actor_id=settings.actor_id,
            entity_type="case",
            entity_id=case_uuid,
            before_state=None,
            after_state=audit_payload,
            reason=reason,
            timestamp=seed_dt.isoformat(),
        )

        await conn.execute(
            text(
                """
                INSERT INTO audit_logs (
                    id, case_id, actor_id, action, entity_type, entity_id,
                    before_state, after_state, reason, timestamp, prev_hash, hash
                ) VALUES (
                    :id, :case_id, :actor_id, :action, :entity_type, :entity_id,
                    CAST(:before_state AS JSONB), CAST(:after_state AS JSONB),
                    :reason, :timestamp, :prev_hash, :hash
                ) ON CONFLICT (id) DO UPDATE SET
                    hash = EXCLUDED.hash,
                    prev_hash = EXCLUDED.prev_hash,
                    timestamp = EXCLUDED.timestamp,
                    after_state = EXCLUDED.after_state,
                    reason = EXCLUDED.reason;
                """
            ),
            {
                "id": audit_id,
                "case_id": case_uuid,
                "actor_id": settings.actor_id,
                "action": "SEED_CASE",
                "entity_type": "case",
                "entity_id": case_uuid,
                "before_state": None,
                "after_state": json.dumps(audit_payload),
                "reason": reason,
                "timestamp": seed_dt,
                "prev_hash": prev_hash,
                "hash": computed_hash,
            },
        )

    # 5. Write to Neo4j
    async with neo4j_driver.session() as session:
        # Merge Case
        await session.run(
            """
            MERGE (c:Case {id: $id})
            SET c.code = $code,
                c.title = $title,
                c.status = $status
            """,
            {
                "id": str(case_uuid),
                "code": case_code,
                "title": raw_data.get("case_name", "Candy Wheels Case"),
                "status": "OPEN",
            },
        )

        # Merge Nodes
        for p_node in processed_nodes:
            props = {
                "id": str(p_node["id"]),
                "case_id": str(p_node["case_id"]),
                "type": p_node["type"],
                "layer": p_node["layer"],
                "label": p_node["label"],
                "confidence": p_node["confidence"],
                "provenance": p_node["provenance"],
                "latitude": p_node["latitude"],
                "longitude": p_node["longitude"],
                **p_node["properties"],
            }
            # Clean None values for Neo4j property constraints
            clean_props = {k: v for k, v in props.items() if v is not None}
            canonical_label = NODE_TYPES[p_node["type"]].cypher_label

            query = f"MERGE (n:Node {{id: $id}}) " f"SET n += $props, n:{canonical_label}"
            await session.run(query, {"id": str(p_node["id"]), "props": clean_props})

        # Merge Edges
        for p_edge in processed_edges:
            rel_label = p_edge["type"]
            # Sanitize rel_label to safe ASCII upper chars only
            safe_rel = "".join(c for c in rel_label if c.isalnum() or c == "_")
            if not safe_rel:
                safe_rel = "RELATION"

            edge_query = (
                f"MATCH (s:Node {{id: $source_id}}), (t:Node {{id: $target_id}}) "
                f"MERGE (s)-[r:{safe_rel} {{id: $id}}]->(t) "
                f"SET r.case_id = $case_id, r.confidence = $confidence, r.layer = $layer"
            )
            await session.run(
                edge_query,
                {
                    "source_id": str(p_edge["source_id"]),
                    "target_id": str(p_edge["target_id"]),
                    "id": str(p_edge["id"]),
                    "case_id": str(p_edge["case_id"]),
                    "confidence": p_edge["confidence"],
                    "layer": p_edge["layer"],
                },
            )

    logger.info(
        "Successfully seeded case %s (%d nodes, %d edges).",
        case_code,
        len(processed_nodes),
        len(processed_edges),
    )

    if created_engine:
        await pg_engine.dispose()
    if created_driver:
        await neo4j_driver.close()

    return {
        "status": "seeded",
        "case_id": str(case_uuid),
        "case_code": case_code,
        "nodes_count": len(processed_nodes),
        "edges_count": len(processed_edges),
    }
