/**
 * Zustand global store with slices for Graph, Selection, View, Layers, and Reversible History.
 * Adheres strictly to Section 7 of .agent/phase1-implementation-rules.md.
 */

import { create } from './createStore';
import type { GraphNode, GraphEdge, CaseItem, GraphResponse } from '../types/graph';
import type { LayerId } from '../types/registry';
import { computeGraphLayout, type GraphLayoutType } from '../utils/graphLayouts';

export type { GraphLayoutType };

export interface SnaVisualOverlay {
  algoKey: string;
  algoTitle: string;
  nodeColors: Record<string, string>;
  nodeBadges: Record<string, string>;
  legend: Array<{ label: string; color: string }>;
}

export type OntologyCategory =
  | 'territoire'
  | 'acteurs'
  | 'telecoms'
  | 'finances'
  | 'socmint'
  | 'cyber'
  | 'biometrie'
  | 'preuve';

export const ONTOLOGY_CATEGORY_COLORS: Record<OntologyCategory, string> = {
  territoire: '#10b981', // Émeraude / SIG & BTS
  acteurs: '#3b82f6',    // Bleu royal / Personnes & Réseau
  telecoms: '#6366f1',   // Indigo / Téléphonie
  finances: '#f59e0b',   // Ambre or / BaridiMob
  socmint: '#06b6d4',    // Cyan / Réseaux sociaux
  cyber: '#e11d48',      // Cramoisi / C2 & Malware
  biometrie: '#a855f7',  // Violet pourpre / Voix & Visages
  preuve: '#ea580c',     // Terracotta / Procédures & Scellés
};

export const NODE_TYPE_TO_CATEGORY: Record<string, OntologyCategory> = {
  // 1. Territoire & Juridiction
  wilaya: 'territoire',
  daira: 'territoire',
  commune: 'territoire',
  unite: 'territoire',
  affaire: 'territoire',
  magistrat: 'territoire',
  adresse_physique: 'territoire',
  point_geographique: 'territoire',
  lieu: 'territoire',

  // 2. Acteurs & Réseau Criminel
  personne: 'acteurs',
  organisation: 'acteurs',
  entreprise: 'acteurs',
  groupe: 'acteurs',
  vehicule: 'acteurs',

  // 3. Télécommunications & Bornages
  telephone: 'telecoms',
  carte_sim: 'telecoms',
  appareil_mobile: 'telecoms',
  antenne_bts: 'telecoms',
  telecom_cdr: 'telecoms',
  imei: 'telecoms',
  imsi: 'telecoms',

  // 4. Finances & BaridiMob / Crypto
  compte_bancaire: 'finances',
  transaction_financiere: 'finances',
  guichet_gab: 'finances',
  crypto_wallet: 'finances',
  transaction_crypto: 'finances',
  carte_paiement: 'finances',

  // 5. SOCMINT & Réseaux Sociaux
  compte_social: 'socmint',
  publication_sociale: 'socmint',
  canal_telegram: 'socmint',
  message_chat: 'socmint',
  adresse_email: 'socmint',
  site_web: 'socmint',
  identifiant_infrastructure: 'socmint',

  // 6. Cyber & Infrastructure C2
  fichier_apk: 'cyber',
  serveur_c2: 'cyber',
  certificat_tls: 'cyber',
  artefact_dfir: 'cyber',
  session_recherche: 'cyber',

  // 7. Biométrie & Voix
  enregistrement_vocal: 'biometrie',
  empreinte_faciale: 'biometrie',
  empreinte_biometrique: 'biometrie',
  profil_adn: 'biometrie',
  image_preuve: 'biometrie',

  // 8. Preuve & Scellés Judiciaires
  document_judiciaire: 'preuve',
  scelle_numerique: 'preuve',
  preuve_merkle: 'preuve',
  scelle: 'preuve',
  proces_verbal: 'preuve',
  piece_a_conviction: 'preuve',
};

export interface GraphCustomizationState {
  nodeSize: number; // 40 - 96
  nodeLabelSize: number; // 10 - 18
  edgeThickness: number; // 1 - 6
  edgeLabelSize: number; // 9 - 16
  showEdgeLabels: boolean;
  showNodePhotos: boolean;
  colorMode: 'category' | 'layer';
  labelDensityMode: 'smart' | 'all' | 'none'; // 'smart' (hover/selection/key), 'all', 'none'
}

export const DEFAULT_GRAPH_CUSTOMIZATION: GraphCustomizationState = {
  nodeSize: 64,
  nodeLabelSize: 12.5,
  edgeThickness: 2,
  edgeLabelSize: 11,
  showEdgeLabels: false, // Default to false: edge labels appear on hover only
  showNodePhotos: true,
  colorMode: 'category',
  labelDensityMode: 'smart',
};

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

  // Live Force Physics Simulation Toggle
  isLiveSimulationActive: boolean;
  toggleLiveSimulation: () => void;
  setLiveSimulation: (active: boolean) => void;

  // Feature 4: SNA Visual Overlay
  snaVisualOverlay: SnaVisualOverlay | null;
  setSnaVisualOverlay: (overlay: SnaVisualOverlay | null) => void;
  clearSnaVisualOverlay: () => void;

  // Feature 10: Mode Enquêteur vs Analyste Forensique
  investigationMode: 'investigator' | 'analyst';
  toggleInvestigationMode: () => void;
  setInvestigationMode: (mode: 'investigator' | 'analyst') => void;

  // Graph Customization & Sizing (Sliders & Color Mode)
  graphCustomization: GraphCustomizationState;
  setGraphCustomization: (settings: Partial<GraphCustomizationState>) => void;
  resetGraphCustomization: () => void;

  // Visibility & Display Management (Nodes & Edges)
  visibleNodeLabelTypes: Set<string>; // Types whose labels are shown by default (e.g. 'personne')
  forcedVisibleNodeLabelIds: Set<string>; // Node IDs explicitly forced to show label
  forcedHiddenNodeLabelIds: Set<string>; // Node IDs explicitly forced to hide label
  edgeLabelMode: 'hover' | 'always' | 'none'; // 'hover' (default), 'always', 'none'
  edgeLabelConnectedNodeTypes: Set<string>; // Show edge labels if connected to these node types (e.g. 'personne')
  hiddenEdgeCategories: Set<string>; // Categories of edges hidden from canvas

  toggleVisibleNodeLabelType: (typeKey: string) => void;
  setNodeLabelPreset: (preset: 'personne_only' | 'targets' | 'all' | 'none') => void;
  toggleForcedNodeLabelId: (nodeId: string) => void;
  setEdgeLabelMode: (mode: 'hover' | 'always' | 'none') => void;
  toggleEdgeLabelConnectedNodeType: (typeKey: string) => void;
  toggleHiddenEdgeCategory: (categoryKey: string) => void;

  // Person-Centric Graph Projection & Granular Node/Relation Expansion
  isPersonOnlyGraph: boolean;
  expandedHiddenNodeIds: Set<string>;
  mediatedEdgeOverrides: Record<
    string,
    { confidence?: number; layer?: LayerId; confidentiality_level?: string; notes?: string }
  >;
  togglePersonOnlyGraph: () => void;
  setPersonOnlyGraph: (active: boolean) => void;
  toggleExpandNodeConnections: (nodeId: string) => void;
  expandMediatedEdgeNodes: (intermediateNodeIds: string[]) => void;

  // Edge / Link Confidence & Confidentiality Update
  updateEdgeDetails: (
    edgeId: string,
    updates: {
      confidence?: number;
      layer?: LayerId;
      confidentiality_level?: string;
      notes?: string;
    }
  ) => void;

  // Feature 2: Node Rename & Details Update
  updateNodeLabel: (nodeId: string, label: string) => Promise<void>;
  updateNodeDetails: (
    nodeId: string,
    updates: {
      label?: string;
      confidence?: number;
      properties?: Record<string, any>;
    }
  ) => Promise<void>;

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
  createManualEdge: (
    sourceId: string,
    targetId: string,
    relationType?: string,
    layer?: LayerId,
    confidence?: number,
    notes?: string
  ) => void;

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

  isLiveSimulationActive: false,
  toggleLiveSimulation: () => set((state) => ({ isLiveSimulationActive: !state.isLiveSimulationActive })),
  setLiveSimulation: (active) => set({ isLiveSimulationActive: active }),

  snaVisualOverlay: null,
  setSnaVisualOverlay: (overlay) => set({ snaVisualOverlay: overlay }),
  clearSnaVisualOverlay: () => set({ snaVisualOverlay: null }),

  investigationMode: 'investigator',
  toggleInvestigationMode: () =>
    set((state) => ({
      investigationMode: state.investigationMode === 'investigator' ? 'analyst' : 'investigator',
    })),
  setInvestigationMode: (mode) => set({ investigationMode: mode }),

  graphCustomization: DEFAULT_GRAPH_CUSTOMIZATION,
  setGraphCustomization: (settings) =>
    set((state) => ({
      graphCustomization: { ...state.graphCustomization, ...settings },
    })),
  resetGraphCustomization: () =>
    set({ graphCustomization: DEFAULT_GRAPH_CUSTOMIZATION }),

  // Visibility & Display Management State & Actions
  visibleNodeLabelTypes: new Set(['personne']),
  forcedVisibleNodeLabelIds: new Set(),
  forcedHiddenNodeLabelIds: new Set(),
  edgeLabelMode: 'hover',
  edgeLabelConnectedNodeTypes: new Set(),
  hiddenEdgeCategories: new Set(),

  toggleVisibleNodeLabelType: (typeKey) =>
    set((state) => {
      const next = new Set(state.visibleNodeLabelTypes);
      if (next.has(typeKey)) next.delete(typeKey);
      else next.add(typeKey);
      return { visibleNodeLabelTypes: next };
    }),

  setNodeLabelPreset: (preset) =>
    set((state) => {
      if (preset === 'personne_only') {
        return {
          visibleNodeLabelTypes: new Set(['personne']),
          forcedVisibleNodeLabelIds: new Set(),
          forcedHiddenNodeLabelIds: new Set(),
        };
      }
      if (preset === 'targets') {
        return {
          visibleNodeLabelTypes: new Set(['personne', 'entreprise', 'vehicule']),
          forcedVisibleNodeLabelIds: new Set(),
          forcedHiddenNodeLabelIds: new Set(),
        };
      }
      if (preset === 'all') {
        const allTypes = new Set(state.nodes.map((n) => n.type));
        return {
          visibleNodeLabelTypes: allTypes,
          forcedVisibleNodeLabelIds: new Set(),
          forcedHiddenNodeLabelIds: new Set(),
        };
      }
      return {
        visibleNodeLabelTypes: new Set(),
        forcedVisibleNodeLabelIds: new Set(),
        forcedHiddenNodeLabelIds: new Set(),
      };
    }),

  toggleForcedNodeLabelId: (nodeId) =>
    set((state) => {
      const nextVis = new Set(state.forcedVisibleNodeLabelIds);
      const nextHid = new Set(state.forcedHiddenNodeLabelIds);
      if (nextVis.has(nodeId)) {
        nextVis.delete(nodeId);
        nextHid.add(nodeId);
      } else if (nextHid.has(nodeId)) {
        nextHid.delete(nodeId);
      } else {
        nextVis.add(nodeId);
      }
      return { forcedVisibleNodeLabelIds: nextVis, forcedHiddenNodeLabelIds: nextHid };
    }),

  setEdgeLabelMode: (mode) => set({ edgeLabelMode: mode }),

  toggleEdgeLabelConnectedNodeType: (typeKey) =>
    set((state) => {
      const next = new Set(state.edgeLabelConnectedNodeTypes);
      if (next.has(typeKey)) next.delete(typeKey);
      else next.add(typeKey);
      return { edgeLabelConnectedNodeTypes: next };
    }),

  toggleHiddenEdgeCategory: (categoryKey) =>
    set((state) => {
      const next = new Set(state.hiddenEdgeCategories);
      if (next.has(categoryKey)) next.delete(categoryKey);
      else next.add(categoryKey);
      return { hiddenEdgeCategories: next };
    }),

  // Person-Centric Projection (Option A: Person-only by default, expandable per node, per mediated relation, or full graph)
  isPersonOnlyGraph: true,
  expandedHiddenNodeIds: new Set(),
  mediatedEdgeOverrides: {},

  togglePersonOnlyGraph: () =>
    set((state) => ({
      isPersonOnlyGraph: !state.isPersonOnlyGraph,
      expandedHiddenNodeIds: new Set(),
    })),

  setPersonOnlyGraph: (active) =>
    set({
      isPersonOnlyGraph: active,
      expandedHiddenNodeIds: new Set(),
    }),

  toggleExpandNodeConnections: (nodeId) =>
    set((state) => {
      const neighborIds: string[] = [];
      state.edges.forEach((e) => {
        if (e.source_id === nodeId) neighborIds.push(e.target_id);
        else if (e.target_id === nodeId) neighborIds.push(e.source_id);
      });

      const hiddenNeighborIds = neighborIds.filter((id) => {
        const n = state.nodes.find((node) => node.id === id);
        return n && n.type !== 'personne' && n.type.toLowerCase() !== 'person';
      });

      if (hiddenNeighborIds.length === 0) return {};

      const nextExpanded = new Set(state.expandedHiddenNodeIds);
      const allAlreadyExpanded = hiddenNeighborIds.every((id) => nextExpanded.has(id));

      if (allAlreadyExpanded) {
        hiddenNeighborIds.forEach((id) => nextExpanded.delete(id));
      } else {
        hiddenNeighborIds.forEach((id) => nextExpanded.add(id));
      }

      return { expandedHiddenNodeIds: nextExpanded };
    }),

  expandMediatedEdgeNodes: (intermediateNodeIds) =>
    set((state) => {
      const nextExpanded = new Set(state.expandedHiddenNodeIds);
      intermediateNodeIds.forEach((id) => nextExpanded.add(id));
      return {
        expandedHiddenNodeIds: nextExpanded,
        selectedEdgeId: null,
      };
    }),

  updateEdgeDetails: (edgeId, updates) => {
    const state = get();
    if (edgeId.startsWith('mediated__')) {
      const prevOverrides = { ...state.mediatedEdgeOverrides };
      const existing = prevOverrides[edgeId] || {};
      const nextForEdge = { ...existing, ...updates };
      set({
        mediatedEdgeOverrides: {
          ...prevOverrides,
          [edgeId]: nextForEdge,
        },
      });
      return;
    }

    const targetEdge = state.edges.find((e) => e.id === edgeId);
    if (!targetEdge) return;

    const previousEdge: GraphEdge = {
      ...targetEdge,
      properties: { ...(targetEdge.properties || {}) },
    };

    const updatedEdge: GraphEdge = {
      ...targetEdge,
      confidence: updates.confidence !== undefined ? updates.confidence : targetEdge.confidence,
      layer: updates.layer !== undefined ? updates.layer : targetEdge.layer,
      properties: {
        ...(targetEdge.properties || {}),
        ...(updates.confidentiality_level !== undefined
          ? { confidentiality_level: updates.confidentiality_level }
          : {}),
        ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
      },
    };

    set({
      edges: state.edges.map((e) => (e.id === edgeId ? updatedEdge : e)),
    });

    get().executeCommand({
      id: `update-edge-${edgeId}-${Date.now()}`,
      description: `Mise à jour de la liaison ${targetEdge.type}`,
      undo: () => {
        set({
          edges: get().edges.map((e) => (e.id === edgeId ? previousEdge : e)),
        });
      },
      redo: () => {
        set({
          edges: get().edges.map((e) => (e.id === edgeId ? updatedEdge : e)),
        });
      },
    });
  },

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

    // Place new neighbor nodes in a small orbit around their first known neighbor if not explicitly positioned
    const nodesToAdd: GraphNode[] = [];
    newNodes.forEach((node, idx) => {
      if (!nodeIds.has(node.id)) {
        nodeIds.add(node.id);
        const hasPos = typeof node.x === 'number' && typeof node.y === 'number';
        const angle = (idx * (2 * Math.PI)) / Math.max(1, newNodes.length);
        nodesToAdd.push({
          ...node,
          x: hasPos ? node.x : Math.round(500 + 350 * Math.cos(angle)),
          y: hasPos ? node.y : Math.round(400 + 350 * Math.sin(angle)),
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

  updateNodeLabel: async (nodeId: string, newLabel: string) => {
    const currentNodes = get().nodes;
    const target = currentNodes.find((n) => n.id === nodeId);
    if (!target || !newLabel.trim()) return;

    const oldLabel = target.label;
    if (oldLabel === newLabel.trim()) return;

    // Optimistic UI update
    set({
      nodes: currentNodes.map((n) => (n.id === nodeId ? { ...n, label: newLabel.trim() } : n)),
    });

    // Server update
    const activeCase = get().activeCase;
    if (activeCase) {
      try {
        await fetch(`/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': 'investigator_front',
          },
          body: JSON.stringify({
            label: newLabel.trim(),
            reason: 'Modification de libellé par l\'enquêteur',
          }),
        });
      } catch (err) {
        console.error('Erreur mise à jour libellé nœud:', err);
      }
    }

    // Command for Undo / Redo
    get().executeCommand({
      id: `rename-${nodeId}-${Date.now()}`,
      description: `Renommer "${oldLabel}" en "${newLabel.trim()}"`,
      undo: () => {
        set({
          nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, label: oldLabel } : n)),
        });
        if (activeCase) {
          fetch(`/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'investigator_front' },
            body: JSON.stringify({ label: oldLabel, reason: 'Annulation modification libellé' }),
          }).catch(() => {});
        }
      },
      redo: () => {
        set({
          nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, label: newLabel.trim() } : n)),
        });
        if (activeCase) {
          fetch(`/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'X-Actor-Id': 'investigator_front' },
            body: JSON.stringify({ label: newLabel.trim(), reason: 'Rétablissement modification libellé' }),
          }).catch(() => {});
        }
      },
    });
  },

  updateNodeDetails: async (nodeId, updates) => {
    const currentNodes = get().nodes;
    const target = currentNodes.find((n) => n.id === nodeId);
    if (!target) return;

    const previousSnapshot = {
      label: target.label,
      confidence: target.confidence,
      properties: { ...target.properties },
    };

    const newMergedProps = updates.properties
      ? { ...target.properties, ...updates.properties }
      : target.properties;

    const updatedNode = {
      ...target,
      label: updates.label !== undefined ? updates.label.trim() : target.label,
      confidence: updates.confidence !== undefined ? updates.confidence : target.confidence,
      properties: newMergedProps,
    };

    // Optimistic store update
    set({
      nodes: currentNodes.map((n) => (n.id === nodeId ? updatedNode : n)),
    });

    const activeCase = get().activeCase;
    if (activeCase) {
      try {
        await fetch(`/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': 'investigator_front',
          },
          body: JSON.stringify({
            label: updatedNode.label,
            confidence: updatedNode.confidence,
            properties: updatedNode.properties,
            reason: 'Mise à jour des informations de l\'entité par l\'enquêteur',
          }),
        });
      } catch (err) {
        console.error('Erreur mise à jour détails nœud:', err);
      }
    }

    // Reversible command
    get().executeCommand({
      id: `edit-node-${nodeId}-${Date.now()}`,
      description: `Mise à jour de "${updatedNode.label}"`,
      undo: () => {
        set({
          nodes: get().nodes.map((n) => (n.id === nodeId ? { ...n, ...previousSnapshot } : n)),
        });
      },
      redo: () => {
        set({
          nodes: get().nodes.map((n) => (n.id === nodeId ? updatedNode : n)),
        });
      },
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

  createManualEdge: (sourceId, targetId, relationType, layer, confidence, notes) => {
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

    const finalType = relationType || 'CORRESPONDS_TO';
    const finalLayer: LayerId = layer || 'HYPOTHESIS';
    const finalConf = typeof confidence === 'number' ? confidence : 0.9;

    const newEdge: GraphEdge = {
      id: `edge-manual-${Date.now()}`,
      case_id: get().activeCase?.id || 'case-candy-wheels',
      source_id: sourceId,
      target_id: targetId,
      type: finalType,
      layer: finalLayer,
      confidence: finalConf,
      provenance: 'INVESTIGATOR_MANUAL',
      properties: { label: notes || finalType },
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
      description: `Créer liaison : ${sourceNode.label} -> ${targetNode.label} (${finalType})`,
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
