import React, { useState, useEffect, useRef } from 'react';
import type { GraphNode } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
import { MoreHorizontal, Camera, Volume2 } from 'lucide-react';
import {
  useGraphStore,
  ONTOLOGY_CATEGORY_COLORS,
  NODE_TYPE_TO_CATEGORY,
} from '../../store/useGraphStore';

const registry = registryDataRaw as unknown as RegistryData;

interface CircularNodeProps {
  node: GraphNode;
  isSelected: boolean;
  isLinkSource?: boolean;
  isDragging?: boolean;
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
  isLinkSource = false,
  isDragging = false,
  onSelect,
  onContextMenu,
  onDragStart,
}) => {
  const typeDef = registry.node_types[node.type];
  const iconName = typeDef?.icon || 'help-circle';
  const layerDef = registry.layers[node.layer];

  // Global store states
  const snaOverlay = useGraphStore((s) => s.snaVisualOverlay);
  const investigationMode = useGraphStore((s) => s.investigationMode);
  const updateNodeLabel = useGraphStore((s) => s.updateNodeLabel);
  const graphCustomization = useGraphStore((s) => s.graphCustomization);

  // Inline rename state (Feature 2)
  const [isEditing, setIsEditing] = useState(false);
  const [editingLabel, setEditingLabel] = useState(node.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditingLabel(node.label);
  }, [node.label]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSaveLabel = async () => {
    const trimmed = editingLabel.trim();
    if (trimmed && trimmed !== node.label) {
      await updateNodeLabel(node.id, trimmed);
    } else {
      setEditingLabel(node.label);
    }
    setIsEditing(false);
  };

  // Feature 4: SNA Community / Metric colors and badges
  const snaColor = snaOverlay?.nodeColors?.[node.id];
  const snaBadge = snaOverlay?.nodeBadges?.[node.id];

  // Dynamic Sizing & Colors from GraphCustomization
  const baseNodeSize = graphCustomization?.nodeSize || 64;
  const size = isSelected || node.radius === 34 ? Math.round(baseNodeSize * 1.15) : baseNodeSize;
  const halfSize = size / 2;
  const labelSize = graphCustomization?.nodeLabelSize || 12.5;

  const isCategoryMode = graphCustomization?.colorMode !== 'layer';
  const categoryKey = NODE_TYPE_TO_CATEGORY[node.type] || 'acteurs';
  const categoryColor = ONTOLOGY_CATEGORY_COLORS[categoryKey] || '#3b82f6';

  // Border strictly follows Calque (layer) or SNA overlay
  const defaultBorderColor = LAYER_BORDER_COLORS[node.layer] || 'var(--color-border-default)';
  const activeBorderColor = snaColor || defaultBorderColor;
  const iconOrFillColor = isCategoryMode ? categoryColor : activeBorderColor;
  const isHypothesis = node.layer === 'HYPOTHESIS';

  // Evidence / Forensic Portrait Photo
  const photoUrl = (node.properties?.photo_url as string) || (node.properties?.photo as string);
  const hasPhoto = Boolean(photoUrl);
  const showPhoto = hasPhoto && (graphCustomization?.showNodePhotos !== false);

  // Enquêteur Judicial Status
  const statusJudiciaire = (node.properties?.status_judiciaire as string) || (node.properties?.role_judiciaire as string);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(node.id, e.shiftKey || e.ctrlKey);
    } else if (e.key === 'F2') {
      e.preventDefault();
      setIsEditing(true);
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
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        // Feature 5: Smooth Layout transitions when not dragging
        transition: isDragging
          ? 'none'
          : 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1), top 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isSelected ? 15 : isDragging ? 20 : 5,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(node.id, e.shiftKey || e.ctrlKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, node.id);
      }}
      onMouseDown={(e) => {
        if (e.button === 0 && !isEditing) {
          onDragStart(e, node.id);
        }
      }}
      onKeyDown={handleKeyDown}
      className={`canvas-circular-node ${isDragging ? 'is-dragging' : ''}`}
    >
      {/* Circular Body */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-full)',
          background: isCategoryMode
            ? `radial-gradient(circle, ${categoryColor}28 0%, var(--color-bg-surface) 72%)`
            : `radial-gradient(circle, ${activeBorderColor}24 0%, var(--color-bg-surface) 72%)`,
          borderWidth: isHypothesis ? '2.5px' : '2.5px',
          borderStyle: isHypothesis ? 'dashed' : 'solid',
          borderColor: isLinkSource ? 'var(--color-status-warning)' : activeBorderColor,
          boxShadow: isLinkSource
            ? '0 0 0 4px var(--color-status-warning), 0 0 16px rgba(245, 158, 11, 0.6)'
            : snaColor
            ? `0 0 0 3px ${snaColor}44, 0 0 14px ${snaColor}88`
            : isSelected
            ? '0 0 0 3.5px var(--color-accent-subtle), 0 0 14px rgba(37, 99, 235, 0.45)'
            : '0 2px 6px rgba(0, 0, 0, 0.28)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible',
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {/* Forensic Photo / Portrait if available */}
        {showPhoto ? (
          <img
            src={photoUrl}
            alt={node.label}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 'var(--radius-full)',
              objectFit: 'cover',
              display: 'block',
              pointerEvents: 'none',
            }}
          />
        ) : (
          <NodeIcon
            name={iconName}
            size={Math.max(22, Math.round(size * 0.42))}
            style={{ color: iconOrFillColor }}
          />
        )}

        {/* Small badge icon indicating real photographic evidence attached */}
        {hasPhoto && (
          <span
            title="Preuve photographique / portrait judiciaire certifié"
            style={{
              position: 'absolute',
              bottom: '-3px',
              left: '-3px',
              width: '18px',
              height: '18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: `1.5px solid ${categoryColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: categoryColor,
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              zIndex: 3,
            }}
          >
            <Camera size={10} />
          </span>
        )}

        {/* Small badge icon indicating audio wiretap / vocal evidence attached */}
        {(Boolean(node.properties?.audio_url) || node.type === 'enregistrement_vocal') && (
          <span
            title="Scellé audio judiciaire (Darija algéroise disponible)"
            style={{
              position: 'absolute',
              bottom: '-3px',
              left: hasPhoto ? '18px' : '-3px',
              width: '18px',
              height: '18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1.5px solid #a855f7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#a855f7',
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              zIndex: 3,
            }}
          >
            <Volume2 size={10} />
          </span>
        )}

        {/* Feature 4: SNA Result Badge (Rank or Cluster) */}
        {snaBadge && (
          <span
            className="sna-node-pill"
            style={{
              position: 'absolute',
              top: '-8px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: snaColor || 'var(--color-accent-primary)',
              color: '#ffffff',
              fontSize: '10.5px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap',
              zIndex: 4,
            }}
          >
            {snaBadge}
          </span>
        )}

        {/* Confidence chip in Analyst mode */}
        {investigationMode === 'analyst' &&
          node.confidence !== null &&
          node.confidence !== undefined &&
          node.confidence < 1.0 && (
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
                zIndex: 4,
              }}
            >
              {Math.round(node.confidence * 100)}%
            </span>
          )}

        {/* Context Menu Button */}
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
            zIndex: 4,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, node.id);
          }}
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Feature 10: Enquêteur Mode Procedural Status Pill */}
      {investigationMode === 'investigator' && statusJudiciaire && (
        <div
          style={{
            marginTop: '4px',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '0.3px',
            textTransform: 'uppercase',
            color: '#ffffff',
            backgroundColor: statusJudiciaire.toLowerCase().includes('mandat')
              ? '#dc2626'
              : statusJudiciaire.toLowerCase().includes('examen')
              ? '#ea580c'
              : statusJudiciaire.toLowerCase().includes('garde')
              ? '#d97706'
              : 'var(--color-accent-primary)',
            padding: '1px 6px',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            maxWidth: '140px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {statusJudiciaire}
        </div>
      )}

      {/* Feature 2: Node Label or Inline Rename Input */}
      {isEditing ? (
        <div
          style={{
            marginTop: '4px',
            position: 'relative',
            zIndex: 30,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <input
            ref={inputRef}
            type="text"
            className="node-rename-input"
            value={editingLabel}
            onChange={(e) => setEditingLabel(e.target.value)}
            onBlur={handleSaveLabel}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter') handleSaveLabel();
              if (e.key === 'Escape') {
                setEditingLabel(node.label);
                setIsEditing(false);
              }
            }}
            style={{
              fontSize: `${labelSize}px`,
              fontFamily: 'var(--font-sans)',
              padding: '2px 6px',
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-accent-primary)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              width: '140px',
              textAlign: 'center',
              boxShadow: '0 0 8px rgba(37, 99, 235, 0.5)',
            }}
            aria-label="Modifier le libellé du nœud"
          />
        </div>
      ) : (
        <div
          title={`${node.label} (Double-cliquer pour renommer)`}
          style={{
            marginTop: '4px',
            fontSize: `${labelSize}px`,
            lineHeight: '1.25',
            fontFamily: 'var(--font-sans)',
            color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
            fontWeight: isSelected ? 700 : 500,
            textAlign: 'center',
            maxWidth: '160px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'auto',
            backgroundColor: 'var(--color-bg-elevated)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            border: isSelected
              ? '1px solid var(--color-accent-primary)'
              : '1px solid var(--color-border-subtle)',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.22)',
            backdropFilter: 'blur(4px)',
            cursor: 'text',
          }}
        >
          {node.label}
        </div>
      )}
    </div>
  );
});

CircularNode.displayName = 'CircularNode';
