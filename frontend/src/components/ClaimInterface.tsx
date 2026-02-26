'use client';

import { useState } from 'react';
import { ClaimTokensInterface } from './ClaimTokensInterface';
import { MOCK_PROJECTS } from '@/lib/mock-data';

export function ClaimInterface() {
  const [selectedProject, setSelectedProject] = useState(MOCK_PROJECTS[0]);

  // Find eligible projects (completed status)
  const eligibleProjects = MOCK_PROJECTS.filter((p) => p.status === 'completed');

  if (eligibleProjects.length === 0) {
    return (
      <div className="py-12 max-w-6xl mx-auto">
        <div className="rounded-lg border border-white/5 bg-black/20 p-8 text-center backdrop-blur-sm">
          <h3 className="font-display text-xl font-semibold text-text-primary mb-2">⏳ No Claimable Tokens Yet</h3>
          <p className="text-text-secondary">
            Migrations must be completed before tokens become available for claiming
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Project Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {eligibleProjects.map((project) => (
          <button
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className={`p-4 rounded-xl border transition-all duration-300 text-left backdrop-blur-sm shadow-lg hover:shadow-2xl hover:-translate-y-1 ${
              selectedProject.id === project.id
                ? 'border-white/10 bg-black/20 shadow-xl shadow-black/20'
                : 'border-white/8 bg-gradient-to-br from-white/2 to-transparent hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1'
            }`}
          >
            <div className="font-display font-semibold text-text-primary">{project.name}</div>
            <div className="text-sm text-text-secondary mt-2">
              ${project.ticker} • 84,021 tokens
            </div>
            <div className="text-xs text-text-muted mt-2 font-mono">✓ Ready to Claim</div>
          </button>
        ))}
      </div>

      {/* Claim Interface */}
      {selectedProject && selectedProject.status === 'completed' && (
        <div className="pt-4 border-t border-white/10 relative z-10">
          <ClaimTokensInterface
            migrationAddress={selectedProject.id}
            projectName={selectedProject.name}
            projectTicker={selectedProject.ticker}
          />
        </div>
      )}
    </div>
  );
}
