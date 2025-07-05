import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Card from '../common/Card';
import Button from '../common/Button';
import { CalendarClock, Trash2, Edit3, Plus, CheckCircle, Clock, RefreshCw, Settings } from 'lucide-react';
import TweetSettingsModal from './TweetSettingsModal';
import { toast } from 'react-hot-toast';

interface Tweet {
  id: string;
  bot_id?: string;
  content: string;
  schedule_time: string;
  status: 'SENT' | 'scheduled' | 'FAILED';
  leetcode_contribution: number;
  github_contribution: number;
  created_at: string;
}

interface ScheduledTweetsProps {
  onDeleteTweet?: (id: string) => void;
  initialTweets?: Tweet[];
  userId?: string;
}

const ScheduledTweets: React.FC<ScheduledTweetsProps> = ({
  onDeleteTweet,
  initialTweets,
  userId
}) => {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets || []);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tweetSettings, setTweetSettings] = useState({
    time: localStorage.getItem('dashboard_data') ? JSON.parse(localStorage.getItem('dashboard_data') || '{}').time : '00:00',
    timezone: 'Asia/Kolkata'
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If initialTweets is provided, use them
    if (initialTweets && initialTweets.length > 0) {
      setTweets(initialTweets);
      setLoading(false);
      return;
    }

    fetchTweets();
  }, [initialTweets, userId]);

  const handleSettingsSave = async (settings: { time: string; timezone: string }) => {
    setTweetSettings(settings);

    // Find the botId from the first tweet (or however you want to get it)
    const botId = localStorage.getItem('dashboard_data') ? JSON.parse(localStorage.getItem('dashboard_data') || '{}').botId : null;
    if (!botId) {
      setError('Bot ID not found for updating schedule.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/update-schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId,
          time: settings.time
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === 'SUCCESS') {
        toast.success('Schedule updated successfully!');
        console.log('Schedule updated successfully:', data);
        setIsSettingsOpen(false);
      } else {
        setError(data.message || 'Failed to update schedule');
      }
    } catch (err) {
      setError('Failed to update schedule. Please try again.');
    }
  };

  // Format API date
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get status icon and color
  const getStatusDetails = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SENT':
        return {
          icon: <CheckCircle size={14} className="text-[#17BF63]" />,
          text: 'Sent',
          color: 'text-[#17BF63]'
        };
      case 'SCHEDULED':
        return {
          icon: <Clock size={14} className="text-[#FFAD1F]" />,
          text: 'Scheduled',
          color: 'text-[#FFAD1F]'
        };
      case 'FAILED':
        return {
          icon: <Trash2 size={14} className="text-[#E0245E]" />,
          text: 'Failed',
          color: 'text-[#E0245E]'
        };
      default:
        return {
          icon: <Clock size={14} className="text-[#FFAD1F]" />,
          text: 'Scheduled',
          color: 'text-[#FFAD1F]'
        };
    }
  };

  const fetchTweets = async () => {
    // Check if userId is available
    const currentUserId = userId || localStorage.getItem('user_id');
    if (!currentUserId) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    // Check if tweets are in localStorage first
    const storedTweets = localStorage.getItem('tweets');
    if (storedTweets) {
      try {
        const parsedTweets = JSON.parse(storedTweets);
        setTweets(parsedTweets);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse stored tweets', e);
        // Continue with API fetch if parsing fails
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/${currentUserId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tweets');
      }

      const result = await response.json();
      if (result.status === 'SUCCESS' && result.data) {
        setTweets(result.data);
        // Store tweets in localStorage for future use
        localStorage.setItem('tweets', JSON.stringify(result.data));
      } else {
        setError(result.message || 'Failed to fetch tweets');
      }
    } catch (error) {
      console.error('Error fetching tweets:', error);
      setError('Error fetching tweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (!onDeleteTweet) {
      // Handle deletion within the component if no callback is provided
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/${tweetId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete tweet');
        }

        // Remove tweet from state
        const updatedTweets = tweets.filter(tweet => tweet.id !== tweetId);
        setTweets(updatedTweets);
        // Update localStorage
        localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      } catch (error) {
        console.error('Error deleting tweet:', error);
        setError('Failed to delete tweet. Please try again.');
      }
    } else {
      // Use the callback if provided
      onDeleteTweet(tweetId);
    }
  };

  const handleRefresh = () => {
    // Clear localStorage and refetch
    localStorage.removeItem('tweets');
    fetchTweets();
  };

  return (
    <>
      <Card
        title="Tweets"
        subtitle="Manage your scheduled and sent tweets"
        rightContent={
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="!p-1 h-8 w-8 rounded-full"
              onClick={handleRefresh}
            >
              <RefreshCw size={14} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="!p-1 h-8 w-8 rounded-full hover:bg-[#38444D]"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings size={14} />
            </Button>
          </div>
        }
        footer={
          <div className="flex justify-end disabled">
            <Button
              variant="primary"
              icon={<Plus size={16} />}
              className='opacity-50 cursor-not-allowed'
            >
              New Tweet Schedule
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1DA1F2]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-6">
              <p className="text-[#E0245E]">{error}</p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-2"
                onClick={handleRefresh}
              >
                Try Again
              </Button>
            </div>
          ) : tweets.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-[#8899A6]">No tweets found.</p>
              <p className="text-sm text-[#657786] mt-1">
                Create your first scheduled tweet to showcase your coding achievements.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tweets.map((tweet) => {
                const statusDetails = getStatusDetails(tweet.status);
                return (
                  <div
                    key={tweet.id}
                    className="bg-[#1C2732] p-4 rounded-lg border border-[#38444D]"
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-white">{tweet.content}</p>
                      <div className="flex space-x-1">
                        {tweet.status.toUpperCase() !== 'SENT' && (
                          <>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="!p-1 h-8 w-8 rounded-full hover:bg-[#38444D]"
                            >
                              <Edit3 size={14} />
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              className="!p-1 h-8 w-8 rounded-full"
                              onClick={() => handleDeleteTweet(tweet.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-[#8899A6] text-sm mt-3">
                      <div className="flex items-center">
                        <CalendarClock size={14} className="mr-2" />
                        <span>
                          {tweet.status.toUpperCase() === 'SENT'
                            ? `Sent on ${formatDate(tweet.schedule_time)}`
                            : `Scheduled for ${formatDate(tweet.schedule_time)}`
                          }
                        </span>
                      </div>
                      <div className={`flex items-center ${statusDetails.color} mt-1 sm:mt-0`}>
                        {statusDetails.icon}
                        <span className="ml-1">{statusDetails.text}</span>
                      </div>
                    </div>

                    {/* Show contribution metrics if any */}
                    {(tweet.github_contribution > 0 || tweet.leetcode_contribution > 0) && (
                      <div className="flex flex-wrap gap-2 mt-2 text-xs text-[#8899A6]">
                        {tweet.github_contribution > 0 && (
                          <span className="bg-[#192734] px-2 py-1 rounded-full">
                            GitHub: {tweet.github_contribution} commits
                          </span>
                        )}
                        {tweet.leetcode_contribution > 0 && (
                          <span className="bg-[#192734] px-2 py-1 rounded-full">
                            LeetCode: {tweet.leetcode_contribution} problems
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Card>
      <TweetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        currentSettings={tweetSettings}
      />
    </>
  );
};

export default ScheduledTweets;