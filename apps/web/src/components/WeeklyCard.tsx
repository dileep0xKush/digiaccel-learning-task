import { WeeklyTasks } from '@todo/types';
import TaskItem from './TaskItem.js';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@todo/ui';
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
    <Card>
      <CardHeader
        className="cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              Week {week.weekNumber} • {startDate} - {endDate}
            </CardTitle>
          </div>
          <ChevronDown
            size={20}
            className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex gap-2">
            <Badge variant="default">{week.openTasks} Open</Badge>
            <Badge variant="success">{week.completedTasks} Done</Badge>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">{progressPercent}% Complete</p>
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
