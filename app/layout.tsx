/**
 * Root layout. Holds the global stylesheet and ships the LocalBusiness +
 * Organisation JSON-LD that the legacy CRA project inlined into index.html.
 *
 * Per-page metadata is exported from each route's `generateMetadata`.
 */
import type { Metadata, Viewport } from 'next';

import { SITE_NAME, SITE_URL, SITE_DEFAULT_DESCRIPTION, HOME_SEO } from '@/lib/seo';
import '@/styles/app.css';
import '@/styles/footer.css';
import '@/styles/entirementsPage.css';
import '@/styles/modal.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_SEO.title,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DEFAULT_DESCRIPTION,
  keywords: HOME_SEO.keywords,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: 'Entertainment',
  robots: { index: true, follow: true, 'max-image-preview': 'large' },
  alternates: {
    canonical: '/',
    languages: {
      'x-default': '/',
      uk: '/',
      en: '/en'
    }
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    locale: 'uk_UA',
    alternateLocale: ['en_US'],
    images: [
      {
        url: '/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'Lovy Moment — організація свят у Львові'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_SEO.title,
    description: HOME_SEO.description,
    images: ['/img/logo.png']
  },
  icons: {
    icon: '/img/mini-logo2.jpg',
    apple: '/img/mini-logo2.jpg'
  },
  verification: {
    google: 'l728ZGVQ4W4CF_eXW-yZ-ks5t-RhK90h6aCJdaoYBe0'
  },
  formatDetection: { telephone: false },
  other: {
    'geo.region': 'UA-46',
    'geo.placename': 'Львів',
    'geo.position': '49.839683;24.029717',
    ICBM: '49.839683, 24.029717'
  }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff'
};

const localBusinessLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: SITE_NAME,
  description:
    'Організація яскравих свят у Львові та області. Атракціони, аніматори, ігри, кейтеринг.',
  url: SITE_URL,
  telephone: '+380979371691',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Львів',
    addressLocality: 'Львів',
    addressRegion: 'Львівська область',
    postalCode: '79000',
    addressCountry: 'UA'
  },
  geo: { '@type': 'GeoCoordinates', latitude: 49.839683, longitude: 24.029717 },
  openingHours: 'Mo-Su 10:00-21:00',
  priceRange: '$$',
  image: `${SITE_URL}/img/logo.png`,
  logo: `${SITE_URL}/img/logo.png`,
  sameAs: [
    'https://www.instagram.com/lovymomentlviv/',
    'https://wa.me/380979371691',
    'https://t.me/pavluyk'
  ],
  areaServed: 'Львів та область'
};

const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Які послуги надає Lovy Moment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Lovy Moment надає послуги організації свят у Львові: атракціони (надувні гірки, батути, лабіринти), аніматорів з улюбленими персонажами, ігри та активності, кейтеринг (солодка вата, попкорн, напої).'
      }
    },
    {
      '@type': 'Question',
      name: 'Скільки коштують послуги організації свята?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Вартість послуг залежить від типу заходу, кількості атракціонів та тривалості свята. Для отримання детальної інформації телефонуйте: +38 (097) 937 16 91 або +38 (063) 860 49 66.'
      }
    },
    {
      '@type': 'Question',
      name: 'В яких районах Львова ви працюєте?',
      acceptedAnswer: {
        '@type': 'Answer',
        text:
          'Lovy Moment працює по всьому Львову та Львівській області. Ми приїздимо на будь-яку локацію в радіусі 50 км від Львова.'
      }
    }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <div className="app">{children}</div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      </body>
    </html>
  );
}
