'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';

export function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until after hydration to prevent mismatch
  if (!mounted) {
    return (
      <div className="wallet-adapter-button-container">
        <button
          disabled
          className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm opacity-50"
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-adapter-button-container">
      <WalletMultiButton
        style={{
          background: '#ffffff',
          backgroundColor: '#ffffff',
          color: '#0a0a0a',
          border: 'none',
          borderRadius: '6px',
          fontSize: '0.875rem',
          fontWeight: '500',
          padding: '10px 16px',
          boxShadow: 'none',
          outline: 'none',
          height: 'auto',
          minHeight: '40px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
}
