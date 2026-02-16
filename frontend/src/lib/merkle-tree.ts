import { MerkleTree } from "merkletreejs";
import { keccak256 } from "ethers";
import { PublicKey } from "@solana/web3.js";

export interface ClaimConfig {
  address: string;
  amount: string;
}

/**
 * Generate merkle tree and proofs for token claims
 * Used in conjunction with the Anchor program's claim_tokens instruction
 */
export class MerkleTreeGenerator {
  private tree: MerkleTree;
  private leafMap: Map<string, number>;

  constructor(claims: ClaimConfig[]) {
    const leaves = claims.map((claim, index) => {
      const leaf = this.hashLeaf(claim.address, claim.amount, index);
      return leaf;
    });

    this.tree = new MerkleTree(leaves, keccak256, { hashLeaves: false });
    this.leafMap = new Map(claims.map((claim, index) => [claim.address, index]));
  }

  private hashLeaf(address: string, amount: string, leafIndex: number): Buffer {
    const addressBuffer = Buffer.from(address.replace("0x", ""), "hex");
    const amountBuffer = Buffer.from(
      BigInt(amount).toString(16).padStart(64, "0"),
      "hex"
    );
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32LE(leafIndex);

    const hash = keccak256(Buffer.concat([addressBuffer, amountBuffer, indexBuffer]));
    return Buffer.from(hash.replace("0x", ""), "hex");
  }

  /**
   * Get merkle root (to be stored in Migration account)
   */
  getRoot(): string {
    return "0x" + this.tree.getRoot().toString("hex");
  }

  /**
   * Get proof for a specific address
   */
  getProof(address: string): string[] {
    const leafIndex = this.leafMap.get(address);
    if (leafIndex === undefined) {
      throw new Error(`Address ${address} not found in claims`);
    }

    const leaf = this.tree.getLeaves()[leafIndex];
    const proof = this.tree.getProof(leaf);

    return proof.map((p: any) => "0x" + p.data.toString("hex"));
  }

  /**
   * Get leaf index for proof verification
   */
  getLeafIndex(address: string): number {
    const index = this.leafMap.get(address);
    if (index === undefined) {
      throw new Error(`Address ${address} not found in claims`);
    }
    return index;
  }

  /**
   * Verify a proof for a given address and amount
   */
  verifyProof(
    address: string,
    amount: string,
    proof: string[]
  ): boolean {
    const leafIndex = this.leafMap.get(address);
    if (leafIndex === undefined) {
      return false;
    }

    const leaf = this.hashLeaf(address, amount, leafIndex);
    const proofBuffers = proof.map((p) => Buffer.from(p.replace("0x", ""), "hex"));

    return this.tree.verify(proofBuffers, leaf, this.tree.getRoot());
  }

  /**
   * Generate snapshot file (JSON) for distribution
   */
  generateSnapshot(): {
    root: string;
    claims: Record<string, { amount: string; index: number; proof: string[] }>;
  } {
    const snapshot: Record<
      string,
      { amount: string; index: number; proof: string[] }
    > = {};

    for (const [address, index] of this.leafMap.entries()) {
      snapshot[address] = {
        amount: "0", // Amount should be populated from claims data
        index,
        proof: this.getProof(address),
      };
    }

    return {
      root: this.getRoot(),
      claims: snapshot,
    };
  }
}

/**
 * Utility to generate Solana-compatible merkle proofs
 * (Using SHA256 hash instead of keccak256)
 */
export class SolanaMerkleTreeGenerator {
  private tree: MerkleTree;
  private leafMap: Map<string, number>;
  private claims: ClaimConfig[];

  constructor(claims: ClaimConfig[]) {
    this.claims = claims;

    const leaves = claims.map((claim, index) => {
      const leaf = this.hashLeaf(claim.address, claim.amount, index);
      return leaf;
    });

    // Use SHA256 for Solana compatibility
    this.tree = new MerkleTree(leaves, (data: any) => {
      return require("crypto").createHash("sha256").update(data).digest();
    });
    this.leafMap = new Map(claims.map((claim, index) => [claim.address, index]));
  }

  private hashLeaf(address: string, amount: string, leafIndex: number): Buffer {
    // Parse Solana PublicKey
    const pubKey = new PublicKey(address);
    const addressBuffer = pubKey.toBuffer();
    const amountBuffer = Buffer.allocUnsafe(8);
    amountBuffer.writeBigUInt64LE(BigInt(amount));
    const indexBuffer = Buffer.allocUnsafe(4);
    indexBuffer.writeUInt32LE(leafIndex);

    return Buffer.concat([addressBuffer, amountBuffer, indexBuffer]);
  }

  getRoot(): Buffer {
    return this.tree.getRoot();
  }

  getRootHex(): string {
    return this.tree.getRoot().toString("hex");
  }

  getProof(address: string): Buffer[] {
    const leafIndex = this.leafMap.get(address);
    if (leafIndex === undefined) {
      throw new Error(`Address ${address} not found in claims`);
    }

    const leaf = this.tree.getLeaves()[leafIndex];
    const proof = this.tree.getProof(leaf);

    return proof.map((p: any) => p.data);
  }

  getProofAsHex(address: string): string[] {
    return this.getProof(address).map((p) => "0x" + p.toString("hex"));
  }

  getLeafIndex(address: string): number {
    const index = this.leafMap.get(address);
    if (index === undefined) {
      throw new Error(`Address ${address} not found in claims`);
    }
    return index;
  }

  generateSnapshot(): {
    root: string;
    claims: Record<
      string,
      { amount: string; index: number; proof: string[] }
    >;
  } {
    const snapshot: Record<
      string,
      { amount: string; index: number; proof: string[] }
    > = {};

    for (const [address, index] of this.leafMap.entries()) {
      const claim = this.claims[index];
      snapshot[address] = {
        amount: claim.amount,
        index,
        proof: this.getProofAsHex(address),
      };
    }

    return {
      root: this.getRootHex(),
      claims: snapshot,
    };
  }
}
