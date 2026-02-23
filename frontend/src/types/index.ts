/**
 * Task type definition
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
}

/**
 * Task request payload
 */
export interface TaskRequest {
  title: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: string;
  assignedTo?: string;
}

/**
 * Paginated response type
 */
export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * API error response
 */
export interface ApiError {
  timestamp: string;
  status: number;
  message: string;
  errors?: Record<string, string>;
  details?: string;
}

/**
 * Query parameters for task list
 */
export interface TaskQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  isCompleted?: boolean;
  title?: string;
  startDate?: string;
  endDate?: string;
}

