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
import { Wallet, Search, CheckCircle, AlertCircle } from "lucide-react";
import { trackActivity } from "@/lib/activity";

interface ClaimTokensProps {
  migrationAddress: string;
  projectName: string;
  projectTicker: string;
}

export function ClaimTokensInterface({
  migrationAddress,
  projectName,
  projectTicker,
}: ClaimTokensProps) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { addToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [claimStep, setClaimStep] = useState<
    "idle" | "verifying" | "fetching" | "generating" | "submitting" | "confirming" | "complete"
  >("idle");
  const [claimStatus, setClaimStatus] = useState<string>("");
  const [hasUserClaimed, setHasUserClaimed] = useState<boolean | null>(null);
  
  // New state for original wallet address input
  const [originalWalletAddress, setOriginalWalletAddress] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    amount?: string;
    error?: string;
  } | null>(null);

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

  // Verify wallet address against snapshot
  const verifyWalletAddress = async () => {
    if (!originalWalletAddress.trim()) {
      addToast("Please enter your original wallet address", "error");
      return;
    }

    setIsLoading(true);
    setClaimStep("verifying");
    setClaimStatus("Verifying your holdings against snapshot...");

    try {
      const snapshotResponse = await fetch(
        `/api/migrations/snapshot?projectId=${migrationAddress}`
      );

      if (!snapshotResponse.ok) {
        throw new Error("Failed to fetch migration snapshot");
      }

      const snapshotData = await snapshotResponse.json();
      const userProofData = snapshotData.claims[originalWalletAddress.toLowerCase()];

      if (!userProofData) {
        setVerificationResult({
          verified: false,
          error: "Address not found in snapshot. You may not have held tokens during the snapshot."
        });
        addToast("Address not found in snapshot", "error");
      } else {
        setVerificationResult({
          verified: true,
          amount: userProofData.amount
        });
        addToast(`Verified! You can claim ${userProofData.amount} tokens`, "success");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        verified: false,
        error: "Failed to verify address. Please try again."
      });
      addToast("Verification failed", "error");
    } finally {
      setIsLoading(false);
      setClaimStep("idle");
      setClaimStatus("");
    }
  };

  const handleClaimTokens = async () => {
    if (!publicKey || !sendTransaction) {
      addToast("Please connect your Solana wallet first", "error");
      return;
    }

    if (!verificationResult?.verified) {
      addToast("Please verify your original wallet address first", "error");
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
      const userProofData = snapshotData.claims[originalWalletAddress.toLowerCase()];

      if (!userProofData) {
        throw new Error("Your address is not in the snapshot. You may not be eligible.");
      }

      // Step 2: Generate merkle proof
      setClaimStep("generating");
      setClaimStatus("Generating merkle proof for your wallet...");

      const claims = Object.entries(snapshotData.claims).map(([addr, data]: [string, any]) => ({
        address: addr,
        amount: data.amount,
      }));

      const merkleGen = new SolanaMerkleTreeGenerator(claims);
      const proof = merkleGen.getProof(originalWalletAddress.toLowerCase());
      const leafIndex = merkleGen.getLeafIndex(originalWalletAddress.toLowerCase());

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

        // Track claim activity
        if (publicKey) {
          await trackActivity(
            publicKey.toString(),
            'claim',
            migrationAddress,
            projectName,
            projectTicker,
            `${userProofData.amount} tokens`,
            { claimAmount: userProofData.amount, txHash: signature }
          );
        }
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
            Claim Your Tokens
          </h3>
          <p className="text-sm text-text-secondary">
            Enter your original chain wallet address to verify holdings and claim
          </p>
        </div>

        {/* Step 1: Enter Original Wallet Address */}
        <div className="rounded-lg border border-white/8 bg-black/20 p-4 space-y-3">
          <label className="text-sm text-text-muted flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Original Chain Wallet Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={originalWalletAddress}
              onChange={(e) => setOriginalWalletAddress(e.target.value)}
              placeholder="0x... (Ethereum) or terra... (Terra)"
              className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white/30 transition-colors"
            />
            <button
              onClick={verifyWalletAddress}
              disabled={isLoading || !originalWalletAddress.trim()}
              className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-text-muted">
            Enter the address that held tokens on the original chain during the snapshot
          </p>
        </div>

        {/* Verification Result */}
        {verificationResult && (
          <div className={`rounded-lg p-4 border ${
            verificationResult.verified 
              ? "bg-green-500/10 border-green-500/30" 
              : "bg-red-500/10 border-red-500/30"
          }`}>
            <div className="flex items-start gap-3">
              {verificationResult.verified ? (
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  verificationResult.verified ? "text-green-300" : "text-red-300"
                }`}>
                  {verificationResult.verified ? "Address Verified!" : "Verification Failed"}
                </p>
                {verificationResult.verified && verificationResult.amount && (
                  <p className="text-sm text-text-secondary mt-1">
                    You can claim <span className="text-text-primary font-semibold">{verificationResult.amount}</span> tokens
                  </p>
                )}
                {!verificationResult.verified && verificationResult.error && (
                  <p className="text-sm text-text-secondary mt-1">
                    {verificationResult.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Claim amount display */}
        {verificationResult?.verified && (
          <div className="rounded-lg border border-white/8 bg-gradient-to-br from-white/2 to-transparent p-4 shadow-sm">
            <div className="text-sm text-text-muted mb-1">Claim Amount</div>
            <div className="text-2xl font-bold text-text-primary">
              {verificationResult.amount}
              <span className="text-lg text-text-secondary ml-2">tokens</span>
            </div>
          </div>
        )}

        {/* Status indicator */}
        {isLoading && claimStep !== "verifying" && (
          <div className="rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-surface-light/30 p-3 space-y-2 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin text-lg">⚙️</div>
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
                          ? "bg-green-500"
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
              You have already claimed your tokens!
            </p>
          </div>
        )}

        {/* Claim button */}
        <button
          onClick={handleClaimTokens}
          disabled={isLoading || !publicKey || !verificationResult?.verified || hasUserClaimed === true}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 border ${
            isLoading || !publicKey || !verificationResult?.verified || hasUserClaimed === true
              ? "border-white/10 bg-white/10 text-text-muted cursor-not-allowed"
              : "border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500/20 hover:border-green-500/70 active:scale-95"
          }`}
        >
          {isLoading
            ? `${claimStep.toUpperCase()}...`
            : !publicKey
              ? "Connect Solana Wallet First"
              : !verificationResult?.verified
                ? "Verify Address to Continue"
                : hasUserClaimed
                  ? "Already Claimed"
                  : "Claim Tokens"}
        </button>

        {/* Security note */}
        <p className="text-xs text-text-secondary text-center">
          Trustless merkle-proof based claims powered by
          <br />
          Anchor program verification on Solana
        </p>
      </div>
    </div>
  );
}
