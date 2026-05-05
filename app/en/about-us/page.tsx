/**
 * EN "About us" page (`/en/about-us`). Mirrors `app/about-us/page.tsx`
 * with English copy.
 */
import type { Metadata } from 'next';
import Image from 'next/image';

import { SubHeader } from '@/components/SubHeader';
import { Footer } from '@/components/Footer';
import { Caller } from '@/components/Caller';
import aboutUsStyles from '@/styles/aboutUs.module.css';
import { getCategorySeo, SITE_URL } from '@/lib/seo';
import { hreflang } from '@/lib/page-helpers';

const LOCALE = 'en' as const;
const seo = getCategorySeo('about-us', LOCALE)!;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  alternates: {
    canonical: '/en/about-us',
    languages: hreflang('/about-us')
  },
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: `${SITE_URL}/en/about-us`,
    type: 'website',
    locale: 'en_US'
  }
};

const imageStyle = { objectFit: 'cover' as const };

export default function AboutUsPageEn() {
  return (
    <>
      <SubHeader locale={LOCALE} />
      <article className={aboutUsStyles.container}>
        <section className={aboutUsStyles.hero_section}>
          <div className={aboutUsStyles.hero_content}>
            <h1 className={aboutUsStyles.main_title}>About us</h1>
            <p className={aboutUsStyles.hero_text}>
              Lovy Moment is a team of professionals with 10+ years of experience creating
              bright, fun and atmospheric parties in Lviv and the region. We believe every
              moment of life is worth catching and remembering ✨
            </p>
          </div>
          <div className={aboutUsStyles.hero_image}>
            <Image
              src="/img/aboutUs/IMG_20250517_125740.webp"
              alt="The Lovy Moment team at an event"
              width={800}
              height={600}
              priority
              style={imageStyle}
            />
          </div>
        </section>

        <section className={aboutUsStyles.services_section}>
          <h2 className={aboutUsStyles.section_title}>🎉 What we do</h2>
          <div className={aboutUsStyles.services_grid}>
            <div className={aboutUsStyles.service_card}>
              <h3>Attractions</h3>
              <p>Inflatable slides, trampoline complexes, mazes and other entertainment for any party.</p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Games & activities</h3>
              <p>From interactive quests to creative workshops — entertainment matched to age and theme.</p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Animators</h3>
              <p>Live interaction with favourite characters and a custom script tailored to the event.</p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Catering</h3>
              <p>Cotton candy, popcorn, drinks — everything to turn an event into a real celebration.</p>
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.experience_section}>
          <h2 className={aboutUsStyles.section_title}>😊 Our experience</h2>
          <div className={aboutUsStyles.experience_content}>
            <div className={aboutUsStyles.experience_text}>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>10+ years</span>
                <p>of organising parties for kids and adults.</p>
              </div>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>1000+ clients</span>
                <p>who keep coming back and recommending us to friends.</p>
              </div>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>Lviv & region</span>
                <p>we work across the whole region, adapting to your budget and event format.</p>
              </div>
            </div>
            <div className={aboutUsStyles.experience_image}>
              <Image
                src="/img/aboutUs/IMG_20250622_095123.webp"
                alt="Lovy Moment at one of our events in Lviv"
                width={800}
                height={600}
                style={imageStyle}
              />
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.values_section}>
          <h2 className={aboutUsStyles.section_title}>💡 Our values</h2>
          <div className={aboutUsStyles.values_grid}>
            <div className={aboutUsStyles.value_card}>
              <h3>Personal approach</h3>
              <p>For every event — from script to decor details.</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Safety & quality</h3>
              <p>Modern, certified attractions following all safety standards.</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Live interaction</h3>
              <p>Fun, lively contact between animators and guests.</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Emotions first</h3>
              <p>A real celebration is an ocean of positive vibes and sincere smiles.</p>
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.contact_section}>
          <h2 className={aboutUsStyles.section_title}>📞 Get in touch</h2>
          <div className={aboutUsStyles.contact_content}>
            <div className={aboutUsStyles.contact_info}>
              <p className={aboutUsStyles.contact_text}>
                For consultations or bookings, message or call:
              </p>
              <div className={aboutUsStyles.phones}>
                <a href="tel:+380979371691" className={aboutUsStyles.phone_link}>
                  ☎️ +38 (097) 937 16 91
                </a>
                <a href="tel:+380638604966" className={aboutUsStyles.phone_link}>
                  ☎️ +38 (063) 860 49 66
                </a>
              </div>
              <p className={aboutUsStyles.work_hours}>Open every day from 10:00 to 21:00</p>
              <div className={aboutUsStyles.messengers}>
                <p>On messengers:</p>
                <div className={aboutUsStyles.messenger_links}>
                  <a
                    href="https://wa.me/380979371691"
                    className={aboutUsStyles.messenger_link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp
                  </a>
                  <a
                    href="viber://add?number=380979371691"
                    className={aboutUsStyles.messenger_link}
                  >
                    Viber
                  </a>
                  <a
                    href="https://t.me/+380979371691"
                    className={aboutUsStyles.messenger_link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Telegram
                  </a>
                  <a
                    href="https://www.instagram.com/lovymomentlviv/"
                    className={aboutUsStyles.messenger_link}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
            <div className={aboutUsStyles.contact_image}>
              <Image
                src="/img/aboutUs/IMG_8876.webp"
                alt="The Lovy Moment team"
                width={800}
                height={600}
                style={imageStyle}
              />
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.cta_section}>
          <h2 className={aboutUsStyles.cta_title}>
            Lovy Moment — catch your moment, we will add the colours! 🎨
          </h2>
        </section>
      </article>
      <Caller />
      <Footer locale={LOCALE} />
    </>
  );
}
