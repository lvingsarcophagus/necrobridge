# NecroBridge Anchor Program Deployment

Quick deployment guide for the `necro_migrate` Anchor program.

## TL;DR - Quick Start

### Windows Users (Recommended: WSL2)
```bash
# Open WSL2
wsl

# Navigate and deploy
cd /mnt/c/Users/YOUR_USERNAME/OneDrive/Desktop/NJ_PROJ_2026/necrobridge
bash scripts/prepare-deploy.sh    # One-time setup (5-10 min)
bash scripts/deploy-devnet.sh     # Deploy (2-3 min)
```

### Linux/Mac Users
```bash
cd necrobridge
bash scripts/prepare-deploy.sh    # One-time setup
bash scripts/deploy-devnet.sh     # Deploy
```

---

## What Gets Deployed

**Program**: `necro_migrate`  
**Location**: `programs/necro_migrate/src/lib.rs`  
**Status**: ✅ Ready for devnet

### Program Instructions

1. **`initialize_migration()`**
   - Creates a new migration account
   - Sets merkle root for token claims
   - Creates SPL token mint + vault

2. **`claim_tokens()`**
   - User submits merkle proof of ownership
   - Program verifies proof against root
   - Mints SPL tokens to user wallet
   - Prevents double-claims on-chain

3. **`finalize_migration()`**
   - Admin-only: closes migration
   - Disables further claims

---

## Files You'll Use

### Scripts
- `scripts/prepare-deploy.sh` - Set up environment (Rust, Solana, Anchor)
- `scripts/deploy-devnet.sh` - Build and deploy to devnet

### Program
- `programs/necro_migrate/src/lib.rs` - Anchor program source
- `programs/necro_migrate/Cargo.toml` - Dependencies

### Configuration
- `Anchor.toml` - Anchor framework config (already set up)

---

## Deployment Steps Explained

### Step 1: Prepare Environment (First Time Only)

```bash
bash scripts/prepare-deploy.sh
```

**What it does**:
1. Installs Rust toolchain (if needed)
2. Installs Solana CLI v1.18.12
3. Installs Anchor CLI v0.30.0
4. Sets Solana config to devnet
5. Creates a wallet (if needed)
6. Requests 10 devnet SOL

**Duration**: 5-10 minutes

### Step 2: Deploy

```bash
bash scripts/deploy-devnet.sh
```

**What it does**:
1. Verifies prereq quisites
2. Checks wallet balance (needs >1 SOL)
3. Builds program: `cargo build --release`
4. Deploys: `anchor deploy --provider.cluster devnet`
5. Displays Program ID and verification link

**Duration**: 2-3 minutes

---

## Verify Deployment

After deployment, you'll see:
```
✅ Deployment successful!

Program ID: Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap

Verify deployment:
  solana program show Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap --url devnet

View in Solana Explorer:
  https://explorer.solana.com/address/Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap?cluster=devnet
```

---

## Troubleshooting

### "WSL2 is not installed"
Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install-windows-10

### "Insufficient SOL balance"
Request more devnet SOL:
```bash
solana airdrop 10
```

### "Build failed"
Try cleaning and rebuilding:
```bash
cd programs/necro_migrate
cargo clean
cargo build --release
```

### "Anchor CLI not found"
Manually install:
```bash
cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked
```

---

## Manual Deployment (Advanced)

If scripts don't work, deploy manually:

```bash
cd necrobridge

# Configure
solana config set --url devnet

# Check balance
solana balance

# Build
cd programs/necro_migrate
cargo build --release

# Deploy
cd ../..
anchor deploy --provider.cluster devnet
```

---

## Frontend Integration

After deployment, update frontend with program IDL:

```bash
# Copy IDL to frontend
cp programs/necro_migrate/target/idl/necro_migrate.json \
   frontend/src/lib/idl/necro_migrate.json
```

Frontend already configured to use:
- Program ID: `Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap`
- Component: `src/components/ClaimTokensInterface.tsx`

---

## Timeline

**Today (Feb 16)**:
- ✅ Program ready
- ✅ Deployment scripts ready
- ⏳ Waiting for deployment

**Feb 18-20 (Testnet Week)**:
- Deploy to devnet
- Test all functions
- Verify on-chain

**Feb 21-25**:
- Run E2E tests
- Prepare for mainnet

**Feb 26+**:
- Deploy to mainnet

---

## Resources

- **Anchor Docs**: https://www.anchor-lang.com/
- **Solana Docs**: https://docs.solana.com/
- **Solana Explorer**: https://explorer.solana.com/?cluster=devnet
- **Full Guide**: [ANCHOR_DEPLOYMENT_GUIDE.md](../ANCHOR_DEPLOYMENT_GUIDE.md)

---

**Ready to deploy? Run:** `bash scripts/prepare-deploy.sh && bash scripts/deploy-devnet.sh` 🚀
