import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { I18nProvider } from '../context/I18nContext';
import { GeoSuggestionSelect } from '../components/common/GeoSuggestionSelect';
import { computeCaseOverviewMetrics } from '../utils/caseMetrics';
import type { CaseItem, GraphNode } from '../types/graph';
import type { ExtractedCandidate, ExtractedRelation, ExtractionRun } from '../types/ingestion';

function makeCase(overrides: Partial<CaseItem> = {}): CaseItem {
  return {
    id: 'case-empty',
    code: 'AFF-2026-001',
    title: 'Dossier Vierge',
    description: '',
    status: 'OPEN',
    created_at: '2026-11-26T08:00:00Z',
    updated_at: '2026-11-26T08:00:00Z',
    nodes_count: 0,
    edges_count: 0,
    ...overrides,
  };
}

function makeNode(id: string, type: string, label: string, properties: Record<string, unknown> = {}): GraphNode {
  return {
    id,
    case_id: 'case-1',
    type,
    layer: 'VERIFIED',
    label,
    confidence: 1.0,
    provenance: 'UNIT_TEST',
    properties,
    latitude: null,
    longitude: null,
  };
}

describe('computeCaseOverviewMetrics (no hardcoded demo KPIs)', () => {
  it('returns zeroed metrics and empty lists for an empty investigation', () => {
    const metrics = computeCaseOverviewMetrics({
      activeCase: makeCase(),
      nodes: [],
      edges: [],
      candidatesByNodeId: {},
      relationsByNodeId: {},
      extractionRunsByNodeId: {},
    });

    expect(metrics.estimatedLossDzd).toBe(0);
    expect(metrics.formattedLossDzd).toBe('0 DZD');
    expect(metrics.victimsCount).toBe(0);
    expect(metrics.complainantsCount).toBe(0);
    expect(metrics.suspectsCount).toBe(0);
    expect(metrics.wilayas).toEqual([]);
    expect(metrics.totalEvidenceObjects).toBe(0);
    expect(metrics.analyzedObjectsCount).toBe(0);
    expect(metrics.needsInvestigationCount).toBe(0);
    expect(metrics.sha256VerifiedCount).toBe(0);
    expect(metrics.sha256Ratio).toBe(0);
    expect(metrics.totalPendingValidations).toBe(0);
    expect(metrics.pendingItems).toEqual([]);
    expect(metrics.pendingRelations).toEqual([]);
  });

  it('aggregates financial loss, actors, wilayas, evidence objects, and pending SPI candidates from real case data', () => {
    const nodes: GraphNode[] = [
      makeNode('tx-1', 'transaction_financiere', 'Virement 185 000 DZD', { montant_dzd: 185000 }),
      makeNode('tx-2', 'transaction_financiere', 'Retrait GAB 45 000 DZD', { montant: '45 000 DZD' }),
      makeNode('p-1', 'personne', 'Karim B.', { status_judiciaire: 'Victime', wilaya: 'Alger' }),
      makeNode('p-2', 'personne', 'Nadia S.', { role_judiciaire: 'Plaignant', wilaya: 'Blida' }),
      makeNode('p-3', 'personne', 'Amine Z.', { status_judiciaire: 'Suspect', wilaya: 'Oran' }),
      makeNode('p-4', 'personne', 'Mourad T.', { role: 'Mule BaridiMob', wilaya: 'Oran' }),
      makeNode('ev-1', 'scelle_numerique', '01_pv_plainte.pdf', {
        is_raw_evidence: true,
        server_sha256: 'abc123',
        investigation_status: 'saturated',
        analysis_progress: 100,
      }),
      makeNode('ev-2', 'image_preuve', '02_capture.png', {
        is_raw_evidence: true,
        investigation_status: 'pending_analysis',
        analysis_progress: 0,
      }),
    ];

    const candidatesByNodeId: Record<string, ExtractedCandidate[]> = {
      'ev-1': [
        {
          id: 'cand-1',
          run_id: 'run-1',
          case_id: 'case-1',
          source_node_id: 'ev-1',
          entity_type: 'compte_bancaire',
          label: 'RIP 00799999000123456789',
          normalized_value: '00799999000123456789',
          suggested_layer: 'INFRA',
          confidence: 0.94,
          extractor_tool: 'regex_dz',
          stage_number: 2,
          source_page: 1,
          quote_snippet: 'RIP 00799999000123456789',
          matched_existing_node_id: null,
          validation_status: 'PENDING',
          promoted_node_id: null,
          validated_by: null,
          validated_at: null,
          blackboard_sync_status: 'SYNCED',
          attributes: {},
        },
        {
          id: 'cand-2',
          run_id: 'run-1',
          case_id: 'case-1',
          source_node_id: 'ev-1',
          entity_type: 'telephone',
          label: '0550112233',
          normalized_value: '+213550112233',
          suggested_layer: 'OSINT_RAW',
          confidence: 0.91,
          extractor_tool: 'regex_dz',
          stage_number: 2,
          source_page: 1,
          quote_snippet: '0550112233',
          matched_existing_node_id: null,
          validation_status: 'VALIDATED',
          promoted_node_id: 'node-tel-1',
          validated_by: 'investigator',
          validated_at: '2026-11-26T08:05:00Z',
          blackboard_sync_status: 'SYNCED',
          attributes: {},
        },
      ],
    };

    const relationsByNodeId: Record<string, ExtractedRelation[]> = {
      'ev-1': [
        {
          id: 'rel-1',
          run_id: 'run-1',
          case_id: 'case-1',
          source_node_id: 'ev-1',
          relation_type: 'POSSEDE_COMPTE',
          source_entity_type: 'personne',
          source_normalized_value: 'Amine Z.',
          target_entity_type: 'compte_bancaire',
          target_normalized_value: '00799999000123456789',
          source_candidate_id: null,
          target_candidate_id: 'cand-1',
          source_label: 'Amine Z.',
          target_label: 'RIP',
          suggested_layer: 'FLOWS',
          attributes: {},
          confidence: 0.88,
          extractor_tool: 'camel_ner',
          stage_number: 3,
          source_page: 1,
          quote_snippet: 'compte ouvert',
          validation_status: 'PENDING',
          promoted_edge_id: null,
          validated_by: null,
          validated_at: null,
          blackboard_sync_status: 'SYNCED',
        },
      ],
    };

    const extractionRunsByNodeId: Record<string, ExtractionRun | null> = {
      'ev-1': {
        id: 'run-1',
        case_id: 'case-1',
        source_node_id: 'ev-1',
        mode: 'step_by_step',
        status: 'COMPLETED',
        current_stage: 3,
        total_stages: 3,
        selected_tools: ['pymupdf'],
        summary: {},
        started_at: '2026-11-26T08:00:00Z',
      },
    };

    const metrics = computeCaseOverviewMetrics({
      activeCase: makeCase({ id: 'case-1', wilaya: 'Alger, Tizi Ouzou' }),
      nodes,
      edges: [],
      candidatesByNodeId,
      relationsByNodeId,
      extractionRunsByNodeId,
    });

    expect(metrics.estimatedLossDzd).toBe(230000);
    expect(metrics.formattedLossDzd).toBe('230 000 DZD');
    expect(metrics.victimsCount).toBe(1);
    expect(metrics.complainantsCount).toBe(1);
    expect(metrics.suspectsCount).toBe(2);
    expect(metrics.wilayas).toEqual(['Alger', 'Blida', 'Oran', 'Tizi Ouzou']);
    expect(metrics.totalEvidenceObjects).toBe(2);
    expect(metrics.analyzedObjectsCount).toBe(1);
    expect(metrics.needsInvestigationCount).toBe(1);
    expect(metrics.sha256VerifiedCount).toBe(1);
    expect(metrics.sha256Ratio).toBe(50);
    expect(metrics.pendingCandidatesCount).toBe(1);
    expect(metrics.pendingRelationsCount).toBe(1);
    expect(metrics.totalPendingValidations).toBe(2);
    expect(metrics.pendingItems[0]?.sourceNodeLabel).toBe('01_pv_plainte.pdf');
  });
});

describe('GeoSuggestionSelect styling compliance', () => {
  it('renders accessible combobox markup with zero inline styles', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(GeoSuggestionSelect, {
          id: 'test-wilaya',
          label: '1. Wilaya (58) *',
          placeholder: 'Rechercher...',
          value: '16',
          options: [
            { value: '16', label: '16 - Alger', secondary: 'الجزائر' },
            { value: '31', label: '31 - Oran', secondary: 'وهران' },
          ],
          onSelect: () => {},
        })
      )
    );

    expect(html).toContain('role="combobox"');
    expect(html).toContain('geo-select-field');
    expect(html).toContain('16 - Alger');
    expect(html).not.toContain('style="');
  });
});
