/**
 * Server-rendered site header. Contains the brand logo (Next/Image), social
 * links and a phone number. The legacy CRA Header was split across multiple
 * files (NavBar, HeaderLabel, HeaderButtons) — we collapse them into one for
 * clarity but keep the existing CSS module class names for visual parity.
 */
import Link from 'next/link';
import Image from 'next/image';

import { SvgSelectors } from './SvgSelectors';
import { LocaleSwitcher } from './LocaleSwitcher';
import header from '@/styles/header.module.css';
import { localePath } from '@/i18n/config';
import type { Locale } from '@/types';

interface HeaderProps {
  /** Current locale, used so the logo links back to the locale's home. */
  locale: Locale;
  /** Whether to show the giant hero band (only on the homepage). */
  showHero?: boolean;
  /** Hero title (locale dependent). */
  heroTitle?: string;
  /** Hero CTA label. */
  heroCta?: string;
}

export function Header({ locale, showHero = false, heroTitle, heroCta }: HeaderProps) {
  return (
    <header className={header.header}>
      <div className={header.container}>
        <nav className={`${header.nav_line} ${header.nav_line_display}`} aria-label="Головне меню">
          <Link href={localePath(locale, '/')} aria-label="Lovy Moment — головна">
            {/*
              The natural logo dimensions are 140 × 48 (PNG). The legacy CSS
              forces height: 70px via `.logo`, so we set width: auto in inline
              style to keep aspect ratio and silence Next's "modified one
              dimension" warning.
            */}
            <Image
              src="/img/logo_new.png"
              alt="Lovy Moment — організація свят у Львові"
              width={140}
              height={48}
              priority
              className={header.logo}
              style={{ height: '70px', width: 'auto' }}
              unoptimized
            />
          </Link>

          <div className={header.header_contacts}>
            <ul className={header.socials}>
              <li>
                <a href="https://wa.me/380979371691" aria-label="Зв'язатися у WhatsApp" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors className={header.social_icon} id="watsap" />
                </a>
              </li>
              <li>
                <a href="viber://add?number=380979371691" aria-label="Зв'язатися у Viber">
                  <SvgSelectors className={header.social_icon} id="viber" />
                </a>
              </li>
              <li>
                <a href="https://t.me/pavluyk" aria-label="Зв'язатися у Telegram" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors className={header.social_icon} id="telegram" />
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/lovymomentlviv/" aria-label="Instagram Lovy Moment" rel="noopener noreferrer" target="_blank">
                  <SvgSelectors className={header.social_icon} id="instagram" />
                </a>
              </li>
            </ul>

            <div className={header.tel_number}>
              <SvgSelectors className={header.social_icon} id="heandset" />
              <a href="tel:+380979371691">+38 (097) 937 16 91</a>
            </div>

            {/*
              Minimal "УКР | EN" switcher sits inline after the phone CTA on
              desktop. On mobile (≤500px) the entire `.header_contacts` block
              is hidden by legacy CSS, so the switcher hides with it — the
              footer renders a richer pill version for mobile users.
            */}
            <LocaleSwitcher active={locale} />
          </div>
        </nav>

        {showHero && (
          <div>
            <div className={header.header_title}>
              <h1>{heroTitle}</h1>
            </div>
            <div className={header.header_button}>
              <a className={header.scroll_to} href="#entertiment">
                {heroCta}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
