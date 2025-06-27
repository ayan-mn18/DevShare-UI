import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import { Twitter, ArrowRight, Github, Code, Users, TrendingUp, Star, TwitterIcon } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-[#15202B] to-[#0D1318] relative overflow-hidden">
      {/* Background Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#1DA1F2]/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-[#1DA1F2]/5 rounded-lg rotate-45 animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 border-2 border-[#17BF63]/10 rotate-12"></div>
        <div className="absolute bottom-20 right-10 w-20 h-20 bg-gradient-to-r from-[#1DA1F2]/5 to-[#17BF63]/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-[#1DA1F2] rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-[#17BF63] rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>

            <img src="/icon.ico" alt="DevShare Logo" className="w-12 h-12 rounded-full" />

            <div>
              <h1 className="text-2xl font-bold text-white">DevShare</h1>
              <p className="text-xs text-[#8899A6]">Automate Your Code Journey</p>
            </div>
          </div>

          <nav className="flex items-center space-x-6">
            <a href="#features" className="text-[#8899A6] hover:text-white transition-colors hidden md:flex">Features</a>
            <a href="#how-it-works" className="text-[#8899A6] hover:text-white transition-colors hidden md:flex">How it Works</a>
            <Button variant="outline" size="sm" onClick={handleGetStarted}>
              Sign In
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center px-4 py-10 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Indicators */}
          <div className="animate-fadeIn opacity-0 mb-8" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
            <div className="flex items-center justify-center space-x-6 text-[#8899A6] text-sm">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>1000+ Developers</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp size={16} />
                <span>50K+ Automated Tweets</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star size={16} />
                <span>Trusted Platform</span>
              </div>
            </div>
          </div>

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

          {/* Demo Tweet Preview */}
          <div className="animate-fadeIn opacity-0 mb-8" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
            <div className="bg-[#192734] border border-[#38444D] rounded-xl p-4 max-w-md mx-auto">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[#1DA1F2] to-[#5DA9E6] rounded-full flex items-center justify-center">
                  <TwitterIcon size={16} className="text-white" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-white font-medium">@AyanMn18</span>
                    <span className="text-[#8899A6] text-sm">• 2h</span>
                  </div>
                  <p className="text-white text-sm">
                    🚀 Made 12 commits on GitHub today!<br />
                    💻 Solved 3 LeetCode problems with a 15-day streak!<br /><br />
                    #coding #developer #100DaysOfCode
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[#8899A6] text-sm mt-2">Preview of your automated tweets</p>
          </div>

          <div className="animate-fadeUp opacity-0" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                icon={<Twitter size={20} />}
                onClick={handleGetStarted}
                className="w-full md:w-auto px-8 py-4 text-lg shadow-lg shadow-[#1DA1F2]/25"
              >
                {user ? 'Go to Dashboard' : 'Connect with X'}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg group w-full md:w-auto"
                // onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                // open a new tab with this link : https://x.com/AyanMn18/status/1937941404023447676
                onClick={() => window.open('https://x.com/AyanMn18/status/1937941404023447676', '_blank')}

              >
                Example tweet
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fadeUp opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
            <h2 className="text-3xl font-bold text-white mb-4">Connect. Automate. Share.</h2>
            <p className="text-[#8899A6] text-lg">Three simple steps to showcase your coding journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#192734] p-8 rounded-xl border border-[#38444D] hover:border-[#1DA1F2]/50 transition-all duration-300 group">
              <div className="bg-[#1DA1F2]/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Twitter size={28} className="text-[#1DA1F2]" />
              </div>
              <h3 className="text-white font-semibold mb-3 text-xl">Connect</h3>
              <p className="text-[#8899A6] mb-4">Link your X, GitHub, and LeetCode accounts in just a few clicks.</p>
              <div className="flex items-center space-x-2 text-sm text-[#1DA1F2]">
                <Twitter size={16} />
                <Github size={16} />
                <Code size={16} />
              </div>
            </div>

            <div className="bg-[#192734] p-8 rounded-xl border border-[#38444D] hover:border-[#FFAD1F]/50 transition-all duration-300 group">
              <div className="bg-[#FFAD1F]/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#FFAD1F]">
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
              <h3 className="text-white font-semibold mb-3 text-xl">Automate</h3>
              <p className="text-[#8899A6] mb-4">Set schedules for your coding accomplishment tweets. Daily updates at midnight IST.</p>
              <div className="text-sm text-[#FFAD1F]">
                ⏰ Scheduled daily at midnight
              </div>
            </div>

            <div className="bg-[#192734] p-8 rounded-xl border border-[#38444D] hover:border-[#17BF63]/50 transition-all duration-300 group">
              <div className="bg-[#17BF63]/10 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#17BF63]">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-3 text-xl">Share</h3>
              <p className="text-[#8899A6] mb-4">Showcase your coding journey and build your personal brand automatically.</p>
              <div className="text-sm text-[#17BF63]">
                📈 Build your developer brand
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div id="how-it-works" className="relative z-10 px-4 py-20 bg-[#0D1318]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-16">How DevShare Works</h2>

          <div className="space-y-12">
            <div className="flex items-center space-x-8">
              <div className="bg-[#1DA1F2] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">1</div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-white mb-2">Connect Your Accounts</h3>
                <p className="text-[#8899A6]">Securely link your X (Twitter), GitHub, and LeetCode accounts through OAuth.</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="bg-[#FFAD1F] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">2</div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-white mb-2">We Track Your Progress</h3>
                <p className="text-[#8899A6]">Our system monitors your GitHub commits and LeetCode solutions daily.</p>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="bg-[#17BF63] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">3</div>
              <div className="flex-1 text-left">
                <h3 className="text-xl font-semibold text-white mb-2">Auto-Tweet Your Achievements</h3>
                <p className="text-[#8899A6]">Every day at midnight IST, we automatically tweet your coding accomplishments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-12 border-t border-[#38444D]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0 cursor-pointer" onClick={() => navigate('/')}>
              <img src="/icon.ico" alt="DevShare Logo" className="w-12 h-12 rounded-full" />
              <div>
                <h3 className="text-white text-lg font-semibold">DevShare</h3>
                <p className="text-[#8899A6] text-sm">Automate Your Code Journey</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-[#8899A6] text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#38444D] text-center text-[#8899A6] text-sm">
            <p>&copy; 2025 DevShare. Built for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;