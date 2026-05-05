'use client';

/**
 * Client-side write helpers for the admin area.
 *
 * Storage layout (final):
 *   /            ← products live here at numeric keys (0, 1, 2, …)
 *   /admins      ← whitelist of editor emails (sibling of the products)
 *
 * Earlier iterations briefly stored products under `/products`; the writer
 * cleans that key up automatically so we converge on the layout above.
 */
import { ref, get, set } from 'firebase/database';

import { clientDb } from './firebase-client';
import type { RawProduct } from '@/types';

/**
 * Root-level keys that are *not* product entries. The admin whitelist
 * lives in Firestore now (see `lib/admin-users.ts`), but earlier installs
 * stored it under `/_admins` or `/admins` in RTDB. We still skip those
 * keys when listing products, and the writer drops them from the root so
 * the cleanup is one-shot the first time someone saves a product.
 */
const LEGACY_ADMIN_KEYS = ['admins', '_admins'] as const;
const META_KEYS = new Set<string>(LEGACY_ADMIN_KEYS);

/**
 * Read every raw product from the DB. Looks both at the root (current
 * layout) and at the legacy `/products` path, then de-duplicates by id so
 * nothing is lost during the rare moment the DB has both.
 */
export async function adminListProducts(): Promise<RawProduct[]> {
  const collected: RawProduct[] = [];

  const rootSnap = await get(ref(clientDb()));
  if (rootSnap.exists()) {
    const val = rootSnap.val();
    if (Array.isArray(val)) {
      for (const v of val as RawProduct[]) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
        if (META_KEYS.has(k)) continue;
        if (k === 'products') continue; // legacy bucket — handled below
        if (v && typeof v === 'object') collected.push(v as RawProduct);
      }
    }
  }

  // Pick up anything stranded under /products from a previous migration.
  const productsSnap = await get(ref(clientDb(), 'products'));
  if (productsSnap.exists()) {
    const val = productsSnap.val();
    if (Array.isArray(val)) {
      for (const v of val as RawProduct[]) if (v) collected.push(v);
    } else if (val && typeof val === 'object') {
      for (const v of Object.values(val as Record<string, RawProduct>)) {
        if (v) collected.push(v);
      }
    }
  }

  const seen = new Set<string>();
  return collected.filter((p) => {
    if (!p || !p.id) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}

/**
 * Persist the full product list at the root, preserving non-product meta
 * keys (`admins`). Atomic: a single `set()` rewrites the whole root, so
 * there's no transient state with duplicated entries.
 *
 * Requires the RTDB security rules to allow root-level writes for admins.
 */
async function writeProducts(rows: RawProduct[]): Promise<void> {
  // Build the new root: just products at numeric keys. Any leftover admin
  // tree from a previous install (`/_admins`, `/admins`) is dropped — the
  // whitelist now lives in Firestore.
  const next: Record<string, unknown> = {};
  for (let i = 0; i < rows.length; i++) {
    next[String(i)] = rows[i];
  }

  await set(ref(clientDb()), next);
}

export async function adminCreateProduct(product: RawProduct): Promise<void> {
  const all = await adminListProducts();
  all.push(product);
  await writeProducts(all);
}

export async function adminUpdateProduct(product: RawProduct): Promise<void> {
  const all = await adminListProducts();
  const idx = all.findIndex((p) => p.id === product.id);
  if (idx === -1) {
    all.push(product);
  } else {
    all[idx] = product;
  }
  await writeProducts(all);
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const all = await adminListProducts();
  const filtered = all.filter((p) => p.id !== id);
  await writeProducts(filtered);
}

export async function adminGetProduct(id: string): Promise<RawProduct | null> {
  const all = await adminListProducts();
  return all.find((p) => p.id === id) ?? null;
}
