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
  BrainCircuit,
  MapPin,
  Calendar,
  ShieldCheck,
  FileDown,
} from 'lucide-react';

export type ActiveViewMode = 'graph' | 'map' | 'timeline' | 'table' | 'audit';

interface ToolbarProps {
  activeView: ActiveViewMode;
  onChangeView: (mode: ActiveViewMode) => void;
  isSnaOpen?: boolean;
  onToggleSna?: () => void;
  onOpenExport?: () => void;
  onToggleImpactView: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  activeView,
  onChangeView,
  isSnaOpen = false,
  onToggleSna,
  onOpenExport,
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
      aria-label="Barre d'outils et sélecteur de vues d'investigation"
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
      {/* Left side: Impact View & Multi-View Switcher */}
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
        {/* Impact View Toggle */}
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

        <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--color-border-default)' }} />

        {/* View Switchers */}
        <button
          type="button"
          title="Vue Graphe Interactif"
          aria-label="Vue Graphe"
          onClick={() => onChangeView('graph')}
          style={viewBtnStyle(activeView === 'graph')}
        >
          <Network size={14} />
          <span>Graphe</span>
        </button>

        <button
          type="button"
          title="Vue Cartographie SIG (8 types GPS)"
          aria-label="Vue Carte"
          onClick={() => onChangeView('map')}
          style={viewBtnStyle(activeView === 'map')}
        >
          <MapPin size={14} />
          <span>Carte</span>
        </button>

        <button
          type="button"
          title="Vue Chronologie Temporelle"
          aria-label="Vue Chronologie"
          onClick={() => onChangeView('timeline')}
          style={viewBtnStyle(activeView === 'timeline')}
        >
          <Calendar size={14} />
          <span>Chronologie</span>
        </button>

        <button
          type="button"
          title="Vue Tableau Accessible"
          aria-label="Vue Tableau"
          onClick={() => onChangeView('table')}
          style={viewBtnStyle(activeView === 'table')}
        >
          <Table size={14} />
          <span>Tableau</span>
        </button>

        <button
          type="button"
          title="Vue Registre Forensique (ISO 27037)"
          aria-label="Vue Registre"
          onClick={() => onChangeView('audit')}
          style={viewBtnStyle(activeView === 'audit')}
        >
          <ShieldCheck size={14} />
          <span>Registre</span>
        </button>
      </div>

      {/* Right side: SNA, Export, and Navigation Controls */}
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
        {/* SNA Panel Toggle */}
        {onToggleSna && (
          <button
            type="button"
            onClick={onToggleSna}
            aria-pressed={isSnaOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor: isSnaOpen ? 'var(--color-accent-subtle)' : 'transparent',
              border: isSnaOpen ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
              borderRadius: 'var(--radius-sm)',
              color: isSnaOpen ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            <BrainCircuit size={14} style={{ color: isSnaOpen ? 'var(--color-accent-text)' : 'var(--color-text-muted)' }} />
            <span>SNA (16)</span>
          </button>
        )}

        {/* Export Modal Button */}
        {onOpenExport && (
          <button
            type="button"
            onClick={onOpenExport}
            title="Exporter le dossier (PDF / JSON)"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
              padding: 'var(--space-1) var(--space-2)',
              backgroundColor: 'transparent',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
            }}
          >
            <FileDown size={14} />
            <span>Exporter</span>
          </button>
        )}

        {activeView === 'graph' && (
          <>
            <div style={{ width: '1px', height: '16px', backgroundColor: 'var(--color-border-default)', margin: '0 4px' }} />

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
                minWidth: '38px',
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
          </>
        )}
      </div>
    </div>
  );
};

const viewBtnStyle = (active: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '4px 8px',
  backgroundColor: active ? 'var(--color-accent-subtle)' : 'transparent',
  border: active ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
  borderRadius: 'var(--radius-sm)',
  color: active ? 'var(--color-accent-text)' : 'var(--color-text-secondary)',
  fontSize: 'var(--text-xs)',
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
});

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
