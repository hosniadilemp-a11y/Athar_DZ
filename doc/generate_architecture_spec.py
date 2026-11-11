#!/usr/bin/env python3
"""
Wrapper generator for Chapter 02: Visual System Architecture
Delegates to scripts/build_full_architecture.py to build the comprehensive, decoupled 6-layer architecture.
"""

import os
import sys

# Add scripts directory to path
repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
scripts_dir = os.path.join(repo_root, "scripts")
if scripts_dir not in sys.path:
    sys.path.insert(0, scripts_dir)

from build_full_architecture import build_architecture_html

if __name__ == "__main__":
    build_architecture_html()
