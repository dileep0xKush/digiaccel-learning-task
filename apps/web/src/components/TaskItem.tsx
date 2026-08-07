import { useNavigate } from 'react-router';
import { Task } from '@todo/types';
import { useUpdateTaskStatus } from '../hooks/useTasks.js';
import { Card } from '@todo/ui';
import { Check, Edit2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateTaskStatus();

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
    updateStatusMutation.mutate(
      { id: task.id, status: newStatus },
      {
        onSuccess: () => {
          const message =
            newStatus === 'COMPLETED' ? 'Task marked as completed' : 'Task moved to in progress';
          toast.success(message);
        },
        onError: () => {
          toast.error('Failed to update task status');
        },
      }
    );
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status === 'IN_PROGRESS';
  const isToday =
    dueDate.toDateString() === new Date().toDateString() && task.status === 'IN_PROGRESS';

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md border-0 ${
        task.status === 'COMPLETED' ? 'bg-gray-100/60 opacity-75' : 'bg-white hover:bg-blue-50/30'
      }`}
      onClick={() => navigate(`/tasks/${task.id}/edit`)}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={handleStatusToggle}
          className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all mt-1 ${
            task.status === 'COMPLETED'
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 border-green-500 shadow-sm'
              : 'border-gray-300 hover:border-green-500 hover:shadow-md'
          }`}
        >
          {task.status === 'COMPLETED' && <Check size={16} className="text-white font-bold" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-base ${
              task.status === 'COMPLETED' ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm line-clamp-2 mt-1 ${
                task.status === 'COMPLETED' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <div
              className={`flex items-center gap-1 text-sm ${
                isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'
              }`}
            >
              <Clock size={14} />
              {dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>

            {isOverdue && (
              <div className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full border border-red-200">
                <AlertCircle size={12} />
                Overdue
              </div>
            )}

            {isToday && (
              <div className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-200">
                Today
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-full ${
                task.priority === 'HIGH'
                  ? 'bg-red-100 text-red-700'
                  : task.priority === 'MEDIUM'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
              }`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tasks/${task.id}/edit`);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg p-1 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
    </Card>
  );
}
