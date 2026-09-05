'use client';

import { useAuth } from '@/lib/firebase/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Onboarding() {
  const { user, loading, getToken } = useAuth();
  const router = useRouter();
  
  const [formState, setFormState] = useState({
    programmingLanguages: '',
    interests: '',
    difficultyPreference: 'intermediate',
    projectType: 'individual',
    availableDurationWeeks: '4',
    hoursPerWeek: '10'
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      const token = await getToken();

      if (!token) {
        throw new Error('Not authenticated. Please log in again.');
      }
      const payload = {
        userId: user?.uid,
        programmingLanguages: formState.programmingLanguages.split(',').map(s => s.trim()).filter(Boolean),
        frameworks: [],
        databases: [],
        frontendSkills: [],
        backendSkills: [],
        interests: formState.interests.split(',').map(s => s.trim()).filter(Boolean),
        preferredDomains: [],
        difficultyPreference: formState.difficultyPreference,
        projectType: formState.projectType,
        availableDurationWeeks: parseInt(formState.availableDurationWeeks, 10),
        hoursPerWeek: parseInt(formState.hoursPerWeek, 10),
        technologiesToLearn: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        let errorMessage = `Request failed with status ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData?.error?.message || errorMessage;
        } catch {
          // Response body was empty or not JSON
        }
        throw new Error(errorMessage);
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">Student Profile</h1>
        <p className="text-gray-600 mb-8">Tell us about your skills and interests so we can generate the perfect project ideas for you.</p>
        
        {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Programming Languages (comma separated)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Python, JavaScript, Java"
              value={formState.programmingLanguages}
              onChange={e => setFormState({...formState, programmingLanguages: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests & Domains (comma separated)</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Web Development, Machine Learning, Healthcare"
              value={formState.interests}
              onChange={e => setFormState({...formState, interests: e.target.value})}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formState.difficultyPreference}
                onChange={e => setFormState({...formState, difficultyPreference: e.target.value})}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formState.projectType}
                onChange={e => setFormState({...formState, projectType: e.target.value})}
              >
                <option value="individual">Individual</option>
                <option value="team">Team</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Weeks)</label>
              <input 
                type="number" 
                min="1" max="52"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formState.availableDurationWeeks}
                onChange={e => setFormState({...formState, availableDurationWeeks: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week</label>
              <input 
                type="number" 
                min="1" max="100"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={formState.hoursPerWeek}
                onChange={e => setFormState({...formState, hoursPerWeek: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : 'Save Profile & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
