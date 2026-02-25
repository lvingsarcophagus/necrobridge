'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);
  const { connected } = useWallet();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.02] text-text-muted font-medium text-sm h-[42px] flex items-center justify-center min-w-[160px]"
      >
        <span className="animate-pulse">Loading...</span>
      </button>
    );
  }

  // Custom styled wrapper for WalletMultiButton
  return (
    <div className="relative group">
      <WalletMultiButton 
        className={cn(
          "!rounded-xl !px-5 !py-2.5 !h-[42px] !font-medium !text-sm !transition-all !duration-300",
          connected 
            ? "!bg-success/10 !border-success/30 !text-success hover:!bg-success/20" 
            : "!bg-white/10 !border-white/20 !text-text-primary hover:!bg-white/15"
        )}
      />
      
      {/* Tooltip explaining wallet connection */}
      {!connected && (
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-surface-lighter border border-white/10 rounded-lg text-xs text-text-secondary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          Connect your Solana wallet to vote and claim tokens
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-surface-lighter border-l border-t border-white/10 rotate-45" />
        </div>
      )}
    </div>
  );
}

// Enhanced wallet status component for dashboard
export function WalletStatus() {
  const { publicKey, connected } = useWallet();
  
  if (!connected) {
    return (
      <div className="glass rounded-xl p-4 border border-warning/30 bg-warning/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Wallet Not Connected</p>
            <p className="text-xs text-text-muted">Connect to vote and claim tokens</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-4 border border-success/30 bg-success/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-text-primary">Wallet Connected</p>
            <p className="text-xs text-text-muted font-mono">
              {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">Ready</span>
        </div>
      </div>
    </div>
  );
}
