'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { WalletButton } from '@/components/WalletButton';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(20);
  const pathname = usePathname();

  const links = [
    { label: 'Browse Projects', href: '/projects' },
    { label: 'Nominate', href: '/nominate' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Leaderboard', href: '/leaderboard' },
    { label: 'Docs', href: '/docs' },
  ];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [open]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out px-4',
      scrolled ? 'py-3' : 'py-5 md:py-6'
    )}>
      <nav
        className={cn(
          'w-full max-w-4xl h-16 flex items-center justify-between px-6 rounded-full border transition-all duration-500 ease-in-out transform-gpu relative',
          scrolled 
            ? 'bg-surface/90 border-white/15 backdrop-blur-xl shadow-2xl shadow-black/50 scale-[0.96] translate-y-0' 
            : 'bg-white/[0.02] border-white/10 backdrop-blur-md scale-100 translate-y-1'
        )}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-white/[0.02] via-transparent to-white/[0.02] pointer-events-none" />

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group relative z-10">
          <div className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center bg-white group-hover:border-gray-300 transition-all duration-300 group-hover:scale-110 overflow-hidden shadow-lg">
            <Image 
              src="/death-star.ico" 
              alt="NecroBridge" 
              width={28} 
              height={28}
              className="object-contain"
            />
          </div>
          <span className="font-display text-base font-bold text-text-primary tracking-tight">
            Necro<span className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">Bridge</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5 relative z-10">
          {links.map((link, i) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link 
                key={i} 
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-full transition-all duration-300 relative whitespace-nowrap",
                  isActive 
                    ? "text-text-primary bg-white/10" 
                    : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-0 rounded-full border border-white/20 animate-border-glow" />
                )}
              </Link>
            );
          })}
          <div className="h-4 w-px bg-white/10 mx-2" />
          <WalletButton />
        </div>

        {/* Mobile Toggle */}
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-text-primary h-8 w-8 hover:bg-white/10 rounded-full relative z-10"
        >
          <MenuToggleIcon open={open} className="size-4" />
        </Button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          'fixed inset-0 z-[60] bg-[#0a0a0a]/98 backdrop-blur-3xl md:hidden transition-all duration-500 ease-in-out transform flex flex-col items-center justify-center',
          open ? 'translate-y-0 opacity-100' : 'translate-y-[-100%] opacity-0 pointer-events-none'
        )}
      >
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/5 rounded-full blur-[80px] animate-pulse animation-delay-2000" />
        </div>

        {/* Close button - top right */}
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary bg-white/5 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:rotate-90"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center gap-6 relative z-10">
          {links.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={i} 
                href={link.href} 
                onClick={() => setOpen(false)}
                className={cn(
                  "text-2xl font-bold transition-all duration-300 relative",
                  isActive 
                    ? "text-text-primary scale-110" 
                    : "text-text-secondary hover:text-text-primary hover:scale-110"
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
          <div className="mt-6">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
