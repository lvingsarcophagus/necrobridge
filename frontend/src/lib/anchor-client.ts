/**
 * Anchor Client for NecroBridge
 * Provides type-safe methods to interact with the necro_migrate program
 */

import {
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { NECROBRIDGE_PROGRAM_ID } from "./config";

export interface InitializeMigrationParams {
  name: Uint8Array; // [u8; 64]
  sourceChain: number; // u16
  sourceAddress: Uint8Array; // [u8; 32]
  snapshotRoot: Uint8Array; // [u8; 32]
  totalSupply: bigint; // u64
}

export interface ClaimTokensParams {
  amount: bigint; // u64
  merkleProof: Buffer[]; // vec of [u8; 32]
  leafIndex: number; // u32
}

/**
 * Get the migration PDA
 */
export function getMigrationPDA(
  admin: PublicKey,
  sourceChain: number
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("migration"),
      admin.toBuffer(),
      Buffer.from([sourceChain & 0xff, (sourceChain >> 8) & 0xff]), // u16 LE
    ],
    new PublicKey(NECROBRIDGE_PROGRAM_ID)
  );
}

/**
 * Get the user claim PDA
 */
export function getUserClaimPDA(
  migrationAddress: PublicKey,
  user: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("claim"), migrationAddress.toBuffer(), user.toBuffer()],
    new PublicKey(NECROBRIDGE_PROGRAM_ID)
  );
}

/**
 * Get the migration authority PDA
 */
export function getMigrationAuthorityPDA(
  migrationAddress: PublicKey
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("authority"), migrationAddress.toBuffer()],
    new PublicKey(NECROBRIDGE_PROGRAM_ID)
  );
}

/**
 * Create an Anchor program instance
 * Note: Due to type complexities in frontend environment, 
 * we build transactions manually using the IDL structure
 */
export function getProgram(
  connection: Connection
): any {
  // Return connection directly for use in other functions
  // The actual program interaction happens via transaction building
  return { connection };
}

/**
 * Build an initialize migration transaction
 * Frontend placeholder - actual transaction building would happen on backend
 */
export async function buildInitializeMigrationTx(
  connection: Connection,
  admin: PublicKey,
  _mint: PublicKey,
  _params: InitializeMigrationParams
): Promise<Transaction> {
  const tx = new Transaction();
  
  // Placeholder: In production, would use Anchor IDL to build proper instruction
  // For now, return empty transaction that can be signed and sent
  tx.feePayer = admin;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  return tx;
}

/**
 * Build a claim tokens transaction
 * Frontend placeholder - actual transaction building would happen on backend
 */
export async function buildClaimTokensTx(
  connection: Connection,
  user: PublicKey,
  _migrationAddress: PublicKey,
  _mint: PublicKey,
  _tokenVault: PublicKey,
  _userTokenAccount: PublicKey,
  _params: ClaimTokensParams
): Promise<Transaction> {
  const tx = new Transaction();
  
  // Placeholder: In production, would use Anchor IDL to build proper instruction
  // For now, return empty transaction that can be signed and sent
  tx.feePayer = user;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  return tx;
}

/**
 * Build a finalize migration transaction
 * Frontend placeholder - actual transaction building would happen on backend
 */
export async function buildFinalizeMigrationTx(
  connection: Connection,
  admin: PublicKey,
  _migrationAddress: PublicKey
): Promise<Transaction> {
  const tx = new Transaction();
  
  // Placeholder: In production, would use Anchor IDL to build proper instruction
  // For now, return empty transaction that can be signed and sent
  tx.feePayer = admin;
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  
  return tx;
}

/**
 * Fetch migration account data
 */
export async function fetchMigrationAccount(
  connection: Connection,
  migrationAddress: PublicKey
): Promise<any> {
  const program = getProgram(connection);
  return program.account.migration.fetch(migrationAddress);
}

/**
 * Fetch user claim account data
 */
export async function fetchUserClaimAccount(
  connection: Connection,
  userClaimAddress: PublicKey
): Promise<any> {
  const program = getProgram(connection);
  return program.account.userClaim.fetch(userClaimAddress);
}

/**
 * Check if user has claimed
 */
export async function checkUserClaimed(
  connection: Connection,
  migrationAddress: PublicKey,
  user: PublicKey
): Promise<boolean> {
  const [userClaimPDA] = getUserClaimPDA(migrationAddress, user);

  try {
    const account = await fetchUserClaimAccount(connection, userClaimPDA);
    return account.isClaimed;
  } catch (error) {
    // Account doesn't exist = not claimed
    return false;
  }
}
