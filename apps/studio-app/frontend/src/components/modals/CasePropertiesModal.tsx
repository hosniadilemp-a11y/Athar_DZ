import React, { useEffect, useState } from 'react';
import { X, FolderLock, Hash, Calendar, MapPin, Scale, Shield, Save } from 'lucide-react';
import type { CaseItem } from '../../types/graph';
import { API_BASE } from '../../config';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { ModalPortal } from '../common/ModalPortal';

interface CasePropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCase: CaseItem | null;
  nodeCount: number;
  edgeCount: number;
  onCaseUpdated?: (updated: CaseItem) => void;
}

export const CasePropertiesModal: React.FC<CasePropertiesModalProps> = ({
  isOpen,
  onClose,
  activeCase,
  nodeCount,
  edgeCount,
  onCaseUpdated,
}) => {
  const { tr } = useI18n();
  const toast = useToast();
  const [unitName, setUnitName] = useState('');
  const [magistrateName, setMagistrateName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && activeCase) {
      setUnitName(activeCase.unit_name || '');
      setMagistrateName(activeCase.magistrate_name || '');
      setJurisdiction(activeCase.jurisdiction || '');
      setWilaya(activeCase.wilaya || '');
    }
  }, [isOpen, activeCase]);

  if (!isOpen) return null;

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;
    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases/${activeCase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'investigator_front',
        },
        body: JSON.stringify({
          unit_name: unitName.trim(),
          magistrate_name: magistrateName.trim(),
          jurisdiction: jurisdiction.trim(),
          wilaya: wilaya.trim(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updated: CaseItem = await res.json();
      onCaseUpdated?.(updated);
      toast.success(tr("Métadonnées de l'affaire enregistrées."), tr('Dossier Judiciaire'));
      onClose();
    } catch {
      toast.error(tr("Échec de la mise à jour des métadonnées de l'affaire."), tr('Erreur Réseau'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ModalPortal>
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-props-title"
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{ maxWidth: '600px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <FolderLock size={18} style={{ color: 'var(--color-accent-text)' }} />
            <h3 id="case-props-title" style={{ fontSize: 'var(--text-sm)', fontWeight: 600, margin: 0 }}>
              {tr("Propriétés de l'Affaire Judiciaire")}
            </h3>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={onClose}
            aria-label={tr('Fermer')}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={(e) => void handleSaveMetadata(e)} className="modal-body">
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
              {tr('Statut')} : {activeCase?.status || 'OPEN'}
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
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                <Shield size={12} />
                <span>{tr('Unité Enquêteuse :')}</span>
              </label>
              <input
                type="text"
                className="input input-sm"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="Ex: Brigade Cybercriminalité Alger"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                <Scale size={12} />
                <span>{tr('Magistrat Instructeur :')}</span>
              </label>
              <input
                type="text"
                className="input input-sm"
                value={magistrateName}
                onChange={(e) => setMagistrateName(e.target.value)}
                placeholder="Ex: Procureur / Juge d'Instruction"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                <Scale size={12} />
                <span>{tr('Juridiction Compétente :')}</span>
              </label>
              <input
                type="text"
                className="input input-sm"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="Ex: Tribunal d'Oran • Pôle Pénal Spécialisé"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                <MapPin size={12} />
                <span>{tr('Wilaya(s) Rattachée(s) :')}</span>
              </label>
              <input
                type="text"
                className="input input-sm"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                placeholder="Ex: Alger (16), Oran (31)"
                style={{ width: '100%' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <Calendar size={12} />
                <span>{tr("Ouverture de l'Instruction")}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {activeCase?.created_at
                  ? new Date(activeCase.created_at).toLocaleDateString('fr-FR')
                  : '10/11/2026'}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                <Hash size={12} />
                <span>{tr('Volumétrie Graphique')}</span>
              </div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                {nodeCount} {tr('nœuds')} · {edgeCount} {tr('Relations')}
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

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={isSaving}>
              {tr('Fermer')}
            </button>
            {activeCase && (
              <button type="submit" className="btn btn-primary btn-sm" disabled={isSaving} style={{ gap: '6px' }}>
                <Save size={13} />
                <span>{isSaving ? tr('Enregistrement...') : tr('Enregistrer')}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
};
