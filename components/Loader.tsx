/**
 * Party-themed loaders.
 *
 *   <PartyLoader caption="…" subline="…" />     — full block placeholder
 *   <PartyLoader compact ... />                 — same, smaller padding
 *   <InlineLoader>Збереження…</InlineLoader>    — tiny spinner for buttons
 *
 * The big variant is a row of 5 bouncing balloons in the brand palette
 * with floating confetti behind them. Animations honour
 * `prefers-reduced-motion`.
 */
import type { ReactNode } from 'react';

import styles from '@/styles/loader.module.css';

const BALLOON_COLORS = ['#4f66cf', '#f55d5d', '#f8d37c', '#5bd262', '#e55ba0'];

interface PartyLoaderProps {
  /** Main label (defaults to a friendly UA string). */
  caption?: string;
  /** Optional secondary line under the caption. */
  subline?: string;
  /** Use the smaller padding variant. */
  compact?: boolean;
  /** Number of confetti pieces (1–10). */
  confettiCount?: number;
}

export function PartyLoader({
  caption = 'Готуємо ваше свято',
  subline,
  compact = false,
  confettiCount = 10
}: PartyLoaderProps) {
  const confettiPieces = Array.from(
    { length: Math.min(Math.max(confettiCount, 0), 10) }
  );

  return (
    <div
      className={`${styles.partyLoader} ${compact ? styles.partyLoaderCompact : ''}`}
      role="status"
      aria-live="polite"
    >
      {/* Confetti behind the balloons. */}
      <div className={styles.confetti} aria-hidden="true">
        {confettiPieces.map((_, i) => (
          <span key={i} className={styles.confettiPiece} />
        ))}
      </div>

      {/* Bouncing balloons. */}
      <div className={styles.balloons} aria-hidden="true">
        <svg viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg">
          {BALLOON_COLORS.map((color, i) => (
            <Balloon key={color} color={color} index={i} />
          ))}
        </svg>
      </div>

      <span className={styles.caption}>
        {caption}
        <span aria-hidden="true" style={{ display: 'inline-flex', gap: 3, marginLeft: 6 }}>
          <span className={styles.captionDot} />
          <span className={styles.captionDot} />
          <span className={styles.captionDot} />
        </span>
      </span>

      {subline && <span className={styles.subline}>{subline}</span>}
    </div>
  );
}

function Balloon({ color, index }: { color: string; index: number }) {
  // Distribute 5 balloons evenly across the 220-wide viewBox.
  const cx = 26 + index * 42;
  const cy = 36;
  return (
    <g className={styles.balloon}>
      {/* Tear-drop balloon body. */}
      <ellipse cx={cx} cy={cy} rx={14} ry={18} fill={color} />
      {/* Highlight. */}
      <ellipse cx={cx - 4} cy={cy - 6} rx={3} ry={5} fill="rgba(255,255,255,0.45)" />
      {/* Knot. */}
      <polygon
        points={`${cx - 3},${cy + 17} ${cx + 3},${cy + 17} ${cx},${cy + 22}`}
        fill={color}
      />
      {/* String. */}
      <path
        d={`M ${cx} ${cy + 22} Q ${cx - 4} ${cy + 38} ${cx} ${cy + 56} Q ${cx + 4} ${cy + 70} ${cx} ${cy + 86}`}
        stroke={color}
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
    </g>
  );
}

interface InlineLoaderProps {
  children?: ReactNode;
  /** Override the spinner colour (defaults to currentColor). */
  color?: string;
}

export function InlineLoader({ children, color }: InlineLoaderProps) {
  return (
    <span className={styles.inlineLoader} role="status" aria-live="polite" style={color ? { color } : undefined}>
      <span className={styles.inlineRing} />
      {children}
    </span>
  );
}
