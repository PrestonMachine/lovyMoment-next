/**
 * English locale homepage (`/en`).
 *
 * Renders the same components as the Ukrainian home page but with locale='en'.
 * UI strings come from `i18n/dictionaries.ts > en`. SEO copy comes from
 * `lib/seo.ts > getHomeSeo('en')`. Product data is fetched in EN with
 * automatic fallback to UK for fields that don't yet have a translation.
 */
import type { Metadata } from 'next';

import { Header } from '@/components/Header';
import { SeactionBlock } from '@/components/SeactionBlock';
import { HomeIntro } from '@/components/HomeIntro';
import { AllEntertiments } from '@/components/AllEntertiments';
import { Footer } from '@/components/Footer';
import { Caller } from '@/components/Caller';
import { getAllProducts } from '@/lib/firebase';
import { getDictionary } from '@/i18n/dictionaries';
import { getHomeSeo, SITE_URL } from '@/lib/seo';
import { hreflang } from '@/lib/page-helpers';

const LOCALE = 'en' as const;
const seo = getHomeSeo(LOCALE);

export const revalidate = 600;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: {
    canonical: `${SITE_URL}/en`,
    languages: hreflang('/')
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    locale: 'en_US',
    alternateLocale: ['uk_UA']
  }
};

export default async function HomePageEn() {
  const dict = getDictionary(LOCALE);
  const products = await getAllProducts(LOCALE);
  return (
    <>
      <Header locale={LOCALE} showHero heroTitle={dict.hero.title} heroCta={dict.hero.cta} />
      <SeactionBlock locale={LOCALE} />
      <AllEntertiments locale={LOCALE} products={products} />
      <HomeIntro locale={LOCALE} />
      <Caller />
      <Footer locale={LOCALE} />
    </>
  );
}
