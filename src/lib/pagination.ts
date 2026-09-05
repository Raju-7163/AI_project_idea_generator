export interface PaginationParams {
  limit: number;
  cursor?: string; // ID of the last document for Firestore cursor pagination
}

export interface PaginatedResult<T> {
  data: T[];
  nextCursor?: string;
  total?: number; // Optional, as it might require an extra count query
}

export const DEFAULT_PAGE_LIMIT = 10;
export const MAX_PAGE_LIMIT = 50;

export function validatePagination(limitStr?: string | null, cursor?: string | null): PaginationParams {
  let limit = limitStr ? parseInt(limitStr, 10) : DEFAULT_PAGE_LIMIT;
  
  if (isNaN(limit) || limit <= 0) {
    limit = DEFAULT_PAGE_LIMIT;
  }
  
  if (limit > MAX_PAGE_LIMIT) {
    limit = MAX_PAGE_LIMIT; // Cap at reasonable max to avoid abuse
  }

  return {
    limit,
    cursor: cursor || undefined,
  };
}
