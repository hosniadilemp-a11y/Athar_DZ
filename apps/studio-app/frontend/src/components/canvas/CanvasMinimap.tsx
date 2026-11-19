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
  const isDraggingRef = useRef(false);

  const MAP_W = 170;
  const MAP_H = 115;
  const PADDING = 80;

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

  // Isotropic Uniform Scale (Same for X and Y to avoid distortion)
  const { scale, offsetX, offsetY } = useMemo(() => {
    const s = Math.min((MAP_W - 8) / bounds.w, (MAP_H - 8) / bounds.h);
    const ox = (MAP_W - bounds.w * s) / 2;
    const oy = (MAP_H - bounds.h * s) / 2;
    return { scale: s, offsetX: ox, offsetY: oy };
  }, [bounds, MAP_W, MAP_H]);

  // Viewport visible rectangle in minimap coordinates
  const visibleRect = useMemo(() => {
    // Current visible box in graph space
    const graphLeft = -viewport.panX / viewport.zoom;
    const graphTop = -viewport.panY / viewport.zoom;
    const graphWidth = containerWidth / viewport.zoom;
    const graphHeight = containerHeight / viewport.zoom;

    // Convert to minimap coordinates
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

      // Invert coordinates to graph space
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
      aria-label="Minicarte radar du graphe"
      style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        zIndex: 25,
        backgroundColor: 'var(--color-bg-surface)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <div
        className="canvas-minimap-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 8px',
          borderBottom: isCollapsed ? 'none' : '1px solid var(--color-border-subtle)',
          backgroundColor: 'var(--color-bg-elevated)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 600 }}>
          <MapIcon size={12} style={{ color: 'var(--color-accent-text)' }} />
          <span>Radar ({nodes.length})</span>
        </div>
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Agrandir le radar' : 'Réduire le radar'}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '1px', display: 'flex' }}
        >
          {isCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {!isCollapsed && (
        <svg
          ref={minimapRef}
          width={MAP_W}
          height={MAP_H}
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          className="canvas-minimap-svg"
          onMouseDown={handleMouseDown}
          style={{ display: 'block', cursor: 'crosshair', backgroundColor: 'var(--color-bg-base)' }}
        >
          <defs>
            <clipPath id="minimap-frame-clip">
              <rect x={0} y={0} width={MAP_W} height={MAP_H} rx={4} />
            </clipPath>
          </defs>

          {/* Background */}
          <rect width={MAP_W} height={MAP_H} fill="var(--color-bg-base)" />

          {/* Group clipped to minimap frame */}
          <g clipPath="url(#minimap-frame-clip)">
            {/* Grid crosshair reference */}
            <line x1={MAP_W / 2} y1={0} x2={MAP_W / 2} y2={MAP_H} stroke="var(--color-border-subtle)" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />
            <line x1={0} y1={MAP_H / 2} x2={MAP_W} y2={MAP_H / 2} stroke="var(--color-border-subtle)" strokeWidth={0.5} strokeDasharray="3 3" opacity={0.4} />

            {/* Node dots in isotropic space */}
            {nodes.map((n) => {
              const nx = ((n.x ?? 500) - bounds.minX) * scale + offsetX;
              const ny = ((n.y ?? 400) - bounds.minY) * scale + offsetY;
              const color = LAYER_COLORS[n.layer] || 'var(--color-accent-primary)';
              return (
                <circle
                  key={n.id}
                  cx={nx}
                  cy={ny}
                  r={2.2}
                  fill={color}
                  opacity={0.85}
                />
              );
            })}

            {/* Viewport exact boundary box matching screen visible region */}
            <rect
              x={visibleRect.x}
              y={visibleRect.y}
              width={visibleRect.width}
              height={visibleRect.height}
              fill="rgba(59, 130, 246, 0.18)"
              stroke="var(--color-accent-text)"
              strokeWidth={1.5}
              rx={2}
            />
          </g>
        </svg>
      )}
    </div>
  );
};
