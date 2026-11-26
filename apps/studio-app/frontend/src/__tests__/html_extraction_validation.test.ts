import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { CandidateValidationPanel } from '../components/inspector/CandidateValidationPanel';
import { FilePreviewModal } from '../components/modals/FilePreviewModal';
import { I18nProvider } from '../context/I18nContext';
import { ToastProvider } from '../context/ToastContext';
import { useGraphStore } from '../store/useGraphStore';
import type { GraphNode } from '../types/graph';
import { isIngestionModeLive, isStaticIngestionSupportedFile } from '../utils/fileIngestion';
import type { LocalFileEntry } from '../utils/localFileStore';
import { computeTabScopedGraph } from '../utils/tabScope';

const CASE_ID = '11111111-1111-1111-1111-111111111111';
const HTML_NODE_ID = '33333333-3333-3333-3333-333333333333';

function makeHtmlNode(): GraphNode {
  return {
    id: HTML_NODE_ID,
    case_id: CASE_ID,
    type: 'scelle_numerique',
    layer: 'VERIFIED',
    label: '01_profil_osint_social.html',
    confidence: 1.0,
    provenance: 'LOCAL_FILE_DROP',
    properties: {
      file_name: '01_profil_osint_social.html',
      mime_type: 'text/html',
      is_raw_evidence: true,
      client_sha256: 'def456',
      pending_candidates_count: 1,
    },
    latitude: null,
    longitude: null,
  };
}

describe('Phase 2A-HTML static HTML extraction & isolated validation', () => {
  beforeEach(() => {
    const htmlNode = makeHtmlNode();
    useGraphStore.setState({
      activeCase: {
        id: CASE_ID,
        code: 'CASE-HTML-2A',
        title: 'Test HTML Case',
        description: '',
        status: 'OPEN',
        created_at: '2026-11-26T07:00:00Z',
        updated_at: '2026-11-26T07:00:00Z',
        nodes_count: 1,
        edges_count: 0,
      },
      nodes: [htmlNode],
      edges: [],
      extractionRunsByNodeId: {},
      candidatesByNodeId: {},
      selectedCandidateId: null,
    });
    useGraphStore.getState().initTabsForCase(CASE_ID, [htmlNode]);
  });

  it('enables Mode 1 & Mode 2 for .html/.htm while keeping .warc/.mhtml and Mode 3 gated', () => {
    expect(isStaticIngestionSupportedFile('page.html', 'text/html')).toBe(true);
    expect(isStaticIngestionSupportedFile('archive.htm', '')).toBe(true);
    expect(isIngestionModeLive('quick', 'page.html', 'text/html')).toBe(true);
    expect(isIngestionModeLive('step_by_step', 'archive.htm', '')).toBe(true);
    expect(isIngestionModeLive('recursive', 'page.html', 'text/html')).toBe(false);
    expect(isIngestionModeLive('quick', 'capture.warc', 'application/warc')).toBe(false);
    expect(isIngestionModeLive('step_by_step', 'snapshot.mhtml', '')).toBe(false);
  });

  it('renders HTML source_locator in CandidateValidationPanel and isolates candidates from master graph', () => {
    useGraphStore.setState({
      extractionRunsByNodeId: {
        [HTML_NODE_ID]: {
          id: 'run-html-1',
          case_id: CASE_ID,
          source_node_id: HTML_NODE_ID,
          mode: 'step_by_step',
          current_stage: 2,
          total_stages: 3,
          status: 'WAITING_HUMAN',
          selected_tools: ['beautifulsoup4'],
          summary: {},
          started_at: '2026-11-26T07:00:00Z',
        },
      },
      candidatesByNodeId: {
        [HTML_NODE_ID]: [
          {
            id: 'cand-html-1',
            case_id: CASE_ID,
            run_id: 'run-html-1',
            source_node_id: HTML_NODE_ID,
            entity_type: 'compte_social',
            suggested_layer: 'OSINT_RAW',
            label: '@karim_auto_fictif',
            normalized_value: '@karim_auto_fictif',
            attributes: { identifiant_unique: '@karim_auto_fictif' },
            confidence: 0.96,
            extractor_tool: 'html-jsonld-parser',
            stage_number: 2,
            source_page: 1,
            source_locator: 'script:ld+json#0',
            quote_snippet: 'JSON-LD alternateName: @karim_auto_fictif',
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
    expect(masterScoped.scopedNodes[0]?.id).toBe(HTML_NODE_ID);

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          ToastProvider,
          null,
          React.createElement(CandidateValidationPanel, { sourceNodeId: HTML_NODE_ID })
        )
      )
    );
    expect(html).toContain('@karim_auto_fictif');
    expect(html).toContain('script:ld+json#0');
    expect(html).toContain('html-jsonld-parser');
  });

  it('renders HTML preview inside a strictly sandboxed iframe (sandbox="")', () => {
    const htmlEntry: LocalFileEntry = {
      nodeId: HTML_NODE_ID,
      sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      fileName: '01_profil_osint_social.html',
      mimeType: 'text/html',
      size: 1024,
      family: 'web_osint',
      blobUrl: 'blob:http://127.0.0.1:5173/test-html',
      textPreview: '<html><body><h1>Test</h1></body></html>',
    };

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(FilePreviewModal, {
          entry: htmlEntry,
          onClose: () => {},
        })
      )
    );
    expect(html).toContain('sandbox=""');
    expect(html).toContain('01_profil_osint_social.html');
  });
});
