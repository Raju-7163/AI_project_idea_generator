'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';

type GeneratedProject = {
  title: string;
  problem: string;
  solution: string;
  targetUsers: string;
  whyItFits: string;
  coreFeatures: string[];
  advancedFeatures: string[];
  techStack: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  requiredSkills: string[];
  skillsToLearn: string[];
  challenges: string;
  realWorldUsefulness: string;
  scalability: string;
  futureScope: string;
  evaluation: {
    suitabilityScore: number;
    skillMatch: string;
  };
};

export default function GenerateProjects() {
  const { user, getToken } = useAuth();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState<GeneratedProject[]>([]);
  const [saving, setSaving] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getToken();
      const res = await fetch('/api/projects/generate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Failed to generate projects');
      const data: GeneratedProject[] = await res.json();
      setProjects(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error generating projects');
    } finally {
      setLoading(false);
    }
  };

  const selectProject = async (project: GeneratedProject, index: number) => {
    setSaving(index);
    try {
      const token = await getToken();
      
      const payload = {
        id: crypto.randomUUID(),
        userId: user?.uid,
        title: project.title,
        description: project.solution,
        problem: project.problem,
        targetUsers: project.targetUsers,
        whyItFits: project.whyItFits,
        usefulness: project.realWorldUsefulness,
        difficulty: project.difficulty,
        estimatedDurationWeeks: 4,
        requiredSkills: project.requiredSkills,
        learningSkills: project.skillsToLearn,
        coreFeatures: project.coreFeatures,
        advancedFeatures: project.advancedFeatures,
        technologyStack: {
          frontend: project.techStack,
          backend: [],
          database: [],
          infrastructure: [],
        },
        challenges: [project.challenges],
        securityConsiderations: [],
        accessibilityConsiderations: [],
        scalabilityConsiderations: [project.scalability],
        futureScope: [project.futureScope],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to save project');
      const saved = await res.json();
      router.push(`/projects/${saved.id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Error');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">AI Project Generator</h1>
        
        {projects.length === 0 && (
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-gray-600 mb-6">We will analyze your profile and generate 3 highly tailored project ideas.</p>
            <button 
              onClick={handleGenerate}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Analyzing profile and generating ideas...' : 'Generate Project Ideas'}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        )}

        {projects.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Recommended Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{p.title}</h3>
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                    Suitability: {p.evaluation.suitabilityScore}%
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4"><strong>Problem:</strong> {p.problem}</p>
                <p className="text-gray-700 mb-4"><strong>Solution:</strong> {p.solution}</p>
                
                <div className="mb-4">
                  <strong>Tech Stack:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.techStack.map((t: string) => (
                      <span key={t} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-lg mb-6">
                  <div><strong>Difficulty:</strong> {p.difficulty}</div>
                  <div><strong>Time:</strong> {p.estimatedTime}</div>
                  <div><strong>Skill Match:</strong> {p.evaluation.skillMatch}</div>
                  <div><strong>Target:</strong> {p.targetUsers}</div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => selectProject(p, i)}
                    disabled={saving !== null}
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {saving === i ? 'Saving...' : 'Select & Build This Project'}
                  </button>
                </div>
              </div>
            ))}
            <div className="text-center pt-8">
              <button onClick={handleGenerate} disabled={loading} className="text-gray-500 hover:text-gray-900 underline">
                Regenerate Ideas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
