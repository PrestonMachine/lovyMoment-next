/**
 * Home page (default locale, `/`). Server-renders the section block plus the
 * full product list with ISR — revalidates every 10 minutes.
 */
import { Suspense } from 'react';

import { Header } from '@/components/Header';
import { SeactionBlock } from '@/components/SeactionBlock';
import { HomeIntro } from '@/components/HomeIntro';
import { AllEntertiments } from '@/components/AllEntertiments';
import { Footer } from '@/components/Footer';
import { Caller } from '@/components/Caller';
import { getAllProducts } from '@/lib/firebase';
import { getDictionary } from '@/i18n/dictionaries';

export const revalidate = 600; // 10 minutes ISR

export default async function HomePage() {
  const locale = 'uk' as const;
  const dict = getDictionary(locale);
  const products = await getAllProducts(locale);

  return (
    <>
      <Header locale={locale} showHero heroTitle={dict.hero.title} heroCta={dict.hero.cta} />
      <SeactionBlock locale={locale} />
      <Suspense fallback={null}>
        <AllEntertiments locale={locale} products={products} />
      </Suspense>
      <HomeIntro locale={locale} />
      <Caller />
      <Footer locale={locale} />
    </>
  );
}
