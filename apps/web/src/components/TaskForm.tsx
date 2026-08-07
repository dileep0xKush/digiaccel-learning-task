import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, CreateTaskInput } from '@todo/types';
import { useCreateTask } from '../hooks/useTasks.js';
import { Button, Input, Select, Textarea } from '@todo/ui';
import { X } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TaskForm({ isOpen, onClose, onSuccess }: TaskFormProps) {
  const createTaskMutation = useCreateTask();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(CreateTaskSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      let dueDate = data.dueDate;
      if (dueDate && !dueDate.includes('T')) {
        dueDate = `${dueDate}:00`;
      }
      const payload = {
        ...data,
        dueDate: dueDate ? new Date(dueDate).toISOString() : new Date().toISOString(),
      };
      await createTaskMutation.mutateAsync(payload);
      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-b from-white to-gray-50 rounded-t-3xl p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create Task</h2>
            <p className="text-sm text-gray-600 mt-1">Add a new task to your list</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter task title"
            {...register('title')}
            error={errors.title?.message}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Enter task description"
            {...register('description')}
            error={errors.description?.message}
          />

          <Input
            label="Due Date & Time"
            type="datetime-local"
            {...register('dueDate')}
            error={errors.dueDate?.message}
          />

          <Select label="Priority" {...register('priority')} error={errors.priority?.message}>
            <option value="LOW">Low</option>
            <option value="MEDIUM" selected>
              Medium
            </option>
            <option value="HIGH">High</option>
          </Select>

          <div className="flex gap-3 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl transition-all active:scale-95"
              disabled={createTaskMutation.isPending}
            >
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl transition-colors"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
