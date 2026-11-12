#!/usr/bin/env python3
"""
Wrapper script to build and update doc/data-model.html with:
1. Complete 37-Node Master Ontological Graph (interactive vector SVG with 8 domains)
2. Polyglot Persistence Architecture Matrix (Neo4j, PostgreSQL/TimescaleDB, Qdrant, MinIO WORM, MongoDB, Redis)
3. Exhaustive 37-Node Entities Catalog Table (attributes, types, primary keys, DB targets)
4. Comprehensive 47-Relationships Catalog Table (source, relation, target, cardinality, DB engines)
5. Algerian Administrative & Judicial Hierarchy & Derived Criminal Intelligence Attributes
6. Formal GFPG (Graph Forensic Property Graph) Specification & Cypher Query Engine
"""

import sys
import os
import subprocess

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BUILDER_SCRIPT = os.path.join(PROJECT_ROOT, "scripts", "build_full_data_model.py")

if __name__ == "__main__":
    print(f"Executing Master Data Model Builder: {BUILDER_SCRIPT}")
    res = subprocess.run([sys.executable, BUILDER_SCRIPT], cwd=PROJECT_ROOT)
    sys.exit(res.returncode)
