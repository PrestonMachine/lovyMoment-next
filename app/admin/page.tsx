'use client';

/**
 * Admin dashboard. Three sections:
 *
 *   1. Welcome hero with the user's name + a "you have X products" badge.
 *   2. Quick stats — products, products with EN translations, admin count.
 *   3. Action grid — large clickable cards for the main flows.
 *   4. "Recently added" — last 5 products from the DB.
 *
 * All data is fetched client-side from RTDB through `lib/admin-db` and
 * `lib/admin-users` so the dashboard always shows live numbers.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/admin/AuthProvider';
import { adminListProducts } from '@/lib/admin-db';
import { fetchStoredAdminEmails } from '@/lib/admin-users';
import { ROOT_ADMIN_EMAILS } from '@/lib/admin-config';
import { PartyLoader } from '@/components/Loader';
import type { RawProduct } from '@/types';
import styles from '@/styles/admin.module.css';

export default function AdminDashboard() {
  const { user, can, isRoot } = useAuth();
  const [products, setProducts] = useState<RawProduct[] | null>(null);
  const [adminCount, setAdminCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [list, stored] = await Promise.all([
          adminListProducts(),
          fetchStoredAdminEmails().catch(() => [])
        ]);
        if (cancelled) return;
        setProducts(list);
        setAdminCount(ROOT_ADMIN_EMAILS.length + stored.length);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = products?.length ?? null;
  const withEn = products
    ? products.filter((p) => typeof p.name_en === 'string' && p.name_en.trim().length > 0).length
    : null;
  const recent = products ? [...products].slice(-5).reverse() : [];

  const firstName = user?.displayName?.split(/\s+/)[0] ?? 'адміне';

  return (
    <>
      <div className={styles.dashHero}>
        <div className={styles.dashHeroText}>
          <h1>Привіт, {firstName} 👋</h1>
          <p>
            Тут ти керуєш каталогом Lovy Moment — додаєш нові розваги, оновлюєш фото,
            доглядаєш за перекладами та контролюєш доступ до адмінки.
          </p>
        </div>
        {total !== null && (
          <div className={styles.dashHeroBadge}>
            {total} {total === 1 ? 'товар' : total < 5 ? 'товари' : 'товарів'} у базі
          </div>
        )}
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{total ?? '—'}</div>
          <div className={styles.statLabel}>Усього товарів</div>
          <div className={styles.statHint}>В RTDB / products</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {withEn ?? '—'}
            {total ? (
              <span style={{ fontSize: 14, color: '#9ca3af', marginLeft: 6 }}>
                / {total}
              </span>
            ) : null}
          </div>
          <div className={styles.statLabel}>З англомовною версією</div>
          <div className={styles.statHint}>Має заповнене поле name_en</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{adminCount ?? '—'}</div>
          <div className={styles.statLabel}>Адміни</div>
          <div className={styles.statHint}>Root + RTDB whitelist</div>
        </div>
      </div>

      <div className={styles.actionGrid}>
        <Link href="/admin/products" className={styles.actionCard}>
          <span className={styles.actionEmoji}>📋</span>
          <div className={styles.actionTitle}>Усі товари</div>
          <div className={styles.actionDescription}>
            Переглянути, {can('canEdit') ? 'відредагувати' : 'продивитись'}
            {can('canDelete') ? ' або видалити' : ''} будь-яку розвагу з каталогу.
          </div>
          <span className={styles.actionArrow}>Відкрити список →</span>
        </Link>

        {can('canEdit') && (
          <Link href="/admin/products/new" className={styles.actionCard}>
            <span className={styles.actionEmoji}>➕</span>
            <div className={styles.actionTitle}>Додати новий товар</div>
            <div className={styles.actionDescription}>
              Заповни мінімум полів — UK назву, ID, фото — і збережи. Інше можна додати пізніше.
            </div>
            <span className={styles.actionArrow}>Створити →</span>
          </Link>
        )}

        {can('canManageAdmins') && (
          <Link href="/admin/admins" className={styles.actionCard}>
            <span className={styles.actionEmoji}>👥</span>
            <div className={styles.actionTitle}>Доступ до адмінки</div>
            <div className={styles.actionDescription}>
              Додай нового адміна за email або скасуй чийсь доступ. Зміни діють миттєво.
            </div>
            <span className={styles.actionArrow}>Керувати →</span>
          </Link>
        )}

        <Link href="/" className={styles.actionCard}>
          <span className={styles.actionEmoji}>🌐</span>
          <div className={styles.actionTitle}>Відкрити сайт</div>
          <div className={styles.actionDescription}>
            Подивися як виглядає публічна версія сайту з останніми оновленнями.
          </div>
          <span className={styles.actionArrow}>Перейти на сайт →</span>
        </Link>
      </div>

      <div className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Останньо додані</h2>
          <Link href="/admin/products" className={styles.sectionLink}>
            Усі товари →
          </Link>
        </div>

        {products === null && (
          <PartyLoader caption="Завантажуємо останні" compact confettiCount={6} />
        )}
        {products && products.length === 0 && (
          <div className={styles.empty}>Каталог порожній. Додайте перший товар.</div>
        )}

        {recent.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${encodeURIComponent(p.id)}`}
            className={styles.recentItem}
          >
            {p.img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.img} alt="" className={styles.recentThumb} />
            ) : (
              <div className={styles.recentThumb} />
            )}
            <div className={styles.recentInfo}>
              <div className={styles.recentName}>{p.name}</div>
              <div className={styles.recentMeta}>
                <code>{p.id}</code>
                {p.price ? ` · ${p.price}` : ''}
                {p.name_en ? ' · 🇬🇧 EN' : ' · UK only'}
              </div>
            </div>
            <span className={styles.actionArrow}>Редагувати →</span>
          </Link>
        ))}
      </div>
    </>
  );
}
