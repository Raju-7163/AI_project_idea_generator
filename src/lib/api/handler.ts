import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { ApiError } from '../api-errors';

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.issues
      }
    }, { status: 400 });
  }

  if (error instanceof ApiError) {
    return NextResponse.json({
      error: {
        code: error.constructor.name.replace('Error', '').toUpperCase() + '_ERROR',
        message: error.message,
      }
    }, { status: error.statusCode });
  }

  // Generic fallback for unhandled exceptions (Do NOT expose stack traces)
  console.error('Unhandled API Error:', error);
  return NextResponse.json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.'
    }
  }, { status: 500 });
}

// A mock auth resolver for Phase 2. To be replaced in Phase 3.
export function getAuthenticatedUserId(): string {
  return 'user-1'; 
}
