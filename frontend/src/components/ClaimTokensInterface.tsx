"use client";

import { useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  PublicKey,
} from "@solana/web3.js";
import { useToast } from "@/lib/toast-context";
import { SolanaMerkleTreeGenerator } from "@/lib/merkle-tree";
import {
  buildClaimTokensTx,
  checkUserClaimed,
} from "@/lib/anchor-client";
import { TEST_TOKEN_MINT, TEST_TOKEN_VAULT } from "@/lib/config";

interface ClaimTokensProps {
  migrationAddress: string;
  userClaimAmount: string;
  isEligible: boolean;
}

export function ClaimTokensInterface({
  migrationAddress,
  userClaimAmount,
  isEligible,
}: ClaimTokensProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStep, setClaimStep] = useState<
    "idle" | "fetching" | "generating" | "submitting" | "confirming" | "complete"
  >("idle");
  const [claimStatus, setClaimStatus] = useState<string>("");
  const [hasUserClaimed, setHasUserClaimed] = useState<boolean | null>(null);

  // Check if user has already claimed
  const checkClaimed = async () => {
    if (!publicKey) return;

    try {
      const migrationAddr = new PublicKey(migrationAddress);
      const claimed = await checkUserClaimed(connection, migrationAddr, publicKey);
      setHasUserClaimed(claimed);
      if (claimed) {
        addToast("You have already claimed tokens!", "info");
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
    }
  };

  // Check if claimed when component mounts or publicKey changes
  useEffect(() => {
    if (publicKey) {
      checkClaimed();
    }
  }, [publicKey, connection, migrationAddress]);

  const handleClaimTokens = async () => {
    if (!publicKey || !sendTransaction) {
      addToast("Please connect your wallet first", "error");
      return;
    }

    if (!isEligible) {
      addToast("You are not eligible to claim tokens", "error");
      return;
    }

    if (hasUserClaimed) {
      addToast("You have already claimed tokens!", "info");
      return;
    }

    setIsLoading(true);
    setClaimStep("fetching");
    setClaimStatus("Fetching migration data...");

    try {
      // Step 1: Get the merkle proof from the server
      setClaimStep("fetching");
      setClaimStatus("Fetching your merkle proof from server...");

      const snapshotResponse = await fetch(
        `/api/migrations/snapshot?projectId=${migrationAddress}`
      );

      if (!snapshotResponse.ok) {
        throw new Error("Failed to fetch migration snapshot");
      }

      const snapshotData = await snapshotResponse.json();
      const userProofData = snapshotData.claims[publicKey.toString()];

      if (!userProofData) {
        throw new Error("Your address is not in the snapshot. You may not be eligible.");
      }

      // Step 2: Generate merkle proof
      setClaimStep("generating");
      setClaimStatus("Generating merkle proof for your wallet...");

      const claims = [
        { address: publicKey.toString(), amount: userProofData.amount },
      ];

      const merkleGen = new SolanaMerkleTreeGenerator(claims);
      const proof = merkleGen.getProof(publicKey.toString());
      const leafIndex = merkleGen.getLeafIndex(publicKey.toString());

      if (!proof || proof.length === 0) {
        throw new Error("Failed to generate merkle proof");
      }

      // Step 3: Build and submit transaction
      setClaimStep("submitting");
      setClaimStatus("Building claim transaction...");

      const migrationPubkey = new PublicKey(migrationAddress);
      
      // Use real test token mint and vault from config
      const realMint = new PublicKey(TEST_TOKEN_MINT);
      const realVault = new PublicKey(TEST_TOKEN_VAULT);
      
      // Create user token account seed for ATA-like address
      const userAtaSeed = Buffer.concat([
        Buffer.from('ata'),
        publicKey.toBuffer(),
        realMint.toBuffer(),
      ]);

      // For hackathon: use deterministic but valid public keys
      const programId = new PublicKey('11111111111111111111111111111111');
      const userTokenAccount = PublicKey.createProgramAddressSync(
        [userAtaSeed],
        programId
      );

      try {
        const tx = await buildClaimTokensTx(
          connection,
          publicKey,
          migrationPubkey,
          realMint,
          realVault,
          userTokenAccount,
          {
            amount: BigInt(userProofData.amount),
            merkleProof: proof,
            leafIndex,
          }
        );

        tx.feePayer = publicKey;
        tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        setClaimStatus("Sending transaction for signing...");
        const signature = await sendTransaction(tx, connection);

        setClaimStep("confirming");
        setClaimStatus("Confirming transaction on blockchain...");

        // Wait for confirmation with extended timeout for devnet
        const latestBlockHash = await connection.getLatestBlockhash();
        const confirmationResult = await connection.confirmTransaction(
          {
            blockhash: latestBlockHash.blockhash,
            lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
            signature: signature,
          },
          'finalized'
        );

        if (confirmationResult.value.err) {
          throw new Error(`Transaction failed: ${confirmationResult.value.err}`);
        }

        // Step 4: Success
        setClaimStep("complete");
        setClaimStatus("Claim submitted successfully!");
        setHasUserClaimed(true);

        addToast(
          `✅ Claimed ${userProofData.amount} tokens! Tx: ${signature.slice(0, 8)}...`,
          "success"
        );
      } catch (txError) {
        // Detailed error handling
        if (txError instanceof Error) {
          console.error('Transaction error:', txError.message);
          if (txError.message.includes('User rejected')) {
            throw new Error('Transaction cancelled');
          } else if (txError.message.includes('insufficient lamports')) {
            throw new Error('Insufficient SOL for transaction fee');
          } else if (txError.message.includes('failed to send transaction')) {
            throw new Error('Network error - please try again');
          }
        }
        throw txError;
      }

      setTimeout(() => {
        setIsLoading(false);
        setClaimStep("idle");
        setClaimStatus("");
      }, 3000);
    } catch (error) {
      console.error("Claim error:", error);
      const errorMsg =
        error instanceof Error ? error.message : "Failed to claim tokens";
      addToast(errorMsg, "error");
      setIsLoading(false);
      setClaimStep("idle");
      setClaimStatus("");
    }
  };

  return (
    <div className="w-full rounded-xl border border-white/8 bg-gradient-to-br from-white/2 to-transparent backdrop-blur-sm p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-white/15 hover:bg-gradient-to-br hover:from-white/4 hover:to-white/1">
      <div className="space-y-4">
        <div>
          <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
            ✨ Claim Your Tokens
          </h3>
          <p className="text-sm text-text-secondary">
            You are eligible to claim tokens from the migrated protocol
          </p>
        </div>

        {/* Claim amount */}
        <div className="rounded-lg border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 shadow-sm">
          <div className="text-sm text-text-muted mb-1">Claim Amount</div>
          <div className="text-2xl font-bold text-text-primary">
            {userClaimAmount}
            <span className="text-lg text-text-secondary ml-2">tokens</span>
          </div>
        </div>

        {/* Status indicator */}
        {isLoading && (
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-surface-light/30 p-3 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin">⚙️</div>
              <span className="text-sm text-text-primary">{claimStatus}</span>
            </div>

            {/* Progress steps */}
            <div className="space-y-2">
              {["Fetching", "Generating", "Submitting", "Confirming", "Complete"].map((step, idx) => {
                const steps = ["fetching", "generating", "submitting", "confirming", "complete"];
                const isActive = steps.indexOf(claimStep) >= idx;
                const isCompleted = steps.indexOf(claimStep) > idx;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2 text-xs ${
                      isActive ? "text-text-primary" : "text-text-muted"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCompleted
                          ? "bg-success"
                          : isActive
                            ? "bg-white/40 animate-pulse"
                            : "bg-white/10"
                      }`}
                    />
                    {step}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Already claimed message */}
        {hasUserClaimed && (
          <div className="rounded-lg bg-green-500/10 p-3 border border-green-500/30">
            <p className="text-sm text-green-300">
              ✅ You have already claimed your tokens!
            </p>
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={handleClaimTokens}
          disabled={isLoading || !publicKey || !isEligible || (hasUserClaimed === true)}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 border ${
            isLoading || !publicKey || !isEligible || (hasUserClaimed === true)
              ? "border-white/10 bg-white/10 text-text-muted cursor-not-allowed"
              : "border-success/50 bg-success/10 text-success hover:bg-success/20 hover:border-success/70 active:scale-95"
          }`}
        >
          {isLoading
            ? `${claimStep.toUpperCase()}...`
            : hasUserClaimed
              ? "Already Claimed ✓"
              : "Claim Tokens via Anchor Program"}
        </button>

        {/* Security note */}
        <p className="text-xs text-text-secondary text-center">
          🔐 Trustless merkle-proof based claims powered by
          <br />
          Anchor program verification on Solana
        </p>
      </div>
    </div>
  );
}
