'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { WalletButton } from '@/components/WalletButton';

export function Header() {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(20);

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
          'w-full max-w-4xl h-16 flex items-center justify-between px-6 rounded-full border transition-all duration-500 ease-in-out transform-gpu',
          scrolled 
            ? 'bg-surface/80 border-white/10 backdrop-blur-xl shadow-2xl scale-[0.96] translate-y-0' 
            : 'bg-white/[0.02] border-white/10 backdrop-blur-md scale-100 translate-y-1'
        )}
      >
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl group-hover:scale-110 transition-transform duration-300">💀</span>
          <span className="font-display text-base font-bold text-text-primary tracking-tight">
            Necro<span className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">Bridge</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((link, i) => (
            <Link 
              key={i} 
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-full transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-3 w-px bg-white/10 mx-2" />
          <div className="flex items-center -mr-1">
            <WalletButton />
          </div>
        </div>

        {/* Mobile Toggle */}
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-text-primary h-8 w-8 hover:bg-white/10 rounded-full"
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
        {/* Close button - top right */}
        <button 
          onClick={() => setOpen(false)}
          className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-text-primary bg-white/5 transition-all duration-300 hover:bg-white/10"
        >
          ×
        </button>
        
        <div className="flex flex-col items-center gap-8">
          {links.map((link, i) => (
            <Link 
              key={i} 
              href={link.href} 
              onClick={() => setOpen(false)}
              className="text-2xl font-bold text-text-primary hover:text-white hover:scale-110 transition-all duration-300"
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4">
            <WalletButton />
          </div>
        </div>
      </div>
    </header>
  );
}
