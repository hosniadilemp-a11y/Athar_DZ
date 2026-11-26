import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useGraphStore, NODE_TYPE_TO_CATEGORY, ONTOLOGY_CATEGORY_COLORS } from '../../store/useGraphStore';
import { computeTabScopedGraph } from '../../utils/tabScope';
import { NodeIcon } from '../canvas/NodeIcon';
import { CanvasMinimap } from '../canvas/CanvasMinimap';
import {
  computeDynamicTimelineLayout,
  computeAutoFitViewport,
  computeBidirectionalBranchIds,
  type DagNodeLayout,
  type TimeGranularity,
} from '../../utils/timelineLayout';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import type { GraphNode } from '../../types/graph';
import {
  Clock,
  Filter,
  GitBranch,
  GitMerge,
  List,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  SlidersHorizontal,
  Check,
  ChevronDown,
  X,
  Eye,
  EyeOff,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  MousePointer,
  Hand,
  Maximize2,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

const LAYER_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

interface InvestigativeBranch {
  id: string;
  rootNode: GraphNode;
  nodeCount: number;
  reachableNodeIds: Set<string>;
  label: string;
  type: string;
}

export interface TimelineViewProps {
  onSelectNode?: (nodeId: string) => void;
}

/**
 * Generates a concise short label for timeline/DAG nodes.
 * Clicking the node opens full forensic details in the Right Inspector panel.
 */
function getShortNodeLabel(rawLabel: string, nodeType: string): string {
  const clean = (rawLabel || '').trim();
  if (!clean) return nodeType;

  const lowType = nodeType.toLowerCase();
  if (lowType === 'personne' || lowType === 'person') {
    const parts = clean.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      const initial = parts[0].charAt(0).toUpperCase();
      const family = parts.slice(1).join(' ');
      const shortPerson = `${initial}. ${family}`;
      return shortPerson.length > 15 ? `${shortPerson.slice(0, 14)}…` : shortPerson;
    }
  }

  if (
    lowType === 'telephone' ||
    lowType === 'compte_bancaire' ||
    lowType === 'crypto_wallet' ||
    lowType === 'carte_sim'
  ) {
    if (clean.length > 10) {
      return `…${clean.slice(-6)}`;
    }
  }

  return clean.length > 15 ? `${clean.slice(0, 14)}…` : clean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectNode }) => {
  const {
    nodes: allNodes,
    edges: allEdges,
    activeLayers,
    tabs,
    activeTabId,
    isImpactView,
    selectedNodeId,
    selectNode,
    openContextMenu,
  } = useGraphStore();
  const { tr, trLabel, locale } = useI18n();

  const activeTab = useMemo(
    () => tabs.find((t) => t.id === activeTabId) ?? null,
    [tabs, activeTabId]
  );

  const { scopedNodes: nodes, scopedEdges: edges } = useMemo(
    () => computeTabScopedGraph(allNodes, allEdges, activeTab, activeLayers, isImpactView),
    [allNodes, allEdges, activeTab, activeLayers, isImpactView]
  );

  const [viewMode, setViewMode] = useState<'dag' | 'linear'>('dag');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');

  // Branch filtering: default hides short branches with <= 3 nodes
  const [hideSmallBranches, setHideSmallBranches] = useState<boolean>(true);
  const [minBranchNodes, setMinBranchNodes] = useState<number>(4);
  const [selectedBranchIds, setSelectedBranchIds] = useState<Set<string> | null>(null);
  const [isBranchSelectorOpen, setIsBranchSelectorOpen] = useState(false);
  const [branchFilterSearch, setBranchFilterSearch] = useState('');

  // Temporal Evolution Slider, Granularity & Animation state
  const [timeGranularity, setTimeGranularity] = useState<TimeGranularity>('day');
  const [timeCursorStep, setTimeCursorStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Canvas Pan & Zoom state for DAG Navigation
  const LEFT_AXIS_WIDTH = 184;
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: LEFT_AXIS_WIDTH + 24, y: 24 });
  const panClickOriginRef = useRef<{ x: number; y: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dagContainerSize, setDagContainerSize] = useState<{ w: number; h: number }>({ w: 960, h: 580 });
  const [timelineToolMode, setTimelineToolMode] = useState<'select' | 'pan'>('pan');
  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  const branchSelectorRef = useRef<HTMLDivElement>(null);
  const scalePopoverRef = useRef<HTMLDivElement>(null);
  const searchAutocompleteRef = useRef<HTMLDivElement>(null);
  const dagContainerRef = useRef<HTMLDivElement>(null);
  const hasManualViewportRef = useRef(false);

  const dateLocale = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-GB' : 'fr-FR';

  // Close popovers ("Pistes d'enquête", scale slider, search autocomplete) on outside click or Escape
  useEffect(() => {
    if (!isBranchSelectorOpen && !isScaleOpen && !isSearchDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (isBranchSelectorOpen && branchSelectorRef.current && !branchSelectorRef.current.contains(target)) {
        setIsBranchSelectorOpen(false);
      }
      if (isScaleOpen && scalePopoverRef.current && !scalePopoverRef.current.contains(target)) {
        setIsScaleOpen(false);
      }
      if (isSearchDropdownOpen && searchAutocompleteRef.current && !searchAutocompleteRef.current.contains(target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsBranchSelectorOpen(false);
        setIsScaleOpen(false);
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isBranchSelectorOpen, isScaleOpen, isSearchDropdownOpen]);

  const applyTimelineCenteredZoom = useCallback(
    (targetZoom: number) => {
      hasManualViewportRef.current = true;
      const clampedZoom = Math.min(Math.max(targetZoom, 0.1), 10.0);
      setZoom((prevZoom) => {
        const safePrev = Math.max(prevZoom, 0.01);
        const cx = LEFT_AXIS_WIDTH + Math.max(200, dagContainerSize.w - LEFT_AXIS_WIDTH) / 2;
        const cy = dagContainerSize.h / 2;
        const ratio = clampedZoom / safePrev;
        setPan((prevPan) => ({
          x: cx - (cx - prevPan.x) * ratio,
          y: cy - (cy - prevPan.y) * ratio,
        }));
        return clampedZoom;
      });
    },
    [dagContainerSize.w, dagContainerSize.h]
  );

  // Measure DAG viewport container for constraint-driven layout & radar minimap
  useEffect(() => {
    if (viewMode !== 'dag' || !dagContainerRef.current) return;
    const el = dagContainerRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDagContainerSize({
          w: Math.max(320, entry.contentRect.width),
          h: Math.max(240, entry.contentRect.height),
        });
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewMode]);

  // Native non-passive wheel zoom on DAG canvas (10% - 1000%)
  useEffect(() => {
    if (viewMode !== 'dag' || !dagContainerRef.current) return;
    const el = dagContainerRef.current;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      hasManualViewportRef.current = true;
      const factor = e.deltaY < 0 ? 1.1 : 0.9;
      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      setZoom((prevZoom) => {
        const nextZoom = Math.min(Math.max(prevZoom * factor, 0.1), 10.0);
        const ratio = nextZoom / prevZoom;
        setPan((prevPan) => ({
          x: mouseX - (mouseX - prevPan.x) * ratio,
          y: mouseY - (mouseY - prevPan.y) * ratio,
        }));
        return nextZoom;
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [viewMode]);

  // 1. Filtered Nodes by layer and search term
  const activeNodes = useMemo(() => {
    return nodes.filter((n) => {
      if (selectedLayer !== 'ALL' && n.layer !== selectedLayer) return false;
      if (
        searchTerm &&
        !n.label.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !n.type.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [nodes, selectedLayer, searchTerm]);

  // 2. Identify all Investigative Branches & Rank by Node Count Descending
  const allBranches = useMemo<InvestigativeBranch[]>(() => {
    const nodeMap = new Map<string, GraphNode>();
    activeNodes.forEach((n) => nodeMap.set(n.id, n));

    const adj = new Map<string, string[]>();
    const revAdj = new Map<string, string[]>();

    activeNodes.forEach((n) => {
      adj.set(n.id, []);
      revAdj.set(n.id, []);
    });

    edges.forEach((e) => {
      if (nodeMap.has(e.source_id) && nodeMap.has(e.target_id)) {
        adj.get(e.source_id)?.push(e.target_id);
        revAdj.get(e.target_id)?.push(e.source_id);
      }
    });

    const roots = activeNodes.filter((n) => (revAdj.get(n.id)?.length || 0) === 0);

    const branches: InvestigativeBranch[] = roots.map((r) => {
      const visited = new Set<string>([r.id]);
      const queue = [r.id];

      while (queue.length > 0) {
        const curr = queue.shift();
        if (!curr) continue;
        const neighbors = adj.get(curr) || [];
        for (const nxt of neighbors) {
          if (!visited.has(nxt)) {
            visited.add(nxt);
            queue.push(nxt);
          }
        }
      }

      return {
        id: r.id,
        rootNode: r,
        nodeCount: visited.size,
        reachableNodeIds: visited,
        label: r.label,
        type: r.type,
      };
    });

    branches.sort((a, b) => b.nodeCount - a.nodeCount);
    return branches;
  }, [activeNodes, edges]);

  // 3. Filtered Active Branches based on threshold and custom selection
  const isActorSphereTab = activeTab?.kind === 'actor_sphere';
  const activeBranches = useMemo(() => {
    return allBranches.filter((b) => {
      if (selectedBranchIds !== null) {
        return selectedBranchIds.has(b.id);
      }
      if (!isActorSphereTab && hideSmallBranches) {
        return b.nodeCount >= minBranchNodes;
      }
      return true;
    });
  }, [allBranches, selectedBranchIds, isActorSphereTab, hideSmallBranches, minBranchNodes]);

  // Autocomplete search suggestions from all tab-scoped entities
  const searchSuggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const pool = q
      ? nodes.filter(
          (n) =>
            n.label.toLowerCase().includes(q) ||
            n.type.toLowerCase().includes(q) ||
            trLabel(n.label).toLowerCase().includes(q)
        )
      : nodes;
    return pool.slice(0, 12);
  }, [nodes, searchTerm, trLabel]);

  // Set of visible node IDs strictly from checked/active branches (never leaks unrelated root victims!)
  const branchVisibleNodeIds = useMemo(() => {
    if (isActorSphereTab && selectedBranchIds === null) {
      return new Set(activeNodes.map((n) => n.id));
    }
    const ids = new Set<string>();
    activeBranches.forEach((b) => {
      b.reachableNodeIds.forEach((id) => ids.add(id));
    });
    return ids;
  }, [isActorSphereTab, selectedBranchIds, activeNodes, activeBranches]);

  // Base nodes in active branches (INVARIANT of timeCursorStep so positions never jump!)
  const branchFilteredNodes = useMemo(() => {
    return activeNodes.filter((n) => branchVisibleNodeIds.has(n.id));
  }, [activeNodes, branchVisibleNodeIds]);

  // 4. Compute Full Bidirectional Branch Set (Upstream + Downstream) for Selected Node
  const highlightedBranchNodeIds = useMemo(() => {
    return computeBidirectionalBranchIds(selectedNodeId, edges);
  }, [selectedNodeId, edges]);

  const branchSizeMap = useMemo(() => {
    const map = new Map<string, number>();
    allBranches.forEach((b) => map.set(b.id, b.nodeCount));
    return map;
  }, [allBranches]);

  // 5. Base topological depth on branchFilteredNodes (for chronological tie-breaking)
  const baseDepthByNodeId = useMemo(() => {
    return computeDynamicTimelineLayout(branchFilteredNodes, edges, {
      containerWidth: Math.max(320, dagContainerSize.w - LEFT_AXIS_WIDTH),
      containerHeight: dagContainerSize.h,
      branchSizeMap,
    }).depthByNodeId;
  }, [branchFilteredNodes, edges, dagContainerSize.w, dagContainerSize.h, branchSizeMap]);

  // 6. Chronological Sequence for Temporal Slider (ordered by timestamp + topological depth)
  const chronologicalSequence = useMemo(() => {
    return [...branchFilteredNodes].sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (tA !== tB) return tA - tB;
      const dA = baseDepthByNodeId.get(a.id) ?? 0;
      const dB = baseDepthByNodeId.get(b.id) ?? 0;
      if (dA !== dB) return dA - dB;
      return a.id.localeCompare(b.id);
    });
  }, [branchFilteredNodes, baseDepthByNodeId]);

  const totalSteps = chronologicalSequence.length;
  const currentStep =
    timeCursorStep === null ? totalSteps : Math.min(Math.max(1, timeCursorStep), Math.max(1, totalSteps));

  // Animation Timer Effect
  useEffect(() => {
    if (!isPlaying) return;
    if (totalSteps <= 1) {
      setIsPlaying(false);
      return;
    }

    const intervalMs = Math.round(520 / playbackSpeed);
    const timer = window.setInterval(() => {
      setTimeCursorStep((prev) => {
        const curr = prev === null ? totalSteps : prev;
        if (curr >= totalSteps) {
          setIsPlaying(false);
          return totalSteps;
        }
        return curr + 1;
      });
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Nodes revealed at the current temporal slider step
  const revealedNodes = useMemo(() => {
    return chronologicalSequence.slice(0, currentStep);
  }, [chronologicalSequence, currentStep]);

  const latestRevealedNode = useMemo(() => {
    if (totalSteps === 0 || currentStep < 1) return null;
    return chronologicalSequence[currentStep - 1] || null;
  }, [chronologicalSequence, currentStep, totalSteps]);

  // 7. Dynamic Constraint-Driven Time-Level Tree Layout constructed over visible/revealed nodes
  const {
    dagNodes,
    dagEdges,
    maxLanes,
    maxRows,
    laneWidth,
    rowHeight,
    startX,
    startY,
    circleRadius,
    boundsWidth,
    boundsHeight,
    timeLevels,
  } = useMemo(() => {
    return computeDynamicTimelineLayout(revealedNodes, edges, {
      containerWidth: Math.max(320, dagContainerSize.w - LEFT_AXIS_WIDTH),
      containerHeight: dagContainerSize.h,
      branchSizeMap,
      ancestorNodeIds: highlightedBranchNodeIds,
      timeGranularity,
      locale,
    });
  }, [
    revealedNodes,
    edges,
    dagContainerSize.w,
    dagContainerSize.h,
    branchSizeMap,
    highlightedBranchNodeIds,
    timeGranularity,
    locale,
  ]);

  const fitDagToViewport = useCallback(() => {
    const availW = Math.max(320, dagContainerSize.w - LEFT_AXIS_WIDTH);
    const fitted = computeAutoFitViewport(
      boundsWidth,
      boundsHeight,
      availW,
      dagContainerSize.h
    );
    setZoom(fitted.zoom);
    setPan({ x: fitted.panX + LEFT_AXIS_WIDTH, y: fitted.panY });
  }, [boundsWidth, boundsHeight, dagContainerSize.w, dagContainerSize.h]);

  // Reset manual viewport lock when branch selection, granularity, or filter changes
  useEffect(() => {
    hasManualViewportRef.current = false;
  }, [selectedBranchIds, hideSmallBranches, selectedLayer, searchTerm, timeGranularity]);

  // Auto-fit compact tree into viewport when not manually panned/zoomed
  useEffect(() => {
    if (viewMode !== 'dag' || hasManualViewportRef.current || dagNodes.length === 0) return;
    fitDagToViewport();
  }, [viewMode, dagNodes.length, fitDagToViewport]);

  // Minimap nodes mapped to circle center coordinates
  const minimapNodes = useMemo<GraphNode[]>(() => {
    return dagNodes.map((n) => ({
      ...n.node,
      x: n.x + circleRadius,
      y: n.y + circleRadius,
    }));
  }, [dagNodes, circleRadius]);

  // Handle node selection & dispatch to Right Inspector panel
  const handleSelectNode = useCallback(
    (nodeId: string) => {
      selectNode(nodeId, false);
      if (onSelectNode) {
        onSelectNode(nodeId);
      }
    },
    [selectNode, onSelectNode]
  );

  const handleFocusDagNode = useCallback(
    (nodeLayout: DagNodeLayout) => {
      handleSelectNode(nodeLayout.node.id);
    },
    [handleSelectNode]
  );

  // Linear view events sorted chronologically
  const sortedLinearEvents = useMemo(() => {
    return chronologicalSequence.slice(0, currentStep);
  }, [chronologicalSequence, currentStep]);

  // Drag and pan handlers (respects Select vs Pan tool mode, ignores floating palette/minimap/axis)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (
      (e.target as HTMLElement).closest(
        '.dag-node-item, .canvas-minimap-card, .timeline-left-axis, .canvas-floating-palette'
      )
    ) {
      return;
    }
    panClickOriginRef.current = { x: e.clientX, y: e.clientY };
    const shouldPan = e.button === 1 || (e.button === 0 && timelineToolMode === 'pan');
    if (shouldPan) {
      hasManualViewportRef.current = true;
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (panClickOriginRef.current) {
      const dx = Math.abs(e.clientX - panClickOriginRef.current.x);
      const dy = Math.abs(e.clientY - panClickOriginRef.current.y);
      if (dx < 4 && dy < 4 && selectedNodeId) {
        selectNode(null, false);
      }
    }
    panClickOriginRef.current = null;
    setIsPanning(false);
  };

  const handleSelectAutocompleteNode = (nodeId: string) => {
    setSearchTerm('');
    setIsSearchDropdownOpen(false);
    // Ensure the clicked node's branch is visible if custom branches are active
    if (selectedBranchIds !== null) {
      const containing = allBranches.filter((b) => b.reachableNodeIds.has(nodeId));
      if (containing.length > 0) {
        const next = new Set(selectedBranchIds);
        containing.forEach((b) => next.add(b.id));
        setSelectedBranchIds(next);
      }
    }
    setTimeCursorStep(null);
    handleSelectNode(nodeId);
  };

  // Toggle individual branch
  const toggleBranch = (branchId: string) => {
    const currentSet = new Set(
      selectedBranchIds !== null ? selectedBranchIds : activeBranches.map((b) => b.id)
    );
    if (currentSet.has(branchId)) {
      currentSet.delete(branchId);
    } else {
      currentSet.add(branchId);
    }
    setSelectedBranchIds(currentSet);
  };

  // Branch filter presets
  const applyPresetMajorBranches = () => {
    const majorIds = new Set(allBranches.filter((b) => b.nodeCount >= 4).map((b) => b.id));
    setSelectedBranchIds(majorIds);
    setHideSmallBranches(true);
    setMinBranchNodes(4);
  };

  const applyPresetAllBranches = () => {
    setSelectedBranchIds(new Set(allBranches.map((b) => b.id)));
    setHideSmallBranches(false);
  };

  const applyPresetNoneBranches = () => {
    setSelectedBranchIds(new Set());
    setHideSmallBranches(false);
  };

  // Temporal playback controls
  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (currentStep >= totalSteps) {
        setTimeCursorStep(1);
      }
      setIsPlaying(true);
    }
  };

  const handleStepBack = () => {
    setIsPlaying(false);
    setTimeCursorStep(Math.max(1, currentStep - 1));
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setTimeCursorStep(Math.min(totalSteps, currentStep + 1));
  };

  const handleResetTimeline = () => {
    setIsPlaying(false);
    setTimeCursorStep(null);
  };

  const cyclePlaybackSpeed = () => {
    setPlaybackSpeed((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1));
  };

  return (
    <div className="timeline-view-shell">
      {/* LEVEL 1: View Mode Switcher (Arbre Multi-Branches | Linéaire) + Summary */}
      <div className="timeline-bar-level-1">
        <div className="timeline-bar-group">
          <div className="canvas-segmented-tabs" role="tablist" aria-label={tr('Mode chronologique')}>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'dag'}
              className={`canvas-segmented-btn ${viewMode === 'dag' ? 'active' : ''}`}
              onClick={() => setViewMode('dag')}
              title={tr("Chronologie Arborescente Descendante (Arbre d'enquête & convergences)")}
            >
              <GitBranch size={13} />
              <span>{tr('Arbre Multi-Branches')}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'linear'}
              className={`canvas-segmented-btn ${viewMode === 'linear' ? 'active' : ''}`}
              onClick={() => setViewMode('linear')}
              title={tr('Flux linéaire chronologique vertical')}
            >
              <List size={13} />
              <span>{tr('Linéaire')}</span>
            </button>
          </div>
        </div>

        <div className="timeline-bar-group">
          {viewMode === 'dag' && selectedNodeId && highlightedBranchNodeIds.size > 0 && (
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => selectNode(null, false)}
              title={tr('Effacer la sélection')}
            >
              <GitBranch size={12} className="text-accent" />
              <span>{tr('Branche sélectionnée ({n})', { n: highlightedBranchNodeIds.size })}</span>
              <X size={12} />
            </button>
          )}
          <span className="chip chip-neutral font-mono text-xs">
            {dagNodes.length} {tr('Entités')} / {dagEdges.length} {tr('Relations')}
          </span>
        </div>
      </div>

      {/* LEVEL 2: Pistes d'enquête, Désactiver tout, Pistes courtes, Couches & Recherche Autocomplete */}
      <div className="timeline-bar-level-2">
        <div className="timeline-bar-group">
          {/* Interactive Branch Selector Button */}
          {viewMode === 'dag' && (
            <div ref={branchSelectorRef} style={{ position: 'relative' }}>
              <button
                type="button"
                className={`btn btn-xs ${isBranchSelectorOpen ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsBranchSelectorOpen((prev) => !prev)}
                aria-expanded={isBranchSelectorOpen}
                aria-haspopup="true"
                title={tr('Sélectionner les pistes chronologiques et filtrer par nombre de nœuds')}
              >
                <SlidersHorizontal size={12} />
                <span>{tr("Pistes d'enquête")}</span>
                <span className="chip chip-neutral font-mono text-xs">
                  {activeBranches.length}/{allBranches.length}
                </span>
                <ChevronDown size={12} />
              </button>

              {/* Branch Selector Popover */}
              {isBranchSelectorOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 6px)',
                    insetInlineStart: 0,
                    width: '330px',
                    maxHeight: '440px',
                    backgroundColor: 'var(--color-bg-surface)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                >
                  {/* Popover Header */}
                  <div
                    style={{
                      padding: 'var(--space-2) var(--space-3)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: 'var(--color-bg-elevated)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)' }}>
                        {tr('Pistes chronologiques')}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        {tr('Classées par taille (les plus fournies à gauche)')}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => setIsBranchSelectorOpen(false)}
                      aria-label={tr('Fermer')}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      gap: 'var(--space-1)',
                      padding: 'var(--space-2) var(--space-3)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      backgroundColor: 'var(--color-bg-surface)',
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      onClick={applyPresetMajorBranches}
                      style={{ flex: 1 }}
                    >
                      {tr('Majeures (≥ 4)')}
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      onClick={applyPresetAllBranches}
                      style={{ flex: 1 }}
                    >
                      {tr('Toutes')} ({allBranches.length})
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-danger"
                      onClick={applyPresetNoneBranches}
                      style={{ flex: 1 }}
                      title={tr('Désactiver toutes les pistes chronologiques')}
                    >
                      {tr('Tout désactiver')}
                    </button>
                  </div>

                  {/* Search inside branches */}
                  <div style={{ padding: 'var(--space-2) var(--space-3)' }}>
                    <input
                      type="text"
                      className="input input-xs"
                      placeholder={tr('Filtrer les pistes...')}
                      value={branchFilterSearch}
                      onChange={(e) => setBranchFilterSearch(e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* Branch List */}
                  <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-2) var(--space-2)' }}>
                    {allBranches
                      .filter((b) =>
                        branchFilterSearch
                          ? b.label.toLowerCase().includes(branchFilterSearch.toLowerCase())
                          : true
                      )
                      .map((branch, rank) => {
                        const isChecked = activeBranches.some((ab) => ab.id === branch.id);
                        const domKey = NODE_TYPE_TO_CATEGORY[branch.type] || 'acteurs';
                        const domColor = ONTOLOGY_CATEGORY_COLORS[domKey] || 'var(--color-accent-primary)';

                        return (
                          <button
                            type="button"
                            key={branch.id}
                            onClick={() => toggleBranch(branch.id)}
                            className={`btn btn-ghost btn-xs ${isChecked ? 'active' : ''}`}
                            style={{
                              display: 'flex',
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '6px 8px',
                              marginBottom: '2px',
                              backgroundColor: isChecked ? 'var(--color-accent-subtle)' : 'transparent',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                              <div
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  borderRadius: 'var(--radius-sm)',
                                  border: isChecked
                                    ? '1px solid var(--color-accent-primary)'
                                    : '1px solid var(--color-border-default)',
                                  backgroundColor: isChecked ? 'var(--color-accent-primary)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                {isChecked && <Check size={12} color="var(--color-text-on-accent)" />}
                              </div>
                              <span style={{ color: domColor, display: 'flex' }}>
                                <NodeIcon name={registry.node_types[branch.type]?.icon || 'help-circle'} size={14} />
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--text-xs)',
                                  fontWeight: isChecked ? 600 : 400,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '170px',
                                  color: 'var(--color-text-primary)',
                                }}
                                title={trLabel(branch.label)}
                              >
                                #{rank + 1} {getShortNodeLabel(trLabel(branch.label), branch.type)}
                              </span>
                            </div>

                            <span className="chip chip-neutral font-mono text-xs">
                              {branch.nodeCount}
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Toggle to enable/disable all branches in 1 click */}
          {viewMode === 'dag' && (
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              onClick={() => {
                if (selectedBranchIds && selectedBranchIds.size === 0) {
                  applyPresetAllBranches();
                } else {
                  applyPresetNoneBranches();
                }
              }}
              title={
                selectedBranchIds && selectedBranchIds.size === 0
                  ? tr('Activer toutes les pistes')
                  : tr('Désactiver toutes les pistes')
              }
            >
              {selectedBranchIds && selectedBranchIds.size === 0 ? (
                <>
                  <Eye size={12} />
                  <span>{tr('Activer toutes les pistes')}</span>
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  <span>{tr('Désactiver toutes les pistes')}</span>
                </>
              )}
            </button>
          )}

          {/* Quick Toggle to hide/show <= 3 node tracks */}
          {viewMode === 'dag' && (
            <button
              type="button"
              className={`btn btn-xs ${hideSmallBranches ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setHideSmallBranches((prev) => !prev);
                setSelectedBranchIds(null);
              }}
              title={tr('Masquer automatiquement les pistes courtes (≤ 3 nœuds)')}
            >
              {hideSmallBranches ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>{tr('Pistes courtes (≤ 3)')}</span>
            </button>
          )}

          {/* Layer Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <Filter size={12} className="text-muted" />
            <select
              className="select select-xs"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              title={tr('Filtrer par couche...')}
            >
              <option value="ALL">{tr('Toutes les couches')}</option>
              <option value="VERIFIED">{tr('1. Preuve Vérifiée')}</option>
              <option value="OSINT_RAW">{tr('2. OSINT Brute')}</option>
              <option value="INFRA">{tr('3. Données Opérateurs')}</option>
              <option value="HYPOTHESIS">{tr('4. Hypothèses Enquêteur')}</option>
              <option value="FLOWS">{tr('5. Flux Financiers')}</option>
            </select>
          </div>
        </div>

        {/* Enhanced Autocomplete Entity Search */}
        <div className="timeline-search-wrap" ref={searchAutocompleteRef}>
          <Search size={13} className="timeline-search-icon" />
          <input
            type="text"
            role="combobox"
            className="input input-xs timeline-search-input"
            placeholder={tr('Rechercher une entité...')}
            value={searchTerm}
            onFocus={() => setIsSearchDropdownOpen(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchDropdownOpen(true);
            }}
            aria-label={tr('Rechercher une entité...')}
            aria-controls="timeline-search-listbox"
            aria-expanded={isSearchDropdownOpen}
            aria-autocomplete="list"
          />
          {searchTerm && (
            <button
              type="button"
              className="timeline-search-clear"
              onClick={() => setSearchTerm('')}
              aria-label={tr('Effacer la recherche')}
            >
              <X size={12} />
            </button>
          )}

          {isSearchDropdownOpen && (
            <div id="timeline-search-listbox" className="timeline-search-dropdown" role="listbox">
              {searchSuggestions.length === 0 ? (
                <div className="timeline-search-empty">{tr('Aucune entité trouvée')}</div>
              ) : (
                searchSuggestions.map((node) => {
                  const typeDef = registry.node_types[node.type];
                  const domKey = NODE_TYPE_TO_CATEGORY[node.type] || 'acteurs';
                  const domColor = ONTOLOGY_CATEGORY_COLORS[domKey] || 'var(--color-accent-primary)';
                  const dateShort = node.created_at
                    ? new Date(node.created_at).toLocaleDateString(dateLocale, {
                        day: '2-digit',
                        month: 'short',
                      })
                    : '—';
                  return (
                    <button
                      key={node.id}
                      type="button"
                      role="option"
                      aria-selected={selectedNodeId === node.id}
                      className="timeline-search-item"
                      onClick={() => handleSelectAutocompleteNode(node.id)}
                    >
                      <span className="timeline-search-item-main">
                        <span style={{ color: domColor, display: 'inline-flex', flexShrink: 0 }}>
                          <NodeIcon name={typeDef?.icon || 'help-circle'} size={13} />
                        </span>
                        <span className="timeline-search-item-label" title={trLabel(node.label)}>
                          {trLabel(node.label)}
                        </span>
                      </span>
                      <span className="timeline-search-item-meta font-mono">{dateShort}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* LEVEL 3: Animation Playback, Temporal Scrubber & Time Scale Granularity */}
      <div className="timeline-bar-level-3" role="region" aria-label={tr("Curseur d'évolution temporelle")}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flexShrink: 0 }}>
          <button
            type="button"
            className={`btn btn-xs ${isPlaying ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleTogglePlay}
            disabled={totalSteps <= 1}
            style={{ minWidth: '82px', justifyContent: 'center' }}
            title={isPlaying ? tr('Pause') : tr('Animer')}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? tr('Pause') : tr('Animer')}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={handleStepBack}
            disabled={currentStep <= 1}
            title={tr('Étape précédente')}
            aria-label={tr('Étape précédente')}
          >
            <SkipBack size={12} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps}
            title={tr('Étape suivante')}
            aria-label={tr('Étape suivante')}
          >
            <SkipForward size={12} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs font-mono"
            onClick={cyclePlaybackSpeed}
            style={{ minWidth: '38px', justifyContent: 'center' }}
            title={tr('Vitesse de lecture temporelle')}
          >
            {playbackSpeed}x
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={handleResetTimeline}
            disabled={currentStep >= totalSteps && !isPlaying}
            style={{ minWidth: '76px', justifyContent: 'center' }}
            title={tr('Afficher toute la chronologie (100%)')}
          >
            <RotateCcw size={12} />
            <span>{tr('Complet')}</span>
          </button>
        </div>

        {/* Interactive Time Scrubber Range Input */}
        <div className="timeline-slider-track-wrap">
          <Clock size={13} className="text-muted" />
          <input
            type="range"
            className="timeline-range-input"
            min={1}
            max={Math.max(1, totalSteps)}
            value={currentStep}
            onChange={(e) => {
              setIsPlaying(false);
              setTimeCursorStep(Number(e.target.value));
            }}
            aria-label={tr("Faire glisser dans le temps pour visualiser l'évolution de l'enquête")}
          />
        </div>

        {/* Time Granularity Scale Selector inside Animation Bar */}
        {viewMode === 'dag' && (
          <div
            className="timeline-granularity-group"
            role="group"
            aria-label={tr('Granularité temporelle :')}
          >
            {(
              [
                { id: 'month', label: tr('Mois') },
                { id: 'day', label: tr('Jour') },
                { id: 'hour', label: tr('Heure') },
                { id: 'minute', label: tr('Minute') },
                { id: 'second', label: tr('Seconde') },
              ] as const
            ).map((g) => (
              <button
                key={g.id}
                type="button"
                className={`timeline-granularity-btn ${timeGranularity === g.id ? 'is-active' : ''}`}
                onClick={() => setTimeGranularity(g.id)}
                aria-pressed={timeGranularity === g.id}
              >
                {g.label}
              </button>
            ))}
          </div>
        )}

        {/* Fixed-width Temporal Evolution Status Readout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
            width: '230px',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <span
            className="chip chip-neutral font-mono text-xs"
            style={{ minWidth: '98px', justifyContent: 'center', flexShrink: 0 }}
          >
            {tr('Étape')} {currentStep} / {totalSteps}
          </span>
          {latestRevealedNode && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => handleSelectNode(latestRevealedNode.id)}
              style={{
                flex: 1,
                minWidth: 0,
                justifyContent: 'flex-start',
                overflow: 'hidden',
              }}
              title={trLabel(latestRevealedNode.label)}
            >
              <span
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getShortNodeLabel(trLabel(latestRevealedNode.label), latestRevealedNode.type)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {viewMode === 'dag' ? (
          <div
            ref={dagContainerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              cursor: isPanning ? 'grabbing' : timelineToolMode === 'pan' ? 'grab' : 'default',
              userSelect: 'none',
              backgroundColor: 'var(--color-bg-canvas)',
              backgroundImage:
                'radial-gradient(circle, var(--color-border-subtle) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div
              style={{
                position: 'absolute',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                transition: isPanning ? 'none' : 'transform 0.08s ease-out',
                minWidth: `${boundsWidth}px`,
                minHeight: `${boundsHeight}px`,
              }}
            >
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${boundsWidth + 160}px`,
                  height: `${boundsHeight + 160}px`,
                  pointerEvents: 'none',
                  overflow: 'visible',
                  zIndex: 1,
                }}
              >
                <defs>
                  <marker
                    id="dag-orthogonal-arrow"
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 12 10"
                    refX="9.5"
                    refY="5"
                    markerWidth="10"
                    markerHeight="9"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 L 2.4 5 z" fill="var(--color-text-secondary)" />
                  </marker>

                  <marker
                    id="dag-ancestor-arrow"
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 12 10"
                    refX="9.5"
                    refY="5"
                    markerWidth="11"
                    markerHeight="10"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 L 2.4 5 z" fill="var(--color-accent-text)" />
                  </marker>

                  <marker
                    id="dag-merge-arrow"
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 12 10"
                    refX="9.5"
                    refY="5"
                    markerWidth="10"
                    markerHeight="9"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 10 5 L 0 9 L 2.4 5 z" fill="var(--color-status-warning-text)" />
                  </marker>
                </defs>

                {/* Vertical Lane Guides */}
                {Array.from({ length: maxLanes }).map((_, lIdx) => (
                  <line
                    key={`rail-${lIdx}`}
                    x1={startX + lIdx * laneWidth + circleRadius}
                    y1={Math.max(12, startY - 16)}
                    x2={startX + lIdx * laneWidth + circleRadius}
                    y2={startY + maxRows * rowHeight + 24}
                    stroke="var(--color-border-subtle)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                    opacity={0.22}
                  />
                ))}

                {/* Horizontal Time-Level Baselines (Full Span Synced to Left Time Axis) */}
                {timeLevels.map((lvl) => (
                  <line
                    key={`lvl-guide-${lvl.row}-${lvl.bucketKey}`}
                    x1={-2000}
                    y1={lvl.y + circleRadius}
                    x2={boundsWidth + 2000}
                    y2={lvl.y + circleRadius}
                    className="timeline-level-guide"
                  />
                ))}

                {/* Clean Inter-Row, Same-Row & Inter-Gutter Orthogonal Routing */}
                {dagEdges.map((e) => {
                  const dx = e.x2 - e.x1;
                  const rowSpan = Math.abs(e.tgtRow - e.srcRow);
                  const isInBranch = Boolean(e.isAncestralHighlight);
                  const hasSelection = Boolean(selectedNodeId && highlightedBranchNodeIds.size > 0);
                  const corridorOffset = Math.min(20, Math.max(13, Math.floor((rowHeight - circleRadius * 2) / 2)));

                  let pathD = '';
                  if (rowSpan === 0) {
                    // Same temporal level: route clean overhead arch above the circle + label pill row
                    const centerY = e.y1 - circleRadius;
                    const archY = centerY - (circleRadius + 15);
                    pathD = `M ${e.x1} ${centerY - circleRadius} L ${e.x1} ${archY} L ${e.x2} ${archY} L ${e.x2} ${centerY - circleRadius - 3}`;
                  } else if (Math.abs(dx) < 2 && rowSpan <= 1) {
                    // Direct 1-row vertical drop in same lane
                    pathD = `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`;
                  } else if (Math.abs(dx) < 2 && rowSpan > 1) {
                    // Same-lane multi-row chord: exit left edge of source circle, travel down left gutter, enter left edge of target
                    const srcCenterY = e.y1 - circleRadius;
                    const tgtCenterY = e.y2 + circleRadius + 3;
                    const leftGutterX = e.x1 - (circleRadius + 12);
                    pathD = `M ${e.x1 - circleRadius} ${srcCenterY} L ${leftGutterX} ${srcCenterY} L ${leftGutterX} ${tgtCenterY} L ${e.x2 - circleRadius - 3} ${tgtCenterY}`;
                  } else if (rowSpan <= 1) {
                    // 1-row step across lanes: horizontal bend in inter-row corridor
                    const corridorY = e.y2 - corridorOffset;
                    pathD = `M ${e.x1} ${e.y1} L ${e.x1} ${corridorY} L ${e.x2} ${corridorY} L ${e.x2} ${e.y2}`;
                  } else {
                    // Multi-row span across lanes: exit left of source circle into gutter, drop down to target corridor
                    const srcCenterY = e.y1 - circleRadius;
                    const lowerCorridorY = e.y2 - corridorOffset;
                    const leftGutterX = e.x1 - (circleRadius + 10);
                    pathD = `M ${e.x1 - circleRadius} ${srcCenterY} L ${leftGutterX} ${srcCenterY} L ${leftGutterX} ${lowerCorridorY} L ${e.x2} ${lowerCorridorY} L ${e.x2} ${e.y2}`;
                  }

                  const strokeColor = isInBranch
                    ? 'var(--color-accent-text)'
                    : e.isMerge
                    ? 'var(--color-status-warning-text)'
                    : LAYER_COLORS[e.layer] || 'var(--color-text-secondary)';

                  const strokeWidth = isInBranch ? 3 : e.isMerge ? 2.2 : 2;

                  const markerId = isInBranch
                    ? 'url(#dag-ancestor-arrow)'
                    : e.isMerge
                    ? 'url(#dag-merge-arrow)'
                    : 'url(#dag-orthogonal-arrow)';

                  return (
                    <g key={e.id}>
                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={e.layer === 'HYPOTHESIS' ? '4 4' : undefined}
                        opacity={hasSelection ? (isInBranch ? 1 : 0.18) : 0.92}
                        markerEnd={markerId}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* CIRCULAR NODES WITH COMPACT SHORT LABEL (INVARIANT POSITIONS, FULL DETAILS ON CLICK IN RIGHT INSPECTOR) */}
              {dagNodes.map((n) => {
                const isSelected = selectedNodeId === n.node.id;
                const isInBranch = highlightedBranchNodeIds.has(n.node.id);
                const hasSelection = Boolean(selectedNodeId && highlightedBranchNodeIds.size > 0);
                const isLatest = latestRevealedNode?.id === n.node.id && currentStep < totalSteps;
                const typeDef = registry.node_types[n.node.type];
                const domKey = NODE_TYPE_TO_CATEGORY[n.node.type] || 'acteurs';
                const domColor = ONTOLOGY_CATEGORY_COLORS[domKey] || 'var(--color-accent-primary)';
                const localizedLabelText = trLabel(n.node.label);
                const shortText = getShortNodeLabel(localizedLabelText, n.node.type);

                const photoUrl =
                  (n.node.properties?.photo_url as string) ||
                  (n.node.properties?.photo as string) ||
                  null;

                return (
                  <div
                    key={n.node.id}
                    className="dag-node-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFocusDagNode(n);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleFocusDagNode(n);
                      openContextMenu(e.clientX, e.clientY, n.node.id);
                    }}
                    style={{
                      position: 'absolute',
                      left: `${n.x}px`,
                      top: `${n.y}px`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      opacity: !hasSelection || isInBranch ? 1 : 0.22,
                      transition: 'opacity 150ms ease',
                      zIndex: isSelected ? 30 : isLatest ? 28 : isInBranch ? 25 : 10,
                      userSelect: 'none',
                    }}
                    title={localizedLabelText}
                  >
                    {/* 1. CIRCLE WITH ICON */}
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: `2.5px solid ${
                          isSelected
                            ? 'var(--color-accent-primary)'
                            : isInBranch
                            ? 'var(--color-accent-text)'
                            : isLatest
                            ? 'var(--color-status-success)'
                            : domColor
                        }`,
                        boxShadow: isSelected || isInBranch ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: domColor,
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={shortText}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            display: 'block',
                          }}
                        />
                      ) : (
                        <NodeIcon name={typeDef?.icon || 'help-circle'} size={17} />
                      )}

                      {/* Mini Convergence Badge */}
                      {n.isMerge && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-4px',
                            right: '-6px',
                            backgroundColor: 'var(--color-status-warning)',
                            color: 'var(--color-neutral-950)',
                            fontSize: '10px',
                            fontWeight: 700,
                            minWidth: '16px',
                            height: '16px',
                            borderRadius: 'var(--radius-full)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1px',
                            padding: '0 3px',
                            boxShadow: 'var(--shadow-xs)',
                          }}
                          title={`${n.parentIds.length}`}
                        >
                          <GitMerge size={9} />
                          <span>{n.parentIds.length}</span>
                        </span>
                      )}
                    </div>

                    {/* 2. COMPACT SHORT TEXT PILL ONLY */}
                    <div
                      className={`dag-short-pill ${isSelected ? 'is-selected' : ''} ${
                        isLatest ? 'is-latest' : ''
                      }`}
                    >
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          fontWeight: isSelected ? 700 : 600,
                          color: isSelected
                            ? 'var(--color-accent-text)'
                            : 'var(--color-text-primary)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {shortText}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Left Chronological Axis Gutter (Synchronized to Vertical Pan & Zoom) */}
            <aside
              className="timeline-left-axis"
              aria-label={tr('Axe chronologique gauche')}
            >
              <div className="timeline-left-axis-header">
                <span className="timeline-left-axis-title">
                  <Clock size={12} className="text-accent" />
                  <span>
                    {timeGranularity === 'month'
                      ? tr('Mois')
                      : timeGranularity === 'day'
                      ? tr('Jour')
                      : timeGranularity === 'hour'
                      ? tr('Heure')
                      : timeGranularity === 'minute'
                      ? tr('Minute')
                      : tr('Seconde')}
                  </span>
                </span>
                <span className="font-mono text-muted">{timeLevels.length}</span>
              </div>
              {(() => {
                let lastRenderedY = -Infinity;
                return timeLevels.map((lvl) => {
                  const screenY = pan.y + (lvl.y + circleRadius) * zoom;
                  if (screenY < 44 || screenY > dagContainerSize.h - 12) return null;
                  if (screenY - lastRenderedY < 30) return null;
                  lastRenderedY = screenY;
                  const isRowActive = dagNodes.some(
                    (dn) =>
                      dn.row === lvl.row &&
                      (dn.node.id === selectedNodeId ||
                        (latestRevealedNode?.id === dn.node.id && currentStep < totalSteps))
                  );
                  return (
                    <div
                      key={`axis-tick-${lvl.row}-${lvl.bucketKey}`}
                      className={`timeline-left-tick ${isRowActive ? 'is-active' : ''}`}
                      style={{ top: `${screenY}px` }}
                      title={lvl.label}
                    >
                      <span className="timeline-left-tick-label">{lvl.label}</span>
                      <span className="timeline-left-tick-dot" aria-hidden="true" />
                    </div>
                  );
                });
              })()}
            </aside>

            {/* Bottom-Left Floating Navigation & Scale Palette (Matching Graph Interface) */}
            <nav
              className="canvas-floating-palette timeline-floating-palette"
              role="toolbar"
              aria-label={tr('Outils de navigation et manipulation du canevas')}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={`btn btn-ghost btn-sm ${timelineToolMode === 'select' ? 'active' : ''}`}
                onClick={() => setTimelineToolMode('select')}
                aria-pressed={timelineToolMode === 'select'}
                aria-label={tr('Mode Sélection (Pointeur)')}
                title={tr('Mode Sélection (Pointeur)')}
              >
                <MousePointer size={14} />
              </button>

              <button
                type="button"
                className={`btn btn-ghost btn-sm ${timelineToolMode === 'pan' ? 'active' : ''}`}
                onClick={() => setTimelineToolMode('pan')}
                aria-pressed={timelineToolMode === 'pan'}
                aria-label={tr('Déplacer le canevas (Pan)')}
                title={tr('Déplacer le canevas (Glisser avec clic gauche)')}
              >
                <Hand size={14} />
              </button>

              <div className="palette-divider" role="separator" />

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => applyTimelineCenteredZoom(zoom * 0.8)}
                aria-label={tr('Zoom arrière')}
                title={tr('Zoom arrière (-)')}
              >
                <ZoomOut size={14} />
              </button>

              <div className="palette-scale-wrap" ref={scalePopoverRef}>
                <button
                  type="button"
                  className={`btn btn-ghost btn-sm palette-scale-trigger font-mono ${isScaleOpen ? 'active' : ''}`}
                  onClick={() => setIsScaleOpen((prev) => !prev)}
                  aria-expanded={isScaleOpen}
                  aria-label={tr('Échelle de zoom (10% – 1000%)')}
                  title={tr("Choisir l'échelle du graphe (10% à 1000%)")}
                >
                  <span>{Math.round(zoom * 100)}%</span>
                </button>

                {isScaleOpen && (
                  <div
                    className="palette-scale-popover"
                    role="dialog"
                    aria-label={tr('Échelle de zoom (10% – 1000%)')}
                    onMouseDown={(e) => e.stopPropagation()}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <div className="palette-scale-header">
                      <span className="palette-scale-title">{tr('Échelle du graphe')}</span>
                      <div className="palette-scale-actions">
                        <span className="palette-scale-badge font-mono">{Math.round(zoom * 100)}%</span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          onClick={() => {
                            hasManualViewportRef.current = false;
                            fitDagToViewport();
                            setIsScaleOpen(false);
                          }}
                        >
                          {tr('Ajuster')}
                        </button>
                      </div>
                    </div>

                    <div className="palette-scale-slider-row">
                      <span className="palette-scale-bound font-mono">10%</span>
                      <input
                        type="range"
                        className="modern-horizontal-slider"
                        min={10}
                        max={1000}
                        step={1}
                        value={Math.min(Math.max(Math.round(zoom * 100), 10), 1000)}
                        onChange={(e) => applyTimelineCenteredZoom(Number(e.target.value) / 100)}
                        onMouseDown={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        aria-label={tr("Curseur d'échelle de zoom")}
                      />
                      <span className="palette-scale-bound font-mono">1000%</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => applyTimelineCenteredZoom(zoom * 1.25)}
                aria-label={tr('Zoom avant')}
                title={tr('Zoom avant (+)')}
              >
                <ZoomIn size={14} />
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  hasManualViewportRef.current = false;
                  fitDagToViewport();
                }}
                aria-label={tr('Ajuster la vue (Centrer)')}
                title={tr('Ajuster la vue (Centrer)')}
              >
                <Maximize2 size={14} />
              </button>
            </nav>

            {/* Interactive Radar Mini-Map (Bottom-Right) */}
            <CanvasMinimap
              nodes={minimapNodes}
              viewport={{ panX: pan.x, panY: pan.y, zoom }}
              onViewportChange={(nextPanX, nextPanY, nextZoom) => {
                hasManualViewportRef.current = true;
                setPan({ x: nextPanX, y: nextPanY });
                setZoom(nextZoom);
              }}
              containerWidth={dagContainerSize.w}
              containerHeight={dagContainerSize.h}
            />
          </div>
        ) : (
          /* =========================================================================
             Linear Sequential View (Compact Short Text — Click shows details on side)
             ========================================================================= */
          <div
            style={{
              padding: 'var(--space-6)',
              overflowY: 'auto',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <div style={{ maxWidth: '680px', width: '100%', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  bottom: '10px',
                  left: '20px',
                  width: '2px',
                  backgroundColor: 'var(--color-border-subtle)',
                }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {sortedLinearEvents.map((event) => {
                  const isSelected = selectedNodeId === event.id;
                  const typeDef = registry.node_types[event.type];
                  const color = LAYER_COLORS[event.layer] || 'var(--color-border-default)';
                  const localizedEventLabel = trLabel(event.label);
                  const shortText = getShortNodeLabel(localizedEventLabel, event.type);

                  const formattedDate = event.created_at
                    ? new Date(event.created_at).toLocaleDateString(dateLocale, {
                        dateStyle: 'short',
                      })
                    : '';

                  return (
                    <button
                      type="button"
                      key={event.id}
                      onClick={() => handleSelectNode(event.id)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSelectNode(event.id);
                        openContextMenu(e.clientX, e.clientY, event.id);
                      }}
                      className="btn btn-ghost"
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-1-5) var(--space-2)',
                        textAlign: 'start',
                      }}
                      title={localizedEventLabel}
                    >
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--color-bg-surface)',
                          border: `3px solid ${color}`,
                          zIndex: 2,
                          flexShrink: 0,
                        }}
                      />

                      <div
                        style={{
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          backgroundColor: isSelected
                            ? 'var(--color-accent-subtle)'
                            : 'var(--color-bg-surface)',
                          border: '1px solid',
                          borderColor: isSelected
                            ? 'var(--color-accent-primary)'
                            : 'var(--color-border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--space-1-5) var(--space-3)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <NodeIcon name={typeDef?.icon || 'help-circle'} size={14} />
                          <span
                            style={{
                              fontWeight: 600,
                              fontSize: 'var(--text-xs)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {shortText}
                          </span>
                        </div>
                        {formattedDate && (
                          <span className="chip chip-neutral font-mono text-xs">
                            {formattedDate}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
