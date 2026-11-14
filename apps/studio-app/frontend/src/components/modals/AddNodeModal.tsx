import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';
import type { LayerId, RegistryData } from '../../types/registry';
import registryDataRaw from '../../registry/registry.json';
import { NodeIcon } from '../canvas/NodeIcon';
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

export interface AddNodeData {
  type: string;
  label: string;
  layer: LayerId;
  confidence: number;
  properties: Record<string, any>;
  x: number;
  y: number;
}

interface AddNodeModalProps {
  isOpen: boolean;
  initialType: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onConfirm: (data: AddNodeData) => void;
}

const LAYER_OPTIONS: Array<{ key: LayerId; labelFr: string; color: string }> = [
  { key: 'VERIFIED', labelFr: 'Couche 1 : Vérifiée (Preuve légale OPJ)', color: 'var(--color-layer-1-verified)' },
  { key: 'OSINT_RAW', labelFr: 'Couche 2 : OSINT Brut (Renseignement ouvert)', color: 'var(--color-layer-2-osint)' },
  { key: 'INFRA', labelFr: 'Couche 3 : Télécoms & Infrastructure', color: 'var(--color-layer-3-infra)' },
  { key: 'HYPOTHESIS', labelFr: 'Couche 4 : Hypothèse d\'enquête', color: 'var(--color-layer-4-hypothesis)' },
  { key: 'FLOWS', labelFr: 'Couche 5 : Flux financiers & Traçabilité', color: 'var(--color-layer-5-flows)' },
];

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  initialType,
  position,
  onClose,
  onConfirm,
}) => {
  const { tr } = useI18n();

  const [type, setType] = useState(initialType || 'personne');
  const [label, setLabel] = useState('');
  const [layer, setLayer] = useState<LayerId>('VERIFIED');
  const [confidence, setConfidence] = useState(0.85);
  const [statusJudiciaire, setStatusJudiciaire] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialType) {
      setType(initialType);
      const typeDef = registry.node_types[initialType];
      const defaultName = typeDef?.label_fr || initialType;
      setLabel(`Nouvel élément (${defaultName})`);
      setLayer(typeDef?.layer || 'VERIFIED');
    }
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const currentTypeDef = registry.node_types[type];
  const iconName = currentTypeDef?.icon || 'help-circle';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalLabel = label.trim() || `Entité ${type}`;
    onConfirm({
      type,
      label: finalLabel,
      layer,
      confidence,
      properties: {
        status_judiciaire: statusJudiciaire.trim() || undefined,
        role_judiciaire: statusJudiciaire.trim() || undefined,
        notes: notes.trim() || undefined,
      },
      x: position?.x ?? 400,
      y: position?.y ?? 300,
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-node-modal-title"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(3px)',
      }}
    >
      <div
        className="modal-card"
        style={{
          width: '520px',
          maxWidth: '92vw',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.55)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--color-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-elevated)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '28px',
                height: '28px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-accent-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-accent-text)',
              }}
            >
              <NodeIcon name={iconName} size={16} />
            </span>
            <div>
              <h3
                id="add-node-modal-title"
                style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}
              >
                {tr('Création d\'Entité Judiciaire')}
              </h3>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                {tr('Position canevas : x={x}, y={y}', { x: position?.x ?? 0, y: position?.y ?? 0 })}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {/* Label / Name */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
              {tr('Nom ou Identifiant de l\'entité * :')}
            </label>
            <input
              type="text"
              required
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="ex: Ahmed Zerrouki, MSISDN 0550 12 34 56, BaridiMob..."
              style={{
                width: '100%',
                fontSize: '12.5px',
                padding: '6px 10px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>

          {/* Type & Layer Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {/* Type */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                {tr('Type Ontologique :')}
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '5px 8px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  boxSizing: 'border-box',
                }}
              >
                {Object.entries(registry.node_types).map(([key, def]) => (
                  <option key={key} value={key}>
                    {def.label_fr || key}
                  </option>
                ))}
              </select>
            </div>

            {/* Layer */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                {tr('Calque Judiciaire (Admissibilité) :')}
              </label>
              <select
                value={layer}
                onChange={(e) => setLayer(e.target.value as LayerId)}
                style={{
                  width: '100%',
                  fontSize: '12px',
                  padding: '5px 8px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                  boxSizing: 'border-box',
                }}
              >
                {LAYER_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.labelFr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Confidence Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              <span>{tr('Niveau de Confiance Probatoire :')}</span>
              <span className="font-mono text-xs">{Math.round(confidence * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--color-accent-primary)' }}
            />
          </div>

          {/* Status Judiciaire */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
              {tr('Statut Procédural / Judiciaire (Optionnel) :')}
            </label>
            <input
              type="text"
              value={statusJudiciaire}
              onChange={(e) => setStatusJudiciaire(e.target.value)}
              placeholder="ex: Mandat d'arrêt Interpol, Mis en examen, Garde à vue, Témoin..."
              style={{
                width: '100%',
                fontSize: '12px',
                padding: '5px 8px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Notes */}
          <div>
            <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
              {tr('Observations & Éléments de Procédure :')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Détails du scellé, procès-verbal de constatation, source..."
              style={{
                width: '100%',
                fontSize: '11.5px',
                padding: '5px 8px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
              borderTop: '1px solid var(--color-border-subtle)',
              paddingTop: 'var(--space-3)',
            }}
          >
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              {tr('Annuler')}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
              <PlusCircle size={14} />
              <span>{tr('Placer l\'Entité sur le Graphe')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
