import React from 'react';
import Button from '../common/Button';
import { Github, Twitter, Book } from 'lucide-react';

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
  const getProviderIcon = () => {
    switch (provider) {
      case 'twitter':
        return <Twitter size={18} />;
      case 'github':
        return <Github size={18} />;
      case 'leetcode':
        return <Book size={18} />;
    }
  };

  const getProviderText = () => {
    const action = isConnected ? 'Connected to' : 'Connect with';

    switch (provider) {
      case 'twitter':
        return `${action} X (Twitter)`;
      case 'github':
        return `${action} GitHub`;
      case 'leetcode':
        return `${action} LeetCode`;
    }
  };

  return (
    <Button
      variant={isConnected ? 'secondary' : 'primary'}
      icon={getProviderIcon()}
      onClick={onClick}
      isLoading={isLoading}
      disabled={disabled || isConnected}
      className={isConnected ? 'border border-green-500 bg-opacity-10' : ''}
      fullWidth
    >
      {getProviderText()}
    </Button>
  );
};

export default OAuthButton;