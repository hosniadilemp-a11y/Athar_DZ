import React, { useState } from 'react';
import type { GraphEdge, GraphNode } from '../../types/graph';
import type { LayerId } from '../../types/registry';

interface EdgeLineProps {
  edge: GraphEdge;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  isSelected: boolean;
  onSelect: (edgeId: string) => void;
}

const LAYER_EDGE_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

export const EdgeLine: React.FC<EdgeLineProps> = React.memo(({
  edge,
  sourceNode,
  targetNode,
  isSelected,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!sourceNode || !targetNode) return null;
  const x1 = sourceNode.x ?? 0;
  const y1 = sourceNode.y ?? 0;
  const x2 = targetNode.x ?? 0;
  const y2 = targetNode.y ?? 0;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return null;

  // Shorten line to node edge boundaries (radius ~ 28px)
  const rSrc = (sourceNode.radius ?? 28) + 2;
  const rTgt = (targetNode.radius ?? 28) + 4;

  const startX = x1 + (dx * rSrc) / dist;
  const startY = y1 + (dy * rSrc) / dist;
  const endX = x2 - (dx * rTgt) / dist;
  const endY = y2 - (dy * rTgt) / dist;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const color = LAYER_EDGE_COLORS[edge.layer] || 'var(--color-border-default)';
  const isHypothesis = edge.layer === 'HYPOTHESIS';

  // Feature 7: Dynamic thickness by confidence score
  const conf = typeof edge.confidence === 'number' ? edge.confidence : 0.85;
  const baseThickness = Math.max(1.5, Math.min(4.5, conf * 3.5));
  const finalStrokeWidth = isSelected ? baseThickness + 1.8 : isHovered ? baseThickness + 1.0 : baseThickness;

  const confPercent = Math.round(conf * 100);
  const labelText = isHovered || isSelected ? `${edge.type} · ${confPercent}%` : edge.type;
  const badgeWidth = Math.max(70, labelText.length * 7.5 + 16);

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(edge.id);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Invisible wider hit area for easy hover/selection */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={18}
      />

      {/* Visual Line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isSelected ? 'var(--color-accent-primary)' : isHovered ? 'var(--color-accent-subtle)' : color}
        strokeWidth={finalStrokeWidth}
        strokeDasharray={isHypothesis ? '4,4' : undefined}
        strokeOpacity={isSelected ? 1.0 : isHovered ? 0.95 : 0.65}
        markerEnd={`url(#arrow-${edge.layer})`}
        style={{
          transition: 'stroke-width 0.15s ease, stroke 0.15s ease, stroke-opacity 0.15s ease',
        }}
      />

      {/* Feature 7: Enhanced Edge Label Badge */}
      <g transform={`translate(${midX}, ${midY})`} style={{ pointerEvents: 'none' }}>
        <rect
          x={-badgeWidth / 2}
          y={-10}
          width={badgeWidth}
          height={20}
          rx={4}
          ry={4}
          fill="rgba(15, 23, 42, 0.92)"
          stroke={isSelected ? 'var(--color-accent-primary)' : isHovered ? 'var(--color-border-hover)' : 'rgba(255, 255, 255, 0.12)'}
          strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
        />
        <text
          x={0}
          y={4}
          textAnchor="middle"
          fontSize="11px"
          fontFamily="var(--font-mono)"
          fill={isSelected ? 'var(--color-accent-text)' : isHovered ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'}
          fontWeight={isSelected || isHovered ? 600 : 500}
          style={{ userSelect: 'none' }}
        >
          {labelText}
        </text>
      </g>
    </g>
  );
});

EdgeLine.displayName = 'EdgeLine';
