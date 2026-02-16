# Deployment & Testing Guide

## Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
rustup component add rustfmt

# Install Solana
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Anchor
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked

# Configure Solana CLI for devnet
solana config set --url devnet

# Get devnet SOL
solana airdrop 5
```

## Build

```bash
# From project root
anchor build

# Generates:
# - target/idl/necro_migrate.json (IDL for frontend)
# - target/debug/necro_migrate.so (program binary)
```

## Deploy to Devnet

```bash
# Set keypair
export ANCHOR_PROVIDER_USER=$(solana address)

# Deploy
anchor deploy --provider.cluster devnet

# Save the program ID displayed
# → Add to Anchor.toml and lib.rs declare_id!()
```

## Test

```bash
# Local validator (if no devnet)
solana-test-validator &

# Run tests
anchor test --skip-local-validator
```

## Local Demo Flow

```bash
# 1. Build IDL
anchor build --idl target/idl

# 2. Deploy program
anchor deploy

# 3. Create a migration (admin)
ts-node scripts/init_migration.ts \
  --spl-mint <new-mint> \
  --snapshot-root <merkle-root> \
  --total-supply 1000000

# 4. Generate test VAA
# Use Wormhole testnet emulator or mock

# 5. Submit claim (user)
ts-node scripts/claim.ts \
  --migration <migration-pda> \
  --amount 100 \
  --proof <merkle-proof>

# 6. Verify on-chain
solana account <user-token-account>
```

## Sunrise Integration (Post-Deploy)

Once deployed to mainnet:

1. Contact Sunrise team: team@wormholelabs.dev
2. Provide SPL mint + NecroBridge program ID
3. They add to https://sunrisebridge.xyz
4. Users see "Migrate with NecroBridge" flow

## Monitoring

```bash
# Watch devnet program logs
solana logs <program-id> --url devnet

# View transaction details
solana tx <tx-hash> --url devnet
```
