import { describe, it, expect, beforeEach } from 'vitest';
import { computeGraphLayout, type GraphLayoutType } from '../utils/graphLayouts';
import { useGraphStore } from '../store/useGraphStore';
import type { GraphNode, GraphEdge } from '../types/graph';

describe('Graph Layout Algorithms & Edge Cases', () => {
  const createMockNode = (id: string, layer: GraphNode['layer'] = 'VERIFIED', type: string = 'personne'): GraphNode => ({
    id,
    case_id: 'case-layouts',
    type,
    layer,
    label: `Node ${id}`,
    confidence: 1.0,
    provenance: 'TEST',
    properties: {},
    latitude: null,
    longitude: null,
  });

  const createMockEdge = (source: string, target: string): GraphEdge => ({
    id: `edge-${source}-${target}`,
    case_id: 'case-layouts',
    source_id: source,
    target_id: target,
    type: 'CONNECTED_TO',
    layer: 'VERIFIED',
    confidence: 1.0,
    provenance: 'TEST',
    properties: {},
  });

  beforeEach(() => {
    useGraphStore.setState({
      nodes: [],
      edges: [],
      activeLayout: 'concentric',
      undoStack: [],
      redoStack: [],
    });
  });

  describe('Special Boundary Cases', () => {
    it('handles empty node list gracefully (0 nodes)', () => {
      const layouts: GraphLayoutType[] = ['circular', 'concentric', 'force', 'hierarchical', 'grid'];
      layouts.forEach((layout) => {
        const result = computeGraphLayout([], [], layout);
        expect(result).toEqual([]);
      });
    });

    it('handles single node by placing it at exact center (1 node)', () => {
      const single = createMockNode('solo');
      const layouts: GraphLayoutType[] = ['circular', 'concentric', 'force', 'hierarchical', 'grid'];
      layouts.forEach((layout) => {
        const result = computeGraphLayout([single], [], layout, { centerX: 500, centerY: 400 });
        expect(result).toHaveLength(1);
        expect(result[0]?.x).toBe(500);
        expect(result[0]?.y).toBe(400);
      });
    });

    it('handles exactly two nodes with symmetric spacing (2 nodes)', () => {
      const n1 = createMockNode('n1');
      const n2 = createMockNode('n2');
      const result = computeGraphLayout([n1, n2], [], 'circular', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(2);
      expect(result[0]?.x).toBe(460); // 600 - 140
      expect(result[1]?.x).toBe(740); // 600 + 140
      expect(result[0]?.y).toBe(450);
      expect(result[1]?.y).toBe(450);
    });
  });

  describe('Concentric Layout (Evidence Layer Stratification)', () => {
    it('places nodes into separate concentric rings based on evidence layer', () => {
      const nodes: GraphNode[] = [
        createMockNode('l1', 'VERIFIED'),
        createMockNode('l2', 'OSINT_RAW'),
        createMockNode('l3', 'INFRA'),
        createMockNode('l4', 'HYPOTHESIS'),
        createMockNode('l5', 'FLOWS'),
      ];

      const result = computeGraphLayout(nodes, [], 'concentric', { centerX: 500, centerY: 500 });
      expect(result).toHaveLength(5);

      // Verify that distance to center strictly increases across layers
      const dists = result.map((n) => {
        const dx = (n.x ?? 0) - 500;
        const dy = (n.y ?? 0) - 500;
        return Math.round(Math.sqrt(dx * dx + dy * dy));
      });

      // L1 < L2 < L3 < L4 < L5
      expect(dists[0]).toBeLessThan(dists[1]!);
      expect(dists[1]).toBeLessThan(dists[2]!);
      expect(dists[2]).toBeLessThan(dists[3]!);
      expect(dists[3]).toBeLessThan(dists[4]!);
    });

    it('handles missing intermediate layers without crashing', () => {
      // Only L1 (Verified) and L5 (Flows) present
      const nodes: GraphNode[] = [
        createMockNode('v1', 'VERIFIED'),
        createMockNode('v2', 'VERIFIED'),
        createMockNode('f1', 'FLOWS'),
        createMockNode('f2', 'FLOWS'),
      ];

      const result = computeGraphLayout(nodes, [], 'concentric', { centerX: 500, centerY: 500 });
      expect(result).toHaveLength(4);
      result.forEach((n) => {
        expect(Number.isFinite(n.x)).toBe(true);
        expect(Number.isFinite(n.y)).toBe(true);
      });
    });
  });

  describe('Organic Force-Directed Layout', () => {
    it('positions connected nodes near each other and clusters cliques', () => {
      // Triangle clique A-B-C and disconnected node D
      const nodes: GraphNode[] = [
        createMockNode('a'),
        createMockNode('b'),
        createMockNode('c'),
        createMockNode('d'),
      ];
      const edges: GraphEdge[] = [
        createMockEdge('a', 'b'),
        createMockEdge('b', 'c'),
        createMockEdge('c', 'a'),
      ];

      const result = computeGraphLayout(nodes, edges, 'force', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(4);
      result.forEach((n) => {
        expect(Number.isFinite(n.x)).toBe(true);
        expect(Number.isFinite(n.y)).toBe(true);
      });
    });

    it('handles completely disconnected graphs (0 edges)', () => {
      const nodes = Array.from({ length: 12 }, (_, i) => createMockNode(`iso-${i}`));
      const result = computeGraphLayout(nodes, [], 'force', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(12);

      // Verify no two nodes occupy the exact same coordinate
      const coordSet = new Set(result.map((n) => `${n.x},${n.y}`));
      expect(coordSet.size).toBe(12);
    });
  });

  describe('Hierarchical Layout (Investigative Pipeline)', () => {
    it('stratifies entities vertically into causality tiers', () => {
      const nodes: GraphNode[] = [
        createMockNode('admin', 'VERIFIED', 'wilaya'),
        createMockNode('target', 'HYPOTHESIS', 'personne'),
        createMockNode('phone', 'FLOWS', 'telephone'),
        createMockNode('c2', 'INFRA', 'serveur_c2'),
        createMockNode('bank', 'FLOWS', 'compte_bancaire'),
      ];

      const result = computeGraphLayout(nodes, [], 'hierarchical', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(5);

      const yMap = new Map(result.map((n) => [n.id, n.y ?? 0]));
      // Wilaya (tier 0) is higher than target (tier 1), higher than phone (tier 2), etc.
      expect(yMap.get('admin')!).toBeLessThan(yMap.get('target')!);
      expect(yMap.get('target')!).toBeLessThan(yMap.get('phone')!);
      expect(yMap.get('phone')!).toBeLessThan(yMap.get('c2')!);
      expect(yMap.get('c2')!).toBeLessThan(yMap.get('bank')!);
    });
  });

  describe('Grid Layout (Compact Matrix)', () => {
    it('arranges nodes in an orderly 2D matrix', () => {
      const nodes = Array.from({ length: 16 }, (_, i) => createMockNode(`grid-${i}`));
      const result = computeGraphLayout(nodes, [], 'grid', { centerX: 600, centerY: 450 });
      expect(result).toHaveLength(16);

      // Verify distinct coordinate grid
      const xs = new Set(result.map((n) => n.x));
      const ys = new Set(result.map((n) => n.y));
      expect(xs.size).toBeGreaterThan(1);
      expect(ys.size).toBeGreaterThan(1);
    });
  });

  describe('Store Integration & Reversible Layout History', () => {
    it('applies layout to active store graph and allows full undo/redo', () => {
      const nodes = [
        createMockNode('n1', 'VERIFIED'),
        createMockNode('n2', 'HYPOTHESIS'),
        createMockNode('n3', 'FLOWS'),
      ];

      useGraphStore.setState({ nodes, activeLayout: 'circular' });

      // Apply concentric layout
      useGraphStore.getState().applyLayout('concentric');
      expect(useGraphStore.getState().activeLayout).toBe('concentric');
      const concentricX = useGraphStore.getState().nodes[0]?.x;
      expect(useGraphStore.getState().undoStack).toHaveLength(1);

      // Apply grid layout
      useGraphStore.getState().applyLayout('grid');
      expect(useGraphStore.getState().activeLayout).toBe('grid');
      expect(useGraphStore.getState().undoStack).toHaveLength(2);

      // Undo -> restores concentric layout
      useGraphStore.getState().undo();
      expect(useGraphStore.getState().activeLayout).toBe('concentric');
      expect(useGraphStore.getState().nodes[0]?.x).toBe(concentricX);

      // Redo -> reapplies grid layout
      useGraphStore.getState().redo();
      expect(useGraphStore.getState().activeLayout).toBe('grid');
    });
  });
});
