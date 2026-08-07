import { Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import OnboardingPage from './pages/OnboardingPage.js';
import HomePage from './pages/HomePage.js';
import SearchPage from './pages/SearchPage.js';
import EditTaskPage from './pages/EditTaskPage.js';
import NotFoundPage from './pages/NotFoundPage.js';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={3000}
      />
    </>
  );
}

export default App;
