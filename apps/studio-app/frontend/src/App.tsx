import { useEffect, useState, useCallback, useMemo } from 'react';
import { ShieldCheck, FileText, PanelRightOpen } from 'lucide-react';
import { useGraphStore } from './store/useGraphStore';
import { computeTabScopedGraph } from './utils/tabScope';
import {
  classifyFileTaxonomy,
  computeClientSha256,
  isIngestionModeLive,
  isStaticIngestionSupportedFile,
  sanitizeFileName,
} from './utils/fileIngestion';
import {
  rebindLocalFileNodeId,
  registerLocalFile,
  type LocalFileEntry,
} from './utils/localFileStore';
import type { GraphNode } from './types/graph';
import { DesktopMenuBar } from './components/menubar/DesktopMenuBar';
import { AppSubBar } from './components/menubar/AppSubBar';
import { GraphCanvasAdapter } from './components/canvas/GraphCanvasAdapter';
import { IngestionPopover } from './components/canvas/IngestionPopover';
import { WorkspaceTabsBar } from './components/canvas/WorkspaceTabsBar';
import { Toolbar, type ActiveViewMode } from './components/canvas/Toolbar';
import { ContextMenu } from './components/canvas/ContextMenu';
import { LayerChangeDialog } from './components/canvas/LayerChangeDialog';
import { hasOpenModal } from './components/common/ModalPortal';
import { AccessibleListView } from './components/canvas/AccessibleListView';
import { InspectorPanel } from './components/inspector/InspectorPanel';
import { LeftAccordion } from './components/toolbox/LeftAccordion';
import { SnaPanel } from './components/sna/SnaPanel';
import { MapView } from './components/views/MapView';
import { TimelineView } from './components/views/TimelineView';
import { AuditChainViewer } from './components/views/AuditChainViewer';
import { ExportDialog } from './components/views/ExportDialog';
import { CommandPalette } from './components/modals/CommandPalette';
import { ToolInfoModal, type ToolSpec } from './components/modals/ToolInfoModal';
import { CasePropertiesModal } from './components/modals/CasePropertiesModal';
import { PhaseNoticeModal } from './components/modals/PhaseNoticeModal';
import { AddNodeModal, type AddNodeData } from './components/modals/AddNodeModal';
import { NewCaseModal } from './components/modals/NewCaseModal';
import { OpenCaseModal } from './components/modals/OpenCaseModal';
import { FilePreviewModal } from './components/modals/FilePreviewModal';
import { DeleteNodesModal } from './components/modals/DeleteNodesModal';
import { useToast } from './context/ToastContext';
import { useI18n } from './context/I18nContext';
import type { CaseItem, GraphResponse } from './types/graph';
import { API_BASE } from './config';

export function App() {
  const toast = useToast();
  const { tr, trLabel } = useI18n();
  const {
    nodes,
    edges,
    activeCase,
    activeLayers,
    selectedNodeId,
    selectedNodeIds,
    selectedEdgeId,
    viewport,
    isImpactView,
    isLoading,
    setActiveCase,
    setGraphData,
    mergeExpandedNodes,
    setLoading,
    setError,
    selectNode,
    selectAllNodes,
    requestDeleteNodes,
    selectEdge,
    clearSelection,
    setViewport,
    resetViewport,
    updateNodePosition,
    openContextMenu,
    undo,
    redo,
    tabs,
    activeTabId,
    toggleTabImpactView,
    activeIngestionPopoverNodeId,
    openIngestionPopover,
    closeIngestionPopover,
    updateNodeAnalysisConfig,
    triggerNodeInvestigation,
    uploadPdfForNode,
    runPdfExtraction,
    openActorTab,
    registerTabAddedNode,
    reconcileOptimisticNodeId,
  } = useGraphStore();

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const { scopedNodes, scopedEdges } = useMemo(
    () => computeTabScopedGraph(nodes, edges, activeTab, activeLayers, isImpactView),
    [nodes, edges, activeTab, activeLayers, isImpactView]
  );

  const [activeView, setActiveView] = useState<ActiveViewMode>('graph');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSnaOpen, setIsSnaOpen] = useState(false);
  const [selectedSnaAlgo, setSelectedSnaAlgo] = useState<string>('betweenness');
  const [previewFileEntry, setPreviewFileEntry] = useState<LocalFileEntry | null>(null);

  const handleOpenSna = (algoKey?: string) => {
    if (algoKey) setSelectedSnaAlgo(algoKey);
    setIsSnaOpen(true);
  };

  // Resizable Panels State (Left Toolbox & Right Inspector)
  const [leftWidth, setLeftWidth] = useState(260);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [rightWidth, setRightWidth] = useState(340);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isCasePropsOpen, setIsCasePropsOpen] = useState(false);
  const [isToolInfoOpen, setIsToolInfoOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<ToolSpec | null>(null);
  const [isPhaseNoticeOpen, setIsPhaseNoticeOpen] = useState(false);
  const [phaseNoticeData, setPhaseNoticeData] = useState<{ name: string; phase: string }>({
    name: '',
    phase: 'Phase 2',
  });

  // Modal state for adding a new node with interactive form
  const [pendingAddNode, setPendingAddNode] = useState<{
    isOpen: boolean;
    type: string;
    position: { x: number; y: number } | null;
  }>({
    isOpen: false,
    type: 'personne',
    position: null,
  });

  // Modal states for Dossier workflows
  const [isNewCaseOpen, setIsNewCaseOpen] = useState(false);
  const [isOpenCaseModalOpen, setIsOpenCaseModalOpen] = useState(false);

  // Switch or reload active case
  const handleSelectCase = useCallback((selectedCase: CaseItem) => {
    try {
      window.localStorage.setItem('athar.activeCaseId', selectedCase.id);
    } catch {
      // Ignore storage quota / private mode errors
    }
    setActiveCase(selectedCase);
    setLoading(true);

    fetch(`${API_BASE}/api/v1/cases/${selectedCase.id}/graph?impact_only=false`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((graph: GraphResponse) => {
        setGraphData(graph);
        toast.success(`Dossier "${selectedCase.title}" (${selectedCase.code}) chargé.`, 'Dossier Ouvert');
      })
      .catch((err) => {
        console.error('[App] Failed to load case graph:', err);
        toast.error('Erreur lors du chargement du graphe du dossier.', 'Erreur Réseau');
        setLoading(false);
      });
  }, [setActiveCase, setGraphData, setLoading, toast]);

  // Handle newly created case
  const handleCaseCreated = useCallback((newCase: CaseItem) => {
    try {
      window.localStorage.setItem('athar.activeCaseId', newCase.id);
    } catch {
      // Ignore storage quota / private mode errors
    }
    setActiveCase(newCase);
    setGraphData({
      case_id: newCase.id,
      nodes: [],
      edges: [],
      is_impact_view: false,
      total_case_nodes: 0,
      total_case_edges: 0,
    });
  }, [setActiveCase, setGraphData]);

  // Handle saving case
  const handleSaveCase = useCallback(() => {
    if (!activeCase) return;
    toast.success(
      `Dossier "${activeCase.title}" (${activeCase.code}) scellé et enregistré avec succès dans PostgreSQL.`,
      'Enregistrement Conforme ISO 27037'
    );
  }, [activeCase, toast]);

  // Load cases and initial graph
  useEffect(() => {
    let isSubscribed = true;
    setLoading(true);

    fetch(`${API_BASE}/api/v1/cases`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((cases: CaseItem[]) => {
        if (!isSubscribed) return;
        if (cases.length > 0) {
          let savedCaseId: string | null = null;
          try {
            savedCaseId = window.localStorage.getItem('athar.activeCaseId');
          } catch {
            savedCaseId = null;
          }
          const mainCase =
            (savedCaseId ? cases.find((c) => c.id === savedCaseId) : undefined) ??
            cases.find((c) => c.code.includes('CANDY') || c.code.includes('ATHAR')) ??
            cases[0] ??
            null;
          if (mainCase) {
            try {
              window.localStorage.setItem('athar.activeCaseId', mainCase.id);
            } catch {
              // Ignore storage quota / private mode errors
            }
            setActiveCase(mainCase);

            return fetch(`${API_BASE}/api/v1/cases/${mainCase.id}/graph?impact_only=false`)
              .then((r) => r.json())
              .then((graphRes: GraphResponse) => {
                if (isSubscribed) {
                  setGraphData(graphRes);
                }
              });
          }
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          setError(err instanceof Error ? err.message : 'Erreur de chargement');
          setLoading(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [setActiveCase, setGraphData, setError, setLoading]);

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+Z, Ctrl+Y, Ctrl+A, Ctrl+E, etc.)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasOpenModal()) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        // Only select all if not focused in an input
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        selectAllNodes();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        setIsCasePropsOpen(true);
      } else if (e.key === '[') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        setLeftWidth((w) => Math.max(220, w - 24));
      } else if (e.key === ']') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        setLeftWidth((w) => Math.min(520, w + 24));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
        const idsToDelete =
          selectedNodeIds.length > 0 ? selectedNodeIds : selectedNodeId ? [selectedNodeId] : [];
        if (idsToDelete.length > 0) {
          e.preventDefault();
          requestDeleteNodes(idsToDelete);
        }
      } else if (e.key === 'Escape') {
        if (document.querySelector('[role="dialog"]')) return;
        useGraphStore.getState().stepEscapeLinkMode();
      } else if (!e.ctrlKey && !e.metaKey && !e.altKey && activeView === 'graph') {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
        const low = e.key.toLowerCase();
        if (low === 'v') {
          e.preventDefault();
          useGraphStore.getState().setCanvasToolMode('select');
        } else if (low === 'h') {
          e.preventDefault();
          useGraphStore.getState().setCanvasToolMode('pan');
        } else if (low === 'l') {
          e.preventDefault();
          const st = useGraphStore.getState();
          st.setLinkMode(!st.isLinkMode);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedNodeIds, activeView, undo, redo, selectAllNodes, requestDeleteNodes]);

  // Window mouse drag listener for adjusting left and right panel widths
  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, 220), 520);
        setLeftWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 290), 650);
        setRightWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Window resize listener to gracefully adapt panel widths on smaller displays
  useEffect(() => {
    const handleWindowResize = () => {
      const w = window.innerWidth;
      if (w < 1050) {
        setLeftWidth((prev) => Math.max(220, Math.min(prev, 230)));
        setRightWidth((prev) => Math.max(290, Math.min(prev, 300)));
      } else if (w < 1250) {
        setLeftWidth((prev) => Math.max(220, Math.min(prev, 240)));
        setRightWidth((prev) => Math.max(290, Math.min(prev, 315)));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Handle Impact View Toggle (scoped to the active investigation tab)
  const handleToggleImpactView = useCallback(() => {
    toggleTabImpactView();
  }, [toggleTabImpactView]);

  // Handle 1-hop or 2-hop Expansion (reveals hidden connections immediately + merges from backend)
  const handleExpand = useCallback(
    (hops: number) => {
      const store = useGraphStore.getState();
      const targetNodeId = store.contextMenu.targetNodeId || selectedNodeId;
      if (!targetNodeId) return;

      // 1. Immediately expand 1-hop / 2-hop neighborhood in local store & reveal hidden nodes
      const localRevealedCount = store.expandNodeNeighborhood(targetNodeId, hops);
      const targetNode = store.nodes.find((n) => n.id === targetNodeId);
      if (localRevealedCount > 0) {
        toast.info(
          tr('Voisinage à {hops} bond(s) développé : {n} entité(s) révélée(s) autour de {name}', {
            hops,
            n: localRevealedCount,
            name: targetNode ? trLabel(targetNode.label) : targetNodeId,
          }),
          tr('Exploration Réseau')
        );
      }

      if (!activeCase) return;
      setLoading(true);

      fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/graph/expand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          node_ids: [targetNodeId],
          hops: hops,
        }),
      })
        .then((r) => r.json())
        .then((expandedData: GraphResponse) => {
          if (expandedData && Array.isArray(expandedData.nodes)) {
            mergeExpandedNodes(expandedData.nodes, expandedData.edges || []);
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [activeCase, selectedNodeId, mergeExpandedNodes, setLoading, toast, tr, trLabel]
  );

  // Handle Add Node at Center
  const handleAddNodeAtCenter = useCallback((typeKey: string) => {
    setPendingAddNode({
      isOpen: true,
      type: typeKey,
      position: { x: 500, y: 350 },
    });
  }, []);

  // Handle Add Node Dropped at specific Canvas Coordinates
  const handleAddNodeAtPosition = useCallback((typeKey: string, x: number, y: number) => {
    setPendingAddNode({
      isOpen: true,
      type: typeKey,
      position: { x, y },
    });
  }, []);

  const handleConfirmAddNode = useCallback(
    (data: AddNodeData) => {
      if (!activeCase) return;
      setPendingAddNode((prev) => ({ ...prev, isOpen: false }));

      const tempId = `node-opt-${Date.now()}`;
      const optimisticNode: GraphNode = {
        id: tempId,
        case_id: activeCase.id,
        type: data.type,
        label: data.label,
        layer: data.layer || 'HYPOTHESIS',
        confidence: data.confidence,
        provenance: 'INVESTIGATOR_MANUAL',
        properties: data.properties || {},
        latitude: null,
        longitude: null,
        x: data.x,
        y: data.y,
        radius: 28,
      };

      // 1. Immediately inject onto canvas & select node (instant 0ms feedback)
      const storeBefore = useGraphStore.getState();
      const initialExpanded = new Set(storeBefore.expandedHiddenNodeIds);
      initialExpanded.add(tempId);
      const initialLayers = new Set(storeBefore.activeLayers);
      initialLayers.add(optimisticNode.layer);
      useGraphStore.setState({ expandedHiddenNodeIds: initialExpanded, activeLayers: initialLayers });

      mergeExpandedNodes([optimisticNode], []);
      registerTabAddedNode(tempId);
      updateNodePosition(tempId, data.x, data.y, false);
      selectNode(tempId);
      setIsInspectorOpen(true);
      toast.success(`Entité "${optimisticNode.label}" ajoutée au graphe`, "Création d'entité");

      // 2. Persist to backend in background
      fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          type: data.type,
          label: data.label,
          layer: data.layer,
          confidence: data.confidence,
          provenance: 'INVESTIGATOR_MANUAL',
          properties: data.properties,
        }),
      })
        .then(async (r) => {
          if (!r.ok) {
            const errJson = await r.json().catch(() => ({}));
            const msg = errJson.detail?.message || errJson.detail || `Erreur serveur (${r.status})`;
            throw new Error(msg);
          }
          return r.json();
        })
        .then((createdNode: GraphNode) => {
          if (!createdNode || !createdNode.id) return;
          const store = useGraphStore.getState();
          const curTab = store.tabs.find((t) => t.id === store.activeTabId);
          const tabPos =
            curTab?.kind === 'actor_sphere' ? curTab.snapshot.nodePositions?.[tempId] : undefined;
          const existingTemp = store.nodes.find((n) => n.id === tempId);
          createdNode.x = tabPos?.x ?? existingTemp?.x ?? data.x;
          createdNode.y = tabPos?.y ?? existingTemp?.y ?? data.y;
          if (data.layer) createdNode.layer = data.layer;

          const nextLayers = new Set(store.activeLayers);
          if (createdNode.layer) nextLayers.add(createdNode.layer);
          useGraphStore.setState({ activeLayers: nextLayers });

          reconcileOptimisticNodeId(tempId, createdNode);
        })
        .catch((err) => {
          console.error('Erreur création nœud:', err);
          // Rollback on failure
          const store = useGraphStore.getState();
          const rollExpanded = new Set(store.expandedHiddenNodeIds);
          rollExpanded.delete(tempId);
          useGraphStore.setState({
            nodes: store.nodes.filter((n) => n.id !== tempId),
            selectedNodeId: store.selectedNodeId === tempId ? null : store.selectedNodeId,
            expandedHiddenNodeIds: rollExpanded,
          });
          toast.error(err instanceof Error ? err.message : 'Erreur serveur', "Échec de création");
        });
    },
    [activeCase, mergeExpandedNodes, reconcileOptimisticNodeId, registerTabAddedNode, selectNode, toast, updateNodePosition]
  );

  const handleTriggerPhaseNotice = (name: string, phase: string) => {
    setPhaseNoticeData({ name, phase });
    setIsPhaseNoticeOpen(true);
  };

  const handleDropRawFiles = useCallback(
    async (files: FileList, canvasX?: number, canvasY?: number) => {
      if (!activeCase || !files || files.length === 0) return;

      const baseX =
        typeof canvasX === 'number'
          ? canvasX
          : Math.round((420 - viewport.panX) / Math.max(viewport.zoom, 0.2));
      const baseY =
        typeof canvasY === 'number'
          ? canvasY
          : Math.round((280 - viewport.panY) / Math.max(viewport.zoom, 0.2));

      const fileList = Array.from(files);
      for (let idx = 0; idx < fileList.length; idx += 1) {
        const file = fileList[idx];
        if (!file) continue;

        const cleanName = sanitizeFileName(file.name);
        const dropX = baseX + idx * 44;
        const dropY = baseY + idx * 36;
        const clientSha256 = await computeClientSha256(file);
        const taxonomy = classifyFileTaxonomy(cleanName, file.type);
        const tempId = `node-file-${Date.now()}-${idx}`;
        const mimeType = file.type || 'application/octet-stream';
        const entityType = taxonomy.expectedDerivedType || 'scelle_numerique';

        await registerLocalFile(tempId, clientSha256, file, taxonomy.family);

        const nodeProps: Record<string, unknown> = {
          file_name: cleanName,
          mime_type: mimeType,
          file_size_bytes: file.size,
          client_sha256: clientSha256,
          sha256_scope: 'phase1_local_preseal',
          is_raw_evidence: true,
          custom_icon: taxonomy.icon,
          selected_plugins: taxonomy.plugins.map((p) => p.id),
          detected_family: taxonomy.family,
          detected_family_label: taxonomy.labelFr,
          expected_derived_type: entityType,
          investigation_status: 'pending_analysis',
          analysis_mode: null,
          analysis_progress: 0,
          analysis_stage: "En attente du choix de mode par l'enquêteur",
        };

        const optimisticNode: GraphNode = {
          id: tempId,
          case_id: activeCase.id,
          type: entityType,
          label: cleanName,
          layer: 'VERIFIED',
          confidence: 1.0,
          provenance: 'LOCAL_FILE_DROP',
          properties: nodeProps,
          latitude: null,
          longitude: null,
          x: dropX,
          y: dropY,
          radius: 28,
        };

        const storeBefore = useGraphStore.getState();
        const nextExpanded = new Set(storeBefore.expandedHiddenNodeIds);
        nextExpanded.add(tempId);
        const nextLayers = new Set(storeBefore.activeLayers);
        nextLayers.add('VERIFIED');
        const nextForcedLabels = new Set(storeBefore.forcedVisibleNodeLabelIds);
        nextForcedLabels.add(tempId);
        useGraphStore.setState({
          expandedHiddenNodeIds: nextExpanded,
          activeLayers: nextLayers,
          forcedVisibleNodeLabelIds: nextForcedLabels,
        });

        mergeExpandedNodes([optimisticNode], []);
        registerTabAddedNode(tempId);
        updateNodePosition(tempId, dropX, dropY, false);
        selectNode(tempId, false);
        setIsInspectorOpen(true);
        if (idx === 0) {
          openIngestionPopover(tempId);
        }

        toast.success(
          tr('Scellé préliminaire "{name}" créé (SHA-256 local)', { name: cleanName }),
          tr('Ingestion de pièce brute')
        );

        fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/nodes`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Actor-Id': 'investigator_front',
          },
          body: JSON.stringify({
            type: entityType,
            label: cleanName,
            confidence: 1.0,
            provenance: 'LOCAL_FILE_DROP',
            properties: nodeProps,
          }),
        })
          .then(async (r) => {
            if (!r.ok) {
              const errJson = await r.json().catch(() => ({}));
              const msg = errJson.detail?.message || errJson.detail || `Erreur serveur (${r.status})`;
              throw new Error(msg);
            }
            return r.json();
          })
          .then((createdNode: GraphNode) => {
            if (!createdNode || !createdNode.id) return;
            const storeNow = useGraphStore.getState();
            const curTab = storeNow.tabs.find((t) => t.id === storeNow.activeTabId);
            const tabPos =
              curTab?.kind === 'actor_sphere' ? curTab.snapshot.nodePositions?.[tempId] : undefined;
            const existingTemp = storeNow.nodes.find((n) => n.id === tempId);
            createdNode.x = tabPos?.x ?? existingTemp?.x ?? dropX;
            createdNode.y = tabPos?.y ?? existingTemp?.y ?? dropY;
            createdNode.layer = createdNode.layer || 'VERIFIED';

            rebindLocalFileNodeId(tempId, createdNode.id);

            const layersNow = new Set(storeNow.activeLayers);
            layersNow.add(createdNode.layer);
            useGraphStore.setState({ activeLayers: layersNow });

            reconcileOptimisticNodeId(tempId, createdNode);

            if (isStaticIngestionSupportedFile(cleanName, mimeType)) {
              void uploadPdfForNode(createdNode.id, file).catch((uploadErr) => {
                console.error('Erreur téléversement pièce statique:', uploadErr);
              });
            }
          })
          .catch((err) => {
            console.error('Erreur création scellé brut:', err);
            toast.warning(
              err instanceof Error ? err.message : tr('Mode local temporaire (non persisté sur serveur)'),
              tr('Persistance scellé')
            );
          });
      }
    },
    [
      activeCase,
      viewport,
      mergeExpandedNodes,
      registerTabAddedNode,
      updateNodePosition,
      selectNode,
      openIngestionPopover,
      reconcileOptimisticNodeId,
      uploadPdfForNode,
      toast,
      tr,
    ]
  );

  const handleRunPlaybook = () => {
    toast.info(
      "Scénario d'enquête recommandé exécuté : 3 nouveaux indices dirigés vers la Boîte d'Arbitrage (Review-Run).",
      "Scénario Recommandé"
    );
  };

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* 1. Desktop Native Menu Bar (32px) */}
      <DesktopMenuBar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenCaseProps={() => setIsCasePropsOpen(true)}
        onNewCase={() => setIsNewCaseOpen(true)}
        onOpenCaseList={() => setIsOpenCaseModalOpen(true)}
        onSaveCase={handleSaveCase}
        onOpenToolInfo={(tool) => {
          setSelectedTool(tool);
          setIsToolInfoOpen(true);
        }}
        onTriggerPhaseNotice={handleTriggerPhaseNotice}
        onAddNode={handleAddNodeAtCenter}
        onSelectAll={selectAllNodes}
        onUndo={undo}
        onRedo={redo}
        onDeleteSelected={() => {
          const idsToDelete =
            selectedNodeIds.length > 0 ? selectedNodeIds : selectedNodeId ? [selectedNodeId] : [];
          if (idsToDelete.length > 0) requestDeleteNodes(idsToDelete);
        }}
        onResetZoom={resetViewport}
        onToggleSna={handleOpenSna}
        onRunPlaybook={handleRunPlaybook}
      />

      {/* 2. Secondary Sub-Bar (44px) */}
      <AppSubBar
        activeCase={activeCase}
        onOpenCaseProps={() => setIsCasePropsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onTriggerPhaseNotice={handleTriggerPhaseNotice}
      />

      {/* 2b. Full-Width View Switcher & Tab Actions Bar (Graphe, Carte SIG, Chronologie, Tableau, Audit, Exporter) */}
      <Toolbar
        section="header"
        activeView={activeView}
        onChangeView={setActiveView}
        isSnaOpen={isSnaOpen}
        onToggleSna={() => setIsSnaOpen((prev) => !prev)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleImpactView={handleToggleImpactView}
        onRunRecommendedScenario={handleRunPlaybook}
        onImportFiles={(files) => {
          void handleDropRawFiles(files);
        }}
      />

      {/* 2c. Full-Width Graph Sub-Toolbar (never clipped or hidden behind side panels) */}
      {activeView === 'graph' && (
        <Toolbar
          section="graph_subbar"
          activeView={activeView}
          onChangeView={setActiveView}
          isSnaOpen={isSnaOpen}
          onToggleSna={() => setIsSnaOpen((prev) => !prev)}
          onOpenExport={() => setIsExportOpen(true)}
          onToggleImpactView={handleToggleImpactView}
          onRunRecommendedScenario={handleRunPlaybook}
        />
      )}

      {/* 3. Main Workspace Area: Left Panel + Center Stage + Right Inspector */}
      <main
        className={`main-workspace ${isResizingLeft || isResizingRight ? 'is-panel-resizing' : ''}`}
        style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}
      >
        {/* Left Toolbox and Layers Accordion (resizable & collapsible) */}
        <LeftAccordion
          style={{ width: `${leftWidth}px`, flexShrink: 0 }}
          isCollapsed={isLeftCollapsed}
          onToggleCollapse={() => setIsLeftCollapsed((prev) => !prev)}
          onAddNodeAtCenter={handleAddNodeAtCenter}
          onOpenAuditViewer={() => setActiveView('audit')}
          onFilterCategory={(cat) => {
            if (cat === 'all') {
              clearSelection();
            } else {
              const typeMap: Record<string, string[]> = {
                phone: ['telephone', 'carte_sim', 'appareil_mobile', 'telecom_cdr'],
                social: ['compte_social', 'publication_sociale', 'canal_telegram', 'message_chat'],
                web: ['site_web', 'serveur_c2', 'identifiant_infrastructure', 'fichier_apk'],
                person: ['personne', 'entreprise'],
              };
              const targetTypes = typeMap[cat] || [cat];
              const matches = nodes.filter((n) =>
                targetTypes.some((t) => n.type.toLowerCase().includes(t))
              );
              if (matches.length > 0) {
                const nextExpanded = new Set(useGraphStore.getState().expandedHiddenNodeIds);
                matches.forEach((m) => nextExpanded.add(m.id));
                useGraphStore.setState({
                  expandedHiddenNodeIds: nextExpanded,
                  selectedNodeIds: matches.map((m) => m.id),
                  selectedNodeId: matches[0]?.id ?? null,
                });
                setIsInspectorOpen(true);
              }
            }
          }}
          onRunQuery={(q) => {
            const queryTypeMap: Record<string, string[]> = {
              money: ['compte_bancaire', 'transaction_financiere', 'crypto_wallet'],
              phones: ['telephone', 'enregistrement_vocal', 'telecom_cdr'],
              bts: ['antenne_bts'],
            };
            const targetTypes = queryTypeMap[q] || [];
            const matches = nodes.filter((n) => targetTypes.includes(n.type));
            if (matches.length > 0) {
              const nextExpanded = new Set(useGraphStore.getState().expandedHiddenNodeIds);
              matches.forEach((m) => nextExpanded.add(m.id));
              useGraphStore.setState({
                expandedHiddenNodeIds: nextExpanded,
                selectedNodeIds: matches.map((m) => m.id),
                selectedNodeId: matches[0]?.id ?? null,
              });
              setIsInspectorOpen(true);
            }
          }}
        />

        {/* Resizer Handle: Left Sidebar (Accessible Keyboard & Mouse) */}
        {!isLeftCollapsed && (
          <div
            className="resizer-handle-left"
            tabIndex={0}
            role="separator"
            aria-orientation="vertical"
            aria-label="Redimensionner le panneau gauche"
            aria-valuenow={leftWidth}
            aria-valuemin={220}
            aria-valuemax={520}
            onMouseDown={(e) => {
              e.preventDefault();
              setIsResizingLeft(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setLeftWidth((w) => Math.max(220, w - 16));
              } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setLeftWidth((w) => Math.min(520, w + 16));
              }
            }}
          />
        )}

        {/* Center Canvas Area */}
        <div className="center-workspace-column">
          {/* Browser-like Investigation Tabs Bar flush with the view */}
          <WorkspaceTabsBar onTriggerPhaseNotice={handleTriggerPhaseNotice} />

          {/* SNA Panel Dialog */}
          {isSnaOpen && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Panneau Social Network Analysis"
              style={{
                position: 'absolute',
                top: '56px',
                left: 'var(--space-4)',
                right: 'var(--space-4)',
                bottom: 'var(--space-4)',
                backgroundColor: 'var(--color-bg-surface)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 40,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  padding: 'var(--space-1) var(--space-2)',
                  borderBottom: '1px solid var(--color-border-subtle)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setIsSnaOpen(false)}
                >
                  Fermer [Échap]
                </button>
              </div>
              <div style={{ flex: 1, minHeight: 0 }}>
                <SnaPanel onClose={() => setIsSnaOpen(false)} initialAlgoKey={selectedSnaAlgo} />
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                top: 'var(--space-12)',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-2) var(--space-4)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                zIndex: 50,
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div className="animate-spin">●</div>
              <span>{tr('Chargement du graphe forensique...')}</span>
            </div>
          )}

          {/* View Container */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            {activeView === 'table' ? (
              <AccessibleListView />
            ) : activeView === 'map' ? (
              <MapView />
            ) : activeView === 'timeline' ? (
              <TimelineView
                onSelectNode={(id) => {
                  selectNode(id, false);
                  setIsInspectorOpen(true);
                }}
              />
            ) : activeView === 'audit' ? (
              <AuditChainViewer />
            ) : (
              <GraphCanvasAdapter
                nodes={nodes}
                edges={edges}
                activeLayers={activeLayers}
                selectedNodeId={selectedNodeId}
                selectedNodeIds={selectedNodeIds}
                selectedEdgeId={selectedEdgeId}
                viewport={viewport}
                onSelectNode={(id, isMulti) => {
                  selectNode(id, isMulti);
                  setIsInspectorOpen(true);
                }}
                onSelectEdge={(id) => {
                  selectEdge(id);
                  setIsInspectorOpen(true);
                }}
                onClearSelection={clearSelection}
                onNodeContextMenu={(e, nodeId) => {
                  const clientX = 'clientX' in e ? e.clientX : 300;
                  const clientY = 'clientY' in e ? e.clientY : 200;
                  openContextMenu(clientX, clientY, nodeId);
                  selectNode(nodeId, false);
                }}
                onNodeDragEnd={(nodeId, x, y) => updateNodePosition(nodeId, x, y, true)}
                onViewportChange={(panX, panY, zoom) => setViewport(panX, panY, zoom)}
                onToggleImpactView={handleToggleImpactView}
                onToggleSna={() => setIsSnaOpen((prev) => !prev)}
                isSnaOpen={isSnaOpen}
                onAddNodeAtPosition={handleAddNodeAtPosition}
                onDropRawFiles={(files, x, y) => {
                  void handleDropRawFiles(files, x, y);
                }}
              />
            )}
          </div>

          {/* Option B: Floating 3-Mode Selector & Process Tree Popover (Works across all workspace views) */}
          <IngestionPopover
            node={nodes.find((n) => n.id === activeIngestionPopoverNodeId) ?? null}
            onClose={closeIngestionPopover}
            onLaunchMode={(nodeId, mode, stageLabel, selectedPlugins) => {
              const target = nodes.find((n) => n.id === nodeId);
              const fileName = String(target?.properties?.file_name || target?.label || '');
              const mimeType = String(target?.properties?.mime_type || '');
              if (
                isIngestionModeLive(mode, fileName, mimeType) &&
                (mode === 'quick' || mode === 'step_by_step')
              ) {
                void runPdfExtraction(nodeId, mode, selectedPlugins).catch((err) => {
                  toast.error(
                    err instanceof Error ? err.message : tr('Erreur extraction'),
                    tr('Extraction')
                  );
                });
                return;
              }
              void triggerNodeInvestigation(nodeId, mode, stageLabel);
            }}
            onIsolateNode={(nodeId) => openActorTab(nodeId)}
            onUpdateConfig={updateNodeAnalysisConfig}
            onPreviewFile={(entry) => setPreviewFileEntry(entry)}
            onTriggerPhaseNotice={handleTriggerPhaseNotice}
          />

          {/* Context Menu Modal */}
          <ContextMenu
            activeView={activeView}
            onExpand={handleExpand}
            onInspect={() => setIsInspectorOpen(true)}
            onLocateInGraph={(nodeId) => {
              selectNode(nodeId, false);
              setActiveView('graph');
              setIsInspectorOpen(true);
            }}
          />

          {/* Forensic Layer Change Modal */}
          {activeCase && <LayerChangeDialog caseId={activeCase.id} />}

          {/* Forensic Case Export Dialog */}
          <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </div>

        {/* Right Inspector & Context Panel (resizable & collapsible) */}
        {isInspectorOpen ? (
          <>
            <div
              className="resizer-handle-right"
              tabIndex={0}
              role="separator"
              aria-orientation="vertical"
              aria-label="Redimensionner l'inspecteur judiciaire"
              aria-valuenow={rightWidth}
              aria-valuemin={290}
              aria-valuemax={650}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingRight(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') {
                  e.preventDefault();
                  setRightWidth((w) => Math.min(650, w + 16));
                } else if (e.key === 'ArrowRight') {
                  e.preventDefault();
                  setRightWidth((w) => Math.max(290, w - 16));
                }
              }}
            />
            <InspectorPanel
              style={{ width: `${rightWidth}px`, flexShrink: 0 }}
              onExpand={handleExpand}
              onClose={() => setIsInspectorOpen(false)}
              onTriggerTool={() => {
                setIsSnaOpen(true);
              }}
              onPreviewFile={(entry) => setPreviewFileEntry(entry)}
              onTriggerPhaseNotice={handleTriggerPhaseNotice}
            />
          </>
        ) : (
          <aside className="panel-right is-collapsed" aria-label={tr("Ouvrir l'inspecteur")}>
            <button
              type="button"
              className="btn btn-ghost btn-xs panel-left-collapse-btn"
              onClick={() => setIsInspectorOpen(true)}
              title={tr("Ouvrir l'inspecteur")}
              aria-label={tr("Ouvrir l'inspecteur")}
            >
              <PanelRightOpen size={14} />
            </button>
          </aside>
        )}
      </main>

      {/* 4. Forensic Audit Status Bar (24px) */}
      <footer className="status-bar" role="contentinfo" aria-label={tr("Barre d'état judiciaire et intégrité forensique")}>
        <div className="status-bar-left">
          <span>{tr('Affaire : {code}', { code: activeCase?.code || '—' })}</span>
          <span>{tr('Nœuds affichés : {n}', { n: scopedNodes.length })}</span>
          <span>{tr('Relations : {n}', { n: scopedEdges.length })}</span>
        </div>

        <div className="status-bar-right">
          <span className="status-indicator-item">
            <ShieldCheck size={12} className="text-success" />
            <span>{tr('Scellé WORM : Inaltérable (SHA-256)')}</span>
          </span>
          <span className="status-divider">•</span>
          <span className="status-indicator-item">
            <FileText size={12} className="text-accent" />
            <span>{tr("Registre d'Audit : Actif ISO 27037")}</span>
          </span>
          <span className="status-divider">•</span>
          <span className="status-indicator-item font-mono text-muted">
            {tr("Données d'exercice judiciaires")}
          </span>
        </div>
      </footer>

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectView={(v) => setActiveView(v)}
        onTriggerTool={() => setIsSnaOpen(true)}
        onTriggerPhaseNotice={handleTriggerPhaseNotice}
      />

      <ToolInfoModal
        isOpen={isToolInfoOpen}
        onClose={() => setIsToolInfoOpen(false)}
        tool={selectedTool}
        onTriggerPhaseNotice={handleTriggerPhaseNotice}
      />

      <CasePropertiesModal
        isOpen={isCasePropsOpen}
        onClose={() => setIsCasePropsOpen(false)}
        activeCase={activeCase}
        nodeCount={nodes.length}
        edgeCount={edges.length}
        onCaseUpdated={(updated) => setActiveCase(updated)}
      />

      <PhaseNoticeModal
        isOpen={isPhaseNoticeOpen}
        onClose={() => setIsPhaseNoticeOpen(false)}
        featureName={phaseNoticeData.name}
        targetPhase={phaseNoticeData.phase}
      />

      <AddNodeModal
        isOpen={pendingAddNode.isOpen}
        initialType={pendingAddNode.type}
        position={pendingAddNode.position}
        onClose={() => setPendingAddNode((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmAddNode}
      />

      <NewCaseModal
        isOpen={isNewCaseOpen}
        onClose={() => setIsNewCaseOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      <OpenCaseModal
        isOpen={isOpenCaseModalOpen}
        activeCaseId={activeCase?.id}
        onClose={() => setIsOpenCaseModalOpen(false)}
        onSelectCase={handleSelectCase}
      />

      <FilePreviewModal
        entry={previewFileEntry}
        onClose={() => setPreviewFileEntry(null)}
      />

      <DeleteNodesModal />
    </div>
  );
}

export default App;
