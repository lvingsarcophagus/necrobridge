# NecroBridge: Dual Migration Strategy

## Overview

NecroBridge implements **two complementary migration paths** to handle different real-world scenarios for resurrecting dead/zombie projects. This is intentional strategic design, not a limitation — ensuring the platform serves both issuer-led and community-led token revivals.

---

## The Two Migration Paths

### Path 1: Canonical Migration via Sunrise/Wormhole NTT

**For: Semi-active or coordinated projects where someone controls authority**

#### How It Works
1. Original token issuer (or community with coordination) registers on **Sunrise Bridge** (https://sunrisebridge.xyz)
2. Existing holders burn/lock tokens on source chain (Ethereum, Base, Polygon, etc.)
3. **Wormhole Network** relays the migration
4. **Native canonical SPL token** minted on Solana (1:1 backing)
5. Automatically listed on Jupiter with unified liquidity pools
6. Recognized by all Solana ecosystem apps (Magic Eden, Phantom, etc.)

#### Benefits
- ✅ **Instant liquidity**: Jupiter DEX integration out-of-box
- ✅ **Native recognition**: No "wrapped" label, recognized as canonical
- ✅ **Unified pools**: Single pool per token across all DEXs
- ✅ **Official track**: Meets Sunrise protocol requirements
- ✅ **Fewest steps**: Existing holders just swap through interface

#### When to Use
- Original dev team/DAO can coordinate migration
- Project had decent prior recognition
- Want seamless UX for existing holders
- Priority: official canonical status

#### In NecroBridge UI
```
"Ready for Sunrise Migration" card
→ "Register on Sunrise →" button
→ Wormhole NTT widget/flow explanation
```

---

### Path 2: Snapshot + Merkle Proof Claims (Trustless Fallback)

**For: Truly dead/abandoned tokens where issuer is unreachable**

#### How It Works
1. App generates **off-chain Merkle tree snapshot** of old-chain holders
   - Captures: wallet address + token balance at snapshot block
   - Stored on-chain (Merkle root in Anchor program)
2. **New SPL token** created on Solana (or pre-minted supply allocated)
3. Holders submit **Merkle proof** to prove historical ownership
4. Anchor program `claim_tokens` instruction:
   - Verifies proof cryptographically
   - Transfers new tokens to claimant (1:1 or adjusted ratio)
   - Records claim on-chain to prevent double-claims
5. Firestore backup prevents off-chain replay attacks

#### Benefits
- ✅ **No permission needed**: Works without original dev/contract access
- ✅ **Trustless**: Cryptographic proof of ownership, verified on-chain
- ✅ **Prevents fraud**: Double-claim guard + Merkle verification
- ✅ **Community-led**: Any community can propose snapshot + claims
- ✅ **Fair distribution**: Restores original holder ratios (no founder theft)

#### When to Use
- Original dev team unreachable/rug-pulled
- Old contract mint authority burned
- Project completely abandoned (no discord, no socials)
- Ideal for zombie memecoins with $100k+ stuck value
- Priority: rescue community value trustlessly

#### In NecroBridge UI
```
Migration Stages Flow:
1. Nominated → 2. Approved → 3. Snapshot Generated
→ 4. Merkle Root Verified → 5. Claims Open
→ ClaimTokensInterface component shows claimable balance
```

---

## Why Both Paths? (Strategic Rationale)

### 1. **Real-World Coverage**
- **Path 1** handles 10-20% of cases (semi-coordinated projects)
- **Path 2** handles 80-90% of cases (truly dead/abandoned)
- Together: NecroBridge applies to nearly **all** zombie project scenarios

### 2. **Hackathon Requirement + Practicality**
- **Sunrise track** demands Wormhole NTT demonstration → Path 1 provides this
- **Most dead tokens** can't use canonical → Path 2 makes app actually useful
- Judges see depth: understanding of **both** professional bridging AND trustless fallback

### 3. **UX Flexibility**
- Issuer onboarding path (Path 1): Guided, widget-based
- Community revival path (Path 2): Merkle snapshot, claim flow
- Users choose based on their situation

### 4. **Future Monetization**
- **Path 1**: Volume-based fees via NTT integration (Wormhole partnership)
- **Path 2**: Claim processing fees, new token pool seeding, governance token future
- Two paths = multiple revenue streams

---

## How to Position in Demo/Marketing

### For Judges/Investors
"NecroBridge handles the **real 80% case** that other solutions miss:
- If you have dev access and coordination → use Sunrise/NTT (canonical, official)
- If the project is 100% dead/abandoned → use our Merkle snapshot + claims (trustless, community-led)

We cover both paths, which is why NecroBridge solves more revival scenarios than tools that only do canonical bridging."

### For Users
"**Two ways to resurrect your token:**
1. **Sunrise Integration** — If you can coordinate with original holders
2. **Snapshot & Claim** — If the project is dead but you have the holder list

Most users will use Path 2. Path 1 is for premium/coordinated migrations."

---

## Implementation Status

### Path 1: Canonical Migration (Sunrise/NTT)
- ✅ UI component: TokenBridge.tsx (WormholeConnect widget)
- ✅ Advanced flow: AdvancedNTTBridge.tsx (5-stage custom UI)
- ✅ Wormhole SDK: wormhole-ntt.ts (400+ lines documented)
- ✅ Testing guide: WORMHOLE_TESTING.md
- ⏳ Testnet validation: Feb 18-20

### Path 2: Snapshot + Merkle Claims (NecroBridge Native)
- ✅ Anchor program: `necro_migrate` (claim_tokens instruction)
- ✅ Snapshot API: `/api/migrations/snapshot`
- ✅ Merkle verification: `/api/migrations/verify-claim`
- ✅ UI component: ClaimTokensInterface.tsx
- ✅ Data storage: Firestore migrations collection
- ⏳ Anchor deployment: Feb 18-20

---

## UI Enhancement Suggestion

**Current State**: Path 1 (Sunrise) is more prominent than Path 2 (Merkle claims)

**Recommendation**: After "Approved" stage, add tab switcher:

```
┌─────────────────────────────────────────┐
│  Migration Methods                      │
├─────────────────────────────────────────┤
│ [Canonical NTT]  [Snapshot Claims]     │
├─────────────────────────────────────────┤
│ Canonical (Sunrise/NTT)                │
│ • Requires: Active coordination        │
│ • Result: Native canonical SPL token   │
│ • UX: Holders swap through Sunrise     │
│                                        │
│ [Register on Sunrise →]                │
│ [Wormhole NTT Info]                    │
└─────────────────────────────────────────┘
```

VS

```
┌─────────────────────────────────────────┐
│ Snapshot + Merkle Claims                │
│ • Requires: Token holder list           │
│ • Result: Community-owned SPL token     │
│ • UX: Holders prove ownership + claim   │
│                                        │
│ [Generate Snapshot]                    │
│ [View Claimable Balance]                │
│ [Claim Tokens]                          │
└─────────────────────────────────────────┘
```

This clarifies: **Both options are available, choose based on your situation.**

---

## Key Messaging for Documentation

> "NecroBridge isn't just a Wormhole wrapper — it's a **complete resurrection platform** for zombie tokens.
>
> - **Canonical path (Sunrise/NTT)** for when you have coordination
> - **Trustless path (Merkle snapshot)** for when the project is absolutely dead
>
> Most abandoned projects will use the Merkle snapshot path, which is why we built it alongside the official Sunrise integration. We solve the real problem: returning value to communities for projects that no one else touches."

---

## Technical Architecture

### Path 1: Multi-Chain Bridging
```
ERC-20 (Ethereum)  →  [Wormhole Guardian Network]  →  SPL Token (Solana)
ERC-20 (Base)      →        ↓↓↓                    →  [Single Canonical]
ERC-20 (Polygon)   →  [NTT Relayers]              →  
```

### Path 2: Merkle Tree Verification
```
Historical Holders (Various Chains, CSV/JSON)
        ↓
    Merkle Tree
   (keccak256)
        ↓
   Root Hash (on-chain in Anchor program)
        ↓
   User submits: [address, balance, proof]
        ↓
   Anchor verifies: proof + address + balance
        ↓
   ✅ Claim tokens / ❌ Reject fraudulent claims
```

---

## Files Related to This Strategy

| File | Purpose | Status |
|------|---------|--------|
| `src/lib/wormhole-ntt.ts` | Wormhole SDK wrapper (Path 1) | ✅ Complete |
| `src/components/TokenBridge.tsx` | WormholeConnect widget (Path 1) | ✅ Complete |
| `src/components/AdvancedNTTBridge.tsx` | Custom 5-stage NTT UI (Path 1) | ✅ Complete |
| `programs/necro_migrate/src/lib.rs` | Anchor program (Path 2) | ✅ Complete |
| `src/components/ClaimTokensInterface.tsx` | Merkle claim UI (Path 2) | ✅ Complete |
| `src/app/api/migrations/snapshot` | Snapshot generation (Path 2) | ✅ Complete |
| `src/app/api/migrations/verify-claim` | Merkle verification (Path 2) | ✅ Complete |
| `WORMHOLE_TESTING.md` | Testing guide (Path 1) | ✅ Complete |
| `MIGRATION_STRATEGY.md` | This file | ✅ Complete |

---

## Next Steps (Testnet Validation)

**Feb 18-20, 2026:**

### Path 1 Testing
- [ ] Register test token on Sunrise devnet
- [ ] Execute NTT migration flow
- [ ] Verify canonical token minted on Solana devnet
- [ ] Confirm Jupiter listing (devnet)

### Path 2 Testing
- [ ] Generate Merkle snapshot from ERC-20 holder data
- [ ] Deploy Anchor program to devnet
- [ ] Submit Merkle proof claims
- [ ] Verify double-claim prevention
- [ ] Confirm SPL tokens distributed correctly

### Combined Demo
- [ ] Show both paths in single migration
- [ ] Document user choices at each stage
- [ ] Record video demonstrating both flows
- [ ] Write judge guide highlighting both paths

---

**This dual-path design is NecroBridge's competitive advantage: we handle the edge cases that other resurrection platforms ignore.** 🪦💀🚀
