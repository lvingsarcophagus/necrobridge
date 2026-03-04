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
  Activity,
  CheckCircle2,
  Wallet,
  ArrowRight
} from "lucide-react";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  getCountFromServer
} from 'firebase/firestore';

type TabType = 'overview' | 'vote' | 'claim' | 'portfolio';

const TABS = [
  { id: 'overview' as const, label: 'Overview', icon: LayoutDashboard, description: 'Platform stats and activity', requiresWallet: false },
  { id: 'vote' as const, label: 'Vote', icon: Vote, description: 'Support protocol resurrections', requiresWallet: false },
  { id: 'claim' as const, label: 'Claim', icon: Gem, description: 'Claim your migrated tokens', requiresWallet: true },
  { id: 'portfolio' as const, label: 'Portfolio', icon: User, description: 'Your activity and history', requiresWallet: true },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse bg-white/10 rounded", className)} />;
}

function TruncatedAddress({ address, showCopy = true }: { address: string; showCopy?: boolean }) {
  const [copied, setCopied] = useState(false);
  const truncate = (addr: string) => addr.length <= 12 ? addr : `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm">{truncate(address)}</span>
      {showCopy && (
        <button onClick={handleCopy} className="p-1 rounded hover:bg-white/10 transition-colors">
          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-white/50 hover:text-white/80" />}
        </button>
      )}
    </div>
  );
}

function SolscanLink({ tx, type = 'tx' }: { tx: string; type?: 'tx' | 'address' }) {
  return (
    <a href={`https://solscan.io/${type}/${tx}`} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
      {tx.slice(0, 6)}...{tx.slice(-4)}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}

function StatCard({ label, value, icon: Icon, loading = false }: {
  label: string; value: string; icon: React.ElementType; loading?: boolean;
}) {
  if (loading) return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <Skeleton className="w-10 h-10 rounded-xl mb-3" />
      <Skeleton className="w-24 h-8 mb-1" />
      <Skeleton className="w-16 h-4" />
    </div>
  );
  return (
    <div className="glass rounded-2xl p-5 border border-white/10 hover:border-white/30 transition-all duration-300 group">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white/70" />
      </div>
      <p className="text-2xl font-display font-bold text-text-primary mb-1">{value}</p>
      <p className="text-xs text-text-muted">{label}</p>
    </div>
  );
}

function WalletGate({ children, feature }: { children: React.ReactNode; feature: string }) {
  const { publicKey } = useWallet();
  if (publicKey) return <>{children}</>;
  return (
    <div className="glass rounded-2xl p-8 border border-white/10 text-center">
      <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
        <Image src="/death-star.ico" alt="NecroBridge" width={40} height={40} className="object-contain opacity-50" />
      </div>
      <h3 className="font-display text-xl font-semibold text-text-primary mb-2">Connect Wallet</h3>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">Connect your Solana wallet to {feature}</p>
      <WalletButton />
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab() {
  const [stats, setStats] = useState({ nominations: 0, activeVotes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [nomSnap, talliesSnap] = await Promise.all([
          getCountFromServer(collection(db, 'nominations')),
          getDocs(collection(db, 'voteTallies')),
        ]);
        setStats({
          nominations: nomSnap.data().count,
          activeVotes: talliesSnap.size,
        });
      } catch { /* non-critical */ }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Platform Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Projects Nominated" value={loading ? '—' : stats.nominations.toString()} icon={LayoutDashboard} loading={loading} />
          <StatCard label="Active Votes" value={loading ? '—' : stats.activeVotes.toString()} icon={Vote} loading={loading} />
          <StatCard label="Chains Supported" value="8" icon={Activity} />
          <StatCard label="Approval Threshold" value="80%" icon={CheckCircle2} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

// ── Portfolio Tab ─────────────────────────────────────────────────────────────
function PortfolioTab() {
  const { publicKey } = useWallet();
  const walletAddr = publicKey?.toString() ?? '';

  const [loading, setLoading] = useState(true);
  const [userVotes, setUserVotes] = useState<{ projectId: string; direction: string; quadraticPower: number }[]>([]);
  const [claimHistory, setClaimHistory] = useState<{ project: string; ticker: string; amount: string; date: string; tx: string }[]>([]);
  const [nominations, setNominations] = useState<{ name: string; ticker: string }[]>([]);

  useEffect(() => {
    if (!walletAddr) return;

    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Votes cast by this wallet
        const votesQ = query(collection(db, 'userVotes'), where('walletAddress', '==', walletAddr));
        const votesSnap = await getDocs(votesQ);
        setUserVotes(votesSnap.docs.map(d => ({
          projectId: d.data().projectId,
          direction: d.data().direction,
          quadraticPower: d.data().quadraticPower || 0,
        })));

        // 2. Claim history from activity collection
        const actQ = query(
          collection(db, 'activity'),
          where('userId', '==', walletAddr),
          where('type', '==', 'claim'),
          orderBy('timestamp', 'desc'),
          limit(10)
        );
        const actSnap = await getDocs(actQ);
        setClaimHistory(actSnap.docs.map(d => {
          const a = d.data();
          const ts = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp || Date.now());
          return {
            project: a.projectName || a.ticker,
            ticker: a.ticker || '—',
            amount: a.description || '—',
            date: ts.toLocaleDateString(),
            tx: a.txSignature || '',
          };
        }));

        // 3. Nominations submitted by this wallet
        const nomQ = query(collection(db, 'nominations'), where('submittedBy', '==', walletAddr));
        const nomSnap = await getDocs(nomQ);
        setNominations(nomSnap.docs.map(d => ({
          name: d.data().projectName,
          ticker: d.data().ticker,
        })));
      } catch (e) {
        console.error('Portfolio fetch error:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [walletAddr]);

  const totalVotePower = userVotes.reduce((s, v) => s + v.quadraticPower, 0);

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
            <a href={`https://solscan.io/account/${publicKey.toString()}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm">
              View on Solscan
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Stats */}
      <div>
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Votes Cast" value={loading ? '—' : userVotes.length.toString()} icon={Vote} loading={loading} />
          <StatCard label="Vote Power" value={loading ? '—' : totalVotePower.toFixed(2)} icon={Activity} loading={loading} />
          <StatCard label="Claims Made" value={loading ? '—' : claimHistory.length.toString()} icon={Gem} loading={loading} />
          <StatCard label="Nominations" value={loading ? '—' : nominations.length.toString()} icon={LayoutDashboard} loading={loading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Votes List */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Votes</h2>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-16" />)}</div>
          ) : userVotes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-text-muted mb-3">No votes yet</p>
              <Link href="/projects" className="text-primary text-sm hover:underline">Browse projects to vote →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {userVotes.slice(0, 6).map((vote, i) => (
                <Link key={i} href={`/projects/${vote.projectId}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                  <div>
                    <p className="text-sm text-text-primary font-medium font-mono">{vote.projectId}</p>
                    <p className="text-xs text-text-muted">Power: {vote.quadraticPower.toFixed(2)}</p>
                  </div>
                  <span className={cn("px-3 py-1 rounded-full text-xs font-medium",
                    vote.direction === 'yes' ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  )}>
                    {vote.direction.toUpperCase()}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Your Activity - Live */}
        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-text-primary">Your Activity</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-text-muted">Live</span>
            </div>
          </div>
          <LiveActivityFeed userId={publicKey?.toString()} maxItems={5} />
        </div>
      </div>

      {/* Nominations submitted */}
      {nominations.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Your Nominations</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {nominations.map((n, i) => (
              <Link key={i} href={`/projects/${n.ticker}`}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all">
                <p className="text-sm font-medium text-text-primary">{n.name}</p>
                <p className="text-xs text-text-muted font-mono">${n.ticker}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Claim History */}
      <div className="glass rounded-2xl p-6 border border-white/10">
        <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Claim History</h2>
        {loading ? (
          <div className="space-y-2">{[1, 2].map(i => <Skeleton key={i} className="w-full h-12" />)}</div>
        ) : claimHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-text-muted mb-3">No claims yet</p>
            <button onClick={() => {}} className="text-primary text-sm hover:underline">
              Go to Claim tab to get started →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-text-muted border-b border-white/10">
                  <th className="pb-3 font-medium">Project</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Details</th>
                  <th className="pb-3 font-medium">Tx</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {claimHistory.map((claim, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="py-4">
                      <p className="text-text-primary">{claim.project}</p>
                      <p className="text-xs text-text-muted font-mono">${claim.ticker}</p>
                    </td>
                    <td className="py-4 text-text-muted">{claim.date}</td>
                    <td className="py-4 text-text-secondary text-xs">{claim.amount}</td>
                    <td className="py-4">
                      {claim.tx ? <SolscanLink tx={claim.tx} /> : <span className="text-text-muted text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Dashboard Page ───────────────────────────────────────────────────────
export default function DashboardPage() {
  const { publicKey } = useWallet();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] opacity-40" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs text-text-primary mb-4">
                <Wallet className="w-3.5 h-3.5" />
                {publicKey ? 'Wallet Connected' : 'Connect Wallet'}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Dashboard</h1>
              <p className="text-text-secondary text-lg max-w-xl">Manage your nominations, votes, and token claims</p>
            </div>
            <WalletStatus />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isLocked = tab.requiresWallet && !publicKey;
            return (
              <button key={tab.id} onClick={() => !isLocked && setActiveTab(tab.id)}
                disabled={isLocked}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300",
                  activeTab === tab.id
                    ? "bg-white/10 border border-white/20 text-text-primary"
                    : "bg-transparent border border-transparent text-text-muted hover:text-text-primary hover:bg-white/5",
                  isLocked && "opacity-50 cursor-not-allowed"
                )}>
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isLocked && <span className="text-xs">🔒</span>}
              </button>
            );
          })}
        </div>

        <div role="tabpanel">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'vote' && <GovernanceVoting />}
          {activeTab === 'claim' && (
            !publicKey
              ? <WalletGate feature="claim your tokens"><div /></WalletGate>
              : <ClaimInterface />
          )}
          {activeTab === 'portfolio' && (
            !publicKey
              ? <WalletGate feature="view your portfolio"><div /></WalletGate>
              : <PortfolioTab />
          )}
        </div>
      </div>
    </div>
  );
}
