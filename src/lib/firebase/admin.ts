import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore as getFs } from 'firebase-admin/firestore';

export function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // Handle both escaped \n (from .env files) and literal newlines (from Vercel UI)
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  const privateKey = rawKey?.includes('\\n') ? rawKey.replace(/\\n/g, '\n') : rawKey;

  if (!projectId || !clientEmail || !privateKey) {
    const missing = [!projectId && 'FIREBASE_PROJECT_ID', !clientEmail && 'FIREBASE_CLIENT_EMAIL', !privateKey && 'FIREBASE_ADMIN_PRIVATE_KEY'].filter(Boolean);
    console.warn(`Firebase Admin SDK missing env vars: ${missing.join(', ')}`);
    throw new Error('Firebase Admin credentials missing from environment variables.');
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

export function getFirestore() {
  getFirebaseAdmin();
  return getFs();
}
