# Wormhole Integration Testing Guide

**Date**: February 17, 2026  
**Status**: Option A (Connect Widget) + Option B (Custom SDK) Complete  
**Target**: Hackathon Sunrise Track ($7k bounty)  
**Timeline**: Feb 18-20 (testnet validation)

---

## 🎯 Testing Objectives

- ✅ Get testnet tokens flowing across chains
- ✅ Verify WormholeConnect widget works in-app
- ✅ Confirm Firestore updates on bridge events
- ✅ Test custom SDK flows (Option B)
- ✅ Capture screenshots/video for demo
- ✅ Validate end-to-end: nominate → vote → bridge → claim

---

## 📋 Pre-Testing Checklist

### Install Required Tools
```bash
# Phantom Wallet (browser extension)
# https://phantom.app/

# Solflare Wallet (alternative)
# https://solflare.com/

# MetaMask (for EVM chains)
# https://metamask.io/
```

### Get Testnet Tokens (Free!)

**Solana Devnet SOL** (for gas + voting):
```bash
# Open browser console & run:
fetch('https://faucet.solana.com/').then(r => r.json())

# OR use Phantom wallet's built-in faucet:
# Wallet → Settings → Use devnet
# (Usually 1 SOL arrives in 10-30 seconds)
```

**Ethereum Sepolia Tokens** (for bridge source):
```bash
# Sepolia Faucet: https://sepoliafaucet.com/
# (Get 0.5 Sepolia ETH - free, no limits)

# Alternative: https://www.alchemy.com/faucets/ethereum-sepolia
```

**Base Sepolia Tokens** (alternative EVM chain):
```bash
# Base Sepolia Faucet: https://www.coinbase.com/faucets/base-ethereum-testnet-faucet
# (Get free Base ETH on testnet)
```

### Check Wallet Balance
1. Open Phantom wallet
2. Switch to **Devnet** (⚙️ Settings → RPC endpoint → Devnet)
3. Verify SOL balance > 0.1 (enough for ~20 transactions)
4. Add **Ethereum** or **Base** network in MetaMask
5. Switch to **Sepolia testnet** or **Base Sepolia**
6. Get ~0.5 testnet ETH

---

## 🧪 Step-by-Step Testing Flow

### **Stage 1: Setup (5-10 minutes)**

#### 1.1 Start Dev Server
```bash
cd c:\Users\nayan\OneDrive\Desktop\NJ_PROJ_2026\necrobridge\frontend
pnpm dev
# Expected: ✓ Compiled in XXms
# URL: http://localhost:3000
```

#### 1.2 Open App
```
http://localhost:3000
```

#### 1.3 Connect Wallet
1. Click **"Connect Wallet"** (top-right)
2. Select **Phantom** (or Solflare)
3. Sign connection request
4. See wallet address appear in header
5. ✅ Connected!

---

### **Stage 2: Create an Approved Project (10 minutes)**

#### 2.1 Nominate a Token
1. Click **"Nominate"** in navbar
2. Fill form:
   - **Name**: "TestToken"
   - **Ticker**: "TEST"
   - **Source Chain**: "Ethereum" (or Base)
   - **Address**: Pick any ERC-20 (e.g., USDC contract address)
   - **Description**: "Test migration"
3. Click **"Submit Nomination"**
4. See toast: "✓ Nomination submitted!"
5. ✅ Project appears in leaderboard with 0 votes

#### 2.2 Vote to Reach 80% Approval
1. Go to **"Browse Projects"**
2. Find "TestToken" (probably at bottom)
3. Click it → **Project Detail** page
4. Scroll to **voting section** (VoteCard)
5. Enter **0.5** SOL
6. Click **"Vote YES"**
7. Sign transaction in Phantom
8. See toast: "🎃 New vote: +0.5 SOL for TestToken (100% YES)"
9. Check progress bar → Should show > 80%
10. ✅ Status changes to "APPROVED"

---

### **Stage 3: Test Wormhole Connect Widget (Option A) (15-20 minutes)**

#### 3.1 Scroll to TokenBridge Component
1. Stay on **TestToken project detail** page
2. Scroll down to **"Sunrise Migration UI"** section
3. Should see:
   ```
   🌉 Wormhole NTT Bridge (Sunrise)
   Bridge your tokens natively to Solana...
   ```
4. ✅ Widget exists!

#### 3.2 Connect MetaMask for EVM Side
1. Open **MetaMask** (window → extensions)
2. Switch to **Ethereum Sepolia** network
3. Verify balance: > 0.1 Sepolia ETH
4. Return to NecroBridge app

#### 3.3 Test WormholeConnect Widget Flow
1. In **TokenBridge component**, widget should appear
2. **If not appearing**, check:
   ```
   Browser console (F12) → check for errors
   Did wallet connect? (Check header shows address)
   Is page cached? (Hard refresh: Ctrl+Shift+R)
   ```
3. **When it appears**, try this flow:
   - **From Chain**: "Ethereum Sepolia" (or Base Sepolia)
   - **To Chain**: "Solana"
   - **Amount**: 0.01 (test amount)
   - Click bridge button
   - **MetaMask popup** should appear
   - **Sign approval transaction**
   - **Wait for relay** (~1-2 minutes)
   - Toast: "✓ VAA received from guardians"
   - Toast: "✓ Tokens bridged successfully!"
4. ✅ Bridge complete!

#### 3.4 Verify Firestore Update
1. Open **Firebase Console** (your Fire store)
2. Go to **Collections → migrations**
3. Find document for TestToken (projectId)
4. Check fields:
   ```json
   {
     "status": "migrating",
     "lastBridgeAt": "2026-02-17T...",
     "bridgeNetwork": "Ethereum"
   }
   ```
5. ✅ State synced!

---

### **Stage 4: Test Custom NTT SDK (Option B) (Optional, 15-20 min)**

#### 4.1 Create Test Page
Create file: `src/app/bridge-test/page.tsx`

```tsx
'use client';
import { AdvancedNTTBridge } from '@/components/AdvancedNTTBridge';

export default function BridgeTest() {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-8">
        🧪 Advanced NTT Bridge Test
      </h1>
      <AdvancedNTTBridge 
        projectId="test-token-123"
        sourceChain="Ethereum"
        tokenName="TestToken"
      />
    </div>
  );
}
```

#### 4.2 Test Advanced Flow
1. Visit: `http://localhost:3000/bridge-test`
2. Fill **transfer amount**: `1000` (TEST tokens)
3. Click **"Bridge TestToken"**
4. Watch **progress timeline**:
   - ✓ Approve tokens
   - ⏳ Burn on source chain
   - ⏳ Guardian relay
   - ⏳ Mint on Solana
   - ✓ Complete

#### 4.3 Monitor Real-Time Updates
1. Open **Firebase Console** in parallel window
2. Watch `migrations/test-token-123` update live:
   ```json
   {
     "bridgeStatus": "transferring",
     "transferTxHash": "0x...",
     "sourceAmount": "1000"
   }
   ```
3. See Firestore changes **within 5 seconds**
4. ✅ Real-time sync working!

---

### **Stage 5: Test Merkle Claim (Bonus)**

#### 5.1 Update Migration to "Completed"
1. **Firebase Console** → `migrations/test-token-123`
2. **Edit document** → Change `status` from "migrating" to "completed"
3. Click **Save**

#### 5.2 See Claim Component
1. Refresh **project detail page** (F5)
2. Scroll to **bottom** → Should see "Completed" section
3. New component: **"Claim Tokens from Anchor Program"**
4. Click it → Should show:
   - Claim ID / amount
   - "Generate Merkle Proof" button
   - Progress animation

#### 5.3 Generate Proof
1. Click **"Generate Merkle Proof"**
2. Watch animation: "Generating proof... 🔄"
3. See result: "Proof generated! ✓"
4. (Note: In production, would sign Anchor transaction here)
5. ✅ End-to-end flow works!

---

## 🐛 Troubleshooting

### Widget Not Appearing?

**Check 1: Is wallet connected?**
```
Header should show:
[0x1a2b...c3d4] ✓ Connected
```

**Check 2: Is project approved (80%+)?**
```
Browse Projects → Sort by "Approved"
Project should have "APPROVED" badge
```

**Check 3: Clear cache**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

**Check 4: Console errors**
```
F12 → Console tab
Look for red errors
Check if WormholeConnect is loading
```

**Fix**: If still not working:
```tsx
// In TokenBridge.tsx debug:
console.log('PublicKey:', publicKey);
console.log('WormholeConnect loaded:', typeof WormholeConnect);
```

---

### Bridge Transaction Failing?

**Symptom**: "Bridge transfer failed" toast

**Verify**:
1. ✅ Correct testnet (NOT mainnet)?
   - MetaMask: "Ethereum Sepolia" or "Base Sepolia"
   - Phantom: "Devnet"

2. ✅ Have testnet tokens?
   - MetaMask: 0.1+ Sepolia ETH
   - Phantom: 0.1+ Solana SOL

3. ✅ RPC working?
   ```bash
   # Test Helius RPC
   curl https://devnet.helius-rpc.com/
   # Should return 200 OK
   ```

**Fix**: Get fresh testnet tokens (faucets reset daily)

---

### Firestore Not Updating?

**Check 1**: Collection exists?
```
Firebase Console → Firestore → collections
Should see: migrations, votes, nominations, etc.
```

**Check 2**: Rules allow writes?
```
Firebase Console → Firestore → Rules tab
Should show: allow read, write (development)
```

**Check 3**: Initialize migration first
```bash
POST http://localhost:3000/api/migrations/initialize
{
  "projectId": "test-token-123",
  "name": "TestToken",
  "sourceChain": "Ethereum",
  "snapshotRoot": "0x0000...0001"
}
```

**Fix**: Create collection manually:
```
Firestore Console → + button → migrations
→ Add doc with projectId as ID
```

---

## 📊 Success Criteria Checklist

### ✅ Option A (WormholeConnect Widget)
- [ ] Widget appears on approved project
- [ ] Can connect wallet & see in header
- [ ] Select chains (Ethereum/Base → Solana)
- [ ] Bridge button clickable
- [ ] Phantom/MetaMask popup appears on bridge
- [ ] Toast shows bridge progress
- [ ] Firestore updates after bridge
- [ ] Can refresh & see new status persisted

### ✅ Option B (Custom NTT SDK)
- [ ] Advanced bridge page loads
- [ ] Transfer amount input works
- [ ] Bridge button shows loading state
- [ ] Progress timeline animates
- [ ] Status box shows TX hash + VAA
- [ ] Firestore updates in real-time

### ✅ End-to-End
- [ ] Nominate → Vote → 80% → Bridge → Firestore
- [ ] All steps trigger toasts
- [ ] No console errors
- [ ] Mobile view responsive (optional)

---

## 📸 Screenshots to Capture

For judges' demo deck:

1. **Landing page** - "How It Works" section visible
2. **Leaderboard** - Shows live voting results
3. **Project detail** - Shows APPROVED badge + voting progress
4. **TokenBridge** - WormholeConnect widget loaded
5. **Bridge in progress** - Toast notifications showing stages
6. **Claim section** - Shows merkle proof UI
7. **Firestore** - Shows migrations collection with updates

---

## 🎬 What to Record

**30-45 second video** of complete flow:
```
1. Navigate to TestToken project (5 sec)
2. Show voting results (3 sec)
3. Scroll to TokenBridge (3 sec)
4. Show bridge transaction in progress (10 sec)
5. Wait for completion toast (5 sec)
6. Show Firestore update (5 sec)
7. Navigate to claim section (5 sec)
```

**Tools**:
- OBS Studio (free) - https://obsproject.com/
- ScreenFlow (Mac) - Built-in
- ShareX (Windows) - Free

---

## Final Validation

```bash
# Before submitting, run:
pnpm build          # Test production build
# Should see: ✓ compiled successfully

# Check no errors:
pnpm lint           # TypeScript check
# Should see: No errors found
```

---

**Status**: Ready for Testnet Validation 🚀  
**Timeline**: 1-2 hours total testing  
**Expected Result**: Full bridge + claim flow working end-to-end

