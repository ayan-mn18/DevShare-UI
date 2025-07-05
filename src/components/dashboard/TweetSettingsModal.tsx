import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { Clock, Globe } from 'lucide-react';

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
    onSave({
      time: selectedTime,
      timezone: selectedTimezone
    });
    onClose();
  };

  const handleCancel = () => {
    setSelectedTime(currentSettings.time);
    setSelectedTimezone(currentSettings.timezone);
    onClose();
  };

  const footer = (
    <div className="flex justify-end space-x-3">
      <Button
        variant="outline"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        onClick={handleSave}
      >
        Save Settings
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tweet Schedule Settings"
      footer={footer}
      size="md"
    >
      <div className="space-y-6">
        {/* Time Selection */}
        <div>
          <label className="block text-white font-medium mb-3">
            <Clock size={18} className="inline mr-2" />
            Daily Tweet Time
          </label>
          <div className="bg-[#253341] border border-[#38444D] rounded-md p-4">
            <input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="bg-transparent text-white text-lg font-mono w-full focus:outline-none"
              style={{
                colorScheme: 'dark'
              }}
            />
            <p className="text-[#8899A6] text-sm mt-2">
              Your tweets will be automatically posted at this time every day
            </p>
          </div>
        </div>

        {/* Timezone Selection */}
        <div>
          <label className="block text-white font-medium mb-3">
            <Globe size={18} className="inline mr-2" />
            Timezone
          </label>
          <div className="relative">
            <select
              value={selectedTimezone}
              disabled
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="w-full bg-[#253341] border border-[#38444D] text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value} className="bg-[#253341] text-white">
                  {tz.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-[#8899A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <p className="text-[#8899A6] text-sm mt-2">
            Select your preferred timezone for scheduling tweets
          </p>
        </div>

        {/* Preview */}
        <div className="bg-[#1C2732] border border-[#38444D] rounded-md p-4">
          <h4 className="text-white font-medium mb-2">Preview</h4>
          <p className="text-[#8899A6] text-sm">
            Your next tweet will be posted at{' '}
            <span className="text-[#1DA1F2] font-medium">
              {selectedTime}
            </span>{' '}
            in{' '}
            <span className="text-[#1DA1F2] font-medium">
              {timezones.find(tz => tz.value === selectedTimezone)?.label}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default TweetSettingsModal;