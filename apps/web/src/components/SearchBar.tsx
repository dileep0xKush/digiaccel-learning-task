import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchTasks } from '../hooks/useTasks.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { Input, Spinner } from '@todo/ui';
import { Search } from 'lucide-react';

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isLoading } = useSearchTasks(debouncedQuery);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (taskId: string) => {
    navigate(`/tasks/${taskId}/edit`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isOpen && query && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Spinner size="sm" />
            </div>
          ) : results && results.length > 0 ? (
            <div className="divide-y">
              {results.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleSelect(task.id)}
                  className="w-full text-left p-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="font-medium text-gray-900">{task.title}</p>
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No tasks found matching "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
