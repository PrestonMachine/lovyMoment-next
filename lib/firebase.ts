/**
 * Server-friendly Firebase Realtime Database access.
 *
 * Important differences from the legacy CRA app:
 *   - We use one-shot `get(ref())` calls instead of realtime `onValue()`
 *     listeners. This makes the data fetch awaitable from React Server
 *     Components and from `generateStaticParams` / `generateMetadata`.
 *   - The Firebase app is initialised lazily and reused across requests.
 *   - The DB row may be either an array (the new export shape) or an object
 *     keyed by id (the legacy shape) — both are normalised into Product[].
 *   - Multilingual fields (`name_en`, `descriptions_en`, …) are resolved per
 *     request via `lib/i18n-utils.ts`. The returned `Product` is flat — no
 *     consumer needs to know about the suffix scheme.
 */

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getDatabase, ref, get, type Database } from 'firebase/database';

import type { Locale, Product, RawProduct } from '@/types';
import { CATEGORY_TAG_MAP, CATEGORY_SLUGS, DEFAULT_LOCALE } from '@/types';
import { productSlug } from './slug';
import { pickLocale, pickLocaleArray } from './i18n-utils';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyA42pB1iFhLgZjYOzaXC7fY6H2A3DQiC_g',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'lovymoment-c0c91.firebaseapp.com',
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ??
    'https://lovymoment-c0c91-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'lovymoment-c0c91',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'lovymoment-c0c91.appspot.com',
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '831935413675',
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:831935413675:web:708a2fa8f548b2375ea6ee',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? 'G-EMFWE6K031'
};

let _app: FirebaseApp | null = null;
let _db: Database | null = null;

function app(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

function db(): Database {
  if (_db) return _db;
  _db = getDatabase(app());
  return _db;
}

/** Map raw RTDB value to a normalised Product. Drops obviously empty rows. */
function normalise(raw: any, locale: Locale): Product | null {
  if (!raw || typeof raw !== 'object') return null;

  const row = raw as RawProduct;
  const id: string = (row.id ?? '').toString().trim();
  if (!id) return null;

  // Resolve the localised name first. If neither UK nor any other translation
  // is present, we drop the row.
  const name = pickLocale(row, 'name', locale);
  if (!name) return null;

  const tags: string[] = Array.isArray(row.tags)
    ? row.tags.filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
    : [];

  // Pick a primary category slug from tags, falling back to "other".
  let category = 'other';
  for (const slug of CATEGORY_SLUGS) {
    if (tags.includes(CATEGORY_TAG_MAP[slug])) {
      category = slug;
      break;
    }
  }
  if (tags.includes('Atractions')) category = 'atractions';

  return {
    id,
    name,
    img: (row.img ?? '').toString(),
    price: pickLocale(row, 'price', locale) || (row.price ?? '').toString(),
    descriptions: pickLocale(row, 'descriptions', locale),
    varning: pickLocale(row, 'varning', locale),
    video: (row.video ?? '').toString(),
    albom: Array.isArray(row.albom) ? row.albom.filter(Boolean) : [],
    complactation: pickLocaleArray(row, 'complactation', locale),
    tags,
    quantityvar: row.quantityvar ?? {},
    slug: productSlug(name, id),
    category,
    locale
  };
}

/**
 * Fetch the raw product list from RTDB. Products live at root (numeric keys
 * 0, 1, 2…), with non-product meta (e.g. `/admins`) sitting alongside as
 * named keys. The `/products` bucket is read too for backward-compatibility
 * with any DB still in the transient migration state.
 */
async function readRawList(): Promise<unknown[]> {
  const collected: unknown[] = [];

  const rootSnap = await get(ref(db()));
  if (rootSnap.exists()) {
    const val = rootSnap.val();
    if (Array.isArray(val)) {
      for (const v of val) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        // Skip meta keys that aren't products: the canonical admin whitelist
        // (`_admins`), the legacy whitelist (`admins`) and the legacy
        // `products` bucket from earlier migration attempts.
        if (k === '_admins' || k === 'admins' || k === 'products') continue;
        if (v && typeof v === 'object') collected.push(v);
      }
    }
  }

  // Legacy fallback: products may briefly live under `/products` after an
  // earlier migration attempt. Read them and merge.
  const productsSnap = await get(ref(db(), 'products'));
  if (productsSnap.exists()) {
    const val = productsSnap.val();
    if (Array.isArray(val)) {
      for (const v of val) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const v of Object.values(val as Record<string, unknown>)) {
        if (v) collected.push(v);
      }
    }
  }

  // De-duplicate by id (string match).
  const seen = new Set<string>();
  return collected.filter((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const id = (entry as { id?: unknown }).id;
    if (typeof id !== 'string' || !id) return false;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * One-shot fetch of all products, resolved into the requested locale.
 * Cached by Next.js's data cache when called from a server component with
 * `revalidate` set on the route.
 */
export async function getAllProducts(locale: Locale = DEFAULT_LOCALE): Promise<Product[]> {
  const raws = await readRawList();
  const products: Product[] = [];
  for (const value of raws) {
    const p = normalise(value, locale);
    if (p) products.push(p);
  }
  return products;
}

/** Fetch a single product by Firebase id. */
export async function getProductById(
  id: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Product | null> {
  if (!id) return null;
  // For the new array-shaped DB, the row's index is numeric — direct id
  // lookup at /<id> won't work. We scan the small dataset (≈50 rows) instead.
  const all = await getAllProducts(locale);
  return all.find((p) => p.id === id) ?? null;
}

/** Fetch products that include a given Firebase tag. */
export async function getProductsByTag(
  tag: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Product[]> {
  const all = await getAllProducts(locale);
  return all.filter((p) => (p.tags ?? []).includes(tag));
}

/** Fetch products for a category slug (uses CATEGORY_TAG_MAP). */
export async function getProductsByCategory(
  categorySlug: string,
  locale: Locale = DEFAULT_LOCALE
): Promise<Product[]> {
  const tag = CATEGORY_TAG_MAP[categorySlug];
  if (!tag) return [];
  return getProductsByTag(tag, locale);
}
