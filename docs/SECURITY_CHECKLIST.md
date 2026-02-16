# Security Checklist - NecroBridge

Based on Jan 2026 Solana security playbook. Complete before mainnet deployment.

## Transaction Security

- [ ] **Fee payer verification**: Always explicit in transaction builder
  - Check: All instructions specify signer + writable flags
  - Test: Unit tests verify account state changes

- [ ] **Recent blockhash**: Enforced in transaction building
  - Implementation: `connection.getLatestBlockhash("confirmed")`
  - Expire: No transaction reuse > 150 blocks

- [ ] **Compute budget**: Set explicitly for all instructions
  - Max CUs for initialize_migration: 15000
  - Max CUs for claim_tokens: 8000
  - Test: Mollusk tests verify CU usage

- [ ] **Priority fees**: Optional but recommended for mainnet
  - Use `setComputeUnitPrice()` if network congestion expected
  - Set max 10% above recent average

## Account Security

- [ ] **Account ownership**: Verify ProgramOwnerFilter for NecroBridge accounts
  ```rust
  Migration owner: NecroBridge program
  UserClaim owner: NecroBridge program
  Governance owner: NecroBridge program
  ```

- [ ] **PDA seeds**: Strictly canonical
  - Migration PDA: `["migration", name, source_chain]`
  - UserClaim PDA: `["claim", migration_addr, user_addr]`
  - Governance PDA: `["governance", migration_addr]`

- [ ] **Account reallocation**: Protected via Anchor constraints
  - No unsafe `realloc` without data wipe

## Token/Bridge Security

- [ ] **Wormhole VAA verification**: CRITICAL
  - [ ] VAA signature validation passed
  - [ ] Emitter address matches expected bridge
  - [ ] Nonce / sequence checked (no replays)
  - [ ] Timeout enforced (VAA not stale)

- [ ] **Merkle proof verification**: CRITICAL
  - [ ] Leaf hash computed correctly
  - [ ] Proof path validates to root
  - [ ] No duplicate claims (burn/lock on source or merkle snapshot)

- [ ] **SPL Token mint**: Registered + canonical
  - [ ] Verify Wormhole NTT registry
  - [ ] No wrapped token variants
  - [ ] Jupiter liquidity seeded before go-live

## Wallet/Signing Security

- [ ] **Signer verification**: All actions signed by correct principal
  - Admin actions: Only migration.admin can pause/update
  - User claims: Only user can claim their tokens
  - Governance: Only token holders can vote

- [ ] **Wallet standard**: Using @solana/react-hooks (no hardcoded keys)
  - Test: Hook unit tests mock wallet
  - No private keys in frontend code

## Governance Security

- [ ] **Voting power**: Proportional to claimed tokens
  - [ ] Vote weight validated
  - [ ] No weighted voting exploits
  - [ ] Proposal quorum enforced (if applicable)

- [ ] **Timelock**: Proposals locked for N blocks before execution
  - Recommended: 2 epoch (1288 blocks) for mainnet

## RPC Security

- [ ] **RPC endpoint verification**:
  - Devnet: https://api.devnet.solana.com (official)
  - Mainnet: Use private endpoint or multiple RPCs failover
  - [ ] Never hardcode RPC URLs (use environment variables)

- [ ] **Indexing**: Verify token holder snapshots
  - [ ] Off-chain snapshot validated on-chain
  - [ ] Merkle tree published openly for auditability

## Testing & Audit

- [ ] **Unit tests**: 80%+ coverage via Mollusk
  - Double-claim prevention ✓
  - Invalid proofs rejected ✓
  - Governance weights correct ✓

- [ ] **Integration tests**: Surfpool + live devnet
  - Full migration flow with real Wormhole testnet
  - VAA generation and verification
  - Liquidity pool seeding

- [ ] **Code review**: External audit before mainnet
  - [ ] Merkle proof logic
  - [ ] VAA verification
  - [ ] PDA constraints
  - [ ] Governance voting

- [ ] **Mainnet dry-run**: Full simulation on mainnet fork
  - Devnet → testnet → mainnet (staged rollout)

## Monitoring & Response

- [ ] **Log events**: Emit on key actions
  - InitializeMigration → log migration registered
  - ClaimTokens → log amount + user
  - Vote → log proposal + weight

- [ ] **Off-chain indexing**: Track migrations + claims
  - Helius API for notifications
  - Alert on anomalies (mass claims, paused migrations)

- [ ] **Emergency procedures**:
  - [ ] Pause migration (admin only)
  - [ ] Migration rollback plan (if LP seeding fails)

---

## Deployment Checklist

**Before Devnet:**
- [x] Anchor program compiles
- [x] Mollusk tests pass
- [x] Kit SDK functional
- [ ] Codama generates clean code
- [ ] Frontend connects to devnet wallet

**Before Testnet:**
- [ ] Full integration tests pass
- [ ] Wormhole VAA verified (testnet bridge)
- [ ] Merkle proof logic audited
- [ ] 100% unit test coverage

**Before Mainnet:**
- [ ] External audit completed
- [ ] Devnet dry-run successful
- [ ] RPC failover configured
- [ ] Governance timelock enforced
- [ ] Emergency pause tested

---

**Last Updated**: Feb 14, 2026  
**Status**: 🟡 In Progress (pre-devnet)
