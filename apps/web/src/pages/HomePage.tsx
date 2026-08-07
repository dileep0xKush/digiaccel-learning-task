import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useWeeklyTasks } from '../hooks/useTasks.js';
import TaskForm from '../components/TaskForm.js';
import WeeklyCard from '../components/WeeklyCard.js';
import SearchBar from '../components/SearchBar.js';
import { Plus, Search, Zap } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: weeks, isLoading } = useWeeklyTasks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0]);

  const toggleWeek = (weekNumber: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(weekNumber) ? prev.filter((w) => w !== weekNumber) : [...prev, weekNumber]
    );
  };

  const handleTaskCreated = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-white to-blue-50/80 backdrop-blur-md shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-2">
                <Zap size={24} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Tasks
              </h1>
            </div>
            <p className="text-sm text-gray-600 ml-14">Stay organized, boost productivity</p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <SearchBar />
            </div>
            <button
              onClick={() => navigate('/search')}
              className="bg-white border border-gray-300 hover:border-blue-500 text-gray-700 font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center gap-2"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full w-12 h-12 border-4 border-blue-200 border-t-blue-600" />
              <p className="text-gray-600 font-medium">Loading your tasks...</p>
            </div>
          </div>
        ) : !weeks || weeks.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6 inline-block bg-blue-100 rounded-full p-6">
              <Zap size={48} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No tasks yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Create your first task to start organizing your week and boosting your productivity!
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <Plus size={20} />
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="space-y-5">
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
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-5 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 active:scale-95 group"
        aria-label="Add task"
        title="Add new task"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {isFormOpen && (
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
}
