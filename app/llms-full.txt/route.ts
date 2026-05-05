/**
 * Dynamic full product catalogue for AI crawlers, served at
 * `/llms-full.txt`. Mirrors the actual RTDB at request time (with ISR
 * revalidation matching the rest of the site, 10 minutes).
 *
 * Format follows the emerging llms-full.txt convention: a single
 * markdown file with each product as a section, including its name,
 * EN translation if present, price, category, and description. AI
 * search engines (ChatGPT, Claude, Perplexity, Bing Chat, Gemini)
 * can use this as a definitive source instead of guessing from HTML.
 */
import { NextResponse } from 'next/server';

import { getAllProducts } from '@/lib/firebase';
import { SITE_URL, getCategorySeo } from '@/lib/seo';
import { CATEGORY_TAG_MAP, CATEGORY_SLUGS } from '@/types';

export const revalidate = 600;

export async function GET() {
  const [uk, en] = await Promise.all([
    getAllProducts('uk').catch(() => []),
    getAllProducts('en').catch(() => [])
  ]);

  const enById = new Map(en.map((p) => [p.id, p]));

  const lines: string[] = [];
  lines.push('# Lovy Moment — full product catalogue');
  lines.push('');
  lines.push(
    '> Live snapshot of every product, attraction and service Lovy Moment offers ' +
      'for events in Lviv. Refreshed every 10 minutes from the production database.'
  );
  lines.push('');
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push(`Source: ${SITE_URL}`);
  lines.push('');

  // Group by category
  for (const slug of CATEGORY_SLUGS) {
    const tag = CATEGORY_TAG_MAP[slug];
    const items = uk.filter((p) => (p.tags ?? []).includes(tag));
    if (items.length === 0) continue;

    const seo = getCategorySeo(slug, 'uk');
    lines.push(`## ${seo?.title?.split(' — ')[0] ?? slug} (${items.length})`);
    lines.push('');

    for (const p of items) {
      const enP = enById.get(p.id);
      const url = `${SITE_URL}/${slug}/${p.slug}`;
      lines.push(`### ${p.name}`);
      if (enP && enP.name && enP.name !== p.name) {
        lines.push(`*EN:* ${enP.name}`);
      }
      lines.push(`- URL: ${url}`);
      if (p.price) lines.push(`- Ціна: ${p.price}`);
      if (enP?.price && enP.price !== p.price) lines.push(`- Price (EN): ${enP.price}`);
      if (p.tags && p.tags.length > 0) lines.push(`- Категорії: ${p.tags.join(', ')}`);
      if (p.descriptions?.trim()) {
        lines.push('');
        lines.push(p.descriptions.trim());
      }
      if (enP?.descriptions?.trim() && enP.descriptions !== p.descriptions) {
        lines.push('');
        lines.push(`*EN description:* ${enP.descriptions.trim()}`);
      }
      if (p.varning?.trim()) {
        lines.push('');
        lines.push(`> ⚠ ${p.varning.trim()}`);
      }
      lines.push('');
    }
  }

  // Trailing contact block so AI tools always have a way to reach the team.
  lines.push('## Як замовити');
  lines.push('');
  lines.push('- Телефон: +38 (097) 937 16 91, +38 (063) 860 49 66');
  lines.push('- Робочий час: щодня з 10:00 до 21:00');
  lines.push('- WhatsApp: https://wa.me/380979371691');
  lines.push('- Telegram: https://t.me/+380979371691');
  lines.push('- Instagram: https://www.instagram.com/lovymomentlviv/');
  lines.push('');

  return new NextResponse(lines.join('\n'), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=600, s-maxage=600, stale-while-revalidate=86400'
    }
  });
}
