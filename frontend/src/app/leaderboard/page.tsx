'use client';

import Link from 'next/link';
import { Leaderboard } from '@/components/Leaderboard';
import { useVoteListener } from '@/hooks/useVoteListener';

export default function LeaderboardPage() {
  // Listen for new votes and show toast notifications
  useVoteListener();
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Enhanced Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-text-primary mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Updates
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3 animate-fade-in">
                <span className="mr-2">🎃</span>
                Zombie Leaderboard
              </h1>
              <p className="text-text-secondary text-lg max-w-xl animate-fade-in animation-delay-100">
                Watch the community resurrect dead protocols in real-time. 
                Every vote brings a project closer to life.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Vote Now
              </Link>
              <Link
                href="/nominate"
                className="px-6 py-3 rounded-xl border border-white/20 text-text-primary hover:bg-white/5 transition-all duration-300"
              >
                Nominate
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Votes', value: '24', icon: '🗳️' },
            { label: 'Projects Revived', value: '12', icon: '🧟' },
            { label: 'Total Value', value: '$2.4M', icon: '💰' },
            { label: 'Community Members', value: '1,420', icon: '👥' },
          ].map((stat, i) => (
            <div 
              key={stat.label}
              className="glass rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl group-hover:scale-110 transition-transform duration-300">{stat.icon}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="font-display text-2xl font-bold text-text-primary">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="mb-12">
          <Leaderboard />
        </div>

        {/* Info Cards - Enhanced */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
              💀
            </div>
            <h3 className="font-display font-semibold text-lg mb-3 text-text-primary">
              What is NecroBridge?
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-4">
              A community-driven platform for resurrecting dead crypto protocols on Solana. 
              Projects are nominated, voted on by the community, and if approved, migrated 
              to Solana with full governance rights for token holders.
            </p>
            <Link href="/docs" className="text-sm text-primary hover:text-text-primary transition-colors inline-flex items-center gap-1">
              Read the docs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 group">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-success/20 transition-all duration-300">
              🎯
            </div>
            <h3 className="font-display font-semibold text-lg mb-3 text-text-primary">
              How to Participate
            </h3>
            <ul className="space-y-3">
              {[
                'Connect your Solana wallet (Phantom or Solflare)',
                'Browse nominated dead protocols',
                'Vote YES or NO on projects you want to revive',
                'Claim tokens when migration completes',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-text-primary flex-shrink-0">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Featured CTA - Enhanced */}
        <div className="glass rounded-2xl p-10 border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent text-center relative overflow-hidden group">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-success/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-white/5 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              🧟
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3 text-text-primary">
              Ready to Resurrect?
            </h3>
            <p className="text-text-secondary mb-8 max-w-md mx-auto">
              Join the community of builders bringing dead protocols back to life. 
              Every token deserves a second chance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/projects"
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 font-semibold transition-all duration-300 hover:-translate-y-0.5"
              >
                Browse Projects →
              </Link>
              <Link
                href="/nominate"
                className="w-full sm:w-auto px-8 py-3 rounded-xl border border-white/20 text-text-primary hover:bg-white/5 transition-all duration-300"
              >
                Nominate a Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
