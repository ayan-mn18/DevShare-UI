import { v4 as uuidv4 } from 'uuid';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  twitterConnected: boolean;
  githubConnected: boolean;
  leetCodeConnected: boolean;
  testTweetUsed?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  connectTwitter: () => void;
  connectGithub: (username: string) => Promise<{ success: boolean; error?: string }>;
  connectLeetCode: (username: string) => void;
  logout: () => void;
  setUserEmail: (email: string) => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const twitterConnected = localStorage.getItem('twitter_authenticated') === 'true';
    const githubConnected = localStorage.getItem('github_connected') === 'true';
    const leetCodeConnected = localStorage.getItem('leetcode_connected') === 'true';
    const email = localStorage.getItem('user_email');

    if (twitterConnected) {
      setUser({
        id: 'mock-user-id',
        name: 'Dev User',
        email: email || undefined,
        twitterConnected,
        githubConnected,
        leetCodeConnected
      });
    }

    setLoading(false);
  }, []);

  const connectTwitter = async () => {
    try {
      const userId = uuidv4();
      localStorage.setItem('user_id', userId);
      // Call your backend to start OAuth flow
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/connect/x`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // create random uuid for userId
          userId: userId, // In a real app, this would be the actual user ID
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start authentication process');
      }

      const data = await response.json();

      // Store code verifier for use in callback
      localStorage.setItem('oauth_code_verifier', data.data.codeVerifier);

      // Redirect to Twitter auth URL
      window.location.href = data.data.url;
    } catch (error) {
      console.error('Error starting Twitter authentication:', error);
    }
  };

  // Add updateUser function to update user properties
  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...userData
      });

      // Update localStorage values if they're included in the update
      if (userData.twitterConnected !== undefined) {
        localStorage.setItem('twitter_authenticated', userData.twitterConnected.toString());
      }

      if (userData.githubConnected !== undefined) {
        localStorage.setItem('github_connected', userData.githubConnected.toString());
      }

      if (userData.leetCodeConnected !== undefined) {
        localStorage.setItem('leetcode_connected', userData.leetCodeConnected.toString());
      }

      if (userData.email !== undefined) {
        localStorage.setItem('user_email', userData.email);
      }

      if (userData.testTweetUsed !== undefined) {
        localStorage.setItem('test_tweet_used', userData.testTweetUsed.toString());
      }
    }
  };

  const setUserEmail = (email: string) => {
    localStorage.setItem('user_email', email);

    if (user) {
      setUser({
        ...user,
        email
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('twitter_authenticated');
    localStorage.removeItem('github_connected');
    localStorage.removeItem('leetcode_connected');
    localStorage.removeItem('user_email');
    localStorage.removeItem('email_collected');
    localStorage.removeItem('user_id');
    localStorage.removeItem('oauth_code_verifier');
    localStorage.removeItem('test_tweet_used');
    localStorage.removeItem('twitter_username');
    localStorage.removeItem('github_username');
    localStorage.removeItem('leetcode_username');
    localStorage.removeItem('dashboard_data');
    localStorage.removeItem('tweets');
    setUser(null);
    window.location.href = '/';
  };

  const connectGithub = async (username: string) => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Call backend to connect GitHub
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/connect/github`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect GitHub account');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        // Update local state and storage
        localStorage.setItem('github_connected', 'true');
        localStorage.setItem('github_username', username);

        if (user) {
          setUser({
            ...user,
            githubConnected: true
          });
        }

        updateUser({
          ...user,
          githubConnected: true
        });

        // get dashboard data nad update username in dashboard data
        const dashboardData = localStorage.getItem('dashboard_data');
        if (dashboardData) {
          const parsedData = JSON.parse(dashboardData);
          parsedData.user.github_username = username;
          localStorage.setItem('dashboard_data', JSON.stringify(parsedData));
        }

        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to connect GitHub account');
      }
    } catch (error) {
      console.error('Error connecting GitHub:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  };

  const connectLeetCode = async (username: string) => {
    try {
      const userId = localStorage.getItem('user_id');
      if (!userId) {
        throw new Error('User ID not found');
      }

      // Call backend to connect LeetCode
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/connect/leetcode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to connect LeetCode account');
      }

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        // Update local state and storage
        localStorage.setItem('leetcode_connected', 'true');
        localStorage.setItem('leetcode_username', username);

        if (user) {
          setUser({
            ...user,
            leetCodeConnected: true
          });
        }

        updateUser({
          ...user,
          leetCodeConnected: true
        });

        // get dashboard data and update username in dashboard data
        const dashboardData = localStorage.getItem('dashboard_data');
        if (dashboardData) {
          const parsedData = JSON.parse(dashboardData);
          parsedData.user.leetcode_username = username;
          localStorage.setItem('dashboard_data', JSON.stringify(parsedData));
        }

        return { success: true };
      } else {
        throw new Error(data.message || 'Failed to connect LeetCode account');
      }
    } catch (error) {
      console.error('Error connecting LeetCode:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        connectTwitter,
        connectGithub,
        connectLeetCode,
        logout,
        updateUser,
        setUserEmail
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};