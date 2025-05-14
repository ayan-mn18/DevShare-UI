import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import OAuthRedirect from './pages/OAuthRedirect';
import ErrorPage from './pages/ErrorPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import EmailModal from './components/auth/EmailModal';
import Toast from './components/common/Toast';

function AppContent() {
  const { user, setUserEmail } = useAuth();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailCollected, setEmailCollected] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    visible: boolean;
  }>({ message: '', type: 'info', visible: false });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    console.log('url:', import.meta.env.VITE_REACT_SERVER_URL);
  }, []);



  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, visible: true });

    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 5000);
  };

  const handleEmailSubmit = async (email: string) => {
    setIsSubmitting(true);

    try {
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        throw new Error('User ID not found');
      }

      // Make API call to update email
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

      // Update localStorage and context
      localStorage.setItem('email_collected', 'true');
      localStorage.setItem('user_email', email);
      setEmailCollected(true);

      // Update user state in context
      if (setUserEmail) {
        setUserEmail(email);
      }

      showToast('Email successfully updated!', 'success');
      setShowEmailModal(false);

    } catch (error) {
      console.error('Error updating email:', error);
      showToast(
        error instanceof Error ? error.message : 'Failed to update email',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#15202B] text-white">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard setShowEmailModal={setShowEmailModal} />} />
          <Route path="/oauth/callback" element={<OAuthRedirect />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        {showEmailModal && (
          <EmailModal
            onClose={() => setShowEmailModal(false)}
            onSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
          />
        )}

        {toast.visible && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(prev => ({ ...prev, visible: false }))}
          />
        )}
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;