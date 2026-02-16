import { NextRequest, NextResponse } from "next/server";
import {
  initializeApp,
  getApps,
} from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

// Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyB0HDl04elhNy40L22kg0ewduoos93xZug',
  authDomain: 'necrobridge.firebaseapp.com',
  projectId: 'necrobridge',
  storageBucket: 'necrobridge.firebasestorage.app',
  messagingSenderId: '438477827413',
  appId: '1:438477827413:web:5850179775ef8a19c413dc',
  measurementId: 'G-7970F5M2JC',
};

const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(firebaseApp);

/**
 * POST /api/migrations/verify-claim
 * Verify a user's claim eligibility using merkle proof
 * 
 * Request body:
 * {
 *   projectId: string,
 *   userAddress: string,
 *   amount: string,
 *   proof: string[]
 * }
 * 
 * Response:
 * {
 *   eligible: boolean,
 *   amount: string,
 *   message: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, userAddress, amount, proof } = body;

    // Validate request
    if (!projectId || !userAddress || !amount || !proof) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get migration details including merkle root
    const migrationDoc = await getDoc(doc(db, "migrations", projectId));

    if (!migrationDoc.exists()) {
      return NextResponse.json(
        { error: "Migration not found", eligible: false },
        { status: 404 }
      );
    }

    const migrationData = migrationDoc.data();
    const snapshotRoot = migrationData?.snapshotRoot;

    if (!snapshotRoot) {
      return NextResponse.json(
        { error: "Snapshot root not found", eligible: false },
        { status: 500 }
      );
    }

    // TODO: In production, verify the merkle proof against the root
    // This would use the actual merkle tree verification logic
    // For now, we'll do a basic verification

    // Check if user has already claimed
    const claimDocRef = doc(db, "migrations", projectId, "claims", userAddress);
    const claimDoc = await getDoc(claimDocRef);

    if (claimDoc.exists()) {
      return NextResponse.json(
        {
          eligible: false,
          amount: "0",
          message: "User has already claimed tokens",
          alreadyClaimed: true,
        },
        { status: 200 }
      );
    }

    // If we get here, the claim is potentially valid
    // In production, verify merkle proof here
    const isValidProof = true; // TODO: Implement actual verification

    if (isValidProof) {
      // Record the claim in Firestore to prevent double-claiming
      await setDoc(claimDocRef, {
        amount,
        claimedAt: new Date(),
        status: "pending",
      });

      return NextResponse.json(
        {
          eligible: true,
          amount,
          message: "User is eligible to claim",
          verified: true,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          eligible: false,
          amount: "0",
          message: "Invalid merkle proof",
          verified: false,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Claim verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify claim", eligible: false },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrations/verify-claim?projectId=XXX&userAddress=YYY
 * Check if a user has claimed tokens
 */
export async function GET(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");
    const userAddress = request.nextUrl.searchParams.get("userAddress");

    if (!projectId || !userAddress) {
      return NextResponse.json(
        { error: "Missing projectId or userAddress parameter" },
        { status: 400 }
      );
    }

    const claimDocRef = doc(db, "migrations", projectId, "claims", userAddress);
    const claimDoc = await getDoc(claimDocRef);

    return NextResponse.json(
      {
        projectId,
        userAddress,
        claimed: claimDoc.exists(),
        data: claimDoc.exists() ? claimDoc.data() : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Claim check error:", error);
    return NextResponse.json(
      { error: "Failed to check claim status" },
      { status: 500 }
    );
  }
}
