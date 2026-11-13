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
}

const DEFAULT_CENTER_X = 600;
const DEFAULT_CENTER_Y = 450;

/**
 * Apply selected layout to an array of nodes, returning updated nodes with new x, y coordinates.
 * Handles all special cases: 0 nodes, 1 node, disconnected graphs, missing layers.
 */
export function computeGraphLayout(
  nodes: GraphNode[],
  edges: GraphEdge[],
  layoutType: GraphLayoutType,
  options?: LayoutOptions
): GraphNode[] {
  const count = nodes.length;
  if (count === 0) return [];

  const cx = options?.centerX ?? DEFAULT_CENTER_X;
  const cy = options?.centerY ?? DEFAULT_CENTER_Y;

  // Special Case 1: Single Node -> placed exactly at center
  if (count === 1) {
    const singleNode = nodes[0];
    if (!singleNode) return [];
    return [{ ...singleNode, x: cx, y: cy }];
  }

  // Special Case 2: Two Nodes -> placed symmetrically around center
  if (count === 2) {
    const [n1, n2] = nodes;
    if (!n1 || !n2) return nodes;
    return [
      { ...n1, x: cx - 140, y: cy },
      { ...n2, x: cx + 140, y: cy },
    ];
  }

  switch (layoutType) {
    case 'concentric':
      return computeConcentricLayout(nodes, cx, cy);
    case 'force':
      return computeForceDirectedLayout(nodes, edges, cx, cy);
    case 'hierarchical':
      return computeHierarchicalLayout(nodes, edges, cx, cy);
    case 'grid':
      return computeGridLayout(nodes, cx, cy);
    case 'circular':
    default:
      return computeCircularLayout(nodes, cx, cy);
  }
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

    // 3. Center gravity force (pulls disconnected and peripheral nodes towards center)
    const gravity = 0.04;
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

  // 5. Post-pass: Minimum separation buffer (prevent overlapping circles)
  const minSeparation = 78;
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

      let dx = posB.x - posA.x;
      let dy = posB.y - posA.y;
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

  // 6. Recenter and scale slightly to fit viewport nicely
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
  cx: number,
  _cy: number
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
