import { NextResponse } from 'next/server';

export async function GET() {
  // Check which env vars are present (never expose values)
  const envCheck = {
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY: !!process.env.FIREBASE_ADMIN_PRIVATE_KEY,
    FIREBASE_ADMIN_PRIVATE_KEY_LENGTH: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.length ?? 0,
    FIREBASE_ADMIN_PRIVATE_KEY_HAS_HEADER: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY') ?? false,
    FIREBASE_ADMIN_PRIVATE_KEY_HAS_REAL_NEWLINES: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('\n') ?? false,
    FIREBASE_ADMIN_PRIVATE_KEY_HAS_ESCAPED_NEWLINES: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.includes('\\n') ?? false,
    GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };

  // Try initializing Firebase Admin
  let firebaseStatus: string;
  try {
    const { getFirebaseAdmin } = await import('../../../lib/firebase/admin');
    getFirebaseAdmin();
    firebaseStatus = 'ok';
  } catch (e: unknown) {
    firebaseStatus = e instanceof Error ? e.message : 'unknown error';
  }

  return NextResponse.json(
    { status: 'ok', service: 'ai-project-mentor-api', version: '0.1.0', envCheck, firebaseStatus },
    { status: 200 }
  );
}
