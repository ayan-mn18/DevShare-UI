import React from 'react';
import { GitCommit, CheckCircle, Code, Award, Users, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface GithubMetrics {
  contributions: Array<{ date: string; count: number }>;
  totalCommits: number;
  streak: number;
  followers: number;
}

interface LeetCodeMetrics {
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
}

interface ContributionMetricsProps {
  githubMetrics: GithubMetrics | null;
  leetCodeMetrics: LeetCodeMetrics | null;
  githubUsername?: string;
  leetcodeUsername?: string;
}

const ContributionMetrics: React.FC<ContributionMetricsProps> = ({
  githubMetrics,
  leetCodeMetrics,
  githubUsername,
  leetcodeUsername
}) => {
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getContributionColor = (value: number) => {
    if (value === 0) return 'bg-white/[0.03]';
    if (value <= 3) return 'bg-[#1DA1F2]/30';
    if (value <= 6) return 'bg-[#1DA1F2]/60';
    return 'bg-[#1DA1F2]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* GitHub Activity Card */}
      <Card className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-white">GitHub Activity</CardTitle>
              <CardDescription className="text-white/25 text-xs mt-0.5">Your recent contributions</CardDescription>
            </div>
            {githubUsername && (
              <a
                href={`https://github.com/${githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#1DA1F2] hover:underline text-xs font-medium gap-1 group"
              >
                @{githubUsername}
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Commits', icon: <GitCommit className="w-4 h-4 text-[#1DA1F2]" />, value: githubMetrics?.totalCommits || 0 },
              { label: 'Streak', icon: <GitCommit className="w-4 h-4 text-[#1DA1F2]" />, value: `${githubMetrics?.streak || 0} days` },
              { label: 'Followers', icon: <Users className="w-4 h-4 text-[#1DA1F2]" />, value: githubMetrics?.followers || 0 },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                <p className="text-white/25 text-xs font-medium mb-1.5">{stat.label}</p>
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-white font-bold text-sm">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-white/25 text-xs font-medium mb-2.5">Contribution Activity</p>
            <div className="flex gap-1">
              {githubMetrics?.contributions && githubMetrics.contributions.length > 0
                ? githubMetrics.contributions
                  .slice(0, 12)
                  .reverse()
                  .map((contrib, index) => (
                    <div
                      key={index}
                      className={`h-8 w-full ${getContributionColor(contrib.count)} rounded-md tooltip transition-colors`}
                      title={`${contrib.date}: ${contrib.count} contributions`}
                    />
                  ))
                : Array(12).fill(0).map((_, index) => (
                  <div key={index} className="h-8 w-full bg-white/[0.03] rounded-md" />
                ))
              }
            </div>
            <div className="flex justify-between text-[10px] text-white/15 mt-1.5 font-medium">
              <span>12 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* LeetCode Progress Card */}
      <Card className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-white">LeetCode Progress</CardTitle>
              <CardDescription className="text-white/25 text-xs mt-0.5">Your coding challenge stats</CardDescription>
            </div>
            {leetcodeUsername && (
              <a
                href={`https://leetcode.com/u/${leetcodeUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-[#17BF63] hover:underline text-xs font-medium gap-1 group"
              >
                @{leetcodeUsername}
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Solved', icon: <CheckCircle className="w-4 h-4 text-[#17BF63]" />, value: `${leetCodeMetrics?.totalSolved || 0}/${leetCodeMetrics?.totalQuestions || 0}` },
              { label: 'Streak', icon: <CheckCircle className="w-4 h-4 text-[#17BF63]" />, value: `${leetCodeMetrics?.streak || 0} days` },
              { label: 'Rating', icon: <Award className="w-4 h-4 text-[#17BF63]" />, value: leetCodeMetrics?.contestRating || 0 },
            ].map((stat, i) => (
              <div key={i} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.04]">
                <p className="text-white/25 text-xs font-medium mb-1.5">{stat.label}</p>
                <div className="flex items-center gap-2">
                  {stat.icon}
                  <span className="text-white font-bold text-sm">{stat.value}</span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-white/25 text-xs font-medium mb-2.5">Recently Solved</p>
            <div className="space-y-2">
              {leetCodeMetrics?.recentSubmissions && leetCodeMetrics.recentSubmissions.length > 0
                ? leetCodeMetrics.recentSubmissions.slice(0, 3).map((problem, index) => (
                  <div key={index} className="bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.04] flex justify-between items-center group hover:border-white/[0.08] transition-colors">
                    <div>
                      <p className="text-white text-sm font-medium">{problem.title}</p>
                      <p className="text-[10px] text-white/20 mt-0.5">{formatDate(problem.timestamp)}</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        problem.difficulty === 'Easy'
                          ? 'border-[#17BF63]/20 text-[#17BF63] bg-[#17BF63]/5'
                          : problem.difficulty === 'Medium'
                            ? 'border-[#FFAD1F]/20 text-[#FFAD1F] bg-[#FFAD1F]/5'
                            : 'border-[#E0245E]/20 text-[#E0245E] bg-[#E0245E]/5'
                      }`}
                    >
                      {problem.difficulty}
                    </Badge>
                  </div>
                ))
                : (
                  <div className="bg-white/[0.03] p-3 rounded-xl border border-white/[0.04]">
                    <p className="text-white/20 text-sm text-center">No recent submissions</p>
                  </div>
                )
              }
            </div>
            <div className="mt-3 text-center">
              <Badge variant="outline" className="border-white/[0.08] bg-white/[0.03] text-white/60 rounded-full gap-1.5">
                <Code className="w-3 h-3 text-[#17BF63]" />
                Level: {leetCodeMetrics?.level || 'Beginner'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContributionMetrics;
