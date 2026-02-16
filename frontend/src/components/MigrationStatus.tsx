'use client';

import { useState } from 'react';
import { Project } from './ProjectCard';
import { TokenBridge } from './TokenBridge';
import { ClaimTokensInterface } from './ClaimTokensInterface';

interface MigrationStatusProps {
  project: Project;
  votePercent: number;
}

export function MigrationStatus({ project, votePercent }: MigrationStatusProps) {
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimingInProgress, setClaimingInProgress] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [migrationTab, setMigrationTab] = useState<'canonical' | 'snapshot'>('canonical');

  const handleClaimTokens = async () => {
    setClaimingInProgress(true);
    
    // Simulate claim processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setClaimingInProgress(false);
    setClaimSuccess(true);
    
    // Auto-close modal after success animation
    setTimeout(() => {
      setShowClaimModal(false);
      setClaimSuccess(false);
    }, 3000);
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
          migrationAddress="Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap"
          userClaimAmount="84021"
          isEligible={true}
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
                    {(84021).toLocaleString()} {project.ticker} tokens claimed to your wallet
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
                        {(84021).toLocaleString()} {project.ticker}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Destination:</span>
                      <span className="font-mono text-xs text-text-secondary">Your Solana wallet</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-muted">Fee:</span>
                      <span className="font-mono text-xs text-success">Free</span>
                    </div>
                  </div>
                  <p className="text-xs text-text-muted bg-white/5 rounded-lg p-3">
                    💡 <strong>Tip:</strong> Keep your wallet open. Tokens arrive instantly once the claim transaction completes.
                  </p>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setShowClaimModal(false)}
                      className="flex-1 px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-semibold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClaimTokens}
                      className="flex-1 px-4 py-2 rounded-lg bg-success text-white hover:bg-success/90 font-semibold transition-all hover:shadow-lg hover:shadow-success/50"
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
      <div className="space-y-4">
        {/* Migration Method Selector */}
        <div className="glass rounded-xl p-4 border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5">
          <p className="text-xs text-text-muted mb-3 font-semibold uppercase tracking-wide">
            🗺️ Choose Your Migration Path
          </p>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setMigrationTab('canonical')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                migrationTab === 'canonical'
                  ? 'bg-accent text-surface shadow-lg shadow-accent/50'
                  : 'bg-white/10 text-text-secondary hover:bg-white/20'
              }`}
            >
              ⚡ Canonical (Sunrise/NTT)
            </button>
            <button
              onClick={() => setMigrationTab('snapshot')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                migrationTab === 'snapshot'
                  ? 'bg-success text-surface shadow-lg shadow-success/50'
                  : 'bg-white/10 text-text-secondary hover:bg-white/20'
              }`}
            >
              🔓 Snapshot + Claims
            </button>
          </div>
        </div>

        {/* Canonical Path (Sunrise/NTT) */}
        {migrationTab === 'canonical' && (
          <div className="glass rounded-xl p-6 border-2 border-accent/40 bg-gradient-to-br from-accent/10 to-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-semibold text-accent">
                  🌅 Ready for Sunrise Migration
                </h3>
                <p className="text-xs text-text-muted mt-1">Recommended if you have coordination</p>
              </div>
              <span className="text-3xl animate-bounce">🔗</span>
            </div>

            <div className="mb-6 p-4 rounded-lg bg-white/5 border border-accent/20 space-y-2">
              <p className="text-sm font-semibold text-accent">What happens:</p>
              <ul className="text-xs text-text-secondary space-y-1 ml-4">
                <li>✓ Register on Sunrise (Wormhole NTT)</li>
                <li>✓ Existing holders burn/lock old tokens</li>
                <li>✓ Native canonical SPL token minted 1:1 on Solana</li>
                <li>✓ Instant Jupiter listing & unified liquidity</li>
                <li>✓ Recognized by all Solana apps</li>
              </ul>
            </div>

            <p className="text-sm text-text-secondary mb-6">
              {project.name} passed community vote! Register on Sunrise (Wormhole NTT) to create a canonical SPL token on Solana.
            </p>

            <div className="space-y-3">
              <a
                href="https://sunrisebridge.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-3 rounded-lg bg-accent text-surface hover:bg-accent/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-accent/50 text-center"
              >
                Register on Sunrise →
              </a>

              <details className="group">
                <summary className="cursor-pointer text-xs text-text-muted hover:text-text-secondary transition-colors">
                  What is Sunrise / Wormhole NTT?
                </summary>
                <div className="mt-2 p-3 bg-white/5 rounded-lg border border-white/10 text-xs text-text-secondary space-y-2">
                  <p>
                    <strong>Sunrise</strong> (by Wormhole Foundation) is a token bridge that creates canonical SPL representations of tokens from other chains.
                  </p>
                  <p>
                    <strong>NTT</strong> (Native Token Transfer) ensures your token holders get 1:1 SPL tokens on Solana with proper accounting.
                  </p>
                  <p>
                    Once registered, holders can claim their tokens during the claims phase.
                  </p>
                  <a
                    href="https://wormhole.com/docs/learn/what-is-wormhole/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Learn more →
                  </a>
                </div>
              </details>
            </div>

            <div className="mt-6">
              <TokenBridge
                sourceChain="Ethereum"
                sourceTokenAddress={project.sourceTokenAddress || "0x1234567890abcdef"}
              />
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
              <button className="w-full px-6 py-3 rounded-lg bg-success text-surface hover:bg-success/90 font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-success/50">
                Generate Snapshot →
              </button>

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
