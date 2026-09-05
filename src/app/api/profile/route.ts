import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '../../../lib/api/handler';
import { verifyAuthToken } from '../../../lib/auth/server-auth';

export async function GET(request: NextRequest) {
  try {
    const { ProfileRepository } = await import('../../../services/database/profile.repository');
    const profileRepo = new ProfileRepository();
    const currentUserId = await verifyAuthToken(request);
    const profile = await profileRepo.getProfile(currentUserId);
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { ProfileRepository } = await import('../../../services/database/profile.repository');
    const profileRepo = new ProfileRepository();

    const currentUserId = await verifyAuthToken(request);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Request body is not valid JSON.' } },
        { status: 400 }
      );
    }

    const updatedProfile = await profileRepo.upsertProfile(body, currentUserId);
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
