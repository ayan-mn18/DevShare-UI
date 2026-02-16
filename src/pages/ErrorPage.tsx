import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(224,36,94,0.06),_transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="border-[#2C3640] bg-[#192734]/60 backdrop-blur-xl overflow-hidden">
          {/* Top accent line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#E0245E]/50 to-transparent" />

          <CardContent className="pt-12 pb-10 px-8 text-center space-y-6">
            {/* Error icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-[#E0245E]/20 blur-xl animate-pulse" />
                <div className="relative w-20 h-20 rounded-2xl bg-[#E0245E]/10 border border-[#E0245E]/20 flex items-center justify-center rotate-6">
                  <AlertTriangle size={36} className="text-[#E0245E] -rotate-6" />
                </div>
              </div>
            </div>

            {/* 404 display */}
            <div className="space-y-1">
              <p className="text-6xl font-display font-bold text-white/10 tracking-tighter select-none">
                404
              </p>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-xl font-display font-bold text-white tracking-tight">
                Page Not Found
              </h1>
              <p className="text-sm text-[#8899A6] leading-relaxed max-w-xs mx-auto">
                The page you're looking for doesn't exist or you don't have permission to access it.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1 border-[#38444D] bg-transparent text-[#8899A6] hover:text-white hover:bg-[#253341] hover:border-[#4A5568] rounded-xl h-11"
              >
                <ArrowLeft size={16} className="mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="flex-1 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-xl h-11 font-medium"
              >
                <Home size={16} className="mr-2" />
                Return Home
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subtle bottom text */}
        <p className="text-center text-[#657786] text-xs mt-6">
          DevShare — Developer Accountability Platform
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;
