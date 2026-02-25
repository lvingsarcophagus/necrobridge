"use client";

import Link from "next/link";
import { Link2 } from "lucide-react";

export interface Project {
  id: string;
  name: string;
  ticker: string;
  sourceChain: string;
  sourceTokenAddress?: string;
  status: "nominated" | "voting" | "approved" | "migrating" | "completed";
  votes: number;
  votesRequired: number;
  tvlLocked: string;
  description: string;
}

const STATUS_STYLES: Record<Project["status"], { bg: string; text: string; label: string }> = {
  nominated: { bg: "bg-blue-500/20", text: "text-blue-400", label: "NOMINATED" },
  voting: { bg: "bg-purple-500/20", text: "text-purple-400", label: "VOTING" },
  approved: { bg: "bg-green-500/20", text: "text-green-400", label: "APPROVED" },
  migrating: { bg: "bg-yellow-500/20", text: "text-yellow-400", label: "MIGRATING" },
  completed: { bg: "bg-emerald-500/20", text: "text-emerald-400", label: "COMPLETED" },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_STYLES[project.status];
  const votePercent = Math.min(100, Math.round((project.votes / project.votesRequired) * 100));

  // Truncate name to match design (approx 18 chars)
  const truncatedName = project.name.length > 18 
    ? project.name.slice(0, 18) + "..." 
    : project.name;

  return (
    <Link
      href={`/projects/${project.id}`}
      data-testid="project-card"
      className="group block rounded-2xl border border-white/10 bg-[#0d1117]/80 
        hover:border-white/20 hover:bg-[#161b22]/90
        transition-all duration-300 ease-out relative overflow-hidden p-5"
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start gap-4 mb-4">
        {/* Rounded Square Icon */}
        <div className="w-12 h-12 rounded-xl border border-white/10 bg-[#1c2128] flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-white/70">{project.ticker.slice(0, 3)}</span>
        </div>
        
        {/* Title and Badges */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-white text-lg truncate mb-1.5">
            {truncatedName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-white/60 bg-white/5 px-2 py-0.5 rounded">
              ${project.ticker}
            </span>
            <span className="text-[10px] text-white/40 uppercase">
              {project.sourceChain}
            </span>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-lg text-[11px] font-bold ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-5 line-clamp-2">
        {project.description}
      </p>

      {/* Votes Section */}
      <div className="bg-[#0d1117] rounded-xl p-3 mb-4 border border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/40 font-medium uppercase tracking-wider text-[10px]">VOTES</span>
          <span className="text-white/80 font-mono font-semibold">
            <span className="text-white">{project.votes}</span>
            <span className="text-white/30"> / {project.votesRequired}</span>
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
            style={{ width: `${votePercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-white/40">
          <Link2 className="w-3.5 h-3.5" />
          <span className="lowercase">{project.sourceChain}</span>
        </div>
        <div className="bg-white/5 px-2.5 py-1 rounded text-white/60">
          TVL: <span className="text-white/80 font-mono">{project.tvlLocked}</span>
        </div>
      </div>
    </Link>
  );
}
