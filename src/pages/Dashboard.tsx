import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw } from 'lucide-react';
import Button from '../components/common/Button';
import IntegrationCards from '../components/dashboard/IntegrationCards';
import ContributionMetrics from '../components/dashboard/ContributionMetrics';
import ScheduledTweets from '../components/dashboard/ScheduledTweets';
import TestTweetButton from '../components/dashboard/TestTweetButton';
import ProgressStepper from '../components/onboarding/ProgressStepper';
import { set } from 'date-fns';


// Define types for the dashboard data
interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string | null;
    twitter_username: string | null;
    github_username: string | null;
    leetcode_username: string | null;
    test_tweet_used: boolean;
    created_at: string;
  };
  githubMetrics: {
    contributions: Array<{ date: string; count: number }>;
    totalCommits: number;
    streak: number;
    followers: number;
  } | null;
  leetCodeMetrics: {
    totalSolved: number;
    totalQuestions: number;
    streak: number;
    recentSubmissions: Array<{
      title: string;
      difficulty: string;
      timestamp: string;
    }>;
    level: string;
    contestRating: number;
  } | null;
}

interface DashboardProps {
  setShowEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Dashboard: React.FC<DashboardProps> = ({ setShowEmailModal }) => {
  const { user, loading, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);



  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    // Only run this effect once or when user changes
    if (loading) return;

    const fetchData = async () => {
      if (dataFetched) return;
      const storedData = localStorage.getItem('dashboard_data');
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          setDashboardData(parsedData);
          if (user) {
            updateUserContextFromData(parsedData);
          }
          setDataLoading(false);

        } catch (e) {
          console.error('Failed to parse stored dashboard data', e);
          // Fallback to fetching from API if parsing fails
          if (user) {
            await fetchDashboardData();
          }
        }
      } else if (user) {
        await fetchDashboardData();
      }
    };

    fetchData();
  }, [loading]);

  // Update user context based on dashboard data
  const updateUserContextFromData = (data: DashboardData) => {
    if (!user) return;

    updateUser({
      twitterConnected: !!data.user.twitter_username,
      githubConnected: !!data.user.github_username,
      leetCodeConnected: !!data.user.leetcode_username,
      email: data.user.email || undefined,
      testTweetUsed: data.user.test_tweet_used
    });

    setDataFetched(true);
    if (!data.user.email) {
      setTimeout(() => {
        setShowEmailModal(true);
      }, 3000);
    }
  };

  const fetchDashboardData = async () => {
    if (user) {
      const userId = localStorage.getItem('user_id');
      if (!userId) return;
      setDataLoading(true);

      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/dashboard/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        if (result.status === 'SUCCESS' && result.data) {
          // Store the data in localStorage
          localStorage.setItem('dashboard_data', JSON.stringify(result.data));

          // Update state
          setDashboardData(result.data);

          // Update user auth context with connectivity status
          updateUserContextFromData(result.data);

          // Store specific values separately for easier access
          if (result.data.user.twitter_username) {
            localStorage.setItem('twitter_username', result.data.user.twitter_username);
            localStorage.setItem('twitter_authenticated', 'true');
          }

          if (result.data.user.github_username) {
            localStorage.setItem('github_username', result.data.user.github_username);
            localStorage.setItem('github_connected', 'true');
          }

          if (result.data.user.leetcode_username) {
            localStorage.setItem('leetcode_username', result.data.user.leetcode_username);
            localStorage.setItem('leetcode_connected', 'true');
          }

          if (result.data.user.email) {
            localStorage.setItem('user_email', result.data.user.email);
          }

          localStorage.setItem('test_tweet_used', result.data.user.test_tweet_used.toString());
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    // Clear cached data and force refresh
    setIsRefreshing(true);
    localStorage.removeItem('dashboard_data');
    localStorage.removeItem('tweets');
    await fetchDashboardData();
  };

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1DA1F2]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const allConnected = user.twitterConnected && user.githubConnected && user.leetCodeConnected;

  return (
    <div className="min-h-screen">
      <header className="bg-[#192734] border-b border-[#38444D] py-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-[#1DA1F2] rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M8 3v3a2 2 0 0 1-2 2H3"></path>
                <path d="M21 8h-3a2 2 0 0 1-2-2V3"></path>
                <path d="M3 16h3a2 2 0 0 1 2 2v3"></path>
                <path d="M16 21v-3a2 2 0 0 1 2-2h3"></path>
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">DevShare</h1>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh dashboard data"
            >
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<LogOut size={16} />}
              onClick={logout}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-[#8899A6]">
            Manage your connected accounts and scheduled tweets.
          </p>
        </div>



        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <IntegrationCards fetchDashboardData={fetchDashboardData} />

            {allConnected && (
              <>
                <ContributionMetrics
                  githubMetrics={dashboardData?.githubMetrics || null}
                  leetCodeMetrics={dashboardData?.leetCodeMetrics || null}
                  githubUsername={dashboardData?.user.github_username || undefined}
                  leetcodeUsername={dashboardData?.user.leetcode_username || undefined}
                />
                <ScheduledTweets userId={dashboardData?.user.id} />
              </>
            )}
          </div>

          <div className="space-y-6">
            <ProgressStepper />
            <TestTweetButton
              isDisabled={!allConnected || user.testTweetUsed}
              userId={dashboardData?.user.id || ''}
              twitterUsername={dashboardData?.user.twitter_username || undefined}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;