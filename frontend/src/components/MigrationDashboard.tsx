'use client';

import { useState, useEffect } from 'react';
import { MigrationStatus } from './MigrationStatus';
import { CryptoIcon } from './CryptoIcon';
import { db } from '@/lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface Project {
  id: string;
  name: string;
  ticker: string;
  status: string;
  sourceChain: string;
  votes: number;
  votesRequired: number;
  tvlLocked: string;
  description: string;
}

export function MigrationDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const nominationsRef = collection(db, 'nominations');
    const unsub = onSnapshot(nominationsRef, (snapshot) => {
      const activeProjects: Project[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        activeProjects.push({
          id: doc.id,
          name: data.projectName,
          ticker: data.ticker,
          status: 'nominated',
          sourceChain: data.sourceChain || 'Unknown',
          votes: 0,
          votesRequired: 10000,
          tvlLocked: '$0',
          description: data.description || 'A nominated project',
        });
      });
      setProjects(activeProjects);
      if (activeProjects.length > 0 && !selectedProject) {
        setSelectedProject(activeProjects[0]);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [selectedProject]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="max-w-6xl mx-auto flex flex-col items-center justify-center p-16 border border-white/20 bg-black mt-8">
        <div className="w-16 h-16 border border-white/20 flex items-center justify-center text-3xl mb-6">
          👻
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-3 tracking-wide">THE GRAVEYARD IS EMPTY</h3>
        <p className="text-text-secondary max-w-md text-center mb-8">
          No dead protocols have been nominated for resurrection yet. Be the first to start a movement!
        </p>
        <a href="/nominate" className="px-8 py-3 bg-white text-black font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors border border-white">
          Nominate Protocol
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {projects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-5 border transition-all duration-200 text-left ${selectedProject?.id === project.id
              ? 'border-white bg-white/10'
              : 'border-white/20 bg-black hover:border-white/60 hover:bg-white/5'
              }`}
          >
            <div className="font-display font-semibold text-text-primary flex items-center gap-2">
              <CryptoIcon ticker={project.ticker} size={20} />
              {project.name}
            </div>
            <div className="text-sm text-text-secondary mt-3 uppercase tracking-wider">
              <span className="opacity-75">STATUS:</span> <span className="font-mono text-xs text-white bg-white/10 px-2 py-0.5 ml-1">{project.status}</span>
            </div>
            <div className="text-xs text-text-muted mt-3 font-mono">
              ${project.ticker} • {project.sourceChain}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="pt-4 border-t border-white/10 relative z-10">
          <MigrationStatus
            project={{ ...selectedProject, status: selectedProject.status as any }}
            votePercent={Math.min(100, Math.round((selectedProject.votes / selectedProject.votesRequired) * 100))}
          />
        </div>
      )}
    </div>
  );
}
