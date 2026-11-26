import { describe, it, expect, beforeEach } from 'vitest';
import { useGraphStore } from '../store/useGraphStore';
import { computeTabScopedGraph } from '../utils/tabScope';
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
      isLinkMode: false,
      canvasToolMode: 'select',
      isImpactView: false,
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

  it('toggles all layers and individual layer visibility correctly', () => {
    // Default has 5 active layers
    expect(useGraphStore.getState().activeLayers.size).toBe(5);

    // Toggle off FLOWS
    useGraphStore.getState().toggleLayer('FLOWS');
    expect(useGraphStore.getState().activeLayers.has('FLOWS')).toBe(false);
    expect(useGraphStore.getState().activeLayers.size).toBe(4);

    // Toggle on FLOWS again
    useGraphStore.getState().toggleLayer('FLOWS');
    expect(useGraphStore.getState().activeLayers.has('FLOWS')).toBe(true);

    // Turn all off
    useGraphStore.getState().setAllLayers(false);
    expect(useGraphStore.getState().activeLayers.size).toBe(0);

    // Turn all on
    useGraphStore.getState().setAllLayers(true);
    expect(useGraphStore.getState().activeLayers.size).toBe(5);
  });

  it('manages link mode and creates manual edges with reversible undo/redo', () => {
    const nodeA: GraphNode = {
      id: 'node-link-1',
      case_id: 'case-test',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Suspect Alpha',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const nodeB: GraphNode = {
      id: 'node-link-2',
      case_id: 'case-test',
      type: 'telephone',
      layer: 'FLOWS',
      label: '+2135550199',
      confidence: 0.9,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
    };

    useGraphStore.setState({ nodes: [nodeA, nodeB], edges: [] });

    // Enable link mode
    useGraphStore.getState().setLinkMode(true);
    expect(useGraphStore.getState().isLinkMode).toBe(true);
    expect(useGraphStore.getState().linkSourceNodeId).toBeNull();

    useGraphStore.getState().setLinkSourceNodeId('node-link-1');
    expect(useGraphStore.getState().linkSourceNodeId).toBe('node-link-1');

    // Create edge between nodeA and nodeB
    useGraphStore.getState().createManualEdge('node-link-1', 'node-link-2');

    expect(useGraphStore.getState().edges).toHaveLength(1);
    expect(useGraphStore.getState().edges[0]?.source_id).toBe('node-link-1');
    expect(useGraphStore.getState().edges[0]?.target_id).toBe('node-link-2');
    expect(useGraphStore.getState().isLinkMode).toBe(true);
    expect(useGraphStore.getState().linkSourceNodeId).toBeNull();
    expect(useGraphStore.getState().undoStack).toHaveLength(1);

    // Undo edge creation
    useGraphStore.getState().undo();
    expect(useGraphStore.getState().edges).toHaveLength(0);
    expect(useGraphStore.getState().redoStack).toHaveLength(1);

    // Redo edge creation
    useGraphStore.getState().redo();
    expect(useGraphStore.getState().edges).toHaveLength(1);
  });

  it('manages Option A multi-tab workspace: init, deduplicate, independent snapshots, SSOT, and safe close', async () => {
    const amineNode: GraphNode = {
      id: 'amine-1',
      case_id: 'case-multi',
      type: 'personne',
      layer: 'HYPOTHESIS',
      label: 'Amine B. « Amine Import »',
      confidence: 0.9,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const otherNode: GraphNode = {
      id: 'karim-1',
      case_id: 'case-multi',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Karim Zerrouki',
      confidence: 1.0,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
    };

    useGraphStore.setState({ loadedTabsCaseId: null, tabs: [], activeTabId: 'master' });
    useGraphStore.getState().setGraphData({
      case_id: 'case-multi',
      is_impact_view: false,
      total_case_nodes: 2,
      total_case_edges: 0,
      nodes: [amineNode, otherNode],
      edges: [],
    });

    // Initializes master + default Amine B. suspect tab
    const initTabs = useGraphStore.getState().tabs;
    expect(initTabs).toHaveLength(2);
    expect(initTabs[0]?.id).toBe('master');
    expect(initTabs[0]?.closable).toBe(false);
    expect(initTabs[1]?.focalNodeId).toBe('amine-1');
    expect(useGraphStore.getState().activeTabId).toBe('master');

    // Open Karim tab & verify deduplication
    useGraphStore.getState().openActorTab('karim-1');
    expect(useGraphStore.getState().tabs).toHaveLength(3);
    const karimTabId = useGraphStore.getState().activeTabId;
    expect(karimTabId).toBe('tab-actor-karim-1');

    useGraphStore.getState().openActorTab('karim-1');
    expect(useGraphStore.getState().tabs).toHaveLength(3);

    // Customize viewport/layout/layers in Karim tab, then switch to master
    useGraphStore.getState().setViewport(120, -45, 1.4);
    useGraphStore.getState().applyLayout('concentric');
    useGraphStore.getState().toggleLayer('FLOWS');

    useGraphStore.getState().switchTab('master');
    expect(useGraphStore.getState().activeTabId).toBe('master');
    expect(useGraphStore.getState().viewport).toEqual({ panX: 0, panY: 0, zoom: 1 });
    expect(useGraphStore.getState().activeLayers.has('FLOWS')).toBe(true);
    expect(useGraphStore.getState().isPersonOnlyGraph).toBe(true);

    // Switch back to Karim tab: visual snapshot is restored
    useGraphStore.getState().switchTab(karimTabId);
    expect(useGraphStore.getState().viewport).toEqual({ panX: 120, panY: -45, zoom: 1.4 });
    expect(useGraphStore.getState().activeLayout).toBe('concentric');
    expect(useGraphStore.getState().activeLayers.has('FLOWS')).toBe(false);
    expect(useGraphStore.getState().isPersonOnlyGraph).toBe(false);

    // SSOT for domain data: update node label in Karim tab -> visible in master
    await useGraphStore.getState().updateNodeLabel('karim-1', 'Karim Zerrouki (Vérifié)');
    useGraphStore.getState().switchTab('master');
    const karimInMaster = useGraphStore.getState().nodes.find((n) => n.id === 'karim-1');
    expect(karimInMaster?.label).toBe('Karim Zerrouki (Vérifié)');

    // Master tab cannot be closed
    useGraphStore.getState().closeTab('master');
    expect(useGraphStore.getState().tabs.some((t) => t.id === 'master')).toBe(true);

    // Closing active actor tab falls back to master
    useGraphStore.getState().switchTab(karimTabId);
    useGraphStore.getState().closeTab(karimTabId);
    expect(useGraphStore.getState().activeTabId).toBe('master');
    expect(useGraphStore.getState().tabs.some((t) => t.id === karimTabId)).toBe(false);

    // Deleting focal node removes its open tab cleanly
    useGraphStore.getState().deleteNode('amine-1');
    expect(useGraphStore.getState().tabs.some((t) => t.focalNodeId === 'amine-1')).toBe(false);
  });

  it('switches canvas tool modes (select, pan) and keeps link mode synchronized', () => {
    expect(useGraphStore.getState().canvasToolMode).toBe('select');
    expect(useGraphStore.getState().isLinkMode).toBe(false);

    useGraphStore.getState().setLinkMode(true);
    expect(useGraphStore.getState().isLinkMode).toBe(true);

    // Switching to Hand (pan) exits link mode
    useGraphStore.getState().setCanvasToolMode('pan');
    expect(useGraphStore.getState().canvasToolMode).toBe('pan');
    expect(useGraphStore.getState().isLinkMode).toBe(false);

    // Switching to Pointer (select) exits link mode
    useGraphStore.getState().setLinkMode(true);
    useGraphStore.getState().setCanvasToolMode('select');
    expect(useGraphStore.getState().canvasToolMode).toBe('select');
    expect(useGraphStore.getState().isLinkMode).toBe(false);
  });

  it('toggles Vue Impact independently per tab without dropping store nodes', () => {
    const amineNode: GraphNode = {
      id: 'amine-impact',
      case_id: 'case-impact-tab',
      type: 'personne',
      layer: 'HYPOTHESIS',
      label: 'Amine B.',
      confidence: 0.9,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const phoneNode: GraphNode = {
      id: 'tel-impact',
      case_id: 'case-impact-tab',
      type: 'telephone',
      layer: 'OSINT_RAW',
      label: '+213 555 0100',
      confidence: 0.8,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
    };

    useGraphStore.setState({ loadedTabsCaseId: null, tabs: [], activeTabId: 'master' });
    useGraphStore.getState().setGraphData({
      case_id: 'case-impact-tab',
      is_impact_view: false,
      total_case_nodes: 2,
      total_case_edges: 0,
      nodes: [amineNode, phoneNode],
      edges: [],
    });

    // Enable Impact View on master
    useGraphStore.getState().toggleTabImpactView();
    expect(useGraphStore.getState().isImpactView).toBe(true);
    expect(useGraphStore.getState().nodes).toHaveLength(2);

    // Switch to Amine B. tab: its own Impact flag is still false
    const amineTab = useGraphStore.getState().tabs.find((t) => t.kind === 'actor_sphere');
    expect(amineTab).toBeDefined();
    if (!amineTab) return;
    useGraphStore.getState().switchTab(amineTab.id);
    expect(useGraphStore.getState().isImpactView).toBe(false);

    // Toggle Impact on Amine tab, then return to master -> both preserve independent state
    useGraphStore.getState().toggleTabImpactView();
    expect(useGraphStore.getState().isImpactView).toBe(true);
    useGraphStore.getState().switchTab('master');
    expect(useGraphStore.getState().isImpactView).toBe(true);
  });

  it('isolates node positions & layouts per actor_sphere tab without mutating master coordinates', () => {
    const amineNode: GraphNode = {
      id: 'amine-iso',
      case_id: 'case-iso',
      type: 'personne',
      layer: 'HYPOTHESIS',
      label: 'Amine B.',
      confidence: 0.9,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
      x: 2020,
      y: 660,
    };
    const outsiderNode: GraphNode = {
      id: 'outsider-iso',
      case_id: 'case-iso',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Outsider',
      confidence: 1.0,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
      x: 100,
      y: 100,
    };

    useGraphStore.setState({ loadedTabsCaseId: null, tabs: [], activeTabId: 'master' });
    useGraphStore.getState().setGraphData({
      case_id: 'case-iso',
      is_impact_view: false,
      total_case_nodes: 2,
      total_case_edges: 0,
      nodes: [amineNode, outsiderNode],
      edges: [],
    });

    const masterAmineBefore = useGraphStore.getState().nodes.find((n) => n.id === 'amine-iso');
    expect(masterAmineBefore?.x).toBe(460);
    expect(masterAmineBefore?.y).toBe(450);

    // Switch to Amine B. sphere tab -> computed isolated position is centered (600, 420)
    const amineTab = useGraphStore.getState().tabs.find((t) => t.kind === 'actor_sphere');
    expect(amineTab).toBeDefined();
    if (!amineTab) return;
    useGraphStore.getState().switchTab(amineTab.id);

    const activeAmineTab = useGraphStore.getState().tabs.find((t) => t.id === amineTab.id);
    expect(activeAmineTab?.snapshot.nodePositions?.['amine-iso']).toEqual({ x: 600, y: 420 });
    expect(activeAmineTab?.snapshot.nodePositions?.['outsider-iso']).toBeUndefined();

    // Drag Amine in actor tab -> updates tab's nodePositions only, master stays at (460, 450)
    useGraphStore.getState().updateNodePosition('amine-iso', 750, 510, true);
    const updatedTab = useGraphStore.getState().tabs.find((t) => t.id === amineTab.id);
    expect(updatedTab?.snapshot.nodePositions?.['amine-iso']).toEqual({ x: 750, y: 510 });
    const masterAmineAfter = useGraphStore.getState().nodes.find((n) => n.id === 'amine-iso');
    expect(masterAmineAfter?.x).toBe(460);
    expect(masterAmineAfter?.y).toBe(450);
  });

  it('Option B: registers raw dropped node in active actor tab, reconciles temp ID, and launches mode state', async () => {
    const amineNode: GraphNode = {
      id: 'amine-b',
      case_id: 'case-opt-b',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Amine B.',
      confidence: 0.9,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
      x: 400,
      y: 350,
    };

    useGraphStore.setState({
      loadedTabsCaseId: null,
      tabs: [],
      activeTabId: 'master',
      activeCase: null,
      activeIngestionPopoverNodeId: null,
    });
    useGraphStore.getState().setGraphData({
      case_id: 'case-opt-b',
      is_impact_view: false,
      total_case_nodes: 1,
      total_case_edges: 0,
      nodes: [amineNode],
      edges: [],
    });

    const amineTab = useGraphStore.getState().tabs.find((t) => t.kind === 'actor_sphere');
    expect(amineTab).toBeDefined();
    if (!amineTab) return;
    useGraphStore.getState().switchTab(amineTab.id);

    const tempDroppedNode: GraphNode = {
      id: 'node-file-temp-1',
      case_id: 'case-opt-b',
      type: 'scelle_numerique',
      layer: 'VERIFIED',
      label: '01_photo_suspect_exif.jpg',
      confidence: 1.0,
      provenance: 'LOCAL_FILE_DROP',
      properties: {
        investigation_status: 'pending_analysis',
        client_sha256: 'abc123',
      },
      latitude: null,
      longitude: null,
      x: 520,
      y: 410,
    };

    useGraphStore.getState().mergeExpandedNodes([tempDroppedNode], []);
    useGraphStore.getState().registerTabAddedNode('node-file-temp-1');
    useGraphStore.getState().openIngestionPopover('node-file-temp-1');

    expect(useGraphStore.getState().activeIngestionPopoverNodeId).toBe('node-file-temp-1');

    // Verify dropped node is visible inside isolated actor_sphere tab
    const stateMid = useGraphStore.getState();
    const activeTabMid = stateMid.tabs.find((t) => t.id === stateMid.activeTabId) ?? null;
    const scopedMid = computeTabScopedGraph(
      stateMid.nodes,
      stateMid.edges,
      activeTabMid,
      stateMid.activeLayers,
      false
    );
    expect(scopedMid.scopedNodes.some((n) => n.id === 'node-file-temp-1')).toBe(true);

    // Add forced label visibility on temp ID to verify label survives reconciliation
    useGraphStore.setState((prev) => ({
      forcedVisibleNodeLabelIds: new Set([...prev.forcedVisibleNodeLabelIds, 'node-file-temp-1']),
    }));

    // Reconcile optimistic ID with backend persisted ID
    useGraphStore.getState().reconcileOptimisticNodeId('node-file-temp-1', {
      ...tempDroppedNode,
      id: 'node-persisted-99',
    });

    expect(useGraphStore.getState().activeIngestionPopoverNodeId).toBe('node-persisted-99');
    expect(useGraphStore.getState().forcedVisibleNodeLabelIds.has('node-persisted-99')).toBe(true);
    const reconciledTab = useGraphStore.getState().tabs.find((t) => t.id === amineTab.id);
    expect(reconciledTab?.snapshot.addedNodeIds).toContain('node-persisted-99');

    // Update checkable tools & process tree config
    useGraphStore.getState().updateNodeAnalysisConfig('node-persisted-99', {
      selected_plugins: ['exiftool'],
      process_tree: { step_by_step: [{ id: 'step-1', labelFr: 'Custom', enabled: true, requiresValidation: true, pluginIds: ['exiftool'] }] },
    });
    const configuredNode = useGraphStore.getState().nodes.find((n) => n.id === 'node-persisted-99');
    expect(configuredNode?.properties?.selected_plugins).toEqual(['exiftool']);

    // Launch Mode 1 -> marks active_investigation and closes popover
    await useGraphStore
      .getState()
      .triggerNodeInvestigation('node-persisted-99', 'quick', 'Extraction rapide en attente (Moteur Phase 2)');

    expect(useGraphStore.getState().activeIngestionPopoverNodeId).toBeNull();
    const updatedNode = useGraphStore.getState().nodes.find((n) => n.id === 'node-persisted-99');
    expect(updatedNode?.properties?.investigation_status).toBe('active_investigation');
    expect(updatedNode?.properties?.analysis_mode).toBe('quick');
    expect(updatedNode?.properties?.analysis_progress).toBe(15);
  });

  it('executes atomic bulk deleteNodes with single-step undo/redo and pending modal state', () => {
    const n1: GraphNode = {
      id: 'bulk-1',
      case_id: 'case-bulk',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Suspect A',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const n2: GraphNode = {
      id: 'bulk-2',
      case_id: 'case-bulk',
      type: 'telephone',
      layer: 'FLOWS',
      label: '+213 555 0101',
      confidence: 0.9,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const n3: GraphNode = {
      id: 'bulk-3',
      case_id: 'case-bulk',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Suspect B',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const e12 = {
      id: 'e-1-2',
      case_id: 'case-bulk',
      source_id: 'bulk-1',
      target_id: 'bulk-2',
      type: 'POSSESSION',
      layer: 'FLOWS' as const,
      confidence: 0.9,
      provenance: 'MANUAL',
      properties: {},
    };
    const e23 = {
      id: 'e-2-3',
      case_id: 'case-bulk',
      source_id: 'bulk-2',
      target_id: 'bulk-3',
      type: 'APPELE',
      layer: 'FLOWS' as const,
      confidence: 0.9,
      provenance: 'MANUAL',
      properties: {},
    };

    useGraphStore.setState({
      activeCase: null,
      nodes: [n1, n2, n3],
      edges: [e12, e23],
      selectedNodeIds: ['bulk-1', 'bulk-3'],
      selectedNodeId: 'bulk-1',
      undoStack: [],
      redoStack: [],
      pendingDeleteNodeIds: null,
    });

    useGraphStore.getState().requestDeleteNodes(['bulk-1', 'bulk-3', 'bulk-1']);
    expect(useGraphStore.getState().pendingDeleteNodeIds).toEqual(['bulk-1', 'bulk-3']);

    useGraphStore.getState().deleteNodes(['bulk-1', 'bulk-2', 'bulk-3']);
    expect(useGraphStore.getState().nodes).toHaveLength(0);
    expect(useGraphStore.getState().edges).toHaveLength(0);
    expect(useGraphStore.getState().pendingDeleteNodeIds).toBeNull();
    expect(useGraphStore.getState().selectedNodeIds).toEqual([]);
    expect(useGraphStore.getState().undoStack).toHaveLength(1);

    // Single Undo restores all 3 nodes and 2 edges atomically
    useGraphStore.getState().undo();
    expect(useGraphStore.getState().nodes).toHaveLength(3);
    expect(useGraphStore.getState().edges).toHaveLength(2);
    expect(useGraphStore.getState().redoStack).toHaveLength(1);

    // Single Redo removes them again
    useGraphStore.getState().redo();
    expect(useGraphStore.getState().nodes).toHaveLength(0);
    expect(useGraphStore.getState().edges).toHaveLength(0);
  });

  it('implements two-step Escape in link creation mode: first clears selected node, second exits link mode', () => {
    useGraphStore.getState().setLinkMode(true);
    useGraphStore.getState().setLinkSourceNodeId('n1');
    expect(useGraphStore.getState().isLinkMode).toBe(true);
    expect(useGraphStore.getState().linkSourceNodeId).toBe('n1');

    // 1st Escape: clears source node but remains in link mode
    const firstStep = useGraphStore.getState().stepEscapeLinkMode();
    expect(firstStep).toBe('cleared_source');
    expect(useGraphStore.getState().linkSourceNodeId).toBeNull();
    expect(useGraphStore.getState().isLinkMode).toBe(true);

    // 2nd Escape: exits link mode cleanly
    const secondStep = useGraphStore.getState().stepEscapeLinkMode();
    expect(secondStep).toBe('exited_link_mode');
    expect(useGraphStore.getState().isLinkMode).toBe(false);
    expect(useGraphStore.getState().linkSourceNodeId).toBeNull();
  });
});
