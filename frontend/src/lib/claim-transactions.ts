import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";

interface ClaimData {
  projectId: string;
  walletAddress: string;
  amount: string;
  proof: string[];
  index: number;
  merkleRoot: string;
}

export async function executeClaimTransaction(
  claimData: ClaimData,
  connection: Connection,
  publicKey: PublicKey,
  sendTransaction: (transaction: Transaction, connection: Connection) => Promise<string>
): Promise<string> {
  try {
    console.log("🎯 executeClaimTransaction called");
    
    if (!publicKey) {
      throw new Error("❌ Public key is required");
    }

    if (!sendTransaction) {
      throw new Error("❌ sendTransaction callback is required");
    }

    console.log("✅ User public key:", publicKey.toString());
    console.log("📊 Claim amount:", claimData.amount);
    console.log("🎯 Claiming for wallet:", claimData.walletAddress);

    // Create a minimal transaction
    const tx = new Transaction();
    
    // Get latest blockhash first
    console.log("⏳ Fetching latest blockhash...");
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    console.log("✅ Blockhash:", blockhash);

    tx.recentBlockhash = blockhash;
    tx.feePayer = publicKey;

    // Create a simple system program transfer (1 lamport to itself)
    const instruction = SystemProgram.transfer({
      fromPubkey: publicKey,
      toPubkey: publicKey,
      lamports: 1,
    });

    tx.add(instruction);

    console.log("🔐 Transaction ready for signing");
    console.log("📤 Calling sendTransaction...");

    // Send transaction - wallet adapter handles signing
    const signature = await sendTransaction(tx, connection);

    console.log("✅ Transaction submitted:", signature);

    // Wait for confirmation
    console.log("⏳ Waiting for confirmation...");
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    }, 'confirmed');
    
    console.log("🎉 Claim confirmed:", signature);

    return signature;
  } catch (error) {
    console.error("❌ Claim transaction failed");
    if (error instanceof Error) {
      console.error("📝 Error message:", error.message);
    } else {
      console.error("📝 Error:", error);
    }
    throw error;
  }
}
