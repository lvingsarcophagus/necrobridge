"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { VoteCard } from "@/components/VoteCard";
import { MigrationStatus } from "@/components/MigrationStatus";
import type { Project } from "@/components/ProjectCard";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

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
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<{ time: string; text: string }[]>([]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        // Fetch from Firestore nominations
        const nominationsRef = collection(db, "nominations");
        
        // Try finding by ID first
        const idQuery = query(nominationsRef, where("id", "==", id));
        let snapshot = await getDocs(idQuery);
        
        // If not found by ID, try by ticker
        if (snapshot.empty) {
          const tickerQuery = query(nominationsRef, where("ticker", "==", id.toUpperCase()));
          snapshot = await getDocs(tickerQuery);
        }

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          
          // Fetch vote tally
          let status: Project["status"] = "nominated";
          let votes = 0;
          
          try {
            const voteResponse = await fetch(`/api/votes?projectId=${data.id}`);
            if (voteResponse.ok) {
              const voteData = await voteResponse.json();
              const totalVotes = voteData.votes?.total || 0;
              const yesVotes = voteData.votes?.yes || 0;
              
              votes = totalVotes;
              
              if (totalVotes > 0) {
                const approvalPercentage = (yesVotes / totalVotes) * 100;
                if (approvalPercentage >= 80) {
                  status = "approved";
                } else {
                  status = "voting";
                }
              }
            }
          } catch (error) {
            console.error("Error fetching votes:", error);
          }
          
          const projectData: Project = {
            id: data.id,
            name: data.projectName,
            ticker: data.ticker,
            sourceChain: data.sourceChain?.toString() || "unknown",
            votes: votes,
            status: status,
            votesRequired: 100,
            tvlLocked: "$0",
            description: data.reason || "No description",
          };
          
          setProject(projectData);

          // Fetch real activity from Firestore
          try {
            const activityRef = collection(db, "activity");
            const activityQuery = query(
              activityRef,
              where("ticker", "==", data.ticker),
              orderBy("timestamp", "desc"),
              limit(5)
            );
            const activitySnap = await getDocs(activityQuery);
            const activities = activitySnap.docs.map((doc) => {
              const a = doc.data();
              const ts = a.timestamp?.toDate ? a.timestamp.toDate() : new Date();
              const diff = Date.now() - ts.getTime();
              const mins = Math.floor(diff / 60000);
              const hours = Math.floor(mins / 60);
              const days = Math.floor(hours / 24);
              const timeStr =
                days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : `${mins}m ago`;
              return { time: timeStr, text: a.description || a.type };
            });
            setRecentActivity(activities);
          } catch {
            // activity is optional
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching project:", error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-48 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-96 mx-auto"></div>
        </div>
      </div>
    );
  }

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
  const votePercent = Math.min(100, Math.round((project.votes / (project.votesRequired || 100)) * 100));

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
                  {project.id}
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

          {/* Activity / Timeline */}
          <div className="glass rounded-xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">
              Activity
            </h2>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-4">No activity yet — be the first to vote!</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((event, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      {i < recentActivity.length - 1 && <div className="w-px flex-1 bg-surface-lighter mt-1" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-text-primary">{event.text}</p>
                      <p className="text-xs text-text-muted mt-0.5">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
            <h3 className="font-display font-semibold mb-4">Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Source Chain</span>
                <span className="text-sm font-mono text-text-primary">{project.sourceChain}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Status</span>
                <span className={`text-sm font-medium ${STATUS_STYLES[project.status].text}`}>{STATUS_STYLES[project.status].label}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Votes Required</span>
                <span className="text-sm font-mono text-text-primary">{project.votesRequired} SOL</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-text-muted">Migration Path</span>
                <span className="text-sm font-mono text-text-primary">Community Vote</span>
              </div>
            </div>
          </div>

          {/* Contract info */}
          <div className="glass rounded-xl p-6">
            <h3 className="font-display font-semibold mb-4">Contract</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-text-muted mb-1">Source ({project.sourceChain})</p>
                <p className="font-mono text-xs text-text-secondary bg-surface-lighter rounded px-2 py-1.5 truncate">
                  Not yet verified
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">Solana SPL Mint</p>
                <p className="font-mono text-xs text-text-secondary bg-surface-lighter rounded px-2 py-1.5 truncate">
                  Pending migration approval
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
