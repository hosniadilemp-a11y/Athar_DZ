import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect, beforeEach } from 'vitest';
import { WorkspaceTabsBar } from '../components/canvas/WorkspaceTabsBar';
import { Toolbar } from '../components/canvas/Toolbar';
import { CanvasFloatingPalette } from '../components/canvas/CanvasFloatingPalette';
import { CanvasMinimap } from '../components/canvas/CanvasMinimap';
import { I18nProvider } from '../context/I18nContext';
import { useGraphStore } from '../store/useGraphStore';
import { translatePhrase } from '../i18n/phrases';
import type { GraphEdge, GraphNode } from '../types/graph';

function makeNode(id: string, label: string, type = 'personne'): GraphNode {
  return {
    id,
    case_id: 'case-ui-tabs',
    type,
    layer: 'HYPOTHESIS',
    label,
    confidence: 0.9,
    provenance: 'TEST',
    properties: {},
    latitude: null,
    longitude: null,
  };
}

function makeEdge(id: string, source_id: string, target_id: string): GraphEdge {
  return {
    id,
    case_id: 'case-ui-tabs',
    source_id,
    target_id,
    type: 'CONNECTED_TO',
    layer: 'FLOWS',
    confidence: 0.9,
    provenance: 'TEST',
    properties: {},
  };
}

describe('WorkspaceTabsBar (Option A UI & Accessibility)', () => {
  beforeEach(() => {
    const amine = makeNode('amine-1', 'Amine B. « Amine Import »', 'personne');
    const phone = makeNode('tel-1', '+213 555 019 283', 'telephone');
    const karim = makeNode('karim-1', 'Karim Zerrouki', 'personne');

    useGraphStore.setState({
      loadedTabsCaseId: null,
      tabs: [],
      activeTabId: 'master',
      nodes: [],
      edges: [],
    });

    useGraphStore.getState().setGraphData({
      case_id: 'case-ui-tabs',
      is_impact_view: false,
      total_case_nodes: 3,
      total_case_edges: 2,
      nodes: [amine, phone, karim],
      edges: [
        makeEdge('e1', 'amine-1', 'tel-1'),
        makeEdge('e2', 'tel-1', 'karim-1'),
      ],
    });
  });

  it('renders accessible tablist with master and default Amine B. sphere tab', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(WorkspaceTabsBar, {
          onTriggerPhaseNotice: () => {},
        })
      )
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tab"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain('Dossier Général');
    expect(html).toContain('Suspect : Amine B.');
    expect(html).toContain('>3</span>');
    // No "+" add button next to tabs
    expect(html).not.toContain('workspace-tab-add-btn');
    // Master is active -> Phase 3 Process & Pool hook hidden until actor tab is selected
    expect(html).not.toContain('aria-disabled="true"');
  });

  it('renders overflow tab switcher button when more than 2 tabs are open', () => {
    useGraphStore.getState().openActorTab('karim-1');
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(WorkspaceTabsBar, {
          onTriggerPhaseNotice: () => {},
        })
      )
    );
    expect(html).toContain('workspace-tabs-overflow-btn');
    expect(html).toContain('>3</span>');
  });

  it('renders Phase 3 D10 hook with aria-disabled="true" when an actor tab is active', () => {
    const actorTab = useGraphStore.getState().tabs.find((t) => t.kind === 'actor_sphere');
    expect(actorTab).toBeDefined();
    if (!actorTab) return;
    useGraphStore.getState().switchTab(actorTab.id);

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(WorkspaceTabsBar, {
          onTriggerPhaseNotice: () => {},
        })
      )
    );

    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('Phase 3');
    expect(html).toContain('Processus &amp; Bassin');
  });

  it('translates all Option A phrases across FR, AR, and EN', () => {
    const keys = [
      'Dossier Général',
      'Sphère ({n})',
      "Ouvrir dans un nouvel onglet d'investigation",
      'Frontière',
      'Processus & Bassin',
    ];
    for (const k of keys) {
      const fr = translatePhrase(k, 'fr', { n: 5 });
      const ar = translatePhrase(k, 'ar', { n: 5 });
      const en = translatePhrase(k, 'en', { n: 5 });
      expect(fr.length).toBeGreaterThan(0);
      expect(ar.length).toBeGreaterThan(0);
      expect(en.length).toBeGreaterThan(0);
      expect(ar).not.toBe(fr);
      expect(en).not.toBe(fr);
    }
  });

  it('places View Header Toolbar, Graph Subbar, then WorkspaceTabsBar at bottom of top menus above view', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          React.Fragment,
          null,
          React.createElement(Toolbar, {
            section: 'header',
            activeView: 'graph',
            onChangeView: () => {},
            onToggleImpactView: () => {},
          }),
          React.createElement(Toolbar, {
            section: 'graph_subbar',
            activeView: 'graph',
            onChangeView: () => {},
            onToggleImpactView: () => {},
          }),
          React.createElement(WorkspaceTabsBar, {
            onTriggerPhaseNotice: () => {},
          }),
          React.createElement('div', { className: 'view-placeholder' })
        )
      )
    );

    const headerIdx = html.indexOf('class="canvas-sub-header"');
    const subbarIdx = html.indexOf('class="graph-sub-toolbar"');
    const tabsIdx = html.indexOf('class="workspace-tabs-bar"');
    const viewIdx = html.indexOf('class="view-placeholder"');

    expect(headerIdx).toBeGreaterThan(-1);
    expect(subbarIdx).toBeGreaterThan(headerIdx);
    expect(tabsIdx).toBeGreaterThan(subbarIdx);
    expect(viewIdx).toBeGreaterThan(tabsIdx);
    expect(html).toContain('Vue Impact : 3 / 3 nœuds');
    expect(html).not.toContain('workspace-tab-add-btn');
  });

  it('removes redundant Layout, Impact, and LabelDensity buttons from CanvasFloatingPalette', () => {
    const paletteHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(CanvasFloatingPalette, {
          onToggleSna: () => {},
          isSnaOpen: false,
        })
      )
    );

    expect(paletteHtml).toContain('SNA');
    expect(paletteHtml).not.toContain('palette-layout-dropdown');
    expect(paletteHtml).not.toContain('Choisir la disposition du graphe');
    expect(paletteHtml).not.toContain('Densité des libellés');
    expect(paletteHtml).not.toContain('Vue Impact');
    expect(paletteHtml).toContain('palette-scale-trigger');
    expect(paletteHtml).toContain('100%');

    const minimapHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(CanvasMinimap, {
          nodes: [makeNode('n1', 'Alice', 'personne')],
          viewport: { panX: 0, panY: 0, zoom: 1 },
          onViewportChange: () => {},
        })
      )
    );

    expect(minimapHtml).toContain('Entités');
    expect(minimapHtml).toContain('Calques');
  });
});
