import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGraphStore, NODE_TYPE_TO_CATEGORY, ONTOLOGY_CATEGORY_COLORS } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
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

interface DagNodeLayout {
  node: GraphNode;
  row: number;
  lane: number;
  x: number;
  y: number;
  isRoot: boolean;
  isFork: boolean;
  isMerge: boolean;
  parentIds: string[];
  childIds: string[];
}

interface DagEdgeLayout {
  id: string;
  sourceId: string;
  targetId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  relationType: string;
  layer: LayerId;
  isMerge: boolean;
  isAncestralHighlight?: boolean;
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

  if (nodeType === 'Person') {
    const parts = clean.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      const initial = parts[0].charAt(0).toUpperCase();
      const family = parts.slice(1).join(' ');
      const shortPerson = `${initial}. ${family}`;
      return shortPerson.length > 16 ? `${shortPerson.slice(0, 15)}…` : shortPerson;
    }
  }

  if (
    nodeType === 'PhoneNumber' ||
    nodeType === 'BankAccount' ||
    nodeType === 'CcpAccount' ||
    nodeType === 'CryptoWallet' ||
    nodeType === 'ImeiDevice'
  ) {
    if (clean.length > 10) {
      return `…${clean.slice(-6)}`;
    }
  }

  return clean.length > 16 ? `${clean.slice(0, 15)}…` : clean;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectNode }) => {
  const { nodes, edges, selectedNodeId, selectNode } = useGraphStore();
  const { locale } = useI18n();

  const [viewMode, setViewMode] = useState<'dag' | 'linear'>('dag');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLayer, setSelectedLayer] = useState<string>('ALL');

  // Branch filtering: default hides short branches with <= 3 nodes
  const [hideSmallBranches, setHideSmallBranches] = useState<boolean>(true);
  const [minBranchNodes, setMinBranchNodes] = useState<number>(4);
  const [selectedBranchIds, setSelectedBranchIds] = useState<Set<string> | null>(null);
  const [isBranchSelectorOpen, setIsBranchSelectorOpen] = useState(false);
  const [branchFilterSearch, setBranchFilterSearch] = useState('');

  // Temporal Evolution Slider & Animation state
  const [timeCursorStep, setTimeCursorStep] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Canvas Pan & Zoom state for DAG Navigation
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 50, y: 40 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const dateLocale = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-GB' : 'fr-FR';

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
        const curr = queue.shift()!;
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
  const activeBranches = useMemo(() => {
    return allBranches.filter((b) => {
      if (selectedBranchIds !== null) {
        return selectedBranchIds.has(b.id);
      }
      if (hideSmallBranches) {
        return b.nodeCount >= minBranchNodes;
      }
      return true;
    });
  }, [allBranches, selectedBranchIds, hideSmallBranches, minBranchNodes]);

  // Set of visible node IDs from active branches
  const branchVisibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    activeBranches.forEach((b) => {
      b.reachableNodeIds.forEach((id) => ids.add(id));
    });
    return ids;
  }, [activeBranches]);

  // Base nodes in active branches (before temporal slider cutoff)
  const branchFilteredNodes = useMemo(() => {
    return activeNodes.filter((n) => branchVisibleNodeIds.has(n.id));
  }, [activeNodes, branchVisibleNodeIds]);

  // 4. Chronological Ordering for the Temporal Evolution Slider
  const chronologicalSequence = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    branchFilteredNodes.forEach((n) => nodeMap.set(n.id, n));

    const adj = new Map<string, string[]>();
    const revAdj = new Map<string, string[]>();
    branchFilteredNodes.forEach((n) => {
      adj.set(n.id, []);
      revAdj.set(n.id, []);
    });
    edges.forEach((e) => {
      if (nodeMap.has(e.source_id) && nodeMap.has(e.target_id)) {
        adj.get(e.source_id)?.push(e.target_id);
        revAdj.get(e.target_id)?.push(e.source_id);
      }
    });

    // Compute topological depth so parents always appear before children in time slider
    const depthMap = new Map<string, number>();
    const roots = branchFilteredNodes.filter((n) => (revAdj.get(n.id)?.length || 0) === 0);
    const queue: string[] = [];
    roots.forEach((r) => {
      depthMap.set(r.id, 0);
      queue.push(r.id);
    });
    while (queue.length > 0) {
      const curr = queue.shift()!;
      const d = depthMap.get(curr) || 0;
      (adj.get(curr) || []).forEach((cId) => {
        const nextD = d + 1;
        const prevD = depthMap.get(cId);
        if (prevD === undefined || nextD > prevD) {
          depthMap.set(cId, nextD);
          queue.push(cId);
        }
      });
    }

    return [...branchFilteredNodes].sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (tA !== tB) return tA - tB;
      const dA = depthMap.get(a.id) ?? 0;
      const dB = depthMap.get(b.id) ?? 0;
      if (dA !== dB) return dA - dB;
      return a.id.localeCompare(b.id);
    });
  }, [branchFilteredNodes, edges]);

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
  const revealedNodeIds = useMemo(() => {
    const slice = chronologicalSequence.slice(0, currentStep);
    return new Set(slice.map((n) => n.id));
  }, [chronologicalSequence, currentStep]);

  const latestRevealedNode = useMemo(() => {
    if (totalSteps === 0 || currentStep < 1) return null;
    return chronologicalSequence[currentStep - 1] || null;
  }, [chronologicalSequence, currentStep, totalSteps]);

  const dagActiveNodes = useMemo(() => {
    return branchFilteredNodes.filter((n) => revealedNodeIds.has(n.id));
  }, [branchFilteredNodes, revealedNodeIds]);

  // 5. Compute Ancestor Set for Selected Node (Highlight full investigative genealogy)
  const ancestorNodeIds = useMemo(() => {
    if (!selectedNodeId) return new Set<string>();

    const ancestors = new Set<string>();
    const queue = [selectedNodeId];

    while (queue.length > 0) {
      const curr = queue.shift()!;
      ancestors.add(curr);

      edges.forEach((e) => {
        if (e.target_id === curr && !ancestors.has(e.source_id)) {
          ancestors.add(e.source_id);
          queue.push(e.source_id);
        }
      });
    }

    return ancestors;
  }, [selectedNodeId, edges]);

  // 6. Orthogonal DAG Layout: Roots ordered from LEFT to RIGHT by size
  const { dagNodes, dagEdges, maxLanes, maxRows } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    dagActiveNodes.forEach((n) => nodeMap.set(n.id, n));

    const adj = new Map<string, string[]>();
    const revAdj = new Map<string, string[]>();

    dagActiveNodes.forEach((n) => {
      adj.set(n.id, []);
      revAdj.set(n.id, []);
    });

    edges.forEach((e) => {
      if (nodeMap.has(e.source_id) && nodeMap.has(e.target_id)) {
        adj.get(e.source_id)?.push(e.target_id);
        revAdj.get(e.target_id)?.push(e.source_id);
      }
    });

    const activeRoots = activeBranches
      .map((b) => nodeMap.get(b.id))
      .filter((n): n is GraphNode => n !== undefined);

    const depthMap = new Map<string, number>();
    const queue: string[] = [];

    activeRoots.forEach((r) => {
      depthMap.set(r.id, 0);
      queue.push(r.id);
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const currDepth = depthMap.get(curr) || 0;
      const children = adj.get(curr) || [];

      children.forEach((childId) => {
        const nextDepth = currDepth + 1;
        const prevDepth = depthMap.get(childId);
        if (prevDepth === undefined || nextDepth > prevDepth) {
          depthMap.set(childId, nextDepth);
          queue.push(childId);
        }
      });
    }

    dagActiveNodes.forEach((n) => {
      if (!depthMap.has(n.id)) {
        depthMap.set(n.id, 0);
      }
    });

    const rowBuckets = new Map<number, GraphNode[]>();
    let computedMaxRow = 0;

    dagActiveNodes.forEach((node) => {
      const row = depthMap.get(node.id) || 0;
      if (row > computedMaxRow) computedMaxRow = row;
      const list = rowBuckets.get(row) || [];
      list.push(node);
      rowBuckets.set(row, list);
    });

    const laneMap = new Map<string, number>();
    let nextAvailableLane = 0;

    activeRoots.forEach((root) => {
      laneMap.set(root.id, nextAvailableLane);
      nextAvailableLane += 1;
    });

    let globalMaxLane = Math.max(0, nextAvailableLane - 1);

    for (let r = 1; r <= computedMaxRow; r++) {
      const nodesInRow = rowBuckets.get(r) || [];

      nodesInRow.sort((a, b) => {
        const parentsA = revAdj.get(a.id) || [];
        const parentsB = revAdj.get(b.id) || [];
        const avgLaneA =
          parentsA.length > 0
            ? parentsA.reduce((sum, p) => sum + (laneMap.get(p) ?? 0), 0) / parentsA.length
            : 0;
        const avgLaneB =
          parentsB.length > 0
            ? parentsB.reduce((sum, p) => sum + (laneMap.get(p) ?? 0), 0) / parentsB.length
            : 0;
        return avgLaneA - avgLaneB;
      });

      const usedLanesInRow = new Set<number>();
      nodesInRow.forEach((node) => {
        const parents = revAdj.get(node.id) || [];
        let preferredLane =
          parents.length > 0
            ? Math.round(
                parents.reduce((sum, p) => sum + (laneMap.get(p) ?? 0), 0) / parents.length
              )
            : 0;

        while (usedLanesInRow.has(preferredLane)) {
          preferredLane += 1;
        }

        usedLanesInRow.add(preferredLane);
        laneMap.set(node.id, preferredLane);
        if (preferredLane > globalMaxLane) globalMaxLane = preferredLane;
      });
    }

    const LANE_WIDTH = 210;
    const ROW_HEIGHT = 96;
    const START_X = 60;
    const START_Y = 44;
    const CIRCLE_RADIUS = 18;

    const nodeLayoutList: DagNodeLayout[] = dagActiveNodes.map((node) => {
      const row = depthMap.get(node.id) || 0;
      const lane = laneMap.get(node.id) || 0;
      const parents = revAdj.get(node.id) || [];
      const children = adj.get(node.id) || [];

      return {
        node,
        row,
        lane,
        x: START_X + lane * LANE_WIDTH,
        y: START_Y + row * ROW_HEIGHT,
        isRoot: parents.length === 0,
        isFork: children.length > 1,
        isMerge: parents.length > 1,
        parentIds: parents,
        childIds: children,
      };
    });

    const nodePosLookup = new Map<string, DagNodeLayout>();
    nodeLayoutList.forEach((nl) => nodePosLookup.set(nl.node.id, nl));

    const edgeLayoutList: DagEdgeLayout[] = [];

    edges.forEach((edge) => {
      const src = nodePosLookup.get(edge.source_id);
      const tgt = nodePosLookup.get(edge.target_id);
      if (!src || !tgt) return;

      const isAncestral =
        ancestorNodeIds.has(edge.source_id) && ancestorNodeIds.has(edge.target_id);

      const pX = src.x + CIRCLE_RADIUS;
      const pY = src.y + CIRCLE_RADIUS;
      const cX = tgt.x + CIRCLE_RADIUS;
      const cY = tgt.y + CIRCLE_RADIUS;

      edgeLayoutList.push({
        id: edge.id,
        sourceId: edge.source_id,
        targetId: edge.target_id,
        x1: pX,
        y1: pY + CIRCLE_RADIUS,
        x2: cX,
        y2: cY - CIRCLE_RADIUS,
        relationType: edge.type,
        layer: edge.layer,
        isMerge: tgt.isMerge,
        isAncestralHighlight: isAncestral,
      });
    });

    return {
      dagNodes: nodeLayoutList,
      dagEdges: edgeLayoutList,
      maxLanes: globalMaxLane + 1,
      maxRows: computedMaxRow + 1,
    };
  }, [dagActiveNodes, edges, ancestorNodeIds, activeBranches]);

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

  // Focus node in DAG canvas and display full details in Right Inspector
  const handleFocusDagNode = useCallback(
    (nodeLayout: DagNodeLayout) => {
      handleSelectNode(nodeLayout.node.id);
    },
    [handleSelectNode]
  );

  // Linear view events sorted chronologically
  const sortedLinearEvents = useMemo(() => {
    return [...dagActiveNodes].sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return tA - tB;
    });
  }, [dagActiveNodes]);

  // Drag and pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.dag-node-item')) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y,
    });
  };

  const handleMouseUp = () => setIsPanning(false);

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

  const currentCutoffDateStr = useMemo(() => {
    if (!latestRevealedNode?.created_at) return '';
    return new Date(latestRevealedNode.created_at).toLocaleString(dateLocale, {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }, [latestRevealedNode, dateLocale]);

  return (
    <div className="timeline-view-shell">
      {/* 1. Top Filter and Command Toolbar */}
      <div className="timeline-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* View Mode Switcher */}
          <div className="canvas-segmented-tabs" role="tablist" aria-label="Mode chronologique">
            <button
              type="button"
              className={`canvas-segmented-btn ${viewMode === 'dag' ? 'active' : ''}`}
              onClick={() => setViewMode('dag')}
              title="Chronologie Arborescente Descendante (Arbre d'enquête & convergences)"
            >
              <GitBranch size={13} />
              <span>Arbre Multi-Branches</span>
            </button>
            <button
              type="button"
              className={`canvas-segmented-btn ${viewMode === 'linear' ? 'active' : ''}`}
              onClick={() => setViewMode('linear')}
              title="Flux linéaire chronologique vertical"
            >
              <List size={13} />
              <span>Linéaire</span>
            </button>
          </div>

          {/* Interactive Branch Selector Button */}
          {viewMode === 'dag' && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`btn btn-xs ${isBranchSelectorOpen ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsBranchSelectorOpen((prev) => !prev)}
                title="Sélectionner les pistes chronologiques et filtrer par nombre de nœuds"
              >
                <SlidersHorizontal size={12} />
                <span>Pistes d'enquête</span>
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
                    left: 0,
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
                        Pistes chronologiques
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        Classées par taille (les plus fournies à gauche)
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => setIsBranchSelectorOpen(false)}
                      aria-label="Fermer le sélecteur de pistes"
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
                      Majeures (≥ 4)
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-secondary"
                      onClick={applyPresetAllBranches}
                      style={{ flex: 1 }}
                    >
                      Toutes ({allBranches.length})
                    </button>
                    <button
                      type="button"
                      className="btn btn-xs btn-danger"
                      onClick={applyPresetNoneBranches}
                      style={{ flex: 1 }}
                      title="Désactiver toutes les pistes chronologiques"
                    >
                      Tout désactiver
                    </button>
                  </div>

                  {/* Search inside branches */}
                  <div style={{ padding: 'var(--space-2) var(--space-3)' }}>
                    <input
                      type="text"
                      className="input input-xs"
                      placeholder="Filtrer les pistes..."
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
                                title={branch.label}
                              >
                                #{rank + 1} {getShortNodeLabel(branch.label, branch.type)}
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
                  ? 'Activer toutes les pistes'
                  : 'Désactiver toutes les pistes en 1 clic'
              }
            >
              {selectedBranchIds && selectedBranchIds.size === 0 ? (
                <>
                  <Eye size={12} />
                  <span>Activer toutes les pistes</span>
                </>
              ) : (
                <>
                  <EyeOff size={12} />
                  <span>Désactiver toutes les pistes</span>
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
              title="Masquer automatiquement les pistes courtes (≤ 3 nœuds)"
            >
              {hideSmallBranches ? <EyeOff size={12} /> : <Eye size={12} />}
              <span>Pistes courtes (≤ 3)</span>
            </button>
          )}

          {/* Layer Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
            <Filter size={12} className="text-muted" />
            <select
              className="select select-xs"
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value)}
              title="Filtrer par couche probatoire"
            >
              <option value="ALL">Toutes les couches</option>
              <option value="VERIFIED">1. Preuve Vérifiée</option>
              <option value="OSINT_RAW">2. OSINT Brute</option>
              <option value="INFRA">3. Données Opérateurs</option>
              <option value="HYPOTHESIS">4. Hypothèses Enquêteur</option>
              <option value="FLOWS">5. Flux Financiers</option>
            </select>
          </div>
        </div>

        {/* Search & DAG Zoom Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={12}
              style={{
                position: 'absolute',
                left: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--color-text-muted)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              className="input input-xs"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingInlineStart: '24px', width: '160px' }}
            />
          </div>

          {viewMode === 'dag' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                backgroundColor: 'var(--color-bg-elevated)',
                padding: '2px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-default)',
              }}
            >
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setZoom((z) => Math.max(0.3, z - 0.1))}
                title="Dézoomer"
                aria-label="Dézoomer"
              >
                <ZoomOut size={12} />
              </button>
              <span
                className="font-mono text-xs"
                style={{ minWidth: '38px', textAlign: 'center' }}
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                title="Zoomer"
                aria-label="Zoomer"
              >
                <ZoomIn size={12} />
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => {
                  setZoom(0.9);
                  setPan({ x: 50, y: 40 });
                }}
                title="Recentrer la vue"
                aria-label="Recentrer la vue"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}

          {/* Counts badge */}
          <span className="chip chip-neutral font-mono text-xs">
            {dagActiveNodes.length} nœuds / {dagEdges.length} liens
          </span>
        </div>
      </div>

      {/* 2. Temporal Evolution Interactive Slider & Animation Bar */}
      <div className="timeline-evolution-bar" role="region" aria-label="Curseur d'évolution temporelle">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <button
            type="button"
            className={`btn btn-xs ${isPlaying ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleTogglePlay}
            disabled={totalSteps <= 1}
            title={isPlaying ? "Mettre en pause l'évolution temporelle" : "Animer l'évolution chronologique"}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} />}
            <span>{isPlaying ? 'Pause' : 'Animer'}</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={handleStepBack}
            disabled={currentStep <= 1}
            title="Étape précédente"
            aria-label="Étape précédente"
          >
            <SkipBack size={12} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs"
            onClick={handleStepForward}
            disabled={currentStep >= totalSteps}
            title="Étape suivante"
            aria-label="Étape suivante"
          >
            <SkipForward size={12} />
          </button>

          <button
            type="button"
            className="btn btn-secondary btn-xs font-mono"
            onClick={cyclePlaybackSpeed}
            title="Vitesse de lecture temporelle"
          >
            {playbackSpeed}x
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={handleResetTimeline}
            disabled={currentStep >= totalSteps && !isPlaying}
            title="Afficher toute la chronologie (100%)"
          >
            <RotateCcw size={12} />
            <span>Complet</span>
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
            aria-label="Faire glisser dans le temps pour visualiser l'évolution de l'enquête"
          />
        </div>

        {/* Temporal Evolution Status Readout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span className="chip chip-neutral font-mono text-xs">
            Étape {currentStep} / {totalSteps}
          </span>
          {currentCutoffDateStr && (
            <span className="chip chip-neutral font-mono text-xs">
              {currentCutoffDateStr}
            </span>
          )}
          {latestRevealedNode && (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => handleSelectNode(latestRevealedNode.id)}
              title="Cliquer pour inspecter le dernier événement révélé dans le panneau latéral"
            >
              <span>Dernier : {getShortNodeLabel(latestRevealedNode.label, latestRevealedNode.type)}</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {viewMode === 'dag' ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              cursor: isPanning ? 'grabbing' : 'grab',
              userSelect: 'none',
              backgroundColor: 'var(--color-bg-canvas)',
              backgroundImage:
                'radial-gradient(circle, var(--color-border-subtle) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              style={{
                position: 'absolute',
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                transformOrigin: '0 0',
                transition: isPanning ? 'none' : 'transform 0.08s ease-out',
                minWidth: `${(maxLanes + 1) * 215}px`,
                minHeight: `${(maxRows + 1) * 105}px`,
              }}
            >
              <svg
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: `${(maxLanes + 1) * 215 + 200}px`,
                  height: `${(maxRows + 1) * 105 + 200}px`,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              >
                <defs>
                  <marker
                    id="dag-orthogonal-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--color-border-default)" />
                  </marker>

                  <marker
                    id="dag-ancestor-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--color-accent-text)" />
                  </marker>

                  <marker
                    id="dag-merge-arrow"
                    viewBox="0 0 10 10"
                    refX="6"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 8 5 L 0 9 z" fill="var(--color-status-warning)" />
                  </marker>

                  <filter id="dag-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Vertical Lane Guides */}
                {Array.from({ length: maxLanes }).map((_, lIdx) => (
                  <line
                    key={`rail-${lIdx}`}
                    x1={60 + lIdx * 210 + 18}
                    y1={20}
                    x2={60 + lIdx * 210 + 18}
                    y2={maxRows * 96 + 60}
                    stroke="var(--color-border-subtle)"
                    strokeWidth={1}
                    strokeDasharray="4 6"
                    opacity={0.25}
                  />
                ))}

                {/* Strictly Horizontal and Vertical Lines (Orthogonal Manhattan Routing) */}
                {dagEdges.map((e) => {
                  const dx = e.x2 - e.x1;
                  const isAncestral = e.isAncestralHighlight;

                  let pathD = '';
                  if (Math.abs(dx) < 2) {
                    pathD = `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`;
                  } else {
                    const midY = e.y1 + (e.y2 - e.y1) * 0.45;
                    pathD = `M ${e.x1} ${e.y1} L ${e.x1} ${midY} L ${e.x2} ${midY} L ${e.x2} ${e.y2}`;
                  }

                  const strokeColor = isAncestral
                    ? 'var(--color-accent-text)'
                    : e.isMerge
                    ? 'var(--color-status-warning)'
                    : LAYER_COLORS[e.layer] || 'var(--color-border-default)';

                  const strokeWidth = isAncestral ? 3.0 : e.isMerge ? 2.4 : 1.8;

                  const markerId = isAncestral
                    ? 'url(#dag-ancestor-arrow)'
                    : e.isMerge
                    ? 'url(#dag-merge-arrow)'
                    : 'url(#dag-orthogonal-arrow)';

                  return (
                    <g key={e.id}>
                      {(isAncestral || e.isMerge) && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={strokeColor}
                          strokeWidth={strokeWidth + 3}
                          opacity={0.3}
                          filter="url(#dag-glow)"
                        />
                      )}

                      <path
                        d={pathD}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={e.layer === 'HYPOTHESIS' ? '5 4' : undefined}
                        opacity={isAncestral ? 1 : 0.8}
                        markerEnd={markerId}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* CIRCULAR NODES WITH COMPACT SHORT LABEL (FULL DETAILS ON CLICK IN RIGHT INSPECTOR) */}
              {dagNodes.map((n) => {
                const isSelected = selectedNodeId === n.node.id;
                const isAncestral = ancestorNodeIds.has(n.node.id);
                const isLatest = latestRevealedNode?.id === n.node.id && currentStep < totalSteps;
                const typeDef = registry.node_types[n.node.type];
                const domKey = NODE_TYPE_TO_CATEGORY[n.node.type] || 'acteurs';
                const domColor = ONTOLOGY_CATEGORY_COLORS[domKey] || 'var(--color-accent-primary)';
                const shortText = getShortNodeLabel(n.node.label, n.node.type);

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
                    style={{
                      position: 'absolute',
                      left: `${n.x}px`,
                      top: `${n.y}px`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      zIndex: isSelected ? 30 : isLatest ? 28 : isAncestral ? 25 : 10,
                      userSelect: 'none',
                    }}
                    title="Cliquer pour afficher toutes les informations dans le panneau latéral droit"
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
                            : isLatest
                            ? 'var(--color-status-success)'
                            : domColor
                        }`,
                        boxShadow: isSelected
                          ? 'var(--shadow-md)'
                          : 'var(--shadow-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: domColor,
                        position: 'relative',
                        flexShrink: 0,
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        transform: isSelected || isLatest ? 'scale(1.1)' : 'scale(1)',
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

                      {/* Mini Convergence Badge (Zero Emoji — Uses GitMerge icon) */}
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
                          title={`Convergence de ${n.parentIds.length} pistes`}
                        >
                          <GitMerge size={9} />
                          <span>{n.parentIds.length}</span>
                        </span>
                      )}
                    </div>

                    {/* 2. COMPACT SHORT TEXT PILL ONLY (Click opens full info in side Inspector) */}
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
                  const shortText = getShortNodeLabel(event.label, event.type);

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
                      className="btn btn-ghost"
                      style={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: ' flex-start',
                        gap: 'var(--space-3)',
                        padding: 'var(--space-1-5) var(--space-2)',
                        textAlign: 'start',
                      }}
                      title="Cliquer pour afficher les détails complets dans le panneau latéral"
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
