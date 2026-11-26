import React, { useCallback, useEffect, useMemo } from 'react';
import { AlertTriangle, Trash2, Network, X } from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import { analyzeBulkNodeDeletion } from '../../utils/graphLayouts';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { ModalPortal } from '../common/ModalPortal';

export const DeleteNodesModal: React.FC = () => {
  const { tr, trLabel } = useI18n();
  const toast = useToast();
  const {
    pendingDeleteNodeIds,
    cancelDeleteNodes,
    deleteNodes,
    nodes,
    edges,
    isPersonOnlyGraph,
    expandedHiddenNodeIds,
    setPersonOnlyGraph,
  } = useGraphStore();

  const analysis = useMemo(() => {
    if (!pendingDeleteNodeIds || pendingDeleteNodeIds.length === 0) return null;
    return analyzeBulkNodeDeletion(
      pendingDeleteNodeIds,
      nodes,
      edges,
      isPersonOnlyGraph,
      expandedHiddenNodeIds
    );
  }, [pendingDeleteNodeIds, nodes, edges, isPersonOnlyGraph, expandedHiddenNodeIds]);

  const isBlocked = analysis?.status === 'blocked_third_party';

  const handleConfirmDelete = useCallback(() => {
    if (!analysis || analysis.primaryNodes.length === 0) return;
    const count = analysis.allNodeIdsToDelete.length;
    deleteNodes(analysis.allNodeIdsToDelete);
    cancelDeleteNodes();
    toast.info(
      tr('{n} entité(s) supprimée(s) du graphe (Ctrl+Z pour annuler).', { n: count }),
      tr('Suppression effectuée')
    );
  }, [analysis, deleteNodes, cancelDeleteNodes, toast, tr]);

  const handleSwitchToFullAndSelect = useCallback(() => {
    if (!analysis || analysis.primaryNodes.length === 0) return;
    setPersonOnlyGraph(false);
    const idsToSelect = analysis.allNodeIdsToDelete;
    useGraphStore.setState({
      selectedNodeIds: idsToSelect,
      selectedNodeId: idsToSelect[0] ?? null,
      selectedEdgeId: null,
    });
    cancelDeleteNodes();
  }, [analysis, setPersonOnlyGraph, cancelDeleteNodes]);

  useEffect(() => {
    if (!analysis || analysis.primaryNodes.length === 0) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        cancelDeleteNodes();
      } else if (e.key === 'Enter') {
        const activeEl = document.activeElement as HTMLElement | null;
        if (activeEl?.tagName === 'BUTTON' && activeEl.dataset.modalCancel === 'true') {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (isBlocked) {
          handleSwitchToFullAndSelect();
        } else {
          handleConfirmDelete();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [analysis, isBlocked, cancelDeleteNodes, handleConfirmDelete, handleSwitchToFullAndSelect]);

  if (!analysis || analysis.primaryNodes.length === 0) return null;

  return (
    <ModalPortal>
      <div
        className="delete-nodes-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-nodes-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) cancelDeleteNodes();
        }}
      >
      <div className="delete-nodes-dialog">
        <div className="delete-nodes-header">
          <div className="delete-nodes-title-row">
            {isBlocked ? (
              <AlertTriangle size={18} className="text-warning" />
            ) : (
              <Trash2 size={18} className="text-danger" />
            )}
            <h2 id="delete-nodes-modal-title" className="delete-nodes-title">
              {isBlocked
                ? tr('Suppression impossible en mode compacté')
                : tr('Confirmer la suppression ({n} entité(s))', {
                    n: analysis.allNodeIdsToDelete.length,
                  })}
            </h2>
          </div>
          <button
            type="button"
            data-modal-cancel="true"
            className="graph-display-close-btn"
            onClick={cancelDeleteNodes}
            aria-label={tr('Fermer')}
          >
            <X size={15} />
          </button>
        </div>

        <div className="delete-nodes-body">
          {isBlocked ? (
            <>
              <div className="delete-nodes-warning-banner">
                <AlertTriangle size={15} className="text-warning" />
                <span>
                  {tr(
                    "Cette action est impossible en mode compacté : une tierce personne est impliquée dans les entités intermédiaires reliées aux nœuds sélectionnés. Affichez tout le graphe pour sélectionner manuellement les entités à supprimer."
                  )}
                </span>
              </div>

              <div className="delete-nodes-section">
                <div className="delete-nodes-section-label">
                  {tr('Tierces personnes impliquées ({n}) :', {
                    n: analysis.blockingThirdParties.length,
                  })}
                </div>
                <div className="delete-nodes-list">
                  {analysis.blockingThirdParties.map(({ person, viaIntermediates }) => (
                    <div key={person.id} className="delete-nodes-item">
                      <span className="delete-nodes-item-name">{trLabel(person.label)}</span>
                      <span className="delete-nodes-item-meta font-mono">
                        {tr('via')} {viaIntermediates.map((m) => trLabel(m.label)).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="delete-nodes-section">
                <div className="delete-nodes-section-label">
                  {tr('Entités sélectionnées à supprimer ({n}) :', {
                    n: analysis.primaryNodes.length,
                  })}
                </div>
                <div className="delete-nodes-list">
                  {analysis.primaryNodes.map((n) => (
                    <div key={n.id} className="delete-nodes-item">
                      <span className="delete-nodes-item-name">{trLabel(n.label)}</span>
                      <span className="delete-nodes-item-meta font-mono">{n.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {analysis.intermediateNodes.length > 0 && (
                <div className="delete-nodes-section">
                  <div className="delete-nodes-section-label text-warning">
                    {tr('Entités intermédiaires entre les nœuds (également supprimées) ({n}) :', {
                      n: analysis.intermediateNodes.length,
                    })}
                  </div>
                  <div className="delete-nodes-list">
                    {analysis.intermediateNodes.map((n) => (
                      <div key={n.id} className="delete-nodes-item">
                        <span className="delete-nodes-item-name">{trLabel(n.label)}</span>
                        <span className="delete-nodes-item-meta font-mono">{n.type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="delete-nodes-summary">
                {tr('Total : {nodes} entité(s) et {edges} liaison(s) associée(s) seront supprimées.', {
                  nodes: analysis.allNodeIdsToDelete.length,
                  edges: analysis.affectedEdgeCount,
                })}
              </p>
            </>
          )}
        </div>

        <div className="delete-nodes-footer">
          <button
            type="button"
            data-modal-cancel="true"
            className="btn btn-secondary btn-sm"
            onClick={cancelDeleteNodes}
          >
            {tr('Annuler')}
          </button>
          {isBlocked ? (
            <button
              type="button"
              data-autofocus="true"
              className="btn btn-primary btn-sm"
              onClick={handleSwitchToFullAndSelect}
            >
              <Network size={14} />
              <span>{tr('Afficher tout le graphe et sélectionner les nœuds')}</span>
            </button>
          ) : (
            <button
              type="button"
              data-autofocus="true"
              className="btn btn-danger btn-sm"
              onClick={handleConfirmDelete}
            >
              <Trash2 size={14} />
              <span>
                {tr('Supprimer ({n})', { n: analysis.allNodeIdsToDelete.length })}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};
