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

  // Dynamically adapt arrow endpoint to actual node radius
  const baseNodeSize = graphCustomization?.nodeSize || 64;
  const srcBaseRadius = (sourceNode.radius && sourceNode.radius !== 28 ? sourceNode.radius : baseNodeSize / 2);
  const tgtBaseRadius = (targetNode.radius && targetNode.radius !== 28 ? targetNode.radius : baseNodeSize / 2);
  const rSrc = srcBaseRadius + 2;
  const rTgt = tgtBaseRadius + 4;

  const startX = x1 + (dx * rSrc) / dist;
  const startY = y1 + (dy * rSrc) / dist;
  const endX = x2 - (dx * rTgt) / dist;
  const endY = y2 - (dy * rTgt) / dist;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  const color = LAYER_EDGE_COLORS[edge.layer] || 'var(--color-border-default)';
  const isHypothesis = edge.layer === 'HYPOTHESIS';

  // Feature 7 & Customization: Dynamic thickness by confidence and user slider
  const conf = typeof edge.confidence === 'number' ? edge.confidence : 0.85;
  const userThicknessMultiplier = (graphCustomization?.edgeThickness || 2) / 2;
  const baseThickness = Math.max(1.5, Math.min(4.5, conf * 3.5)) * userThicknessMultiplier;
  const edgeLabelMode = useGraphStore((s) => s.edgeLabelMode);
  const edgeLabelConnectedNodeTypes = useGraphStore((s) => s.edgeLabelConnectedNodeTypes);
  const expandMediatedEdgeNodes = useGraphStore((s) => s.expandMediatedEdgeNodes);

  const isMediated = Boolean(edge.properties?.is_mediated);
  const mediatedCount = (edge.properties?.mediated_count as number) || 0;
  const intermediateNodeIds = (edge.properties?.intermediate_node_ids as string[]) || [];
  const confidentialityLevel = (edge.properties?.confidentiality_level as string) || '';

  // Link to specific node types if chosen by user (e.g. user selected 'personne'):
  const isConnectedToMonitoredType = Boolean(
    (sourceNode && edgeLabelConnectedNodeTypes?.has(sourceNode.type)) ||
    (targetNode && edgeLabelConnectedNodeTypes?.has(targetNode.type))
  );

  const isEndpointSelected = Boolean(selectedNodeId && (selectedNodeId === edge.source_id || selectedNodeId === edge.target_id));
  const finalStrokeWidth = isSelected
    ? baseThickness + 1.8
    : isHovered || isEndpointSelected
    ? baseThickness + 1.0
    : isMediated
    ? baseThickness + 0.6
    : baseThickness;

  const isFarZoom = zoom !== undefined && zoom < 0.65;

  let showLabels = false;
  if (edgeLabelMode === 'always') {
    showLabels = !isFarZoom;
  } else if (edgeLabelMode === 'none') {
    showLabels = isHovered || isSelected;
  } else {
    // default 'hover' (or mediated counter pill on hover/select)
    showLabels = isHovered || isSelected || isConnectedToMonitoredType;
  }

  const labelFontSize = graphCustomization?.edgeLabelSize || 11;
  const confPercent = Math.round(conf * 100);

  // Human-readable relation name in active language
  const baseLabel = isMediated
    ? ((edge.properties?.summary_label as string) || `Lien médié (+${mediatedCount})`)
    : getRelationLabel(edge.type, locale);

  const confShortTag =
    confidentialityLevel === 'SECRET_JUDICIAIRE'
      ? ' [SECRET]'
      : confidentialityLevel === 'CONFIDENTIEL_INSTRUCTION'
      ? ' [CONF.]'
      : '';

  const labelText =
    isHovered || isSelected ? `${baseLabel} · ${confPercent}%${confShortTag}` : baseLabel;
  const badgeWidth = Math.max(78, labelText.length * (labelFontSize * 0.66) + 20);
  const badgeHeight = Math.max(20, labelFontSize + 8);

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
      {/* Invisible wider hit area for easy hover/selection */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke="transparent"
        strokeWidth={Math.max(22, finalStrokeWidth * 3.5)}
        style={{ pointerEvents: 'stroke' }}
      />

      {/* Visual Line */}
      <line
        x1={startX}
        y1={startY}
        x2={endX}
        y2={endY}
        stroke={isSelected ? 'var(--color-accent-primary)' : isHovered ? 'var(--color-accent-subtle)' : color}
        strokeWidth={finalStrokeWidth}
        strokeDasharray={isMediated ? '8,4' : isHypothesis ? '4,4' : undefined}
        strokeOpacity={isSelected ? 1.0 : isHovered ? 0.95 : 0.72}
        markerEnd={`url(#arrow-${edge.layer})`}
        style={{
          transition: 'stroke-width 0.15s ease, stroke 0.15s ease, stroke-opacity 0.15s ease',
        }}
      />

      {/* Compact Mediated Counter Dot when not hovered so user sees indirect connection count */}
      {isMediated && !showLabels && (
        <g
          transform={`translate(${midX}, ${midY})`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(edge.id);
          }}
        >
          <rect
            x={-16}
            y={-9}
            width={32}
            height={18}
            rx={9}
            ry={9}
            fill="var(--color-bg-elevated)"
            stroke={color}
            strokeWidth={1.2}
          />
          <text
            x={0}
            y={3.5}
            textAnchor="middle"
            fontSize="10px"
            fontFamily="var(--font-mono)"
            fill="var(--color-text-primary)"
            fontWeight={700}
            style={{ userSelect: 'none' }}
          >
            +{mediatedCount}
          </text>
        </g>
      )}

      {/* Feature 7 & Customization: Edge Label Badge with Light-Mode Fix */}
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
            stroke={isSelected ? 'var(--color-accent-primary)' : isHovered ? 'var(--color-border-hover)' : 'var(--color-border-default)'}
            strokeWidth={isSelected || isHovered ? 1.4 : 0.8}
            style={{
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))',
            }}
          />
          <text
            x={0}
            y={badgeHeight / 4 - 1}
            textAnchor="middle"
            fontSize={`${labelFontSize}px`}
            fontFamily="var(--font-mono)"
            fill={isSelected ? 'var(--color-accent-text)' : isHovered ? 'var(--color-text-primary)' : 'var(--color-text-primary)'}
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
