import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UpdateTaskSchema, UpdateTaskInput, Task } from '@todo/types';
import { useUpdateTask, useDeleteTask } from '../hooks/useTasks.js';
import { Input, Select, Textarea } from '@todo/ui';
import { Trash2, FileText, Clock, Flag, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface TaskFormEditProps {
  task: Task;
  onSuccess?: () => void;
}

export default function TaskFormEdit({ task, onSuccess }: TaskFormEditProps) {
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

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
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8">
          <h2 className="text-3xl font-bold text-white">Edit Task</h2>
          <p className="text-blue-100 mt-2">Update your task details and manage priorities</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={18} className="text-blue-600" />
                Task Title
              </label>
              <Input
                placeholder="Enter task title"
                className="border-2 border-gray-200 focus:border-blue-500"
                {...register('title')}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <FileText size={18} className="text-blue-600" />
                Description
              </label>
              <Textarea
                placeholder="Enter task description (optional)"
                className="border-2 border-gray-200 focus:border-blue-500 min-h-32"
                {...register('description')}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Two Column Layout for Date and Time */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <Clock size={18} className="text-blue-600" />
                Due Date & Time
              </label>
              <Input
                type="datetime-local"
                className="border-2 border-gray-200 focus:border-blue-500"
                {...register('dueDate')}
              />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
            </div>

            {/* Priority and Status Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Flag size={18} className="text-orange-600" />
                  Priority
                </label>
                <Select
                  className="border-2 border-gray-200 focus:border-blue-500"
                  {...register('priority')}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </Select>
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <CheckCircle2 size={18} className="text-green-600" />
                  Status
                </label>
                <Select
                  className="border-2 border-gray-200 focus:border-blue-500"
                  {...register('status')}
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </Select>
                {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-8 border-t-2 border-gray-200">
              <button
                type="submit"
                disabled={updateTaskMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateTaskMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteTaskMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                {deleteTaskMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
