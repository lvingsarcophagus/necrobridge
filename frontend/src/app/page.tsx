"use client";

import Link from "next/link";
import Image from "next/image";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsCard } from "@/components/StatsCard";
import { MigrationPathsSection } from "@/components/MigrationPathsSection";
import { PLATFORM_STATS } from "@/lib/mock-data";

// Space-themed decorative elements
function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            opacity: Math.random() * 0.5 + 0.2,
          }}
        />
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center">
      {/* Space Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-950 to-black" />
      
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />
      
      <StarField />
      
      {/* Death Star Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[150px]" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Death Star Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-2 border-gray-400 flex items-center justify-center bg-white backdrop-blur-sm shadow-2xl shadow-primary/20 overflow-hidden">
                <Image 
                  src="/death-star.ico" 
                  alt="NecroBridge" 
                  width={80} 
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="absolute -inset-2 rounded-full border border-white/20 animate-pulse" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-text-primary mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            Solana Graveyard Hackathon 2026
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Resurrect Dead Protocols{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              on Solana
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            NecroBridge brings abandoned crypto assets back to life. 
            Nominate, vote, and migrate dead protocols using trustless 
            Merkle proofs and on-chain governance.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 hover:border-primary/50 transition-all duration-300 text-center font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Graveyard
            </Link>
            <Link
              href="/nominate"
              className="group w-full sm:w-auto px-8 py-4 rounded-xl border border-white/20 text-text-primary hover:bg-white/5 hover:border-white/30 transition-all duration-300 text-center font-semibold flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nominate Project
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Trustless Claims
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Merkle Verified
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Community Governed
            </span>
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      glow: "shadow-white/20",
      color: "text-white",
      bg: "bg-white/10",
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
      glow: "shadow-purple-500/30",
      color: "text-purple-400",
      bg: "bg-purple-500/20",
    },
    {
      num: "03",
      title: "Migrate",
      desc: "Wormhole NTT bridges the token supply. A Merkle tree snapshot maps every holder's balance to a Solana claim.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      glow: "shadow-yellow-500/30",
      color: "text-yellow-400",
      bg: "bg-yellow-500/20",
    },
    {
      num: "04",
      title: "Claim",
      desc: "Original holders connect their wallet and claim migrated tokens on Solana. Instant, trustless, verifiable.",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      glow: "shadow-success/30",
      color: "text-success",
      bg: "bg-success/20",
    },
  ];

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[150px] -translate-y-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-muted mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            The Process
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4 animate-fade-in">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto animate-fade-in animation-delay-100">
            Four steps from dead protocol to live Solana asset
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="glass rounded-xl p-6 relative group hover:border-primary/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 animate-fade-in"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px">
                  <div className="h-full bg-gradient-to-r from-white/20 to-transparent" />
                </div>
              )}

              {/* Step number */}
              <span className="absolute top-4 right-4 font-mono text-xs text-text-muted group-hover:text-primary/60 transition-colors duration-300">
                {step.num}
              </span>
              
              {/* Icon with enhanced hover */}
              <div className={`w-14 h-14 rounded-xl ${step.bg} flex items-center justify-center ${step.color} mb-4 group-hover:scale-110 transition-all duration-300 ${step.glow} shadow-lg`}>
                {step.icon}
              </div>
              
              {/* Title */}
              <h3 className="font-display font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                {step.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed group-hover:text-text-secondary/80 transition-colors duration-300">
                {step.desc}
              </p>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="py-16 border-y border-white/5 bg-gradient-to-b from-black/50 to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            label="Projects Migrated"
            value={PLATFORM_STATS.projectsMigrated.toString()}
            delay={0}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
          />
          <StatsCard
            label="Value Rescued"
            value={PLATFORM_STATS.totalValueRescued}
            delay={100}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatsCard
            label="Active Votes"
            value={PLATFORM_STATS.activeVotes.toString()}
            delay={200}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />
          <StatsCard
            label="Unique Holders"
            value={PLATFORM_STATS.uniqueHolders}
            delay={300}
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

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import type { Project } from "@/components/ProjectCard";

function FeaturedProjectsSection() {
  const [featured, setFeatured] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const nominationsRef = collection(db, "nominations");
        const q = query(nominationsRef, orderBy("createdAt", "desc"), limit(3));
        const snapshot = await getDocs(q);

        const projects: Project[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          projects.push({
            id: data.ticker,
            name: data.projectName,
            ticker: data.ticker,
            sourceChain: data.sourceChain || "unknown",
            status: "nominated",
            votes: 0,
            votesRequired: 100,
            tvlLocked: "$0",
            description: data.reason || "No description",
          });
        });
        setFeatured(projects);
      } catch (error) {
        console.error("Error fetching featured projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  if (loading) return null; // Or a subtle loading skeleton

  if (featured.length === 0) return null; // Don't show the section if there are no projects yet

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
          {featured.map((project, index) => (
            <ProjectCard key={`${project.id}-${index}`} project={project} />
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
    { 
      name: "Solana", 
      desc: "Settlement layer", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      color: "text-purple-400"
    },
    { 
      name: "Wormhole", 
      desc: "Cross-chain bridge", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 3v18M3 12h18" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      ),
      color: "text-blue-400"
    },
    { 
      name: "Merkle", 
      desc: "Trustless claims", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v4M8 7v4M16 7v4M4 11v4M12 11v4M20 11v4M8 15v4M16 15v4M12 19v2" />
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="8" cy="9" r="1.5" fill="currentColor" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
          <circle cx="4" cy="13" r="1.5" fill="currentColor" />
          <circle cx="12" cy="13" r="1.5" fill="currentColor" />
          <circle cx="20" cy="13" r="1.5" fill="currentColor" />
        </svg>
      ),
      color: "text-green-400"
    },
    { 
      name: "Anchor", 
      desc: "Smart contracts", 
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3l9 18H3L12 3z" />
          <circle cx="12" cy="14" r="2" />
        </svg>
      ),
      color: "text-yellow-400"
    },
  ];

  return (
    <section className="py-16 border-t border-white/5 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-text-muted mb-4">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            Technology Stack
          </div>
          <h2 className="font-display text-2xl font-bold mb-2">Built With</h2>
          <p className="text-text-muted text-sm">
            Production-grade infrastructure for trustless migrations
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {tech.map((t) => (
            <div
              key={t.name}
              className="glass rounded-xl p-6 text-center hover:border-primary/20 transition-all duration-300 group"
            >
              <div className={`${t.color} mb-3 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                {t.icon}
              </div>
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
            <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-white/5 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-white/3 rounded-full blur-[80px]" />
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
      <MigrationPathsSection />
      <FeaturedProjectsSection />
      <TechStackSection />
      <CTASection />
    </>
  );
}
