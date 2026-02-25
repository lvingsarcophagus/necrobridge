"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Project } from "@/components/ProjectCard";

const CHAINS = ["All", "Ethereum", "Terra", "Polygon", "Avalanche", "Fantom", "BSC", "arbitrum", "optimism"];
const STATUSES: { value: Project["status"] | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "nominated", label: "Nominated" },
  { value: "voting", label: "Voting" },
  { value: "approved", label: "Approved" },
  { value: "migrating", label: "Migrating" },
  { value: "completed", label: "Completed" },
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
            Dead Projects
          </h1>
          <p className="text-text-secondary">
            Browse community-nominated protocols eligible for migration to Solana
          </p>
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            fetchNominations();
          }}
          disabled={refreshing || loading}
          className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
        >
          {refreshing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>



      {/* Filters */}
      <div className="glass rounded-xl p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted"
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
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
            />
          </div>

          {/* Chain filter */}
          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            {CHAINS.map((c) => (
              <option key={c} value={c}>
                {c === "All" ? "All Chains" : c}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "votes" | "name")}
            className="px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer"
          >
            <option value="votes">Most Votes</option>
            <option value="name">A → Z</option>
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="glass rounded-xl p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p className="text-text-secondary">Loading projects...</p>
        </div>
      )}

      {/* Results count */}
      {!loading && (
        <>
          <p className="text-xs text-text-muted mb-4">
            {filtered.length} project{filtered.length !== 1 && "s"} found
          </p>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-text-muted text-lg mb-2">No projects found</p>
              <p className="text-text-muted text-sm">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
