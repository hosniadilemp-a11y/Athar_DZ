/**
 * Zustand global store with slices for Graph, Selection, View, Layers, and Reversible History.
 * Adheres strictly to Section 7 of .agent/phase1-implementation-rules.md.
 */

import { create } from './createStore';
import type { GraphNode, GraphEdge, CaseItem, GraphResponse } from '../types/graph';
import type { LayerId } from '../types/registry';
import { computeGraphLayout, type GraphLayoutType } from '../utils/graphLayouts';

export type { GraphLayoutType };

export interface Command {
  id: string;
  description: string;
  undo: () => void;
  redo: () => void;
}

export interface ViewportState {
  panX: number;
  panY: number;
  zoom: number;
}

export interface GraphStoreState {
  // Case & Data slice
  activeCase: CaseItem | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  isImpactView: boolean;
  totalCaseNodes: number;
  totalCaseEdges: number;
  isLoading: boolean;
  error: string | null;

  // Selection slice
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeId: string | null;

  // View slice
  viewport: ViewportState;
  activeLayers: Set<LayerId>;
  isLinkMode: boolean;
  linkSourceNodeId: string | null;
  activeLayout: GraphLayoutType;

  // Context Menu state
  contextMenu: {
    isOpen: boolean;
    x: number;
    y: number;
    targetNodeId: string | null;
  };

  // Layer Change Modal state
  layerChangeModal: {
    isOpen: boolean;
    nodeId: string | null;
    targetLayer: LayerId | null;
  };

  // Reversible History slice
  undoStack: Command[];
  redoStack: Command[];

  // Actions
  setActiveCase: (caseItem: CaseItem | null) => void;
  setGraphData: (res: GraphResponse) => void;
  mergeExpandedNodes: (newNodes: GraphNode[], newEdges: GraphEdge[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Selection actions
  selectNode: (id: string | null, isMulti?: boolean) => void;
  selectAllNodes: () => void;
  deleteNode: (id: string) => void;
  selectEdge: (id: string | null) => void;
  clearSelection: () => void;

  // Viewport & Layout actions
  setViewport: (panX: number, panY: number, zoom: number) => void;
  panBy: (dx: number, dy: number) => void;
  zoomBy: (factor: number) => void;
  resetViewport: () => void;
  toggleLayer: (layer: LayerId) => void;
  setAllLayers: (active: boolean) => void;
  applyLayout: (layoutType: GraphLayoutType) => void;
  setLinkMode: (active: boolean) => void;
  setLinkSourceNodeId: (id: string | null) => void;
  createManualEdge: (sourceId: string, targetId: string) => void;

  // Canvas Node Position actions (with reversible command)
  updateNodePosition: (nodeId: string, x: number, y: number, recordHistory?: boolean) => void;

  // Context Menu actions
  openContextMenu: (x: number, y: number, nodeId: string) => void;
  closeContextMenu: () => void;

  // Layer Change Modal actions
  openLayerChangeModal: (nodeId: string, targetLayer: LayerId) => void;
  closeLayerChangeModal: () => void;

  // Mutation commands with Undo/Redo
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

const DEFAULT_LAYERS: Set<LayerId> = new Set(['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS']);

export const useGraphStore = create<GraphStoreState>((set, get) => ({
  activeCase: null,
  nodes: [],
  edges: [],
  isImpactView: false,
  totalCaseNodes: 0,
  totalCaseEdges: 0,
  isLoading: false,
  error: null,

  selectedNodeId: null,
  selectedNodeIds: [],
  selectedEdgeId: null,

  viewport: { panX: 0, panY: 0, zoom: 1 },
  activeLayers: new Set(DEFAULT_LAYERS),
  isLinkMode: false,
  linkSourceNodeId: null,
  activeLayout: 'concentric',

  contextMenu: {
    isOpen: false,
    x: 0,
    y: 0,
    targetNodeId: null,
  },

  layerChangeModal: {
    isOpen: false,
    nodeId: null,
    targetLayer: null,
  },

  undoStack: [],
  redoStack: [],

  setActiveCase: (caseItem) => set({ activeCase: caseItem }),

  setGraphData: (res) => {
    // Preserve existing node layout coordinates if node already exists
    const existingPosMap = new Map<string, { x: number; y: number }>();
    get().nodes.forEach((n) => {
      if (n.x !== undefined && n.y !== undefined) {
        existingPosMap.set(n.id, { x: n.x, y: n.y });
      }
    });

    // Check if we need to apply layout to new nodes
    const unpositionedNodes = res.nodes.filter((n) => !existingPosMap.has(n.id));
    let layoutedPositions = new Map<string, { x: number; y: number }>();

    if (unpositionedNodes.length > 0) {
      const computed = computeGraphLayout(res.nodes, res.edges, get().activeLayout);
      computed.forEach((cn) => {
        if (cn.x !== undefined && cn.y !== undefined) {
          layoutedPositions.set(cn.id, { x: cn.x, y: cn.y });
        }
      });
    }

    const positionedNodes = res.nodes.map((node) => {
      const existing = existingPosMap.get(node.id);
      if (existing) {
        return { ...node, x: existing.x, y: existing.y };
      }
      const computedPos = layoutedPositions.get(node.id);
      return {
        ...node,
        x: computedPos?.x ?? 500,
        y: computedPos?.y ?? 400,
        radius: node.properties && (node.properties['implication_level'] === 'high' || node.properties['is_critical']) ? 34 : 28,
      };
    });

    set({
      nodes: positionedNodes,
      edges: res.edges,
      isImpactView: res.is_impact_view,
      totalCaseNodes: res.total_case_nodes,
      totalCaseEdges: res.total_case_edges,
      isLoading: false,
      error: null,
    });
  },

  mergeExpandedNodes: (newNodes, newEdges) => {
    const currentNodes = get().nodes;
    const currentEdges = get().edges;
    const nodeIds = new Set(currentNodes.map((n) => n.id));
    const edgeIds = new Set(currentEdges.map((e) => e.id));

    // Place new neighbor nodes in a small orbit around their first known neighbor
    const nodesToAdd: GraphNode[] = [];
    newNodes.forEach((node, idx) => {
      if (!nodeIds.has(node.id)) {
        nodeIds.add(node.id);
        const angle = (idx * (2 * Math.PI)) / Math.max(1, newNodes.length);
        nodesToAdd.push({
          ...node,
          x: Math.round(500 + 350 * Math.cos(angle)),
          y: Math.round(400 + 350 * Math.sin(angle)),
          radius: 28,
        });
      }
    });

    const edgesToAdd = newEdges.filter((e) => !edgeIds.has(e.id));

    set({
      nodes: [...currentNodes, ...nodesToAdd],
      edges: [...currentEdges, ...edgesToAdd],
    });
  },

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  selectNode: (id, isMulti = false) => {
    if (!id) {
      set({ selectedNodeId: null, selectedNodeIds: [], selectedEdgeId: null });
      return;
    }
    const currentSelected = get().selectedNodeIds;
    if (isMulti) {
      const next = currentSelected.includes(id)
        ? currentSelected.filter((nId) => nId !== id)
        : [...currentSelected, id];
      set({
        selectedNodeId: id,
        selectedNodeIds: next,
        selectedEdgeId: null,
      });
    } else {
      set({
        selectedNodeId: id,
        selectedNodeIds: [id],
        selectedEdgeId: null,
      });
    }
  },

  selectAllNodes: () => {
    const allIds = get().nodes.map((n) => n.id);
    set({
      selectedNodeIds: allIds,
      selectedNodeId: allIds[0] ?? null,
      selectedEdgeId: null,
    });
  },

  deleteNode: (id: string) => {
    const currentNodes = get().nodes;
    const currentEdges = get().edges;
    const targetNode = currentNodes.find((n) => n.id === id);
    if (!targetNode) return;

    const remainingNodes = currentNodes.filter((n) => n.id !== id);
    const remainingEdges = currentEdges.filter((e) => e.source_id !== id && e.target_id !== id);
    const deletedEdges = currentEdges.filter((e) => e.source_id === id || e.target_id === id);

    set({
      nodes: remainingNodes,
      edges: remainingEdges,
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
      selectedNodeIds: get().selectedNodeIds.filter((nId) => nId !== id),
    });

    get().executeCommand({
      id: `delete-${id}-${Date.now()}`,
      description: `Suppression de ${targetNode.label}`,
      undo: () => {
        set({
          nodes: [...get().nodes, targetNode],
          edges: [...get().edges, ...deletedEdges],
        });
      },
      redo: () => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source_id !== id && e.target_id !== id),
        });
      },
    });
  },

  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null, selectedNodeIds: [] }),
  clearSelection: () => set({ selectedNodeId: null, selectedNodeIds: [], selectedEdgeId: null }),

  setViewport: (panX, panY, zoom) =>
    set({ viewport: { panX, panY, zoom: Math.min(Math.max(zoom, 0.2), 3.0) } }),

  panBy: (dx, dy) => {
    const { panX, panY, zoom } = get().viewport;
    set({ viewport: { panX: panX + dx, panY: panY + dy, zoom } });
  },

  zoomBy: (factor) => {
    const { panX, panY, zoom } = get().viewport;
    const nextZoom = Math.min(Math.max(zoom * factor, 0.2), 3.0);
    set({ viewport: { panX, panY, zoom: nextZoom } });
  },

  resetViewport: () => set({ viewport: { panX: 0, panY: 0, zoom: 1 } }),

  toggleLayer: (layer) => {
    const current = new Set(get().activeLayers);
    if (current.has(layer)) {
      current.delete(layer);
    } else {
      current.add(layer);
    }
    set({ activeLayers: current });
  },

  setAllLayers: (active) => {
    set({ activeLayers: active ? new Set(DEFAULT_LAYERS) : new Set() });
  },

  applyLayout: (layoutType) => {
    const { nodes, edges, activeLayout } = get();
    if (nodes.length === 0) {
      set({ activeLayout: layoutType });
      return;
    }

    const previousNodes = nodes;
    const previousLayout = activeLayout;
    const updatedNodes = computeGraphLayout(nodes, edges, layoutType);

    set({
      nodes: updatedNodes,
      activeLayout: layoutType,
    });

    get().executeCommand({
      id: `layout-${layoutType}-${Date.now()}`,
      description: `Disposition du graphe : ${layoutType}`,
      undo: () => {
        set({ nodes: previousNodes, activeLayout: previousLayout });
      },
      redo: () => {
        set({ nodes: updatedNodes, activeLayout: layoutType });
      },
    });
  },

  setLinkMode: (active) => {
    set({ isLinkMode: active, linkSourceNodeId: null });
  },

  setLinkSourceNodeId: (id) => {
    set({ linkSourceNodeId: id });
  },

  createManualEdge: (sourceId, targetId) => {
    const { nodes, edges } = get();
    const sourceNode = nodes.find((n) => n.id === sourceId);
    const targetNode = nodes.find((n) => n.id === targetId);
    if (!sourceNode || !targetNode || sourceId === targetId) return;

    // Check if edge already exists
    const exists = edges.some(
      (e) => (e.source_id === sourceId && e.target_id === targetId) ||
             (e.source_id === targetId && e.target_id === sourceId)
    );
    if (exists) {
      set({ isLinkMode: false, linkSourceNodeId: null });
      return;
    }

    const newEdge: GraphEdge = {
      id: `edge-manual-${Date.now()}`,
      case_id: get().activeCase?.id || 'case-candy-wheels',
      source_id: sourceId,
      target_id: targetId,
      type: 'CORRESPONDS_TO',
      layer: 'HYPOTHESIS',
      confidence: 1.0,
      provenance: 'INVESTIGATOR_MANUAL',
      properties: { label: 'Liaison directe' },
    };

    const previousEdges = edges;
    set({
      edges: [...previousEdges, newEdge],
      isLinkMode: false,
      linkSourceNodeId: null,
      selectedEdgeId: newEdge.id,
    });

    get().executeCommand({
      id: `create-manual-edge-${newEdge.id}`,
      description: `Créer liaison : ${sourceNode.label} -> ${targetNode.label}`,
      undo: () => {
        set({ edges: get().edges.filter((e) => e.id !== newEdge.id) });
      },
      redo: () => {
        set({ edges: [...get().edges, newEdge] });
      },
    });
  },

  updateNodePosition: (nodeId, x, y, recordHistory = false) => {
    const nodes = get().nodes;
    const target = nodes.find((n) => n.id === nodeId);
    if (!target) return;

    const oldX = target.x ?? 0;
    const oldY = target.y ?? 0;

    set({
      nodes: nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
    });

    if (recordHistory && (oldX !== x || oldY !== y)) {
      get().executeCommand({
        id: `move-${nodeId}-${Date.now()}`,
        description: `Déplacement de ${target.label}`,
        undo: () => {
          set({
            nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, x: oldX, y: oldY } : n)),
          });
        },
        redo: () => {
          set({
            nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
          });
        },
      });
    }
  },

  openContextMenu: (x, y, nodeId) => {
    set({
      contextMenu: { isOpen: true, x, y, targetNodeId: nodeId },
    });
  },

  closeContextMenu: () => {
    set((state) => ({
      contextMenu: { ...state.contextMenu, isOpen: false, targetNodeId: null },
    }));
  },

  openLayerChangeModal: (nodeId, targetLayer) => {
    set({
      layerChangeModal: { isOpen: true, nodeId, targetLayer },
    });
  },

  closeLayerChangeModal: () => {
    set({
      layerChangeModal: { isOpen: false, nodeId: null, targetLayer: null },
    });
  },

  executeCommand: (command) => {
    set((state) => ({
      undoStack: [...state.undoStack, command],
      redoStack: [], // clear redo on new action
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();
    if (undoStack.length === 0) return;
    const cmd = undoStack[undoStack.length - 1];
    if (!cmd) return;
    cmd.undo();
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, cmd],
    });
  },

  redo: () => {
    const { undoStack, redoStack } = get();
    if (redoStack.length === 0) return;
    const cmd = redoStack[redoStack.length - 1];
    if (!cmd) return;
    cmd.redo();
    set({
      redoStack: redoStack.slice(0, -1),
      undoStack: [...undoStack, cmd],
    });
  },
}));
