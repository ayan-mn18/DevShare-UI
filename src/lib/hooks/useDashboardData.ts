import { useQuery, useQueryClient } from '@tanstack/react-query';

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

const fetchDashboardData = async (userId: string): Promise<DashboardData> => {
  const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/dashboard/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error('Failed to fetch dashboard data');

  const result = await response.json();
  if (result.status === 'SUCCESS' && result.data) {
    // Cache in localStorage as a fallback
    localStorage.setItem('dashboard_data', JSON.stringify(result.data));
    return result.data;
  }
  throw new Error('Invalid dashboard response');
};

export function useDashboardData(userId: string | null) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => fetchDashboardData(userId!),
    enabled: !!userId,
    placeholderData: () => {
      // Use localStorage as placeholder while fetching
      const stored = localStorage.getItem('dashboard_data');
      if (stored) {
        try {
          return JSON.parse(stored) as DashboardData;
        } catch {
          return undefined;
        }
      }
      return undefined;
    },
  });

  const refresh = () => {
    localStorage.removeItem('dashboard_data');
    localStorage.removeItem('tweets');
    queryClient.invalidateQueries({ queryKey: ['dashboard', userId] });
  };

  return { ...query, refresh };
}

export type { DashboardData };
