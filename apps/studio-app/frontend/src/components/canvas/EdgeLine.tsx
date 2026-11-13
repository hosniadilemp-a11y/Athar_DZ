import React from 'react';
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

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(edge.id);
      }}
      style={{ cursor: 'pointer' }}
    >
      {/* Invisible wider stroke for easier clicking */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={14}
      />
      {/* Visual Line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isSelected ? 'var(--color-accent-primary)' : color}
        strokeWidth={isSelected ? 2.5 : 1.5}
        strokeDasharray={isHypothesis ? '4,4' : undefined}
        strokeOpacity={isSelected ? 1.0 : 0.65}
        markerEnd={`url(#arrow-${edge.layer})`}
      />
      {/* Edge label */}
      <text
        x={midX}
        y={midY - 4}
        textAnchor="middle"
        fontSize="12px"
        fontFamily="var(--font-mono)"
        fill={isSelected ? 'var(--color-accent-text)' : 'var(--color-text-muted)'}
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {edge.type}
      </text>
    </g>
  );
});

EdgeLine.displayName = 'EdgeLine';
