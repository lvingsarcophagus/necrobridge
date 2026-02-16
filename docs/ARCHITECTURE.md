# Architecture & Design

## System Overview

```
┌────────────────────────────────────────────────────────────┐
│                    SOURCE CHAIN (e.g. ETH)                │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Token Holder's Balance   │  Attestor Contract       │ │
│  │  (Snapshot)               │  (Proves ownership)      │ │
│  └───────────────────────────┬──────────────────────────┘ │
└────────────────────────────┬─────────────────────────────┘
                             │
                    Wormhole GenMsg
                    (Cross-chain proof)
                             │
┌────────────────────────────▼─────────────────────────────┐
│              SOLANA (Migration Executor)                  │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Claim Program                                       │ │
│  │ • Verify Wormhole VAA                             │ │
│  │ • Check merkle proof                              │ │
│  │ • Mint canonical SPL tokens                       │ │
│  │ • Record claim (prevent double-mint)              │ │
│  └────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Governance Program                                 │ │
│  │ • Vote on proposals                               │ │
│  │ • Activate LP pools                               │ │
│  │ • Manage migration parameters                     │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                             │
                    Used by Sunrise UI
                    (Jupiter integration)
```

## Token Flow

1. **Registration** (Issuers only)
   - Issuers register token with Wormhole NTT
   - Sunrise UI provides form (sunrisebridge.xyz)
   - Canonical SPL mint created on Solana

2. **Holder Attestation** (source chain)
   - Off-chain: generate merkle tree of holders
   - On-chain: lightweight attestor contract
   - Wormhole: post VAA with proof

3. **Claim** (Solana, user-initiated)
   - User signs tx with wallet
   - Program verifies VAA
   - Program verifies merkle proof
   - SPL tokens minted to user

4. **Governance**
   - Users who claimed vote on proposals
   - Proposals can unlock LP pools, launch airdrops, etc.

## Security Considerations

- **VAA Verification**: All Wormhole messages checked for authenticity
- **Merkle Proofs**: Prevent double-claiming at source layer
- **Pause Mechanism**: Admin can pause claims if suspicious activity
- **Burn/Lock**: Optional — source chain can burn claimed tokens to prevent double-spends

## Upgradability

- Anchor accounts use reallocation-safe structures
- Admin can create new Migration PDAs for different chains/protocols
- Governance can vote to transfer admin to DAO
