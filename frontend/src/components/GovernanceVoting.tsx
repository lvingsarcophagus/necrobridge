'use client';

import { useEffect, useState } from 'react';
import { VoteCard } from './VoteCard';
import { VotingResults } from './VotingResults';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Proposal {
  id: string;
  name: string;
  ticker: string;
}

export function GovernanceVoting() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [totalVotingPower, setTotalVotingPower] = useState(0);
  const [activeVoters, setActiveVoters] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to active proposals
    const nominationsRef = collection(db, 'nominations');
    const unsubNominations = onSnapshot(nominationsRef, (snapshot) => {
      const activeProposals: Proposal[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        activeProposals.push({
          id: data.ticker,
          name: data.projectName,
          ticker: data.ticker,
        });
      });
      setProposals(activeProposals);
      setLoading(false);
    });

    // Listen to voting stats
    const talliesRef = collection(db, 'voteTallies');
    const unsubTallies = onSnapshot(talliesRef, (snapshot) => {
      let power = 0;
      snapshot.forEach((doc) => {
        power += doc.data().total || 0;
      });
      setTotalVotingPower(power);
    });

    // Listen to unique voters
    const votersRef = collection(db, 'userVotes');
    const unsubVoters = onSnapshot(votersRef, (snapshot) => {
      // rough naive estimate: simply the number of individual vote docs
      setActiveVoters(snapshot.size);
    });

    return () => {
      unsubNominations();
      unsubTallies();
      unsubVoters();
    };
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto relative z-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Voting Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-display text-lg font-semibold text-text-primary mb-4">Active Proposals</h3>

          {loading ? (
            <div className="glass rounded-xl p-8 text-center animate-pulse">
              <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-white/10 rounded w-1/3 mx-auto mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/4 mx-auto" />
            </div>
          ) : proposals.length === 0 ? (
            <div className="glass rounded-xl p-8 text-center border-dashed border-white/20">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                📜
              </div>
              <h4 className="font-display text-lg font-semibold text-text-primary mb-2">No Active Proposals</h4>
              <p className="text-text-secondary text-sm mb-4">
                There are currently no dead protocols nominated for resurrection.
              </p>
              <a href="/nominate" className="inline-flex px-4 py-2 rounded-lg bg-primary/20 text-primary-light text-sm hover:bg-primary/30 transition-colors">
                Submit a Nomination
              </a>
            </div>
          ) : (
            proposals.map((project) => (
              <div key={project.id} className="transform transition-all duration-300 hover:scale-105">
                <VoteCard
                  projectId={project.id}
                  projectName={project.name}
                  ticker={project.ticker}
                />
              </div>
            ))
          )}
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
          <div className="font-display text-3xl font-bold text-text-primary">{proposals.length}</div>
        </div>
        <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
          <div className="text-sm text-text-secondary mb-2">Active Voters</div>
          <div className="font-display text-3xl font-bold text-text-primary">{activeVoters}</div>
        </div>
        <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
          <div className="text-sm text-text-secondary mb-2">Total Voting Power</div>
          <div className="font-display text-3xl font-bold text-text-primary">{totalVotingPower.toFixed(1)} SOL</div>
        </div>
      </div>
    </div>
  );
}
