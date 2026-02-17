'use client';

import { VoteCard } from './VoteCard';
import { VotingResults } from './VotingResults';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export function GovernanceVoting() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Voting Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Active Proposals</h3>
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="transform transition-all duration-300 hover:scale-105">
              <VoteCard
                projectId={project.id}
                projectName={project.name}
                ticker={project.ticker}
              />
            </div>
          ))}
        </div>

        {/* Voting Results Sidebar */}
        <div className="lg:col-span-1">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-4">📊 Results</h3>
          <VotingResults />
        </div>
      </div>

      {/* Governance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
        <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
          <div className="text-sm text-text-secondary mb-2">Total Proposals</div>
          <div className="font-display text-3xl font-bold text-text-primary">{MOCK_PROJECTS.length}</div>
        </div>
        <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
          <div className="text-sm text-text-secondary mb-2">Active Voters</div>
          <div className="font-display text-3xl font-bold text-text-primary">2,847</div>
        </div>
        <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
          <div className="text-sm text-text-secondary mb-2">Total Voting Power</div>
          <div className="font-display text-3xl font-bold text-text-primary">125.4K SOL</div>
        </div>
      </div>
    </div>
  );
}
