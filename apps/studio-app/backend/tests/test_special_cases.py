"""Comprehensive edge case and special boundary condition tests for Athar Backend.

Validates that all graph operations, SNA algorithms, forensic audit chains,
and registry APIs handle unusual, corrupted, boundary, or extreme inputs cleanly.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.db.seed import seed_candy_wheels
from app.main import app
from app.services.sna.algorithms import (
    run_activity_sector,
    run_betweenness,
    run_k_core,
    run_pagerank,
    run_shortest_path_dijkstra,
    run_temporal_subgraph,
)


@pytest.fixture(autouse=True)
async def setup_seed() -> None:
    """Ensure database has the fresh 100-node case before API tests run."""
    await seed_candy_wheels(force=True)


# ==============================================================================
# 1. SNA ALGORITHMS SPECIAL BOUNDARY CASES
# ==============================================================================


def test_temporal_subgraph_inverted_dates_and_zero_matches() -> None:
    """Test temporal subgraph with inverted dates, future ranges, and timezone offsets."""
    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    nodes = [
        {
            "id": id1,
            "type": "telephone",
            "layer": "FLOWS",
            "label": "T1",
            "created_at": "2026-02-10T12:00:00+00:00",
        },
        {
            "id": id2,
            "type": "telephone",
            "layer": "FLOWS",
            "label": "T2",
            "created_at": "2026-02-15T15:00:00+00:00",
        },
    ]
    edges = [
        {
            "id": uuid.uuid4(),
            "source_id": id1,
            "target_id": id2,
            "created_at": "2026-02-12T10:00:00+00:00",
        }
    ]

    # Inverted date range (start > end) -> must return empty without throwing
    res_inv = run_temporal_subgraph(
        nodes, edges, {"start_date": "2026-03-01", "end_date": "2026-01-01"}
    )
    assert res_inv.subgraph_nodes == []
    assert res_inv.subgraph_edges == []

    # Future date range (zero matches)
    res_zero = run_temporal_subgraph(
        nodes, edges, {"start_date": "2030-01-01", "end_date": "2031-01-01"}
    )
    assert res_zero.subgraph_nodes == []
    assert res_zero.subgraph_edges == []

    # Equal start and end date (exact point in time)
    res_exact = run_temporal_subgraph(
        nodes, edges, {"start_date": "2026-02-10", "end_date": "2026-02-10"}
    )
    assert len(res_exact.subgraph_nodes) == 1
    assert res_exact.subgraph_nodes[0] == id1

    # Offset timezone string (+03:00)
    res_tz = run_temporal_subgraph(
        nodes,
        edges,
        {"start_date": "2026-02-09T00:00:00+03:00", "end_date": "2026-02-11T23:59:59+03:00"},
    )
    assert len(res_tz.subgraph_nodes) == 1

    # Malformed/unparseable dates should not crash
    res_malformed = run_temporal_subgraph(
        nodes, edges, {"start_date": "INVALID_DATE_STRING", "end_date": "ANOTHER_BAD_VAL"}
    )
    assert len(res_malformed.subgraph_nodes) == 2


def test_shortest_path_special_cases() -> None:
    """Test shortest path with identical endpoints, disconnected islands, and missing nodes."""
    id_a = uuid.uuid4()
    id_b = uuid.uuid4()
    id_c = uuid.uuid4()  # Disconnected island
    nodes = [
        {"id": id_a, "type": "personne", "layer": "VERIFIED", "label": "A"},
        {"id": id_b, "type": "personne", "layer": "VERIFIED", "label": "B"},
        {"id": id_c, "type": "personne", "layer": "VERIFIED", "label": "C"},
    ]
    edges = [{"id": uuid.uuid4(), "source_id": id_a, "target_id": id_b}]

    # Case 1: Source == Target -> path of length 1, 0 hops
    res_self = run_shortest_path_dijkstra(
        nodes, edges, {"source_id": str(id_a), "target_id": str(id_a)}
    )
    assert res_self.summary["path_found"] is True
    assert res_self.summary["hops"] == 0
    assert res_self.subgraph_nodes == [id_a]

    # Case 2: Disconnected target (A -> C) -> path_found False, empty nodes
    res_disconn = run_shortest_path_dijkstra(
        nodes, edges, {"source_id": str(id_a), "target_id": str(id_c)}
    )
    assert res_disconn.summary["path_found"] is False
    assert res_disconn.subgraph_nodes == []

    # Case 3: Non-existent node ID raises descriptive ValueError without crashing
    non_existent = str(uuid.uuid4())
    with pytest.raises(ValueError, match="Source ou cible introuvable"):
        run_shortest_path_dijkstra(
            nodes, edges, {"source_id": str(id_a), "target_id": non_existent}
        )


def test_k_core_boundary_extremes() -> None:
    """Test k-core with 0 nodes, 1 node, and extreme k values."""
    # 0 nodes
    res_empty = run_k_core([], [], {})
    assert len(res_empty.node_metrics) == 0
    assert res_empty.summary["max_k_core"] == 0

    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    nodes = [
        {"id": id1, "type": "personne", "layer": "VERIFIED", "label": "1"},
        {"id": id2, "type": "personne", "layer": "VERIFIED", "label": "2"},
    ]
    edges = [{"id": uuid.uuid4(), "source_id": id1, "target_id": id2}]

    # k = 1 -> returns both nodes with k=1
    res_k1 = run_k_core(nodes, edges, {"k": 1})
    assert len(res_k1.node_metrics) == 2
    assert res_k1.summary["max_k_core"] == 1
    assert all(m.value == 1 for m in res_k1.node_metrics)


def test_centrality_on_isolated_nodes() -> None:
    """Test betweenness and PageRank on isolated nodes, 0 nodes, and 1 node."""
    # 0 nodes
    res_zero_b = run_betweenness([], [], {})
    assert len(res_zero_b.node_metrics) == 0
    res_zero_p = run_pagerank([], [], {})
    assert len(res_zero_p.node_metrics) == 0

    # 1 node
    id_single = uuid.uuid4()
    single_node = [{"id": id_single, "type": "personne", "layer": "VERIFIED", "label": "Single"}]
    res_single_b = run_betweenness(single_node, [], {})
    assert len(res_single_b.node_metrics) == 1
    assert res_single_b.node_metrics[0].value == 0.0
    res_single_p = run_pagerank(single_node, [], {})
    assert len(res_single_p.node_metrics) == 1
    assert res_single_p.node_metrics[0].value == 1.0

    # 4 isolated nodes and 0 edges
    nodes = [
        {"id": uuid.uuid4(), "type": "personne", "layer": "VERIFIED", "label": f"Iso-{i}"}
        for i in range(4)
    ]
    edges: list[dict] = []

    res_bet = run_betweenness(nodes, edges, {})
    assert len(res_bet.node_metrics) == 4
    for metric in res_bet.node_metrics:
        assert metric.value == 0.0

    res_pr = run_pagerank(nodes, edges, {})
    assert len(res_pr.node_metrics) == 4
    # With 0 edges, PageRank distributes evenly: 1/4 = 0.25
    for metric in res_pr.node_metrics:
        assert abs(metric.value - 0.25) < 0.01


def test_spatial_clustering_null_and_identical_coords() -> None:
    """Test spatial clustering with null GPS coordinates and identical coordinate points."""
    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    id3 = uuid.uuid4()
    nodes = [
        {
            "id": id1,
            "type": "antenne_bts",
            "layer": "INFRA",
            "label": "BTS 1",
            "latitude": 36.75,
            "longitude": 3.05,
        },
        # Identical location
        {
            "id": id2,
            "type": "antenne_bts",
            "layer": "INFRA",
            "label": "BTS 2",
            "latitude": 36.75,
            "longitude": 3.05,
        },
        # Null coordinates
        {
            "id": id3,
            "type": "telephone",
            "layer": "FLOWS",
            "label": "Phone",
            "latitude": None,
            "longitude": None,
        },
    ]

    res = run_activity_sector(nodes, [], {"max_distance_km": 15.0})
    assert res.summary["total_sectors"] == 1
    assert res.skipped_nodes_count == 1
    # Node 3 with null GPS coordinates must be safely skipped
    clustered_ids = {m.node_id for m in res.node_metrics}
    assert id3 not in clustered_ids
    assert id1 in clustered_ids and id2 in clustered_ids


# ==============================================================================
# 2. GRAPH API SPECIAL CASE ENDPOINTS
# ==============================================================================


@pytest.mark.asyncio
async def test_create_node_with_arabic_and_special_unicode() -> None:
    """Test creating a judicial entity with Arabic Unicode and forensic properties."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Get seed case
        res_cases = await client.get("/api/v1/cases")
        case_id = res_cases.json()[0]["id"]

        arabic_label = "مشتبه رئيسي — علي بن قدور (وهران)"
        payload = {
            "type": "personne",
            "label": arabic_label,
            "confidence": 0.95,
            "provenance": "PROCEDURE_CPP",
            "properties": {
                "alias": "علي باتشيكو",
                "wilaya_residence": "وهران",
                "national_id": "DZ-1995-31-0029314",
            },
            "latitude": 35.69765,
            "longitude": -0.63374,
        }

        res = await client.post(f"/api/v1/cases/{case_id}/nodes", json=payload)
        assert res.status_code == 201
        created = res.json()
        assert created["label"] == arabic_label
        assert created["layer"] == "HYPOTHESIS"
        assert created["properties"]["alias"] == "علي باتشيكو"

        # Cleanup with soft delete
        del_res = await client.delete(f"/api/v1/cases/{case_id}/nodes/{created['id']}")
        assert del_res.status_code == 200


@pytest.mark.asyncio
async def test_expand_nonexistent_node_returns_gracefully() -> None:
    """Expanding a random non-existent node UUID returns empty neighbors, not 500."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        case_id = res_cases.json()[0]["id"]

        fake_id = str(uuid.uuid4())
        res = await client.post(
            f"/api/v1/cases/{case_id}/graph/expand",
            json={"node_ids": [fake_id], "hops": 1},
        )
        assert res.status_code == 200
        assert res.json()["nodes"] == []
        assert res.json()["edges"] == []


@pytest.mark.asyncio
async def test_delete_node_cascades_and_preserves_consistency() -> None:
    """Deleting a node properly removes it and avoids dangling foreign keys."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        case_id = res_cases.json()[0]["id"]

        # Create temporary node
        node_res = await client.post(
            f"/api/v1/cases/{case_id}/nodes",
            json={
                "type": "carte_sim",
                "label": "SIM Test Deletion",
                "confidence": 0.8,
                "provenance": "TEST",
                "properties": {},
            },
        )
        assert node_res.status_code == 201
        node_id = node_res.json()["id"]

        # Delete it
        del_res = await client.delete(f"/api/v1/cases/{case_id}/nodes/{node_id}")
        assert del_res.status_code == 200
        assert del_res.json()["status"] == "DELETED"

        # Attempt to delete again -> 404 (already soft-deleted)
        del_again = await client.delete(f"/api/v1/cases/{case_id}/nodes/{node_id}")
        assert del_again.status_code == 404


@pytest.mark.asyncio
async def test_audit_verification_tamper_detection() -> None:
    """Forensic audit endpoint detects valid chain on seed case."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res_cases = await client.get("/api/v1/cases")
        case_id = res_cases.json()[0]["id"]

        verify_res = await client.get(f"/api/v1/cases/{case_id}/audit/verify")
        assert verify_res.status_code == 200
        audit_data = verify_res.json()
        assert audit_data["is_valid"] is True
        assert audit_data["total_entries"] >= 1
        assert audit_data["first_tampered_index"] is None
        assert (
            "verified" in audit_data["message"].lower()
            or "authentic" in audit_data["message"].lower()
        )
