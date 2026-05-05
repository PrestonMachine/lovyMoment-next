'use client';

/**
 * /admin/admins — manage who can sign in to the admin area and what each
 * admin is allowed to do.
 *
 * Two groups:
 *   - Root admins (env-bootstrap, locked) — pinned at the top, full access.
 *   - Stored admins (RTDB-backed) — toggle individual capabilities live.
 *
 * Access guard: this page itself requires `canManageAdmins`. If the current
 * admin lacks that permission, we show an explainer instead of the editor.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useAuth } from '@/components/admin/AuthProvider';
import {
  ADMIN_CAPABILITIES,
  ADMIN_PERMISSION_DESCRIPTIONS,
  ADMIN_PERMISSION_LABELS,
  DEFAULT_PERMISSIONS,
  type AdminPermissions,
  type Capability
} from '@/lib/admin-config';
import {
  addStoredAdmin,
  fetchStoredAdmins,
  removeStoredAdmin,
  updateStoredAdminPermissions,
  type StoredAdmin
} from '@/lib/admin-users';
import { PartyLoader } from '@/components/Loader';
import styles from '@/styles/admin.module.css';

export default function AdminUsersPage() {
  const { user, can, refreshAdminStatus } = useAuth();
  const allowed = can('canManageAdmins');

  const [stored, setStored] = useState<StoredAdmin[] | null>(null);
  const [draftEmail, setDraftEmail] = useState('');
  const [draftPerms, setDraftPerms] = useState<AdminPermissions>({ ...DEFAULT_PERMISSIONS });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedFor, setSavedFor] = useState<string | null>(null);

  async function reload() {
    try {
      setStored(await fetchStoredAdmins());
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося завантажити список');
    }
  }

  useEffect(() => {
    if (allowed) reload();
  }, [allowed]);

  if (!allowed) {
    return (
      <>
        <h1 className={styles.pageTitle}>Адміни</h1>
        <div className={styles.alertError}>
          У вас немає права <strong>«Керувати адмінами»</strong>. Зверніться до root-адміна,
          щоб увімкнути цю опцію для вашого акаунта.
        </div>
        <div className={styles.actionRow}>
          <Link href="/admin" className={styles.btnGhost}>← На дашборд</Link>
        </div>
      </>
    );
  }

  function flashSaved(email: string) {
    setSavedFor(email);
    setTimeout(() => setSavedFor((cur) => (cur === email ? null : cur)), 1500);
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await addStoredAdmin(draftEmail, draftPerms);
      setDraftEmail('');
      setDraftPerms({ ...DEFAULT_PERMISSIONS });
      flashSaved(draftEmail.trim().toLowerCase());
      await reload();
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося додати');
    } finally {
      setBusy(false);
    }
  }

  async function togglePermission(email: string, capability: Capability, current: AdminPermissions) {
    setError(null);
    const next: AdminPermissions = { ...current, [capability]: !current[capability] };
    // Optimistic local update so toggle feels instant.
    setStored((list) =>
      list ? list.map((a) => (a.email === email ? { ...a, permissions: next } : a)) : list
    );
    try {
      await updateStoredAdminPermissions(email, next);
      flashSaved(email);
      // If the admin just edited their own row, re-evaluate their permissions.
      if (user?.email && user.email.toLowerCase() === email) {
        await refreshAdminStatus();
      }
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося зберегти');
      reload();
    }
  }

  async function onRemove(email: string) {
    if (email === user?.email?.toLowerCase()) {
      if (!confirm('Ви прибираєте власний доступ. Продовжити?')) return;
    } else if (!confirm(`Прибрати ${email} зі списку адмінів?`)) {
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await removeStoredAdmin(email);
      await reload();
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося видалити');
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h1 className={styles.pageTitle}>Адміни</h1>
      <p className={styles.pageSubtitle}>
        Хто може заходити в адмінку і які дії може виконувати. Зміни діють миттєво — без
        перерозгортання.
      </p>

      <div className={styles.actionRow}>
        <Link href="/admin" className={styles.btnGhost}>← На дашборд</Link>
      </div>

      {error && <div className={styles.alertError}>{error}</div>}

      <div className={styles.formCard}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          ➕ Додати нового адміна
        </h2>
        <form onSubmit={onAdd}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <input
              className={styles.input}
              type="email"
              value={draftEmail}
              onChange={(e) => setDraftEmail(e.target.value)}
              placeholder="new-admin@example.com"
              required
              disabled={busy}
            />
            <button
              type="submit"
              className={styles.btnPrimary}
              style={{ width: 'auto' }}
              disabled={busy || !draftEmail.trim()}
            >
              Додати
            </button>
          </div>
          <PermissionGrid
            permissions={draftPerms}
            onToggle={(cap) => setDraftPerms((p) => ({ ...p, [cap]: !p[cap] }))}
          />
        </form>
      </div>

      <div className={styles.formCard} style={{ marginTop: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>
          👥 Збережені адміни
          {stored && <span className={styles.formHint}> · {stored.length}</span>}
        </h2>

        {stored === null && (
          <PartyLoader caption="Завантажуємо адмінів" subline="Звіряємо список доступу…" compact />
        )}
        {stored && stored.length === 0 && (
          <div className={styles.empty}>Ще немає збережених адмінів.</div>
        )}

        {stored?.map((a) => {
          const isYou = a.email === user?.email?.toLowerCase();
          return (
            <div key={a.email} className={styles.adminCard}>
              <div className={styles.adminCardHeader}>
                <span className={styles.adminCardEmail}>{a.email}</span>
                {isYou && (
                  <span className={`${styles.adminCardBadge} ${styles.adminCardBadgeYou}`}>це ви</span>
                )}
                <span
                  className={`${styles.savedFlash} ${savedFor === a.email ? styles.visible : ''}`}
                >
                  ✓ збережено
                </span>
              </div>
              <PermissionGrid
                permissions={a.permissions}
                onToggle={(cap) => togglePermission(a.email, cap, a.permissions)}
              />
              <div className={styles.adminCardActions}>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => onRemove(a.email)}
                  disabled={busy}
                >
                  Прибрати доступ
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* Reusable grid of toggles. */
function PermissionGrid({
  permissions,
  onToggle,
  disabled
}: {
  permissions: AdminPermissions;
  onToggle?: (cap: Capability) => void;
  disabled?: boolean;
}) {
  return (
    <div className={styles.permissionGrid}>
      {ADMIN_CAPABILITIES.map((cap) => (
        <label
          key={cap}
          className={`${styles.permissionToggle} ${disabled ? styles.disabled : ''}`}
        >
          <input
            type="checkbox"
            checked={!!permissions[cap]}
            disabled={disabled || !onToggle}
            onChange={() => onToggle?.(cap)}
            style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          />
          <span className={styles.permissionCheckbox} />
          <span className={styles.permissionLabel}>
            {ADMIN_PERMISSION_LABELS[cap]}
            <small>{ADMIN_PERMISSION_DESCRIPTIONS[cap]}</small>
          </span>
        </label>
      ))}
    </div>
  );
}
