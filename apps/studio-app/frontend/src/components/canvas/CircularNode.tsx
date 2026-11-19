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
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

interface CircularNodeProps {
  node: GraphNode;
  isSelected: boolean;
  isLinkSource?: boolean;
  isDragging?: boolean;
  zoom?: number;
  hiddenNeighborsCount?: number;
  expandedNeighborsCount?: number;
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

/**
 * Smart Short Label generator for uncluttered graph canvas:
 * Returns a concise, compact identifier on canvas, while the full label
 * is revealed on hover or selection.
 */
function getSmartShortLabel(label: string, type: string): string {
  if (!label) return '';
  const trimmed = label.trim();
  if (type === 'personne') {
    const parts = trimmed.split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0].charAt(0)}. ${parts[1].slice(0, 10)}`;
    }
    return trimmed.length > 12 ? `${trimmed.slice(0, 10)}…` : trimmed;
  }
  if (type === 'telephone' || type === 'carte_sim' || type === 'appareil_mobile') {
    if (trimmed.length > 8) {
      return `…${trimmed.slice(-6)}`;
    }
    return trimmed;
  }
  if (type === 'compte_bancaire' || type === 'crypto_wallet') {
    if (trimmed.length > 8) {
      return `…${trimmed.slice(-6)}`;
    }
    return trimmed;
  }
  if (trimmed.length > 13) {
    return `${trimmed.slice(0, 11)}…`;
  }
  return trimmed;
}

export const CircularNode: React.FC<CircularNodeProps> = React.memo(({
  node,
  isSelected,
  isLinkSource = false,
  isDragging = false,
  zoom,
  hiddenNeighborsCount = 0,
  expandedNeighborsCount = 0,
  onSelect,
  onContextMenu,
  onDragStart,
}) => {
  const { trLabel } = useI18n();
  const typeDef = registry.node_types[node.type];
  const iconName = typeDef?.icon || 'help-circle';
  const layerDef = registry.layers[node.layer];
  const localizedNodeLabel = trLabel(node.label);

  // Hover state for LOD override
  const [isHovered, setIsHovered] = useState(false);

  // Global store states
  const snaOverlay = useGraphStore((s) => s.snaVisualOverlay);
  const investigationMode = useGraphStore((s) => s.investigationMode);
  const updateNodeLabel = useGraphStore((s) => s.updateNodeLabel);
  const graphCustomization = useGraphStore((s) => s.graphCustomization);
  const visibleNodeLabelTypes = useGraphStore((s) => s.visibleNodeLabelTypes);
  const forcedVisibleNodeLabelIds = useGraphStore((s) => s.forcedVisibleNodeLabelIds);
  const forcedHiddenNodeLabelIds = useGraphStore((s) => s.forcedHiddenNodeLabelIds);
  const toggleExpandNodeConnections = useGraphStore((s) => s.toggleExpandNodeConnections);

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

  // Dynamic Sizing & Colors from GraphCustomization + Adaptive Zoom Scaling
  const baseNodeSize = graphCustomization?.nodeSize || 64;

  let adaptiveMultiplier = 1.0;
  if (zoom !== undefined) {
    if (zoom < 0.5) adaptiveMultiplier = 0.85;
    else if (zoom > 1.3) adaptiveMultiplier = 1.05;
  }

  const size = isSelected || node.radius === 34 ? Math.round(baseNodeSize * 1.15 * adaptiveMultiplier) : Math.round(baseNodeSize * adaptiveMultiplier);
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
  const [imgError, setImgError] = useState(false);
  const hasPhoto = Boolean(photoUrl);
  const showPhoto = hasPhoto && (graphCustomization?.showNodePhotos !== false) && !imgError;

  // Enquêteur Judicial Status
  const statusJudiciaire = (node.properties?.status_judiciaire as string) || (node.properties?.role_judiciaire as string);

  // Level of Detail (LOD) Strategy based on Zoom & Label Density Mode
  const labelDensityMode = graphCustomization?.labelDensityMode || 'smart';
  const isKeyTarget = Boolean(
    statusJudiciaire?.toUpperCase().includes('MANDAT') ||
    statusJudiciaire?.toUpperCase().includes('SUSPECT') ||
    snaBadge?.includes('#1') ||
    snaBadge?.includes('#2') ||
    snaBadge?.includes('#3')
  );
  const isExtremeZoom = zoom !== undefined && zoom < 0.35;
  const isFarZoom = zoom !== undefined && zoom >= 0.35 && zoom < 0.55;

  const isExplicitlyForcedVisible = forcedVisibleNodeLabelIds?.has(node.id);
  const isExplicitlyForcedHidden = forcedHiddenNodeLabelIds?.has(node.id);
  const isTypeVisible = visibleNodeLabelTypes?.has(node.type);
  const isPerson = node.type === 'personne';

  let showLabel = false;
  if (isExplicitlyForcedHidden) {
    showLabel = false;
  } else if (isExplicitlyForcedVisible) {
    showLabel = true;
  } else if (labelDensityMode === 'all') {
    showLabel = !isExtremeZoom;
  } else if (labelDensityMode === 'none') {
    showLabel = false;
  } else {
    // Strictly obeys the user's node label selection in Visibilité & Étiquettes (fixed, no hover pop-in)
    showLabel = Boolean(isTypeVisible);
  }

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
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        transition: isDragging
          ? 'none'
          : 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1), top 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isHovered ? 60 : isDragging ? 50 : isSelected ? 30 : 10,
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`canvas-circular-node ${isDragging ? 'is-dragging' : ''}`}
    >
      {/* Circular Body (100% Solid Opaque, Non-transparent) */}
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: 'var(--radius-full)',
          backgroundColor: '#182234', // Solid opaque base preventing underlying edges from showing through
          background: isCategoryMode
            ? `radial-gradient(circle, ${categoryColor}3d 0%, #182234 85%)`
            : `radial-gradient(circle, ${activeBorderColor}36 0%, #182234 85%)`,
          borderWidth: isHypothesis ? '2.5px' : '2.5px',
          borderStyle: isHypothesis ? 'dashed' : 'solid',
          borderColor: isLinkSource ? 'var(--color-status-warning)' : activeBorderColor,
          boxShadow: isHovered
            ? `0 0 0 3.5px var(--color-accent-primary), 0 8px 24px rgba(0, 0, 0, 0.7)`
            : isLinkSource
            ? '0 0 0 4px var(--color-status-warning), 0 0 16px rgba(245, 158, 11, 0.6)'
            : snaColor
            ? `0 0 0 3px ${snaColor}44, 0 0 14px ${snaColor}88`
            : isSelected
            ? '0 0 0 3.5px var(--color-accent-subtle), 0 0 14px rgba(37, 99, 235, 0.45)'
            : '0 2px 8px rgba(0, 0, 0, 0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'visible',
          opacity: 1,
          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        }}
      >
        {/* Forensic Photo / Portrait if available */}
        {showPhoto ? (
          <img
            src={photoUrl}
            alt={node.label}
            onError={() => setImgError(true)}
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

        {/* Clickable Granular Expansion Badge (+N hidden connected entities / -N collapse) */}
        {(hiddenNeighborsCount > 0 || expandedNeighborsCount > 0) && (
          <button
            type="button"
            title={
              hiddenNeighborsCount > 0
                ? `Cliquer pour déplier ${hiddenNeighborsCount} entité(s) cachée(s) liée(s) à ${node.label}`
                : `Cliquer pour replier ${expandedNeighborsCount} entité(s) liée(s) à ${node.label}`
            }
            aria-label={
              hiddenNeighborsCount > 0
                ? `Déplier ${hiddenNeighborsCount} entités liées`
                : `Replier ${expandedNeighborsCount} entités liées`
            }
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpandNodeConnections(node.id);
            }}
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              minWidth: '20px',
              height: '20px',
              borderRadius: 'var(--radius-full)',
              backgroundColor:
                hiddenNeighborsCount > 0
                  ? 'var(--color-accent-primary)'
                  : 'var(--color-bg-elevated)',
              color:
                hiddenNeighborsCount > 0
                  ? 'var(--color-text-on-accent)'
                  : 'var(--color-text-secondary)',
              border: '1.5px solid var(--color-border-default)',
              fontSize: '10px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '0 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-xs)',
              zIndex: 6,
            }}
          >
            {hiddenNeighborsCount > 0 ? `+${hiddenNeighborsCount}` : `-${expandedNeighborsCount}`}
          </button>
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
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onContextMenu(e, node.id);
          }}
        >
          <MoreHorizontal size={12} />
        </button>
      </div>

      {/* Fixed Label Below Circle (Positioned absolutely so circle never moves on hover) */}
      {showLabel && (
        isEditing ? (
          <div
            style={{
              position: 'absolute',
              top: `${size + 5}px`,
              left: '50%',
              transform: 'translateX(-50%)',
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
                width: '130px',
                textAlign: 'center',
                boxShadow: 'var(--shadow-sm)',
              }}
              aria-label="Modifier le libellé du nœud"
            />
          </div>
        ) : (
          <div
            title={localizedNodeLabel}
            style={{
              position: 'absolute',
              top: `${size + 5}px`,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: isFarZoom ? '9.5px' : '10.5px',
              lineHeight: '1.2',
              fontFamily: 'var(--font-sans)',
              color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
              fontWeight: isSelected || isKeyTarget || isPerson ? 600 : 500,
              textAlign: 'center',
              maxWidth: '105px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              pointerEvents: 'none',
              backgroundColor: 'var(--color-bg-elevated)',
              padding: '1.5px 7px',
              borderRadius: '10px',
              border: isSelected
                ? '1.5px solid var(--color-accent-primary)'
                : '1px solid var(--color-border-default)',
              boxShadow: 'var(--shadow-xs)',
              zIndex: 12,
            }}
          >
            {getSmartShortLabel(localizedNodeLabel, node.type)}
          </div>
        )
      )}
    </div>
  );
});

CircularNode.displayName = 'CircularNode';
