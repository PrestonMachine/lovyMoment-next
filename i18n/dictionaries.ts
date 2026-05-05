/**
 * UI string dictionaries. Each dictionary covers fixed chrome (header,
 * footer, section labels, button captions). Product / category names come
 * from the DB and are translated separately via `lib/i18n-utils.ts`.
 */
import type { Locale } from '@/types';

export interface Dictionary {
  brand: string;
  hero: { title: string; cta: string };
  nav: { aboutUs: string };
  sections: {
    allTitle: string;
    allTitleAccent: string;
    showMore: string;
    details: string;
  };
  productPage: {
    minOrder: string;
    description: string;
    complactation: string;
    important: string;
    quantityPrefix: string;
    backToCategory: string;
  };
  categories: Record<string, string>;
  footer: {
    callUs: string;
    callUsHighlight: string;
    workingHours: string;
    or: string;
  };
  notification: { copied: string };
  notFound: { title: string; text: string; back: string };
  aboutUs: {
    title: string;
    intro: string;
    services: string;
    experience: string;
    values: string;
    contact: string;
    workHours: string;
    cta: string;
  };
}

const uk: Dictionary = {
  brand: 'Lovy Moment',
  hero: { title: 'Розваги та атракціони для свят у Львові', cta: 'Список розваг' },
  nav: { aboutUs: 'Про нас' },
  sections: {
    allTitle: 'Усі',
    allTitleAccent: 'розваги',
    showMore: 'Показати ще',
    details: 'Деталі'
  },
  productPage: {
    minOrder: 'Мінімальне замовлення',
    description: 'Опис розваги',
    complactation: 'Комплектація',
    important: 'ВАЖЛИВО',
    quantityPrefix: 'Кількість ',
    backToCategory: 'Назад до категорії'
  },
  categories: {
    atractions: 'Атракціони',
    megagame: 'Ігри',
    animators: 'Аніматори та майстер-класи',
    food: 'Кейтеринг',
    other: 'Інше обладнання',
    'child-party': 'Дитячі свята',
    corporate: 'Корпоративи',
    promotion: 'Промоакції',
    trampoline: 'Надувні гірки та батути',
    'about-us': 'Про нас'
  },
  footer: {
    callUs: 'Телефонуйте',
    callUsHighlight: 'нам',
    workingHours: 'Ми приймаємо дзвінки кожного дня з 10:00–21:00',
    or: 'або пишіть нам в'
  },
  notification: { copied: 'Посилання скопійовано' },
  notFound: {
    title: '404',
    text: 'Сторінку не знайдено. Можливо, вона була видалена або переміщена.',
    back: '← Повернутися на головну'
  },
  aboutUs: {
    title: 'Про нас',
    intro:
      'Lovy Moment — це команда професіоналів із понад 10 років досвіду у створенні веселих, яскравих і атмосферних свят у Львові та області. Ми віримо, що кожен момент життя вартий того, щоб його зловити і запам’ятати ✨',
    services: 'Що ми робимо',
    experience: 'Наш досвід',
    values: 'Наші цінності',
    contact: 'Зв’язок з нами',
    workHours: 'Працюємо щодня з 10:00 до 21:00',
    cta: 'Lovy Moment — лови свій момент, а ми додамо йому яскравих фарб!'
  }
};

const en: Dictionary = {
  brand: 'Lovy Moment',
  hero: { title: 'Entertainment and attractions for events in Lviv', cta: 'See entertainment list' },
  nav: { aboutUs: 'About us' },
  sections: {
    allTitle: 'All',
    allTitleAccent: 'entertainment',
    showMore: 'Show more',
    details: 'Details'
  },
  productPage: {
    minOrder: 'Minimum order',
    description: 'About this entertainment',
    complactation: 'What’s included',
    important: 'IMPORTANT',
    quantityPrefix: 'Number of ',
    backToCategory: 'Back to category'
  },
  categories: {
    atractions: 'Attractions',
    megagame: 'Games',
    animators: 'Animators & master-classes',
    food: 'Catering',
    other: 'Other equipment',
    'child-party': 'Kids parties',
    corporate: 'Corporate events',
    promotion: 'Promotional events',
    trampoline: 'Inflatable slides & trampolines',
    'about-us': 'About us'
  },
  footer: {
    callUs: 'Call',
    callUsHighlight: 'us',
    workingHours: 'We answer calls every day, 10:00–21:00',
    or: 'or message us on'
  },
  notification: { copied: 'Link copied' },
  notFound: {
    title: '404',
    text: 'Page not found. It may have been removed or moved.',
    back: '← Back to home'
  },
  aboutUs: {
    title: 'About us',
    intro:
      'Lovy Moment is a team of professionals with 10+ years of experience creating bright, fun and atmospheric parties in Lviv and the region. We believe every moment of life is worth catching and remembering ✨',
    services: 'What we do',
    experience: 'Our experience',
    values: 'Our values',
    contact: 'Get in touch',
    workHours: 'Open every day, 10:00–21:00',
    cta: 'Lovy Moment — catch your moment, we’ll add the colours!'
  }
};

export const dictionaries: Record<Locale, Dictionary> = { uk, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.uk;
}
