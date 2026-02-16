# Wormhole NTT Integration Guide

## What is NTT?

**Native Token Transfers (NTT)** allows tokens from any blockchain to be represented natively on Solana via **Wormhole's generic message layer**. Key benefits:

- **No wrapped tokens** — canonical SPL representation
- **No liquidity fragmentation** — single pool on Jupiter
- **Day-1 liquidity** — seeds can auto-create LP
- **Sunrise UI** — Wormhole Labs' optimized UI for issuers

## Integration Steps

### 1. Register Token with NTT (Issuer)

Go to: https://sunrisebridge.xyz

```
1. Connect wallet (Ethereum + Solana)
2. Paste source EVM token address
3. Set rate limit (optional)
4. Approve + confirm
→ Canonical SPL mint created on Solana
```

Output:
- Wormhole Token Bridge config
- SPL Mint address
- NTT Program ID

### 2. Configure NecroBridge for Token

In our Anchor program:

```rust
// Call our initialize_migration
pub fn initialize_migration(
    spl_mint: Pubkey,        // From Sunrise
    snapshot_root: [u8; 32], // Merkle root of holders
    total_supply: u64,       // Total SPL to allocate
    source_chain: u16,       // 1 = Ethereum
)
```

### 3. Users Claim Via GenMsg VAA

When a user holds >0 tokens on source:

```
1. Source chain: attestor contract sends proof
2. Wormhole: creates VAA (signed by guardians)
3. Solana: user submits VAA to our claim program
4. Program: verifies VAA → mints SPL to user
```

## Technical Links

- **NTT Docs**: https://docs.wormhole.com/wormhole/build/native-token-transfers
- **Wormhole SDK**: https://github.com/wormhole-foundation/wormhole-sdk-ts
- **Solana Program Library (SPL)**: https://github.com/solana-labs/solana-program-library

## Example: Bridge MON (Monad)

```
1. MON token registered on Ethereum → Wormhole NTT
2. SPL representation created: "MON (Wrapped by Sunrise)"
3. Holders prove balance via attestor
4. NecroBridge claims MON SPL
5. Jupiter auto-lists MON/USDC pool
6. DAO governance activated
```

## Debugging VAAs

Use Wormhole explorer:
```
https://wormholescan.io/
Search by VAA: 1/{{emitterChain}}/{{emitterAddress}}/{{sequence}}
```

For local testing:
```bash
# Generate test VAA (wormhole-cli)
wormhole-cli guardiand sign-vaa --vaa <payload>
```
