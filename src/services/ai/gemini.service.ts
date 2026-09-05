import { GoogleGenerativeAI } from '@google/generative-ai';
import { StudentProfile } from '../../schemas/db.schema';
import { z } from 'zod';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenerativeAI(apiKey);
const model = ai.getGenerativeModel({ 
  model: 'gemini-1.5-flash', 
  generationConfig: { responseMimeType: 'application/json' } 
});

const GeneratedProjectSchema = z.object({
  title: z.string(),
  problem: z.string(),
  targetUsers: z.string(),
  solution: z.string(),
  whyItFits: z.string(),
  coreFeatures: z.array(z.string()),
  advancedFeatures: z.array(z.string()),
  techStack: z.array(z.string()),
  difficulty: z.string(),
  estimatedTime: z.string(),
  requiredSkills: z.array(z.string()),
  skillsToLearn: z.array(z.string()),
  challenges: z.string(),
  realWorldUsefulness: z.string(),
  scalability: z.string(),
  futureScope: z.string(),
});

export const GeneratedProjectsArraySchema = z.array(GeneratedProjectSchema);

export async function generateProjectIdeas(profile: StudentProfile) {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing');
  }

  const prompt = `You are an expert AI mentor helping a final-year software engineering student find a practical, high-quality project. 
  Student Profile: 
  Skills: ${profile.programmingLanguages?.join(', ')} 
  Interests: ${profile.interests?.join(', ')} 
  Time available: ${profile.hoursPerWeek} hours/week for ${profile.availableDurationWeeks} weeks 
  Difficulty preference: ${profile.difficultyPreference}
  Type: ${profile.projectType}
  
  Generate exactly 3 project ideas tailored to this profile.
  Respond ONLY with a valid JSON array of 3 objects matching this exact structure:
  [
    {
      "title": "string",
      "problem": "string",
      "targetUsers": "string",
      "solution": "string",
      "whyItFits": "string",
      "coreFeatures": ["string"],
      "advancedFeatures": ["string"],
      "techStack": ["string"],
      "difficulty": "string",
      "estimatedTime": "string",
      "requiredSkills": ["string"],
      "skillsToLearn": ["string"],
      "challenges": "string",
      "realWorldUsefulness": "string",
      "scalability": "string",
      "futureScope": "string"
    }
  ]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsedJson = JSON.parse(text);
    return GeneratedProjectsArraySchema.parse(parsedJson);
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw new Error('Failed to generate valid project ideas.');
  }
}
