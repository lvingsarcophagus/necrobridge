'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import Image from 'next/image';
import { ClaimInterface } from '@/components/ClaimInterface';
import { GovernanceVoting } from '@/components/GovernanceVoting';
import { WalletButton, WalletStatus } from '@/components/WalletButton';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Vote, 
  Gem, 
  User, 
  Copy, 
  ExternalLink, 
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  Wallet,
  ArrowRight
} from "lucide-react";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";

type TabType = 'overview' | 'vote' | 'claim' | 'portfolio';

const TABS = [
  { 
    id: 'overview' as const, 
    label: 'Overview', 
    icon: LayoutDashboard, 
    description: 'Platform stats and activity',
    requiresWallet: false
  },
  { 
    id: 'vote' as const, 
    label: 'Vote', 
    icon: Vote, 
    description: 'Support protocol resurrections',
    requiresWallet: false
  },
  { 
    id: 'claim' as const, 
    label: 'Claim', 
    icon: Gem, 
    description: 'Claim your migrated tokens',
    requiresWallet: true
  },
  { 
    id: 'portfolio' as const, 
    label: 'Portfolio', 
    icon: User, 
    description: 'Your activity and history',
    requiresWallet: true
  },
];

// Loading Skeleton Component
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/10 rounded", className)} />
  );
}

// Address Truncation + Copy Component
function TruncatedAddress({ address, showCopy = true }: { address: string; showCopy?: boolean }) {
  const [copied, setCopied] = useState(false);
  
  const truncate = (addr: string) => {
    if (addr.length <= 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{truncate(address)}</span>
      {showCopy && (
        <button 
          onClick={handleCopy}
          className="p-1 rounded hover:bg-white/10 transition-colors"
          aria-label={copied ? "Copied!" : "Copy address"}
        >
          {copied ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-white/50 hover:text-white/80" />
          )}
        </button>
      )}
    </div>
  );
}

// Solscan Link Component
function SolscanLink({ tx, type = 'tx' }: { tx: string; type?: 'tx' | 'address' }) {
  const href = `https://solscan.io/${type}/${tx}`;
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
      aria-label={`View on Solscan`}
    >
      {tx.slice(0, 6)}...{tx.slice(-4)}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

// Stat Card Component
function StatCard({ label, value, icon: Icon, change, positive, loading = false }: { 
  label: string; 
  value: string; 
  icon: React.ElementType; 
  change: string; 
  positive: boolean;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 border border-white/10">
        <Skeleton className="w-10 h-10 rounded-xl mb-3" />
        <Skeleton className="w-24 h-8 mb-1" />
        <Skeleton className="w-16 h-4" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-white/70" />
        </div>
        <span className={cn(
          "text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1",
          positive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
        )}>
          {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change}
        </span>
      </div>
      <p className="text-2xl font-display font-bold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

// User Stat Card
function UserStatCard({ label, value, icon: Icon, subtext, loading = false }: { 
  label: string; 
  value: string; 
  icon: React.ElementType; 
  subtext: string;
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-5 border border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div>
            <Skeleton className="w-16 h-6 mb-1" />
            <Skeleton className="w-20 h-3" />
          </div>
        </div>
        <Skeleton className="w-full h-3" />
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 group">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-white/70" />
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

// Claimable Balance Table Component
function ClaimableBalanceTable({ onClaimAll }: { onClaimAll: () => void }) {
  const [loading, setLoading] = useState(true);
  const [claimableItems, setClaimableItems] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching claimable balances
    setTimeout(() => {
      setClaimableItems([
        { project: 'Beta Finance', ticker: 'BETA', amount: '500', status: 'ready', tx: null },
        { project: 'Delta Chain', ticker: 'DELTA', amount: '750', status: 'ready', tx: null },
        { project: 'Gamma DAO', ticker: 'GAMMA', amount: '1,200', status: 'pending', tx: '8k2m...9p1q' },
      ]);
      setLoading(false);
    }, 1500);
  }, []);

  const totalClaimable = claimableItems
    .filter(item => item.status === 'ready')
    .reduce((sum, item) => sum + parseInt(item.amount.replace(',', '')), 0);

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-24 h-10" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="w-full h-14" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-text-primary">Claimable Balance</h3>
          <p className="text-xs text-text-muted">
            {claimableItems.filter(i => i.status === 'ready').length} projects ready to claim
          </p>
        </div>
        <button
          onClick={onClaimAll}
          disabled={totalClaimable === 0}
          className={cn(
            "px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2",
            totalClaimable > 0
              ? "bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
              : "bg-white/5 text-text-muted border border-white/10 cursor-not-allowed"
          )}
        >
          Claim All
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs text-text-muted border-b border-white/10">
              <th className="pb-3 font-medium">Project</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {claimableItems.map((item, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="py-4">
                  <div>
                    <p className="text-text-primary font-medium">{item.project}</p>
                    <p className="text-xs text-text-muted">${item.ticker}</p>
                  </div>
                </td>
                <td className="py-4 text-green-400 font-medium">{item.amount} tokens</td>
                <td className="py-4">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs",
                    item.status === 'ready' 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {item.status === 'ready' ? 'Ready' : 'Pending'}
                  </span>
                </td>
                <td className="py-4">
                  {item.status === 'ready' ? (
                    <Link 
                      href="/dashboard?tab=claim"
                      className="text-xs text-primary hover:underline"
                    >
                      Claim
                    </Link>
                  ) : item.tx ? (
                    <SolscanLink tx={item.tx} />
                  ) : (
                    <span className="text-xs text-text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalClaimable > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-sm text-text-muted">Total Claimable</span>
          <span className="text-lg font-bold text-green-400">{totalClaimable.toLocaleString()} tokens</span>
        </div>
      )}
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
      <h3 className="font-display text-xl font-semibold text-text-primary mb-2">
        Connect Wallet
      </h3>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">
        Connect your Solana wallet to {feature}
      </p>
      <WalletButton />
    </div>
  );
}

// Overview Tab
function OverviewTab() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  return (
    <div className="space-y-8">
      {/* Platform Stats */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value="24" icon={LayoutDashboard} change="+12%" positive={true} loading={loading} />
          <StatCard label="Active Votes" value="156" icon={Vote} change="+8%" positive={true} loading={loading} />
          <StatCard label="TVL Locked" value="$2.4M" icon={Wallet} change="+23%" positive={true} loading={loading} />
          <StatCard label="Migrations" value="12" icon={Activity} change="+4" positive={true} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - Live */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-text-primary">Recent Activity</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </div>
          <LiveActivityFeed showGlobal maxItems={5} />
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link href="/nominate" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Activity className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-text-primary font-medium">Nominate Project</p>
                  <p className="text-xs text-text-muted">Submit a dead protocol for revival</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </Link>
            <Link href="/projects" className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Vote className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <p className="text-text-primary font-medium">Vote on Projects</p>
                  <p className="text-xs text-text-muted">Support protocols you want revived</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Portfolio Tab
function PortfolioTab() {
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
  }, []);

  const userStats = [
    { label: 'Voting Power', value: '24.5', icon: Activity, subtext: 'Based on token holdings' },
    { label: 'Active Votes', value: '3', icon: Vote, subtext: 'Projects you support' },
    { label: 'Claimable', value: '2', icon: Gem, subtext: 'Ready to claim' },
    { label: 'Total Claimed', value: '1,250', icon: CheckCircle2, subtext: 'Tokens received' },
  ];

  const handleClaimAll = () => {
    // Navigate to claim tab
    window.location.href = '/dashboard?tab=claim';
  };

  return (
    <div className="space-y-8">
      {/* Wallet Info */}
      {publicKey && (
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted mb-1">Connected Wallet</p>
              <TruncatedAddress address={publicKey.toString()} />
            </div>
            <a 
              href={`https://solscan.io/account/${publicKey.toString()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm"
            >
              View on Solscan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStats.map((stat) => (
            <UserStatCard key={stat.label} {...stat} loading={loading} />
          ))}
        </div>
      </div>

      {/* Claimable Balance Table */}
      <ClaimableBalanceTable onClaimAll={handleClaimAll} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Votes */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Votes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-16" />)}
            </div>
          ) : (
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
                    vote.vote === 'Yes' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {vote.vote}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Your Activity - Live */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-text-primary">Your Activity</h2>
            {publicKey && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-text-muted">Live</span>
              </div>
            )}
          </div>
          {publicKey ? (
            <LiveActivityFeed userId={publicKey.toString()} maxItems={5} />
          ) : (
            <div className="text-center py-8 text-text-muted">
              <p className="text-sm">Connect wallet to see your activity</p>
            </div>
          )}
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
              {loading ? (
                [1, 2].map(i => (
                  <tr key={i}>
                    <td className="py-4"><Skeleton className="w-24 h-4" /></td>
                    <td className="py-4"><Skeleton className="w-20 h-4" /></td>
                    <td className="py-4"><Skeleton className="w-16 h-4" /></td>
                    <td className="py-4"><Skeleton className="w-14 h-4" /></td>
                    <td className="py-4"><Skeleton className="w-20 h-4" /></td>
                  </tr>
                ))
              ) : (
                [
                  { project: 'Beta Finance', date: '2026-02-20', amount: '500 BETA', status: 'Claimed', tx: '5x8a...3f2b' },
                  { project: 'Delta Chain', date: '2026-02-15', amount: '750 DELTA', status: 'Claimed', tx: '8k2m...9p1q' },
                ].map((claim, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-4 text-text-primary">{claim.project}</td>
                    <td className="py-4 text-text-muted">{claim.date}</td>
                    <td className="py-4 text-green-400">{claim.amount}</td>
                    <td className="py-4">
                      <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4">
                      <SolscanLink tx={claim.tx} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

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
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-text-primary mb-4">
                <Wallet className="w-3.5 h-3.5" />
                {publicKey ? 'Wallet Connected' : 'Connect Wallet'}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">
                Dashboard
              </h1>
              <p className="text-text-secondary text-lg max-w-xl">
                Manage your nominations, votes, and token claims
              </p>
            </div>
            <WalletStatus />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isLocked = tab.requiresWallet && !publicKey;
            
            return (
              <button
                key={tab.id}
                onClick={() => !isLocked && setActiveTab(tab.id)}
                disabled={isLocked}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white/10 border border-white/20 text-text-primary"
                    : "bg-transparent border border-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
                  isLocked && "opacity-50 cursor-not-allowed"
                )}
                aria-label={tab.label}
                aria-selected={activeTab === tab.id}
                role="tab"
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isLocked && (
                  <span className="text-xs">🔒</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div role="tabpanel">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'vote' && <GovernanceVoting />}
          {activeTab === 'claim' && (
            !publicKey ? (
              <WalletGate feature="claim your tokens">
                <div />
              </WalletGate>
            ) : (
              <ClaimInterface />
            )
          )}
          {activeTab === 'portfolio' && (
            !publicKey ? (
              <WalletGate feature="view your portfolio">
                <div />
              </WalletGate>
            ) : (
              <PortfolioTab />
            )
          )}
        </div>
      </div>
    </div>
  );
}
