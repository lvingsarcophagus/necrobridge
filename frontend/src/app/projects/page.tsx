"use client";

import { useEffect, useState, useMemo } from "react";
import { ProjectCard } from "@/components/ProjectCard";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import type { Project } from "@/components/ProjectCard";

const CHAINS = ["All", "Ethereum", "Terra", "Polygon", "Avalanche", "Fantom", "BSC", "ethereum", "bsc", "polygon", "avalanche", "fantom", "arbitrum", "optimism"];
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
  const [allProjects, setAllProjects] = useState<Project[]>([...MOCK_PROJECTS]);
  const [loading, setLoading] = useState(true);

  // Fetch nominations and merge with mock projects
  useEffect(() => {
    const fetchNominations = async () => {
      try {
        const nominationsRef = collection(db, "nominations");
        const q = query(nominationsRef, orderBy("createdAt", "desc"));
        
        // Get nominations once
        const snapshot = await getDocs(q);
        const nominations: any[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          nominations.push({
            id: data.ticker,
            name: data.projectName,
            ticker: data.ticker,
            sourceChain: data.sourceChain,
            votes: data.voteCount || 0,
            status: "nominated" as const,
            nominator: data.walletAddress,
            contractAddress: data.contractAddress,
            reason: data.reason,
            website: data.website,
          });
        });

        // Combine mock projects with nominations (nominations take precedence by ticker)
        const nominationTickers = new Set(nominations.map(n => n.ticker));
        const combined = [
          ...nominations,
          ...MOCK_PROJECTS.filter(p => !nominationTickers.has(p.ticker))
        ];

        setAllProjects(combined);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching nominations:", error);
        setAllProjects(MOCK_PROJECTS);
        setLoading(false);
      }
    };

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
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Dead Projects
        </h1>
        <p className="text-text-secondary">
          Browse community-nominated protocols eligible for migration to Solana
        </p>
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
            {allProjects.length > MOCK_PROJECTS.length && ` (${allProjects.length - MOCK_PROJECTS.length} new nominations)`}
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
