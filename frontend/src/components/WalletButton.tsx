'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        disabled
        className="px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-text-muted font-semibold text-[13px] opacity-50 h-[38px] flex items-center justify-center min-w-[140px]"
      >
        Connecting...
      </button>
    );
  }

  return (
    <WalletMultiButton />
  );
}
