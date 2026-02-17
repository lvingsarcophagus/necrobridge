import Link from "next/link";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsCard } from "@/components/StatsCard";
import { MOCK_PROJECTS, PLATFORM_STATS } from "@/lib/mock-data";

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-text-primary mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-text-primary animate-pulse" />
            Solana Graveyard Hackathon 2026
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
            Resurrect Dead Protocols{" "}
            <span className="gradient-text">on Solana</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
            NecroBridge lets communities nominate, vote on, and migrate
            defunct crypto assets to Solana — trustlessly, using Wormhole NTT
            and on-chain Merkle proofs.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/projects"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 transition-all duration-300 text-center font-semibold"
            >
              Browse Dead Projects
            </Link>
            <Link
              href="/nominate"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/20 text-text-primary hover:bg-white/10 hover:border-white/30 transition-all duration-300 text-center font-semibold"
            >
              Nominate a Project
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Nominate",
      desc: "Submit a dead protocol for community review. Provide the source chain, contract address, and why it deserves resurrection.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
        </svg>
      ),
    },
    {
      num: "02",
      title: "Vote",
      desc: "Token holders vote on which projects get migrated. Once a quorum is reached, migration can begin.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      num: "03",
      title: "Migrate",
      desc: "Wormhole NTT bridges the token supply. A Merkle tree snapshot maps every holder's balance to a Solana claim.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      num: "04",
      title: "Claim",
      desc: "Original holders connect their wallet and claim migrated tokens on Solana. Instant, trustless, verifiable.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Four steps from dead protocol to live Solana asset
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="glass rounded-xl p-6 relative group hover:border-primary/20 transition-colors"
            >
              <span className="absolute top-4 right-4 font-mono text-xs text-text-muted">
                {step.num}
              </span>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-text-primary mb-4">
                {step.icon}
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 border-y border-surface-border bg-surface-light/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Projects Migrated"
            value={PLATFORM_STATS.projectsMigrated.toString()}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatsCard
            label="Value Rescued"
            value={PLATFORM_STATS.totalValueRescued}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Active Votes"
            value={PLATFORM_STATS.activeVotes.toString()}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
          <StatsCard
            label="Unique Holders"
            value={PLATFORM_STATS.uniqueHolders}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

function FeaturedProjectsSection() {
  const featured = MOCK_PROJECTS.slice(0, 3);

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">
              Trending Projects
            </h2>
            <p className="text-text-secondary">
              Most active nominations from the community
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:text-primary-light transition-colors"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm text-primary"
          >
            View all projects →
          </Link>
        </div>
      </div>
    </section>
  );
}

function TechStackSection() {
  const tech = [
    { name: "Solana", desc: "Settlement layer", icon: "◎" },
    { name: "Wormhole NTT", desc: "Cross-chain bridge", icon: "🌀" },
    { name: "Merkle Proofs", desc: "Trustless claims", icon: "🌳" },
    { name: "Anchor", desc: "Smart contracts", icon: "⚓" },
  ];

  return (
    <section className="py-16 border-t border-surface-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-display text-2xl font-bold mb-2">Built With</h2>
          <p className="text-text-muted text-sm">
            Production-grade infrastructure for trustless migrations
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {tech.map((t) => (
            <div
              key={t.name}
              className="glass rounded-xl p-4 text-center hover:border-primary/20 transition-colors"
            >
              <span className="text-2xl block mb-2">{t.icon}</span>
              <p className="font-display font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-text-muted">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-primary/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-[80px]" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Resurrect?
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              Join the community of builders bringing dead protocols back to
              life. Every token deserves a second chance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/nominate"
                className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 font-semibold transition-colors"
              >
                Nominate a Project
              </Link>
              <Link
                href="/projects"
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-white/20 text-text-primary hover:text-text-primary hover:bg-white/5 transition-colors"
              >
                Explore Graveyard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorksSection />
      <FeaturedProjectsSection />
      <TechStackSection />
      <CTASection />
    </>
  );
}
