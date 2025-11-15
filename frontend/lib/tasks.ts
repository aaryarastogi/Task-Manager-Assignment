import api from './api';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

export const getTasks = async (
  page: number = 1,
  limit: number = 10,
  status?: TaskStatus,
  search?: string
): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (status) params.append('status', status);
  if (search) params.append('search', search);

  const response = await api.get<TasksResponse>(`/tasks?${params.toString()}`);
  return response.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const response = await api.get<Task>(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (data: CreateTaskData): Promise<Task> => {
  const response = await api.post<Task>('/tasks', data);
  return response.data;
};

export const updateTask = async (id: string, data: UpdateTaskData): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${id}`, data);
  return response.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export const toggleTaskStatus = async (id: string): Promise<Task> => {
  const response = await api.patch<Task>(`/tasks/${id}/toggle`);
  return response.data;
};

