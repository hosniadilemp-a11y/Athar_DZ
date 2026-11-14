import React, { useState, useMemo, useRef, useCallback } from 'react';
import type { GraphNode } from '../../types/graph';
import type { Viewport } from './GraphCanvasAdapter';
import { Map as MapIcon, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const minimapRef = useRef<SVGSVGElement>(null);

  const MAP_W = 160;
  const MAP_H = 110;
  const PADDING = 100;

  // Compute bounding box of all nodes
  const bounds = useMemo(() => {
    if (nodes.length === 0) {
      return { minX: 0, maxX: 1000, minY: 0, maxY: 800, w: 1000, h: 800 };
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

    const w = Math.max(maxX - minX, 600);
    const h = Math.max(maxY - minY, 400);

    return { minX, maxX, minY, maxY, w, h };
  }, [nodes]);

  // Viewport visible rectangle in graph coordinate space
  const visibleRect = useMemo(() => {
    const left = -viewport.panX / viewport.zoom;
    const top = -viewport.panY / viewport.zoom;
    const width = containerWidth / viewport.zoom;
    const height = containerHeight / viewport.zoom;

    // Scale to minimap SVG coordinates
    const scaleX = MAP_W / bounds.w;
    const scaleY = MAP_H / bounds.h;

    const rx = (left - bounds.minX) * scaleX;
    const ry = (top - bounds.minY) * scaleY;
    const rw = width * scaleX;
    const rh = height * scaleY;

    return {
      x: Math.max(0, rx),
      y: Math.max(0, ry),
      width: Math.min(MAP_W, rw),
      height: Math.min(MAP_H, rh),
    };
  }, [viewport, bounds, containerWidth, containerHeight]);

  // Click on minimap to pan viewport
  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const rect = minimapRef.current?.getBoundingClientRect();
      if (!rect) return;

      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const graphX = bounds.minX + (clickX / MAP_W) * bounds.w;
      const graphY = bounds.minY + (clickY / MAP_H) * bounds.h;

      const nextPanX = -(graphX * viewport.zoom - containerWidth / 2);
      const nextPanY = -(graphY * viewport.zoom - containerHeight / 2);

      onViewportChange(nextPanX, nextPanY, viewport.zoom);
    },
    [bounds, viewport.zoom, containerWidth, containerHeight, onViewportChange]
  );

  return (
    <div className={`canvas-minimap-card ${isCollapsed ? 'collapsed' : ''}`} role="region" aria-label="Minicarte radar du graphe">
      <div className="canvas-minimap-header">
        <div className="canvas-minimap-title">
          <MapIcon size={11} className="text-accent" />
          <span>Radar ({nodes.length})</span>
        </div>
        <button
          type="button"
          className="canvas-minimap-toggle"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Agrandir le radar' : 'Réduire le radar'}
        >
          {isCollapsed ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {!isCollapsed && (
        <svg
          ref={minimapRef}
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="canvas-minimap-svg"
          onClick={handleMinimapClick}
        >
          {/* Background rect */}
          <rect width={MAP_W} height={MAP_H} fill="var(--color-bg-base)" rx={4} />

          {/* Node dots */}
          {nodes.map((n) => {
            const nx = (( (n.x ?? 500) - bounds.minX) / bounds.w) * MAP_W;
            const ny = (( (n.y ?? 400) - bounds.minY) / bounds.h) * MAP_H;
            const color = LAYER_COLORS[n.layer] || 'var(--color-accent-primary)';
            return (
              <circle
                key={n.id}
                cx={nx}
                cy={ny}
                r={2}
                fill={color}
                opacity={0.85}
              />
            );
          })}

          {/* Viewport boundary box */}
          <rect
            x={visibleRect.x}
            y={visibleRect.y}
            width={visibleRect.width}
            height={visibleRect.height}
            fill="rgba(59, 130, 246, 0.15)"
            stroke="var(--color-accent-primary)"
            strokeWidth={1.5}
            rx={2}
          />
        </svg>
      )}
    </div>
  );
};
