'use client';

/**
 * Progressive reveal wrapper for grids/lists.
 *
 *   - Renders ALL children into the initial HTML (SEO-safe). Each child is
 *     cloned so we can stamp `display: none` on the ones past the current
 *     visibility window — Google still sees the markup.
 *   - First `batchSize` children are visible on first paint (no animation).
 *   - An invisible sentinel sits after the last visible item; when it
 *     enters the viewport (with 400 px headroom), the visibility window
 *     grows by another batch and freshly-revealed items fade in.
 *
 * Use case here: the home product grid has ~50 cards. Showing them all at
 * once on small screens hammers paint and IO; revealing in batches keeps
 * the perceived load fast without sacrificing SEO.
 */
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode
} from 'react';

interface Props {
  children: ReactNode;
  /** How many cards to add per reveal step. Defaults to 12. */
  batchSize?: number;
}

export function ProgressiveReveal({ children, batchSize = 12 }: Props) {
  const items = Children.toArray(children);
  const [count, setCount] = useState(() => Math.min(batchSize, items.length));
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (count >= items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((c) => Math.min(c + batchSize, items.length));
        }
      },
      { rootMargin: '400px 0px' }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [count, items.length, batchSize]);

  return (
    <>
      {items.map((child, i) => {
        if (!isValidElement(child)) return child;
        const isVisible = i < count;
        const justRevealed = isVisible && i >= batchSize && i >= count - batchSize;
        const extraStyle: CSSProperties = {
          ...((child.props as { style?: CSSProperties }).style ?? {}),
          display: isVisible ? undefined : 'none',
          animation: justRevealed ? 'productFadeIn 0.4s ease forwards' : undefined
        };
        return cloneElement(child as React.ReactElement<{ style?: CSSProperties }>, {
          style: extraStyle
        });
      })}

      {count < items.length && (
        <div
          ref={sentinelRef}
          aria-hidden="true"
          style={{
            flexBasis: '100%',
            width: '100%',
            height: 1,
            opacity: 0,
            pointerEvents: 'none'
          }}
        />
      )}
    </>
  );
}
