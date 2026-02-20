import { NextRequest, NextResponse } from "next/server";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  initializeApp,
  getApps,
} from "firebase/app";

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

let db: any = null;

try {
  if (getApps().length === 0) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  } else {
    db = getFirestore(getApps()[0]);
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

/**
 * POST /api/migrations/dao-lp
 * Initialize a DAO-controlled liquidity pool for a migration
 * 
 * MITIGATION: Addresses "Liquidity Fragmentation" risk
 * - Ensures day-2 liquidity by reserving tokens in DAO-controlled pool
 * - Prevents whales from dumping all tokens immediately
 * - Community can vote on LP deployment strategy
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      lpPercentage,
      daoTreasuryAddress,
      description,
    } = body;

    // Validate inputs
    if (!projectId || !lpPercentage || !daoTreasuryAddress) {
      return NextResponse.json(
        { error: "Missing required fields: projectId, lpPercentage, daoTreasuryAddress" },
        { status: 400 }
      );
    }

    if (lpPercentage < 1 || lpPercentage > 20) {
      return NextResponse.json(
        { error: "LP percentage must be between 1% and 20%" },
        { status: 400 }
      );
    }

    // Validate Solana address format
    if (!daoTreasuryAddress.match(/^[1-9A-HJ-NP-Z]{32,44}$/)) {
      return NextResponse.json(
        { error: "Invalid Solana address format" },
        { status: 400 }
      );
    }

    const lpConfigId = `DAO_LP_${projectId}`;
    const lpConfig = {
      id: lpConfigId,
      projectId,
      lpPercentage,
      daoTreasuryAddress,
      status: "PENDING_SETUP",
      description: description || "Community-controlled liquidity pool to ensure day-2 health",
      createdAt: new Date().toISOString(),
      reservedTokens: 0,
      poolAddress: null,
      poolCreatedAt: null,
      recommendation: `Reserve ${lpPercentage}% of new token supply (${lpPercentage}M tokens from 100M supply) in DAO-controlled Meteora Dynamic Vault or similar for sustainable liquidity.`,
    };

    // Store in Firestore
    const lpRef = doc(db, 'daoLiquidityPools', lpConfigId);
    await setDoc(lpRef, lpConfig);

    return NextResponse.json(
      {
        success: true,
        lpConfigId,
        lpConfig,
        message: `DAO Liquidity pool initialized for ${projectId}`,
        nextSteps: [
          `1. Community votes on pool parameters (spread, fees, duration)`,
          `2. DAO approves Meteora Dynamic Vault creation`,
          `3. Deploy LP contract with ${lpPercentage}% tokens`,
          `4. Lock LP tokens in DAO governance treasury`,
        ],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DAO LP initialization error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to initialize DAO LP: ${errorMsg}` },
      { status: 500 }
    );
  }
}

/**
 * GET /api/migrations/dao-lp?projectId=XXX
 * Get DAO LP configuration for a project
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

    const lpConfigId = `DAO_LP_${projectId}`;
    const lpRef = doc(db, 'daoLiquidityPools', lpConfigId);
    const lpSnap = await getDoc(lpRef);

    if (!lpSnap.exists()) {
      return NextResponse.json({
        success: true,
        projectId,
        daoLp: null,
        message: "No DAO LP configured for this project yet",
      });
    }

    const lpConfig = lpSnap.data();

    return NextResponse.json({
      success: true,
      projectId,
      daoLp: lpConfig,
      status: lpConfig.status,
      healthCheck: {
        hasReserveFund: lpConfig.status !== "PENDING_SETUP",
        percentageReserved: lpConfig.lpPercentage,
        recommendedAction: lpConfig.reservedTokens === 0 ? "INITIALIZE_POOL" : "MONITOR",
      },
    });
  } catch (error) {
    console.error("DAO LP retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve DAO LP configuration" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/migrations/dao-lp
 * Update DAO LP pool status (after on-chain deployment)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      poolAddress,
      status,
      reservedTokens,
    } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId" },
        { status: 400 }
      );
    }

    const lpConfigId = `DAO_LP_${projectId}`;
    const lpRef = doc(db, 'daoLiquidityPools', lpConfigId);

    const updateData: any = {
      status,
      lastUpdated: new Date().toISOString(),
    };

    if (poolAddress) {
      updateData.poolAddress = poolAddress;
      updateData.poolCreatedAt = new Date().toISOString();
    }

    if (reservedTokens !== undefined) {
      updateData.reservedTokens = reservedTokens;
    }

    await updateDoc(lpRef, updateData);

    return NextResponse.json({
      success: true,
      projectId,
      message: `DAO LP pool status updated to ${status}`,
    });
  } catch (error) {
    console.error("DAO LP update error:", error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Failed to update DAO LP: ${errorMsg}` },
      { status: 500 }
    );
  }
}
