'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { Project } from './ProjectCard';
import { ClaimTokensInterface } from './ClaimTokensInterface';
import { MetaMaskConnector } from './MetaMaskConnector';
import { executeClaimTransaction } from '@/lib/claim-transactions';
import { HELIUS_RPC } from '@/lib/config';
import Link from 'next/link';

interface MigrationStatusProps {
  project: Project;
  votePercent: number;
}

interface SnapshotData {
  projectId: string;
  root: string;
  claims: {
    [walletAddress: string]: {
      amount: string;
      index: number;
      proof: string[];
    };
  };
  totalTokens?: string;
  generatedAt?: string;
  retrievedAt?: string;
}

export function MigrationStatus({ project, votePercent }: MigrationStatusProps) {
  const wallet = useWallet();
  const { publicKey, sendTransaction } = wallet;

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimingInProgress, setClaimingInProgress] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [txSignature, setTxSignature] = useState<string | null>(null);
  const [migrationTab, setMigrationTab] = useState<'canonical' | 'snapshot'>('canonical');
  const [snapshotLoading, setSnapshotLoading] = useState(false);
  const [snapshotData, setSnapshotData] = useState<SnapshotData | null>(null);
  const [snapshotError, setSnapshotError] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  const handleClaimTokens = async () => {
    try {
      // Debug logging
      console.log('🔍 Claim Debug:');
      console.log('  publicKey:', publicKey?.toString());
      console.log('  sendTransaction:', typeof sendTransaction);
      console.log('  snapshotData:', snapshotData ? '✅ exists' : '❌ null');
      console.log('  selectedWallet:', selectedWallet);

      if (!publicKey) {
        throw new Error('❌ Wallet public key not connected');
      }
      if (!sendTransaction) {
        throw new Error('❌ Wallet sendTransaction not available');
      }
      if (!snapshotData) {
        throw new Error('❌ No snapshot data available');
      }
      if (!selectedWallet) {
        throw new Error('❌ No wallet selected');
      }

      setClaimingInProgress(true);
      setClaimError(null);
      setTxSignature(null);

      const connection = new Connection(HELIUS_RPC);
      const claimData = snapshotData.claims[selectedWallet];

      if (!claimData) {
        throw new Error(`❌ Claim data not found for wallet: ${selectedWallet}`);
      }

      console.log('📊 Claiming from:', selectedWallet);
      console.log('📈 Amount:', claimData.amount);

      const tx = await executeClaimTransaction(
        {
          projectId: project.id,
          walletAddress: selectedWallet,
          amount: claimData.amount,
          proof: claimData.proof,
          index: claimData.index,
          merkleRoot: snapshotData.root,
        },
        connection,
        publicKey,
        sendTransaction
      );

      console.log('✅ Transaction signature:', tx);
      setTxSignature(tx);
      setClaimingInProgress(false);
      setClaimSuccess(true);

      // Auto-close modal after success animation
      setTimeout(() => {
        setShowClaimModal(false);
        setClaimSuccess(false);
        setTxSignature(null);
      }, 5000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('❌ Claim error:', errorMsg, error);
      setClaimError(errorMsg);
      setClaimingInProgress(false);
    }
  };

  const handleGenerateSnapshot = async () => {
    setSnapshotLoading(true);
    setSnapshotError(null);

    try {
      const response = await fetch(`/api/migrations/snapshot?projectId=${project.id}`);

      if (!response.ok) {
        throw new Error(`Failed to generate snapshot: ${response.statusText}`);
      }

      const data = await response.json();
      setSnapshotData(data);
    } catch (error) {
      setSnapshotError(error instanceof Error ? error.message : 'Unknown error');
      console.error('Error generating snapshot:', error);
    } finally {
      setSnapshotLoading(false);
    }
  };

  if (project.status === 'completed') {
    return (
      <>
        <div className="glass rounded-xl p-6 border-2 border-success/30 bg-success/5">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-display text-lg font-semibold text-success">
              ✅ Migration Complete
            </h3>
            <span className="text-3xl">🎉</span>
          </div>
          <p className="text-sm text-text-secondary mb-6">
            {project.name} has been successfully resurrected on Solana! Claim your tokens using the Anchor program below.
          </p>
        </div>

        {/* Claim Tokens Interface - Trustless merkle-proof based claims */}
        <ClaimTokensInterface
          migrationAddress={project.id}
        />

        {/* Keep the old modal for now as fallback */}
        {showClaimModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass rounded-xl p-8 max-w-md w-full border border-success/30 bg-success/5 animate-in fade-in-50">
              {claimSuccess ? (
                <div className="text-center space-y-4 animate-in zoom-in-50">
                  <div className="text-6xl animate-bounce">🎃</div>
                  <h3 className="font-display text-2xl font-bold text-success">Resurrected!</h3>
                  <p className="text-3xl font-bold text-success mb-2">🧟 → 🚀</p>
                  <p className="text-sm text-text-secondary">
                    {selectedWallet && snapshotData?.claims[selectedWallet]
                      ? (BigInt(snapshotData.claims[selectedWallet].amount) / BigInt(1000000000000000000)).toString()
                      : '0'}
                    {' '}{project.ticker} tokens claimed to your wallet
                  </p>
                  <p className="text-xs text-text-muted">
                    Tokens arriving in 30 seconds...
                  </p>
                </div>
              ) : claimingInProgress ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin text-4xl">⏳</div>
                  <h3 className="font-display text-xl font-bold text-success">Processing Claim...</h3>
                  <p className="text-sm text-text-secondary">
                    Verifying token eligibility and preparing transfer to your wallet
                  </p>
                  <div className="w-full h-1 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="font-display text-xl font-bold text-success">Claim Your Tokens</h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-success/20 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Amount:</span>
                      <span className="font-mono font-semibold text-success">
                        {selectedWallet && snapshotData?.claims[selectedWallet]
                          ? (BigInt(snapshotData.claims[selectedWallet].amount) / BigInt(1000000000000000000)).toString()
                          : '0'}
                        {' '}{project.ticker}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Destination:</span>
                      <span className="font-mono text-xs text-text-secondary break-all max-w-xs">{publicKey?.toString().slice(0, 8)}...{publicKey?.toString().slice(-8)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Fee:</span>
                      <span className="font-mono text-xs text-success">0.000005 SOL</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted bg-white/5 rounded-lg p-3">
                    💡 <strong>Tip:</strong> Keep your wallet open. Tokens arrive instantly once the claim transaction completes.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowClaimModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-text-primary hover:bg-white/20 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClaimTokens}
                      className="flex-1 px-4 py-2 rounded-lg bg-success text-text-primary hover:bg-success/90 font-semibold transition-all hover:shadow-lg hover:shadow-success/50"
                    >
                      Confirm Claim
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  if (project.status === 'migrating') {
    return (
      <div className="glass rounded-xl p-6 border-2 border-primary/30 bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-primary">
            🔄 Migration in Progress
          </h3>
          <div className="animate-spin">⏳</div>
        </div>
        <p className="text-sm text-text-secondary mb-4">
          Registering {project.name} on Sunrise (Wormhole NTT). Canonical SPL token will be created on Solana in 24-48 hours.
        </p>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>✓</span>
            <span>Snapshot validated</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="animate-pulse">⏳</span>
            <span>Wormhole NTT registration pending...</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span>○</span>
            <span>Claims opening soon</span>
          </div>
        </div>
      </div>
    );
  }

  if (project.status === 'approved' && votePercent >= 80) {
    return (
      <div className="space-y-6">
        {/* Success Banner */}
        <div className="glass rounded-xl p-6 border-2 border-success/40 bg-gradient-to-br from-success/10 to-primary/5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center text-2xl flex-shrink-0">
              🎉
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-success mb-1">
                Community Vote Passed!
              </h3>
              <p className="text-sm text-text-secondary">
                {project.name} has been approved for resurrection with {votePercent}% approval. 
                Choose how you want to proceed with the migration.
              </p>
            </div>
          </div>
        </div>

        {/* Migration Method Selector - Simplified */}
        <div className="glass rounded-xl p-6 border border-white/10">
          <h4 className="font-display text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">
            Choose Migration Path
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Path A: Official */}
            <button
              onClick={() => setMigrationTab('canonical')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-300 group ${
                migrationTab === 'canonical'
                  ? 'border-accent bg-accent/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🌅</span>
                {migrationTab === 'canonical' && (
                  <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs font-medium">
                    Selected
                  </span>
                )}
              </div>
              <h5 className="font-semibold text-text-primary mb-1 group-hover:text-accent transition-colors">
                Official Revival
              </h5>
              <p className="text-xs text-text-muted leading-relaxed">
                Work with the original team to create the canonical token on Solana. Best for active projects with responsive founders.
              </p>
            </button>

            {/* Path B: Community */}
            <button
              onClick={() => setMigrationTab('snapshot')}
              className={`p-5 rounded-xl border-2 text-left transition-all duration-300 group ${
                migrationTab === 'snapshot'
                  ? 'border-success bg-success/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">🧟</span>
                {migrationTab === 'snapshot' && (
                  <span className="px-2 py-0.5 rounded-full bg-success/20 text-success text-xs font-medium">
                    Selected
                  </span>
                )}
              </div>
              <h5 className="font-semibold text-text-primary mb-1 group-hover:text-success transition-colors">
                Community Fork
              </h5>
              <p className="text-xs text-text-muted leading-relaxed">
                Community-led resurrection without needing the original team. Perfect for abandoned or dead projects.
              </p>
            </button>
          </div>

          {/* Learn More Link */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <Link 
              href="/docs#migration-paths" 
              className="text-xs text-text-muted hover:text-text-primary transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Learn more about migration paths in our docs
            </Link>
          </div>
        </div>

        {/* Path A: Official Revival Content */}
        {migrationTab === 'canonical' && (
          <div className="glass rounded-xl p-6 border border-accent/30 bg-gradient-to-br from-accent/5 to-transparent">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-display font-semibold text-text-primary mb-1">
                  Official Revival Process
                </h4>
                <p className="text-sm text-text-secondary">
                  This path requires coordination with the original project team.
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 font-medium">1</span>
                <div>
                  <p className="text-sm text-text-primary font-medium">Contact Original Team</p>
                  <p className="text-xs text-text-muted">Reach out to the original founders for approval</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 font-medium">2</span>
                <div>
                  <p className="text-sm text-text-primary font-medium">Register on Wormhole NTT</p>
                  <p className="text-xs text-text-muted">Create canonical SPL token representation</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center flex-shrink-0 font-medium">3</span>
                <div>
                  <p className="text-sm text-text-primary font-medium">Holders Claim Tokens</p>
                  <p className="text-xs text-text-muted">Original holders claim their Solana tokens</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <p className="text-xs text-text-secondary">
                <strong className="text-accent">Note:</strong> This path creates the "official" token on Solana. 
                The original team maintains governance and brand rights. 
                <a href="https://wormhole.com/docs/learn/what-is-wormhole/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-1">
                  Learn about Wormhole NTT →
                </a>
              </p>
            </div>
          </div>
        )}

        {/* Snapshot + Merkle Claims Path */}
        {migrationTab === 'snapshot' && (
          <div className="glass rounded-xl p-6 border-2 border-success/40 bg-gradient-to-br from-success/10 to-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-success">
                  🔓 Snapshot + Merkle Claims
                </h3>
                <p className="text-xs text-text-muted mt-1">Community revival without needing original dev</p>
              </div>
              <span className="text-3xl animate-bounce">🧟</span>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-success/20 space-y-2">
              <p className="text-sm font-semibold text-success">How it works:</p>
              <ul className="text-xs text-text-secondary space-y-1 ml-4">
                <li>✓ Generate Merkle snapshot of old-chain holders</li>
                <li>✓ Create new SPL token on Solana</li>
                <li>✓ Holders prove ownership via Merkle proof</li>
                <li>✓ Claim tokens trustlessly on-chain</li>
                <li>✓ Prevents fraud & double-claims</li>
              </ul>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-success/5 border border-success/30">
              <p className="text-sm text-text-secondary mb-3">
                <strong>Perfect for:</strong> Projects where the original dev is unreachable or the contract is abandoned (mint authority burned, rug-pulled, etc.)
              </p>
              <p className="text-xs text-text-muted">
                This path lets communities resurrect projects without permission, returning value to original holders trustlessly.
              </p>
            </div>

            <div className="space-y-3">
              {!snapshotData ? (
                <button
                  onClick={handleGenerateSnapshot}
                  disabled={snapshotLoading}
                  className="w-full px-6 py-3 rounded-lg bg-success text-surface hover:bg-success/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-success/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {snapshotLoading ? '⏳ Generating Snapshot...' : 'Generate Snapshot →'}
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-success/10 border-2 border-success/40">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">✅</span>
                      <h4 className="font-semibold text-success">Snapshot Generated!</h4>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-text-muted">Merkle Root:</span>
                        <code className="text-xs text-success bg-black/30 px-2 py-1 rounded font-mono break-all max-w-xs">
                          {snapshotData.root.slice(0, 20)}...
                        </code>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Eligible Wallets:</span>
                        <span className="font-semibold text-success">{Object.keys(snapshotData.claims).length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-muted">Total Tokens:</span>
                        <span className="font-semibold text-success">
                          {snapshotData.totalTokens ? (BigInt(snapshotData.totalTokens) / BigInt(1000000000000000000)).toString() : '0'}
                        </span>
                      </div>
                    </div>

                    {Object.entries(snapshotData.claims).length > 0 && (
                      <div className="mt-3 p-3 bg-black/20 rounded-lg">
                        <p className="text-xs text-text-muted mb-2">First eligible wallet:</p>
                        <div className="space-y-1">
                          <p className="text-xs font-mono text-success">{Object.keys(snapshotData.claims)[0]}</p>
                          <p className="text-xs text-text-muted">
                            Amount: <span className="text-success font-semibold">
                              {(BigInt(Object.values(snapshotData.claims)[0].amount) / BigInt(1000000000000000000)).toString()}
                            </span>
                          </p>
                          <details className="text-xs">
                            <summary className="cursor-pointer text-text-muted hover:text-text-secondary">
                              View Merkle proof ({Object.values(snapshotData.claims)[0].proof.length} hashes)
                            </summary>
                            <div className="mt-2 p-2 bg-black/30 rounded text-text-secondary overflow-x-auto">
                              <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                                {Object.values(snapshotData.claims)[0].proof.slice(0, 3).map((p, i) => `${i + 1}. ${p.slice(0, 20)}...`).join('\n')}
                                {Object.values(snapshotData.claims)[0].proof.length > 3 && (
                                  <>
                                    {'\n'}...+{Object.values(snapshotData.claims)[0].proof.length - 3} more</>
                                )}
                              </pre>
                            </div>
                          </details>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSnapshotData(null);
                        setSnapshotError(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 font-semibold transition-all"
                    >
                      Generate New
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWallet(Object.keys(snapshotData.claims)[0]);
                        setShowClaimModal(true);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-success hover:bg-success/90 text-surface font-semibold transition-all"
                    >
                      Claim with Proof →
                    </button>
                  </div>

                  {/* Add MetaMaskConnector here so users can verify holdings */}
                  <div className="mt-6">
                    <MetaMaskConnector />
                  </div>
                </div>
              )}

              {snapshotError && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-400">❌ Error: {snapshotError}</p>
                </div>
              )}

              <details className="group">
                <summary className="cursor-pointer text-xs text-text-muted hover:text-text-secondary transition-colors">
                  How do Merkle proofs work?
                </summary>
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-text-secondary space-y-2">
                  <p>
                    <strong>Merkle Tree:</strong> A cryptographic structure that proves membership without revealing the entire dataset.
                  </p>
                  <p>
                    <strong>Your proof:</strong> A unique cryptographic path proving your wallet held tokens in the original snapshot.
                  </p>
                  <p>
                    <strong>Verification:</strong> The Anchor program verifies your proof on-chain and mints tokens to your wallet.
                  </p>
                  <p>
                    <strong>Security:</strong> Each proof works only once, preventing double-claims. Trustless & permissionless.
                  </p>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Claim Modal for Snapshot */}
        {showClaimModal && snapshotData && selectedWallet && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass rounded-xl p-8 max-w-2xl w-full border border-success/30 bg-success/5 animate-in fade-in-50 max-h-[90vh] overflow-y-auto">
              {claimSuccess ? (
                <div className="text-center space-y-4 animate-in zoom-in-50">
                  <div className="text-6xl animate-bounce">🎃</div>
                  <h3 className="font-display text-2xl font-bold text-success">Claim Submitted!</h3>
                  <p className="text-3xl font-bold text-success mb-2">🧟 → 🚀</p>
                  <p className="text-sm text-text-secondary">
                    {(BigInt(snapshotData.claims[selectedWallet].amount) / 1000000000n).toString()} {project.ticker} tokens claimed
                  </p>
                  {txSignature && (
                    <div className="mt-4 p-3 rounded-lg bg-black/30 border border-success/30">
                      <p className="text-xs text-text-muted mb-1">Transaction Signature:</p>
                      <a
                        href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-success hover:underline break-all font-mono"
                      >
                        {txSignature}
                      </a>
                    </div>
                  )}
                  <p className="text-xs text-text-muted">
                    Your tokens are being transferred to your wallet...
                  </p>
                </div>
              ) : claimingInProgress ? (
                <div className="text-center space-y-4">
                  <div className="animate-spin text-4xl">⏳</div>
                  <h3 className="font-display text-xl font-bold text-success">Processing Claim...</h3>
                  <p className="text-sm text-text-secondary">
                    Verifying Merkle proof and executing on-chain transaction
                  </p>
                  <div className="w-full h-1 bg-success/20 rounded-full overflow-hidden">
                    <div className="h-full bg-success animate-pulse" style={{ width: '75%' }} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-xl font-bold text-success">Claim with Merkle Proof</h3>
                    <button
                      onClick={() => {
                        setShowClaimModal(false);
                        setClaimSuccess(false);
                        setClaimingInProgress(false);
                        setClaimError(null);
                      }}
                      className="text-text-muted hover:text-text-secondary text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {!publicKey && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-400">🔗 Please connect your Solana wallet to claim</p>
                    </div>
                  )}

                  {/* Wallet and Amount Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-success/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-text-muted">Wallet Address:</span>
                      <code className="text-xs text-success bg-black/30 px-2 py-1 rounded font-mono break-all max-w-xs">
                        {selectedWallet.slice(0, 8)}...{selectedWallet.slice(-8)}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Claim Amount:</span>
                      <span className="font-mono font-semibold text-success">
                        {(BigInt(snapshotData.claims[selectedWallet].amount) / 1000000000n).toString()} {project.ticker}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Merkle Index:</span>
                      <span className="font-mono text-xs text-success">
                        #{snapshotData.claims[selectedWallet].index}
                      </span>
                    </div>
                  </div>

                  {/* Merkle Proof Details */}
                  <div className="bg-white/5 rounded-lg p-4 border border-success/20">
                    <p className="text-sm font-semibold text-success mb-2">🔐 Merkle Proof</p>
                    <div className="space-y-2">
                      <p className="text-xs text-text-muted">
                        {snapshotData.claims[selectedWallet].proof.length} proof hashes:
                      </p>
                      <div className="bg-black/30 rounded p-3 max-h-32 overflow-y-auto">
                        <pre className="text-xs font-mono text-success whitespace-pre-wrap break-words space-y-1">
                          {snapshotData.claims[selectedWallet].proof.map((hash, i) => (
                            <div key={i}>
                              {i + 1}. {hash.slice(0, 16)}...{hash.slice(-8)}
                            </div>
                          ))}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Merkle Root Verification */}
                  <div className="bg-white/5 rounded-lg p-4 border border-success/20">
                    <p className="text-sm font-semibold text-success mb-2">✓ Tree Root (for verification)</p>
                    <code className="text-xs text-success bg-black/30 px-3 py-2 rounded font-mono block break-all">
                      {snapshotData.root}
                    </code>
                  </div>

                  {claimError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <p className="text-xs text-red-400">❌ {claimError}</p>
                    </div>
                  )}

                  <p className="text-xs text-text-muted bg-white/5 rounded-lg p-3 border border-white/10">
                    🔗 <strong>On-chain Transaction:</strong> This is a real Solana transaction. Your Merkle proof will be verified by the Anchor program, and tokens will be transferred directly to your wallet on devnet.
                  </p>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => {
                        setShowClaimModal(false);
                        setClaimSuccess(false);
                        setClaimingInProgress(false);
                        setClaimError(null);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-text-primary hover:bg-white/20 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClaimTokens}
                      disabled={!publicKey || claimingInProgress}
                      className="flex-1 px-4 py-2 rounded-lg bg-success text-text-primary hover:bg-success/90 font-semibold transition-all hover:shadow-lg hover:shadow-success/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {publicKey ? "Execute Claim Transaction →" : "Connect Wallet"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (project.status === 'voting') {
    const remainingVotes = project.votesRequired - project.votes;
    const daysLeft = Math.ceil(Math.random() * 5) + 2; // Mock days remaining
    return (
      <div className="glass rounded-xl p-6 border-2 border-primary/30 bg-primary/5">
        <div className="flex items-start justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-primary">
            🗳️ Community Vote in Progress
          </h3>
          <span className="font-mono text-xs text-primary font-semibold">{daysLeft}d left</span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-text-secondary">Votes needed</span>
            <span className="font-mono text-primary">
              {remainingVotes.toFixed(0)} SOL
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-lighter overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${votePercent}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4">
          Your vote counts! The more SOL you pledge, the more power your vote has. When threshold is reached, this project will move to the migration phase.
        </p>

        <div className="text-xs text-text-muted p-3 rounded-lg bg-white/5 border border-white/10">
          <p>
            <strong>Vote with confidence:</strong> Your SOL is never transferred. Only the transaction signature is recorded as proof of commitment.
          </p>
        </div>
      </div>
    );
  }

  if (project.status === 'nominated') {
    return (
      <div className="glass rounded-xl p-6 border-2 border-blue-400/30 bg-blue-400/5">
        <h3 className="font-display text-lg font-semibold text-blue-400 mb-2">
          🎓 Recently Nominated
        </h3>
        <p className="text-sm text-text-secondary">
          This project was just nominated. Community voting will begin once it reaches minimum support, or after the nomination period ends.
        </p>
      </div>
    );
  }

  return null;
}
