import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

export interface GeoSuggestionOption {
  value: string;
  label: string;
  secondary?: string;
}

export interface GeoSuggestionSelectProps {
  id?: string;
  label: string;
  placeholder: string;
  value: string;
  options: GeoSuggestionOption[];
  onSelect: (value: string) => void;
}

/**
 * Searchable Algerian administrative division selector (Wilaya -> Daïra -> Commune)
 * styled strictly via design tokens and CSS classes (no inline styles or sub-12px text).
 */
export const GeoSuggestionSelect: React.FC<GeoSuggestionSelectProps> = ({
  id,
  label,
  placeholder,
  value,
  options,
  onSelect,
}) => {
  const { tr } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutside);
    }
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen]);

  const filtered = useMemo(() => {
    const q = query
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
    if (!q) return options;
    return options.filter((opt) => {
      const l = opt.label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const s = (opt.secondary || '').toLowerCase();
      return l.includes(q) || s.includes(query.trim().toLowerCase());
    });
  }, [options, query]);

  return (
    <div ref={wrapperRef} className="geo-select-field">
      <label className="geo-select-label" htmlFor={id}>
        {label}
      </label>
      <div
        className={`geo-select-control${isOpen ? ' is-open' : ''}`}
        onClick={() => setIsOpen(true)}
      >
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          className="geo-select-input"
          value={isOpen ? query : selectedOption?.label || value}
          placeholder={placeholder}
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              setQuery('');
            }
          }}
        />
        <ChevronDown size={14} className="geo-select-chevron" aria-hidden="true" />
      </div>
      {isOpen && (
        <div className="geo-select-dropdown" role="listbox">
          {filtered.length === 0 ? (
            <div className="geo-select-empty">{tr('Aucun résultat')}</div>
          ) : (
            filtered.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`geo-select-option${isSelected ? ' is-selected' : ''}`}
                  onClick={() => {
                    onSelect(opt.value);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <span className="geo-select-option-label">{opt.label}</span>
                  {opt.secondary && (
                    <span className="geo-select-option-secondary">{opt.secondary}</span>
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
