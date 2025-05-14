import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';

const OAuthRedirect: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [twitterAuthenticated, setTwitterAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const processOAuthCallback = async (xCode: string, xState: string) => {
    try {
      // Extract the authorization code and state from the URL
      const code = xCode;
      const state = xState;

      // Validation
      if (!code) {
        setTwitterAuthenticated(false);
        setStatus('error');
        setErrorMessage('Authorization code is missing from the callback URL');
        console.error('Authorization code is missing from the callback URL');
        throw new Error('Authorization code is missing from the callback URL');
      }

      if (!state) {
        setTwitterAuthenticated(false);
        setStatus('error');
        setErrorMessage('State parameter is missing from the callback URL');
        console.error('State parameter is missing from the callback URL');
        throw new Error('State parameter is missing from the callback URL');
      }

      // Get stored codeVerifier from localStorage
      const codeVerifier = localStorage.getItem('oauth_code_verifier');

      if (!codeVerifier) {
        setTwitterAuthenticated(false);
        setStatus('error');
        setErrorMessage('Code verifier not found. Please try connecting again.');
        console.error('Code verifier not found. Please try connecting again.');
        throw new Error('Code verifier not found. Please try connecting again.');
      }

      // Make API call to your backend
      console.log('Making API call to complete authentication...');
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/connect/x/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          state,
          codeVerifier,
          userId: localStorage.getItem('user_id'), // Pass user ID from localStorage
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete authentication');
      }

      console.log('Authentication successful!');

      const data = await response.json();
      console.log('Response data:', data);
      const { user } = data.data;

      localStorage.setItem('user_id', user.id);


      // Clear the code verifier from storage as it's no longer needed
      localStorage.removeItem('oauth_code_verifier');

      // Set Twitter as connected in localStorage
      localStorage.setItem('twitter_authenticated', 'true');

      console.log('Changing status:', status);
      setStatus('success');
      setTwitterAuthenticated(true);
      console.log('Changing status:', status);

    } catch (error) {
      console.error('OAuth callback error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed');
      setTwitterAuthenticated(false);
    }
  };

  useEffect(() => {
    if (twitterAuthenticated) {
      setStatus('success');
      console.log('Status changed:', status);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } else if (twitterAuthenticated === false) {
      setStatus('error');
      console.log('Status changed:', status);
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
    // when status changes console log the status

  }, [twitterAuthenticated]);

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    const xState = new URLSearchParams(location.search).get('state');
    const xError = new URLSearchParams(location.search).get('error');
    console.log('xError:', xError);
    if (xError) {
      setTwitterAuthenticated(false);
    }
    if (code && status === 'loading') {
      location.search = ''; // Clear the URL parameters
      processOAuthCallback(code, xState || '');
    }
  }, []);


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1DA1F2]"></div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Processing Authentication</h1>
            <p className="text-[#8899A6]">
              Please wait while we complete the authentication process...
            </p>
            {/* create a button to go back to home */}
            <button
              className="mt-4 px-4 py-2 bg-[#1DA1F2] text-white rounded hover:bg-[#1A91DA]"
              onClick={() => {
                navigate('/');
              }}
            >
              Go Back to Home
            </button>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-[#17BF63]/10">
                <CheckCircle size={48} className="text-[#17BF63]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Successful</h1>
            <p className="text-[#8899A6]">
              Your account has been connected successfully. Redirecting to dashboard...
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
            <h1 className="text-2xl font-bold text-white mb-4">Authentication Failed</h1>
            <p className="text-[#8899A6] mb-4">
              {errorMessage || "We couldn't connect your account. Please try again."}
            </p>
            <p className="text-[#8899A6]">
              Redirecting to home...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthRedirect;