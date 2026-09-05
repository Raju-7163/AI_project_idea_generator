import { ProjectIdea, ProjectIdeaSchema } from '../../schemas/db.schema';
import { getFirestore } from '../../lib/firebase/admin';
import { ForbiddenError, NotFoundError, ValidationError } from '../../lib/api-errors';

// A mock implementation flag for Phase 2 to allow tests and compilation without a real Firebase instance.
const MOCK_DB: Record<string, ProjectIdea> = {};

export class ProjectRepository {
  private collectionName = 'projects';

  /**
   * Retrieves a project ensuring the requesting user is the owner (IDOR protection).
   */
  async getProjectById(projectId: string, currentUserId: string): Promise<ProjectIdea> {
    if (!projectId || !currentUserId) {
      throw new ValidationError('Project ID and User ID are required.');
    }

    let project: ProjectIdea | undefined;

    try {
      const db = getFirestore();
      const doc = await db.collection(this.collectionName).doc(projectId).get();
      
      if (!doc.exists) {
        throw new NotFoundError('Project');
      }
      
      project = doc.data() as ProjectIdea;
    } catch (e: unknown) {
      // Fallback to mock for Phase 2 testing
      if (e instanceof Error && e.message.includes('credentials missing')) {
        project = MOCK_DB[projectId];
        if (!project) {
          throw new NotFoundError('Project');
        }
      } else {
        throw e;
      }
    }

    // Ownership check (IDOR Protection)
    if (project.userId !== currentUserId) {
      throw new ForbiddenError();
    }

    return project;
  }

  /**
   * Creates a project idea securely.
   */
  async createProject(data: unknown, currentUserId: string): Promise<ProjectIdea> {
    // Validate schema
    const parsedData = ProjectIdeaSchema.parse(data);

    // Prevent mass-assignment: explicitly enforce that the created project belongs to the current user
    if (parsedData.userId !== currentUserId) {
      throw new ForbiddenError('Cannot create a project for another user.');
    }

    try {
      const db = getFirestore();
      await db.collection(this.collectionName).doc(parsedData.id).set(parsedData);
    } catch (e: unknown) {
       // Fallback to mock for Phase 2 testing
       if (e instanceof Error && e.message.includes('credentials missing')) {
         MOCK_DB[parsedData.id] = parsedData;
       } else {
         throw e;
       }
    }

    return parsedData;
  }

  /**
   * Retrieves paginated projects belonging to the user.
   */
  async getProjectsByUser(currentUserId: string, pagination: import('../../lib/pagination').PaginationParams): Promise<import('../../lib/pagination').PaginatedResult<ProjectIdea>> {
    if (!currentUserId) throw new ValidationError('User ID is required.');

    try {
      const db = getFirestore();
      let query = db.collection(this.collectionName)
        .where('userId', '==', currentUserId)
        .orderBy('createdAt', 'desc')
        .limit(pagination.limit);

      if (pagination.cursor) {
        const cursorDoc = await db.collection(this.collectionName).doc(pagination.cursor).get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      }

      const snapshot = await query.get();
      const projects = snapshot.docs.map(doc => doc.data() as ProjectIdea);

      return {
        data: projects,
        nextCursor: snapshot.docs.length === pagination.limit ? snapshot.docs[snapshot.docs.length - 1].id : undefined,
      };
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('credentials missing')) {
        const allProjects = Object.values(MOCK_DB).filter(p => p.userId === currentUserId);
        
        let startIndex = 0;
        if (pagination.cursor) {
          const idx = allProjects.findIndex(p => p.id === pagination.cursor);
          if (idx !== -1) startIndex = idx + 1;
        }
        const data = allProjects.slice(startIndex, startIndex + pagination.limit);
        const nextCursor = data.length === pagination.limit ? data[data.length - 1].id : undefined;

        return { data, nextCursor };
      }
      throw e;
    }
  }
}
