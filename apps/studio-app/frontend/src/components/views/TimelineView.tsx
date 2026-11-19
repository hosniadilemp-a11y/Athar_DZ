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
  srcRow: number;
  tgtRow: number;
  srcLane: number;
  tgtLane: number;
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
  const { nodes, edges, selectedNodeId, selectNode } = useGraphStore();
  const { tr, trLabel, locale } = useI18n();

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

  // Set of visible node IDs from active branches (plus any node connected to an active branch node)
  const branchVisibleNodeIds = useMemo(() => {
    const ids = new Set<string>();
    activeBranches.forEach((b) => {
      b.reachableNodeIds.forEach((id) => ids.add(id));
    });
    // Also include direct parents of active branch nodes (e.g. a victim root converging into a piece)
    edges.forEach((e) => {
      if (ids.has(e.target_id)) {
        ids.add(e.source_id);
      }
    });
    return ids;
  }, [activeBranches, edges]);

  // Base nodes in active branches (INVARIANT of timeCursorStep so positions never jump!)
  const branchFilteredNodes = useMemo(() => {
    return activeNodes.filter((n) => branchVisibleNodeIds.has(n.id));
  }, [activeNodes, branchVisibleNodeIds]);

  // 4. Compute Ancestor Set for Selected Node
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

  // 5. FULL INVARIANT DAG LAYOUT (Computed on branchFilteredNodes so nodes NEVER switch positions when changing étape!)
  const { fullDagNodes, fullDagEdges, maxLanes, maxRows, depthByNodeId } = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    branchFilteredNodes.forEach((n) => nodeMap.set(n.id, n));

    const adj = new Map<string, string[]>();
    const revAdj = new Map<string, string[]>();
    const undirectedAdj = new Map<string, string[]>();

    branchFilteredNodes.forEach((n) => {
      adj.set(n.id, []);
      revAdj.set(n.id, []);
      undirectedAdj.set(n.id, []);
    });

    edges.forEach((e) => {
      if (nodeMap.has(e.source_id) && nodeMap.has(e.target_id) && e.source_id !== e.target_id) {
        adj.get(e.source_id)?.push(e.target_id);
        revAdj.get(e.target_id)?.push(e.source_id);
        undirectedAdj.get(e.source_id)?.push(e.target_id);
        undirectedAdj.get(e.target_id)?.push(e.source_id);
      }
    });

    // Identify primary roots ordered by branch size descending
    const allRoots = branchFilteredNodes.filter((n) => (revAdj.get(n.id)?.length || 0) === 0);
    const branchSizeMap = new Map<string, number>();
    allBranches.forEach((b) => branchSizeMap.set(b.id, b.nodeCount));
    allRoots.sort((a, b) => (branchSizeMap.get(b.id) || 0) - (branchSizeMap.get(a.id) || 0));

    // Step A: Compute cycle-safe topological depth (Row) from roots
    const depthMap = new Map<string, number>();
    allRoots.forEach((r) => depthMap.set(r.id, 0));

    // Bounded relaxation (Bellman-Ford longest path without cycles)
    const maxPasses = Math.min(25, branchFilteredNodes.length + 1);
    for (let pass = 0; pass < maxPasses; pass++) {
      let changed = false;
      edges.forEach((e) => {
        if (!nodeMap.has(e.source_id) || !nodeMap.has(e.target_id) || e.source_id === e.target_id) return;
        const dSrc = depthMap.get(e.source_id) ?? 0;
        const dTgt = depthMap.get(e.target_id);
        if (dTgt === undefined || (dSrc + 1 > dTgt && dSrc + 1 < 18)) {
          depthMap.set(e.target_id, dSrc + 1);
          changed = true;
        }
      });
      if (!changed) break;
    }

    branchFilteredNodes.forEach((n) => {
      if (!depthMap.has(n.id)) depthMap.set(n.id, 0);
    });

    // Step B: Pull converging roots (e.g. Karim Zerrouki -> Pièce A-01) down to (minChildRow - 1)
    // so they sit directly 1 row above their convergence target instead of floating at row 0 far away!
    allRoots.forEach((root) => {
      const children = adj.get(root.id) || [];
      if (children.length > 0) {
        let minChildRow = Infinity;
        children.forEach((cid) => {
          const cRow = depthMap.get(cid) ?? 1;
          if (cRow < minChildRow) minChildRow = cRow;
        });
        if (Number.isFinite(minChildRow) && minChildRow > 1) {
          depthMap.set(root.id, minChildRow - 1);
        }
      }
    });

    // Step C: Strict Spanning-Tree & Chord-Spine DFS Lane Allocation
    // Guarantees that chains with direct chord links to an ancestor (e.g. Karim Zerrouki -> ... -> Amine B. -> Pièce A-01)
    // remain aligned in the ancestor's primary lane (Lane 0) so links never traverse across unrelated branches!
    const reachableByRoot = new Map<string, Set<string>>();
    const ownerRootByNode = new Map<string, string>();
    allRoots.forEach((r) => {
      const vis = new Set<string>([r.id]);
      const q = [r.id];
      while (q.length > 0) {
        const curr = q.shift()!;
        if (!ownerRootByNode.has(curr)) {
          ownerRootByNode.set(curr, r.id);
        }
        (adj.get(curr) || []).forEach((nxt) => {
          if (!vis.has(nxt)) {
            vis.add(nxt);
            q.push(nxt);
          }
        });
      }
      reachableByRoot.set(r.id, vis);
    });

    // Identify nodes that are direct multi-row chord targets of a root (e.g. vic_01_karim -> evid_audio_a01)
    // and propagate priority up their tight parent chain so they stay in the root's own lane!
    const chordPriority = new Map<string, number>();
    branchFilteredNodes.forEach((n) => chordPriority.set(n.id, 0));

    allRoots.forEach((r) => {
      const reach = reachableByRoot.get(r.id) || new Set<string>();
      (adj.get(r.id) || []).forEach((childId) => {
        if ((depthMap.get(childId) ?? 0) > 1) {
          const q = [childId];
          const seenChord = new Set<string>();
          while (q.length > 0) {
            const curr = q.shift()!;
            if (seenChord.has(curr) || !reach.has(curr)) continue;
            seenChord.add(curr);
            chordPriority.set(curr, (chordPriority.get(curr) || 0) + 10);
            const currDepth = depthMap.get(curr) ?? 0;
            (revAdj.get(curr) || []).forEach((pId) => {
              if (reach.has(pId) && (depthMap.get(pId) ?? 0) === currDepth - 1) {
                q.push(pId);
              }
            });
          }
        }
      });
    });

    // Build a strict spanning tree where each non-root node selects its single best primary parent
    const treeChildren = new Map<string, string[]>();
    branchFilteredNodes.forEach((n) => treeChildren.set(n.id, []));

    branchFilteredNodes.forEach((n) => {
      const parents = revAdj.get(n.id) || [];
      if (parents.length === 0) return;
      const myDepth = depthMap.get(n.id) ?? 0;
      const tightParents = parents.filter((p) => (depthMap.get(p) ?? 0) === myDepth - 1);
      const candidates = tightParents.length > 0 ? [...tightParents] : [...parents];
      candidates.sort((pA, pB) => {
        const sameOwnerA = ownerRootByNode.get(pA) === ownerRootByNode.get(n.id) ? 0 : 1;
        const sameOwnerB = ownerRootByNode.get(pB) === ownerRootByNode.get(n.id) ? 0 : 1;
        if (sameOwnerA !== sameOwnerB) return sameOwnerA - sameOwnerB;
        const prioDiff = (chordPriority.get(pB) || 0) - (chordPriority.get(pA) || 0);
        if (prioDiff !== 0) return prioDiff;
        return (
          Math.abs((depthMap.get(pA) ?? 0) + 1 - myDepth) -
          Math.abs((depthMap.get(pB) ?? 0) + 1 - myDepth)
        );
      });
      const bestParent = candidates[0];
      if (bestParent) {
        treeChildren.get(bestParent)?.push(n.id);
      }
    });

    const subtreeSizeMemo = new Map<string, number>();
    const getSubtreeSize = (nid: string, visited = new Set<string>()): number => {
      if (subtreeSizeMemo.has(nid)) return subtreeSizeMemo.get(nid)!;
      if (visited.has(nid)) return 1;
      visited.add(nid);
      let total = 1;
      for (const cid of treeChildren.get(nid) || []) {
        total += getSubtreeSize(cid, visited);
      }
      subtreeSizeMemo.set(nid, total);
      return total;
    };

    branchFilteredNodes.forEach((n) => {
      const ch = treeChildren.get(n.id);
      if (ch && ch.length > 1) {
        ch.sort((a, b) => {
          const prioDiff = (chordPriority.get(b) || 0) - (chordPriority.get(a) || 0);
          if (prioDiff !== 0) return prioDiff;
          return getSubtreeSize(b) - getSubtreeSize(a);
        });
      }
    });

    const laneMap = new Map<string, number>();
    const occupiedCell = new Set<string>(); // `${row}:${lane}`
    let currentBaseLane = 0;
    let globalMaxLane = 0;
    let computedMaxRow = 0;

    depthMap.forEach((r) => {
      if (r > computedMaxRow) computedMaxRow = r;
    });

    const assignLane = (nodeId: string, preferredLane: number): number => {
      const row = depthMap.get(nodeId) ?? 0;
      let lane = Math.max(0, preferredLane);
      while (occupiedCell.has(`${row}:${lane}`)) {
        lane += 1;
      }
      occupiedCell.add(`${row}:${lane}`);
      laneMap.set(nodeId, lane);
      if (lane > globalMaxLane) globalMaxLane = lane;
      return lane;
    };

    // Separate major roots (that start their own tree) from tributary roots (small roots that merge into a larger branch)
    const majorRoots = allRoots.filter((r) => (branchSizeMap.get(r.id) || 1) >= 4 || allRoots.length <= 4);
    const tributaryRoots = allRoots.filter((r) => !majorRoots.includes(r));

    const placeSubtreeDfs = (nodeId: string, targetLane: number) => {
      if (laneMap.has(nodeId)) return;
      const myLane = assignLane(nodeId, targetLane);

      const children = treeChildren.get(nodeId) || [];
      children.forEach((childId, cIdx) => {
        if (!laneMap.has(childId)) {
          placeSubtreeDfs(childId, myLane + cIdx);
        }
      });
    };

    majorRoots.forEach((root) => {
      if (!laneMap.has(root.id)) {
        placeSubtreeDfs(root.id, currentBaseLane);
        currentBaseLane = globalMaxLane + 1;
      }
    });

    // Place any remaining tributary roots near their first child's lane
    tributaryRoots.forEach((tRoot) => {
      if (!laneMap.has(tRoot.id)) {
        const children = adj.get(tRoot.id) || [];
        const firstChildWithLane = children.find((cid) => laneMap.has(cid));
        const prefLane = firstChildWithLane !== undefined ? (laneMap.get(firstChildWithLane) ?? currentBaseLane) + 1 : currentBaseLane;
        placeSubtreeDfs(tRoot.id, prefLane);
      }
    });

    // Place any remaining unvisited nodes
    branchFilteredNodes.forEach((n) => {
      if (!laneMap.has(n.id)) {
        const parents = revAdj.get(n.id) || [];
        const pWithLane = parents.find((pid) => laneMap.has(pid));
        const pref = pWithLane ? (laneMap.get(pWithLane) ?? 0) : globalMaxLane + 1;
        assignLane(n.id, pref);
      }
    });

    const LANE_WIDTH = 210;
    const ROW_HEIGHT = 96;
    const START_X = 60;
    const START_Y = 44;
    const CIRCLE_RADIUS = 18;

    const nodeLayoutList: DagNodeLayout[] = branchFilteredNodes.map((node) => {
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
      const rawSrc = nodePosLookup.get(edge.source_id);
      const rawTgt = nodePosLookup.get(edge.target_id);
      if (!rawSrc || !rawTgt || rawSrc.node.id === rawTgt.node.id) return;

      // Ensure visual flow always goes top-to-bottom in the chronological tree
      const [src, tgt] = rawSrc.row <= rawTgt.row ? [rawSrc, rawTgt] : [rawTgt, rawSrc];

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
        srcRow: src.row,
        tgtRow: tgt.row,
        srcLane: src.lane,
        tgtLane: tgt.lane,
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
      fullDagNodes: nodeLayoutList,
      fullDagEdges: edgeLayoutList,
      maxLanes: globalMaxLane + 1,
      maxRows: computedMaxRow + 1,
      depthByNodeId: depthMap,
    };
  }, [branchFilteredNodes, edges, ancestorNodeIds, allBranches]);

  // 6. Chronological Sequence for Temporal Slider (ordered by timestamp + fixed topological depth)
  const chronologicalSequence = useMemo(() => {
    return [...branchFilteredNodes].sort((a, b) => {
      const tA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const tB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (tA !== tB) return tA - tB;
      const dA = depthByNodeId.get(a.id) ?? 0;
      const dB = depthByNodeId.get(b.id) ?? 0;
      if (dA !== dB) return dA - dB;
      return a.id.localeCompare(b.id);
    });
  }, [branchFilteredNodes, depthByNodeId]);

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

  // Filter the INVARIANT layout by revealedNodeIds -> Nodes NEVER switch position!
  const dagNodes = useMemo(() => {
    return fullDagNodes.filter((n) => revealedNodeIds.has(n.node.id));
  }, [fullDagNodes, revealedNodeIds]);

  const dagEdges = useMemo(() => {
    return fullDagEdges.filter(
      (e) => revealedNodeIds.has(e.sourceId) && revealedNodeIds.has(e.targetId)
    );
  }, [fullDagEdges, revealedNodeIds]);

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

  return (
    <div className="timeline-view-shell">
      {/* 1. Top Filter and Command Toolbar */}
      <div className="timeline-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {/* View Mode Switcher — Active button clearly highlighted in primary blue */}
          <div className="canvas-segmented-tabs" role="tablist" aria-label={tr('Mode chronologique')}>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'dag'}
              className={`canvas-segmented-btn ${viewMode === 'dag' ? 'active' : ''}`}
              onClick={() => setViewMode('dag')}
              style={{ minWidth: '158px' }}
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
              style={{ minWidth: '96px' }}
              title={tr('Flux linéaire chronologique vertical')}
            >
              <List size={13} />
              <span>{tr('Linéaire')}</span>
            </button>
          </div>

          {/* Interactive Branch Selector Button */}
          {viewMode === 'dag' && (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className={`btn btn-xs ${isBranchSelectorOpen ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setIsBranchSelectorOpen((prev) => !prev)}
                style={{ minWidth: '155px', justifyContent: 'space-between' }}
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

          {/* Quick Toggle to enable/disable all branches in 1 click (fixed min-width to prevent shifting) */}
          {viewMode === 'dag' && (
            <button
              type="button"
              className="btn btn-xs btn-secondary"
              style={{ minWidth: '172px', justifyContent: 'center' }}
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
              style={{ minWidth: '138px', justifyContent: 'center' }}
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
              placeholder={tr('Rechercher...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingInlineStart: '24px', width: '150px' }}
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
                title={tr('Zoom arrière')}
                aria-label={tr('Zoom arrière')}
              >
                <ZoomOut size={12} />
              </button>
              <span
                className="font-mono text-xs"
                style={{ minWidth: '40px', textAlign: 'center' }}
              >
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.1))}
                title={tr('Zoom avant')}
                aria-label={tr('Zoom avant')}
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
                title={tr('Ajuster la vue (Centrer)')}
                aria-label={tr('Ajuster la vue (Centrer)')}
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}

          {/* Counts badge (fixed min-width to prevent shifting) */}
          <span
            className="chip chip-neutral font-mono text-xs"
            style={{ minWidth: '132px', justifyContent: 'center' }}
          >
            {dagNodes.length} {tr('Entités')} / {dagEdges.length} {tr('Relations')}
          </span>
        </div>
      </div>

      {/* 2. Temporal Evolution Interactive Slider & Animation Bar (Fixed button & readout widths so slider never shifts!) */}
      <div className="timeline-evolution-bar" role="region" aria-label={tr("Curseur d'évolution temporelle")}>
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

        {/* Fixed-width Temporal Evolution Status Readout (Never resizes the slider track!) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 'var(--space-2)',
            width: '250px',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <span
            className="chip chip-neutral font-mono text-xs"
            style={{ minWidth: '104px', justifyContent: 'center', flexShrink: 0 }}
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
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 8 7"
                    refX="6.5"
                    refY="3.5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-border-default)" />
                  </marker>

                  <marker
                    id="dag-ancestor-arrow"
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 8 7"
                    refX="6.5"
                    refY="3.5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-accent-text)" />
                  </marker>

                  <marker
                    id="dag-merge-arrow"
                    markerUnits="userSpaceOnUse"
                    viewBox="0 0 8 7"
                    refX="6.5"
                    refY="3.5"
                    markerWidth="6.5"
                    markerHeight="6.5"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1 L 6.5 3.5 L 0 6 z" fill="var(--color-status-warning)" />
                  </marker>
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
                    opacity={0.22}
                  />
                ))}

                {/* Clean Inter-Row & Inter-Gutter Orthogonal Routing (Never cuts through intermediate rows/branches) */}
                {dagEdges.map((e) => {
                  const dx = e.x2 - e.x1;
                  const rowSpan = Math.abs(e.tgtRow - e.srcRow);
                  const isAncestral = e.isAncestralHighlight;

                  let pathD = '';
                  if (Math.abs(dx) < 2 && rowSpan <= 1) {
                    // Direct 1-row vertical drop in same lane
                    pathD = `M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`;
                  } else if (Math.abs(dx) < 2 && rowSpan > 1) {
                    // Same-lane multi-row chord (e.g. Karim Zerrouki Row 0 -> Pièce A-01 Row 5 in Lane 0):
                    // Exit left edge of source circle, travel down the empty left margin gutter of the lane, enter left edge of target circle
                    const srcCenterY = e.y1 - 18;
                    const tgtCenterY = e.y2 + 18;
                    const leftGutterX = e.x1 - 30;
                    pathD = `M ${e.x1 - 18} ${srcCenterY} L ${leftGutterX} ${srcCenterY} L ${leftGutterX} ${tgtCenterY} L ${e.x2 - 18} ${tgtCenterY}`;
                  } else if (rowSpan <= 1) {
                    // 1-row step across lanes: horizontal bend in the empty inter-row corridor (18px above target circle)
                    const corridorY = e.y2 - 18;
                    pathD = `M ${e.x1} ${e.y1} L ${e.x1} ${corridorY} L ${e.x2} ${corridorY} L ${e.x2} ${e.y2}`;
                  } else {
                    // Multi-row span across lanes: exit left of source circle into source lane's left gutter,
                    // drop vertically down the gutter to the target row's inter-row corridor, then enter target
                    const srcCenterY = e.y1 - 18;
                    const lowerCorridorY = e.y2 - 18;
                    const leftGutterX = e.x1 - 26;
                    pathD = `M ${e.x1 - 18} ${srcCenterY} L ${leftGutterX} ${srcCenterY} L ${leftGutterX} ${lowerCorridorY} L ${e.x2} ${lowerCorridorY} L ${e.x2} ${e.y2}`;
                  }

                  const strokeColor = isAncestral
                    ? 'var(--color-accent-text)'
                    : e.isMerge
                    ? 'var(--color-status-warning)'
                    : LAYER_COLORS[e.layer] || 'var(--color-border-default)';

                  const strokeWidth = isAncestral ? 2.2 : e.isMerge ? 1.8 : 1.4;

                  const markerId = isAncestral
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
                        strokeDasharray={e.layer === 'HYPOTHESIS' ? '3 3' : undefined}
                        opacity={isAncestral ? 0.95 : 0.72}
                        markerEnd={markerId}
                      />
                    </g>
                  );
                })}
              </svg>

              {/* CIRCULAR NODES WITH COMPACT SHORT LABEL (INVARIANT POSITIONS, FULL DETAILS ON CLICK IN RIGHT INSPECTOR) */}
              {dagNodes.map((n) => {
                const isSelected = selectedNodeId === n.node.id;
                const isAncestral = ancestorNodeIds.has(n.node.id);
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
                            : isLatest
                            ? 'var(--color-status-success)'
                            : domColor
                        }`,
                        boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
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
