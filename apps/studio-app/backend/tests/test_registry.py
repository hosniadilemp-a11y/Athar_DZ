"""Unit tests for the Athar Ontological Registry (Milestone 1B).

Asserts exact counts (37 node types, 47 relations, 5 layers, 8 GPS nodes)
and validates edge relationship schemas and constraints.
"""

import json
from pathlib import Path

import pytest

from app.domain.registry import (
    LAYERS,
    NODE_TYPES,
    RELATION_TYPES,
    LayerId,
    export_registry_dict,
    export_registry_json,
    get_node_type,
    get_relation_type,
    validate_relation,
)


def test_layers_exact_count_and_properties() -> None:
    """There must be exactly 5 layers with defined colors and border styles."""
    assert len(LAYERS) == 5
    expected_keys = {
        LayerId.VERIFIED,
        LayerId.OSINT_RAW,
        LayerId.INFRA,
        LayerId.HYPOTHESIS,
        LayerId.FLOWS,
    }
    assert set(LAYERS.keys()) == expected_keys
    for layer in LAYERS.values():
        assert layer.color.startswith("#")
        assert layer.border_style in {"solid", "dashed"}
        assert len(layer.label_fr) > 0
        assert len(layer.label_ar) > 0
        assert len(layer.label_en) > 0


def test_node_types_exact_count_and_distribution() -> None:
    """Must have exactly 37 node types partitioned as 11, 8, 8, 4, 6."""
    assert len(NODE_TYPES) == 37

    # Count by layer
    counts = {layer: 0 for layer in LayerId}
    for node in NODE_TYPES.values():
        counts[node.layer] += 1

    assert counts[LayerId.VERIFIED] == 11
    assert counts[LayerId.OSINT_RAW] == 8
    assert counts[LayerId.INFRA] == 8
    assert counts[LayerId.HYPOTHESIS] == 4
    assert counts[LayerId.FLOWS] == 6


def test_gps_enabled_node_types_exact_8() -> None:
    """Exactly 8 node types must carry GPS capabilities."""
    gps_nodes = {k for k, v in NODE_TYPES.items() if v.has_gps}
    expected_gps_nodes = {
        "commune",
        "unite",
        "image_preuve",
        "antenne_bts",
        "personne",
        "vehicule",
        "telecom_cdr",
        "guichet_gab",
    }
    assert gps_nodes == expected_gps_nodes
    assert len(gps_nodes) == 8


def test_relation_types_exact_47() -> None:
    """Must have exactly 47 defined canonical relations."""
    assert len(RELATION_TYPES) == 47


def test_all_relations_reference_valid_node_types() -> None:
    """Every relation's allowed_sources and allowed_targets must exist in NODE_TYPES."""
    for name, rel in RELATION_TYPES.items():
        assert len(rel.allowed_sources) > 0, f"Relation {name} has no allowed sources"
        assert len(rel.allowed_targets) > 0, f"Relation {name} has no allowed targets"
        for src in rel.allowed_sources:
            assert src in NODE_TYPES, f"Relation {name} references unknown source: {src}"
        for tgt in rel.allowed_targets:
            assert tgt in NODE_TYPES, f"Relation {name} references unknown target: {tgt}"


def test_relation_validation_logic() -> None:
    """validate_relation should accept valid edges and reject invalid ones."""
    # 1. Valid: personne -> COMMUNIQUE_AVEC -> personne
    valid, msg = validate_relation("personne", "COMMUNIQUE_AVEC", "personne")
    assert valid is True
    assert msg == "Valid"

    # 2. Valid: commune -> APPARTIENT_A_DAIRA -> daira
    valid, msg = validate_relation("commune", "APPARTIENT_A_DAIRA", "daira")
    assert valid is True

    # 3. Invalid source: affaire cannot be source of APPARTIENT_A_DAIRA
    valid, msg = validate_relation("affaire", "APPARTIENT_A_DAIRA", "daira")
    assert valid is False
    assert "not permitted" in msg

    # 4. Invalid target: commune cannot APPARTIENT_A_DAIRA to wilaya directly
    valid, msg = validate_relation("commune", "APPARTIENT_A_DAIRA", "wilaya")
    assert valid is False
    assert "not permitted" in msg

    # 5. Unknown relation
    valid, msg = validate_relation("personne", "NON_EXISTENT_REL", "personne")
    assert valid is False
    assert "Invalid relation type" in msg

    # 6. Unknown node
    valid, msg = validate_relation("alien_entity", "COMMUNIQUE_AVEC", "personne")
    assert valid is False
    assert "Invalid source node type" in msg


def test_lookup_helpers() -> None:
    """Lookup helpers raise KeyError on unknown keys and return definitions on valid."""
    node = get_node_type("personne")
    assert node.cypher_label == "Personne"

    with pytest.raises(KeyError):
        get_node_type("unknown_key")

    rel = get_relation_type("COMMUNIQUE_AVEC")
    assert rel.cardinality == "N:M"

    with pytest.raises(KeyError):
        get_relation_type("UNKNOWN_REL")


def test_export_registry(tmp_path: Path) -> None:
    """Export functions must generate valid JSON matching counts."""
    data = export_registry_dict()
    assert data["metadata"]["total_node_types"] == 37
    assert data["metadata"]["total_relation_types"] == 47
    assert data["metadata"]["gps_enabled_count"] == 8

    out_file = tmp_path / "registry.json"
    json_str = export_registry_json(out_file)
    parsed = json.loads(json_str)
    assert parsed["metadata"]["app_name"] == "Athar"
    assert out_file.exists()
