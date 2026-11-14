import React, { useState, useMemo } from 'react';
import { useGraphStore } from '../../store/useGraphStore';
import { NodeIcon } from '../canvas/NodeIcon';
import registryDataRaw from '../../registry/registry.json';
import type { RegistryData, LayerId } from '../../types/registry';
import {
  ChevronDown,
  Layers,
  Wrench,
  Filter,
  HelpCircle,
  FileText,
  Link as LinkIcon,
  Check,
  Eye,
  EyeOff,
  CircleDollarSign,
  Phone,
  Radio,
} from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

const registry = registryDataRaw as unknown as RegistryData;

interface LeftAccordionProps {
  onAddNodeAtCenter: (typeKey: string) => void;
  onOpenAuditViewer?: () => void;
  onFilterCategory?: (category: string) => void;
  onRunQuery?: (queryName: string) => void;
  style?: React.CSSProperties;
}

const LAYER_KEYS: LayerId[] = ['VERIFIED', 'OSINT_RAW', 'INFRA', 'HYPOTHESIS', 'FLOWS'];

type DomainType = 'all' | 'territory' | 'actors' | 'telecom' | 'finance' | 'socmint' | 'cyber' | 'biometrics' | 'legal';

interface NodeItemDef {
  key: string;
  domain: DomainType;
  dbBadge: string;
}

const ALL_37_NODES: NodeItemDef[] = [
  // Territory
  { key: 'wilaya', domain: 'territory', dbBadge: 'Cadastre' },
  { key: 'daira', domain: 'territory', dbBadge: 'Cadastre' },
  { key: 'commune', domain: 'territory', dbBadge: 'Cadastre' },
  { key: 'unite', domain: 'territory', dbBadge: 'Procédure CPP' },
  { key: 'affaire', domain: 'territory', dbBadge: 'Procédure CPP' },
  { key: 'magistrat', domain: 'territory', dbBadge: 'Procédure CPP' },

  // Actors
  { key: 'personne', domain: 'actors', dbBadge: 'Identité Cible' },
  { key: 'entreprise', domain: 'actors', dbBadge: 'Registre Commerce' },
  { key: 'vehicule', domain: 'actors', dbBadge: 'Immatriculation' },

  // Telecom
  { key: 'telephone', domain: 'telecom', dbBadge: 'Ligne E.164' },
  { key: 'carte_sim', domain: 'telecom', dbBadge: 'Puce IMSI' },
  { key: 'appareil_mobile', domain: 'telecom', dbBadge: 'Terminal IMEI' },
  { key: 'antenne_bts', domain: 'telecom', dbBadge: 'Bornage Relais' },
  { key: 'telecom_cdr', domain: 'telecom', dbBadge: 'Trafic Télécom' },

  // Finance
  { key: 'compte_bancaire', domain: 'finance', dbBadge: 'Flux Bancaire' },
  { key: 'transaction_financiere', domain: 'finance', dbBadge: 'Virement / Retrait' },
  { key: 'guichet_gab', domain: 'finance', dbBadge: 'DAB / GAB' },
  { key: 'crypto_wallet', domain: 'finance', dbBadge: 'Adresse Crypto' },
  { key: 'transaction_crypto', domain: 'finance', dbBadge: 'Flux Blockchain' },

  // SOCMINT
  { key: 'compte_social', domain: 'socmint', dbBadge: 'Profil Public' },
  { key: 'publication_sociale', domain: 'socmint', dbBadge: 'Publication OSINT' },
  { key: 'canal_telegram', domain: 'socmint', dbBadge: 'Canal Messagerie' },
  { key: 'message_chat', domain: 'socmint', dbBadge: 'Échange Chiffré' },
  { key: 'adresse_email', domain: 'socmint', dbBadge: 'Courriel Trace' },
  { key: 'site_web', domain: 'socmint', dbBadge: 'Nom de Domaine' },
  { key: 'identifiant_infrastructure', domain: 'socmint', dbBadge: 'Pivot Technique' },

  // Cyber
  { key: 'fichier_apk', domain: 'cyber', dbBadge: 'Binaire APK' },
  { key: 'serveur_c2', domain: 'cyber', dbBadge: 'Serveur C2' },
  { key: 'certificat_tls', domain: 'cyber', dbBadge: 'Certificat SSL' },
  { key: 'artefact_dfir', domain: 'cyber', dbBadge: 'Pièce Forensique' },
  { key: 'session_recherche', domain: 'cyber', dbBadge: "Journal d'Acte" },

  // Biometrics
  { key: 'enregistrement_vocal', domain: 'biometrics', dbBadge: 'Scellé Audio' },
  { key: 'empreinte_faciale', domain: 'biometrics', dbBadge: 'Biométrie Faciale' },
  { key: 'image_preuve', domain: 'biometrics', dbBadge: 'Cliché Preuve' },

  // Legal
  { key: 'document_judiciaire', domain: 'legal', dbBadge: 'Procès-Verbal' },
  { key: 'scelle_numerique', domain: 'legal', dbBadge: 'Scellé Inaltérable' },
  { key: 'preuve_merkle', domain: 'legal', dbBadge: 'Horodatage RFC' },
];

export const LeftAccordion: React.FC<LeftAccordionProps> = ({
  onAddNodeAtCenter,
  onOpenAuditViewer,
  onFilterCategory,
  onRunQuery,
  style,
}) => {
  const { t, tr, label: labelHelper } = useI18n();
  const {
    activeLayers,
    toggleLayer,
    setAllLayers,
    isLinkMode,
    setLinkMode,
    nodes,
  } = useGraphStore();

  const [openSections, setOpenSections] = useState({
    layers: true,
    toolbox: true,
    filters: false,
    queries: false,
  });

  const [selectedDomain, setSelectedDomain] = useState<DomainType>('all');
  const [activeNatureFilter, setActiveNatureFilter] = useState('all');

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Compute node count per layer in active graph
  const countPerLayer = useMemo(() => {
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

  // Filter 37 nodes by selected domain
  const filteredNodes = useMemo(() => {
    if (selectedDomain === 'all') return ALL_37_NODES;
    return ALL_37_NODES.filter((n) => n.domain === selectedDomain);
  }, [selectedDomain]);

  const handleDragStart = (e: React.DragEvent, typeKey: string) => {
    e.dataTransfer.setData('text/plain', typeKey);
    e.dataTransfer.setData('application/json', JSON.stringify({ type: typeKey }));
    e.dataTransfer.setData('athar/node-type', typeKey);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const domainChips: [DomainType, string][] = [
    ['all', tr('Tous')],
    ['territory', tr('Territoire')],
    ['actors', tr('Acteurs')],
    ['telecom', tr('Télécoms')],
    ['finance', tr('Finances')],
    ['socmint', 'SOCMINT'],
    ['cyber', tr('Cyber')],
    ['biometrics', tr('Biométrie')],
    ['legal', tr('Preuve')],
  ];

  const natureFilters: [string, string][] = [
    ['all', tr('Tous (8)')],
    ['phone', tr('Téléphonie (1)')],
    ['social', tr('Réseaux (3)')],
    ['web', tr('Web / Serveurs (2)')],
    ['person', tr('Sujets (1)')],
  ];

  return (
    <aside
      className="panel-left"
      style={style}
      role="region"
      aria-label={tr('Panneau accordéon des calques, outils et filtres')}
    >
      {/* 1. Calques d'Enquête Accordion */}
      <div className="accordion-group">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('layers')}
          aria-expanded={openSections.layers}
        >
          <div className="accordion-title-left">
            <Layers size={14} className="text-accent" />
            <span>{t.layersTitle}</span>
          </div>
          <div className="accordion-header-right">
            <span className="chip chip-neutral font-mono text-xs">
              {activeLayers.size}/5
            </span>
            <ChevronDown
              size={12}
              className={`accordion-chevron ${openSections.layers ? 'is-open' : ''}`}
            />
          </div>
        </button>

        {openSections.layers && (
          <div className="accordion-panel-content">
            <div className="layers-quick-bar">
              <span className="text-xs text-muted">{tr('Visibilité :')}</span>
              <div className="layers-quick-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setAllLayers(true)}
                  title={tr('Afficher tous les calques')}
                >
                  {tr('Tous')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={() => setAllLayers(false)}
                  title={tr('Masquer tous les calques')}
                >
                  {tr('Aucun')}
                </button>
              </div>
            </div>

            <div className="layer-list" role="list">
              {LAYER_KEYS.map((layerKey, idx) => {
                const layerDef = registry.layers[layerKey];
                const isActive = activeLayers.has(layerKey);
                const count = countPerLayer[layerKey] || 0;
                const layerNum = idx + 1;
                const layerName = labelHelper(layerDef, layerKey);

                return (
                  <div
                    key={layerKey}
                    className={`layer-row-item layer-${layerNum} ${!isActive ? 'is-dimmed' : ''}`}
                    role="listitem"
                  >
                    <button
                      type="button"
                      className="layer-eye-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLayer(layerKey);
                      }}
                      aria-label={isActive ? `${tr('Masquer')} ${layerName}` : `${tr('Afficher')} ${layerName}`}
                      title={isActive ? tr('Masquer le calque') : tr('Afficher le calque')}
                    >
                      {isActive ? (
                        <Eye size={13} className="text-secondary" />
                      ) : (
                        <EyeOff size={13} className="text-muted" />
                      )}
                    </button>

                    <button
                      type="button"
                      className="layer-label-btn"
                      onClick={() => toggleLayer(layerKey)}
                      aria-pressed={isActive}
                    >
                      <span
                        className={`layer-dot-indicator ${layerKey === 'HYPOTHESIS' ? 'is-dashed' : ''}`}
                        style={{ backgroundColor: layerDef?.color }}
                      />
                      <span className="layer-name-text">
                        {layerNum}. {layerName}
                      </span>
                    </button>

                    <span className="chip chip-neutral font-mono text-xs">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2. Creation & Liaisons (37 Node Types) */}
      <div className="accordion-group">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('toolbox')}
          aria-expanded={openSections.toolbox}
        >
          <div className="accordion-title-left">
            <Wrench size={14} className="text-accent" />
            <span>{t.creationTitle}</span>
          </div>
          <div className="accordion-header-right">
            <span className="chip chip-neutral font-mono text-xs">37</span>
            <ChevronDown
              size={12}
              className={`accordion-chevron ${openSections.toolbox ? 'is-open' : ''}`}
            />
          </div>
        </button>

        {openSections.toolbox && (
          <div className="accordion-panel-content">
            {/* Link Mode Button */}
            <button
              type="button"
              className={`link-tool-btn ${isLinkMode ? 'active' : ''}`}
              onClick={() => setLinkMode(!isLinkMode)}
              aria-pressed={isLinkMode}
              title={tr('Cliquer pour relier deux nœuds sur le canevas')}
            >
              <LinkIcon size={13} />
              <span>{t.linkModeLabel}</span>
              {isLinkMode && <Check size={12} />}
            </button>

            {/* Domain Filter Chips */}
            <div className="toolbox-domain-selector" role="tablist" aria-label={tr('Filtrer les entités par domaine')}>
              {domainChips.map(([domKey, domLabel]) => (
                <button
                  key={domKey}
                  type="button"
                  className={`toolbox-domain-chip ${selectedDomain === domKey ? 'active' : ''}`}
                  onClick={() => setSelectedDomain(domKey)}
                >
                  {domLabel}
                </button>
              ))}
            </div>

            <div className="toolbox-grid-header">
              <span>{tr('Cliquer ou glisser :')}</span>
              <span className="font-mono text-muted">{tr('{n} types', { n: filteredNodes.length })}</span>
            </div>

            {/* Auto-responsive Grid of Node Items (Icon + Type only) */}
            <div className="toolbox-nodes-grid" role="list">
              {filteredNodes.map((item) => {
                const typeDef = registry.node_types[item.key];
                const nodeLabel = labelHelper(typeDef, item.key);
                const iconName = typeDef?.icon || 'help-circle';

                return (
                  <div
                    key={item.key}
                    className="node-drag-item"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, item.key)}
                    onClick={() => onAddNodeAtCenter(item.key)}
                    role="listitem"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onAddNodeAtCenter(item.key);
                      }
                    }}
                    title={tr('Cliquer pour ajouter au centre ou glisser sur le canevas : {label}', { label: nodeLabel })}
                  >
                    <span className="node-drag-icon">
                      <NodeIcon name={iconName} size={15} />
                    </span>
                    <span className="node-drag-title">{nodeLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 3. Filtres par Nature */}
      <div className="accordion-group">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('filters')}
          aria-expanded={openSections.filters}
        >
          <div className="accordion-title-left">
            <Filter size={14} className="text-accent" />
            <span>{t.filtersTitle}</span>
          </div>
          <div className="accordion-header-right">
            <span className="chip chip-neutral font-mono text-xs">8</span>
            <ChevronDown
              size={12}
              className={`accordion-chevron ${openSections.filters ? 'is-open' : ''}`}
            />
          </div>
        </button>

        {openSections.filters && (
          <div className="accordion-panel-content">
            <div className="filter-chips-grid">
              {natureFilters.map(([fKey, fLabel]) => (
                <button
                  key={fKey}
                  type="button"
                  className={`filter-btn ${activeNatureFilter === fKey ? 'active' : ''}`}
                  onClick={() => {
                    setActiveNatureFilter(fKey);
                    onFilterCategory?.(fKey);
                  }}
                >
                  {fLabel}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Questions Metier (Analyses Guidees) */}
      <div className="accordion-group">
        <button
          type="button"
          className="accordion-header-btn"
          onClick={() => toggleSection('queries')}
          aria-expanded={openSections.queries}
        >
          <div className="accordion-title-left">
            <HelpCircle size={14} className="text-accent" />
            <span>{t.queriesTitle}</span>
          </div>
          <div className="accordion-header-right">
            <span className="chip chip-neutral font-mono text-xs">
              {tr('Analyses')}
            </span>
            <ChevronDown
              size={12}
              className={`accordion-chevron ${openSections.queries ? 'is-open' : ''}`}
            />
          </div>
        </button>

        {openSections.queries && (
          <div className="accordion-panel-content">
            <div className="queries-list">
              <button
                type="button"
                className="btn btn-ghost btn-xs query-action-btn"
                onClick={() => onRunQuery?.('money')}
              >
                <CircleDollarSign size={13} className="text-warning" />
                <span>{tr('Qui encaisse les fonds BaridiMob ?')}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs query-action-btn"
                onClick={() => onRunQuery?.('phones')}
              >
                <Phone size={13} className="text-info" />
                <span>{tr('Téléphones communs identifiés ?')}</span>
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-xs query-action-btn"
                onClick={() => onRunQuery?.('bts')}
              >
                <Radio size={13} className="text-success" />
                <span>{tr('Bornages relais suspects (Oran / Alger) ?')}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer: Registre d'Audit Forensique Button */}
      <div className="panel-left-footer">
        <button
          type="button"
          className="btn btn-secondary btn-sm w-full"
          style={{ justifyContent: 'flex-start' }}
          onClick={onOpenAuditViewer}
        >
          <FileText size={13} className="text-accent" />
          <span>{t.auditLedgerBtn}</span>
        </button>
      </div>
    </aside>
  );
};
