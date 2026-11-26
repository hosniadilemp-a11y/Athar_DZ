/**
 * Directional Asymmetric Traversal ("Actor Sphere") for Option A Multi-Tab Isolation.
 *
 * Conforms to DECISIONS.md (D11, D14) and doc/SPECIFICATION.md Chapter 11.2:
 * 1. Incoming edges (u -> Focal): 1-hop strict; does not traverse upstream ancestors.
 * 2. Outgoing edges (Focal -> v1 -> v2 ...): traverses through mediating entities/traces,
 *    stopping strictly at third-party actor nodes ('personne', 'entreprise'), while preserving
 *    both the boundary actor node and its incoming link.
 * 3. Shared asset markers: highlights non-actor entities in the sphere linked to another actor.
 * 4. Hub dampening: infrastructure/relay entities with total degree > threshold (default 20)
 *    are included in the sphere without expanding their neighborhood.
 */

import type { GraphEdge, GraphNode } from '../types/graph';

export const ACTOR_ENTITY_TYPES = new Set<string>(['personne', 'person', 'entreprise']);
export const DEFAULT_HUB_DEGREE_THRESHOLD = 20;

export interface ActorSphereOptions {
  hubDegreeThreshold?: number;
}

export interface ActorSphereResult {
  focalNodeId: string;
  nodeIds: Set<string>;
  edgeIds: Set<string>;
  incomingNeighborIds: Set<string>;
  boundaryActorIds: Set<string>;
  sharedAssetIds: Set<string>;
  dampenedHubIds: Set<string>;
}

/**
 * Returns true if the node represents a human or legal-entity actor boundary.
 */
export function isActorEntityType(nodeType: string): boolean {
  return ACTOR_ENTITY_TYPES.has((nodeType || '').toLowerCase());
}

/**
 * Extracts a deterministic, bounded Actor Sphere subgraph around `focalNodeId`.
 */
export function computeActorSphere(
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  focalNodeId: string,
  options?: ActorSphereOptions
): ActorSphereResult {
  const hubThreshold = options?.hubDegreeThreshold ?? DEFAULT_HUB_DEGREE_THRESHOLD;

  const nodeIds = new Set<string>();
  const edgeIds = new Set<string>();
  const incomingNeighborIds = new Set<string>();
  const boundaryActorIds = new Set<string>();
  const sharedAssetIds = new Set<string>();
  const dampenedHubIds = new Set<string>();

  if (!focalNodeId || allNodes.length === 0) {
    return {
      focalNodeId,
      nodeIds,
      edgeIds,
      incomingNeighborIds,
      boundaryActorIds,
      sharedAssetIds,
      dampenedHubIds,
    };
  }

  const nodeById = new Map<string, GraphNode>();
  allNodes.forEach((n) => nodeById.set(n.id, n));

  if (!nodeById.has(focalNodeId)) {
    return {
      focalNodeId,
      nodeIds,
      edgeIds,
      incomingNeighborIds,
      boundaryActorIds,
      sharedAssetIds,
      dampenedHubIds,
    };
  }

  // Build deterministic adjacency lists and total degrees
  const inEdgesByNode = new Map<string, GraphEdge[]>();
  const outEdgesByNode = new Map<string, GraphEdge[]>();
  const degreeByNode = new Map<string, number>();

  allNodes.forEach((n) => {
    inEdgesByNode.set(n.id, []);
    outEdgesByNode.set(n.id, []);
    degreeByNode.set(n.id, 0);
  });

  const sortedEdges = [...allEdges].sort((a, b) => a.id.localeCompare(b.id));
  sortedEdges.forEach((edge) => {
    if (!nodeById.has(edge.source_id) || !nodeById.has(edge.target_id)) return;
    outEdgesByNode.get(edge.source_id)?.push(edge);
    inEdgesByNode.get(edge.target_id)?.push(edge);
    degreeByNode.set(edge.source_id, (degreeByNode.get(edge.source_id) ?? 0) + 1);
    degreeByNode.set(edge.target_id, (degreeByNode.get(edge.target_id) ?? 0) + 1);
  });

  nodeIds.add(focalNodeId);

  // 1. Incoming edges (u -> Focal): 1-hop strict
  const focalInEdges = inEdgesByNode.get(focalNodeId) ?? [];
  for (const edge of focalInEdges) {
    edgeIds.add(edge.id);
    if (edge.source_id !== focalNodeId) {
      nodeIds.add(edge.source_id);
      incomingNeighborIds.add(edge.source_id);
    }
  }

  // 2. Outgoing edges (Focal -> ...): directional BFS stopping at actors & dampened hubs
  const visitedOut = new Set<string>([focalNodeId]);
  const queue: string[] = [focalNodeId];

  while (queue.length > 0) {
    const currId = queue.shift();
    if (!currId) continue;
    const outEdges = outEdgesByNode.get(currId) ?? [];

    for (const edge of outEdges) {
      const targetId = edge.target_id;
      const targetNode = nodeById.get(targetId);
      if (!targetNode) continue;

      edgeIds.add(edge.id);
      nodeIds.add(targetId);

      if (targetId === focalNodeId) {
        continue;
      }

      if (isActorEntityType(targetNode.type)) {
        // Strict boundary stop: include boundary actor & arriving edge, do not expand past it
        boundaryActorIds.add(targetId);
        continue;
      }

      const targetDegree = degreeByNode.get(targetId) ?? 0;
      if (targetDegree > hubThreshold) {
        // Hub dampening: include hub node without expanding its collateral neighbors
        dampenedHubIds.add(targetId);
        continue;
      }

      if (!visitedOut.has(targetId)) {
        visitedOut.add(targetId);
        queue.push(targetId);
      }
    }
  }

  // 3. Shared asset detection: non-actor nodes in the sphere linked to a third-party actor
  nodeIds.forEach((id) => {
    if (id === focalNodeId) return;
    const node = nodeById.get(id);
    if (!node || isActorEntityType(node.type)) return;

    const connectedEdges = [
      ...(outEdgesByNode.get(id) ?? []),
      ...(inEdgesByNode.get(id) ?? []),
    ];

    for (const edge of connectedEdges) {
      const otherId = edge.source_id === id ? edge.target_id : edge.source_id;
      if (otherId === focalNodeId) continue;
      const otherNode = nodeById.get(otherId);
      if (otherNode && isActorEntityType(otherNode.type)) {
        sharedAssetIds.add(id);
        break;
      }
    }
  });

  return {
    focalNodeId,
    nodeIds,
    edgeIds,
    incomingNeighborIds,
    boundaryActorIds,
    sharedAssetIds,
    dampenedHubIds,
  };
}
