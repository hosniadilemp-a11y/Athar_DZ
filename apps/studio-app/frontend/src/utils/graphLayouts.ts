/**
 * Graph Layout Algorithms for Athar Forensic Studio
 * Supports 5 judicial layouts:
 * 1. 'concentric'   - Concentric rings by forensic layers (VERIFIED -> OSINT -> INFRA -> HYPOTHESIS -> FLOWS)
 * 2. 'force'        - Organic force-directed layout (Fruchterman-Reingold deterministic spring-embedder)
 * 3. 'circular'     - Single global orbital circle
 * 4. 'hierarchical' - Judicial investigation causality tiers (Territory -> Actors -> Vectors -> Infra -> Flows)
 * 5. 'grid'         - Compact matrix grouped by entity types and layers
 */

import type { GraphNode, GraphEdge } from '../types/graph';
import type { LayerId } from '../types/registry';

export type GraphLayoutType = 'concentric' | 'force' | 'circular' | 'hierarchical' | 'grid';

export interface LayoutOptions {
  centerX?: number;
  centerY?: number;
  width?: number;
  height?: number;
  pinnedNodeIds?: Set<string>;
}

const DEFAULT_CENTER_X = 600;
const DEFAULT_CENTER_Y = 450;

/**
 * Apply selected layout to an array of nodes, returning updated nodes with new x, y coordinates.
 * Handles all special cases: 0 nodes, 1 node, disconnected graphs, missing layers.
 * Preserves exact positions for nodes in pinnedNodeIds.
 */
export function computeGraphLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  layoutType: GraphLayoutType,
  options?: LayoutOptions,
  pinnedNodeIds?: Set<string>
): GraphNode[] {
  const count = nodes.length;
  if (count === 0) return [];

  const effectivePinned = pinnedNodeIds ?? options?.pinnedNodeIds;
  const originalPos = new Map<string, { x: number; y: number }>();
  if (effectivePinned && effectivePinned.size > 0) {
    nodes.forEach((n) => {
      if (effectivePinned.has(n.id) && typeof n.x === 'number' && typeof n.y === 'number') {
        originalPos.set(n.id, { x: n.x, y: n.y });
      }
    });
  }

  const cx = options?.centerX ?? DEFAULT_CENTER_X;
  const cy = options?.centerY ?? DEFAULT_CENTER_Y;

  let computed: GraphNode[];
  if (count === 1) {
    const singleNode = nodes[0];
    computed = singleNode ? [{ ...singleNode, x: cx, y: cy }] : [];
  } else if (count === 2) {
    const [n1, n2] = nodes;
    computed = !n1 || !n2 ? nodes : [
      { ...n1, x: cx - 140, y: cy },
      { ...n2, x: cx + 140, y: cy },
    ];
  } else {
    switch (layoutType) {
      case 'concentric':
        computed = computeConcentricLayout(nodes, cx, cy);
        break;
      case 'force':
        computed = computeForceDirectedLayout(nodes, edges, cx, cy);
        break;
      case 'hierarchical':
        computed = computeHierarchicalLayout(nodes, edges, cx);
        break;
      case 'grid':
        computed = computeGridLayout(nodes, cx, cy);
        break;
      case 'circular':
      default:
        computed = computeCircularLayout(nodes, cx, cy);
        break;
    }
  }

  if (originalPos.size > 0) {
    return computed.map((n) => {
      const orig = originalPos.get(n.id);
      return orig ? { ...n, x: orig.x, y: orig.y } : n;
    });
  }
  return computed;
}

/**
 * 1. Global Circular Layout
 */
function computeCircularLayout(nodes: GraphNode[], cx: number, cy: number): GraphNode[] {
  const count = nodes.length;
  const radius = Math.max(260, count * 11);
  const angleStep = (2 * Math.PI) / count;

  return nodes.map((node, i) => {
    const angle = i * angleStep;
    return {
      ...node,
      x: Math.round(cx + radius * Math.cos(angle)),
      y: Math.round(cy + radius * Math.sin(angle)),
    };
  });
}

/**
 * 2. Concentric Layout by Forensic Layer
 * Arranges nodes into 5 concentric rings corresponding to the 5 evidence layers.
 */
function computeConcentricLayout(nodes: GraphNode[], cx: number, cy: number): GraphNode[] {
  const layerOrder: LayerId[] = ['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS'];
  const baseRadii: Record<LayerId, number> = {
    VERIFIED: 130,
    OSINT_RAW: 260,
    INFRA: 390,
    HYPOTHESIS: 520,
    FLOWS: 650,
  };

  // Group nodes by layer
  const grouped: Record<LayerId, GraphNode[]> = {
    VERIFIED: [],
    OSINT_RAW: [],
    INFRA: [],
    HYPOTHESIS: [],
    FLOWS: [],
  };

  nodes.forEach((n) => {
    if (grouped[n.layer]) {
      grouped[n.layer].push(n);
    } else {
      grouped.VERIFIED.push(n);
    }
  });

  const updatedNodesMap = new Map<string, { x: number; y: number }>();

  layerOrder.forEach((layerKey, layerIdx) => {
    const layerNodes = grouped[layerKey];
    const m = layerNodes.length;
    if (m === 0) return;

    // Expand radius dynamically if layer is crowded
    const r = Math.max(baseRadii[layerKey], m * 14);
    // Offset starting angle per ring to avoid radial stacking
    const offsetAngle = (layerIdx * Math.PI) / 5;
    const step = (2 * Math.PI) / m;

    layerNodes.forEach((node, idx) => {
      const angle = offsetAngle + idx * step;
      updatedNodesMap.set(node.id, {
        x: Math.round(cx + r * Math.cos(angle)),
        y: Math.round(cy + r * Math.sin(angle)),
      });
    });
  });

  return nodes.map((node) => {
    const pos = updatedNodesMap.get(node.id);
    return pos ? { ...node, x: pos.x, y: pos.y } : node;
  });
}

/**
 * 3. Organic Force-Directed Layout (Fruchterman-Reingold with Center Gravity & Collision Buffer)
 * Produces balanced, readable forensic clusters where connected suspect networks naturally group.
 */
function computeForceDirectedLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cx: number,
  cy: number
): GraphNode[] {
  const count = nodes.length;
  // Desired equilibrium spring distance between connected nodes
  const k = Math.min(160, Math.max(100, Math.sqrt((850 * 650) / Math.max(count, 1))));
  const iterations = 60;
  const initialTemp = 120;

  // Initialize node positions seeded in a jittered spiral to break symmetry
  const positions = new Map<string, { x: number; y: number; dx: number; dy: number }>();

  nodes.forEach((node, i) => {
    const angle = i * 2.39996; // Golden angle in radians
    const r = Math.min(280, 28 * Math.sqrt(i + 1));
    const startX = node.x && Math.abs(node.x - cx) < 2000 ? node.x : Math.round(cx + r * Math.cos(angle));
    const startY = node.y && Math.abs(node.y - cy) < 2000 ? node.y : Math.round(cy + r * Math.sin(angle));
    positions.set(node.id, { x: startX, y: startY, dx: 0, dy: 0 });
  });

  for (let iter = 0; iter < iterations; iter++) {
    const temp = initialTemp * Math.pow(1 - iter / iterations, 1.4);

    // 1. Repulsive forces between all node pairs (Coulomb repulsion)
    for (let i = 0; i < count; i++) {
      const nodeA = nodes[i];
      if (!nodeA) continue;
      const posA = positions.get(nodeA.id);
      if (!posA) continue;

      for (let j = i + 1; j < count; j++) {
        const nodeB = nodes[j];
        if (!nodeB) continue;
        const posB = positions.get(nodeB.id);
        if (!posB) continue;

        let deltaX = posA.x - posB.x;
        let deltaY = posA.y - posB.y;
        let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dist < 1) {
          deltaX = (Math.sin(i * 13 + j) || 0.5) * 4;
          deltaY = (Math.cos(i * 7 + j) || 0.5) * 4;
          dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        }

        // Clamp repulsion to prevent explosive divergence
        const repForce = Math.min((k * k) / dist, 250);
        const fx = (deltaX / dist) * repForce;
        const fy = (deltaY / dist) * repForce;

        posA.dx += fx;
        posA.dy += fy;
        posB.dx -= fx;
        posB.dy -= fy;
      }
    }

    // 2. Attractive spring forces along edges (Hooke's law)
    edges.forEach((edge) => {
      const posSource = positions.get(edge.source_id);
      const posTarget = positions.get(edge.target_id);
      if (!posSource || !posTarget) return;

      const deltaX = posSource.x - posTarget.x;
      const deltaY = posSource.y - posTarget.y;
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dist < 1) return;

      const attrForce = (dist * dist) / k;
      const fx = (deltaX / dist) * attrForce;
      const fy = (deltaY / dist) * attrForce;

      posSource.dx -= fx;
      posSource.dy -= fy;
      posTarget.dx += fx;
      posTarget.dy += fy;
    });

    // 3. Center gravity force (stronger on sparse/disconnected graphs to prevent outward drift)
    const gravity = edges.length === 0 ? 0.28 : 0.08;
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;
      pos.dx += (cx - pos.x) * gravity;
      pos.dy += (cy - pos.y) * gravity;
    });

    // 4. Update positions with temperature limiting
    nodes.forEach((node) => {
      const pos = positions.get(node.id);
      if (!pos) return;

      const dispDist = Math.sqrt(pos.dx * pos.dx + pos.dy * pos.dy);
      if (dispDist > 0) {
        const limitedDisp = Math.min(dispDist, temp);
        pos.x += (pos.dx / dispDist) * limitedDisp;
        pos.y += (pos.dy / dispDist) * limitedDisp;
      }
      pos.dx = 0;
      pos.dy = 0;
    });
  }

  // 5. Normalize overall bounding span proportionally to sqrt(N) so small/disconnected graphs stay compact
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  positions.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const rawCenterX = (minX + maxX) / 2;
  const rawCenterY = (minY + maxY) / 2;
  const rawMaxSpan = Math.max(maxX - minX, maxY - minY, 1);
  const targetMaxSpan = Math.min(1350, Math.max(260, Math.ceil(Math.sqrt(count)) * 135));

  if (rawMaxSpan > targetMaxSpan) {
    const scaleFactor = targetMaxSpan / rawMaxSpan;
    positions.forEach((p) => {
      p.x = rawCenterX + (p.x - rawCenterX) * scaleFactor;
      p.y = rawCenterY + (p.y - rawCenterY) * scaleFactor;
    });
  }

  // 6. Post-pass: Minimum separation buffer (prevent overlapping circles after compaction)
  const minSeparation = 90;
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < count; i++) {
      const nodeA = nodes[i];
      if (!nodeA) continue;
      const posA = positions.get(nodeA.id);
      if (!posA) continue;

      for (let j = i + 1; j < count; j++) {
        const nodeB = nodes[j];
        if (!nodeB) continue;
        const posB = positions.get(nodeB.id);
        if (!posB) continue;

        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minSeparation && dist > 0) {
          const overlap = (minSeparation - dist) / 2;
          const pushX = (dx / dist) * overlap;
          const pushY = (dy / dist) * overlap;
          posA.x -= pushX;
          posA.y -= pushY;
          posB.x += pushX;
          posB.y += pushY;
        }
      }
    }
  }

  // 7. Recenter around (cx, cy)
  minX = Infinity;
  maxX = -Infinity;
  minY = Infinity;
  maxY = -Infinity;

  positions.forEach((p) => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const currentCenterX = (minX + maxX) / 2;
  const currentCenterY = (minY + maxY) / 2;
  const shiftX = cx - currentCenterX;
  const shiftY = cy - currentCenterY;

  return nodes.map((node) => {
    const p = positions.get(node.id);
    return {
      ...node,
      x: Math.round((p?.x ?? cx) + shiftX),
      y: Math.round((p?.y ?? cy) + shiftY),
    };
  });
}

/**
 * 4. Hierarchical Layout
 * Categorizes nodes into 5 investigative causal tiers.
 */
function computeHierarchicalLayout(
  nodes: GraphNode[],
  _edges: GraphEdge[],
  cx: number
): GraphNode[] {
  // Determine tier based on entity type and layer
  const getTier = (node: GraphNode): number => {
    const t = node.type.toLowerCase();
    // Tier 0: Administrative & Territory
    if (['wilaya', 'daira', 'commune', 'unite', 'affaire', 'magistrat'].includes(t)) return 0;
    // Tier 1: Core Subjects / Companies / Vehicles
    if (['personne', 'entreprise', 'vehicule'].includes(t)) return 1;
    // Tier 2: Vectors & Identifiers (Phone, SIM, Social, Chat)
    if (['telephone', 'carte_sim', 'appareil_mobile', 'compte_social', 'canal_telegram', 'adresse_email', 'site_web'].includes(t)) return 2;
    // Tier 3: Technical Pivots & Telecom BTS
    if (['antenne_bts', 'serveur_c2', 'fichier_apk', 'certificat_tls', 'artefact_dfir', 'session_recherche', 'identifiant_infrastructure'].includes(t)) return 3;
    // Tier 4: Flows & Sealed Pieces
    return 4;
  };

  const tiers: GraphNode[][] = [[], [], [], [], []];
  nodes.forEach((n) => {
    const tier = getTier(n);
    tiers[tier]?.push(n);
  });

  const updatedPositions = new Map<string, { x: number; y: number }>();
  const tierYSpacing = 160;
  const startY = 120;

  tiers.forEach((tierNodes, tierIdx) => {
    const m = tierNodes.length;
    if (m === 0) return;

    const y = startY + tierIdx * tierYSpacing;
    const spacingX = Math.max(90, Math.min(180, 1100 / m));
    const totalWidth = (m - 1) * spacingX;
    const startX = cx - totalWidth / 2;

    tierNodes.forEach((node, idx) => {
      updatedPositions.set(node.id, {
        x: Math.round(startX + idx * spacingX),
        y,
      });
    });
  });

  return nodes.map((node) => {
    const pos = updatedPositions.get(node.id);
    return pos ? { ...node, x: pos.x, y: pos.y } : node;
  });
}

/**
 * 5. Compact Matrix Grid Layout
 * Arranges nodes into a clean grid grouped by layer.
 */
function computeGridLayout(nodes: GraphNode[], cx: number, cy: number): GraphNode[] {
  const count = nodes.length;
  const cols = Math.ceil(Math.sqrt(count * 1.5));
  const spacingX = 110;
  const spacingY = 100;

  const totalWidth = cols * spacingX;
  const startX = cx - totalWidth / 2 + spacingX / 2;
  const totalRows = Math.ceil(count / cols);
  const startY = cy - (totalRows * spacingY) / 2 + spacingY / 2;

  // Sort nodes by layer then label for neat grouping
  const sorted = [...nodes].sort((a, b) => {
    if (a.layer !== b.layer) return a.layer.localeCompare(b.layer);
    return a.label.localeCompare(b.label);
  });

  return sorted.map((node, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return {
      ...node,
      x: Math.round(startX + col * spacingX),
      y: Math.round(startY + row * spacingY),
    };
  });
}

/**
 * Single tick of live force simulation for real-time physics loop.
 * Dampens displacements so nodes smoothly float towards organic equilibrium without jitter.
 */
export function stepLiveForcePhysics(
  nodes: GraphNode[],
  edges: GraphEdge[],
  cx: number = DEFAULT_CENTER_X,
  cy: number = DEFAULT_CENTER_Y,
  fixedNodeId?: string | null,
  pinnedNodeIds?: Set<string>
): Map<string, { x: number; y: number }> {
  const count = nodes.length;
  const positions = new Map<string, { x: number; y: number; dx: number; dy: number }>();
  nodes.forEach((n) => {
    positions.set(n.id, { x: n.x ?? cx, y: n.y ?? cy, dx: 0, dy: 0 });
  });

  const k = Math.min(220, Math.max(120, Math.sqrt((850 * 650) / Math.max(count, 1))));

  // 1. Repulsion between all node pairs
  for (let i = 0; i < count; i++) {
    const nodeA = nodes[i];
    if (!nodeA) continue;
    const posA = positions.get(nodeA.id);
    if (!posA) continue;
    for (let j = i + 1; j < count; j++) {
      const nodeB = nodes[j];
      if (!nodeB) continue;
      const posB = positions.get(nodeB.id);
      if (!posB) continue;
      let deltaX = posA.x - posB.x;
      let deltaY = posA.y - posB.y;
      let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (dist < 1) {
        deltaX = (Math.sin(i * 13 + j) || 0.5) * 6;
        deltaY = (Math.cos(i * 7 + j) || 0.5) * 6;
        dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      }
      const repForce = Math.min((k * k) / Math.max(dist, 10), 180);
      const fx = (deltaX / dist) * repForce;
      const fy = (deltaY / dist) * repForce;
      posA.dx += fx;
      posA.dy += fy;
      posB.dx -= fx;
      posB.dy -= fy;
    }
  }

  // 2. Edge spring attraction
  edges.forEach((edge) => {
    const posSource = positions.get(edge.source_id);
    const posTarget = positions.get(edge.target_id);
    if (!posSource || !posTarget) return;
    const deltaX = posSource.x - posTarget.x;
    const deltaY = posSource.y - posTarget.y;
    const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    if (dist < 1) return;
    const attrForce = (dist * dist) / (k * 1.3);
    const fx = (deltaX / dist) * attrForce;
    const fy = (deltaY / dist) * attrForce;
    posSource.dx -= fx;
    posSource.dy -= fy;
    posTarget.dx += fx;
    posTarget.dy += fy;
  });

  // 3. Center gravity (smooth pull towards canvas center)
  const gravity = 0.032;
  nodes.forEach((node) => {
    const pos = positions.get(node.id);
    if (!pos) return;
    pos.dx += (cx - pos.x) * gravity;
    pos.dy += (cy - pos.y) * gravity;
  });

  // 4. Kinetic step dampening allowing fluid, responsive motion for all nodes
  const maxStep = 5.0;
  const result = new Map<string, { x: number; y: number }>();
  nodes.forEach((node) => {
    const pos = positions.get(node.id);
    if (!pos) return;
    if (node.id === fixedNodeId || (pinnedNodeIds && pinnedNodeIds.has(node.id))) {
      result.set(node.id, { x: pos.x, y: pos.y });
      return;
    }
    const dispDist = Math.sqrt(pos.dx * pos.dx + pos.dy * pos.dy);
    if (dispDist > 0.02) {
      const step = Math.min(dispDist, maxStep);
      result.set(node.id, {
        x: Number((pos.x + (pos.dx / dispDist) * step).toFixed(1)),
        y: Number((pos.y + (pos.dy / dispDist) * step).toFixed(1)),
      });
    } else {
      result.set(node.id, { x: pos.x, y: pos.y });
    }
  });

  return result;
}

const ADMINISTRATIVE_CONTAINER_TYPES = new Set([
  'wilaya',
  'daira',
  'commune',
  'affaire',
  'unite',
]);

export interface PersonGraphProjectionResult {
  visibleNodes: GraphNode[];
  visibleEdges: GraphEdge[];
  hiddenNeighborCountByNode: Map<string, number>;
  expandedNeighborCountByNode: Map<string, number>;
}

export function isPersonEntity(node: GraphNode): boolean {
  const t = (node.type || '').toLowerCase();
  return t === 'personne' || t === 'person';
}

/**
 * Computes the Person-Centric Graph Projection (Option A):
 * - Displays only `Person` nodes plus any non-person entities explicitly expanded by the user.
 * - Synthesizes one aggregated mediated link between each pair of Person nodes connected
 *   through 1 to 3 hidden operational intermediate entities (e.g. shared voice call, phone, bank transfer).
 */
export function computePersonGraphProjection(
  layerFilteredNodes: GraphNode[],
  allEdges: GraphEdge[],
  isPersonOnlyGraph: boolean,
  expandedHiddenNodeIds: Set<string>,
  mediatedEdgeOverrides: Record<
    string,
    { confidence?: number; layer?: LayerId; confidentiality_level?: string; notes?: string }
  > = {}
): PersonGraphProjectionResult {
  const hiddenNeighborCountByNode = new Map<string, number>();
  const expandedNeighborCountByNode = new Map<string, number>();

  const hasAnyPerson = layerFilteredNodes.some((n) => isPersonEntity(n));
  if (!isPersonOnlyGraph || !hasAnyPerson) {
    return {
      visibleNodes: layerFilteredNodes,
      visibleEdges: allEdges,
      hiddenNeighborCountByNode,
      expandedNeighborCountByNode,
    };
  }

  const nodeById = new Map<string, GraphNode>();
  layerFilteredNodes.forEach((n) => nodeById.set(n.id, n));

  const visibleNodeIds = new Set<string>();
  layerFilteredNodes.forEach((n) => {
    if (isPersonEntity(n) || expandedHiddenNodeIds.has(n.id)) {
      visibleNodeIds.add(n.id);
    }
  });

  const visibleNodes = layerFilteredNodes.filter((n) => visibleNodeIds.has(n.id));

  // Build adjacency for nodes in active layers
  const adj = new Map<string, Array<{ neighborId: string; edge: GraphEdge }>>();
  layerFilteredNodes.forEach((n) => adj.set(n.id, []));

  allEdges.forEach((edge) => {
    if (nodeById.has(edge.source_id) && nodeById.has(edge.target_id)) {
      adj.get(edge.source_id)?.push({ neighborId: edge.target_id, edge });
      adj.get(edge.target_id)?.push({ neighborId: edge.source_id, edge });
    }
  });

  // Count hidden & expanded non-person direct neighbors for every visible node
  visibleNodes.forEach((vNode) => {
    const hiddenSet = new Set<string>();
    const expandedSet = new Set<string>();

    const neighbors = adj.get(vNode.id) || [];
    neighbors.forEach(({ neighborId }) => {
      const target = nodeById.get(neighborId);
      if (!target || isPersonEntity(target)) return;
      if (ADMINISTRATIVE_CONTAINER_TYPES.has(target.type.toLowerCase())) return;

      if (visibleNodeIds.has(neighborId)) {
        expandedSet.add(neighborId);
      } else {
        hiddenSet.add(neighborId);
      }
    });

    hiddenNeighborCountByNode.set(vNode.id, hiddenSet.size);
    expandedNeighborCountByNode.set(vNode.id, expandedSet.size);
  });

  // 1. Direct edges between currently visible nodes
  const directEdges = allEdges.filter(
    (e) => visibleNodeIds.has(e.source_id) && visibleNodeIds.has(e.target_id)
  );

  // 2. Synthesize aggregated mediated edges between pairs of visible nodes
  // connected via 1..5 hidden operational entities (excluding generic administrative containers).
  // Any visible node (Person or expanded non-person) terminates the path.
  const pairMediationMap = new Map<
    string,
    {
      nodeA: string;
      nodeB: string;
      intermediateNodes: Map<string, GraphNode>;
      underlyingEdges: Map<string, GraphEdge>;
    }
  >();

  visibleNodes.forEach((startNode) => {
    // BFS through intermediate operational hidden nodes up to 5 hops
    interface QueueItem {
      currId: string;
      intermediateIds: string[];
      edgeIds: string[];
    }

    const queue: QueueItem[] = [
      { currId: startNode.id, intermediateIds: [], edgeIds: [] },
    ];

    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) continue;
      const { currId, intermediateIds, edgeIds } = item;
      const neighbors = adj.get(currId) || [];

      for (const { neighborId, edge } of neighbors) {
        if (neighborId === startNode.id) continue;
        if (intermediateIds.includes(neighborId)) continue;

        const neighborNode = nodeById.get(neighborId);
        if (!neighborNode) continue;

        // Reached another visible node via >= 1 hidden intermediates!
        if (visibleNodeIds.has(neighborId)) {
          if (intermediateIds.length >= 1) {
            const [pA, pB] =
              startNode.id < neighborId
                ? [startNode.id, neighborId]
                : [neighborId, startNode.id];
            const pairKey = `mediated__${pA}__${pB}`;

            let entry = pairMediationMap.get(pairKey);
            if (!entry) {
              entry = {
                nodeA: pA,
                nodeB: pB,
                intermediateNodes: new Map(),
                underlyingEdges: new Map(),
              };
              pairMediationMap.set(pairKey, entry);
            }
            const targetEntry = entry;
            intermediateIds.forEach((hid) => {
              const hNode = nodeById.get(hid);
              if (hNode) targetEntry.intermediateNodes.set(hid, hNode);
            });
            [...edgeIds, edge.id].forEach((eid) => {
              const foundEdge = allEdges.find((ae) => ae.id === eid);
              if (foundEdge) targetEntry.underlyingEdges.set(eid, foundEdge);
            });
          }
          // Do not traverse past ANY visible node (paths split at visible intermediate nodes)
          continue;
        }

        // Traverse through intermediate hidden operational entities (max 5 hidden intermediate nodes)
        if (
          !ADMINISTRATIVE_CONTAINER_TYPES.has(neighborNode.type.toLowerCase()) &&
          !isPersonEntity(neighborNode) &&
          intermediateIds.length < 5
        ) {
          queue.push({
            currId: neighborId,
            intermediateIds: [...intermediateIds, neighborId],
            edgeIds: [...edgeIds, edge.id],
          });
        }
      }
    }
  });

  const mediatedEdges: GraphEdge[] = [];
  pairMediationMap.forEach((entry, pairKey) => {
    const intermediates = Array.from(entry.intermediateNodes.values());
    const underlying = Array.from(entry.underlyingEdges.values());
    if (intermediates.length === 0) return;

    const avgConf =
      underlying.length > 0
        ? underlying.reduce((acc, e) => acc + (typeof e.confidence === 'number' ? e.confidence : 0.85), 0) /
          underlying.length
        : 0.85;

    const override = mediatedEdgeOverrides[pairKey];
    const firstIntermediate = intermediates[0];
    const caseId = firstIntermediate?.case_id || nodeById.get(entry.nodeA)?.case_id || 'active';
    const summaryLabel =
      intermediates.length === 1
        ? `Liaison médiée (1 nœud)`
        : `Liaison médiée (${intermediates.length} nœuds)`;

    mediatedEdges.push({
      id: pairKey,
      case_id: caseId,
      source_id: entry.nodeA,
      target_id: entry.nodeB,
      type: 'RELATION_MEDIEE',
      layer: override?.layer || underlying[0]?.layer || 'FLOWS',
      confidence: override?.confidence !== undefined ? override.confidence : Number(avgConf.toFixed(2)),
      provenance: 'PROJECTION_PERSONNES',
      properties: {
        is_mediated: true,
        mediated_count: intermediates.length,
        summary_label: summaryLabel,
        intermediate_node_ids: intermediates.map((n) => n.id),
        intermediate_nodes: intermediates.map((n) => ({
          id: n.id,
          label: n.label,
          type: n.type,
          layer: n.layer,
        })),
        underlying_edge_ids: underlying.map((e) => e.id),
        confidentiality_level: override?.confidentiality_level || 'RESTREINT_ENQUETE',
        notes: override?.notes || '',
      },
    });
  });

  return {
    visibleNodes,
    visibleEdges: [...directEdges, ...mediatedEdges],
    hiddenNeighborCountByNode,
    expandedNeighborCountByNode,
  };
}

export const MIN_GRAPH_ZOOM = 0.1;
export const MAX_GRAPH_ZOOM = 10.0;

/**
 * Computes pan/zoom so all visible nodes fit comfortably centered inside the canvas container.
 * Uses compact framing margins so initial view opens closer and legible while fitting key entities.
 */
export function computeGraphFitViewport(
  nodes: GraphNode[],
  containerWidth: number,
  containerHeight: number,
  nodeSize = 56
): { panX: number; panY: number; zoom: number } {
  if (nodes.length === 0) {
    return { panX: 0, panY: 0, zoom: 1 };
  }

  const safeW = Math.max(containerWidth, 320);
  const safeH = Math.max(containerHeight, 240);
  const pad = Math.max(48, Math.round(nodeSize * 0.9));

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  nodes.forEach((n) => {
    const x = n.x ?? DEFAULT_CENTER_X;
    const y = n.y ?? DEFAULT_CENTER_Y;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  minX -= pad;
  maxX += pad;
  minY -= pad;
  maxY += pad;

  const boundsW = Math.max(maxX - minX, 220);
  const boundsH = Math.max(maxY - minY, 160);

  const fitZoom = Math.min((safeW - 24) / boundsW, (safeH - 24) / boundsH);
  const zoomedFit = fitZoom * 1.25;
  const zoom = Number(Math.min(Math.max(zoomedFit, 0.72), 1.35).toFixed(2));

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const panX = Math.round(safeW / 2 - centerX * zoom);
  const panY = Math.round(safeH / 2 - centerY * zoom);

  return { panX, panY, zoom };
}

export interface BulkDeletionThirdParty {
  person: GraphNode;
  viaIntermediates: GraphNode[];
}

export interface BulkDeletionAnalysis {
  status: 'ready' | 'blocked_third_party';
  primaryNodes: GraphNode[];
  intermediateNodes: GraphNode[];
  allNodeIdsToDelete: string[];
  affectedEdgeCount: number;
  blockingThirdParties: BulkDeletionThirdParty[];
}

/**
 * Analyzes a multi-node deletion request.
 * - In full graph mode: deletes strictly the selected nodes.
 * - In compacted (Person-only) mode: when a pair of selected visible nodes is connected via
 *   mediated hidden intermediate entities, includes those intermediates in the deletion list —
 *   UNLESS a third unselected person is also implicated through any of those intermediates,
 *   in which case deletion is blocked and the user is invited to switch to Full Graph view.
 */
export function analyzeBulkNodeDeletion(
  selectedIds: string[],
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  isPersonOnlyGraph: boolean,
  expandedHiddenNodeIds: Set<string> = new Set()
): BulkDeletionAnalysis {
  const uniqueSelectedIds = Array.from(new Set(selectedIds));
  const selectedSet = new Set(uniqueSelectedIds);
  const nodeById = new Map<string, GraphNode>();
  allNodes.forEach((n) => nodeById.set(n.id, n));

  const primaryNodes = uniqueSelectedIds
    .map((id) => nodeById.get(id))
    .filter((n): n is GraphNode => Boolean(n));

  if (primaryNodes.length === 0) {
    return {
      status: 'ready',
      primaryNodes: [],
      intermediateNodes: [],
      allNodeIdsToDelete: [],
      affectedEdgeCount: 0,
      blockingThirdParties: [],
    };
  }

  const intermediateIdSet = new Set<string>();

  if (isPersonOnlyGraph && primaryNodes.length >= 2) {
    const projection = computePersonGraphProjection(
      allNodes,
      allEdges,
      true,
      expandedHiddenNodeIds
    );

    projection.visibleEdges.forEach((edge) => {
      if (
        edge.properties?.is_mediated === true &&
        selectedSet.has(edge.source_id) &&
        selectedSet.has(edge.target_id)
      ) {
        const rawIntermediates = edge.properties?.intermediate_node_ids;
        if (Array.isArray(rawIntermediates)) {
          rawIntermediates.forEach((id) => {
            if (typeof id === 'string' && !selectedSet.has(id) && nodeById.has(id)) {
              intermediateIdSet.add(id);
            }
          });
        }
      }
    });
  }

  const intermediateNodes = Array.from(intermediateIdSet)
    .map((id) => nodeById.get(id))
    .filter((n): n is GraphNode => Boolean(n));

  // Check if any third unselected person is implicated via any candidate intermediate node
  const thirdPartyMap = new Map<string, { person: GraphNode; viaMap: Map<string, GraphNode> }>();

  if (intermediateNodes.length > 0) {
    const adj = new Map<string, string[]>();
    allNodes.forEach((n) => adj.set(n.id, []));
    allEdges.forEach((e) => {
      if (nodeById.has(e.source_id) && nodeById.has(e.target_id)) {
        adj.get(e.source_id)?.push(e.target_id);
        adj.get(e.target_id)?.push(e.source_id);
      }
    });

    intermediateNodes.forEach((interNode) => {
      const visited = new Set<string>([interNode.id]);
      const queue: Array<{ id: string; hops: number }> = [{ id: interNode.id, hops: 0 }];

      while (queue.length > 0) {
        const curr = queue.shift();
        if (!curr) continue;
        const neighbors = adj.get(curr.id) || [];

        for (const nbId of neighbors) {
          if (visited.has(nbId) || selectedSet.has(nbId)) continue;
          visited.add(nbId);

          const nbNode = nodeById.get(nbId);
          if (!nbNode) continue;

          if (isPersonEntity(nbNode)) {
            let entry = thirdPartyMap.get(nbNode.id);
            if (!entry) {
              entry = { person: nbNode, viaMap: new Map() };
              thirdPartyMap.set(nbNode.id, entry);
            }
            entry.viaMap.set(interNode.id, interNode);
            continue;
          }

          if (
            !ADMINISTRATIVE_CONTAINER_TYPES.has(nbNode.type.toLowerCase()) &&
            curr.hops < 4
          ) {
            queue.push({ id: nbId, hops: curr.hops + 1 });
          }
        }
      }
    });
  }

  const blockingThirdParties: BulkDeletionThirdParty[] = Array.from(thirdPartyMap.values()).map(
    (entry) => ({
      person: entry.person,
      viaIntermediates: Array.from(entry.viaMap.values()),
    })
  );

  const allDeleteSet = new Set<string>([
    ...primaryNodes.map((n) => n.id),
    ...intermediateNodes.map((n) => n.id),
  ]);

  const affectedEdgeCount = allEdges.filter(
    (e) => allDeleteSet.has(e.source_id) || allDeleteSet.has(e.target_id)
  ).length;

  return {
    status: blockingThirdParties.length > 0 ? 'blocked_third_party' : 'ready',
    primaryNodes,
    intermediateNodes,
    allNodeIdsToDelete: Array.from(allDeleteSet),
    affectedEdgeCount,
    blockingThirdParties,
  };
}

