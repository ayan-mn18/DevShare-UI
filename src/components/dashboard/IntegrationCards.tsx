import React, { useState } from 'react';
import { Twitter, Github, Book, CheckCircle, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

interface IntegrationCardsProps {
  fetchDashboardData: () => void;
  disable?: boolean;
  onHide?: () => void;
}

const IntegrationCards: React.FC<IntegrationCardsProps> = ({ fetchDashboardData, disable, onHide }) => {
  const { user, connectTwitter, connectGithub, connectLeetCode } = useAuth();
  const [leetCodeUsername, setLeetCodeUsername] = useState('');
  const [showLeetCodeInput, setShowLeetCodeInput] = useState(false);
  const [isConnectingLeetCode, setIsConnectingLeetCode] = useState(false);

  const handleLeetCodeConnect = async () => {
    if (!showLeetCodeInput) {
      setShowLeetCodeInput(true);
      return;
    }
    if (!leetCodeUsername) return;

    setIsConnectingLeetCode(true);
    try {
      const response = await connectLeetCode(leetCodeUsername);
      if (response.success) {
        toast.success('Successfully connected to LeetCode');
        setShowLeetCodeInput(false);
        fetchDashboardData();
      } else {
        toast.error(response.error || 'Error connecting to LeetCode');
      }
    } catch {
      toast.error('Error connecting to LeetCode');
    } finally {
      setIsConnectingLeetCode(false);
    }
  };

  const integrations = [
    {
      id: 'twitter',
      name: 'X (Twitter)',
      icon: <Twitter className="w-5 h-5" />,
      color: '#1DA1F2',
      connected: user?.twitterConnected,
      description: user?.twitterConnected
        ? 'Your account is connected'
        : 'Connect your Twitter account to schedule tweets',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: <Github className="w-5 h-5" />,
      color: '#6E5494',
      connected: user?.githubConnected,
      description: user?.githubConnected
        ? 'Your account is connected'
        : 'Connect GitHub to share your contributions',
    },
    {
      id: 'leetcode',
      name: 'LeetCode',
      icon: <Book className="w-5 h-5" />,
      color: '#FFAD1F',
      connected: user?.leetCodeConnected,
      description: user?.leetCodeConnected
        ? 'Your account is connected and verified'
        : 'Link your LeetCode to share your streaks',
    },
  ];

  return (
    <div className="relative">
      {onHide && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onHide}
          className="absolute top-3 right-3 z-10 h-7 w-7 rounded-lg text-white/30 hover:text-[#E0245E] hover:bg-[#E0245E]/10"
        >
          <X className="w-4 h-4" />
        </Button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {integrations.map((integration) => (
          <Card
            key={integration.id}
            className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-300 overflow-hidden group"
          >
            {/* Top accent line */}
            <div className="h-0.5 w-full" style={{ backgroundColor: `${integration.color}30` }} />

            <CardContent className="p-5 flex flex-col items-center text-center">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${integration.color}12`, color: integration.color }}
              >
                {integration.icon}
              </div>

              <h3 className="text-white font-semibold text-sm mb-1">{integration.name}</h3>
              <p className="text-white/30 text-xs mb-4 leading-relaxed">{integration.description}</p>

              <div className="w-full mt-auto">
                {integration.connected ? (
                  <Badge className="w-full justify-center py-2 bg-[#17BF63]/10 text-[#17BF63] border-[#17BF63]/20 hover:bg-[#17BF63]/15 rounded-xl gap-1.5">
                    {integration.id === 'leetcode' ? (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5" />
                    )}
                    {integration.id === 'leetcode' ? 'Verified' : 'Connected'}
                  </Badge>
                ) : integration.id === 'twitter' ? (
                  <Button
                    onClick={connectTwitter}
                    className="w-full rounded-xl bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white font-medium text-sm h-9"
                    size="sm"
                  >
                    <Twitter className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                ) : integration.id === 'github' ? (
                  <Button
                    onClick={connectGithub}
                    disabled={!user?.twitterConnected}
                    className="w-full rounded-xl bg-[#6E5494] hover:bg-[#6E5494]/90 text-white font-medium text-sm h-9 disabled:opacity-30"
                    size="sm"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    Connect with GitHub
                  </Button>
                ) : integration.id === 'leetcode' ? (
                  showLeetCodeInput ? (
                    <div className="space-y-2 w-full">
                      <Input
                        placeholder="LeetCode username"
                        value={leetCodeUsername}
                        onChange={(e) => setLeetCodeUsername(e.target.value)}
                        className="h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl text-sm"
                      />
                      <Button
                        onClick={handleLeetCodeConnect}
                        disabled={isConnectingLeetCode || !leetCodeUsername}
                        className="w-full rounded-xl bg-[#FFAD1F] hover:bg-[#FFAD1F]/90 text-black font-medium text-sm h-9"
                        size="sm"
                      >
                        {isConnectingLeetCode ? 'Connecting...' : 'Connect'}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleLeetCodeConnect}
                      disabled={!user?.twitterConnected}
                      className="w-full rounded-xl bg-[#FFAD1F] hover:bg-[#FFAD1F]/90 text-black font-medium text-sm h-9 disabled:opacity-30"
                      size="sm"
                    >
                      <Book className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  )
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default IntegrationCards;
