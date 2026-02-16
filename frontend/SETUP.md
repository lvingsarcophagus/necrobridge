# Firebase Setup Guide

This guide walks you through setting up Firebase and Firestore for NecroBridge development.

## Step 1: Enable Anonymous Authentication

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select the **necrobridge** project
3. Navigate to **Authentication** (left sidebar)
4. Click on **Sign-in method** tab
5. Click on **Anonymous** provider
6. Toggle **Enable** to ON
7. Click **Save**

![Firebase Auth Setup](https://imgur.com/placeholder.png)

## Step 2: Update Firestore Security Rules

1. In Firebase Console, navigate to **Firestore Database** (left sidebar)
2. Click on **Rules** tab
3. Delete the default rules and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for development
    // In production, restrict to authenticated users or wallet-verified requests
    match /votes/{document=**} {
      allow read, write;
    }
    
    match /userVotes/{document=**} {
      allow read, write;
    }
    
    match /voteTallies/{document=**} {
      allow read, write;
    }
    
    match /nominations/{document=**} {
      allow read, write;
    }
  }
}
```

4. Click **Publish** 

> ⚠️ **IMPORTANT - Security Warning**: These development rules allow **anyone** to read and write all data without authentication. This is only for testing/development. 
> 
> **For production**, use these rules instead:
> ```javascript
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /votes/{document=**} {
>       allow read, write: if request.auth != null;
>     }
>     match /userVotes/{document=**} {
>       allow read, write: if request.auth != null;
>     }
>     match /voteTallies/{document=**} {
>       allow read, write: if request.auth != null;
>     }
>     match /nominations/{document=**} {
>       allow read, write: if request.auth != null;
>     }
>   }
> }
> ```

## Step 3: Verify Collections Are Created

When you first submit a vote or nomination, Firestore will automatically create:
- `votes/` - Individual vote records
- `userVotes/` - User vote tracking (prevents double-voting)
- `voteTallies/` - Aggregated vote counts
- `nominations/` - Nomination records

You can verify these in the Firebase Console → Firestore Database.

## Step 4: Get Devnet SOL

To test voting and nominations, you need devnet SOL:

1. Open [Solana Devnet Faucet](https://faucet.solana.com)
2. Paste your Solana wallet address (from Phantom/Solflare)
3. Click "Devnet" to request 2 SOL
4. Wait for confirmation

You can check your balance: `solana balance --url devnet`

## Step 5: Connect Your Wallet

1. Start the app: `pnpm run dev`
2. Open http://localhost:3000
3. Click "Select Wallet" in top-right
4. Choose Phantom or Solflare
5. Approve the connection in your wallet

## Troubleshooting

### "Missing or insufficient permissions" Error
- ✅ Use the **development rules** from Step 2 (without `if request.auth != null`)
- ✅ Make sure to **Publish** the rules after updating
- ✅ Wait a few seconds for rules to propagate
- ✅ Try refreshing the browser
- ✅ Check browser console (F12) for specific error messages

### Transaction fails to submit
- Ensure you have devnet SOL (minimum 0.005 SOL for fees)
- Check that your wallet is connected
- Verify Solana devnet RPC is reachable
- Check browser console for detailed error messages

### No vote data appears
- Check Firestore Console → Database for created collections
- Verify dev rules allow public read/write access
- Check browser DevTools → Network tab for API responses
- Look for errors in browser console

## Production Setup

For mainnet deployment:
1. Use [Web3Auth](https://web3auth.io) or similar for non-custodial auth
2. Implement stricter Firestore rules based on wallet signatures
3. Consider using Firebase Admin SDK on backend
4. Set up proper error logging and monitoring

## Support

For issues, check:
- [Firebase Docs](https://firebase.google.com/docs)
- [Solana Devnet Status](https://status.solana.com)
- Browser DevTools Console for error messages
