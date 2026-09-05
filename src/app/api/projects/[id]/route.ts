import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '../../../../lib/api/handler';
import { verifyAuthToken } from '../../../../lib/auth/server-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { ProjectRepository } = await import('../../../../services/database/project.repository');
    const projectRepo = new ProjectRepository();
    const userId = await verifyAuthToken(request);
    const { id } = await params;
    const project = await projectRepo.getProjectById(id, userId);

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}
