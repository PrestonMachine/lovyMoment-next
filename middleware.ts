/**
 * Edge middleware:
 *
 *   1. Force the bare-domain (non-www) version. SEO auditors flag duplicate
 *      content when both `www.` and the apex serve the same site. We always
 *      redirect www traffic to the apex with a permanent 301.
 *
 *   2. Locale routing pass-through. Default locale (`uk`) is unprefixed, so
 *      `/atractions` stays canonical. Non-default locales (`/en`) are passed
 *      through to be matched by their dedicated route trees under `app/en/`.
 *
 * The `www` redirect can also be handled at the hosting layer (see
 * `netlify.toml`). Doing it here too keeps the behaviour identical when
 * developing locally or hosting elsewhere.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';

export const config = {
  matcher: [
    // Skip Next internals, API routes, and any file with an extension.
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)'
  ]
};

export function middleware(request: NextRequest) {
  // 1. www → apex redirect.
  const host = request.headers.get('host') ?? '';
  if (host.toLowerCase().startsWith('www.')) {
    const url = new URL(request.url);
    url.host = host.slice(4);
    return NextResponse.redirect(url, 308);
  }

  // 2. Locale routing.
  const { pathname } = request.nextUrl;
  for (const locale of locales) {
    if (locale === defaultLocale) continue;
    if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
      return NextResponse.next();
    }
  }
  return NextResponse.next();
}
