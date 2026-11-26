import React, { useState, useMemo, useRef, useCallback, useId } from 'react';
import type { GraphNode } from '../../types/graph';
import type { Viewport } from './GraphCanvasAdapter';
import { Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';
import { ONTOLOGY_CATEGORY_COLORS, NODE_TYPE_TO_CATEGORY } from '../../store/useGraphStore';

interface CanvasMinimapProps {
  nodes: GraphNode[];
  viewport: Viewport;
  onViewportChange: (panX: number, panY: number, zoom: number) => void;
  containerWidth?: number;
  containerHeight?: number;
}

const LAYER_COLORS: Record<string, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

export const CanvasMinimap: React.FC<CanvasMinimapProps> = ({
  nodes,
  viewport,
  onViewportChange,
  containerWidth = 800,
  containerHeight = 600,
}) => {
  const { tr } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [colorBy, setColorBy] = useState<'entity' | 'layer'>('entity');
  const minimapRef = useRef<SVGSVGElement>(null);
  const isDraggingRef = useRef(false);
  const clipId = useId();

  const MAP_W = 196;
  const MAP_H = 124;
  const PADDING = 72;

  // Compute bounding box of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) {
      return { minX: 0, maxX: 800, minY: 0, maxY: 600, w: 800, h: 600 };
    }
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    nodes.forEach((n) => {
      const x = n.x ?? 500;
      const y = n.y ?? 400;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });

    minX -= PADDING;
    maxX += PADDING;
    minY -= PADDING;
    maxY += PADDING;

    const w = Math.max(maxX - minX, 340);
    const h = Math.max(maxY - minY, 220);

    return { minX, maxX, minY, maxY, w, h };
  }, [nodes]);

  // Isotropic Uniform Scale (Same for X and Y to avoid distortion)
  const { scale, offsetX, offsetY } = useMemo(() => {
    const s = Math.min((MAP_W - 8) / bounds.w, (MAP_H - 8) / bounds.h);
    const ox = (MAP_W - bounds.w * s) / 2;
    const oy = (MAP_H - bounds.h * s) / 2;
    return { scale: s, offsetX: ox, offsetY: oy };
  }, [bounds, MAP_W, MAP_H]);

  // Viewport visible rectangle in minimap coordinates
  const visibleRect = useMemo(() => {
    const safeZoom = Math.max(viewport.zoom, 0.1);
    const graphLeft = -viewport.panX / safeZoom;
    const graphTop = -viewport.panY / safeZoom;
    const graphWidth = containerWidth / safeZoom;
    const graphHeight = containerHeight / safeZoom;

    const rx = (graphLeft - bounds.minX) * scale + offsetX;
    const ry = (graphTop - bounds.minY) * scale + offsetY;
    const rw = graphWidth * scale;
    const rh = graphHeight * scale;

    return {
      x: rx,
      y: ry,
      width: rw,
      height: rh,
    };
  }, [viewport, bounds, scale, offsetX, offsetY, containerWidth, containerHeight]);

  // Move viewport to center on minimap point
  const panToMinimapPoint = useCallback(
    (clientX: number, clientY: number) => {
      const rect = minimapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = clientX - rect.left;
      const clickY = clientY - rect.top;

      const graphX = bounds.minX + (clickX - offsetX) / scale;
      const graphY = bounds.minY + (clickY - offsetY) / scale;

      const nextPanX = -(graphX * viewport.zoom - containerWidth / 2);
      const nextPanY = -(graphY * viewport.zoom - containerHeight / 2);

      onViewportChange(nextPanX, nextPanY, viewport.zoom);
    },
    [bounds, scale, offsetX, offsetY, viewport.zoom, containerWidth, containerHeight, onViewportChange]
  );

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingRef.current = true;
    panToMinimapPoint(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      panToMinimapPoint(moveEvent.clientX, moveEvent.clientY);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`canvas-minimap-card ${isCollapsed ? 'collapsed' : ''}`}
      role="region"
      aria-label={tr('Minicarte radar')}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className={`canvas-minimap-header ${isCollapsed ? 'is-collapsed' : ''}`}>
        <div className="canvas-minimap-title">
          <MapIcon size={12} className="text-accent" />
          <span>{tr('Radar ({n})', { n: nodes.length })}</span>
        </div>
        <button
          type="button"
          className="canvas-minimap-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? tr('Agrandir le radar') : tr('Réduire le radar')}
        >
          {isCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div
            className="canvas-minimap-toolbar"
            role="group"
            aria-label={tr('Coloration du radar')}
          >
            <button
              type="button"
              className={`canvas-minimap-mode-btn ${colorBy === 'entity' ? 'is-active' : ''}`}
              onClick={() => setColorBy('entity')}
              aria-pressed={colorBy === 'entity'}
            >
              {tr('Entités')}
            </button>
            <button
              type="button"
              className={`canvas-minimap-mode-btn ${colorBy === 'layer' ? 'is-active' : ''}`}
              onClick={() => setColorBy('layer')}
              aria-pressed={colorBy === 'layer'}
            >
              {tr('Calques')}
            </button>
          </div>

          <svg
            ref={minimapRef}
            width={MAP_W}
            height={MAP_H}
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="canvas-minimap-svg"
            onMouseDown={handleMouseDown}
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={0} y={0} width={MAP_W} height={MAP_H} rx={4} />
              </clipPath>
            </defs>

            <rect width={MAP_W} height={MAP_H} className="canvas-minimap-bg" />

            <g clipPath={`url(#${clipId})`}>
              <line x1={MAP_W / 2} y1={0} x2={MAP_W / 2} y2={MAP_H} className="canvas-minimap-crosshair" />
              <line x1={0} y1={MAP_H / 2} x2={MAP_W} y2={MAP_H / 2} className="canvas-minimap-crosshair" />

              {nodes.map((n) => {
                const nx = ((n.x ?? 500) - bounds.minX) * scale + offsetX;
                const ny = ((n.y ?? 400) - bounds.minY) * scale + offsetY;
                const catKey = NODE_TYPE_TO_CATEGORY[n.type] || 'acteurs';
                const color =
                  colorBy === 'entity'
                    ? ONTOLOGY_CATEGORY_COLORS[catKey] || 'var(--color-accent-primary)'
                    : LAYER_COLORS[n.layer] || 'var(--color-accent-primary)';
                return (
                  <circle
                    key={n.id}
                    cx={nx}
                    cy={ny}
                    r={2.5}
                    fill={color}
                    opacity={0.92}
                  />
                );
              })}

              <rect
                x={visibleRect.x}
                y={visibleRect.y}
                width={Math.max(visibleRect.width, 6)}
                height={Math.max(visibleRect.height, 6)}
                className="canvas-minimap-viewport-rect"
                rx={2}
              />
            </g>
          </svg>
        </>
      )}
    </div>
  );
};
