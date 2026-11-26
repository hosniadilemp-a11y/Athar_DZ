import { describe, it, expect } from 'vitest';
import { computeActorSphere } from '../utils/actorSphere';
import type { GraphEdge, GraphNode } from '../types/graph';

function makeNode(id: string, type = 'personne', layer: GraphNode['layer'] = 'HYPOTHESIS'): GraphNode {
  return {
    id,
    case_id: 'case-sphere',
    type,
    layer,
    label: `Node ${id}`,
    confidence: 0.9,
    provenance: 'TEST',
    properties: {},
    latitude: null,
    longitude: null,
  };
}

function makeEdge(id: string, source_id: string, target_id: string, type = 'CONNECTED_TO'): GraphEdge {
  return {
    id,
    case_id: 'case-sphere',
    source_id,
    target_id,
    type,
    layer: 'FLOWS',
    confidence: 0.9,
    provenance: 'TEST',
    properties: {},
  };
}

describe('computeActorSphere (Directional Asymmetric Traversal)', () => {
  it('enforces strict 1-hop incoming traversal without pulling upstream ancestors', () => {
    const nodes = [
      makeNode('u2', 'personne'),
      makeNode('u1', 'personne'),
      makeNode('focal', 'personne'),
    ];
    const edges = [
      makeEdge('e-u2-u1', 'u2', 'u1', 'COMMUNIQUE_AVEC'),
      makeEdge('e-u1-focal', 'u1', 'focal', 'PAYE'),
    ];

    const res = computeActorSphere(nodes, edges, 'focal');

    expect(Array.from(res.nodeIds).sort()).toEqual(['focal', 'u1']);
    expect(Array.from(res.edgeIds)).toEqual(['e-u1-focal']);
    expect(Array.from(res.incomingNeighborIds)).toEqual(['u1']);
    expect(res.nodeIds.has('u2')).toBe(false);
    expect(res.edgeIds.has('e-u2-u1')).toBe(false);
  });

  it('traverses multi-hop outgoing mediating entities down to terminal leaves', () => {
    const nodes = [
      makeNode('focal', 'personne'),
      makeNode('tel', 'telephone', 'OSINT_RAW'),
      makeNode('sim', 'carte_sim', 'INFRA'),
      makeNode('voice', 'enregistrement_vocal', 'VERIFIED'),
    ];
    const edges = [
      makeEdge('e1', 'focal', 'tel', 'POSSEDE_TELEPHONE'),
      makeEdge('e2', 'tel', 'sim', 'UTILISE_SIM'),
      makeEdge('e3', 'sim', 'voice', 'TRANSMET_AUDIO'),
    ];

    const res = computeActorSphere(nodes, edges, 'focal');

    expect(Array.from(res.nodeIds).sort()).toEqual(['focal', 'sim', 'tel', 'voice']);
    expect(Array.from(res.edgeIds).sort()).toEqual(['e1', 'e2', 'e3']);
    expect(res.boundaryActorIds.size).toBe(0);
  });

  it('stops strictly at third-party boundary actors (personne & entreprise) and preserves arriving edges', () => {
    const nodes = [
      makeNode('focal', 'personne'),
      makeNode('acct', 'compte_bancaire', 'FLOWS'),
      makeNode('tx', 'transaction_financiere', 'FLOWS'),
      makeNode('p2', 'personne'),
      makeNode('p2_phone', 'telephone', 'OSINT_RAW'),
      makeNode('co', 'entreprise'),
      makeNode('co_acct', 'compte_bancaire', 'FLOWS'),
    ];
    const edges = [
      makeEdge('e1', 'focal', 'acct'),
      makeEdge('e2', 'acct', 'tx'),
      makeEdge('e3', 'tx', 'p2'),
      makeEdge('e4', 'p2', 'p2_phone'),
      makeEdge('e5', 'focal', 'co'),
      makeEdge('e6', 'co', 'co_acct'),
    ];

    const res = computeActorSphere(nodes, edges, 'focal');

    expect(res.nodeIds.has('p2')).toBe(true);
    expect(res.nodeIds.has('co')).toBe(true);
    expect(res.edgeIds.has('e3')).toBe(true);
    expect(res.edgeIds.has('e5')).toBe(true);
    expect(Array.from(res.boundaryActorIds).sort()).toEqual(['co', 'p2']);

    // Downstream relations of boundary actors must NOT be pulled in
    expect(res.nodeIds.has('p2_phone')).toBe(false);
    expect(res.nodeIds.has('co_acct')).toBe(false);
    expect(res.edgeIds.has('e4')).toBe(false);
    expect(res.edgeIds.has('e6')).toBe(false);
  });

  it('marks non-actor shared assets linked to another actor as sharedAssetIds', () => {
    const nodes = [
      makeNode('focal', 'personne'),
      makeNode('car', 'vehicule'),
      makeNode('p2', 'personne'),
    ];
    const edges = [
      makeEdge('e1', 'focal', 'car'),
      makeEdge('e2', 'p2', 'car'),
    ];

    const res = computeActorSphere(nodes, edges, 'focal');

    expect(res.nodeIds.has('car')).toBe(true);
    expect(Array.from(res.sharedAssetIds)).toEqual(['car']);
  });

  it('dampens high-degree infrastructure hubs (degree > 20) without expanding collateral nodes', () => {
    const nodes: GraphNode[] = [
      makeNode('focal', 'personne'),
      makeNode('bts', 'antenne_bts', 'INFRA'),
    ];
    const edges: GraphEdge[] = [
      makeEdge('e-focal-bts', 'focal', 'bts'),
    ];

    for (let i = 1; i <= 24; i++) {
      const colId = `col-${i}`;
      nodes.push(makeNode(colId, 'personne'));
      edges.push(makeEdge(`e-bts-${i}`, 'bts', colId));
    }

    const res = computeActorSphere(nodes, edges, 'focal');

    expect(res.nodeIds.has('bts')).toBe(true);
    expect(res.dampenedHubIds.has('bts')).toBe(true);
    expect(res.nodeIds.size).toBe(2); // only focal + bts
    expect(res.nodeIds.has('col-1')).toBe(false);
  });

  it('handles empty graphs, missing focal node, isolated focal node, and cycles safely', () => {
    expect(computeActorSphere([], [], 'missing').nodeIds.size).toBe(0);

    const solo = [makeNode('solo', 'personne')];
    expect(computeActorSphere(solo, [], 'missing').nodeIds.size).toBe(0);
    expect(Array.from(computeActorSphere(solo, [], 'solo').nodeIds)).toEqual(['solo']);

    const cycNodes = [
      makeNode('focal', 'personne'),
      makeNode('tel', 'telephone', 'OSINT_RAW'),
      makeNode('sim', 'carte_sim', 'INFRA'),
    ];
    const cycEdges = [
      makeEdge('c1', 'focal', 'tel'),
      makeEdge('c2', 'tel', 'sim'),
      makeEdge('c3', 'sim', 'tel'),
      makeEdge('c4', 'sim', 'focal'),
    ];
    const cycRes = computeActorSphere(cycNodes, cycEdges, 'focal');
    expect(Array.from(cycRes.nodeIds).sort()).toEqual(['focal', 'sim', 'tel']);
    expect(Array.from(cycRes.edgeIds).sort()).toEqual(['c1', 'c2', 'c3', 'c4']);
  });
});
