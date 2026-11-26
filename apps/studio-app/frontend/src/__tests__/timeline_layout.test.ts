import { describe, expect, it } from 'vitest';
import {
  computeDynamicTimelineLayout,
  computeAutoFitViewport,
  computeBidirectionalBranchIds,
  getTimeBucketKey,
  TIMELINE_MIN_LANE_WIDTH,
  TIMELINE_MAX_LANE_WIDTH,
  TIMELINE_MIN_ROW_HEIGHT,
  TIMELINE_MAX_ROW_HEIGHT,
} from '../utils/timelineLayout';
import type { GraphEdge, GraphNode } from '../types/graph';

const makeNode = (id: string, createdAt = '2026-01-01T00:00:00Z'): GraphNode => ({
  id,
  case_id: 'case-1',
  type: 'personne',
  layer: 'VERIFIED',
  label: `Node ${id}`,
  confidence: 1,
  provenance: 'TEST',
  properties: {},
  latitude: null,
  longitude: null,
  created_at: createdAt,
});

const makeEdge = (source: string, target: string): GraphEdge => ({
  id: `e-${source}-${target}`,
  case_id: 'case-1',
  source_id: source,
  target_id: target,
  type: 'CONNECTED_TO',
  layer: 'VERIFIED',
  confidence: 1,
  provenance: 'TEST',
  properties: {},
});

describe('computeDynamicTimelineLayout', () => {
  it('handles empty node list gracefully', () => {
    const res = computeDynamicTimelineLayout([], []);
    expect(res.dagNodes).toEqual([]);
    expect(res.dagEdges).toEqual([]);
    expect(res.maxLanes).toBe(1);
    expect(res.maxRows).toBe(1);
  });

  it('compacts rows and lanes without leaving empty gaps for small visible subsets', () => {
    const nodes = [makeNode('n1'), makeNode('n2'), makeNode('n3')];
    const edges = [makeEdge('n1', 'n2'), makeEdge('n2', 'n3')];

    const res = computeDynamicTimelineLayout(nodes, edges, {
      containerWidth: 900,
      containerHeight: 550,
    });

    expect(res.dagNodes).toHaveLength(3);
    expect(res.maxLanes).toBe(1);
    expect(res.maxRows).toBe(3);

    const lanes = new Set(res.dagNodes.map((n) => n.lane));
    const rows = new Set(res.dagNodes.map((n) => n.row));
    expect(Array.from(lanes)).toEqual([0]);
    expect(Array.from(rows).sort((a, b) => a - b)).toEqual([0, 1, 2]);
  });

  it('prevents coordinate overlap and adapts spacing within constraints for dense graphs', () => {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    for (let i = 0; i < 48; i++) {
      nodes.push(makeNode(`n-${i}`, `2026-01-${String((i % 28) + 1).padStart(2, '0')}T00:00:00Z`));
      if (i > 0 && i % 6 !== 0) {
        edges.push(makeEdge(`n-${i - 1}`, `n-${i}`));
      }
      if (i >= 6 && i % 6 === 2) {
        edges.push(makeEdge(`n-${i - 6}`, `n-${i}`));
      }
    }

    const res = computeDynamicTimelineLayout(nodes, edges, {
      containerWidth: 1000,
      containerHeight: 600,
    });

    expect(res.dagNodes).toHaveLength(48);
    expect(res.laneWidth).toBeGreaterThanOrEqual(TIMELINE_MIN_LANE_WIDTH);
    expect(res.laneWidth).toBeLessThanOrEqual(TIMELINE_MAX_LANE_WIDTH);
    expect(res.rowHeight).toBeGreaterThanOrEqual(TIMELINE_MIN_ROW_HEIGHT);
    expect(res.rowHeight).toBeLessThanOrEqual(TIMELINE_MAX_ROW_HEIGHT);

    // Every node occupies a unique (x, y) cell
    const coords = new Set(res.dagNodes.map((n) => `${n.x},${n.y}`));
    expect(coords.size).toBe(48);

    // Contiguous lanes & rows: no empty column or row gaps
    const usedLanes = Array.from(new Set(res.dagNodes.map((n) => n.lane))).sort((a, b) => a - b);
    const usedRows = Array.from(new Set(res.dagNodes.map((n) => n.row))).sort((a, b) => a - b);
    expect(usedLanes).toEqual(Array.from({ length: res.maxLanes }, (_, i) => i));
    expect(usedRows).toEqual(Array.from({ length: res.maxRows }, (_, i) => i));
  });

  it('handles cyclic graphs safely without infinite loops or missing nodes', () => {
    const nodes = [makeNode('a'), makeNode('b'), makeNode('c')];
    const edges = [makeEdge('a', 'b'), makeEdge('b', 'c'), makeEdge('c', 'a')];

    const res = computeDynamicTimelineLayout(nodes, edges);
    expect(res.dagNodes).toHaveLength(3);
    const coords = new Set(res.dagNodes.map((n) => `${n.x},${n.y}`));
    expect(coords.size).toBe(3);
  });

  it('computes centered auto-fit viewport bounded within safe zoom range', () => {
    const vpSmall = computeAutoFitViewport(260, 240, 900, 600);
    expect(vpSmall.zoom).toBeLessThanOrEqual(1.1);
    expect(vpSmall.zoom).toBeGreaterThanOrEqual(0.35);
    expect(vpSmall.panX).toBeGreaterThan(0);

    const vpHuge = computeAutoFitViewport(3000, 1800, 900, 600);
    expect(vpHuge.zoom).toBeGreaterThanOrEqual(0.35);
    expect(vpHuge.zoom).toBeLessThan(0.5);
  });

  it('groups entities discovered in the same date bucket on the same horizontal row per granularity', () => {
    const nodes = [
      makeNode('a', '2026-11-08T09:30:10Z'),
      makeNode('b', '2026-11-08T09:30:45Z'),
      makeNode('c', '2026-11-08T16:10:00Z'),
      makeNode('d', '2026-11-12T10:00:00Z'),
    ];
    const edges = [makeEdge('a', 'c'), makeEdge('b', 'c'), makeEdge('c', 'd')];

    // Day granularity: a, b, c share row 0 (Nov 08); d is on row 1 (Nov 12)
    const byDay = computeDynamicTimelineLayout(nodes, edges, { timeGranularity: 'day', locale: 'fr' });
    const rowDay = new Map(byDay.dagNodes.map((n) => [n.node.id, n.row]));
    expect(rowDay.get('a')).toBe(0);
    expect(rowDay.get('b')).toBe(0);
    expect(rowDay.get('c')).toBe(0);
    expect(rowDay.get('d')).toBe(1);
    expect(byDay.timeLevels).toHaveLength(2);

    // Hour granularity: a & b share 09:00 row; c splits to 16:00 row; d on Nov 12 row
    const byHour = computeDynamicTimelineLayout(nodes, edges, { timeGranularity: 'hour', locale: 'fr' });
    const rowHour = new Map(byHour.dagNodes.map((n) => [n.node.id, n.row]));
    expect(rowHour.get('a')).toBe(rowHour.get('b'));
    expect(rowHour.get('c')).toBeGreaterThan(rowHour.get('a') ?? -1);
    expect(byHour.timeLevels).toHaveLength(3);

    // Second granularity: a & b separate into distinct rows (09:30:10 vs 09:30:45)
    const bySecond = computeDynamicTimelineLayout(nodes, edges, { timeGranularity: 'second', locale: 'fr' });
    const rowSec = new Map(bySecond.dagNodes.map((n) => [n.node.id, n.row]));
    expect(rowSec.get('a')).not.toBe(rowSec.get('b'));
    expect(bySecond.timeLevels).toHaveLength(4);
  });

  it('quantizes time buckets cleanly for month through second', () => {
    const ts = new Date('2026-11-08T14:25:36').getTime();
    expect(getTimeBucketKey(ts, 'month')).toBe('2026-11');
    expect(getTimeBucketKey(ts, 'day')).toBe('2026-11-08');
    expect(getTimeBucketKey(ts, 'hour')).toBe('2026-11-08T14');
    expect(getTimeBucketKey(ts, 'minute')).toBe('2026-11-08T14:25');
    expect(getTimeBucketKey(ts, 'second')).toBe('2026-11-08T14:25:36');
  });

  it('collects full bidirectional branch (upstream ancestors and downstream descendants)', () => {
    const edges = [
      makeEdge('root-karim', 'post-1'),
      makeEdge('post-1', 'page-1'),
      makeEdge('root-karim', 'audio-1'),
      makeEdge('other-meriem', 'pv-oran'),
    ];

    const karimBranch = computeBidirectionalBranchIds('root-karim', edges);
    expect(Array.from(karimBranch).sort()).toEqual(['audio-1', 'page-1', 'post-1', 'root-karim']);
    expect(karimBranch.has('other-meriem')).toBe(false);

    const midBranch = computeBidirectionalBranchIds('post-1', edges);
    expect(Array.from(midBranch).sort()).toEqual(['page-1', 'post-1', 'root-karim']);
  });
});
