import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GitHubOAuthRedirect: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const { updateUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    if (error) {
      setStatus('error');
      setErrorMessage(error === 'access_denied' ? 'GitHub access was denied.' : `GitHub error: ${error}`);
      setTimeout(() => navigate('/dashboard'), 3000);
      return;
    }

    if (code) {
      processGitHubCallback(code, state || '');
    } else {
      setStatus('error');
      setErrorMessage('Authorization code not found.');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  }, []);

  const processGitHubCallback = async (code: string, state: string) => {
    try {
      // Verify state matches what we stored
      const storedState = localStorage.getItem('github_oauth_state');
      if (storedState && state !== storedState) {
        throw new Error('State mismatch. Please try connecting again.');
      }

      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found. Please log in first.');
      }

      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/connect/github/callback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, state, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect GitHub account');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        const githubUsername = data.data?.github_username || data.data?.user?.github_username;

        // Update localStorage
        localStorage.setItem('github_connected', 'true');
        if (githubUsername) {
          localStorage.setItem('github_username', githubUsername);
        }
        localStorage.removeItem('github_oauth_state');

        // Update dashboard data cache
        const dashboardData = localStorage.getItem('dashboard_data');
        if (dashboardData) {
          const parsed = JSON.parse(dashboardData);
          parsed.user.github_username = githubUsername;
          localStorage.setItem('dashboard_data', JSON.stringify(parsed));
        }

        // Update auth context
        updateUser({ githubConnected: true });

        setStatus('success');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to connect GitHub account');
      }
    } catch (error) {
      console.error('GitHub OAuth callback error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
      localStorage.removeItem('github_oauth_state');
      setTimeout(() => navigate('/dashboard'), 3000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#0D1117]">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-[#6E5494]/20 border-t-[#6E5494] animate-spin" />
                <Github className="w-6 h-6 text-[#6E5494] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-4">Connecting GitHub</h1>
            <p className="text-white/40">
              Please wait while we connect your GitHub account...
            </p>
            <Button
              variant="ghost"
              onClick={() => navigate('/dashboard')}
              className="mt-6 text-white/30 hover:text-white"
            >
              Cancel
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#17BF63]/10">
                <CheckCircle size={48} className="text-[#17BF63]" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-4">GitHub Connected!</h1>
            <p className="text-white/40">
              Your GitHub account has been linked successfully. Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#E0245E]/10">
                <XCircle size={48} className="text-[#E0245E]" />
              </div>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-4">Connection Failed</h1>
            <p className="text-white/40 mb-4">
              {errorMessage || "We couldn't connect your GitHub account. Please try again."}
            </p>
            <p className="text-white/20 text-sm">
              Redirecting to dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default GitHubOAuthRedirect;
