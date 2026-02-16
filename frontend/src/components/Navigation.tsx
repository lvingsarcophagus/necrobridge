"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Browse Projects" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/nominate", label: "Nominate" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">💀</span>
            <span className="font-display text-lg font-bold text-white tracking-tight">
              Necro<span className="text-white/80">Bridge</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    active
                      ? "bg-white/20 text-white border border-white/30"
                      : "text-text-secondary hover:text-white hover:bg-white/15"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Connect wallet placeholder */}
          <div className="hidden md:block">
            <button className="px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm font-semibold hover:bg-white/30 hover:border-white/50 transition-all duration-300">
              Connect Wallet
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-text-secondary hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface/95 backdrop-blur px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-white/20 text-white border border-white/30"
                    : "text-text-secondary hover:text-white hover:bg-white/15"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <button className="w-full mt-2 px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm font-semibold hover:bg-white/30 transition-all duration-300">
            Connect Wallet
          </button>
        </div>
      )}
    </nav>
  );
}
