'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';

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
}

export function Leaderboard() {
  const [projects, setProjects] = useState<ProjectLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalVotes, setTotalVotes] = useState(0);
  const [uniqueWallets, setUniqueWallets] = useState(0);
  const [projectsMap, setProjectsMap] = useState<Map<string, any>>(new Map());

  // Fetch all projects (nominations) on mount
  useEffect(() => {
    const fetchAllProjects = async () => {
      try {
        const nominationsRef = collection(db, "nominations");
        const snapshot = await getDocs(nominationsRef);

        const nominations = new Map<string, any>();
        snapshot.forEach((doc) => {
          const data = doc.data();
          nominations.set(data.ticker, {
            id: data.ticker,
            name: data.projectName,
            ticker: data.ticker,
            sourceChain: data.sourceChain,
            status: "nominated",
          });
        });

        setProjectsMap(nominations);
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

            return {
              id: projectId,
              name: project?.name || projectId,
              ticker: project?.ticker || 'N/A',
              yes: tally.yes || 0,
              no: tally.no || 0,
              total: tally.total || 0,
              yesPercent,
              status: project?.status || 'unknown',
              rank: index + 1,
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-black border border-white/20 p-6 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white/10 rounded-none"></div>
                <div className="h-4 bg-white/10 rounded-none w-32"></div>
              </div>
              <div className="h-4 bg-white/10 rounded-none w-20"></div>
            </div>
            <div className="h-2 bg-white/10 rounded-none w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  const statusColor: Record<string, string> = {
    nominated: 'text-blue-400',
    voting: 'text-purple-400',
    approved: 'text-green-400',
    migrating: 'text-yellow-400',
    completed: 'text-emerald-400',
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <p className="text-[10px] text-white/40 mb-2 font-mono uppercase tracking-widest">Total Votes</p>
          <p className="text-3xl font-bold text-white">{totalVotes.toFixed(2)}<span className="text-lg text-white/50 ml-2">SOL</span></p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <p className="text-[10px] text-white/40 mb-2 font-mono uppercase tracking-widest">Unique Wallets</p>
          <p className="text-3xl font-bold text-white">{uniqueWallets}</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-lg hover:border-white/20 transition-colors">
          <p className="text-[10px] text-white/40 mb-2 font-mono uppercase tracking-widest">Projects Listed</p>
          <p className="text-3xl font-bold text-white">{projects.length}</p>
        </div>
      </div>

      <div className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mt-32 opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mb-32 opacity-50 pointer-events-none" />

        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Rank</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Project</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Votes</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Status</th>
                <th className="px-6 py-5 text-left text-[10px] font-mono font-bold text-white/50 tracking-widest uppercase">Breakdown</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                    No votes yet. Be the first to vote!
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-white/5 hover:bg-white/[0.03] transition-colors duration-300 group"
                  >
                    {/* Rank */}
                    <td className="px-6 py-6 text-sm font-bold text-white/70 w-12 font-mono group-hover:text-primary transition-colors">
                      #{project.rank}
                    </td>

                    {/* Project Name */}
                    <td className="px-6 py-6">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-base font-bold text-white hover:text-primary transition-colors block"
                      >
                        <div className="flex items-center gap-3">
                          <span className="tracking-wide">{project.name}</span>
                          <span className="text-[10px] font-mono font-semibold text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">${project.ticker}</span>
                        </div>
                      </Link>
                    </td>

                    {/* Total Votes */}
                    <td className="px-6 py-6 text-sm font-mono font-bold text-white/90">
                      {project.total.toFixed(2)} SOL
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest shadow-sm bg-black/50 backdrop-blur-md ${statusColor[project.status] ? `${statusColor[project.status]} border-current` : 'text-white/70 border-white/20'}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    {/* Vote Breakdown */}
                    <td className="px-6 py-6">
                      <div className="w-full max-w-[200px]">
                        <div className="flex gap-1 h-2.5 overflow-hidden bg-black/50 border border-white/10 mb-2.5 p-0.5 rounded-full shadow-inner">
                          <div
                            className="bg-gradient-to-r from-success to-emerald-400 rounded-full transition-all duration-700 ease-out"
                            style={{ width: `${project.yesPercent}%` }}
                          />
                          {project.yesPercent < 100 && (
                            <div
                              className="bg-gradient-to-r from-error/60 to-error rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${100 - project.yesPercent}%` }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest font-mono text-white/40">
                          <span className="text-success-light">YES: {project.yesPercent}%</span>
                          <span>
                            {project.yes.toFixed(2)} / {project.no.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-6 border-t border-white/10">
          <p className="text-[10px] text-white/30 mb-4 font-mono uppercase tracking-widest">Status Legend</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              ['nominated', '🎓', 'Community nominated'],
              ['voting', '🗳️', 'Votes being cast'],
              ['approved', '✅', 'Vote threshold passed'],
              ['migrating', '🔄', 'Migration in progress'],
              ['completed', '🎉', 'Resurrected on Solana'],
            ].map(([status, emoji, label]) => (
              <div key={status} className="text-xs flex items-center gap-2">
                <span className="text-base">{emoji}</span>
                <p className="text-white/40 uppercase tracking-wider font-mono text-[10px]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
