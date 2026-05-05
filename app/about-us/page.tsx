/**
 * "About us" page (`/about-us`). Faithful port of the legacy SPA — same
 * sections, same emojis in section titles, same CTA banner. Pure server
 * component, content is static marketing copy.
 */
import type { Metadata } from 'next';
import Image from 'next/image';

import { SubHeader } from '@/components/SubHeader';
import { Footer } from '@/components/Footer';
import { Caller } from '@/components/Caller';
import aboutUsStyles from '@/styles/aboutUs.module.css';
import { CATEGORY_SEO, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: CATEGORY_SEO['about-us'].title,
  description: CATEGORY_SEO['about-us'].description,
  keywords: CATEGORY_SEO['about-us'].keywords,
  alternates: {
    canonical: '/about-us',
    languages: { uk: '/about-us', en: '/en/about-us' }
  },
  openGraph: {
    title: CATEGORY_SEO['about-us'].title,
    description: CATEGORY_SEO['about-us'].description,
    url: `${SITE_URL}/about-us`,
    type: 'website'
  }
};

// Style overrides applied to every <Image>: the legacy CSS rules
// (`width: 100%; height: 400px; object-fit: cover` etc.) live in the
// `.module.css` and target raw `<img>` selectors. Next.js's `<Image>`
// renders an `<img>`, so the cascade picks up the legacy rule once we
// stop forcing `height: auto` inline.
const imageStyle = { objectFit: 'cover' as const };

export default function AboutUsPage() {
  const locale = 'uk' as const;
  return (
    <>
      <SubHeader locale={locale} />
      <article className={aboutUsStyles.container}>
        <section className={aboutUsStyles.hero_section}>
          <div className={aboutUsStyles.hero_content}>
            <h1 className={aboutUsStyles.main_title}>Про нас</h1>
            <p className={aboutUsStyles.hero_text}>
              Lovy Moment — це команда професіоналів із понад 10 років досвіду у створенні
              веселих, яскравих і атмосферних свят у Львові та області. Ми віримо, що кожен
              момент життя вартий того, щоб його зловити і запам&apos;ятати ✨
            </p>
          </div>
          <div className={aboutUsStyles.hero_image}>
            <Image
              src="/img/aboutUs/IMG_20250517_125740.webp"
              alt="Команда Lovy Moment на заході"
              width={800}
              height={600}
              priority
              style={imageStyle}
            />
          </div>
        </section>

        <section className={aboutUsStyles.services_section}>
          <h2 className={aboutUsStyles.section_title}>🎉 Що ми робимо</h2>
          <div className={aboutUsStyles.services_grid}>
            <div className={aboutUsStyles.service_card}>
              <h3>Атракціони</h3>
              <p>
                Надувні гірки, батутні комплекси, лабіринти та інші розваги — для будь-якого свята
              </p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Ігри та активності</h3>
              <p>
                Від інтерактивних квестів до творчих воркшопів — підбираємо розваги відповідно до
                віку та тематики
              </p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Аніматори</h3>
              <p>
                Живе спілкування з улюбленими персонажами, індивідуальний сценарій заходу за
                бажанням замовника
              </p>
            </div>
            <div className={aboutUsStyles.service_card}>
              <h3>Кейтеринг</h3>
              <p>Додаємо солодку вату, попкорн, напої — все, щоб створити справжнє свято</p>
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.experience_section}>
          <h2 className={aboutUsStyles.section_title}>😊 Наш досвід</h2>
          <div className={aboutUsStyles.experience_content}>
            <div className={aboutUsStyles.experience_text}>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>10+ років</span>
                <p>організовуємо свята для дітей та дорослих</p>
              </div>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>1000+ клієнтів</span>
                <p>задоволених клієнтів, які поверталися до нас знову та рекомендують друзям</p>
              </div>
              <div className={aboutUsStyles.experience_item}>
                <span className={aboutUsStyles.highlight}>Львів та область</span>
                <p>працюємо по всьому регіону, підлаштовуючись під бюджет і формат заходу</p>
              </div>
            </div>
            <div className={aboutUsStyles.experience_image}>
              <Image
                src="/img/aboutUs/IMG_20250622_095123.webp"
                alt="Lovy Moment на одному зі святкових заходів у Львові"
                width={800}
                height={600}
                style={imageStyle}
              />
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.values_section}>
          <h2 className={aboutUsStyles.section_title}>💡 Наші цінності</h2>
          <div className={aboutUsStyles.values_grid}>
            <div className={aboutUsStyles.value_card}>
              <h3>Індивідуальний підхід</h3>
              <p>До кожного заходу — від сценарію до деталей декору</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Безпека і якість</h3>
              <p>Сучасні та якісні атракціони з дотриманням усіх стандартів безпеки</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Живе спілкування</h3>
              <p>Веселий і живий контакт між аніматорами та гостями</p>
            </div>
            <div className={aboutUsStyles.value_card}>
              <h3>Емоції понад усе</h3>
              <p>Справжнє свято — це море позитиву та щирі посмішки</p>
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.contact_section}>
          <h2 className={aboutUsStyles.section_title}>📞 Зв&apos;язок з нами</h2>
          <div className={aboutUsStyles.contact_content}>
            <div className={aboutUsStyles.contact_info}>
              <p className={aboutUsStyles.contact_text}>
                Для консультації або замовлення пишіть або телефонуйте:
              </p>
              <div className={aboutUsStyles.phones}>
                <a href="tel:+380979371691" className={aboutUsStyles.phone_link}>
                  ☎️ +38 (097) 937 16 91
                </a>
                <a href="tel:+380638604966" className={aboutUsStyles.phone_link}>
                  ☎️ +38 (063) 860 49 66
                </a>
              </div>
              <p className={aboutUsStyles.work_hours}>Працюємо щодня з 10:00 до 21:00</p>
              <div className={aboutUsStyles.messengers}>
                <p>У месенджерах:</p>
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
                alt="Команда Lovy Moment"
                width={800}
                height={600}
                style={imageStyle}
              />
            </div>
          </div>
        </section>

        <section className={aboutUsStyles.cta_section}>
          <h2 className={aboutUsStyles.cta_title}>
            Lovy Moment — лови свій момент, а ми додамо йому яскравих фарб! 🎨
          </h2>
        </section>
      </article>
      <Caller />
      <Footer locale={locale} />
    </>
  );
}
