import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import Card from '../common/Card';
import { AlertTriangle, Twitter, CheckCircle, XCircle, ExternalLink, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface TestTweetButtonProps {
  isDisabled: boolean | undefined;
  userId: string;
  twitterUsername?: string;
  onHide?: () => void; // <-- add this prop
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
  const [tweetContent, setTweetContent] = useState("Just set up my DevShare automation! Now my coding activity will be shared automatically. Try it out folks - https://devshare.ayanmn18.live");
  const [tweetId, setTweetId] = useState<string | null>(null);
  const { updateUser } = useAuth();

  useEffect(() => {
    // Check if test tweet has been used from localStorage
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          content: tweetContent
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'SUCCESS') {
        setStatus('success');
        // Store tweet ID for link generation
        setTweetId(data.data?.id || null);
        // Update localStorage to indicate test tweet has been used
        localStorage.setItem('test_tweet_used', 'true');
        updateUser({
          testTweetUsed: true,
        });
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

    if (tweetId) {
      return `https://twitter.com/${twitterUsername}/status/${tweetId}`;
    }

    return `https://twitter.com/${twitterUsername}`;
  };

  return (
    <div className="relative">
      {onHide && (
        <button
          onClick={onHide}
          className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded bg-[#E0245E] text-white hover:bg-[#c81d4a] transition z-0 shadow"
          aria-label="Hide Integrations"
          type="button"
        >
          <X size={16} />
        </button>
      )}
      <Card
        title="Test Tweet"
        subtitle="Send a one-time test tweet to verify your connection"
      >
        <div className="space-y-4">
          {status === 'idle' && !hasBeenUsed && (
            <div className="bg-[#FFAD1F]/10 border border-[#FFAD1F] rounded-md p-3 mb-4">
              <div className="flex items-start">
                <AlertTriangle size={18} className="text-[#FFAD1F] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-[#FFAD1F]">
                  The test tweet feature is one-time only and will be disabled after the first use.
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="bg-[#17BF63]/10 border border-[#17BF63] rounded-md p-3 mb-4">
              <div className="flex items-start">
                <CheckCircle size={18} className="text-[#17BF63] mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-[#17BF63]">
                    Test tweet sent successfully! Your Twitter integration is working properly.
                  </p>
                  {twitterUsername && (
                    <a
                      href={getTweetUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-[#17BF63] hover:underline text-sm mt-2"
                    >
                      View tweet on Twitter
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="bg-[#E0245E]/10 border border-[#E0245E] rounded-md p-3 mb-4">
              <div className="flex items-start">
                <XCircle size={18} className="text-[#E0245E] mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-[#E0245E]">
                  Failed to send test tweet. Please check your Twitter connection and try again.
                </p>
              </div>
            </div>
          )}

          {!hasBeenUsed && !isDisabled && (
            <div className="mb-4">
              <label htmlFor="tweetContent" className="block text-sm font-medium text-[#8899A6] mb-2">
                Tweet Content
              </label>
              <textarea
                id="tweetContent"
                className="w-full bg-[#1C2732] border border-[#38444D] rounded-md px-3 py-2 text-white placeholder-[#657786] focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent resize-none"
                rows={3}
                maxLength={280}
                value={tweetContent}
                onChange={(e) => setTweetContent(e.target.value)}
                placeholder="Enter your test tweet content here..."
                disabled={isLoading}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${tweetContent.length > 250 ? 'text-[#FFAD1F]' : 'text-[#8899A6]'}`}>
                  {tweetContent.length}/280
                </span>
              </div>
            </div>
          )}

          <div className="flex justify-center">
            <Button
              variant={status === 'success' ? 'secondary' : status === 'error' ? 'danger' : 'primary'}
              icon={<Twitter size={18} />}
              onClick={sendTestTweet}
              disabled={hasBeenUsed || isDisabled || !userId}
              isLoading={isLoading}
              className="w-full"
            >
              {status === 'success'
                ? 'Test Tweet Sent'
                : status === 'error'
                  ? 'Test Tweet Failed'
                  : 'Send Test Tweet'}
            </Button>
          </div>

          {(hasBeenUsed || isDisabled) && (
            <p className="text-sm text-[#8899A6] text-center mt-2">
              {hasBeenUsed
                ? 'This feature has been used and is now disabled'
                : 'Connect all accounts to enable test tweeting'}
            </p>
          )}
        </div>
      </Card>
    </div>

  );
};

export default TestTweetButton;