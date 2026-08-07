import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateTaskSchema, CreateTaskInput } from '@todo/types';
import { useCreateTask } from '../hooks/useTasks.js';
import { Input, Select, Textarea } from '@todo/ui';
import { X, Plus, FileText, Clock, Flag } from 'lucide-react';
import { toast } from 'sonner';

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
      toast.success('Task created successfully');
      reset();
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-40 transition-all"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-8 flex justify-between items-start rounded-t-2xl">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-white/20 rounded-lg p-2.5">
                  <Plus size={24} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Create Task</h2>
              </div>
              <p className="text-blue-100 text-sm ml-16">Add a new task to organize your week</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all duration-200 flex-shrink-0"
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText size={18} className="text-blue-600" />
                  Task Title
                </label>
                <Input
                  placeholder="What do you need to do?"
                  className="border-2 border-gray-200 focus:border-blue-500 py-3 px-4 rounded-lg text-base"
                  {...register('title')}
                />
                {errors.title && <p className="text-red-500 text-sm font-medium">{errors.title.message}</p>}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <FileText size={18} className="text-blue-600" />
                  Description
                </label>
                <Textarea
                  placeholder="Add details about your task (optional)"
                  className="border-2 border-gray-200 focus:border-blue-500 py-3 px-4 rounded-lg text-base min-h-28"
                  {...register('description')}
                />
                {errors.description && <p className="text-red-500 text-sm font-medium">{errors.description.message}</p>}
              </div>

              {/* Date & Priority Grid */}
              <div className="grid grid-cols-2 gap-6">
                {/* Date Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock size={18} className="text-blue-600" />
                    Due Date & Time
                  </label>
                  <Input
                    type="datetime-local"
                    className="border-2 border-gray-200 focus:border-blue-500 py-3 px-4 rounded-lg text-base"
                    {...register('dueDate')}
                  />
                  {errors.dueDate && <p className="text-red-500 text-sm font-medium">{errors.dueDate.message}</p>}
                </div>

                {/* Priority Field */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Flag size={18} className="text-orange-600" />
                    Priority
                  </label>
                  <Select
                    className="border-2 border-gray-200 focus:border-blue-500 py-3 px-4 rounded-lg text-base"
                    {...register('priority')}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM" selected>
                      Medium
                    </option>
                    <option value="HIGH">High</option>
                  </Select>
                  {errors.priority && <p className="text-red-500 text-sm font-medium">{errors.priority.message}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={createTaskMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 hover:shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
