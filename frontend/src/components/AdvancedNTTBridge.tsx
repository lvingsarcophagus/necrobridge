'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/lib/toast-context';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import {
  NTTTransferResult,
  subscribeToBridgeState,
} from '@/lib/wormhole-ntt';

interface AdvancedNTTBridgeProps {
  projectId: string;
  sourceChain: string;
  tokenName: string;
}

type BridgeStage = 'idle' | 'approving' | 'transferring' | 'relaying' | 'redeeming' | 'complete' | 'error';

export function AdvancedNTTBridge({
  projectId,
  sourceChain,
  tokenName,
}: AdvancedNTTBridgeProps) {
  const { publicKey  } = useWallet();
  const { addToast } = useToast();

  const [stage, setStage] = useState<BridgeStage>('idle');
  const [transferAmount, setTransferAmount] = useState('1000');
  const [bridgeStatus, setBridgeStatus] = useState<NTTTransferResult | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  // Subscribe to bridge state updates
  useEffect(() => {
    if (!txHash) return;

    const unsubscribe = subscribeToBridgeState(txHash, (status) => {
      setBridgeStatus(status);

      // Update Firestore with current bridge status
      updateDoc(doc(db, 'migrations', projectId), {
        bridgeStatus: status.status,
        bridgeLastUpdated: new Date(),
        vaa: status.vaa || null,
      }).catch(console.error);

      // Show toast for status changes
      if (status.status === 'relayed') {
        addToast('✓ VAA received from guardians', 'success');
      } else if (status.status === 'redeemed') {
        addToast('✓ Tokens redeemed on Solana!', 'success');
        setStage('complete');
      }
    });

    return unsubscribe;
  }, [txHash, projectId, addToast]);

  const handleBridgeTransfer = async () => {
    if (!publicKey) {
      addToast('Please connect your wallet', 'error');
      return;
    }

    setStage('approving');

    try {
      // Step 1: Approve token spending on source chain
      setStage('approving');
      addToast(`Approving ${transferAmount} ${tokenName}...`, 'info');
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate approval

      // Step 2: Initiate transfer on source chain
      setStage('transferring');
      addToast(`Burning tokens on ${sourceChain}...`, 'info');
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}`;
      setTxHash(mockTxHash);

      // Update Firestore with transfer initiation
      await updateDoc(doc(db, 'migrations', projectId), {
        bridgeStatus: 'transferring',
        transferTxHash: mockTxHash,
        sourceAmount: transferAmount,
        sourceChain: sourceChain,
        initiatedAt: new Date(),
      });

      // Step 3: Monitor for VAA
      setStage('relaying');
      addToast('Waiting for guardian network relay (~1-2 min)...', 'info');

      // Start monitoring in the background - the useEffect above handles this
      // In production: actual link to guardian network would happen here

      addToast(`🎃 Transfer initiated! Monitoring progress...`, 'success');
    } catch (error) {
      console.error('Bridge error:', error);
      setStage('error');
      addToast(
        error instanceof Error ? error.message : 'Bridge transfer failed',
        'error'
      );
    }
  };

  const stageColors = {
    idle: 'bg-slate-500',
    approving: 'bg-blue-500',
    transferring: 'bg-purple-500',
    relaying: 'bg-yellow-500',
    redeeming: 'bg-orange-500',
    complete: 'bg-green-500',
    error: 'bg-red-500',
  };

  const stageLabels = {
    idle: 'Ready',
    approving: 'Approving...',
    transferring: 'Burning tokens...',
    relaying: 'Guardian relay...',
    redeeming: 'Minting on Solana...',
    complete: 'Complete!',
    error: 'Error',
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-purple-500/30 bg-white/5 backdrop-blur-sm p-6">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-teal-400 mb-2">
          Advanced NTT Bridge (Custom SDK)
        </h3>
        <p className="text-sm text-text-secondary">
          Full control over Wormhole NTT token migration process
        </p>
      </div>

      {/* Transfer Amount Input */}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-6 space-y-3">
        <label className="block text-sm font-medium text-text-secondary">
          Amount to Bridge ({tokenName})
        </label>
        <input
          type="number"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          disabled={stage !== 'idle'}
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-text-tertiary disabled:opacity-50"
          placeholder="1000"
        />
        <p className="text-xs text-text-tertiary">
          Your wallet: {publicKey ? publicKey.toString().slice(0, 8) + '...' : 'Not connected'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-white">Bridge Progress</span>
            <span className={`text-xs font-semibold px-2 py-1 rounded ${stageColors[stage]}`}>
              {stageLabels[stage]}
            </span>
          </div>

          {/* Stage Timeline */}
          <div className="space-y-2">
            {[
              { stage: 'approving', label: 'Approve tokens' },
              { stage: 'transferring', label: 'Burn on source chain' },
              { stage: 'relaying', label: 'Wait for guardians' },
              { stage: 'redeeming', label: 'Mint on Solana' },
              { stage: 'complete', label: 'Complete' },
            ].map((item, idx) => {
              const stages: BridgeStage[] = [
                'approving',
                'transferring',
                'relaying',
                'redeeming',
                'complete',
              ];
              const currentIdx = stages.indexOf(stage);
              const isActive = stages.indexOf(item.stage as BridgeStage) <= currentIdx;
              const isCompleted = stages.indexOf(item.stage as BridgeStage) < currentIdx;

              return (
                <div
                  key={item.stage}
                  className="flex items-center gap-3 text-sm"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      isCompleted
                        ? 'bg-green-500/30 text-green-300'
                        : isActive
                          ? 'bg-blue-500/30 text-blue-300 animate-pulse'
                          : 'bg-white/10 text-text-tertiary'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span
                    className={
                      isActive ? 'text-white font-medium' : 'text-text-secondary'
                    }
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Status Details */}
      {bridgeStatus && (
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/10 backdrop-blur-sm p-6 space-y-2">
          <p className="text-sm font-medium text-teal-300">Bridge Status Details</p>
          <div className="space-y-1 text-xs text-teal-200 font-mono">
            <div className="flex justify-between">
              <span>Status:</span>
              <span>{bridgeStatus.status.toUpperCase()}</span>
            </div>
            <div className="flex justify-between break-all">
              <span>TX Hash:</span>
              <span>{txHash?.slice(0, 16)}...</span>
            </div>
            {bridgeStatus.vaa && (
              <div className="flex justify-between break-all">
                <span>VAA:</span>
                <span>{bridgeStatus.vaa.slice(0, 16)}...</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Time:</span>
              <span>{new Date(bridgeStatus.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bridge Button */}
      <div className="space-y-3">
        <button
          onClick={handleBridgeTransfer}
          disabled={
            !publicKey || stage !== 'idle' || transferAmount === '0'
          }
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            !publicKey || stage !== 'idle' || transferAmount === '0'
              ? 'bg-white/10 text-text-secondary cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-teal-600 text-white hover:from-purple-700 hover:to-teal-700 active:scale-95'
          }`}
        >
          {stage === 'idle'
            ? `Bridge ${transferAmount} ${tokenName}`
            : 'Bridge in progress...'}
        </button>

        {stage === 'complete' && (
          <button
            onClick={() => {
              setStage('idle');
              setBridgeStatus(null);
              setTxHash(null);
            }}
            className="w-full py-2 rounded-lg font-semibold bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors"
          >
            Start Another Bridge
          </button>
        )}
      </div>

      {/* Info Section */}
      <div className="rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm p-6">
        <h4 className="text-sm font-semibold text-white mb-3">How This Works</h4>
        <ol className="space-y-2 text-xs text-text-secondary list-decimal list-inside">
          <li>You approve the token amount on {sourceChain}</li>
          <li>Tokens are locked/burned on the source chain</li>
          <li>Wormhole guardians attest and relay the transfer</li>
          <li>Your Solana wallet redeems the VAA on Solana</li>
          <li>Canonical SPL tokens arrive in your account</li>
          <li>Next: Claim additional tokens via merkle proof</li>
        </ol>
      </div>
    </div>
  );
}
