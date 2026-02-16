// components/dashboard/ChallengeProgress.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, ExternalLink, Code, GitCommit, Trophy, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

interface LeetCodeSubmission {
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timestamp: string;
}

interface DailyProgress {
  id: string;
  date: string;
  day_number: number;
  leetcode_submissions: LeetCodeSubmission[];
  github_commits: number;
  tweet_posted: boolean;
  tweet_url?: string;
  tweet_content?: string;
  created_at: string;
}

interface ChallengeProgressProps {
  userId: string;
  challengeId: string;
  challengeTitle: string;
}

const useDummyData = false;

const DUMMY_PROGRESS_DATA: DailyProgress[] = [
  {
    id: 'd1', date: '2024-01-15', day_number: 1,
    leetcode_submissions: [
      { title: 'Two Sum', difficulty: 'Easy', timestamp: '2024-01-15T14:30:00.000Z' },
      { title: 'Add Two Numbers', difficulty: 'Medium', timestamp: '2024-01-15T16:45:00.000Z' },
    ],
    github_commits: 3, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/1',
    tweet_content: 'Day 1/100 of #100DaysOfLeetCode ✅ Crushed it! 🚀 #DevShare',
    created_at: '2024-01-15T23:00:00.000Z',
  },
  {
    id: 'd2', date: '2024-01-16', day_number: 2,
    leetcode_submissions: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', timestamp: '2024-01-16T15:20:00.000Z' },
    ],
    github_commits: 1, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/2',
    tweet_content: 'Day 2/100 grinding strong! 💪 #100DaysOfLeetCode #DevShare',
    created_at: '2024-01-16T23:00:00.000Z',
  },
  {
    id: 'd3', date: '2024-01-17', day_number: 3,
    leetcode_submissions: [
      { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', timestamp: '2024-01-17T13:15:00.000Z' },
      { title: 'Palindromic Substrings', difficulty: 'Medium', timestamp: '2024-01-17T17:30:00.000Z' },
      { title: 'Valid Palindrome', difficulty: 'Easy', timestamp: '2024-01-17T19:45:00.000Z' },
    ],
    github_commits: 5, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/3',
    tweet_content: 'Day 3/100 was INSANE! 🔥 Solved 3 problems! #100DaysOfLeetCode #DevShare',
    created_at: '2024-01-17T23:00:00.000Z',
  },
  {
    id: 'd4', date: '2024-01-18', day_number: 4,
    leetcode_submissions: [
      { title: 'Container With Most Water', difficulty: 'Medium', timestamp: '2024-01-18T16:00:00.000Z' },
    ],
    github_commits: 2, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/4',
    tweet_content: 'Day 4/100 ✅ Consistency > perfection #100DaysOfLeetCode #DevShare',
    created_at: '2024-01-18T23:00:00.000Z',
  },
  {
    id: 'd5', date: '2024-01-19', day_number: 5,
    leetcode_submissions: [
      { title: '3Sum', difficulty: 'Medium', timestamp: '2024-01-19T14:45:00.000Z' },
      { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', timestamp: '2024-01-19T18:20:00.000Z' },
    ],
    github_commits: 4, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/5',
    tweet_content: "Day 5/100 💪 Every day I'm getting sharper! #100DaysOfLeetCode #DevShare",
    created_at: '2024-01-19T23:00:00.000Z',
  },
  {
    id: 'd6', date: '2024-01-20', day_number: 6,
    leetcode_submissions: [
      { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', timestamp: '2024-01-20T10:15:00.000Z' },
      { title: 'Maximum Subarray', difficulty: 'Easy', timestamp: '2024-01-20T14:30:00.000Z' },
      { title: 'Climbing Stairs', difficulty: 'Easy', timestamp: '2024-01-20T17:45:00.000Z' },
    ],
    github_commits: 6, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/6',
    tweet_content: 'Day 6/100 🎯 Triple threat! #100DaysOfLeetCode #DevShare',
    created_at: '2024-01-20T23:00:00.000Z',
  },
  {
    id: 'd7', date: '2024-01-21', day_number: 7,
    leetcode_submissions: [
      { title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', timestamp: '2024-01-21T11:00:00.000Z' },
    ],
    github_commits: 2, tweet_posted: true,
    tweet_url: 'https://twitter.com/username/status/7',
    tweet_content: 'Week 1 COMPLETE! 🎉 Consistency is everything 💪 #100DaysOfLeetCode #DevShare',
    created_at: '2024-01-21T23:00:00.000Z',
  },
];

const difficultyConfig = {
  Easy: { color: 'text-[#17BF63]', bg: 'bg-[#17BF63]/10', border: 'border-[#17BF63]/20', dot: 'bg-[#17BF63]' },
  Medium: { color: 'text-[#FFAD1F]', bg: 'bg-[#FFAD1F]/10', border: 'border-[#FFAD1F]/20', dot: 'bg-[#FFAD1F]' },
  Hard: { color: 'text-[#E0245E]', bg: 'bg-[#E0245E]/10', border: 'border-[#E0245E]/20', dot: 'bg-[#E0245E]' },
} as const;

const ChallengeProgress: React.FC<ChallengeProgressProps> = ({ userId, challengeId, challengeTitle }) => {
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DailyProgress | null>(null);

  useEffect(() => {
    if (useDummyData) {
      const timer = setTimeout(() => { setProgress(DUMMY_PROGRESS_DATA); setLoading(false); }, 1000);
      return () => clearTimeout(timer);
    }
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/challenges/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, challengeId }),
        });
        const result = await res.json();
        if (res.ok && result.status === 'SUCCESS' && Array.isArray(result.data)) setProgress(result.data);
        else setProgress([]);
      } catch { setProgress([]); }
      finally { setLoading(false); }
    };
    fetchProgress();
  }, [userId, challengeId]);

  // Stats
  const totalDays = progress.length;
  const totalProblems = progress.reduce((s, d) => s + d.leetcode_submissions.length, 0);
  const totalCommits = progress.reduce((s, d) => s + d.github_commits, 0);
  const tweetsPosted = progress.filter((d) => d.tweet_posted).length;

  const difficultyStats = progress.reduce((acc, day) => {
    day.leetcode_submissions.forEach((sub) => { acc[sub.difficulty] = (acc[sub.difficulty] || 0) + 1; });
    return acc;
  }, {} as Record<string, number>);

  const chartData = progress.map((day) => ({
    day: day.day_number,
    problems: day.leetcode_submissions.length,
    commits: day.github_commits,
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  if (loading) {
    return (
      <Card className="border-[#2C3640] bg-[#192734]/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-[#2C3640] rounded-lg w-1/3" />
            <div className="h-32 bg-[#2C3640] rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    { label: 'Days Active', value: totalDays, color: 'text-[#1DA1F2]', accent: 'bg-[#1DA1F2]' },
    { label: 'Problems Solved', value: totalProblems, color: 'text-[#17BF63]', accent: 'bg-[#17BF63]' },
    { label: 'Git Commits', value: totalCommits, color: 'text-[#FFAD1F]', accent: 'bg-[#FFAD1F]' },
    { label: 'Tweets Posted', value: tweetsPosted, color: 'text-[#E0245E]', accent: 'bg-[#E0245E]' },
  ];

  const tooltipStyle = {
    backgroundColor: '#192734',
    border: '1px solid #2C3640',
    borderRadius: '12px',
    color: '#FFFFFF',
    fontSize: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
  };

  return (
    <Card className="border-[#2C3640] bg-[#192734]/80 backdrop-blur-sm overflow-hidden">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-[#1DA1F2]/15 via-[#1DA1F2]/8 to-transparent p-6 border-b border-[#2C3640]">
        <div className="absolute inset-0 bg-[#192734]/40" />
        <div className="relative">
          <h2 className="text-lg font-display font-bold text-white mb-2 tracking-tight">
            {challengeTitle}
          </h2>
          <div className="flex items-center gap-5 text-sm text-[#8899A6]">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-[#1DA1F2]" />
              {totalDays} days
            </span>
            <span className="flex items-center gap-1.5">
              <Code size={14} className="text-[#17BF63]" />
              {totalProblems} problems
            </span>
            <span className="flex items-center gap-1.5">
              <GitCommit size={14} className="text-[#FFAD1F]" />
              {totalCommits} commits
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b border-[#2C3640] bg-transparent h-auto p-0">
          {[
            { value: 'overview', label: 'Overview', icon: TrendingUp },
            { value: 'daily', label: 'Daily Progress', icon: Calendar },
            { value: 'stats', label: 'Statistics', icon: Trophy },
          ].map(({ value, label, icon: Icon }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="rounded-none border-b-2 border-transparent px-5 py-3.5 text-sm font-medium text-[#657786] transition-all data-[state=active]:border-[#1DA1F2] data-[state=active]:text-[#1DA1F2] data-[state=active]:bg-[#1DA1F2]/5 data-[state=active]:shadow-none hover:text-white hover:bg-[#253341]/50 gap-2"
            >
              <Icon size={14} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ─── Overview Tab ─── */}
        <TabsContent value="overview" className="p-6 space-y-6 mt-0">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-xl bg-[#0D1117]/60 border border-[#2C3640] p-4 text-center overflow-hidden group"
              >
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${stat.accent} opacity-30`} />
                <div className={`text-2xl font-display font-bold ${stat.color} tabular-nums`}>
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#657786] mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <Card className="border-[#2C3640] bg-[#0D1117]/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Daily Activity</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C3640" />
                  <XAxis dataKey="date" stroke="#657786" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#657786" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="problems" stroke="#17BF63" strokeWidth={2} dot={{ r: 3, fill: '#17BF63' }} name="Problems" />
                  <Line type="monotone" dataKey="commits" stroke="#FFAD1F" strokeWidth={2} dot={{ r: 3, fill: '#FFAD1F' }} name="Commits" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── Daily Progress Tab ─── */}
        <TabsContent value="daily" className="p-6 mt-0">
          <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1 custom-scrollbar">
            {progress.map((day) => (
              <button
                key={day.id}
                onClick={() => setSelectedDay(selectedDay?.id === day.id ? null : day)}
                className="w-full text-left rounded-xl border border-[#2C3640] bg-[#0D1117]/50 p-4 hover:border-[#1DA1F2]/40 transition-all duration-200 group"
              >
                {/* Day header */}
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2] font-display font-bold text-sm">
                      {day.day_number}
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-white">Day {day.day_number}</span>
                      <p className="text-[11px] text-[#657786]">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-[#17BF63] tabular-nums">{day.leetcode_submissions.length}</div>
                      <div className="text-[10px] text-[#657786]">Problems</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-[#FFAD1F] tabular-nums">{day.github_commits}</div>
                      <div className="text-[10px] text-[#657786]">Commits</div>
                    </div>
                    {day.tweet_posted && day.tweet_url && (
                      <a
                        href={day.tweet_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 transition-colors"
                      >
                        <ExternalLink size={12} className="text-[#1DA1F2]" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Expanded details */}
                {selectedDay?.id === day.id && (
                  <div className="mt-4 pt-4 border-t border-[#2C3640] space-y-4">
                    {/* Problems */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-[#657786]">
                        Problems Solved
                      </h4>
                      <div className="space-y-1.5">
                        {day.leetcode_submissions.map((problem, idx) => {
                          const cfg = difficultyConfig[problem.difficulty];
                          return (
                            <div key={idx} className="flex items-center justify-between bg-[#192734]/80 rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                <span className="text-sm text-white">{problem.title}</span>
                                <Badge variant="outline" className={`${cfg.bg} ${cfg.color} ${cfg.border} text-[10px] px-1.5 py-0`}>
                                  {problem.difficulty}
                                </Badge>
                              </div>
                              <span className="text-[11px] text-[#657786] font-mono tabular-nums">
                                {new Date(problem.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tweet */}
                    {day.tweet_content && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#657786]">
                          Auto-Generated Tweet
                        </h4>
                        <div className="bg-[#192734]/80 rounded-lg p-3.5 border-l-2 border-[#1DA1F2]">
                          <p className="text-[#8899A6] text-sm leading-relaxed">{day.tweet_content}</p>
                          {day.tweet_url && (
                            <a
                              href={day.tweet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-[#1DA1F2] hover:text-[#5DA9E6] text-xs font-medium"
                            >
                              View Tweet <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        {/* ─── Statistics Tab ─── */}
        <TabsContent value="stats" className="p-6 space-y-6 mt-0">
          {/* Difficulty distribution chart */}
          <Card className="border-[#2C3640] bg-[#0D1117]/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-white">Problem Difficulty Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={[
                    { name: 'Easy', count: difficultyStats.Easy || 0, fill: '#17BF63' },
                    { name: 'Medium', count: difficultyStats.Medium || 0, fill: '#FFAD1F' },
                    { name: 'Hard', count: difficultyStats.Hard || 0, fill: '#E0245E' },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#2C3640" />
                  <XAxis dataKey="name" stroke="#657786" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#657786" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Extra stats */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="border-[#2C3640] bg-[#0D1117]/40">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-sm font-semibold text-white">Average per Day</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#657786]">Problems</span>
                    <span className="text-white font-mono tabular-nums">{(totalProblems / totalDays || 0).toFixed(1)}</span>
                  </div>
                  <Separator className="bg-[#2C3640]" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#657786]">Commits</span>
                    <span className="text-white font-mono tabular-nums">{(totalCommits / totalDays || 0).toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#2C3640] bg-[#0D1117]/40">
              <CardContent className="p-4 space-y-3">
                <h4 className="text-sm font-semibold text-white">Consistency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#657786]">Tweet Rate</span>
                    <span className="text-white font-mono tabular-nums">{Math.round((tweetsPosted / totalDays) * 100 || 0)}%</span>
                  </div>
                  <Separator className="bg-[#2C3640]" />
                  <div className="flex justify-between text-sm">
                    <span className="text-[#657786]">Current Streak</span>
                    <span className="text-white font-mono tabular-nums">{totalDays}d</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default ChallengeProgress;
