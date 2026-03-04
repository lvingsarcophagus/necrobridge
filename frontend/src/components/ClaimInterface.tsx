'use client';

import { useState, useEffect } from 'react';
import { ClaimTokensInterface } from './ClaimTokensInterface';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface ClaimableProject {
  id: string;
  name: string;
  ticker: string;
  status: string;
}

export function ClaimInterface() {
  const [projects, setProjects] = useState<ClaimableProject[]>([]);
  const [selected, setSelected] = useState<ClaimableProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const ref = collection(db, 'nominations');
        const q = query(ref, orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);

        // Pull all nominations and check vote tallies to find approved ones
        const talliesSnap = await getDocs(collection(db, 'voteTallies'));
        const approvedTickers = new Set<string>();
        talliesSnap.docs.forEach((doc) => {
          const data = doc.data();
          const total = data.total || 0;
          const yes = data.yes || 0;
          if (total > 0 && (yes / total) * 100 >= 80) {
            approvedTickers.add(doc.id); // doc.id is the ticker
          }
        });

        const eligible: ClaimableProject[] = [];
        snap.docs.forEach((doc) => {
          const data = doc.data();
          if (approvedTickers.has(data.ticker)) {
            eligible.push({
              id: data.ticker,
              name: data.projectName,
              ticker: data.ticker,
              status: 'approved',
            });
          }
        });

        setProjects(eligible);
        if (eligible.length > 0) setSelected(eligible[0]);
      } catch (err) {
        console.error('Error fetching approved projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchApproved();
  }, []);

  if (loading) {
    return (
      <div className="py-12 max-w-6xl mx-auto">
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="glass rounded-xl p-4 animate-pulse">
              <div className="h-4 bg-white/10 rounded w-1/3 mb-2" />
              <div className="h-3 bg-white/10 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="py-12 max-w-6xl mx-auto">
        <div className="rounded-lg border border-white/5 bg-black/20 p-8 text-center backdrop-blur-sm">
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">⏳ No Claimable Tokens Yet</h3>
          <p className="text-text-secondary">
            A project needs 80% approval from community votes before tokens become claimable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Project Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelected(project)}
            className={`p-4 rounded-xl border transition-all duration-300 text-left backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
              selected?.id === project.id
                ? 'border-white/10 bg-black/20 shadow-xl shadow-black/20'
                : 'border-white/8 bg-gradient-to-br from-white/2 to-transparent hover:border-white/15'
            }`}
          >
            <div className="font-display font-semibold text-text-primary">{project.name}</div>
            <div className="text-sm text-text-secondary mt-2">
              ${project.ticker} • Approved by community vote
            </div>
            <div className="text-xs text-success mt-2 font-mono">✓ Ready to Claim</div>
          </button>
        ))}
      </div>

      {/* Claim Interface */}
      {selected && (
        <div className="pt-4 border-t border-white/10 relative z-10">
          <ClaimTokensInterface
            migrationAddress={selected.id}
            projectName={selected.name}
            projectTicker={selected.ticker}
          />
        </div>
      )}
    </div>
  );
}
