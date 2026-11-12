import React from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import {
  FolderKanban,
  Layers,
  PlusCircle,
  Radio,
  FileSpreadsheet,
  BrainCircuit,
  Lock,
} from 'lucide-react';

const registry = registryDataRaw as unknown as RegistryData;

interface LeftAccordionProps {
  onAddNodeAtCenter: (typeKey: string) => void;
}

const LAYER_KEYS: LayerId[] = ['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS'];

export const LeftAccordion: React.FC<LeftAccordionProps> = ({ onAddNodeAtCenter }) => {
  const { activeCase, activeLayers, toggleLayer, nodes } = useGraphStore();

  // Compute node count per layer in active graph
  const countPerLayer = React.useMemo(() => {
    const counts: Record<LayerId, number> = {
      VERIFIED: 0,
      OSINT_RAW: 0,
      INFRA: 0,
      HYPOTHESIS: 0,
      FLOWS: 0,
    };
    nodes.forEach((n) => {
      if (counts[n.layer] !== undefined) {
        counts[n.layer]++;
      }
    });
    return counts;
  }, [nodes]);

  // Frequently used node types for the quick palette
  const quickNodeTypes = ['personne', 'telephone', 'compte_social', 'serveur_c2', 'fichier_apk', 'antenne_bts', 'transaction_crypto'];

  return (
    <aside
      role="region"
      aria-label="Boîte à outils et couches d'investigation"
      style={{
        width: 'var(--panel-left-width)',
        height: '100%',
        backgroundColor: 'var(--color-bg-surface)',
        borderRight: '1px solid var(--color-border-default)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Dossier Actif */}
      <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: '4px' }}>
          <FolderKanban size={16} style={{ color: 'var(--color-accent-text)' }} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>DOSSIER JUDICIAIRE</span>
        </div>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {activeCase?.code || 'CANDY-WHEELS-DZ'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
          {activeCase?.title || 'Opération Candy Wheels'}
        </div>
      </div>

      {/* 5 Forensic Layers Filter */}
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Layers size={16} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            COUCHES D&apos;ENQUÊTE ({activeLayers.size}/5)
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {LAYER_KEYS.map((layerKey) => {
            const layerDef = registry.layers[layerKey];
            const isActive = activeLayers.has(layerKey);
            const count = countPerLayer[layerKey] || 0;

            return (
              <button
                key={layerKey}
                type="button"
                onClick={() => toggleLayer(layerKey)}
                aria-pressed={isActive}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? layerDef?.color || 'var(--color-border-default)' : 'var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: 'var(--radius-full)',
                      backgroundColor: layerDef?.color,
                      opacity: isActive ? 1 : 0.3,
                    }}
                  />
                  <span>{layerDef?.label_fr || layerKey}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Creation Palette (37 types) */}
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <PlusCircle size={16} />
          <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
            PALETTE DE CRÉATION
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {quickNodeTypes.map((typeKey) => {
            const typeDef = registry.node_types[typeKey];
            if (!typeDef) return null;
            return (
              <button
                key={typeKey}
                type="button"
                onClick={() => onAddNodeAtCenter(typeKey)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-1) var(--space-2)',
                  backgroundColor: 'transparent',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  fontSize: 'var(--text-xs)',
                  textAlign: 'left',
                }}
              >
                <NodeIcon name={typeDef.icon} size={14} />
                <span style={{ flex: 1 }}>{typeDef.label_fr}</span>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>+ Ajouter</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Decision D10: Disabled Phase Modules */}
      <div style={{ padding: 'var(--space-4)', marginTop: 'auto' }}>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>
          MODULES EN DÉVELOPPEMENT
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <button
            type="button"
            aria-disabled="true"
            style={disabledModuleStyle}
            onClick={() => alert("L'intercepteur CDR/BTS sera activé en Phase 2.")}
          >
            <Radio size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Sondes Télécom & BTS</span>
            <span style={phaseBadgeStyle}>Phase 2</span>
          </button>
          <button
            type="button"
            aria-disabled="true"
            style={disabledModuleStyle}
            onClick={() => alert("Le module de corrélation bancaire sera activé en Phase 3.")}
          >
            <FileSpreadsheet size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Flux Financiers & Crypto</span>
            <span style={phaseBadgeStyle}>Phase 3</span>
          </button>
          <button
            type="button"
            aria-disabled="true"
            style={disabledModuleStyle}
            onClick={() => alert("Le module de scellés numériques eIDAS sera activé en Phase 5.")}
          >
            <Lock size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Scellés Numériques eIDAS</span>
            <span style={phaseBadgeStyle}>Phase 5</span>
          </button>
          <button
            type="button"
            aria-disabled="true"
            style={disabledModuleStyle}
            onClick={() => alert("Le copilote d'investigation IA sera activé en Phase 4.")}
          >
            <BrainCircuit size={14} />
            <span style={{ flex: 1, textAlign: 'left' }}>Copilote Enquêteur IA</span>
            <span style={phaseBadgeStyle}>Phase 4</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

const disabledModuleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-1) var(--space-2)',
  backgroundColor: 'transparent',
  border: 'none',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-xs)',
  cursor: 'not-allowed',
};

const phaseBadgeStyle: React.CSSProperties = {
  fontSize: '10px',
  fontFamily: 'var(--font-mono)',
  padding: '1px 4px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-bg-elevated)',
  color: 'var(--color-text-muted)',
  border: '1px solid var(--color-border-subtle)',
};
