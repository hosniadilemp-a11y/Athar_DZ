import React, { useEffect, useRef } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import type { LayerId } from '../../types/registry';
import {
  Compass,
  GitBranch,
  Layers,
  Info,
  EyeOff,
  Wand2,
  Lock,
} from 'lucide-react';

interface ContextMenuProps {
  onExpand: (hops: number) => void;
  onInspect: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ onExpand, onInspect }) => {
  const { contextMenu, closeContextMenu, openLayerChangeModal, nodes, updateNodePosition } = useGraphStore();
  const menuRef = useRef<HTMLDivElement>(null);

  const targetNode = nodes.find((n) => n.id === contextMenu.targetNodeId);

  useEffect(() => {
    if (!contextMenu.isOpen) return;

    // Focus first menuitem
    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>('[role="menuitem"]:not([aria-disabled="true"])');
    firstItem?.focus();

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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [contextMenu.isOpen, closeContextMenu]);

  if (!contextMenu.isOpen || !targetNode) return null;

  const handlePromoteToVerified = () => {
    closeContextMenu();
    openLayerChangeModal(targetNode.id, 'VERIFIED');
  };

  const handleMoveToLayer = (layer: LayerId) => {
    closeContextMenu();
    if (layer === 'VERIFIED') {
      openLayerChangeModal(targetNode.id, 'VERIFIED');
    } else {
      // Direct layer change for non-verified layers
      // (Backend still audits it)
      openLayerChangeModal(targetNode.id, layer);
    }
  };

  const handleHideNode = () => {
    closeContextMenu();
    if (window.confirm(`Masquer le nœud "${targetNode.label}" de la vue active ?`)) {
      // Reversible hide via move out of bounds or filter
      updateNodePosition(targetNode.id, -9999, -9999, true);
    }
  };

  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={`Menu contextuel pour ${targetNode.label}`}
      style={{
        position: 'fixed',
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
        backgroundColor: 'var(--color-bg-elevated)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        zIndex: 100,
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
        }}
      >
        {targetNode.label} ({targetNode.type})
      </div>

      {/* 1-hop Expansion */}
      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => {
          closeContextMenu();
          onExpand(1);
        }}
      >
        <Compass size={16} />
        <span>Explorer voisinage (1 bond)</span>
      </button>

      {/* 2-hop Expansion */}
      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => {
          closeContextMenu();
          onExpand(2);
        }}
      >
        <GitBranch size={16} />
        <span>Explorer réseau élargi (2 bonds)</span>
      </button>

      {/* Inspect properties */}
      <button
        type="button"
        role="menuitem"
        style={menuItemStyle}
        onClick={() => {
          closeContextMenu();
          onInspect();
        }}
      >
        <Info size={16} />
        <span>Inspecter les propriétés</span>
      </button>

      {/* Forensic Layer Change */}
      <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

      {targetNode.layer !== 'VERIFIED' && (
        <button
          type="button"
          role="menuitem"
          style={{ ...menuItemStyle, color: 'var(--color-layer-1-verified)' }}
          onClick={handlePromoteToVerified}
        >
          <Lock size={16} />
          <span>Promouvoir en VERIFIED (Justification requise)</span>
        </button>
      )}

      {targetNode.layer !== 'HYPOTHESIS' && (
        <button
          type="button"
          role="menuitem"
          style={menuItemStyle}
          onClick={() => handleMoveToLayer('HYPOTHESIS')}
        >
          <Layers size={16} />
          <span>Classer en HYPOTHESIS</span>
        </button>
      )}

      {/* Decision D10: Phase N disabled features */}
      <button
        type="button"
        role="menuitem"
        aria-disabled="true"
        style={disabledItemStyle}
        onClick={() => alert("L'analyse prédictive IA sera disponible en Phase 3.")}
      >
        <Wand2 size={16} />
        <span style={{ flex: 1, textAlign: 'left' }}>Enrichissement IA</span>
        <span style={phaseBadgeStyle}>Phase 3</span>
      </button>

      <div style={{ height: '1px', backgroundColor: 'var(--color-border-subtle)', margin: 'var(--space-1) 0' }} />

      {/* Hide node */}
      <button
        type="button"
        role="menuitem"
        style={{ ...menuItemStyle, color: 'var(--color-status-danger)' }}
        onClick={handleHideNode}
      >
        <EyeOff size={16} />
        <span>Masquer du graphe</span>
      </button>
    </div>
  );
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
  textAlign: 'left',
};

const disabledItemStyle: React.CSSProperties = {
  ...menuItemStyle,
  color: 'var(--color-text-muted)',
  cursor: 'not-allowed',
};

const phaseBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontFamily: 'var(--font-mono)',
  padding: '1px 4px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-subtle)',
  color: 'var(--color-accent-text)',
  border: '1px solid var(--color-border-default)',
};
