import React, { useState } from 'react';
import { Clock, Globe } from 'lucide-react';
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

interface TweetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { time: string; timezone: string }) => void;
  currentSettings?: {
    time: string;
    timezone: string;
  };
}

const TweetSettingsModal: React.FC<TweetSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentSettings = { time: localStorage.getItem('dashboard_data') ? JSON.parse(localStorage.getItem('dashboard_data') || '{}').time : '00:00', timezone: 'Asia/Kolkata' }
}) => {
  const [selectedTime, setSelectedTime] = useState(currentSettings.time);
  const [selectedTimezone, setSelectedTimezone] = useState(currentSettings.timezone);

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

  const handleSave = () => {
    onSave({ time: selectedTime, timezone: selectedTimezone });
    onClose();
  };

  const handleCancel = () => {
    setSelectedTime(currentSettings.time);
    setSelectedTimezone(currentSettings.timezone);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#161B22] border-white/[0.08] text-white rounded-2xl shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold text-white">Tweet Schedule Settings</DialogTitle>
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
            <p className="text-white/20 text-xs font-medium">
              Select your preferred timezone for scheduling tweets
            </p>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Preview */}
          <Card className="bg-white/[0.03] border-white/[0.06] rounded-xl">
            <CardContent className="p-4">
              <h4 className="text-white font-medium text-sm mb-2">Preview</h4>
              <p className="text-white/30 text-xs">
                Your next tweet will be posted at{' '}
                <span className="text-[#1DA1F2] font-semibold">{selectedTime}</span>
                {' '}in{' '}
                <span className="text-[#1DA1F2] font-semibold">
                  {timezones.find(tz => tz.value === selectedTimezone)?.label}
                </span>
              </p>
            </CardContent>
          </Card>
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
