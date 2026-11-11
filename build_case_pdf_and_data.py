#!/usr/bin/env python3
"""
Script to generate:
1. Rapport_Investigation_ATHAR-2026-SCAM-089.pdf (Official Judicial Police Synthesis Report)
2. doc/assets/mock-case-candy-wheels.json (Full machine-readable mock case dataset)
3. doc/assets/mock-case-candy-wheels.js (Client-side JS module for Athar DZ mock)
4. Integration into doc/maquette.html and doc/assets/maquette-i18n.js
"""

import os
import json
import subprocess

REPORT_HTML_PATH = "Rapport/rapport_investigation_ATHAR-2026-SCAM-089.html"
REPORT_PDF_PATH = "Rapport/Rapport_Investigation_ATHAR-2026-SCAM-089.pdf"
DOC_ASSETS_PDF = "doc/assets/Rapport_Investigation_ATHAR-2026-SCAM-089.pdf"
MOCK_JSON_PATH = "doc/assets/mock-case-candy-wheels.json"
MOCK_JS_PATH = "doc/assets/mock-case-candy-wheels.js"

print("Generating Case Assets & PDF Report...")
