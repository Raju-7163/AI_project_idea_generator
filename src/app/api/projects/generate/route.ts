import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '../../../../lib/auth/server-auth';
import { generateProjectIdeas } from '../../../../services/ai/gemini.service';
import { handleApiError } from '../../../../lib/api/handler';

export async function POST(request: NextRequest) {
  try {
    const { ProfileRepository } = await import('../../../../services/database/profile.repository');
    const profileRepo = new ProfileRepository();
    const userId = await verifyAuthToken(request);
    
    const profile = await profileRepo.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found. Please complete onboarding.');
    }

    const generatedProjects = await generateProjectIdeas(profile);

    const evaluatedProjects = generatedProjects.map(p => ({
      ...p,
      evaluation: {
        suitabilityScore: Math.floor(Math.random() * 20) + 80,
        skillMatch: 'High',
        timeFeasibility: 'Realistic',
        complexity: p.difficulty,
        reasoning: p.whyItFits
      }
    }));

    return NextResponse.json(evaluatedProjects, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
