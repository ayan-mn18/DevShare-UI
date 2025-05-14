import React from 'react';
import Card from '../common/Card';
import { GitCommit, CheckCircle, Code, Award, Users, ExternalLink } from 'lucide-react';

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
  // Format date from ISO string to "X days ago"
  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Get contribution color based on count
  const getContributionColor = (value: number) => {
    if (value === 0) return 'bg-[#2C3640]';
    if (value <= 3) return 'bg-[#0E4C73]';
    if (value <= 6) return 'bg-[#1A78BD]';
    return 'bg-[#1DA1F2]';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        title="GitHub Activity"
        subtitle="Your recent contributions"
        rightContent={
          githubUsername && (
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#1DA1F2] hover:underline text-sm"
            >
              @{githubUsername}
              <ExternalLink size={14} className="ml-1" />
            </a>
          )
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Commits</p>
              <div className="flex items-center mt-1">
                <GitCommit size={16} className="text-[#1DA1F2] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {githubMetrics?.totalCommits || 0}
                </span>
              </div>
            </div>
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Streak</p>
              <div className="flex items-center mt-1">
                <GitCommit size={16} className="text-[#1DA1F2] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {githubMetrics?.streak || 0} days
                </span>
              </div>
            </div>
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Followers</p>
              <div className="flex items-center mt-1">
                <Users size={16} className="text-[#1DA1F2] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {githubMetrics?.followers || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[#8899A6] text-sm mb-2">Contribution Activity</p>
            <div className="flex gap-1">
              {githubMetrics?.contributions && githubMetrics.contributions.length > 0
                ? githubMetrics.contributions
                  .slice(0, 12)
                  .reverse()
                  .map((contrib, index) => (
                    <div
                      key={index}
                      className={`h-8 w-full ${getContributionColor(contrib.count)} rounded-sm tooltip`}
                      title={`${contrib.date}: ${contrib.count} contributions`}
                    />
                  ))
                : Array(12).fill(0).map((_, index) => (
                  <div
                    key={index}
                    className="h-8 w-full bg-[#2C3640] rounded-sm"
                  />
                ))
              }
            </div>
            <div className="flex justify-between text-xs text-[#8899A6] mt-1">
              <span>12 days ago</span>
              <span>Today</span>
            </div>
          </div>
        </div>
      </Card>

      <Card
        title="LeetCode Progress"
        subtitle="Your coding challenge stats"
        rightContent={
          leetcodeUsername && (
            <a
              href={`https://leetcode.com/u/${leetcodeUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#17BF63] hover:underline text-sm"
            >
              @{leetcodeUsername}
              <ExternalLink size={14} className="ml-1" />
            </a>
          )
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Solved</p>
              <div className="flex items-center mt-1">
                <CheckCircle size={16} className="text-[#17BF63] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {leetCodeMetrics?.totalSolved || 0}/{leetCodeMetrics?.totalQuestions || 0}
                </span>
              </div>
            </div>
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Streak</p>
              <div className="flex items-center mt-1">
                <CheckCircle size={16} className="text-[#17BF63] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {leetCodeMetrics?.streak || 0} days
                </span>
              </div>
            </div>
            <div className="bg-[#1C2732] p-3 rounded-lg">
              <p className="text-[#8899A6] text-sm">Rating</p>
              <div className="flex items-center mt-1">
                <Award size={16} className="text-[#17BF63] mr-2" />
                <span className="text-white text-lg font-semibold">
                  {leetCodeMetrics?.contestRating || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[#8899A6] text-sm mb-2">Recently Solved</p>
            <div className="space-y-2">
              {leetCodeMetrics?.recentSubmissions && leetCodeMetrics.recentSubmissions.length > 0
                ? leetCodeMetrics.recentSubmissions.slice(0, 3).map((problem, index) => (
                  <div key={index} className="bg-[#1C2732] p-2 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="text-white text-sm">{problem.title}</p>
                      <p className="text-xs text-[#8899A6]">{formatDate(problem.timestamp)}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${problem.difficulty === 'Easy'
                      ? 'bg-[#17BF63]/10 text-[#17BF63]'
                      : problem.difficulty === 'Medium'
                        ? 'bg-[#FFAD1F]/10 text-[#FFAD1F]'
                        : 'bg-[#E0245E]/10 text-[#E0245E]'
                      }`}>
                      {problem.difficulty}
                    </span>
                  </div>
                ))
                : (
                  <div className="bg-[#1C2732] p-2 rounded-lg">
                    <p className="text-[#8899A6] text-sm text-center">No recent submissions</p>
                  </div>
                )
              }
            </div>
            <div className="mt-3 text-center">
              <div className="inline-flex items-center bg-[#1C2732] px-3 py-1 rounded-full">
                <Code size={14} className="text-[#17BF63] mr-2" />
                <span className="text-white text-sm">
                  Level: {leetCodeMetrics?.level || 'Beginner'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContributionMetrics;