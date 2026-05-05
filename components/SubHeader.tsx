/**
 * Compact header used on inner pages (categories, product). Includes a back
 * arrow and a "copy link" button — the latter is the only piece that needs
 * client interactivity, so it lives in `CopyLinkButton`.
 */
import Link from 'next/link';
import Image from 'next/image';

import { SvgSelectors } from './SvgSelectors';
import { CopyLinkButton } from './CopyLinkButton';
import { Header } from './Header';
import header from '@/styles/header.module.css';
import { localePath } from '@/i18n/config';
import type { Locale } from '@/types';

interface SubHeaderProps {
  locale: Locale;
}

export function SubHeader({ locale }: SubHeaderProps) {
  return (
    <>
      {/*
        Render the same nav line as the home Header, without the hero.
        On phones (≤500px) this top bar is hidden — the compact buttons
        row below already plays the role of a header on mobile, so the
        big duplicate logo would just waste vertical space.
      */}
      <div className={header.sub_top_hide}>
        <Header locale={locale} showHero={false} />
      </div>

      <div className={header.header_buttons}>
        <div className={header.header_back}>
          <Link href={localePath(locale, '/')} aria-label="Повернутися на головну">
            <SvgSelectors id="arrow" />
          </Link>
        </div>
        <Link href={localePath(locale, '/')} aria-label="Lovy Moment">
          <Image
            className={header.buttons_img}
            src="/img/logo_new.png"
            alt="Lovy Moment"
            width={140}
            height={60}
            style={{ height: 'auto', maxHeight: 60 }}
            unoptimized
          />
        </Link>
        <CopyLinkButton />
      </div>
    </>
  );
}
