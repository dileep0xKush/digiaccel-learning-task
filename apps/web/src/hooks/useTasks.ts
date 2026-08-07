import { useQuery, useMutation } from '@tanstack/react-query';
import { CreateTaskInput, UpdateTaskInput, WeeklyTasks } from '@todo/types';
import { api } from '../config/api.js';
import { queryClient } from '../config/query.js';

export const useTasks = (skip = 0, take = 50, status?: string) => {
  return useQuery({
    queryKey: ['tasks', skip, take, status],
    queryFn: async () => {
      const params = new URLSearchParams({ skip: skip.toString(), take: take.toString() });
      if (status) params.append('status', status);
      const { data } = await api.get(`/api/tasks?${params}`);
      return data.data;
    },
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: async () => {
      const { data } = await api.get(`/api/tasks/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useWeeklyTasks = () => {
  return useQuery({
    queryKey: ['weekly-tasks'],
    queryFn: async () => {
      const { data } = await api.get('/api/tasks/weeks');
      return data.data as WeeklyTasks[];
    },
  });
};

export const useSearchTasks = (query: string) => {
  return useQuery({
    queryKey: ['tasks-search', query],
    queryFn: async () => {
      const { data } = await api.get('/api/tasks/search', { params: { q: query } });
      return data.data;
    },
    enabled: query.length > 0,
  });
};

export const useCreateTask = () => {
  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data } = await api.post('/api/tasks', input);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    },
  });
};

export const useUpdateTask = () => {
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTaskInput }) => {
      const response = await api.patch(`/api/tasks/${id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/api/tasks/${id}/status`, { status });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    },
  });
};

export const useDeleteTask = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['weekly-tasks'] });
    },
  });
};
