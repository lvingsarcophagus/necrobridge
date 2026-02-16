"use client";

import { use } from "react";
import Link from "next/link";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { VoteCard } from "@/components/VoteCard";
import { MigrationStatus } from "@/components/MigrationStatus";
import type { Project } from "@/components/ProjectCard";

const STATUS_STYLES: Record<Project["status"], { bg: string; text: string; label: string }> = {
  nominated: { bg: "bg-warning/10", text: "text-warning", label: "Nominated" },
  voting: { bg: "bg-primary/10", text: "text-primary-light", label: "Voting" },
  approved: { bg: "bg-accent/10", text: "text-accent", label: "Approved" },
  migrating: { bg: "bg-primary/10", text: "text-primary", label: "Migrating" },
  completed: { bg: "bg-success/10", text: "text-success", label: "Completed" },
};

const MIGRATION_STEPS = [
  "Nominated",
  "Community Vote",
  "Snapshot Taken",
  "NTT Bridge",
  "Claims Open",
  "Completed",
];

function getStepIndex(status: Project["status"]): number {
  switch (status) {
    case "nominated": return 0;
    case "voting": return 1;
    case "approved": return 3;
    case "migrating": return 4;
    case "completed": return 5;
  }
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const project = MOCK_PROJECTS.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold mb-4">Project Not Found</h1>
        <p className="text-text-secondary mb-6">
          The project you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-1 text-primary hover:text-primary-light"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const status = STATUS_STYLES[project.status];
  const currentStep = getStepIndex(project.status);
  const votePercent = Math.min(100, Math.round((project.votes / project.votesRequired) * 100));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/projects" className="hover:text-text-primary transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-text-secondary">{project.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="font-display text-2xl sm:text-3xl font-bold">
                    {project.name}
                  </h1>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
                <span className="font-mono text-sm text-text-muted">
                  ${project.ticker}
                </span>
              </div>
            </div>

            <p className="text-text-secondary leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Details grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-surface-lighter rounded-lg p-3">
                <p className="text-xs text-text-muted mb-1">Source Chain</p>
                <p className="font-medium text-sm">{project.sourceChain}</p>
              </div>
              <div className="bg-surface-lighter rounded-lg p-3">
                <p className="text-xs text-text-muted mb-1">TVL Locked</p>
                <p className="font-medium text-sm">{project.tvlLocked}</p>
              </div>
              <div className="bg-surface-lighter rounded-lg p-3">
                <p className="text-xs text-text-muted mb-1">Contract</p>
                <p className="font-mono text-xs text-text-secondary truncate">
                  0x7a25...f3e8
                </p>
              </div>
            </div>
          </div>

          {/* Migration progress */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg font-semibold mb-6">
              Migration Progress
            </h2>
            <div className="relative">
              {/* Progress line */}
              <div className="absolute top-4 left-4 right-4 h-0.5 bg-surface-lighter" />
              <div
                className="absolute top-4 left-4 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{
                  width: `${(currentStep / (MIGRATION_STEPS.length - 1)) * 100}%`,
                  maxWidth: "calc(100% - 2rem)",
                }}
              />

              {/* Steps */}
              <div className="relative flex justify-between">
                {MIGRATION_STEPS.map((step, i) => {
                  const done = i <= currentStep;
                  const active = i === currentStep;
                  return (
                    <div key={step} className="flex flex-col items-center" style={{ width: "16.66%" }}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-colors ${
                          done
                            ? active
                              ? "bg-primary text-white animate-pulse-glow"
                              : "bg-primary/20 text-primary"
                            : "bg-surface-lighter text-text-muted"
                        }`}
                      >
                        {done && !active ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span
                        className={`mt-2 text-[10px] sm:text-xs text-center leading-tight ${
                          done ? "text-text-primary" : "text-text-muted"
                        }`}
                      >
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Migration Status CTA */}
          <MigrationStatus project={project} votePercent={votePercent} />

          {/* Activity / Timeline (placeholder) */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">
              Activity
            </h2>
            <div className="space-y-4">
              {[
                { time: "2 hours ago", text: "Snapshot validated — 14,320 holder addresses verified" },
                { time: "1 day ago", text: "Community vote reached 84% quorum" },
                { time: "3 days ago", text: "Project nominated by community member" },
              ].map((event, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    {i < 2 && <div className="w-px flex-1 bg-surface-lighter mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="text-sm text-text-primary">{event.text}</p>
                    <p className="text-xs text-text-muted mt-0.5">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* VoteCard Component */}
          <VoteCard 
            projectId={project.id}
            projectName={project.name}
            ticker={project.ticker}
          />

          {/* Quick stats */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Key Metrics</h3>
            <div className="space-y-3">
              {[
                { label: "Total Supply", value: "1.2B tokens" },
                { label: "Holders", value: "14,320" },
                { label: "Avg Claim", value: "84,021 tokens" },
                { label: "Migration Fee", value: "0.1%" },
              ].map((metric) => (
                <div key={metric.label} className="flex justify-between items-center">
                  <span className="text-sm text-text-muted">{metric.label}</span>
                  <span className="text-sm font-mono text-text-primary">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contract info */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Contracts</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Source ({project.sourceChain})</p>
                <p className="font-mono text-xs text-text-secondary bg-surface-lighter rounded px-2 py-1.5 truncate">
                  0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Solana SPL Mint</p>
                <p className="font-mono text-xs text-text-secondary bg-surface-lighter rounded px-2 py-1.5 truncate">
                  NcBr...7xKq
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
