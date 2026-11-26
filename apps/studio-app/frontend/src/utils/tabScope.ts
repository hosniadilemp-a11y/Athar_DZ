/**
 * Tab-scoped graph selection & Decision D9 Impact filter.
 *
 * Ensures every view (Graph, Timeline, GIS Map, Table, Audit, Export, Toolbar, StatusBar)
 * operates consistently on the currently selected investigation tab without duplicating logic.
 */

import type { GraphEdge, GraphNode, InvestigationTab } from '../types/graph';
import type { LayerId } from '../types/registry';
import { computeActorSphere, type ActorSphereResult } from './actorSphere';

export interface TabScopedGraph {
  baseNodes: GraphNode[];
  baseEdges: GraphEdge[];
  scopedNodes: GraphNode[];
  scopedEdges: GraphEdge[];
  actorSphere: ActorSphereResult | null;
}

const CRITICAL_ROLES = new Set(['kingpin', 'leader', 'operationnel', 'lieutenant']);
const CRITICAL_IMPLICATION_LEVELS = new Set(['LEADER', 'HIGH']);

/**
 * Matches the backend Decision D9 critical-impact predicate (`graph_service.py`).
 */
export function isImpactCriticalNode(node: GraphNode): boolean {
  if (node.is_impact === true) return true;
  if (node.layer === 'HYPOTHESIS' || node.layer === 'FLOWS') return true;

  const props = node.properties || {};
  const role = typeof props.role === 'string' ? props.role.toLowerCase() : '';
  if (CRITICAL_ROLES.has(role)) return true;

  const imp =
    typeof props.implication_level === 'string' ? props.implication_level.toUpperCase() : '';
  if (CRITICAL_IMPLICATION_LEVELS.has(imp)) return true;

  const rawLoss = props.loss;
  if (typeof rawLoss === 'number' && rawLoss > 50000) return true;
  if (typeof rawLoss === 'string') {
    const parsed = Number(rawLoss);
    if (!Number.isNaN(parsed) && parsed > 50000) return true;
  }

  return false;
}

/**
 * Computes the nodes and edges visible for the active tab, active layers, and tab Impact toggle.
 */
export function computeTabScopedGraph(
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
  activeTab: InvestigationTab | null | undefined,
  activeLayers?: Set<LayerId>,
  isImpactOnly = false
): TabScopedGraph {
  let actorSphere: ActorSphereResult | null = null;
  let baseNodes = allNodes;
  let baseEdges = allEdges;

  if (activeTab?.kind === 'actor_sphere' && activeTab.focalNodeId) {
    actorSphere = computeActorSphere(allNodes, allEdges, activeTab.focalNodeId);
    const addedSet = new Set(activeTab.snapshot.addedNodeIds ?? []);
    const visibleInSphere = new Set<string>(actorSphere.nodeIds);
    addedSet.forEach((id) => visibleInSphere.add(id));

    baseNodes = allNodes.filter((n) => visibleInSphere.has(n.id));
    baseEdges = allEdges.filter(
      (e) =>
        actorSphere?.edgeIds.has(e.id) ||
        (visibleInSphere.has(e.source_id) && visibleInSphere.has(e.target_id))
    );
  }

  let scopedNodes = activeLayers
    ? baseNodes.filter((n) => activeLayers.has(n.layer))
    : baseNodes;

  if (isImpactOnly) {
    const focalId = activeTab?.kind === 'actor_sphere' ? activeTab.focalNodeId : null;
    scopedNodes = scopedNodes.filter(
      (n) => (focalId !== null && n.id === focalId) || isImpactCriticalNode(n)
    );
  }

  const scopedNodeIds = new Set(scopedNodes.map((n) => n.id));
  const scopedEdges = baseEdges.filter(
    (e) => scopedNodeIds.has(e.source_id) && scopedNodeIds.has(e.target_id)
  );

  return {
    baseNodes,
    baseEdges,
    scopedNodes,
    scopedEdges,
    actorSphere,
  };
}
