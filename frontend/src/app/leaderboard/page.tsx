'use client';

import Link from 'next/link';
import { Leaderboard } from '@/components/Leaderboard';
import { useVoteListener } from '@/hooks/useVoteListener';

export default function LeaderboardPage() {
  // Listen for new votes and show toast notifications
  useVoteListener();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-2">
              🎃 Zombie Leaderboard
            </h1>
            <p className="text-text-secondary text-lg">
              Watch the community resurrect dead protocols in real-time
            </p>
          </div>
          <Link
            href="/projects"
            className="px-6 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
          >
            Vote Now
          </Link>
        </div>
      </div>

      {/* Live Badge */}
      <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-success/10 border border-success/30">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        <span className="text-sm font-medium text-success">Live</span>
        <span className="text-xs text-text-muted">Updates in real-time as votes come in</span>
      </div>

      {/* Leaderboard */}
      <Leaderboard />

      {/* How It Works */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4 text-white">🤔 What is this?</h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            NecroBridge is a community-driven platform for resurrecting dead crypto protocols on Solana. 
            Projects are nominated, voted on by the community (using SOL), and if approved, migrated to 
            Solana via Wormhole NTT for canonical SPL token representation.
          </p>
        </div>

        <div className="glass rounded-lg p-6 border border-white/10">
          <h3 className="font-semibold text-lg mb-4 text-white">🎯 How to participate</h3>
          <ul className="text-sm text-text-secondary space-y-2">
            <li>✅ Connect your Solana wallet (Phantom or Solflare)</li>
            <li>✅ Vote YES or NO on nominated projects</li>
            <li>✅ Your vote power = amount of SOL you pledge</li>
            <li>✅ See your impact in the leaderboard above</li>
          </ul>
        </div>
      </div>

      {/* Featured Projects CTA */}
      <div className="mt-12 glass rounded-lg p-8 border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent text-center">
        <h3 className="font-display text-2xl font-bold mb-2 text-white">
          Ready to resurrect? 🧟
        </h3>
        <p className="text-text-secondary mb-6">
          Browse nominated projects and cast your vote
        </p>
        <Link
          href="/projects"
          className="inline-block px-8 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/50"
        >
          Browse Projects →
        </Link>
      </div>
    </div>
  );
}
