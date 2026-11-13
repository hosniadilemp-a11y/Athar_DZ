import React, { useState } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData } from '../../types/registry';
import {
  GitBranch,
  ShieldCheck,
  MapPin,
  Wrench,
  X,
  Copy,
  Check,
  Plus,
  Trash2,
  TrendingUp,
  Inbox,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

interface InspectorPanelProps {
  onExpand: (hops: number) => void;
  onClose: () => void;
  onTriggerTool?: (toolId: string) => void;
  onTriggerPhaseNotice?: (name: string, phase: string) => void;
  style?: React.CSSProperties;
}

interface InboxClue {
  id: string;
  title: string;
  type: string;
  value: string;
  provenance: string;
  layer: 'OSINT_RAW' | 'INFRA' | 'HYPOTHESIS';
  confidence: number;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  onExpand,
  onClose,
  onTriggerTool,
  onTriggerPhaseNotice,
  style,
}) => {
  const { t, tr, label } = useI18n();
  const {
    nodes,
    edges,
    selectedNodeId,
    selectedEdgeId,
    openLayerChangeModal,
    mergeExpandedNodes,
    deleteNode,
    selectNode,
  } = useGraphStore();

  const [copiedHash, setCopiedHash] = useState(false);
  const [inboxClues, setInboxClues] = useState<InboxClue[]>([
    {
      id: 'clue-1',
      title: 'Compte BaridiMob Détecté',
      type: 'compte_bancaire',
      value: 'RIP 00799999002345678912',
      provenance: 'Détection de Mules BaridiMob',
      layer: 'INFRA',
      confidence: 0.92,
    },
    {
      id: 'clue-2',
      title: 'Profil Facebook Suspect',
      type: 'compte_social',
      value: 'Amine Import Michelin DZ',
      provenance: 'OSINT Social Media',
      layer: 'OSINT_RAW',
      confidence: 0.88,
    },
    {
      id: 'clue-3',
      title: 'Serveur C2 Localisé',
      type: 'serveur_c2',
      value: '185.220.101.5 (Port 8443)',
      provenance: 'Shodan / Pivots IP',
      layer: 'INFRA',
      confidence: 0.95,
    },
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  const handleCopyHash = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 1500);
  };

  const handleAddClueToGraph = (clue: InboxClue) => {
    const newNode = {
      id: `inbox-promoted-${Date.now()}`,
      case_id: 'active',
      type: clue.type,
      layer: clue.layer,
      label: clue.value,
      confidence: clue.confidence,
      provenance: clue.provenance,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      properties: { source_title: clue.title },
      latitude: null,
      longitude: null,
    };
    mergeExpandedNodes([newNode], []);
    selectNode(newNode.id, false);
    setInboxClues((prev) => prev.filter((c) => c.id !== clue.id));
  };

  const handleDismissClue = (clueId: string) => {
    setInboxClues((prev) => prev.filter((c) => c.id !== clueId));
  };

  // 1. Dual Mode: When nothing is selected, render Case Overview KPIs & Clues Inbox
  if (!selectedNode && !selectedEdge) {
    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Synthèse de l\'affaire et boîte des indices')}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <TrendingUp size={16} style={{ color: 'var(--color-accent-text)' }} />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {t.caseOverviewTitle}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur')}
          >
            <X size={15} />
          </button>
        </div>

        {/* 4 KPIs Grid matching doc/maquette.html */}
        <div className="overview-kpis-grid">
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiLoss}</span>
            <span className="kpi-value font-mono">{t.kpiLossVal}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiVictims}</span>
            <span className="kpi-value font-mono">{t.kpiVictimsVal}</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiLocations}</span>
            <span className="kpi-value font-mono" style={{ fontSize: 'var(--text-xs)' }}>
              {t.kpiLocationsVal}
            </span>
          </div>
          <div className="kpi-card">
            <span className="kpi-label">{t.kpiEvidence}</span>
            <span className="kpi-value font-mono text-success">{t.kpiEvidenceVal}</span>
          </div>
        </div>

        {/* Boite d'Arbitrage des Indices (Inbox) */}
        <div className="inbox-section">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Inbox size={15} style={{ color: 'var(--color-accent-text)' }} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                {t.inboxTitle}
              </span>
            </div>
            <span className="chip chip-neutral font-mono" style={{ fontSize: 'var(--text-xs)', padding: '1px 5px' }}>
              {tr('{n} en attente', { n: inboxClues.length })}
            </span>
          </div>

          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>
            {tr('Indices détectés par les outils de collecte nécessitant une décision humaine avant versement au dossier (Review-Run).')}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {inboxClues.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-4)',
                  textAlign: 'center',
                  backgroundColor: 'var(--color-bg-elevated)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {tr('Tous les indices ont été arbitrés.')}
              </div>
            ) : (
              inboxClues.map((clue) => (
                <div key={clue.id} className="inbox-item">
                  <div className="inbox-item-meta">
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-accent-text)', fontWeight: 600 }}>
                      {clue.title}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)' }}>
                      {clue.value}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                      {tr('Source : {src} • Confiance : {pct}%', {
                        src: clue.provenance,
                        pct: Math.round(clue.confidence * 100),
                      })}
                    </span>
                  </div>

                  <div className="inbox-actions">
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      onClick={() => handleAddClueToGraph(clue)}
                      style={{ flex: 1 }}
                    >
                      <Plus size={11} />
                      <span>{t.inboxAddToGraph}</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => handleDismissClue(clue.id)}
                    >
                      <Trash2 size={11} />
                      <span>{t.inboxDismiss}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            padding: 'var(--space-3)',
            borderTop: '1px solid var(--color-border-subtle)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          {tr('Sélectionnez un nœud sur le canevas pour inspecter ses métadonnées forensiques détaillées.')}
        </div>
      </aside>
    );
  }

  // 2. Node Inspector Mode
  if (selectedNode) {
    const typeDef = registry.node_types[selectedNode.type];
    const layerDef = registry.layers[selectedNode.layer];
    const isGps = typeDef?.is_gps_enabled || (selectedNode.latitude !== null && selectedNode.longitude !== null);
    const proposedTools = typeDef?.proposed_tools || [];
    const dummyHash = `sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069`;

    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Inspecteur de l\'entité {label}', { label: selectedNode.label })}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <NodeIcon name={typeDef?.icon || 'help-circle'} size={18} style={{ color: layerDef?.color }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {label(typeDef, selectedNode.type)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur')}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Main Label */}
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>
              {tr('Identifiant / Libellé')}
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {selectedNode.label}
            </div>
          </div>

          {/* Layer and Confidence Badges */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span
              className="chip"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: layerDef?.color || 'var(--color-border-default)',
                color: layerDef?.color,
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              {tr('COUCHE : {layer}', { layer: label(layerDef, selectedNode.layer) })}
            </span>

            {selectedNode.confidence !== null && (
              <span
                className="chip chip-neutral font-mono"
                style={{ fontSize: 'var(--text-xs)' }}
                title={tr('Confiance analytique calculée par l\'algorithme ou l\'enquêteur')}
              >
                {tr('CONFIANCE : {pct}%', { pct: Math.round(selectedNode.confidence * 100) })}
              </span>
            )}
          </div>

          {/* SHA-256 Hash Chip with Copy */}
          <div
            style={{
              padding: 'var(--space-2)',
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-2)',
            }}
          >
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                {tr('Empreinte Scellée (SHA-256)')}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-layer-1-verified)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {dummyHash}
              </div>
            </div>
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => handleCopyHash(dummyHash)}
              title={tr('Copier l\'empreinte SHA-256')}
            >
              {copiedHash ? <Check size={13} style={{ color: 'var(--color-status-success)' }} /> : <Copy size={13} />}
            </button>
          </div>

          {/* Provenance */}
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{tr('Provenance : ')}</span>
            <span className="font-mono">{selectedNode.provenance}</span>
          </div>

          {/* GPS Coordinates if available */}
          {isGps && selectedNode.latitude !== null && selectedNode.longitude !== null && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-text-primary)',
                backgroundColor: 'var(--color-bg-elevated)',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border-subtle)',
              }}
            >
              <MapPin size={14} style={{ color: 'var(--color-status-info)' }} />
              <span className="font-mono">
                {selectedNode.latitude.toFixed(4)}N, {selectedNode.longitude.toFixed(4)}E
              </span>
            </div>
          )}

          {/* Properties Table */}
          {selectedNode.properties && Object.keys(selectedNode.properties).length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
                {tr('Métadonnées Spécifiques')}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border-subtle)',
                  maxHeight: '160px',
                  overflowY: 'auto',
                }}
              >
                {Object.entries(selectedNode.properties).map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 'var(--text-xs)',
                      borderBottom: '1px solid var(--color-border-subtle)',
                      paddingBottom: '2px',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>{k}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                      {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => openLayerChangeModal(selectedNode.id, selectedNode.layer)}
              style={{ width: '100%' }}
            >
              <ShieldCheck size={14} style={{ color: 'var(--color-layer-1-verified)' }} />
              <span>{tr('Changer de Calque (Justification Obligatoire)')}</span>
            </button>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onExpand(1)}
                style={{ flex: 1 }}
              >
                <GitBranch size={13} />
                <span>{tr('Développer 1-hop')}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onExpand(2)}
                style={{ flex: 1 }}
              >
                <GitBranch size={13} />
                <span>{tr('Développer 2-hops')}</span>
              </button>
            </div>

            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => deleteNode(selectedNode.id)}
              style={{ width: '100%' }}
            >
              <Trash2 size={13} />
              <span>{tr('Supprimer ce nœud du graphe')}</span>
            </button>
          </div>

          {/* Suggested Forensic Tools */}
          {proposedTools.length > 0 && (
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
                {tr('Outils OSINT Proposés')}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                {proposedTools.map((tName) => {
                  const isPhase1 = tName.toLowerCase().includes('betweenness') || tName.toLowerCase().includes('louvain') || tName.toLowerCase().includes('sna');
                  const phaseLabel = isPhase1 ? '1' : '3';

                  return (
                    <button
                      key={tName}
                      type="button"
                      className={`btn btn-secondary btn-xs ${!isPhase1 ? 'is-future-phase' : ''}`}
                      style={{ justifyContent: 'space-between', width: '100%' }}
                      onClick={() => {
                        if (isPhase1) {
                          onTriggerTool?.(tName);
                        } else {
                          onTriggerPhaseNotice?.(tName, `Phase ${phaseLabel}`);
                        }
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Wrench size={12} style={{ color: isPhase1 ? 'var(--color-accent-text)' : 'var(--color-text-muted)' }} />
                        <span>{tName}</span>
                      </div>
                      <span className="phase-badge">{tr('Phase {n}', { n: phaseLabel })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 3. Edge Inspector Mode
  if (selectedEdge) {
    const relTypeDef = registry.relation_types?.[selectedEdge.type];
    const layerDef = registry.layers[selectedEdge.layer];
    return (
      <aside
        className="panel-right"
        style={style}
        role="complementary"
        aria-label={tr('Relation sélectionnée')}
      >
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <GitBranch size={16} style={{ color: layerDef?.color }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              {label(relTypeDef, selectedEdge.type)}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer l\'inspecteur de relation')}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '2px', textTransform: 'uppercase' }}>
              {tr('Type de relation : {type}', { type: label(relTypeDef, selectedEdge.type) })}
            </div>
            <div style={{ fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {selectedEdge.type}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <span
              className="chip"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                borderColor: layerDef?.color || 'var(--color-border-default)',
                color: layerDef?.color,
                fontWeight: 600,
                fontSize: 'var(--text-xs)',
              }}
            >
              {tr('COUCHE : {layer}', { layer: label(layerDef, selectedEdge.layer) })}
            </span>
          </div>

          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>{tr('De : {src}', { src: '' })}</span>
              <span className="font-mono">{selectedEdge.source_id}</span>
            </div>
            <div>
              <span style={{ color: 'var(--color-text-muted)' }}>{tr('Vers : {dst}', { dst: '' })}</span>
              <span className="font-mono">{selectedEdge.target_id}</span>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return null;
};
