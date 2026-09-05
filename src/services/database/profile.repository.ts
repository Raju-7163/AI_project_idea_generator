import { StudentProfile, StudentProfileSchema } from '../../schemas/db.schema';
import { getFirestore } from '../../lib/firebase/admin';
import { ForbiddenError, NotFoundError, ValidationError } from '../../lib/api-errors';

const MOCK_DB: Record<string, StudentProfile> = {};

export class ProfileRepository {
  private collectionName = 'studentProfiles';

  async getProfile(userId: string): Promise<StudentProfile> {
    if (!userId) {
      throw new ValidationError('User ID is required.');
    }

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(userId).get();
      
      if (!doc.exists) {
        throw new NotFoundError('Profile');
      }
      
      return doc.data() as StudentProfile;
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('credentials missing')) {
        const profile = MOCK_DB[userId];
        if (!profile) {
          throw new NotFoundError('Profile');
        }
        return profile;
      }
      throw e;
    }
  }

  async upsertProfile(data: unknown, currentUserId: string): Promise<StudentProfile> {
    const parsedData = StudentProfileSchema.parse(data);

    // IDOR & Mass-assignment protection: Ensure they only update their own profile
    if (parsedData.userId !== currentUserId) {
      throw new ForbiddenError('Cannot modify a profile for another user.');
    }

    try {
      const db = getFirestore();
      await db.collection(this.collectionName).doc(currentUserId).set(parsedData, { merge: true });
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('credentials missing')) {
        MOCK_DB[currentUserId] = parsedData;
      } else {
        throw e;
      }
    }

    return parsedData;
  }
}
