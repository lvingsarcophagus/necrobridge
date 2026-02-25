import Link from "next/link";
import { CryptoIcon } from "./CryptoIcon";

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
  nominated: { bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-400", label: "Nominated" },
  voting: { bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-400", label: "Voting" },
  approved: { bg: "bg-green-500/10 border-green-500/30", text: "text-green-400", label: "Approved" },
  migrating: { bg: "bg-yellow-500/10 border-yellow-500/30", text: "text-yellow-400", label: "Migrating" },
  completed: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-400", label: "Completed" },
};

export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_STYLES[project.status];
  const votePercent = Math.min(100, Math.round((project.votes / project.votesRequired) * 100));

  return (
    <Link
      href={`/projects/${project.id}`}
      data-testid="project-card"
      className="group block p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-white/30 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 relative overflow-hidden"
    >
      {/* Decorative gradient orb */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className="flex items-center gap-4 w-full">
          <div className="w-14 h-14 rounded-xl border border-white/10 shadow-inner flex items-center justify-center p-2 bg-black/40 backdrop-blur-sm group-hover:border-primary/30 transition-colors">
            <CryptoIcon ticker={project.ticker} size={32} />
          </div>
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-display font-bold text-white group-hover:text-primary transition-colors text-xl truncate">
              {project.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-medium text-white/50 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">${project.ticker}</span>
              <span className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">{project.sourceChain}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge moved below header for better layout */}
      <div className="mb-5 inline-flex items-center relative z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${status.bg} ${status.text} shadow-sm backdrop-blur-md`}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-white/60 line-clamp-2 mb-6 leading-relaxed relative z-10 font-medium">
        {project.description}
      </p>

      {/* Vote progress */}
      <div className="mb-5 relative z-10 bg-black/20 p-3 rounded-xl border border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-white/50 font-medium uppercase tracking-wider text-[10px]">Votes</span>
          <span className="text-white/80 font-mono font-semibold">{project.votes.toLocaleString()} <span className="text-white/30">/ {project.votesRequired.toLocaleString()}</span></span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-out rounded-full relative"
            style={{ width: `${votePercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs font-medium text-white/40 pt-1 relative z-10">
        <span className="flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {project.sourceChain}
        </span>
        <span className="bg-white/5 px-2 py-1 rounded border border-white/5">TVL: <span className="text-white text-white/80">{project.tvlLocked}</span></span>
      </div>
    </Link>
  );
}
