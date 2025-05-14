import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Circle } from 'lucide-react';

const ProgressStepper: React.FC = () => {
  const { user } = useAuth();

  const steps = [
    {
      id: 'twitter',
      label: 'Connect X (Twitter)',
      completed: user?.twitterConnected || false
    },
    {
      id: 'email',
      label: 'Add Email',
      completed: !!user?.email
    },
    {
      id: 'github',
      label: 'Connect GitHub',
      completed: user?.githubConnected || false
    },
    {
      id: 'leetcode',
      label: 'Connect LeetCode',
      completed: user?.leetCodeConnected || false
    }
  ];

  const currentStep = steps.findIndex(step => !step.completed);
  const progress = Math.max(0, Math.min(100, (steps.filter(step => step.completed).length / steps.length) * 100));

  return (
    <div className="bg-[#192734] rounded-xl border border-[#38444D] p-4">
      <div className="mb-2 flex justify-between items-center">
        <h3 className="text-white font-medium">Onboarding Progress</h3>
        <span className="text-sm text-[#8899A6]">{Math.round(progress)}% Complete</span>
      </div>
      
      <div className="w-full bg-[#2C3640] rounded-full h-2 mb-4">
        <div 
          className="bg-[#1DA1F2] h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center ${
              index === currentStep 
                ? 'text-[#1DA1F2]' 
                : step.completed 
                ? 'text-[#17BF63]' 
                : 'text-[#8899A6]'
            }`}
          >
            {step.completed ? (
              <CheckCircle size={18} className="mr-3" />
            ) : (
              <Circle size={18} className="mr-3" />
            )}
            <span className={index === currentStep ? 'font-medium' : ''}>{step.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;