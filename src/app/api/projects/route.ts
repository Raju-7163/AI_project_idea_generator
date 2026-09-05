import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '../../../lib/api/handler';
import { verifyAuthToken } from '../../../lib/auth/server-auth';
import { validatePagination } from '../../../lib/pagination';

export async function GET(request: NextRequest) {
  try {
    const { ProjectRepository } = await import('../../../services/database/project.repository');
    const projectRepo = new ProjectRepository();
    const currentUserId = await verifyAuthToken(request);
    
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const cursor = searchParams.get('cursor');
    const pagination = validatePagination(limit, cursor);

    const result = await projectRepo.getProjectsByUser(currentUserId, pagination);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { ProjectRepository } = await import('../../../services/database/project.repository');
    const projectRepo = new ProjectRepository();
    const currentUserId = await verifyAuthToken(request);
    const body = await request.json();

    const createdProject = await projectRepo.createProject(body, currentUserId);
    return NextResponse.json(createdProject, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
