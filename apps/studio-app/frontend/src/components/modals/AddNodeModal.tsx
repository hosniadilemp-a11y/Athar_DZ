import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  PlusCircle,
  CreditCard,
  Phone,
  AtSign,
  Wand2,
  AlertCircle,
  Camera,
  Upload,
  Mail,
  User,
  Car,
  Globe,
  MapPin,
  ChevronDown,
} from 'lucide-react';
import type { LayerId, RegistryData } from '../../types/registry';
import registryDataRaw from '../../registry/registry.json';
import { NodeIcon } from '../canvas/NodeIcon';
import { useI18n } from '../../context/I18nContext';
import {
  ONTOLOGY_CATEGORY_COLORS,
  NODE_TYPE_TO_CATEGORY,
} from '../../store/useGraphStore';
import {
  ALGERIA_WILAYAS,
  getDairasByWilaya,
  getCommunesByDaira,
} from '../../utils/algeriaGeo';

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
  { key: 'HYPOTHESIS', labelFr: "Couche 4 : Hypothèse d'enquête", color: 'var(--color-layer-4-hypothesis)' },
  { key: 'FLOWS', labelFr: 'Couche 5 : Flux financiers & Traçabilité', color: 'var(--color-layer-5-flows)' },
];

const ALGERIAN_BANKS = [
  'Algérie Poste (BaridiMob / Edahabia)',
  'Banque de Développement Local (BDL)',
  'Banque Nationale d’Algérie (BNA)',
  'Banque Extérieure d’Algérie (BEA)',
  'Crédit Populaire d’Algérie (CPA)',
  'CNEP Banque',
  'Société Générale Algérie (SGA)',
  'BNP Paribas El Djazaïr',
  'Al Baraka Bank Algérie',
  'Autre Établissement Bancaire',
];

const TELCO_OPERATORS = [
  'Mobilis (ATM Mobilis)',
  'Djezzy (Optimum Telecom)',
  'Ooredoo (WTA Algérie)',
  'Algérie Télécom (ADSL / FTTH 4G)',
  'Autre Opérateur International',
];

const SOCIAL_PLATFORMS = [
  'Facebook (Page / Profil / Groupe)',
  'Telegram (Canal / Groupe / Bot)',
  'Instagram (@profil)',
  'TikTok (@compte)',
  'WhatsApp (Numéro / Groupe)',
  'Ouedkniss (Annonce / Boutique)',
  'X / Twitter',
  'Darkweb / Forum Cyber',
  'Autre Réseau',
];

// Entity types that naturally require/benefit from photo evidence by default
const PHOTO_CENTRIC_TYPES = new Set([
  'personne',
  'vehicule',
  'carte_bancaire',
  'document',
  'preuve_numerique',
  'preuve_physique',
]);

export const AddNodeModal: React.FC<AddNodeModalProps> = ({
  isOpen,
  initialType,
  position,
  onClose,
  onConfirm,
}) => {
  const { tr } = useI18n();

  // 1. Primary Ontological Type Selection (1-line combobox)
  const [type, setType] = useState(initialType || 'personne');
  const [typeSearch, setTypeSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Common Forensic Meta
  const [layer, setLayer] = useState<LayerId>('VERIFIED');
  const [confidence, setConfidence] = useState(0.85);
  const [customAlias, setCustomAlias] = useState('');

  // Photographic Evidence (local file or URL)
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoSourceMode, setPhotoSourceMode] = useState<'url' | 'file'>('file');
  const [isPhotoExpanded, setIsPhotoExpanded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Specific Entity Fields:
  // Personne
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [alias, setAlias] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [cin, setCin] = useState('');

  // Email
  const [emailAddress, setEmailAddress] = useState('');
  const [emailProvider, setEmailProvider] = useState('ProtonMail');

  // Téléphone
  const [msisdn, setMsisdn] = useState('');
  const [operateur, setOperateur] = useState(TELCO_OPERATORS[0] || 'Mobilis (ATM Mobilis)');
  const [titulaireSim, setTitulaireSim] = useState('');

  // Banque / BaridiMob
  const [rip, setRip] = useState('');
  const [banque, setBanque] = useState(ALGERIAN_BANKS[0] || 'Algérie Poste (BaridiMob / Edahabia)');
  const [titulaireCompte, setTitulaireCompte] = useState('');

  // Véhicule
  const [immatriculation, setImmatriculation] = useState('');
  const [marqueModele, setMarqueModele] = useState('');
  const [couleurVehicule, setCouleurVehicule] = useState('');

  // Réseaux Sociaux & OSINT
  const [plateforme, setPlateforme] = useState(SOCIAL_PLATFORMS[0] || 'Facebook (Page / Profil / Groupe)');
  const [identifiantCompte, setIdentifiantCompte] = useState('');
  const [urlProfil, setUrlProfil] = useState('');

  // Site Web
  const [urlSite, setUrlSite] = useState('');
  const [hebergeurSite, setHebergeurSite] = useState('');

  // Adresse / Territoire (Cascading Wilaya -> Daïra -> Commune)
  const [selectedWilayaCode, setSelectedWilayaCode] = useState('16');
  const [selectedDaira, setSelectedDaira] = useState('Sidi M\'Hamed');
  const [selectedCommune, setSelectedCommune] = useState('Alger Centre');
  const [rueDetails, setRueDetails] = useState('');

  // Autre / Générique
  const [designation, setDesignation] = useState('');

  // Smart URL Extractor input
  const [pasteUrlInput, setPasteUrlInput] = useState('');
  const [extractorMessage, setExtractorMessage] = useState<string | null>(null);

  // Validation error banner
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync initial type
  useEffect(() => {
    if (initialType) {
      setType(initialType);
      const typeDef = registry.node_types[initialType];
      setLayer(typeDef?.layer || 'VERIFIED');
      setValidationError(null);
      setExtractorMessage(null);
      setTypeSearch(typeDef?.label_fr || initialType);
    }
  }, [initialType, isOpen]);

  // Click outside listener for type dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  // Cascading updates for Daïras and Communes
  const availableDairas = useMemo(() => {
    return getDairasByWilaya(selectedWilayaCode);
  }, [selectedWilayaCode]);

  useEffect(() => {
    if (availableDairas.length > 0 && !availableDairas.includes(selectedDaira)) {
      setSelectedDaira(availableDairas[0] || '');
    }
  }, [availableDairas, selectedDaira]);

  const availableCommunes = useMemo(() => {
    return getCommunesByDaira(selectedWilayaCode, selectedDaira);
  }, [selectedWilayaCode, selectedDaira]);

  useEffect(() => {
    if (availableCommunes.length > 0) {
      const match = availableCommunes.find((c) => c.commune_name_ascii === selectedCommune);
      if (!match) {
        setSelectedCommune(availableCommunes[0]?.commune_name_ascii || '');
      }
    }
  }, [availableCommunes, selectedCommune]);

  // Filtered types for 1-line combobox
  const filteredTypes = useMemo(() => {
    const q = typeSearch.toLowerCase().trim();
    if (!q) return Object.entries(registry.node_types);
    return Object.entries(registry.node_types).filter(([key, def]) => {
      const label = (def.label_fr || key).toLowerCase();
      const cat = (NODE_TYPE_TO_CATEGORY[key] || '').toLowerCase();
      return key.toLowerCase().includes(q) || label.includes(q) || cat.includes(q);
    });
  }, [typeSearch]);

  if (!isOpen) return null;

  const currentTypeDef = registry.node_types[type];
  const iconName = currentTypeDef?.icon || 'help-circle';
  const categoryKey = NODE_TYPE_TO_CATEGORY[type] || 'acteurs';
  const categoryColor = ONTOLOGY_CATEGORY_COLORS[categoryKey] || '#3b82f6';
  const shouldShowPhoto = PHOTO_CENTRIC_TYPES.has(type) || isPhotoExpanded || Boolean(photoUrl);

  // Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setValidationError("Le fichier sélectionné n'est pas une image valide.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setValidationError("L'image ne doit pas dépasser 5 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
        setValidationError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Smart URL Extraction Routine
  const handleExtractUrl = () => {
    const raw = pasteUrlInput.trim();
    if (!raw) return;

    try {
      const parsedUrl = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
      const hostname = parsedUrl.hostname.toLowerCase();
      const pathname = parsedUrl.pathname;

      let detectedPlatform = 'Autre Réseau';
      let detectedHandle = '';

      if (hostname.includes('facebook.com') || hostname.includes('fb.com') || hostname.includes('fb.watch')) {
        detectedPlatform = 'Facebook (Page / Profil / Groupe)';
        const segments = pathname.split('/').filter(Boolean);
        detectedHandle = segments[0] || '';
        setType('compte_reseau');
      } else if (hostname.includes('t.me') || hostname.includes('telegram.me')) {
        detectedPlatform = 'Telegram (Canal / Groupe / Bot)';
        const segments = pathname.split('/').filter(Boolean);
        detectedHandle = segments[0] ? `@${segments[0]}` : '';
        setType('compte_reseau');
      } else if (hostname.includes('instagram.com')) {
        detectedPlatform = 'Instagram (@profil)';
        const segments = pathname.split('/').filter(Boolean);
        detectedHandle = segments[0] ? `@${segments[0]}` : '';
        setType('compte_reseau');
      } else if (hostname.includes('tiktok.com')) {
        detectedPlatform = 'TikTok (@compte)';
        const segments = pathname.split('/').filter(Boolean);
        detectedHandle = segments[0] || '';
        setType('compte_reseau');
      } else if (hostname.includes('ouedkniss.com')) {
        detectedPlatform = 'Ouedkniss (Annonce / Boutique)';
        detectedHandle = pathname.replace(/^\//, '');
        setType('publication_reseau');
      } else {
        detectedPlatform = 'Autre Réseau';
        detectedHandle = hostname;
        setType('site_web');
        setUrlSite(parsedUrl.href);
      }

      setPlateforme(detectedPlatform);
      setUrlProfil(parsedUrl.href);
      if (detectedHandle) setIdentifiantCompte(detectedHandle);
      setLayer('OSINT_RAW');
      setExtractorMessage(`Informations extraites : ${detectedPlatform}`);
      setValidationError(null);
    } catch {
      setExtractorMessage('Format d’URL non reconnu.');
    }
  };

  // Submit Handler with Automatic Label Derivation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    let derivedLabel = '';
    const properties: Record<string, any> = {
      photo_url: photoUrl.trim() || undefined,
      photo: photoUrl.trim() || undefined,
    };

    // 1. Email
    if (type === 'email') {
      const cleanEmail = emailAddress.trim();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setValidationError('Veuillez renseigner une adresse email valide (ex: suspect@proton.me).');
        return;
      }
      derivedLabel = cleanEmail;
      properties.email = cleanEmail;
      properties.fournisseur = emailProvider;
    }
    // 2. Téléphone
    else if (type === 'telephone') {
      const cleanPhone = msisdn.replace(/[\s.-]/g, '');
      if (!cleanPhone || cleanPhone.length < 9) {
        setValidationError('Le numéro de téléphone MSISDN est obligatoire (format algérien ex: 0550... ou +213...).');
        return;
      }
      derivedLabel = msisdn.trim();
      properties.msisdn = msisdn.trim();
      properties.operateur = operateur;
      properties.titulaire_sim = titulaireSim.trim() || 'Abonné non identifié / Puce Marché Noir';
      properties.operator = operateur.includes('Mobilis') ? 'Mobilis' : operateur.includes('Djezzy') ? 'Djezzy' : 'Ooredoo';
    }
    // 3. Compte / Carte Bancaire
    else if (type === 'compte_bancaire' || type === 'carte_bancaire') {
      const cleanRip = rip.replace(/[\s-]/g, '');
      if (!cleanRip || cleanRip.length < 10) {
        setValidationError('Le numéro de compte RIP/RIB BaridiMob est obligatoire (au moins 10 chiffres).');
        return;
      }
      if (!/^\d+$/.test(cleanRip)) {
        setValidationError('Le RIP ne doit contenir que des chiffres.');
        return;
      }
      const bankShort = banque.split('(')[0]?.trim() || 'Compte';
      derivedLabel = `${bankShort} ···${cleanRip.slice(-6)}`;
      properties.rip = cleanRip;
      properties.banque = banque;
      properties.titulaire = titulaireCompte.trim() || 'Prête-nom non identifié';
      properties.type_support = banque.includes('BaridiMob') ? 'Carte Edahabia Or EMV' : 'Compte bancaire classique';
    }
    // 4. Personne
    else if (type === 'personne') {
      const fullName = `${nom.trim()} ${prenom.trim()}`.trim();
      if (!fullName && !alias.trim()) {
        setValidationError('Veuillez renseigner au moins le nom et prénom ou un alias pour cette personne.');
        return;
      }
      derivedLabel = fullName || alias.trim();
      properties.nom = nom.trim() || undefined;
      properties.prenom = prenom.trim() || undefined;
      properties.alias = alias.trim() || undefined;
      properties.date_naissance = dateNaissance.trim() || undefined;
      properties.cin = cin.trim() || undefined;
    }
    // 5. Véhicule
    else if (type === 'vehicule') {
      const cleanPlate = immatriculation.trim();
      if (!cleanPlate) {
        setValidationError('Le numéro d’immatriculation (matricule) du véhicule est obligatoire.');
        return;
      }
      derivedLabel = `Plaque ${cleanPlate}`;
      properties.immatriculation = cleanPlate;
      properties.marque_modele = marqueModele.trim() || undefined;
      properties.couleur = couleurVehicule.trim() || undefined;
    }
    // 6. Réseaux Sociaux & OSINT
    else if (type === 'compte_reseau' || type === 'publication_reseau') {
      const cleanHandle = identifiantCompte.trim();
      if (!cleanHandle && !urlProfil.trim()) {
        setValidationError('Veuillez renseigner l’identifiant du compte ou l’URL du profil.');
        return;
      }
      const platShort = plateforme.split('(')[0]?.trim() || 'Réseau';
      derivedLabel = cleanHandle ? `${cleanHandle} (${platShort})` : `Compte ${platShort}`;
      properties.plateforme = plateforme;
      properties.identifiant_compte = cleanHandle || undefined;
      properties.url_profil = urlProfil.trim() || undefined;
    }
    // 7. Site Web
    else if (type === 'site_web') {
      const cleanUrl = urlSite.trim();
      if (!cleanUrl) {
        setValidationError('L’URL ou le domaine du site web est obligatoire.');
        return;
      }
      derivedLabel = cleanUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
      properties.url_site = cleanUrl;
      properties.hebergeur = hebergeurSite.trim() || undefined;
    }
    // 8. Adresse / Territoire (Cascading Wilaya / Daira / Commune)
    else if (type === 'adresse' || type === 'lieu') {
      const wilayaObj = ALGERIA_WILAYAS.find((w) => w.code === selectedWilayaCode);
      const wilayaName = wilayaObj ? wilayaObj.name : 'Alger';
      const cleanRue = rueDetails.trim();
      
      derivedLabel = cleanRue
        ? `${cleanRue}, ${selectedCommune} (${wilayaName})`
        : `${selectedCommune}, ${selectedDaira} (${wilayaName})`;

      properties.wilaya_code = selectedWilayaCode;
      properties.wilaya = wilayaName;
      properties.daira = selectedDaira;
      properties.commune = selectedCommune;
      properties.rue = cleanRue || undefined;
      properties.adresse_complete = derivedLabel;
    }
    // 9. Autre / Générique
    else {
      const cleanDesig = designation.trim();
      if (!cleanDesig) {
        setValidationError('Veuillez renseigner la désignation de cette entité.');
        return;
      }
      derivedLabel = cleanDesig;
      properties.designation = cleanDesig;
    }

    const finalLabel = customAlias.trim() || derivedLabel;

    onConfirm({
      type,
      label: finalLabel,
      layer,
      confidence,
      properties,
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
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        className="modal-card"
        style={{
          width: '560px',
          maxWidth: '95vw',
          maxHeight: '90vh',
          backgroundColor: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border-default)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.65)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                width: '30px',
                height: '30px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'var(--color-bg-surface)',
                border: `2px solid ${categoryColor}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: categoryColor,
              }}
            >
              <NodeIcon name={iconName} size={15} />
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <h3
                  id="add-node-modal-title"
                  style={{ fontSize: '13px', fontWeight: 700, margin: 0, color: 'var(--color-text-primary)' }}
                >
                  {tr('Ajout d\'Entité Judiciaire')} : {currentTypeDef?.label_fr || type}
                </h3>
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '10px',
                    backgroundColor: `${categoryColor}22`,
                    color: categoryColor,
                    border: `1px solid ${categoryColor}44`,
                  }}
                >
                  {categoryKey.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>
                {tr('Position canevas : x={x}, y={y}', { x: position?.x ?? 0, y: position?.y ?? 0 })}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-ghost btn-xs" onClick={onClose} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          style={{
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)',
            overflowY: 'auto',
          }}
        >
          {/* Validation Alert */}
          {validationError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid #ef4444',
                borderRadius: 'var(--radius-sm)',
                color: '#ef4444',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. COMPACT 1-LINE SEARCHABLE TYPE COMBOBOX */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '3px' }}>
              Type d'Entité Ontologique :
            </label>
            <div
              onClick={() => setIsDropdownOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-bg-elevated)',
                border: isDropdownOpen ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                padding: '3px 8px',
                cursor: 'pointer',
                gap: '8px',
              }}
            >
              <span style={{ color: categoryColor, display: 'flex', alignItems: 'center' }}>
                <NodeIcon name={iconName} size={15} />
              </span>
              <input
                type="text"
                value={typeSearch}
                onChange={(e) => {
                  setTypeSearch(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Tapez pour rechercher un type (email, tel, suspect, banque...)"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '11.5px',
                  color: 'var(--color-text-primary)',
                }}
              />
              <span
                style={{
                  fontSize: '9.5px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '10px',
                  backgroundColor: `${categoryColor}22`,
                  color: categoryColor,
                }}
              >
                {categoryKey}
              </span>
              <ChevronDown size={14} style={{ color: 'var(--color-text-muted)', flexShrink: 0 }} />
            </div>

            {/* 1-Line Dropdown Results Panel */}
            {isDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '2px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: 'var(--color-bg-surface)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  zIndex: 50,
                  padding: '2px',
                }}
              >
                {filteredTypes.length === 0 ? (
                  <div style={{ padding: '8px', fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                    Aucun type correspondant à "{typeSearch}"
                  </div>
                ) : (
                  filteredTypes.map(([key, def]) => {
                    const isSelected = key === type;
                    const cat = NODE_TYPE_TO_CATEGORY[key] || 'acteurs';
                    const col = ONTOLOGY_CATEGORY_COLORS[cat] || '#3b82f6';
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setType(key);
                          setTypeSearch(def.label_fr || key);
                          setIsDropdownOpen(false);
                          setValidationError(null);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '5px 8px',
                          cursor: 'pointer',
                          backgroundColor: isSelected ? 'var(--color-bg-elevated)' : 'transparent',
                          borderRadius: 'var(--radius-xs)',
                          borderLeft: isSelected ? `3px solid ${col}` : '3px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = isSelected ? 'var(--color-bg-elevated)' : 'transparent';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <NodeIcon name={def.icon || 'help-circle'} size={14} style={{ color: col }} />
                          <span style={{ fontSize: '11px', fontWeight: isSelected ? 700 : 500, color: 'var(--color-text-primary)' }}>
                            {def.label_fr || key}
                          </span>
                        </div>
                        <span style={{ fontSize: '9px', color: col, textTransform: 'uppercase', fontWeight: 600 }}>
                          {cat}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* SMART URL EXTRACTOR (Displayed for Social, Web, or OSINT) */}
          {(type === 'compte_reseau' || type === 'site_web' || type === 'publication_reseau' || type === 'personne') && (
            <div
              style={{
                padding: '8px 10px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent-text)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Wand2 size={13} />
                  Extracteur Automatique de Liens (OSINT)
                </span>
                <span style={{ fontSize: '9.5px', color: 'var(--color-text-muted)' }}>
                  Facebook, Telegram, Ouedkniss, Insta, Web
                </span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Collez le lien URL du profil, canal ou annonce..."
                  value={pasteUrlInput}
                  onChange={(e) => setPasteUrlInput(e.target.value)}
                  style={{
                    flex: 1,
                    fontSize: '11px',
                    padding: '4px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-xs"
                  onClick={handleExtractUrl}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                >
                  <Wand2 size={12} />
                  <span>Extraire</span>
                </button>
              </div>
              {extractorMessage && (
                <div style={{ fontSize: '10px', color: 'var(--color-status-success)', fontWeight: 600 }}>
                  ✓ {extractorMessage}
                </div>
              )}
            </div>
          )}

          {/* DEDICATED FORENSIC FIELDS PER ENTITY TYPE */}

          {/* 1. EMAIL */}
          {type === 'email' && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Mail size={14} />
                Adresse de Messagerie Électronique (Obligatoire)
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Adresse Email * :
                </label>
                <input
                  type="email"
                  required
                  value={emailAddress}
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: karim.zerrouki@proton.me ou contact@societe.dz"
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Fournisseur / Webmail :
                </label>
                <input
                  type="text"
                  value={emailProvider}
                  onChange={(e) => setEmailProvider(e.target.value)}
                  placeholder="ProtonMail, Gmail, Tutanota, Yahoo..."
                  style={{
                    width: '100%',
                    fontSize: '11px',
                    padding: '4px 6px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 2. TÉLÉPHONE */}
          {type === 'telephone' && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                border: '1px solid rgba(6, 182, 212, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Phone size={14} />
                Ligne Téléphonique &amp; Abonnement SIM (Obligatoire)
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Numéro de Téléphone MSISDN * :
                </label>
                <input
                  type="text"
                  required
                  value={msisdn}
                  onChange={(e) => {
                    setMsisdn(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: +213 550 44 91 22 ou 0661 44 12 89"
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Opérateur Mobile :
                  </label>
                  <select
                    value={operateur}
                    onChange={(e) => setOperateur(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {TELCO_OPERATORS.map((op) => (
                      <option key={op} value={op}>
                        {op}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Identité Titulaire SIM :
                  </label>
                  <input
                    type="text"
                    value={titulaireSim}
                    onChange={(e) => setTitulaireSim(e.target.value)}
                    placeholder="Nom ou Puce Marché Noir..."
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. COMPTE BANCAIRE / BARIDIMOB */}
          {(type === 'compte_bancaire' || type === 'carte_bancaire') && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CreditCard size={14} />
                Compte Bancaire, CCP ou Carte BaridiMob (Obligatoire)
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Numéro de compte RIP / RIB (20 chiffres) * :
                </label>
                <input
                  type="text"
                  required
                  value={rip}
                  onChange={(e) => {
                    setRip(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: 00799999002148593214"
                  maxLength={24}
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Établissement Bancaire :
                  </label>
                  <select
                    value={banque}
                    onChange={(e) => setBanque(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {ALGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Titulaire / Prête-nom :
                  </label>
                  <input
                    type="text"
                    value={titulaireCompte}
                    onChange={(e) => setTitulaireCompte(e.target.value)}
                    placeholder="Nom complet..."
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. PERSONNE PHYSIQUE */}
          {type === 'personne' && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <User size={14} />
                État-Civil &amp; Identité de la Personne
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Nom de famille * :
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="ex: Zerrouki"
                    style={{
                      width: '100%',
                      fontSize: '11.5px',
                      padding: '5px 8px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Prénom :
                  </label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="ex: Karim"
                    style={{
                      width: '100%',
                      fontSize: '11.5px',
                      padding: '5px 8px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Alias / Surnom :
                  </label>
                  <input
                    type="text"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                    placeholder="ex: El Hadj, Boss"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Date de naissance :
                  </label>
                  <input
                    type="text"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                    placeholder="JJ/MM/AAAA"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    N° CNI / Passeport :
                  </label>
                  <input
                    type="text"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    placeholder="NNI 18 chiffres..."
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 5. VÉHICULE */}
          {type === 'vehicule' && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(234, 88, 12, 0.08)',
                border: '1px solid rgba(234, 88, 12, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ea580c', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Car size={14} />
                Véhicule &amp; Immatriculation (Obligatoire)
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Numéro d'Immatriculation (Matricule) * :
                </label>
                <input
                  type="text"
                  required
                  value={immatriculation}
                  onChange={(e) => {
                    setImmatriculation(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: 01458-118-16"
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Marque &amp; Modèle :
                  </label>
                  <input
                    type="text"
                    value={marqueModele}
                    onChange={(e) => setMarqueModele(e.target.value)}
                    placeholder="ex: Renault Clio 4, Golf 7..."
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Couleur :
                  </label>
                  <input
                    type="text"
                    value={couleurVehicule}
                    onChange={(e) => setCouleurVehicule(e.target.value)}
                    placeholder="Noir, Gris métallisé..."
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 6. RÉSEAUX SOCIAUX */}
          {(type === 'compte_reseau' || type === 'publication_reseau') && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(236, 72, 153, 0.08)',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#ec4899', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <AtSign size={14} />
                Profil Réseau Social &amp; OSINT
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Plateforme :
                  </label>
                  <select
                    value={plateforme}
                    onChange={(e) => setPlateforme(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    Identifiant / Handle * :
                  </label>
                  <input
                    type="text"
                    value={identifiantCompte}
                    onChange={(e) => {
                      setIdentifiantCompte(e.target.value);
                      setValidationError(null);
                    }}
                    placeholder="ex: @boss_dz ou ID page"
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  URL Complète du Profil / Post :
                </label>
                <input
                  type="text"
                  value={urlProfil}
                  onChange={(e) => setUrlProfil(e.target.value)}
                  placeholder="https://facebook.com/..., https://t.me/..."
                  style={{
                    width: '100%',
                    fontSize: '11px',
                    padding: '4px 6px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 7. SITE WEB */}
          {type === 'site_web' && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe size={14} />
                Site Web, FQDN ou Infrastructure Web
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  URL ou Nom de Domaine * :
                </label>
                <input
                  type="text"
                  required
                  value={urlSite}
                  onChange={(e) => {
                    setUrlSite(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: https://dark-market.dz ou forum-finance.com"
                  style={{
                    width: '100%',
                    fontSize: '11.5px',
                    fontFamily: 'var(--font-mono)',
                    padding: '5px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Hébergeur / Registrar :
                </label>
                <input
                  type="text"
                  value={hebergeurSite}
                  onChange={(e) => setHebergeurSite(e.target.value)}
                  placeholder="Cloudflare, OVH, Hostinger..."
                  style={{
                    width: '100%',
                    fontSize: '11px',
                    padding: '4px 6px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 8. ADRESSE / LIEU / TERRITOIRE (CASCADING 58 WILAYAS -> DAÏRAS -> COMMUNES) */}
          {(type === 'adresse' || type === 'lieu' || type === 'antenne_bts') && (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'rgba(234, 179, 8, 0.08)',
                border: '1px solid rgba(234, 179, 8, 0.35)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#eab308', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <MapPin size={14} />
                Division Territoriale Officielle (58 Wilayas d'Algérie)
              </div>

              {/* 3 Cascading Selectors: Wilaya -> Daïra -> Commune */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    1. Wilaya (58) * :
                  </label>
                  <select
                    value={selectedWilayaCode}
                    onChange={(e) => setSelectedWilayaCode(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {ALGERIA_WILAYAS.map((w) => (
                      <option key={w.code} value={w.code}>
                        {w.label} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    2. Daïra * :
                  </label>
                  <select
                    value={selectedDaira}
                    onChange={(e) => setSelectedDaira(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {availableDairas.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                    3. Commune * :
                  </label>
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    style={{
                      width: '100%',
                      fontSize: '11px',
                      padding: '4px 6px',
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border-default)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {availableCommunes.map((c) => (
                      <option key={c.id} value={c.commune_name_ascii}>
                        {c.commune_name_ascii} ({c.commune_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '2px' }}>
                  Rue, Numéro, Bâtiment / Repère (Optionnel) :
                </label>
                <input
                  type="text"
                  value={rueDetails}
                  onChange={(e) => setRueDetails(e.target.value)}
                  placeholder="ex: 14 Rue Didouche Mourad, Hangar Zone Industrielle..."
                  style={{
                    width: '100%',
                    fontSize: '11px',
                    padding: '4px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            </div>
          )}

          {/* 9. AUTRES TYPES / GÉNÉRIQUE */}
          {type !== 'email' &&
            type !== 'telephone' &&
            type !== 'compte_bancaire' &&
            type !== 'carte_bancaire' &&
            type !== 'personne' &&
            type !== 'vehicule' &&
            type !== 'compte_reseau' &&
            type !== 'publication_reseau' &&
            type !== 'site_web' &&
            type !== 'adresse' &&
            type !== 'lieu' &&
            type !== 'antenne_bts' && (
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Désignation / Identification de l'entité * :
                </label>
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => {
                    setDesignation(e.target.value);
                    setValidationError(null);
                  }}
                  placeholder="ex: Arme de poing 9mm, Société SARL Import, Disque dur scellé..."
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    padding: '6px 8px',
                    backgroundColor: 'var(--color-bg-elevated)',
                    border: '1px solid var(--color-border-default)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--color-text-primary)',
                  }}
                />
              </div>
            )}

          {/* CONDITIONAL PHOTOGRAPHIC EVIDENCE (Only when needed or expanded) */}
          {shouldShowPhoto ? (
            <div
              style={{
                padding: '10px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Camera size={13} style={{ color: 'var(--color-accent-primary)' }} />
                  <span>Photographie / Fiche Signalétique (Scellé ISO 27037)</span>
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceMode('file')}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: photoSourceMode === 'file' ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: photoSourceMode === 'file' ? 'var(--color-accent-subtle)' : 'transparent',
                      color: photoSourceMode === 'file' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    Fichier PC
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSourceMode('url')}
                    style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: photoSourceMode === 'url' ? '1px solid var(--color-accent-primary)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: photoSourceMode === 'url' ? 'var(--color-accent-subtle)' : 'transparent',
                      color: photoSourceMode === 'url' ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
                      cursor: 'pointer',
                    }}
                  >
                    Lien URL
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {photoUrl ? (
                  <div style={{ position: 'relative', width: '46px', height: '46px', flexShrink: 0 }}>
                    <img
                      src={photoUrl}
                      alt="Aperçu scellé"
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: 'var(--radius-sm)',
                        objectFit: 'cover',
                        border: '1px solid var(--color-accent-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      title="Supprimer la photo"
                      style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-surface)',
                      border: '1px dashed var(--color-border-default)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-text-muted)',
                      flexShrink: 0,
                    }}
                  >
                    <Camera size={16} />
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  {photoSourceMode === 'file' ? (
                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          border: '1px dashed var(--color-border-default)',
                          padding: '5px 8px',
                          width: '100%',
                          justifyContent: 'center',
                          fontSize: '11px',
                        }}
                      >
                        <Upload size={12} />
                        <span>{photoUrl ? 'Remplacer l’image du PC' : 'Parcourir les photos du PC...'}</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="Collez le lien URL direct de la photo (https://...)..."
                        style={{
                          width: '100%',
                          fontSize: '11px',
                          padding: '4px 6px',
                          backgroundColor: 'var(--color-bg-surface)',
                          border: '1px solid var(--color-border-default)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--color-text-primary)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn-ghost btn-xs"
              onClick={() => setIsPhotoExpanded(true)}
              style={{
                alignSelf: 'flex-start',
                fontSize: '10.5px',
                color: 'var(--color-accent-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 6px',
              }}
            >
              <Camera size={12} />
              <span>+ Joindre une photographie / scellé image (Optionnel)</span>
            </button>
          )}

          {/* OPTIONAL CUSTOM ALIAS OVERRIDE */}
          <div>
            <label style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
              Alias personnalisé sur le canevas (Optionnel - par défaut l'identifiant ci-dessus sera utilisé) :
            </label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="Laisser vide pour utiliser automatiquement l'identifiant..."
              style={{
                width: '100%',
                fontSize: '11px',
                padding: '4px 8px',
                backgroundColor: 'var(--color-bg-elevated)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-text-primary)',
              }}
            />
          </div>

          {/* CALQUE JUDICIAIRE & CONFIANCE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-3)' }}>
            <div>
              <label style={{ fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '3px' }}>
                {tr('Calque Judiciaire :')}
              </label>
              <select
                value={layer}
                onChange={(e) => setLayer(e.target.value as LayerId)}
                style={{
                  width: '100%',
                  fontSize: '11px',
                  padding: '4px 6px',
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border-default)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {LAYER_OPTIONS.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.labelFr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '3px' }}>
                <span>{tr('Niveau de Preuve :')}</span>
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
          </div>

          {/* Footer Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 'var(--space-2)',
              marginTop: 'var(--space-2)',
              paddingTop: 'var(--space-2)',
              borderTop: '1px solid var(--color-border-subtle)',
            }}
          >
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
              {tr('Annuler')}
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={15} />
              <span>{tr('Ajouter au Dossier')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
