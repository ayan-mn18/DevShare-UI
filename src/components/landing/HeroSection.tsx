import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { Twitter, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { connectTwitter, user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      connectTwitter();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#15202B] to-[#0D1318]">

      <div className="max-w-3xl mx-auto text-center">
        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Showcase Your Code Journey
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1DA1F2] to-[#5DA9E6]"> Automatically</span>
          </h1>
        </div>

        <div className="animate-fadeIn opacity-0" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
          <p className="text-xl text-[#8899A6] mb-8 max-w-2xl mx-auto">
            Connect your X (Twitter), GitHub, and LeetCode accounts to automatically share your coding achievements with the world.
          </p>
        </div>

        <div className="animate-fadeUp opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              icon={<Twitter size={20} />}
              onClick={handleGetStarted}
              className="px-8 py-4 text-lg"
            >
              {user ? 'Go to Dashboard' : 'Connect with X'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg group"
              onClick={() => navigate('/')}
            >
              Learn More
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="mt-12 animate-fadeUp opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-[#192734] p-6 rounded-xl border border-[#38444D]">
              <div className="bg-[#1DA1F2]/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <Twitter size={24} className="text-[#1DA1F2]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Connect</h3>
              <p className="text-[#8899A6]">Link your X, GitHub, and LeetCode accounts in just a few clicks.</p>
            </div>

            <div className="bg-[#192734] p-6 rounded-xl border border-[#38444D]">
              <div className="bg-[#FFAD1F]/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFAD1F]">
                  <path d="M12 2v8"></path>
                  <path d="M12 18v4"></path>
                  <path d="M4.93 10.93l2.83 2.83"></path>
                  <path d="M16.24 16.24l2.83 2.83"></path>
                  <path d="M2 12h4"></path>
                  <path d="M18 12h4"></path>
                  <path d="M4.93 13.07l2.83-2.83"></path>
                  <path d="M16.24 7.76l2.83-2.83"></path>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Automate</h3>
              <p className="text-[#8899A6]">Set schedules for your coding accomplishment tweets.</p>
            </div>

            <div className="bg-[#192734] p-6 rounded-xl border border-[#38444D]">
              <div className="bg-[#17BF63]/10 w-12 h-12 flex items-center justify-center rounded-full mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17BF63]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-2">Share</h3>
              <p className="text-[#8899A6]">Showcase your coding journey and build your personal brand.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;