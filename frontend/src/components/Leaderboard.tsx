'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { 
  Flame, 
  TrendingUp, 
  Clock, 
  Activity,
  GraduationCap,
  Vote,
  CheckCircle2,
  RefreshCw,
  PartyPopper
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectLeaderboard {
  id: string;
  name: string;
  ticker: string;
  yes: number;
  no: number;
  total: number;
  yesPercent: number;
  status: string;
  rank: number;
  recentVotes?: number;
  lastVoteTime?: string;
  chain?: string;
}

// Chain icon mapping
const CHAIN_ICONS: Record<string, string> = {
  ethereum: '🔷',
  terra: '🌙',
  bsc: '🟡',
  polygon: '🟣',
  avalanche: '🔺',
  solana: '◎',
};

// Loading Skeleton
function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-white/10 rounded", className)} />
  );
}

export function Leaderboard() {
  const [projects, setProjects] = useState<ProjectLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [uniqueWallets, setUniqueWallets] = useState(0);
  const [projectsMap, setProjectsMap] = useState<Map<string, any>>(new Map());
  const [chainStats, setChainStats] = useState<Record<string, number>>({});

  // Fetch all projects (nominations) on mount
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const nominationsRef = collection(db, "nominations");
        const snapshot = await getDocs(nominationsRef);

        const nominations = new Map<string, any>();
        const chains: Record<string, number> = {};
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          nominations.set(data.ticker, {
            id: data.ticker,
            name: data.projectName,
            ticker: data.ticker,
            sourceChain: data.sourceChain,
            status: "nominated",
          });
          
          // Count by chain
          const chain = data.sourceChain?.toLowerCase() || 'unknown';
          chains[chain] = (chains[chain] || 0) + 1;
        });

        setProjectsMap(nominations);
        setChainStats(chains);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjectsMap(new Map());
      }
    };

    fetchAllProjects();
  }, []);

  // Real-time listener for vote tallies
  useEffect(() => {
    const q = query(collection(db, 'voteTallies'), orderBy('total', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const tallies: Record<string, any> = {};
        let totalSOL = 0;

        snapshot.forEach((doc) => {
          tallies[doc.id] = doc.data();
          totalSOL += doc.data().total || 0;
        });

        // Enrich with project data and rank
        const leaderboardData = Object.entries(tallies)
          .map(([projectId, tally]: [string, any], index) => {
            const project = projectsMap.get(projectId);
            const yesPercent = tally.total > 0 ? Math.round((tally.yes / tally.total) * 100) : 0;
            
            // Simulate recent activity (in real app, this would come from timestamp data)
            const recentVotes = Math.floor(Math.random() * 20);
            const isHot = recentVotes > 10 || yesPercent > 75;

            return {
              id: projectId,
              name: project?.name || projectId,
              ticker: project?.ticker || 'N/A',
              yes: tally.yes || 0,
              no: tally.no || 0,
              total: tally.total || 0,
              yesPercent,
              status: project?.status || 'unknown',
              chain: project?.sourceChain || 'unknown',
              rank: index + 1,
              recentVotes,
              isHot,
              lastVoteTime: recentVotes > 0 ? 'Just now' : '2h ago',
            };
          })
          .sort((a, b) => b.total - a.total);

        setProjects(leaderboardData);
        setTotalVotes(totalSOL);
        setLoading(false);
      },
      (error) => {
        console.error('Error loading leaderboard:', error);
        setLoading(false);
      }
    );

    // Estimate unique wallets
    const votesRef = collection(db, 'userVotes');
    const votesUnsubscribe = onSnapshot(votesRef, (snapshot) => {
      setUniqueWallets(snapshot.size);
    });

    return () => {
      unsubscribe();
      votesUnsubscribe();
    };
  }, [projectsMap]);

  const statusConfig: Record<string, { color: string; icon: React.ElementType; label: string }> = {
    nominated: { color: 'text-blue-400', icon: GraduationCap, label: 'Nominated' },
    voting: { color: 'text-purple-400', icon: Vote, label: 'Voting' },
    approved: { color: 'text-green-400', icon: CheckCircle2, label: 'Approved' },
    migrating: { color: 'text-yellow-400', icon: RefreshCw, label: 'Migrating' },
    completed: { color: 'text-emerald-400', icon: PartyPopper, label: 'Completed' },
  };

  // Get top 3 chains
  const topChains = Object.entries(chainStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <Skeleton className="w-24 h-3 mb-2" />
              <Skeleton className="w-32 h-8" />
            </div>
          ))}
        </div>
        
        {/* Table Skeleton */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-black/40 border border-white/10 rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Vote className="w-4 h-4 text-white/40" />
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Total Votes</p>
          </div>
          <p className="text-3xl font-bold text-white">{totalVotes.toFixed(2)}<span className="text-lg text-white/50 ml-2">SOL</span></p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-white/40" />
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Unique Wallets</p>
          </div>
          <p className="text-3xl font-bold text-white">{uniqueWallets}</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-white/40" />
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Projects Listed</p>
          </div>
          <p className="text-3xl font-bold text-white">{projects.length}</p>
        </div>
      </div>

      {/* Most Active Chains */}
      {topChains.length > 0 && (
        <div className="mb-8">
          <h3 className="text-[10px] text-white/40 font-mono uppercase tracking-widest mb-4">Most Active Chains</h3>
          <div className="flex flex-wrap gap-3">
            {topChains.map(([chain, count]) => (
              <div 
                key={chain}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-lg">{CHAIN_ICONS[chain] || '🔗'}</span>
                <span className="text-sm text-text-primary capitalize">{chain}</span>
                <span className="text-xs text-text-muted">({count} projects)</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-32 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl -mb-32 opacity-50 pointer-events-none" />

        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Rank</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Project</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">YES %</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Votes</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Status</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Activity</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                    No votes yet. Be the first to vote!
                  </td>
                </tr>
              ) : (
                projects.map((project: any) => {
                  const StatusIcon = statusConfig[project.status]?.icon || Vote;
                  
                  return (
                    <tr
                      key={project.id}
                      className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300 group"
                    >
                      {/* Rank */}
                      <td className="px-6 py-6 text-sm font-bold text-white/70 w-12 font-mono group-hover:text-white transition-colors">
                        #{project.rank}
                      </td>

                      {/* Project Name */}
                      <td className="px-6 py-6">
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-base font-bold text-white hover:text-white/80 transition-colors block"
                        >
                          <div className="flex items-center gap-3">
                            <span className="tracking-wide">{project.name}</span>
                            <span className="text-[10px] font-mono font-semibold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                              ${project.ticker}
                            </span>
                            {/* Hot Tag */}
                            {project.isHot && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold border border-orange-500/30">
                                <Flame className="w-3 h-3" />
                                HOT
                              </span>
                            )}
                          </div>
                        </Link>
                      </td>

                      {/* YES % */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                              style={{ width: `${project.yesPercent}%` }}
                            />
                          </div>
                          <span className={cn(
                            "text-sm font-bold",
                            project.yesPercent >= 70 ? "text-green-400" : 
                            project.yesPercent >= 50 ? "text-yellow-400" : "text-red-400"
                          )}>
                            {project.yesPercent}%
                          </span>
                        </div>
                      </td>

                      {/* Total Votes */}
                      <td className="px-6 py-6 text-sm font-mono font-bold text-white/90">
                        {project.total.toFixed(2)} SOL
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm bg-black/50 backdrop-blur-md ${
                            statusConfig[project.status]?.color || 'text-white/70'
                          } border-current`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {project.status}
                        </span>
                      </td>

                      {/* Recent Activity */}
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs">
                          {project.recentVotes > 0 ? (
                            <>
                              <Activity className="w-3.5 h-3.5 text-green-400" />
                              <span className="text-green-400 font-medium">
                                +{project.recentVotes} votes
                              </span>
                              <span className="text-white/30">•</span>
                              <Clock className="w-3 h-3 text-white/40" />
                              <span className="text-white/50">{project.lastVoteTime}</span>
                            </>
                          ) : (
                            <span className="text-white/30">No recent activity</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-6 border-t border-white/10">
          <p className="text-[10px] text-white/30 mb-4 font-mono uppercase tracking-widest">Status Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(statusConfig).map(([status, config]) => {
              const Icon = config.icon;
              return (
                <div key={status} className="text-xs flex items-center gap-2">
                  <Icon className={cn("w-4 h-4", config.color)} />
                  <p className="text-white/40 uppercase tracking-wider font-mono text-[10px]">{config.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
