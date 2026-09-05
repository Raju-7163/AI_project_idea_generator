import { NextRequest, NextResponse } from 'next/server';
import { ProjectRepository } from '../../../../services/database/project.repository';
import { handleApiError } from '../../../../lib/api/handler';
import { verifyAuthToken } from '../../../../lib/auth/server-auth';

const projectRepo = new ProjectRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const userId = await verifyAuthToken(request);
    const { id } = await params;
    const project = await projectRepo.getProjectById(id, userId);

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}