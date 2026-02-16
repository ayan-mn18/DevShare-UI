import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

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
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-[#161B22] border-white/[0.08] text-white rounded-2xl shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold text-white">Add Your Email</DialogTitle>
          <DialogDescription className="text-white/30 text-sm mt-1">
            Add your email to receive insights about your coding activities and important notifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/50 text-sm font-medium">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-white/15 rounded-xl h-11 focus-visible:ring-[#1DA1F2]/30"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              required
            />
            {error && (
              <p className="text-xs text-[#E0245E] font-medium">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-3 sm:gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-xl border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white font-medium flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                'Save Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
