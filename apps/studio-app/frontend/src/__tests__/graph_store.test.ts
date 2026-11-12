import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from '../store/useGraphStore';
import type { GraphResponse, GraphNode } from '../types/graph';

describe('useGraphStore & Reversible Undo/Redo Engine', () => {
  beforeEach(() => {
    // Reset store state
    useGraphStore.setState({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedNodeIds: [],
      selectedEdgeId: null,
      viewport: { panX: 0, panY: 0, zoom: 1 },
      undoStack: [],
      redoStack: [],
    });
  });

  it('initializes circular layout positions and preserves them across updates', () => {
    const mockResponse: GraphResponse = {
      case_id: 'test-case-id',
      is_impact_view: false,
      total_case_nodes: 2,
      total_case_edges: 0,
      nodes: [
        {
          id: 'n1',
          case_id: 'test-case-id',
          type: 'personne',
          layer: 'VERIFIED',
          label: 'Suspect 1',
          confidence: 1.0,
          provenance: 'SEED',
          properties: {},
          latitude: null,
          longitude: null,
        },
        {
          id: 'n2',
          case_id: 'test-case-id',
          type: 'telephone',
          layer: 'FLOWS',
          label: '+2135550101',
          confidence: 0.9,
          provenance: 'SEED',
          properties: {},
          latitude: null,
          longitude: null,
        },
      ],
      edges: [],
    };

    useGraphStore.getState().setGraphData(mockResponse);
    const { nodes } = useGraphStore.getState();
    expect(nodes).toHaveLength(2);
    expect(nodes[0]?.x).toBeDefined();
    expect(nodes[0]?.y).toBeDefined();

    const originalX = nodes[0]?.x;
    const originalY = nodes[0]?.y;

    // Second call preserves already placed nodes
    useGraphStore.getState().setGraphData(mockResponse);
    const updatedNodes = useGraphStore.getState().nodes;
    expect(updatedNodes[0]?.x).toBe(originalX);
    expect(updatedNodes[0]?.y).toBe(originalY);
  });

  it('executes reversible node position movement with undo and redo', () => {
    const node: GraphNode = {
      id: 'node-move-1',
      case_id: 'case-1',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Target',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
      x: 100,
      y: 100,
    };

    useGraphStore.setState({ nodes: [node] });

    // Move node to (250, 300) with history
    useGraphStore.getState().updateNodePosition('node-move-1', 250, 300, true);
    expect(useGraphStore.getState().nodes[0]?.x).toBe(250);
    expect(useGraphStore.getState().nodes[0]?.y).toBe(300);
    expect(useGraphStore.getState().undoStack).toHaveLength(1);

    // Undo -> revert to (100, 100)
    useGraphStore.getState().undo();
    expect(useGraphStore.getState().nodes[0]?.x).toBe(100);
    expect(useGraphStore.getState().nodes[0]?.y).toBe(100);
    expect(useGraphStore.getState().redoStack).toHaveLength(1);

    // Redo -> back to (250, 300)
    useGraphStore.getState().redo();
    expect(useGraphStore.getState().nodes[0]?.x).toBe(250);
    expect(useGraphStore.getState().nodes[0]?.y).toBe(300);
  });

  it('merges expanded nodes without duplicating existing ones', () => {
    const existingNode: GraphNode = {
      id: 'existing-1',
      case_id: 'case-1',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Existing Node',
      confidence: 1.0,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
      x: 500,
      y: 400,
    };

    useGraphStore.setState({ nodes: [existingNode], edges: [] });

    const newNeighbor: GraphNode = {
      id: 'neighbor-1',
      case_id: 'case-1',
      type: 'telephone',
      layer: 'INFRA',
      label: 'Phone Neighbor',
      confidence: 0.8,
      provenance: 'EXPAND',
      properties: {},
      latitude: null,
      longitude: null,
    };

    // Expand merge call
    useGraphStore.getState().mergeExpandedNodes([existingNode, newNeighbor], []);
    const { nodes } = useGraphStore.getState();

    expect(nodes).toHaveLength(2);
    expect(nodes.map((n) => n.id)).toEqual(['existing-1', 'neighbor-1']);
    // Existing node position remained untouched
    expect(nodes[0]?.x).toBe(500);
    expect(nodes[0]?.y).toBe(400);
    // New neighbor received a position
    expect(nodes[1]?.x).toBeDefined();
    expect(nodes[1]?.y).toBeDefined();
  });

  it('handles multi-selection and viewport panning correctly', () => {
    useGraphStore.getState().selectNode('node-a', false);
    expect(useGraphStore.getState().selectedNodeIds).toEqual(['node-a']);

    useGraphStore.getState().selectNode('node-b', true);
    expect(useGraphStore.getState().selectedNodeIds).toEqual(['node-a', 'node-b']);

    useGraphStore.getState().panBy(50, -20);
    expect(useGraphStore.getState().viewport.panX).toBe(50);
    expect(useGraphStore.getState().viewport.panY).toBe(-20);

    useGraphStore.getState().zoomBy(1.5);
    expect(useGraphStore.getState().viewport.zoom).toBe(1.5);
  });
});
