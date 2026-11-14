import React, { createContext, useContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useI18n } from './I18nContext';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { dir } = useI18n();

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', title?: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const newToast: ToastItem = { id, type, title, message };
      setToasts((prev) => [...prev.slice(-4), newToast]); // keep max 5 toasts

      setTimeout(() => {
        dismissToast(id);
      }, 4500);
    },
    [dismissToast]
  );

  const success = useCallback((msg: string, title?: string) => showToast(msg, 'success', title), [showToast]);
  const error = useCallback((msg: string, title?: string) => showToast(msg, 'error', title), [showToast]);
  const warning = useCallback((msg: string, title?: string) => showToast(msg, 'warning', title), [showToast]);
  const info = useCallback((msg: string, title?: string) => showToast(msg, 'info', title), [showToast]);

  const value = useMemo(
    () => ({ showToast, success, error, warning, info, dismissToast }),
    [showToast, success, error, warning, info, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Render Portal */}
      <div
        className={`toast-container ${dir === 'rtl' ? 'rtl' : 'ltr'}`}
        role="region"
        aria-live="polite"
        aria-label="Notifications judiciaires"
      >
        {toasts.map((t) => {
          let Icon = Info;
          let badgeClass = 'toast-info';
          if (t.type === 'success') {
            Icon = CheckCircle2;
            badgeClass = 'toast-success';
          } else if (t.type === 'warning') {
            Icon = AlertTriangle;
            badgeClass = 'toast-warning';
          } else if (t.type === 'error') {
            Icon = XCircle;
            badgeClass = 'toast-error';
          }

          return (
            <div key={t.id} className={`toast-card ${badgeClass}`} role="alert">
              <span className="toast-icon-wrapper">
                <Icon size={16} />
              </span>
              <div className="toast-content">
                {t.title && <div className="toast-title">{t.title}</div>}
                <div className="toast-message">{t.message}</div>
              </div>
              <button
                type="button"
                className="toast-dismiss-btn"
                onClick={() => dismissToast(t.id)}
                aria-label="Fermer la notification"
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}
