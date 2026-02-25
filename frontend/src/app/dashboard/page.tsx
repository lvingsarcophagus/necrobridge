'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { ClaimInterface } from '@/components/ClaimInterface';
import { GovernanceVoting } from '@/components/GovernanceVoting';
import { WalletButton, WalletStatus } from '@/components/WalletButton';
import { cn } from '@/lib/utils';

type TabType = 'overview' | 'vote' | 'claim' | 'portfolio';

const TABS = [
  { 
    id: 'overview' as const, 
    label: 'Overview', 
    icon: '📊', 
    description: 'Platform stats and activity',
    requiresWallet: false
  },
  { 
    id: 'vote' as const, 
    label: 'Vote', 
    icon: '🗳️', 
    description: 'Support protocol resurrections',
    requiresWallet: false
  },
  { 
    id: 'claim' as const, 
    label: 'Claim', 
    icon: '💎', 
    description: 'Claim your migrated tokens',
    requiresWallet: true
  },
  { 
    id: 'portfolio' as const, 
    label: 'Portfolio', 
    icon: '👤', 
    description: 'Your activity and history',
    requiresWallet: true
  },
];

// Stat Card Component
function StatCard({ label, value, icon, change, positive }: { label: string, value: string, icon: string, change: string, positive: boolean }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full",
          positive ? "bg-success/20 text-success" : "bg-error/20 text-error"
        )}>
          {change}
        </span>
      </div>
      <p className="text-2xl font-display font-bold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

// User Stat Card
function UserStatCard({ label, value, icon, subtext }: { label: string, value: string, icon: string, subtext: string }) {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-2xl font-display font-bold text-text-primary">{value}</p>
          <p className="text-xs text-text-muted">{label}</p>
        </div>
      </div>
      <p className="text-xs text-text-secondary">{subtext}</p>
    </div>
  );
}

// Wallet Gate Component
function WalletGate({ children, feature }: { children: React.ReactNode, feature: string }) {
  const { publicKey } = useWallet();

  if (publicKey) {
    return <>{children}</>;
  }

  return (
    <div className="glass rounded-2xl p-8 border border-white/10 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
        <Image 
          src="/death-star.ico" 
          alt="NecroBridge" 
          width={40} 
          height={40}
          className="object-contain opacity-50"
        />
      </div>
      <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
        Connect Your Wallet
      </h3>
      <p className="text-text-secondary max-w-md mx-auto mb-6">
        To {feature}, connect your Solana wallet. This enables secure access to your personal data and trustless token claims.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <WalletButton />
        <Link
          href="/docs"
          className="px-5 py-2.5 rounded-xl border border-white/20 text-text-primary hover:bg-white/5 transition-all duration-300 text-sm font-medium"
        >
          Learn More
        </Link>
      </div>
      <div className="mt-6 pt-6 border-t border-white/10">
        <p className="text-xs text-text-muted">
          Your wallet is only used for verification. We never store your private keys.
        </p>
      </div>
    </div>
  );
}

// Activity Item
function ActivityItem({ type, project, time, value }: { type: string, project: string, time: string, value: string }) {
  const icons: Record<string, string> = {
    vote: '🗳️',
    claim: '💎',
    migration: '📋',
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">
          {icons[type]}
        </div>
        <div>
          <p className="text-sm text-text-primary capitalize">{type}</p>
          <p className="text-xs text-text-muted">{project}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-success font-medium">{value}</p>
        <p className="text-xs text-text-muted">{time}</p>
      </div>
    </div>
  );
}

// Overview Tab
function OverviewTab() {
  const platformStats = [
    { label: 'Total Value Locked', value: '$2.4M', icon: '💰', change: '+12%', positive: true },
    { label: 'Active Migrations', value: '8', icon: '📋', change: '+3', positive: true },
    { label: 'Projects Revived', value: '12', icon: '🧟', change: '+2', positive: true },
    { label: 'Community Members', value: '3.2K', icon: '👥', change: '+18%', positive: true },
  ];

  return (
    <div className="space-y-8">
      {/* Platform Stats */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', title: 'Browse & Vote', desc: 'Explore nominated projects and vote to support their resurrection' },
            { step: '02', title: 'Migration', desc: 'Approved projects undergo trustless migration to Solana' },
            { step: '03', title: 'Claim Tokens', desc: 'Verify your holdings and claim tokens on Solana' },
          ].map((item) => (
            <div key={item.step} className="relative">
              <div className="flex items-start gap-4">
                <span className="text-3xl font-display font-bold text-white/10">{item.step}</span>
                <div>
                  <h3 className="font-medium text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-text-primary">Recent Activity</h2>
          <Link href="/leaderboard" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          <ActivityItem type="vote" project="Alpha Protocol" time="2 hours ago" value="+5 power" />
          <ActivityItem type="claim" project="Beta Finance" time="1 day ago" value="500 tokens" />
          <ActivityItem type="migration" project="Gamma DAO" time="2 days ago" value="Completed" />
        </div>
      </div>
    </div>
  );
}

// Portfolio Tab
function PortfolioTab() {
  const userStats = [
    { label: 'Voting Power', value: '24.5', icon: '⚡', subtext: 'Based on token holdings' },
    { label: 'Active Votes', value: '3', icon: '🗳️', subtext: 'Projects you support' },
    { label: 'Claimable', value: '2', icon: '💎', subtext: 'Ready to claim' },
    { label: 'Total Claimed', value: '1,250', icon: '✅', subtext: 'Tokens received' },
  ];

  return (
    <div className="space-y-8">
      {/* User Stats */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStats.map((stat) => (
            <UserStatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Votes */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Votes</h2>
          <div className="space-y-3">
            {[
              { project: 'Alpha Protocol', vote: 'Yes', power: '12.5', status: 'Leading' },
              { project: 'Beta Finance', vote: 'Yes', power: '8.0', status: 'Close' },
              { project: 'Gamma DAO', vote: 'No', power: '4.0', status: 'Trailing' },
            ].map((vote, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div>
                  <p className="text-sm text-text-primary font-medium">{vote.project}</p>
                  <p className="text-xs text-text-muted">Power: {vote.power}</p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  vote.vote === 'Yes' ? "bg-success/20 text-success" : "bg-error/20 text-error"
                )}>
                  {vote.vote}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Activity</h2>
          <div className="space-y-3">
            <ActivityItem type="vote" project="Alpha Protocol" time="2 hours ago" value="+5 power" />
            <ActivityItem type="claim" project="Beta Finance" time="1 day ago" value="500 tokens" />
            <ActivityItem type="migration" project="Gamma DAO" time="2 days ago" value="Completed" />
          </div>
        </div>
      </div>

      {/* Claim History */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Claim History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-text-muted border-b border-white/10">
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Tx</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { project: 'Beta Finance', date: '2026-02-20', amount: '500 BETA', status: 'Claimed', tx: '5x8a...3f2b' },
                { project: 'Delta Chain', date: '2026-02-15', amount: '750 DELTA', status: 'Claimed', tx: '8k2m...9p1q' },
              ].map((claim, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-4 text-text-primary">{claim.project}</td>
                  <td className="py-4 text-text-muted">{claim.date}</td>
                  <td className="py-4 text-success">{claim.amount}</td>
                  <td className="py-4">
                    <span className="px-2 py-1 rounded-full bg-success/20 text-success text-xs">
                      {claim.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <a href="#" className="text-primary hover:underline text-xs">{claim.tx}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const { publicKey } = useWallet();

  return (
    <div className="min-h-screen pt-24 pb-12 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      
      {/* Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!publicKey ? (
          /* Wallet Gate - Show when not connected */
          <div className="min-h-[60vh] flex items-center justify-center">
            <WalletGate feature="access the dashboard">
              <div />
            </WalletGate>
          </div>
        ) : (
          /* Dashboard Content - Show when connected */
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full border border-gray-400 flex items-center justify-center bg-white overflow-hidden">
                      <Image 
                        src="/death-star.ico" 
                        alt="NecroBridge" 
                        width={28} 
                        height={28}
                        className="object-contain"
                      />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary">
                      Dashboard
                    </h1>
                  </div>
                  <p className="text-text-secondary max-w-xl">
                    Your command center for protocol resurrection. Vote, track, and claim.
                  </p>
                </div>
                <WalletStatus />
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="flex items-center gap-1 p-1 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 w-fit">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative px-5 py-3 rounded-xl font-medium transition-all duration-300 text-sm flex items-center gap-2",
                        isActive
                          ? 'bg-white/10 text-white border border-white/20'
                          : 'text-text-secondary hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in duration-300">
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'vote' && <GovernanceVoting />}
              {activeTab === 'claim' && <ClaimInterface />}
              {activeTab === 'portfolio' && <PortfolioTab />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
