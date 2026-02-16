'use client';

import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { Connection } from '@solana/web3.js';

export interface NominationData {
  projectName: string;
  ticker: string;
  sourceChain: string;
  contractAddress: string;
  reason: string;
  website?: string;
}

/**
 * Creates a nomination transaction
 * Uses system program to send minimal SOL (1 lamport) to self
 * In production, you'll use your actual Necrobridge program ID
 */
export async function createNominationTransaction(
  connection: Connection,
  nominator: PublicKey
): Promise<Transaction> {
  try {
    const transaction = new Transaction();

    // Create a minimal system program transfer (1 lamport to self)
    // This creates a valid transaction that can be signed and sent
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: nominator,
        toPubkey: nominator,
        lamports: 1, // minimum non-zero lamport amount
      })
    );

    // Set fee payer
    transaction.feePayer = nominator;

    // Get latest blockhash from confirmed state
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;

    return transaction;
  } catch (error) {
    console.error('Error creating nomination transaction:', error);
    throw new Error(`Failed to create nomination transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Submit nomination to backend API
 */
export async function submitNomination(
  walletAddress: string,
  data: NominationData,
  transactionSignature: string
): Promise<{ success: boolean; nominationId?: string; message: string }> {
  try {
    const response = await fetch('/api/nominations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        projectName: data.projectName,
        ticker: data.ticker,
        sourceChain: data.sourceChain,
        contractAddress: data.contractAddress,
        reason: data.reason,
        website: data.website,
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
    console.error('Error submitting nomination:', error);
    throw error;
  }
}

/**
 * Fetch all nominations for a project
 */
export async function fetchNominationsByProject(
  projectId: string
): Promise<NominationData[]> {
  try {
    const response = await fetch(`/api/nominations?projectId=${projectId}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching nominations:', error);
    return [];
  }
}
