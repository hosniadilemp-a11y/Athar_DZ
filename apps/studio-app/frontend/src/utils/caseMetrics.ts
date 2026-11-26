import type { CaseItem, GraphEdge, GraphNode } from '../types/graph';
import type { ExtractedCandidate, ExtractedRelation, ExtractionRun } from '../types/ingestion';

export interface PendingArbitrationItem {
  candidate: ExtractedCandidate;
  sourceNodeId: string;
  sourceNodeLabel: string;
}

export interface CaseOverviewMetrics {
  estimatedLossDzd: number;
  formattedLossDzd: string;
  victimsCount: number;
  complainantsCount: number;
  suspectsCount: number;
  wilayas: string[];
  totalEvidenceObjects: number;
  analyzedObjectsCount: number;
  needsInvestigationCount: number;
  sha256VerifiedCount: number;
  sha256Ratio: number;
  pendingCandidatesCount: number;
  pendingRelationsCount: number;
  totalPendingValidations: number;
  pendingItems: PendingArbitrationItem[];
  pendingRelations: Array<{
    relation: ExtractedRelation;
    sourceNodeId: string;
    sourceNodeLabel: string;
  }>;
}

const EVIDENCE_NODE_TYPES = new Set([
  'scelle_numerique',
  'piece_a_conviction',
  'document_judiciaire',
  'image_preuve',
  'enregistrement_vocal',
  'fichier_apk',
  'artefact_dfir',
]);

function normalizeText(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseDzdAmount(raw: unknown): number {
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return raw > 0 ? raw : 0;
  }
  if (typeof raw !== 'string') return 0;
  const cleaned = raw
    .replace(/\u00a0/g, ' ')
    .replace(/[^\d.,\s-]/g, ' ')
    .trim();
  if (!cleaned) return 0;
  // Take largest/first plausible numeric group (e.g. "185 000" or "420000")
  const match = cleaned.match(/\d[\d\s.,]*/);
  if (!match) return 0;
  const digits = match[0].replace(/[\s,]/g, '').replace(/\.(?=\d{3}\b)/g, '');
  const parsed = Number.parseFloat(digits);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function formatDzdAmount(amount: number): string {
  if (!Number.isFinite(amount) || amount <= 0) return '0 DZD';
  const rounded = Math.round(amount);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formatted} DZD`;
}

export function isEvidenceObjectNode(node: GraphNode): boolean {
  const props = node.properties || {};
  return Boolean(
    props.is_raw_evidence ||
      EVIDENCE_NODE_TYPES.has(node.type) ||
      typeof props.client_sha256 === 'string' ||
      typeof props.server_sha256 === 'string' ||
      typeof props.hash_sha256 === 'string' ||
      typeof props.analysis_mode === 'string' ||
      typeof props.investigation_status === 'string'
  );
}

/**
 * Compute live investigation KPIs and pending arbitration queue strictly from active case data.
 */
export function computeCaseOverviewMetrics(params: {
  activeCase: CaseItem | null;
  nodes: GraphNode[];
  edges: GraphEdge[];
  candidatesByNodeId: Record<string, ExtractedCandidate[]>;
  relationsByNodeId: Record<string, ExtractedRelation[]>;
  extractionRunsByNodeId: Record<string, ExtractionRun | null>;
}): CaseOverviewMetrics {
  const {
    activeCase,
    nodes,
    candidatesByNodeId,
    relationsByNodeId,
    extractionRunsByNodeId,
  } = params;

  let estimatedLossDzd = 0;
  let victimsCount = 0;
  let complainantsCount = 0;
  let suspectsCount = 0;
  const wilayaSet = new Set<string>();

  if (activeCase?.wilaya) {
    activeCase.wilaya
      .split(/[,;/]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .forEach((w) => wilayaSet.add(w));
  }

  let totalEvidenceObjects = 0;
  let analyzedObjectsCount = 0;
  let sha256VerifiedCount = 0;
  const activeNodeMap = new Map<string, GraphNode>();

  for (const node of nodes) {
    activeNodeMap.set(node.id, node);
    const props = node.properties || {};

    if (typeof props.wilaya === 'string' && props.wilaya.trim()) {
      wilayaSet.add(props.wilaya.trim());
    }
    if (typeof props.wilaya_activity === 'string' && props.wilaya_activity.trim()) {
      wilayaSet.add(props.wilaya_activity.trim());
    }

    if (node.type === 'transaction_financiere') {
      const amt =
        parseDzdAmount(props.montant_dzd) ||
        parseDzdAmount(props.montant) ||
        parseDzdAmount(props.amount) ||
        parseDzdAmount(node.label);
      estimatedLossDzd += amt;
    }

    if (node.type === 'personne') {
      const statusNorm = normalizeText(
        props.status_judiciaire || props.role_judiciaire || props.role || ''
      );
      if (statusNorm.includes('victime')) {
        victimsCount += 1;
      } else if (statusNorm.includes('plaignant')) {
        complainantsCount += 1;
      } else if (
        statusNorm.includes('suspect') ||
        statusNorm.includes('complice') ||
        statusNorm.includes('co-auteur') ||
        statusNorm.includes('mule') ||
        statusNorm.includes('prete-nom') ||
        statusNorm.includes('mis en cause')
      ) {
        suspectsCount += 1;
      }
    }

    if (isEvidenceObjectNode(node)) {
      totalEvidenceObjects += 1;
      const run = extractionRunsByNodeId[node.id];
      const isAnalyzed =
        props.investigation_status === 'saturated' ||
        (typeof props.analysis_progress === 'number' && props.analysis_progress >= 100) ||
        run?.status === 'COMPLETED';
      if (isAnalyzed) {
        analyzedObjectsCount += 1;
      }
      if (
        Boolean(props.sha256_verified) ||
        Boolean(props.server_sha256) ||
        Boolean(props.client_sha256) ||
        Boolean(props.hash_sha256)
      ) {
        sha256VerifiedCount += 1;
      }
    }
  }

  const pendingItems: PendingArbitrationItem[] = [];
  for (const [sourceNodeId, list] of Object.entries(candidatesByNodeId)) {
    const sourceNode = activeNodeMap.get(sourceNodeId);
    if (!sourceNode) continue;
    for (const candidate of list) {
      if (candidate.validation_status === 'PENDING') {
        pendingItems.push({
          candidate,
          sourceNodeId,
          sourceNodeLabel: sourceNode.label,
        });
      }
    }
  }

  const pendingRelations: CaseOverviewMetrics['pendingRelations'] = [];
  for (const [sourceNodeId, list] of Object.entries(relationsByNodeId)) {
    const sourceNode = activeNodeMap.get(sourceNodeId);
    if (!sourceNode) continue;
    for (const relation of list) {
      if (relation.validation_status === 'PENDING') {
        pendingRelations.push({
          relation,
          sourceNodeId,
          sourceNodeLabel: sourceNode.label,
        });
      }
    }
  }

  const needsInvestigationCount = Math.max(0, totalEvidenceObjects - analyzedObjectsCount);
  const sha256Ratio =
    totalEvidenceObjects > 0
      ? Math.round((sha256VerifiedCount / totalEvidenceObjects) * 100)
      : 0;

  return {
    estimatedLossDzd,
    formattedLossDzd: formatDzdAmount(estimatedLossDzd),
    victimsCount,
    complainantsCount,
    suspectsCount,
    wilayas: Array.from(wilayaSet).sort((a, b) => a.localeCompare(b)),
    totalEvidenceObjects,
    analyzedObjectsCount,
    needsInvestigationCount,
    sha256VerifiedCount,
    sha256Ratio,
    pendingCandidatesCount: pendingItems.length,
    pendingRelationsCount: pendingRelations.length,
    totalPendingValidations: pendingItems.length + pendingRelations.length,
    pendingItems,
    pendingRelations,
  };
}
