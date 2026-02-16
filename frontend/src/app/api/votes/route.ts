import { NextRequest, NextResponse } from 'next/server';
import { Connection } from '@solana/web3.js';
import { HELIUS_RPC } from '@/lib/config';
import {
  initializeApp,
  getApps,
} from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  increment,
  writeBatch,
} from 'firebase/firestore';

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

// Initialize Firebase for server
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

// Initialize Solana connection
const connection = new Connection(HELIUS_RPC, 'confirmed');

/**
 * POST /api/votes
 * Submit a vote on a project
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      projectId,
      direction,
      power,
      transactionSignature,
      timestamp,
    } = body;

    // Validate required fields
    if (!walletAddress || !projectId || !direction || power === undefined || !transactionSignature) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate direction
    if (!['yes', 'no'].includes(direction)) {
      return NextResponse.json(
        { success: false, message: 'Invalid vote direction. Must be "yes" or "no"' },
        { status: 400 }
      );
    }

    // Validate power
    if (typeof power !== 'number' || power <= 0) {
      return NextResponse.json(
        { success: false, message: 'Vote power must be a positive number' },
        { status: 400 }
      );
    }

    // Check if wallet already voted on this project
    const userVoteRef = doc(db, 'userVotes', `${walletAddress}_${projectId}`);
    const userVoteSnap = await getDoc(userVoteRef);

    if (userVoteSnap.exists()) {
      return NextResponse.json(
        { success: false, message: 'Wallet has already voted on this project' },
        { status: 409 }
      );
    }

    // Validate transaction signature format (base58)
    // In production, you would verify the signature is actually on-chain
    // For devnet testing, we accept any valid-looking signature
    if (!transactionSignature || transactionSignature.length < 20) {
      return NextResponse.json(
        { success: false, message: 'Invalid transaction signature' },
        { status: 400 }
      );
    }

    // Attempt to verify transaction on-chain, but don't fail if it's not confirmed yet
    try {
      const confirmationStatus = await connection.getSignatureStatus(transactionSignature);
      
      // Log for debugging
      console.log(`Transaction ${transactionSignature.slice(0, 10)}... status:`, {
        value: confirmationStatus.value ? 'Found' : 'Not found',
        err: confirmationStatus.value?.err ? 'Has error' : 'No error',
      });

      // If transaction has an error, reject it
      if (confirmationStatus.value?.err) {
        console.error('Transaction failed on chain:', confirmationStatus.value.err);
        return NextResponse.json(
          { success: false, message: 'Transaction failed on chain' },
          { status: 400 }
        );
      }
      // Note: We allow votes even if confirmationStatus.value is null (transaction in mempool)
    } catch (error) {
      // Log but don't fail - transaction might just not be indexed yet
      console.warn('Could not verify transaction on chain:', error instanceof Error ? error.message : String(error));
      // Allow vote to proceed - signature is from wallet, liability on user
    }

    // Create vote record
    const voteId = `VOTE_${walletAddress}_${projectId}_${Date.now()}`;
    const voteData = {
      id: voteId,
      walletAddress,
      projectId,
      direction,
      power,
      transactionSignature,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Use batch write for atomic operations
    const batch = writeBatch(db);

    // Store vote in votes collection
    const voteRef = doc(db, 'votes', voteId);
    batch.set(voteRef, voteData);

    // Track user vote
    batch.set(userVoteRef, {
      walletAddress,
      projectId,
      direction,
      power,
      timestamp: timestamp || new Date().toISOString(),
      voteId,
    });

    // Update vote tally
    const tallyRef = doc(db, 'voteTallies', projectId);
    const tallySnap = await getDoc(tallyRef);

    if (!tallySnap.exists()) {
      // First vote for this project
      batch.set(tallyRef, {
        projectId,
        yes: direction === 'yes' ? power : 0,
        no: direction === 'no' ? power : 0,
        total: power,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      // Update existing tally
      batch.update(tallyRef, {
        [direction === 'yes' ? 'yes' : 'no']: increment(power),
        total: increment(power),
        lastUpdated: new Date().toISOString(),
      });
    }

    // Commit batch
    await batch.commit();

    // Get updated tally
    const updatedTallySnap = await getDoc(tallyRef);
    const updatedTally = updatedTallySnap.data();

    return NextResponse.json(
      {
        success: true,
        voteId,
        message: `Vote recorded successfully for ${direction}`,
        tally: updatedTally,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting vote:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error details:', {
      errorMsg,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    });
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to submit vote: ${errorMsg}`,
        error: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/votes
 * Get vote tallies or check if wallet has voted
 * Query params:
 * - projectId: Get vote tally for specific project
 * - walletAddress: Check if wallet has voted (combined with projectId)
 * - checkVote: "true" if checking user vote
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const walletAddress = searchParams.get('walletAddress');
    const checkVote = searchParams.get('checkVote');

    // Check if wallet has voted on specific project
    if (checkVote === 'true' && walletAddress && projectId) {
      const userVoteRef = doc(db, 'userVotes', `${walletAddress}_${projectId}`);
      const userVoteSnap = await getDoc(userVoteRef);

      if (!userVoteSnap.exists()) {
        return NextResponse.json({
          success: true,
          hasVoted: false,
          vote: null,
        });
      }

      return NextResponse.json({
        success: true,
        hasVoted: true,
        vote: userVoteSnap.data(),
      });
    }

    // Get vote tally for a project
    if (projectId) {
      const tallyRef = doc(db, 'voteTallies', projectId);
      const tallySnap = await getDoc(tallyRef);

      if (!tallySnap.exists()) {
        return NextResponse.json({
          success: true,
          projectId,
          votes: {
            yes: 0,
            no: 0,
            total: 0,
          },
        });
      }

      const tally = tallySnap.data();
      // Query votes for this project to get count
      const votesQuery = query(
        collection(db, 'votes'),
        where('projectId', '==', projectId)
      );
      const votesSnap = await getDocs(votesQuery);

      return NextResponse.json({
        success: true,
        projectId,
        votes: {
          yes: tally.yes || 0,
          no: tally.no || 0,
          total: tally.total || 0,
        },
        voteCount: votesSnap.size,
      });
    }

    // Get all vote tallies
    const talliesRef = collection(db, 'voteTallies');
    const talliesSnap = await getDocs(talliesRef);

    const allTallies: Record<string, any> = {};
    talliesSnap.forEach((doc) => {
      allTallies[doc.id] = doc.data();
    });

    return NextResponse.json({
      success: true,
      data: allTallies,
    });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch votes' },
      { status: 500 }
    );
  }
}
