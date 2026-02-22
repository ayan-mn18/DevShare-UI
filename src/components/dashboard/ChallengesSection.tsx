// src/components/dashboard/ChallengesSection.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Trophy, Target, Calendar, Users, AlertTriangle, X, CheckCircle, Flame, ArrowRight } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_days: number;
  rules: any;
  failure_tweet_template: string;
  participant_count?: number;
}

interface UserChallenge {
  id: string;
  challenge_id: string;
  start_date: string;
  current_streak: number;
  max_streak: number;
  is_completed: boolean;
  challenge: Challenge;
}

interface ChallengesSectionProps {
  userId?: string;
  onHide?: () => void;
}

// Dummy data (kept for dev/testing)
const dummyChallenges: Challenge[] = [
  {
    id: '1',
    title: '100 Days of LeetCode Challenge',
    description: 'Solve at least 1 LeetCode problem every day for 100 consecutive days. Build consistency and improve your problem-solving skills!',
    type: '100_days_leetcode',
    duration_days: 100,
    rules: { min_problems_per_day: 1, allows_rest_days: false },
    failure_tweet_template: 'Day {day} of my #100DaysOfLeetCode challenge and I failed to solve any problems 😅 Accountability is real! Back to grinding tomorrow 💪 #leetcode #challenge #failed',
    participant_count: 1247
  },
  {
    id: '2',
    title: 'Daily LeetCode + GitHub Challenge',
    description: 'Commit to both solving LeetCode problems AND making GitHub contributions daily. Double the grind, double the growth!',
    type: 'daily_leetcode_github',
    duration_days: 30,
    rules: { min_problems_per_day: 1, min_commits_per_day: 1 },
    failure_tweet_template: 'Failed my daily LeetCode + GitHub challenge today 😬 Either my code or my commits were missing! The grind continues tomorrow 🔥 #100DaysOfCode #accountability',
    participant_count: 834
  },
  {
    id: '3',
    title: '30 Days System Design',
    description: 'Study system design concepts daily for 30 days. From basics to advanced topics, level up your system thinking!',
    type: 'system_design',
    duration_days: 30,
    rules: { min_study_hours: 1 },
    failure_tweet_template: 'Skipped my system design study today 🤦‍♂️ My distributed systems knowledge is still... distributed 😅 #SystemDesign #LearningInPublic',
    participant_count: 567
  }
];

const dummyUserChallenges: UserChallenge[] = [
  {
    id: 'uc1',
    challenge_id: '1',
    start_date: '2024-01-15',
    current_streak: 23,
    max_streak: 23,
    is_completed: false,
    challenge: dummyChallenges[0]
  }
];

const useDummyData = false;

/* ───────────────────────────────────────────────
   Challenge Enrollment Modal (inline)
─────────────────────────────────────────────── */
interface ChallengeEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  onEnrollSuccess: () => void;
}

const ChallengeEnrollModal: React.FC<ChallengeEnrollModalProps> = ({
  isOpen,
  onClose,
  challenge,
  onEnrollSuccess,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async () => {
    if (!email || !agreedToTerms) return;
    setIsEnrolling(true);
    setError(null);
    try {
      if (useDummyData) {
        setTimeout(() => {
          setIsEnrolling(false);
          onEnrollSuccess();
          onClose();
        }, 2000);
        return;
      }
      const userId = localStorage.getItem('user_id');
      if (!userId) throw new Error('User not logged in');
      const res = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/challenges/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, challengeId: challenge.id, email }),
      });
      const result = await res.json();
      if (!res.ok || result.status !== 'SUCCESS') {
        throw new Error(result.message || 'Failed to enroll');
      }
      setIsEnrolling(false);
      onEnrollSuccess();
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to enroll');
      setIsEnrolling(false);
    }
  };

  const getRulesDisplay = () => {
    const rules = challenge.rules;
    const reqs: string[] = [];
    if (rules.min_problems_per_day)
      reqs.push(`Solve at least ${rules.min_problems_per_day} LeetCode problem(s) daily`);
    if (rules.min_commits_per_day)
      reqs.push(`Make at least ${rules.min_commits_per_day} GitHub commit(s) daily`);
    if (rules.min_study_hours)
      reqs.push(`Study for at least ${rules.min_study_hours} hour(s) daily`);
    return reqs;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#192734] border-[#2C3640] text-white max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold text-white flex items-center gap-2">
            <Trophy size={18} className="text-[#FFAD1F]" />
            {challenge.title}
          </DialogTitle>
          <DialogDescription className="text-[#8899A6] text-sm">
            Review the challenge details and commit to your journey.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Challenge info card */}
          <Card className="border-[#2C3640] bg-[#0D1117]/60">
            <CardContent className="p-4 space-y-4">
              <p className="text-[#8899A6] text-sm leading-relaxed">{challenge.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[#1DA1F2]" />
                  <span className="text-white">{challenge.duration_days} Days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users size={14} className="text-[#17BF63]" />
                  <span className="text-white">{challenge.participant_count?.toLocaleString()} Participants</span>
                </div>
              </div>

              <Separator className="bg-[#2C3640]" />

              <div className="space-y-2">
                <h4 className="text-white font-medium text-sm flex items-center gap-2">
                  <Target size={14} className="text-[#1DA1F2]" />
                  Daily Requirements
                </h4>
                <ul className="space-y-1.5 ml-1">
                  {getRulesDisplay().map((rule, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#8899A6]">
                      <div className="w-1 h-1 rounded-full bg-[#1DA1F2] mt-2 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <div className="rounded-xl border border-[#FFAD1F]/30 bg-[#FFAD1F]/5 p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-[#FFAD1F]/10 flex-shrink-0">
                <AlertTriangle size={16} className="text-[#FFAD1F]" />
              </div>
              <div className="space-y-2">
                <h4 className="text-[#FFAD1F] font-semibold text-sm">Challenge Commitment Warning</h4>
                <p className="text-[#FFAD1F]/80 text-sm leading-relaxed">
                  Once you enroll, there's no turning back! If you fail to complete the daily task,
                  an embarrassing tweet will be automatically posted.
                </p>
                <div className="bg-[#0D1117]/60 rounded-lg p-3 border border-[#2C3640]">
                  <p className="text-[#657786] text-xs italic leading-relaxed">
                    Example failure tweet: "{challenge.failure_tweet_template?.replace('{day}', 'X')}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="enroll-email" className="text-sm font-medium text-white">
              Email Address
              <span className="text-[#657786] font-normal ml-1">(for notifications)</span>
            </Label>
            <Input
              id="enroll-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              className="bg-[#0D1117]/80 border-[#2C3640] text-white placeholder:text-[#657786] focus-visible:ring-[#1DA1F2] focus-visible:border-[#1DA1F2] rounded-xl h-11"
            />
          </div>

          {/* Terms */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="agree-challenge-terms"
              checked={agreedToTerms}
              onCheckedChange={(v) => setAgreedToTerms(v as boolean)}
              className="mt-0.5 border-[#38444D] data-[state=checked]:bg-[#1DA1F2] data-[state=checked]:border-[#1DA1F2]"
            />
            <Label htmlFor="agree-challenge-terms" className="text-sm text-[#8899A6] leading-relaxed cursor-pointer">
              I understand that failing to complete daily tasks will result in automatic embarrassing tweets
              and email notifications. I commit to this challenge knowing the consequences.
            </Label>
          </div>

          {error && (
            <p className="text-[#E0245E] text-sm bg-[#E0245E]/10 rounded-lg px-3 py-2">{error}</p>
          )}
        </div>

        <DialogFooter className="flex-row gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-[#38444D] bg-transparent text-[#8899A6] hover:bg-[#253341] hover:text-white rounded-xl h-11"
          >
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            disabled={!email || !agreedToTerms || isEnrolling}
            className="flex-1 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-xl h-11 font-medium disabled:opacity-40"
          >
            {isEnrolling ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
                Enrolling…
              </>
            ) : (
              <>
                <Flame size={16} className="mr-2" />
                Enroll in Challenge
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ───────────────────────────────────────────────
   Main ChallengesSection Component
─────────────────────────────────────────────── */
const ChallengesSection: React.FC<ChallengesSectionProps> = ({ userId, onHide }) => {
  const [challenges, setChallenges] = useState<Challenge[]>(useDummyData ? dummyChallenges : []);
  const [userChallenges, setUserChallenges] = useState<UserChallenge[]>(useDummyData ? dummyUserChallenges : []);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (useDummyData) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res1 = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/challenges`);
        const data1 = await res1.json();
        if (res1.ok && data1.status === 'SUCCESS') setChallenges(data1.data);

        const uid = userId || localStorage.getItem('user_id');
        if (uid) {
          const res2 = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/challenges/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: uid }),
          });
          const data2 = await res2.json();
          if (res2.ok && data2.status === 'SUCCESS') setUserChallenges(data2.data);
        }
      } catch {
        setChallenges(dummyChallenges);
        setUserChallenges(dummyUserChallenges);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleChallengeClick = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setIsEnrollModalOpen(true);
  };

  const handleEnrollSuccess = () => {
    setIsEnrollModalOpen(false);
    if (!useDummyData) {
      const uid = userId || localStorage.getItem('user_id');
      if (uid) {
        fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/challenges/user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: uid }),
        })
          .then((r) => r.json())
          .then((d) => { if (d.status === 'SUCCESS') setUserChallenges(d.data); });
      }
    }
  };

  const isUserEnrolled = (challengeId: string) =>
    userChallenges.some((uc) => uc.challenge_id === challengeId && !uc.is_completed);

  const getDaysElapsed = (startDate: string) =>
    Math.floor((new Date().getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="relative">
      <Card className="border-[#2C3640] bg-[#192734]/80 backdrop-blur-sm overflow-hidden">
        {/* Top accent line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FFAD1F]/40 to-transparent" />

        {onHide && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onHide}
            className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg bg-[#E0245E]/90 text-white hover:bg-[#E0245E] hover:text-white"
          >
            <X size={14} />
          </Button>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between pr-10">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#FFAD1F]/10">
                <Trophy size={18} className="text-[#FFAD1F]" />
              </div>
              <div>
                <CardTitle className="text-base font-display font-bold text-white tracking-tight">
                  Coding Challenges
                </CardTitle>
                <CardDescription className="text-[#657786] text-xs mt-0.5">
                  Join challenges to level up your coding journey
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="border-[#38444D] text-[#8899A6] bg-transparent text-xs">
              <Users size={12} className="mr-1" />
              {userChallenges.length} Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-2 space-y-5">
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-6 h-6 rounded-full border-2 border-[#38444D] border-t-[#1DA1F2] animate-spin mx-auto mb-3" />
              <p className="text-[#657786] text-sm">Loading challenges…</p>
            </div>
          ) : (
            <>
              {/* ─── Active Challenges ─── */}
              {userChallenges.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#657786]">
                    Your Active Challenges
                  </h4>
                  {userChallenges.map((uc) => {
                    const elapsed = getDaysElapsed(uc.start_date);
                    const pct = Math.min((elapsed / uc.challenge.duration_days) * 100, 100);

                    return (
                      <Card key={uc.id} className="border-[#2C3640] bg-[#0D1117]/50">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-sm font-semibold text-white">{uc.challenge.title}</h5>
                            {uc.is_completed ? (
                              <Badge className="bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20 text-xs gap-1">
                                <CheckCircle size={12} />
                                Completed
                              </Badge>
                            ) : (
                              <Badge className="bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/20 text-xs font-mono">
                                Day {elapsed}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-[#8899A6]">
                            <span className="flex items-center gap-1">
                              <Target size={12} />
                              Current: {uc.current_streak}d
                            </span>
                            <span className="flex items-center gap-1">
                              <Trophy size={12} className="text-[#FFAD1F]" />
                              Best: {uc.max_streak}d
                            </span>
                            {uc.challenge.rules?.allows_rest_days && (
                              <span className="flex items-center gap-1 text-[#17BF63]">
                                <Calendar size={12} />
                                Rest days allowed
                              </span>
                            )}
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1">
                            <Progress value={pct} className="h-1.5 bg-[#2C3640]" />
                            <div className="flex justify-between text-[10px] text-[#657786] font-mono tabular-nums">
                              <span>Day {elapsed}</span>
                              <span>{uc.challenge.duration_days}d total</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* ─── Available Challenges ─── */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#657786]">
                  Available Challenges
                </h4>

                <div className="grid gap-3">
                  {challenges.map((challenge) => {
                    const enrolled = isUserEnrolled(challenge.id);

                    return (
                      <button
                        key={challenge.id}
                        disabled={enrolled}
                        onClick={() => handleChallengeClick(challenge)}
                        className={`w-full text-left rounded-xl border p-4 transition-all duration-200 group ${
                          enrolled
                            ? 'border-[#1DA1F2]/30 bg-[#0D1117]/40 opacity-50 cursor-not-allowed'
                            : 'border-[#2C3640] bg-[#0D1117]/40 hover:border-[#1DA1F2]/50 hover:bg-[#0D1117]/80 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <Trophy size={14} className="text-[#FFAD1F] flex-shrink-0" />
                              <h5 className="text-sm font-semibold text-white">{challenge.title}</h5>
                            </div>
                            <p className="text-[#8899A6] text-xs leading-relaxed line-clamp-2">
                              {challenge.description}
                            </p>
                            <div className="flex items-center gap-4 text-[11px] text-[#657786]">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} />
                                {challenge.duration_days}d
                              </span>
                              <span className="flex items-center gap-1">
                                <Users size={11} />
                                {challenge.participant_count?.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {enrolled ? (
                            <Badge className="bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20 text-xs gap-1 flex-shrink-0">
                              <CheckCircle size={12} />
                              Enrolled
                            </Badge>
                          ) : (
                            <ArrowRight
                              size={16}
                              className="text-[#38444D] group-hover:text-[#1DA1F2] transition-colors mt-1 flex-shrink-0"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Enrollment Modal */}
      {selectedChallenge && (
        <ChallengeEnrollModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          challenge={selectedChallenge}
          onEnrollSuccess={handleEnrollSuccess}
        />
      )}
    </div>
  );
};

export default ChallengesSection;
