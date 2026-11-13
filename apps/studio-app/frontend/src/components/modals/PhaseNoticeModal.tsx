import React from 'react';
import { AlertCircle, X, ShieldAlert } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface PhaseNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName?: string;
  targetPhase?: string;
}

export const PhaseNoticeModal: React.FC<PhaseNoticeModalProps> = ({
  isOpen,
  onClose,
  featureName,
  targetPhase = 'Phase 2',
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="phase-modal-title"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ maxWidth: '480px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <ShieldAlert size={18} style={{ color: 'var(--color-status-warning)' }} />
            <h3 id="phase-modal-title" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>
              {t.phaseNoticeTitle} ({targetPhase})
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
            <AlertCircle size={24} style={{ color: 'var(--color-status-warning)', flexShrink: 0, marginTop: '2px' }} />
            <div>
              {featureName && (
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-1)' }}>
                  {featureName}
                </div>
              )}
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                {t.phaseNoticeDesc}
              </p>
              <div
                style={{
                  marginTop: 'var(--space-3)',
                  padding: 'var(--space-2)',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)',
                }}
              >
                Conformité : Décision D10 • Phase 1 (App v0.1) active
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-primary btn-sm" onClick={onClose}>
            {t.phaseNoticeClose}
          </button>
        </div>
      </div>
    </div>
  );
};
