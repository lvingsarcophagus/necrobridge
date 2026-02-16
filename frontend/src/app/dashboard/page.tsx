"use client";

import Link from "next/link";
import { MOCK_PROJECTS } from "@/lib/mock-data";
import { VotingResults } from "@/components/VotingResults";
import { UserNominations } from "@/components/UserNominations";

// Simulated user data
const CLAIMABLE = MOCK_PROJECTS.filter((p) => p.status === "completed");

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <p className="text-sm text-text-muted mb-1 relative z-10">{label}</p>
      <p className="font-display text-2xl font-bold text-primary relative z-10">{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div data-testid="dashboard" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 relative">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Dashboard
        </h1>
        <p className="text-text-secondary">
          Your activity, nominations, votes, and claimable tokens
        </p>
      </div>

      {/* Wallet banner */}
      <div className="glass rounded-xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-text-muted">Connected Wallet</p>
            <p className="font-mono text-sm text-text-primary">
              7xKq...4mPz
            </p>
          </div>
        </div>
        <button className="px-6 py-2 rounded-lg bg-white/15 border border-white/30 text-white hover:bg-white/25 hover:border-white/50 text-sm font-medium transition-all duration-300 relative z-10 hover:shadow-lg hover:shadow-white/10">
          Disconnect
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatBox label="Nominations" value="—" />
        <StatBox label="Votes Cast" value="—" />
        <StatBox label="Claimable" value={CLAIMABLE.length} />
        <StatBox label="Total Claimed" value="$2,340" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Nominations */}
        <div className="glass rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="font-display text-lg font-semibold text-white">
              My Nominations
            </h2>
            <Link
              href="/nominate"
              className="text-xs text-white/70 hover:text-white transition-colors font-medium"
            >
              + New
            </Link>
          </div>
          <div className="divide-y divide-white/10 relative z-10">
            <UserNominations />
          </div>
        </div>

        {/* My Votes */}
        <div className="glass rounded-xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-bl from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <h2 className="font-display text-lg font-semibold text-white">
              Voting Results
            </h2>
            <Link
              href="/projects"
              className="text-xs text-white/70 hover:text-white transition-colors font-medium"
            >
              Vote
            </Link>
          </div>
          <div className="relative z-10">
            <VotingResults />
          </div>
        </div>

        {/* Claimable Tokens */}
        <div className="glass rounded-xl p-6 lg:col-span-2 relative overflow-hidden group hover:border-primary/30 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="font-display text-lg font-semibold mb-4 relative z-10 text-white">
            Claimable Tokens
          </h2>
          {CLAIMABLE.length > 0 ? (
            <div className="space-y-3 relative z-10">
              {CLAIMABLE.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div>
                    <p className="font-medium text-sm text-white">{p.name}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      84,021 ${p.ticker} available
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:border-white/50 font-semibold text-sm transition-all duration-300">
                    Claim
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted py-6 text-center relative z-10">
              No claimable tokens at this time.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
