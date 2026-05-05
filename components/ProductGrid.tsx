/**
 * Grid of product cards. Each card is a `Link` to the SEO-friendly product
 * URL (`/<category>/<slug>`). Image is rendered with `next/image`, with a
 * unique alt text built from the product name.
 */
import Image from 'next/image';

import { NavCardLink } from './NavCardLink';
import { ProgressiveReveal } from './ProgressiveReveal';
import allEntirementsStyle from '@/styles/allEntertiments.module.css';
import { getDictionary } from '@/i18n/dictionaries';
import { localePath } from '@/i18n/config';
import type { Locale, Product } from '@/types';

interface ProductGridProps {
  locale: Locale;
  products: Product[];
  /** Limit visible cards (used by homepage; default = all). */
  limit?: number;
  /**
   * Initial batch of cards rendered without `display: none`. The rest stay
   * in the DOM (for SEO) but are hidden until they enter the viewport.
   * Defaults to 12. Pass `Infinity` to disable progressive reveal.
   */
  batchSize?: number;
}

export function ProductGrid({ locale, products, limit, batchSize = 12 }: ProductGridProps) {
  const dict = getDictionary(locale);
  const visible = typeof limit === 'number' ? products.slice(0, limit) : products;
  const cards = visible.map((p) => {
        const href = localePath(locale, `/${p.category ?? 'other'}/${p.slug}`);
        const alt =
          locale === 'en'
            ? `${p.name} — rent in Lviv from Lovy Moment`
            : `${p.name} — оренда у Львові від Lovy Moment`;
        return (
          <NavCardLink key={p.id} href={href} aria-label={p.name}>
            <article id={p.id} className={allEntirementsStyle.entertiment_card}>
              {p.img ? (
                <Image
                  src={p.img}
                  alt={alt}
                  fill
                  sizes="(max-width: 480px) 90vw, (max-width: 992px) 45vw, 30vw"
                  loading="lazy"
                  style={{ objectFit: 'cover', borderRadius: 24 }}
                  unoptimized
                />
              ) : null}
              <div className={allEntirementsStyle.gradiant}>
                <span className={allEntirementsStyle.more_btn}>{dict.sections.details}</span>
                <div className={allEntirementsStyle.entertiment_card_label}>
                  <p>{p.name}</p>
                  <div className={allEntirementsStyle.price}>{p.price}</div>
                </div>
              </div>
            </article>
          </NavCardLink>
        );
      });

  // Disable reveal entirely when caller asks (`batchSize: Infinity`) or the
  // collection is already short enough to fit in one batch.
  const shouldReveal = Number.isFinite(batchSize) && cards.length > batchSize;

  return (
    <div className={allEntirementsStyle.entertiment_row} id="entertiment-row">
      {shouldReveal ? (
        <ProgressiveReveal batchSize={batchSize}>{cards}</ProgressiveReveal>
      ) : (
        cards
      )}
    </div>
  );
}
