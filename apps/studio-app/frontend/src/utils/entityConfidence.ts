import type { GraphNode } from '../types/graph';

/**
 * Every entity defaults to 100% displayed confidence until the investigator
 * explicitly overrides and saves a different confidence score.
 */
export function getDisplayedEntityConfidence(node: GraphNode | null | undefined): number {
  if (!node) return 1.0;
  const userModified = Boolean(node.properties?.confidence_user_modified);
  if (userModified && typeof node.confidence === 'number' && Number.isFinite(node.confidence)) {
    return node.confidence;
  }
  return 1.0;
}
