import React, { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  FileText,
  GitFork,
  Info,
  ListChecks,
  Lock,
  Plus,
  Settings,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import type { AnalysisMode, GraphNode } from '../../types/graph';
import {
  INGESTION_MODES,
  buildDefaultProcessTree,
  classifyFileTaxonomy,
  formatByteSize,
  isIngestionModeLive,
  truncateSha256,
  type ProcessTreeStep,
} from '../../utils/fileIngestion';
import {
  getLocalFileEntry,
  openLocalFileInNewTab,
  type LocalFileEntry,
} from '../../utils/localFileStore';
import { useI18n } from '../../context/I18nContext';

export interface IngestionPopoverProps {
  node: GraphNode | null;
  onClose: () => void;
  onLaunchMode: (
    nodeId: string,
    mode: AnalysisMode,
    stageLabel: string,
    selectedPlugins: string[]
  ) => void;
  onIsolateNode?: (nodeId: string) => void;
  onUpdateConfig?: (
    nodeId: string,
    config: { selected_plugins?: string[]; process_tree?: Record<string, unknown> }
  ) => void;
  onPreviewFile?: (entry: LocalFileEntry) => void;
  onTriggerPhaseNotice: (featureName: string, targetPhase: string) => void;
}

function renderModeIcon(iconName: 'zap' | 'list-checks' | 'cpu') {
  if (iconName === 'zap') return <Zap size={13} aria-hidden="true" />;
  if (iconName === 'list-checks') return <ListChecks size={13} aria-hidden="true" />;
  return <Cpu size={13} aria-hidden="true" />;
}

export const IngestionPopover: React.FC<IngestionPopoverProps> = ({
  node,
  onClose,
  onLaunchMode,
  onIsolateNode,
  onUpdateConfig,
  onPreviewFile,
  onTriggerPhaseNotice,
}) => {
  const { tr } = useI18n();
  const [copiedHash, setCopiedHash] = useState(false);
  const [editingTreeMode, setEditingTreeMode] = useState<'step_by_step' | 'recursive' | null>(null);
  const [customStepText, setCustomStepText] = useState('');
  const [treeSavedBadge, setTreeSavedBadge] = useState(false);

  const props = node?.properties || {};
  const fileName = String(props.file_name || node?.label || 'piece_brute');
  const mimeType = String(props.mime_type || 'application/octet-stream');
  const taxonomy = classifyFileTaxonomy(fileName, mimeType);

  const storedPlugins = Array.isArray(props.selected_plugins)
    ? (props.selected_plugins as string[])
    : taxonomy.plugins.map((p) => p.id);

  const [selectedPlugins, setSelectedPlugins] = useState<string[]>(storedPlugins);
  const [processTreeSteps, setProcessTreeSteps] = useState<ProcessTreeStep[]>(() =>
    buildDefaultProcessTree('step_by_step', taxonomy.plugins, storedPlugins)
  );

  useEffect(() => {
    if (!node) return;
    const initialPlugins = Array.isArray(node.properties?.selected_plugins)
      ? (node.properties.selected_plugins as string[])
      : classifyFileTaxonomy(
          String(node.properties?.file_name || node.label),
          String(node.properties?.mime_type || '')
        ).plugins.map((p) => p.id);
    setSelectedPlugins(initialPlugins);
    setEditingTreeMode(null);
    setTreeSavedBadge(false);
  }, [node?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!node) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [node, onClose]);

  if (!node) return null;

  const byteSize = typeof props.file_size_bytes === 'number' ? props.file_size_bytes : 0;
  const sha256 = String(props.client_sha256 || '');
  const activeMode = typeof props.analysis_mode === 'string' ? (props.analysis_mode as AnalysisMode) : null;
  const pendingCandidatesCount =
    typeof props.pending_candidates_count === 'number' ? props.pending_candidates_count : 0;
  const localEntry = getLocalFileEntry(node.id, sha256);

  const handleCopyHash = () => {
    if (!sha256) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(sha256).catch(() => {});
    }
    setCopiedHash(true);
    window.setTimeout(() => setCopiedHash(false), 1600);
  };

  const handleTogglePlugin = (pluginId: string) => {
    const next = selectedPlugins.includes(pluginId)
      ? selectedPlugins.filter((id) => id !== pluginId)
      : [...selectedPlugins, pluginId];
    setSelectedPlugins(next);
    onUpdateConfig?.(node.id, { selected_plugins: next });
  };

  const handleOpenTreeEditor = (mode: 'step_by_step' | 'recursive') => {
    if (editingTreeMode === mode) {
      setEditingTreeMode(null);
      return;
    }
    const savedTrees = (props.process_tree as Record<string, ProcessTreeStep[]> | undefined) || {};
    const existingTree = savedTrees[mode];
    setProcessTreeSteps(
      Array.isArray(existingTree) && existingTree.length > 0
        ? existingTree
        : buildDefaultProcessTree(mode, taxonomy.plugins, selectedPlugins)
    );
    setEditingTreeMode(mode);
    setTreeSavedBadge(false);
  };

  const handleSaveTree = () => {
    if (!editingTreeMode) return;
    const existingMap = (props.process_tree as Record<string, unknown> | undefined) || {};
    onUpdateConfig?.(node.id, {
      process_tree: {
        ...existingMap,
        [editingTreeMode]: processTreeSteps,
      },
    });
    setTreeSavedBadge(true);
    window.setTimeout(() => setTreeSavedBadge(false), 1600);
  };

  const handleAddCustomStep = () => {
    const trimmed = customStepText.trim();
    if (!trimmed) return;
    setProcessTreeSteps((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        labelFr: trimmed,
        enabled: true,
        requiresValidation: editingTreeMode === 'step_by_step',
        pluginIds: selectedPlugins,
      },
    ]);
    setCustomStepText('');
  };

  return (
    <section
      className="ingestion-popover-panel"
      role="dialog"
      aria-modal="false"
      aria-label={tr("Choix du mode d'investigation forensique")}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      {/* 1. Compact Header: Filename + Close */}
      <header className="ingestion-popover-header">
        <div className="ingestion-popover-title-row">
          {taxonomy.family === 'image' && localEntry?.blobUrl ? (
            <img className="ingestion-thumb-mini" src={localEntry.blobUrl} alt={fileName} />
          ) : (
            <FileText size={16} className="ingestion-popover-title-icon" aria-hidden="true" />
          )}
          <div className="ingestion-popover-title-stack">
            <h3 className="ingestion-popover-title">
              <bdi dir="ltr">{fileName}</bdi>
            </h3>
            <bdi dir="ltr" className="ingestion-meta-mono">
              {tr(taxonomy.labelFr)} · {formatByteSize(byteSize)} · {mimeType}
            </bdi>
          </div>
        </div>
        <button
          type="button"
          className="ingestion-popover-close"
          onClick={onClose}
          title={tr("Fermer la fenêtre d'analyse")}
          aria-label={tr("Fermer la fenêtre d'analyse")}
        >
          <X size={14} aria-hidden="true" />
        </button>
      </header>

      {/* 2. Quick Preview Actions (In-App Modal or External Tab) */}
      {localEntry && (
        <div className="ingestion-quick-preview-row">
          {onPreviewFile && (
            <button
              type="button"
              className="btn btn-secondary btn-xs ingestion-preview-action-btn"
              onClick={() => onPreviewFile(localEntry)}
            >
              <Eye size={12} aria-hidden="true" />
              <span>{tr('Visualiser')}</span>
            </button>
          )}
          {localEntry.blobUrl && (
            <button
              type="button"
              className="btn btn-ghost btn-xs ingestion-preview-action-btn"
              onClick={() => openLocalFileInNewTab(localEntry)}
            >
              <ExternalLink size={12} aria-hidden="true" />
              <span>{tr('Nouvel onglet')}</span>
            </button>
          )}
        </div>
      )}

      {/* 3. Compact SHA-256 Line */}
      <div className="ingestion-seal-compact">
        <Lock size={11} aria-hidden="true" />
        <span className="ingestion-seal-label-compact">{tr('Empreinte SHA-256 locale')}</span>
        <code className="ingestion-hash-code" title={sha256}>
          <bdi dir="ltr">{sha256 ? truncateSha256(sha256) : '—'}</bdi>
        </code>
        {sha256 && (
          <button
            type="button"
            className="ingestion-copy-hash-btn"
            onClick={handleCopyHash}
            title={tr("Copier l'empreinte SHA-256 complète")}
            aria-label={tr("Copier l'empreinte SHA-256 complète")}
          >
            {copiedHash ? <Check size={10} aria-hidden="true" /> : <Copy size={10} aria-hidden="true" />}
          </button>
        )}
      </div>

      {/* 4. Checkable Available Tools */}
      <div className="ingestion-tools-box">
        <div className="ingestion-section-caption">
          <Wrench size={11} aria-hidden="true" />
          <span>{tr('Outils disponibles')}</span>
          <span className="ingestion-tools-count font-mono">
            ({selectedPlugins.length}/{taxonomy.plugins.length})
          </span>
        </div>
        <div className="ingestion-tools-checklist" role="group" aria-label={tr('Outils disponibles')}>
          {taxonomy.plugins.map((plugin) => {
            const checked = selectedPlugins.includes(plugin.id);
            return (
              <label key={plugin.id} className="ingestion-tool-check-row" title={tr(plugin.descriptionFr)}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleTogglePlugin(plugin.id)}
                />
                <span className="ingestion-tool-name">
                  <bdi dir="ltr">{plugin.name}</bdi>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. Three Compact Mode Buttons with Info Hover & Pinion Process Tree Controls */}
      <div className="ingestion-modes-compact" role="group" aria-label={tr("Modes d'investigation disponibles")}>
        {INGESTION_MODES.map((modeSpec) => {
          const isSelected = activeMode === modeSpec.key;
          const phaseNum = modeSpec.targetPhase.replace('Phase ', '');
          const supportsTree = modeSpec.key === 'step_by_step' || modeSpec.key === 'recursive';
          const isEditingThisTree = editingTreeMode === modeSpec.key;
          const isLive = isIngestionModeLive(modeSpec.key, fileName, mimeType);

          return (
            <div key={modeSpec.key} className={`ingestion-mode-row ${isSelected ? 'is-selected' : ''}`}>
              <button
                type="button"
                aria-disabled={isLive ? undefined : 'true'}
                className={`btn btn-sm ingestion-mode-launch-btn ${
                  isLive ? 'btn-primary is-live-phase' : 'btn-secondary is-future-phase'
                }`}
                onClick={() => {
                  onLaunchMode(node.id, modeSpec.key, tr(modeSpec.stageFr), selectedPlugins);
                  if (!isLive) {
                    onTriggerPhaseNotice(tr(modeSpec.shortTitleFr), modeSpec.targetPhase);
                  }
                }}
              >
                {renderModeIcon(modeSpec.iconName)}
                <span className="ingestion-mode-btn-label">{tr(modeSpec.shortTitleFr)}</span>
                <span className="phase-badge">
                  {isLive ? tr('Actif') : tr('Phase {n}', { n: phaseNum })}
                </span>
              </button>

              <div className="ingestion-mode-tools-right">
                <div className="ingestion-info-wrap">
                  <button
                    type="button"
                    className="ingestion-icon-circle-btn"
                    title={tr(modeSpec.subtitleFr)}
                    aria-label={`${tr(modeSpec.shortTitleFr)} — ${tr(modeSpec.descriptionFr)}`}
                  >
                    <Info size={13} aria-hidden="true" />
                  </button>
                  <div className="ingestion-info-tooltip" role="tooltip">
                    <strong>{tr(modeSpec.subtitleFr)}</strong>
                    <span>{tr(modeSpec.descriptionFr)}</span>
                  </div>
                </div>

                {supportsTree ? (
                  <button
                    type="button"
                    className={`ingestion-icon-circle-btn ingestion-gear-btn ${isEditingThisTree ? 'is-active' : ''}`}
                    title={tr("Configurer l'arbre des processus")}
                    aria-label={tr("Configurer l'arbre des processus")}
                    aria-expanded={isEditingThisTree}
                    onClick={() => handleOpenTreeEditor(modeSpec.key as 'step_by_step' | 'recursive')}
                  >
                    <Settings size={13} aria-hidden="true" />
                  </button>
                ) : (
                  <span className="ingestion-icon-slot-spacer" aria-hidden="true" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Isolate to validate extracted candidates (Phase 2A) */}
      {onIsolateNode && pendingCandidatesCount > 0 && (
        <div className="ingestion-isolate-cta">
          <button
            type="button"
            className="btn btn-primary btn-sm ingestion-isolate-btn"
            onClick={() => {
              onIsolateNode(node.id);
              onClose();
            }}
          >
            <GitFork size={13} aria-hidden="true" />
            <span>{tr('Isoler pour valider ({n})', { n: pendingCandidatesCount })}</span>
          </button>
        </div>
      )}

      {/* 6. Interactive Process Tree Editor (opened via Pinion icon) */}
      {editingTreeMode && (
        <div className="ingestion-tree-editor" role="region" aria-label={tr('Arbre des processus')}>
          <div className="ingestion-tree-header">
            <span className="ingestion-section-caption">
              <GitFork size={11} aria-hidden="true" />
              <span>
                {tr('Arbre des processus')} (
                {editingTreeMode === 'step_by_step' ? tr('Analyse Complète') : tr('Analyse Autonome')})
              </span>
            </span>
            <button
              type="button"
              className="btn btn-primary btn-xs"
              onClick={handleSaveTree}
            >
              {treeSavedBadge ? tr('Enregistré') : tr("Enregistrer l'arbre")}
            </button>
          </div>

          <div className="ingestion-tree-steps">
            {processTreeSteps.map((step, index) => (
              <div key={step.id} className="ingestion-tree-step">
                <label className="ingestion-tree-step-check">
                  <input
                    type="checkbox"
                    checked={step.enabled}
                    onChange={() => {
                      setProcessTreeSteps((prev) =>
                        prev.map((s) => (s.id === step.id ? { ...s, enabled: !s.enabled } : s))
                      );
                    }}
                  />
                  <span className="ingestion-tree-step-index font-mono">{index + 1}.</span>
                  <span>{tr(step.labelFr)}</span>
                </label>

                <label className="ingestion-tree-gate-toggle" title={tr('Validation humaine requise')}>
                  <input
                    type="checkbox"
                    checked={step.requiresValidation}
                    onChange={() => {
                      setProcessTreeSteps((prev) =>
                        prev.map((s) =>
                          s.id === step.id ? { ...s, requiresValidation: !s.requiresValidation } : s
                        )
                      );
                    }}
                  />
                  <span>{tr('Pause validation')}</span>
                </label>
              </div>
            ))}
          </div>

          <div className="ingestion-tree-add-row">
            <input
              type="text"
              className="input input-sm ingestion-tree-add-input"
              value={customStepText}
              onChange={(e) => setCustomStepText(e.target.value)}
              placeholder={tr('Ajouter une étape personnalisée')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomStep();
                }
              }}
            />
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={handleAddCustomStep}
              aria-label={tr('Ajouter une étape personnalisée')}
            >
              <Plus size={12} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
