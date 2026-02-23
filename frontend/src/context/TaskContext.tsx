import React, { createContext, useContext, useState, useCallback } from 'react';
import { Task, PagedResponse, TaskQueryParams } from '../types';
import { taskService, handleApiError } from '../services/taskService';

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  pageInfo: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  fetchTasks: (params?: TaskQueryParams) => Promise<void>;
  fetchTasksByStatus: (isCompleted: boolean, params?: TaskQueryParams) => Promise<void>;
  searchTasks: (title: string, params?: TaskQueryParams) => Promise<void>;
  createTask: (task: any) => Promise<void>;
  updateTask: (id: number, task: any) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  toggleTaskStatus: (id: number) => Promise<void>;
  clearError: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageInfo, setPageInfo] = useState({
    currentPage: 0,
    totalPages: 0,
    pageSize: 10,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  const clearError = useCallback(() => setError(null), []);

  const handlePagedResponse = (response: PagedResponse<Task>) => {
    setTasks(response.content);
    setPageInfo({
      currentPage: response.currentPage,
      totalPages: response.totalPages,
      pageSize: response.pageSize,
      totalElements: response.totalElements,
      hasNext: response.hasNext,
      hasPrevious: response.hasPrevious,
    });
  };

  const fetchTasks = useCallback(async (params: TaskQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.getAllTasks({
        page: 0,
        size: 10,
        sortBy: 'id',
        sortDirection: 'ASC',
        ...params,
      });
      handlePagedResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTasksByStatus = useCallback(
    async (isCompleted: boolean, params: TaskQueryParams = {}) => {
      setLoading(true);
      setError(null);
      try {
        const response = await taskService.getTasksByStatus(isCompleted, {
          page: 0,
          size: 10,
          sortBy: 'id',
          sortDirection: 'ASC',
          ...params,
        });
        handlePagedResponse(response);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const searchTasks = useCallback(async (title: string, params: TaskQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskService.searchTasks(title, {
        page: 0,
        size: 10,
        sortBy: 'id',
        sortDirection: 'ASC',
        ...params,
      });
      handlePagedResponse(response);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (task: any) => {
    setError(null);
    try {
      await taskService.createTask(task);
      await fetchTasks();
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  }, [fetchTasks]);

  const updateTask = useCallback(
    async (id: number, task: any) => {
      setError(null);
      try {
        await taskService.updateTask(id, task);
        await fetchTasks();
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw err;
      }
    },
    [fetchTasks]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await taskService.deleteTask(id);
        await fetchTasks();
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw err;
      }
    },
    [fetchTasks]
  );

  const toggleTaskStatus = useCallback(
    async (id: number) => {
      setError(null);
      try {
        await taskService.toggleTaskStatus(id);
        await fetchTasks();
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        throw err;
      }
    },
    [fetchTasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        pageInfo,
        fetchTasks,
        fetchTasksByStatus,
        searchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};

