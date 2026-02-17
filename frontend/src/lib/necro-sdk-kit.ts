/**
 * NecroBridge SDK - @solana/kit typed client
 * Auto-generated client for interacting with NecroMigrate program
 */

// Type placeholders for frontend
export type Address = string;
export type TransactionSigner = any;

// Program address - imported from config
import { NECROBRIDGE_PROGRAM_ID } from './config';
export const NECRO_PROGRAM_ID = NECROBRIDGE_PROGRAM_ID as Address;

/**
 * Initialize a new migration
 */
export async function createInitializeMigrationTransaction(params?: {
  admin: TransactionSigner;
  splMint: Address;
  name: string;
  sourceChain: number;
  sourceAddress: Uint8Array;
  snapshotRoot: [number, ...number[]];
  totalSupply: bigint;
}): Promise<any> {
  // Placeholder: In production, use Codama-generated client or web3.js
  console.log("Initialize migration with params:", params);
  return {};
}

/**
 * Claim tokens for user
 */
export async function createClaimTokensTransaction(params?: {
  user: TransactionSigner;
  amount: bigint;
  merkleProof: Uint8Array[];
}): Promise<any> {
  // Placeholder: In production, use Codama-generated client or web3.js
  console.log("Claim tokens with params:", params);
  return {};
}

/**
 * Initialize governance
 */
export async function createInitializeGovernanceTransaction(params?: {
  admin: TransactionSigner;
  totalVotes: bigint;
}): Promise<any> {
  // Placeholder: In production, use Codama-generated client or web3.js
  console.log("Initialize governance with params:", params);
  return {};
}

/**
 * Vote on a proposal
 */
export async function createVoteTransaction(params?: {
  voter: TransactionSigner;
  proposalId: bigint;
  voteWeight: bigint;
}): Promise<any> {
  // Placeholder: In production, use Codama-generated client or web3.js
  console.log("Vote with params:", params);
  return {};
}

/**
 * Get RPC client configured for the current cluster
 */
export async function getNecrobridgeClient(rpcUrl: string = "https://api.devnet.solana.com") {
  // Placeholder: In production, initialize proper RPC connection
  return { rpcUrl };
}
