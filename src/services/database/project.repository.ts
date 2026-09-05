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
    } catch (e: any) {
      // Fallback to mock for Phase 2 testing
      if (e.message.includes('credentials missing')) {
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
    } catch (e: any) {
       // Fallback to mock for Phase 2 testing
       if (e.message.includes('credentials missing')) {
         MOCK_DB[parsedData.id] = parsedData;
       } else {
         throw e;
       }
    }

    return parsedData;
  }
}
