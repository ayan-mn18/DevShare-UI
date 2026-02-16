import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Circle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProgressStepperProps {
  disabled?: boolean;
  onHide?: () => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ disabled, onHide }) => {
  if (disabled) return null;

  const { user } = useAuth();

  const steps = [
    { id: 'twitter', label: 'Connect X (Twitter)', completed: user?.twitterConnected || false },
    { id: 'email', label: 'Add Email', completed: !!user?.email },
    { id: 'github', label: 'Connect GitHub', completed: user?.githubConnected || false },
    { id: 'leetcode', label: 'Connect LeetCode', completed: user?.leetCodeConnected || false },
  ];

  const currentStep = steps.findIndex(step => !step.completed);
  const completedCount = steps.filter(s => s.completed).length;
  const progress = Math.round((completedCount / steps.length) * 100);

  return (
    <Card className="relative border-[#2C3640] bg-[#192734]/80 backdrop-blur-sm overflow-hidden group">
      {/* Subtle gradient accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#1DA1F2]/40 to-transparent" />

      {onHide && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onHide}
          className="absolute top-2.5 right-2.5 z-10 h-7 w-7 rounded-lg bg-[#E0245E]/90 text-white hover:bg-[#E0245E] hover:text-white transition-colors"
        >
          <X size={14} />
        </Button>
      )}

      <CardHeader className="pb-3 pt-4 px-5">
        <div className="flex items-center justify-between pr-8">
          <CardTitle className="text-[15px] font-semibold text-white font-display tracking-tight">
            Onboarding Progress
          </CardTitle>
          <Badge
            variant="secondary"
            className={`text-xs font-mono tabular-nums px-2 py-0.5 ${
              progress === 100
                ? 'bg-[#17BF63]/15 text-[#17BF63] border-[#17BF63]/20'
                : 'bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/20'
            }`}
          >
            {progress}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        {/* Progress bar */}
        <div className="relative">
          <Progress
            value={progress}
            className="h-1.5 bg-[#2C3640]"
          />
          {/* Glow effect on progress */}
          <div
            className="absolute top-0 left-0 h-1.5 rounded-full blur-sm opacity-40 bg-[#1DA1F2] transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-2.5">
          {steps.map((step, index) => {
            const isCurrent = index === currentStep;
            const isCompleted = step.completed;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#1DA1F2]/8 border border-[#1DA1F2]/15'
                    : isCompleted
                    ? 'opacity-70'
                    : 'opacity-40'
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <div className="w-5 h-5 rounded-full bg-[#17BF63]/15 flex items-center justify-center">
                      <CheckCircle size={14} className="text-[#17BF63]" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full border-2 border-[#1DA1F2] flex items-center justify-center animate-pulse">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#1DA1F2]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-[#38444D] flex items-center justify-center">
                      <Circle size={10} className="text-[#38444D]" />
                    </div>
                  )}
                </div>

                <span
                  className={`text-sm font-medium transition-colors ${
                    isCurrent
                      ? 'text-[#1DA1F2]'
                      : isCompleted
                      ? 'text-[#8899A6] line-through decoration-[#38444D]'
                      : 'text-[#657786]'
                  }`}
                >
                  {step.label}
                </span>

                {isCompleted && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-[10px] px-1.5 py-0 border-[#17BF63]/20 text-[#17BF63] bg-[#17BF63]/5"
                  >
                    Done
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressStepper;
