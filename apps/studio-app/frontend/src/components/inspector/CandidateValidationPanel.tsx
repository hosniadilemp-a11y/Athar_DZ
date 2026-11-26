import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  CheckCheck,
  ChevronDown,
  ChevronRight,
  Database,
  FileSearch,
  Filter,
  GitBranch,
  GitMerge,
  Layers,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';
import {
  useGraphStore,
  ONTOLOGY_CATEGORY_COLORS,
  NODE_TYPE_TO_CATEGORY,
  type OntologyCategory,
} from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import { findMatchedExistingNode } from '../../utils/candidateMatching';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import {
  EDGE_CATEGORY_LABELS,
  getEdgeCategory,
  getRelationLabel,
  type EdgeCategory,
} from '../../i18n/phrases/relations';
import type { ExtractedCandidate, ExtractedRelation } from '../../types/ingestion';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';

const registry = registryDataRaw as unknown as RegistryData;
const EXCLUDED_TERRITORY_ADMIN_TYPES = new Set([
  'wilaya',
  'daira',
  'commune',
  'unite',
  'affaire',
  'magistrat',
]);

const CATEGORY_FILTER_ORDER: OntologyCategory[] = [
  'acteurs',
  'telecoms',
  'finances',
  'socmint',
  'cyber',
  'territoire',
  'biometrie',
  'preuve',
];

const CATEGORY_LABELS: Record<OntologyCategory, string> = {
  acteurs: 'Acteurs',
  telecoms: 'Télécoms',
  finances: 'Finances',
  socmint: 'SOCMINT',
  cyber: 'Cyber',
  territoire: 'Territoire',
  biometrie: 'Biométrie',
  preuve: 'Preuve',
};

const RELATION_CATEGORY_ORDER: EdgeCategory[] = [
  'telecom',
  'finance',
  'socmint',
  'legal',
  'general',
];

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
    relationsByNodeId,
    extractionLoadingNodeId,
    selectedCandidateId,
    selectCandidate,
    advancePdfStage,
    validateCandidates,
    updateExtractedCandidate,
    updateExtractedRelation,
    deleteExtractedRelation,
    validateRelations,
  } = useGraphStore();
  const { tr, locale } = useI18n();
  const toast = useToast();

  const latestRun = extractionRunsByNodeId[sourceNodeId] ?? null;
  const candidates = useMemo(
    () => candidatesByNodeId[sourceNodeId] ?? [],
    [candidatesByNodeId, sourceNodeId]
  );
  const relations = useMemo(
    () => relationsByNodeId[sourceNodeId] ?? [],
    [relationsByNodeId, sourceNodeId]
  );
  const isBusy = extractionLoadingNodeId === sourceNodeId;

  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [checkedRelIds, setCheckedRelIds] = useState<Set<string>>(new Set());
  const [editingRelId, setEditingRelId] = useState<string | null>(null);
  const [editRelType, setEditRelType] = useState('');
  const [editRelLayer, setEditRelLayer] = useState('HYPOTHESIS');
  const [editRelConf, setEditRelConf] = useState(1.0);
  const [confirmBulkAction, setConfirmBulkAction] = useState<'validate' | 'reject' | null>(null);
  const [confirmRelBulkAction, setConfirmRelBulkAction] = useState<'validate' | 'reject' | null>(null);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<Set<OntologyCategory>>(new Set());
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<Set<string>>(new Set());
  const [selectedRelCategoryFilters, setSelectedRelCategoryFilters] = useState<Set<EdgeCategory>>(new Set());
  const [selectedRelTypeFilters, setSelectedRelTypeFilters] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [expandedCandidates, setExpandedCandidates] = useState<Record<string, boolean>>({});
  const [expandedRelGroups, setExpandedRelGroups] = useState<Record<string, boolean>>({});
  const [expandedRelations, setExpandedRelations] = useState<Record<string, boolean>>({});
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Full inline editor state for the currently selected candidate
  const selectedCand = useMemo(
    () => candidates.find((c) => c.id === selectedCandidateId && c.validation_status === 'PENDING') ?? null,
    [candidates, selectedCandidateId]
  );
  const [editCandLabel, setEditCandLabel] = useState('');
  const [editCandType, setEditCandType] = useState('personne');
  const [editCandLayer, setEditCandLayer] = useState('OSINT_RAW');
  const [editCandConfidence, setEditCandConfidence] = useState(1.0);
  const [candConfidenceTouched, setCandConfidenceTouched] = useState(false);
  const [editCandAttrs, setEditCandAttrs] = useState<Record<string, string>>({});
  const [newAttrKey, setNewAttrKey] = useState('');
  const [newAttrVal, setNewAttrVal] = useState('');

  useEffect(() => {
    if (!selectedCand) return;
    const hasUserMod = Boolean(selectedCand.attributes?.confidence_user_modified);
    const nextConf = hasUserMod && typeof selectedCand.confidence === 'number' ? selectedCand.confidence : 1.0;
    setEditCandLabel(selectedCand.label || '');
    setEditCandType(selectedCand.entity_type || 'personne');
    setEditCandLayer(nextConf >= 1.0 ? 'VERIFIED' : selectedCand.suggested_layer || 'OSINT_RAW');
    setEditCandConfidence(nextConf);
    setCandConfidenceTouched(false);
    const nextAttrs: Record<string, string> = {};
    Object.entries(selectedCand.attributes || {}).forEach(([k, v]) => {
      if (!k.startsWith('_') && k !== 'confidence_user_modified' && v !== null && v !== undefined) {
        nextAttrs[k] = Array.isArray(v) ? v.join(', ') : String(v);
      }
    });
    setEditCandAttrs(nextAttrs);
    setNewAttrKey('');
    setNewAttrVal('');
    setExpandedGroups((prev) =>
      prev[selectedCand.entity_type] ? prev : { ...prev, [selectedCand.entity_type]: true }
    );
    setExpandedCandidates((prev) =>
      prev[selectedCand.id] ? prev : { ...prev, [selectedCand.id]: true }
    );
    cardRefs.current[selectedCand.id]?.scrollIntoView?.({ block: 'nearest', behavior: 'smooth' });
  }, [selectedCand]);

  const operationalTypes = useMemo(() => {
    return Object.keys(registry.node_types || {}).filter(
      (t) => !EXCLUDED_TERRITORY_ADMIN_TYPES.has(t)
    );
  }, []);

  const pendingCandidates = useMemo(
    () => candidates.filter((c) => c.validation_status === 'PENDING'),
    [candidates]
  );
  const pendingRelations = useMemo(
    () => relations.filter((r) => r.validation_status === 'PENDING'),
    [relations]
  );
  const readyForBlackboardCount = useMemo(
    () =>
      candidates.filter((c) => c.blackboard_sync_status === 'READY_FOR_BLACKBOARD').length +
      relations.filter((r) => r.blackboard_sync_status === 'READY_FOR_BLACKBOARD').length,
    [candidates, relations]
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

  const candidateCategoryCounts = useMemo(() => {
    const counts = new Map<OntologyCategory, number>();
    pendingCandidates.forEach((c) => {
      const cat = NODE_TYPE_TO_CATEGORY[c.entity_type] || 'acteurs';
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    return CATEGORY_FILTER_ORDER.filter((cat) => (counts.get(cat) ?? 0) > 0).map(
      (cat) => [cat, counts.get(cat) ?? 0] as const
    );
  }, [pendingCandidates]);

  const groupedPendingRelations = useMemo(() => {
    const groups = new Map<string, ExtractedRelation[]>();
    pendingRelations.forEach((r) => {
      const list = groups.get(r.relation_type) ?? [];
      list.push(r);
      groups.set(r.relation_type, list);
    });
    return Array.from(groups.entries());
  }, [pendingRelations]);

  const relationCategoryCounts = useMemo(() => {
    const counts = new Map<EdgeCategory, number>();
    pendingRelations.forEach((r) => {
      const cat = getEdgeCategory(r.relation_type);
      counts.set(cat, (counts.get(cat) ?? 0) + 1);
    });
    return RELATION_CATEGORY_ORDER.filter((cat) => (counts.get(cat) ?? 0) > 0).map(
      (cat) => [cat, counts.get(cat) ?? 0] as const
    );
  }, [pendingRelations]);

  if (!latestRun && candidates.length === 0 && relations.length === 0) {
    return null;
  }

  const toggleCategoryFilter = (cat: OntologyCategory) => {
    setSelectedCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      if (next.size > 0) {
        setSelectedTypeFilters((prevTypes) => {
          const filteredTypes = new Set<string>();
          prevTypes.forEach((t) => {
            const typeCat = NODE_TYPE_TO_CATEGORY[t] || 'acteurs';
            if (next.has(typeCat)) filteredTypes.add(t);
          });
          return filteredTypes;
        });
      }
      return next;
    });
  };

  const toggleRelCategoryFilter = (cat: EdgeCategory) => {
    setSelectedRelCategoryFilters((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      if (next.size > 0) {
        setSelectedRelTypeFilters((prevTypes) => {
          const filteredTypes = new Set<string>();
          prevTypes.forEach((rk) => {
            if (next.has(getEdgeCategory(rk))) filteredTypes.add(rk);
          });
          return filteredTypes;
        });
      }
      return next;
    });
  };

  const toggleRelTypeFilter = (relType: string) => {
    setSelectedRelTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(relType)) next.delete(relType);
      else next.add(relType);
      return next;
    });
  };

  const categoryScopedGroups =
    selectedCategoryFilters.size === 0
      ? groupedPending
      : groupedPending.filter(([entityType]) =>
          selectedCategoryFilters.has(NODE_TYPE_TO_CATEGORY[entityType] || 'acteurs')
        );

  const visibleGroups =
    selectedTypeFilters.size === 0
      ? categoryScopedGroups
      : categoryScopedGroups.filter(([entityType]) => selectedTypeFilters.has(entityType));

  const displayedCandidates = visibleGroups.flatMap(([, items]) => items);

  const allPendingSelected =
    displayedCandidates.length > 0 && displayedCandidates.every((c) => checkedIds.has(c.id));

  const selectedPendingIds = pendingCandidates
    .filter((c) => checkedIds.has(c.id))
    .map((c) => c.id);

  const toggleSelectAll = () => {
    setConfirmBulkAction(null);
    if (allPendingSelected) {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        displayedCandidates.forEach((c) => next.delete(c.id));
        return next;
      });
    } else {
      setCheckedIds((prev) => {
        const next = new Set(prev);
        displayedCandidates.forEach((c) => next.add(c.id));
        return next;
      });
    }
  };

  const categoryScopedRelGroups =
    selectedRelCategoryFilters.size === 0
      ? groupedPendingRelations
      : groupedPendingRelations.filter(([relType]) =>
          selectedRelCategoryFilters.has(getEdgeCategory(relType))
        );

  const visibleRelGroups =
    selectedRelTypeFilters.size === 0
      ? categoryScopedRelGroups
      : categoryScopedRelGroups.filter(([relType]) => selectedRelTypeFilters.has(relType));

  const displayedRelations = visibleRelGroups.flatMap(([, items]) => items);

  const allPendingRelsSelected =
    displayedRelations.length > 0 && displayedRelations.every((r) => checkedRelIds.has(r.id));

  const selectedPendingRelIds = pendingRelations
    .filter((r) => checkedRelIds.has(r.id))
    .map((r) => r.id);

  const editingRelation = pendingRelations.find((r) => r.id === editingRelId) ?? null;

  const toggleRelGroupExpanded = (relType: string) => {
    setExpandedRelGroups((prev) => {
      const currentlyExpanded =
        Boolean(prev[relType]) || editingRelation?.relation_type === relType;
      if (currentlyExpanded && editingRelation?.relation_type === relType) {
        setEditingRelId(null);
      }
      return { ...prev, [relType]: !currentlyExpanded };
    });
  };

  const toggleRelCardExpanded = (relId: string) => {
    const currentlyExpanded = Boolean(expandedRelations[relId]) || editingRelId === relId;
    if (currentlyExpanded) {
      setExpandedRelations((prev) => ({ ...prev, [relId]: false }));
      if (editingRelId === relId) {
        setEditingRelId(null);
      }
    } else {
      setExpandedRelations((prev) => ({ ...prev, [relId]: true }));
    }
  };

  const anyRelGroupExpanded = visibleRelGroups.some(
    ([relType]) => Boolean(expandedRelGroups[relType]) || editingRelation?.relation_type === relType
  );

  const handleToggleAllRelGroups = () => {
    if (anyRelGroupExpanded) {
      setExpandedRelGroups({});
      setExpandedRelations({});
      setEditingRelId(null);
      return;
    }
    const nextGroups: Record<string, boolean> = {};
    const nextCards: Record<string, boolean> = {};
    visibleRelGroups.forEach(([relType, items]) => {
      nextGroups[relType] = true;
      items.forEach((r) => {
        nextCards[r.id] = true;
      });
    });
    setExpandedRelGroups(nextGroups);
    setExpandedRelations(nextCards);
  };

  const handleBulkRelConfirm = async () => {
    if (!confirmRelBulkAction || selectedPendingRelIds.length === 0) return;
    const action = confirmRelBulkAction;
    try {
      const count = await validateRelations(sourceNodeId, {
        action,
        relation_ids: selectedPendingRelIds,
      });
      setCheckedRelIds(new Set());
      setConfirmRelBulkAction(null);
      toast.success(
        action === 'validate'
          ? tr('{n} relation(s) validée(s) et ajoutée(s) au graphe', { n: count })
          : tr('{n} relation(s) écartée(s)', { n: count }),
        tr('Relations')
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr('Erreur de validation'), tr('Relations'));
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

  const toggleTypeFilter = (entityType: string) => {
    setSelectedTypeFilters((prev) => {
      const next = new Set(prev);
      if (next.has(entityType)) next.delete(entityType);
      else next.add(entityType);
      return next;
    });
  };

  const toggleGroupExpanded = (entityType: string) => {
    setExpandedGroups((prev) => {
      const currentlyExpanded = Boolean(prev[entityType]) || selectedCand?.entity_type === entityType;
      if (currentlyExpanded && selectedCand?.entity_type === entityType) {
        selectCandidate(null);
      }
      return { ...prev, [entityType]: !currentlyExpanded };
    });
  };

  const toggleCandidateExpanded = (candId: string) => {
    const currentlyExpanded = Boolean(expandedCandidates[candId]) || selectedCandidateId === candId;
    if (currentlyExpanded) {
      setExpandedCandidates((prev) => ({ ...prev, [candId]: false }));
      if (selectedCandidateId === candId) {
        selectCandidate(null);
      }
    } else {
      setExpandedCandidates((prev) => ({ ...prev, [candId]: true }));
      selectCandidate(candId);
    }
  };

  const anyGroupExpanded = visibleGroups.some(
    ([entityType]) => Boolean(expandedGroups[entityType]) || selectedCand?.entity_type === entityType
  );

  const handleToggleAllGroups = () => {
    if (anyGroupExpanded) {
      setExpandedGroups({});
      setExpandedCandidates({});
      selectCandidate(null);
      return;
    }
    const nextGroups: Record<string, boolean> = {};
    const nextCands: Record<string, boolean> = {};
    visibleGroups.forEach(([entityType, items]) => {
      nextGroups[entityType] = true;
      items.forEach((c) => {
        nextCands[c.id] = true;
      });
    });
    setExpandedGroups(nextGroups);
    setExpandedCandidates(nextCands);
  };

  const handleSaveSelectedCandidate = async () => {
    if (!selectedCand) return;
    const cleanAttrs: Record<string, string> = {};
    Object.entries(editCandAttrs).forEach(([k, v]) => {
      const tk = k.trim();
      if (tk && v.trim() !== '') {
        cleanAttrs[tk] = v.trim();
      }
    });
    if (newAttrKey.trim() && newAttrVal.trim()) {
      cleanAttrs[newAttrKey.trim()] = newAttrVal.trim();
    }
    if (candConfidenceTouched || Boolean(selectedCand.attributes?.confidence_user_modified)) {
      cleanAttrs.confidence_user_modified = 'true';
    }
    try {
      await updateExtractedCandidate(sourceNodeId, selectedCand.id, {
        label: editCandLabel.trim() || selectedCand.label,
        entity_type: editCandType,
        suggested_layer: editCandLayer,
        confidence: editCandConfidence,
        attributes: cleanAttrs,
      });
      setNewAttrKey('');
      setNewAttrVal('');
      toast.success(tr('Modifications enregistrées'), tr('Validation'));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr('Erreur de mise à jour'), tr('Validation'));
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

      {/* Entity Category & Type Multi-Filter Pills & Collapse/Expand All */}
      {groupedPending.length > 0 && (
        <div className="candidate-filter-section">
          <div className="candidate-filter-header">
            <span className="candidate-filter-caption">
              <Filter size={11} aria-hidden="true" />
              <span>{tr('Filtrer par type')}</span>
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-xs candidate-collapse-all-btn"
              onClick={handleToggleAllGroups}
            >
              {anyGroupExpanded ? tr('Tout replier') : tr('Tout déplier')}
            </button>
          </div>

          <div className="candidate-filter-row">
            <span className="candidate-filter-sublabel">{tr('Catégories')}</span>
            <div className="candidate-type-filter-bar" role="group" aria-label={tr('Catégories')}>
              <button
                type="button"
                className={`candidate-type-pill ${
                  selectedCategoryFilters.size === 0 && selectedTypeFilters.size === 0 ? 'is-active' : ''
                }`}
                aria-pressed={selectedCategoryFilters.size === 0 && selectedTypeFilters.size === 0}
                onClick={() => {
                  setSelectedCategoryFilters(new Set());
                  setSelectedTypeFilters(new Set());
                }}
              >
                <span>{tr('Tous')}</span>
                <span className="font-mono">{pendingCandidates.length}</span>
              </button>
              {candidateCategoryCounts.map(([catKey, count]) => {
                const catColor = ONTOLOGY_CATEGORY_COLORS[catKey] || '#22c55e';
                const isCatActive = selectedCategoryFilters.has(catKey);
                return (
                  <button
                    key={catKey}
                    type="button"
                    aria-pressed={isCatActive}
                    className={`candidate-type-pill ${isCatActive ? 'is-active' : ''}`}
                    style={{ '--cand-cat-color': catColor } as React.CSSProperties}
                    onClick={() => toggleCategoryFilter(catKey)}
                  >
                    <span className="candidate-cat-dot" aria-hidden="true" />
                    <span>{tr(CATEGORY_LABELS[catKey])}</span>
                    <span className="font-mono">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="candidate-filter-row">
            <span className="candidate-filter-sublabel">{tr('Types')}</span>
            <div className="candidate-type-filter-bar" role="group" aria-label={tr('Filtrer par type')}>
              <button
                type="button"
                className={`candidate-type-pill ${selectedTypeFilters.size === 0 ? 'is-active' : ''}`}
                aria-pressed={selectedTypeFilters.size === 0}
                onClick={() => setSelectedTypeFilters(new Set())}
              >
                <span>{tr('Tous')}</span>
                <span className="font-mono">
                  {categoryScopedGroups.reduce((acc, [, items]) => acc + items.length, 0)}
                </span>
              </button>
              {categoryScopedGroups.map(([entityType, items]) => {
                const catKey = NODE_TYPE_TO_CATEGORY[entityType] || 'acteurs';
                const catColor = ONTOLOGY_CATEGORY_COLORS[catKey] || '#22c55e';
                const iconName = registry.node_types?.[entityType]?.icon || 'help-circle';
                const isFilterActive = selectedTypeFilters.has(entityType);
                return (
                  <button
                    key={entityType}
                    type="button"
                    aria-pressed={isFilterActive}
                    className={`candidate-type-pill ${isFilterActive ? 'is-active' : ''}`}
                    style={{ '--cand-cat-color': catColor } as React.CSSProperties}
                    onClick={() => toggleTypeFilter(entityType)}
                  >
                    <NodeIcon name={iconName} size={12} style={{ color: catColor }} />
                    <span>{getTypeLabel(entityType)}</span>
                    <span className="font-mono">{items.length}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Pending Candidates Grouped by Entity Type (Minimized by Default) */}
      {pendingCandidates.length === 0 ? (
        <div className="candidate-empty-note">
          <Sparkles size={13} aria-hidden="true" />
          <span>{tr('Tous les candidats extraits ont été arbitrés.')}</span>
        </div>
      ) : (
        <div className="candidate-groups-list">
          {visibleGroups.map(([entityType, items]) => {
            const categoryKey = NODE_TYPE_TO_CATEGORY[entityType] || 'acteurs';
            const categoryColor = ONTOLOGY_CATEGORY_COLORS[categoryKey] || '#22c55e';
            const typeDef = registry.node_types?.[entityType];
            const iconName = typeDef?.icon || 'help-circle';
            const isGroupExpanded =
              Boolean(expandedGroups[entityType]) || selectedCand?.entity_type === entityType;
            const dbMatchCount = items.reduce(
              (acc, c) => acc + (findMatchedExistingNode(c, nodes) ? 1 : 0),
              0
            );

            return (
              <div
                key={entityType}
                className={`candidate-group-block ${isGroupExpanded ? 'is-expanded' : 'is-collapsed'}`}
              >
                <button
                  type="button"
                  className="candidate-group-title candidate-group-toggle"
                  aria-expanded={isGroupExpanded}
                  style={{ '--cand-cat-color': categoryColor } as React.CSSProperties}
                  onClick={() => toggleGroupExpanded(entityType)}
                >
                  <div className="candidate-group-title-left">
                    {isGroupExpanded ? (
                      <ChevronDown size={13} aria-hidden="true" />
                    ) : (
                      <ChevronRight size={13} aria-hidden="true" />
                    )}
                    <NodeIcon name={iconName} size={13} style={{ color: categoryColor }} />
                    <span>{getTypeLabel(entityType)}</span>
                  </div>
                  <div className="candidate-group-title-right">
                    {dbMatchCount > 0 && (
                      <span
                        className="candidate-group-dup-pill"
                        title={tr('Déjà en base')}
                      >
                        <GitMerge size={10} aria-hidden="true" />
                        <span>{dbMatchCount}</span>
                      </span>
                    )}
                    <span className="candidate-group-count-pill font-mono">{items.length}</span>
                  </div>
                </button>

                {isGroupExpanded &&
                  items.map((cand) => {
                    const isSelected = selectedCandidateId === cand.id;
                    const isCardExpanded = Boolean(expandedCandidates[cand.id]) || isSelected;
                    const matchedNode = findMatchedExistingNode(cand, nodes);
                    const attrEntries = Object.entries(cand.attributes || {}).filter(
                      ([k, v]) =>
                        !k.startsWith('_') &&
                        v !== null &&
                        v !== undefined &&
                        String(v).trim() !== ''
                    );

                    return (
                      <div
                        key={cand.id}
                        ref={(el) => {
                          cardRefs.current[cand.id] = el;
                        }}
                        className={`candidate-card ${isSelected ? 'is-selected' : ''} ${
                          isCardExpanded ? 'is-expanded' : 'is-minimized'
                        } ${matchedNode ? 'is-db-match' : ''}`}
                        style={{ '--cand-cat-color': categoryColor } as React.CSSProperties}
                      >
                        <div
                          className="candidate-card-top"
                          onClick={() => toggleCandidateExpanded(cand.id)}
                        >
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
                            <NodeIcon name={iconName} size={13} style={{ color: categoryColor }} />
                            <strong className="candidate-card-label">
                              <bdi dir="ltr">{cand.label}</bdi>
                            </strong>
                          </label>
                          <div className="candidate-card-badges">
                            {matchedNode && (
                              <span
                                className="candidate-mini-dup-badge"
                                title={tr('Déjà présent dans la base : {name}', {
                                  name: matchedNode.label,
                                })}
                              >
                                <GitMerge size={10} aria-hidden="true" />
                              </span>
                            )}
                            <span className="chip chip-neutral font-mono">
                              {Math.round(cand.confidence * 100)}%
                            </span>
                            <button
                              type="button"
                              className="candidate-card-expand-btn"
                              aria-expanded={isCardExpanded}
                              aria-label={
                                isCardExpanded ? tr('Tout replier') : tr('Modifier les informations')
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCandidateExpanded(cand.id);
                              }}
                            >
                              {isCardExpanded ? (
                                <ChevronDown size={13} aria-hidden="true" />
                              ) : (
                                <ChevronRight size={13} aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </div>

                        {isCardExpanded && (
                          <div className="candidate-card-body">
                            <div className="candidate-card-meta font-mono">
                              <span>{cand.source_locator || `p.${cand.source_page}`}</span>
                              <span>·</span>
                              <span>{cand.suggested_layer}</span>
                            </div>

                            {(attrEntries.length > 0 ||
                              (cand.normalized_value && cand.normalized_value !== cand.label)) && (
                              <div className="candidate-attrs-grid">
                                {cand.normalized_value && cand.normalized_value !== cand.label && (
                                  <span className="candidate-attr-chip">
                                    <span className="candidate-attr-key">norm:</span>
                                    <span className="candidate-attr-val">
                                      <bdi dir="ltr">{cand.normalized_value}</bdi>
                                    </span>
                                  </span>
                                )}
                                {attrEntries.map(([key, val]) => (
                                  <span key={key} className="candidate-attr-chip">
                                    <span className="candidate-attr-key">
                                      {key.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="candidate-attr-val">
                                      <bdi dir="ltr">
                                        {Array.isArray(val) ? val.join(', ') : String(val)}
                                      </bdi>
                                    </span>
                                  </span>
                                ))}
                              </div>
                            )}

                            {cand.quote_snippet && (
                              <div className="candidate-card-quote">“{cand.quote_snippet}”</div>
                            )}

                            {matchedNode && (
                              <div className="candidate-match-hint is-db-match-badge">
                                <GitMerge size={12} aria-hidden="true" />
                                <span>
                                  {tr('Déjà présent dans la base : {name}', {
                                    name: matchedNode.label,
                                  })}
                                </span>
                              </div>
                            )}

                            {isSelected && (
                              <div
                                className="candidate-edit-form"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="candidate-edit-heading">
                                  <span>{tr('Modifier les informations')}</span>
                                </div>

                                <label className="candidate-edit-field">
                                  <span>{tr('Libellé')}</span>
                                  <input
                                    type="text"
                                    value={editCandLabel}
                                    onChange={(e) => setEditCandLabel(e.target.value)}
                                    disabled={isBusy}
                                  />
                                </label>

                                <div className="candidate-edit-row-two">
                                  <label className="candidate-edit-field">
                                    <span>{tr('Type')}</span>
                                    <select
                                      value={editCandType}
                                      onChange={(e) => setEditCandType(e.target.value)}
                                      disabled={isBusy}
                                    >
                                      {operationalTypes.map((tKey) => (
                                        <option key={tKey} value={tKey}>
                                          {getTypeLabel(tKey)}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label className="candidate-edit-field">
                                    <span>{tr('Calque')}</span>
                                    <select
                                      value={editCandLayer}
                                      onChange={(e) => setEditCandLayer(e.target.value)}
                                      disabled={isBusy}
                                    >
                                      <option value="VERIFIED">VERIFIED</option>
                                      <option value="OSINT_RAW">OSINT_RAW</option>
                                      <option value="INFRA">INFRA</option>
                                      <option value="HYPOTHESIS">HYPOTHESIS</option>
                                      <option value="FLOWS">FLOWS</option>
                                    </select>
                                  </label>
                                </div>

                                <label className="candidate-edit-field">
                                  <span>
                                    {tr('Confiance')} : {Math.round(editCandConfidence * 100)}%
                                  </span>
                                  <input
                                    type="range"
                                    min={0.1}
                                    max={1.0}
                                    step={0.05}
                                    value={editCandConfidence}
                                    onChange={(e) => {
                                      const nextConf = Number(e.target.value);
                                      setEditCandConfidence(nextConf);
                                      setCandConfidenceTouched(true);
                                      if (nextConf >= 1.0) {
                                        setEditCandLayer('VERIFIED');
                                      }
                                    }}
                                    disabled={isBusy}
                                  />
                                </label>

                                {editCandType === 'personne' && (
                                  <label className="candidate-edit-field">
                                    <span>{tr('Statut judiciaire')}</span>
                                    <select
                                      value={editCandAttrs.status_judiciaire || ''}
                                      onChange={(e) =>
                                        setEditCandAttrs((prev) => ({
                                          ...prev,
                                          status_judiciaire: e.target.value,
                                        }))
                                      }
                                      disabled={isBusy}
                                    >
                                      <option value="">—</option>
                                      <option value="Suspect">Suspect</option>
                                      <option value="Victime">Victime</option>
                                      <option value="Complice">Complice</option>
                                      <option value="Prête-nom / Mule">Prête-nom / Mule</option>
                                      <option value="Témoin">Témoin</option>
                                      <option value="Plaignant">Plaignant</option>
                                      <option value="Tiers">Tiers</option>
                                    </select>
                                  </label>
                                )}

                                {Object.entries(editCandAttrs)
                                  .filter(
                                    ([k]) =>
                                      !(editCandType === 'personne' && k === 'status_judiciaire')
                                  )
                                  .map(([k, v]) => (
                                    <label key={k} className="candidate-edit-field">
                                      <span>{k.replace(/_/g, ' ')}</span>
                                      <input
                                        type="text"
                                        value={v}
                                        onChange={(e) => {
                                          const nextV = e.target.value;
                                          setEditCandAttrs((prev) => ({ ...prev, [k]: nextV }));
                                        }}
                                        disabled={isBusy}
                                      />
                                    </label>
                                  ))}

                                <div className="candidate-edit-add-attr">
                                  <input
                                    type="text"
                                    placeholder={tr('Nom du champ')}
                                    value={newAttrKey}
                                    onChange={(e) => setNewAttrKey(e.target.value)}
                                    disabled={isBusy}
                                  />
                                  <input
                                    type="text"
                                    placeholder={tr('Valeur')}
                                    value={newAttrVal}
                                    onChange={(e) => setNewAttrVal(e.target.value)}
                                    disabled={isBusy}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-ghost btn-xs"
                                    disabled={isBusy || !newAttrKey.trim()}
                                    title={tr('Ajouter un attribut')}
                                    onClick={() => {
                                      if (!newAttrKey.trim()) return;
                                      setEditCandAttrs((prev) => ({
                                        ...prev,
                                        [newAttrKey.trim()]: newAttrVal.trim(),
                                      }));
                                      setNewAttrKey('');
                                      setNewAttrVal('');
                                    }}
                                  >
                                    <Plus size={12} aria-hidden="true" />
                                  </button>
                                </div>

                                <button
                                  type="button"
                                  className="btn btn-secondary btn-xs candidate-edit-save-btn"
                                  disabled={isBusy}
                                  onClick={() => void handleSaveSelectedCandidate()}
                                >
                                  <Save size={12} aria-hidden="true" />
                                  <span>{tr('Enregistrer')}</span>
                                </button>
                              </div>
                            )}

                            <div
                              className="candidate-card-actions"
                              onClick={(e) => e.stopPropagation()}
                            >
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
                        )}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      )}

      {/* Detected Semantic Relations — Exact Same UX as Indices extraits à valider */}
      {pendingRelations.length > 0 && (
        <div
          className="candidate-relations-section"
          aria-label={tr('Relations sémantiques détectées')}
        >
          <div className="candidate-validation-header">
            <div className="candidate-validation-title">
              <GitBranch size={14} aria-hidden="true" />
              <span>{tr('Relations sémantiques détectées')}</span>
            </div>
            <span className="chip chip-neutral font-mono">
              {pendingRelations.length} / {relations.length}
            </span>
          </div>

          <div className="candidate-bulk-bar">
            <label className="candidate-select-all-label">
              <input
                type="checkbox"
                checked={allPendingRelsSelected}
                disabled={isBusy}
                onChange={() => {
                  setConfirmRelBulkAction(null);
                  if (allPendingRelsSelected) {
                    setCheckedRelIds((prev) => {
                      const next = new Set(prev);
                      displayedRelations.forEach((r) => next.delete(r.id));
                      return next;
                    });
                  } else {
                    setCheckedRelIds((prev) => {
                      const next = new Set(prev);
                      displayedRelations.forEach((r) => next.add(r.id));
                      return next;
                    });
                  }
                }}
              />
              <span>{tr('Tout sélectionner')}</span>
            </label>

            {selectedPendingRelIds.length > 0 && (
              <div className="candidate-bulk-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  disabled={isBusy}
                  onClick={() => setConfirmRelBulkAction('validate')}
                >
                  <CheckCheck size={12} aria-hidden="true" />
                  <span>{tr('Valider la sélection ({n})', { n: selectedPendingRelIds.length })}</span>
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  disabled={isBusy}
                  onClick={() => setConfirmRelBulkAction('reject')}
                >
                  <Trash2 size={12} aria-hidden="true" />
                  <span>{tr('Écarter')}</span>
                </button>
              </div>
            )}
          </div>

          {confirmRelBulkAction && selectedPendingRelIds.length > 0 && (
            <div className="candidate-bulk-confirm" role="alert">
              <span>
                {confirmRelBulkAction === 'validate'
                  ? tr("Confirmer l'ajout de {n} relation(s) au graphe d'enquête ?", {
                      n: selectedPendingRelIds.length,
                    })
                  : tr('Confirmer le rejet de {n} relation(s) ?', {
                      n: selectedPendingRelIds.length,
                    })}
              </span>
              <div className="candidate-bulk-confirm-btns">
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  disabled={isBusy}
                  onClick={() => void handleBulkRelConfirm()}
                >
                  {tr('Confirmer')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setConfirmRelBulkAction(null)}
                >
                  {tr('Annuler')}
                </button>
              </div>
            </div>
          )}

          {/* Relation Category & Type Filter Bar + Collapse/Expand All */}
          {groupedPendingRelations.length > 0 && (
            <div className="candidate-filter-section">
              <div className="candidate-filter-header">
                <span className="candidate-filter-caption">
                  <Filter size={11} aria-hidden="true" />
                  <span>{tr('Filtrer par type')}</span>
                </span>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs candidate-collapse-all-btn"
                  onClick={handleToggleAllRelGroups}
                >
                  {anyRelGroupExpanded ? tr('Tout replier') : tr('Tout déplier')}
                </button>
              </div>

              <div className="candidate-filter-row">
                <span className="candidate-filter-sublabel">{tr('Catégories')}</span>
                <div className="candidate-type-filter-bar" role="group" aria-label={tr('Catégories')}>
                  <button
                    type="button"
                    className={`candidate-type-pill ${
                      selectedRelCategoryFilters.size === 0 && selectedRelTypeFilters.size === 0
                        ? 'is-active'
                        : ''
                    }`}
                    aria-pressed={
                      selectedRelCategoryFilters.size === 0 && selectedRelTypeFilters.size === 0
                    }
                    onClick={() => {
                      setSelectedRelCategoryFilters(new Set());
                      setSelectedRelTypeFilters(new Set());
                    }}
                  >
                    <span>{tr('Tous')}</span>
                    <span className="font-mono">{pendingRelations.length}</span>
                  </button>
                  {relationCategoryCounts.map(([catKey, count]) => {
                    const meta = EDGE_CATEGORY_LABELS[catKey];
                    const isCatActive = selectedRelCategoryFilters.has(catKey);
                    return (
                      <button
                        key={catKey}
                        type="button"
                        aria-pressed={isCatActive}
                        className={`candidate-type-pill ${isCatActive ? 'is-active' : ''}`}
                        style={{ '--cand-cat-color': meta.color } as React.CSSProperties}
                        onClick={() => toggleRelCategoryFilter(catKey)}
                      >
                        <span className="candidate-cat-dot" aria-hidden="true" />
                        <span>{tr(meta.fr)}</span>
                        <span className="font-mono">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="candidate-filter-row">
                <span className="candidate-filter-sublabel">{tr('Types')}</span>
                <div className="candidate-type-filter-bar" role="group" aria-label={tr('Filtrer par type')}>
                  <button
                    type="button"
                    className={`candidate-type-pill ${selectedRelTypeFilters.size === 0 ? 'is-active' : ''}`}
                    aria-pressed={selectedRelTypeFilters.size === 0}
                    onClick={() => setSelectedRelTypeFilters(new Set())}
                  >
                    <span>{tr('Tous')}</span>
                    <span className="font-mono">
                      {categoryScopedRelGroups.reduce((acc, [, items]) => acc + items.length, 0)}
                    </span>
                  </button>
                  {categoryScopedRelGroups.map(([relType, items]) => {
                    const catColor = EDGE_CATEGORY_LABELS[getEdgeCategory(relType)].color;
                    const isFilterActive = selectedRelTypeFilters.has(relType);
                    return (
                      <button
                        key={relType}
                        type="button"
                        aria-pressed={isFilterActive}
                        className={`candidate-type-pill ${isFilterActive ? 'is-active' : ''}`}
                        style={{ '--cand-cat-color': catColor } as React.CSSProperties}
                        onClick={() => toggleRelTypeFilter(relType)}
                      >
                        <GitBranch size={12} style={{ color: catColor }} aria-hidden="true" />
                        <span>{getRelationLabel(relType, locale) || relType}</span>
                        <span className="font-mono">{items.length}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Pending Relations Grouped by Relation Type (Minimized by Default) */}
          <div className="candidate-groups-list">
            {visibleRelGroups.map(([relType, items]) => {
              const catKey = getEdgeCategory(relType);
              const catColor = EDGE_CATEGORY_LABELS[catKey].color;
              const isGroupExpanded =
                Boolean(expandedRelGroups[relType]) || editingRelation?.relation_type === relType;

              return (
                <div
                  key={relType}
                  className={`candidate-group-block ${isGroupExpanded ? 'is-expanded' : 'is-collapsed'}`}
                >
                  <button
                    type="button"
                    className="candidate-group-title candidate-group-toggle"
                    aria-expanded={isGroupExpanded}
                    style={{ '--cand-cat-color': catColor } as React.CSSProperties}
                    onClick={() => toggleRelGroupExpanded(relType)}
                  >
                    <div className="candidate-group-title-left">
                      {isGroupExpanded ? (
                        <ChevronDown size={13} aria-hidden="true" />
                      ) : (
                        <ChevronRight size={13} aria-hidden="true" />
                      )}
                      <GitBranch size={13} style={{ color: catColor }} aria-hidden="true" />
                      <span>{getRelationLabel(relType, locale) || relType}</span>
                    </div>
                    <div className="candidate-group-title-right">
                      <span className="candidate-group-count-pill font-mono">{items.length}</span>
                    </div>
                  </button>

                  {isGroupExpanded &&
                    items.map((rel) => {
                      const isEditingThisRel = editingRelId === rel.id;
                      const isCardExpanded = Boolean(expandedRelations[rel.id]) || isEditingThisRel;
                      const compatRels = Object.entries(registry.relation_types || {}).filter(
                        ([rk, def]) =>
                          rk === rel.relation_type ||
                          ((def.source_types || []).includes(rel.source_entity_type) &&
                            (def.target_types || []).includes(rel.target_entity_type)) ||
                          (!def.directed &&
                            (def.source_types || []).includes(rel.target_entity_type) &&
                            (def.target_types || []).includes(rel.source_entity_type))
                      );

                      return (
                        <div
                          key={rel.id}
                          className={`candidate-card ${isEditingThisRel ? 'is-selected' : ''} ${
                            isCardExpanded ? 'is-expanded' : 'is-minimized'
                          }`}
                          style={{ '--cand-cat-color': catColor } as React.CSSProperties}
                        >
                          <div
                            className="candidate-card-top"
                            onClick={() => toggleRelCardExpanded(rel.id)}
                          >
                            <label
                              className="candidate-card-check"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={checkedRelIds.has(rel.id)}
                                disabled={isBusy}
                                aria-label={`${rel.source_label} ${rel.relation_type} ${rel.target_label}`}
                                onChange={() => {
                                  setCheckedRelIds((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(rel.id)) next.delete(rel.id);
                                    else next.add(rel.id);
                                    return next;
                                  });
                                }}
                              />
                              <GitBranch size={13} style={{ color: catColor }} aria-hidden="true" />
                              <span className="candidate-card-label">
                                <bdi dir="ltr">{rel.source_label}</bdi>
                                {' → '}
                                <bdi dir="ltr">{rel.target_label}</bdi>
                              </span>
                            </label>
                            <div className="candidate-card-badges">
                              <span className="chip chip-neutral font-mono">
                                {Math.round(rel.confidence * 100)}%
                              </span>
                              <button
                                type="button"
                                className="candidate-card-expand-btn"
                                aria-expanded={isCardExpanded}
                                aria-label={
                                  isCardExpanded ? tr('Tout replier') : tr('Modifier les informations')
                                }
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleRelCardExpanded(rel.id);
                                }}
                              >
                                {isCardExpanded ? (
                                  <ChevronDown size={13} aria-hidden="true" />
                                ) : (
                                  <ChevronRight size={13} aria-hidden="true" />
                                )}
                              </button>
                            </div>
                          </div>

                          {isCardExpanded && (
                            <div className="candidate-card-body">
                              <div className="candidate-rel-triple font-mono">
                                <span>{getRelationLabel(rel.relation_type, locale) || rel.relation_type}</span>
                                <span>({rel.relation_type})</span>
                              </div>

                              <div className="candidate-card-meta font-mono">
                                <span>{rel.source_locator || `p.${rel.source_page}`}</span>
                                <span>·</span>
                                <span>{rel.extractor_tool}</span>
                                <span>·</span>
                                <span>{rel.suggested_layer}</span>
                              </div>

                              {rel.quote_snippet && (
                                <div className="candidate-card-quote">“{rel.quote_snippet}”</div>
                              )}

                              {isEditingThisRel && (
                                <div
                                  className="candidate-edit-form"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="candidate-edit-heading">
                                    <span>{tr('Modifier les informations')}</span>
                                  </div>

                                  <label className="candidate-edit-field">
                                    <span>{tr('Type de Relation')}</span>
                                    <select
                                      value={editRelType}
                                      onChange={(e) => setEditRelType(e.target.value)}
                                      disabled={isBusy}
                                    >
                                      {compatRels.map(([rk, def]) => (
                                        <option key={rk} value={rk}>
                                          {getRelationLabel(rk, locale) || def.label_fr} ({rk})
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <div className="candidate-edit-row-two">
                                    <label className="candidate-edit-field">
                                      <span>{tr('Calque')}</span>
                                      <select
                                        value={editRelLayer}
                                        onChange={(e) => setEditRelLayer(e.target.value)}
                                        disabled={isBusy}
                                      >
                                        <option value="VERIFIED">VERIFIED</option>
                                        <option value="OSINT_RAW">OSINT_RAW</option>
                                        <option value="INFRA">INFRA</option>
                                        <option value="HYPOTHESIS">HYPOTHESIS</option>
                                        <option value="FLOWS">FLOWS</option>
                                      </select>
                                    </label>

                                    <label className="candidate-edit-field">
                                      <span>
                                        {tr('Confiance')} : {Math.round(editRelConf * 100)}%
                                      </span>
                                      <input
                                        type="range"
                                        min={0.1}
                                        max={1.0}
                                        step={0.05}
                                        value={editRelConf}
                                        onChange={(e) => {
                                          const nextConf = Number(e.target.value);
                                          setEditRelConf(nextConf);
                                          if (nextConf >= 1.0) {
                                            setEditRelLayer('VERIFIED');
                                          }
                                        }}
                                        disabled={isBusy}
                                      />
                                    </label>
                                  </div>

                                  <div className="candidate-card-actions">
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-xs"
                                      disabled={isBusy}
                                      onClick={() => {
                                        void updateExtractedRelation(sourceNodeId, rel.id, {
                                          relation_type: editRelType,
                                          suggested_layer: editRelLayer,
                                          confidence: editRelConf,
                                          allow_custom_relation: true,
                                        })
                                          .then(() => {
                                            setEditingRelId(null);
                                            toast.success(tr('Relation mise à jour'), tr('Relations'));
                                          })
                                          .catch((err) =>
                                            toast.error(
                                              err instanceof Error ? err.message : tr('Erreur mise à jour'),
                                              tr('Relations')
                                            )
                                          );
                                      }}
                                    >
                                      <Save size={12} aria-hidden="true" />
                                      <span>{tr('Enregistrer')}</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-xs"
                                      disabled={isBusy}
                                      onClick={() => {
                                        void updateExtractedRelation(sourceNodeId, rel.id, {
                                          swap_direction: true,
                                          allow_custom_relation: true,
                                        })
                                          .then(() => toast.success(tr('Sens inversé'), tr('Relations')))
                                          .catch((err) =>
                                            toast.error(
                                              err instanceof Error ? err.message : tr('Erreur inversion'),
                                              tr('Relations')
                                            )
                                          );
                                      }}
                                    >
                                      <RefreshCw size={12} aria-hidden="true" />
                                      <span>{tr('Inverser')}</span>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-ghost btn-xs"
                                      onClick={() => setEditingRelId(null)}
                                    >
                                      {tr('Annuler')}
                                    </button>
                                  </div>
                                </div>
                              )}

                              <div
                                className="candidate-card-actions"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  className="btn btn-primary btn-xs"
                                  disabled={isBusy}
                                  onClick={() => {
                                    void validateRelations(sourceNodeId, {
                                      action: 'validate',
                                      relation_ids: [rel.id],
                                    })
                                      .then(() =>
                                        toast.success(
                                          tr('Relation validée et ajoutée au graphe'),
                                          tr('Relations')
                                        )
                                      )
                                      .catch((err) =>
                                        toast.error(
                                          err instanceof Error ? err.message : tr('Erreur validation'),
                                          tr('Relations')
                                        )
                                      );
                                  }}
                                >
                                  <Check size={11} aria-hidden="true" />
                                  <span>{tr('Valider')}</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary btn-xs"
                                  disabled={isBusy}
                                  onClick={() => {
                                    if (isEditingThisRel) {
                                      setEditingRelId(null);
                                    } else {
                                      setEditingRelId(rel.id);
                                      setEditRelType(rel.relation_type);
                                      setEditRelLayer(
                                        rel.confidence >= 1.0 ? 'VERIFIED' : rel.suggested_layer
                                      );
                                      setEditRelConf(rel.confidence);
                                    }
                                  }}
                                >
                                  <Pencil size={11} aria-hidden="true" />
                                  <span>{tr('Modifier')}</span>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-ghost btn-xs"
                                  disabled={isBusy}
                                  onClick={() => {
                                    void deleteExtractedRelation(sourceNodeId, rel.id)
                                      .then(() => toast.success(tr('Relation supprimée'), tr('Relations')))
                                      .catch((err) =>
                                        toast.error(
                                          err instanceof Error ? err.message : tr('Erreur suppression'),
                                          tr('Relations')
                                        )
                                      );
                                  }}
                                >
                                  <Trash2 size={11} aria-hidden="true" />
                                  <span>{tr('Supprimer')}</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
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
