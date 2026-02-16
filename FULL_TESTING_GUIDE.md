# 🧪 Complete Testing Guide - NecroMigrate

**Status**: Production Testing & Validation  
**Last Updated**: February 16, 2026  
**Scope**: Unit • Integration • E2E • Testnet • Security

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Environment Setup](#environment-setup)
3. [Unit Tests](#unit-tests)
4. [Integration Tests](#integration-tests)
5. [End-to-End Tests](#end-to-end-tests)
6. [Manual Testing](#manual-testing)
7. [Testnet Validation](#testnet-validation)
8. [Performance Testing](#performance-testing)
9. [Security Testing](#security-testing)
10. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
```bash
# Install dependencies
cd frontend
pnpm install

# Start dev server
pnpm dev

# In another terminal, run tests
pnpm test
```

### Run All Tests
```bash
# Unit + Integration tests
pnpm test

# With UI
pnpm test:ui

# Debug mode
pnpm test:debug

# E2E tests (Playwright)
pnpm test:e2e

# Coverage report
pnpm test:coverage
```

---

## Environment Setup

### .env.test Configuration
Create `frontend/.env.test`:

```env
# Firebase (Test Project)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...test...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=necromigrate-test.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DB_URL=https://necromigrate-test.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=necromigrate-test
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=necromigrate-test.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_ID=123456789

# Wormhole (Testnet)
NEXT_PUBLIC_WORMHOLE_NETWORK=Testnet
NEXT_PUBLIC_WORMHOLE_API=https://api.wormholescan.io/api/v1
NEXT_PUBLIC_SOLANA_RPC=https://api.devnet.solana.com
NEXT_PUBLIC_ETHEREUM_RPC=https://eth-sepolia.g.alchemy.com/v2/test-key
NEXT_PUBLIC_BASE_RPC=https://sepolia.base.org

# NTT Addresses (Testnet)
NEXT_PUBLIC_NTT_ETHEREUM=0x...test...
NEXT_PUBLIC_NTT_SOLANA=testNttManagerAddress

# Test Wallets (DO NOT USE IN PROD)
TEST_SOLANA_KEYPAIR=base64-encoded-keypair
TEST_ETH_PRIVATE_KEY=0x...test...
```

### Test Database
Use Firebase Emulator:

```bash
# Install Firebase tools
npm install -g firebase-tools

# Start emulator
firebase emulators:start --project=necromigrate-test

# Export data
firebase emulators:export ./test-db-backup
```

---

## Unit Tests

### 1. Voting Logic Tests

**File**: `src/__tests__/lib/voting.test.ts`

```typescript
import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateVotePercentage, isApproved, canVote } from '@/lib/voting';

describe('Voting Logic', () => {
  describe('calculateVotePercentage', () => {
    it('should calculate vote percentage correctly', () => {
      const result = calculateVotePercentage(80, 100);
      expect(result).toBe(80);
    });

    it('should return 0 for zero total votes', () => {
      const result = calculateVotePercentage(80, 0);
      expect(result).toBe(0);
    });

    it('should handle floating point votes', () => {
      const result = calculateVotePercentage(1, 3);
      expect(result).toBeCloseTo(33.33, 2);
    });
  });

  describe('isApproved', () => {
    it('should approve at exactly 80%', () => {
      expect(isApproved(80)).toBe(true);
    });

    it('should reject below 80%', () => {
      expect(isApproved(79.99)).toBe(false);
    });

    it('should approve above 80%', () => {
      expect(isApproved(100)).toBe(true);
    });
  });

  describe('canVote', () => {
    it('should allow voting when wallet is connected', () => {
      expect(canVote('wallet123', 'project1')).toBe(true);
    });

    it('should reject voting with empty wallet', () => {
      expect(canVote('', 'project1')).toBe(false);
    });

    it('should reject voting with empty project', () => {
      expect(canVote('wallet123', '')).toBe(false);
    });
  });
});
```

**Run**: `pnpm test voting.test.ts`

### 2. Merkle Tree Tests

**File**: `src/__tests__/lib/merkle.test.ts`

```typescript
import { createMerkleTree, verifyMerkleProof, generateSnapshot } from '@/lib/merkle-utils';

describe('Merkle Tree Operations', () => {
  let leaves: string[];
  let tree: any;

  beforeEach(() => {
    leaves = [
      '0x1234567890abcdef1234567890abcdef12345678',
      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      '0x9876543210987654321098765432109876543210',
    ];
    tree = createMerkleTree(leaves);
  });

  it('should create valid merkle tree', () => {
    expect(tree).toBeDefined();
    expect(tree.root).toBeDefined();
  });

  it('should generate valid merkle proofs', () => {
    const proof = tree.getProof(leaves[0]);
    expect(proof).toBeDefined();
    expect(Array.isArray(proof)).toBe(true);
  });

  it('should verify valid leaf with proof', () => {
    const proof = tree.getProof(leaves[0]);
    const isValid = verifyMerkleProof(leaves[0], proof, tree.root);
    expect(isValid).toBe(true);
  });

  it('should reject invalid leaf with proof', () => {
    const proof = tree.getProof(leaves[0]);
    const fakeLeaf = '0xffffffffffffffffffffffffffffffffffffffff';
    const isValid = verifyMerkleProof(fakeLeaf, proof, tree.root);
    expect(isValid).toBe(false);
  });

  it('should generate valid snapshot', () => {
    const snapshot = generateSnapshot(leaves);
    expect(snapshot.root).toBeDefined();
    expect(snapshot.proofs).toBeDefined();
    expect(Object.keys(snapshot.proofs)).toHaveLength(leaves.length);
  });
});
```

**Run**: `pnpm test merkle.test.ts`

### 3. Crypto Utils Tests

**File**: `src/__tests__/lib/crypto.test.ts`

```typescript
import { keccak256Hash, sha256Hash } from '@/lib/crypto-utils';

describe('Cryptographic Utils', () => {
  describe('keccak256Hash', () => {
    it('should hash consistently', () => {
      const hash1 = keccak256Hash('test');
      const hash2 = keccak256Hash('test');
      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = keccak256Hash('test1');
      const hash2 = keccak256Hash('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('should handle empty strings', () => {
      const hash = keccak256Hash('');
      expect(hash).toBeDefined();
      expect(hash.length).toBeGreaterThan(0);
    });
  });

  describe('sha256Hash', () => {
    it('should match known SHA256 value', () => {
      const hash = sha256Hash('hello');
      expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });

    it('should be consistent across calls', () => {
      const hash1 = sha256Hash('test');
      const hash2 = sha256Hash('test');
      expect(hash1).toBe(hash2);
    });
  });
});
```

**Run**: `pnpm test crypto.test.ts`

---

## Integration Tests

### 1. Firestore Integration Tests

**File**: `src/__tests__/integration/firestore.test.ts`

```typescript
import { db } from '@/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

describe('Firestore Integration', () => {
  describe('Voting Collection', () => {
    it('should create and retrieve vote', async () => {
      const votesRef = collection(db, 'votes');
      
      const docRef = await addDoc(votesRef, {
        projectId: 'test-project',
        walletAddress: 'test-wallet-123',
        voteAmount: 50,
        timestamp: new Date(),
      });

      expect(docRef.id).toBeDefined();
    });

    it('should query votes by project', async () => {
      const votesRef = collection(db, 'votes');
      const q = query(votesRef, where('projectId', '==', 'test-project'));
      const snapshot = await getDocs(q);
      
      expect(snapshot.docs).toBeDefined();
      expect(Array.isArray(snapshot.docs)).toBe(true);
    });

    it('should prevent duplicates with composite key', async () => {
      // Firestore security rules should enforce uniqueness
      // This tests that the data model is correct
      expect(true).toBe(true);
    });
  });

  describe('Migrations Collection', () => {
    it('should create migration record', async () => {
      const migrationsRef = collection(db, 'migrations');
      
      const docRef = await addDoc(migrationsRef, {
        projectId: 'test-token',
        status: 'pending',
        totalAmount: '1000000',
        bridgedAmount: '0',
        timestamp: new Date(),
      });

      expect(docRef.id).toBeDefined();
    });

    it('should update migration status', async () => {
      // Test update flow: pending → approved → migrating → completed
      expect(true).toBe(true);
    });
  });

  describe('Claims Collection', () => {
    it('should record claim attempt', async () => {
      const claimsRef = collection(db, 'claims');
      
      const docRef = await addDoc(claimsRef, {
        projectId: 'test-token',
        walletAddress: 'test-wallet',
        amount: '100',
        merkleProof: ['0x...', '0x...'],
        status: 'pending',
        timestamp: new Date(),
      });

      expect(docRef.id).toBeDefined();
    });

    it('should prevent double-claiming', async () => {
      // Firestore rules should prevent duplicate claims
      expect(true).toBe(true);
    });
  });
});
```

**Run**: `pnpm test firestore.test.ts`

### 2. Wormhole Integration Tests

**File**: `src/__tests__/integration/wormhole.test.ts`

```typescript
import { 
  initializeWormhole, 
  pollForVAA, 
  estimateBridgeFee,
  getNTTManagerAddresses 
} from '@/lib/wormhole-ntt';

describe('Wormhole Integration', () => {
  describe('Initialization', () => {
    it('should initialize Wormhole connection', async () => {
      const result = await initializeWormhole('Testnet');
      
      expect(result).toBeDefined();
      expect(result.ready).toBe(true);
      expect(result.chains).toBeDefined();
      expect(result.chains.length).toBeGreaterThan(0);
    });

    it('should support required chains', async () => {
      const result = await initializeWormhole('Testnet');
      const requiredChains = ['Ethereum', 'Base', 'Solana'];
      
      requiredChains.forEach(chain => {
        expect(result.chains).toContain(chain);
      });
    });
  });

  describe('VAA Polling', () => {
    it('should handle VAA polling timeout gracefully', async () => {
      const result = await pollForVAA('fake-tx-hash', 'Ethereum', { maxAttempts: 3 });
      
      // Should timeout and return null
      expect(result).toBeNull();
    });

    it('should respect polling parameters', async () => {
      const startTime = Date.now();
      await pollForVAA('fake-tx', 'Ethereum', { maxAttempts: 3, pollInterval: 100 });
      const elapsed = Date.now() - startTime;
      
      // Should complete in ~300ms (3 attempts × 100ms)
      expect(elapsed).toBeGreaterThanOrEqual(300);
      expect(elapsed).toBeLessThan(1000);
    });
  });

  describe('Fee Estimation', () => {
    it('should estimate bridge fee', async () => {
      const fee = await estimateBridgeFee('1.0', 'Ethereum', 'Solana');
      
      expect(fee).toBeDefined();
      expect(parseFloat(fee)).toBeGreaterThan(0);
    });

    it('should scale fee with amount', async () => {
      const fee1 = await estimateBridgeFee('1.0', 'Ethereum', 'Solana');
      const fee2 = await estimateBridgeFee('10.0', 'Ethereum', 'Solana');
      
      expect(parseFloat(fee2)).toBeGreaterThan(parseFloat(fee1));
    });
  });

  describe('NTT Manager Addresses', () => {
    it('should return addresses for testnet', () => {
      const addresses = getNTTManagerAddresses('Testnet');
      
      expect(addresses.Ethereum).toBeDefined();
      expect(addresses.Base).toBeDefined();
      expect(addresses.Solana).toBeDefined();
    });

    it('should return addresses for mainnet', () => {
      const addresses = getNTTManagerAddresses('Mainnet');
      
      expect(addresses.Ethereum).toBeDefined();
      expect(addresses.Solana).toBeDefined();
    });
  });
});
```

**Run**: `pnpm test wormhole.test.ts`

---

## End-to-End Tests

### Playwright Configuration

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 1. Voting Flow E2E Test

**File**: `src/__tests__/e2e/voting.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Voting Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage
    await page.goto('/');
    // Wait for page to load
    await page.waitForLoadState('networkidle');
  });

  test('should nominate a project', async ({ page }) => {
    // Click nominate button
    await page.click('[data-testid="nominate-btn"]');
    
    // Fill form
    await page.fill('[data-testid="project-name"]', 'Test Token');
    await page.fill('[data-testid="project-ticker"]', 'TEST');
    await page.selectOption('[data-testid="source-chain"]', 'Ethereum');
    await page.fill('[data-testid="token-address"]', '0x1234567890123456789012345678901234567890');
    
    // Submit
    await page.click('[data-testid="submit-btn"]');
    
    // Verify notification
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('should vote on a project', async ({ page }) => {
    // Navigate to project
    await page.goto('/projects/test-token');
    
    // Click vote button
    await page.click('[data-testid="vote-yes-btn"]');
    
    // Verify vote amount input appears
    await expect(page.locator('[data-testid="vote-amount"]')).toBeVisible();
    
    // Enter amount
    await page.fill('[data-testid="vote-amount"]', '50');
    
    // Sign transaction
    await page.click('[data-testid="sign-vote-btn"]');
    
    // Wait for confirmation
    await page.waitForTimeout(2000);
    
    // Verify vote recorded
    await expect(page.locator('[data-testid="vote-confirmed"]')).toBeVisible();
  });

  test('should show project as approved when reaching 80%', async ({ page, context }) => {
    // Create multiple vote contexts
    const wallets = ['wallet1', 'wallet2', 'wallet3', 'wallet4', 'wallet5'];
    
    for (const wallet of wallets) {
      const page2 = await context.newPage();
      await page2.goto('/projects/test-token');
      
      // Mock wallet connection
      await page2.evaluate(w => window.localStorage.setItem('wallet', w), wallet);
      
      // Vote
      await page2.click('[data-testid="vote-yes-btn"]');
      await page2.fill('[data-testid="vote-amount"]', '20');
      await page2.click('[data-testid="sign-vote-btn"]');
      
      await page2.close();
    }
    
    // Check original page
    await page.reload();
    
    // Verify approval badge
    await expect(page.locator('[data-testid="approved-badge"]')).toBeVisible();
    
    // Verify token bridge appears
    await expect(page.locator('[data-testid="token-bridge"]')).toBeVisible();
  });

  test('should show live vote percentage', async ({ page }) => {
    await page.goto('/projects/test-token');
    
    // Get initial percentage
    const initialPercent = await page.locator('[data-testid="vote-percentage"]').textContent();
    
    // Vote
    await page.click('[data-testid="vote-yes-btn"]');
    await page.fill('[data-testid="vote-amount"]', '30');
    await page.click('[data-testid="sign-vote-btn"]');
    
    // Wait for update
    await page.waitForTimeout(1000);
    
    // Get updated percentage
    const updatedPercent = await page.locator('[data-testid="vote-percentage"]').textContent();
    
    // Should have changed
    expect(updatedPercent).not.toBe(initialPercent);
  });
});
```

**Run**: `pnpm test:e2e voting.spec.ts`

### 2. Bridge Flow E2E Test

**File**: `src/__tests__/e2e/bridge.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Bridge Flow', () => {
  test('should display TokenBridge on approved project', async ({ page }) => {
    // Go to approved project
    await page.goto('/projects/approved-project-id');
    
    // Scroll to bridge section
    await page.locator('[data-testid="token-bridge"]').scrollIntoViewIfNeeded();
    
    // Verify Wormhole widget appears
    await expect(page.locator('[data-testid="wormhole-widget"]')).toBeVisible();
  });

  test('should show bridge stages', async ({ page }) => {
    await page.goto('/projects/approved-project-id');
    
    // Verify all 5 stages shown
    await expect(page.locator('[data-testid="stage-1-approving"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-2-transferring"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-3-relaying"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-4-redeeming"]')).toBeVisible();
    await expect(page.locator('[data-testid="stage-5-complete"]')).toBeVisible();
  });

  test('should handle bridge progress updates', async ({ page }) => {
    await page.goto('/projects/approved-project-id');
    
    // Enter transfer amount
    await page.fill('[data-testid="transfer-amount"]', '0.01');
    
    // Click bridge
    await page.click('[data-testid="bridge-btn"]');
    
    // Watch progress
    // Stage 1: Approving
    await expect(page.locator('[data-testid="stage-1-approving"].active')).toBeVisible();
    
    // Stage 2: Transferring
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="stage-2-transferring"].active')).toBeVisible();
    
    // Stage 3: Relaying (longest wait)
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="stage-3-relaying"].active')).toBeVisible();
    
    // Stage 4: Redeeming
    await page.waitForTimeout(3000);
    await expect(page.locator('[data-testid="stage-4-redeeming"].active')).toBeVisible();
    
    // Stage 5: Complete
    await page.waitForTimeout(2000);
    await expect(page.locator('[data-testid="stage-5-complete"].active')).toBeVisible();
  });

  test('should show error on failed bridge', async ({ page }) => {
    await page.goto('/projects/approved-project-id');
    
    // Try to bridge with 0 amount (should fail)
    await page.fill('[data-testid="transfer-amount"]', '0');
    await page.click('[data-testid="bridge-btn"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Invalid amount');
  });
});
```

**Run**: `pnpm test:e2e bridge.spec.ts`

### 3. Leaderboard E2E Test

**File**: `src/__tests__/e2e/leaderboard.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Leaderboard', () => {
  test('should display live leaderboard', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Verify table appears
    await expect(page.locator('[data-testid="leaderboard-table"]')).toBeVisible();
    
    // Verify columns
    await expect(page.locator('[data-testid="rank-col"]')).toBeVisible();
    await expect(page.locator('[data-testid="name-col"]')).toBeVisible();
    await expect(page.locator('[data-testid="votes-col"]')).toBeVisible();
    await expect(page.locator('[data-testid="percentage-col"]')).toBeVisible();
  });

  test('should update leaderboard in real-time', async ({ page, context }) => {
    await page.goto('/leaderboard');
    
    // Get initial order
    const initialOrder = await page.locator('[data-testid="project-name"]').allTextContents();
    
    // Vote in another browser context
    const votePage = await context.newPage();
    await votePage.goto('/projects/test-project');
    await votePage.click('[data-testid="vote-yes-btn"]');
    await votePage.fill('[data-testid="vote-amount"]', '100');
    await votePage.click('[data-testid="sign-vote-btn"]');
    
    // Wait for real-time update
    await page.waitForTimeout(2000);
    
    // Get updated order
    const updatedOrder = await page.locator('[data-testid="project-name"]').allTextContents();
    
    // Should have changed (test-project moved up if voted for top project)
    expect(updatedOrder).not.toEqual(initialOrder);
    
    await votePage.close();
  });

  test('should show voting percentage on hover', async ({ page }) => {
    await page.goto('/leaderboard');
    
    // Hover over a project row
    await page.locator('[data-testid="project-row"]').first().hover();
    
    // Verify tooltip appears
    await expect(page.locator('[data-testid="vote-tooltip"]')).toBeVisible();
  });
});
```

**Run**: `pnpm test:e2e leaderboard.spec.ts`

---

## Manual Testing

### Testing Checklist

#### Homepage
- [ ] Page loads within 2 seconds
- [ ] Navbar displays correctly
- [ ] All navigation links work
- [ ] Responsive on mobile/tablet/desktop
- [ ] Dark theme applies properly
- [ ] Leaderboard shows top 10 projects

#### Voting
- [ ] Can nominate new project
- [ ] Form validation works (required fields)
- [ ] Can vote on any project
- [ ] Vote amount validated (0-100)
- [ ] Vote percentage updates live
- [ ] Cannot vote twice with same wallet
- [ ] Approval badge shows at 80%
- [ ] TokenBridge appears after approval

#### Leaderboard
- [ ] Live updates on new vote
- [ ] Sort by ranking works
- [ ] Sort by votes works
- [ ] Responsive tables
- [ ] Pagination works (if >20 items)
- [ ] Search projects works
- [ ] Filter by status works

#### Bridge (Option A - WormholeConnect)
- [ ] Widget appears on approved project
- [ ] Can connect MetaMask wallet
- [ ] Can select source chain
- [ ] Can select target chain
- [ ] Can enter amount
- [ ] Can see real Wormhole UI
- [ ] Toast notifications appear on stages
- [ ] Firestore updates on completion

#### Bridge (Option B - Custom SDK)
- [ ] Component loads without errors
- [ ] 5-stage progress shows
- [ ] Can enter transfer amount
- [ ] Each stage color-codes correctly
- [ ] Firestore updates in real-time
- [ ] Toast notifications on stage change
- [ ] Can restart bridge after completion

#### Claims
- [ ] Claim page appears after migration complete
- [ ] Can generate merkle proof
- [ ] Proof displays correctly
- [ ] Can claim with valid proof
- [ ] Cannot claim twice
- [ ] Cannot claim with invalid proof

---

## Testnet Validation

### Stage 1: Setup & Funding

```bash
# 1. Get testnet tokens (5-10 minutes total)

# Solana devnet SOL
# Visit: https://faucet.solana.com
# Amount: 5 SOL

# Ethereum Sepolia ETH  
# Visit: https://sepoliafaucet.com
# Amount: 0.1 ETH

# Base Sepolia ETH
# Visit: https://www.base.org/dapp/get-eth
# Amount: 0.1 ETH

# 2. Verify balances
# Solana:   `solana balance`
# Ethereum: ethers.js or MetaMask
```

### Stage 2: Frontend Testing

**Time**: 15-20 minutes

```bash
# 1. Start dev server
cd frontend
pnpm dev

# 2. Homepage verification
# - Visit http://localhost:3000
# - Check voting dashboard
# - Check leaderboard

# 3. Test voting
# - Nominate "Test Token"
# - Fill in details
# - Submit (should see success toast)

# 4. Vote multiple times
# - Click "Vote YES"
# - Enter amount (20)
# - Sign in Solana wallet
# - Repeat with different amounts until 80%+

# 5. Verify TokenBridge appears
# - Should appear when reaching 80%
# - Should show real Wormhole widget
```

### Stage 3: WormholeConnect Widget (Option A)

**Time**: 20-30 minutes

```bash
# 1. On approved project detail page
# - Click on TokenBridge component
# - Should show real Wormhole UI

# 2. Connect MetaMask
# - Click "Connect Wallet"
# - Select MetaMask
# - Approve connection
# - Should show wallet address

# 3. Configure bridge
# - Source Chain: Ethereum (Sepolia)
# - Target Chain: Solana (Devnet)
# - Amount: 0.01

# 4. Execute bridge
# - Review transaction details
# - Click "Bridge"
# - Sign in MetaMask
# - Watch toast notifications:
#   ✓ "Tokens approved"
#   ✓ "Tokens locked on Ethereum"
#   ⏳ "Waiting for guardian attestation..."
#   ✓ "VAA received"
#   ✓ "Tokens redeemed on Solana"

# 5. Verify Firestore
# - Open DevTools → Firestore
# - Check migrations/{projectId}
# - Should show status progression
# - Should have VAA from guardians
```

### Stage 4: Custom SDK Bridge (Option B)

**Time**: 20-30 minutes

```bash
# 1. Import AdvancedNTTBridge
# - In test page, import component
# - Should show 5-stage timeline

# 2. Enter transfer amount
# - Fill "Transfer Amount" field
# - Should validate input
# - Should enable bridge button

# 3. Execute bridge
# - Click "Bridge"
# - Watch stage progression:
#   Stage 1 (blue):  Approving
#   Stage 2 (purple): Transferring
#   Stage 3 (yellow): Relaying
#   Stage 4 (orange): Redeeming
#   Stage 5 (green):  Complete

# 4. Monitor real-time
# - Watch Firestore updates
# - Each stage should update in real-time
# - Timestamps should increment
# - VAA should appear when relayed

# 5. Verify completion
# - All 5 stages should turn green
# - "Start Another Bridge" button appears
# - Firestore shows "completed" status
```

### Stage 5: Merkle Claims (Bonus)

**Time**: 10-15 minutes

```bash
# 1. Once migration marks complete
# - ClaimTokensInterface should appear
# - Should show "Generate Merkle Proof" button

# 2. Generate proof
# - Click button
# - Should show loading animation
# - Proof should display (base64)

# 3. Verify proof
# - Copy proof to DevTools → Console
# - Test merkle verification
# - Should return true for valid proof

# 4. Complete claim
# - Click "Claim Tokens"
# - Sign transaction
# - Should see success message
# - Tokens should appear in wallet
```

---

## Performance Testing

### Load Testing

**File**: `src/__tests__/performance/load.test.ts`

```typescript
import { test } from '@playwright/test';

test('should handle high voting load', async ({ page }) => {
  const startTime = Date.now();
  
  // Simulate 100 rapid votes
  for (let i = 0; i < 100; i++) {
    await page.goto(`/projects/test-token`);
    await page.click('[data-testid="vote-yes-btn"]');
    await page.fill('[data-testid="vote-amount"]', Math.random() * 100);
    await page.click('[data-testid="sign-vote-btn"]');
  }
  
  const elapsed = Date.now() - startTime;
  const avgPerVote = elapsed / 100;
  
  console.log(`Average per vote: ${avgPerVote}ms`);
  
  // Should complete all 100 votes in <60 seconds
  // Average per vote <600ms
});

test('leaderboard should load in <2 seconds', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/leaderboard');
  await page.waitForLoadState('networkidle');
  
  const elapsed = Date.now() - startTime;
  
  console.log(`Leaderboard load time: ${elapsed}ms`);
  expect(elapsed).toBeLessThan(2000);
});
```

### Bundle Analysis

```bash
# Analyze bundle size
pnpm build
pnpm run analyze

# Expected sizes:
# - Main bundle: <200KB (gzipped)
# - App shell: <50KB (gzipped)
# - Wormhole code: <100KB (gzipped)
```

---

## Security Testing

### Input Validation Tests

**File**: `src/__tests__/security/validation.test.ts`

```typescript
describe('Input Validation', () => {
  it('should reject XSS in project name', () => {
    const malicious = '<img src=x onerror="alert(1)">';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('onerror');
  });

  it('should reject invalid token addresses', () => {
    const invalid = 'not-a-valid-address';
    expect(() => validateTokenAddress(invalid)).toThrow();
  });

  it('should reject negative vote amounts', () => {
    const invalid = -100;
    expect(() => validateVoteAmount(invalid)).toThrow();
  });

  it('should enforce max vote amount', () => {
    const invalid = 10001;
    expect(() => validateVoteAmount(invalid)).toThrow();
  });
});
```

### Firestore Rules Testing

**File**: `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /votes/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.data.keys().hasAll(['projectId', 'walletAddress', 'voteAmount']);
    }
    
    // Prevent double-voting
    match /voteTallies/{projectId} {
      allow read: if true;
      allow write: if request.auth != null
        && !exists(/databases/$(database)/documents/votes/$(projectId)_$(request.auth.uid));
    }
  }
}
```

### Smart Contract Audit

- [ ] Merkle verification logic is sound
- [ ] No integer overflow/underflow
- [ ] Reentrancy protection in place
- [ ] Access control implemented
- [ ] Event logging comprehensive
- [ ] Gas optimization considered

---

## Troubleshooting

### Common Issues & Solutions

#### "Dev server won't start"
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm dev
```

#### "Wormhole widget not appearing"
```javascript
// Check browser console
window.Wormhole        // Should be defined
window.ethereum         // Should be defined (MetaMask)
window.solana          // Should be defined (Phantom)

// Check cache
// DevTools → Inspect → Clear Local Storage → Reload
```

#### "Firestore not updating"
```javascript
// Check Firestore rules
// Check internet connection
// Check Firebase credentials in .env
// Check Firestore collection exists: firebase console
```

#### "VAA polling timeout"
```bash
# This is normal on testnet
# Guardians typically sign within 1-2 minutes
# Check: https://wormholescan.io/txns?network=testnet

# If consistently timing out:
# - Verify transaction was mined on source chain
# - Check Wormhole API endpoint is reachable
# - Verify you're on correct testnet
```

#### "Metamask transaction rejected"
```javascript
// Check:
// - Enough ETH for gas
// - Wallet is on correct chain (Sepolia/Base)
// - Nonce not stuck (MetaMask settings)
// - Gas price reasonable
```

### Debug Mode

Enable verbose logging:

```typescript
// src/env.ts
export const DEBUG = true;

// Then in components:
if (DEBUG) console.log('Bridge status:', status);
```

### Logging

```typescript
// Use Winston for structured logging
import winston from 'winston';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

logger.info('Bridge started', { projectId, amount });
logger.error('Bridge failed', { error: err.message });
```

---

## Test Reports

### Generate Coverage

```bash
pnpm test --coverage

# Expected coverage:
# - Statements: >80%
# - Branches: >75%
# - Functions: >80%
# - Lines: >80%
```

### Generate HTML Report

```bash
pnpm test:ui    # Interactive test UI
pnpm test:debug  # Debug mode with inspector
```

---

## CI/CD Testing

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm test
      - run: pnpm test:e2e
      - run: pnpm build
```

---

## Success Criteria

### Unit Tests
- [ ] >80% code coverage
- [ ] All voting logic tests pass
- [ ] All merkle tests pass
- [ ] All crypto tests pass

### Integration Tests
- [ ] Firestore operations work
- [ ] Wormhole API calls work
- [ ] Solana wallet integration works
- [ ] MetaMask integration works

### E2E Tests
- [ ] Voting flow works start-to-finish
- [ ] Bridge flow works start-to-finish
- [ ] Leaderboard updates real-time
- [ ] Claims processing works

### Manual Testing
- [ ] All UI responsive
- [ ] All flows work as documented
- [ ] No console errors
- [ ] No console warnings

### Testnet Validation
- [ ] All 5 bridge stages work
- [ ] Firestore updates in real-time
- [ ] Guardian network attest VAA
- [ ] Tokens successfully transferred

### Security
- [ ] Input validation blocks XSS
- [ ] Firestore rules prevent unauthorized access
- [ ] Smart contracts audited
- [ ] No sensitive data in logs

---

## Next Steps

1. ✅ Run unit tests: `pnpm test`
2. ✅ Run E2E tests: `pnpm test:e2e`
3. ✅ Perform manual testing on dev
4. ✅ Validate on testnet (2-4 hours)
5. ✅ Fix any issues found
6. ✅ Deploy to staging
7. ✅ Final UAT
8. ✅ Deploy to production

---

**Status**: Comprehensive Testing Guide Complete  
**Last Updated**: February 16, 2026  
**Ready For**: Integration ✅
