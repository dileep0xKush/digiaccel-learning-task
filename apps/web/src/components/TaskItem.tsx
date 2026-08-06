import { useNavigate } from 'react-router';
import { Task } from '@todo/types';
import { useUpdateTaskStatus } from '../hooks/useTasks.js';
import { Badge, Card } from '@todo/ui';
import { Check, Edit2, Clock, AlertCircle } from 'lucide-react';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const navigate = useNavigate();
  const updateStatusMutation = useUpdateTaskStatus();

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === 'IN_PROGRESS' ? 'COMPLETED' : 'IN_PROGRESS';
    updateStatusMutation.mutate({ id: task.id, status: newStatus });
  };

  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && task.status === 'IN_PROGRESS';
  const isToday =
    dueDate.toDateString() === new Date().toDateString() && task.status === 'IN_PROGRESS';

  const priorityColors = {
    LOW: 'secondary',
    MEDIUM: 'default',
    HIGH: 'destructive',
  } as const;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover:shadow-md ${
        task.status === 'COMPLETED' ? 'opacity-60' : ''
      }`}
      onClick={() => navigate(`/tasks/${task.id}/edit`)}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleStatusToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === 'COMPLETED'
              ? 'bg-green-500 border-green-500'
              : 'border-gray-300 hover:border-green-500'
          }`}
        >
          {task.status === 'COMPLETED' && <Check size={16} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold text-gray-900 ${
              task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
          )}

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Clock size={14} />
              {dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>

            {isOverdue && (
              <div className="flex items-center gap-1 text-sm text-red-600">
                <AlertCircle size={14} />
                Overdue
              </div>
            )}

            {isToday && <Badge variant="warning">Today</Badge>}
          </div>

          <div className="flex gap-2 mt-2">
            <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/tasks/${task.id}/edit`);
          }}
          className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors"
        >
          <Edit2 size={18} />
        </button>
      </div>
    </Card>
  );
}
