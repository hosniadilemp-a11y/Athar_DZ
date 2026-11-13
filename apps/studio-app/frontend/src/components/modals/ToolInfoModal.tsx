import React from 'react';
import { X, Wrench, Database, CheckCircle } from 'lucide-react';

export interface ToolSpec {
  id: string;
  name: string;
  category: string;
  phase: string;
  prerequisite: string;
  description: string;
  inputs: string[];
  outputs: string[];
  storage: string;
}

interface ToolInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: ToolSpec | null;
  onTriggerPhaseNotice?: (name: string, phase: string) => void;
}

export const ToolInfoModal: React.FC<ToolInfoModalProps> = ({
  isOpen,
  onClose,
  tool,
  onTriggerPhaseNotice,
}) => {
  if (!isOpen || !tool) return null;

  const isPhase1 = tool.phase === 'Phase 1';

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tool-info-title"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ maxWidth: '640px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Wrench size={18} style={{ color: 'var(--color-accent-text)' }} />
            <h3 id="tool-info-title" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>
              Fiche Technique Forensique : {tool.name}
            </h3>
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

        <div className="modal-body">
          {/* Metadata Chips */}
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <span className="chip chip-neutral">{tool.category}</span>
            <span
              className={`chip ${isPhase1 ? 'chip-success' : 'chip-warning'}`}
              style={{
                backgroundColor: isPhase1 ? 'var(--color-status-success-bg)' : 'var(--color-bg-subtle)',
                color: isPhase1 ? 'var(--color-status-success-text)' : 'var(--color-text-muted)',
                borderColor: isPhase1 ? 'var(--color-status-success-border)' : 'var(--color-border-subtle)',
              }}
            >
              {tool.phase}
            </span>
            <span className="chip chip-neutral font-mono">{tool.prerequisite}</span>
          </div>

          {/* Description */}
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
            {tool.description}
          </p>

          {/* Technical Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Entrées Receptives (Inputs)
              </div>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                {tool.inputs.map((inp, idx) => (
                  <li key={idx}>{inp}</li>
                ))}
              </ul>
            </div>

            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                Sorties & Entités Créées (Outputs)
              </div>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'var(--color-text-primary)' }}>
                {tool.outputs.map((out, idx) => (
                  <li key={idx}>{out}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Storage & Engine */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
            <Database size={14} />
            <span>Stockage Judiciaire : {tool.storage}</span>
          </div>
        </div>

        <div className="modal-footer">
          {!isPhase1 ? (
            <button
              type="button"
              className="btn btn-secondary btn-sm is-future-phase"
              onClick={() => {
                onClose();
                onTriggerPhaseNotice?.(tool.name, tool.phase);
              }}
            >
              <span>Exécution Non Disponible</span>
              <span className="phase-badge">{tool.phase}</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onClose}
            >
              <CheckCircle size={14} />
              <span>Opérationnel en Phase 1</span>
            </button>
          )}
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
