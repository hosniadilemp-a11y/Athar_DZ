import React, { useState, useEffect, useRef } from 'react';
import type { GraphNode } from '../../types/graph';
import type { LayerId } from '../../types/registry';
import { NodeIcon } from './NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
import {
  ArrowLeftRight,
  Clock,
  Eye,
  HeartHandshake,
  MoreHorizontal,
  Pin,
  ScanSearch,
  Shield,
  ShieldAlert,
  User,
  UserCheck,
  Users,
  Volume2,
} from 'lucide-react';
import { useGraphStore, ONTOLOGY_CATEGORY_COLORS, NODE_TYPE_TO_CATEGORY } from '../../store/useGraphStore';
import { getLocalFileEntry } from '../../utils/localFileStore';
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

interface CircularNodeProps {
  node: GraphNode;
  isSelected: boolean;
  isLinkSource?: boolean;
  isDragging?: boolean;
  isBoundaryAnchor?: boolean;
  isSharedAsset?: boolean;
  isDbMatch?: boolean;
  isDbMatchHighlighted?: boolean;
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
  isBoundaryAnchor = false,
  isSharedAsset = false,
  isDbMatch = false,
  isDbMatchHighlighted = false,
  zoom,
  hiddenNeighborsCount = 0,
  expandedNeighborsCount = 0,
  onSelect,
  onContextMenu,
  onDragStart,
}) => {
  const { tr, trLabel } = useI18n();
  const typeDef = registry.node_types[node.type];
  const customIcon =
    typeof node.properties?.custom_icon === 'string' && node.properties.custom_icon
      ? node.properties.custom_icon
      : null;
  const iconName = customIcon || typeDef?.icon || 'help-circle';
  const layerDef = registry.layers[node.layer];
  const localizedNodeLabel = trLabel(node.label);

  // Hover state for LOD override
  const [isHovered, setIsHovered] = useState(false);

  // Global store states
  const snaOverlay = useGraphStore((s) => s.snaVisualOverlay);
  const updateNodeLabel = useGraphStore((s) => s.updateNodeLabel);
  const graphCustomization = useGraphStore((s) => s.graphCustomization);
  const visibleNodeLabelTypes = useGraphStore((s) => s.visibleNodeLabelTypes);
  const forcedVisibleNodeLabelIds = useGraphStore((s) => s.forcedVisibleNodeLabelIds);
  const forcedHiddenNodeLabelIds = useGraphStore((s) => s.forcedHiddenNodeLabelIds);
  const toggleExpandNodeConnections = useGraphStore((s) => s.toggleExpandNodeConnections);
  const isPinned = useGraphStore((s) => s.pinnedNodeIds.has(node.id));

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
  const baseNodeSize = graphCustomization?.nodeSize || 56;

  let adaptiveMultiplier = 1.0;
  if (zoom !== undefined) {
    if (zoom < 0.5) adaptiveMultiplier = 0.85;
    else if (zoom > 1.3) adaptiveMultiplier = 1.05;
  }

  const size = isSelected || node.radius === 34 ? Math.round(baseNodeSize * 1.15 * adaptiveMultiplier) : Math.round(baseNodeSize * adaptiveMultiplier);
  const halfSize = size / 2;
  const labelSize = graphCustomization?.nodeLabelSize || 12.5;

  const categoryKey = NODE_TYPE_TO_CATEGORY[node.type] || 'acteurs';
  const categoryColor = ONTOLOGY_CATEGORY_COLORS[categoryKey] || '#3b82f6';

  // Node encoding: interior fill/icon = Entity Category; border = Forensic Layer (or SNA overlay)
  const defaultBorderColor = LAYER_BORDER_COLORS[node.layer] || 'var(--color-border-default)';
  const activeBorderColor = snaColor || defaultBorderColor;
  const iconOrFillColor = categoryColor;
  const isHypothesis = node.layer === 'HYPOTHESIS';

  // Evidence / Forensic Portrait Photo (including dropped raw images from localFileStore)
  const localImgUrl =
    node.properties?.detected_family === 'image'
      ? getLocalFileEntry(node.id, node.properties?.client_sha256 as string | undefined)?.blobUrl
      : undefined;
  const photoUrl =
    (node.properties?.photo_url as string) || (node.properties?.photo as string) || localImgUrl;
  const [imgError, setImgError] = useState(false);
  const hasPhoto = Boolean(photoUrl);
  const showPhoto = hasPhoto && (graphCustomization?.showNodePhotos !== false) && !imgError;

  // Enquêteur Judicial Status (Suspect / Victime / Témoin / Complice / Mule / Plaignant)
  const statusJudiciaire =
    (node.properties?.status_judiciaire as string) ||
    (node.properties?.role_judiciaire as string) ||
    (node.properties?.role as string) ||
    '';
  const normalizedStatus = statusJudiciaire
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const actorStatusBadge = (() => {
    if (!normalizedStatus && node.type !== 'personne') return null;
    if (normalizedStatus.includes('suspect') || normalizedStatus.includes('mis en cause')) {
      return { kind: 'suspect', label: 'Suspect', Icon: ShieldAlert };
    }
    if (normalizedStatus.includes('victime')) {
      return { kind: 'victime', label: 'Victime', Icon: HeartHandshake };
    }
    if (normalizedStatus.includes('plaignant')) {
      return { kind: 'plaignant', label: 'Plaignant', Icon: UserCheck };
    }
    if (normalizedStatus.includes('complice') || normalizedStatus.includes('co-auteur')) {
      return { kind: 'complice', label: 'Complice', Icon: Users };
    }
    if (normalizedStatus.includes('mule') || normalizedStatus.includes('prete-nom')) {
      return { kind: 'mule', label: 'Prête-nom / Mule', Icon: ArrowLeftRight };
    }
    if (normalizedStatus.includes('temoin')) {
      return { kind: 'temoin', label: 'Témoin', Icon: Eye };
    }
    if (normalizedStatus.includes('tiers')) {
      return { kind: 'tiers', label: 'Tiers', Icon: User };
    }
    return null;
  })();

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
      style={{
        position: 'absolute',
        left: `${(node.x ?? 0) - halfSize}px`,
        top: `${(node.y ?? 0) - halfSize}px`,
        width: `${size}px`,
        height: `${size}px`,
        userSelect: 'none',
        transition: isDragging
          ? 'none'
          : 'left 0.45s cubic-bezier(0.16, 1, 0.3, 1), top 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: isHovered ? 60 : isDragging ? 50 : isDbMatchHighlighted ? 35 : isSelected ? 30 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`canvas-circular-node ${isDragging ? 'is-dragging' : ''} ${
        isSharedAsset ? 'is-shared-asset' : ''
      } ${isDbMatch ? 'is-db-match' : ''} ${
        isDbMatchHighlighted ? 'is-db-match-highlighted' : ''
      } ${node.properties?.__is_extraction_candidate ? 'is-extraction-candidate' : ''}`}
    >
      {/* Circular Body (Interior = Category, Border = Forensic Calque) */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`${node.label} (${typeDef?.label_fr || node.type}, couche ${layerDef?.label_fr || node.layer})`}
        aria-pressed={isSelected}
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
        style={{
          width: `${size}px`,
          height: `${size}px`,
          cursor: isDragging ? 'grabbing' : 'grab',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-surface)',
          background: `radial-gradient(circle, ${categoryColor}66 0%, ${categoryColor}2b 65%, var(--color-bg-surface) 100%)`,
          borderWidth: '3.5px',
          borderStyle:
            isHypothesis || node.properties?.__is_extraction_candidate ? 'dashed' : 'solid',
          borderColor:
            isLinkSource || isDbMatchHighlighted || isDbMatch
              ? 'var(--color-status-warning)'
              : activeBorderColor,
          boxShadow: isHovered
            ? `0 0 0 3.5px var(--color-accent-primary), 0 8px 24px rgba(0, 0, 0, 0.7)`
            : isLinkSource
            ? '0 0 0 4px var(--color-status-warning), 0 0 16px rgba(245, 158, 11, 0.6)'
            : isDbMatchHighlighted || (isSelected && Boolean(node.properties?.__is_extraction_candidate))
            ? '0 0 0 4.5px var(--color-status-warning), 0 0 22px rgba(245, 158, 11, 0.85)'
            : isDbMatch
            ? '0 0 0 3px rgba(245, 158, 11, 0.45), 0 0 14px rgba(245, 158, 11, 0.45)'
            : snaColor
            ? `0 0 0 3px ${snaColor}44, 0 0 14px ${snaColor}88`
            : isSelected
            ? '0 0 0 3.5px var(--color-accent-primary), 0 0 18px rgba(37, 99, 235, 0.6)'
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

        {/* Small judicial status icon badge for person/actor nodes (Suspect, Victime, etc.) */}
        {actorStatusBadge && (() => {
          const StatusIcon = actorStatusBadge.Icon;
          const statusTitle = tr('Qualification : {status}', {
            status: tr(actorStatusBadge.label),
          });
          return (
            <span
              className={`node-judicial-role-badge is-${actorStatusBadge.kind}`}
              title={statusTitle}
              aria-label={statusTitle}
            >
              <StatusIcon size={11} aria-hidden="true" />
            </span>
          );
        })()}

        {/* Small badge icon indicating audio wiretap / vocal evidence attached */}
        {(Boolean(node.properties?.audio_url) || node.type === 'enregistrement_vocal') && (
          <span
            title="Scellé audio judiciaire (Darija algéroise disponible)"
            style={{
              position: 'absolute',
              bottom: '-3px',
              left: isPinned ? '18px' : '-3px',
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

        {/* Pinned Position Badge */}
        {isPinned && (
          <span
            title="Position épinglée (verrouillée)"
            style={{
              position: 'absolute',
              bottom: '-4px',
              left: '-4px',
              width: '18px',
              height: '18px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg-primary)',
              border: '1.5px solid var(--color-status-warning)',
              color: 'var(--color-status-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)',
              zIndex: 5,
            }}
          >
            <Pin size={10} style={{ transform: 'rotate(45deg)' }} />
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
              backgroundColor: 'var(--color-bg-elevated)',
              color: 'var(--color-text-primary)',
              border: `1.5px solid ${snaColor || 'var(--color-accent-primary)'}`,
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

        {/* Option A: Actor Sphere Boundary Anchor Badge */}
        {isBoundaryAnchor && (
          <span
            className="node-boundary-pill font-mono"
            title={tr("Acteur frontière : arrêt de l'expansion Actor Sphere")}
          >
            <Shield size={9} />
            <span>{tr('Frontière')}</span>
          </span>
        )}

        {/* Option B / Phase 2A: Investigation Pipeline & Pending Candidate Badges */}
        {typeof node.properties?.pending_candidates_count === 'number' &&
        node.properties.pending_candidates_count > 0 ? (
          <span
            className="node-investigation-pill font-mono"
            title={tr('Isoler la pièce pour valider les {n} indice(s)', {
              n: node.properties.pending_candidates_count,
            })}
          >
            <ScanSearch size={9} aria-hidden="true" />
            <span>
              {tr('{n} à valider', { n: node.properties.pending_candidates_count })}
            </span>
          </span>
        ) : node.properties?.__is_extraction_candidate ? (
          <span
            className="node-pending-pill font-mono"
            title={tr('Candidat extrait en attente de validation')}
          >
            <Clock size={9} aria-hidden="true" />
            <span>{tr('Candidat')}</span>
          </span>
        ) : node.properties?.investigation_status === 'active_investigation' ? (
          <span
            className="node-investigation-pill font-mono"
            title={tr("Investigation forensique en cours sur ce scellé")}
          >
            <ScanSearch size={9} aria-hidden="true" />
            <span>{tr("En cours d'investigation")}</span>
          </span>
        ) : (Boolean(node.properties?.is_raw_evidence) ||
            node.type === 'scelle_numerique' ||
            typeof node.properties?.client_sha256 === 'string') &&
          node.properties?.investigation_status === 'pending_analysis' ? (
          <span
            className="node-pending-pill font-mono"
            title={tr("Scellé prêt : choisir un mode d'investigation")}
          >
            <Clock size={9} aria-hidden="true" />
            <span>{tr("En attente d'analyse")}</span>
          </span>
        ) : null}
      </div>

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
              color: isSelected ? '#f87171' : 'var(--color-text-primary)',
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
                ? '1.5px solid #ef4444'
                : '1px solid var(--color-border-default)',
              boxShadow: isSelected ? '0 0 10px rgba(239, 68, 68, 0.45)' : 'var(--shadow-xs)',
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
