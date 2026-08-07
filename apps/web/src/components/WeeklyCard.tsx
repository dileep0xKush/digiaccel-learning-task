import { WeeklyTasks } from '@todo/types';
import TaskItem from './TaskItem.js';
import { Card, CardContent, CardHeader, CardTitle } from '@todo/ui';
import { ChevronDown, Calendar, CheckCircle2, Clock } from 'lucide-react';

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
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden">
      <CardHeader
        className="cursor-pointer bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-colors duration-200 pb-0"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                W{week.weekNumber}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  Week {week.weekNumber}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 ml-11">
              <Calendar size={16} className="text-blue-600" />
              {startDate} - {endDate}
            </div>
          </div>
          <ChevronDown
            size={24}
            className={`transform transition-transform text-blue-600 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </div>

        <div className="pt-6 pb-6 space-y-4 border-t border-blue-200">
          {/* Task Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200 hover:border-orange-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Clock size={16} className="text-orange-600" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Open Tasks</p>
              </div>
              <p className="text-3xl font-bold text-orange-600">{week.openTasks}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-4 border border-green-200 hover:border-green-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={16} className="text-green-600" />
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">Completed</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{week.completedTasks}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-gray-800">Progress</p>
              <p className="text-sm font-bold text-blue-600">{progressPercent}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 text-right">{week.completedTasks} of {week.openTasks + week.completedTasks} tasks completed</p>
          </div>
        </div>
      </CardHeader>

      {isExpanded && week.tasks.length > 0 && (
        <CardContent className="border-t border-gray-200 pt-6 pb-6">
          <div className="space-y-3">
            {week.tasks.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </CardContent>
      )}

      {isExpanded && week.tasks.length === 0 && (
        <CardContent className="border-t border-gray-200 text-center py-12">
          <p className="text-gray-500 font-medium">No tasks scheduled for this week</p>
          <p className="text-sm text-gray-400 mt-1">Create a task to get started</p>
        </CardContent>
      )}
    </Card>
  );
}
