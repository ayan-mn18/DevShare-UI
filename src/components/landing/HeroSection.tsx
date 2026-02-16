import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Twitter, ArrowRight, Github, Code, TrendingUp, CheckCircle, Zap, Shield, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShinyText from '../react-bits/ShinyText';
import SpotlightCard from '../react-bits/SpotlightCard';
import TiltedCard from '../react-bits/TiltedCard';

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
    <div className="min-h-screen bg-[#0A0F14] text-white relative overflow-hidden selection:bg-[#1DA1F2]/30 font-sans">
      {/* Layered Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(255,255,255,0.03)_1px,_transparent_0)] bg-[size:32px_32px]" />
        {/* Gradient orbs */}
        <div className="absolute top-[-20%] left-[20%] w-[800px] h-[600px] bg-[#1DA1F2]/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[500px] bg-[#17BF63]/[0.05] rounded-full blur-[130px]" />
        <div className="absolute top-[40%] right-[30%] w-[400px] h-[400px] bg-[#FFAD1F]/[0.03] rounded-full blur-[120px]" />
        {/* Noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-50" />
      </div>

      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-5">
        <nav className="mx-auto max-w-5xl">
          <div className="glass-strong rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl shadow-black/30">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-[#1DA1F2] blur-md opacity-40 rounded-full group-hover:opacity-70 transition-opacity duration-300" />
                <img src="/icon.ico" alt="DevShare" className="w-8 h-8 rounded-full relative z-10 ring-1 ring-white/10" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight">DevShare</span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {['Features', 'How it Works'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white rounded-lg hover:bg-white/[0.04] transition-all duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGetStarted}
                className="hidden sm:inline-flex text-white/60 hover:text-white hover:bg-white/[0.04]"
              >
                {user ? 'Dashboard' : 'Sign In'}
              </Button>
              <Button
                size="sm"
                onClick={handleGetStarted}
                className="rounded-full bg-white text-[#0A0F14] hover:bg-white/90 font-semibold px-5 shadow-[0_0_24px_-6px_rgba(255,255,255,0.2)] hover:shadow-[0_0_32px_-4px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                Get Started
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-36 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">

          {/* Floating Badge */}
          <div className="inline-flex items-center mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Badge variant="outline" className="gap-2 py-1.5 px-4 border-[#1DA1F2]/20 bg-[#1DA1F2]/[0.06] text-[#1DA1F2] hover:bg-[#1DA1F2]/[0.1] transition-colors cursor-default rounded-full font-medium text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DA1F2] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DA1F2]" />
              </span>
              Automated Developer Accountability
              <Sparkles className="w-3.5 h-3.5" />
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-display font-black tracking-tight mb-6 leading-[0.95] animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="block text-white/90">Automate Your</span>
            <ShinyText
              text="Developer Legacy"
              disabled={false}
              speed={3}
              className="text-gradient-brand mt-2 block"
            />
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-white/40 max-w-2xl mx-auto mb-12 leading-relaxed font-medium animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Stop manually posting updates. DevShare syncs your GitHub commits
            and LeetCode streaks directly to X. Build your brand on autopilot.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="group relative px-8 py-6 bg-[#1DA1F2] text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_-10px_rgba(29,161,242,0.5)] text-base"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:translate-x-full transition-transform duration-700 skew-x-12 -translate-x-full" />
              <Twitter className="w-5 h-5 mr-2 relative z-10" />
              <span className="relative z-10">Connect with X</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open('https://x.com/AyanMn18/status/1937941404023447676', '_blank')}
              className="px-8 py-6 bg-transparent border-white/10 text-white/70 hover:text-white hover:bg-white/[0.04] hover:border-white/20 rounded-full transition-all duration-300 group text-base"
            >
              See Example
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Dashboard Preview Card */}
          <div className="relative max-w-3xl mx-auto z-20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <TiltedCard
              containerHeight="auto"
              containerWidth="100%"
              rotateAmplitude={6}
              scaleOnHover={1.01}
            >
              {/* Outer glow */}
              <div className="absolute -inset-px bg-gradient-to-b from-[#1DA1F2]/20 via-transparent to-[#17BF63]/10 rounded-2xl blur-sm" />

              <div className="relative glass-strong rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
                {/* Browser chrome */}
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#FEBC2E]/80" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840]/80" />
                  </div>
                  <div className="ml-4 px-3 py-1.5 bg-white/[0.04] rounded-lg text-xs text-white/30 flex items-center gap-2 font-mono">
                    <Shield className="w-3 h-3" />
                    devshare.app/dashboard
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      icon: <Github className="w-4 h-4" />,
                      label: 'GitHub Activity',
                      value: '12 Commits',
                      change: '+4 from yesterday',
                      changeColor: 'text-[#17BF63]',
                      changeIcon: <TrendingUp className="w-3 h-3" />,
                    },
                    {
                      icon: <Code className="w-4 h-4" />,
                      label: 'LeetCode Streak',
                      value: '15 Days',
                      change: 'Keep it up!',
                      changeColor: 'text-[#FFAD1F]',
                      changeIcon: <Zap className="w-3 h-3" />,
                    },
                    {
                      icon: <Twitter className="w-4 h-4" />,
                      label: 'Next Tweet',
                      value: '00:00 IST',
                      change: 'Scheduled',
                      changeColor: 'text-[#1DA1F2]',
                      changeIcon: <CheckCircle className="w-3 h-3" />,
                    },
                  ].map((stat, i) => (
                    <Card key={i} className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 group">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-white/30 text-xs mb-3 font-medium">
                          {stat.icon}
                          <span>{stat.label}</span>
                        </div>
                        <div className="text-xl font-bold text-white mb-1 font-display">{stat.value}</div>
                        <div className={`${stat.changeColor} text-xs flex items-center gap-1 font-medium`}>
                          {stat.changeIcon}
                          {stat.change}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Tweet Preview */}
                <div className="mt-5 bg-white/[0.02] rounded-xl p-4 border border-white/[0.05] flex gap-4 items-start hover:bg-white/[0.04] transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1DA1F2] to-[#17BF63] flex items-center justify-center shrink-0 shadow-lg shadow-[#1DA1F2]/20">
                    <Twitter className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">DevShare User</span>
                      <span className="text-white/25 text-xs">@devshare_user · 2h</span>
                    </div>
                    <p className="text-white/60 mt-1.5 text-sm leading-relaxed">
                      Day 15 of #100DaysOfCode 🚀<br />
                      ✅ 12 Commits on GitHub<br />
                      ✅ Solved "Two Sum" on LeetCode<br /><br />
                      Consistency is key! #coding #webdev
                    </p>
                  </div>
                </div>
              </div>
            </TiltedCard>
          </div>
        </div>
      </main>

      {/* Stats Strip */}
      <div className="border-y border-white/[0.05] bg-white/[0.01] backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'Active Developers', value: '1,000+' },
            { label: 'Tweets Automated', value: '50k+' },
            { label: 'Lines of Code', value: '1M+' },
            { label: 'Hours Saved', value: '500+' },
          ].map((stat, i) => (
            <div key={i} className="group" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-3xl md:text-5xl font-display font-black text-white mb-2 group-hover:text-[#1DA1F2] transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-white/25 text-xs uppercase tracking-[0.2em] font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <Badge variant="outline" className="mb-6 border-white/10 bg-white/[0.03] text-white/50 rounded-full px-4 py-1.5 text-xs font-medium">
              How it works
            </Badge>
            <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">
              Connect. Automate. Share.
            </h2>
            <p className="text-white/30 text-lg max-w-2xl mx-auto font-medium">
              Three simple steps to showcase your coding journey and build your reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Twitter className="w-7 h-7 text-[#1DA1F2]" />,
                title: 'Connect',
                desc: 'Link your X, GitHub, and LeetCode accounts in just a few clicks.',
                color: '#1DA1F2',
                footerContent: (
                  <div className="flex items-center gap-3 text-[#1DA1F2]">
                    <Twitter className="w-4 h-4" />
                    <Github className="w-4 h-4" />
                    <Code className="w-4 h-4" />
                  </div>
                ),
                step: '01',
              },
              {
                icon: <Zap className="w-7 h-7 text-[#FFAD1F]" />,
                title: 'Automate',
                desc: 'Set schedules for your coding accomplishment tweets. Daily updates at midnight IST.',
                color: '#FFAD1F',
                footerContent: <span className="text-[#FFAD1F] text-xs font-medium">⏰ Scheduled daily at midnight</span>,
                step: '02',
              },
              {
                icon: <TrendingUp className="w-7 h-7 text-[#17BF63]" />,
                title: 'Share',
                desc: 'Showcase your coding journey and build your personal brand automatically.',
                color: '#17BF63',
                footerContent: <span className="text-[#17BF63] text-xs font-medium">📈 Build your developer brand</span>,
                step: '03',
              },
            ].map((feature, i) => (
              <SpotlightCard
                key={i}
                className="bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12] transition-all duration-500 group hover:-translate-y-1"
                spotlightColor={`${feature.color}15`}
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Step number */}
                  <div className="text-white/[0.06] font-display font-black text-6xl absolute top-4 right-6">
                    {feature.step}
                  </div>

                  <div
                    className="w-14 h-14 flex items-center justify-center rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300"
                    style={{ backgroundColor: `${feature.color}10` }}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-white font-display font-bold mb-3 text-2xl tracking-tight">{feature.title}</h3>
                  <p className="text-white/30 mb-6 leading-relaxed flex-grow font-medium">{feature.desc}</p>

                  <Separator className="mb-4 bg-white/[0.06]" />

                  <div className="flex items-center">
                    {feature.footerContent}
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 md:p-16 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-[#1DA1F2]/[0.08] rounded-full blur-[80px]" />

            <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4 tracking-tight relative z-10">
              Ready to automate your journey?
            </h2>
            <p className="text-white/30 text-lg mb-8 max-w-lg mx-auto relative z-10 font-medium">
              Join thousands of developers who are building their personal brand on autopilot.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="relative z-10 px-8 py-6 bg-[#1DA1F2] text-white font-semibold rounded-full hover:scale-[1.03] hover:shadow-[0_0_50px_-10px_rgba(29,161,242,0.5)] transition-all duration-300 text-base"
            >
              <Twitter className="w-5 h-5 mr-2" />
              Start Building Your Legacy
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-4 py-8 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/icon.ico" alt="DevShare" className="w-5 h-5 rounded-full opacity-30 hover:opacity-70 transition-opacity" />
            <span className="text-white/20 text-sm font-medium">© 2025 DevShare. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/20 font-medium">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
            <a href="https://x.com/AyanMn18" target="_blank" rel="noreferrer" className="hover:text-white/50 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HeroSection;
