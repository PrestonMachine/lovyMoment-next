'use client';

/**
 * Admin product list. Live-loads every product from the DB and shows them
 * with thumbnail, name, price, tags, plus inline edit/delete actions.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/admin/AuthProvider';
import { adminListProducts, adminDeleteProduct } from '@/lib/admin-db';
import { PartyLoader } from '@/components/Loader';
import type { RawProduct } from '@/types';
import styles from '@/styles/admin.module.css';

export default function ProductListPage() {
  const { can } = useAuth();
  const canEdit = can('canEdit');
  const canDelete = can('canDelete');
  const [products, setProducts] = useState<RawProduct[] | null>(null);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function reload() {
    try {
      setProducts(await adminListProducts());
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося завантажити товари');
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function onDelete(id: string, name: string) {
    if (!confirm(`Точно видалити "${name}"?`)) return;
    try {
      await adminDeleteProduct(id);
      await reload();
    } catch (e: any) {
      setError(e?.message ?? 'Видалення не вдалося');
    }
  }

  const filtered = (products ?? []).filter((p) => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <h1 className={styles.pageTitle}>Усі товари</h1>
      <p className={styles.pageSubtitle}>
        {products === null ? 'Завантаження…' : `${products.length} записів у базі`}
      </p>

      <div className={styles.actionRow}>
        {canEdit && (
          <Link href="/admin/products/new" className={styles.btnPrimary} style={{ width: 'auto' }}>
            ➕ Новий товар
          </Link>
        )}
        <input
          className={styles.input}
          placeholder="🔎 Пошук за назвою, id або тегом…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ maxWidth: 320 }}
        />
        <Link href="/admin" className={styles.btnGhost} style={{ marginLeft: 'auto' }}>
          ← На дашборд
        </Link>
      </div>

      {error && <div className={styles.alertError}>{error}</div>}

      {products === null && (
        <PartyLoader caption="Завантажуємо товари" subline="Підтягуємо актуальний каталог…" />
      )}
      {products && filtered.length === 0 && (
        <div className={styles.empty}>Нічого не знайдено.</div>
      )}

      <div className={styles.list}>
        {filtered.map((p) => (
          <div key={p.id} className={styles.listItem}>
            {p.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.img} alt={p.name} className={styles.thumb} />
            ) : (
              <div className={styles.thumb} />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className={styles.itemName}>{p.name}</div>
              <div className={styles.itemMeta}>
                id: <code>{p.id}</code> · {p.price || '—'}
                {p.name_en ? ' · 🇬🇧 EN' : ' · UK only'}
              </div>
              <div className={styles.itemTags}>
                {(p.tags ?? []).map((t) => (
                  <span key={t} className={styles.tagChip}>{t}</span>
                ))}
              </div>
            </div>
            <div className={styles.itemActions}>
              <Link href={`/admin/products/${encodeURIComponent(p.id)}`} className={styles.btnSecondary}>
                {canEdit ? 'Редагувати' : 'Переглянути'}
              </Link>
              {canDelete && (
                <button className={styles.btnDanger} onClick={() => onDelete(p.id, p.name)}>
                  Видалити
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
