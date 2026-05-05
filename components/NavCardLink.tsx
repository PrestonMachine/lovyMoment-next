'use client';

/**
 * Tiny client wrapper around `next/link` that fires `triggerNavLoader()`
 * the moment the user clicks. Used for product cards on the catalogue and
 * category cards on the homepage so the user gets immediate feedback that
 * navigation has started — the overlay stays up until the destination
 * route mounts.
 *
 * For everything else use plain `next/link`.
 */
import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react';

import { triggerNavLoader } from './NavLoader';

type Props = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    children: ReactNode;
  };

export function NavCardLink({ children, onClick, ...rest }: Props) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Skip modifier-key clicks: they open the link in a new tab/window.
    if (
      !e.defaultPrevented &&
      e.button === 0 &&
      !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    ) {
      triggerNavLoader();
    }
    onClick?.(e);
  }

  return (
    <Link {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}
