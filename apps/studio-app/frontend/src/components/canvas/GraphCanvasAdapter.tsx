import React, { useRef, useState, useCallback, useEffect } from 'react';
import type { GraphNode, GraphEdge } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { CircularNode } from './CircularNode';
import { EdgeLine } from './EdgeLine';
import { CanvasFloatingPalette } from './CanvasFloatingPalette';
import { CanvasMinimap } from './CanvasMinimap';
import { CreateRelationModal } from '../modals/CreateRelationModal';
import { hasOpenModal } from '../common/ModalPortal';
import { useGraphStore } from '../../store/useGraphStore';
import {
  computeDefaultCandidatePosition,
  stepLiveForcePhysics,
  computePersonGraphProjection,
  computeGraphFitViewport,
  MIN_GRAPH_ZOOM,
  MAX_GRAPH_ZOOM,
} from '../../utils/graphLayouts';
import { computeTabScopedGraph } from '../../utils/tabScope';
import { findMatchedExistingNode } from '../../utils/candidateMatching';
import { Link2, Sparkles, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { getEdgeCategory } from '../../i18n/phrases/relations';

export interface Viewport {
  panX: number;
  panY: number;
  zoom: number;
}

export interface GraphCanvasAdapterProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeLayers?: Set<LayerId>;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedEdgeId: string | null;
  viewport: Viewport;
  onSelectNode: (id: string, isMulti: boolean) => void;
  onSelectEdge: (id: string) => void;
  onClearSelection: () => void;
  onNodeContextMenu: (e: React.MouseEvent | React.KeyboardEvent, nodeId: string) => void;
  onNodeDragEnd?: (nodeId: string, x: number, y: number) => void;
  onViewportChange: (panX: number, panY: number, zoom: number) => void;
  onToggleImpactView?: () => void;
  onToggleSna?: () => void;
  isSnaOpen?: boolean;
  onAddNodeAtPosition?: (typeKey: string, x: number, y: number) => void;
  onDropRawFiles?: (files: FileList, x: number, y: number) => void;
}

export const GraphCanvasAdapter: React.FC<GraphCanvasAdapterProps> = ({
  nodes,
  edges,
  activeLayers,
  selectedNodeId,
  selectedNodeIds,
  selectedEdgeId,
  viewport,
  onSelectNode,
  onSelectEdge,
  onClearSelection,
  onNodeContextMenu,
  onNodeDragEnd,
  onViewportChange,
  onToggleSna,
  isSnaOpen = false,
  onAddNodeAtPosition,
  onDropRawFiles,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { tr } = useI18n();
  const {
    canvasToolMode,
    setCanvasToolMode,
    isLinkMode,
    linkSourceNodeId,
    setLinkMode,
    setLinkSourceNodeId,
    createManualEdge,
    snaVisualOverlay,
    clearSnaVisualOverlay,
    isLiveSimulationActive,
    viewportFitNonce,
    resetViewport,
    graphCustomization,
  } = useGraphStore();

  // Pan & marquee selection state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [marqueeBox, setMarqueeBox] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    additive: boolean;
  } | null>(null);
  const marqueeBoxRef = useRef(marqueeBox);
  marqueeBoxRef.current = marqueeBox;
  const suppressNextCanvasClickRef = useRef(false);

  // Node dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [livePositions, setLivePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const candidatePositions = useGraphStore((s) => s.candidatePositions);
  const setCandidatePosition = useGraphStore((s) => s.setCandidatePosition);
  const updateCandidatePositions = useGraphStore((s) => s.updateCandidatePositions);
  const dragPosRef = useRef<{ id: string; x: number; y: number } | null>(null);

  // Canvas Drag & Drop State (Feature 1 + Option B Raw File Drop)
  const [isDragOverCanvas, setIsDragOverCanvas] = useState(false);
  const [isFileDragOver, setIsFileDragOver] = useState(false);

  // Mouse position in canvas space for link preview
  const [mouseCanvasPos, setMouseCanvasPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [pendingLink, setPendingLink] = useState<{ sourceId: string; targetId: string } | null>(null);

  // Container dimensions for minimap & auto-fit viewport
  const [containerSize, setContainerSize] = useState({ w: 800, h: 600 });
  const [hasMeasuredContainer, setHasMeasuredContainer] = useState(false);
  const fittedTabsRef = useRef<Set<string>>(new Set());
  const lastFitNonceRef = useRef<number>(viewportFitNonce);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 50 && entry.contentRect.height > 50) {
          setContainerSize({
            w: entry.contentRect.width,
            h: entry.contentRect.height,
          });
          setHasMeasuredContainer(true);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Real-time Live Force Simulation Loop (strictly scoped to active tab nodes & edges)
  useEffect(() => {
    if (!isLiveSimulationActive || nodes.length === 0) return;

    let animId: number;
    const tick = () => {
      const store = useGraphStore.getState();
      const currentTab = store.tabs.find((t) => t.id === store.activeTabId) ?? null;
      const { scopedNodes, scopedEdges } = computeTabScopedGraph(
        store.nodes,
        store.edges,
        currentTab,
        store.activeLayers,
        store.isImpactView
      );
      const tabPositions = currentTab?.kind === 'actor_sphere' ? currentTab.snapshot.nodePositions : undefined;
      const positionedNodes = tabPositions
        ? scopedNodes.map((n) => {
            const p = tabPositions[n.id];
            return p ? { ...n, x: p.x, y: p.y } : n;
          })
        : scopedNodes;

      // Include isolated-tab pending candidate ghost nodes & preview edges in live simulation
      let physicsNodes = positionedNodes;
      let physicsEdges = scopedEdges;
      if (currentTab?.kind === 'actor_sphere' && currentTab.focalNodeId) {
        const fId = currentTab.focalNodeId;
        const focal = positionedNodes.find((n) => n.id === fId);
        const pendingCands = (store.candidatesByNodeId[fId] ?? []).filter(
          (c) => c.validation_status === 'PENDING'
        );
        if (focal && pendingCands.length > 0) {
          const fx = focal.x ?? 600;
          const fy = focal.y ?? 420;
          const ghostSimNodes: GraphNode[] = [];
          const ghostSimEdges: GraphEdge[] = [];
          const idByCand = new Map<string, string>();
          (store.candidatesByNodeId[fId] ?? []).forEach((c) => {
            if (c.validation_status === 'PENDING') {
              idByCand.set(c.id, `cand:${c.id}`);
            } else if (c.promoted_node_id) {
              idByCand.set(c.id, c.promoted_node_id);
            }
          });

          pendingCands.forEach((cand, idx) => {
            const ghostId = `cand:${cand.id}`;
            const savedPos =
              store.candidatePositions[ghostId] ??
              computeDefaultCandidatePosition(fx, fy, idx, pendingCands.length);
            ghostSimNodes.push({
              id: ghostId,
              case_id: cand.case_id,
              type: cand.entity_type,
              layer: cand.suggested_layer as LayerId,
              label: cand.label,
              confidence: cand.confidence,
              provenance: '',
              properties: {},
              latitude: null,
              longitude: null,
              x: savedPos.x,
              y: savedPos.y,
            });
            ghostSimEdges.push({
              id: `cand-sim-edge:${cand.id}`,
              case_id: cand.case_id,
              type: 'EXTRAIT_DE',
              source_id: ghostId,
              target_id: fId,
              layer: 'VERIFIED',
              confidence: 1.0,
              provenance: '',
              properties: {},
            });
          });

          (store.relationsByNodeId[fId] ?? [])
            .filter((r) => r.validation_status === 'PENDING')
            .forEach((rel) => {
              if (!rel.source_candidate_id || !rel.target_candidate_id) return;
              const sId = idByCand.get(rel.source_candidate_id);
              const tId = idByCand.get(rel.target_candidate_id);
              if (sId && tId && sId !== tId) {
                ghostSimEdges.push({
                  id: `cand-sim-rel:${rel.id}`,
                  case_id: rel.case_id,
                  type: rel.relation_type,
                  source_id: sId,
                  target_id: tId,
                  layer: 'HYPOTHESIS',
                  confidence: rel.confidence,
                  provenance: '',
                  properties: {},
                });
              }
            });

          physicsNodes = [...positionedNodes, ...ghostSimNodes];
          physicsEdges = [...scopedEdges, ...ghostSimEdges];
        }
      }

      const cx = containerSize.w > 100 ? containerSize.w / 2 : 600;
      const cy = containerSize.h > 100 ? containerSize.h / 2 : 450;
      const stepMap = stepLiveForcePhysics(
        physicsNodes,
        physicsEdges,
        cx,
        cy,
        draggingNodeId,
        store.pinnedNodeIds
      );

      const realPosMap = new Map<string, { x: number; y: number }>();
      const candPosMap = new Map<string, { x: number; y: number }>();
      stepMap.forEach((pos, id) => {
        if (id.startsWith('cand:')) {
          candPosMap.set(id, pos);
        } else {
          realPosMap.set(id, pos);
        }
      });

      store.updateActiveTabNodePositions(realPosMap);
      if (candPosMap.size > 0) {
        store.updateCandidatePositions(candPosMap);
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isLiveSimulationActive, nodes.length, draggingNodeId, containerSize.w, containerSize.h]);

  // Handle Node Click (Selection or Link Creation Mode)
  const candidatesByNodeId = useGraphStore((s) => s.candidatesByNodeId);
  const relationsByNodeId = useGraphStore((s) => s.relationsByNodeId);
  const selectedCandidateId = useGraphStore((s) => s.selectedCandidateId);
  const selectCandidate = useGraphStore((s) => s.selectCandidate);

  const handleNodeClick = useCallback(
    (nodeId: string, isMulti: boolean) => {
      if (nodeId.startsWith('cand:')) {
        const candId = nodeId.slice(5);
        selectCandidate(candId);
        const state = useGraphStore.getState();
        const tabFocal = state.tabs.find((t) => t.id === state.activeTabId)?.focalNodeId;
        if (tabFocal) {
          onSelectNode(tabFocal, false);
        } else {
          for (const [srcId, list] of Object.entries(state.candidatesByNodeId)) {
            if (list.some((c) => c.id === candId)) {
              onSelectNode(srcId, false);
              break;
            }
          }
        }
        return;
      }
      selectCandidate(null);
      if (isLinkMode) {
        if (!linkSourceNodeId) {
          setLinkSourceNodeId(nodeId);
        } else if (linkSourceNodeId !== nodeId) {
          // Open the relation qualifier modal to let the investigator choose relation type
          setPendingLink({ sourceId: linkSourceNodeId, targetId: nodeId });
        }
        return;
      }
      onSelectNode(nodeId, isMulti);
    },
    [isLinkMode, linkSourceNodeId, setLinkSourceNodeId, onSelectNode, selectCandidate]
  );

  // Person-Centric Projection & Option A Actor Sphere / Tab-Scoped Subgraph Isolation
  const tabs = useGraphStore((s) => s.tabs);
  const activeTabId = useGraphStore((s) => s.activeTabId);
  const isImpactView = useGraphStore((s) => s.isImpactView);
  const isPersonOnlyGraph = useGraphStore((s) => s.isPersonOnlyGraph);
  const expandedHiddenNodeIds = useGraphStore((s) => s.expandedHiddenNodeIds);
  const mediatedEdgeOverrides = useGraphStore((s) => s.mediatedEdgeOverrides);
  const hiddenEdgeCategories = useGraphStore((s) => s.hiddenEdgeCategories);

  const activeTab = React.useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const {
    scopedNodes: rawTabScopedNodes,
    scopedEdges: tabScopedEdges,
    actorSphere,
  } = React.useMemo(
    () => computeTabScopedGraph(nodes, edges, activeTab, activeLayers, isImpactView),
    [nodes, edges, activeTab, activeLayers, isImpactView]
  );

  const tabScopedNodes = React.useMemo(() => {
    if (activeTab?.kind !== 'actor_sphere') return rawTabScopedNodes;
    const posMap = activeTab.snapshot.nodePositions;
    if (!posMap) return rawTabScopedNodes;
    return rawTabScopedNodes.map((n) => {
      const p = posMap[n.id];
      return p ? { ...n, x: p.x, y: p.y } : n;
    });
  }, [rawTabScopedNodes, activeTab]);

  // Fast node lookup for edge rendering (uses isolated tab coordinates)
  const nodeMap = React.useMemo(() => {
    const map = new Map<string, GraphNode>();
    tabScopedNodes.forEach((n) => {
      const live = livePositions.get(n.id);
      map.set(n.id, live ? { ...n, x: live.x, y: live.y } : n);
    });
    return map;
  }, [tabScopedNodes, livePositions]);

  const {
    visibleNodes,
    visibleEdges: projectedEdges,
    hiddenNeighborCountByNode,
    expandedNeighborCountByNode,
  } = React.useMemo(() => {
    return computePersonGraphProjection(
      tabScopedNodes,
      tabScopedEdges,
      isPersonOnlyGraph,
      expandedHiddenNodeIds,
      mediatedEdgeOverrides
    );
  }, [tabScopedNodes, tabScopedEdges, isPersonOnlyGraph, expandedHiddenNodeIds, mediatedEdgeOverrides]);

  // Filter visible edges by user edge category visibility
  const visibleEdges = React.useMemo(() => {
    return projectedEdges.filter((e) => {
      if (hiddenEdgeCategories && hiddenEdgeCategories.size > 0) {
        if (hiddenEdgeCategories.has(e.type)) return false;
        const cat = getEdgeCategory(e.type);
        if (hiddenEdgeCategories.has(cat)) return false;
      }
      return true;
    });
  }, [projectedEdges, hiddenEdgeCategories]);

  // Phase 2A/2B: Ghost candidate nodes, dashed edges & DB duplicate highlights
  // Shown strictly inside isolated evidence tabs (`actor_sphere`), NEVER in Dossier Général (`master`).
  const { ghostNodes, ghostEdges, dbMatchNodeIds, selectedMatchPair } = React.useMemo(() => {
    const focalId = activeTab?.kind === 'actor_sphere' ? activeTab.focalNodeId ?? null : null;
    if (!focalId) {
      return {
        ghostNodes: [] as GraphNode[],
        ghostEdges: [] as GraphEdge[],
        dbMatchNodeIds: new Set<string>(),
        selectedMatchPair: null as { ghostId: string; dbNodeId: string } | null,
      };
    }
    const focal =
      visibleNodes.find((n) => n.id === focalId) ?? tabScopedNodes.find((n) => n.id === focalId);
    if (!focal) {
      return {
        ghostNodes: [] as GraphNode[],
        ghostEdges: [] as GraphEdge[],
        dbMatchNodeIds: new Set<string>(),
        selectedMatchPair: null as { ghostId: string; dbNodeId: string } | null,
      };
    }
    const pending = (candidatesByNodeId[focalId] ?? []).filter(
      (c) => c.validation_status === 'PENDING'
    );
    const pendingRels = (relationsByNodeId[focalId] ?? []).filter(
      (r) => r.validation_status === 'PENDING'
    );
    if (pending.length === 0 && pendingRels.length === 0) {
      return {
        ghostNodes: [] as GraphNode[],
        ghostEdges: [] as GraphEdge[],
        dbMatchNodeIds: new Set<string>(),
        selectedMatchPair: null as { ghostId: string; dbNodeId: string } | null,
      };
    }
    const cx = focal.x ?? 600;
    const cy = focal.y ?? 420;
    const gNodes: GraphNode[] = [];
    const gEdges: GraphEdge[] = [];
    const matchedIds = new Set<string>();
    let activePair: { ghostId: string; dbNodeId: string } | null = null;

    pending.forEach((cand, idx) => {
      const defPos = computeDefaultCandidatePosition(cx, cy, idx, pending.length);
      const ghostId = `cand:${cand.id}`;
      const overridePos = candidatePositions[ghostId];
      const finalGx = overridePos ? overridePos.x : defPos.x;
      const finalGy = overridePos ? overridePos.y : defPos.y;
      const matchedDbNode = findMatchedExistingNode(cand, nodes);
      if (matchedDbNode) {
        matchedIds.add(matchedDbNode.id);
        if (selectedCandidateId === cand.id) {
          activePair = { ghostId, dbNodeId: matchedDbNode.id };
        }
      }

      gNodes.push({
        id: ghostId,
        case_id: cand.case_id,
        type: cand.entity_type,
        layer: cand.suggested_layer as LayerId,
        label: cand.label,
        confidence: cand.confidence,
        provenance: '',
        properties: {
          ...cand.attributes,
          __is_extraction_candidate: true,
          __candidate_id: cand.id,
          source_page: cand.source_page,
          source_locator: cand.source_locator ?? '',
        },
        latitude: null,
        longitude: null,
        x: finalGx,
        y: finalGy,
        radius: 26,
      });

      gEdges.push({
        id: `cand-edge:${cand.id}`,
        case_id: cand.case_id,
        type: 'EXTRAIT_DE',
        source_id: ghostId,
        target_id: focal.id,
        layer: 'HYPOTHESIS',
        confidence: cand.confidence,
        provenance: '',
        properties: { __is_candidate_edge: true },
      });
    });

    // D18: Preview semantic relation candidates between ghost/promoted nodes
    const allCands = candidatesByNodeId[focalId] ?? [];
    const endpointNodeIdByCandidateId = new Map<string, string>();
    allCands.forEach((c) => {
      if (c.validation_status === 'PENDING') {
        endpointNodeIdByCandidateId.set(c.id, `cand:${c.id}`);
      } else if (c.promoted_node_id) {
        endpointNodeIdByCandidateId.set(c.id, c.promoted_node_id);
      }
    });
    pendingRels.forEach((rel) => {
      if (!rel.source_candidate_id || !rel.target_candidate_id) return;
      const srcId = endpointNodeIdByCandidateId.get(rel.source_candidate_id);
      const tgtId = endpointNodeIdByCandidateId.get(rel.target_candidate_id);
      if (!srcId || !tgtId || srcId === tgtId) return;
      gEdges.push({
        id: `cand-rel:${rel.id}`,
        case_id: rel.case_id,
        type: rel.relation_type,
        source_id: srcId,
        target_id: tgtId,
        layer: 'HYPOTHESIS',
        confidence: rel.confidence,
        provenance: '',
        properties: { __is_candidate_edge: true, __is_semantic_candidate_rel: true },
      });
    });

    return {
      ghostNodes: gNodes,
      ghostEdges: gEdges,
      dbMatchNodeIds: matchedIds,
      selectedMatchPair: activePair,
    };
  }, [
    activeTab,
    selectedCandidateId,
    visibleNodes,
    tabScopedNodes,
    candidatesByNodeId,
    relationsByNodeId,
    candidatePositions,
    nodes,
  ]);

  // Freeze newly placed ghost candidate coordinates in store so dragging or validating one never shifts siblings
  useEffect(() => {
    if (ghostNodes.length === 0) return;
    const missingMap = new Map<string, { x: number; y: number }>();
    ghostNodes.forEach((gn) => {
      if (!candidatePositions[gn.id] && typeof gn.x === 'number' && typeof gn.y === 'number') {
        missingMap.set(gn.id, { x: gn.x, y: gn.y });
      }
    });
    if (missingMap.size > 0) {
      updateCandidatePositions(missingMap);
    }
  }, [ghostNodes, candidatePositions, updateCandidatePositions]);

  const displayNodes = React.useMemo(
    () => (ghostNodes.length > 0 ? [...visibleNodes, ...ghostNodes] : visibleNodes),
    [visibleNodes, ghostNodes]
  );

  const displayEdges = React.useMemo(
    () => (ghostEdges.length > 0 ? [...visibleEdges, ...ghostEdges] : visibleEdges),
    [visibleEdges, ghostEdges]
  );

  const displayNodeMap = React.useMemo(() => {
    if (ghostNodes.length === 0) return nodeMap;
    const merged = new Map(nodeMap);
    ghostNodes.forEach((gn) => merged.set(gn.id, gn));
    return merged;
  }, [nodeMap, ghostNodes]);

  // Auto-fit viewport on initial case load, untouched tab switch, layout change, or explicit fit trigger
  useEffect(() => {
    if (!hasMeasuredContainer || visibleNodes.length === 0) return;

    const nonceChanged = viewportFitNonce !== lastFitNonceRef.current;
    const isDefaultViewport =
      viewport.panX === 0 && viewport.panY === 0 && viewport.zoom === 1;
    const tabNotFittedYet = !fittedTabsRef.current.has(activeTabId);

    if (nonceChanged || (isDefaultViewport && tabNotFittedYet)) {
      lastFitNonceRef.current = viewportFitNonce;
      fittedTabsRef.current.add(activeTabId);
      const fit = computeGraphFitViewport(
        visibleNodes,
        containerSize.w,
        containerSize.h,
        graphCustomization?.nodeSize || 56
      );
      onViewportChange(fit.panX, fit.panY, fit.zoom);
    }
  }, [
    hasMeasuredContainer,
    visibleNodes,
    activeTabId,
    viewportFitNonce,
    viewport.panX,
    viewport.panY,
    viewport.zoom,
    containerSize.w,
    containerSize.h,
    graphCustomization?.nodeSize,
    onViewportChange,
  ]);

  // Native Non-Passive Wheel Listener (strictly prevents browser zoom / page scrolling)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onNativeWheel = (e: WheelEvent) => {
      if (hasOpenModal()) return;
      e.preventDefault();
      e.stopPropagation();

      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const currentZoom = viewport.zoom;
      const nextZoom = Math.min(Math.max(currentZoom * factor, MIN_GRAPH_ZOOM), MAX_GRAPH_ZOOM);
      const ratio = nextZoom / currentZoom;

      const nextPanX = mouseX - (mouseX - viewport.panX) * ratio;
      const nextPanY = mouseY - (mouseY - viewport.panY) * ratio;

      onViewportChange(nextPanX, nextPanY, nextZoom);
    };

    el.addEventListener('wheel', onNativeWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onNativeWheel);
    };
  }, [viewport, onViewportChange]);

  // Handle Drag Over for Entity or Raw File Drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDragOverCanvas(true);
    const hasFiles = Array.from(e.dataTransfer.types || []).includes('Files');
    setIsFileDragOver(hasFiles);
  }, []);

  // Handle Drag Enter
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverCanvas(true);
    const hasFiles = Array.from(e.dataTransfer.types || []).includes('Files');
    setIsFileDragOver(hasFiles);
  }, []);

  // Handle Drag Leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only deactivate if leaving the container boundaries
    if (e.currentTarget === e.target) {
      setIsDragOverCanvas(false);
      setIsFileDragOver(false);
    }
  }, []);

  // Handle Entity or Raw File Drop onto Canvas
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOverCanvas(false);
      setIsFileDragOver(false);

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const canvasX = Math.round((mouseX - viewport.panX) / viewport.zoom);
      const canvasY = Math.round((mouseY - viewport.panY) / viewport.zoom);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0 && onDropRawFiles) {
        onDropRawFiles(e.dataTransfer.files, canvasX, canvasY);
        return;
      }

      let typeKey = e.dataTransfer.getData('athar/node-type') || e.dataTransfer.getData('text/plain');
      if (!typeKey) {
        try {
          const json = e.dataTransfer.getData('application/json');
          if (json) {
            const parsed = JSON.parse(json);
            typeKey = parsed.type;
          }
        } catch {
          // ignore
        }
      }
      if (!typeKey || !onAddNodeAtPosition) return;

      onAddNodeAtPosition(typeKey, canvasX, canvasY);
    },
    [viewport, onAddNodeAtPosition, onDropRawFiles]
  );

  // Track canvas mouse position for interactive rubber-band link line
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isLinkMode || !linkSourceNodeId) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      setMouseCanvasPos({
        x: Math.round((mouseX - viewport.panX) / viewport.zoom),
        y: Math.round((mouseY - viewport.panY) / viewport.zoom),
      });
    },
    [isLinkMode, linkSourceNodeId, viewport]
  );

  // Handle Pan Start or Marquee Selection Start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (draggingNodeId) return;
    if (
      (e.target as HTMLElement | null)?.closest(
        '.canvas-floating-palette, .canvas-minimap-card, .canvas-sna-legend-card, .canvas-connection-banner'
      )
    ) {
      return;
    }

    const shouldPan =
      e.button === 1 ||
      (e.button === 0 && (canvasToolMode === 'pan' || isSpacePressed) && !isLinkMode);

    if (shouldPan) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.panX, y: e.clientY - viewport.panY });
      return;
    }

    if (e.button === 0 && canvasToolMode === 'select' && !isLinkMode) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;
      setMarqueeBox({
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        additive: e.shiftKey || e.ctrlKey || e.metaKey,
      });
    }
  }, [draggingNodeId, canvasToolMode, isSpacePressed, isLinkMode, viewport]);

  // Handle Node Drag Start (supports both persisted nodes and extracted candidate ghost nodes)
  const handleNodeDragStart = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const node = displayNodeMap.get(nodeId) ?? nodeMap.get(nodeId);
    if (!node) return;
    setDraggingNodeId(nodeId);
    dragPosRef.current = { id: nodeId, x: node.x ?? 0, y: node.y ?? 0 };
    setDragOffset({
      x: e.clientX - (node.x ?? 0) * viewport.zoom - viewport.panX,
      y: e.clientY - (node.y ?? 0) * viewport.zoom - viewport.panY,
    });
  }, [displayNodeMap, nodeMap, viewport]);

  // Spacebar temporary pan modifier
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (hasOpenModal()) return;
      if (e.code === 'Space' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        setIsSpacePressed(true);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Global Mouse Move and Up for Pan, Marquee Selection, and Node Dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        onViewportChange(e.clientX - panStart.x, e.clientY - panStart.y, viewport.zoom);
      } else if (marqueeBoxRef.current) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        setMarqueeBox((prev) => (prev ? { ...prev, currentX, currentY } : null));
      } else if (draggingNodeId) {
        const newX = Math.round((e.clientX - viewport.panX - dragOffset.x) / viewport.zoom);
        const newY = Math.round((e.clientY - viewport.panY - dragOffset.y) / viewport.zoom);
        dragPosRef.current = { id: draggingNodeId, x: newX, y: newY };
        setLivePositions((prev) => {
          const next = new Map(prev);
          next.set(draggingNodeId, { x: newX, y: newY });
          return next;
        });
      }
    };

    const handleMouseUp = () => {
      if (isPanning) {
        setIsPanning(false);
      }
      if (marqueeBoxRef.current) {
        const box = marqueeBoxRef.current;
        const dx = Math.abs(box.currentX - box.startX);
        const dy = Math.abs(box.currentY - box.startY);
        if (dx >= 6 || dy >= 6) {
          suppressNextCanvasClickRef.current = true;
          const minScreenX = Math.min(box.startX, box.currentX);
          const maxScreenX = Math.max(box.startX, box.currentX);
          const minScreenY = Math.min(box.startY, box.currentY);
          const maxScreenY = Math.max(box.startY, box.currentY);

          const minGraphX = (minScreenX - viewport.panX) / viewport.zoom;
          const maxGraphX = (maxScreenX - viewport.panX) / viewport.zoom;
          const minGraphY = (minScreenY - viewport.panY) / viewport.zoom;
          const maxGraphY = (maxScreenY - viewport.panY) / viewport.zoom;

          const matchedIds = visibleNodes
            .filter((n) => {
              const nx = n.x ?? 0;
              const ny = n.y ?? 0;
              return nx >= minGraphX && nx <= maxGraphX && ny >= minGraphY && ny <= maxGraphY;
            })
            .map((n) => n.id);

          const currentState = useGraphStore.getState();
          const mergedIds = box.additive
            ? Array.from(new Set([...currentState.selectedNodeIds, ...matchedIds]))
            : matchedIds;

          useGraphStore.setState({
            selectedNodeIds: mergedIds,
            selectedNodeId: mergedIds[0] ?? null,
            selectedEdgeId: null,
          });
        }
        setMarqueeBox(null);
      }
      if (draggingNodeId) {
        const latest = dragPosRef.current;
        if (latest && latest.id === draggingNodeId) {
          if (draggingNodeId.startsWith('cand:')) {
            setCandidatePosition(draggingNodeId, latest.x, latest.y);
          } else if (onNodeDragEnd) {
            onNodeDragEnd(draggingNodeId, latest.x, latest.y);
          }
        }
        setLivePositions((prev) => {
          const next = new Map(prev);
          next.delete(draggingNodeId);
          return next;
        });
        dragPosRef.current = null;
        setDraggingNodeId(null);
      }
    };

    if (isPanning || draggingNodeId || marqueeBox) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, panStart, draggingNodeId, dragOffset, marqueeBox, visibleNodes, viewport, onViewportChange, onNodeDragEnd, setCandidatePosition]);

  // Keyboard navigation on canvas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (hasOpenModal()) return;
    const step = e.shiftKey ? 80 : 30;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onViewportChange(viewport.panX + step, viewport.panY, viewport.zoom);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onViewportChange(viewport.panX - step, viewport.panY, viewport.zoom);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY + step, viewport.zoom);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      onViewportChange(viewport.panX, viewport.panY - step, viewport.zoom);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      const nextZoom = Math.min(viewport.zoom * 1.15, MAX_GRAPH_ZOOM);
      const ratio = nextZoom / Math.max(viewport.zoom, 0.01);
      const cx = containerSize.w / 2;
      const cy = containerSize.h / 2;
      onViewportChange(cx - (cx - viewport.panX) * ratio, cy - (cy - viewport.panY) * ratio, nextZoom);
    } else if (e.key === '-') {
      e.preventDefault();
      const nextZoom = Math.max(viewport.zoom * 0.85, MIN_GRAPH_ZOOM);
      const ratio = nextZoom / Math.max(viewport.zoom, 0.01);
      const cx = containerSize.w / 2;
      const cy = containerSize.h / 2;
      onViewportChange(cx - (cx - viewport.panX) * ratio, cy - (cy - viewport.panY) * ratio, nextZoom);
    } else if (e.key === '0') {
      e.preventDefault();
      resetViewport();
    } else if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setCanvasToolMode('select');
    } else if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setCanvasToolMode('pan');
    } else if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      setLinkMode(!isLinkMode);
    } else if (e.key === 'Escape') {
      if (pendingLink) return;
      e.preventDefault();
      e.nativeEvent.stopPropagation();
      useGraphStore.getState().stepEscapeLinkMode();
    }
  };

  const linkSourceNode = linkSourceNodeId ? nodeMap.get(linkSourceNodeId) : null;

  return (
    <div
      ref={containerRef}
      className="canvas-viewport-stage"
      tabIndex={0}
      role="region"
      aria-label="Zone du graphe visuel d'investigation. Utilisez la souris pour déplacer ou les touches fléchées pour naviguer."
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg-canvas)',
        cursor: isPanning
          ? 'grabbing'
          : isLinkMode
          ? 'crosshair'
          : canvasToolMode === 'pan' || isSpacePressed
          ? 'grab'
          : 'default',
        outline: 'none',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={() => {
        if (suppressNextCanvasClickRef.current) {
          suppressNextCanvasClickRef.current = false;
          return;
        }
        onClearSelection();
      }}
    >
      {/* Background Subtle Grid Pattern */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.15,
        }}
      >
        <defs>
          <pattern
            id="canvas-grid"
            width={Math.max(6, 20 * viewport.zoom)}
            height={Math.max(6, 20 * viewport.zoom)}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={1.5} cy={1.5} r={1} fill="var(--color-text-muted)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#canvas-grid)" />
      </svg>

      {/* Feature 1: Luminous Active Drop Zone Overlay */}
      {isDragOverCanvas && (
        <div
          className="canvas-drop-zone-overlay"
          style={{
            position: 'absolute',
            inset: '12px',
            border: '2px dashed var(--color-accent-primary)',
            borderRadius: 'var(--radius-lg)',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            boxShadow: 'inset 0 0 24px rgba(37, 99, 235, 0.25)',
            pointerEvents: 'none',
            zIndex: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: 'var(--color-accent-text)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={18} className="text-accent" />
          <span>
            {isFileDragOver
              ? tr('Déposer un fichier brut pour scellage préliminaire SHA-256 et analyse SPI')
              : tr("Déposer l'entité ici pour la positionner sur le graphe")}
          </span>
        </div>
      )}

      {/* Transformed Content Layer */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transform: `translate(${viewport.panX}px, ${viewport.panY}px) scale(${viewport.zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
      >
        {/* SVG Layer for Edges and Arrow Markers */}
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '10000px',
            height: '10000px',
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <defs>
            <marker id="arrow-VERIFIED" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-1-verified)" />
            </marker>
            <marker id="arrow-OSINT_RAW" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-2-osint)" />
            </marker>
            <marker id="arrow-INFRA" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-3-infra)" />
            </marker>
            <marker id="arrow-HYPOTHESIS" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-4-hypothesis)" />
            </marker>
            <marker id="arrow-FLOWS" markerUnits="userSpaceOnUse" viewBox="0 0 8 7" refX="6.5" refY="3.5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-layer-5-flows)" />
            </marker>
          </defs>

          {displayEdges.map((edge) => {
            const rawSrc = displayNodeMap.get(edge.source_id);
            const rawTgt = displayNodeMap.get(edge.target_id);
            const srcLive = rawSrc ? livePositions.get(rawSrc.id) : undefined;
            const tgtLive = rawTgt ? livePositions.get(rawTgt.id) : undefined;
            const sourceNode = rawSrc && srcLive ? { ...rawSrc, x: srcLive.x, y: srcLive.y } : rawSrc;
            const targetNode = rawTgt && tgtLive ? { ...rawTgt, x: tgtLive.x, y: tgtLive.y } : rawTgt;
            return (
              <EdgeLine
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isSelected={selectedEdgeId === edge.id}
                zoom={viewport.zoom}
                onSelect={onSelectEdge}
              />
            );
          })}

          {/* Amber dashed cross-reference link when selected candidate matches an existing DB node */}
          {selectedMatchPair && (() => {
            const ghost = displayNodeMap.get(selectedMatchPair.ghostId);
            const dbNode = displayNodeMap.get(selectedMatchPair.dbNodeId);
            if (!ghost || !dbNode) return null;
            const gLive = livePositions.get(ghost.id);
            const dLive = livePositions.get(dbNode.id);
            return (
              <line
                x1={gLive?.x ?? ghost.x ?? 0}
                y1={gLive?.y ?? ghost.y ?? 0}
                x2={dLive?.x ?? dbNode.x ?? 0}
                y2={dLive?.y ?? dbNode.y ?? 0}
                stroke="var(--color-status-warning)"
                strokeWidth={2.5}
                strokeDasharray="6 4"
                pointerEvents="none"
                opacity={0.95}
              />
            );
          })()}

          {/* Dynamic rubber-band guide line during link creation */}
          {isLinkMode && linkSourceNode && (
            <line
              x1={linkSourceNode.x ?? 0}
              y1={linkSourceNode.y ?? 0}
              x2={mouseCanvasPos.x}
              y2={mouseCanvasPos.y}
              stroke="var(--color-status-warning)"
              strokeWidth={2.5}
              strokeDasharray="6 4"
              pointerEvents="none"
              opacity={0.85}
            />
          )}
        </svg>

        {/* DOM Layer for Circular Nodes */}
        {displayNodes.map((node) => {
          const live = livePositions.get(node.id);
          const effectiveNode = live ? { ...node, x: live.x, y: live.y } : node;
          const isCandidate = Boolean(node.properties?.__is_extraction_candidate);
          const isSelected = isCandidate
            ? selectedCandidateId === node.properties?.__candidate_id
            : selectedNodeId === node.id || selectedNodeIds.includes(node.id);

          return (
            <CircularNode
              key={node.id}
              node={effectiveNode}
              isSelected={isSelected}
              isLinkSource={linkSourceNodeId === node.id}
              isDragging={draggingNodeId === node.id}
              isBoundaryAnchor={Boolean(actorSphere?.boundaryActorIds.has(node.id))}
              isSharedAsset={Boolean(actorSphere?.sharedAssetIds.has(node.id))}
              isDbMatch={!isCandidate && dbMatchNodeIds.has(node.id)}
              isDbMatchHighlighted={!isCandidate && selectedMatchPair?.dbNodeId === node.id}
              zoom={viewport.zoom}
              hiddenNeighborsCount={hiddenNeighborCountByNode.get(node.id) || 0}
              expandedNeighborsCount={expandedNeighborCountByNode.get(node.id) || 0}
              onSelect={handleNodeClick}
              onContextMenu={onNodeContextMenu}
              onDragStart={handleNodeDragStart}
            />
          );
        })}
      </div>

      {/* Feature 4: Floating SNA Visual Overlay Legend */}
      {snaVisualOverlay && (
        <div
          className="canvas-sna-legend-card"
          role="region"
          aria-label="Légende de l'analyse visuelle SNA"
        >
          <div className="canvas-sna-legend-header">
            <div className="canvas-sna-legend-title">
              <Sparkles size={13} className="text-accent" />
              <span>{snaVisualOverlay.algoTitle}</span>
            </div>
            <button
              type="button"
              className="canvas-sna-legend-close"
              onClick={clearSnaVisualOverlay}
              title={tr('Effacer l\'analyse visuelle')}
              aria-label="Fermer la visualisation SNA"
            >
              <X size={12} />
            </button>
          </div>
          <div className="canvas-sna-legend-items">
            {snaVisualOverlay.legend.map((item, idx) => (
              <div key={idx} className="canvas-sna-legend-item">
                <span
                  className="canvas-sna-legend-dot"
                  style={{ backgroundColor: item.color }}
                />
                <span className="canvas-sna-legend-text">{item.label}</span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs canvas-sna-legend-reset-btn"
            onClick={clearSnaVisualOverlay}
          >
            {tr('Réinitialiser l\'affichage')}
          </button>
        </div>
      )}

      {/* Active Link Creation Mode Banner */}
      {isLinkMode && (
        <div className="canvas-connection-banner is-visible" role="status" aria-live="polite">
          <Link2 size={15} className="text-warning" />
          <span id="canvas-connection-text">
            <strong>{tr('Mode Liaison Actif :')}</strong>{' '}
            {linkSourceNodeId ? (
              <span>
                {tr('Premier nœud sélectionné ({name}). Cliquez sur le nœud cible pour créer la liaison...', {
                  name: nodes.find((n) => n.id === linkSourceNodeId)?.label || linkSourceNodeId,
                })}
              </span>
            ) : (
              <span>{tr('Cliquez sur le premier nœud de la liaison...')}</span>
            )}
          </span>
          <button
            type="button"
            className="btn btn-ghost btn-xs banner-cancel-btn"
            onClick={() => setLinkMode(false)}
          >
            {tr('Annuler')}
          </button>
        </div>
      )}

      {/* Feature 6: Interactive Canvas Minimap (Bottom-Right) */}
      <CanvasMinimap
        nodes={visibleNodes}
        viewport={viewport}
        onViewportChange={onViewportChange}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Floating Canvas Tool Palette (Bottom-Left) */}
      <CanvasFloatingPalette
        onToggleSna={onToggleSna}
        isSnaOpen={isSnaOpen}
        containerWidth={containerSize.w}
        containerHeight={containerSize.h}
      />

      {/* Marquee Selection Rectangle */}
      {marqueeBox && (Math.abs(marqueeBox.currentX - marqueeBox.startX) >= 4 || Math.abs(marqueeBox.currentY - marqueeBox.startY) >= 4) && (
        <div
          className="canvas-marquee-box"
          style={{
            left: `${Math.min(marqueeBox.startX, marqueeBox.currentX)}px`,
            top: `${Math.min(marqueeBox.startY, marqueeBox.currentY)}px`,
            width: `${Math.abs(marqueeBox.currentX - marqueeBox.startX)}px`,
            height: `${Math.abs(marqueeBox.currentY - marqueeBox.startY)}px`,
          }}
        />
      )}

      {/* Modal to Choose Relation Type between Two Nodes */}
      {pendingLink && (
        <CreateRelationModal
          isOpen={Boolean(pendingLink)}
          sourceId={pendingLink.sourceId}
          targetId={pendingLink.targetId}
          onClose={() => {
            setPendingLink(null);
            setLinkSourceNodeId(null);
          }}
          onConfirm={(relationType, layer, confidence, notes, effectiveSourceId, effectiveTargetId) => {
            createManualEdge(
              effectiveSourceId ?? pendingLink.sourceId,
              effectiveTargetId ?? pendingLink.targetId,
              relationType,
              layer,
              confidence,
              notes
            );
            setPendingLink(null);
            setLinkSourceNodeId(null);
          }}
        />
      )}
    </div>
  );
};
