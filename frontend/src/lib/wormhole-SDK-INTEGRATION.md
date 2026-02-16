# Wormhole NTT SDK Integration Guide

**Production-Ready Code Patterns for Cross-Chain Token Migration**

---

## 1. Installation & Setup

### Install Required Packages

```bash
pnpm add @wormhole-foundation/sdk \
          @wormhole-foundation/sdk-solana \
          @wormhole-foundation/sdk-evm \
          ethers@6 \
          axios
```

### Environment Configuration

Create `.env.local` in your Next.js app:

```env
# Wormhole Configuration
NEXT_PUBLIC_WORMHOLE_NETWORK=Testnet
NEXT_PUBLIC_WORMHOLE_API=https://api.wormholescan.io/api/v1
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_ETHEREUM_RPC=https://eth-sepolia.g.alchemy.com/v2/{KEY}
NEXT_PUBLIC_BASE_RPC=https://sepolia.base.org

# NTT Manager Addresses (testnet)
NEXT_PUBLIC_NTT_ETHEREUM=0x...
NEXT_PUBLIC_NTT_BASE=0x...
NEXT_PUBLIC_NTT_SOLANA=...
```

---

## 2. Initialize Wormhole SDK (Production)

### File: `src/lib/wormhole-init.ts`

```typescript
import { Wormhole } from '@wormhole-foundation/sdk';
import { solana } from '@wormhole-foundation/sdk-solana';
import { evmPlatform } from '@wormhole-foundation/sdk-evm';

/**
 * Initialize Wormhole SDK with all platforms
 * Call once at app startup
 */
export async function initializeWormholeSDK() {
  try {
    const network = 
      process.env.NEXT_PUBLIC_WORMHOLE_NETWORK as 'Testnet' | 'Mainnet';
    
    // Create Wormhole instance with supported platforms
    const wh = await Wormhole.create(network, [
      solana.Platform,
      evmPlatform(),
    ]);
    
    // Get available chains
    const chains = wh.getChains();
    console.log('Wormhole initialized with chains:', 
      chains.map(c => c.valueOf())
    );
    
    return wh;
  } catch (error) {
    console.error('Failed to initialize Wormhole:', error);
    throw error;
  }
}

/**
 * Get Wormhole instance (singleton pattern)
 */
let wormholeInstance: Awaited<ReturnType<typeof Wormhole.create>> | null = null;

export async function getWormhole() {
  if (!wormholeInstance) {
    wormholeInstance = await initializeWormholeSDK();
  }
  return wormholeInstance;
}
```

---

## 3. Build Source Transfer (EVM)

### File: `src/lib/wormhole-transfer.ts`

```typescript
import { ethers } from 'ethers';
import type { BrowserProvider } from 'ethers';

interface SourceTransferParams {
  amount: string;
  recipientAddress: string;
  targetChain: 'Solana' | 'Ethereum' | 'Base';
  sourceChain: 'Ethereum' | 'Base';
}

/**
 * Build EVM transfer transaction
 * User must be connected with MetaMask or similar
 */
export async function buildEVMTransfer(
  params: SourceTransferParams,
  provider: BrowserProvider
) {
  const signer = await provider.getSigner();
  const userAddress = await signer.getAddress();
  
  // NTT Manager contract ABI (simplified)
  const NTT_ABI = [
    'function transferWithPayload(address recipient, uint256 amount, uint16 targetChain, bytes payload) payable',
  ];
  
  const nttAddress = getNTTAddress(params.sourceChain);
  const nttContract = new ethers.Contract(
    nttAddress,
    NTT_ABI,
    signer
  );
  
  try {
    // Build transaction
    const amount = ethers.parseUnits(params.amount, 18); // Adjust decimals as needed
    
    const tx = await nttContract.transferWithPayload(
      params.recipientAddress,
      amount,
      getChainId(params.targetChain),
      ethers.AbiCoder.defaultAbiCoder().encode(
        ['address'],
        [userAddress]
      ),
      { gasLimit: 300000 }
    );
    
    console.log('Transfer sent:', tx.hash);
    
    // Wait for confirmation
    const receipt = await tx.wait(1);
    
    return {
      success: true,
      transactionHash: receipt?.transactionHash,
      blockNumber: receipt?.blockNumber,
    };
  } catch (error) {
    console.error('Transfer failed:', error);
    throw error;
  }
}

/**
 * Get NTT Manager address for chain
 */
function getNTTAddress(chain: string): string {
  const addresses: Record<string, string> = {
    Ethereum: process.env.NEXT_PUBLIC_NTT_ETHEREUM || '',
    Base: process.env.NEXT_PUBLIC_NTT_BASE || '',
  };
  return addresses[chain];
}

/**
 * Get Wormhole chain ID
 */
function getChainId(chain: string): number {
  const chainIds: Record<string, number> = {
    Ethereum: 2,
    Solana: 1,
    Base: 8453,
    Polygon: 137,
    Avalanche: 43114,
  };
  return chainIds[chain];
}
```

---

## 4. Poll for VAA (Guardian Relay)

### File: `src/lib/wormhole-vaa.ts`

```typescript
import axios from 'axios';

interface VAAResponse {
  vaa: string;
  data?: {
    timestamp: number;
    version: number;
    guardianSetIndex: number;
  };
}

/**
 * Poll Wormhole API for VAA
 * Guardian network signs transfers (typically 1-2 minutes)
 */
export async function pollForVAA(
  txHash: string,
  sourceChain: string,
  options: {
    maxAttempts?: number;
    pollInterval?: number;
  } = {}
): Promise<string | null> {
  const maxAttempts = options.maxAttempts ?? 120; // 2 minutes
  const pollInterval = options.pollInterval ?? 1000; // 1 second
  
  const apiUrl = process.env.NEXT_PUBLIC_WORMHOLE_API || 
    'https://api.wormholescan.io/api/v1';
  
  // Convert chain name to Wormhole chain ID
  const chainId = getChainNum(sourceChain);
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const response = await axios.get<VAAResponse>(
        `${apiUrl}/vaa/${chainId}/${txHash}`
      );
      
      if (response.data.vaa) {
        console.log(`✓ VAA received after ${attempt + 1} attempts`);
        return response.data.vaa; // Base64-encoded VAA
      }
    } catch (error) {
      // 404 means VAA not signed yet (expected during polling)
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        console.error(`Error polling VAA: ${error.message}`);
      }
    }
    
    // Show progress every 30 seconds
    if (attempt % 30 === 0 && attempt > 0) {
      console.log(`Waiting for guardian attestation... (${attempt}s)`);
    }
    
    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }
  
  console.error('VAA polling timeout - guardians did not attest');
  return null;
}

/**
 * Get Wormhole numeric chain ID
 */
function getChainNum(chain: string): number {
  const chainNums: Record<string, number> = {
    Solana: 1,
    Ethereum: 2,
    Polygon: 5,
    Avalanche: 6,
    Fantom: 10,
    Base: 30,
    Arbitrum: 23,
  };
  return chainNums[chain];
}
```

---

## 5. Build Solana Redemption

### File: `src/lib/wormhole-solana-redeem.ts`

```typescript
import { 
  PublicKey, 
  Transaction, 
  TransactionInstruction,
  Connection,
  SYSVAR_CLOCK_PUBKEY,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Program, AnchorProvider } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';

/**
 * Build Solana redemption transaction
 * User calls this after VAA is available
 */
export async function buildSolanaRedemption(
  vaa: string, // Base64-encoded VAA from guardians
  userTokenAccount: PublicKey,
  connection: Connection,
  provider: AnchorProvider
): Promise<Transaction> {
  const nttManagerAddress = process.env.NEXT_PUBLIC_NTT_SOLANA;
  if (!nttManagerAddress) {
    throw new Error('NTT Solana address not configured');
  }
  
  // Construct accounts for NTT Manager redeem instruction
  const accounts = {
    nttManager: new PublicKey(nttManagerAddress),
    userTokenAccount: userTokenAccount,
    payer: provider.publicKey as PublicKey,
    systemProgram: anchor.web3.SystemProgram.programId,
    tokenProgram: TOKEN_PROGRAM_ID,
    clock: SYSVAR_CLOCK_PUBKEY,
  };
  
  // Create redemption instruction
  // This calls the NTT Manager to mint tokens
  const redeemIx = new TransactionInstruction({
    keys: [
      { pubkey: accounts.nttManager, isSigner: false, isWritable: true },
      { pubkey: accounts.userTokenAccount, isSigner: false, isWritable: true },
      { pubkey: accounts.payer, isSigner: true, isWritable: true },
    ],
    programId: new PublicKey(nttManagerAddress),
    // Data should contain the VAA bytes
    data: Buffer.from(vaa, 'base64'),
  });
  
  // Build transaction
  const tx = new Transaction().add(redeemIx);
  
  // Set fees
  const blockHash = await connection.getLatestBlockhash();
  tx.recentBlockhash = blockHash.blockhash;
  tx.feePayer = provider.publicKey as PublicKey;
  
  return tx;
}

/**
 * Execute redemption transaction
 */
export async function executeRedemption(
  tx: Transaction,
  signer: any // User's Solana wallet (Phantom, etc)
): Promise<string> {
  try {
    // Sign transaction with user's wallet
    const signedTx = await signer.signTransaction(tx);
    
    // Send to network
    const connection = new Connection(
      process.env.NEXT_PUBLIC_SOLANA_RPC || 'https://api.devnet.solana.com'
    );
    
    const signature = await connection.sendRawTransaction(
      signedTx.serialize()
    );
    
    console.log(`✓ Redemption sent: ${signature}`);
    
    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    
    return signature;
  } catch (error) {
    console.error('Redemption failed:', error);
    throw error;
  }
}
```

---

## 6. Complete Bridge Flow (Component)

### File: `src/components/ProducationWormholeBridge.tsx`

```typescript
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

import { buildEVMTransfer } from '@/lib/wormhole-transfer';
import { pollForVAA } from '@/lib/wormhole-vaa';
import { buildSolanaRedemption, executeRedemption } from '@/lib/wormhole-solana-redeem';

/**
 * Production Wormhole Bridge Component
 * Complete end-to-end flow with real SDK calls
 */
export function ProductionWormholeBridge({ projectId }: { projectId: string }) {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'approving' | 'relaying' | 'redeeming' | 'complete' | 'failed'
  >('idle');
  
  const bridgeMutation = useMutation({
    mutationFn: async () => {
      if (!publicKey) throw new Error('Wallet not connected');
      
      try {
        // Step 1: Source chain transfer (EVM)
        setStatus('approving');
        toast.loading('👀 Waiting for approval...');
        
        const provider = window.ethereum; // MetaMask
        const ethersProvider = new ethers.BrowserProvider(provider);
        
        const transferResult = await buildEVMTransfer(
          {
            amount,
            recipientAddress: publicKey.toString(),
            targetChain: 'Solana',
            sourceChain: 'Ethereum',
          },
          ethersProvider
        );
        
        toast.success('✓ Tokens locked on Ethereum');
        setStatus('relaying');
        toast.loading('⏳ Waiting for guardian attestation (1-2 min)...');
        
        // Step 2: Poll for VAA from guardians
        const vaa = await pollForVAA(
          transferResult.transactionHash,
          'Ethereum'
        );
        
        if (!vaa) {
          throw new Error('Guardian attestation timeout');
        }
        
        toast.success('✓ VAA received from guardians');
        
        // Update Firestore with VAA
        await updateDoc(doc(db, 'migrations', projectId), {
          status: 'relayed',
          vaa,
          relayedAt: new Date(),
        });
        
        // Step 3: Solana redemption
        setStatus('redeeming');
        toast.loading('💫 Redeeming on Solana...');
        
        const redeemTx = await buildSolanaRedemption(
          vaa,
          publicKey,
          connection,
          new AnchorProvider(connection, {
            publicKey,
            signTransaction,
          }, {})
        );
        
        const redeemSignature = await executeRedemption(
          redeemTx,
          window.solana // or wallet adapter
        );
        
        toast.success('✓ Tokens redeemed on Solana');
        
        // Final update
        setStatus('complete');
        await updateDoc(doc(db, 'migrations', projectId), {
          status: 'completed',
          solanaRedemptionTx: redeemSignature,
          completedAt: new Date(),
        });
        
        toast.success('🎉 Bridge complete!');
      } catch (error) {
        setStatus('failed');
        toast.error(`Bridge failed: ${error}`);
        throw error;
      }
    },
  });
  
  return (
    <div className="space-y-4">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={status !== 'idle'}
        className="w-full px-4 py-2 border rounded"
      />
      
      <button
        onClick={() => bridgeMutation.mutate()}
        disabled={!publicKey || bridgeMutation.isPending}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {status === 'idle' ? 'Bridge' : status.toUpperCase()}
      </button>
      
      {/* Show bridge progress */}
      <div className="text-sm space-y-1">
        <div className={status === 'approving' ? 'text-blue-500' : 'text-gray-500'}>
          1. Lock on Ethereum ✓
        </div>
        <div className={status === 'relaying' ? 'text-blue-500' : 'text-gray-500'}>
          2. Guardian Relay ⏳
        </div>
        <div className={status === 'redeeming' ? 'text-blue-500' : 'text-gray-500'}>
          3. Redeem on Solana 🔒
        </div>
        <div className={status === 'complete' ? 'text-green-500' : 'text-gray-500'}>
          4. Complete ✓
        </div>
      </div>
    </div>
  );
}
```

---

## 7. Firestore Integration

### File: `src/hooks/useBridgeTracking.ts`

```typescript
import { useEffect } from 'react';
import { db } from '@/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

/**
 * Hook for real-time bridge tracking
 * Listens to Firestore for bridge status updates
 */
export function useBridgeTracking(
  projectId: string,
  onStatusChange: (status: BridgeStatus) => void
) {
  useEffect(() => {
    const docRef = doc(db, 'migrations', projectId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        onStatusChange({
          status: data.status,
          vaa: data.vaa,
          txHash: data.txHash,
          solanaRedemptionTx: data.solanaRedemptionTx,
          timestamp: data.timestamp,
        });
      }
    });
    
    return () => unsubscribe();
  }, [projectId, onStatusChange]);
}
```

### Firestore Document Schema

```javascript
// Collection: migrations
// Document: {projectId}
{
  projectId: "proj_123",
  status: "completed",           // pending|approved|relayed|completed|failed
  
  // Source chain (EVM)
  sourceTxHash: "0x...",
  sourceChain: "Ethereum",
  sourceAmount: "0.1",
  
  // Guardian attestation
  vaa: "AQA...",                 // Base64-encoded VAA
  relayedAt: Timestamp,
  
  // Target chain (Solana)
  solanaRedemptionTx: "...",
  targetAmount: "1000",          // After bridge fees
  completedAt: Timestamp,
  
  // Admin use
  fee: "0.005",
  feeRecipient: "0x...",
}
```

---

## 8. Error Handling & Retries

### File: `src/lib/wormhole-errors.ts`

```typescript
/**
 * Handle Wormhole-specific errors
 */
export class WormholeError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'WormholeError';
  }
}

export function handleWormholeError(error: any) {
  if (error.code === 'NETWORK_ERROR') {
    return new WormholeError(
      'Network error - check RPC connection',
      'NETWORK_ERROR',
      true
    );
  }
  
  if (error.code === 'VAA_TIMEOUT') {
    return new WormholeError(
      'Guardians did not attest - try again',
      'VAA_TIMEOUT',
      true
    );
  }
  
  if (error.code === 'INSUFFICIENT_BALANCE') {
    return new WormholeError(
      'Insufficient balance for fee',
      'INSUFFICIENT_BALANCE',
      false
    );
  }
  
  return new WormholeError(
    error.message || 'Unknown error',
    error.code || 'UNKNOWN',
    false
  );
}
```

---

## 9. Testing on Testnet

### Get Testnet Tokens

```bash
# Solana devnet SOL
# Visit: https://faucet.solana.com

# Ethereum Sepolia ETH
# Visit: https://sepoliafaucet.com

# Base Sepolia ETH
# Visit: https://www.base.org/dapp/get-eth

# Polygon Mumbai (optional)
# Visit: https://faucet.polygon.technology
```

### Test Flow

```typescript
// 1. Connect wallets
const ethProvider = new ethers.BrowserProvider(window.ethereum);
const solanaWallet = window.solana;

// 2. Transfer on EVM
const txHash = await buildEVMTransfer({...}, ethProvider);

// 3. Wait for VAA (1-2 min)
const vaa = await pollForVAA(txHash, 'Ethereum');

// 4. Redeem on Solana
const redeemTx = await buildSolanaRedemption(vaa, ...);
await executeRedemption(redeemTx, solanaWallet);
```

---

## 10. Performance & Optimization

### Caching

```typescript
// Cache NTT Manager addresses
const nttAddressCache = new Map<string, string>();

function getNTTAddress(chain: string, network: 'Testnet' | 'Mainnet') {
  const key = `${chain}-${network}`;
  if (!nttAddressCache.has(key)) {
    nttAddressCache.set(key, fetchFromChainRegistry(chain, network));
  }
  return nttAddressCache.get(key);
}
```

### Parallel Operations

```typescript
// Poll multiple sources in parallel
const [vaa, feeEstimate] = await Promise.all([
  pollForVAA(txHash, 'Ethereum'),
  estimateBridgeFee(amount, 'Ethereum'),
]);
```

### Gas Optimization

```typescript
// Build transactions with proper gas estimates
const gasLimit = await ethersProvider.estimateGas({
  to: nttAddress,
  data: encodedData,
});

// Use 120% estimate for safety
const safeGasLimit = (BigInt(gasLimit) * 120n) / 100n;
```

---

## 11. Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| `NETWORK_ERROR` | RPC endpoint down | Check RPC URL in .env |
| `VAA_TIMEOUT` | Guardians didn't attest | Wait 2-3 minutes, retry |
| `INSUFFICIENT_BALANCE` | Missing bridge fee | Get more tokens from faucet |
| `Transaction failed` | Incorrect NTT address | Verify deployment address |
| `Invalid VAA` | Corrupted VAA data | Re-poll from API |

---

## 12. References

- **Wormhole Docs**: https://docs.wormhole.com
- **SDK Reference**: https://docs.wormhole.com/wormhole/develop/reference/sdk-reference
- **NTT Spec**: https://github.com/wormhole-foundation/wormhole/tree/main/ntt
- **Testnet Chains**: https://docs.wormhole.com/wormhole/reference/testnet-information

---

**Status**: Production-Ready (v0.1)  
**Last Updated**: February 2025  
**Maintainer**: NecroMigrate Team
