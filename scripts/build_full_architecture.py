#!/usr/bin/env python3
"""
Master Builder for Chapter 02: Six-Layer Visual Architecture & Infrastructure
Assembles the decoupled six-plane architecture with direct persistence to Layer 3,
along with comprehensive, dedicated SVG schemas and technical deep-dives for every layer tab.
"""

import os
import sys

# Ensure current script directory is in python path
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

import arch_common
import arch_panel_global
import arch_panel_layer1
import arch_panel_layer2
import arch_panel_layer3
import arch_panel_layer4
import arch_panel_layer5
import arch_panel_layer6

def build_architecture_html():
    print("Building comprehensive doc/architecture.html...")
    
    html = (
        arch_common.get_html_head()
        + arch_common.get_sidebar()
        + arch_common.get_page_header_and_tabs()
        + arch_panel_global.get_panel_global()
        + arch_panel_layer1.get_panel_layer1()
        + arch_panel_layer2.get_panel_layer2()
        + arch_panel_layer3.get_panel_layer3()
        + arch_panel_layer4.get_panel_layer4()
        + arch_panel_layer5.get_panel_layer5()
        + arch_panel_layer6.get_panel_layer6()
        + arch_common.get_html_footer()
    )
    
    output_path = os.path.join(os.path.dirname(current_dir), "doc", "architecture.html")
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)
        
    print(f"Successfully generated {output_path} ({len(html)} bytes, {html.count('<svg')} SVGs across all tabs)")
    return html

if __name__ == "__main__":
    build_architecture_html()
