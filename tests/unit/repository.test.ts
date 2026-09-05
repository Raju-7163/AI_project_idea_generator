import { ProjectRepository } from '../../src/services/database/project.repository';
import { ForbiddenError, NotFoundError } from '../../src/lib/api-errors';
import { ZodError } from 'zod';

describe('ProjectRepository (Security & Validation)', () => {
  let repository: ProjectRepository;

  beforeEach(() => {
    repository = new ProjectRepository();
  });

  const validProjectData = {
    id: 'proj-1',
    userId: 'user-1',
    title: 'Valid Project',
    description: 'A valid description of at least 10 chars.',
    problem: 'A valid problem statement of at least 10 chars.',
    targetUsers: 'Students',
    whyItFits: 'It is a good fit because...',
    usefulness: 'It helps students build good projects.',
    difficulty: 'intermediate',
    estimatedDurationWeeks: 4,
    requiredSkills: ['React'],
    learningSkills: ['Next.js'],
    coreFeatures: ['Login'],
    advancedFeatures: ['AI'],
    technologyStack: { frontend: [], backend: [], database: [], infrastructure: [] },
    challenges: ['Time'],
    securityConsiderations: ['Auth'],
    accessibilityConsiderations: ['ARIA'],
    scalabilityConsiderations: ['CDN'],
    futureScope: ['Mobile App'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it('prevents IDOR: user cannot access another user\'s project', async () => {
    // Setup: create a project owned by user-1
    await repository.createProject(validProjectData, 'user-1');

    // Act & Assert: user-2 attempts to access user-1's project
    await expect(repository.getProjectById('proj-1', 'user-2'))
      .rejects
      .toThrow(ForbiddenError);
  });

  it('allows owner to access their project', async () => {
    await repository.createProject(validProjectData, 'user-1');
    const project = await repository.getProjectById('proj-1', 'user-1');
    expect(project.id).toBe('proj-1');
    expect(project.userId).toBe('user-1');
  });

  it('prevents mass-assignment: creating project for another user', async () => {
    const maliciousData = {
      ...validProjectData,
      id: 'proj-malicious',
      userId: 'target-user', // Trying to create as target-user
    };

    // Act & Assert: current user is 'attacker-user'
    await expect(repository.createProject(maliciousData, 'attacker-user'))
      .rejects
      .toThrow(ForbiddenError);
  });

  it('validates incomplete data rejecting it immediately', async () => {
    const incompleteData = { id: 'invalid-proj' }; // Missing required fields

    await expect(repository.createProject(incompleteData, 'user-1'))
      .rejects
      .toThrow(ZodError); // Thrown by the schema parser
  });

  it('throws NotFoundError for non-existent projects', async () => {
    await expect(repository.getProjectById('does-not-exist', 'user-1'))
      .rejects
      .toThrow(NotFoundError);
  });
});
