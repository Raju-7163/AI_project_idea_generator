import { NextRequest, NextResponse } from 'next/server';
import { ProfileRepository } from '../../../services/database/profile.repository';
import { handleApiError } from '../../../lib/api/handler';
import { verifyAuthToken } from '../../../lib/auth/server-auth';

const profileRepo = new ProfileRepository();

export async function GET(request: NextRequest) {
  try {
    const currentUserId = await verifyAuthToken(request);
    const profile = await profileRepo.getProfile(currentUserId);
    
    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUserId = await verifyAuthToken(request);
    const body = await request.json();

    const updatedProfile = await profileRepo.upsertProfile(body, currentUserId);

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
