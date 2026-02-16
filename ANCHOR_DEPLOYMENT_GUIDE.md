# Anchor Program Deployment Guide - NecroBridge

## Overview
This guide walks through deploying the `necro_migrate` Anchor program to Solana devnet for trustless token claims.

## Program Details

**Program Name**: `necro_migrate`  
**Program ID**: `Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap`  
**Location**: `programs/necro_migrate/`  
**Status**: ✅ Complete and ready to deploy

---

## Prerequisites

### 1. System Requirements
```bash
# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source $HOME/.cargo/env

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"

# Add Anchor to PATH
export PATH="/home/user/.cargo/bin:$PATH"
```

### 2. Install Anchor
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30 anchor-cli --locked
```

### 3. Verify Installation
```bash
solana --version          # Should be 1.18.0+
anchor --version          # Should be 0.30.0+
rustc --version          # Should be 1.70.0+
```

---

## Pre-Deployment Steps

### Step 1: Build the Program
```bash
cd necrobridge/programs/necro_migrate

# Clean previous builds
anchor clean

# Build for devnet
anchor build

# Output: target/deploy/necro_migrate.so
```

**Expected Output**:
```
Compiling necro_migrate v0.1.0...
   Compiling anchor-lang v0.30.0
   ...
Finished `release` profile [optimized] target(s) in X.XXs
```

### Step 2: Generate IDL (Interface Description Language)
```bash
anchor idl build

# Output: target/idl/necro_migrate.json
```

This IDL is needed by the frontend to interact with the program.

### Step 3: Verify Program Builds
```bash
ls -la target/deploy/necro_migrate.so
ls -la target/idl/necro_migrate.json
```

Both files should exist and be > 0 bytes.

---

## Deploy to Devnet

### Windows Users: Use WSL2 (Recommended)

**Step 1: Open WSL2 Terminal**
```powershell
# In PowerShell or Windows Terminal
wsl
# You're now in a Linux environment
```

**Step 2: Navigate to project directory**
```bash
cd /mnt/c/Users/YOUR_USERNAME/OneDrive/Desktop/NJ_PROJ_2026/necrobridge
```

**Step 3: Prepare environment (automated)**
```bash
bash scripts/prepare-deploy.sh
```

This script automatically:
- ✅ Installs Rust
- ✅ Installs Solana CLI
- ✅ Installs Anchor CLI
- ✅ Configures for devnet
- ✅ Creates wallet
- ✅ Requests devnet SOL

**Step 4: Deploy with one command**
```bash
bash scripts/deploy-devnet.sh
```

---

### Linux/Mac: Direct Deployment

**Option A: Using convenience scripts (Recommended)**
```bash
cd necrobridge
bash scripts/prepare-deploy.sh    # One-time setup
bash scripts/deploy-devnet.sh     # Deploy
```

**Option B: Manual deployment**

1. **Configure Solana CLI for Devnet**
   ```bash
   solana config set --url devnet
   solana config get
   ```

2. **Create/Fund Wallet**
   ```bash
   solana-keygen new --outfile ~/.config/solana/devnet-keypair.json
   solana airdrop 10 ~/.config/solana/devnet-keypair.json --url devnet
   solana balance --url devnet
   ```

3. **Update Anchor.toml**
   ```toml
   [build]
   shell = "bash"

   [provider]
   cluster = "devnet"
   wallet = "~/.config/solana/devnet-keypair.json"

   [programs.devnet]
   necro_migrate = "Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap"
   ```

4. **Build and Deploy**
   ```bash
   cd necrobridge
   anchor deploy --provider.cluster devnet
   ```

**Expected Output**:
```
Deploying cluster: https://api.devnet.solana.com
Upgrade authority: YOUR_KEYPAIR
Deploying program "necro_migrate"...
Program path: /path/to/target/deploy/necro_migrate.so
Signature: YOUR_TX_SIGNATURE
```

---

## Post-Deployment Verification

### Step 1: Verify Program Deployed
```bash
# Check program status
solana program show Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap --url devnet

# Output example:
# Program Id: Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap
# Owner: 
# ProgramData Address: ...
# Executable: true
# RentEpoch: ...
```

### Step 2: View in Solana Explorer
```
https://explorer.solana.com/address/Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap?cluster=devnet
```

### Step 3: Update Frontend IDL
```bash
# Copy IDL to frontend
cp target/idl/necro_migrate.json \
   ../frontend/src/lib/idl/necro_migrate.json

# Update frontend imports
# File: src/lib/idl/index.ts
export { idl as necroMigrateIDL } from './necro_migrate.json';
```

---

## Testing After Deployment

### Test 1: Initialize Migration
```bash
# Using Anchor CLI to test
anchor run initialize

# Or manually via frontend
POST /api/migrations/initialize
{
  "projectId": "necro_eth_test",
  "name": "NecroBridge Test",
  "sourceChain": 1,
  "sourceAddress": "0x...",
  "snapshotRoot": "0x123...",
  "totalSupply": "84021000000000"
}
```

### Test 2: Submit Merkle Proof Claim
```bash
# Via ClaimTokensInterface component
1. Connect wallet to devnet
2. Click "Claim Tokens from Anchor Program"
3. Verify transaction succeeds
4. Check token balance in wallet
```

### Test 3: Verify Double-Claim Prevention
```bash
# Attempt to claim twice
1. Submit first claim → Success ✅
2. Submit second claim → Should fail with "Already Claimed" ✅
```

---

## Deployment Checklist

- [ ] Rust toolchain installed and updated
- [ ] Solana CLI v1.18.0+ installed
- [ ] Anchor CLI v0.30.0+ installed
- [ ] Program builds successfully: `anchor build`
- [ ] IDL generates: `anchor idl build`
- [ ] Devnet wallet created and funded with SOL
- [ ] Solana config set to devnet
- [ ] Anchor.toml configured for devnet
- [ ] Program deployed: `anchor deploy --provider.cluster devnet`
- [ ] Program verified in Solana Explorer
- [ ] IDL copied to frontend
- [ ] Frontend updated with IDL import
- [ ] Initialize migration test passes
- [ ] Claim tokens test passes
- [ ] Double-claim prevention verified

---

## Troubleshooting

### Error: "Program failed to deploy"
```bash
# Check current devnet SOL balance
solana balance --url devnet

# Request more devnet SOL
solana airdrop 10 --url devnet

# Retry deployment
anchor deploy
```

### Error: "Invalid program ID"
```bash
# Regenerate program keypair
solana-keygen new --outfile target/deploy/necro_migrate-keypair.json

# Update declare_id! in lib.rs with new keypair
solana-keygen pubkey target/deploy/necro_migrate-keypair.json
```

### Error: "Account not found"
```bash
# Ensure wallet has devnet SOL
solana balance --url devnet

# Airdrop again if balance is low
solana airdrop 10 --url devnet
```

### Build Error: "Dependency not found"
```bash
# Update dependencies
cargo update

# Rebuild
anchor build
```

---

## Production Deployment (Mainnet)

**Note**: For mainnet deployment consider:

1. **Audit**: Get program audited by security firm
2. **Multisig**: Use multisig for upgrade authority
3. **Insurance**: Consider insurance/bonding
4. **Slow Rollout**: Deploy to testnet → devnet → mainnet-beta → mainnet

### Mainnet Deployment Steps
```bash
# 1. Set cluster to mainnet-beta (test first)
solana config set --url mainnet-beta

# 2. Ensure sufficient SOL (requires ~1 SOL for deployment)
solana balance

# 3. Deploy
anchor deploy --provider.cluster mainnet-beta

# 4. Verify
solana program show Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap

# 5. If successful, deploy to mainnet
solana config set --url mainnet
anchor deploy --provider.cluster mainnet
```

---

## Key Program Functions

### `initialize_migration()`
Initializes a new migration with merkle snapshot root.

**Parameters**:
- `name`: String, project name
- `source_chain`: u16, chain ID (1 = Ethereum)
- `source_address`: Vec<u8>, original token contract
- `snapshot_root`: [u8; 32], merkle root hash
- `total_supply`: u64, total tokens to claim

**CPI Calls**: Creates Migration account, Mint, Token Vault

### `claim_tokens()`
Verifies merkle proof and transfers tokens to claimant.

**Parameters**:
- `amount`: u64, tokens to claim
- `merkle_proof`: Vec<[u8; 32]>, proof path
- `leaf_index`: u32, position in merkle tree

**Verification**:
1. ✅ Check migration is active
2. ✅ Verify merkle proof against root
3. ✅ Prevent double-claims
4. ✅ Transfer SPL tokens to user

### `finalize_migration()`
Closes migration (disables further claims).

**Access**: Only admin

---

## Frontend Integration (Already Configured)

The frontend is already configured to use the deployed program:

**File**: `src/components/ClaimTokensInterface.tsx`
```typescript
const PROGRAM_ID = new PublicKey(
  "Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap"
);

// When user clicks "Claim":
1. Generate merkle proof locally
2. Create claim_tokens instruction
3. Submit transaction
4. Anchor verifies proof on-chain
5. Tokens transferred
```

**API Integration**: `src/app/api/migrations/verify-claim/route.ts`
```typescript
// Verifies claim eligibility before on-chain submission
// Checks: Merkle root match, double-claim prevention
// Records claim in Firestore as backup
```

---

## Timeline

**February 18-20, 2026** (Testnet Validation Week):
- [ ] Build and verify program locally
- [ ] Deploy to devnet
- [ ] Test all functions:
  - Initialize migration ✅
  - Submit claims ✅
  - Verify double-claim prevention ✅
- [ ] Update frontend IDL
- [ ] Run end-to-end tests

**February 21-25, 2026** (Production Prep):
- [ ] Audit program code
- [ ] Deploy to mainnet-beta
- [ ] Final testing before mainnet

**February 26+** (Mainnet Launch):
- [ ] Deploy to Solana mainnet
- [ ] Enable production migrations

---

## Success Criteria

✅ Program deploys to devnet without errors  
✅ Program verified on Solana Explorer  
✅ Initialize migration instruction works  
✅ Claim tokens instruction succeeds  
✅ Merkle proof verification passes  
✅ Double-claim prevention works  
✅ Frontend successfully calls program  
✅ E2E test: user claims tokens end-to-end  

---

## Support & Debugging

For deployment issues:

1. **Check program size**: `ls -lh target/deploy/necro_migrate.so`
2. **View program logs**: `solana logs Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap --url devnet`
3. **Inspect transaction**: `solana confirm --url devnet <SIGNATURE>`
4. **Check wallet**: `solana balance --url devnet`

---

**Next Step**: Run `anchor build && anchor deploy --provider.cluster devnet` to deploy! 🚀
