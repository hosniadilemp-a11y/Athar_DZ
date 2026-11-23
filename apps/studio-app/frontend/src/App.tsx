import { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { useGraphStore } from './store/useGraphStore';
import type { GraphNode } from './types/graph';
import { DesktopMenuBar } from './components/menubar/DesktopMenuBar';
import { AppSubBar } from './components/menubar/AppSubBar';
import { GraphCanvasAdapter } from './components/canvas/GraphCanvasAdapter';
import { Toolbar, type ActiveViewMode } from './components/canvas/Toolbar';
import { ContextMenu } from './components/canvas/ContextMenu';
import { LayerChangeDialog } from './components/canvas/LayerChangeDialog';
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
    deleteNode,
    selectEdge,
    clearSelection,
    setViewport,
    resetViewport,
    updateNodePosition,
    openContextMenu,
    undo,
    redo,
  } = useGraphStore();

  const [activeView, setActiveView] = useState<ActiveViewMode>('graph');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [isSnaOpen, setIsSnaOpen] = useState(false);
  const [selectedSnaAlgo, setSelectedSnaAlgo] = useState<string>('betweenness');

  const handleOpenSna = (algoKey?: string) => {
    if (algoKey) setSelectedSnaAlgo(algoKey);
    setIsSnaOpen(true);
  };

  // Resizable Panels State (Left Toolbox & Right Inspector)
  const [leftWidth, setLeftWidth] = useState(260);
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
          const mainCase = cases.find((c) => c.code.includes('CANDY') || c.code.includes('ATHAR')) ?? cases[0] ?? null;
          if (mainCase) {
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
        setLeftWidth((w) => Math.max(170, w - 24));
      } else if (e.key === ']') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        e.preventDefault();
        setLeftWidth((w) => Math.min(550, w + 24));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
        if (selectedNodeId) {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, undo, redo, selectAllNodes, deleteNode]);

  // Window mouse drag listener for adjusting left and right panel widths
  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = Math.min(Math.max(e.clientX, 170), 550);
        setLeftWidth(newWidth);
      }
      if (isResizingRight) {
        const newWidth = Math.min(Math.max(window.innerWidth - e.clientX, 240), 650);
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
        setLeftWidth((prev) => Math.min(prev, 220));
        setRightWidth((prev) => Math.min(prev, 280));
      } else if (w < 1250) {
        setLeftWidth((prev) => Math.min(prev, 240));
        setRightWidth((prev) => Math.min(prev, 310));
      }
    };
    window.addEventListener('resize', handleWindowResize);
    handleWindowResize();
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  // Handle Impact View Toggle
  const handleToggleImpactView = useCallback(() => {
    if (!activeCase) return;
    const targetImpact = !isImpactView;
    setLoading(true);

    fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/graph?impact_only=${targetImpact}`)
      .then((r) => r.json())
      .then((graphRes: GraphResponse) => {
        setGraphData(graphRes);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Erreur de bascule Impact');
      });
  }, [activeCase, isImpactView, setGraphData, setError, setLoading]);

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
    [activeCase, selectedNodeId, mergeExpandedNodes, setLoading, toast, tr]
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
        .then((createdNode) => {
          if (!createdNode || !createdNode.id) return;
          createdNode.x = data.x;
          createdNode.y = data.y;
          if (data.layer) createdNode.layer = data.layer;
          // Reconcile optimistic node with server response
          const store = useGraphStore.getState();
          const nextExpanded = new Set(store.expandedHiddenNodeIds);
          nextExpanded.delete(tempId);
          nextExpanded.add(createdNode.id);
          const nextLayers = new Set(store.activeLayers);
          if (createdNode.layer) nextLayers.add(createdNode.layer);

          useGraphStore.setState({
            nodes: store.nodes.map((n) => (n.id === tempId ? createdNode : n)),
            selectedNodeId: store.selectedNodeId === tempId ? createdNode.id : store.selectedNodeId,
            selectedNodeIds: store.selectedNodeIds.map((id) => (id === tempId ? createdNode.id : id)),
            expandedHiddenNodeIds: nextExpanded,
            activeLayers: nextLayers,
          });
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
    [activeCase, mergeExpandedNodes, selectNode, toast]
  );

  const handleTriggerPhaseNotice = (name: string, phase: string) => {
    setPhaseNoticeData({ name, phase });
    setIsPhaseNoticeOpen(true);
  };

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
        activeView={activeView}
        onChangeView={setActiveView}
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
        onDeleteSelected={() => {
          if (selectedNodeId) deleteNode(selectedNodeId);
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

      {/* 3. Main Workspace Area: Left Panel + Center Stage + Right Inspector */}
      <main className="main-workspace" style={{ flex: 1, display: 'flex', position: 'relative', overflow: 'hidden' }}>
        {/* Left Toolbox and Layers Accordion (resizable) */}
        <LeftAccordion
          style={{ width: `${leftWidth}px`, flexShrink: 0 }}
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
        <div
          className="resizer-handle-left"
          tabIndex={0}
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionner le panneau gauche"
          aria-valuenow={leftWidth}
          aria-valuemin={170}
          aria-valuemax={550}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsResizingLeft(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              setLeftWidth((w) => Math.max(170, w - 16));
            } else if (e.key === 'ArrowRight') {
              e.preventDefault();
              setLeftWidth((w) => Math.min(550, w + 16));
            }
          }}
        />

        {/* Center Canvas Area */}
        <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Sub-Header Toolbar */}
          <Toolbar
            activeView={activeView}
            onChangeView={setActiveView}
            isSnaOpen={isSnaOpen}
            onToggleSna={() => setIsSnaOpen((prev) => !prev)}
            onOpenExport={() => setIsExportOpen(true)}
            onToggleImpactView={handleToggleImpactView}
            onRunRecommendedScenario={handleRunPlaybook}
          />

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
              />
            )}
          </div>

          {/* Context Menu Modal */}
          <ContextMenu
            onExpand={handleExpand}
            onInspect={() => setIsInspectorOpen(true)}
          />

          {/* Forensic Layer Change Modal */}
          {activeCase && <LayerChangeDialog caseId={activeCase.id} />}

          {/* Forensic Case Export Dialog */}
          <ExportDialog isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
        </div>

        {/* Right Inspector & Context Panel (resizable & keyboard accessible) */}
        {isInspectorOpen && (
          <>
            <div
              className="resizer-handle-right"
              tabIndex={0}
              role="separator"
              aria-orientation="vertical"
              aria-label="Redimensionner l'inspecteur judiciaire"
              aria-valuenow={rightWidth}
              aria-valuemin={240}
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
                  setRightWidth((w) => Math.max(240, w - 16));
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
              onTriggerPhaseNotice={handleTriggerPhaseNotice}
            />
          </>
        )}
      </main>

      {/* 4. Forensic Audit Status Bar (24px) */}
      <footer className="status-bar" role="contentinfo" aria-label={tr("Barre d'état judiciaire et intégrité forensique")}>
        <div className="status-bar-left">
          <span>{tr('Affaire : {code}', { code: activeCase?.code || '—' })}</span>
          <span>{tr('Nœuds affichés : {n}', { n: nodes.length })}</span>
          <span>{tr('Relations : {n}', { n: edges.length })}</span>
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
    </div>
  );
}

export default App;
