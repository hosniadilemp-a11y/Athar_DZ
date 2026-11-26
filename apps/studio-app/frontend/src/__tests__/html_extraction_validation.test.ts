import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it } from 'vitest';
import { CandidateValidationPanel } from '../components/inspector/CandidateValidationPanel';
import { InspectorPanel } from '../components/inspector/InspectorPanel';
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
      relationsByNodeId: {},
      selectedCandidateId: null,
      selectedNodeId: null,
      selectedEdgeId: null,
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

    const collapsedHtml = renderToStaticMarkup(
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
    expect(collapsedHtml).toContain('candidate-type-filter-bar');
    expect(collapsedHtml).toContain('candidate-group-toggle');
    expect(collapsedHtml).toContain('aria-expanded="false"');
    expect(collapsedHtml).not.toContain('script:ld+json#0');

    // Selecting the candidate auto-expands its entity group and card details
    useGraphStore.setState({ selectedCandidateId: 'cand-html-1' });
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
    expect(html).toContain('identifiant unique:');
    expect(html).not.toContain('html-jsonld-parser');
    expect(html).toContain('cand-cat-color');
  });

  it('highlights extracted candidates that already exist in the case database', () => {
    useGraphStore.setState({
      nodes: [
        {
          id: HTML_NODE_ID,
          case_id: CASE_ID,
          type: 'compte_social',
          layer: 'OSINT_RAW',
          label: '01_profil_osint_social.html',
          confidence: 0.9,
          provenance: 'html-upload',
          properties: { __is_evidence_file: true, filename: '01_profil_osint_social.html' },
          latitude: null,
          longitude: null,
        },
        {
          id: 'existing-phone-node',
          case_id: CASE_ID,
          type: 'telephone',
          layer: 'VERIFIED',
          label: '+213 661 55 01 02',
          confidence: 1.0,
          provenance: 'manual',
          properties: { msisdn: '+213661550102' },
          latitude: null,
          longitude: null,
        },
      ],
      edges: [],
      candidatesByNodeId: {
        [HTML_NODE_ID]: [
          {
            id: 'cand-dup-phone',
            case_id: CASE_ID,
            run_id: 'run-dup-1',
            source_node_id: HTML_NODE_ID,
            entity_type: 'telephone',
            suggested_layer: 'OSINT_RAW',
            label: '0661 55 01 02',
            normalized_value: '+213661550102',
            attributes: { numero: '+213661550102' },
            confidence: 0.95,
            extractor_tool: 'regex-e164-dz',
            stage_number: 1,
            source_page: 1,
            source_locator: 'body:text',
            quote_snippet: 'Contact 0661 55 01 02',
            matched_existing_node_id: null,
            validation_status: 'PENDING',
            promoted_node_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'NOT_PUBLISHED',
          },
        ],
      },
      extractionRunsByNodeId: {},
      selectedCandidateId: 'cand-dup-phone',
    });

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
    expect(html).toContain('is-db-match');
    expect(html).toContain('is-selected');
    expect(html).toContain('candidate-edit-form');
    expect(html).toContain('Modifier les informations');
    expect(html).toContain('Enregistrer');
    expect(html).toContain('+213 661 55 01 02');
    expect(html).not.toContain('regex-e164-dz');
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

  it('renders staged semantic relations with validate, modify, and delete controls in CandidateValidationPanel', () => {
    useGraphStore.setState({
      relationsByNodeId: {
        [HTML_NODE_ID]: [
          {
            id: 'rel-cand-1',
            case_id: CASE_ID,
            run_id: 'run-html-1',
            source_node_id: HTML_NODE_ID,
            relation_type: 'POSSEDE_PROFIL_SOCIAL',
            source_entity_type: 'personne',
            source_normalized_value: 'Karim Mansouri',
            target_entity_type: 'compte_social',
            target_normalized_value: '@karim_auto_fictif',
            source_candidate_id: 'cand-p1',
            target_candidate_id: 'cand-s1',
            source_label: 'Karim Mansouri',
            target_label: '@karim_auto_fictif',
            suggested_layer: 'OSINT_RAW',
            attributes: {},
            confidence: 0.94,
            extractor_tool: 'html-jsonld-rel',
            stage_number: 2,
            source_page: 1,
            source_locator: 'script:ld+json#0',
            quote_snippet: 'JSON-LD Person alternateName',
            validation_status: 'PENDING',
            promoted_edge_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'NOT_PUBLISHED',
          },
        ],
      },
    });

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
    expect(html).toContain('Relations sémantiques détectées');
    expect(html).toContain('Possède le Profil Social');
    expect(html).toContain('Catégories');
    expect(html).toContain('Relations Générales');
    expect(html).toContain('Tout déplier');
    expect(html).toContain('aria-expanded="false"');
    // Groups and cards are minimized by default, matching Indices extraits à valider
    expect(html).not.toContain('Karim Mansouri');
  });

  it('renders relation type editor and delete button in InspectorPanel Edge Mode', () => {
    const personNode: GraphNode = {
      id: 'node-p1',
      case_id: CASE_ID,
      type: 'personne',
      layer: 'HYPOTHESIS',
      label: 'Karim Mansouri',
      confidence: 0.9,
      provenance: 'manual',
      properties: {},
      latitude: null,
      longitude: null,
    };
    const phoneNode: GraphNode = {
      id: 'node-t1',
      case_id: CASE_ID,
      type: 'telephone',
      layer: 'OSINT_RAW',
      label: '+2135550112',
      confidence: 0.95,
      provenance: 'manual',
      properties: {},
      latitude: null,
      longitude: null,
    };
    useGraphStore.setState({
      nodes: [personNode, phoneNode],
      edges: [
        {
          id: 'edge-1',
          case_id: CASE_ID,
          type: 'UTILISE_TELEPHONE',
          source_id: personNode.id,
          target_id: phoneNode.id,
          layer: 'OSINT_RAW',
          confidence: 0.88,
          provenance: 'EXTRACTION_VALIDATED',
          properties: {},
        },
      ],
      selectedNodeId: null,
      selectedEdgeId: 'edge-1',
    });

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          ToastProvider,
          null,
          React.createElement(InspectorPanel, {
            onExpand: () => {},
            onClose: () => {},
          })
        )
      )
    );
    expect(html).toContain('UTILISE_TELEPHONE');
    expect(html).toContain('Karim Mansouri');
    expect(html).toContain('+2135550112');
    expect(html).toContain('Supprimer la relation');
  });
});
