import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Portfolio from './Portfolio';
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
import Login from './components/admin/Login.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import PrivacyPolicy from './components/PrivacyPolicy.tsx';
import TermsOfService from './components/TermsOfService.tsx';
import { api } from './lib/api-config';

function App() {
  const location = useLocation();

  // Disable browser's native scroll restoration and implement custom one
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Save scroll position on every scroll
  useEffect(() => {
    const handleScroll = () => {
      sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Restore scroll position when page loads or route changes
  useEffect(() => {
    // Always scroll to top on route change or page load
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetch(api.visit(), { method: 'POST' })
      .catch(err => console.error('Error tracking visit:', err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-of-service" element={<TermsOfService />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <Suspense fallback={<div className="p-8 text-center">Loading admin...</div>}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/admin" element={
        <ProtectedRoute>
          <Suspense fallback={<div className="p-8 text-center">Loading admin...</div>}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;
