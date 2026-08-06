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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <SearchBar />
            </div>
            <Button
              onClick={() => navigate('/search')}
              variant="ghost"
              size="md"
              className="flex items-center gap-2"
            >
              <Search size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full w-8 h-8 border-b-2 border-blue-600" />
          </div>
        ) : !weeks || weeks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No tasks yet. Create one to get started!</p>
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

      <button
        onClick={() => setIsFormOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Add task"
      >
        <Plus size={24} />
      </button>

      {isFormOpen && <TaskForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleTaskCreated} />}

      <ToastContainer toasts={toast.toasts} onRemove={toast.removeToast} />
    </div>
  );
}
