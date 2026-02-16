/**
 * Web3.js Compatibility Adapter + Wormhole NTT Integration
 * Boundary layer for legacy libraries and cross-chain bridging
 * Feb 14, 2026: Enhanced with Wormhole Sunrise/NTT support
 */

import { PublicKey, Connection, Transaction, Keypair, sendAndConfirmTransaction } from "@solana/web3.js";
import { createMint, createAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers";

type Address = string;

/**
 * Convert Address (kit) to PublicKey (web3.js)
 * Only use at legacy library boundaries
 */
export function addressToPublicKey(address: Address): PublicKey {
  return new PublicKey(address);
}

/**
 * Convert PublicKey (web3.js) to Address (kit)
 * Only use at legacy library boundaries
 */
export function publicKeyToAddress(pubkey: PublicKey): Address {
  return pubkey.toBase58() as Address;
}

/**
 * Merkle Tree utilities for proving token claims
 * Used to verify user balances at snapshot block
 */
export class MerkleProofGenerator {
  private tree: MerkleTree;
  private leaves: Buffer[];

  constructor(holdersSnapshot: Array<{ address: string; amount: bigint }>) {
    // Hash each holder's address + amount
    this.leaves = holdersSnapshot.map((holder) => {
      const combined = Buffer.concat([
        Buffer.from(holder.address.replace("0x", ""), "hex"),
        Buffer.from(holder.amount.toString(16).padStart(64, "0"), "hex"),
      ]);
      return keccak256(combined) as unknown as Buffer;
    });

    this.tree = new MerkleTree(this.leaves, keccak256 as any, { sort: true });
  }

  /**
   * Get merkle root (commitment to snapshot)
   */
  getRoot(): string {
    return "0x" + this.tree.getRoot().toString("hex");
  }

  /**
   * Generate proof for specific holder
   */
  getProof(address: string, amount: bigint): string[] {
    const combined = Buffer.concat([
      Buffer.from(address.replace("0x", ""), "hex"),
      Buffer.from(amount.toString(16).padStart(64, "0"), "hex"),
    ]);
    const leaf = keccak256(combined) as any;
    const proof = this.tree.getProof(leaf);
    return proof.map((p) => "0x" + p.data.toString("hex"));
  }

  /**
   * Verify a proof
   */
  verify(proof: string[], address: string, amount: bigint, root: string): boolean {
    const combined = Buffer.concat([
      Buffer.from(address.replace("0x", ""), "hex"),
      Buffer.from(amount.toString(16).padStart(64, "0"), "hex"),
    ]);
    const leaf = keccak256(combined) as any;
    const proofBuffers = proof.map((p) => Buffer.from(p.replace("0x", ""), "hex"));
    return this.tree.verify(proofBuffers, leaf, Buffer.from(root.replace("0x", ""), "hex"));
  }
}

/**
 * Wormhole NTT (Native Token Transfers) Integration
 * Handles creation of canonical SPL representation of tokens
 * and VAA (Verified Action Approval) verification
 */
export class WormholeNTTAdapter {
  private connection: Connection;

  constructor(rpcUrl: string) {
    this.connection = new Connection(rpcUrl, "confirmed");
  }

  /**
   * Step 1: Register a token with NTT (creates canonical SPL on Solana)
   * Call this after token migration is approved
   * Returns new SPL mint address
   */
  async registerTokenWithNTT(
    sourceChain: string, // "ethereum", "arbitrum", etc
    sourceTokenAddress: string, // Original token address on source chain
    decimals: number,
    payer: Keypair
  ): Promise<string> {
    console.log(`[NTT] Registering token from ${sourceChain}: ${sourceTokenAddress}`);

    // Step A: Create SPL Mint for canonical representation
    // In production, this would be done via Wormhole GenMsg from source chain
    // For hackathon demo: create mint directly
    const mint = await createMint(
      this.connection,
      payer,
      payer.publicKey, // Mint authority
      payer.publicKey, // Freeze authority
      decimals
    );

    console.log(`[NTT] Created canonical SPL mint: ${mint.toBase58()}`);

    // Step B: Store NTT metadata (in production, stored via Wormhole proof)
    const nttMetadata = {
      sourceChain,
      sourceToken: sourceTokenAddress,
      splMint: mint.toBase58(),
      registeredAt: new Date().toISOString(),
    };

    console.log("[NTT] Metadata:", nttMetadata);
    return mint.toBase58();
  }

  /**
   * Step 2: Generate VAA (Verified Action Approval) data
   * In production: obtained from Wormhole guardians
   * For hackathon: simulate with merkle proof
   */
  generateVAA(
    sourceChain: number, // 1=Solana, 2=Ethereum, 3=Terra, etc
    sequence: bigint,
    merkleRoot: string
  ): {
    vaaBytes: string;
    merkleRoot: string;
    sequence: bigint;
    timestamp: number;
  } {
    // Simulated VAA format for hackathon
    // In production: actual Wormhole signature from guardians
    const vaaBody = Buffer.concat([
      Buffer.from([sourceChain]), // Source chain
      Buffer.from(sequence.toString(16).padStart(16, "0"), "hex"), // Sequence
      Buffer.from(merkleRoot.replace("0x", ""), "hex"), // Merkle root
      Buffer.from(Math.floor(Date.now() / 1000).toString(16).padStart(8, "0"), "hex"), // Timestamp
    ]);

    return {
      vaaBytes: "0x" + vaaBody.toString("hex"),
      merkleRoot,
      sequence,
      timestamp: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Step 3: Verify VAA on-chain
   * Called before claim_tokens instruction
   * Returns true if VAA is valid for this migration
   */
  async verifyVAA(
    vaaBytes: string,
    merkleRoot: string,
    expectedSourceChain: number
  ): Promise<{
    valid: boolean;
    merkleRoot: string;
    sourceChain: number;
  }> {
    try {
      // Decode VAA
      const vaaHex = vaaBytes.replace("0x", "");
      const vaaBuffer = Buffer.from(vaaHex, "hex");

      if (vaaBuffer.length < 21) {
        throw new Error("Invalid VAA length");
      }

      const sourceChain = vaaBuffer[0];
      const receivedMerkleRoot = "0x" + vaaBuffer.slice(1, 33).toString("hex");

      const valid = sourceChain === expectedSourceChain && receivedMerkleRoot === merkleRoot;

      console.log(`[NTT] VAA Verification: ${valid ? "✓ VALID" : "✗ INVALID"}`);
      console.log(`  Source Chain: ${sourceChain} (expected ${expectedSourceChain})`);
      console.log(`  Merkle Root: ${receivedMerkleRoot}`);

      return {
        valid,
        merkleRoot: receivedMerkleRoot,
        sourceChain,
      };
    } catch (error) {
      console.error("[NTT] VAA verification failed:", error);
      return { valid: false, merkleRoot: "", sourceChain: 0 };
    }
  }

  /**
   * Step 4: Mint tokens to user after successful claim
   * Called after on-chain claim_tokens verification
   */
  async mintClaimedTokens(
    mint: PublicKey,
    recipient: PublicKey,
    amount: bigint,
    authority: Keypair
  ): Promise<string> {
    console.log(`[NTT] Minting ${amount} tokens to ${recipient.toBase58()}`);

    // Create or get recipient's token account
    const tokenAccount = await createAssociatedTokenAccount(
      this.connection,
      authority,
      mint,
      recipient
    );

    // Mint tokens
    const tx = await mintTo(this.connection, authority, mint, tokenAccount, authority.publicKey, amount);

    console.log(`[NTT] Minted! TX: ${tx}`);
    return tx;
  }

  /**
   * Utility: Fund a wallet with SOL for testing
   */
  async fundWallet(publicKey: PublicKey, lamports: number): Promise<string> {
    try {
      const connection = new Connection("https://api.devnet.solana.com", "confirmed");
      const tx = connection.requestAirdrop(publicKey, lamports);
      return tx.toString();
    } catch (error) {
      console.error("Airdrop failed:", error);
      throw error;
    }
  }
}

/**
 * Legacy Web3.js Adapter (compatibility layer)
 * Use for wrapping other libraries that depend on web3.js
 */
export class Web3CompatAdapter {
  private legacyConnection: Connection;

  constructor(rpcUrl: string) {
    this.legacyConnection = new Connection(rpcUrl, "confirmed");
  }

  async getAccountInfo(address: Address) {
    const pubkey = addressToPublicKey(address);
    const accountInfo = await this.legacyConnection.getAccountInfo(pubkey);
    return accountInfo;
  }

  async sendLegacyTransaction(tx: Transaction, signers: Keypair[]) {
    return await sendAndConfirmTransaction(this.legacyConnection, tx, signers);
  }
}

/**
 * DO NOT EXPORT PUBLICKEY OR CONNECTION DIRECTLY
 * Always use adapters or Address/Signer types from @solana/kit
 */