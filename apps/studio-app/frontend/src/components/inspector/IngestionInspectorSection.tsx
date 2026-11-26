import React, { useState } from 'react';
import {
  Check,
  Clock,
  Copy,
  Cpu,
  ExternalLink,
  Eye,
  GitFork,
  ListChecks,
  Lock,
  Play,
  ScanSearch,
  Settings,
  SlidersHorizontal,
  Zap,
} from 'lucide-react';
import type { AnalysisMode, GraphNode, InvestigationStatus } from '../../types/graph';
import {
  INGESTION_MODES,
  classifyFileTaxonomy,
  formatByteSize,
  isIngestionModeLive,
  truncateSha256,
} from '../../utils/fileIngestion';
import {
  getLocalFileEntry,
  openLocalFileInNewTab,
  type LocalFileEntry,
} from '../../utils/localFileStore';
import { useI18n } from '../../context/I18nContext';

export interface IngestionInspectorSectionProps {
  node: GraphNode;
  isLoading?: boolean;
  onLaunchMode: (
    nodeId: string,
    mode: AnalysisMode,
    stageLabel: string,
    selectedPlugins: string[]
  ) => void;
  onCompleteAnalysis?: (nodeId: string) => void;
  onIsolateNode?: (nodeId: string) => void;
  onOpenPopover: (nodeId: string) => void;
  onPreviewFile?: (entry: LocalFileEntry) => void;
  onTriggerPhaseNotice?: (featureName: string, targetPhase: string) => void;
}

function resolveStatusLabelFr(status: InvestigationStatus): string {
  if (status === 'active_investigation') return "En cours d'investigation";
  if (status === 'saturated') return 'Saturation terminée';
  return "En attente d'analyse";
}

export const IngestionInspectorSection: React.FC<IngestionInspectorSectionProps> = ({
  node,
  isLoading = false,
  onLaunchMode,
  onCompleteAnalysis,
  onIsolateNode,
  onOpenPopover,
  onPreviewFile,
  onTriggerPhaseNotice,
}) => {
  const { tr } = useI18n();
  const [copied, setCopied] = useState(false);

  const props = node.properties || {};
  const isEvidenceNode =
    Boolean(props.is_raw_evidence) ||
    node.type === 'scelle_numerique' ||
    node.type === 'piece_a_conviction' ||
    typeof props.client_sha256 === 'string' ||
    typeof props.investigation_status === 'string';

  if (!isEvidenceNode) return null;

  const fileName = String(props.file_name || node.label || 'piece_brute');
  const mimeType = String(props.mime_type || 'application/octet-stream');
  const byteSize = typeof props.file_size_bytes === 'number' ? props.file_size_bytes : 0;
  const sha256 = String(props.client_sha256 || '');
  const status: InvestigationStatus =
    props.investigation_status === 'active_investigation' || props.investigation_status === 'saturated'
      ? (props.investigation_status as InvestigationStatus)
      : 'pending_analysis';
  const analysisMode =
    typeof props.analysis_mode === 'string' ? (props.analysis_mode as AnalysisMode) : null;
  const progressRaw = typeof props.analysis_progress === 'number' ? props.analysis_progress : 0;
  const progress = Math.max(0, Math.min(100, Math.round(progressRaw)));
  const analysisStage = String(
    props.analysis_stage || tr("En attente du choix de mode par l'enquêteur")
  );
  const taxonomy = classifyFileTaxonomy(fileName, mimeType);
  const selectedPluginIds = Array.isArray(props.selected_plugins)
    ? (props.selected_plugins as string[])
    : taxonomy.plugins.map((p) => p.id);
  const pendingCandidatesCount =
    typeof props.pending_candidates_count === 'number' ? props.pending_candidates_count : 0;
  const localEntry = getLocalFileEntry(node.id, sha256);

  const handleCopySha = () => {
    if (!sha256) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(sha256).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      className="ingestion-inspector-section"
      aria-label={tr("Pipeline d'investigation & Scellé numérique")}
    >
      <div className="ingestion-inspector-header">
        <div className="ingestion-inspector-heading">
          <ScanSearch size={13} aria-hidden="true" />
          <span>{tr("Pipeline d'Investigation SPI")}</span>
        </div>
        <span
          className={`ingestion-status-pill ${
            status === 'active_investigation'
              ? 'is-active'
              : status === 'saturated'
                ? 'is-saturated'
                : 'is-pending'
          }`}
        >
          <Clock size={10} aria-hidden="true" />
          <span>{tr(resolveStatusLabelFr(status))}</span>
        </span>
      </div>

      {/* Inline File Preview & External Open Actions */}
      {localEntry && (
        <div className="ingestion-inspector-media-preview">
          {taxonomy.family === 'image' && localEntry.blobUrl && (
            <img className="ingestion-inspector-thumb" src={localEntry.blobUrl} alt={fileName} />
          )}
          {taxonomy.family === 'audio' && localEntry.blobUrl && (
            <audio className="ingestion-inspector-audio" controls src={localEntry.blobUrl} />
          )}
          {taxonomy.family === 'video' && localEntry.blobUrl && (
            <video className="ingestion-inspector-video" controls src={localEntry.blobUrl} />
          )}
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
        </div>
      )}

      {/* Native Accessible ProgressBar & 3-Stage Stepper */}
      <div className="ingestion-progress-block">
        <div className="ingestion-progress-label-row">
          <span className="ingestion-progress-stage">
            {isLoading ? tr('Analyse en cours...') : analysisStage}
          </span>
          <bdi dir="ltr" className="ingestion-progress-pct">
            {progress}%
          </bdi>
        </div>
        <progress
          className={`ingestion-progress-native ${
            progress >= 100 ? 'is-complete' : progress > 0 ? 'is-running' : ''
          }`}
          role="progressbar"
          value={progress}
          max={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label={tr("Progression de l'analyse forensique")}
        />
        {(analysisMode === 'step_by_step' || (progress > 0 && progress < 100)) && (
          <div className="ingestion-stepper-row">
            {[
              { step: 1, threshold: 33, label: tr('Méta & Images') },
              { step: 2, threshold: 66, label: tr('Texte & Regex') },
              { step: 3, threshold: 100, label: tr('NER & Entités') },
            ].map((item) => {
              const isDone = progress >= item.threshold;
              const isCurrent =
                !isDone &&
                ((item.step === 1 && progress > 0) ||
                  (item.step === 2 && progress >= 33 && progress < 66) ||
                  (item.step === 3 && progress >= 66 && progress < 100));
              return (
                <span
                  key={item.step}
                  className={`ingestion-step-pill ${
                    isDone ? 'is-done' : isCurrent ? 'is-current' : ''
                  }`}
                >
                  {isDone ? <Check size={10} aria-hidden="true" /> : <span>{item.step}.</span>}
                  <span>{item.label}</span>
                </span>
              );
            })}
          </div>
        )}
        {status === 'active_investigation' &&
          progress > 0 &&
          progress < 100 &&
          isIngestionModeLive('step_by_step', fileName, mimeType) && (
            <button
              type="button"
              className="btn btn-primary btn-xs ingestion-resume-btn"
              disabled={isLoading}
              onClick={() => {
                if (onCompleteAnalysis) {
                  onCompleteAnalysis(node.id);
                } else {
                  onLaunchMode(
                    node.id,
                    'step_by_step',
                    tr('Analyse Complète'),
                    selectedPluginIds
                  );
                }
              }}
            >
              <Play size={11} aria-hidden="true" />
              <span>
                {isLoading ? tr('Analyse en cours...') : tr("Finaliser l'analyse (100%)")}
              </span>
            </button>
          )}
      </div>

      {/* Pre-seal File Identity & SHA-256 */}
      {(sha256 || byteSize > 0) && (
        <div className="ingestion-inspector-hash-box">
          <div className="ingestion-seal-row">
            <Lock size={11} aria-hidden="true" />
            <span className="ingestion-seal-label">{tr('Empreinte SHA-256 locale')}</span>
            {sha256 && (
              <button
                type="button"
                className="ingestion-copy-hash-btn"
                onClick={handleCopySha}
                title={tr("Copier l'empreinte SHA-256 complète")}
                aria-label={tr("Copier l'empreinte SHA-256 complète")}
              >
                {copied ? <Check size={10} aria-hidden="true" /> : <Copy size={10} aria-hidden="true" />}
                <span>{copied ? tr('Copié') : tr('Copier')}</span>
              </button>
            )}
          </div>
          {sha256 && (
            <code className="ingestion-hash-code" title={sha256}>
              <bdi dir="ltr">{truncateSha256(sha256)}</bdi>
            </code>
          )}
          <div className="ingestion-file-facts">
            <span className="ingestion-taxonomy-pill">{tr(taxonomy.labelFr)}</span>
            <bdi dir="ltr" className="ingestion-meta-mono">
              {formatByteSize(byteSize)} · {mimeType}
            </bdi>
          </div>
        </div>
      )}

      {/* Mode Switcher & Launch Controls (Decision D10) */}
      <div className="ingestion-inspector-modes">
        <div className="ingestion-section-caption">
          <SlidersHorizontal size={11} aria-hidden="true" />
          <span>{tr("Changer ou lancer un mode d'analyse")}</span>
        </div>
        <div className="ingestion-inspector-mode-grid ingestion-inspector-mode-grid--two">
          {INGESTION_MODES.map((modeSpec) => {
            const isSelected = analysisMode === modeSpec.key;
            const phaseNum = modeSpec.targetPhase.replace('Phase ', '');
            const isLive = isIngestionModeLive(modeSpec.key, fileName, mimeType);
            const isFullWidth = modeSpec.key === 'recursive';
            return (
              <button
                key={modeSpec.key}
                type="button"
                aria-disabled={isLive ? undefined : 'true'}
                disabled={isLoading && isLive}
                className={`ingestion-inspector-mode-btn ${
                  isLive ? 'is-live-phase' : 'is-future-phase'
                } ${isSelected ? 'is-selected' : ''} ${
                  isFullWidth ? 'is-full-span' : ''
                }`}
                title={tr(modeSpec.descriptionFr)}
                onClick={() => {
                  onLaunchMode(node.id, modeSpec.key, tr(modeSpec.stageFr), selectedPluginIds);
                  if (!isLive) {
                    onTriggerPhaseNotice?.(tr(modeSpec.shortTitleFr), modeSpec.targetPhase);
                  }
                }}
              >
                <span className="ingestion-inspector-mode-left">
                  {modeSpec.iconName === 'zap' ? (
                    <Zap size={12} aria-hidden="true" />
                  ) : modeSpec.iconName === 'list-checks' ? (
                    <ListChecks size={12} aria-hidden="true" />
                  ) : (
                    <Cpu size={12} aria-hidden="true" />
                  )}
                  <span>{tr(modeSpec.shortTitleFr)}</span>
                </span>
                <span className="phase-badge">
                  {isLive ? tr('Actif') : tr('Phase {n}', { n: phaseNum })}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {onIsolateNode && pendingCandidatesCount > 0 && (
        <button
          type="button"
          className="btn btn-primary btn-sm ingestion-isolate-btn"
          onClick={() => onIsolateNode(node.id)}
        >
          <GitFork size={13} aria-hidden="true" />
          <span>{tr('Isoler pour valider ({n})', { n: pendingCandidatesCount })}</span>
        </button>
      )}

      {/* Selected tools summary + Open Selector / Tree Popover action */}
      <div className="ingestion-inspector-footer">
        <div className="ingestion-plugins-chips">
          {taxonomy.plugins
            .filter((p) => {
              if (!selectedPluginIds.includes(p.id)) return false;
              if (mimeType === 'application/pdf' && p.id === 'python-docx') return false;
              if (fileName.toLowerCase().endsWith('.docx') && p.id === 'pymupdf') return false;
              return true;
            })
            .slice(0, 4)
            .map((plugin) => (
              <span key={plugin.id} className="ingestion-plugin-chip" title={tr(plugin.descriptionFr)}>
                <bdi dir="ltr">{plugin.name}</bdi>
              </span>
            ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm ingestion-reopen-popover-btn"
          onClick={() => onOpenPopover(node.id)}
        >
          <Settings size={12} aria-hidden="true" />
          <span>{tr("Ouvrir le sélecteur d'analyse")}</span>
        </button>
      </div>
    </section>
  );
};
