import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchTasks } from '../hooks/useTasks.js';
import { useDebounce } from '../hooks/useDebounce.js';
import TaskItem from '../components/TaskItem.js';
import { Button, Input } from '@todo/ui';
import { ArrowLeft } from 'lucide-react';
import { Task } from '@todo/types';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const debouncedQuery = useDebounce(searchInput, 300);
  const { data: results, isLoading } = useSearchTasks(debouncedQuery);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 bg-white shadow-sm z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-4 items-center">
            <Button onClick={() => navigate('/home')} variant="ghost" size="sm">
              <ArrowLeft size={20} />
            </Button>
            <Input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading && searchInput ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full w-8 h-8 border-b-2 border-blue-600" />
          </div>
        ) : !searchInput ? (
          <div className="text-center py-12 text-gray-600">
            <p>Start typing to search tasks</p>
          </div>
        ) : results && results.length > 0 ? (
          <div className="space-y-2">
            {results.map((task: Task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p>No tasks found matching "{searchInput}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
