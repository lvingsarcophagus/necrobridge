'use client';

import { useState } from 'react';
import { MigrationStatus } from './MigrationStatus';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export function MigrationDashboard() {
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {MOCK_PROJECTS.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-4 rounded-xl border transition-all duration-300 text-left backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
              selectedProject.id === project.id
                ? 'border-white/10 bg-black/20 shadow-xl shadow-black/20'
                : 'border-white/5 bg-black/10 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1'
            }`}
          >
            <div className="font-display font-semibold text-text-primary">{project.name}</div>
            <div className="text-sm text-text-secondary mt-2">
              <span className="opacity-75">Status:</span> <span className="font-mono text-xs text-text-muted">{project.status}</span>
            </div>
            <div className="text-xs text-text-muted mt-2">
              ${project.ticker} • {project.sourceChain}
            </div>
          </button>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="pt-4 border-t border-white/10 relative z-10">
          <MigrationStatus
            project={selectedProject}
            votePercent={Math.min(100, Math.round((selectedProject.votes / selectedProject.votesRequired) * 100))}
          />
        </div>
      )}
    </div>
  );
}
