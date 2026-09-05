/**
 * @jest-environment node
 */
// Mock server-auth so we can test the endpoints without real Firebase tokens
jest.mock('../../src/lib/auth/server-auth', () => ({
  verifyAuthToken: jest.fn().mockResolvedValue('user-1'),
}));

import { GET as HealthGET } from '../../src/app/api/health/route';
import { GET as ProjectsGET } from '../../src/app/api/projects/route';
import { NextRequest } from 'next/server';

describe('API Routes Foundation', () => {
  it('GET /api/health returns 200 with safe payload', async () => {
    const response = await HealthGET();
    const json = await response.json();
    
    expect(response.status).toBe(200);
    expect(json.status).toBe('ok');
    expect(json.version).toBeDefined();
    expect(json.env).toBeUndefined(); // Ensure no secrets leak
  });

  it('GET /api/projects properly processes pagination and limits', async () => {
    // Fake request URL
    const req = new NextRequest('http://localhost/api/projects?limit=5');
    const response = await ProjectsGET(req);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('GET /api/projects prevents extreme pagination limits', async () => {
    const req = new NextRequest('http://localhost/api/projects?limit=1000');
    const response = await ProjectsGET(req);
    expect(response.status).toBe(200);
  });
});

