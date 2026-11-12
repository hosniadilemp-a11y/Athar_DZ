import React, { useState, useEffect, useCallback } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { API_BASE } from '../../config';
import { ShieldCheck, AlertTriangle, RefreshCw, Hash } from 'lucide-react';

interface AuditVerificationData {
  is_valid: boolean;
  total_entries: number;
  first_tampered_index: number | null;
  message: string;
}

export const AuditChainViewer: React.FC = () => {
  const { activeCase } = useGraphStore();
  const [verification, setVerification] = useState<AuditVerificationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAuditStatus = useCallback(() => {
    if (!activeCase) return;
    setIsLoading(true);
    fetch(`${API_BASE}/api/v1/cases/${activeCase.id}/audit/verify`)
      .then((r) => r.json())
      .then((data: AuditVerificationData) => {
        setVerification(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [activeCase]);

  useEffect(() => {
    fetchAuditStatus();
  }, [fetchAuditStatus]);

  return (
    <div
      role="region"
      aria-label="Registre forensique immuable de l'enquête"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: 'var(--color-bg-canvas)',
        padding: 'var(--space-6)',
        overflowY: 'auto',
      }}
    >
      <div style={{ maxWidth: '850px', margin: '0 auto', width: '100%' }}>
        {/* Verification Status Card */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid',
            borderColor: verification?.is_valid ? 'var(--color-layer-1-verified)' : 'var(--color-status-danger)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              {verification?.is_valid ? (
                <ShieldCheck size={28} style={{ color: 'var(--color-layer-1-verified)' }} />
              ) : (
                <AlertTriangle size={28} style={{ color: 'var(--color-status-danger)' }} />
              )}
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 600 }}>
                  {verification?.is_valid
                    ? 'Chaîne de Preuves Cryptographique Intègre (ISO 27037)'
                    : 'Alerte : Altération Détectée dans la Chaîne de Preuves'}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
                  {verification?.message || 'Vérification en cours...'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={fetchAuditStatus}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-2) var(--space-3)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--text-xs)',
                cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : undefined} />
              <span>Revérifier</span>
            </button>
          </div>
        </div>

        {/* Ledger Information */}
        <div style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border-default)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Hash size={18} style={{ color: 'var(--color-accent-text)' }} />
            <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              Caractéristiques du Registre Forensique d&apos;Athar
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
            <p style={{ margin: 0 }}>
              Chaque mutation sur le dossier (chargement de scellé, promotion de couche judiciaire, exécution algorithmique SNA, exportation judiciaire) génère un bloc immuable scellé par empreinte <strong>SHA-256</strong> chaînée en amont.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
              <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Algorithme de hachage :</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>SHA-256 Merkle-Chained</div>
              </div>
              <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Entrées enregistrées :</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-text-primary)', marginTop: '2px' }}>{verification?.total_entries || 0} blocs certifiés</div>
              </div>
              <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--color-bg-canvas)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-subtle)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Conformité judiciaire :</span>
                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-layer-1-verified)', marginTop: '2px' }}>ISO/IEC 27037:2012</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
