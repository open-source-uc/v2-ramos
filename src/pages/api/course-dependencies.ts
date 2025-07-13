import type { APIRoute } from 'astro';
import { getAllCourseDependencies } from '@/lib/server/courseDependencies';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const courseSigle = url.searchParams.get('sigle');
    
    if (!courseSigle) {
      return new Response(JSON.stringify({ error: 'Course sigle is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const dependencies = await getAllCourseDependencies(courseSigle);
    
    return new Response(JSON.stringify({ dependencies }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching course dependencies:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch dependencies' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};