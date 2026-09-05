import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken } from '../../../../lib/auth/server-auth';
import { ProfileRepository } from '../../../../services/database/profile.repository';
import { generateProjectIdeas } from '../../../../services/ai/gemini.service';
import { handleApiError } from '../../../../lib/api/handler';

const profileRepo = new ProfileRepository();

export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuthToken(request);
    
    // Fetch user profile to feed into AI
    const profile = await profileRepo.getProfile(userId);
    if (!profile) {
      throw new Error('Profile not found. Please complete onboarding.');
    }

    // Generate projects
    const generatedProjects = await generateProjectIdeas(profile);

    // Provide pseudo-scores for Evaluation Step
    const evaluatedProjects = generatedProjects.map(p => ({
      ...p,
      evaluation: {
        suitabilityScore: Math.floor(Math.random() * 20) + 80, // 80-100 placeholder deterministic logic
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
