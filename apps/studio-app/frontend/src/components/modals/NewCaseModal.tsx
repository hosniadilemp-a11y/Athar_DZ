import React, { useState } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useToast } from '../../context/ToastContext';
import { API_BASE } from '../../config';
import type { CaseItem } from '../../types/graph';
import { FolderPlus, X, Check, FileText } from 'lucide-react';
import { ModalPortal } from '../common/ModalPortal';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: CaseItem) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  const { tr } = useI18n();
  const toast = useToast();

  const [code, setCode] = useState(`DOS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unitName, setUnitName] = useState('');
  const [magistrateName, setMagistrateName] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(tr('Veuillez spécifier le titre du dossier judiciaire.'), tr('Erreur de validation'));
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Actor-Id': 'opj-commandant-enquete',
        },
        body: JSON.stringify({
          code: code.trim(),
          title: title.trim(),
          description: description.trim() || undefined,
          unit_name: unitName.trim(),
          magistrate_name: magistrateName.trim(),
          jurisdiction: jurisdiction.trim(),
          wilaya: wilaya.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const created: CaseItem = await res.json();
      toast.success(
        tr('Dossier "{title}" ({code}) ouvert avec succès.', { title: created.title, code: created.code }),
        tr('Nouveau Dossier d’Enquête')
      );
      onCaseCreated(created);
      onClose();
    } catch (err) {
      console.error('[NewCaseModal] Creation error:', err);
      toast.error(tr('Échec de la création du dossier sur le serveur backend.'), tr('Erreur Réseau'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalPortal>
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-case-modal-title"
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
          width: '500px',
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
              <FolderPlus size={16} />
            </div>
            <div>
              <h2
                id="new-case-modal-title"
                style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--color-text-primary)' }}
              >
                {tr('Nouveau Dossier d’Enquête Judiciaire')}
              </h2>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                {tr('Initialisation d’une procédure scellée ISO 27037')}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {tr('Numéro de Parquet / Code Dossier :')}
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ex: DOS-2026-0819"
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {tr('Titre ou Intitulé de l’Affaire :')}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Opération AL-KHYMA — Réseau Cyber-Fraude et Blanchiment"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                {tr('Unité Enquêteuse :')}
              </label>
              <input
                type="text"
                value={unitName}
                onChange={(e) => setUnitName(e.target.value)}
                placeholder="Ex: Brigade Cybercriminalité Alger"
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
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                {tr('Magistrat Instructeur :')}
              </label>
              <input
                type="text"
                value={magistrateName}
                onChange={(e) => setMagistrateName(e.target.value)}
                placeholder="Ex: Juge d’Instruction (Cabinet 3)"
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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-2)' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                {tr('Juridiction Compétente :')}
              </label>
              <input
                type="text"
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value)}
                placeholder="Ex: Tribunal d'Alger • Pôle Pénal"
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
            <div>
              <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                {tr('Wilaya :')}
              </label>
              <input
                type="text"
                value={wilaya}
                onChange={(e) => setWilaya(e.target.value)}
                placeholder="Ex: 16 - Alger"
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
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              {tr('Synthèse Infractionnelle ou Faits Initiaux :')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Escroquerie commerciale en bande organisée, détournement de fonds BaridiMob, usurpation d'identité..."
              style={{
                width: '100%',
                padding: '6px 10px',
                fontSize: '12px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
                resize: 'vertical',
              }}
            />
          </div>

          <div
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              border: '1px solid rgba(37, 99, 235, 0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              color: 'var(--color-text-secondary)',
            }}
          >
            <FileText size={15} style={{ color: 'var(--color-accent-text)', flexShrink: 0 }} />
            <span>
              {tr('L’ouverture d’un nouveau dossier réinitialisera le tableau de travail tout en créant une entrée scellée dans le registre d’audit.')}
            </span>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose} disabled={isSubmitting}>
              {tr('Annuler')}
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting} style={{ gap: '6px' }}>
              <Check size={14} />
              <span>{isSubmitting ? tr('Création en cours...') : tr('Créer le Dossier')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
};
