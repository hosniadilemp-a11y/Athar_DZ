import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Undo2,
  Redo2,
  Table,
  Network,
  Sparkles,
} from 'lucide-react';

interface ToolbarProps {
  isTableView: boolean;
  onToggleTableView: () => void;
  onToggleImpactView: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  isTableView,
  onToggleTableView,
  onToggleImpactView,
}) => {
  const {
    viewport,
    zoomBy,
    resetViewport,
    undo,
    redo,
    undoStack,
    redoStack,
    isImpactView,
    nodes,
    totalCaseNodes,
  } = useGraphStore();

  return (
    <div
      role="toolbar"
      aria-label="Contrôles du graphe d'investigation"
      style={{
        position: 'absolute',
        top: 'var(--space-3)',
        left: 'var(--space-4)',
        right: 'var(--space-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Left side: Impact View Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'auto',
        }}
      >
        <button
          type="button"
          onClick={onToggleImpactView}
          aria-pressed={isImpactView}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-1) var(--space-3)',
            backgroundColor: isImpactView ? 'var(--color-accent-subtle)' : 'transparent',
            border: isImpactView ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
            borderRadius: 'var(--radius-sm)',
            color: isImpactView ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
            cursor: 'pointer',
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
          }}
        >
          <Sparkles size={14} style={{ color: isImpactView ? 'var(--color-accent-text)' : 'var(--color-text-muted)' }} />
          <span>
            Vue Impact : {nodes.length} / {totalCaseNodes || 100} nœuds
          </span>
        </button>
      </div>

      {/* Right side: Viewport, History, and View switcher */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-1)',
          backgroundColor: 'var(--color-bg-surface)',
          padding: 'var(--space-1)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-default)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          pointerEvents: 'auto',
        }}
      >
        {/* Undo */}
        <button
          type="button"
          title={`Annuler (${undoStack.length}) [Ctrl+Z]`}
          aria-label="Annuler la dernière action"
          disabled={undoStack.length === 0}
          onClick={undo}
          style={toolBtnStyle(undoStack.length > 0)}
        >
          <Undo2 size={16} />
        </button>

        {/* Redo */}
        <button
          type="button"
          title={`Rétablir (${redoStack.length}) [Ctrl+Y]`}
          aria-label="Rétablir la dernière action"
          disabled={redoStack.length === 0}
          onClick={redo}
          style={toolBtnStyle(redoStack.length > 0)}
        >
          <Redo2 size={16} />
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border-default)', margin: '0 4px' }} />

        {/* Zoom Out */}
        <button
          type="button"
          title="Zoom arrière (-)"
          aria-label="Zoom arrière"
          onClick={() => zoomBy(0.85)}
          style={toolBtnStyle(true)}
        >
          <ZoomOut size={16} />
        </button>

        {/* Zoom Level Indicator */}
        <span
          style={{
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-text-muted)',
            minWidth: '40px',
            textAlign: 'center',
          }}
        >
          {Math.round(viewport.zoom * 100)}%
        </span>

        {/* Zoom In */}
        <button
          type="button"
          title="Zoom avant (+)"
          aria-label="Zoom avant"
          onClick={() => zoomBy(1.15)}
          style={toolBtnStyle(true)}
        >
          <ZoomIn size={16} />
        </button>

        {/* Reset View */}
        <button
          type="button"
          title="Réinitialiser vue (0)"
          aria-label="Réinitialiser vue"
          onClick={resetViewport}
          style={toolBtnStyle(true)}
        >
          <RotateCcw size={16} />
        </button>

        {/* Fit */}
        <button
          type="button"
          title="Ajuster à l'écran"
          aria-label="Ajuster à l'écran"
          onClick={resetViewport}
          style={toolBtnStyle(true)}
        >
          <Maximize2 size={16} />
        </button>

        <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border-default)', margin: '0 4px' }} />

        {/* Toggle List / Canvas */}
        <button
          type="button"
          title={isTableView ? 'Vue Graphe Canvas' : 'Vue Tableau Accessible'}
          aria-label={isTableView ? 'Passer en vue graphe interactif' : 'Passer en vue tableau accessible'}
          onClick={onToggleTableView}
          style={{
            ...toolBtnStyle(true),
            color: isTableView ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
          }}
        >
          {isTableView ? <Network size={16} /> : <Table size={16} />}
        </button>
      </div>
    </div>
  );
};

const toolBtnStyle = (enabled: boolean): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  color: enabled ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
  cursor: enabled ? 'pointer' : 'not-allowed',
  padding: 0,
});
