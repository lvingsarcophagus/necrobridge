/**
 * NecroBridge React Hooks - framework-kit patterns
 * Wallet + RPC integration using @solana/wallet-standard-react
 */

import { useCallback, useState } from "react";
import {
  createInitializeMigrationTransaction,
  createClaimTokensTransaction,
} from "../lib/necro-sdk-kit";

export function useNecroMigration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeMigration = useCallback(
    async (params: {
      name: string;
      sourceChain: number;
      sourceAddress: Uint8Array;
      snapshotRoot: [number, ...number[]];
      totalSupply: bigint;
      splMint: any;
    }) => {
      setLoading(true);
      setError(null);

      try {
        // Placeholder: In production, build and send transaction
        await createInitializeMigrationTransaction({
          admin: {} as any,
          ...params,
        });
        return "placeholder-signature";
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const claimTokens = useCallback(
    async (params: {
      amount: bigint;
      merkleProof: Uint8Array[];
    }) => {
      setLoading(true);
      setError(null);

      try {
        await createClaimTokensTransaction({
          user: {} as any,
          ...params,
        });
        return "placeholder-signature";
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    initializeMigration,
    claimTokens,
    loading,
    error,
  };
}
