import React, { useState, useMemo } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { useI18n } from '../../context/I18nContext';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import { getAvailableRelationsForNodes, getRelationLabel } from '../../i18n/phrases/relations';
import { ArrowRight, Link2, X, Check } from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

interface CreateRelationModalProps {
  isOpen: boolean;
  sourceId: string;
  targetId: string;
  onClose: () => void;
  onConfirm: (relationType: string, layer: LayerId, confidence: number, notes?: string) => void;
}

export const CreateRelationModal: React.FC<CreateRelationModalProps> = ({
  isOpen,
  sourceId,
  targetId,
  onClose,
  onConfirm,
}) => {
  const { nodes } = useGraphStore();
  const { tr, locale } = useI18n();

  const sourceNode = useMemo(() => nodes.find((n) => n.id === sourceId), [nodes, sourceId]);
  const targetNode = useMemo(() => nodes.find((n) => n.id === targetId), [nodes, targetId]);

  const availableRelations = useMemo(() => {
    return getAvailableRelationsForNodes(sourceNode?.type, targetNode?.type);
  }, [sourceNode?.type, targetNode?.type]);

  const [selectedRelation, setSelectedRelation] = useState<string>(
    availableRelations[0]?.key || 'COMMUNIQUE_AVEC'
  );
  const [selectedLayer, setSelectedLayer] = useState<LayerId>('HYPOTHESIS');
  const [confidence, setConfidence] = useState<number>(0.9);
  const [searchFilter, setSearchFilter] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen || !sourceNode || !targetNode) return null;

  const srcTypeDef = registry.node_types[sourceNode.type];
  const tgtTypeDef = registry.node_types[targetNode.type];

  const filteredRelations = availableRelations.filter(
    (r) =>
      r.label.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.key.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedRelation, selectedLayer, confidence, notes.trim() || undefined);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="relation-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '520px',
          maxWidth: '92vw',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-elevated)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-text)',
              }}
            >
              <Link2 size={16} />
            </div>
            <div>
              <h2
                id="relation-modal-title"
                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                {tr('Qualifier la Liaison Judiciaire')}
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {tr('Établir un rapprochement probatoire entre deux entités')}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer')}
            style={{ padding: '4px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nodes Visual Bridge Preview */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            backgroundColor: 'var(--color-bg-base)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-2)',
          }}
        >
          {/* Source Node Chip */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              minWidth: 0,
            }}
          >
            <NodeIcon name={srcTypeDef?.icon || 'help-circle'} size={18} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {sourceNode.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                {srcTypeDef?.label_fr || sourceNode.type}
              </div>
            </div>
          </div>

          <ArrowRight size={16} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />

          {/* Target Node Chip */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 10px',
              backgroundColor: 'var(--color-bg-surface)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              minWidth: 0,
            }}
          >
            <NodeIcon name={tgtTypeDef?.icon || 'help-circle'} size={18} style={{ color: 'var(--color-status-success)', flexShrink: 0 }} />
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {targetNode.label}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>
                {tgtTypeDef?.label_fr || targetNode.type}
              </div>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Relation Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
              {tr('Type de relation (compréhensible par l’enquêteur) :')}
            </label>

            <input
              type="text"
              placeholder={tr('Rechercher une relation (ex: communique, virement, complice...)...')}
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                marginBottom: '8px',
              }}
            />

            <div
              style={{
                maxHeight: '160px',
                overflowY: 'auto',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-bg-base)',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
              }}
            >
              {filteredRelations.map((rel) => {
                const isSelected = selectedRelation === rel.key;
                const localized = getRelationLabel(rel.key, locale);

                return (
                  <button
                    key={rel.key}
                    type="button"
                    onClick={() => setSelectedRelation(rel.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
                      border: isSelected ? '1px solid var(--color-accent-primary)' : '1px solid transparent',
                      color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-primary)',
                      cursor: 'pointer',
                      textAlign: 'start',
                      fontSize: '12px',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: isSelected ? 600 : 500 }}>
                        {localized}
                      </div>
                      {rel.description && (
                        <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                          {rel.description}
                        </div>
                      )}
                    </div>
                    {isSelected && <Check size={14} style={{ color: 'var(--color-accent-primary)' }} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layer and Confidence in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                {tr('Calque Judiciaire :')}
              </label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value as LayerId)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  fontSize: '12px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                }}
              >
                <option value="HYPOTHESIS">HYPOTHESIS (Liaison présumée / piste)</option>
                <option value="VERIFIED">VERIFIED (Scellé probatoire certain)</option>
                <option value="FLOWS">FLOWS (Flux financier ou télécom)</option>
                <option value="INFRA">INFRA (Infrastructure technique)</option>
                <option value="OSINT_RAW">OSINT_RAW (Donnée ouverte brute)</option>
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                <span>{tr('Confiance probatoire :')}</span>
                <span className="font-mono">{Math.round(confidence * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.4}
                max={1.0}
                step={0.05}
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)', marginTop: '4px' }}
              />
            </div>
          </div>

          {/* Note or Observations */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {tr('Précision ou référence d’acte (optionnel) :')}
            </label>
            <input
              type="text"
              placeholder={tr('Ex: Selon PV de perquisition n° 124/2026')}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              {tr('Annuler')}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
              <Check size={14} />
              <span>{tr('Créer la Liaison')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
