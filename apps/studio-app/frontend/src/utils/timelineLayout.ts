import type { GraphEdge, GraphNode } from '../types/graph';
import type { LayerId } from '../types/registry';

export interface DagNodeLayout {
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

export interface DagEdgeLayout {
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

export interface TimelineLayoutConstraints {
  containerWidth?: number;
  containerHeight?: number;
  branchSizeMap?: Map<string, number>;
  ancestorNodeIds?: Set<string>;
  timeGranularity?: TimeGranularity;
  locale?: string;
}

export type TimeGranularity = 'month' | 'day' | 'hour' | 'minute' | 'second';

export interface TimeLevelRow {
  row: number;
  bucketKey: string;
  label: string;
  y: number;
  timestamp: number;
}

export interface DynamicTimelineLayoutResult {
  dagNodes: DagNodeLayout[];
  dagEdges: DagEdgeLayout[];
  maxLanes: number;
  maxRows: number;
  laneWidth: number;
  rowHeight: number;
  startX: number;
  startY: number;
  circleRadius: number;
  boundsWidth: number;
  boundsHeight: number;
  depthByNodeId: Map<string, number>;
  timeLevels: TimeLevelRow[];
}

export const TIMELINE_CIRCLE_RADIUS = 18;
export const TIMELINE_MIN_LANE_WIDTH = 186;
export const TIMELINE_MAX_LANE_WIDTH = 224;
export const TIMELINE_MIN_ROW_HEIGHT = 70;
export const TIMELINE_MAX_ROW_HEIGHT = 96;

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function getTimestamp(node: GraphNode): number {
  if (!node.created_at) return 0;
  const t = new Date(node.created_at).getTime();
  return Number.isFinite(t) ? t : 0;
}

function pad2(val: number): string {
  return String(val).padStart(2, '0');
}

/**
 * Quantizes a UNIX epoch timestamp (ms) into a deterministic chronological bucket key.
 */
export function getTimeBucketKey(timestampMs: number, granularity: TimeGranularity): string {
  if (!timestampMs || !Number.isFinite(timestampMs)) return 'unknown';
  const d = new Date(timestampMs);
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  if (granularity === 'month') return `${y}-${m}`;
  const day = pad2(d.getDate());
  if (granularity === 'day') return `${y}-${m}-${day}`;
  const h = pad2(d.getHours());
  if (granularity === 'hour') return `${y}-${m}-${day}T${h}`;
  const min = pad2(d.getMinutes());
  if (granularity === 'minute') return `${y}-${m}-${day}T${h}:${min}`;
  const sec = pad2(d.getSeconds());
  return `${y}-${m}-${day}T${h}:${min}:${sec}`;
}

/**
 * Formats a chronological bucket key for the timeline left axis gutter.
 */
export function formatTimeBucketLabel(
  bucketKey: string,
  granularity: TimeGranularity,
  locale = 'fr-FR'
): string {
  if (!bucketKey || bucketKey === 'unknown') return '—';
  const intlLocale = locale === 'ar' ? 'ar-DZ' : locale === 'en' ? 'en-GB' : 'fr-FR';
  const isoCandidate =
    granularity === 'month'
      ? `${bucketKey}-01T00:00:00`
      : granularity === 'day'
      ? `${bucketKey}T00:00:00`
      : granularity === 'hour'
      ? `${bucketKey}:00:00`
      : granularity === 'minute'
      ? `${bucketKey}:00`
      : bucketKey;

  const date = new Date(isoCandidate);
  if (!Number.isFinite(date.getTime())) return bucketKey;

  if (granularity === 'month') {
    return date.toLocaleDateString(intlLocale, { month: 'short', year: 'numeric' });
  }
  if (granularity === 'day') {
    return date.toLocaleDateString(intlLocale, { day: '2-digit', month: 'short', year: 'numeric' });
  }
  if (granularity === 'hour') {
    const dayStr = date.toLocaleDateString(intlLocale, { day: '2-digit', month: 'short' });
    return `${dayStr} ${pad2(date.getHours())}:00`;
  }
  if (granularity === 'minute') {
    const dayStr = date.toLocaleDateString(intlLocale, { day: '2-digit', month: 'short' });
    return `${dayStr} ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
  }
  const dayStr = date.toLocaleDateString(intlLocale, { day: '2-digit', month: 'short' });
  return `${dayStr} ${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

/**
 * Returns all node IDs belonging to the selected node's full bidirectional branch
 * (both upstream ancestors and downstream descendants).
 */
export function computeBidirectionalBranchIds(
  startNodeId: string | null,
  edges: GraphEdge[]
): Set<string> {
  const branchIds = new Set<string>();
  if (!startNodeId) return branchIds;

  branchIds.add(startNodeId);

  // Upstream ancestors (source -> target)
  const upQueue = [startNodeId];
  const seenUp = new Set<string>([startNodeId]);
  while (upQueue.length > 0) {
    const curr = upQueue.shift();
    if (!curr) continue;
    for (const e of edges) {
      if (e.target_id === curr && !seenUp.has(e.source_id)) {
        seenUp.add(e.source_id);
        branchIds.add(e.source_id);
        upQueue.push(e.source_id);
      }
    }
  }

  // Downstream descendants (source -> target)
  const downQueue = [startNodeId];
  const seenDown = new Set<string>([startNodeId]);
  while (downQueue.length > 0) {
    const curr = downQueue.shift();
    if (!curr) continue;
    for (const e of edges) {
      if (e.source_id === curr && !seenDown.has(e.target_id)) {
        seenDown.add(e.target_id);
        branchIds.add(e.target_id);
        downQueue.push(e.target_id);
      }
    }
  }

  return branchIds;
}

/**
 * Dynamically constructs a compact, overlap-free multi-branch timeline DAG
 * tailored to the currently visible nodes and viewport/readability constraints.
 */
export function computeDynamicTimelineLayout(
  visibleNodes: GraphNode[],
  edges: GraphEdge[],
  constraints: TimelineLayoutConstraints = {}
): DynamicTimelineLayoutResult {
  const containerWidth = constraints.containerWidth ?? 960;
  const containerHeight = constraints.containerHeight ?? 580;
  const branchSizeMap = constraints.branchSizeMap ?? new Map<string, number>();
  const ancestorNodeIds = constraints.ancestorNodeIds ?? new Set<string>();

  const START_X = 48;
  const START_Y = 36;
  const CIRCLE_RADIUS = TIMELINE_CIRCLE_RADIUS;

  if (visibleNodes.length === 0) {
    return {
      dagNodes: [],
      dagEdges: [],
      maxLanes: 1,
      maxRows: 1,
      laneWidth: TIMELINE_MAX_LANE_WIDTH,
      rowHeight: TIMELINE_MAX_ROW_HEIGHT,
      startX: START_X,
      startY: START_Y,
      circleRadius: CIRCLE_RADIUS,
      boundsWidth: START_X * 2 + TIMELINE_MAX_LANE_WIDTH,
      boundsHeight: START_Y * 2 + TIMELINE_MAX_ROW_HEIGHT,
      depthByNodeId: new Map(),
      timeLevels: [],
    };
  }

  const nodeMap = new Map<string, GraphNode>();
  visibleNodes.forEach((n) => nodeMap.set(n.id, n));

  const adj = new Map<string, string[]>();
  const revAdj = new Map<string, string[]>();

  visibleNodes.forEach((n) => {
    adj.set(n.id, []);
    revAdj.set(n.id, []);
  });

  const activeEdges: GraphEdge[] = [];
  edges.forEach((e) => {
    if (nodeMap.has(e.source_id) && nodeMap.has(e.target_id) && e.source_id !== e.target_id) {
      adj.get(e.source_id)?.push(e.target_id);
      revAdj.get(e.target_id)?.push(e.source_id);
      activeEdges.push(e);
    }
  });

  // 1. Identify primary roots (0 in-degree), ordered by branch size descending
  const roots = visibleNodes.filter((n) => (revAdj.get(n.id)?.length || 0) === 0);

  // Fallback for disconnected cycles with no 0-in-degree nodes
  const coveredFromRoots = new Set<string>();
  const bfsMark = (startId: string) => {
    const q = [startId];
    coveredFromRoots.add(startId);
    while (q.length > 0) {
      const curr = q.shift();
      if (!curr) continue;
      for (const nxt of adj.get(curr) || []) {
        if (!coveredFromRoots.has(nxt)) {
          coveredFromRoots.add(nxt);
          q.push(nxt);
        }
      }
    }
  };
  roots.forEach((r) => bfsMark(r.id));

  if (coveredFromRoots.size < visibleNodes.length) {
    const remaining = visibleNodes
      .filter((n) => !coveredFromRoots.has(n.id))
      .sort((a, b) => {
        const tDiff = getTimestamp(a) - getTimestamp(b);
        if (tDiff !== 0) return tDiff;
        const outDiff = (adj.get(b.id)?.length || 0) - (adj.get(a.id)?.length || 0);
        if (outDiff !== 0) return outDiff;
        return a.id.localeCompare(b.id);
      });
    for (const candidate of remaining) {
      if (!coveredFromRoots.has(candidate.id)) {
        roots.push(candidate);
        bfsMark(candidate.id);
      }
    }
  }

  roots.sort((a, b) => {
    const sizeDiff = (branchSizeMap.get(b.id) || 0) - (branchSizeMap.get(a.id) || 0);
    if (sizeDiff !== 0) return sizeDiff;
    const tDiff = getTimestamp(a) - getTimestamp(b);
    if (tDiff !== 0) return tDiff;
    return a.id.localeCompare(b.id);
  });

  // 2. Cycle-safe topological depth (row)
  const depthMap = new Map<string, number>();
  roots.forEach((r) => depthMap.set(r.id, 0));

  const maxDepthCap = Math.min(24, Math.max(visibleNodes.length, 6));
  const maxPasses = Math.min(25, visibleNodes.length + 1);
  for (let pass = 0; pass < maxPasses; pass++) {
    let changed = false;
    activeEdges.forEach((e) => {
      const dSrc = depthMap.get(e.source_id) ?? 0;
      const dTgt = depthMap.get(e.target_id);
      if (dTgt === undefined || (dSrc + 1 > dTgt && dSrc + 1 <= maxDepthCap)) {
        depthMap.set(e.target_id, dSrc + 1);
        changed = true;
      }
    });
    if (!changed) break;
  }

  visibleNodes.forEach((n) => {
    if (!depthMap.has(n.id)) depthMap.set(n.id, 0);
  });

  // Pull converging roots down directly above their earliest child row
  roots.forEach((root) => {
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

  // Compact used rows to contiguous 0..maxRow (eliminates empty horizontal bands)
  const uniqueTopoRows = Array.from(new Set(depthMap.values())).sort((a, b) => a - b);
  const topoRemap = new Map<number, number>();
  uniqueTopoRows.forEach((rawRow, idx) => topoRemap.set(rawRow, idx));
  const topoDepthMap = new Map<string, number>();
  depthMap.forEach((rawRow, nid) => {
    const compacted = topoRemap.get(rawRow) ?? 0;
    depthMap.set(nid, compacted);
    topoDepthMap.set(nid, compacted);
  });

  // Optional Time-Level Quantization: nodes in the same bucket share the exact same horizontal row
  const rowBucketMeta = new Map<number, { bucketKey: string; timestamp: number }>();
  const timeGranularity = constraints.timeGranularity;
  if (timeGranularity) {
    const bucketEntries = new Map<string, { minTs: number; nodeIds: string[] }>();
    visibleNodes.forEach((n) => {
      const ts = getTimestamp(n);
      const bKey = getTimeBucketKey(ts, timeGranularity);
      const entry = bucketEntries.get(bKey);
      if (entry) {
        if (ts < entry.minTs) entry.minTs = ts;
        entry.nodeIds.push(n.id);
      } else {
        bucketEntries.set(bKey, { minTs: ts, nodeIds: [n.id] });
      }
    });

    const sortedBuckets = Array.from(bucketEntries.entries()).sort((a, b) => {
      if (a[1].minTs !== b[1].minTs) return a[1].minTs - b[1].minTs;
      return a[0].localeCompare(b[0]);
    });

    sortedBuckets.forEach(([bKey, info], rowIdx) => {
      rowBucketMeta.set(rowIdx, { bucketKey: bKey, timestamp: info.minTs });
      info.nodeIds.forEach((nid) => depthMap.set(nid, rowIdx));
    });
  }
  const uniqueRows = Array.from(new Set(depthMap.values())).sort((a, b) => a - b);

  // 3. Spanning tree & chord-spine DFS lane allocation
  const reachableByRoot = new Map<string, Set<string>>();
  const ownerRootByNode = new Map<string, string>();
  roots.forEach((r) => {
    const vis = new Set<string>([r.id]);
    const q = [r.id];
    while (q.length > 0) {
      const curr = q.shift();
      if (!curr) continue;
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

  const chordPriority = new Map<string, number>();
  visibleNodes.forEach((n) => chordPriority.set(n.id, 0));

  roots.forEach((r) => {
    const reach = reachableByRoot.get(r.id) || new Set<string>();
    (adj.get(r.id) || []).forEach((childId) => {
      if ((depthMap.get(childId) ?? 0) > 1) {
        const q = [childId];
        const seenChord = new Set<string>();
        while (q.length > 0) {
          const curr = q.shift();
          if (!curr || seenChord.has(curr) || !reach.has(curr)) continue;
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

  const treeChildren = new Map<string, string[]>();
  visibleNodes.forEach((n) => treeChildren.set(n.id, []));

  visibleNodes.forEach((n) => {
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
    const cached = subtreeSizeMemo.get(nid);
    if (cached !== undefined) return cached;
    if (visited.has(nid)) return 1;
    visited.add(nid);
    let total = 1;
    for (const cid of treeChildren.get(nid) || []) {
      total += getSubtreeSize(cid, visited);
    }
    subtreeSizeMemo.set(nid, total);
    return total;
  };

  visibleNodes.forEach((n) => {
    const ch = treeChildren.get(n.id);
    if (ch && ch.length > 1) {
      ch.sort((a, b) => {
        const prioDiff = (chordPriority.get(b) || 0) - (chordPriority.get(a) || 0);
        if (prioDiff !== 0) return prioDiff;
        const sizeDiff = getSubtreeSize(b) - getSubtreeSize(a);
        if (sizeDiff !== 0) return sizeDiff;
        const nA = nodeMap.get(a);
        const nB = nodeMap.get(b);
        const tDiff = (nA ? getTimestamp(nA) : 0) - (nB ? getTimestamp(nB) : 0);
        if (tDiff !== 0) return tDiff;
        return a.localeCompare(b);
      });
    }
  });

  // 4. Compact row-aware lane allocation
  const laneMap = new Map<string, number>();
  const occupiedCell = new Set<string>();
  let globalMaxLane = 0;

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

  const majorRoots = roots.filter((r) => (branchSizeMap.get(r.id) || 1) >= 4 || roots.length <= 4);
  const tributaryRoots = roots.filter((r) => !majorRoots.includes(r));

  let currentBaseLane = 0;
  majorRoots.forEach((root) => {
    if (!laneMap.has(root.id)) {
      placeSubtreeDfs(root.id, currentBaseLane);
      currentBaseLane = globalMaxLane + 1;
    }
  });

  tributaryRoots.forEach((tRoot) => {
    if (!laneMap.has(tRoot.id)) {
      const children = adj.get(tRoot.id) || [];
      const firstChildWithLane = children.find((cid) => laneMap.has(cid));
      const prefLane =
        firstChildWithLane !== undefined
          ? (laneMap.get(firstChildWithLane) ?? currentBaseLane) + 1
          : currentBaseLane;
      placeSubtreeDfs(tRoot.id, prefLane);
    }
  });

  visibleNodes.forEach((n) => {
    if (!laneMap.has(n.id)) {
      const parents = revAdj.get(n.id) || [];
      const pWithLane = parents.find((pid) => laneMap.has(pid));
      const pref = pWithLane ? (laneMap.get(pWithLane) ?? 0) : 0;
      assignLane(n.id, pref);
    }
  });

  // Compact used lanes to contiguous 0..maxLane (eliminates any empty vertical columns)
  const uniqueLanes = Array.from(new Set(laneMap.values())).sort((a, b) => a - b);
  const laneRemap = new Map<number, number>();
  uniqueLanes.forEach((rawLane, idx) => laneRemap.set(rawLane, idx));
  laneMap.forEach((rawLane, nid) => {
    laneMap.set(nid, laneRemap.get(rawLane) ?? 0);
  });

  const maxLanes = Math.max(1, uniqueLanes.length);
  const maxRows = Math.max(1, uniqueRows.length);

  // 5. Dynamic Constraint-Driven Spacing based on N and container size
  const nodeCount = visibleNodes.length;
  const densityT = clamp((nodeCount - 4) / 36, 0, 1);

  const availLaneW = Math.floor((Math.max(containerWidth, 320) - START_X * 2 - 40) / maxLanes);
  const availRowH = Math.floor((Math.max(containerHeight, 260) - START_Y * 2 - 20) / maxRows);

  const densityLaneW = Math.round(
    TIMELINE_MAX_LANE_WIDTH - densityT * (TIMELINE_MAX_LANE_WIDTH - TIMELINE_MIN_LANE_WIDTH)
  );
  const densityRowH = Math.round(
    TIMELINE_MAX_ROW_HEIGHT - densityT * (TIMELINE_MAX_ROW_HEIGHT - TIMELINE_MIN_ROW_HEIGHT)
  );

  const laneWidth =
    maxLanes <= 1
      ? Math.min(TIMELINE_MAX_LANE_WIDTH, densityLaneW)
      : clamp(Math.min(densityLaneW, availLaneW), TIMELINE_MIN_LANE_WIDTH, TIMELINE_MAX_LANE_WIDTH);

  const rowHeight =
    maxRows <= 1
      ? Math.min(TIMELINE_MAX_ROW_HEIGHT, densityRowH)
      : clamp(Math.min(densityRowH, availRowH), TIMELINE_MIN_ROW_HEIGHT, TIMELINE_MAX_ROW_HEIGHT);

  const dagNodes: DagNodeLayout[] = visibleNodes.map((node) => {
    const row = depthMap.get(node.id) ?? 0;
    const lane = laneMap.get(node.id) ?? 0;
    const parents = revAdj.get(node.id) || [];
    const children = adj.get(node.id) || [];

    return {
      node,
      row,
      lane,
      x: START_X + lane * laneWidth,
      y: START_Y + row * rowHeight,
      isRoot: parents.length === 0,
      isFork: children.length > 1,
      isMerge: parents.length > 1,
      parentIds: parents,
      childIds: children,
    };
  });

  const nodePosLookup = new Map<string, DagNodeLayout>();
  dagNodes.forEach((nl) => nodePosLookup.set(nl.node.id, nl));

  const dagEdges: DagEdgeLayout[] = [];
  activeEdges.forEach((edge) => {
    const rawSrc = nodePosLookup.get(edge.source_id);
    const rawTgt = nodePosLookup.get(edge.target_id);
    if (!rawSrc || !rawTgt) return;

    const [src, tgt] = rawSrc.row <= rawTgt.row ? [rawSrc, rawTgt] : [rawTgt, rawSrc];
    const isAncestral = ancestorNodeIds.has(edge.source_id) && ancestorNodeIds.has(edge.target_id);

    const pX = src.x + CIRCLE_RADIUS;
    const pY = src.y + CIRCLE_RADIUS;
    const cX = tgt.x + CIRCLE_RADIUS;
    const cY = tgt.y + CIRCLE_RADIUS;

    dagEdges.push({
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
      y2: cY - CIRCLE_RADIUS - 3,
      relationType: edge.type,
      layer: edge.layer,
      isMerge: tgt.isMerge,
      isAncestralHighlight: isAncestral,
    });
  });

  const boundsWidth = START_X * 2 + (maxLanes - 1) * laneWidth + 165;
  const boundsHeight = START_Y * 2 + (maxRows - 1) * rowHeight + 56;

  const activeGranularity = timeGranularity ?? 'day';
  const timeLevels: TimeLevelRow[] = uniqueRows.map((rowIdx) => {
    const meta = rowBucketMeta.get(rowIdx);
    if (meta) {
      return {
        row: rowIdx,
        bucketKey: meta.bucketKey,
        label: formatTimeBucketLabel(meta.bucketKey, activeGranularity, constraints.locale),
        y: START_Y + rowIdx * rowHeight,
        timestamp: meta.timestamp,
      };
    }
    const rowNodes = dagNodes.filter((dn) => dn.row === rowIdx);
    const earliestTs = rowNodes.reduce(
      (min, dn) => {
        const t = getTimestamp(dn.node);
        return t > 0 && (min === 0 || t < min) ? t : min;
      },
      0
    );
    const fallbackKey = getTimeBucketKey(earliestTs, activeGranularity);
    return {
      row: rowIdx,
      bucketKey: fallbackKey,
      label: formatTimeBucketLabel(fallbackKey, activeGranularity, constraints.locale),
      y: START_Y + rowIdx * rowHeight,
      timestamp: earliestTs,
    };
  });

  return {
    dagNodes,
    dagEdges,
    maxLanes,
    maxRows,
    laneWidth,
    rowHeight,
    startX: START_X,
    startY: START_Y,
    circleRadius: CIRCLE_RADIUS,
    boundsWidth,
    boundsHeight,
    depthByNodeId: topoDepthMap,
    timeLevels,
  };
}

/**
 * Computes centered pan/zoom so the dynamic timeline tree fits comfortably inside the viewport.
 */
export function computeAutoFitViewport(
  boundsWidth: number,
  boundsHeight: number,
  containerWidth: number,
  containerHeight: number
): { panX: number; panY: number; zoom: number } {
  const safeW = Math.max(containerWidth, 320);
  const safeH = Math.max(containerHeight, 240);
  const padding = 32;

  const fitZoom = clamp(
    Math.min((safeW - padding) / Math.max(boundsWidth, 1), (safeH - padding) / Math.max(boundsHeight, 1)),
    0.35,
    1.1
  );

  const scaledW = boundsWidth * fitZoom;
  const scaledH = boundsHeight * fitZoom;
  const panX = Math.round((safeW - scaledW) / 2);
  const panY = Math.round(Math.max(16, (safeH - scaledH) / 2));

  return { panX, panY, zoom: Number(fitZoom.toFixed(2)) };
}
