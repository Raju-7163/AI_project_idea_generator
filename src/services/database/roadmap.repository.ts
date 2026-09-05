import { RoadmapTask, RoadmapTaskSchema } from '../../schemas/db.schema';
import { getFirestore } from '../../lib/firebase/admin';
import { ValidationError } from '../../lib/api-errors';
import { PaginationParams, PaginatedResult } from '../../lib/pagination';
import { ProjectRepository } from './project.repository';

const MOCK_DB: Record<string, RoadmapTask> = {};

export class RoadmapRepository {
  private collectionName = 'roadmapTasks';
  private projectRepo = new ProjectRepository();

  /**
   * Validates if the user has access to the roadmap by checking project ownership.
   */
  private async ensureOwnership(projectId: string, currentUserId: string): Promise<void> {
    // getProjectById automatically enforces IDOR protection by checking owner
    await this.projectRepo.getProjectById(projectId, currentUserId);
  }

  async createTask(data: unknown, projectId: string, currentUserId: string): Promise<RoadmapTask> {
    // 1. Authorize user has access to this project
    await this.ensureOwnership(projectId, currentUserId);

    // 2. Validate data
    const parsedData = RoadmapTaskSchema.parse(data);

    // 3. Enforce roadmapId to match the projectId
    if (parsedData.roadmapId !== projectId) {
      throw new ValidationError('Task roadmapId must match the target project ID.');
    }

    try {
      const db = getFirestore();
      await db.collection(this.collectionName).doc(parsedData.id).set(parsedData);
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('credentials missing')) {
        MOCK_DB[parsedData.id] = parsedData;
      } else {
        throw e;
      }
    }

    return parsedData;
  }

  async getTasksForProject(projectId: string, currentUserId: string, pagination: PaginationParams): Promise<PaginatedResult<RoadmapTask>> {
    // Authorize
    await this.ensureOwnership(projectId, currentUserId);

    try {
      const db = getFirestore();
      let query = db.collection(this.collectionName)
        .where('roadmapId', '==', projectId)
        .orderBy('order', 'asc')
        .limit(pagination.limit);

      if (pagination.cursor) {
        const cursorDoc = await db.collection(this.collectionName).doc(pagination.cursor).get();
        if (cursorDoc.exists) {
          query = query.startAfter(cursorDoc);
        }
      }

      const snapshot = await query.get();
      const tasks = snapshot.docs.map(doc => doc.data() as RoadmapTask);

      return {
        data: tasks,
        nextCursor: snapshot.docs.length === pagination.limit ? snapshot.docs[snapshot.docs.length - 1].id : undefined,
      };
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('credentials missing')) {
        // Mock fallback
        const allTasks = Object.values(MOCK_DB).filter(t => t.roadmapId === projectId).sort((a, b) => a.order - b.order);
        let startIndex = 0;
        if (pagination.cursor) {
          const idx = allTasks.findIndex(t => t.id === pagination.cursor);
          if (idx !== -1) startIndex = idx + 1;
        }
        const data = allTasks.slice(startIndex, startIndex + pagination.limit);
        const nextCursor = data.length === pagination.limit ? data[data.length - 1].id : undefined;

        return { data, nextCursor };
      }
      throw e;
    }
  }
}
