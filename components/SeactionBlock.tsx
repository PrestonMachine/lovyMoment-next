/**
 * Hero filter cards on the homepage. Each card links to a category page using
 * SEO-friendly URLs (`/atractions`, `/animators`, …). Card titles come from
 * the locale dictionary; alt text is also localised.
 */
import Image from 'next/image';

import { NavCardLink } from './NavCardLink';
import seactionBlockStyles from '@/styles/seactionBlock.module.css';
import { localePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/types';

interface CardSpec {
  /** Image filename inside /public/img/categories */
  imgFile: string;
  /** Title-class modifier applied to the card label. */
  titleModifier: keyof typeof seactionBlockStyles;
  /** Card background-class modifier. */
  cardModifier: keyof typeof seactionBlockStyles;
  /** Category slug for the link (matches CATEGORY_TAG_MAP). */
  link: string;
}

interface SeactionBlockProps {
  locale: Locale;
}

const CARDS: CardSpec[] = [
  { imgFile: 'carousel-card.png', titleModifier: 'carousel', cardModifier: 'carousel', link: 'atractions' },
  { imgFile: 'game-card.png', titleModifier: 'game', cardModifier: 'game', link: 'megagame' },
  { imgFile: 'Child-party-card.png', titleModifier: 'animators', cardModifier: 'animatorsPage', link: 'animators' },
  { imgFile: 'Food-card.png', titleModifier: 'food', cardModifier: 'food', link: 'food' },
  { imgFile: 'Festival-card.png', titleModifier: 'festival', cardModifier: 'festival', link: 'other' }
];

const ALT_BY_LOCALE: Record<Locale, Record<string, string>> = {
  uk: {
    atractions: 'Атракціони у Львові — надувні гірки та батути',
    megagame: 'Ігри та активності у Львові',
    animators: 'Аніматори у Львові на дитячі свята',
    food: 'Кейтеринг — солодка вата, попкорн, напої',
    other: 'Обладнання для свят у Львові'
  },
  en: {
    atractions: 'Attractions in Lviv — inflatable slides and trampolines',
    megagame: 'Games & activities in Lviv',
    animators: 'Animators in Lviv for kids parties',
    food: 'Catering — cotton candy, popcorn, drinks',
    other: 'Event equipment in Lviv'
  }
};

const SECTION_ARIA: Record<Locale, string> = {
  uk: 'Категорії послуг',
  en: 'Service categories'
};

export function SeactionBlock({ locale }: SeactionBlockProps) {
  const dict = getDictionary(locale);
  return (
    <section className={seactionBlockStyles.container} aria-label={SECTION_ARIA[locale]}>
      <div className={seactionBlockStyles.main_filter}>
        {CARDS.map((card) => (
          <NavCardLink key={card.link} href={localePath(locale, `/${card.link}`)}>
            <div className={`${seactionBlockStyles.filter_card} ${seactionBlockStyles[card.cardModifier] ?? ''}`}>
              <div className={seactionBlockStyles.card_img}>
                <Image
                  src={`/img/categories/${card.imgFile}`}
                  alt={ALT_BY_LOCALE[locale]?.[card.link] ?? card.link}
                  width={card.cardModifier === 'game' ? 220 : 180}
                  height={160}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className={seactionBlockStyles.card_label}>
                <div className={`${seactionBlockStyles.card_title} ${seactionBlockStyles[card.titleModifier] ?? ''}`}>
                  {dict.categories[card.link] ?? card.link}
                </div>
              </div>
            </div>
          </NavCardLink>
        ))}
      </div>
    </section>
  );
}
