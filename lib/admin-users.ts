'use client';

/**
 * Admin whitelist + per-user permissions stored in **Firestore** at
 *
 *   /admins/<emailKey>
 *     { canEdit, canDelete, canUpload, canManageAdmins }
 *
 * Putting the access list in Firestore (rather than the same RTDB tree as
 * the product cards) keeps the two domains visually and operationally
 * separate. Firestore's own security rules govern access — anonymous
 * visitors can't read this collection, only signed-in admins.
 *
 * Backwards compatibility: if a legacy entry stored `true` instead of an
 * object, `parsePermissions()` (in admin-config) treats it as full
 * permissions. New writes always use the object form.
 */
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc
} from 'firebase/firestore';

import { clientFirestore } from './firebase-client';
import {
  DEFAULT_PERMISSIONS,
  emailToKey,
  keyToEmail,
  parsePermissions,
  type AdminPermissions
} from './admin-config';

const COLLECTION = 'admins';

export interface StoredAdmin {
  email: string;
  permissions: AdminPermissions;
}

function adminDoc(email: string) {
  return doc(clientFirestore(), COLLECTION, emailToKey(email));
}

/** Quick "does an entry exist?" check used during sign-in. */
export async function isStoredAdmin(email: string): Promise<boolean> {
  if (!email) return false;
  try {
    const snap = await getDoc(adminDoc(email));
    return snap.exists();
  } catch {
    return false;
  }
}

/** Resolve a single admin's permissions (or null if not in the list). */
export async function getStoredAdminPermissions(
  email: string
): Promise<AdminPermissions | null> {
  if (!email) return null;
  try {
    const snap = await getDoc(adminDoc(email));
    if (!snap.exists()) return null;
    return parsePermissions(snap.data());
  } catch {
    return null;
  }
}

/** List every admin entry along with parsed permissions. */
export async function fetchStoredAdmins(): Promise<StoredAdmin[]> {
  const snap = await getDocs(collection(clientFirestore(), COLLECTION));
  const out: StoredAdmin[] = [];
  snap.forEach((d) => {
    out.push({
      email: keyToEmail(d.id),
      permissions: parsePermissions(d.data())
    });
  });
  return out.sort((a, b) => a.email.localeCompare(b.email));
}

/** Legacy helper — kept for the dashboard's stat counter. */
export async function fetchStoredAdminEmails(): Promise<string[]> {
  const list = await fetchStoredAdmins();
  return list.map((a) => a.email);
}

/** Add a new admin with the supplied permission set (defaults if omitted). */
export async function addStoredAdmin(
  email: string,
  permissions: AdminPermissions = DEFAULT_PERMISSIONS
): Promise<void> {
  const clean = email.trim().toLowerCase();
  if (!clean.includes('@')) throw new Error('Введіть коректну email-адресу');
  await setDoc(adminDoc(clean), { ...permissions });
}

/** Replace an existing admin's permission set. */
export async function updateStoredAdminPermissions(
  email: string,
  permissions: AdminPermissions
): Promise<void> {
  await setDoc(adminDoc(email), { ...permissions });
}

export async function removeStoredAdmin(email: string): Promise<void> {
  await deleteDoc(adminDoc(email));
}
