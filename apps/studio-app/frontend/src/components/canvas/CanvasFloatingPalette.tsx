import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer,
  Hand,
  Link2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  BrainCircuit,
} from 'lucide-react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { MIN_GRAPH_ZOOM, MAX_GRAPH_ZOOM } from '../../utils/graphLayouts';

interface CanvasFloatingPaletteProps {
  onToggleSna?: () => void;
  isSnaOpen?: boolean;
  containerWidth?: number;
  containerHeight?: number;
}

export const CanvasFloatingPalette: React.FC<CanvasFloatingPaletteProps> = ({
  onToggleSna,
  isSnaOpen = false,
  containerWidth = 800,
  containerHeight = 600,
}) => {
  const { tr } = useI18n();
  const {
    viewport,
    setViewport,
    resetViewport,
    canvasToolMode,
    setCanvasToolMode,
    isLinkMode,
    setLinkMode,
  } = useGraphStore();

  const [isScaleOpen, setIsScaleOpen] = useState(false);
  const scaleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isScaleOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (scaleRef.current && !scaleRef.current.contains(e.target as Node)) {
        setIsScaleOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsScaleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isScaleOpen]);

  const applyCenteredZoom = (targetZoom: number) => {
    const clampedZoom = Math.min(Math.max(targetZoom, MIN_GRAPH_ZOOM), MAX_GRAPH_ZOOM);
    const currentZoom = Math.max(viewport.zoom || 1, 0.01);
    const cx = containerWidth / 2;
    const cy = containerHeight / 2;
    const ratio = clampedZoom / currentZoom;
    const nextPanX = cx - (cx - viewport.panX) * ratio;
    const nextPanY = cy - (cy - viewport.panY) * ratio;
    setViewport(nextPanX, nextPanY, clampedZoom);
  };

  const currentScalePercent = Math.round((viewport?.zoom || 1) * 100);
  const isSelectActive = canvasToolMode === 'select' && !isLinkMode;
  const isPanActive = canvasToolMode === 'pan' && !isLinkMode;

  return (
    <nav
      className="canvas-floating-palette"
      role="toolbar"
      aria-label={tr('Outils de navigation et manipulation du canevas')}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* Pointer / Selection */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${isSelectActive ? 'active' : ''}`}
        onClick={() => setCanvasToolMode('select')}
        aria-pressed={isSelectActive}
        aria-label={tr('Mode Sélection (Pointeur)')}
        title={tr('Mode Sélection (Pointeur) [V]')}
      >
        <MousePointer size={14} />
      </button>

      {/* Pan / Move */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${isPanActive ? 'active' : ''}`}
        onClick={() => setCanvasToolMode('pan')}
        aria-pressed={isPanActive}
        aria-label={tr('Déplacer le canevas (Pan)')}
        title={tr('Déplacer le canevas (Glisser avec clic gauche) [H]')}
      >
        <Hand size={14} />
      </button>

      {/* Link Mode */}
      <button
        type="button"
        className={`btn btn-ghost btn-sm ${isLinkMode ? 'active text-accent' : ''}`}
        onClick={() => setLinkMode(!isLinkMode)}
        aria-pressed={isLinkMode}
        aria-label={tr('Mode Création de Liaison')}
        title={tr('Mode Création de Liaison (Relier 2 nœuds) [L]')}
      >
        <Link2 size={14} />
      </button>

      <div className="palette-divider" role="separator" />

      {/* Zoom Out */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => applyCenteredZoom((viewport?.zoom || 1) * 0.8)}
        aria-label={tr('Zoom arrière')}
        title={tr('Zoom arrière (-)')}
      >
        <ZoomOut size={14} />
      </button>

      {/* Scale Selector (10% - 1000%) */}
      <div className="palette-scale-wrap" ref={scaleRef}>
        <button
          type="button"
          className={`btn btn-ghost btn-sm palette-scale-trigger font-mono ${isScaleOpen ? 'active' : ''}`}
          onClick={() => setIsScaleOpen((prev) => !prev)}
          aria-expanded={isScaleOpen}
          aria-label={tr('Échelle de zoom (10% – 1000%)')}
          title={tr('Choisir l\'échelle du graphe (10% à 1000%)')}
        >
          <span>{currentScalePercent}%</span>
        </button>

        {isScaleOpen && (
          <div
            className="palette-scale-popover"
            role="dialog"
            aria-label={tr('Échelle de zoom (10% – 1000%)')}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="palette-scale-header">
              <span className="palette-scale-title">{tr('Échelle du graphe')}</span>
              <div className="palette-scale-actions">
                <span className="palette-scale-badge font-mono">{currentScalePercent}%</span>
                <button
                  type="button"
                  className="btn btn-secondary btn-xs"
                  onClick={() => {
                    resetViewport();
                    setIsScaleOpen(false);
                  }}
                >
                  {tr('Ajuster')}
                </button>
              </div>
            </div>

            <div className="palette-scale-slider-row">
              <span className="palette-scale-bound font-mono">10%</span>
              <input
                type="range"
                className="modern-horizontal-slider"
                min={10}
                max={1000}
                step={1}
                value={Math.min(Math.max(currentScalePercent, 10), 1000)}
                onChange={(e) => applyCenteredZoom(Number(e.target.value) / 100)}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                aria-label={tr('Curseur d\'échelle de zoom')}
              />
              <span className="palette-scale-bound font-mono">1000%</span>
            </div>
          </div>
        )}
      </div>

      {/* Zoom In */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => applyCenteredZoom((viewport?.zoom || 1) * 1.25)}
        aria-label={tr('Zoom avant')}
        title={tr('Zoom avant (+)')}
      >
        <ZoomIn size={14} />
      </button>

      {/* Fit / Reset */}
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={() => resetViewport()}
        aria-label={tr('Ajuster la vue (Centrer)')}
        title={tr('Ajuster la vue (Centrer) [0]')}
      >
        <Maximize2 size={14} />
      </button>

      {/* SNA Launcher */}
      {onToggleSna && (
        <>
          <div className="palette-divider" role="separator" />
          <button
            type="button"
            className={`btn btn-ghost btn-sm palette-chip-btn ${isSnaOpen ? 'active' : ''}`}
            onClick={onToggleSna}
            aria-pressed={isSnaOpen}
            aria-label={tr('Analyse Réseau SNA (16 algorithmes graphiques)')}
            title={tr('Ouvrir le panneau d\'analyse de centralité et détection de communautés (SNA)')}
          >
            <BrainCircuit size={14} className={isSnaOpen ? 'text-accent' : 'text-muted'} />
            <span className="text-xs">SNA</span>
          </button>
        </>
      )}
    </nav>
  );
};
