import { useEffect, useState } from 'react';
import { Activity, Moon, Shield, Sun } from 'lucide-react';
import { useI18n } from './context/I18nContext';
import { useTheme } from './context/ThemeContext';
import type { Locale } from './i18n/translations';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

type HealthState = 'checking' | 'ok' | 'error';

export function App() {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [health, setHealth] = useState<HealthState>('checking');

  useEffect(() => {
    let active = true;
    fetch(`${API_BASE}/health`)
      .then((res) => (res.ok ? 'ok' : 'error'))
      .catch(() => 'error' as const)
      .then((state) => {
        if (active) setHealth(state);
      });
    return () => {
      active = false;
    };
  }, []);

  const healthLabel =
    health === 'checking'
      ? t.healthChecking
      : health === 'ok'
        ? t.healthOnline
        : t.healthOffline;

  const healthClass =
    health === 'ok'
      ? 'status-pill status-pill-ok'
      : health === 'error'
        ? 'status-pill status-pill-error'
        : 'status-pill';

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="top-bar-brand">
          <Shield size={20} aria-hidden="true" />
          <span>{t.appName}</span>
          <span className="status-pill">{t.studioSubtitle}</span>
        </div>

        <div className="top-bar-actions">
          <label htmlFor="locale-select" className="sr-only">
            {t.languageLabel}
          </label>
          <select
            id="locale-select"
            className="select-control"
            aria-label={t.languageLabel}
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
          >
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
            <option value="en">English</option>
          </select>

          <button
            type="button"
            className="btn-control"
            onClick={toggleTheme}
            aria-label={t.toggleThemeLabel}
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            <span>{theme === 'dark' ? t.themeLight : t.themeDark}</span>
          </button>
        </div>
      </header>

      <main className="main-workspace">
        <section className="canvas-stage" aria-label={t.foundationTitle}>
          <div className="foundation-card">
            <h1 className="foundation-title">{t.foundationTitle}</h1>
            <p className="foundation-desc">{t.foundationDesc}</p>
            <div>
              <span className={healthClass} aria-live="polite">
                <Activity size={14} aria-hidden="true" />
                <span>{healthLabel}</span>
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="status-bar">
        <span>{t.auditReady}</span>
        <span className={healthClass}>
          <span>{healthLabel}</span>
        </span>
      </footer>
    </div>
  );
}

export default App;
