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
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
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
 * POST /api/nominations
 * Submit a new nomination
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      walletAddress,
      projectName,
      ticker,
      sourceChain,
      contractAddress,
      reason,
      website,
      transactionSignature,
      timestamp,
    } = body;

    // Validate required fields
    if (!walletAddress || !projectName || !ticker || !sourceChain || !contractAddress || !reason || !transactionSignature) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
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
      // Note: We allow nominations even if confirmationStatus.value is null (transaction in mempool)
    } catch (error) {
      // Log but don't fail - transaction might just not be indexed yet
      console.warn('Could not verify transaction on chain:', error instanceof Error ? error.message : String(error));
      // Allow nomination to proceed - signature is from wallet, liability on user
    }

    // Create nomination record with unique ID
    const nominationId = `NOMINATION_${ticker}_${Date.now()}`;
    const nominationData = {
      id: nominationId,
      walletAddress,
      projectName,
      ticker,
      sourceChain,
      contractAddress,
      reason,
      website: website || null,
      transactionSignature,
      timestamp: timestamp || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      voteCount: 0,
      status: 'pending', // pending, approved, rejected
    };

    // Store nomination in Firestore
    const nominationRef = doc(db, 'nominations', nominationId);
    await setDoc(nominationRef, nominationData);

    return NextResponse.json(
      {
        success: true,
        nominationId,
        message: `Nomination for ${projectName} submitted successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting nomination:', error);
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('Error details:', {
      errorMsg,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
    });
    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to submit nomination: ${errorMsg}`,
        error: process.env.NODE_ENV === 'development' ? errorMsg : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/nominations
 * Fetch nominations by projectId, ticker, or get all nominations
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const ticker = searchParams.get('ticker');

    // If specific project ID requested
    if (projectId) {
      const nominationRef = doc(db, 'nominations', projectId);
      const nominationSnap = await getDoc(nominationRef);

      if (!nominationSnap.exists()) {
        return NextResponse.json(
          { success: false, message: 'Nomination not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: nominationSnap.data() });
    }

    // If ticker requested, query nominations by ticker
    if (ticker) {
      const q = query(
        collection(db, 'nominations'),
        where('ticker', '==', ticker.toUpperCase())
      );
      const nominationsSnap = await getDocs(q);

      const nominations: any[] = [];
      nominationsSnap.forEach((doc) => {
        nominations.push(doc.data());
      });

      return NextResponse.json({ success: true, data: nominations });
    }

    // Return all nominations
    const nominationsRef = collection(db, 'nominations');
    const nominationsSnap = await getDocs(nominationsRef);

    const allNominations: any[] = [];
    nominationsSnap.forEach((doc) => {
      allNominations.push(doc.data());
    });

    return NextResponse.json({ success: true, data: allNominations });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch nominations' },
      { status: 500 }
    );
  }
}
