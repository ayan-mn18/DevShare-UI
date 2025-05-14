import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import OAuthButton from '../auth/OAuthButton';
import Input from '../common/Input';
import Toast from '../common/Toast';
import { Twitter, Github, Book, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// fetchDashboardData, props for IntegrationCards
interface IntegrationCardsProps {
  fetchDashboardData: () => void;
}

const IntegrationCards: React.FC<IntegrationCardsProps> = ({ fetchDashboardData }) => {
  const { user, connectTwitter, connectGithub, connectLeetCode } = useAuth();
  const [leetCodeUsername, setLeetCodeUsername] = useState('');
  const [showLeetCodeInput, setShowLeetCodeInput] = useState(false);
  const [isConnectingLeetCode, setIsConnectingLeetCode] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [showGithubInput, setShowGithubInput] = useState(false);
  const [isConnectingGithub, setIsConnectingGithub] = useState(false);

  const handleGithubConnect = async () => {
    if (!showGithubInput) {
      setShowGithubInput(true);
      return;
    }

    if (!githubUsername) {
      return;
    }

    setIsConnectingGithub(true);

    const response: any = connectGithub(githubUsername);
    if (response.success) {
      setIsConnectingGithub(false);
      setShowGithubInput(false);
      // toast
      return (
        <Toast
          message='Successfully connected to GitHub'
          type="success"
          onClose={() => { }}
        />
      );
    } else {
      setIsConnectingGithub(false);
      setShowGithubInput(true);

      fetchDashboardData();

      return (
        <Toast
          message='Error connecting to GitHub'
          type="error"
          onClose={() => { }}
        />
      );
    }
  };

  const handleLeetCodeConnect = async () => {
    if (!showLeetCodeInput) {
      setShowLeetCodeInput(true);
      return;
    }

    if (!leetCodeUsername) {
      return;
    }

    setIsConnectingLeetCode(true);

    const response: any = connectLeetCode(leetCodeUsername);
    if (response.success) {
      setIsConnectingLeetCode(false);
      setShowLeetCodeInput(false);
      // toast
      return (
        <Toast
          message='Successfully connected to LeetCode'
          type="success"
          onClose={() => { }}
        />
      );
    } else {
      setIsConnectingLeetCode(false);
      setShowLeetCodeInput(true);

      fetchDashboardData()
      // toast
      return (
        <Toast
          message='Error connecting to LeetCode'
          type="error"
          onClose={() => { }}
        />
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="border-l-4 border-l-[#1DA1F2]">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#1DA1F2]/10 p-3 rounded-full mb-4">
            <Twitter size={24} className="text-[#1DA1F2]" />
          </div>
          <h3 className="text-white font-medium mb-1">X (Twitter)</h3>
          <p className="text-[#8899A6] text-sm mb-4">
            {user?.twitterConnected
              ? 'Your account is connected'
              : 'Connect your Twitter account to schedule tweets'}
          </p>

          <div className="mt-2 w-full">
            {user?.twitterConnected ? (
              <div className="flex items-center justify-center text-[#17BF63] bg-[#17BF63]/10 p-2 rounded-md">
                <CheckCircle size={16} className="mr-2" />
                <span>Connected</span>
              </div>
            ) : (
              <OAuthButton
                provider="twitter"
                onClick={connectTwitter}
              />
            )}
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-[#6E5494]">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#6E5494]/10 p-3 rounded-full mb-4">
            <Github size={24} className="text-[#6E5494]" />
          </div>
          <h3 className="text-white font-medium mb-1">GitHub</h3>
          <p className="text-[#8899A6] text-sm mb-4">
            {user?.githubConnected
              ? 'Your account is connected'
              : 'Connect GitHub to share your contributions'}
          </p>

          <div className="mt-2 w-full">
            {user?.githubConnected ? (
              <div className="flex items-center justify-center text-[#17BF63] bg-[#17BF63]/10 p-2 rounded-md">
                <CheckCircle size={16} className="mr-2" />
                <span>Connected</span>
              </div>
            ) :
              (
                <>
                  {showGithubInput ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Your Github username"
                        value={githubUsername}
                        onChange={(e) => setGithubUsername(e.target.value)}
                        fullWidth
                      />
                      <Button
                        onClick={handleGithubConnect}
                        isLoading={isConnectingGithub}
                        fullWidth
                      >
                        Connect
                      </Button>
                    </div>
                  ) : (
                    <OAuthButton
                      provider="github"
                      onClick={handleGithubConnect}
                      disabled={!user?.twitterConnected}
                    />
                  )}
                </>
              )}
          </div>
        </div>
      </Card>

      <Card className="border-l-4 border-l-[#FFAD1F]">
        <div className="flex flex-col items-center text-center">
          <div className="bg-[#FFAD1F]/10 p-3 rounded-full mb-4">
            <Book size={24} className="text-[#FFAD1F]" />
          </div>
          <h3 className="text-white font-medium mb-1">LeetCode</h3>
          <p className="text-[#8899A6] text-sm mb-4">
            {user?.leetCodeConnected
              ? 'Your account is connected'
              : 'Connect LeetCode to share your progress'}
          </p>

          <div className="mt-2 w-full">
            {user?.leetCodeConnected ? (
              <div className="flex items-center justify-center text-[#17BF63] bg-[#17BF63]/10 p-2 rounded-md">
                <CheckCircle size={16} className="mr-2" />
                <span>Connected</span>
              </div>
            ) : (
              <>
                {showLeetCodeInput ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Your LeetCode username"
                      value={leetCodeUsername}
                      onChange={(e) => setLeetCodeUsername(e.target.value)}
                      fullWidth
                    />
                    <Button
                      onClick={handleLeetCodeConnect}
                      isLoading={isConnectingLeetCode}
                      fullWidth
                    >
                      Connect
                    </Button>
                  </div>
                ) : (
                  <OAuthButton
                    provider="leetcode"
                    onClick={handleLeetCodeConnect}
                    disabled={!user?.twitterConnected}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IntegrationCards;