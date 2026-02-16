import { NextRequest, NextResponse } from "next/server";
import { SolanaMerkleTreeGenerator } from "@/lib/merkle-tree";

/**
 * POST /api/migrations/snapshot
 * Generate merkle tree snapshot for token claims
 * 
 * Request body:
 * {
 *   projectId: string,
 *   claims: [{ address: string, amount: string }, ...]
 * }
 * 
 * Response:
 * {
 *   root: string,
 *   claims: {
 *     [userAddress]: {
 *       amount: string,
 *       index: number,
 *       proof: string[]
 *     }
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, claims } = body;

    if (!projectId || !claims || !Array.isArray(claims)) {
      return NextResponse.json(
        { error: "Missing or invalid projectId or claims" },
        { status: 400 }
      );
    }

    // Validate claims format
    for (const claim of claims) {
      if (!claim.address || !claim.amount) {
        return NextResponse.json(
          { error: "Each claim must have address and amount" },
          { status: 400 }
        );
      }
    }

    // Generate merkle tree snapshot
    const generator = new SolanaMerkleTreeGenerator(claims);
    const snapshot = generator.generateSnapshot();

    return NextResponse.json(
      {
        projectId,
        root: snapshot.root,
        claims: snapshot.claims,
        generatedAt: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Snapshot generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate snapshot" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrations/snapshot?projectId=XXX
 * Retrieve a previously generated snapshot
 * In a real application, this would fetch from a database
 */
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    // In a real application, fetch from database
    // For demo, return a sample snapshot
    const sampleSnapshot = {
      projectId,
      root: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      claims: {
        "YOUR_SOLANA_ADDRESS_HERE": {
          amount: "84021000000000",
          index: 0,
          proof: [
            "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          ],
        },
      },
      retrievedAt: new Date().toISOString(),
    };

    return NextResponse.json(sampleSnapshot, { status: 200 });
  } catch (error) {
    console.error("Snapshot retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve snapshot" },
      { status: 500 }
    );
  }
}
