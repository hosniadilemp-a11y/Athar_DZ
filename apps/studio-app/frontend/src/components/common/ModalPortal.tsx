import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

let activeModalCount = 0;

function syncBackgroundInert(delta: number) {
  if (typeof document === 'undefined') return;
  activeModalCount = Math.max(0, activeModalCount + delta);
  const shell = document.querySelector('.studio-shell') as HTMLElement | null;
  if (!shell) return;
  if (activeModalCount > 0) {
    shell.setAttribute('inert', '');
  } else {
    shell.removeAttribute('inert');
  }
}

export function hasOpenModal(): boolean {
  return (
    typeof document !== 'undefined' &&
    Boolean(document.querySelector('[role="dialog"][aria-modal="true"]'))
  );
}

const FOCUSABLE_SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

/**
 * Portals blocking dialogs to document.body, sets `inert` on `.studio-shell`,
 * traps Tab focus inside the modal, and blocks wheel/pointer/context events
 * from leaking to the background canvas.
 */
export const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused =
      typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;
    syncBackgroundInert(1);

    const container = wrapperRef.current;
    if (container) {
      const preferred = container.querySelector<HTMLElement>('[data-autofocus="true"]');
      const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      const target = preferred ?? firstFocusable ?? container;
      target.focus({ preventScroll: true });
    }

    const handleTabTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !wrapperRef.current) return;
      const focusables = Array.from(
        wrapperRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
      if (focusables.length === 0) {
        e.preventDefault();
        wrapperRef.current.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;
      if (e.shiftKey) {
        if (document.activeElement === first || !wrapperRef.current.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last || !wrapperRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      }
    };

    container?.addEventListener('keydown', handleTabTrap);
    return () => {
      container?.removeEventListener('keydown', handleTabTrap);
      syncBackgroundInert(-1);
      if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, []);

  const content = (
    <div
      ref={wrapperRef}
      className="modal-portal-root"
      tabIndex={-1}
      onWheel={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );

  if (typeof document !== 'undefined' && document.body) {
    return createPortal(content, document.body);
  }
  return content;
};
