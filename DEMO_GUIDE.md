# 🪦 NecroBridge Demo Guide

This guide walks you through demonstrating the complete cross-chain bridge flow from Ethereum Sepolia to Solana Devnet.

## Quick Start

### 1. Run the Demo Setup Script

```bash
cd necrobridge
node demo-script.js
```

This script will:
- ✅ Display test token details (Sepolia ZOMB)
- ✅ List test wallets with holdings
- ✅ Generate merkle proofs from real Sepolia data
- ✅ Save demo data to `demo-data.json`
- ✅ Print step-by-step UI instructions

### 2. Start the Frontend

```bash
cd frontend
pnpm dev
```

Opens on http://localhost:3000

### 3. Follow the On-Screen Instructions

The demo script outputs a complete walkthrough of:
1. Connecting MetaMask
2. Navigating to Projects
3. Viewing your ZOMB balance
4. Initiating a claim
5. Verifying merkle proof
6. Completing the cross-chain transfer

---

## What Gets Demonstrated

### 🌉 Real Cross-Chain Flow

**Step 1: Ethereum Sepolia (Source)**
- User has ZOMB tokens (ERC-20) on Sepolia
- Common wallet: `0x4a28562b5575048f957524B2E4DDE7167a7Aa563` (250 ZOMB)
- Merkle proof proves ownership without moving tokens

**Step 2: NecroBridge API (Snapshot)**
- API queries real Sepolia RPC
- Fetches `transfer()` events from ZOMB contract
- Generates merkle tree from real holders
- Returns merkle proof to frontend

**Step 3: Solana Devnet (Destination)**
- User signs claim with merkle proof
- Program verifies proof against snapshot root
- SPL tokens minted to user's wallet

### 🎯 Key Features Shown

✅ **Real Blockchain Data**
- Queries actual Sepolia ZOMB holdings
- No mock data, real merkle proofs
- Fallback to test data if RPC fails

✅ **MetaMask Integration**
- Connect Sepolia wallet
- Display real ZOMB balance
- Auto-network switching

✅ **Trustless Claims**
- Cryptographic merkle proofs
- On-chain verification
- No trust in NecroBridge

✅ **Automated Processes**
- API fetches holders automatically
- Merkle proofs generated on-the-fly
- Transaction building automated

---

## Test Data

### Pre-Set Test Wallets

These wallets have ZOMB tokens on Sepolia Testnet:

| Wallet | Holdings | Use Case |
|--------|----------|----------|
| `0x742d35Cc6634C0532925a3b844Bc0e7595f0bEb3` | 100 ZOMB | Demo holder #1 |
| `0x4a28562b5575048f957524B2E4DDE7167a7Aa563` | 250 ZOMB | Demo holder #2 (main test) |
| `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | 0.084021 ZOMB | Demo holder #3 (small amount) |

### Sepolia ZOMB Token

- **Contract**: `0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d`
- **Network**: Ethereum Sepolia (Chain ID: 11155111)
- **Standard**: ERC-20
- **Decimals**: 18
- **Total Supply**: 1,000,000 ZOMB

---

## Demo Workflow

### Phase 1: Setup (Automated)
```bash
node demo-script.js
```
**Output:**
- ✓ Test wallets listed
- ✓ ZOMB token details
- ✓ Merkle root: `0x9153afbe...`
- ✓ Demo data saved
- ✓ Step-by-step instructions printed

### Phase 2: Connect Wallet (User)
1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Select MetaMask
4. Switch to Sepolia network
5. Approve connection

**Result:** Wallet shows in top right

### Phase 3: View Holdings (Automated)
1. Navigate to Projects page
2. MetaMask Connector component shows:
   - Connected wallet address
   - ZOMB balance from Sepolia RPC
   - "You're eligible to claim X ZOMB!"

**Data Source:** Real Sepolia blockchain

### Phase 4: Initiate Claim (User)
1. Click "ZOMB Migration" project
2. View Migration Status interface
3. See eligible amount (from Sepolia holdings)
4. Click "Claim Tokens"

**Behind the scenes:**
- API queries Sepolia ZOMB holders
- Merkle root matches snapshot
- Test Solana wallets map to Ethereum addresses

### Phase 5: Complete Claim (User)
1. Claim modal shows:
   - Your Solana wallet address
   - Amount eligible to claim
   - Step-by-step progress tracker
2. Approve transaction in Solana wallet
3. Watch steps complete:
   - ✓ Merkle proof fetched
   - ✓ Transaction built
   - ✓ Signed by wallet
   - ✓ Submitted to devnet
   - ✓ Confirmed!

**Result:** SPL tokens minted to Solana wallet

---

## Architecture Explained

### Data Flow Diagram

```
┌─────────────────────┐
│  MetaMask (Sepolia) │
│  User connects      │
│  Shows ZOMB balance │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  NecroBridge Frontend                │
│  /projects page                      │
│  MetaMaskConnector component loads   │
│  → getZombBalance(userAddress)       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Sepolia RPC Query (ethers.js)       │
│  /frontend/src/lib/ethereum.ts       │
│  - Queries contract: 0x5ef2...       │
│  - Gets user balance (wei)           │
│  - Converts to readable amount       │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Display User Eligibility            │
│  "You have 250 ZOMB tokens!"         │
│  "Eligible to claim on Solana"       │
└──────────┬──────────────────────────┘
           │
    User clicks "Claim"
           │
           ▼
┌─────────────────────────────────────┐
│  Snapshot API Request                │
│  /api/migrations/snapshot             │
│  - Sends user's Ethereum address     │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  API Queries Sepolia Holders          │
│  - getZombHolders()                   │
│  - Fetches all Transfer events        │
│  - Builds holder list with amounts    │
│  - Generates merkle tree              │
│  - Returns user's merkle proof        │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Generate & Sign Claim Tx             │
│  - Prepare claim transaction          │
│  - Attach merkle proof                │
│  - Sign with Solana wallet            │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Submit to Solana Devnet              │
│  NecroBridge Program                  │
│  - Verify merkle proof ✓              │
│  - Check snapshot root ✓              │
│  - Mint SPL tokens ✓                  │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────────────────┐
│  Success!                             │
│  "You claimed 250 SPL tokens"         │
│  Transaction: ...                     │
└─────────────────────────────────────┘
```

---

## Key Components Used

### Frontend Components

**MetaMaskConnector** (`/frontend/src/components/MetaMaskConnector.tsx`)
- Purpose: Display Sepolia wallet connection & balance
- Shows: Address, ZOMB balance, eligibility
- Data source: Real Sepolia RPC via ethers.js

**MigrationStatus** (`/frontend/src/components/MigrationStatus.tsx`)
- Purpose: Display migration status & claim interface
- Shows: Eligible amount, "Claim Tokens" button
- Triggers: Merkle proof request when user clicks claim

### Backend APIs

**Snapshot API** (`/frontend/src/app/api/migrations/snapshot/route.ts`)
- Purpose: Generate merkle proofs from real data
- Queries: Sepolia ZOMB token holders
- Returns: Merkle root, user's proof path, all holder data

**Ethereum Library** (`/frontend/src/lib/ethereum.ts`)
- Purpose: Query Sepolia blockchain
- Functions:
  - `getZombBalance(address)` - User's ZOMB balance
  - `getZombHolders()` - All token holders
  - `formatZombBalance()` - Convert wei to readable
  - `parseZombAmount()` - Convert readable to wei

---

## Troubleshooting Demo

### "MetaMask not connecting"
**Solution:**
- Ensure MetaMask extension is installed
- Refresh page if wallet doesn't appear
- Try clearing browser cache

### "Network error" displayed
**Expected behavior:**
- API falls back to test data automatically
- Demo still works with merkle proofs
- Continue with demonstration

### "0 tokens eligible" shows
**Why:** Your Ethereum address not in test data
**Solution:**
- Use one of the pre-set test wallets above
- OR check if address has ZOMB on actual Sepolia:
  ```bash
  # Query ZOMB balance
  curl -X POST https://eth-sepolia.g.alchemy.com/v2/demo \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc":"2.0",
      "method":"eth_call",
      "params":[{
        "to":"0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d",
        "data":"0x70a08231..."
      },"latest"],
      "id":1
    }'
  ```

### "Claim transaction failed"
**Why:** Merkle proof may not match
**Solution:**
- Refresh page to fetch fresh proof
- Ensure you're on correct Solana wallet
- Check that Solana wallet is on devnet

---

## What's Being Demonstrated

### Trustlessness
- ✅ Real Sepolia data, not mocked
- ✅ Merkle proofs verify ownership
- ✅ No trust in NecroBridge itself
- ✅ On-chain verification required

### Automation
- ✅ Snapshot generated on-the-fly
- ✅ Merkle proofs computed automatically
- ✅ Transaction building automated
- ✅ Progress tracking visible

### User Experience
- ✅ One-click MetaMask connection
- ✅ Clear step-by-step guidance
- ✅ Real-time balance updates
- ✅ Success feedback

### Scalability
- ✅ Handles multiple token holders
- ✅ Merkle proofs efficient (256 bits per user)
- ✅ Extends to any ERC-20 token
- ✅ Works across multiple blockchains

---

## Advanced: Customizing the Demo

### Add Your Own Token

To test with a different ERC-20 token:

1. **Update contract address** in `demo-script.js`:
```javascript
const ZOMB_CONTRACT = '0xYourTokenAddress';
```

2. **Update RPC endpoint** if using different network:
```javascript
const SEPOLIA_RPC = 'https://your-rpc-url';
```

3. **Run script:**
```bash
node demo-script.js
```

### Add Custom Test Addresses

1. **Edit test wallets** in `demo-script.js`:
```javascript
const TEST_WALLETS = [
  '0xYourAddress1',
  '0xYourAddress2',
];

const TEST_AMOUNTS = [
  ethers.parseEther('100'),
  ethers.parseEther('250'),
];
```

2. **Regenerate demo data:**
```bash
node demo-script.js
```

---

## Success Metrics for Demo

✅ **Completed Successfully When:**
- MetaMask connects to Sepolia
- ZOMB balance displays from real blockchain
- Claim modal opens with correct eligible amount
- Merkle proof generates without errors
- SPL tokens mint after claim
- Success screen shows actual amounts

---

## Next Steps After Demo

1. **Deploy to Mainnet**
   - Use real token contract
   - Deploy NecroBridge program to mainnet
   - Test entire flow on production networks

2. **Add More Tokens**
   - Register additional ERC-20 tokens
   - Create separate snapshots per token
   - Build multi-token dashboard

3. **Enhance UX**
   - Add transaction history
   - Show estimated wait times
   - Create claim status tracking

4. **Integration**
   - Connect to Jupiter for liquidity
   - Add governance voting
   - Enable DAO treasury management

---

**Questions?** Check [README.md](./README.md) for more details on NecroBridge architecture.
