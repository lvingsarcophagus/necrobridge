import { NextRequest, NextResponse } from "next/server";
import {
  initializeApp,
  getApps,
} from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
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
 * POST /api/migrations/initialize
 * Initialize a migration on the Anchor program
 * 
 * Request body:
 * {
 *   projectId: string,
 *   name: string,
 *   sourceChain: number (chain ID),
 *   sourceAddress: string,
 *   snapshotRoot: string (merkle root),
 *   totalSupply: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      name,
      sourceChain,
      sourceAddress,
      snapshotRoot,
      totalSupply,
    } = body;

    // Validate request
    if (!projectId || !name || !sourceChain || !sourceAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get Firestore reference
    // Store migration initialization data
    await setDoc(doc(db, "migrations", projectId), {
      name,
      sourceChain,
      sourceAddress,
      snapshotRoot: snapshotRoot || "",
      totalSupply: totalSupply || "0",
      status: "initializing",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // In production, you would:
    // 1. Sign the initialize_migration instruction with admin wallet
    // 2. Submit to Solana blockchain
    // 3. Update migration status to "active"

    return NextResponse.json(
      {
        projectId,
        message: "Migration initialization submitted",
        status: "pending",
        // In production, return transaction signature
        // txSignature: "...",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Migration initialization error:", error);
    return NextResponse.json(
      { error: "Failed to initialize migration" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrations/initialize?projectId=XXX
 * Get migration initialization status
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

    const db = getFirestore(firebaseApp);
    const migrationDoc = await getDoc(doc(db, "migrations", projectId));

    if (!migrationDoc.exists()) {
      return NextResponse.json(
        { error: "Migration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(migrationDoc.data(), { status: 200 });
  } catch (error) {
    console.error("Migration retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve migration" },
      { status: 500 }
    );
  }
}
