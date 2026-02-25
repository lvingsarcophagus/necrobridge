"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Project } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";

const CHAINS = ["All", "Ethereum", "Terra", "Polygon", "Avalanche", "Fantom", "BSC", "arbitrum", "optimism"];
const STATUSES: { value: Project["status"] | "all"; label: string; color: string }[] = [
  { value: "all", label: "All", color: "bg-white/10 text-text-primary" },
  { value: "nominated", label: "Nominated", color: "bg-white/10 text-text-secondary" },
  { value: "voting", label: "Voting", color: "bg-white/10 text-text-secondary" },
  { value: "approved", label: "Approved", color: "bg-white/10 text-text-primary" },
  { value: "migrating", label: "Migrating", color: "bg-white/10 text-text-secondary" },
  { value: "completed", label: "Completed", color: "bg-white/10 text-text-primary" },
];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [chainFilter, setChainFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<Project["status"] | "all">("all");
  const [sortBy, setSortBy] = useState<"votes" | "name">("votes");
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch nominations function (extracted so it can be reused)
  const fetchNominations = async () => {
    try {
      const nominationsRef = collection(db, "nominations");
      const q = query(nominationsRef, orderBy("createdAt", "desc"));

      // Get nominations once
      const snapshot = await getDocs(q);
      const nominations: Project[] = [];

      for (const doc of snapshot.docs) {
        const data = doc.data();

        // Fetch vote tally for this nomination
        let status: Project["status"] = "nominated";
        let votes = 0;

        try {
          const voteResponse = await fetch(`/api/votes?projectId=${data.ticker}`);
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
          console.error(`Error fetching votes for ${data.ticker}:`, error);
        }

        nominations.push({
          id: data.ticker,
          name: data.projectName,
          ticker: data.ticker,
          sourceChain: data.sourceChain?.toString() || "unknown",
          votes: votes,
          status: status,
          votesRequired: 100,
          tvlLocked: "$0",
          description: data.reason || "No description",
        });
      }

      setAllProjects(nominations);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error("Error fetching nominations:", error);
      setAllProjects([]);
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch nominations on mount
  useEffect(() => {
    fetchNominations();
  }, []);

  const filtered = useMemo(() => {
    let list = [...allProjects];

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.ticker.toLowerCase().includes(q)
      );
    }

    if (chainFilter !== "All") {
      list = list.filter((p) => {
        const normalizedChain = p.sourceChain?.toLowerCase() || "";
        const normalizedFilter = chainFilter.toLowerCase();
        return normalizedChain === normalizedFilter;
      });
    }

    if (statusFilter !== "all") {
      list = list.filter((p) => p.status === statusFilter);
    }

    list.sort((a, b) =>
      sortBy === "votes" ? b.votes - a.votes : a.name.localeCompare(b.name)
    );

    return list;
  }, [search, chainFilter, statusFilter, sortBy]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Enhanced Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2 animate-fade-in">
            Dead Projects
          </h1>
          <p className="text-text-secondary animate-fade-in animation-delay-100">
            Browse community-nominated protocols eligible for migration to Solana
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchNominations();
          }}
          disabled={refreshing || loading}
          className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 text-sm font-medium whitespace-nowrap group"
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="glass rounded-2xl p-5 mb-6 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative group">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all duration-300"
            />
          </div>

          {/* Chain filter */}
          <div className="relative">
            <select
              value={chainFilter}
              onChange={(e) => setChainFilter(e.target.value)}
              className="px-4 py-3 pr-10 rounded-xl bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer appearance-none transition-all duration-300 hover:border-white/20 min-w-[140px]"
            >
              {CHAINS.map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Chains" : c}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 pr-10 rounded-xl bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer appearance-none transition-all duration-300 hover:border-white/20 min-w-[140px]"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "votes" | "name")}
              className="px-4 py-3 pr-10 rounded-xl bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer appearance-none transition-all duration-300 hover:border-white/20 min-w-[140px]"
            >
              <option value="votes">Most Votes</option>
              <option value="name">A → Z</option>
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Active filters display */}
        {(search || chainFilter !== "All" || statusFilter !== "all") && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
            <span className="text-xs text-text-muted">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs">
                Search: {search}
                <button onClick={() => setSearch("")} className="hover:text-white">×</button>
              </span>
            )}
            {chainFilter !== "All" && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs">
                Chain: {chainFilter}
                <button onClick={() => setChainFilter("All")} className="hover:text-white">×</button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs",
                STATUSES.find(s => s.value === statusFilter)?.color || "bg-white/10"
              )}>
                Status: {STATUSES.find(s => s.value === statusFilter)?.label}
                <button onClick={() => setStatusFilter("all")} className="hover:text-white">×</button>
              </span>
            )}
            <button 
              onClick={() => { setSearch(""); setChainFilter("All"); setStatusFilter("all"); }}
              className="text-xs text-text-muted hover:text-text-primary underline ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Loading state */}
      {loading && (
        <div className="glass rounded-2xl p-16 text-center">
          <div className="relative inline-block mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-primary/20 opacity-20"></div>
          </div>
          <p className="text-text-secondary text-lg">Loading projects...</p>
          <p className="text-text-muted text-sm mt-2">Fetching from the graveyard</p>
        </div>
      )}

      {/* Enhanced Results */}
      {!loading && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-text-muted">
              <span className="text-text-primary font-semibold">{filtered.length}</span> project{filtered.length !== 1 && "s"} found
            </p>
            {filtered.length > 0 && (
              <p className="text-xs text-text-muted">
                Sorted by {sortBy === "votes" ? "most votes" : "name"}
              </p>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project, index) => (
                <div 
                  key={`${project.id}-${index}`}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass rounded-2xl p-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-text-primary text-lg mb-2">No projects found</p>
              <p className="text-text-muted text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
