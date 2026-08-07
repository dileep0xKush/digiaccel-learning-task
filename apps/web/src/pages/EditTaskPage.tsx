import { useParams, useNavigate } from 'react-router';
import { useTask } from '../hooks/useTasks.js';
import TaskFormEdit from '../components/TaskFormEdit.js';
import { Button } from '@todo/ui';
import { ArrowLeft } from 'lucide-react';

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading } = useTask(id || '');

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600">Invalid task ID</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Button
            onClick={() => navigate('/home')}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} /> Back
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="inline-block animate-spin rounded-full w-10 h-10 border-4 border-blue-200 border-t-blue-600" />
              <p className="text-gray-600">Loading task...</p>
            </div>
          </div>
        ) : task ? (
          <TaskFormEdit task={task} onSuccess={() => navigate('/home')} />
        ) : (
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 font-semibold">Task not found</p>
          </div>
        )}
      </div>
    </div>
  );
}
