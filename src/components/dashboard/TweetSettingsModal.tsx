import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Globe, Sparkles, Hash, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export type TweetTone = 'minimal' | 'casual' | 'technical' | 'motivational';

interface TweetSettings {
  time: string;
  timezone: string;
  tone: TweetTone;
  customHashtags: string[];
}

interface TweetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: TweetSettings) => void;
  currentSettings?: TweetSettings;
  userId?: string;
}

const TONE_OPTIONS: { value: TweetTone; label: string; description: string; emoji: string }[] = [
  { value: 'minimal', label: 'Minimal', description: 'Just the facts, clean and concise', emoji: '📊' },
  { value: 'casual', label: 'Casual', description: 'Friendly, conversational tone', emoji: '💬' },
  { value: 'technical', label: 'Technical', description: 'Detailed with technical context', emoji: '⚙️' },
  { value: 'motivational', label: 'Motivational', description: 'Energetic, encouraging vibe', emoji: '🔥' },
];

const TweetSettingsModal: React.FC<TweetSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings = {
    time: localStorage.getItem('dashboard_data') ? JSON.parse(localStorage.getItem('dashboard_data') || '{}').time : '00:00',
    timezone: 'Asia/Kolkata',
    tone: (localStorage.getItem('tweet_tone') as TweetTone) || 'casual',
    customHashtags: JSON.parse(localStorage.getItem('tweet_hashtags') || '[]'),
  },
  userId,
}) => {
  const [selectedTime, setSelectedTime] = useState(currentSettings.time);
  const [selectedTimezone, setSelectedTimezone] = useState(currentSettings.timezone);
  const [selectedTone, setSelectedTone] = useState<TweetTone>(currentSettings.tone);
  const [customHashtags, setCustomHashtags] = useState<string[]>(currentSettings.customHashtags);
  const [hashtagInput, setHashtagInput] = useState('');
  const [tweetPreview, setTweetPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const timezones = [
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
    { value: 'UTC', label: 'Coordinated Universal Time (UTC)' }
  ];

  const fetchPreview = useCallback(async () => {
    const currentUserId = userId || localStorage.getItem('user_id');
    if (!currentUserId) return;

    setPreviewLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_REACT_SERVER_URL}/tweet/preview?userId=${currentUserId}&tone=${selectedTone}`,
        { method: 'GET', headers: { 'Content-Type': 'application/json' } }
      );
      if (response.ok) {
        const data = await response.json();
        setTweetPreview(data.data?.content || data.data?.preview || null);
      }
    } catch {
      // Silently fail — preview is non-critical
    } finally {
      setPreviewLoading(false);
    }
  }, [selectedTone, userId]);

  useEffect(() => {
    if (isOpen) {
      fetchPreview();
    }
  }, [isOpen, selectedTone, fetchPreview]);

  const addHashtag = () => {
    const tag = hashtagInput.trim().replace(/^#/, '');
    if (tag && !customHashtags.includes(tag) && customHashtags.length < 5) {
      setCustomHashtags([...customHashtags, tag]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setCustomHashtags(customHashtags.filter(t => t !== tag));
  };

  const handleHashtagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addHashtag();
    }
  };

  const handleSave = () => {
    const settings: TweetSettings = {
      time: selectedTime,
      timezone: selectedTimezone,
      tone: selectedTone,
      customHashtags,
    };
    localStorage.setItem('tweet_tone', selectedTone);
    localStorage.setItem('tweet_hashtags', JSON.stringify(customHashtags));
    onSave(settings);
    onClose();
  };

  const handleCancel = () => {
    setSelectedTime(currentSettings.time);
    setSelectedTimezone(currentSettings.timezone);
    setSelectedTone(currentSettings.tone);
    setCustomHashtags(currentSettings.customHashtags);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#161B22] border-white/[0.08] text-white rounded-2xl shadow-2xl max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold text-white">Tweet Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Time Selection */}
          <div className="space-y-3">
            <Label className="text-white/70 font-medium flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-[#1DA1F2]" />
              Daily Tweet Time
            </Label>
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="bg-transparent border-none text-white text-lg font-mono p-0 h-auto focus-visible:ring-0"
                style={{ colorScheme: 'dark' }}
              />
              <p className="text-white/20 text-xs mt-2 font-medium">
                Your tweets will be automatically posted at this time every day
              </p>
            </div>
          </div>

          {/* Timezone Selection */}
          <div className="space-y-3">
            <Label className="text-white/70 font-medium flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-[#1DA1F2]" />
              Timezone
            </Label>
            <Select value={selectedTimezone} disabled onValueChange={setSelectedTimezone}>
              <SelectTrigger className="bg-white/[0.03] border-white/[0.06] text-white rounded-xl h-11 focus:ring-[#1DA1F2]/30 disabled:opacity-50">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-[#161B22] border-white/[0.08] text-white rounded-xl">
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value} className="rounded-lg hover:bg-white/[0.06] focus:bg-white/[0.06] focus:text-white">
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Tone Selection */}
          <div className="space-y-3">
            <Label className="text-white/70 font-medium flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-[#FFAD1F]" />
              Tweet Tone
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TONE_OPTIONS.map((tone) => (
                <button
                  key={tone.value}
                  onClick={() => setSelectedTone(tone.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${selectedTone === tone.value
                      ? 'border-[#1DA1F2]/40 bg-[#1DA1F2]/10'
                      : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]'
                    }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{tone.emoji}</span>
                    <span className="text-white text-sm font-medium">{tone.label}</span>
                  </div>
                  <p className="text-white/25 text-[11px] leading-tight">{tone.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Hashtags */}
          <div className="space-y-3">
            <Label className="text-white/70 font-medium flex items-center gap-2 text-sm">
              <Hash className="w-4 h-4 text-[#17BF63]" />
              Custom Hashtags
              <span className="text-white/20 text-xs ml-auto">{customHashtags.length}/5</span>
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add hashtag (press Enter)"
                value={hashtagInput}
                onChange={(e) => setHashtagInput(e.target.value)}
                onKeyDown={handleHashtagKeyDown}
                disabled={customHashtags.length >= 5}
                className="h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 rounded-xl text-sm flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={addHashtag}
                disabled={!hashtagInput.trim() || customHashtags.length >= 5}
                className="rounded-xl border-white/[0.08] text-white/50 hover:text-white h-9 px-3"
              >
                Add
              </Button>
            </div>
            {customHashtags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {customHashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-[#17BF63]/20 text-[#17BF63] bg-[#17BF63]/5 rounded-full text-xs cursor-pointer hover:bg-[#E0245E]/10 hover:text-[#E0245E] hover:border-[#E0245E]/20 transition-colors"
                    onClick={() => removeHashtag(tag)}
                  >
                    #{tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Tweet Preview */}
          <div className="space-y-3">
            <Label className="text-white/70 font-medium flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4 text-[#1DA1F2]" />
              Tweet Preview
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchPreview}
                disabled={previewLoading}
                className="ml-auto h-6 px-2 text-xs text-white/30 hover:text-white"
              >
                {previewLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Refresh'}
              </Button>
            </Label>
            <Card className="bg-white/[0.03] border-white/[0.06] rounded-xl">
              <CardContent className="p-4">
                {previewLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 text-[#1DA1F2] animate-spin" />
                  </div>
                ) : tweetPreview ? (
                  <div>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{tweetPreview}</p>
                    {customHashtags.length > 0 && (
                      <p className="text-[#1DA1F2] text-sm mt-2">
                        {customHashtags.map(t => `#${t}`).join(' ')}
                      </p>
                    )}
                    <p className="text-white/15 text-xs mt-3 font-medium">
                      This is a preview of how your next tweet might look with the "{selectedTone}" tone.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-white/30 text-xs">
                      Your next tweet will be posted at{' '}
                      <span className="text-[#1DA1F2] font-semibold">{selectedTime}</span>
                      {' '}in{' '}
                      <span className="text-[#1DA1F2] font-semibold">
                        {timezones.find(tz => tz.value === selectedTimezone)?.label}
                      </span>
                    </p>
                    <p className="text-white/15 text-[11px] mt-1">
                      Tone: {TONE_OPTIONS.find(t => t.value === selectedTone)?.emoji} {selectedTone}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="gap-3 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="rounded-xl border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="rounded-xl bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white font-medium flex-1"
          >
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TweetSettingsModal;
