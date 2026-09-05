import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore as getFs } from 'firebase-admin/firestore';

export function getFirebaseAdmin() {
  if (getApps().length > 0) {
    return getApp();
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase Admin SDK is not fully configured because environment variables are missing.');
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
