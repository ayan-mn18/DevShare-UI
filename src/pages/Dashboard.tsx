import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, RefreshCw, CreditCard, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import IntegrationCards from '../components/dashboard/IntegrationCards';
import ContributionMetrics from '../components/dashboard/ContributionMetrics';
import ScheduledTweets from '../components/dashboard/ScheduledTweets';
import TestTweetButton from '../components/dashboard/TestTweetButton';
import ProgressStepper from '../components/onboarding/ProgressStepper';
import ChallengesSection from '../components/dashboard/ChallengesSection';
import ChallengeProgress from '../components/dashboard/ChallengeProgress';


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
  time: string;
  botId: string;
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
  const [showChallenges, setShowChallenges] = useState<boolean>(() => {
    const stored = localStorage.getItem('show_challenges');
    return stored === null ? true : stored === 'true';
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
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
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const result = await response.json();
        if (result.status === 'SUCCESS' && result.data) {
          localStorage.setItem('dashboard_data', JSON.stringify(result.data));
          setDashboardData(result.data);
          updateUserContextFromData(result.data);

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
    setIsRefreshing(true);
    localStorage.removeItem('dashboard_data');
    localStorage.removeItem('tweets');
    await fetchDashboardData();
    setIsRefreshing(false);
  };

  if (loading || dataLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-[#1DA1F2]/20 border-t-[#1DA1F2] animate-spin" />
        </div>
        <p className="text-sm text-white/30 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const allConnected = user.twitterConnected && user.githubConnected && user.leetCodeConnected;

  return (
    <div className="min-h-screen bg-[#0D1117]">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.015)_1px,_transparent_0)] bg-[size:28px_28px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-[#1DA1F2]/[0.03] rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0D1117]/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="relative">
              <div className="absolute inset-0 bg-[#1DA1F2] blur-md opacity-0 rounded-full group-hover:opacity-40 transition-opacity duration-300" />
              <img src="/icon.ico" alt="DevShare Logo" className="h-8 w-8 relative z-10 rounded-full ring-1 ring-white/10" />
            </div>
            <h1 className="text-lg font-display font-bold text-white tracking-tight">DevShare</h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white/40 hover:text-white hover:bg-white/[0.06] h-9 w-9 rounded-xl"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus:ring-2 focus:ring-[#1DA1F2]/40 rounded-full">
                  <Avatar className="h-9 w-9 ring-2 ring-[#1DA1F2]/20 hover:ring-[#1DA1F2]/40 transition-all cursor-pointer">
                    <AvatarImage src={dashboardData?.user?.avatar} alt={dashboardData?.user?.name || 'User'} />
                    <AvatarFallback className="bg-[#1DA1F2]/10 text-[#1DA1F2] text-sm font-bold">
                      {dashboardData?.user?.name?.charAt(0) || 'D'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-[#161B22] border-white/[0.08] text-white rounded-xl shadow-2xl shadow-black/50 p-1.5">
                <DropdownMenuItem
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer gap-2 py-2.5"
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer gap-2 py-2.5">
                    <CreditCard className="w-4 h-4" />
                    Show Cards
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="bg-[#161B22] border-white/[0.08] text-white rounded-xl shadow-2xl shadow-black/50 p-1.5">
                    <DropdownMenuItem
                      onClick={() => { setShowIntegrations(true); localStorage.setItem('show_integrations', 'true'); }}
                      className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer py-2.5"
                    >
                      Social Cards
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { setShowTestTweetButton(true); localStorage.setItem('show_test_tweet_button', 'true'); }}
                      className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer py-2.5"
                    >
                      Test Tweet
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => { setShowProgressStepper(true); localStorage.setItem('show_progress_stepper', 'true'); }}
                      className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer py-2.5"
                    >
                      Progress Card
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem
                  onClick={() => { setShowChallenges(true); localStorage.setItem('show_challenges', 'true'); }}
                  className="rounded-lg text-white/70 hover:text-white hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white cursor-pointer gap-2 py-2.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Challenges
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06] my-1" />
                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-lg text-[#E0245E]/80 hover:text-[#E0245E] hover:bg-[#E0245E]/[0.08] focus:bg-[#E0245E]/[0.08] focus:text-[#E0245E] cursor-pointer gap-2 py-2.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-display font-bold text-white tracking-tight">Dashboard</h2>
          <p className="text-white/30 text-sm mt-1 font-medium">
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

            {allConnected && (
              <>
                {dashboardData?.user && (
                  <ChallengeProgress
                    userId={dashboardData.user.id}
                    challengeId="ch_100_days_leetcode"
                    challengeTitle="100 Days of LeetCode"
                  />
                )}
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
                setShowProgressStepper(false);
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
            {showChallenges && (
              <ChallengesSection
                userId={dashboardData?.user.id}
                onHide={() => {
                  setShowChallenges(false);
                  localStorage.setItem('show_challenges', 'false');
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
