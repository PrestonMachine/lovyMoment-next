'use client';

/**
 * Client-side Firebase services for the admin area: Auth (Google sign-in),
 * Storage (image uploads) and Realtime Database (CRUD for products).
 *
 * The public site keeps using `lib/firebase.ts` (server-side, read-only)
 * for SSR/ISR fetches. This file is only imported from `'use client'`
 * components under `/admin`.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

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

function app(): FirebaseApp {
  if (_app) return _app;
  _app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return _app;
}

export function clientAuth(): Auth {
  return getAuth(app());
}

export function clientDb(): Database {
  return getDatabase(app());
}

export function clientStorage(): FirebaseStorage {
  return getStorage(app());
}

/**
 * Firestore is used for the admin whitelist (`/admins/<emailKey>`). Keeping
 * the access list in a separate database from the public products keeps the
 * RTDB tree visually clean and lets us write tighter security rules — only
 * admins can read this collection at all, anonymous visitors get nothing.
 */
export function clientFirestore(): Firestore {
  return getFirestore(app());
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
