'use client';

import { useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/lib/toast-context';
import dynamic from 'next/dynamic';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

// Dynamically import WormholeConnect to avoid SSR issues
const WormholeConnect = dynamic(
  () => import('@wormhole-foundation/wormhole-connect'),
  {
    loading: () => (
      <div className="flex items-center justify-center h-96 bg-slate-900/50 rounded-xl border border-purple-500/30">
        <p className="text-text-secondary">Loading bridge...</p>
      </div>
    ),
    ssr: false,
  }
);

interface TokenBridgeProps {
  projectId?: string;
  sourceChain?: string;
  sourceTokenAddress?: string;
}

export function TokenBridge({
  projectId,
  sourceChain = 'Ethereum',
  sourceTokenAddress = '',
}: TokenBridgeProps) {
  const { publicKey } = useWallet();
  const { addToast } = useToast();
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;

    // Listen for bridge completion events
    const handleMessage = async (event: MessageEvent) => {
      // Check for Wormhole Connect bridge success messages
      if (event.data?.type === 'BRIDGE_COMPLETE' || event.data?.status === 'success') {
        addToast(
          '🎃 Tokens bridged successfully! Waiting for finalization...',
          'success'
        );

        // Update migration status in Firestore
        if (projectId) {
          try {
            await updateDoc(doc(db, 'migrations', projectId), {
              status: 'migrating',
              lastBridgeAt: new Date(),
              bridgeNetwork: sourceChain,
            });
            addToast('Migration started on Solana 🚀', 'success');
          } catch (error) {
            console.error('Failed to update migration status:', error);
          }
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
      isMountedRef.current = false;
    };
  }, [projectId, sourceChain, addToast]);

  // Wormhole Connect will auto-detect wallets and chains
  // Configuration is handled by the component's environment

  return (
    <div className="w-full space-y-4">
      {/* Header Section */}
      <div className="rounded-xl border border-purple-500/30 bg-white/5 backdrop-blur-sm p-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400">
            🌉 Wormhole NTT Bridge (Sunrise)
          </h3>
          <p className="text-sm text-text-secondary">
            Bridge your tokens natively to Solana. Your source tokens burn, and
            a canonical SPL token is minted on Solana with instant Jupiter
            liquidity.
          </p>
        </div>

        {/* Bridge Details */}
        <div className="mt-4 space-y-2 rounded-lg bg-white/5 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">From Chain:</span>
            <span className="text-text-primary font-medium">{sourceChain}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">To Chain:</span>
            <span className="text-text-primary font-medium">Solana (Devnet)</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Receiver:</span>
            <span className="text-text-primary font-mono text-xs">
              {publicKey
                ? `${publicKey.toString().slice(0, 8)}...${publicKey
                    .toString()
                    .slice(-4)}`
                : 'Connect wallet'}
            </span>
          </div>
          {sourceTokenAddress && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Source Token:</span>
              <span className="text-text-primary font-mono text-xs">
                {sourceTokenAddress.slice(0, 6)}...{sourceTokenAddress.slice(-4)}
              </span>
            </div>
          )}
        </div>

        {/* Information Box */}
        <div className="mt-4 rounded-lg border border-teal-500/30 bg-teal-500/10 p-4">
          <p className="text-xs text-teal-200">
            ℹ️ <strong>How it works:</strong> After bridge completion, Wormhole
            guardians will relay your transaction to Solana. Then, claim your
            tokens using merkle proof verification (trustless).
          </p>
        </div>
      </div>

      {/* Wormhole Connect Widget */}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        {!publicKey ? (
          <div className="flex flex-col items-center justify-center h-96 p-6">
            <div className="text-center space-y-3">
              <p className="text-text-secondary">Please connect your wallet first</p>
              <p className="text-xs text-text-tertiary">
                You'll need to sign transactions on both source and Solana chains
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <WormholeConnect />
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="font-semibold text-text-primary mb-3">After Bridge Completion:</h4>
        <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
          <li>Wait for Wormhole guardians to relay your transaction (~1-2 min)</li>
          <li>Your tokens are now canonical SPL on Solana</li>
          <li>
            Navigate to "Completed" tab to claim tokens using merkle proof
          </li>
          <li>Holders can claim via trustless merkle verification</li>
        </ol>
      </div>
    </div>
  );
}
