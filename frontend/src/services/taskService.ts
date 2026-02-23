import axios, { AxiosError } from 'axios';
import { Task, TaskRequest, PagedResponse, ApiError, TaskQueryParams } from '../types';

const API_BASE_URL = '/api/v1/tasks';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API Service for task management
 */
export const taskService = {
  /**
   * Get all tasks with pagination and sorting
   */
  getAllTasks: (params: TaskQueryParams = {}): Promise<PagedResponse<Task>> => {
    return apiClient.get<PagedResponse<Task>>('', { params }).then(res => res.data);
  },

  /**
   * Get tasks by completion status
   */
  getTasksByStatus: (
    isCompleted: boolean,
    params: TaskQueryParams = {}
  ): Promise<PagedResponse<Task>> => {
    return apiClient
      .get<PagedResponse<Task>>('/status', {
        params: { isCompleted, ...params },
      })
      .then(res => res.data);
  },

  /**
   * Search tasks by title
   */
  searchTasks: (title: string, params: TaskQueryParams = {}): Promise<PagedResponse<Task>> => {
    return apiClient
      .get<PagedResponse<Task>>('/search', {
        params: { title, ...params },
      })
      .then(res => res.data);
  },

  /**
   * Get tasks by due date range
   */
  getTasksByDateRange: (
    startDate: string,
    endDate: string,
    params: TaskQueryParams = {}
  ): Promise<PagedResponse<Task>> => {
    return apiClient
      .get<PagedResponse<Task>>('/due-date-range', {
        params: { startDate, endDate, ...params },
      })
      .then(res => res.data);
  },

  /**
   * Get a single task by ID
   */
  getTaskById: (id: number): Promise<Task> => {
    return apiClient.get<Task>(`/${id}`).then(res => res.data);
  },

  /**
   * Create a new task
   */
  createTask: (task: TaskRequest): Promise<Task> => {
    return apiClient.post<Task>('', task).then(res => res.data);
  },

  /**
   * Update an existing task
   */
  updateTask: (id: number, task: TaskRequest): Promise<Task> => {
    return apiClient.put<Task>(`/${id}`, task).then(res => res.data);
  },

  /**
   * Toggle task completion status
   */
  toggleTaskStatus: (id: number): Promise<Task> => {
    return apiClient.patch<Task>(`/${id}/toggle-status`).then(res => res.data);
  },

  /**
   * Delete a task
   */
  deleteTask: (id: number): Promise<void> => {
    return apiClient.delete(`/${id}`).then(() => undefined);
  },
};

/**
 * Error handler utility
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    return apiError?.message || error.message || 'An error occurred';
  }
  return 'An unexpected error occurred';
};
