import React from 'react';
import type { GraphNode } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
import { MoreHorizontal } from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

interface CircularNodeProps {
  node: GraphNode;
  isSelected: boolean;
  onSelect: (id: string, isMulti: boolean) => void;
  onContextMenu: (e: React.MouseEvent | React.KeyboardEvent, nodeId: string) => void;
  onDragStart: (e: React.MouseEvent, nodeId: string) => void;
}

const LAYER_BORDER_COLORS: Record<LayerId, string> = {
  VERIFIED: 'var(--color-layer-1-verified)',
  OSINT_RAW: 'var(--color-layer-2-osint)',
  INFRA: 'var(--color-layer-3-infra)',
  HYPOTHESIS: 'var(--color-layer-4-hypothesis)',
  FLOWS: 'var(--color-layer-5-flows)',
};

export const CircularNode: React.FC<CircularNodeProps> = React.memo(({
  node,
  isSelected,
  onSelect,
  onContextMenu,
  onDragStart,
}) => {
  const typeDef = registry.node_types[node.type];
  const iconName = typeDef?.icon || 'help-circle';
  const layerDef = registry.layers[node.layer];

  const borderColor = LAYER_BORDER_COLORS[node.layer] || 'var(--color-border-default)';
  const isHypothesis = node.layer === 'HYPOTHESIS';
  const size = isSelected || node.radius === 34 ? 68 : 56;
  const halfSize = size / 2;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(node.id, e.shiftKey || e.ctrlKey);
    } else if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      onContextMenu(e, node.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${node.label} (${typeDef?.label_fr || node.type}, couche ${layerDef?.label_fr || node.layer})`}
      aria-pressed={isSelected}
      style={{
        position: 'absolute',
        left: `${(node.x ?? 0) - halfSize}px`,
        top: `${(node.y ?? 0) - halfSize}px`,
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        userSelect: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id, e.shiftKey || e.ctrlKey);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node.id);
      }}
      onMouseDown={(e) => {
        if (e.button === 0) {
          onDragStart(e, node.id);
        }
      }}
      onKeyDown={handleKeyDown}
      className="canvas-circular-node"
    >
      {/* Circular Body */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-surface)',
          borderWidth: isHypothesis ? '2.5px' : '2px',
          borderStyle: isHypothesis ? 'dashed' : 'solid',
          borderColor: borderColor,
          boxShadow: isSelected
            ? '0 0 0 3px var(--color-accent-subtle), 0 0 12px rgba(37, 99, 235, 0.4)'
            : '0 2px 4px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transition: 'transform 0.1s ease, box-shadow 0.1s ease',
        }}
      >
        <NodeIcon name={iconName} size={size === 68 ? 26 : 22} style={{ color: borderColor }} />

        {/* Confidence chip if confidence < 1.0 */}
        {node.confidence !== null && node.confidence !== undefined && node.confidence < 1.0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              padding: '1px 4px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-default)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {Math.round(node.confidence * 100)}%
          </span>
        )}

        {/* Context Menu Button for keyboard / accessibility */}
        <button
          type="button"
          aria-label={`Options pour ${node.label}`}
          style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            width: '18px',
            height: '18px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-default)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
            color: 'var(--color-text-muted)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, node.id);
          }}
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Node Text Label below */}
      <div
        title={node.label}
        style={{
          marginTop: 'var(--space-1)',
          fontSize: 'var(--text-xs)',
          fontFamily: 'var(--font-sans)',
          color: isSelected ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          fontWeight: isSelected ? 600 : 400,
          textAlign: 'center',
          maxWidth: '120px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          pointerEvents: 'none',
        }}
      >
        {node.label}
      </div>
    </div>
  );
});

CircularNode.displayName = 'CircularNode';
