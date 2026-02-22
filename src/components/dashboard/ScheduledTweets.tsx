import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarClock, Trash2, Edit3, Plus, CheckCircle, Clock, RefreshCw, Settings, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TweetSettingsModal, { type TweetTone } from './TweetSettingsModal';
import { toast } from 'react-hot-toast';

interface Tweet {
  id: string;
  bot_id?: string;
  content: string;
  schedule_time: string;
  status: 'SENT' | 'scheduled' | 'FAILED' | 'SKIPPED';
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
    timezone: 'Asia/Kolkata',
    tone: (localStorage.getItem('tweet_tone') as TweetTone) || 'casual' as TweetTone,
    customHashtags: JSON.parse(localStorage.getItem('tweet_hashtags') || '[]') as string[],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTweets && initialTweets.length > 0) {
      setTweets(initialTweets);
      setLoading(false);
      return;
    }
    fetchTweets();
  }, [initialTweets, userId]);

  const handleSettingsSave = async (settings: { time: string; timezone: string; tone: TweetTone; customHashtags: string[] }) => {
    setTweetSettings(settings);
    const botId = localStorage.getItem('dashboard_data') ? JSON.parse(localStorage.getItem('dashboard_data') || '{}').botId : null;
    if (!botId) {
      setError('Bot ID not found for updating schedule.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/update-schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botId,
          time: settings.time,
          tone: settings.tone,
          customHashtags: settings.customHashtags,
        }),
      });
      const data = await response.json();
      if (response.ok && data.status === 'SUCCESS') {
        toast.success('Settings updated successfully!');
        setIsSettingsOpen(false);
      } else {
        setError(data.message || 'Failed to update settings');
      }
    } catch (err) {
      setError('Failed to update settings. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getStatusDetails = (status: string) => {
    switch (status.toUpperCase()) {
      case 'SENT':
        return {
          icon: <CheckCircle className="w-3.5 h-3.5 text-[#17BF63]" />,
          text: 'Sent',
          color: 'text-[#17BF63]',
          badgeClass: 'border-[#17BF63]/20 text-[#17BF63] bg-[#17BF63]/5',
        };
      case 'SCHEDULED':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-[#FFAD1F]" />,
          text: 'Scheduled',
          color: 'text-[#FFAD1F]',
          badgeClass: 'border-[#FFAD1F]/20 text-[#FFAD1F] bg-[#FFAD1F]/5',
        };
      case 'FAILED':
        return {
          icon: <Trash2 className="w-3.5 h-3.5 text-[#E0245E]" />,
          text: 'Failed',
          color: 'text-[#E0245E]',
          badgeClass: 'border-[#E0245E]/20 text-[#E0245E] bg-[#E0245E]/5',
        };
      case 'SKIPPED':
        return {
          icon: <SkipForward className="w-3.5 h-3.5 text-white/40" />,
          text: 'Skipped',
          color: 'text-white/40',
          badgeClass: 'border-white/[0.08] text-white/40 bg-white/[0.03]',
        };
      default:
        return {
          icon: <Clock className="w-3.5 h-3.5 text-[#FFAD1F]" />,
          text: 'Scheduled',
          color: 'text-[#FFAD1F]',
          badgeClass: 'border-[#FFAD1F]/20 text-[#FFAD1F] bg-[#FFAD1F]/5',
        };
    }
  };

  const fetchTweets = async () => {
    const currentUserId = userId || localStorage.getItem('user_id');
    if (!currentUserId) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    const storedTweets = localStorage.getItem('tweets');
    if (storedTweets) {
      try {
        const parsedTweets = JSON.parse(storedTweets);
        setTweets(parsedTweets);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Failed to parse stored tweets', e);
      }
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/${currentUserId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch tweets');

      const result = await response.json();
      if (result.status === 'SUCCESS' && result.data) {
        setTweets(result.data);
        localStorage.setItem('tweets', JSON.stringify(result.data));
      } else {
        setError(result.message || 'Failed to fetch tweets');
      }
    } catch (error) {
      setError('Error fetching tweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTweet = async (tweetId: string) => {
    if (!onDeleteTweet) {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_SERVER_URL}/tweet/${tweetId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to delete tweet');
        const updatedTweets = tweets.filter(tweet => tweet.id !== tweetId);
        setTweets(updatedTweets);
        localStorage.setItem('tweets', JSON.stringify(updatedTweets));
      } catch (error) {
        setError('Failed to delete tweet. Please try again.');
      }
    } else {
      onDeleteTweet(tweetId);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem('tweets');
    fetchTweets();
  };

  return (
    <>
      <Card className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.1] transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-white">Tweets</CardTitle>
              <CardDescription className="text-white/25 text-xs mt-0.5">Manage your scheduled and sent tweets</CardDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                className="h-8 w-8 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.06]"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSettingsOpen(true)}
                className="h-8 w-8 rounded-xl text-white/30 hover:text-white hover:bg-white/[0.06]"
              >
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="w-8 h-8 rounded-full border-2 border-[#1DA1F2]/20 border-t-[#1DA1F2] animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-[#E0245E] text-sm mb-3">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="rounded-xl border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04]"
                >
                  Try Again
                </Button>
              </div>
            ) : tweets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white/30 text-sm font-medium">No tweets found.</p>
                <p className="text-white/15 text-xs mt-1">
                  Create your first scheduled tweet to showcase your coding achievements.
                </p>
              </div>
            ) : (
              tweets.map((tweet) => {
                const statusDetails = getStatusDetails(tweet.status);
                return (
                  <div
                    key={tweet.id}
                    className="bg-white/[0.03] p-4 rounded-xl border border-white/[0.04] hover:border-white/[0.08] transition-all group"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <p className="text-white/80 text-sm leading-relaxed flex-1">{tweet.content}</p>
                      <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        {tweet.status.toUpperCase() !== 'SENT' && (
                          <>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-white/20 hover:text-white hover:bg-white/[0.06]">
                              <Edit3 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-lg text-white/20 hover:text-[#E0245E] hover:bg-[#E0245E]/10"
                              onClick={() => handleDeleteTweet(tweet.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    <Separator className="my-3 bg-white/[0.04]" />

                    <div className="flex flex-wrap items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-white/20">
                        <CalendarClock className="w-3.5 h-3.5" />
                        <span>
                          {tweet.status.toUpperCase() === 'SENT'
                            ? `Sent on ${formatDate(tweet.schedule_time)}`
                            : `Scheduled for ${formatDate(tweet.schedule_time)}`
                          }
                        </span>
                      </div>
                      <Badge variant="outline" className={`rounded-full text-[10px] px-2 py-0.5 ${statusDetails.badgeClass}`}>
                        {statusDetails.icon}
                        <span className="ml-1">{statusDetails.text}</span>
                      </Badge>
                    </div>

                    {(tweet.github_contribution > 0 || tweet.leetcode_contribution > 0) && (
                      <div className="flex flex-wrap gap-2 mt-2.5">
                        {tweet.github_contribution > 0 && (
                          <Badge variant="outline" className="text-[10px] border-white/[0.06] bg-white/[0.02] text-white/30 rounded-full">
                            GitHub: {tweet.github_contribution} commits
                          </Badge>
                        )}
                        {tweet.leetcode_contribution > 0 && (
                          <Badge variant="outline" className="text-[10px] border-white/[0.06] bg-white/[0.02] text-white/30 rounded-full">
                            LeetCode: {tweet.leetcode_contribution} problems
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4 px-6">
          <Button
            variant="outline"
            className="w-full rounded-xl border-white/[0.06] text-white/30 hover:text-white/50 hover:bg-white/[0.03] cursor-not-allowed opacity-50"
            disabled
          >
            <Plus className="w-4 h-4 mr-2" />
            New Tweet Schedule
          </Button>
        </CardFooter>
      </Card>

      <TweetSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        currentSettings={tweetSettings}
        userId={userId}
      />
    </>
  );
};

export default ScheduledTweets;
