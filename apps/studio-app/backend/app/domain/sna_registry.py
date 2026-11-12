"""SNA Algorithms Registry: Single source of truth for the 16 graph algorithms.

Conforms to Section 6 of .agent/phase1-implementation-rules.md.
"""

from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class SnaParamDefinition(BaseModel):
    name: str
    type: str  # "float", "int", "str", "uuid", "bool", "date"
    default: Any
    description_fr: str
    min_val: float | int | None = None
    max_val: float | int | None = None
    required: bool = False


class SnaAlgorithmMetadata(BaseModel):
    key: str
    label_fr: str
    label_en: str = ""
    label_ar: str = ""
    description_fr: str
    complexity: str
    category: str
    params: list[SnaParamDefinition] = Field(default_factory=list)
    accepted_node_types: list[str] = Field(default_factory=list)


SNA_REGISTRY: dict[str, SnaAlgorithmMetadata] = {
    "betweenness": SnaAlgorithmMetadata(
        key="betweenness",
        label_fr="Centralité d'Intermédiarité",
        label_en="Betweenness Centrality",
        label_ar="مركزية الوساطة",
        description_fr="Identifie les passerelles et intermédiaires clés dans les flux.",
        complexity="O(V * E)",
        category="centrality",
        params=[
            SnaParamDefinition(
                name="normalized",
                type="bool",
                default=True,
                description_fr="Normaliser les scores entre 0.0 et 1.0",
            ),
        ],
    ),
    "pagerank": SnaAlgorithmMetadata(
        key="pagerank",
        label_fr="Score PageRank",
        label_en="PageRank Score",
        label_ar="خوارزمية بيج رانك",
        description_fr="Mesure l'autorité et l'influence globale des entités par diffusion.",
        complexity="O(k * (V + E))",
        category="centrality",
        params=[
            SnaParamDefinition(
                name="alpha",
                type="float",
                default=0.85,
                min_val=0.1,
                max_val=0.99,
                description_fr="Facteur d'amortissement (damping factor)",
            ),
            SnaParamDefinition(
                name="max_iter",
                type="int",
                default=100,
                min_val=10,
                max_val=500,
                description_fr="Nombre maximal d'itérations",
            ),
        ],
    ),
    "personalized_pagerank": SnaAlgorithmMetadata(
        key="personalized_pagerank",
        label_fr="PageRank Personnalisé (PPR)",
        label_en="Personalized PageRank",
        label_ar="بيج رانك مخصص",
        description_fr="Calcule l'influence relative centrée sur un nœud pivot d'intérêt.",
        complexity="O(k * (V + E))",
        category="centrality",
        params=[
            SnaParamDefinition(
                name="source_node_id",
                type="uuid",
                default=None,
                required=True,
                description_fr="UUID du nœud source pivot",
            ),
            SnaParamDefinition(
                name="alpha",
                type="float",
                default=0.85,
                min_val=0.1,
                max_val=0.99,
                description_fr="Facteur d'amortissement",
            ),
        ],
    ),
    "degree_centrality": SnaAlgorithmMetadata(
        key="degree_centrality",
        label_fr="Centralité de Degré (Entrant/Sortant/Total)",
        label_en="Degree Centrality",
        label_ar="مركزية الدرجة",
        description_fr="Comptabilise le volume brut des connexions directes par entité.",
        complexity="O(V + E)",
        category="centrality",
    ),
    "closeness_eigenvector": SnaAlgorithmMetadata(
        key="closeness_eigenvector",
        label_fr="Centralités de Proximité & Vecteur Propre",
        label_en="Closeness & Eigenvector Centrality",
        label_ar="مركزية القرب والمتجه الذاتي",
        description_fr="Mesure la rapidité d'accès aux entités et la connectivité aux influents.",
        complexity="O(V * E + iter * V^2)",
        category="centrality",
    ),
    "louvain": SnaAlgorithmMetadata(
        key="louvain",
        label_fr="Détection de Communautés (Louvain)",
        label_en="Louvain Community Detection",
        label_ar="كشف المجتمعات بطريقة لوفان",
        description_fr="Partitionne le réseau en cellules criminelles par modularité.",
        complexity="O(V log V)",
        category="community",
        params=[
            SnaParamDefinition(
                name="resolution",
                type="float",
                default=1.0,
                min_val=0.1,
                max_val=10.0,
                description_fr="Paramètre de granularité des communautés",
            ),
            SnaParamDefinition(
                name="seed",
                type="int",
                default=42,
                description_fr="Graine aléatoire déterministe",
            ),
        ],
    ),
    "label_propagation": SnaAlgorithmMetadata(
        key="label_propagation",
        label_fr="Propagation d'Étiquettes (LPA)",
        label_en="Label Propagation",
        label_ar="انتشار التصنيفات",
        description_fr="Détecte les sous-groupes par consensus local rapide de voisinage.",
        complexity="O(V + E)",
        category="community",
    ),
    "k_core": SnaAlgorithmMetadata(
        key="k_core",
        label_fr="Décomposition K-Core",
        label_en="K-Core Decomposition",
        label_ar="تحليل النواة المتماسكة K-Core",
        description_fr="Identifie le noyau dur opérationnel le plus interconnecté du réseau.",
        complexity="O(V + E)",
        category="topology",
    ),
    "articulation_points": SnaAlgorithmMetadata(
        key="articulation_points",
        label_fr="Points d'Articulation (Goulots d'Étranglement)",
        label_en="Articulation Points (Cut Vertices)",
        label_ar="نقاط التمفصل والمفاصل الحرجة",
        description_fr="Isole les acteurs dont la neutralisation fragmente le réseau.",
        complexity="O(V + E)",
        category="topology",
    ),
    "shortest_path_dijkstra": SnaAlgorithmMetadata(
        key="shortest_path_dijkstra",
        label_fr="Plus Court Chemin (Dijkstra)",
        label_en="Shortest Path Dijkstra",
        label_ar="أقصر مسار ديكسترا",
        description_fr="Détermine la chaîne de transmission la plus directe entre deux entités.",
        complexity="O(E + V log V)",
        category="topology",
        params=[
            SnaParamDefinition(
                name="source_id",
                type="uuid",
                default=None,
                required=True,
                description_fr="UUID de l'entité de départ",
            ),
            SnaParamDefinition(
                name="target_id",
                type="uuid",
                default=None,
                required=True,
                description_fr="UUID de l'entité d'arrivée",
            ),
        ],
    ),
    "jaccard": SnaAlgorithmMetadata(
        key="jaccard",
        label_fr="Prédiction de Liens Jaccard",
        label_en="Jaccard Coefficient Link Prediction",
        label_ar="تنبؤ الروابط بمؤشر جاكارد",
        description_fr="Propose des collaborations probables basées sur le voisinage commun.",
        complexity="O(V * degree^2)",
        category="link_prediction",
        params=[
            SnaParamDefinition(
                name="threshold",
                type="float",
                default=0.4,
                min_val=0.01,
                max_val=1.0,
                description_fr="Seuil minimal de similarité",
            ),
        ],
    ),
    "adamic_adar": SnaAlgorithmMetadata(
        key="adamic_adar",
        label_fr="Prédiction de Liens Adamic-Adar",
        label_en="Adamic-Adar Index Link Prediction",
        label_ar="تنبؤ الروابط بأداميك-آدار",
        description_fr="Suggère des liens cachés pondérés par la rareté des intermédiaires.",
        complexity="O(V * degree^2)",
        category="link_prediction",
        params=[
            SnaParamDefinition(
                name="threshold",
                type="float",
                default=0.5,
                min_val=0.01,
                max_val=10.0,
                description_fr="Seuil minimal de score",
            ),
        ],
    ),
    "node_classification": SnaAlgorithmMetadata(
        key="node_classification",
        label_fr="Classification Heuristique de Rôles",
        label_en="Heuristic Node Role Classification",
        label_ar="تصنيف الأدوار الاستدلالي",
        description_fr="Attribue un rôle analytique hypothétique basé sur la topologie.",
        complexity="O(V + E)",
        category="classification",
    ),
    "threshold_expand": SnaAlgorithmMetadata(
        key="threshold_expand",
        label_fr="Expansion par Seuil de Confiance",
        label_en="Threshold & Confidence Subgraph Expansion",
        label_ar="توسيع الشبكة حسب عتبة الثقة",
        description_fr="Extrait le sous-graphe respectant une borne de confiance minimale.",
        complexity="O(V + E)",
        category="filtering",
        params=[
            SnaParamDefinition(
                name="min_confidence",
                type="float",
                default=0.7,
                min_val=0.0,
                max_val=1.0,
                description_fr="Seuil de confiance minimal (0.0 - 1.0)",
            ),
            SnaParamDefinition(
                name="depth",
                type="int",
                default=2,
                min_val=1,
                max_val=4,
                description_fr="Profondeur maximale de traversée (1-4)",
            ),
            SnaParamDefinition(
                name="max_nodes",
                type="int",
                default=100,
                min_val=10,
                max_val=500,
                description_fr="Plafond strict de nœuds retournés",
            ),
        ],
    ),
    "temporal_subgraph": SnaAlgorithmMetadata(
        key="temporal_subgraph",
        label_fr="Filtrage & Évolution Temporelle",
        label_en="Temporal Subgraph Window",
        label_ar="النافذة الزمنية وتطور الشبكة",
        description_fr="Isole les activités actives dans une plage chronologique en UTC.",
        complexity="O(V + E)",
        category="filtering",
        params=[
            SnaParamDefinition(
                name="start_date",
                type="date",
                default=None,
                description_fr="Date de début ISO 8601 UTC (inclus)",
            ),
            SnaParamDefinition(
                name="end_date",
                type="date",
                default=None,
                description_fr="Date de fin ISO 8601 UTC (inclus)",
            ),
        ],
    ),
    "activity_sector": SnaAlgorithmMetadata(
        key="activity_sector",
        label_fr="Secteurs d'Activité Spatiale (GPS)",
        label_en="Spatial Activity Sectors",
        label_ar="قطاعات النشاط الجغرافي",
        description_fr="Regroupe les entités géolocalisées par clusters spatiaux (WGS84).",
        complexity="O(N_gps^2)",
        category="spatial",
        params=[
            SnaParamDefinition(
                name="max_distance_km",
                type="float",
                default=15.0,
                min_val=0.5,
                max_val=500.0,
                description_fr="Distance maximale de regroupement spatial en kilomètres",
            ),
        ],
    ),
}
