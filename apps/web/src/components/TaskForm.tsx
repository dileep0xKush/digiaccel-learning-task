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
      await createTaskMutation.mutateAsync(data);
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
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Task</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" variant="primary" className="flex-1" disabled={createTaskMutation.isPending}>
              {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
            </Button>
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
