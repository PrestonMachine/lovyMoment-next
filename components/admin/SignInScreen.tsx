'use client';

/**
 * Sign-in / access denied screen for the admin area. Renders a centred card
 * with a single Google sign-in button. After login, if the email isn't on
 * the whitelist, shows an "Access denied" message instead of the dashboard.
 */
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { PartyLoader } from '@/components/Loader';
import styles from '@/styles/admin.module.css';

export function SignInScreen() {
  const { user, loading, isAdmin, signIn, signOutUser } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className={styles.authShell}>
        <PartyLoader caption="Перевіряємо сесію" subline="Один момент…" />
      </div>
    );
  }

  if (user && !isAdmin) {
    return (
      <div className={styles.authShell}>
        <div className={styles.authCard}>
          <h1 className={styles.authTitle}>Доступ заборонено</h1>
          <p className={styles.authText}>
            Акаунт <strong>{user.email}</strong> не має прав адміністратора. Зверніться до власника
            сайту або увійдіть під іншим Google-акаунтом.
          </p>
          <button className={styles.btnGhost} onClick={() => signOutUser()}>
            Вийти і спробувати інший акаунт
          </button>
        </div>
      </div>
    );
  }

  async function onSignIn() {
    setError(null);
    setBusy(true);
    try {
      await signIn();
    } catch (e: any) {
      setError(e?.message ?? 'Не вдалося увійти');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={styles.authShell}>
      <div className={styles.authCard}>
        <h1 className={styles.authTitle}>Lovy Moment Admin</h1>
        <p className={styles.authText}>Увійдіть Google-акаунтом, щоб керувати товарами.</p>
        <button className={styles.btnPrimary} onClick={onSignIn} disabled={busy}>
          <GoogleGlyph />
          {busy ? 'Триває вхід…' : 'Увійти через Google'}
        </button>
        {error && <div className={styles.authError}>{error}</div>}
      </div>
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" style={{ marginRight: 10 }}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 24 4a20 20 0 1 0 19.6 16.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7A20 20 0 0 0 24 4 20 20 0 0 0 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3a12 12 0 0 1-19-5.5l-6.5 5A20 20 0 0 0 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.5l6.3 5.3c-.4.4 6.7-4.9 6.7-14.8 0-1.3-.1-2.7-.6-3.5z"/>
    </svg>
  );
}
