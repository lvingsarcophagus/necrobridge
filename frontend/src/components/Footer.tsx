import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-full border border-gray-500 flex items-center justify-center bg-white overflow-hidden">
                <Image 
                  src="/death-star.ico" 
                  alt="NecroBridge" 
                  width={24} 
                  height={24}
                  className="object-contain"
                />
              </div>
              <span className="font-display text-lg font-bold">
                Necro<span className="text-primary">Bridge</span>
              </span>
            </div>
            <p className="text-text-muted text-sm max-w-md leading-relaxed">
              Community-driven migration layer for dead crypto protocols. 
              Bringing defunct assets back to life on Solana through
              trustless Merkle proofs and Wormhole NTT bridging.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/projects" className="text-text-muted hover:text-text-primary transition-colors">Browse Projects</Link></li>
              <li><Link href="/nominate" className="text-text-muted hover:text-text-primary transition-colors">Nominate</Link></li>
              <li><Link href="/dashboard" className="text-text-muted hover:text-text-primary transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display text-sm font-semibold text-text-primary mb-3">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">GitHub</a></li>
              <li><a href="https://docs.wormhole.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Wormhole Docs</a></li>
              <li><a href="https://solana.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-text-primary transition-colors">Solana</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} NecroBridge. Built for the Solana Graveyard Hackathon.
          </p>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <span>Powered by</span>
            <span className="font-semibold text-primary">Wormhole NTT</span>
            <span>&amp;</span>
            <span className="font-semibold text-accent">Solana</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
