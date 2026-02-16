import Link from "next/link";

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
  nominated: { bg: "bg-warning/10", text: "text-warning", label: "Nominated" },
  voting: { bg: "bg-primary/10", text: "text-primary-light", label: "Voting" },
  approved: { bg: "bg-accent/10", text: "text-accent", label: "Approved" },
  migrating: { bg: "bg-primary/10", text: "text-primary", label: "Migrating" },
  completed: { bg: "bg-success/10", text: "text-success", label: "Completed" },
};

const CHAIN_ICONS: Record<string, string> = {
  Ethereum: "⟠",
  BSC: "◆",
  Polygon: "⬡",
  Avalanche: "▲",
  Fantom: "👻",
  Terra: "🌙",
  Solana: "◎",
};

export function ProjectCard({ project }: { project: Project }) {
  const status = STATUS_STYLES[project.status];
  const chainIcon = CHAIN_ICONS[project.sourceChain] ?? "🔗";
  const votePercent = Math.min(100, Math.round((project.votes / project.votesRequired) * 100));

  return (
    <Link
      href={`/projects/${project.id}`}
      data-testid="project-card"
      className="group block glass rounded-xl p-5 hover:border-primary/20 transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-lighter flex items-center justify-center text-lg">
            {chainIcon}
          </div>
          <div>
            <h3 className="font-display font-semibold text-text-primary group-hover:text-primary transition-colors">
              {project.name}
            </h3>
            <span className="text-xs font-mono text-text-muted">${project.ticker}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm text-text-secondary line-clamp-2 mb-4">
        {project.description}
      </p>

      {/* Vote progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-text-muted">Votes</span>
          <span className="text-text-secondary font-mono">{project.votes.toLocaleString()} / {project.votesRequired.toLocaleString()}</span>
        </div>
        <div className="h-1.5 bg-surface-lighter rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
            style={{ width: `${votePercent}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-text-muted">
        <span>From {project.sourceChain}</span>
        <span>TVL: {project.tvlLocked}</span>
      </div>
    </Link>
  );
}
