import { useNavigate } from 'react-router';
import { Button } from '@todo/ui';
import { CheckCircle, Clock, BarChart3 } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Clock,
      title: 'Smart Scheduling',
      description: 'Organize tasks by week and track your progress',
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Visualize your productivity with weekly insights',
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Create, edit, and complete tasks effortlessly',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-gray-900">
            Todo<span className="text-blue-600">List</span>
          </h1>
          <p className="text-lg text-gray-600">Organize your week, boost your productivity</p>
        </div>

        <div className="grid gap-4">
          {features.map(({ icon: Icon, title, description }, idx) => (
            <div key={idx} className="flex gap-3 text-left">
              <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => navigate('/home')}
          className="w-full py-3 text-lg font-semibold"
          variant="primary"
          size="lg"
        >
          Get Started
        </Button>

        <p className="text-sm text-gray-600">
          No sign-up required. All data stored locally.
        </p>
      </div>
    </div>
  );
}
