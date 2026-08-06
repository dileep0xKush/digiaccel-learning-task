import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateTaskSchema, UpdateTaskInput, Task } from '@todo/types';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks.js';
import { useToast } from '../hooks/useToast.js';
import { Button, Input, Select, Textarea } from '@todo/ui';
import { Trash2 } from 'lucide-react';

interface TaskFormEditProps {
  task: Task;
  onSuccess?: () => void;
}

export default function TaskFormEdit({ task, onSuccess }: TaskFormEditProps) {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const toast = useToast();

  const dueDate = new Date(task.dueDate);
  const dateString = dueDate.toISOString().slice(0, 16);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTaskInput>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      dueDate: dateString,
      priority: task.priority,
      status: task.status,
    },
  });

  const onSubmit = async (data: UpdateTaskInput) => {
    try {
      await updateTaskMutation.mutateAsync({ id: task.id, data });
      toast.success('Task updated successfully!');
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        toast.success('Task deleted successfully!');
        onSuccess?.();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="Enter task title"
          {...register('title')}
          error={errors.title?.message}
        />

        <Textarea
          label="Description"
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
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </Select>

        <Select label="Status" {...register('status')} error={errors.status?.message}>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </Select>

        <div className="flex gap-2 pt-6">
          <Button type="submit" variant="primary" className="flex-1" disabled={updateTaskMutation.isPending}>
            {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleteTaskMutation.isPending}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </form>
    </div>
  );
}
