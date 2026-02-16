'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSolana } from '@/hooks/useSolana';
import { createVotingTransaction, submitVote, checkUserVote } from '@/lib/voting';

interface VoteCardProps {
  projectId: string;
  projectName: string;
  ticker: string;
}

interface VoteTally {
  yes: number;
  no: number;
  total: number;
}

export function VoteCard({ projectId, projectName, ticker }: VoteCardProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useSolana();
  
  const [voteTally, setVoteTally] = useState<VoteTally>({ yes: 0, no: 0, total: 0 });
  const [userHasVoted, setUserHasVoted] = useState(false);
  const [userVotePower, setUserVotePower] = useState(0);
  const [votingPower, setVotingPower] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load vote tally on mount
  useEffect(() => {
    loadVoteTally();
    if (publicKey) {
      checkIfVoted();
    }
  }, [projectId, publicKey]);

  const loadVoteTally = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/votes?projectId=${projectId}`);
      const data = await response.json();
      if (data.success) {
        setVoteTally(data.votes);
      }
    } catch (err) {
      console.error('Error loading vote tally:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfVoted = async () => {
    if (!publicKey) return;
    try {
      const response = await checkUserVote(publicKey.toString(), projectId);
      if (response.hasVoted && response.vote) {
        setUserHasVoted(true);
        setUserVotePower(response.vote.power || 0);
      }
    } catch (err) {
      console.error('Error checking vote status:', err);
    }
  };

  const handleVote = async (direction: 'yes' | 'no') => {
    if (!publicKey) {
      setError('Please connect your wallet to vote');
      return;
    }

    const power = parseFloat(votingPower);
    if (!votingPower || power <= 0) {
      setError('Please enter a valid voting power');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Get user balance
      const balance = await connection.getBalance(publicKey);
      const balanceSOL = balance / 1e9;

      if (power > balanceSOL) {
        setError(`Insufficient SOL balance. You have ${balanceSOL.toFixed(4)} SOL`);
        setSubmitting(false);
        return;
      }

      // Create vote transaction
      const tx = await createVotingTransaction(connection, publicKey);

      // Sign and send transaction
      try {
        const signature = await sendTransaction(tx, connection);
        setSuccess('Transaction sent to blockchain...');

        // Wait for confirmation
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });

        // Submit vote with signature
        const result = await submitVote(publicKey.toString(), { projectId, power, direction }, signature);

        if (result.success) {
          setSuccess(`Vote recorded: ${direction.toUpperCase()} with ${power} SOL power`);
          setUserHasVoted(true);
          setUserVotePower(power);
          setVotingPower('');
          
          // Refresh vote tally
          await loadVoteTally();
          
          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError(result.message || 'Failed to record vote');
        }
      } catch (txError) {
        console.error('Transaction error:', txError);
        const errorMsg = txError instanceof Error ? txError.message : 'Transaction failed';
        setError(`Transaction failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error('Vote error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to submit vote. Please try again.';
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const yesPercent = voteTally.total > 0 ? Math.round((voteTally.yes / (voteTally.yes + voteTally.no)) * 100) : 50;
  const noPercent = 100 - yesPercent;

  return (
    <div data-testid="vote-card" className="glass rounded-xl p-6 space-y-4">
      <div>
        <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
          {projectName} (${ticker})
        </h3>
        <p className="text-sm text-text-secondary">Vote on migration to Solana</p>
      </div>

      {/* Vote Tally */}
      <div data-testid="vote-tally" className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Current Tally: {loading ? 'Loading...' : `${voteTally.total} votes`}</span>
          {userHasVoted && (
            <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success">
              Your vote: {userVotePower} SOL
            </span>
          )}
        </div>

        {/* Vote Breakdown */}
        <div className="flex gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-success">YES</span>
              <span className="text-xs text-text-muted">{voteTally.yes.toFixed(2)} SOL ({yesPercent}%)</span>
            </div>
            <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
              <div
                className="h-full bg-success transition-all duration-300"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-danger">NO</span>
              <span className="text-xs text-text-muted">{voteTally.no.toFixed(2)} SOL ({noPercent}%)</span>
            </div>
            <div className="h-2 bg-surface-lighter rounded-full overflow-hidden">
              <div
                className="h-full bg-danger transition-all duration-300"
                style={{ width: `${noPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Voting Interface */}
      {!userHasVoted ? (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1.5">
              Vote Power (SOL)
            </label>
            <input
              data-testid="vote-power-input"
              type="number"
              step="0.01"
              min="0"
              value={votingPower}
              onChange={(e) => setVotingPower(e.target.value)}
              placeholder="0.00"
              disabled={submitting || !publicKey}
              className="w-full px-3 py-2 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-text-muted mt-1">Enter amount of SOL to use for voting power</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-danger/10 border border-danger/20 text-danger text-xs">
              <span className="text-lg leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-success/10 border border-success/20 text-success text-xs">
              <span className="text-lg leading-none">✓</span>
              <span>{success}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              data-testid="vote-yes-button"
              onClick={() => handleVote('yes')}
              disabled={submitting || !publicKey}
              className="flex-1 py-2 px-3 rounded-lg bg-success/20 text-success font-semibold text-sm hover:bg-success/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Voting...' : 'Vote YES'}
            </button>
            <button
              data-testid="vote-no-button"
              onClick={() => handleVote('no')}
              disabled={submitting || !publicKey}
              className="flex-1 py-2 px-3 rounded-lg bg-danger/20 text-danger font-semibold text-sm hover:bg-danger/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Voting...' : 'Vote NO'}
            </button>
          </div>
        </div>
      ) : (
        <div className="px-4 py-3 rounded-lg bg-success/10 border border-success/20">
          <p className="text-sm text-text-secondary">
            ✓ You voted with <strong>{userVotePower} SOL</strong> power. Thank you for participating!
          </p>
        </div>
      )}

      {!publicKey && (
        <div className="px-4 py-3 rounded-lg bg-warning/10 border border-warning/20 text-warning text-sm">
          Connect your wallet to vote on this project
        </div>
      )}
    </div>
  );
}
