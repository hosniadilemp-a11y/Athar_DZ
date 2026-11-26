/**
 * Zustand global store with slices for Graph, Selection, View, Layers, and Reversible History.
 * Adheres strictly to Section 7 of .agent/phase1-implementation-rules.md.
 */

import { create } from './createStore';
import type {
  GraphNode,
  GraphEdge,
  CaseItem,
  GraphResponse,
  InvestigationTab,
  AnalysisMode,
} from '../types/graph';
import type { LayerId } from '../types/registry';
import type {
  ExtractedCandidate,
  ExtractedRelation,
  ExtractionRun,
  NodeCandidatesResponse,
  RelationUpdateRequest,
  ValidateCandidatesRequest,
  ValidateRelationsRequest,
} from '../types/ingestion';
import {
  computeDefaultCandidatePosition,
  computeGraphLayout,
  type GraphLayoutType,
} from '../utils/graphLayouts';
import { computeActorSphere } from '../utils/actorSphere';
import { getLocalFileEntry } from '../utils/localFileStore';
import {
  advanceExtractionStage,
  deleteNodeRelation,
  fetchCaseIngestionSummary,
  fetchNodeCandidates,
  startNodeExtraction,
  updateNodeCandidate,
  updateNodeRelation,
  uploadNodePdf,
  validateNodeCandidates,
  validateNodeRelations,
  type CandidateUpdatePayload,
} from '../services/ingestionApi';
import { API_BASE } from '../config';

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
  territoire: '#14b8a6', // Sarcelle / SIG & Lieux
  acteurs: '#22c55e',    // Vert / Personnes & Acteurs
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
  nodeSize: 56,
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
  viewportFitNonce: number;
  activeLayers: Set<LayerId>;
  canvasToolMode: 'select' | 'pan';
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
  pinnedNodeIds: Set<string>;
  togglePinNode: (nodeId: string) => void;
  setNodePinned: (nodeId: string, pinned: boolean) => void;
  mediatedEdgeOverrides: Record<
    string,
    { confidence?: number; layer?: LayerId; confidentiality_level?: string; notes?: string }
  >;
  togglePersonOnlyGraph: () => void;
  setPersonOnlyGraph: (active: boolean) => void;
  toggleExpandNodeConnections: (nodeId: string) => void;
  expandMediatedEdgeNodes: (intermediateNodeIds: string[]) => void;
  expandNodeNeighborhood: (nodeId: string, hops: number) => number;

  // Edge / Link Confidence & Confidentiality Update
  updateEdgeDetails: (
    edgeId: string,
    updates: {
      type?: string;
      confidence?: number;
      layer?: LayerId;
      confidentiality_level?: string;
      notes?: string;
    }
  ) => Promise<void>;
  deleteEdge: (edgeId: string, reason?: string) => Promise<void>;

  // Feature 2: Node Rename & Details Update
  updateNodeLabel: (nodeId: string, label: string) => Promise<void>;
  updateNodeDetails: (
    nodeId: string,
    updates: {
      label?: string;
      confidence?: number;
      properties?: Record<string, unknown>;
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

  // Option A: Multi-Tab Investigation Workspace slice
  tabs: InvestigationTab[];
  activeTabId: string;
  loadedTabsCaseId: string | null;
  initTabsForCase: (caseId: string, caseNodes: GraphNode[]) => void;
  openActorTab: (nodeId: string) => void;
  switchTab: (tabId: string) => void;
  closeTab: (tabId: string) => void;
  toggleTabImpactView: () => void;

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
  pendingDeleteNodeIds: string[] | null;
  requestDeleteNodes: (ids: string[]) => void;
  cancelDeleteNodes: () => void;
  deleteNodes: (ids: string[]) => void;
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
  setCanvasToolMode: (mode: 'select' | 'pan') => void;
  setLinkMode: (active: boolean) => void;
  setLinkSourceNodeId: (id: string | null) => void;
  stepEscapeLinkMode: () => 'cleared_source' | 'exited_link_mode' | 'cleared_selection';
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
  updateActiveTabNodePositions: (posMap: Map<string, { x: number; y: number }>) => void;

  // Context Menu actions
  openContextMenu: (x: number, y: number, nodeId: string) => void;
  closeContextMenu: () => void;

  // Layer Change actions
  openLayerChangeModal: (nodeId: string, targetLayer: LayerId) => void;
  closeLayerChangeModal: () => void;
  changeNodeLayer: (nodeId: string, nextLayer: LayerId, reason?: string) => Promise<void>;

  // Option B: Raw File Ingestion & Analysis Popover slice
  activeIngestionPopoverNodeId: string | null;
  openIngestionPopover: (nodeId: string) => void;
  closeIngestionPopover: () => void;
  registerTabAddedNode: (nodeId: string) => void;
  reconcileOptimisticNodeId: (tempId: string, savedNode: GraphNode) => void;
  updateNodeAnalysisConfig: (
    nodeId: string,
    config: { selected_plugins?: string[]; process_tree?: Record<string, unknown> }
  ) => void;
  triggerNodeInvestigation: (nodeId: string, mode: AnalysisMode, stageLabel: string) => Promise<void>;

  // Phase 2A: Static Manual PDF/HTML Extraction & Isolated Candidate + Relation Validation
  extractionRunsByNodeId: Record<string, ExtractionRun | null>;
  candidatesByNodeId: Record<string, ExtractedCandidate[]>;
  relationsByNodeId: Record<string, ExtractedRelation[]>;
  candidatePositions: Record<string, { x: number; y: number }>;
  extractionLoadingNodeId: string | null;
  selectedCandidateId: string | null;
  selectCandidate: (candidateId: string | null) => void;
  setCandidatePosition: (ghostId: string, x: number, y: number) => void;
  updateCandidatePositions: (posMap: Map<string, { x: number; y: number }>) => void;
  uploadPdfForNode: (nodeId: string, file: File) => Promise<void>;
  runPdfExtraction: (
    nodeId: string,
    mode: 'quick' | 'step_by_step',
    selectedTools: string[]
  ) => Promise<void>;
  advancePdfStage: (nodeId: string, runId: string) => Promise<void>;
  completeAllPdfStages: (nodeId: string) => Promise<void>;
  loadNodeCandidates: (nodeId: string) => Promise<void>;
  loadCaseIngestionSummary: (caseId: string) => Promise<void>;
  validateCandidates: (nodeId: string, payload: ValidateCandidatesRequest) => Promise<number>;
  updateExtractedCandidate: (
    sourceNodeId: string,
    candidateId: string,
    payload: CandidateUpdatePayload
  ) => Promise<void>;
  updateExtractedRelation: (
    sourceNodeId: string,
    relationId: string,
    payload: RelationUpdateRequest
  ) => Promise<void>;
  deleteExtractedRelation: (sourceNodeId: string, relationId: string) => Promise<void>;
  validateRelations: (nodeId: string, payload: ValidateRelationsRequest) => Promise<number>;

  // Mutation commands with Undo/Redo
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;
}

const DEFAULT_LAYERS: Set<LayerId> = new Set(['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS']);

function createMasterTab(): InvestigationTab {
  return {
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
      activeLayers: Array.from(DEFAULT_LAYERS),
      isPersonOnlyGraph: true,
      isImpactOnly: false,
      selectedNodeId: null,
    },
  };
}

function computeIsolatedTabPositions(
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  focalNodeId: string,
  layoutType: GraphLayoutType = 'force'
): Record<string, { x: number; y: number }> {
  const sphere = computeActorSphere(allNodes, allEdges, focalNodeId);
  const sphereNodes = allNodes
    .filter((n) => sphere.nodeIds.has(n.id))
    .map((n) => ({ ...n, x: undefined, y: undefined }));
  const sphereEdges = allEdges.filter((e) => sphere.edgeIds.has(e.id));

  const layouted = computeGraphLayout(sphereNodes, sphereEdges, layoutType, {
    centerX: 600,
    centerY: 420,
  });

  const positions: Record<string, { x: number; y: number }> = {};
  layouted.forEach((n) => {
    if (typeof n.x === 'number' && typeof n.y === 'number') {
      positions[n.id] = { x: n.x, y: n.y };
    }
  });
  return positions;
}

function buildTabsForCase(caseNodes: GraphNode[], caseEdges: GraphEdge[] = []): InvestigationTab[] {
  const master = createMasterTab();
  const hasAnyPerson = caseNodes.some(
    (n) => n.type === 'personne' || n.type.toLowerCase() === 'person'
  );
  if (!hasAnyPerson) {
    master.snapshot.isPersonOnlyGraph = false;
  }
  const tabs: InvestigationTab[] = [master];
  const amineNode = caseNodes.find(
    (n) =>
      (n.type === 'personne' || n.type.toLowerCase() === 'person') &&
      n.label.toLowerCase().includes('amine b.')
  );
  if (amineNode) {
    tabs.push({
      id: `tab-actor-${amineNode.id}`,
      kind: 'actor_sphere',
      title: 'Suspect : Amine B.',
      focalNodeId: amineNode.id,
      closable: true,
      snapshot: {
        panX: 0,
        panY: 0,
        zoom: 1,
        activeLayout: 'force',
        activeLayers: Array.from(DEFAULT_LAYERS),
        isPersonOnlyGraph: false,
        isImpactOnly: false,
        selectedNodeId: amineNode.id,
        nodePositions: computeIsolatedTabPositions(caseNodes, caseEdges, amineNode.id, 'force'),
      },
    });
  }
  return tabs;
}

function applyNodeExtractionPatch(
  prev: GraphStoreState,
  nodeId: string,
  res: NodeCandidatesResponse,
  activeMode?: 'quick' | 'step_by_step'
): Partial<GraphStoreState> {
  const pendingCount = res.counts.pending ?? 0;
  const pendingRelCount = res.relation_counts?.pending ?? (res.relations ?? []).filter((r) => r.validation_status === 'PENDING').length;
  const run = res.latest_run;
  const nextStatus = run?.status === 'COMPLETED' ? 'saturated' : 'active_investigation';
  const nextProgress =
    run?.status === 'COMPLETED'
      ? 100
      : Math.round(((run?.current_stage ?? 1) / (run?.total_stages ?? 3)) * 100);
  const nextStage =
    run?.status === 'COMPLETED'
      ? `Analyse complète terminée (${pendingCount} candidat(s) à valider)`
      : `Étape ${run?.current_stage ?? 1}/${run?.total_stages ?? 3} terminée (${pendingCount} candidat(s))`;

  return {
    extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [nodeId]: run },
    candidatesByNodeId: { ...prev.candidatesByNodeId, [nodeId]: res.candidates },
    relationsByNodeId: { ...prev.relationsByNodeId, [nodeId]: res.relations ?? [] },
    nodes: prev.nodes.map((n) =>
      n.id === nodeId
        ? {
            ...n,
            properties: {
              ...n.properties,
              investigation_status: nextStatus,
              ...(activeMode ? { analysis_mode: activeMode } : {}),
              analysis_progress: nextProgress,
              analysis_stage: nextStage,
              pending_candidates_count: pendingCount,
              pending_relations_count: pendingRelCount,
            },
          }
        : n
    ),
  };
}

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
  viewportFitNonce: 0,
  activeLayers: new Set(DEFAULT_LAYERS),
  canvasToolMode: 'select',
  isLinkMode: false,
  linkSourceNodeId: null,
  activeLayout: 'force',

  isLiveSimulationActive: false,
  toggleLiveSimulation: () => set((state) => ({ isLiveSimulationActive: !state.isLiveSimulationActive })),
  setLiveSimulation: (active) => set({ isLiveSimulationActive: active }),

  snaVisualOverlay: null,
  setSnaVisualOverlay: (overlay) => set({ snaVisualOverlay: overlay }),
  clearSnaVisualOverlay: () => set({ snaVisualOverlay: null }),

  extractionRunsByNodeId: {},
  candidatesByNodeId: {},
  relationsByNodeId: {},
  candidatePositions: {},
  extractionLoadingNodeId: null,
  selectedCandidateId: null,
  selectCandidate: (candidateId) => set({ selectedCandidateId: candidateId }),
  setCandidatePosition: (ghostId, x, y) =>
    set((prev) => ({
      candidatePositions: {
        ...prev.candidatePositions,
        [ghostId]: { x, y },
      },
    })),
  updateCandidatePositions: (posMap) => {
    if (posMap.size === 0) return;
    set((prev) => {
      const next = { ...prev.candidatePositions };
      posMap.forEach((pos, key) => {
        next[key] = { x: pos.x, y: pos.y };
      });
      return { candidatePositions: next };
    });
  },

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
  pinnedNodeIds: new Set(),
  togglePinNode: (nodeId) =>
    set((state) => {
      const next = new Set(state.pinnedNodeIds);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return { pinnedNodeIds: next };
    }),
  setNodePinned: (nodeId, pinned) =>
    set((state) => {
      const next = new Set(state.pinnedNodeIds);
      if (pinned) next.add(nodeId);
      else next.delete(nodeId);
      return { pinnedNodeIds: next };
    }),
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
      // Find all intermediate non-person nodes in the multi-hop chain starting from nodeId
      const intermediateChainIds = new Set<string>();
      const visited = new Set<string>([nodeId]);
      const queue = [nodeId];

      while (queue.length > 0) {
        const curr = queue.shift();
        if (!curr) continue;
        state.edges.forEach((e) => {
          let neighbor: string | null = null;
          if (e.source_id === curr) neighbor = e.target_id;
          else if (e.target_id === curr) neighbor = e.source_id;

          if (neighbor && !visited.has(neighbor)) {
            visited.add(neighbor);
            const nNode = state.nodes.find((n) => n.id === neighbor);
            const isPerson = nNode && (nNode.type === 'personne' || nNode.type.toLowerCase() === 'person');
            if (nNode && !isPerson) {
              intermediateChainIds.add(neighbor);
              queue.push(neighbor);
            }
          }
        });
      }

      if (intermediateChainIds.size === 0) return {};

      const nextExpanded = new Set(state.expandedHiddenNodeIds);
      const allAlreadyExpanded = Array.from(intermediateChainIds).every((id) => nextExpanded.has(id));

      if (allAlreadyExpanded) {
        intermediateChainIds.forEach((id) => nextExpanded.delete(id));
      } else {
        intermediateChainIds.forEach((id) => nextExpanded.add(id));
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

  expandNodeNeighborhood: (nodeId, hops) => {
    const state = get();
    const discovered = new Set<string>();
    let frontier = [nodeId];
    const visited = new Set<string>([nodeId]);

    for (let h = 1; h <= Math.max(1, hops); h++) {
      const nextFrontier: string[] = [];
      state.edges.forEach((e) => {
        if (frontier.includes(e.source_id) && !visited.has(e.target_id)) {
          visited.add(e.target_id);
          discovered.add(e.target_id);
          nextFrontier.push(e.target_id);
        } else if (frontier.includes(e.target_id) && !visited.has(e.source_id)) {
          visited.add(e.source_id);
          discovered.add(e.source_id);
          nextFrontier.push(e.source_id);
        }
      });
      frontier = nextFrontier;
    }

    if (discovered.size === 0) return 0;

    const nextExpanded = new Set(state.expandedHiddenNodeIds);
    const nextLayers = new Set(state.activeLayers);
    discovered.forEach((id) => {
      nextExpanded.add(id);
      const found = state.nodes.find((n) => n.id === id);
      if (found) nextLayers.add(found.layer);
    });

    set({
      expandedHiddenNodeIds: nextExpanded,
      activeLayers: nextLayers,
      selectedNodeIds: [nodeId, ...Array.from(discovered)],
      selectedNodeId: nodeId,
    });

    return discovered.size;
  },

  updateEdgeDetails: async (edgeId, updates) => {
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

    const updatedProps = {
      ...(targetEdge.properties || {}),
      ...(updates.confidentiality_level !== undefined
        ? { confidentiality_level: updates.confidentiality_level }
        : {}),
      ...(updates.notes !== undefined ? { notes: updates.notes } : {}),
    };

    const updatedEdge: GraphEdge = {
      ...targetEdge,
      type: updates.type !== undefined ? updates.type : targetEdge.type,
      confidence: updates.confidence !== undefined ? updates.confidence : targetEdge.confidence,
      layer: updates.layer !== undefined ? updates.layer : targetEdge.layer,
      properties: updatedProps,
    };

    set({
      edges: state.edges.map((e) => (e.id === edgeId ? updatedEdge : e)),
    });

    const activeCase = get().activeCase;
    if (activeCase && !edgeId.startsWith('temp-') && !edgeId.startsWith('edge-')) {
      const res = await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/edges/${edgeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          type: updatedEdge.type,
          layer: updatedEdge.layer,
          confidence: updatedEdge.confidence,
          properties: updatedProps,
          allow_custom_relation: true,
          reason: updates.notes || `Mise à jour relation ${updatedEdge.type}`,
        }),
      });
      if (!res.ok) {
        set({
          edges: get().edges.map((e) => (e.id === edgeId ? previousEdge : e)),
        });
        throw new Error(`Échec mise à jour relation (HTTP ${res.status})`);
      }
      const saved = (await res.json()) as GraphEdge;
      set({
        edges: get().edges.map((e) => (e.id === edgeId ? saved : e)),
      });
    }

    get().executeCommand({
      id: `update-edge-${edgeId}-${Date.now()}`,
      description: `Mise à jour de la liaison ${updatedEdge.type}`,
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

  deleteEdge: async (edgeId, reason = '') => {
    const state = get();
    const targetEdge = state.edges.find((e) => e.id === edgeId);
    if (!targetEdge) return;

    const activeCase = state.activeCase;
    if (activeCase && !edgeId.startsWith('temp-') && !edgeId.startsWith('edge-')) {
      const url = new URL(`${API_BASE}/api/v1/cases/${activeCase.id}/edges/${edgeId}`);
      if (reason) url.searchParams.set('reason', reason);
      const res = await fetch(url.toString(), {
        method: 'DELETE',
        headers: { 'X-Actor-Id': 'investigator_front' },
      });
      if (!res.ok) {
        throw new Error(`Échec suppression relation (HTTP ${res.status})`);
      }
    }

    set((prev) => ({
      edges: prev.edges.filter((e) => e.id !== edgeId),
      selectedEdgeId: prev.selectedEdgeId === edgeId ? null : prev.selectedEdgeId,
    }));
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

  tabs: [createMasterTab()],
  activeTabId: 'master',
  loadedTabsCaseId: null,
  activeIngestionPopoverNodeId: null,

  initTabsForCase: (caseId, caseNodes) => {
    const nextTabs = buildTabsForCase(caseNodes, get().edges);
    const master = nextTabs[0] ?? createMasterTab();
    set((state) => ({
      tabs: nextTabs,
      activeTabId: 'master',
      loadedTabsCaseId: caseId,
      activeIngestionPopoverNodeId: null,
      viewport: { panX: master.snapshot.panX, panY: master.snapshot.panY, zoom: master.snapshot.zoom },
      viewportFitNonce: state.viewportFitNonce + 1,
      activeLayout: master.snapshot.activeLayout,
      activeLayers: new Set(master.snapshot.activeLayers),
      isPersonOnlyGraph: master.snapshot.isPersonOnlyGraph,
      isImpactView: master.snapshot.isImpactOnly,
    }));
  },

  openActorTab: (nodeId) => {
    const state = get();
    const targetNode = state.nodes.find((n) => n.id === nodeId);
    if (!targetNode) return;

    const existing = state.tabs.find((t) => t.kind === 'actor_sphere' && t.focalNodeId === nodeId);
    if (existing) {
      get().switchTab(existing.id);
      return;
    }

    const newTab: InvestigationTab = {
      id: `tab-actor-${nodeId}`,
      kind: 'actor_sphere',
      title: targetNode.label,
      focalNodeId: nodeId,
      closable: true,
      snapshot: {
        panX: 0,
        panY: 0,
        zoom: 1,
        activeLayout: 'force',
        activeLayers: Array.from(DEFAULT_LAYERS),
        isPersonOnlyGraph: false,
        isImpactOnly: false,
        selectedNodeId: nodeId,
        nodePositions: computeIsolatedTabPositions(state.nodes, state.edges, nodeId, 'force'),
      },
    };

    set({ tabs: [...state.tabs, newTab] });
    get().switchTab(newTab.id);

    const isEvidence =
      Boolean(targetNode.properties?.is_raw_evidence) ||
      targetNode.type === 'scelle_numerique' ||
      targetNode.type === 'document_judiciaire' ||
      typeof targetNode.properties?.client_sha256 === 'string';
    if (isEvidence && !nodeId.startsWith('temp-') && !nodeId.startsWith('node-file-')) {
      void get()
        .loadNodeCandidates(nodeId)
        .catch(() => {
          // Non-fatal in offline/unit-test environments without a live API server
        });
    }
  },

  switchTab: (tabId) => {
    const state = get();
    if (state.activeTabId === tabId) return;
    const targetTab = state.tabs.find((t) => t.id === tabId);
    if (!targetTab) return;

    const outgoingTab = state.tabs.find((t) => t.id === state.activeTabId);
    const currentSnapshot = {
      panX: state.viewport.panX,
      panY: state.viewport.panY,
      zoom: state.viewport.zoom,
      activeLayout: state.activeLayout,
      activeLayers: Array.from(state.activeLayers),
      isPersonOnlyGraph: state.isPersonOnlyGraph,
      isImpactOnly: state.isImpactView,
      selectedNodeId: state.selectedNodeId,
      ...(outgoingTab?.snapshot.nodePositions ? { nodePositions: outgoingTab.snapshot.nodePositions } : {}),
      ...(outgoingTab?.snapshot.addedNodeIds ? { addedNodeIds: outgoingTab.snapshot.addedNodeIds } : {}),
    };

    const updatedTabs = state.tabs.map((t) =>
      t.id === state.activeTabId ? { ...t, snapshot: currentSnapshot } : t
    );

    const nextSelectedId = targetTab.snapshot.selectedNodeId;
    set({
      tabs: updatedTabs,
      activeTabId: targetTab.id,
      activeIngestionPopoverNodeId: null,
      viewport: {
        panX: targetTab.snapshot.panX,
        panY: targetTab.snapshot.panY,
        zoom: targetTab.snapshot.zoom,
      },
      activeLayout: targetTab.snapshot.activeLayout,
      activeLayers: new Set(targetTab.snapshot.activeLayers),
      isPersonOnlyGraph: targetTab.snapshot.isPersonOnlyGraph,
      isImpactView: targetTab.snapshot.isImpactOnly,
      selectedNodeId: nextSelectedId,
      selectedNodeIds: nextSelectedId ? [nextSelectedId] : [],
      selectedEdgeId: null,
    });
  },

  closeTab: (tabId) => {
    const state = get();
    const targetTab = state.tabs.find((t) => t.id === tabId);
    if (!targetTab || !targetTab.closable) return;

    const remainingTabs = state.tabs.filter((t) => t.id !== tabId);
    if (state.activeTabId !== tabId) {
      set({ tabs: remainingTabs });
      return;
    }

    const fallbackTab = remainingTabs.find((t) => t.id === 'master') ?? remainingTabs[0];
    if (!fallbackTab) return;

    const nextSelectedId = fallbackTab.snapshot.selectedNodeId;
    set({
      tabs: remainingTabs,
      activeTabId: fallbackTab.id,
      activeIngestionPopoverNodeId: null,
      viewport: {
        panX: fallbackTab.snapshot.panX,
        panY: fallbackTab.snapshot.panY,
        zoom: fallbackTab.snapshot.zoom,
      },
      activeLayout: fallbackTab.snapshot.activeLayout,
      activeLayers: new Set(fallbackTab.snapshot.activeLayers),
      isPersonOnlyGraph: fallbackTab.snapshot.isPersonOnlyGraph,
      isImpactView: fallbackTab.snapshot.isImpactOnly,
      selectedNodeId: nextSelectedId,
      selectedNodeIds: nextSelectedId ? [nextSelectedId] : [],
      selectedEdgeId: null,
    });
  },

  toggleTabImpactView: () => {
    const state = get();
    const nextImpact = !state.isImpactView;
    const updatedTabs = state.tabs.map((t) =>
      t.id === state.activeTabId
        ? { ...t, snapshot: { ...t.snapshot, isImpactOnly: nextImpact } }
        : t
    );
    set({
      isImpactView: nextImpact,
      tabs: updatedTabs,
    });
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
    const layoutedPositions = new Map<string, { x: number; y: number }>();

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

    const isCaseChange = get().loadedTabsCaseId !== res.case_id;

    set({
      nodes: positionedNodes,
      edges: res.edges,
      isImpactView: res.is_impact_view,
      totalCaseNodes: res.total_case_nodes,
      totalCaseEdges: res.total_case_edges,
      isLoading: false,
      error: null,
      ...(isCaseChange
        ? {
            extractionRunsByNodeId: {},
            candidatesByNodeId: {},
            relationsByNodeId: {},
            candidatePositions: {},
            selectedCandidateId: null,
          }
        : {}),
    });

    if (isCaseChange) {
      get().initTabsForCase(res.case_id, positionedNodes);
      void get().loadCaseIngestionSummary(res.case_id).catch(() => {});
    }
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
    const nextExpanded = new Set(get().expandedHiddenNodeIds);
    newNodes.forEach((n) => nextExpanded.add(n.id));

    set({
      nodes: [...currentNodes, ...nodesToAdd],
      edges: [...currentEdges, ...edgesToAdd],
      expandedHiddenNodeIds: nextExpanded,
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
        await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
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
          fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
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
          fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
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
        await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
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

    const selected = get().nodes.find((n) => n.id === id);
    const props = selected?.properties || {};
    const isEvidence =
      Boolean(props.is_raw_evidence) ||
      selected?.type === 'scelle_numerique' ||
      selected?.type === 'piece_a_conviction' ||
      typeof props.client_sha256 === 'string' ||
      typeof props.analysis_mode === 'string';
    if (
      isEvidence &&
      !id.startsWith('temp-') &&
      !id.startsWith('node-file-') &&
      get().extractionRunsByNodeId[id] === undefined
    ) {
      void get()
        .loadNodeCandidates(id)
        .catch(() => {
          // Non-fatal in offline/unit-test environments without a live backend
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

    const affectedTab = get().tabs.find((t) => t.focalNodeId === id && t.closable);
    if (affectedTab) {
      get().closeTab(affectedTab.id);
    }

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

  pendingDeleteNodeIds: null,

  requestDeleteNodes: (ids: string[]) => {
    const existingIds = new Set(get().nodes.map((n) => n.id));
    const uniqueIds = Array.from(new Set(ids)).filter((id) => existingIds.has(id));
    if (uniqueIds.length === 0) return;
    set({ pendingDeleteNodeIds: uniqueIds });
  },

  cancelDeleteNodes: () => set({ pendingDeleteNodeIds: null }),

  deleteNodes: (ids: string[]) => {
    const idSet = new Set(ids);
    if (idSet.size === 0) return;

    const currentNodes = get().nodes;
    const currentEdges = get().edges;
    const deletedNodes = currentNodes.filter((n) => idSet.has(n.id));
    if (deletedNodes.length === 0) return;

    const remainingNodes = currentNodes.filter((n) => !idSet.has(n.id));
    const remainingEdges = currentEdges.filter(
      (e) => !idSet.has(e.source_id) && !idSet.has(e.target_id)
    );
    const deletedEdges = currentEdges.filter(
      (e) => idSet.has(e.source_id) || idSet.has(e.target_id)
    );

    const nextSelectedNodeIds = get().selectedNodeIds.filter((nId) => !idSet.has(nId));
    const currentSelectedId = get().selectedNodeId;
    const nextSelectedNodeId =
      currentSelectedId && idSet.has(currentSelectedId)
        ? (nextSelectedNodeIds[0] ?? null)
        : currentSelectedId;

    set({
      nodes: remainingNodes,
      edges: remainingEdges,
      selectedNodeId: nextSelectedNodeId,
      selectedNodeIds: nextSelectedNodeIds,
      selectedEdgeId: null,
      pendingDeleteNodeIds: null,
    });

    const affectedTabs = get().tabs.filter(
      (t) => t.closable && t.focalNodeId && idSet.has(t.focalNodeId)
    );
    affectedTabs.forEach((tab) => get().closeTab(tab.id));

    const description =
      deletedNodes.length === 1
        ? `Suppression de ${deletedNodes[0]?.label ?? ''}`
        : `Suppression de ${deletedNodes.length} entités`;

    get().executeCommand({
      id: `delete-bulk-${Date.now()}`,
      description,
      undo: () => {
        set({
          nodes: [...get().nodes, ...deletedNodes],
          edges: [...get().edges, ...deletedEdges],
        });
      },
      redo: () => {
        set({
          nodes: get().nodes.filter((n) => !idSet.has(n.id)),
          edges: get().edges.filter(
            (e) => !idSet.has(e.source_id) && !idSet.has(e.target_id)
          ),
        });
      },
    });

    const activeCase = get().activeCase;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (activeCase && typeof fetch === 'function') {
      const uuidNodes = deletedNodes.filter((n) => uuidRegex.test(n.id));
      void (async () => {
        for (const n of uuidNodes) {
          try {
            await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${n.id}`, {
              method: 'DELETE',
              headers: {
                'X-Actor-Id': 'investigator_front',
              },
            });
          } catch {
            // Non-blocking in Phase 1
          }
        }
      })();
    }
  },

  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null, selectedNodeIds: [] }),
  clearSelection: () => set({ selectedNodeId: null, selectedNodeIds: [], selectedEdgeId: null }),

  setViewport: (panX, panY, zoom) =>
    set({ viewport: { panX, panY, zoom: Math.min(Math.max(zoom, 0.1), 10.0) } }),

  panBy: (dx, dy) => {
    const { panX, panY, zoom } = get().viewport;
    set({ viewport: { panX: panX + dx, panY: panY + dy, zoom } });
  },

  zoomBy: (factor) => {
    const { panX, panY, zoom } = get().viewport;
    const nextZoom = Math.min(Math.max(zoom * factor, 0.1), 10.0);
    set({ viewport: { panX, panY, zoom: nextZoom } });
  },

  resetViewport: () =>
    set((state) => ({
      viewport: { panX: 0, panY: 0, zoom: 1 },
      viewportFitNonce: state.viewportFitNonce + 1,
    })),

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
    const { nodes, edges, activeLayout, tabs, activeTabId, pinnedNodeIds } = get();
    if (nodes.length === 0) {
      set({ activeLayout: layoutType });
      return;
    }

    const activeTab = tabs.find((t) => t.id === activeTabId);
    if (activeTab?.kind === 'actor_sphere' && activeTab.focalNodeId) {
      const sphere = computeActorSphere(nodes, edges, activeTab.focalNodeId);
      const prevPositions = activeTab.snapshot.nodePositions ?? {};
      const sphereNodes = nodes
        .filter((n) => sphere.nodeIds.has(n.id))
        .map((n) => {
          const p = prevPositions[n.id];
          return p ? { ...n, x: p.x, y: p.y } : { ...n, x: undefined, y: undefined };
        });
      const sphereEdges = edges.filter((e) => sphere.edgeIds.has(e.id));

      const updatedSphere = computeGraphLayout(
        sphereNodes,
        sphereEdges,
        layoutType,
        { centerX: 600, centerY: 420 },
        pinnedNodeIds
      );

      const nextPositions: Record<string, { x: number; y: number }> = { ...prevPositions };
      updatedSphere.forEach((n) => {
        if (typeof n.x === 'number' && typeof n.y === 'number') {
          nextPositions[n.id] = { x: n.x, y: n.y };
        }
      });

      const targetTabId = activeTab.id;
      const previousLayout = activeLayout;

      set((state) => ({
        activeLayout: layoutType,
        viewportFitNonce: state.viewportFitNonce + 1,
        tabs: state.tabs.map((t) =>
          t.id === targetTabId
            ? { ...t, snapshot: { ...t.snapshot, activeLayout: layoutType, nodePositions: nextPositions } }
            : t
        ),
      }));

      get().executeCommand({
        id: `layout-tab-${targetTabId}-${layoutType}-${Date.now()}`,
        description: `Disposition de l'onglet : ${layoutType}`,
        undo: () => {
          set({
            activeLayout: get().activeTabId === targetTabId ? previousLayout : get().activeLayout,
            tabs: get().tabs.map((t) =>
              t.id === targetTabId
                ? { ...t, snapshot: { ...t.snapshot, activeLayout: previousLayout, nodePositions: prevPositions } }
                : t
            ),
          });
        },
        redo: () => {
          set({
            activeLayout: get().activeTabId === targetTabId ? layoutType : get().activeLayout,
            tabs: get().tabs.map((t) =>
              t.id === targetTabId
                ? { ...t, snapshot: { ...t.snapshot, activeLayout: layoutType, nodePositions: nextPositions } }
                : t
            ),
          });
        },
      });
      return;
    }

    const previousNodes = nodes;
    const previousLayout = activeLayout;
    const updatedNodes = computeGraphLayout(nodes, edges, layoutType, undefined, pinnedNodeIds);

    set((state) => ({
      nodes: updatedNodes,
      activeLayout: layoutType,
      viewportFitNonce: state.viewportFitNonce + 1,
    }));

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

  setCanvasToolMode: (mode) => {
    set({ canvasToolMode: mode, isLinkMode: false, linkSourceNodeId: null });
  },

  setLinkMode: (active) => {
    set({ isLinkMode: active, linkSourceNodeId: null });
  },

  setLinkSourceNodeId: (id) => {
    set({ linkSourceNodeId: id });
  },

  stepEscapeLinkMode: () => {
    const state = get();
    if (state.isLinkMode) {
      if (state.linkSourceNodeId !== null) {
        set({ linkSourceNodeId: null });
        return 'cleared_source';
      }
      set({ isLinkMode: false, linkSourceNodeId: null });
      return 'exited_link_mode';
    }
    state.clearSelection();
    return 'cleared_selection';
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
    const finalConf = typeof confidence === 'number' ? confidence : 1.0;
    const finalLayer: LayerId = layer || (finalConf >= 1.0 ? 'VERIFIED' : 'HYPOTHESIS');

    const tempEdgeId = `edge-manual-${Date.now()}`;
    const newEdge: GraphEdge = {
      id: tempEdgeId,
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
    const nextActiveLayers = new Set(get().activeLayers);
    nextActiveLayers.add(finalLayer);

    set({
      edges: [...previousEdges, newEdge],
      activeLayers: nextActiveLayers,
      isLinkMode: true,
      linkSourceNodeId: null,
      selectedEdgeId: newEdge.id,
    });

    get().executeCommand({
      id: `create-manual-edge-${newEdge.id}`,
      description: `Créer liaison : ${sourceNode.label} -> ${targetNode.label} (${finalType})`,
      undo: () => {
        set({
          edges: get().edges.filter((e) => e.id !== newEdge.id && e.id !== tempEdgeId),
        });
      },
      redo: () => {
        set({ edges: [...get().edges, newEdge] });
      },
    });

    // Persist newly created manual edge to backend PostgreSQL / Neo4j
    const activeCase = get().activeCase;
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (
      activeCase &&
      uuidRegex.test(sourceId) &&
      uuidRegex.test(targetId) &&
      typeof fetch === 'function'
    ) {
      fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/edges`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          type: finalType,
          source_id: sourceId,
          target_id: targetId,
          layer: finalLayer,
          confidence: finalConf,
          allow_custom_relation: true,
          properties: { label: notes || finalType },
        }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((savedEdge: GraphEdge | null) => {
          if (!savedEdge || !savedEdge.id) return;
          newEdge.id = savedEdge.id;
          set((state) => ({
            edges: state.edges.map((e) =>
              e.id === tempEdgeId
                ? {
                    ...e,
                    id: savedEdge.id,
                    layer: (savedEdge.layer as LayerId) || e.layer,
                    created_at: savedEdge.created_at,
                    updated_at: savedEdge.updated_at,
                  }
                : e
            ),
            selectedEdgeId:
              state.selectedEdgeId === tempEdgeId ? savedEdge.id : state.selectedEdgeId,
          }));
        })
        .catch(() => {
          // Keep optimistic edge visible even if network fails
        });
    }
  },

  updateNodePosition: (nodeId, x, y, recordHistory = false) => {
    const state = get();
    const target = state.nodes.find((n) => n.id === nodeId);
    if (!target) return;

    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);
    if (activeTab?.kind === 'actor_sphere') {
      const targetTabId = activeTab.id;
      const prevTabPositions = activeTab.snapshot.nodePositions ?? {};
      const oldPos = prevTabPositions[nodeId] ?? { x: target.x ?? 0, y: target.y ?? 0 };
      const nextPositions = { ...prevTabPositions, [nodeId]: { x, y } };

      set({
        tabs: state.tabs.map((t) =>
          t.id === targetTabId
            ? { ...t, snapshot: { ...t.snapshot, nodePositions: nextPositions } }
            : t
        ),
      });

      if (recordHistory && (oldPos.x !== x || oldPos.y !== y)) {
        get().executeCommand({
          id: `move-tab-${targetTabId}-${nodeId}-${Date.now()}`,
          description: `Déplacement de ${target.label}`,
          undo: () => {
            set({
              tabs: get().tabs.map((t) =>
                t.id === targetTabId
                  ? {
                      ...t,
                      snapshot: {
                        ...t.snapshot,
                        nodePositions: { ...(t.snapshot.nodePositions ?? {}), [nodeId]: oldPos },
                      },
                    }
                  : t
              ),
            });
          },
          redo: () => {
            set({
              tabs: get().tabs.map((t) =>
                t.id === targetTabId
                  ? {
                      ...t,
                      snapshot: {
                        ...t.snapshot,
                        nodePositions: { ...(t.snapshot.nodePositions ?? {}), [nodeId]: { x, y } },
                      },
                    }
                  : t
              ),
            });
          },
        });
      }
      return;
    }

    const oldX = target.x ?? 0;
    const oldY = target.y ?? 0;

    set({
      nodes: state.nodes.map((n) => (n.id === nodeId ? { ...n, x, y } : n)),
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

  updateActiveTabNodePositions: (posMap) => {
    if (posMap.size === 0) return;
    const state = get();
    const activeTab = state.tabs.find((t) => t.id === state.activeTabId);

    if (activeTab?.kind === 'actor_sphere') {
      const nextPositions: Record<string, { x: number; y: number }> = {
        ...(activeTab.snapshot.nodePositions ?? {}),
      };
      posMap.forEach((pos, id) => {
        nextPositions[id] = { x: pos.x, y: pos.y };
      });
      set({
        tabs: state.tabs.map((t) =>
          t.id === activeTab.id
            ? { ...t, snapshot: { ...t.snapshot, nodePositions: nextPositions } }
            : t
        ),
      });
      return;
    }

    set({
      nodes: state.nodes.map((n) => {
        const pos = posMap.get(n.id);
        return pos ? { ...n, x: pos.x, y: pos.y } : n;
      }),
    });
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

  changeNodeLayer: async (nodeId, nextLayer, reason) => {
    const state = get();
    const target = state.nodes.find((n) => n.id === nodeId);
    if (!target || target.layer === nextLayer) return;

    const prevLayer = target.layer;
    set((prev) => {
      const nextLayers = new Set(prev.activeLayers);
      nextLayers.add(nextLayer);
      return {
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, layer: nextLayer } : n)),
        activeLayers: nextLayers,
      };
    });

    const activeCase = state.activeCase;
    if (!activeCase || nodeId.startsWith('node-opt-') || nodeId.startsWith('temp-')) return;

    const effectiveReason =
      reason?.trim() || `Changement direct de calque vers ${nextLayer} par l'enquêteur`;
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}/layer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          new_layer: nextLayer,
          reason: effectiveReason,
        }),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      set((prev) => ({
        nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, layer: prevLayer } : n)),
      }));
      throw err;
    }
  },

  openIngestionPopover: (nodeId) => {
    set({ activeIngestionPopoverNodeId: nodeId });
  },

  closeIngestionPopover: () => {
    set({ activeIngestionPopoverNodeId: null });
  },

  registerTabAddedNode: (nodeId) => {
    set((state) => {
      const updatedTabs = state.tabs.map((t) => {
        if (t.id !== state.activeTabId) return t;
        const prevIds = t.snapshot.addedNodeIds ?? [];
        if (prevIds.includes(nodeId)) return t;
        return {
          ...t,
          snapshot: {
            ...t.snapshot,
            addedNodeIds: [...prevIds, nodeId],
          },
        };
      });
      return { tabs: updatedTabs };
    });
  },

  reconcileOptimisticNodeId: (tempId, savedNode) => {
    set((state) => {
      const nextForcedVisible = new Set(state.forcedVisibleNodeLabelIds);
      if (nextForcedVisible.has(tempId)) {
        nextForcedVisible.delete(tempId);
        nextForcedVisible.add(savedNode.id);
      }
      const nextExpanded = new Set(state.expandedHiddenNodeIds);
      if (nextExpanded.has(tempId)) {
        nextExpanded.delete(tempId);
        nextExpanded.add(savedNode.id);
      }
      return {
        nodes: state.nodes.map((n) => {
          if (n.id !== tempId) return n;
          const preservedX = typeof n.x === 'number' ? n.x : savedNode.x;
          const preservedY = typeof n.y === 'number' ? n.y : savedNode.y;
          return {
            ...n,
            ...savedNode,
            ...(typeof preservedX === 'number' ? { x: preservedX } : {}),
            ...(typeof preservedY === 'number' ? { y: preservedY } : {}),
          };
        }),
        edges: state.edges.map((e) => ({
          ...e,
          source_id: e.source_id === tempId ? savedNode.id : e.source_id,
          target_id: e.target_id === tempId ? savedNode.id : e.target_id,
        })),
        selectedNodeId: state.selectedNodeId === tempId ? savedNode.id : state.selectedNodeId,
        selectedNodeIds: state.selectedNodeIds.map((id) => (id === tempId ? savedNode.id : id)),
        forcedVisibleNodeLabelIds: nextForcedVisible,
        expandedHiddenNodeIds: nextExpanded,
        activeIngestionPopoverNodeId:
          state.activeIngestionPopoverNodeId === tempId ? savedNode.id : state.activeIngestionPopoverNodeId,
        tabs: state.tabs.map((t) => {
          const added = t.snapshot.addedNodeIds;
          const nextAdded = added ? added.map((id) => (id === tempId ? savedNode.id : id)) : undefined;
          let nextPositions = t.snapshot.nodePositions;
          if (nextPositions && tempId in nextPositions) {
            const { [tempId]: tempPos, ...rest } = nextPositions;
            nextPositions = tempPos ? { ...rest, [savedNode.id]: tempPos } : rest;
          }
          return {
            ...t,
            snapshot: {
              ...t.snapshot,
              selectedNodeId: t.snapshot.selectedNodeId === tempId ? savedNode.id : t.snapshot.selectedNodeId,
              ...(nextAdded ? { addedNodeIds: nextAdded } : {}),
              ...(nextPositions ? { nodePositions: nextPositions } : {}),
            },
          };
        }),
      };
    });
  },

  updateNodeAnalysisConfig: (nodeId, config) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          properties: {
            ...n.properties,
            ...(config.selected_plugins !== undefined ? { selected_plugins: config.selected_plugins } : {}),
            ...(config.process_tree !== undefined ? { process_tree: config.process_tree } : {}),
          },
        };
      }),
    }));
  },

  triggerNodeInvestigation: async (nodeId, mode, stageLabel) => {
    const state = get();
    const target = state.nodes.find((n) => n.id === nodeId);
    if (!target) return;

    const initialProgress = mode === 'quick' ? 15 : mode === 'step_by_step' ? 10 : 5;
    const nextProperties = {
      ...target.properties,
      investigation_status: 'active_investigation',
      analysis_mode: mode,
      analysis_progress: initialProgress,
      analysis_stage: stageLabel,
      investigation_started_at: new Date().toISOString(),
    };

    set((prev) => ({
      nodes: prev.nodes.map((n) => (n.id === nodeId ? { ...n, properties: nextProperties } : n)),
      activeIngestionPopoverNodeId:
        prev.activeIngestionPopoverNodeId === nodeId ? null : prev.activeIngestionPopoverNodeId,
    }));

    const activeCase = get().activeCase;
    if (activeCase && !nodeId.startsWith('temp-') && !nodeId.startsWith('node-file-')) {
      try {
        await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes/${nodeId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': 'investigator_front',
          },
          body: JSON.stringify({
            properties: nextProperties,
            reason: `Initialisation mode d'investigation (${mode}) — Phase 1 surface UI`,
          }),
        });
      } catch (err) {
        console.error('Erreur mise à jour mode investigation:', err);
      }
    }
  },

  uploadPdfForNode: async (nodeId, file) => {
    const activeCase = get().activeCase;
    const target = get().nodes.find((n) => n.id === nodeId);
    if (!activeCase || !target || nodeId.startsWith('temp-') || nodeId.startsWith('node-file-')) {
      return;
    }
    const clientSha =
      typeof target.properties?.client_sha256 === 'string'
        ? target.properties.client_sha256
        : undefined;
    const uploaded = await uploadNodePdf(activeCase.id, nodeId, file, clientSha);
    const metaKey = uploaded.mime_type === 'text/html' ? 'html_metadata' : 'pdf_metadata';
    set((prev) => ({
      nodes: prev.nodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              properties: {
                ...n.properties,
                evidence_file_id: uploaded.evidence_file_id,
                server_sha256: uploaded.sha256,
                sha256_verified: true,
                evidence_metadata: uploaded.metadata,
                [metaKey]: uploaded.metadata,
                blackboard_sync_status: uploaded.blackboard_sync_status,
              },
            }
          : n
      ),
    }));
  },

  runPdfExtraction: async (nodeId, mode, selectedTools) => {
    const state = get();
    const activeCase = state.activeCase;
    const target = state.nodes.find((n) => n.id === nodeId);
    if (!activeCase || !target) return;
    if (nodeId.startsWith('temp-') || nodeId.startsWith('node-file-')) {
      throw new Error("Le scellé est en cours d'enregistrement sur le serveur, réessayez dans un instant.");
    }

    set({ extractionLoadingNodeId: nodeId });
    try {
      if (!target.properties?.server_sha256) {
        const local = getLocalFileEntry(
          nodeId,
          typeof target.properties?.client_sha256 === 'string'
            ? target.properties.client_sha256
            : undefined
        );
        if (local?.file) {
          await get().uploadPdfForNode(nodeId, local.file);
        }
      }

      const initialRes = await startNodeExtraction(activeCase.id, nodeId, mode, selectedTools);
      set((prev) => applyNodeExtractionPatch(prev, nodeId, initialRes, mode));
      let currentRun = initialRes.latest_run;

      // Mode 2 ("Analyse Complète") runs all 3 progressive SPI stages smoothly (33% -> 66% -> 100%)
      let stepGuard = 0;
      while (
        mode === 'step_by_step' &&
        stepGuard < 3 &&
        currentRun &&
        currentRun.status === 'WAITING_HUMAN' &&
        currentRun.current_stage < currentRun.total_stages
      ) {
        stepGuard += 1;
        const nextRes = await advanceExtractionStage(activeCase.id, currentRun.id);
        set((prev) => applyNodeExtractionPatch(prev, nodeId, nextRes, mode));
        currentRun = nextRes.latest_run;
      }
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  advancePdfStage: async (nodeId, runId) => {
    const activeCase = get().activeCase;
    if (!activeCase) return;
    set({ extractionLoadingNodeId: nodeId });
    try {
      const res = await advanceExtractionStage(activeCase.id, runId);
      set((prev) => applyNodeExtractionPatch(prev, nodeId, res));
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  completeAllPdfStages: async (nodeId) => {
    const state = get();
    const activeCase = state.activeCase;
    const target = state.nodes.find((n) => n.id === nodeId);
    if (!activeCase || !target) return;

    await get().loadNodeCandidates(nodeId);
    let currentRun = get().extractionRunsByNodeId[nodeId] ?? null;

    if (
      currentRun &&
      currentRun.mode === 'step_by_step' &&
      currentRun.status === 'WAITING_HUMAN' &&
      currentRun.current_stage < currentRun.total_stages
    ) {
      let stepGuard = 0;
      while (
        stepGuard < 3 &&
        currentRun &&
        currentRun.status === 'WAITING_HUMAN' &&
        currentRun.current_stage < currentRun.total_stages
      ) {
        stepGuard += 1;
        await get().advancePdfStage(nodeId, currentRun.id);
        currentRun = get().extractionRunsByNodeId[nodeId] ?? null;
      }
      return;
    }

    const selectedTools = Array.isArray(target.properties?.selected_plugins)
      ? (target.properties.selected_plugins as string[])
      : [];
    await get().runPdfExtraction(nodeId, 'step_by_step', selectedTools);
  },

  loadNodeCandidates: async (nodeId) => {
    const activeCase = get().activeCase;
    if (!activeCase || nodeId.startsWith('temp-') || nodeId.startsWith('node-file-')) return;
    const res = await fetchNodeCandidates(activeCase.id, nodeId);
    set((prev) => ({
      extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [nodeId]: res.latest_run },
      candidatesByNodeId: { ...prev.candidatesByNodeId, [nodeId]: res.candidates },
      relationsByNodeId: { ...prev.relationsByNodeId, [nodeId]: res.relations ?? [] },
    }));
  },

  loadCaseIngestionSummary: async (caseId) => {
    const res = await fetchCaseIngestionSummary(caseId);
    // Guard against stale response if user already switched case
    if (get().activeCase?.id && get().activeCase?.id !== caseId) return;
    set({
      extractionRunsByNodeId: res.runs_by_node_id ?? {},
      candidatesByNodeId: res.candidates_by_node_id ?? {},
      relationsByNodeId: res.relations_by_node_id ?? {},
    });
  },

  validateCandidates: async (nodeId, payload) => {
    const activeCase = get().activeCase;
    if (!activeCase) return 0;
    set({ extractionLoadingNodeId: nodeId });
    try {
      const preState = get();
      const prePending = (preState.candidatesByNodeId[nodeId] ?? []).filter(
        (c) => c.validation_status === 'PENDING'
      );
      const activeTab = preState.tabs.find((t) => t.id === preState.activeTabId);
      const focalTabPos =
        activeTab?.kind === 'actor_sphere' ? activeTab.snapshot.nodePositions?.[nodeId] : undefined;
      const focalNode = preState.nodes.find((n) => n.id === nodeId);
      const focalX = focalTabPos?.x ?? focalNode?.x ?? 600;
      const focalY = focalTabPos?.y ?? focalNode?.y ?? 420;
      const prePosByCandId = new Map<string, { x: number; y: number }>();
      prePending.forEach((c, idx) => {
        const ghostId = `cand:${c.id}`;
        const existingPos = preState.candidatePositions[ghostId];
        prePosByCandId.set(
          c.id,
          existingPos ?? computeDefaultCandidatePosition(focalX, focalY, idx, prePending.length)
        );
      });

      const res = await validateNodeCandidates(activeCase.id, nodeId, payload);
      const rawNewNodes = res.created_nodes as unknown as GraphNode[];
      const newEdges = res.created_edges as unknown as GraphEdge[];

      const candIdByPromotedId = new Map<string, string>();
      (res.updated_candidates ?? []).forEach((u) => {
        if (u.promoted_node_id) candIdByPromotedId.set(u.promoted_node_id, u.id);
      });

      const promotedPosMap = new Map<string, { x: number; y: number }>();
      const newNodes = rawNewNodes.map((n) => {
        const matchedCandId =
          candIdByPromotedId.get(n.id) ??
          prePending.find((c) => c.entity_type === n.type && c.label === n.label)?.id;
        const prePos = matchedCandId ? prePosByCandId.get(matchedCandId) : undefined;
        if (!prePos) return n;
        promotedPosMap.set(n.id, prePos);
        return { ...n, x: prePos.x, y: prePos.y };
      });

      if (newNodes.length > 0 || newEdges.length > 0) {
        get().mergeExpandedNodes(newNodes, newEdges);
        const involvedNodeIds = new Set<string>();
        newNodes.forEach((n) => involvedNodeIds.add(n.id));
        newEdges.forEach((e) => {
          involvedNodeIds.add(e.source_id);
          involvedNodeIds.add(e.target_id);
        });
        involvedNodeIds.forEach((id) => get().registerTabAddedNode(id));
        if (promotedPosMap.size > 0) {
          get().updateActiveTabNodePositions(promotedPosMap);
        }
        set((prev) => {
          const nextExpanded = new Set(prev.expandedHiddenNodeIds);
          const nextLabels = new Set(prev.forcedVisibleNodeLabelIds);
          const nextLayers = new Set(prev.activeLayers);
          newNodes.forEach((n) => {
            nextExpanded.add(n.id);
            nextLabels.add(n.id);
            nextLayers.add(n.layer);
          });
          newEdges.forEach((e) => {
            nextExpanded.add(e.source_id);
            nextExpanded.add(e.target_id);
            nextLayers.add(e.layer);
          });
          return {
            expandedHiddenNodeIds: nextExpanded,
            forcedVisibleNodeLabelIds: nextLabels,
            activeLayers: nextLayers,
          };
        });
      }

      const refreshed = await fetchNodeCandidates(activeCase.id, nodeId);
      set((prev) => {
        const nextCandPositions: Record<string, { x: number; y: number }> = { ...prev.candidatePositions };
        const removeIds = new Set<string>();
        prePending.forEach((c) => {
          const stillPending = refreshed.candidates.some(
            (rc) => rc.id === c.id && rc.validation_status === 'PENDING'
          );
          const ghostId = `cand:${c.id}`;
          if (stillPending) {
            const frozen = prePosByCandId.get(c.id);
            if (frozen && !nextCandPositions[ghostId]) {
              nextCandPositions[ghostId] = frozen;
            }
          } else {
            removeIds.add(ghostId);
          }
        });
        const cleanedCandPositions = removeIds.size
          ? Object.fromEntries(Object.entries(nextCandPositions).filter(([k]) => !removeIds.has(k)))
          : nextCandPositions;
        return {
          extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [nodeId]: refreshed.latest_run },
          candidatesByNodeId: { ...prev.candidatesByNodeId, [nodeId]: refreshed.candidates },
          relationsByNodeId: { ...prev.relationsByNodeId, [nodeId]: refreshed.relations ?? [] },
          candidatePositions: cleanedCandPositions,
          selectedCandidateId: null,
          nodes: prev.nodes.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  properties: {
                    ...n.properties,
                    pending_candidates_count: res.pending_remaining,
                    pending_relations_count:
                      refreshed.relation_counts?.pending ??
                      (refreshed.relations ?? []).filter((r) => r.validation_status === 'PENDING').length,
                  },
                }
              : n
          ),
        };
      });

      return res.processed_count;
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  updateExtractedCandidate: async (sourceNodeId, candidateId, payload) => {
    const activeCase = get().activeCase;
    if (!activeCase) return;
    set({ extractionLoadingNodeId: sourceNodeId });
    try {
      const updated = await updateNodeCandidate(activeCase.id, candidateId, payload);
      set((prev) => ({
        extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [sourceNodeId]: updated.latest_run },
        candidatesByNodeId: { ...prev.candidatesByNodeId, [sourceNodeId]: updated.candidates },
        relationsByNodeId: { ...prev.relationsByNodeId, [sourceNodeId]: updated.relations ?? [] },
      }));
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  updateExtractedRelation: async (sourceNodeId, relationId, payload) => {
    const activeCase = get().activeCase;
    if (!activeCase) return;
    set({ extractionLoadingNodeId: sourceNodeId });
    try {
      const updated = await updateNodeRelation(activeCase.id, relationId, payload);
      set((prev) => ({
        extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [sourceNodeId]: updated.latest_run },
        candidatesByNodeId: { ...prev.candidatesByNodeId, [sourceNodeId]: updated.candidates },
        relationsByNodeId: { ...prev.relationsByNodeId, [sourceNodeId]: updated.relations ?? [] },
      }));
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  deleteExtractedRelation: async (sourceNodeId, relationId) => {
    const activeCase = get().activeCase;
    if (!activeCase) return;
    set({ extractionLoadingNodeId: sourceNodeId });
    try {
      const updated = await deleteNodeRelation(activeCase.id, relationId);
      set((prev) => ({
        extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [sourceNodeId]: updated.latest_run },
        candidatesByNodeId: { ...prev.candidatesByNodeId, [sourceNodeId]: updated.candidates },
        relationsByNodeId: { ...prev.relationsByNodeId, [sourceNodeId]: updated.relations ?? [] },
        nodes: prev.nodes.map((n) =>
          n.id === sourceNodeId
            ? {
                ...n,
                properties: {
                  ...n.properties,
                  pending_relations_count: updated.relation_counts?.pending ?? 0,
                },
              }
            : n
        ),
      }));
    } finally {
      set({ extractionLoadingNodeId: null });
    }
  },

  validateRelations: async (nodeId, payload) => {
    const activeCase = get().activeCase;
    if (!activeCase) return 0;
    set({ extractionLoadingNodeId: nodeId });
    try {
      const preState = get();
      const prePending = (preState.candidatesByNodeId[nodeId] ?? []).filter(
        (c) => c.validation_status === 'PENDING'
      );
      const activeTab = preState.tabs.find((t) => t.id === preState.activeTabId);
      const focalTabPos =
        activeTab?.kind === 'actor_sphere' ? activeTab.snapshot.nodePositions?.[nodeId] : undefined;
      const focalNode = preState.nodes.find((n) => n.id === nodeId);
      const focalX = focalTabPos?.x ?? focalNode?.x ?? 600;
      const focalY = focalTabPos?.y ?? focalNode?.y ?? 420;
      const prePosByCandId = new Map<string, { x: number; y: number }>();
      prePending.forEach((c, idx) => {
        const ghostId = `cand:${c.id}`;
        const existingPos = preState.candidatePositions[ghostId];
        prePosByCandId.set(
          c.id,
          existingPos ?? computeDefaultCandidatePosition(focalX, focalY, idx, prePending.length)
        );
      });

      const res = await validateNodeRelations(activeCase.id, nodeId, payload);
      const refreshed = await fetchNodeCandidates(activeCase.id, nodeId);

      const candIdByPromotedId = new Map<string, string>();
      refreshed.candidates.forEach((c) => {
        if (c.promoted_node_id) candIdByPromotedId.set(c.promoted_node_id, c.id);
      });

      const rawNewNodes = res.created_nodes as unknown as GraphNode[];
      const newEdges = res.created_edges as unknown as GraphEdge[];
      const promotedPosMap = new Map<string, { x: number; y: number }>();
      const newNodes = rawNewNodes.map((n) => {
        const matchedCandId =
          candIdByPromotedId.get(n.id) ??
          prePending.find((c) => c.entity_type === n.type && c.label === n.label)?.id;
        const prePos = matchedCandId ? prePosByCandId.get(matchedCandId) : undefined;
        if (!prePos) return n;
        promotedPosMap.set(n.id, prePos);
        return { ...n, x: prePos.x, y: prePos.y };
      });

      if (newNodes.length > 0 || newEdges.length > 0) {
        get().mergeExpandedNodes(newNodes, newEdges);
        const involvedNodeIds = new Set<string>();
        newNodes.forEach((n) => involvedNodeIds.add(n.id));
        newEdges.forEach((e) => {
          involvedNodeIds.add(e.source_id);
          involvedNodeIds.add(e.target_id);
        });
        involvedNodeIds.forEach((id) => get().registerTabAddedNode(id));
        if (promotedPosMap.size > 0) {
          get().updateActiveTabNodePositions(promotedPosMap);
        }
        set((prev) => {
          const nextExpanded = new Set(prev.expandedHiddenNodeIds);
          const nextLabels = new Set(prev.forcedVisibleNodeLabelIds);
          const nextLayers = new Set(prev.activeLayers);
          newNodes.forEach((n) => {
            nextExpanded.add(n.id);
            nextLabels.add(n.id);
            nextLayers.add(n.layer);
          });
          newEdges.forEach((e) => {
            nextExpanded.add(e.source_id);
            nextExpanded.add(e.target_id);
            nextLayers.add(e.layer);
          });
          return {
            expandedHiddenNodeIds: nextExpanded,
            forcedVisibleNodeLabelIds: nextLabels,
            activeLayers: nextLayers,
          };
        });
      }

      set((prev) => {
        const nextCandPositions: Record<string, { x: number; y: number }> = { ...prev.candidatePositions };
        const removeIds = new Set<string>();
        prePending.forEach((c) => {
          const stillPending = refreshed.candidates.some(
            (rc) => rc.id === c.id && rc.validation_status === 'PENDING'
          );
          const ghostId = `cand:${c.id}`;
          if (stillPending) {
            const frozen = prePosByCandId.get(c.id);
            if (frozen && !nextCandPositions[ghostId]) {
              nextCandPositions[ghostId] = frozen;
            }
          } else {
            removeIds.add(ghostId);
          }
        });
        const cleanedCandPositions = removeIds.size
          ? Object.fromEntries(Object.entries(nextCandPositions).filter(([k]) => !removeIds.has(k)))
          : nextCandPositions;
        return {
          extractionRunsByNodeId: { ...prev.extractionRunsByNodeId, [nodeId]: refreshed.latest_run },
          candidatesByNodeId: { ...prev.candidatesByNodeId, [nodeId]: refreshed.candidates },
          relationsByNodeId: { ...prev.relationsByNodeId, [nodeId]: refreshed.relations ?? [] },
          candidatePositions: cleanedCandPositions,
          nodes: prev.nodes.map((n) =>
            n.id === nodeId
              ? {
                  ...n,
                  properties: {
                    ...n.properties,
                    pending_candidates_count: refreshed.counts.pending ?? 0,
                    pending_relations_count: res.pending_relations_remaining,
                  },
                }
              : n
          ),
        };
      });

      return res.processed_count;
    } finally {
      set({ extractionLoadingNodeId: null });
    }
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
