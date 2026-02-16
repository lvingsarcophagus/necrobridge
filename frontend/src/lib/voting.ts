'use client';

import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';

export interface VoteData {
  projectId: string;
  power: number; // voting power in SOL
  direction: 'yes' | 'no'; // voting direction
}

export interface VoteCheckResponse {
  success: boolean;
  hasVoted: boolean;
  vote: VoteData & { walletAddress: string; transactionSignature: string; timestamp: string } | null;
}

/**
 * Creates a voting transaction
 * Uses system program to send minimal SOL (1 lamport) to self as a way to create a valid transaction
 * In production, you'll use your actual Necrobridge program ID with proper voting instruction
 */
export async function createVotingTransaction(
  connection: Connection,
  voter: PublicKey
): Promise<Transaction> {
  try {
    const transaction = new Transaction();

    // Create a minimal system program transfer (1 lamport to self)
    // This creates a valid transaction that can be signed and sent
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: voter,
        toPubkey: voter,
        lamports: 1, // minimum non-zero lamport amount
      })
    );

    // Set fee payer
    transaction.feePayer = voter;

    // Get latest blockhash from finalized state
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;

    return transaction;
  } catch (error) {
    console.error('Error creating voting transaction:', error);
    throw new Error(`Failed to create voting transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Submit vote to backend API
 */
export async function submitVote(
  walletAddress: string,
  data: VoteData,
  transactionSignature: string
): Promise<{ success: boolean; voteId?: string; message: string }> {
  try {
    const response = await fetch('/api/votes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        projectId: data.projectId,
        direction: data.direction,
        power: data.power,
        transactionSignature,
        timestamp: new Date().toISOString(),
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || `API error: ${response.status}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error submitting vote:', error);
    throw error;
  }
}

/**
 * Fetch votes for a project
 */
export async function fetchVotesByProject(
  projectId: string
): Promise<{ yes: number; no: number; total: number }> {
  try {
    const response = await fetch(`/api/votes?projectId=${projectId}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching votes:', error);
    return { yes: 0, no: 0, total: 0 };
  }
}

/**
 * Check if wallet has voted on a project
 */
export async function checkUserVote(
  walletAddress: string,
  projectId: string
): Promise<VoteCheckResponse> {
  try {
    const response = await fetch(
      `/api/votes?walletAddress=${walletAddress}&projectId=${projectId}&checkVote=true`
    );

    if (!response.ok) {
      return { success: false, hasVoted: false, vote: null };
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user vote:', error);
    return { success: false, hasVoted: false, vote: null };
  }
}
