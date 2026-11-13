import React from 'react';
import { X, FolderLock, Hash, Calendar, MapPin, Scale } from 'lucide-react';
import type { CaseItem } from '../../types/graph';

interface CasePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: CaseItem | null;
  nodeCount: number;
  edgeCount: number;
}

export const CasePropertiesModal: React.FC<CasePropertiesModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  nodeCount,
  edgeCount,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-props-title"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FolderLock size={18} style={{ color: 'var(--color-accent-text)' }} />
            <h3 id="case-props-title" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>
              Propriétés de l'Affaire Judiciaire
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {activeCase?.title || 'Opération Candy Wheels'}
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-accent-text)', marginTop: '2px' }}>
                {activeCase?.code || 'Dossier #2026-SCAM-089'}
              </div>
            </div>
            <span className="chip chip-neutral font-mono text-xs">
              Statut : Enquête Active
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--space-3)',
              backgroundColor: 'var(--color-bg-elevated)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border-subtle)',
              marginTop: 'var(--space-2)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <Scale size={12} />
                <span>Juridiction Compétente</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Tribunal d'Oran • Pôle Pénal Spécialisé Cyber
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <Calendar size={12} />
                <span>Ouverture de l'Instruction</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                10 Novembre 2026 (UTC+1)
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <MapPin size={12} />
                <span>Wilayas Rattachées</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                Alger (16), Oran (31), Blida (09)
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <Hash size={12} />
                <span>Volumétrie Graphique</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {nodeCount} Nœuds • {edgeCount} Relations
              </div>
            </div>
          </div>

          <div
            style={{
              padding: 'var(--space-2) var(--space-3)',
              backgroundColor: 'var(--color-bg-canvas)',
              border: '1px solid var(--color-border-subtle)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
            }}
          >
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Empreinte Racine Scellée (SHA-256 RFC 3161) :</span>
            <span style={{ fontSize: 'var(--text-xs)', fontFamily: 'var(--font-mono)', color: 'var(--color-layer-1-verified)', wordBreak: 'break-all' }}>
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
