/**
 * Typed REST client for Phase 2A manual static PDF ingestion & isolated candidate validation.
 */

import { API_BASE } from '../config';
import type {
  EvidenceUploadResponse,
  NodeCandidatesResponse,
  ValidateCandidatesRequest,
  ValidateCandidatesResponse,
} from '../types/ingestion';

const DEFAULT_HEADERS = {
  'X-Actor-Id': 'investigator_front',
};

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as {
      error?: { message?: string };
      detail?: { message?: string } | string;
    };
    const msg =
      body.error?.message ||
      (typeof body.detail === 'object' ? body.detail?.message : body.detail) ||
      `Erreur serveur (${res.status})`;
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export async function uploadNodeEvidence(
  caseId: string,
  nodeId: string,
  file: File,
  clientSha256?: string
): Promise<EvidenceUploadResponse> {
  const form = new FormData();
  form.append('file', file);
  if (clientSha256) {
    form.append('client_sha256', clientSha256);
  }

  const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/ingestion/nodes/${nodeId}/upload`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
    body: form,
  });
  return parseJsonOrThrow<EvidenceUploadResponse>(res);
}

export const uploadNodePdf = uploadNodeEvidence;

export async function startNodeExtraction(
  caseId: string,
  nodeId: string,
  mode: 'quick' | 'step_by_step',
  selectedTools: string[]
): Promise<NodeCandidatesResponse> {
  const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/ingestion/nodes/${nodeId}/extract`, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mode, selected_tools: selectedTools }),
  });
  return parseJsonOrThrow<NodeCandidatesResponse>(res);
}

export async function advanceExtractionStage(
  caseId: string,
  runId: string
): Promise<NodeCandidatesResponse> {
  const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/ingestion/runs/${runId}/next-stage`, {
    method: 'POST',
    headers: DEFAULT_HEADERS,
  });
  return parseJsonOrThrow<NodeCandidatesResponse>(res);
}

export async function fetchNodeCandidates(
  caseId: string,
  nodeId: string
): Promise<NodeCandidatesResponse> {
  const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/ingestion/nodes/${nodeId}/candidates`, {
    headers: DEFAULT_HEADERS,
  });
  return parseJsonOrThrow<NodeCandidatesResponse>(res);
}

export async function validateNodeCandidates(
  caseId: string,
  nodeId: string,
  payload: ValidateCandidatesRequest
): Promise<ValidateCandidatesResponse> {
  const res = await fetch(`${API_BASE}/api/v1/cases/${caseId}/ingestion/nodes/${nodeId}/candidates/validate`, {
    method: 'POST',
    headers: {
      ...DEFAULT_HEADERS,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  return parseJsonOrThrow<ValidateCandidatesResponse>(res);
}
