"""Core graph service coordinating Neo4j, PostgreSQL, and Audit Logging."""

from __future__ import annotations

import json
import logging
import uuid
from typing import Any, Sequence

from fastapi import HTTPException
from neo4j import AsyncDriver
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncEngine

from app.domain.registry import (
    NODE_TYPES,
    LayerId,
    validate_relation,
)
from app.schemas.case import CaseCreate, CaseResponse
from app.schemas.edge import EdgeCreate, EdgeResponse
from app.schemas.graph import GraphResponse
from app.schemas.node import NodeCreate, NodeResponse, ToolProposal
from app.services.audit_service import log_audit_event

logger = logging.getLogger(__name__)


# ==============================================================================
# 1. CASE OPERATIONS
# ==============================================================================


async def list_cases(engine: AsyncEngine) -> list[CaseResponse]:
    """List all registered cases with counts of nodes and edges."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                """
                SELECT c.id, c.code, c.title, c.description, c.status,
                       c.created_at, c.updated_at,
                       COALESCE(n.cnt, 0) AS nodes_count,
                       COALESCE(e.cnt, 0) AS edges_count
                FROM cases c
                LEFT JOIN (
                    SELECT case_id, count(*) AS cnt FROM nodes
                    WHERE deleted_at IS NULL GROUP BY case_id
                ) n ON c.id = n.case_id
                LEFT JOIN (
                    SELECT case_id, count(*) AS cnt FROM edges
                    WHERE deleted_at IS NULL GROUP BY case_id
                ) e ON c.id = e.case_id
                ORDER BY c.created_at DESC;
                """
            )
        )
        rows = res.fetchall()

    return [
        CaseResponse(
            id=r[0],
            code=r[1],
            title=r[2],
            description=r[3],
            status=r[4],
            created_at=r[5],
            updated_at=r[6],
            nodes_count=r[7],
            edges_count=r[8],
        )
        for r in rows
    ]


async def get_case(engine: AsyncEngine, case_id: uuid.UUID) -> CaseResponse:
    """Fetch single case details by UUID."""
    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                """
                SELECT c.id, c.code, c.title, c.description, c.status,
                       c.created_at, c.updated_at,
                       COALESCE(n.cnt, 0) AS nodes_count,
                       COALESCE(e.cnt, 0) AS edges_count
                FROM cases c
                LEFT JOIN (
                    SELECT case_id, count(*) AS cnt FROM nodes
                    WHERE deleted_at IS NULL GROUP BY case_id
                ) n ON c.id = n.case_id
                LEFT JOIN (
                    SELECT case_id, count(*) AS cnt FROM edges
                    WHERE deleted_at IS NULL GROUP BY case_id
                ) e ON c.id = e.case_id
                WHERE c.id = :id;
                """
            ),
            {"id": case_id},
        )
        row = res.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail={"code": "CASE_NOT_FOUND", "message": f"Case '{case_id}' does not exist"},
        )

    return CaseResponse(
        id=row[0],
        code=row[1],
        title=row[2],
        description=row[3],
        status=row[4],
        created_at=row[5],
        updated_at=row[6],
        nodes_count=row[7],
        edges_count=row[8],
    )


async def create_case(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    payload: CaseCreate,
    actor_id: str,
) -> CaseResponse:
    """Create a new case in PostgreSQL and Neo4j."""
    case_id = uuid.uuid4()
    async with engine.begin() as conn:
        # Check unique code
        existing = await conn.execute(
            text("SELECT id FROM cases WHERE code = :code;"),
            {"code": payload.code},
        )
        if existing.fetchone():
            raise HTTPException(
                status_code=409,
                detail={
                    "code": "CASE_CODE_EXISTS",
                    "message": f"Case code '{payload.code}' already exists",
                },
            )

        await conn.execute(
            text(
                """
                INSERT INTO cases (id, code, title, description, status)
                VALUES (:id, :code, :title, :description, 'OPEN');
                """
            ),
            {
                "id": case_id,
                "code": payload.code,
                "title": payload.title,
                "description": payload.description,
            },
        )

    # Neo4j Case Node
    async with neo4j_driver.session() as session:
        await session.run(
            "MERGE (c:Case {id: $id}) SET c.code = $code, c.title = $title, c.status = 'OPEN'",
            {"id": str(case_id), "code": payload.code, "title": payload.title},
        )

    # Log audit
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="CREATE_CASE",
        entity_type="case",
        entity_id=case_id,
        after_state={"code": payload.code, "title": payload.title},
        reason="Case creation",
    )

    return await get_case(engine, case_id)


# ==============================================================================
# 2. GRAPH RETRIEVAL (FULL & IMPACT VIEW)
# ==============================================================================


async def get_case_graph(
    engine: AsyncEngine,
    case_id: uuid.UUID,
    impact_only: bool = False,
) -> GraphResponse:
    """Fetch the case graph from PostgreSQL, optionally filtered by impact critical entities."""
    # Ensure case exists
    await get_case(engine, case_id)

    async with engine.connect() as conn:
        # 1. Fetch total counts
        res_tot_nodes = await conn.execute(
            text("SELECT count(*) FROM nodes WHERE case_id = :id AND deleted_at IS NULL;"),
            {"id": case_id},
        )
        total_nodes = res_tot_nodes.scalar_one()

        res_tot_edges = await conn.execute(
            text("SELECT count(*) FROM edges WHERE case_id = :id AND deleted_at IS NULL;"),
            {"id": case_id},
        )
        total_edges = res_tot_edges.scalar_one()

        # 2. Query nodes
        if impact_only:
            # Documented Decision D9 Rule:
            # Critical suspects (leader/operationnel/kingpin), high loss victims,
            # or high implication level
            node_query = text(
                """
                SELECT id, case_id, type, layer, label, confidence, provenance,
                       properties, latitude, longitude, created_at, updated_at
                FROM nodes
                WHERE case_id = :id AND deleted_at IS NULL
                  AND (
                    layer IN ('HYPOTHESIS', 'FLOWS')
                    OR properties->>'role' IN ('kingpin', 'leader', 'operationnel', 'lieutenant')
                    OR properties->>'implication_level' IN ('LEADER', 'HIGH')
                    OR (properties->>'loss')::numeric > 50000
                  )
                ORDER BY created_at ASC;
                """
            )
        else:
            node_query = text(
                """
                SELECT id, case_id, type, layer, label, confidence, provenance,
                       properties, latitude, longitude, created_at, updated_at
                FROM nodes
                WHERE case_id = :id AND deleted_at IS NULL
                ORDER BY created_at ASC;
                """
            )

        res_nodes = await conn.execute(node_query, {"id": case_id})
        node_rows = res_nodes.fetchall()

        nodes: list[NodeResponse] = []
        node_ids_set = set()
        for r in node_rows:
            n_type = r[2]
            icon = NODE_TYPES[n_type].icon if n_type in NODE_TYPES else "circle"
            node_obj = NodeResponse(
                id=r[0],
                case_id=r[1],
                type=r[2],
                layer=r[3],
                label=r[4],
                confidence=r[5],
                provenance=r[6],
                properties=r[7] if isinstance(r[7], dict) else json.loads(r[7] or "{}"),
                latitude=r[8],
                longitude=r[9],
                icon=icon,
                created_at=r[10],
                updated_at=r[11],
            )
            nodes.append(node_obj)
            node_ids_set.add(r[0])

        # 3. Query edges
        edge_rows: Sequence[Any]
        if impact_only:
            # Edges connecting the impact nodes
            if not node_ids_set:
                edge_rows = ()
            else:
                res_edges = await conn.execute(
                    text(
                        """
                        SELECT id, case_id, type, source_id, target_id, layer,
                               confidence, provenance, properties, created_at, updated_at
                        FROM edges
                        WHERE case_id = :id AND deleted_at IS NULL
                          AND source_id = ANY(:nids) AND target_id = ANY(:nids);
                        """
                    ),
                    {"id": case_id, "nids": list(node_ids_set)},
                )
                edge_rows = res_edges.fetchall()
        else:
            res_edges = await conn.execute(
                text(
                    """
                    SELECT id, case_id, type, source_id, target_id, layer,
                           confidence, provenance, properties, created_at, updated_at
                    FROM edges
                    WHERE case_id = :id AND deleted_at IS NULL;
                    """
                ),
                {"id": case_id},
            )
            edge_rows = res_edges.fetchall()

        edges = [
            EdgeResponse(
                id=er[0],
                case_id=er[1],
                type=er[2],
                source_id=er[3],
                target_id=er[4],
                layer=er[5],
                confidence=er[6],
                provenance=er[7],
                properties=er[8] if isinstance(er[8], dict) else json.loads(er[8] or "{}"),
                created_at=er[9],
                updated_at=er[10],
            )
            for er in edge_rows
        ]

    return GraphResponse(
        case_id=case_id,
        nodes=nodes,
        edges=edges,
        is_impact_view=impact_only,
        total_case_nodes=total_nodes,
        total_case_edges=total_edges,
    )


# ==============================================================================
# 3. GRAPH EXPANSION (NEO4J 1-HOP / 2-HOP TRAVERSAL)
# ==============================================================================


async def expand_graph(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_ids: list[uuid.UUID],
    hops: int = 1,
) -> GraphResponse:
    """Traverse graph neighborhood in Neo4j up to N hops and return expanded subgraph."""
    await get_case(engine, case_id)

    str_case_id = str(case_id)
    str_node_ids = [str(nid) for nid in node_ids]

    cypher = (
        f"MATCH (start:Node) WHERE start.id IN $node_ids AND start.case_id = $case_id "
        f"MATCH path = (start)-[r*1..{hops}]-(neighbor:Node {{case_id: $case_id}}) "
        f"UNWIND nodes(path) AS n "
        f"UNWIND relationships(path) AS rel "
        f"RETURN collect(DISTINCT n.id) AS node_ids, collect(DISTINCT rel.id) AS edge_ids;"
    )

    async with neo4j_driver.session() as session:
        result = await session.run(
            cypher,
            {"case_id": str_case_id, "node_ids": str_node_ids},
        )
        record = await result.single()

    if not record:
        return await get_case_graph(engine, case_id, impact_only=False)

    expanded_node_uuids = [uuid.UUID(nid) for nid in record["node_ids"]]
    # Always include the original seeds
    expanded_node_uuids = list(set(expanded_node_uuids + node_ids))

    async with engine.connect() as conn:
        res_nodes = await conn.execute(
            text(
                """
                SELECT id, case_id, type, layer, label, confidence, provenance,
                       properties, latitude, longitude, created_at, updated_at
                FROM nodes
                WHERE case_id = :case_id AND deleted_at IS NULL AND id = ANY(:nids);
                """
            ),
            {"case_id": case_id, "nids": expanded_node_uuids},
        )
        node_rows = res_nodes.fetchall()

        res_edges = await conn.execute(
            text(
                """
                SELECT id, case_id, type, source_id, target_id, layer,
                       confidence, provenance, properties, created_at, updated_at
                FROM edges
                WHERE case_id = :case_id AND deleted_at IS NULL
                  AND source_id = ANY(:nids) AND target_id = ANY(:nids);
                """
            ),
            {"case_id": case_id, "nids": expanded_node_uuids},
        )
        edge_rows = res_edges.fetchall()

        res_tot = await conn.execute(
            text(
                """
                SELECT (SELECT count(*) FROM nodes WHERE case_id = :id AND deleted_at IS NULL),
                       (SELECT count(*) FROM edges WHERE case_id = :id AND deleted_at IS NULL);
                """
            ),
            {"id": case_id},
        )
        tot_row = res_tot.fetchone()
        tot_nodes = tot_row[0] if tot_row else 0
        tot_edges = tot_row[1] if tot_row else 0

    nodes = [
        NodeResponse(
            id=r[0],
            case_id=r[1],
            type=r[2],
            layer=r[3],
            label=r[4],
            confidence=r[5],
            provenance=r[6],
            properties=r[7] if isinstance(r[7], dict) else json.loads(r[7] or "{}"),
            latitude=r[8],
            longitude=r[9],
            icon=NODE_TYPES[r[2]].icon if r[2] in NODE_TYPES else "circle",
            created_at=r[10],
            updated_at=r[11],
        )
        for r in node_rows
    ]

    edges = [
        EdgeResponse(
            id=er[0],
            case_id=er[1],
            type=er[2],
            source_id=er[3],
            target_id=er[4],
            layer=er[5],
            confidence=er[6],
            provenance=er[7],
            properties=er[8] if isinstance(er[8], dict) else json.loads(er[8] or "{}"),
            created_at=er[9],
            updated_at=er[10],
        )
        for er in edge_rows
    ]

    return GraphResponse(
        case_id=case_id,
        nodes=nodes,
        edges=edges,
        is_impact_view=False,
        total_case_nodes=tot_nodes,
        total_case_edges=tot_edges,
    )


# ==============================================================================
# 4. NODE & EDGE MUTATIONS
# ==============================================================================


async def create_node(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    payload: NodeCreate,
    actor_id: str,
) -> NodeResponse:
    """Create a new node in PostgreSQL, Neo4j, and log to Audit ledger."""
    await get_case(engine, case_id)

    if payload.type not in NODE_TYPES:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_NODE_TYPE",
                "message": f"Node type '{payload.type}' is not recognized in ontology",
                "allowed": sorted(NODE_TYPES.keys()),
            },
        )

    node_def = NODE_TYPES[payload.type]
    node_id = uuid.uuid4()

    # 1. PostgreSQL insert
    async with engine.begin() as conn:
        await conn.execute(
            text(
                """
                INSERT INTO nodes (
                    id, case_id, type, layer, label, confidence, provenance,
                    properties, latitude, longitude
                ) VALUES (
                    :id, :case_id, :type, :layer, :label, :confidence, 'USER_MANUAL',
                    CAST(:properties AS JSONB), :latitude, :longitude
                );
                """
            ),
            {
                "id": node_id,
                "case_id": case_id,
                "type": payload.type,
                "layer": node_def.layer.value,
                "label": payload.label,
                "confidence": payload.confidence,
                "properties": json.dumps(payload.properties),
                "latitude": payload.latitude,
                "longitude": payload.longitude,
            },
        )

    # 2. Neo4j insert
    canonical_cypher_label = node_def.cypher_label
    neo4j_props = {
        "id": str(node_id),
        "case_id": str(case_id),
        "type": payload.type,
        "layer": node_def.layer.value,
        "label": payload.label,
        "confidence": payload.confidence,
        "provenance": "USER_MANUAL",
        "latitude": payload.latitude,
        "longitude": payload.longitude,
        **payload.properties,
    }
    clean_neo4j_props = {k: v for k, v in neo4j_props.items() if v is not None}

    async with neo4j_driver.session() as session:
        await session.run(
            f"MERGE (n:Node {{id: $id}}) SET n += $props, n:{canonical_cypher_label}",
            {"id": str(node_id), "props": clean_neo4j_props},
        )

    # 3. Audit log
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="CREATE_NODE",
        entity_type="node",
        entity_id=node_id,
        after_state={"type": payload.type, "label": payload.label, "layer": node_def.layer.value},
        reason="Manual creation of node via Athar Studio toolbox",
    )

    # Fetch created
    async with engine.connect() as conn:
        res = await conn.execute(
            text("SELECT created_at, updated_at FROM nodes WHERE id = :id;"),
            {"id": node_id},
        )
        ts = res.fetchone()
        assert ts is not None

    return NodeResponse(
        id=node_id,
        case_id=case_id,
        type=payload.type,
        layer=node_def.layer.value,
        label=payload.label,
        confidence=payload.confidence,
        provenance="USER_MANUAL",
        properties=payload.properties,
        latitude=payload.latitude,
        longitude=payload.longitude,
        icon=node_def.icon,
        created_at=ts[0],
        updated_at=ts[1],
    )


async def create_edge(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    payload: EdgeCreate,
    actor_id: str,
) -> EdgeResponse:
    """Validate ontology relationship and create directed edge."""
    await get_case(engine, case_id)

    # Fetch source and target types
    async with engine.connect() as conn:
        res = await conn.execute(
            text("SELECT id, type, layer FROM nodes WHERE id IN (:s, :t) AND case_id = :cid;"),
            {"s": payload.source_id, "t": payload.target_id, "cid": case_id},
        )
        rows = {r[0]: (r[1], r[2]) for r in res.fetchall()}

    if payload.source_id not in rows:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "SOURCE_NODE_NOT_FOUND",
                "message": f"Source node '{payload.source_id}' not found",
            },
        )
    if payload.target_id not in rows:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "TARGET_NODE_NOT_FOUND",
                "message": f"Target node '{payload.target_id}' not found",
            },
        )

    src_type, _src_layer = rows[payload.source_id]
    tgt_type, _tgt_layer = rows[payload.target_id]

    # Validate relation against ontology
    is_valid, reason = validate_relation(src_type, payload.type, tgt_type)
    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_RELATION_FOR_NODES",
                "message": reason,
                "source_type": src_type,
                "target_type": tgt_type,
                "relation_type": payload.type,
            },
        )

    edge_id = uuid.uuid4()
    # 1. PostgreSQL insert
    async with engine.begin() as conn:
        await conn.execute(
            text(
                """
                INSERT INTO edges (
                    id, case_id, type, source_id, target_id, layer,
                    confidence, provenance, properties
                ) VALUES (
                    :id, :case_id, :type, :source_id, :target_id, 'HYPOTHESIS',
                    :confidence, 'USER_MANUAL', CAST(:properties AS JSONB)
                );
                """
            ),
            {
                "id": edge_id,
                "case_id": case_id,
                "type": payload.type,
                "source_id": payload.source_id,
                "target_id": payload.target_id,
                "confidence": payload.confidence,
                "properties": json.dumps(payload.properties),
            },
        )

    # 2. Neo4j insert
    safe_rel_type = "".join(c for c in payload.type if c.isalnum() or c == "_")
    async with neo4j_driver.session() as session:
        await session.run(
            f"MATCH (s:Node {{id: $s}}), (t:Node {{id: $t}}) "
            f"MERGE (s)-[r:{safe_rel_type} {{id: $id}}]->(t) "
            f"SET r.case_id = $case_id, r.confidence = $confidence, r.layer = 'HYPOTHESIS'",
            {
                "s": str(payload.source_id),
                "t": str(payload.target_id),
                "id": str(edge_id),
                "case_id": str(case_id),
                "confidence": payload.confidence,
            },
        )

    # 3. Audit log
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="CREATE_EDGE",
        entity_type="edge",
        entity_id=edge_id,
        after_state={
            "type": payload.type,
            "source_id": str(payload.source_id),
            "target_id": str(payload.target_id),
        },
        reason="Manual creation of relationship link",
    )

    async with engine.connect() as conn:
        res = await conn.execute(
            text("SELECT created_at, updated_at FROM edges WHERE id = :id;"),
            {"id": edge_id},
        )
        ts = res.fetchone()
        assert ts is not None

    return EdgeResponse(
        id=edge_id,
        case_id=case_id,
        type=payload.type,
        source_id=payload.source_id,
        target_id=payload.target_id,
        layer="HYPOTHESIS",
        confidence=payload.confidence,
        provenance="USER_MANUAL",
        properties=payload.properties,
        created_at=ts[0],
        updated_at=ts[1],
    )


async def change_node_layer(
    engine: AsyncEngine,
    neo4j_driver: AsyncDriver,
    case_id: uuid.UUID,
    node_id: uuid.UUID,
    new_layer: LayerId,
    reason: str,
    actor_id: str,
) -> NodeResponse:
    """Migrate node to a new layer with mandatory judicial audit justification."""
    await get_case(engine, case_id)

    if not reason or len(reason.strip()) < 5:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "MISSING_JUSTIFICATION_REASON",
                "message": (
                    "A non-empty justification reason (>= 5 chars) is "
                    "legally required for layer migration."
                ),
            },
        )

    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, type, layer, label, confidence, "
                "provenance, properties, latitude, longitude, created_at, updated_at "
                "FROM nodes WHERE id = :id AND case_id = :cid AND deleted_at IS NULL;"
            ),
            {"id": node_id, "cid": case_id},
        )
        row = res.fetchone()

    if not row:
        raise HTTPException(
            status_code=404,
            detail={
                "code": "NODE_NOT_FOUND",
                "message": f"Node '{node_id}' not found in case '{case_id}'",
            },
        )

    old_layer = row[2]
    if old_layer == new_layer.value:
        # No-op
        return NodeResponse(
            id=row[0],
            case_id=case_id,
            type=row[1],
            layer=row[2],
            label=row[3],
            confidence=row[4],
            provenance=row[5],
            properties=row[6] if isinstance(row[6], dict) else json.loads(row[6] or "{}"),
            latitude=row[7],
            longitude=row[8],
            icon=NODE_TYPES[row[1]].icon if row[1] in NODE_TYPES else "circle",
            created_at=row[4],
            updated_at=row[4],
        )

    # Update in Postgres
    async with engine.begin() as conn:
        await conn.execute(
            text("UPDATE nodes SET layer = :layer, updated_at = CURRENT_TIMESTAMP WHERE id = :id;"),
            {"layer": new_layer.value, "id": node_id},
        )

    # Update in Neo4j
    async with neo4j_driver.session() as session:
        await session.run(
            "MATCH (n:Node {id: $id}) SET n.layer = $layer",
            {"id": str(node_id), "layer": new_layer.value},
        )

    # Log to Audit
    await log_audit_event(
        engine=engine,
        case_id=case_id,
        actor_id=actor_id,
        action="CHANGE_LAYER",
        entity_type="node",
        entity_id=node_id,
        before_state={"layer": old_layer},
        after_state={"layer": new_layer.value},
        reason=reason,
    )

    async with engine.connect() as conn:
        res = await conn.execute(
            text(
                "SELECT id, type, layer, label, confidence, "
                "provenance, properties, latitude, longitude, created_at, updated_at "
                "FROM nodes WHERE id = :id;"
            ),
            {"id": node_id},
        )
        updated = res.fetchone()
        assert updated is not None

    return NodeResponse(
        id=updated[0],
        case_id=case_id,
        type=updated[1],
        layer=updated[2],
        label=updated[3],
        confidence=updated[4],
        provenance=updated[5],
        properties=updated[6] if isinstance(updated[6], dict) else json.loads(updated[6] or "{}"),
        latitude=updated[7],
        longitude=updated[8],
        icon=NODE_TYPES[updated[1]].icon if updated[1] in NODE_TYPES else "circle",
        created_at=updated[9],
        updated_at=updated[10],
    )


# ==============================================================================
# 5. SPECIALIZED TOOL PROPOSALS PER NODE TYPE
# ==============================================================================

TOOL_CATALOGUE: dict[str, list[ToolProposal]] = {
    "telephone": [
        ToolProposal(
            id="tool_bts_triangulation",
            name_fr="Triangulation Relais BTS",
            name_ar="تثليث هوائيات BTS",
            name_en="BTS Cell Triangulation",
            category="TELECOM",
            description_fr=(
                "Localisation des cellules d'accrochage 4G/LTE " "et calcul de périmètre d'azimut."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_cdr_traffic_analyzer",
            name_fr="Analyseur de Trafic CDRs",
            name_ar="محلل حركة سجلات CDR",
            name_en="CDR Traffic Analyzer",
            category="TELECOM",
            description_fr=(
                "Extraction de la matrice des correspondants "
                "fréquents et des plages horaires d'appels."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_sim_swap_detector",
            name_fr="Détecteur d'Échange SIM (SIM-Swap)",
            name_ar="كاشف تبديل الشريحة",
            name_en="SIM-Swap Detector",
            category="TELECOM",
            description_fr=(
                "Alerte sur changement d'IMSI pour " "un même numéro avant fraude BaridiMob."
            ),
            phase=2,
            is_active=False,
        ),
    ],
    "fichier_apk": [
        ToolProposal(
            id="tool_apk_manifest_inspector",
            name_fr="Inspecteur de Permissions APK",
            name_ar="فاحص تصاريح حزمة APK",
            name_en="APK Permission Inspector",
            category="CYBER",
            description_fr=(
                "Détection des permissions critiques " "d'interception SMS (RECEIVE_SMS, READ_SMS)."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_c2_string_extractor",
            name_fr="Extracteur d'Adresses C2 & Webhooks",
            name_ar="مستخرج روابط خوادم القيادة C2",
            name_en="C2 & Webhook Extractor",
            category="CYBER",
            description_fr=(
                "Désassemblage rapide pour extraire les adresses "
                "IP et tokens de bots Telegram malveillants."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_jadx_decompiler",
            name_fr="Décompilateur Forensique JADX",
            name_ar="مفكك برمجيات JADX الجنائي",
            name_en="JADX Decompiler Suite",
            category="CYBER",
            description_fr="Décompilation complète en code Java source sous scellé WORM.",
            phase=2,
            is_active=False,
        ),
    ],
    "compte_bancaire": [
        ToolProposal(
            id="tool_baridimob_tracer",
            name_fr="Traçage de Flux BaridiMob (RIP)",
            name_ar="تتبع مسار أموال بريدي موب",
            name_en="BaridiMob Flow Tracer",
            category="FINANCIAL",
            description_fr=(
                "Cartographie en cascade des virements P2P "
                "et identification des comptes mules relais."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_atm_withdrawal_correlator",
            name_fr="Corrélateur de Retraits GAB",
            name_ar="مطابق سحوبات الصراف الآلي GAB",
            name_en="ATM Withdrawal Correlator",
            category="FINANCIAL",
            description_fr=(
                "Rapprochement horaire entre retraits " "physiques d'espèces et vidéosurveillance."
            ),
            phase=1,
            is_active=True,
        ),
    ],
    "image_preuve": [
        ToolProposal(
            id="tool_exif_gps_extractor",
            name_fr="Extracteur de Métadonnées EXIF & GPS",
            name_ar="مستخرج بيانات EXIF والموقع",
            name_en="EXIF & GPS Extractor",
            category="MEDIA",
            description_fr=(
                "Extraction des coordonnées GPS réelles " "et du modèle d'appareil photo source."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_arcface_biometric_search",
            name_fr="Reconnaissance Biométrique ArcFace",
            name_ar="مطابقة الوجه البيومترية ArcFace",
            name_en="ArcFace Biometric Matcher",
            category="BIOMETRICS",
            description_fr=(
                "Vectorisation faciale à 512 dimensions et "
                "comparaison avec la base des personnes d'intérêt."
            ),
            phase=3,
            is_active=False,
        ),
    ],
    "site_web": [
        ToolProposal(
            id="tool_whois_dns_recon",
            name_fr="Reconnaissance DNS & WHOIS Passif",
            name_ar="استطلاع النطاق WHOIS و DNS",
            name_en="Passive DNS & WHOIS Recon",
            category="OSINT",
            description_fr=(
                "Historique de résolution d'adresses IP " "et coordonnées de contact de registrar."
            ),
            phase=1,
            is_active=True,
        ),
    ],
}


def get_tool_proposals(node_type: str) -> list[ToolProposal]:
    """Retrieve specialized tool suggestions for the selected node type."""
    if node_type in TOOL_CATALOGUE:
        return TOOL_CATALOGUE[node_type]

    # Default general tools for any node type
    return [
        ToolProposal(
            id="tool_ego_network_expansion",
            name_fr="Expansion Réseau Égo (1 à 2 sauts)",
            name_ar="توسيع شبكة الجوار الفوري",
            name_en="Ego-Network Expansion",
            category="GRAPH",
            description_fr=(
                "Affichage immédiat de l'ensemble des "
                "partenaires et indices directement connectés."
            ),
            phase=1,
            is_active=True,
        ),
        ToolProposal(
            id="tool_timeline_filter",
            name_fr="Filtrage Chronologique",
            name_ar="تصفية زمنية للأحداث",
            name_en="Timeline Filter",
            category="ANALYTICS",
            description_fr=(
                "Focalisation de la frise temporelle "
                "sur les interactions impliquant cet élément."
            ),
            phase=1,
            is_active=True,
        ),
    ]
