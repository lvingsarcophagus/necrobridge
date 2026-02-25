"use client";

import { useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSolana } from "@/hooks/useSolana";
import { createNominationTransaction, submitNomination } from "@/lib/nominations";

const CHAINS = [
  { value: "", label: "Select source chain" },
  { value: "ethereum", label: "Ethereum" },
  { value: "bsc", label: "BNB Chain (BSC)" },
  { value: "polygon", label: "Polygon" },
  { value: "avalanche", label: "Avalanche" },
  { value: "fantom", label: "Fantom" },
  { value: "terra", label: "Terra" },
  { value: "arbitrum", label: "Arbitrum" },
  { value: "optimism", label: "Optimism" },
];

export default function NominatePage() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useSolana();

  const [form, setForm] = useState({
    projectName: "",
    ticker: "",
    sourceChain: "",
    contractAddress: "",
    reason: "",
    website: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionHash, setSubmissionHash] = useState("");
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!publicKey) {
      setError("Please connect your wallet to submit a nomination.");
      return;
    }

    if (!form.projectName || !form.ticker || !form.sourceChain || !form.contractAddress || !form.reason) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(form.contractAddress) && !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(form.contractAddress)) {
      setError("Invalid contract address format.");
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      // Create nomination transaction
      const tx = await createNominationTransaction(connection, publicKey);

      // Sign and send transaction
      try {
        const signature = await sendTransaction(tx, connection);

        // Wait for confirmation
        const latestBlockHash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: signature,
        });

        // Submit nomination with signature
        const result = await submitNomination(publicKey.toString(), form, signature);

        if (result.success) {
          setSubmissionHash(signature);
          setSubmitted(true);
        } else {
          setError(result.message || "Failed to submit nomination");
        }
      } catch (txError) {
        console.error("Transaction error:", txError);
        const errorMsg = txError instanceof Error ? txError.message : "Transaction failed";
        setError(`Transaction failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Nomination error:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to submit nomination. Please try again.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="glass rounded-2xl p-10">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-bold mb-3">
            Nomination Submitted!
          </h1>
          <p className="text-text-secondary mb-4">
            <strong>{form.projectName}</strong> (${form.ticker}) has been
            submitted for community review. Voting will begin once the
            nomination is validated.
          </p>
          <div className="mb-6 p-3 rounded-lg bg-surface-lighter border border-surface-border">
            <p className="text-xs text-text-muted mb-1.5">Transaction Hash</p>
            <p className="text-sm font-mono text-primary break-all">{submissionHash}</p>
            <a
              href={`https://solscan.io/tx/${submissionHash}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-2 inline-block"
            >
              View on Solscan →
            </a>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/projects"
              className="px-5 py-2.5 rounded-lg bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 font-semibold text-sm transition-colors"
            >
              View All Projects
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setForm({
                  projectName: "",
                  ticker: "",
                  sourceChain: "",
                  contractAddress: "",
                  reason: "",
                  website: "",
                });
              }}
              className="px-5 py-2.5 rounded-lg border border-surface-border text-text-secondary hover:text-text-primary text-sm transition-colors"
            >
              Nominate Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">
          Nominate a Project
        </h1>
        <p className="text-text-secondary">
          Submit a dead or defunct crypto project for community consideration.
          If enough votes are received, migration to Solana begins.
        </p>
      </div>

      <form data-testid="nominate-form" onSubmit={handleSubmit} className="space-y-6">
        {/* Wallet Connection Status */}
        <div className="glass rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${publicKey ? 'bg-success' : 'bg-warning'}`}></div>
            <div>
              <p className="text-sm font-medium">{publicKey ? 'Wallet Connected' : 'Wallet Not Connected'}</p>
              <p className="text-xs text-text-muted">{publicKey ? publicKey.toString().slice(0, 8) + '...' : 'Connect wallet to submit'}</p>
            </div>
          </div>
          {!publicKey && (
            <p className="text-xs text-warning">Required to nominate</p>
          )}
        </div>

        <div className="glass rounded-xl p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Project Details</h2>

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Project Name <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.projectName}
              onChange={(e) => update("projectName", e.target.value)}
              placeholder="e.g. Terra Luna Classic"
              className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
            />
          </div>

          {/* Ticker */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Token Ticker <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.ticker}
              onChange={(e) => update("ticker", e.target.value.toUpperCase())}
              placeholder="e.g. LUNC"
              maxLength={10}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 font-mono"
            />
          </div>

          {/* Source Chain */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Source Chain <span className="text-danger">*</span>
            </label>
            <select
              value={form.sourceChain}
              onChange={(e) => update("sourceChain", e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary focus:outline-none focus:border-primary/40 cursor-pointer"
            >
              {CHAINS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Address */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Contract Address <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={form.contractAddress}
              onChange={(e) => update("contractAddress", e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 font-mono"
            />
          </div>

          {/* Website (optional) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Project Website <span className="text-text-muted">(optional)</span>
            </label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40"
            />
          </div>
        </div>

        {/* Reason */}
        <div className="glass rounded-xl p-6">
          <label className="block text-sm font-medium text-text-secondary mb-1.5">
            Reason for Nomination <span className="text-danger">*</span>
          </label>
          <textarea
            value={form.reason}
            onChange={(e) => update("reason", e.target.value)}
            placeholder="Why should this project be migrated to Solana? Describe the state of the protocol, remaining holders, and potential value..."
            rows={5}
            className="w-full px-4 py-2.5 rounded-lg bg-surface-lighter border border-surface-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/40 resize-none"
          />
          <p className="text-xs text-text-muted mt-1.5">
            {form.reason.length}/500 characters
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-lg bg-white/10 border border-white/20 text-text-primary hover:bg-white/15 hover:border-white/30 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting Nomination...
            </>
          ) : (
            "Submit Nomination"
          )}
        </button>
      </form>
    </div>
  );
}
