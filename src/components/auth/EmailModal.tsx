import React, { useState } from 'react';
import Button from '../common/Button';

interface EmailModalProps {
  onClose: () => void;
  onSubmit: (email: string) => void;
  isSubmitting?: boolean;
}

const EmailModal: React.FC<EmailModalProps> = ({ onClose, onSubmit, isSubmitting = false }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    onSubmit(email);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-[#192734] rounded-xl shadow-xl w-full max-w-md mx-auto p-6">
        <h2 className="text-xl font-bold text-white mb-2">Add Your Email</h2>
        <p className="text-[#8899A6] mb-4">
          Add your email to receive insights about your coding activities and important notifications.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-[#8899A6] mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-[#253341] border border-[#38444D] rounded-md px-3 py-2 text-white placeholder-[#657786] focus:outline-none focus:ring-2 focus:ring-[#1DA1F2] focus:border-transparent"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
            />
            {error && (
              <p className="mt-1 text-sm text-[#E0245E]">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
            >
              Save Email
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailModal;