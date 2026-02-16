import React, { useState, useEffect } from 'react';
import { AlertTriangle, Twitter, CheckCircle, XCircle, ExternalLink, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TestTweetButtonProps {
  isDisabled: boolean | undefined;
  userId: string;
  twitterUsername?: string;
  onHide?: () => void;
}

const TestTweetButton: React.FC<TestTweetButtonProps> = ({
  isDisabled = false,
  userId,
  twitterUsername,
  onHide
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasBeenUsed, setHasBeenUsed] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [tweetContent, setTweetContent] = useState("Just set up my DevShare automation! Now my coding activity will be shared automatically. Try it out folks - https://share.bizer.dev");
  const [tweetId, setTweetId] = useState<string | null>(null);
  const { updateUser } = useAuth();

  useEffect(() => {
    const testTweetUsed = localStorage.getItem('test_tweet_used') === 'true';
    setHasBeenUsed(testTweetUsed);
  }, []);

  const sendTestTweet = async () => {
    if (hasBeenUsed || isDisabled || !userId) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, content: tweetContent }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'SUCCESS') {
        setStatus('success');
        setTweetId(data.data?.id || null);
        localStorage.setItem('test_tweet_used', 'true');
        updateUser({ testTweetUsed: true });
        setHasBeenUsed(true);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error sending test tweet:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const getTweetUrl = () => {
    if (!twitterUsername) return '#';
    if (tweetId) return `https://twitter.com/${twitterUsername}/status/${tweetId}`;
    return `https://twitter.com/${twitterUsername}`;
  };

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

      <Card className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-white">Test Tweet</CardTitle>
          <CardDescription className="text-white/25 text-xs">Send a one-time test tweet to verify your connection</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'idle' && !hasBeenUsed && (
            <Alert className="bg-[#FFAD1F]/[0.06] border-[#FFAD1F]/20 rounded-xl">
              <AlertTriangle className="w-4 h-4 text-[#FFAD1F]" />
              <AlertDescription className="text-[#FFAD1F]/80 text-xs ml-2">
                The test tweet feature is one-time only and will be disabled after the first use.
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="bg-[#17BF63]/[0.06] border-[#17BF63]/20 rounded-xl">
              <CheckCircle className="w-4 h-4 text-[#17BF63]" />
              <AlertDescription className="text-[#17BF63]/80 text-xs ml-2">
                <p>Test tweet sent successfully! Your Twitter integration is working properly.</p>
                {twitterUsername && (
                  <a
                    href={getTweetUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[#17BF63] hover:underline text-xs mt-2 gap-1 font-medium"
                  >
                    View tweet on Twitter
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <Alert className="bg-[#E0245E]/[0.06] border-[#E0245E]/20 rounded-xl">
              <XCircle className="w-4 h-4 text-[#E0245E]" />
              <AlertDescription className="text-[#E0245E]/80 text-xs ml-2">
                Failed to send test tweet. Please check your Twitter connection and try again.
              </AlertDescription>
            </Alert>
          )}

          {!hasBeenUsed && !isDisabled && (
            <div>
              <label htmlFor="tweetContent" className="block text-xs font-medium text-white/30 mb-2">
                Tweet Content
              </label>
              <Textarea
                id="tweetContent"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/15 rounded-xl text-sm resize-none focus-visible:ring-[#1DA1F2]/30"
                rows={3}
                maxLength={280}
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="Enter your test tweet content here..."
                disabled={isLoading}
              />
              <div className="flex justify-end mt-1.5">
                <span className={`text-[10px] font-medium ${tweetContent.length > 250 ? 'text-[#FFAD1F]' : 'text-white/15'}`}>
                  {tweetContent.length}/280
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={sendTestTweet}
            disabled={hasBeenUsed || isDisabled || !userId}
            className={`w-full rounded-xl font-medium text-sm h-10 ${
              status === 'success'
                ? 'bg-[#17BF63]/10 text-[#17BF63] border border-[#17BF63]/20 hover:bg-[#17BF63]/15'
                : status === 'error'
                  ? 'bg-[#E0245E] hover:bg-[#E0245E]/90 text-white'
                  : 'bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white'
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
            ) : (
              <Twitter className="w-4 h-4 mr-2" />
            )}
            {status === 'success'
              ? 'Test Tweet Sent'
              : status === 'error'
                ? 'Test Tweet Failed'
                : 'Send Test Tweet'}
          </Button>

          {(hasBeenUsed || isDisabled) && (
            <p className="text-xs text-white/20 text-center font-medium">
              {hasBeenUsed
                ? 'This feature has been used and is now disabled'
                : 'Connect all accounts to enable test tweeting'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestTweetButton;
