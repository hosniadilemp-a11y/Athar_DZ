import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import type { LayerId } from '../../types/registry';
import {
  Check,
  Compass,
  GitBranch,
  Layers,
  Info,
  EyeOff,
  Wand2,
  Lock,
  Link2,
  Pin,
  FolderOpen,
  Network,
  Trash2,
} from 'lucide-react';
import type { ActiveViewMode } from './Toolbar';

interface ContextMenuProps {
  activeView?: ActiveViewMode;
  onExpand: (hops: number) => void;
  onInspect: () => void;
  onLocateInGraph?: (nodeId: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  activeView = 'graph',
  onExpand,
  onInspect,
  onLocateInGraph,
}) => {
  const {
    contextMenu,
    closeContextMenu,
    changeNodeLayer,
    nodes,
    candidatesByNodeId,
    selectNode,
    selectCandidate,
    validateCandidates,
    updateNodePosition,
    setLinkMode,
    setLinkSourceNodeId,
    isPersonOnlyGraph,
    toggleExpandNodeConnections,
    pinnedNodeIds,
    togglePinNode,
    openActorTab,
    selectedNodeIds,
    requestDeleteNodes,
  } = useGraphStore();
  const { tr } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  const targetId = contextMenu.targetNodeId || '';
  const isCandidateTarget = targetId.startsWith('cand:');
  const candidateId = isCandidateTarget ? targetId.slice(5) : null;
  const candidateMatch = (() => {
    if (!candidateId) return null;
    for (const [sourceNodeId, list] of Object.entries(candidatesByNodeId)) {
      const found = list.find((c) => c.id === candidateId);
      if (found) return { sourceNodeId, candidate: found };
    }
    return null;
  })();

  const targetNode = !isCandidateTarget ? nodes.find((n) => n.id === targetId) : undefined;
  const isOpen = contextMenu.isOpen && (Boolean(targetNode) || Boolean(candidateMatch));

  useEffect(() => {
    if (!isOpen) return;

    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitem"]:not([aria-disabled="true"])'
    );
    firstItem?.focus();

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeContextMenu();
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const items = Array.from(
          menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') || []
        );
        if (items.length === 0) return;
        const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === 'ArrowDown') {
          items[(currentIndex + 1) % items.length]?.focus();
        } else {
          items[(currentIndex - 1 + items.length) % items.length]?.focus();
        }
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeContextMenu]);

  if (!isOpen) return null;

  const clampedX =
    typeof window !== 'undefined'
      ? Math.min(contextMenu.x, Math.max(8, window.innerWidth - 270))
      : contextMenu.x;
  const clampedY =
    typeof window !== 'undefined'
      ? Math.min(contextMenu.y, Math.max(8, window.innerHeight - 400))
      : contextMenu.y;

  // Context Menu for extracted candidate ghost nodes (`cand:xxx`)
  if (candidateMatch) {
    const { sourceNodeId, candidate } = candidateMatch;

    return (
      <div
        ref={menuRef}
        role="menu"
        className="context-menu-panel"
        aria-label={candidate.label}
        style={{ left: `${clampedX}px`, top: `${clampedY}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="context-menu-header">
          <span className="context-menu-node-name">
            <bdi dir="ltr">{candidate.label}</bdi>
          </span>
        </div>

        <button
          type="button"
          role="menuitem"
          className="context-menu-item is-accent"
          onClick={() => {
            closeContextMenu();
            selectNode(sourceNodeId, false);
            selectCandidate(candidate.id);
            onInspect();
          }}
        >
          <Info size={16} aria-hidden="true" />
          <span>{tr('Inspecter les propriétés')}</span>
        </button>

        <button
          type="button"
          role="menuitem"
          className="context-menu-item is-success"
          onClick={() => {
            closeContextMenu();
            void validateCandidates(sourceNodeId, {
              action: 'validate',
              candidate_ids: [candidate.id],
            });
          }}
        >
          <Check size={16} aria-hidden="true" />
          <span>{tr('Valider et ajouter au graphe')}</span>
        </button>

        <div className="context-menu-divider" />

        <button
          type="button"
          role="menuitem"
          className="context-menu-item is-danger"
          onClick={() => {
            closeContextMenu();
            void validateCandidates(sourceNodeId, {
              action: 'reject',
              candidate_ids: [candidate.id],
            });
          }}
        >
          <Trash2 size={16} aria-hidden="true" />
          <span>{tr('Écarter cet indice')}</span>
        </button>
      </div>
    );
  }

  if (!targetNode) return null;

  const handlePromoteToVerified = () => {
    closeContextMenu();
    void changeNodeLayer(targetNode.id, 'VERIFIED');
  };

  const handleMoveToLayer = (layer: LayerId) => {
    closeContextMenu();
    void changeNodeLayer(targetNode.id, layer);
  };

  const handleHideNode = () => {
    closeContextMenu();
    if (window.confirm(tr('Masquer le nœud "{label}" de la vue active ?', { label: targetNode.label }))) {
      updateNodePosition(targetNode.id, -9999, -9999, true);
    }
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      className="context-menu-panel"
      aria-label={targetNode.label}
      style={{ left: `${clampedX}px`, top: `${clampedY}px` }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">
        <span className="context-menu-node-name">
          <bdi dir="ltr">{targetNode.label}</bdi>
        </span>
      </div>

      {activeView === 'graph' ? (
        <>
          <button
            type="button"
            role="menuitem"
            className="context-menu-item"
            onClick={() => {
              closeContextMenu();
              onExpand(1);
            }}
          >
            <Compass size={16} aria-hidden="true" />
            <span>{tr('Explorer voisinage (1 bond)')}</span>
          </button>

          {isPersonOnlyGraph && (
            <button
              type="button"
              role="menuitem"
              className="context-menu-item is-accent"
              onClick={() => {
                closeContextMenu();
                toggleExpandNodeConnections(targetNode.id);
              }}
            >
              <GitBranch size={16} aria-hidden="true" />
              <span>{tr('Déplier / Replier ses entités cachées liées')}</span>
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            className="context-menu-item"
            onClick={() => {
              closeContextMenu();
              onExpand(2);
            }}
          >
            <GitBranch size={16} aria-hidden="true" />
            <span>{tr('Explorer réseau élargi (2 bonds)')}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="context-menu-item"
            onClick={() => {
              closeContextMenu();
              togglePinNode(targetNode.id);
            }}
          >
            <Pin
              size={16}
              className={pinnedNodeIds.has(targetNode.id) ? 'is-pinned-icon' : ''}
              aria-hidden="true"
            />
            <span>
              {pinnedNodeIds.has(targetNode.id)
                ? tr('Détacher la position (Dépingler)')
                : tr('Épingler la position')}
            </span>
          </button>
        </>
      ) : (
        onLocateInGraph && (
          <button
            type="button"
            role="menuitem"
            className="context-menu-item is-accent"
            onClick={() => {
              closeContextMenu();
              onLocateInGraph(targetNode.id);
            }}
          >
            <Network size={16} aria-hidden="true" />
            <span>{tr('Localiser sur le Graphe')}</span>
          </button>
        )
      )}

      <button
        type="button"
        role="menuitem"
        className="context-menu-item"
        onClick={() => {
          closeContextMenu();
          openActorTab(targetNode.id);
        }}
      >
        <FolderOpen size={16} className="is-hypothesis-icon" aria-hidden="true" />
        <span>{tr("Ouvrir dans un nouvel onglet d'investigation")}</span>
      </button>

      <button
        type="button"
        role="menuitem"
        className="context-menu-item"
        onClick={() => {
          closeContextMenu();
          selectCandidate(null);
          selectNode(targetNode.id, false);
          onInspect();
        }}
      >
        <Info size={16} aria-hidden="true" />
        <span>{tr('Inspecter les propriétés')}</span>
      </button>

      {activeView === 'graph' && (
        <button
          type="button"
          role="menuitem"
          className="context-menu-item"
          onClick={() => {
            closeContextMenu();
            setLinkMode(true);
            setLinkSourceNodeId(targetNode.id);
          }}
        >
          <Link2 size={16} className="is-warning-icon" aria-hidden="true" />
          <span>{tr('Créer une liaison depuis cette entité...')}</span>
        </button>
      )}

      <div className="context-menu-divider" />

      <div className="context-menu-layer-group" role="group" aria-label={tr('Calque')}>
        <span className="context-menu-layer-heading">
          <Layers size={14} className="is-accent-icon" aria-hidden="true" />
          <span>{tr('Calque')}</span>
        </span>
        <div className="context-menu-layer-pills">
          {(['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS'] as LayerId[]).map((layerId) => (
            <button
              key={layerId}
              type="button"
              role="menuitem"
              className={`context-menu-layer-pill${targetNode.layer === layerId ? ' is-active' : ''}`}
              onClick={() => handleMoveToLayer(layerId)}
            >
              {layerId}
            </button>
          ))}
        </div>
      </div>

      {targetNode.layer !== 'VERIFIED' && (
        <button
          type="button"
          role="menuitem"
          className="context-menu-item is-success"
          onClick={handlePromoteToVerified}
        >
          <Lock size={16} aria-hidden="true" />
          <span>{tr('Promouvoir en VERIFIED')}</span>
        </button>
      )}

      <button
        type="button"
        role="menuitem"
        aria-disabled="true"
        className="context-menu-item is-disabled"
        onClick={() => alert(tr("L'analyse prédictive IA sera disponible en Phase 3."))}
      >
        <Wand2 size={16} aria-hidden="true" />
        <span className="context-menu-grow">{tr('Enrichissement IA')}</span>
        <span className="phase-badge">{tr('Phase {n}', { n: 3 })}</span>
      </button>

      {activeView === 'graph' && (
        <>
          <div className="context-menu-divider" />

          <button
            type="button"
            role="menuitem"
            className="context-menu-item is-danger"
            onClick={handleHideNode}
          >
            <EyeOff size={16} aria-hidden="true" />
            <span>{tr('Masquer du graphe')}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            className="context-menu-item is-danger"
            onClick={() => {
              const targetIds =
                selectedNodeIds.includes(targetNode.id) && selectedNodeIds.length > 1
                  ? selectedNodeIds
                  : [targetNode.id];
              closeContextMenu();
              requestDeleteNodes(targetIds);
            }}
          >
            <Trash2 size={16} aria-hidden="true" />
            <span>
              {selectedNodeIds.includes(targetNode.id) && selectedNodeIds.length > 1
                ? tr('Supprimer la sélection ({n})', { n: selectedNodeIds.length })
                : tr('Supprimer ce nœud')}
            </span>
          </button>
        </>
      )}
    </div>
  );
};
