import { z } from 'zod';

export const TimestampSchema = z.union([
  z.date(),
  z.string().datetime(), // For serialized transport
]);

export const UserSchema = z.object({
  id: z.string().min(1),
  email: z.string().email(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const StudentProfileSchema = z.object({
  userId: z.string().min(1),
  programmingLanguages: z.array(z.string()),
  frameworks: z.array(z.string()),
  databases: z.array(z.string()),
  frontendSkills: z.array(z.string()),
  backendSkills: z.array(z.string()),
  aiMlSkills: z.array(z.string()).optional().default([]),
  cloudSkills: z.array(z.string()).optional().default([]),
  interests: z.array(z.string()),
  preferredDomains: z.array(z.string()),
  difficultyPreference: z.enum(['beginner', 'intermediate', 'advanced']),
  projectType: z.enum(['individual', 'team']),
  availableDurationWeeks: z.number().min(1).max(52),
  hoursPerWeek: z.number().min(1).max(100),
  technologiesToLearn: z.array(z.string()),
  previousProjectExperience: z.string().optional(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const ProjectIdeaSchema = z.object({
  id: z.string().min(1),
  userId: z.string().min(1),
  title: z.string().min(3).max(150),
  description: z.string().min(10),
  problem: z.string().min(10),
  targetUsers: z.string().min(3),
  whyItFits: z.string().min(10),
  usefulness: z.string().min(10),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedDurationWeeks: z.number().min(1),
  requiredSkills: z.array(z.string()),
  learningSkills: z.array(z.string()),
  coreFeatures: z.array(z.string()),
  advancedFeatures: z.array(z.string()),
  technologyStack: z.object({
    frontend: z.array(z.string()),
    backend: z.array(z.string()),
    database: z.array(z.string()),
    infrastructure: z.array(z.string()),
  }),
  challenges: z.array(z.string()),
  securityConsiderations: z.array(z.string()),
  accessibilityConsiderations: z.array(z.string()),
  scalabilityConsiderations: z.array(z.string()),
  futureScope: z.array(z.string()),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

export const RoadmapTaskSchema = z.object({
  id: z.string().min(1),
  roadmapId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  phase: z.string().min(1),
  status: z.enum(['pending', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dependencies: z.array(z.string()).optional().default([]),
  estimatedEffortHours: z.number().min(0),
  order: z.number().int(),
  createdAt: TimestampSchema,
  updatedAt: TimestampSchema,
});

// Infer types
export type User = z.infer<typeof UserSchema>;
export type StudentProfile = z.infer<typeof StudentProfileSchema>;
export type ProjectIdea = z.infer<typeof ProjectIdeaSchema>;
export type RoadmapTask = z.infer<typeof RoadmapTaskSchema>;
