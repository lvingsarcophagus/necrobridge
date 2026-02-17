'use client';

import { useState } from 'react';
import { getZombBalance, formatZombBalance } from '@/lib/ethereum';
import { ethers } from 'ethers';

export function MetaMaskConnector() {
  const [ethAddress, setEthAddress] = useState<string | null>(null);
  const [zombBalance, setZombBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectMetaMask = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('❌ MetaMask not installed. Please install MetaMask extension.');
      }

      // Request user permission to connect
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('❌ No accounts found in MetaMask');
      }

      const account = accounts[0];
      const checksumAddress = ethers.getAddress(account);
      
      console.log('✅ Connected to MetaMask:', checksumAddress);
      setEthAddress(checksumAddress);

      // Fetch ZOMB balance for this address
      await fetchZombBalance(checksumAddress);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ MetaMask connection error:', errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const fetchZombBalance = async (address: string) => {
    try {
      setLoading(true);
      const balance = await getZombBalance(address);
      const human = formatZombBalance(balance);
      setZombBalance(human);
      console.log(`✅ ZOMB balance fetched: ${human} ZOMB`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to fetch balance';
      console.error('❌ Balance fetch error:', errorMsg);
      setError(errorMsg);
      setZombBalance('0');
    } finally {
      setLoading(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      // Try to switch to Sepolia
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // Sepolia chain ID
      });
    } catch (err: any) {
      // If Sepolia isn't added, add it
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                rpcUrls: ['https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eac4d1d40a'],
                nativeCurrency: {
                  name: 'Sepolia ETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          console.error('❌ Failed to add Sepolia network:', addError);
        }
      }
    }
  };

  return (
    <div className="glass rounded-xl p-6 border border-accent/30 bg-gradient-to-br from-accent/10 to-primary/5 space-y-4">
      <h3 className="font-display text-lg font-semibold text-accent">
        🦊 Check Your ZOMB Holdings
      </h3>

      <p className="text-sm text-text-secondary">
        Connect MetaMask to see your ZOMB balance on Sepolia testnet. This proves your holdings for claiming on Solana.
      </p>

      {!ethAddress ? (
        <button
          onClick={connectMetaMask}
          disabled={loading}
          className="w-full px-4 py-3 rounded-lg bg-accent hover:bg-accent/90 text-surface font-semibold transition-all disabled:opacity-50"
        >
          {loading ? '⏳ Connecting...' : '🦊 Connect MetaMask'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-black/20 rounded-lg p-3 border border-accent/20">
            <p className="text-xs text-text-muted mb-1">Connected Address:</p>
            <p className="font-mono text-sm text-accent break-all">{ethAddress}</p>
          </div>

          <div className="bg-black/20 rounded-lg p-3 border border-success/20">
            <p className="text-xs text-text-muted mb-1">ZOMB Balance (Sepolia):</p>
            <p className="font-mono text-lg font-bold text-success">
              {zombBalance || '0'} ZOMB
            </p>
          </div>

          {parseInt(zombBalance || '0') > 0 && (
            <div className="bg-success/10 rounded-lg p-3 border border-success/30">
              <p className="text-sm text-success">
                ✅ You're eligible to claim {zombBalance} ZOMB on Solana!
              </p>
            </div>
          )}

          <button
            onClick={() => fetchZombBalance(ethAddress)}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-text-secondary font-semibold transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Refreshing...' : '🔄 Refresh Balance'}
          </button>

          <button
            onClick={switchToSepolia}
            className="w-full px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-text-secondary font-semibold transition-all text-xs"
          >
            🔀 Ensure on Sepolia Network
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-400">❌ {error}</p>
        </div>
      )}

      <div className="text-xs text-text-muted bg-white/5 rounded-lg p-3 space-y-1">
        <p>
          <strong>How it works:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Connect to verify your ZOMB holdings on Sepolia</li>
          <li>Amount is used to generate your Merkle proof</li>
          <li>Claim on Solana to receive SPL token</li>
        </ul>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
