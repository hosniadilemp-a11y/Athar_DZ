import { beforeEach, describe, expect, it } from 'vitest';
import { useGraphStore } from '../store/useGraphStore';
import { isIngestionModeLive } from '../utils/fileIngestion';
import { computeTabScopedGraph } from '../utils/tabScope';
import type { GraphNode } from '../types/graph';

const CASE_ID = '11111111-1111-1111-1111-111111111111';
const PDF_NODE_ID = '22222222-2222-2222-2222-222222222222';

function makePdfNode(): GraphNode {
  return {
    id: PDF_NODE_ID,
    case_id: CASE_ID,
    type: 'document_judiciaire',
    layer: 'VERIFIED',
    label: '01_pv_plainte_escroquerie.pdf',
    confidence: 1.0,
    provenance: 'LOCAL_FILE_DROP',
    properties: {
      file_name: '01_pv_plainte_escroquerie.pdf',
      mime_type: 'application/pdf',
      is_raw_evidence: true,
      client_sha256: 'abc123',
      pending_candidates_count: 2,
    },
    latitude: null,
    longitude: null,
  };
}

describe('Phase 2A static PDF extraction & isolated validation', () => {
  beforeEach(() => {
    const pdfNode = makePdfNode();
    useGraphStore.setState({
      activeCase: {
        id: CASE_ID,
        code: 'CASE-TEST-2A',
        title: 'Test Case',
        description: '',
        status: 'OPEN',
        created_at: '2026-11-25T10:00:00Z',
        updated_at: '2026-11-25T10:00:00Z',
        nodes_count: 1,
        edges_count: 0,
      },
      nodes: [pdfNode],
      edges: [],
      extractionRunsByNodeId: {},
      candidatesByNodeId: {},
      selectedCandidateId: null,
    });
    useGraphStore.getState().initTabsForCase(CASE_ID, [pdfNode]);
  });

  it('enables Mode 1 & Mode 2 for PDFs while keeping Mode 3 and non-PDFs gated', () => {
    expect(isIngestionModeLive('quick', 'pv.pdf', 'application/pdf')).toBe(true);
    expect(isIngestionModeLive('step_by_step', 'pv.pdf', 'application/pdf')).toBe(true);
    expect(isIngestionModeLive('recursive', 'pv.pdf', 'application/pdf')).toBe(false);
    expect(isIngestionModeLive('quick', 'photo.jpg', 'image/jpeg')).toBe(false);
    expect(isIngestionModeLive('step_by_step', 'cdr.csv', 'text/csv')).toBe(false);
  });

  it('keeps staged candidates out of the master graph until isolated validation', () => {
    useGraphStore.setState({
      candidatesByNodeId: {
        [PDF_NODE_ID]: [
          {
            id: 'cand-1',
            case_id: CASE_ID,
            run_id: 'run-1',
            source_node_id: PDF_NODE_ID,
            entity_type: 'telephone',
            suggested_layer: 'OSINT_RAW',
            label: '+2135550101',
            normalized_value: '+2135550101',
            attributes: { numero_e164: '+2135550101' },
            confidence: 0.94,
            extractor_tool: 'regex-e164-dz',
            stage_number: 1,
            source_page: 1,
            quote_snippet: 'Telephone plaignant : +213 555 0101',
            matched_existing_node_id: null,
            validation_status: 'PENDING',
            promoted_node_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'NOT_PUBLISHED',
          },
        ],
      },
    });

    const state = useGraphStore.getState();
    const masterTab = state.tabs.find((t) => t.kind === 'master');
    const masterScoped = computeTabScopedGraph(state.nodes, state.edges, masterTab);
    expect(masterScoped.scopedNodes).toHaveLength(1);
    expect(masterScoped.scopedNodes[0]?.id).toBe(PDF_NODE_ID);

    // Isolate the PDF node into its dedicated tab
    state.openActorTab(PDF_NODE_ID);
    const updated = useGraphStore.getState();
    const activeTab = updated.tabs.find((t) => t.id === updated.activeTabId);
    expect(activeTab?.kind).toBe('actor_sphere');
    expect(activeTab?.focalNodeId).toBe(PDF_NODE_ID);
    expect(updated.candidatesByNodeId[PDF_NODE_ID]).toHaveLength(1);
  });
});
