import React, { useState, useEffect } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { exportCaseToJson, printForensicReport } from '../../services/exportService';
import { API_BASE } from '../../config';
import { FileDown, Printer, ShieldCheck, X } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportDialog: React.FC<ExportDialogProps> = ({ isOpen, onClose }) => {
  const { activeCase, nodes, edges } = useGraphStore();
  const { tr, dir } = useI18n();
  const [auditVerified, setAuditVerified] = useState(true);

  useEffect(() => {
    if (!activeCase) return;
    fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/audit/verify`)
      .then((r) => r.json())
      .then((data) => setAuditVerified(data.is_valid === true))
      .catch(() => setAuditVerified(false));
  }, [activeCase]);

  if (!isOpen || !activeCase) return null;

  const reportData = {
    caseInfo: activeCase,
    exportDate: new Date().toISOString(),
    actorId: 'investigator_front',
    auditVerified,
    nodes,
    edges,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 250,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-6)',
          width: '520px',
          maxWidth: '90vw',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FileDown size={22} style={{ color: 'var(--color-accent-text)' }} />
            <h2 id="export-dialog-title" style={{ fontSize: 'var(--text-md)', fontWeight: 600, margin: 0 }}>
              {tr('Export Judiciaire')}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr('Fermer')}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
          {tr('Dossier : {title} ({code})', { title: activeCase.title, code: activeCase.code })}<br />
          {tr('Volume : {nodes} entités et {edges} relations actives.', { nodes: nodes.length, edges: edges.length })}
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-3)',
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border-subtle)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 'var(--text-xs)',
            color: auditVerified ? 'var(--color-layer-1-verified)' : 'var(--color-status-danger)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <ShieldCheck size={16} />
          <span>
            {auditVerified
              ? tr('Chaîne de garde forensique (ISO 27037) validée : Empreintes SHA-256 certifiées.')
              : tr('Attention : le registre forensique présente des anomalies de vérification.')}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <button
            type="button"
            onClick={() => {
              printForensicReport(reportData);
              onClose();
            }}
            style={{ ...exportBtnStyle, textAlign: dir === 'rtl' ? 'right' : 'left' }}
          >
            <Printer size={18} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{tr('Générer le Rapport Forensique PDF / Impression')}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {tr('Rapport officiel distinguant preuves scellées et hypothèses.')}
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              exportCaseToJson(reportData);
              onClose();
            }}
            style={{ ...exportBtnStyle, textAlign: dir === 'rtl' ? 'right' : 'left' }}
          >
            <FileDown size={18} style={{ color: 'var(--color-layer-2-osint)', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{tr('Exporter en Format Structuré JSON')}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {tr('Archive complète avec métadonnées, graphe, couches et hachages.')}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const exportBtnStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  padding: 'var(--space-3)',
  backgroundColor: 'var(--color-bg-elevated)',
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-sm)',
  color: 'var(--color-text-primary)',
  cursor: 'pointer',
  textAlign: 'left',
};
