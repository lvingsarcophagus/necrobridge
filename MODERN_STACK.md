# Modern Solana Stack Update - NecroBridge

## Changes Applied  (Following Jan 2026 Playbook)

### ✅ Frontend Layer (@solana/client + @solana/react-hooks)
- **Old**: `@solana/wallet-adapter-react`, `@solana/web3.js`
- **New**: `@solana/client`, `@solana/react-hooks`, `@solana/kit`
- Benefits: Typed, modern, framework-kit patterns, better tree-shaking

### ✅ SDK Layer (@solana/kit first)
- **New files**:
  - `frontend/src/lib/necro-sdk-kit.ts` — Typed kit-based client
  - `frontend/src/hooks/useNecrobridge.ts` — Framework-kit React hooks
  - `frontend/src/components/MigrationDashboard.tsx` — Kit-based UI component

### ✅ Client Generation (Codama)
- **New files**:
  - `frontend/src/codama/necrobridge.idl.ts` — IDL definition (single source of truth)
  - Will generate typed codecs + instruction builders

### ✅ Testing (Mollusk + LiteSVM)
- **New files**:
  - `programs/necro_migrate/tests/mollusk.test.ts` — Fast in-process unit tests
  - `jest.config.json` — Test infrastructure
- **Why**: No more solana-test-validator needed for unit tests

### ✅ Web3.js Boundary (Legacy Compatibility)
- **New file**: `frontend/src/lib/web3-compat.ts`
- **Purpose**: Isolate web3.js at adapter boundaries (for Wormhole/legacy libs)
- **Rule**: Never export PublicKey/Connection directly; use Address/Signer types

---

## Updated Package Dependencies

### Frontend (`package.json`)
```json
{
  "@solana/client": "^2.0.0",
  "@solana/react-hooks": "^2.0.0",  
  "@solana/kit": "^1.0.0",
  "@solana-program/system": "^0.1.0",
  "@solana-program/token": "^0.1.0",
  "@solana/codama-cli": "^0.2.0",
  "@solana/codama": "^0.2.0"
}
```

### Testing
```bash
npm install --save-dev @mollusk/mollusk_sdk jest ts-jest @jest/globals
```

---

## Next Steps

### Week 1: Complete Integration
1. **Codama code gen**: `npx @solana/codama-cli generate` 
   - Auto-generates typed codecs + instruction builders from IDL
2. **Mollusk test suite**: Fill in placeholder tests with actual test cases
3. **Wormhole NTT**: Integrate via web3-compat boundary
4. **Deploy to devnet**: `anchor deploy --provider.cluster devnet`

### Week 2: Dashboard + Testing
1. Finish MigrationDashboard component
2. Add integration tests (Surfpool)
3. E2E testing with demo protocol

---

## Key Architecture Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| **UI** | @solana/react-hooks | Modern, typed, wallet-standard first |
| **SDK** | @solana/kit | Type-safe, no web3.js leakage |
| **Client Gen** | Codama | Single source of truth (IDL) |
| **Unit Tests** | Mollusk | In-process, fast (no validator) |
| **Legacy Compat** | web3-compat adapter | Isolates web3.js for Wormhole/libraries |
| **Program** | Anchor | Mature, fast iteration, IDL first |

---

## Risk Notes

### Wormhole NTT Integration
- Wormhole SDK may depend on web3.js internally
- **Mitigation**: Use `web3-compat.ts` adapter for VAA verification + GenMsg
- Keep kit types in business logic, web3.js only in Wormhole wrapper

### Testing Coverage
- Mollusk covers unit tests well
- **Surfpool** (integration test) needed for VAA verification + Wormhole messaging
- Add `surfpool` to devDependencies when ready for integration tests

### Migration Accounts
- PDAs must be derived using kit `Address` types
- Verify merkle proofs with proper BigInt handling (not u64 casting)

---

## Commands Quick Reference

```bash
# Install dependencies
npm install

# Generate Codama clients
npx @solana/codama-cli generate --idl frontend/src/codama/necrobridge.idl.ts

# Run Mollusk unit tests
npm test

# Build Anchor program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Lint
npm run lint

# Type check
npm run type-check
```

---

**Status**: ✅ ModernSolana stack integrated  
**Next**: Codama codegen + Mollusk tests + Devnet deploy
