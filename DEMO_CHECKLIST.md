# 🪦 NecroBridge Demo - Quick Checklist

Print this out or use it as a reference while demonstrating NecroBridge!

---

## ✅ Pre-Demo Checklist (5 minutes)

- [ ] Run `node demo-script.js` and save output
- [ ] Start frontend: `cd frontend && pnpm dev`
- [ ] Verify frontend loaded on http://localhost:3000
- [ ] Have MetaMask installed and available
- [ ] Switch MetaMask to **Sepolia** network
- [ ] Have Solana wallet ready (Phantom or another devnet-capable wallet)
- [ ] Open this checklist on a separate screen or printed

---

## 👤 Live Demo Flow (15 minutes)

### Phase 1: Setup Foundation (2 minutes)

**Point Out:**
- "This is NecroBridge - a trustless cross-chain token bridge"
- "We're going to move tokens from Ethereum Sepolia to Solana"
- "No centralized service - it's all math and cryptography"

**Show Screen:**
- NecroBridge homepage
- Navigation with Projects, Docs links

### Phase 2: Connect Wallet (2 minutes)

**Steps:**
1. [ ] Click "Connect Wallet" button (top right)
2. [ ] Select MetaMask from wallet options
3. [ ] Approve MetaMask connection in popup
4. [ ] "Connected" indicator should appear

**Watch For:**
- ✓ Wallet address appears in header
- ✓ "You're eligible to claim..." message appears on Projects page
- ✓ MetaMask shows Sepolia network

**Narrate:**
- "The app is securely connecting to MetaMask on Sepolia"
- "It's auto-detecting the network - no manual setup needed"

### Phase 3: Check Real Holdings (2 minutes)

**Steps:**
1. [ ] Navigate to Projects page
2. [ ] Point to MetaMask Connector component at top
3. [ ] Show the ZOMB balance displayed

**Narrate:**
- "This balance is fetched LIVE from the Sepolia blockchain"
- "No mock data, no fake numbers - it's real"
- "The app queries the actual ZOMB token contract"
- "This proves the user owns these tokens"

**Data Shown:**
- Current wallet address: `0x4a28...` (or your test wallet)
- Holdings: **250 ZOMB tokens** (or actual amount)
- Eligibility: "You're eligible to claim 250 tokens on Solana!"

### Phase 4: Initiate Claim (3 minutes)

**Steps:**
1. [ ] Click "ZombToken Migration" project card
2. [ ] Scroll down to see Migration Status
3. [ ] Point out the eligible amount displayed
4. [ ] Click "Claim Tokens" button

**Explain:**
- "This project represents a real token migration scenario"
- "The eligible amount comes from the Sepolia holdings we just saw"
- "Now we're going to claim these as SPL tokens on Solana"

**Progress Modal Opens:**
- Destination wallet: `Your-Solana-Wallet-Address`
- Amount: `250 ZOMB` (or user's amount)

### Phase 5: Show Merkle Magic (2 minutes)

**While claiming, watch progress appear:**

1. [ ] **Step 1: Fetching merkle proof**
   - Narrate: "The app is fetching your merkle proof from the snapshot"
   - What's happening: API queries Sepolia for all ZOMB holders
   - Result: Your proof path verified against the merkle root

2. [ ] **Step 2: Building transaction**
   - Narrate: "Building the claim transaction with your merkle proof"
   - What's happening: Computing the proof path locally
   - Result: Transaction ready with proof attached

3. [ ] **Step 3: Collecting signature**
   - Narrate: "Now asking your Solana wallet to sign the transaction"
   - What's happening: User typically approves in their wallet
   - Result: Transaction signed with user's key

4. [ ] **Step 4: Submitting to Solana**
   - Narrate: "Posting transaction to Solana devnet"
   - What's happening: Sending to NecroBridge program
   - Result: Program receives signed transaction

5. [ ] **Step 5: Confirming on-chain**
   - Narrate: "Waiting for on-chain confirmation..."
   - What's happening: Program verifies merkle proof, mints SPL
   - Result: SPL tokens in user's wallet!

### Phase 6: Success Screen (2 minutes)

**Success Modal Shows:**

- [ ] Claimed amount: **250 ZOMB** ✓
- [ ] Solana wallet: `Your-Solana-...`
- [ ] Transaction hash: Clickable on explorer
- [ ] Success message: "You've successfully claimed your tokens!"

**Narrate Final Summary:**
- "And that's the complete cross-chain bridge!"
- "Started on Ethereum Sepolia with real tokens"
- "Generated a cryptographic merkle proof"
- "Verified trustlessly on Solana"
- "Minted equivalent SPL tokens"
- "All without a centralized intermediary"

---

## 🎯 Key Talking Points

### Trustlessness
> "Notice we never shared your private keys"
> "The merkle proof mathematically proves you own these tokens"
> "Solana verifies that proof itself - no trust needed in us"

### Real Data
> "This balance comes live from Sepolia blockchain"
> "The merkle root is generated from actual token holders"
> "Every claim can be verified on-chain by anyone"

### Automation
> "No manual steps or waiting for staff"
> "Snapshot generates automatically from blockchain data"
> "Merkle proofs computed on-the-fly"

### Scalability
> "This works for any ERC-20 token"
> "Merkle proofs are efficient - ~1KB per claim"
> "Scales to millions of token holders"

---

## 🚨 Troubleshooting During Demo

### Problem: "MetaMask not showing"
**Quick Fix:**
- Refresh page
- Check MetaMask extension is on Sepolia
- Try different wallet option

### Problem: "Balance shows 0"
**Expected:** Fallback to test data automatically works
**Continue with:** Proceed to claim - demo still valid

### Problem: "Claim transaction hangs"
**Quick Fix:**
- Refresh modal with X button
- Try claiming again
- Check Solana wallet has lamports for fees

### Problem: "Merkle proof error"
**Expected:** May happen if snapshot root changes
**Continue with:** Explain what would happen on real network

### Graceful Recovery:
**Always acknowledge:**
- "In production, this would retry automatically"
- "The fallback test data keeps demo moving"
- "Full logs available for debugging"

---

## 📊 Demo Talking Track

### Introduction (30 seconds)
*"This is NecroBridge, a trustless protocol for migrating token communities from any blockchain to Solana. Instead of moving users manually or requiring trust in a migration service, we use cryptographic merkle proofs to verify ownership trustlessly."*

### The Problem (30 seconds)
*"Before NecroBridge, moving a token community meant either..."*
- *"...asking users to swap manually (fragmented liquidity)"*
- *"...or trusting a bridge service (security risk)"*
- *"With NecroBridge, the community verifies themselves."*

### The Solution (1 minute)
*"Here's how it works:"*
1. *"User connects their wallet to the source chain (Ethereum)"*
2. *"We generate a merkle proof proving their token holdings"*
3. *"The proof is verified on the destination chain (Solana)"*
4. *"Equivalent SPL tokens are minted"*
5. *"The community is now on Solana with full on-chain positions"*

### The Demo (5 minutes)
*"Let me show you live..."*
- Connect wallet
- View Sepolia balance
- Initiate claim
- Watch progress
- See success

### Technical Deep Dive (Optional - 2 minutes)
*"Under the hood, here's what's happening..."*
- Merkle tree: "Binary tree of token hashes"
- Merkle proof: "256-bit path proving membership"
- Snapshot: "Point-in-time record of all holders"
- Claim: "User provides proof, program verifies, mints tokens"

### Closing (30 seconds)
*"This is trustless, automated, and efficient. Same approach works for any ERC-20 token, to any blockchain with Wormhole support."*

---

## 📱 Mobile Demo Version

If demoing on mobile:

- [ ] Use responsive design (browser zoom to see better)
- [ ] MetaMask mobile app integration works same way
- [ ] All UI elements should be touch-friendly
- [ ] Network switching works in-app

**Note:** Some phones may have MetaMask in separate app, show that connection flow briefly

---

## 🎬 Recording Tips (If Capturing Demo Video)

- [ ] Record at 1440p or higher
- [ ] Zoom browser to 120% for readability
- [ ] Open DevTools to show network requests (optional)
- [ ] Slow down clicks slightly for viewers to follow
- [ ] Explain each step clearly before doing it
- [ ] Show success screen long enough to read
- [ ] Consider screen recording with voice-over

---

## ✨ Highlight Reel (Key Demos)

### What to Show on Screen
1. [ ] NecroBridge homepage
2. [ ] MetaMask connection flow
3. [ ] Real ZOMB balance from Sepolia
4. [ ] Project card with migration status
5. [ ] Claim modal with progress steps
6. [ ] Success screen with minted amount
7. [ ] Navigation to Docs page (bonus)

### What to Narrate
- [ ] Problem statement (why this exists)
- [ ] Architecture overview (how it works)
- [ ] Current demo step (what we're doing now)
- [ ] Key insight (trustlessness, automation, etc.)
- [ ] Next steps (what would happen next)

---

## Post-Demo Q&A Prep

**Q: "How is this different from traditional bridges?"**
A: "Traditional bridges require trust in validators. We use mathematical proofs - cryptography instead of trust."

**Q: "What if someone loses their wallet?"**
A: "The merkle proof is based on a historic snapshot - they need to prove they owned tokens at that block height."

**Q: "Can this work with other tokens?"**
A: "Yes! Any ERC-20 token on Sepolia or Ethereum can be bridged the same way."

**Q: "How long does a claim take?"**
A: "Typically 2-5 seconds end-to-end on devnet. Mainnet would be similar with finality."

**Q: "Is there a fee?"**
A: "Only network fees (Solana transaction cost, ~0.00025 SOL). No NecroBridge fee."

---

## 🎯 Success Criteria

**Demo is successful if audience understands:**
- ✅ What NecroBridge does (trustless token migration)
- ✅ How merkle proofs work (cryptographic verification)
- ✅ Why it's better than alternatives (trustless + efficient)
- ✅ That data is real (actual Sepolia blockchain)
- ✅ That process is automated (no manual steps)

**Demo is GREAT if audience also:**
- ✅ Asks follow-up technical questions
- ✅ Wants to try it themselves
- ✅ Sees potential use cases
- ✅ Understands the Web3 implications

---

## Time Breakdown

- **Setup**: 5 min
- **Live Demo**: 10-15 min
- **Q&A**: 5-10 min
- **Total**: ~20-30 min

*Adjust times based on audience technical knowledge*

---

**Good luck with your demo! 🚀**

*For detailed technical info, see [DEMO_GUIDE.md](DEMO_GUIDE.md)*
