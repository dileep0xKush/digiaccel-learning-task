import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWeeklyTasks } from '../hooks/useTasks.js';
import { useToast } from '../hooks/useToast.js';
import TaskForm from '../components/TaskForm.js';
import WeeklyCard from '../components/WeeklyCard.js';
import SearchBar from '../components/SearchBar.js';
import ToastContainer from '../components/ToastContainer.js';
import { Button } from '@todo/ui';
import { Plus, Search } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: weeks, isLoading } = useWeeklyTasks();
  const toast = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber) ? prev.filter((w) => w !== weekNumber) : [...prev, weekNumber]
    );
  };

  const handleTaskCreated = () => {
    setIsFormOpen(false);
    toast.success('Task created successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <p className="text-sm text-gray-600">Stay organized and track your progress</p>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar />
            </div>
            <Button
              onClick={() => navigate('/search')}
              variant="ghost"
              size="md"
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <Search size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full w-8 h-8 border-b-2 border-blue-600" />
          </div>
        ) : !weeks || weeks.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-4 text-5xl">📋</div>
            <p className="text-lg font-semibold text-gray-700 mb-2">No tasks yet</p>
            <p className="text-gray-500 mb-6">Create your first task to get started!</p>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <Plus size={20} />
              Create Task
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {weeks.map((week) => (
              <WeeklyCard
                key={week.weekNumber}
                week={week}
                isExpanded={expandedWeeks.includes(week.weekNumber)}
                onToggle={() => toggleWeek(week.weekNumber)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 active:scale-95"
        aria-label="Add task"
        title="Add new task"
      >
        <Plus size={28} />
      </button>

      {isFormOpen && <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleTaskCreated} />}

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
