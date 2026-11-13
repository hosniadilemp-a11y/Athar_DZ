"""Tests for the 16 SNA Graph Algorithms and Endpoints.

Conforms strictly to Section 6 of .agent/phase1-implementation-rules.md.
"""

from __future__ import annotations

import uuid

import pytest
from httpx import ASGITransport, AsyncClient

from app.domain.sna_registry import SNA_REGISTRY
from app.main import app
from app.services.sna.algorithms import (
    run_activity_sector,
    run_adamic_adar,
    run_articulation_points,
    run_betweenness,
    run_closeness_eigenvector,
    run_degree_centrality,
    run_jaccard,
    run_k_core,
    run_label_propagation,
    run_louvain,
    run_node_classification,
    run_pagerank,
    run_personalized_pagerank,
    run_shortest_path_dijkstra,
    run_temporal_subgraph,
    run_threshold_expand,
)


def make_tiny_test_graph() -> tuple[list[dict], list[dict]]:
    """Build a tiny kite-like graph: A-B, B-C, A-C, C-D, D-E.

    C is the critical articulation point / bridge between triangle (A,B,C) and line (C,D,E).
    """
    id_a, id_b, id_c, id_d, id_e = [uuid.uuid4() for _ in range(5)]
    nodes = [
        {
            "id": id_a,
            "type": "personne",
            "layer": "VERIFIED",
            "label": "A",
            "confidence": 1.0,
            "latitude": 36.75,
            "longitude": 3.05,
        },
        {
            "id": id_b,
            "type": "personne",
            "layer": "VERIFIED",
            "label": "B",
            "confidence": 0.9,
            "latitude": 36.76,
            "longitude": 3.06,
        },
        {
            "id": id_c,
            "type": "personne",
            "layer": "VERIFIED",
            "label": "C",
            "confidence": 0.8,
            "latitude": 36.77,
            "longitude": 3.07,
        },
        {
            "id": id_d,
            "type": "telephone",
            "layer": "INFRA",
            "label": "D",
            "confidence": 0.5,
            "latitude": None,
            "longitude": None,
        },
        {
            "id": id_e,
            "type": "compte_social",
            "layer": "OSINT_RAW",
            "label": "E",
            "confidence": 0.3,
            "latitude": 37.0,
            "longitude": 4.0,
        },
    ]
    edges = [
        {
            "id": uuid.uuid4(),
            "type": "COMMUNIQUE_AVEC",
            "source_id": id_a,
            "target_id": id_b,
            "layer": "VERIFIED",
        },
        {
            "id": uuid.uuid4(),
            "type": "COMMUNIQUE_AVEC",
            "source_id": id_b,
            "target_id": id_c,
            "layer": "VERIFIED",
        },
        {
            "id": uuid.uuid4(),
            "type": "COMMUNIQUE_AVEC",
            "source_id": id_a,
            "target_id": id_c,
            "layer": "VERIFIED",
        },
        {
            "id": uuid.uuid4(),
            "type": "UTILISE",
            "source_id": id_c,
            "target_id": id_d,
            "layer": "INFRA",
        },
        {
            "id": uuid.uuid4(),
            "type": "ASSOCIE_A",
            "source_id": id_d,
            "target_id": id_e,
            "layer": "OSINT_RAW",
        },
    ]
    return nodes, edges


def test_sna_registry_exact_16_algorithms() -> None:
    """Must register exactly 16 algorithms."""
    assert len(SNA_REGISTRY) == 16
    expected_keys = {
        "betweenness",
        "pagerank",
        "personalized_pagerank",
        "degree_centrality",
        "closeness_eigenvector",
        "louvain",
        "label_propagation",
        "k_core",
        "articulation_points",
        "shortest_path_dijkstra",
        "jaccard",
        "adamic_adar",
        "node_classification",
        "threshold_expand",
        "temporal_subgraph",
        "activity_sector",
    }
    assert set(SNA_REGISTRY.keys()) == expected_keys


def test_betweenness_centrality_on_tiny_graph() -> None:
    nodes, edges = make_tiny_test_graph()
    res = run_betweenness(nodes, edges, {"normalized": True})
    assert res.algorithm_key == "betweenness"
    metrics = {m.node_label: m.value for m in res.node_metrics}
    assert metrics["C"] > metrics["A"]
    assert metrics["C"] > metrics["B"]


def test_pagerank_and_personalized_pagerank() -> None:
    nodes, edges = make_tiny_test_graph()
    pr = run_pagerank(nodes, edges, {"alpha": 0.85})
    assert len(pr.node_metrics) == 5

    ppr = run_personalized_pagerank(nodes, edges, {"source_node_id": str(nodes[0]["id"])})
    assert ppr.node_metrics[0].node_label == "A"


def test_degree_and_closeness_eigenvector() -> None:
    nodes, edges = make_tiny_test_graph()
    deg = run_degree_centrality(nodes, edges, {})
    assert len(deg.node_metrics) == 5
    deg_c = next(m.value for m in deg.node_metrics if m.node_label == "C")
    assert deg_c["total"] >= 3

    ce = run_closeness_eigenvector(nodes, edges, {})
    assert len(ce.node_metrics) == 5


def test_louvain_and_label_propagation() -> None:
    nodes, edges = make_tiny_test_graph()
    louv = run_louvain(nodes, edges, {"resolution": 1.0, "seed": 42})
    assert louv.summary["total_communities"] >= 1

    lpa = run_label_propagation(nodes, edges, {})
    assert len(lpa.node_metrics) == 5


def test_k_core_and_articulation_points() -> None:
    nodes, edges = make_tiny_test_graph()
    kc = run_k_core(nodes, edges, {})
    kc_metrics = {m.node_label: m.value for m in kc.node_metrics}
    assert kc_metrics["A"] == 2
    assert kc_metrics["B"] == 2
    assert kc_metrics["C"] == 2

    ap = run_articulation_points(nodes, edges, {})
    ap_labels = {m.node_label for m in ap.node_metrics}
    assert "C" in ap_labels or "D" in ap_labels


def test_shortest_path_dijkstra() -> None:
    nodes, edges = make_tiny_test_graph()
    res = run_shortest_path_dijkstra(
        nodes,
        edges,
        {"source_id": str(nodes[0]["id"]), "target_id": str(nodes[4]["id"])},
    )
    assert res.summary["path_found"] is True
    assert res.summary["hops"] == 3


def test_link_prediction_jaccard_and_adamic_adar() -> None:
    nodes, edges = make_tiny_test_graph()
    jac = run_jaccard(nodes, edges, {"threshold": 0.1})
    assert jac.algorithm_key == "jaccard"
    for e in jac.suggested_edges:
        assert e.layer == "HYPOTHESIS"
        assert e.type == "LIKELY_COLLABORATOR"

    aa = run_adamic_adar(nodes, edges, {"threshold": 0.1})
    assert aa.algorithm_key == "adamic_adar"


def test_node_classification() -> None:
    nodes, edges = make_tiny_test_graph()
    nc = run_node_classification(nodes, edges, {})
    for m in nc.node_metrics:
        role = m.value["role_hypothesis"]
        assert role in {"leader", "operationnel", "soutien", "neutre"}


def test_threshold_expand_and_temporal() -> None:
    nodes, edges = make_tiny_test_graph()
    te = run_threshold_expand(nodes, edges, {"min_confidence": 0.8})
    assert len(te.subgraph_nodes) == 3

    ts = run_temporal_subgraph(nodes, edges, {})
    assert len(ts.subgraph_nodes) == 5


def test_activity_sector_spatial_clustering() -> None:
    nodes, edges = make_tiny_test_graph()
    res = run_activity_sector(nodes, edges, {"max_distance_km": 10.0})
    assert res.algorithm_key == "activity_sector"
    assert res.skipped_nodes_count >= 1


def test_edge_cases_empty_and_single_node() -> None:
    """Must handle empty graph and single isolated node without crash."""
    empty_nodes: list[dict] = []
    empty_edges: list[dict] = []
    single_node = [
        {
            "id": uuid.uuid4(),
            "type": "personne",
            "layer": "VERIFIED",
            "label": "Solo",
            "confidence": 1.0,
            "latitude": None,
            "longitude": None,
        }
    ]

    assert run_betweenness(empty_nodes, empty_edges, {}).node_metrics == []
    assert len(run_betweenness(single_node, empty_edges, {}).node_metrics) == 1

    assert run_pagerank(empty_nodes, empty_edges, {}).node_metrics == []
    assert len(run_pagerank(single_node, empty_edges, {}).node_metrics) == 1

    assert run_k_core(empty_nodes, empty_edges, {}).node_metrics == []
    assert len(run_k_core(single_node, empty_edges, {}).node_metrics) == 1


@pytest.mark.asyncio
async def test_sna_api_endpoints_on_seed_case() -> None:
    """Run all 16 algorithms through the API on the 100-node seed case."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Get seed case
        res_cases = await client.get("/api/v1/cases")
        cases = res_cases.json()
        seed_case = next(c for c in cases if "CANDY" in c["code"] or "ATHAR" in c["code"])
        case_id = seed_case["id"]

        # 1. Test GET /cases/{case_id}/sna
        res_list = await client.get(f"/api/v1/cases/{case_id}/sna")
        assert res_list.status_code == 200
        algos = res_list.json()
        assert len(algos) == 16

        # Grab nodes for PPR & Dijkstra
        res_graph = await client.get(f"/api/v1/cases/{case_id}/graph")
        graph_nodes = res_graph.json()["nodes"]
        node_1 = graph_nodes[0]["id"]
        node_2 = graph_nodes[1]["id"]

        # 2. Test each algorithm execution
        for algo in algos:
            key = algo["key"]
            params: dict = {}
            if key == "personalized_pagerank":
                params["source_node_id"] = node_1
            elif key == "shortest_path_dijkstra":
                params["source_id"] = node_1
                params["target_id"] = node_2

            res_run = await client.post(
                f"/api/v1/cases/{case_id}/sna/{key}",
                json={"params": params},
            )
            assert res_run.status_code == 200, f"Algorithm '{key}' failed: {res_run.text}"
            data = res_run.json()
            assert data["algorithm_key"] == key
            assert data["execution_time_ms"] >= 0.0
            assert "hypothèse" in data["method_disclaimer"].lower()

        # 3. Test 404 on unknown algorithm
        res_unknown = await client.post(
            f"/api/v1/cases/{case_id}/sna/unknown_quantum_algo",
            json={"params": {}},
        )
        assert res_unknown.status_code == 404
