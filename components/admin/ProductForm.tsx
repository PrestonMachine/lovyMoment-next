'use client';

/**
 * Master product editor: form on the left, live preview on the right.
 *
 *   - Multilingual fields (`name`, `descriptions`, `varning`) get a UK + EN
 *     pair of inputs — the EN version is optional, missing translations
 *     fall back to UK on the public site.
 *   - Tags are picked from a fixed set (CATEGORY_TAG_MAP keys + extras).
 *   - Main image and album use Firebase Storage uploads via `ImageUploader`.
 *   - Live preview re-renders on every keystroke using `ProductViewBody`.
 *
 * On save: writes back the whole array via `adminUpdateProduct` /
 * `adminCreateProduct`, then redirects to the list page.
 */
import { useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { ImageUploader } from './ImageUploader';
import { ProductPreview } from './ProductPreview';
import { ListEditor } from './ListEditor';
import { useAuth } from './AuthProvider';
import { InlineLoader } from '@/components/Loader';
import { adminCreateProduct, adminUpdateProduct } from '@/lib/admin-db';
import { productSlug } from '@/lib/slug';
import { pickLocale, pickLocaleArray } from '@/lib/i18n-utils';
import { CATEGORY_TAG_MAP, CATEGORY_SLUGS } from '@/types';
import type { Locale, Product, RawProduct } from '@/types';
import styles from '@/styles/admin.module.css';

interface Props {
  /** Existing row when editing, or `null` for "new product". */
  initial: RawProduct | null;
}

const ALL_TAGS = [
  'Atractions',
  'MegaGame',
  'Animators',
  'Food',
  'Other',
  'Child-party',
  'Corporate',
  'Promotion',
  'Trampoline',
  'Festival',
  'City-day'
];

function emptyRaw(): RawProduct {
  return {
    id: '',
    name: '',
    name_en: '',
    img: '',
    price: '',
    price_en: '',
    descriptions: '',
    descriptions_en: '',
    varning: '',
    varning_en: '',
    video: '',
    albom: [],
    complactation: [],
    complactation_en: [],
    tags: []
  };
}

/** Resolve a RawProduct → Product for the requested preview locale. */
function resolveProduct(raw: RawProduct, locale: Locale): Product {
  const tags: string[] = Array.isArray(raw.tags) ? raw.tags.filter(Boolean) : [];
  let category = 'other';
  for (const slug of CATEGORY_SLUGS) {
    if (tags.includes(CATEGORY_TAG_MAP[slug])) {
      category = slug;
      break;
    }
  }
  if (tags.includes('Atractions')) category = 'atractions';

  const name = pickLocale(raw, 'name', locale) || raw.name || '—';
  return {
    id: raw.id || 'preview',
    name,
    img: raw.img ?? '',
    price: pickLocale(raw, 'price', locale) || raw.price || '',
    descriptions: pickLocale(raw, 'descriptions', locale),
    varning: pickLocale(raw, 'varning', locale),
    video: raw.video ?? '',
    albom: Array.isArray(raw.albom) ? raw.albom.filter(Boolean) : [],
    complactation: pickLocaleArray(raw, 'complactation', locale),
    tags,
    quantityvar: raw.quantityvar ?? {},
    slug: productSlug(name, raw.id || 'preview'),
    category,
    locale
  };
}

export function ProductForm({ initial }: Props) {
  const router = useRouter();
  const { can } = useAuth();
  const canEdit = can('canEdit');
  const canUpload = can('canUpload');
  const readOnly = !canEdit;

  const isNew = !initial;
  const [data, setData] = useState<RawProduct>(initial ?? emptyRaw());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewLocale, setPreviewLocale] = useState<Locale>('uk');

  const previewProduct = useMemo(() => resolveProduct(data, previewLocale), [data, previewLocale]);

  function patch(partial: Partial<RawProduct>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function toggleTag(tag: string) {
    const cur = data.tags ?? [];
    const next = cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag];
    patch({ tags: next });
  }


  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required-field gauntlet (Ukrainian-language is the source of truth).
    // Every check returns early with a single, specific error message — the
    // admin scrolls up, fixes the field, retries.
    const missing: string[] = [];
    if (!data.id.trim()) missing.push('ID');
    if (!data.name.trim()) missing.push('Назва (UK)');
    if (!(data.price ?? '').trim()) missing.push('Ціна (UK)');
    if (!(data.descriptions ?? '').trim()) missing.push('Опис (UK)');
    if (!Array.isArray(data.tags) || data.tags.filter(Boolean).length === 0) {
      missing.push('Тeги (хоча б один)');
    }
    if (!(data.img ?? '').trim()) missing.push('Головне фото');
    if (!Array.isArray(data.albom) || data.albom.filter(Boolean).length === 0) {
      missing.push('Альбом (хоча б одне фото)');
    }

    if (missing.length > 0) {
      setError(
        `Заповніть обовʼязкові поля: ${missing.join(', ')}.`
      );
      // Scroll back to the top so the message is visible.
      try {
        (e.currentTarget as HTMLFormElement)
          .closest('div')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch {
        /* no-op */
      }
      return;
    }

    // Strip empty optional fields so we don't write `""` everywhere.
    const cleaned: RawProduct = {
      ...data,
      id: data.id.trim(),
      name: data.name.trim(),
      tags: (data.tags ?? []).filter(Boolean),
      complactation: (data.complactation ?? [])
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean),
      complactation_en: (data.complactation_en ?? [])
        .map((s) => (typeof s === 'string' ? s.trim() : ''))
        .filter(Boolean)
    };

    for (const k of [
      'name_en',
      'price_en',
      'descriptions',
      'descriptions_en',
      'varning',
      'varning_en',
      'video'
    ] as const) {
      if (typeof cleaned[k] === 'string' && (cleaned[k] as string).trim() === '') {
        delete (cleaned as any)[k];
      }
    }
    // Drop empty arrays too — keeps the JSON tidy.
    if ((cleaned.complactation ?? []).length === 0) delete (cleaned as any).complactation;
    if ((cleaned.complactation_en ?? []).length === 0) delete (cleaned as any).complactation_en;

    setSaving(true);
    try {
      if (isNew) {
        await adminCreateProduct(cleaned);
        setSuccess('Створено! Перенаправлення…');
      } else {
        await adminUpdateProduct(cleaned);
        setSuccess('Збережено!');
      }
      setTimeout(() => router.push('/admin/products'), 600);
    } catch (e: any) {
      setError(e?.message ?? 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.split}>
      <form className={styles.formCard} onSubmit={onSubmit}>
        {readOnly && (
          <div className={styles.alertError}>
            У вас немає права <strong>«Редагувати товари»</strong> — поля доступні лише для перегляду.
          </div>
        )}
        {error && <div className={styles.alertError}>{error}</div>}
        {success && <div className={styles.alertSuccess}>{success}</div>}
        <fieldset disabled={readOnly} style={{ border: 0, padding: 0, margin: 0 }}>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            ID <span style={{ color: '#dc2626' }}>*</span>{' '}
            <span className={styles.formHint}>(латиниця, без пробілів — використовується в URL)</span>
          </label>
          <input
            className={styles.input}
            value={data.id}
            onChange={(e) => patch({ id: e.target.value.replace(/\s+/g, '-') })}
            disabled={!isNew}
            placeholder="Minion-7"
            required
          />
        </div>

        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Ціна (UK) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              className={styles.input}
              value={data.price ?? ''}
              onChange={(e) => patch({ price: e.target.value })}
              placeholder="13800 грн / 6 год"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Price (EN) <span className={styles.formHint}>(не обовʼязково)</span>
            </label>
            <input
              className={styles.input}
              value={data.price_en ?? ''}
              onChange={(e) => patch({ price_en: e.target.value })}
              placeholder="$350 / 6h"
            />
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Назва (UK) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              className={styles.input}
              value={data.name}
              onChange={(e) => patch({ name: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Name (EN) <span className={styles.formHint}>(не обовʼязково)</span>
            </label>
            <input
              className={styles.input}
              value={data.name_en ?? ''}
              onChange={(e) => patch({ name_en: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Опис (UK) <span style={{ color: '#dc2626' }}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              value={data.descriptions ?? ''}
              onChange={(e) => patch({ descriptions: e.target.value })}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Description (EN) <span className={styles.formHint}>(не обовʼязково)</span>
            </label>
            <textarea
              className={styles.textarea}
              value={data.descriptions_en ?? ''}
              onChange={(e) => patch({ descriptions_en: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Важливо (UK)</label>
            <input
              className={styles.input}
              value={data.varning ?? ''}
              onChange={(e) => patch({ varning: e.target.value })}
              placeholder="На місце монтажу доставка автомобілем."
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Important (EN)</label>
            <input
              className={styles.input}
              value={data.varning_en ?? ''}
              onChange={(e) => patch({ varning_en: e.target.value })}
            />
          </div>
        </div>

        <div className={styles.formGroupRow}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Комплектація (UK) <span className={styles.formHint}>(пункти списку, що йде з товаром)</span>
            </label>
            <ListEditor
              value={data.complactation ?? []}
              onChange={(v) => patch({ complactation: v })}
              placeholder="Турбінка"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              What's included (EN) <span className={styles.formHint}>(не обовʼязково)</span>
            </label>
            <ListEditor
              value={data.complactation_en ?? []}
              onChange={(v) => patch({ complactation_en: v })}
              placeholder="Air blower"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>
            Тeги (категорії на сайті) <span style={{ color: '#dc2626' }}>*</span>{' '}
            <span className={styles.formHint}>(хоча б один)</span>
          </label>
          <div className={styles.tagPicker}>
            {ALL_TAGS.map((t) => {
              const active = (data.tags ?? []).includes(t);
              return (
                <span
                  key={t}
                  className={`${styles.tagOption} ${active ? styles.tagOptionActive : ''}`}
                  onClick={() => toggleTag(t)}
                >
                  {t}
                </span>
              );
            })}
          </div>
        </div>

        {canUpload ? (
          <>
            <div className={styles.formGroup}>
              <ImageUploader
                mode="single"
                productId={data.id || 'unsorted'}
                value={data.img ?? ''}
                onChange={(url) => patch({ img: url })}
                label="Головне фото * (показується на картці у списку)"
                hint="PNG / WebP / JPG. Один файл. Обовʼязкове поле."
              />
            </div>

            <div className={styles.formGroup}>
              <ImageUploader
                mode="multi"
                productId={data.id || 'unsorted'}
                value={data.albom ?? []}
                onChange={(urls) => patch({ albom: urls })}
                label="Альбом * (галерея на сторінці товару)"
                hint="Можна перетягнути одразу кілька файлів. Принаймні одне обовʼязкове."
              />
            </div>
          </>
        ) : (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              Фото <span className={styles.formHint}>(немає права завантажувати)</span>
            </label>
            <div className={styles.alertError} style={{ marginBottom: 8 }}>
              У вас немає права <strong>«Завантажувати фото»</strong> — фото можна тільки переглянути.
            </div>
            {data.img && (
              <div className={styles.imageList}>
                <div className={`${styles.imageItem} ${styles.imageMain}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.img} alt="cover" />
                </div>
                {(data.albom ?? []).map((url, i) => (
                  <div key={i} className={styles.imageItem}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`album ${i + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <label className={styles.formLabel}>YouTube / video URL</label>
          <input
            className={styles.input}
            value={data.video ?? ''}
            onChange={(e) => patch({ video: e.target.value })}
            placeholder="https://youtu.be/..."
          />
        </div>

        </fieldset>

        <div className={styles.actionRow} style={{ marginTop: 24 }}>
          {!readOnly && (
            <button
              type="submit"
              className={styles.btnPrimary}
              style={{ width: 'auto' }}
              disabled={saving}
            >
              {saving ? (
                <InlineLoader>Зберігаємо…</InlineLoader>
              ) : isNew ? (
                '✅ Створити товар'
              ) : (
                '💾 Зберегти зміни'
              )}
            </button>
          )}
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => router.push('/admin/products')}
            disabled={saving}
          >
            {readOnly ? '← Назад' : 'Скасувати'}
          </button>
        </div>
      </form>

      <ProductPreview product={previewProduct} onLocaleChange={setPreviewLocale} />
    </div>
  );
}
