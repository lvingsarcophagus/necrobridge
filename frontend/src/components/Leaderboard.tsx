'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, getDocs } from 'firebase/firestore';
import { MOCK_PROJECTS } from '@/lib/mock-data';

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

  // Fetch all projects (mock + nominations) on mount
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

        // Combine with mock projects
        const allProjects = new Map(
          MOCK_PROJECTS.map(p => [p.id, p])
        );
        
        // Nominations override mock projects with same ticker
        nominations.forEach((nom, ticker) => {
          allProjects.set(ticker, nom);
        });

        setProjectsMap(allProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to mock projects
        const mockMap = new Map(
          MOCK_PROJECTS.map(p => [p.id, p])
        );
        setProjectsMap(mockMap);
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
            const project = projectsMap.get(projectId) || MOCK_PROJECTS.find((p) => p.id === projectId);
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
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white/10 rounded"></div>
                <div className="h-4 bg-white/10 rounded w-32"></div>
              </div>
              <div className="h-4 bg-white/10 rounded w-20"></div>
            </div>
            <div className="h-2 bg-white/10 rounded w-full"></div>
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
        <div className="glass rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-text-muted mb-1">Total Votes</p>
          <p className="text-3xl font-bold text-primary">{totalVotes.toFixed(2)} SOL</p>
        </div>
        <div className="glass rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-text-muted mb-1">Unique Wallets</p>
          <p className="text-3xl font-bold text-primary">{uniqueWallets}</p>
        </div>
        <div className="glass rounded-lg p-4 border border-primary/20">
          <p className="text-sm text-text-muted mb-1">Projects</p>
          <p className="text-3xl font-bold text-primary">{projects.length}</p>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass rounded-lg overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">RANK</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">PROJECT</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">VOTES</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-text-muted">BREAKDOWN</th>
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
                    className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                  >
                    {/* Rank */}
                    <td className="px-4 py-4 text-sm font-bold text-primary w-12">
                      #{project.rank}
                    </td>

                    {/* Project Name */}
                    <td className="px-4 py-4">
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-sm font-semibold text-text-primary hover:text-white/80 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span>{project.name}</span>
                          <span className="text-xs font-mono text-text-muted">${project.ticker}</span>
                        </div>
                      </Link>
                    </td>

                    {/* Total Votes */}
                    <td className="px-4 py-4 text-sm font-mono font-semibold text-primary">
                      {project.total.toFixed(2)} SOL
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 ${
                          statusColor[project.status] || 'text-text-primary'
                        }`}
                      >
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                    </td>

                    {/* Vote Breakdown */}
                    <td className="px-4 py-4">
                      <div className="w-full">
                        <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-surface-lighter mb-1">
                          <div
                            className="bg-success transition-all duration-300"
                            style={{ width: `${project.yesPercent}%` }}
                          />
                          {project.yesPercent < 100 && (
                            <div
                              className="bg-danger transition-all duration-300"
                              style={{ width: `${100 - project.yesPercent}%` }}
                            />
                          )}
                        </div>
                        <div className="flex justify-between text-xs text-text-muted">
                          <span>YES: {project.yesPercent}%</span>
                          <span className="font-mono">
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
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 glass rounded-lg border border-white/10">
        <p className="text-xs text-text-muted mb-3 font-semibold">STATUS LEGEND</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            ['nominated', '🎓', 'Community nominated'],
            ['voting', '🗳️', 'Votes being cast'],
            ['approved', '✅', 'Vote threshold passed'],
            ['migrating', '🔄', 'Migration in progress'],
            ['completed', '🎉', 'Resurrected on Solana'],
          ].map(([status, emoji, label]) => (
            <div key={status} className="text-xs">
              <span className="text-lg mr-1">{emoji}</span>
              <p className="text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
