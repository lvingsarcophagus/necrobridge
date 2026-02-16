import { Connection } from '@solana/web3.js';
import { HELIUS_RPC } from './config';

// Create a singleton connection instance
let connectionInstance: Connection | null = null;

export function getConnection(): Connection {
  if (!connectionInstance) {
    connectionInstance = new Connection(HELIUS_RPC, 'confirmed');
  }
  return connectionInstance;
}

// Get account info
export async function getAccountInfo(publicKey: any) {
  const connection = getConnection();
  return connection.getAccountInfo(publicKey);
}

// Get balance
export async function getBalance(publicKey: any) {
  const connection = getConnection();
  return connection.getBalance(publicKey);
}

// Get parsed token accounts
export async function getParsedTokenAccounts(publicKey: any) {
  const connection = getConnection();
  return connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: new (require('@solana/web3.js')).PublicKey('TokenkegQfeZyiNwAJsyFbPVwrQwVMstPs2PQ5LNt5'),
  });
}

// Send transaction
export async function sendTransaction(transaction: any, connection: Connection, payer: any) {
  const signature = await connection.sendTransaction(transaction, [payer]);
  await connection.confirmTransaction(signature, 'confirmed');
  return signature;
}
