/**
 * Centralised SEO copy for every locale. Each locale has its own home and
 * category SEO blocks. `getCategorySeo(category, locale)` is the single
 * lookup used by every page's `generateMetadata`.
 */
import type { Locale } from '@/types';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lovymoment.com';

export const SITE_NAME = 'Lovy Moment';

export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
}

const CATEGORY_SEO_UK: Record<string, PageSeo> = {
  atractions: {
    title: 'Атракціони у Львові: надувні гірки, батути | Lovy Moment',
    description:
      'Оренда атракціонів у Львові: надувні гірки, батути, лабіринти. Безпечні та якісні розваги для свят і корпоративів — Lovy Moment.',
    keywords:
      'атракціони львів, надувні гірки, батути оренда, лабіринти для дітей, атракціони на свято'
  },
  megagame: {
    title: 'Ігри та активності у Львові: квести, воркшопи | Lovy Moment',
    description:
      'Ігри та активності у Львові: квести, творчі воркшопи, командні ігри. Розваги для будь-якого віку — Lovy Moment.',
    keywords:
      'ігри львів, квести для дітей, воркшопи львів, командні ігри, розваги'
  },
  animators: {
    title: 'Аніматори у Львові: персонажі, майстер-класи | Lovy Moment',
    description:
      'Професійні аніматори у Львові: улюблені персонажі, індивідуальні сценарії, майстер-класи. Lovy Moment — свята для дітей.',
    keywords:
      'аніматори львів, персонажі на свято, майстер класи для дітей, аніматори на день народження'
  },
  food: {
    title: 'Кейтеринг у Львові: солодка вата, попкорн | Lovy Moment',
    description:
      'Кейтеринг для свят у Львові: солодка вата, попкорн, напої. Смачно, якісно, з посмішкою — Lovy Moment.',
    keywords:
      'кейтеринг львів, солодка вата, попкорн на свято, їжа на день народження'
  },
  'child-party': {
    title: 'Дитячі свята у Львові: дні народження | Lovy Moment',
    description:
      'Організація дитячих свят у Львові: дні народження, тематичні вечірки, атракціони, аніматори, ігри. Lovy Moment.',
    keywords:
      'дитячі свята львів, день народження дитини, організація дитячого свята'
  },
  corporate: {
    title: 'Корпоративи у Львові: тімбілдинги | Lovy Moment',
    description:
      'Корпоративні заходи у Львові: тімбілдинги, ділові свята, виїзди. Професійна організація — Lovy Moment.',
    keywords:
      'корпоративи львів, тімбілдинг, корпоративні заходи'
  },
  promotion: {
    title: 'Промоакції у Львові: активності для бренду | Lovy Moment',
    description:
      'Організація промоакцій у Львові: атракціони, розваги, активності для просування бренду. Lovy Moment.',
    keywords:
      'промоакції львів, активності для бренду, BTL у Львові'
  },
  trampoline: {
    title: 'Надувні гірки та батути у Львові | Lovy Moment',
    description:
      'Оренда надувних гірок та батутних комплексів у Львові. Безпечно, весело, яскраво — Lovy Moment.',
    keywords:
      'надувні гірки львів, батути оренда, надувні атракціони'
  },
  other: {
    title: 'Інше обладнання для свят у Львові | Lovy Moment',
    description:
      'Додаткове обладнання для свят у Львові: звук, декорації, технічне забезпечення — Lovy Moment.',
    keywords:
      'обладнання для свят львів, звукове обладнання, декорації на свято'
  },
  'about-us': {
    title: 'Про нас — Lovy Moment | Свята у Львові',
    description:
      'Lovy Moment — команда з 10+ років досвіду організації свят у Львові. 1000+ задоволених клієнтів, тисячі усмішок.',
    keywords:
      'про lovy moment, команда організації свят, досвід роботи львів'
  }
};

const CATEGORY_SEO_EN: Record<string, PageSeo> = {
  atractions: {
    title: 'Attractions in Lviv: inflatable slides, trampolines | Lovy Moment',
    description:
      'Attraction rental in Lviv: inflatable slides, trampolines, mazes. Safe and high-quality entertainment for parties — Lovy Moment.',
    keywords: 'attractions Lviv, inflatable slides Lviv, trampolines rent, mazes for kids, party attractions'
  },
  megagame: {
    title: 'Games & activities in Lviv: quests, workshops | Lovy Moment',
    description:
      'Games and activities in Lviv: interactive quests, creative workshops, team games. Entertainment for any age — Lovy Moment.',
    keywords: 'games Lviv, quests for kids, workshops Lviv, team games, party activities'
  },
  animators: {
    title: 'Animators in Lviv: characters & workshops | Lovy Moment',
    description:
      'Professional animators in Lviv with favourite characters. Individual scripts, master-classes, live interaction — Lovy Moment.',
    keywords: 'animators Lviv, party characters, master-classes, birthday animators'
  },
  food: {
    title: 'Catering in Lviv: cotton candy, popcorn | Lovy Moment',
    description:
      'Party catering in Lviv: cotton candy, popcorn, drinks. Tasty and high-quality treats — Lovy Moment.',
    keywords: 'catering Lviv, cotton candy, popcorn party, party drinks'
  },
  'child-party': {
    title: 'Kids parties in Lviv: birthday planning | Lovy Moment',
    description:
      'Kids parties in Lviv: birthdays, themed events, attractions, animators, games. Lovy Moment.',
    keywords: 'kids parties Lviv, child birthday, kids party planning'
  },
  corporate: {
    title: 'Corporate events in Lviv: team-building | Lovy Moment',
    description:
      'Corporate events in Lviv: team-building, business parties, off-sites. Professional organisation — Lovy Moment.',
    keywords: 'corporate Lviv, team-building, corporate events, business events'
  },
  promotion: {
    title: 'Promotional events in Lviv: brand activations | Lovy Moment',
    description:
      'Promotional events in Lviv: attractions, entertainment, brand activations. Lovy Moment.',
    keywords: 'promotional events Lviv, brand activations, BTL Lviv'
  },
  trampoline: {
    title: 'Inflatable slides & trampolines in Lviv | Lovy Moment',
    description:
      'Rent inflatable slides and trampoline complexes in Lviv. Safe, fun, bright — Lovy Moment.',
    keywords: 'inflatable slides Lviv, trampolines rent, inflatable attractions'
  },
  other: {
    title: 'Other event equipment in Lviv | Lovy Moment',
    description:
      'Additional event equipment in Lviv: sound, decorations, technical support — Lovy Moment.',
    keywords: 'event equipment Lviv, sound equipment, party decorations'
  },
  'about-us': {
    title: 'About us — Lovy Moment | Events in Lviv',
    description:
      'Lovy Moment — 10+ years of organising events in Lviv. 1000+ happy clients, thousands of smiles.',
    keywords: 'about lovy moment, event team Lviv, attractions professionals'
  }
};

const HOME_SEO_BY_LOCALE: Record<Locale, PageSeo> = {
  uk: {
    // Targets:
    //   title  ≤ 580 px (≈ 60 Cyrillic chars)
    //   desc   ≤ 1000 px (≈ 155 Cyrillic chars)
    title: 'Lovy Moment — Свята у Львові | Атракціони, аніматори, ігри',
    description:
      'Lovy Moment — організація свят у Львові: атракціони, аніматори, ігри, кейтеринг. 10+ років досвіду, 1000+ задоволених клієнтів. ☎ 097 937 16 91',
    keywords:
      'організація свят львів, атракціони львів, аніматори львів, дитячі свята, корпоративи, батути, надувні гірки, розваги для дітей, lovy moment'
  },
  en: {
    title: 'Lovy Moment — Events in Lviv | Attractions, Animators, Games',
    description:
      'Lovy Moment — event organisation in Lviv: attractions, animators, games, catering. 10+ years of experience, 1000+ happy clients. ☎ 097 937 16 91',
    keywords:
      'event organisation Lviv, attractions Lviv, animators Lviv, kids parties, corporate, trampolines, inflatable slides, entertainment for kids, lovy moment'
  }
};

const CATEGORY_SEO_BY_LOCALE: Record<Locale, Record<string, PageSeo>> = {
  uk: CATEGORY_SEO_UK,
  en: CATEGORY_SEO_EN
};

export function getHomeSeo(locale: Locale): PageSeo {
  return HOME_SEO_BY_LOCALE[locale] ?? HOME_SEO_BY_LOCALE.uk;
}

export function getCategorySeo(category: string, locale: Locale): PageSeo | undefined {
  return CATEGORY_SEO_BY_LOCALE[locale]?.[category] ?? CATEGORY_SEO_BY_LOCALE.uk[category];
}

/** Backwards-compatible exports for code that hasn't migrated yet. */
export const CATEGORY_SEO = CATEGORY_SEO_UK;
export const HOME_SEO = HOME_SEO_BY_LOCALE.uk;
export const SITE_DEFAULT_DESCRIPTION = HOME_SEO_BY_LOCALE.uk.description;

/** Translate a Firebase tag value into a UI label. */
const TAG_LABELS_UK: Record<string, string> = {
  Corporate: 'Корпоратив',
  Festival: 'Фестиваль',
  Promotion: 'Промоакція',
  Trampoline: 'Надувні гірки та батути',
  'Child-party': 'Дитяче свято',
  Food: 'Кейтеринг',
  Carousel: 'Карусель',
  MegaGame: 'Мега ігри',
  Atractions: 'Атракціони',
  Animators: 'Аніматори',
  Other: 'Обладнання',
  'City-day': 'День міста'
};
const TAG_LABELS_EN: Record<string, string> = {
  Corporate: 'Corporate',
  Festival: 'Festival',
  Promotion: 'Promotion',
  Trampoline: 'Inflatable slides & trampolines',
  'Child-party': 'Kids party',
  Food: 'Catering',
  Carousel: 'Carousel',
  MegaGame: 'Mega games',
  Atractions: 'Attractions',
  Animators: 'Animators',
  Other: 'Equipment',
  'City-day': 'City day'
};
const TAG_LABELS_BY_LOCALE: Record<Locale, Record<string, string>> = {
  uk: TAG_LABELS_UK,
  en: TAG_LABELS_EN
};

export function getTagLabel(tag: string, locale: Locale): string {
  return TAG_LABELS_BY_LOCALE[locale]?.[tag] ?? TAG_LABELS_UK[tag] ?? tag;
}

/** Backwards-compatible export. */
export const TAG_LABELS = TAG_LABELS_UK;
