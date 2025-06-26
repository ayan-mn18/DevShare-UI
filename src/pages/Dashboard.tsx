import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CreditCard, LogOut, RefreshCw } from 'lucide-react';
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import IntegrationCards from '../components/dashboard/IntegrationCards';
import ContributionMetrics from '../components/dashboard/ContributionMetrics';
import ScheduledTweets from '../components/dashboard/ScheduledTweets';
import TestTweetButton from '../components/dashboard/TestTweetButton';
import ProgressStepper from '../components/onboarding/ProgressStepper';



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
    avatar: string;
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
  const [showIntegrations, setShowIntegrations] = useState<boolean>(() => {
    const stored = localStorage.getItem('show_integrations');
    return stored === null ? true : stored === 'true';
  });
  const [showProgressStepper, setShowProgressStepper] = useState<boolean>(() => {
    const stored = localStorage.getItem('show_progress_stepper');
    return stored === null ? true : stored === 'true';
  });
  const [showTestTweetButton, setShowTestTweetButton] = useState<boolean>(() => {
    const stored = localStorage.getItem('show_test_tweet_button');
    return stored === null ? true : stored === 'true';
  });



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
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img src="/icon.ico" alt="DevShare Logo" className="h-10 w-10" />
            <h1 className="text-2xl font-bold text-white">DevShare</h1>
          </div>

          {/* Dropdown menu */}
          <div className="flex items-center space-x-2">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <img
                  src={dashboardData?.user?.avatar}
                  alt={dashboardData?.user?.name || "Dev Share"}
                  className="h-9 w-9 rounded-full border-2 border-[#2881cf] ml-2 shadow cursor-pointer"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                sideOffset={8}
                className="bg-[#22303C] border border-[#38444D] rounded-md shadow-lg p-2 min-w-[140px] z-50"
              >
                <DropdownMenu.Item
                  onSelect={handleRefresh}
                  className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                  disabled={isRefreshing}
                >
                  <RefreshCw size={16} className={isRefreshing ? "animate-spin mr-2" : "mr-2"} />
                  {isRefreshing ? "Refreshing..." : "Refresh"}
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-[#38444D] my-1" />
                <DropdownMenu.Item
                  onSelect={logout}
                  className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenu.Item>
                <DropdownMenu.Separator className="h-px bg-[#38444D] my-1" />
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger
                    className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                  >
                    <CreditCard size={16} className="mr-2" />
                    Show Cards
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent
                    className="bg-[#22303C] border border-[#38444D] rounded-md shadow-lg p-2 min-w-[160px] z-50"
                    sideOffset={8}
                    alignOffset={-5}
                  >
                    <DropdownMenu.Item
                      onSelect={() => { setShowIntegrations(true); localStorage.setItem('show_integrations', 'true'); }}
                      className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                    >
                      Social Cards
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => { setShowTestTweetButton(true); localStorage.setItem('show_test_tweet_button', 'true'); }}
                      className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                    >
                      Test Tweet
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      onSelect={() => { setShowProgressStepper(true); localStorage.setItem('show_progress_stepper', 'true'); }}
                      className="flex items-center px-2 py-2 rounded hover:bg-[#192734] text-white cursor-pointer"
                    >
                      Progress Card
                    </DropdownMenu.Item>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
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
            {showIntegrations && (
              <IntegrationCards
                fetchDashboardData={fetchDashboardData}
                onHide={() => {
                  setShowIntegrations(false);
                  localStorage.setItem('show_integrations', 'false');
                }}
              />
            )}
            {/* <IntegrationCards fetchDashboardData={fetchDashboardData} disable={showIntegrations} /> */}

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
            {showProgressStepper && (
              <ProgressStepper onHide={() => {
                setShowProgressStepper(false)
                localStorage.setItem('show_progress_stepper', 'false');
              }} />
            )}
            {showTestTweetButton && (
              <TestTweetButton
                isDisabled={!allConnected || user.testTweetUsed}
                userId={dashboardData?.user.id || ''}
                twitterUsername={dashboardData?.user.twitter_username || undefined}
                onHide={() => {
                  setShowTestTweetButton(false);
                  localStorage.setItem('show_test_tweet_button', 'false');
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;