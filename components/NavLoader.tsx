'use client';

/**
 * Full-screen overlay loader. Click handlers on product cards and category
 * sections fire `triggerNavLoader()` from this module, which mounts the
 * overlay immediately. The loader hides automatically once the route's
 * pathname changes (i.e. the new page is mounted).
 *
 * Usage:
 *   import { NavLoader, triggerNavLoader } from '@/components/NavLoader';
 *   // mount once in the root layout:
 *   <NavLoader />
 *   // then on any link/element click that should show the loader:
 *   onClick={triggerNavLoader}
 */
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

import { PartyLoader } from './Loader';

let listeners = new Set<() => void>();

/**
 * Imperative trigger — call from any client component (typically a link
 * `onClick`). Mounts the overlay until the next route change.
 */
export function triggerNavLoader() {
  for (const fn of listeners) fn();
}

export function NavLoader() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  // Subscribe to imperative triggers.
  useEffect(() => {
    const fn = () => setActive(true);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);

  // Hide the overlay once the new route is mounted.
  useEffect(() => {
    if (!active) return;
    // A short delay before hiding lets the destination page paint, so the
    // user doesn't see a brief flash of empty content between the loader
    // disappearing and the page being ready.
    const t = setTimeout(() => setActive(false), 150);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!active) return null;

  // Pick the loader copy based on the current path. The overlay is mounted
  // before the route changes, so `pathname` still reflects the *source*
  // page — that's exactly the locale we want for the message.
  const isEn = pathname === '/en' || pathname.startsWith('/en/');
  const caption = isEn ? 'Loading the page' : 'Готуємо сторінку';
  const subline = isEn ? 'One moment…' : 'Хвилинку…';
  const ariaLabel = isEn ? 'Loading' : 'Завантаження';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        animation: 'navLoaderFadeIn 180ms ease-out'
      }}
    >
      <PartyLoader caption={caption} subline={subline} />
      <style>{`
        @keyframes navLoaderFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
