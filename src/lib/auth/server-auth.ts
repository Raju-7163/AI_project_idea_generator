import { getFirebaseAdmin } from '../firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import { UnauthorizedError } from '../api-errors';
import { NextRequest } from 'next/server';

/**
 * Extracts and verifies the Firebase ID token from the request headers.
 * Throws UnauthorizedError if invalid.
 * Returns the decoded UID representing the authenticated user.
 */
export async function verifyAuthToken(request: NextRequest): Promise<string> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Missing or invalid Authorization header');
  }

  const token = authHeader.split('Bearer ')[1];
  
  try {
    const app = getFirebaseAdmin();
    const decodedToken = await getAuth(app).verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
}
