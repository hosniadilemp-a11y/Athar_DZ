import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import type { LayerId } from '../../types/registry';
import {
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
    openLayerChangeModal,
    nodes,
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
  const { tr, dir } = useI18n();
  const menuRef = useRef<HTMLDivElement>(null);

  const targetNode = nodes.find((n) => n.id === contextMenu.targetNodeId);

  useEffect(() => {
    if (!contextMenu.isOpen) return;

    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not([aria-disabled="true"])');
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
        const items = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') || []);
        const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
        if (e.key === 'ArrowDown') {
          const nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex]?.focus();
        } else {
          const prevIndex = (currentIndex - 1 + items.length) % items.length;
          items[prevIndex]?.focus();
        }
      }
    };

    window.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !targetNode) return null;

  const handlePromoteToVerified = () => {
    closeContextMenu();
    openLayerChangeModal(targetNode.id, 'VERIFIED');
  };

  const handleMoveToLayer = (layer: LayerId) => {
    closeContextMenu();
    openLayerChangeModal(targetNode.id, layer);
  };

  const handleHideNode = () => {
    closeContextMenu();
    if (window.confirm(tr('Masquer le nœud "{label}" de la vue active ?', { label: targetNode.label }))) {
      updateNodePosition(targetNode.id, -9999, -9999, true);
    }
  };

  const menuItemStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) var(--space-3)',
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-sm)',
    cursor: 'pointer',
    textAlign: dir === 'rtl' ? 'right' : 'left',
  };

  const disabledItemStyle: React.CSSProperties = {
    ...menuItemStyle,
    color: 'var(--color-text-muted)',
    cursor: 'not-allowed',
  };

  const phaseBadgeStyle: React.CSSProperties = {
    fontSize: 'var(--text-xs)',
    fontFamily: 'var(--font-mono)',
    padding: '1px 4px',
    borderRadius: 'var(--radius-sm)',
    backgroundColor: 'var(--color-bg-subtle)',
    color: 'var(--color-accent-text)',
    border: '1px solid var(--color-border-default)',
  };

  const clampedX = typeof window !== 'undefined' ? Math.min(contextMenu.x, Math.max(8, window.innerWidth - 250)) : contextMenu.x;
  const clampedY = typeof window !== 'undefined' ? Math.min(contextMenu.y, Math.max(8, window.innerHeight - 320)) : contextMenu.y;

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`${targetNode.label} — ${targetNode.type}`}
      style={{
        position: 'fixed',
        left: `${clampedX}px`,
        top: `${clampedY}px`,
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        zIndex: 1200,
        minWidth: '220px',
        padding: 'var(--space-1) 0',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          padding: 'var(--space-2) var(--space-3)',
          borderBottom: '1px solid var(--color-border-subtle)',
          fontSize: 'var(--text-xs)',
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-mono)',
          textAlign: dir === 'rtl' ? 'right' : 'left',
        }}
      >
        {targetNode.label} ({targetNode.type})
      </div>

      {activeView === 'graph' ? (
        <>
          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={() => { closeContextMenu(); onExpand(1); }}
          >
            <Compass size={16} />
            <span>{tr('Explorer voisinage (1 bond)')}</span>
          </button>

          {isPersonOnlyGraph && (
            <button
              type="button"
              role="menuitem"
              style={{ ...menuItemStyle, color: 'var(--color-accent-text)' }}
              onClick={() => {
                closeContextMenu();
                toggleExpandNodeConnections(targetNode.id);
              }}
            >
              <GitBranch size={16} />
              <span>{tr('Déplier / Replier ses entités cachées liées')}</span>
            </button>
          )}

          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={() => { closeContextMenu(); onExpand(2); }}
          >
            <GitBranch size={16} />
            <span>{tr('Explorer réseau élargi (2 bonds)')}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            style={menuItemStyle}
            onClick={() => {
              closeContextMenu();
              togglePinNode(targetNode.id);
            }}
          >
            <Pin
              size={16}
              style={{
                color: pinnedNodeIds.has(targetNode.id)
                  ? 'var(--color-status-warning)'
                  : 'inherit',
              }}
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
            style={{ ...menuItemStyle, color: 'var(--color-accent-text)' }}
            onClick={() => {
              closeContextMenu();
              onLocateInGraph(targetNode.id);
            }}
          >
            <Network size={16} />
            <span>{tr('Localiser sur le Graphe')}</span>
          </button>
        )
      )}

      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => {
          closeContextMenu();
          openActorTab(targetNode.id);
        }}
      >
        <FolderOpen size={16} style={{ color: 'var(--color-layer-4-hypothesis)' }} />
        <span>{tr("Ouvrir dans un nouvel onglet d'investigation")}</span>
      </button>

      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => { closeContextMenu(); onInspect(); }}
      >
        <Info size={16} />
        <span>{tr('Inspecter les propriétés')}</span>
      </button>

      {activeView === 'graph' && (
        <button
          type="button"
          role="menuitem"
          style={menuItemStyle}
          onClick={() => {
            closeContextMenu();
            setLinkMode(true);
            setLinkSourceNodeId(targetNode.id);
          }}
        >
          <Link2 size={16} style={{ color: 'var(--color-status-warning)' }} />
          <span>{tr('Créer une liaison depuis cette entité...')}</span>
        </button>
      )}

      <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => handleMoveToLayer(targetNode.layer === 'VERIFIED' ? 'HYPOTHESIS' : 'VERIFIED')}
      >
        <Layers size={16} style={{ color: 'var(--color-accent-text)' }} />
        <span>{tr('Changer de calque')}</span>
      </button>

      {targetNode.layer !== 'VERIFIED' && (
        <button
          type="button"
          role="menuitem"
          style={{ ...menuItemStyle, color: 'var(--color-layer-1-verified)' }}
          onClick={handlePromoteToVerified}
        >
          <Lock size={16} />
          <span>{tr('Promouvoir en VERIFIED (Justification requise)')}</span>
        </button>
      )}

      <button
        type="button"
        role="menuitem"
        aria-disabled="true"
        style={disabledItemStyle}
        onClick={() => alert(tr("L'analyse prédictive IA sera disponible en Phase 3."))}
      >
        <Wand2 size={16} />
        <span style={{ flex: 1, textAlign: dir === 'rtl' ? 'right' : 'left' }}>{tr('Enrichissement IA')}</span>
        <span style={phaseBadgeStyle}>{tr('Phase {n}', { n: 3 })}</span>
      </button>

      {activeView === 'graph' && (
        <>
          <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

          <button
            type="button"
            role="menuitem"
            style={{ ...menuItemStyle, color: 'var(--color-status-danger)' }}
            onClick={handleHideNode}
          >
            <EyeOff size={16} />
            <span>{tr('Masquer du graphe')}</span>
          </button>

          <button
            type="button"
            role="menuitem"
            style={{ ...menuItemStyle, color: 'var(--color-status-danger)' }}
            onClick={() => {
              const targetIds =
                selectedNodeIds.includes(targetNode.id) && selectedNodeIds.length > 1
                  ? selectedNodeIds
                  : [targetNode.id];
              closeContextMenu();
              requestDeleteNodes(targetIds);
            }}
          >
            <Trash2 size={16} />
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
