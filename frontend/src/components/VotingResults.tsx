'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MOCK_PROJECTS } from '@/lib/mock-data';

interface ProjectWithVotes {
  id: string;
  name: string;
  ticker: string;
  yes: number;
  no: number;
  total: number;
}

export function VotingResults() {
  const [results, setResults] = useState<ProjectWithVotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVoteResults();
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchVoteResults, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchVoteResults = async () => {
    try {
      const response = await fetch('/api/votes');
      if (!response.ok) throw new Error('Failed to fetch votes');
      
      const data = await response.json();
      
      // Combine API tallies with mock project data
      const tallies = data.data || {};
      const enriched: ProjectWithVotes[] = Object.entries(tallies)
        .map(([projectId, tally]: [string, any]) => {
          const project = MOCK_PROJECTS.find(p => p.id === projectId);
          return {
            id: projectId,
            name: project?.name || projectId,
            ticker: project?.ticker || 'N/A',
            yes: tally.yes || 0,
            no: tally.no || 0,
            total: tally.total || 0,
          };
        })
        .sort((a, b) => b.total - a.total); // Sort by total votes descending

      setResults(enriched);
      setError(null);
    } catch (err) {
      console.error('Error fetching vote results:', err);
      setError(err instanceof Error ? err.message : 'Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-2 bg-white/10 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-lg p-4 border border-danger/20 bg-danger/5">
        <p className="text-sm text-danger">Error loading results: {error}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <p className="text-text-secondary">No votes recorded yet</p>
        <Link href="/projects" className="text-primary hover:underline text-sm mt-2 inline-block">
          Start voting →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => {
        const yesPercent = result.total > 0 
          ? Math.round((result.yes / result.total) * 100)
          : 0;
        const noPercent = 100 - yesPercent;

        return (
          <Link
            key={result.id}
            href={`/projects/${result.id}`}
            className="glass rounded-lg p-4 hover:border-primary/40 transition-all duration-200 block"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary">{result.name}</h3>
                <p className="text-xs text-text-muted">${result.ticker}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-semibold text-primary">{result.total.toFixed(2)} SOL</p>
                <p className="text-xs text-text-muted">{result.yes.toFixed(2)} YES / {result.no.toFixed(2)} NO</p>
              </div>
            </div>
            
            {/* Vote breakdown */}
            <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-surface-lighter">
              <div
                className="bg-success transition-all duration-300"
                style={{ width: `${yesPercent}%` }}
              />
              {noPercent > 0 && (
                <div
                  className="bg-danger transition-all duration-300"
                  style={{ width: `${noPercent}%` }}
                />
              )}
            </div>
            
            <div className="flex justify-between text-xs text-text-muted mt-2">
              <span>YES: {yesPercent}%</span>
              <span>NO: {noPercent}%</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
