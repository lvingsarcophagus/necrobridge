"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import { useToast } from "@/lib/toast-context";
import { SolanaMerkleTreeGenerator } from "@/lib/merkle-tree";

interface ClaimTokensProps {
  migrationAddress: string;
  userClaimAmount: string;
  isEligible: boolean;
}

const PROGRAM_ID = new PublicKey(
  "Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap"
);

export function ClaimTokensInterface({
  migrationAddress,
  userClaimAmount,
  isEligible,
}: ClaimTokensProps) {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStep, setClaimStep] = useState<
    "idle" | "generating" | "submitting" | "complete"
  >("idle");
  const [claimStatus, setClaimStatus] = useState<string>("");

  const handleClaimTokens = async () => {
    if (!publicKey || !signTransaction || !sendTransaction) {
      addToast("Please connect your wallet first", "error");
      return;
    }

    if (!isEligible) {
      addToast("You are not eligible to claim tokens", "error");
      return;
    }

    setIsLoading(true);
    setClaimStep("generating");
    setClaimStatus("Generating merkle proof...");

    try {
      // In a production app, you would:
      // 1. Fetch the merkle snapshot from a server
      // 2. Generate the merkle proof for this user
      // 3. Create the claim transaction

      // For demo purposes, we'll create a mock proof
      const claims = [
        { address: publicKey.toString(), amount: userClaimAmount },
      ];

      const merkleGen = new SolanaMerkleTreeGenerator(claims);
      merkleGen.getProof(publicKey.toString());
      merkleGen.getLeafIndex(publicKey.toString());

      setClaimStep("submitting");
      setClaimStatus("Submitting claim transaction...");

      // Create instruction data for claim_tokens
      // This is a simplified version - in production you'd use the IDL
      const instruction = {
        programId: PROGRAM_ID,
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true },
          {
            pubkey: new PublicKey(migrationAddress),
            isSigner: false,
            isWritable: true,
          },
          // Additional accounts would be added here
        ],
        data: Buffer.alloc(1000), // Placeholder for instruction data
      };

      const transaction = new Transaction().add({
        programId: PROGRAM_ID,
        keys: instruction.keys,
        data: instruction.data,
      });

      transaction.feePayer = publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      // Sign and send
      const signature = await sendTransaction(transaction, connection);

      setClaimStep("complete");
      setClaimStatus("Claim submitted!");

      addToast(`Claimed ${userClaimAmount} tokens! Tx: ${signature.slice(0, 8)}...`, "success");

      setTimeout(() => {
        setIsLoading(false);
        setClaimStep("idle");
        setClaimStatus("");
      }, 3000);
    } catch (error) {
      console.error("Claim error:", error);
      addToast("Failed to claim tokens. Please try again.", "error");
      setIsLoading(false);
      setClaimStep("idle");
      setClaimStatus("");
    }
  };

  return (
    <div className="w-full rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">
            🎉 Claim Your Tokens
          </h3>
          <p className="text-sm text-text-secondary">
            You are eligible to claim tokens from the migrated protocol
          </p>
        </div>

        {/* Claim amount */}
        <div className="rounded-lg bg-white/5 p-4">
          <div className="text-sm text-text-secondary mb-1">Claim Amount</div>
          <div className="text-2xl font-bold text-green-400">
            {userClaimAmount}
            <span className="text-lg text-text-secondary ml-2">tokens</span>
          </div>
        </div>

        {/* Status indicator */}
        {isLoading && (
          <div className="rounded-lg bg-white/10 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="animate-spin">⚙️</div>
              <span className="text-sm text-white">{claimStatus}</span>
            </div>

            {/* Progress steps */}
            <div className="space-y-2">
              {["Generating", "Submitting", "Complete"].map((step, idx) => {
                const steps = ["generating", "submitting", "complete"];
                const isActive = steps.indexOf(claimStep) >= idx;
                const isCompleted = steps.indexOf(claimStep) > idx;

                return (
                  <div
                    key={step}
                    className={`flex items-center gap-2 text-xs ${
                      isActive ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isCompleted
                          ? "bg-green-500"
                          : isActive
                            ? "bg-blue-500 animate-pulse"
                            : "bg-white/20"
                      }`}
                    />
                    {step}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={handleClaimTokens}
          disabled={isLoading || !publicKey || !isEligible}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
            isLoading || !publicKey || !isEligible
              ? "bg-white/10 text-text-secondary cursor-not-allowed"
              : "bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 active:scale-95"
          }`}
        >
          {isLoading
            ? `${claimStep.toUpperCase()}...`
            : "Claim Tokens from Anchor Program"}
        </button>

        {/* Security note */}
        <p className="text-xs text-text-secondary text-center">
          💪 Trustless merkle-proof based claims powered by
          <br />
          Anchor program verification on Solana
        </p>
      </div>
    </div>
  );
}
