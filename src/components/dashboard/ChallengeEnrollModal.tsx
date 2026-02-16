// src/components/dashboard/ChallengeEnrollModal.tsx
import React, { useState } from 'react';
import { AlertTriangle, Trophy, Calendar, Target, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  duration_days: number;
  rules: any;
  failure_tweet_template: string;
}

interface ChallengeEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge;
  userId?: string;
  onEnrollSuccess: () => void;
}

const ChallengeEnrollModal: React.FC<ChallengeEnrollModalProps> = ({
  isOpen,
  onClose,
  challenge,
  userId,
  onEnrollSuccess,
}) => {
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleEnroll = async () => {
    if (!userId || !email || !agreedToTerms) return;
    setIsEnrolling(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/api/v1/challenges/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, challengeId: challenge.id, email }),
      });
      const result = await response.json();
      if (result.status === 'SUCCESS') {
        onEnrollSuccess();
        onClose();
      } else {
        console.error('Enrollment failed:', result.message);
      }
    } catch (error) {
      console.error('Error enrolling in challenge:', error);
    } finally {
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
            Review the challenge details below before committing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Challenge info */}
          <Card className="border-[#2C3640] bg-[#0D1117]/60">
            <CardContent className="p-4 space-y-4">
              <p className="text-[#8899A6] text-sm leading-relaxed">{challenge.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-[#1DA1F2]" />
                  <span className="text-white">{challenge.duration_days} Days</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Trophy size={14} className="text-[#FFAD1F]" />
                  <span className="text-white">Daily Challenge</span>
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
            <Label htmlFor="standalone-enroll-email" className="text-sm font-medium text-white">
              Email Address
              <span className="text-[#657786] font-normal ml-1">(for notifications)</span>
            </Label>
            <Input
              id="standalone-enroll-email"
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
              id="standalone-agree-terms"
              checked={agreedToTerms}
              onCheckedChange={(v) => setAgreedToTerms(v as boolean)}
              className="mt-0.5 border-[#38444D] data-[state=checked]:bg-[#1DA1F2] data-[state=checked]:border-[#1DA1F2]"
            />
            <Label htmlFor="standalone-agree-terms" className="text-sm text-[#8899A6] leading-relaxed cursor-pointer">
              I understand that failing to complete daily tasks will result in automatic embarrassing tweets
              and email notifications.
            </Label>
          </div>
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

export default ChallengeEnrollModal;
