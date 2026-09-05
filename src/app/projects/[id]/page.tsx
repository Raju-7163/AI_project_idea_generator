'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/firebase/AuthContext';
import type { ProjectIdea } from '@/schemas/db.schema';

export default function ProjectPage() {
  const { getToken, loading, user } = useAuth();
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<ProjectIdea | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (!user || !params.id) return;

    const loadProject = async () => {
      try {
        const token = await getToken();
        const response = await fetch(`/api/projects/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Unable to load this project.');
        setProject(await response.json() as ProjectIdea);
      } catch (loadError: unknown) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load this project.');
      }
    };

    void loadProject();
  }, [getToken, loading, params.id, router, user]);

  if (loading || !user) return <main className="p-8">Loading...</main>;
  if (error) return <main className="mx-auto max-w-3xl p-8 text-red-600">{error}</main>;
  if (!project) return <main className="p-8">Loading project...</main>;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="text-sm font-medium text-blue-600 hover:text-blue-800">Back to dashboard</Link>
        <article className="mt-6 rounded-xl border border-gray-100 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Project brief</p>
          <h1 className="mt-2 text-4xl font-bold">{project.title}</h1>
          <p className="mt-6 text-lg leading-8 text-gray-700">{project.description}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <section><h2 className="font-bold">The problem</h2><p className="mt-2 text-gray-600">{project.problem}</p></section>
            <section><h2 className="font-bold">Who it helps</h2><p className="mt-2 text-gray-600">{project.targetUsers}</p></section>
            <section><h2 className="font-bold">Core features</h2><ul className="mt-2 list-disc space-y-1 pl-5 text-gray-600">{project.coreFeatures.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
            <section><h2 className="font-bold">Technology</h2><p className="mt-2 text-gray-600">{Object.values(project.technologyStack).flat().join(', ')}</p></section>
          </div>
        </article>
      </div>
    </main>
  );
}