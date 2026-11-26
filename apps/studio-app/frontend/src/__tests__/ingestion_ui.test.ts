import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IngestionPopover } from '../components/canvas/IngestionPopover';
import { IngestionInspectorSection } from '../components/inspector/IngestionInspectorSection';
import { CircularNode } from '../components/canvas/CircularNode';
import { EdgeLine } from '../components/canvas/EdgeLine';
import { CandidateValidationPanel } from '../components/inspector/CandidateValidationPanel';
import { FilePreviewModal } from '../components/modals/FilePreviewModal';
import { DeleteNodesModal } from '../components/modals/DeleteNodesModal';
import { getDisplayedEntityConfidence } from '../utils/entityConfidence';
import { I18nProvider } from '../context/I18nContext';
import { ToastProvider } from '../context/ToastContext';
import { ONTOLOGY_CATEGORY_COLORS, useGraphStore } from '../store/useGraphStore';
import type { GraphNode } from '../types/graph';
import type { LocalFileEntry } from '../utils/localFileStore';

function makeEvidenceNode(overrides: Partial<GraphNode['properties']> = {}): GraphNode {
  return {
    id: 'scelle-1',
    case_id: 'case-opt-b',
    type: 'image_preuve',
    layer: 'VERIFIED',
    label: '01_photo_suspect_exif.jpg',
    confidence: 1.0,
    provenance: 'LOCAL_FILE_DROP',
    properties: {
      is_raw_evidence: true,
      custom_icon: 'image',
      selected_plugins: ['exiftool', 'paddleocr'],
      file_name: '01_photo_suspect_exif.jpg',
      mime_type: 'image/jpeg',
      file_size_bytes: 18432,
      client_sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      sha256_scope: 'phase1_local_preseal',
      investigation_status: 'pending_analysis',
      analysis_mode: null,
      analysis_progress: 0,
      analysis_stage: "En attente du choix de mode par l'enquêteur",
      ...overrides,
    },
    latitude: null,
    longitude: null,
  };
}

describe('Option B Simplified Popover, Preview Modal & Inspector UI', () => {
  it('renders checkable tools, compact 3-mode buttons with info hover & process tree gears, and zero inline styles', () => {
    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(IngestionPopover, {
          node: makeEvidenceNode(),
          onClose: () => {},
          onLaunchMode: () => {},
          onUpdateConfig: () => {},
          onTriggerPhaseNotice: () => {},
        })
      )
    );

    expect(html).toContain('01_photo_suspect_exif.jpg');
    expect(html).toContain('Outils disponibles');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('ExifTool 12.84');
    expect(html).toContain('Analyse Rapide');
    expect(html).toContain('Analyse Complète');
    expect(html).toContain('Analyse Autonome');
    expect(html).toContain('role="tooltip"');
    expect(html).toContain('Configurer l&#x27;arbre des processus');
    expect(html).toContain('aria-disabled="true"');
    expect(html).toContain('Empreinte SHA-256 locale');
    expect(html).toContain('ba7816bf8f…f20015ad');
    expect(html).not.toContain('style="');
  });

  it('renders native accessible progressbar and active investigation badge in IngestionInspectorSection', () => {
    const activeNode = makeEvidenceNode({
      investigation_status: 'active_investigation',
      analysis_mode: 'quick',
      analysis_progress: 15,
      analysis_stage: 'Extraction rapide en attente (Moteur Phase 2)',
    });

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(IngestionInspectorSection, {
          node: activeNode,
          onLaunchMode: () => {},
          onOpenPopover: () => {},
          onTriggerPhaseNotice: () => {},
        })
      )
    );

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="15"');
    expect(html).toContain("En cours d&#x27;investigation");
    expect(html).toContain('Ouvrir le sélecteur d&#x27;analyse');
    expect(html).not.toContain('style="');
  });

  it('renders 3-step stepper and recovery CTA when paused at 33% in IngestionInspectorSection', () => {
    const pausedPdfNode = makeEvidenceNode({
      file_name: '01_pv_plainte_escroquerie.pdf',
      mime_type: 'application/pdf',
      investigation_status: 'active_investigation',
      analysis_mode: 'step_by_step',
      analysis_progress: 33,
      analysis_stage: 'Étape 1/3 terminée (Métadonnées & Images) — en attente',
    });

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(IngestionInspectorSection, {
          node: pausedPdfNode,
          onLaunchMode: () => {},
          onCompleteAnalysis: () => {},
          onOpenPopover: () => {},
        })
      )
    );

    expect(html).toContain('Méta &amp; Images');
    expect(html).toContain('Texte &amp; Regex');
    expect(html).toContain('NER &amp; Entités');
    expect(html).toContain('Finaliser l&#x27;analyse (100%)');
    expect(html).not.toContain('python-docx');
    expect(html).not.toContain('style="');
  });

  it('renders FilePreviewModal cleanly for CSV / sandboxed HTML / text with zero inline styles', () => {
    const csvEntry: LocalFileEntry = {
      nodeId: 'scelle-csv',
      sha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
      fileName: '04_cdr_operateur_fictif.csv',
      mimeType: 'text/csv',
      size: 2048,
      family: 'tabular_cdr',
      blobUrl: 'blob:http://127.0.0.1:5173/test-csv',
      csvRows: [
        ['msisdn_source', 'msisdn_target'],
        ['+2135550101', '+2135550102'],
      ],
      csvTotalRows: 1500,
    };

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(FilePreviewModal, {
          entry: csvEntry,
          onClose: () => {},
        })
      )
    );

    expect(html).toContain('04_cdr_operateur_fictif.csv');
    expect(html).toContain('Nouvel onglet');
    expect(html).toContain('Télécharger');
    expect(html).toContain('+2135550101');
    expect(html).not.toContain('style="');
  });

  it('returns null markup for non-evidence actor nodes without SHA-256 or ingestion status', () => {
    const plainActor: GraphNode = {
      id: 'person-1',
      case_id: 'case-opt-b',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Amine B.',
      confidence: 0.9,
      provenance: 'SEED',
      properties: {},
      latitude: null,
      longitude: null,
    };

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(IngestionInspectorSection, {
          node: plainActor,
          onLaunchMode: () => {},
          onOpenPopover: () => {},
        })
      )
    );

    expect(html).toBe('');
  });

  it('uses green for actors and renders distinct judicial status badges for Suspect and Victime', () => {
    expect(ONTOLOGY_CATEGORY_COLORS.acteurs).toBe('#22c55e');

    const suspectNode: GraphNode = {
      id: 'actor-suspect',
      case_id: 'case-opt-b',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Yacine Benali',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: { status_judiciaire: 'Suspect' },
      latitude: null,
      longitude: null,
    };

    const victimNode: GraphNode = {
      id: 'actor-victim',
      case_id: 'case-opt-b',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Karim Mansouri',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: { status_judiciaire: 'Victime' },
      latitude: null,
      longitude: null,
    };

    const noop = () => {};
    const suspectHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(CircularNode, {
          node: suspectNode,
          isSelected: false,
          onSelect: noop,
          onContextMenu: noop,
          onDragStart: noop,
        })
      )
    );
    const victimHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(CircularNode, {
          node: victimNode,
          isSelected: false,
          onSelect: noop,
          onContextMenu: noop,
          onDragStart: noop,
        })
      )
    );

    expect(suspectHtml).toContain('node-judicial-role-badge is-suspect');
    expect(suspectHtml).toContain('#22c55e');
    expect(victimHtml).toContain('node-judicial-role-badge is-victime');
    expect(victimHtml).toContain('#22c55e');
  });

  it('renders category filters (Acteurs, Télécoms, Finances) and matching collapsible relation groups in CandidateValidationPanel', () => {
    useGraphStore.setState({
      nodes: [{ ...makeEvidenceNode(), id: 'src-doc' }],
      extractionRunsByNodeId: {
        'src-doc': {
          id: 'run-1',
          case_id: 'case-1',
          source_node_id: 'src-doc',
          mode: 'step_by_step',
          current_stage: 3,
          total_stages: 3,
          status: 'COMPLETED',
          selected_tools: ['pymupdf'],
          summary: {},
          started_at: '2026-11-26T09:00:00Z',
        },
      },
      candidatesByNodeId: {
        'src-doc': [
          {
            id: 'cand-actor',
            case_id: 'case-1',
            run_id: 'run-1',
            source_node_id: 'src-doc',
            entity_type: 'personne',
            suggested_layer: 'OSINT_RAW',
            label: 'Karim Z.',
            normalized_value: 'Karim Z.',
            attributes: {},
            confidence: 0.9,
            extractor_tool: 'camel_ner',
            stage_number: 3,
            source_page: 1,
            quote_snippet: 'Karim Z. a contacté...',
            matched_existing_node_id: null,
            validation_status: 'PENDING',
            promoted_node_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'PENDING',
          },
          {
            id: 'cand-tel',
            case_id: 'case-1',
            run_id: 'run-1',
            source_node_id: 'src-doc',
            entity_type: 'telephone',
            suggested_layer: 'FLOWS',
            label: '0550112233',
            normalized_value: '+213550112233',
            attributes: {},
            confidence: 0.95,
            extractor_tool: 'regex_dz',
            stage_number: 2,
            source_page: 1,
            quote_snippet: 'tel 0550112233',
            matched_existing_node_id: null,
            validation_status: 'PENDING',
            promoted_node_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'PENDING',
          },
        ],
      },
      relationsByNodeId: {
        'src-doc': [
          {
            id: 'rel-tel',
            case_id: 'case-1',
            run_id: 'run-1',
            source_node_id: 'src-doc',
            relation_type: 'UTILISE_LIGNE',
            source_entity_type: 'personne',
            source_normalized_value: 'Karim Z.',
            target_entity_type: 'telephone',
            target_normalized_value: '+213550112233',
            source_candidate_id: 'cand-actor',
            target_candidate_id: 'cand-tel',
            source_label: 'Karim Z.',
            target_label: '0550112233',
            suggested_layer: 'FLOWS',
            attributes: {},
            confidence: 0.89,
            extractor_tool: 'camel_ner',
            stage_number: 3,
            source_page: 1,
            quote_snippet: 'Karim Z. utilise la ligne',
            validation_status: 'PENDING',
            promoted_edge_id: null,
            validated_by: null,
            validated_at: null,
            blackboard_sync_status: 'PENDING',
          },
        ],
      },
      selectedCandidateId: null,
    });

    const html = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          ToastProvider,
          null,
          React.createElement(CandidateValidationPanel, { sourceNodeId: 'src-doc' })
        )
      )
    );

    // Entity category + type filters
    expect(html).toContain('Catégories');
    expect(html).toContain('Acteurs');
    expect(html).toContain('Télécoms');
    expect(html).toContain('candidate-cat-dot');

    // Relations section matches candidates section structure (grouped, collapsed by default, category + type filters)
    expect(html).toContain('Relations sémantiques détectées');
    expect(html).toContain('candidate-relations-section');
    expect(html).toContain('Télécoms &amp; CDR');
    expect(html).toContain('aria-expanded="false"');
    // Card details remain collapsed by default
    expect(html).not.toContain('Karim Z. utilise la ligne');
  });

  it('distinguishes candidate preview edges (dashed) from validated canonical edges (solid)', () => {
    const srcNode: GraphNode = {
      id: 'n-src',
      case_id: 'case-1',
      type: 'personne',
      layer: 'VERIFIED',
      label: 'Source',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
      x: 100,
      y: 100,
    };
    const tgtNode: GraphNode = {
      id: 'n-tgt',
      case_id: 'case-1',
      type: 'telephone',
      layer: 'VERIFIED',
      label: '+213550112233',
      confidence: 1.0,
      provenance: 'MANUAL',
      properties: {},
      latitude: null,
      longitude: null,
      x: 350,
      y: 100,
    };

    const previewHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          'svg',
          null,
          React.createElement(EdgeLine, {
            edge: {
              id: 'cand-rel:1',
              case_id: 'case-1',
              type: 'UTILISE_LIGNE',
              source_id: 'n-src',
              target_id: 'n-tgt',
              layer: 'HYPOTHESIS',
              confidence: 0.9,
              provenance: '',
              properties: { __is_candidate_edge: true },
            },
            sourceNode: srcNode,
            targetNode: tgtNode,
            isSelected: false,
            onSelect: () => {},
          })
        )
      )
    );

    const validatedHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          'svg',
          null,
          React.createElement(EdgeLine, {
            edge: {
              id: 'edge-1',
              case_id: 'case-1',
              type: 'UTILISE_LIGNE',
              source_id: 'n-src',
              target_id: 'n-tgt',
              layer: 'VERIFIED',
              confidence: 1.0,
              provenance: 'PDF_STATIC',
              properties: {},
            },
            sourceNode: srcNode,
            targetNode: tgtNode,
            isSelected: false,
            onSelect: () => {},
          })
        )
      )
    );

    expect(previewHtml).toContain('stroke-dasharray="6,4"');
    expect(validatedHtml).not.toContain('stroke-dasharray');
  });

  it('wraps DeleteNodesModal in ModalPortal with primary Enter autofocus and defaults entity confidence to 100% until user modifies it', () => {
    const rawNode: GraphNode = {
      ...makeEvidenceNode(),
      confidence: 0.85,
      properties: {},
    };
    useGraphStore.setState({
      nodes: [rawNode],
      edges: [],
      pendingDeleteNodeIds: [rawNode.id],
      isPersonOnlyGraph: false,
      expandedHiddenNodeIds: new Set(),
    });
    const deleteHtml = renderToStaticMarkup(
      React.createElement(
        I18nProvider,
        null,
        React.createElement(
          ToastProvider,
          null,
          React.createElement(DeleteNodesModal)
        )
      )
    );
    expect(deleteHtml).toContain('modal-portal-root');
    expect(deleteHtml).toContain('data-autofocus="true"');
    expect(deleteHtml).toContain('data-modal-cancel="true"');
    expect(getDisplayedEntityConfidence(rawNode)).toBe(1.0);

    const userModifiedNode: GraphNode = {
      ...rawNode,
      confidence: 0.6,
      properties: { confidence_user_modified: true },
    };
    expect(getDisplayedEntityConfidence(userModifiedNode)).toBe(0.6);
  });
});
