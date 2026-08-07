import { WeeklyTasks } from '@todo/types';
import TaskItem from './TaskItem.js';
import { Card, CardContent, CardHeader, CardTitle } from '@todo/ui';
import { ChevronDown } from 'lucide-react';

interface WeeklyCardProps {
  week: WeeklyTasks;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function WeeklyCard({ week, isExpanded, onToggle }: WeeklyCardProps) {
  const startDate = new Date(week.weekStart).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDate = new Date(week.weekEnd).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const progressPercent =
    week.openTasks + week.completedTasks > 0
      ? Math.round((week.completedTasks / (week.openTasks + week.completedTasks)) * 100)
      : 0;

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 bg-white/95 backdrop-blur-sm">
      <CardHeader
        className="cursor-pointer hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900">
              Week {week.weekNumber}
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">{startDate} - {endDate}</p>
          </div>
          <ChevronDown
            size={24}
            className={`transform transition-transform text-blue-600 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-3 border border-orange-100">
              <p className="text-xs text-gray-600 font-medium">Open Tasks</p>
              <p className="text-2xl font-bold text-orange-600">{week.openTasks}</p>
            </div>
            <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
              <p className="text-xs text-gray-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-600">{week.completedTasks}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">{progressPercent}% Complete</p>
              <p className="text-xs text-gray-500">{week.completedTasks} of {week.openTasks + week.completedTasks}</p>
            </div>
          </div>
        </div>
      </CardHeader>

      {isExpanded && week.tasks.length > 0 && (
        <CardContent className="border-t border-gray-200 pt-4">
          <div className="space-y-2">
            {week.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      )}

      {isExpanded && week.tasks.length === 0 && (
        <CardContent className="border-t border-gray-200 text-center py-8 text-gray-500">
          No tasks this week
        </CardContent>
      )}
    </Card>
  );
}
