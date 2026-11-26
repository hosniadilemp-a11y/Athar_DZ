import React, { useMemo, useState } from 'react';
import {
  Check,
  CheckCheck,
  Database,
  FileSearch,
  GitMerge,
  Layers,
  Play,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import type { ExtractedCandidate } from '../../types/ingestion';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;

export interface CandidateValidationPanelProps {
  sourceNodeId: string;
}

export const CandidateValidationPanel: React.FC<CandidateValidationPanelProps> = ({
  sourceNodeId,
}) => {
  const {
    nodes,
    extractionRunsByNodeId,
    candidatesByNodeId,
    extractionLoadingNodeId,
    selectedCandidateId,
    selectCandidate,
    advancePdfStage,
    validateCandidates,
  } = useGraphStore();
  const { tr, locale } = useI18n();
  const toast = useToast();

  const latestRun = extractionRunsByNodeId[sourceNodeId] ?? null;
  const candidates = useMemo(
    () => candidatesByNodeId[sourceNodeId] ?? [],
    [candidatesByNodeId, sourceNodeId]
  );
  const isBusy = extractionLoadingNodeId === sourceNodeId;

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [confirmBulkAction, setConfirmBulkAction] = useState<'validate' | 'reject' | null>(null);

  const pendingCandidates = useMemo(
    () => candidates.filter((c) => c.validation_status === 'PENDING'),
    [candidates]
  );
  const readyForBlackboardCount = useMemo(
    () => candidates.filter((c) => c.blackboard_sync_status === 'READY_FOR_BLACKBOARD').length,
    [candidates]
  );

  const groupedPending = useMemo(() => {
    const groups = new Map<string, ExtractedCandidate[]>();
    pendingCandidates.forEach((c) => {
      const list = groups.get(c.entity_type) ?? [];
      list.push(c);
      groups.set(c.entity_type, list);
    });
    return Array.from(groups.entries());
  }, [pendingCandidates]);

  if (!latestRun && candidates.length === 0) {
    return null;
  }

  const allPendingSelected =
    pendingCandidates.length > 0 && pendingCandidates.every((c) => checkedIds.has(c.id));

  const selectedPendingIds = pendingCandidates
    .filter((c) => checkedIds.has(c.id))
    .map((c) => c.id);

  const toggleSelectAll = () => {
    setConfirmBulkAction(null);
    if (allPendingSelected) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(pendingCandidates.map((c) => c.id)));
    }
  };

  const toggleOne = (id: string) => {
    setConfirmBulkAction(null);
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getTypeLabel = (entityType: string): string => {
    const def = registry.node_types?.[entityType];
    if (!def) return entityType;
    if (locale === 'ar') return def.label_ar || def.label_fr;
    if (locale === 'en') return def.label_en || def.label_fr;
    return def.label_fr;
  };

  const handleSingleAction = async (
    candidateId: string,
    action: 'validate' | 'merge' | 'reject'
  ) => {
    try {
      const count = await validateCandidates(sourceNodeId, {
        action,
        candidate_ids: [candidateId],
      });
      setCheckedIds((prev) => {
        const next = new Set(prev);
        next.delete(candidateId);
        return next;
      });
      if (count > 0) {
        toast.success(
          action === 'reject'
            ? tr('Indice écarté')
            : action === 'merge'
              ? tr('Indice fusionné avec le nœud existant')
              : tr('Entité validée et ajoutée au graphe'),
          tr('Validation isolée')
        );
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr('Erreur de validation'), tr('Validation'));
    }
  };

  const handleBulkConfirm = async () => {
    if (!confirmBulkAction || selectedPendingIds.length === 0) return;
    const action = confirmBulkAction;
    try {
      const count = await validateCandidates(sourceNodeId, {
        action,
        candidate_ids: selectedPendingIds,
      });
      setCheckedIds(new Set());
      setConfirmBulkAction(null);
      toast.success(
        action === 'validate'
          ? tr('{n} entité(s) validée(s) et reliée(s) à la pièce', { n: count })
          : tr('{n} candidat(s) écarté(s)', { n: count }),
        tr('Validation groupée')
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr('Erreur de validation'), tr('Validation'));
    }
  };

  const handleNextStage = async () => {
    if (!latestRun) return;
    try {
      await advancePdfStage(sourceNodeId, latestRun.id);
      toast.success(tr('Étape suivante exécutée'), tr('Extraction'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr('Erreur extraction'), tr('Extraction'));
    }
  };

  return (
    <section
      className="candidate-validation-panel"
      aria-label={tr('Validation des entités extraites')}
    >
      <div className="candidate-validation-header">
        <div className="candidate-validation-title">
          <FileSearch size={14} aria-hidden="true" />
          <span>{tr('Indices extraits à valider')}</span>
        </div>
        <span className="chip chip-neutral font-mono">
          {pendingCandidates.length} / {candidates.length}
        </span>
      </div>

      {/* Mode 2 Step-by-Step Progress & Next Stage Control */}
      {latestRun && latestRun.mode === 'step_by_step' && (
        <div className="candidate-stage-stepper">
          <div className="candidate-stage-meta">
            <Layers size={12} aria-hidden="true" />
            <span>
              {tr('Mode 2 : Étape {c}/{t}', {
                c: latestRun.current_stage,
                t: latestRun.total_stages,
              })}
            </span>
          </div>
          {latestRun.status === 'WAITING_HUMAN' && (
            <button
              type="button"
              className="btn btn-primary btn-xs"
              disabled={isBusy}
              onClick={() => void handleNextStage()}
            >
              <Play size={11} aria-hidden="true" />
              <span>{tr("Exécuter l'étape suivante")}</span>
            </button>
          )}
        </div>
      )}

      {/* Bulk Select-All & Batch Actions */}
      {pendingCandidates.length > 0 && (
        <div className="candidate-bulk-bar">
          <label className="candidate-select-all-label">
            <input
              type="checkbox"
              checked={allPendingSelected}
              onChange={toggleSelectAll}
              disabled={isBusy}
            />
            <span>{tr('Tout sélectionner')}</span>
          </label>

          {selectedPendingIds.length > 0 && (
            <div className="candidate-bulk-actions">
              <button
                type="button"
                className="btn btn-primary btn-xs"
                disabled={isBusy}
                onClick={() => setConfirmBulkAction('validate')}
              >
                <CheckCheck size={12} aria-hidden="true" />
                <span>{tr('Valider la sélection ({n})', { n: selectedPendingIds.length })}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                disabled={isBusy}
                onClick={() => setConfirmBulkAction('reject')}
              >
                <Trash2 size={12} aria-hidden="true" />
                <span>{tr('Écarter')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {confirmBulkAction && selectedPendingIds.length > 0 && (
        <div className="candidate-bulk-confirm" role="alert">
          <span>
            {confirmBulkAction === 'validate'
              ? tr("Confirmer l'ajout de {n} entité(s) au graphe d'enquête ?", {
                  n: selectedPendingIds.length,
                })
              : tr('Confirmer le rejet de {n} candidat(s) ?', {
                  n: selectedPendingIds.length,
                })}
          </span>
          <div className="candidate-bulk-confirm-btns">
            <button
              type="button"
              className="btn btn-primary btn-xs"
              disabled={isBusy}
              onClick={() => void handleBulkConfirm()}
            >
              {tr('Confirmer')}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setConfirmBulkAction(null)}
            >
              {tr('Annuler')}
            </button>
          </div>
        </div>
      )}

      {/* Pending Candidates Grouped by Entity Type */}
      {pendingCandidates.length === 0 ? (
        <div className="candidate-empty-note">
          <Sparkles size={13} aria-hidden="true" />
          <span>{tr('Tous les candidats extraits ont été arbitrés.')}</span>
        </div>
      ) : (
        <div className="candidate-groups-list">
          {groupedPending.map(([entityType, items]) => (
            <div key={entityType} className="candidate-group-block">
              <div className="candidate-group-title">
                <span>{getTypeLabel(entityType)}</span>
                <span className="font-mono">({items.length})</span>
              </div>

              {items.map((cand) => {
                const isSelected = selectedCandidateId === cand.id;
                const matchedNode = cand.matched_existing_node_id
                  ? nodes.find((n) => n.id === cand.matched_existing_node_id)
                  : null;

                return (
                  <div
                    key={cand.id}
                    className={`candidate-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => selectCandidate(cand.id)}
                  >
                    <div className="candidate-card-top">
                      <label
                        className="candidate-card-check"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={checkedIds.has(cand.id)}
                          onChange={() => toggleOne(cand.id)}
                          disabled={isBusy}
                          aria-label={cand.label}
                        />
                        <strong className="candidate-card-label">
                          <bdi dir="ltr">{cand.label}</bdi>
                        </strong>
                      </label>
                      <span className="chip chip-neutral font-mono">
                        {Math.round(cand.confidence * 100)}%
                      </span>
                    </div>

                    <div className="candidate-card-meta font-mono">
                      <span>{cand.source_locator || `p.${cand.source_page}`}</span>
                      <span>·</span>
                      <span>{cand.extractor_tool}</span>
                      <span>·</span>
                      <span>{cand.suggested_layer}</span>
                    </div>

                    {cand.quote_snippet && (
                      <div className="candidate-card-quote">“{cand.quote_snippet}”</div>
                    )}

                    {matchedNode && (
                      <div className="candidate-match-hint">
                        <GitMerge size={11} aria-hidden="true" />
                        <span>
                          {tr('Doublon potentiel : {name}', { name: matchedNode.label })}
                        </span>
                      </div>
                    )}

                    <div className="candidate-card-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="btn btn-primary btn-xs"
                        disabled={isBusy}
                        onClick={() => void handleSingleAction(cand.id, 'validate')}
                      >
                        <Check size={11} aria-hidden="true" />
                        <span>{tr('Valider')}</span>
                      </button>
                      {cand.matched_existing_node_id && (
                        <button
                          type="button"
                          className="btn btn-secondary btn-xs"
                          disabled={isBusy}
                          onClick={() => void handleSingleAction(cand.id, 'merge')}
                        >
                          <GitMerge size={11} aria-hidden="true" />
                          <span>{tr('Fusionner')}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        disabled={isBusy}
                        onClick={() => void handleSingleAction(cand.id, 'reject')}
                      >
                        <Trash2 size={11} aria-hidden="true" />
                        <span>{tr('Écarter')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Blackboard Readiness Summary */}
      <div className="candidate-blackboard-footer font-mono">
        <Database size={11} aria-hidden="true" />
        <span>
          {tr('{n} indice(s) prêt(s) pour publication Blackboard (Phase 2B)', {
            n: readyForBlackboardCount,
          })}
        </span>
      </div>
    </section>
  );
};
