import { describe, it, expect } from 'vitest';
import { computeTabScopedGraph, isImpactCriticalNode } from '../utils/tabScope';
import type { GraphEdge, GraphNode, InvestigationTab } from '../types/graph';
import type { LayerId } from '../types/registry';

function makeNode(
  id: string,
  type = 'personne',
  layer: GraphNode['layer'] = 'VERIFIED',
  properties: Record<string, unknown> = {},
  is_impact?: boolean
): GraphNode {
  return {
    id,
    case_id: 'case-scope',
    type,
    layer,
    label: `Node ${id}`,
    confidence: 0.95,
    provenance: 'TEST',
    properties,
    latitude: null,
    longitude: null,
    is_impact,
  };
}

function makeEdge(id: string, source_id: string, target_id: string): GraphEdge {
  return {
    id,
    case_id: 'case-scope',
    source_id,
    target_id,
    type: 'CONNECTED_TO',
    layer: 'FLOWS',
    confidence: 0.9,
    provenance: 'TEST',
    properties: {},
  };
}

describe('tabScope (Per-Tab Filtering & Decision D9 Impact Rule)', () => {
  it('identifies critical impact nodes matching Decision D9 rule', () => {
    expect(isImpactCriticalNode(makeNode('n1', 'personne', 'HYPOTHESIS'))).toBe(true);
    expect(isImpactCriticalNode(makeNode('n2', 'transaction_financiere', 'FLOWS'))).toBe(true);
    expect(isImpactCriticalNode(makeNode('n3', 'personne', 'VERIFIED', { role: 'leader' }))).toBe(true);
    expect(isImpactCriticalNode(makeNode('n4', 'personne', 'VERIFIED', { implication_level: 'HIGH' }))).toBe(true);
    expect(isImpactCriticalNode(makeNode('n5', 'personne', 'VERIFIED', { loss: 120000 }))).toBe(true);
    expect(isImpactCriticalNode(makeNode('n6', 'telephone', 'OSINT_RAW'))).toBe(false);
    expect(isImpactCriticalNode(makeNode('n7', 'wilaya', 'VERIFIED', { loss: 1000 }))).toBe(false);
  });

  it('scopes master tab and actor_sphere tab independently with layers and Impact filter', () => {
    const amine = makeNode('amine', 'personne', 'HYPOTHESIS', { role: 'operationnel' });
    const aminePhone = makeNode('tel-amine', 'telephone', 'OSINT_RAW');
    const karim = makeNode('karim', 'personne', 'VERIFIED');
    const outsider = makeNode('outsider', 'personne', 'HYPOTHESIS');
    const outsiderPhone = makeNode('tel-out', 'telephone', 'OSINT_RAW');

    const nodes = [amine, aminePhone, karim, outsider, outsiderPhone];
    const edges = [
      makeEdge('e1', 'amine', 'tel-amine'),
      makeEdge('e2', 'tel-amine', 'karim'),
      makeEdge('e3', 'outsider', 'tel-out'),
    ];

    const allLayers = new Set<LayerId>(['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS']);

    const masterTab: InvestigationTab = {
      id: 'master',
      kind: 'master',
      title: 'Dossier Général',
      focalNodeId: null,
      closable: false,
      snapshot: {
        panX: 0,
        panY: 0,
        zoom: 1,
        activeLayout: 'force',
        activeLayers: Array.from(allLayers),
        isPersonOnlyGraph: true,
        isImpactOnly: false,
        selectedNodeId: null,
      },
    };

    const amineTab: InvestigationTab = {
      id: 'tab-actor-amine',
      kind: 'actor_sphere',
      title: 'Suspect : Amine B.',
      focalNodeId: 'amine',
      closable: true,
      snapshot: {
        panX: 0,
        panY: 0,
        zoom: 1,
        activeLayout: 'force',
        activeLayers: Array.from(allLayers),
        isPersonOnlyGraph: false,
        isImpactOnly: false,
        selectedNodeId: 'amine',
      },
    };

    // 1. Master tab full view
    const masterFull = computeTabScopedGraph(nodes, edges, masterTab, allLayers, false);
    expect(masterFull.scopedNodes).toHaveLength(5);
    expect(masterFull.scopedEdges).toHaveLength(3);

    // 2. Master tab Impact view filters out non-impact OSINT/VERIFIED nodes
    const masterImpact = computeTabScopedGraph(nodes, edges, masterTab, allLayers, true);
    expect(masterImpact.scopedNodes.map((n) => n.id).sort()).toEqual(['amine', 'outsider']);
    expect(masterImpact.scopedEdges).toHaveLength(0);

    // 3. Actor sphere tab excludes outsider & tel-out completely
    const amineFull = computeTabScopedGraph(nodes, edges, amineTab, allLayers, false);
    expect(amineFull.baseNodes.map((n) => n.id).sort()).toEqual(['amine', 'karim', 'tel-amine']);
    expect(amineFull.scopedNodes.map((n) => n.id).sort()).toEqual(['amine', 'karim', 'tel-amine']);
    expect(amineFull.scopedEdges.map((e) => e.id).sort()).toEqual(['e1', 'e2']);

    // 4. Actor sphere tab Impact view keeps focal node + critical nodes in sphere
    const amineImpact = computeTabScopedGraph(nodes, edges, amineTab, allLayers, true);
    expect(amineImpact.baseNodes).toHaveLength(3);
    expect(amineImpact.scopedNodes.map((n) => n.id)).toEqual(['amine']);
  });
});
