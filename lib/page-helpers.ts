/**
 * Shared metadata builders for category and product pages. Used by both the
 * default-locale routes (`app/[category]/...`) and the EN mirror
 * (`app/en/[category]/...`).
 */
import type { Metadata } from 'next';
import type { Locale, Product } from '@/types';
import { localePath } from '@/i18n/config';
import { getCategorySeo, SITE_URL } from './seo';

const OG_LOCALE: Record<Locale, string> = {
  uk: 'uk_UA',
  en: 'en_US'
};

/** Build absolute URL on the site for the given locale + path. */
export function absoluteUrl(locale: Locale, path: string): string {
  return `${SITE_URL}${localePath(locale, path)}`;
}

/**
 * Hreflang `alternates.languages` block. Every locale maps to the same
 * path, plus an `x-default` entry pointing at the default-locale URL —
 * Google requires that to mark the fallback for unmatched languages, and
 * SEO auditors flag pages that have only foreign-language hreflangs as
 * "self-referential alternate link is missing".
 */
export function hreflang(path: string) {
  const ukPath = `/${path.replace(/^\//, '')}`.replace(/\/+$/, '') || '/';
  const enPath = `/en${path.startsWith('/') ? path : `/${path}`}`.replace(/\/+$/, '') || '/en';
  return {
    'x-default': ukPath,
    uk: ukPath,
    en: enPath
  };
}

/** Hard caps applied to every dynamically built title / description so we
 *  never overflow Google's SERP truncation thresholds. */
const TITLE_MAX = 60;
const DESC_MAX = 155;

function clamp(text: string, max: number): string {
  if (!text) return text;
  if (text.length <= max) return text;
  return text.slice(0, max - 1).trimEnd() + '…';
}

export function categoryMetadata(category: string, locale: Locale): Metadata {
  const seo = getCategorySeo(category, locale);
  if (!seo) return {};
  const path = `/${category}`;
  const url = absoluteUrl(locale, path);
  const title = clamp(seo.title, TITLE_MAX);
  const description = clamp(seo.description, DESC_MAX);

  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: {
      canonical: localePath(locale, path),
      languages: hreflang(path)
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url,
      type: 'website',
      locale: OG_LOCALE[locale],
      siteName: 'Lovy Moment',
      images: [{ url: '/img/logo.png', width: 1200, height: 630 }]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: ['/img/logo.png']
    }
  };
}

export function productMetadata(category: string, product: Product, locale: Locale): Metadata {
  const titles: Record<Locale, string> = {
    uk: `${product.name} — Lovy Moment`,
    en: `${product.name} — Lovy Moment`
  };
  const fallbackDesc: Record<Locale, string> = {
    uk: `${product.name} у Львові — Lovy Moment.${product.price ? ' Ціна: ' + product.price + '.' : ''} ☎ 097 937 16 91`,
    en: `${product.name} in Lviv — Lovy Moment.${product.price ? ' Price: ' + product.price + '.' : ''} ☎ +380 97 937 16 91`
  };

  // Title cap: keep under ~60 chars / 580 px so SERP doesn't truncate.
  const rawTitle = titles[locale];
  const title = rawTitle.length > 60 ? rawTitle.slice(0, 57).trimEnd() + '…' : rawTitle;

  // Description cap: keep under ~155 Cyrillic chars / 1000 px.
  let description = (product.descriptions || '').trim() || fallbackDesc[locale];
  if (description.length > 155) {
    description = description.slice(0, 152).trimEnd() + '…';
  }
  const path = `/${category}/${product.slug}`;
  const url = absoluteUrl(locale, path);

  return {
    title,
    description,
    alternates: {
      canonical: localePath(locale, path),
      languages: hreflang(path)
    },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      siteName: 'Lovy Moment',
      locale: OG_LOCALE[locale],
      images: product.img
        ? [{ url: product.img, alt: `${product.name} — Lovy Moment` }]
        : [{ url: '/img/logo.png' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: product.img ? [product.img] : ['/img/logo.png']
    }
  };
}

/** Breadcrumb JSON-LD for a category or product page. */
export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url
    }))
  };
}
