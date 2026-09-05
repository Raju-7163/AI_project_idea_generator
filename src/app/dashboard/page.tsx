'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import type { ProjectIdea } from '@/schemas/db.schema';

export default function Dashboard() {
  const { user, loading, logout, getToken } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectIdea[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      const token = await getToken();
      const response = await fetch('/api/projects', { headers: { Authorization: `Bearer ${token}` } });
      if (response.ok) {
        const result = await response.json() as { data: ProjectIdea[] };
        setProjects(result.data);
      }
    };

    void loadProjects();
  }, [getToken, user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="px-6 py-4 flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">AI Project Mentor</span>
        </div>
        <nav>
          <ul className="flex items-center gap-6 text-sm font-medium">
            <li>
              <Link href="/onboarding" className="hover:text-blue-600 transition-colors">
                Profile
              </Link>
            </li>
            <li>
              <button onClick={logout} className="text-gray-500 hover:text-gray-800 transition-colors">
                Sign Out
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-gray-600">Ready to build something amazing?</p>
          </div>
          <Link 
            href="/onboarding" 
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            Generate Project Ideas
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Saved Projects</h2>
            {projects.length === 0 ? <div className="text-gray-500 text-sm py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">No projects saved yet.</div> : <div className="space-y-3">{projects.map((project) => <Link key={project.id} href={`/projects/${project.id}`} className="block rounded-lg border border-gray-200 p-4 hover:border-blue-400"><span className="font-semibold">{project.title}</span><span className="mt-1 block text-sm text-gray-500">{project.difficulty} · {project.estimatedDurationWeeks} weeks</span></Link>)}</div>}
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Current Roadmap</h2>
            <div className="text-gray-500 text-sm py-8 text-center border-2 border-dashed border-gray-200 rounded-lg">
              Select a saved project to start its roadmap.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
