import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { IngestionPopover } from '../components/canvas/IngestionPopover';
import { IngestionInspectorSection } from '../components/inspector/IngestionInspectorSection';
import { FilePreviewModal } from '../components/modals/FilePreviewModal';
import { I18nProvider } from '../context/I18nContext';
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
});
