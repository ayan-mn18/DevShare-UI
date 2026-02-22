import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/LandingPage';
import ErrorPage from './pages/ErrorPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import EmailModal from './components/auth/EmailModal';
import { Toaster, toast } from 'react-hot-toast';

// Lazy-loaded routes for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const OAuthRedirect = lazy(() => import('./pages/OAuthRedirect'));
const GitHubOAuthRedirect = lazy(() => import('./pages/GitHubOAuthRedirect'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const { user, setUserEmail } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('url:', import.meta.env.VITE_REACT_SERVER_URL);
  }, []);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/dashboard/add-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update email');
      }

      localStorage.setItem('email_collected', 'true');
      localStorage.setItem('user_email', email);

      if (setUserEmail) {
        setUserEmail(email);
      }

      toast.success('Email successfully updated!');
      setShowEmailModal(false);

    } catch (error) {
      console.error('Error updating email:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update email');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0D1117] text-white">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <div className="w-12 h-12 rounded-full border-2 border-[#1DA1F2]/20 border-t-[#1DA1F2] animate-spin" />
            <p className="text-sm text-white/30 font-medium animate-pulse">Loading...</p>
          </div>
        }>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard setShowEmailModal={setShowEmailModal} />} />
            <Route path="/oauth/callback" element={<OAuthRedirect />} />
            <Route path="/oauth/github/callback" element={<GitHubOAuthRedirect />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Suspense>

        {showEmailModal && (
          <EmailModal
            onClose={() => setShowEmailModal(false)}
            onSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
        <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#192734',
            color: '#FFFFFF',
            border: '1px solid #2C3640',
            borderRadius: '12px',
            fontSize: '14px',
            fontFamily: 'Satoshi, sans-serif',
          },
          success: {
            iconTheme: { primary: '#17BF63', secondary: '#192734' },
          },
          error: {
            iconTheme: { primary: '#E0245E', secondary: '#192734' },
          },
        }}
      />
    </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;