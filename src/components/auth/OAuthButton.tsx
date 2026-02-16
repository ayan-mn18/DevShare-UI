import React from 'react';
import { Github, Twitter, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProviderType = 'twitter' | 'github' | 'leetcode';

interface OAuthButtonProps {
  provider: ProviderType;
  onClick: () => void;
  isConnected?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  onClick,
  isConnected = false,
  isLoading = false,
  disabled = false
}) => {
  const config = {
    twitter: {
      icon: <Twitter className="w-4 h-4" />,
      label: 'X (Twitter)',
      color: 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90',
      connectedColor: 'bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20',
    },
    github: {
      icon: <Github className="w-4 h-4" />,
      label: 'GitHub',
      color: 'bg-[#6E5494] hover:bg-[#6E5494]/90',
      connectedColor: 'bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20',
    },
    leetcode: {
      icon: <Book className="w-4 h-4" />,
      label: 'LeetCode',
      color: 'bg-[#FFAD1F] hover:bg-[#FFAD1F]/90 text-black',
      connectedColor: 'bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20',
    },
  }[provider];

  const action = isConnected ? 'Connected to' : 'Connect with';

  return (
    <Button
      variant={isConnected ? 'outline' : 'default'}
      onClick={onClick}
      disabled={disabled || isConnected}
      className={`w-full rounded-xl font-medium text-sm h-10 transition-all gap-2 ${
        isConnected ? config.connectedColor : `${config.color} text-white`
      }`}
    >
      {isLoading ? (
        <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      ) : (
        config.icon
      )}
      {action} {config.label}
    </Button>
  );
};

export default OAuthButton;
