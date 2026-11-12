/**
 * Graph data models matching Athar backend API v1.
 */

import type { LayerId } from './registry';

export interface GraphNode {
  id: string;
  case_id: string;
  type: string;
  layer: LayerId;
  label: string;
  confidence: number | null;
  provenance: string;
  properties: Record<string, unknown>;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  updated_at?: string;
  // Canvas coordinate extensions (computed client-side or from layout)
  x?: number;
  y?: number;
  radius?: number;
  is_impact?: boolean;
}

export interface GraphEdge {
  id: string;
  case_id: string;
  type: string;
  source_id: string;
  target_id: string;
  layer: LayerId;
  confidence: number | null;
  provenance: string;
  properties: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CaseItem {
  id: string;
  code: string;
  title: string;
  description: string;
  status: 'OPEN' | 'ARCHIVED' | 'CLOSED';
  created_at: string;
  updated_at: string;
  nodes_count: number;
  edges_count: number;
}

export interface GraphResponse {
  case_id: string;
  is_impact_view: boolean;
  total_case_nodes: number;
  total_case_edges: number;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ExpandRequest {
  node_ids: string[];
  hops: number;
}

export interface LayerChangeRequest {
  layer: LayerId;
  reason: string;
}

export interface NodeCreateRequest {
  type: string;
  label: string;
  confidence?: number;
  provenance?: string;
  properties?: Record<string, unknown>;
  latitude?: number;
  longitude?: number;
}

export interface EdgeCreateRequest {
  type: string;
  source_id: string;
  target_id: string;
  layer?: LayerId;
  confidence?: number;
  provenance?: string;
  properties?: Record<string, unknown>;
}
