/**
 * TypeScript models for Phase 2A manual static PDF ingestion & isolated candidate validation.
 */

export interface EvidenceUploadResponse {
  evidence_file_id: string;
  case_id: string;
  node_id: string;
  original_filename: string;
  mime_type: string;
  byte_size: number;
  sha256: string;
  blackboard_sync_status: string;
  metadata: Record<string, unknown>;
}

export interface ExtractionRun {
  id: string;
  case_id: string;
  source_node_id: string;
  mode: 'quick' | 'step_by_step';
  current_stage: number;
  total_stages: number;
  status: 'PENDING' | 'WAITING_HUMAN' | 'COMPLETED' | 'FAILED';
  selected_tools: string[];
  summary: Record<string, unknown>;
  started_at: string;
  completed_at?: string | null;
}

export interface ExtractedCandidate {
  id: string;
  case_id: string;
  run_id: string;
  source_node_id: string;
  entity_type: string;
  suggested_layer: string;
  label: string;
  normalized_value: string;
  attributes: Record<string, unknown>;
  confidence: number;
  extractor_tool: string;
  stage_number: number;
  source_page: number;
  source_locator?: string;
  quote_snippet: string;
  matched_existing_node_id: string | null;
  validation_status: 'PENDING' | 'VALIDATED' | 'MERGED' | 'REJECTED';
  promoted_node_id: string | null;
  validated_by: string | null;
  validated_at: string | null;
  blackboard_sync_status: string;
}

export interface ExtractedRelation {
  id: string;
  case_id: string;
  run_id: string;
  source_node_id: string;
  relation_type: string;
  source_entity_type: string;
  source_normalized_value: string;
  target_entity_type: string;
  target_normalized_value: string;
  source_candidate_id: string | null;
  target_candidate_id: string | null;
  source_label: string;
  target_label: string;
  suggested_layer: string;
  attributes: Record<string, unknown>;
  confidence: number;
  extractor_tool: string;
  stage_number: number;
  source_page: number;
  source_locator?: string;
  quote_snippet: string;
  validation_status: 'PENDING' | 'VALIDATED' | 'REJECTED';
  promoted_edge_id: string | null;
  validated_by: string | null;
  validated_at: string | null;
  blackboard_sync_status: string;
}

export interface NodeCandidatesResponse {
  case_id: string;
  source_node_id: string;
  latest_run: ExtractionRun | null;
  candidates: ExtractedCandidate[];
  counts: {
    pending: number;
    validated: number;
    merged: number;
    rejected: number;
    total: number;
  };
  relations?: ExtractedRelation[];
  relation_counts?: {
    pending: number;
    validated: number;
    rejected: number;
    total: number;
  };
}

export interface RelationUpdateRequest {
  relation_type?: string;
  suggested_layer?: string;
  confidence?: number;
  swap_direction?: boolean;
  allow_custom_relation?: boolean;
  attributes?: Record<string, unknown>;
}

export interface ValidateRelationsRequest {
  action: 'validate' | 'reject';
  relation_ids?: string[];
  select_all?: boolean;
  target_layer?: string;
  reason?: string;
}

export interface ValidateRelationsResponse {
  action: string;
  processed_count: number;
  created_nodes: Array<Record<string, unknown>>;
  created_edges: Array<Record<string, unknown>>;
  updated_relations: ExtractedRelation[];
  pending_relations_remaining: number;
}

export interface ValidateCandidatesRequest {
  action: 'validate' | 'merge' | 'reject';
  candidate_ids?: string[];
  select_all?: boolean;
  target_layer?: string;
  reason?: string;
}

export interface ValidateCandidatesResponse {
  action: string;
  processed_count: number;
  created_nodes: Array<Record<string, unknown>>;
  created_edges: Array<Record<string, unknown>>;
  updated_candidates: ExtractedCandidate[];
  pending_remaining: number;
}

export interface CaseIngestionSummaryResponse {
  case_id: string;
  runs_by_node_id: Record<string, ExtractionRun>;
  candidates_by_node_id: Record<string, ExtractedCandidate[]>;
  relations_by_node_id: Record<string, ExtractedRelation[]>;
}
