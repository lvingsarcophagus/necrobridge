'use client';

import { useState } from 'react';
import { useToast } from '@/lib/toast-context';

interface CreateSPLTokenButtonProps {
  projectTicker: string;
}

export function CreateSPLTokenButton({ projectTicker }: CreateSPLTokenButtonProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { addToast } = useToast();

  const handleCreateToken = async () => {
    setIsCreating(true);

    try {
      // Simulate token creation process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock token mint address
      const mockMintAddress = '8YZvnZVLqvJfJ4D1MQD2QvqUfF7HnZ3s7T5P2K8nQ9oJ';

      // Update local state to mark token as created
      setIsComplete(true);

      addToast(
        `✅ ${projectTicker} SPL Token Created! Mint: ${mockMintAddress.slice(0, 12)}...`,
        'success'
      );

      // Auto-reset after 5 seconds
      setTimeout(() => {
        setIsComplete(false);
        setIsCreating(false);
      }, 5000);
    } catch (error) {
      addToast(
        'Failed to create SPL token. Please try again.',
        'error'
      );
      setIsCreating(false);
    }
  };

  return (
    <button
      onClick={handleCreateToken}
      disabled={isCreating || isComplete}
      className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
        isComplete
          ? 'bg-success/20 text-success border border-success/30'
          : isCreating
          ? 'bg-primary/20 text-primary border border-primary/30 opacity-75'
          : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 hover:shadow-lg hover:shadow-primary/20'
      }`}
    >
      {isComplete ? (
        <>
          <span>✅</span>
          <span>SPL Token Created</span>
        </>
      ) : isCreating ? (
        <>
          <span className="animate-spin">⏳</span>
          <span>Creating SPL Token...</span>
        </>
      ) : (
        <>
          <span>🪙</span>
          <span>Create SPL Token</span>
        </>
      )}
    </button>
  );
}
