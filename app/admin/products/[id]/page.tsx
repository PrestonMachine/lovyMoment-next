'use client';

/**
 * /admin/products/[id] — edit a single product. Loads the row from the DB
 * client-side, then renders the same `<ProductForm />` as the "new" page,
 * pre-filled with existing data.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { adminGetProduct } from '@/lib/admin-db';
import { ProductForm } from '@/components/admin/ProductForm';
import { PartyLoader } from '@/components/Loader';
import type { RawProduct } from '@/types';
import styles from '@/styles/admin.module.css';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(params.id);

  const [product, setProduct] = useState<RawProduct | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await adminGetProduct(id);
        if (!cancelled) setProduct(p);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Не вдалося завантажити товар');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <h1 className={styles.pageTitle}>Редагувати товар</h1>
      <p className={styles.pageSubtitle}>
        id: <code>{id}</code> · зміни одразу видно в правому препʼю
      </p>

      <div className={styles.actionRow}>
        <Link href="/admin/products" className={styles.btnGhost}>
          ← Усі товари
        </Link>
      </div>

      {error && <div className={styles.alertError}>{error}</div>}

      {product === undefined && (
        <PartyLoader caption="Завантажуємо товар" subline={`id: ${id}`} compact />
      )}
      {product === null && (
        <div className={styles.empty}>
          Товар з id <code>{id}</code> не знайдено.{' '}
          <Link href="/admin/products/new">Створити новий?</Link>
        </div>
      )}
      {product && <ProductForm initial={product} />}
    </>
  );
}
