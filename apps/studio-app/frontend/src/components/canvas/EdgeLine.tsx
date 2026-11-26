import React, { useState } from 'react';
import type { GraphEdge, GraphNode } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { getRelationLabel } from '../../i18n/phrases/relations';

interface EdgeLineProps {
  edge: GraphEdge;
  sourceNode: GraphNode | undefined;
  targetNode: GraphNode | undefined;
  isSelected: boolean;
  zoom?: number;
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
  zoom,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const graphCustomization = useGraphStore((s) => s.graphCustomization);
  const selectedNodeId = useGraphStore((s) => s.selectedNodeId);
  const edgeLabelMode = useGraphStore((s) => s.edgeLabelMode);
  const edgeLabelConnectedNodeTypes = useGraphStore((s) => s.edgeLabelConnectedNodeTypes);
  const expandMediatedEdgeNodes = useGraphStore((s) => s.expandMediatedEdgeNodes);
  const { locale } = useI18n();

  if (!sourceNode || !targetNode) return null;
  const x1 = sourceNode.x ?? 0;
  const y1 = sourceNode.y ?? 0;
  const x2 = targetNode.x ?? 0;
  const y2 = targetNode.y ?? 0;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return null;

  // Match actual rendered node diameter from CircularNode.tsx
  const baseNodeSize = graphCustomization?.nodeSize || 56;
  let adaptiveMultiplier = 1.0;
  if (zoom !== undefined) {
    if (zoom < 0.5) adaptiveMultiplier = 0.85;
    else if (zoom > 1.3) adaptiveMultiplier = 1.05;
  }

  const srcSize =
    selectedNodeId === sourceNode.id || sourceNode.radius === 34
      ? Math.round(baseNodeSize * 1.15 * adaptiveMultiplier)
      : Math.round(baseNodeSize * adaptiveMultiplier);
  const tgtSize =
    selectedNodeId === targetNode.id || targetNode.radius === 34
      ? Math.round(baseNodeSize * 1.15 * adaptiveMultiplier)
      : Math.round(baseNodeSize * adaptiveMultiplier);

  const rSrc = srcSize / 2 + 3;
  const rTgt = tgtSize / 2 + 5;

  // If nodes are too close, avoid inverting the segment
  if (dist <= rSrc + rTgt + 4) return null;

  const startX = x1 + (dx * rSrc) / dist;
  const startY = y1 + (dy * rSrc) / dist;
  const endX = x2 - (dx * rTgt) / dist;
  const endY = y2 - (dy * rTgt) / dist;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const color = LAYER_EDGE_COLORS[edge.layer] || 'var(--color-border-default)';
  const isHypothesis = edge.layer === 'HYPOTHESIS';
  const isCandidatePreview = Boolean(edge.properties?.__is_candidate_edge);
  const isMediated = Boolean(edge.properties?.is_mediated);
  const mediatedCount = (edge.properties?.mediated_count as number) || 0;
  const intermediateNodeIds = (edge.properties?.intermediate_node_ids as string[]) || [];
  const confidentialityLevel = (edge.properties?.confidentiality_level as string) || '';

  // Clean, sleek edge stroke width that never overpowers nodes
  const conf = typeof edge.confidence === 'number' ? edge.confidence : 0.85;
  const userThicknessMultiplier = (graphCustomization?.edgeThickness || 2) / 2;
  const baseThickness = Math.max(1.1, Math.min(2.0, 0.9 + conf * 0.9)) * userThicknessMultiplier;

  const isConnectedToMonitoredType = Boolean(
    (sourceNode && edgeLabelConnectedNodeTypes?.has(sourceNode.type)) ||
    (targetNode && edgeLabelConnectedNodeTypes?.has(targetNode.type))
  );

  const isEndpointSelected = Boolean(
    selectedNodeId && (selectedNodeId === edge.source_id || selectedNodeId === edge.target_id)
  );
  const finalStrokeWidth = isSelected
    ? baseThickness + 0.9
    : isHovered || isEndpointSelected
    ? baseThickness + 0.5
    : baseThickness;

  const isFarZoom = zoom !== undefined && zoom < 0.65;

  let showLabels = false;
  if (edgeLabelMode === 'always') {
    showLabels = !isFarZoom;
  } else if (edgeLabelMode === 'none') {
    showLabels = isHovered || isSelected;
  } else {
    showLabels = isHovered || isSelected || isConnectedToMonitoredType;
  }

  const labelFontSize = graphCustomization?.edgeLabelSize || 11;
  const confPercent = Math.round(conf * 100);

  const baseLabel = isMediated
    ? ((edge.properties?.summary_label as string) || `Via (+${mediatedCount})`)
    : getRelationLabel(edge.type, locale);

  const confShortTag =
    confidentialityLevel === 'SECRET_JUDICIAIRE'
      ? ' [SECRET]'
      : confidentialityLevel === 'CONFIDENTIEL_INSTRUCTION'
      ? ' [CONF.]'
      : '';

  const labelText =
    isHovered || isSelected ? `${baseLabel} · ${confPercent}%${confShortTag}` : baseLabel;
  const badgeWidth = Math.max(72, labelText.length * (labelFontSize * 0.65) + 16);
  const badgeHeight = Math.max(19, labelFontSize + 7);

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(edge.id);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (isMediated && intermediateNodeIds.length > 0) {
          expandMediatedEdgeNodes(intermediateNodeIds);
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
    >
      {/* Invisible hit area for easy hover/selection */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={16}
        style={{ pointerEvents: 'stroke' }}
      />

      {/* Sleek Visual Line with fixed userSpaceOnUse arrowhead */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isSelected ? 'var(--color-accent-primary)' : isHovered ? 'var(--color-accent-text)' : color}
        strokeWidth={finalStrokeWidth}
        strokeDasharray={isCandidatePreview ? '6,4' : isHypothesis ? '3,3' : undefined}
        strokeOpacity={
          isCandidatePreview
            ? isSelected
              ? 0.8
              : isHovered
              ? 0.65
              : 0.4
            : isSelected
            ? 0.95
            : isHovered
            ? 0.9
            : 0.78
        }
        markerEnd={`url(#arrow-${edge.layer})`}
        style={{
          transition: 'stroke-width 0.15s ease, stroke 0.15s ease, stroke-opacity 0.15s ease',
        }}
      />

      {/* Edge Label Badge on Hover / Selection */}
      {showLabels && (
        <g transform={`translate(${midX}, ${midY})`} style={{ pointerEvents: 'none' }}>
          <rect
            x={-badgeWidth / 2}
            y={-badgeHeight / 2}
            width={badgeWidth}
            height={badgeHeight}
            rx={4}
            ry={4}
            fill="var(--color-bg-elevated)"
            stroke={isSelected ? 'var(--color-accent-primary)' : 'var(--color-border-default)'}
            strokeWidth={isSelected || isHovered ? 1.2 : 0.8}
          />
          <text
            x={0}
            y={badgeHeight / 4 - 1}
            textAnchor="middle"
            fontSize={`${labelFontSize}px`}
            fontFamily="var(--font-mono)"
            fill={isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)'}
            fontWeight={isSelected || isHovered ? 600 : 500}
            style={{ userSelect: 'none' }}
          >
            {labelText}
          </text>
        </g>
      )}
    </g>
  );
});

EdgeLine.displayName = 'EdgeLine';
