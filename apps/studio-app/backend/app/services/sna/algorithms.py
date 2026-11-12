"""Pure deterministic graph algorithms for SNA.

Zero database calls inside this module. Input is an in-memory graph snapshot.
Conforms to Section 6 of .agent/phase1-implementation-rules.md.
"""

from __future__ import annotations

import math
import uuid
from datetime import datetime
from typing import Any

import networkx as nx

from app.schemas.sna import SnaNodeMetric, SnaResultResponse, SuggestedEdge


def build_networkx_graph(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    directed: bool = False,
) -> tuple[nx.Graph, dict[str, dict[str, Any]]]:
    """Build NetworkX graph snapshot with node attributes sorted by ID for determinism."""
    G = nx.DiGraph() if directed else nx.Graph()
    node_attr_map: dict[str, dict[str, Any]] = {}

    for n in sorted(nodes, key=lambda x: str(x["id"])):
        nid = str(n["id"])
        node_attr_map[nid] = n
        G.add_node(nid, **n)

    for e in sorted(edges, key=lambda x: str(x["id"])):
        src = str(e["source_id"])
        tgt = str(e["target_id"])
        if src in G and tgt in G:
            G.add_edge(src, tgt, **e)

    return G, node_attr_map


# 1. Betweenness Centrality
def run_betweenness(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    normalized = bool(params.get("normalized", True))
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    if len(G) == 0:
        scores = {}
    elif len(G) == 1:
        scores = {list(G.nodes())[0]: 0.0}
    else:
        scores = nx.betweenness_centrality(G, normalized=normalized, weight=None)

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value=round(score, 6),
        )
        for nid, score in sorted(scores.items(), key=lambda x: (-x[1], x[0]))
    ]

    return SnaResultResponse(
        algorithm_key="betweenness",
        algorithm_name="Centralité d'Intermédiarité",
        category="centrality",
        execution_time_ms=0.0,
        parameters_used={"normalized": normalized},
        summary={
            "total_nodes": len(nodes),
            "max_betweenness": metrics[0].value if metrics else 0.0,
        },
        node_metrics=metrics,
    )


def pure_python_pagerank(
    G: nx.Graph | nx.DiGraph,
    alpha: float = 0.85,
    personalization: dict[str, float] | None = None,
    max_iter: int = 100,
    tol: float = 1e-6,
) -> dict[str, float]:
    """Pure Python deterministic power-iteration PageRank (zero numpy/scipy dependency)."""
    if len(G) == 0:
        return {}
    N = len(G)
    nodes = sorted(G.nodes())
    p = personalization or {n: 1.0 / N for n in nodes}
    p_sum = sum(p.values())
    if p_sum > 0:
        p = {n: val / p_sum for n, val in p.items()}
    else:
        p = {n: 1.0 / N for n in nodes}

    x = {n: 1.0 / N for n in nodes}
    dangling_nodes = [n for n in nodes if G.out_degree(n) == 0] if G.is_directed() else []

    for _ in range(max_iter):
        xlast = x.copy()
        x = {n: 0.0 for n in nodes}
        danglesum = alpha * sum(xlast[n] for n in dangling_nodes) if dangling_nodes else 0.0

        for n in nodes:
            nbrs = list(G.successors(n) if G.is_directed() else G.neighbors(n))
            deg = len(nbrs)
            if deg > 0:
                share = alpha * xlast[n] / deg
                for nbr in nbrs:
                    x[nbr] += share

        for n in nodes:
            x[n] += danglesum * p[n] + (1.0 - alpha) * p[n]

        err = sum(abs(x[n] - xlast[n]) for n in nodes)
        if err < N * tol:
            break

    return x


def pure_python_eigenvector(
    G: nx.Graph,
    max_iter: int = 100,
    tol: float = 1e-6,
) -> dict[str, float]:
    """Pure Python power iteration for eigenvector centrality."""
    if len(G) == 0:
        return {}
    N = len(G)
    nodes = sorted(G.nodes())
    x = {n: 1.0 / math.sqrt(N) for n in nodes}

    for _ in range(max_iter):
        xlast = x.copy()
        x = {n: 0.0 for n in nodes}
        for n in nodes:
            for nbr in G.neighbors(n):
                x[nbr] += xlast[n]

        norm = math.sqrt(sum(val**2 for val in x.values()))
        if norm > 0:
            x = {n: val / norm for n, val in x.items()}

        err = sum(abs(x[n] - xlast[n]) for n in nodes)
        if err < N * tol:
            break

    return x


# 2. PageRank
def run_pagerank(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    alpha = float(params.get("alpha", 0.85))
    max_iter = int(params.get("max_iter", 100))
    G, attr_map = build_networkx_graph(nodes, edges, directed=True)

    if len(G) == 0:
        scores = {}
    elif len(G) == 1:
        scores = {list(G.nodes())[0]: 1.0}
    else:
        scores = pure_python_pagerank(G, alpha=alpha, max_iter=max_iter)

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value=round(score, 6),
        )
        for nid, score in sorted(scores.items(), key=lambda x: (-x[1], x[0]))
    ]

    return SnaResultResponse(
        algorithm_key="pagerank",
        algorithm_name="Score PageRank",
        category="centrality",
        execution_time_ms=0.0,
        parameters_used={"alpha": alpha, "max_iter": max_iter},
        summary={
            "total_nodes": len(nodes),
            "highest_authority": metrics[0].node_label if metrics else None,
        },
        node_metrics=metrics,
    )


# 3. Personalized PageRank
def run_personalized_pagerank(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    src_id_str = str(params.get("source_node_id") or "")
    alpha = float(params.get("alpha", 0.85))
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    if not src_id_str or src_id_str not in G:
        raise ValueError(f"Nœud source pivot '{src_id_str}' introuvable dans le graphe")

    personalization = {nid: 0.0 for nid in G.nodes()}
    personalization[src_id_str] = 1.0

    scores = pure_python_pagerank(G, alpha=alpha, personalization=personalization)

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value=round(score, 6),
        )
        for nid, score in sorted(scores.items(), key=lambda x: (-x[1], x[0]))
    ]

    return SnaResultResponse(
        algorithm_key="personalized_pagerank",
        algorithm_name="PageRank Personnalisé (PPR)",
        category="centrality",
        execution_time_ms=0.0,
        parameters_used={"source_node_id": src_id_str, "alpha": alpha},
        summary={"pivot_node": attr_map[src_id_str]["label"]},
        node_metrics=metrics,
    )


# 4. Degree Centrality
def run_degree_centrality(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G_di, attr_map = build_networkx_graph(nodes, edges, directed=True)

    metrics: list[SnaNodeMetric] = []
    for nid in sorted(G_di.nodes()):
        in_deg = G_di.in_degree(nid)
        out_deg = G_di.out_degree(nid)
        total_deg = in_deg + out_deg
        metrics.append(
            SnaNodeMetric(
                node_id=uuid.UUID(nid),
                node_label=attr_map[nid]["label"],
                node_type=attr_map[nid]["type"],
                layer=attr_map[nid]["layer"],
                value={"total": total_deg, "in": in_deg, "out": out_deg},
            )
        )

    def sort_key(m: SnaNodeMetric) -> tuple[int, str]:
        val = m.value.get("total", 0) if isinstance(m.value, dict) else 0
        return (-int(val), m.node_label)

    metrics.sort(key=sort_key)

    return SnaResultResponse(
        algorithm_key="degree_centrality",
        algorithm_name="Centralité de Degré",
        category="centrality",
        execution_time_ms=0.0,
        parameters_used={},
        summary={"total_nodes": len(nodes)},
        node_metrics=metrics,
    )


# 5. Closeness & Eigenvector
def run_closeness_eigenvector(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)
    if len(G) == 0:
        closeness, eigenvector = {}, {}
    else:
        closeness = nx.closeness_centrality(G)
        eigenvector = pure_python_eigenvector(G, max_iter=200, tol=1e-4)

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value={
                "closeness": round(closeness.get(nid, 0.0), 6),
                "eigenvector": round(eigenvector.get(nid, 0.0), 6),
            },
        )
        for nid in sorted(G.nodes(), key=lambda n: (-closeness.get(n, 0.0), n))
    ]

    return SnaResultResponse(
        algorithm_key="closeness_eigenvector",
        algorithm_name="Centralités de Proximité & Vecteur Propre",
        category="centrality",
        execution_time_ms=0.0,
        parameters_used={},
        summary={"total_nodes": len(nodes)},
        node_metrics=metrics,
    )


# 6. Louvain Community Detection
def run_louvain(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    resolution = float(params.get("resolution", 1.0))
    seed = int(params.get("seed", 42))
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    if len(G) == 0:
        communities = []
    elif len(G) == 1:
        communities = [{list(G.nodes())[0]}]
    else:
        communities = nx.community.louvain_communities(G, resolution=resolution, seed=seed)

    # Sort communities deterministically by size and smallest node ID
    sorted_comms = sorted(communities, key=lambda c: (-len(c), sorted(c)[0]))

    metrics: list[SnaNodeMetric] = []
    for comm_idx, comm in enumerate(sorted_comms, start=1):
        for nid in sorted(comm):
            metrics.append(
                SnaNodeMetric(
                    node_id=uuid.UUID(nid),
                    node_label=attr_map[nid]["label"],
                    node_type=attr_map[nid]["type"],
                    layer=attr_map[nid]["layer"],
                    value=f"Cellule-{comm_idx}",
                )
            )

    return SnaResultResponse(
        algorithm_key="louvain",
        algorithm_name="Détection de Communautés (Louvain)",
        category="community",
        execution_time_ms=0.0,
        parameters_used={"resolution": resolution, "seed": seed},
        summary={"total_communities": len(sorted_comms), "total_nodes": len(nodes)},
        node_metrics=metrics,
    )


# 7. Label Propagation
def run_label_propagation(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    if len(G) == 0:
        comms = []
    elif len(G) == 1:
        comms = [{list(G.nodes())[0]}]
    else:
        comms = list(nx.community.asyn_lpa_communities(G, seed=42))

    sorted_comms = sorted(comms, key=lambda c: (-len(c), sorted(c)[0]))
    metrics: list[SnaNodeMetric] = []
    for c_id, comm in enumerate(sorted_comms, start=1):
        for nid in sorted(comm):
            metrics.append(
                SnaNodeMetric(
                    node_id=uuid.UUID(nid),
                    node_label=attr_map[nid]["label"],
                    node_type=attr_map[nid]["type"],
                    layer=attr_map[nid]["layer"],
                    value=f"Cluster-LPA-{c_id}",
                )
            )

    return SnaResultResponse(
        algorithm_key="label_propagation",
        algorithm_name="Propagation d'Étiquettes (LPA)",
        category="community",
        execution_time_ms=0.0,
        parameters_used={"seed": 42},
        summary={"total_clusters": len(sorted_comms)},
        node_metrics=metrics,
    )


# 8. K-Core Decomposition
def run_k_core(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)
    core_nums = nx.core_number(G) if len(G) > 0 else {}

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value=k_val,
        )
        for nid, k_val in sorted(core_nums.items(), key=lambda x: (-x[1], x[0]))
    ]

    max_core = metrics[0].value if metrics else 0

    return SnaResultResponse(
        algorithm_key="k_core",
        algorithm_name="Décomposition K-Core",
        category="topology",
        execution_time_ms=0.0,
        parameters_used={},
        summary={"max_k_core": max_core, "total_nodes": len(nodes)},
        node_metrics=metrics,
    )


# 9. Articulation Points
def run_articulation_points(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)
    cut_vertices = set(nx.articulation_points(G)) if len(G) > 2 else set()

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value="POINT_ARTICULATION_CRITIQUE",
        )
        for nid in sorted(cut_vertices)
    ]

    return SnaResultResponse(
        algorithm_key="articulation_points",
        algorithm_name="Points d'Articulation (Goulots)",
        category="topology",
        execution_time_ms=0.0,
        parameters_used={},
        summary={"total_cut_vertices": len(metrics)},
        node_metrics=metrics,
    )


# 10. Shortest Path Dijkstra
def run_shortest_path_dijkstra(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    src_str = str(params.get("source_id") or "")
    tgt_str = str(params.get("target_id") or "")
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    if src_str not in G or tgt_str not in G:
        raise ValueError("Source ou cible introuvable dans le graphe")

    has_path = nx.has_path(G, src_str, tgt_str)
    if not has_path:
        return SnaResultResponse(
            algorithm_key="shortest_path_dijkstra",
            algorithm_name="Plus Court Chemin (Dijkstra)",
            category="topology",
            execution_time_ms=0.0,
            parameters_used={"source_id": src_str, "target_id": tgt_str},
            summary={"path_found": False, "length": 0, "status": "NO_PATH"},
        )

    path_nodes = nx.shortest_path(G, src_str, tgt_str)
    path_edges: list[uuid.UUID] = []

    for i in range(len(path_nodes) - 1):
        u, v = path_nodes[i], path_nodes[i + 1]
        edge_data = G.get_edge_data(u, v)
        if edge_data and "id" in edge_data:
            path_edges.append(uuid.UUID(str(edge_data["id"])))

    metrics = [
        SnaNodeMetric(
            node_id=uuid.UUID(nid),
            node_label=attr_map[nid]["label"],
            node_type=attr_map[nid]["type"],
            layer=attr_map[nid]["layer"],
            value=f"Etape-{idx}",
        )
        for idx, nid in enumerate(path_nodes, start=1)
    ]

    return SnaResultResponse(
        algorithm_key="shortest_path_dijkstra",
        algorithm_name="Plus Court Chemin (Dijkstra)",
        category="topology",
        execution_time_ms=0.0,
        parameters_used={"source_id": src_str, "target_id": tgt_str},
        summary={"path_found": True, "hops": len(path_nodes) - 1},
        node_metrics=metrics,
        subgraph_nodes=[uuid.UUID(nid) for nid in path_nodes],
        subgraph_edges=path_edges,
    )


# 11. Jaccard Link Prediction
def run_jaccard(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    threshold = float(params.get("threshold", 0.4))
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    suggested: list[SuggestedEdge] = []
    if len(G) > 1:
        # Evaluate non-edges
        preds = nx.jaccard_coefficient(G)
        for u, v, p in preds:
            if p >= threshold:
                suggested.append(
                    SuggestedEdge(
                        source_id=uuid.UUID(u),
                        target_id=uuid.UUID(v),
                        source_label=attr_map[u]["label"],
                        target_label=attr_map[v]["label"],
                        type="LIKELY_COLLABORATOR",
                        layer="HYPOTHESIS",
                        score=round(float(p), 4),
                        confidence=round(min(float(p), 0.99), 4),
                    )
                )

    suggested.sort(key=lambda x: (-x.score, str(x.source_id)))

    return SnaResultResponse(
        algorithm_key="jaccard",
        algorithm_name="Prédiction de Liens (Jaccard)",
        category="link_prediction",
        execution_time_ms=0.0,
        parameters_used={"threshold": threshold},
        summary={"suggested_count": len(suggested)},
        suggested_edges=suggested,
    )


# 12. Adamic-Adar Link Prediction
def run_adamic_adar(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    threshold = float(params.get("threshold", 0.5))
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)

    suggested: list[SuggestedEdge] = []
    if len(G) > 1:
        preds = nx.adamic_adar_index(G)
        for u, v, p in preds:
            if p >= threshold:
                norm_score = round(min(float(p) / 5.0, 1.0), 4)
                suggested.append(
                    SuggestedEdge(
                        source_id=uuid.UUID(u),
                        target_id=uuid.UUID(v),
                        source_label=attr_map[u]["label"],
                        target_label=attr_map[v]["label"],
                        type="LIKELY_COLLABORATOR",
                        layer="HYPOTHESIS",
                        score=round(float(p), 4),
                        confidence=norm_score,
                    )
                )

    suggested.sort(key=lambda x: (-x.score, str(x.source_id)))

    return SnaResultResponse(
        algorithm_key="adamic_adar",
        algorithm_name="Prédiction de Liens (Adamic-Adar)",
        category="link_prediction",
        execution_time_ms=0.0,
        parameters_used={"threshold": threshold},
        summary={"suggested_count": len(suggested)},
        suggested_edges=suggested,
    )


# 13. Heuristic Node Role Classification
def run_node_classification(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    G, attr_map = build_networkx_graph(nodes, edges, directed=False)
    if len(G) == 0:
        return SnaResultResponse(
            algorithm_key="node_classification",
            algorithm_name="Classification Heuristique de Rôles",
            category="classification",
            execution_time_ms=0.0,
            parameters_used={},
        )

    betweenness = nx.betweenness_centrality(G, normalized=True)
    degrees = dict(G.degree())

    b_vals = sorted(betweenness.values())
    p75 = b_vals[int(len(b_vals) * 0.75)] if b_vals else 0.0

    metrics: list[SnaNodeMetric] = []
    role_counts: dict[str, int] = {"leader": 0, "operationnel": 0, "soutien": 0, "neutre": 0}

    for nid in sorted(G.nodes()):
        deg = degrees[nid]
        bet = betweenness[nid]

        if bet >= p75 and deg >= 3:
            role = "leader"
        elif deg >= 3:
            role = "operationnel"
        elif deg >= 1:
            role = "soutien"
        else:
            role = "neutre"

        role_counts[role] += 1
        metrics.append(
            SnaNodeMetric(
                node_id=uuid.UUID(nid),
                node_label=attr_map[nid]["label"],
                node_type=attr_map[nid]["type"],
                layer=attr_map[nid]["layer"],
                value={
                    "role_hypothesis": role,
                    "degree": deg,
                    "betweenness": round(bet, 6),
                    "rule": f"deg={deg}, bet={round(bet, 4)} vs p75={round(p75, 4)}",
                },
            )
        )

    return SnaResultResponse(
        algorithm_key="node_classification",
        algorithm_name="Classification Heuristique de Rôles",
        category="classification",
        execution_time_ms=0.0,
        parameters_used={"threshold_p75": round(p75, 6)},
        summary=role_counts,
        node_metrics=metrics,
    )


# 14. Threshold Subgraph Expansion
def run_threshold_expand(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    min_conf = float(params.get("min_confidence", 0.7))
    depth = int(params.get("depth", 2))
    max_nodes = int(params.get("max_nodes", 100))

    filtered_nodes = [
        n for n in nodes if (n.get("confidence") is None or float(n["confidence"]) >= min_conf)
    ][:max_nodes]
    filtered_ids = {str(n["id"]) for n in filtered_nodes}

    filtered_edges = [
        e
        for e in edges
        if str(e["source_id"]) in filtered_ids and str(e["target_id"]) in filtered_ids
    ]

    return SnaResultResponse(
        algorithm_key="threshold_expand",
        algorithm_name="Expansion par Seuil de Confiance",
        category="filtering",
        execution_time_ms=0.0,
        parameters_used={"min_confidence": min_conf, "depth": depth, "max_nodes": max_nodes},
        summary={"retained_nodes": len(filtered_nodes), "retained_edges": len(filtered_edges)},
        subgraph_nodes=[uuid.UUID(str(n["id"])) for n in filtered_nodes],
        subgraph_edges=[uuid.UUID(str(e["id"])) for e in filtered_edges],
    )


# 15. Temporal Subgraph Window
def run_temporal_subgraph(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    start_dt_str = params.get("start_date")
    end_dt_str = params.get("end_date")

    start_dt = datetime.fromisoformat(start_dt_str) if start_dt_str else None
    end_dt = datetime.fromisoformat(end_dt_str) if end_dt_str else None

    def match_time(item: dict[str, Any]) -> bool:
        ts = item.get("created_at") or item.get("updated_at")
        if not ts:
            return True
        if isinstance(ts, str):
            dt = datetime.fromisoformat(ts.replace("Z", "+00:00"))
        else:
            dt = ts
        if start_dt and dt < start_dt:
            return False
        if end_dt and dt > end_dt:
            return False
        return True

    matched_nodes = [n for n in nodes if match_time(n)]
    matched_ids = {str(n["id"]) for n in matched_nodes}
    matched_edges = [
        e
        for e in edges
        if str(e["source_id"]) in matched_ids
        and str(e["target_id"]) in matched_ids
        and match_time(e)
    ]

    return SnaResultResponse(
        algorithm_key="temporal_subgraph",
        algorithm_name="Filtrage & Évolution Temporelle",
        category="filtering",
        execution_time_ms=0.0,
        parameters_used={"start_date": start_dt_str, "end_date": end_dt_str},
        summary={"retained_nodes": len(matched_nodes), "retained_edges": len(matched_edges)},
        subgraph_nodes=[uuid.UUID(str(n["id"])) for n in matched_nodes],
        subgraph_edges=[uuid.UUID(str(e["id"])) for e in matched_edges],
    )


# 16. Spatial Activity Sector Clustering (Haversine Distance)
def run_activity_sector(
    nodes: list[dict[str, Any]],
    edges: list[dict[str, Any]],
    params: dict[str, Any],
) -> SnaResultResponse:
    max_distance_km = float(params.get("max_distance_km", 15.0))

    gps_nodes: list[dict[str, Any]] = []
    skipped_count = 0

    for n in nodes:
        lat = n.get("latitude")
        lon = n.get("longitude")
        if lat is not None and lon is not None:
            gps_nodes.append(n)
        else:
            skipped_count += 1

    # Haversine distance formula
    def haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0  # Earth radius km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return r * c

    # Build spatial graph
    S = nx.Graph()
    for n in gps_nodes:
        S.add_node(str(n["id"]))

    for i in range(len(gps_nodes)):
        for j in range(i + 1, len(gps_nodes)):
            n1 = gps_nodes[i]
            n2 = gps_nodes[j]
            dist = haversine(n1["latitude"], n1["longitude"], n2["latitude"], n2["longitude"])
            if dist <= max_distance_km:
                S.add_edge(str(n1["id"]), str(n2["id"]), distance_km=round(dist, 2))

    clusters = list(nx.connected_components(S))
    sorted_clusters = sorted(clusters, key=lambda c: (-len(c), sorted(c)[0]))

    metrics: list[SnaNodeMetric] = []
    node_lookup = {str(n["id"]): n for n in gps_nodes}

    for sector_idx, cl in enumerate(sorted_clusters, start=1):
        for nid in sorted(cl):
            node = node_lookup[nid]
            metrics.append(
                SnaNodeMetric(
                    node_id=uuid.UUID(nid),
                    node_label=node["label"],
                    node_type=node["type"],
                    layer=node["layer"],
                    value={
                        "sector_id": f"Secteur-{sector_idx}",
                        "latitude": node["latitude"],
                        "longitude": node["longitude"],
                    },
                )
            )

    return SnaResultResponse(
        algorithm_key="activity_sector",
        algorithm_name="Secteurs d'Activité Spatiale",
        category="spatial",
        execution_time_ms=0.0,
        parameters_used={"max_distance_km": max_distance_km},
        summary={"total_sectors": len(sorted_clusters), "gps_nodes_count": len(gps_nodes)},
        node_metrics=metrics,
        skipped_nodes_count=skipped_count,
    )


# Master algorithm dispatcher
ALGORITHM_DISPATCHER = {
    "betweenness": run_betweenness,
    "pagerank": run_pagerank,
    "personalized_pagerank": run_personalized_pagerank,
    "degree_centrality": run_degree_centrality,
    "closeness_eigenvector": run_closeness_eigenvector,
    "louvain": run_louvain,
    "label_propagation": run_label_propagation,
    "k_core": run_k_core,
    "articulation_points": run_articulation_points,
    "shortest_path_dijkstra": run_shortest_path_dijkstra,
    "jaccard": run_jaccard,
    "adamic_adar": run_adamic_adar,
    "node_classification": run_node_classification,
    "threshold_expand": run_threshold_expand,
    "temporal_subgraph": run_temporal_subgraph,
    "activity_sector": run_activity_sector,
}
