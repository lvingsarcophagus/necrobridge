'use client';

import { useCallback } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function useSolana() {
  const { publicKey, sendTransaction, connected, wallet } = useWallet();
  const { connection } = useConnection();

  const walletAddress = publicKey?.toString() ?? null;
  const walletName = wallet?.adapter.name ?? null;
  const isConnected = connected && !!publicKey;

  const getBalance = useCallback(async () => {
    if (!publicKey) return 0;
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  }, [publicKey, connection]);

  const getTokenAccounts = useCallback(async () => {
    if (!publicKey) return [];
    const response = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJsyFbPVwrQwVMstPs2PQ5LNt5'),
    });
    return response.value;
  }, [publicKey, connection]);

  const sendSOL = useCallback(
    async (toAddress: string, amount: number) => {
      if (!publicKey) throw new Error('Wallet not connected');

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(toAddress),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');

      return signature;
    },
    [publicKey, connection, sendTransaction]
  );

  return {
    walletAddress,
    walletName,
    isConnected,
    connection,
    publicKey,
    getBalance,
    getTokenAccounts,
    sendSOL,
  };
}
