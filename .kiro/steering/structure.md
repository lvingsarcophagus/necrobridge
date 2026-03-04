# Project Structure

## Root Directory Layout

```
necrobridge/
├── programs/           # Solana programs (Anchor/Rust)
├── frontend/           # Next.js 16 web application
├── dummy-erc20/        # Ethereum test token contracts
├── templates/          # Protocol resurrection templates
├── scripts/            # Deployment and utility scripts
├── tests/              # Integration tests
├── docs/               # Architecture and deployment docs
└── .kiro/              # Kiro AI steering rules
```

## Solana Programs (`/programs`)

### necro_migrate
Main Anchor program for trustless migrations.

```
programs/necro_migrate/
├── src/
│   └── lib.rs          # Program entry point with all instructions
├── Cargo.toml          # Rust dependencies
├── build.sh            # Build script (Unix)
└── build.bat           # Build script (Windows)
```

**Key Instructions:**
- `initialize_migration`: Create new migration with merkle root
- `claim_tokens`: Verify merkle proof and mint SPL tokens
- `finalize_migration`: Close migration (admin only)
- `initialize_dao_liquidity`: Setup DAO-controlled LP pool
- `contribute_to_dao_lp`: Add tokens to community liquidity

**Account Structures:**
- `Migration`: Stores snapshot root, total supply, admin
- `UserClaim`: Tracks claimed status per user
- `DAOLiquidity`: Manages community LP reserves
- `Governance`: Voting state (future)

## Frontend (`/frontend`)

### Next.js 16 App Router Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page
│   │   ├── dashboard/          # Main dashboard
│   │   ├── projects/           # Project listing
│   │   ├── leaderboard/        # Voting leaderboard
│   │   ├── nominate/           # Project nomination
│   │   ├── docs/               # Documentation page
│   │   └── api/                # API routes
│   │       └── migrations/     # Migration endpoints
│   ├── components/             # React components
│   │   ├── MigrationDashboard.tsx
│   │   ├── ClaimInterface.tsx
│   │   ├── GovernanceVoting.tsx
│   │   ├── ClaimTokensInterface.tsx
│   │   ├── Navigation.tsx
│   │   ├── Header.tsx
│   │   ├── Leaderboard.tsx
│   │   └── MetaMaskConnector.tsx
│   ├── hooks/                  # Custom React hooks
│   │   └── useNecrobridge.ts
│   ├── lib/                    # Utilities and clients
│   │   ├── anchor-client.ts    # Anchor program interaction
│   │   ├── config.ts           # Program IDs and constants
│   │   ├── ethereum.ts         # Ethereum Sepolia integration
│   │   ├── merkle-tree.ts      # Merkle proof generation
│   │   ├── claim-transactions.ts
│   │   └── web3-compat.ts      # Legacy web3.js boundary
│   ├── styles/
│   │   └── globals.css         # Tailwind v4 + design tokens
│   └── codama/                 # Generated IDL types
├── public/                     # Static assets
│   └── crypto-icons/           # Token icons (500+)
├── tests/                      # Playwright E2E tests
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

### Component Organization

**Dashboard Pages** (`/app/dashboard`, `/app/projects`, etc.)
- Server components by default
- Use 'use client' for interactive features
- Fetch data via API routes or SWR

**Reusable Components** (`/components`)
- Styled with Tailwind v4 design tokens
- Glass morphism aesthetic (backdrop-blur, border-white/10)
- Accessible via Radix UI primitives

**Hooks** (`/hooks`)
- `useNecrobridge`: Wallet connection and program interaction
- Custom hooks for Solana state management

**Libraries** (`/lib`)
- `anchor-client.ts`: PDA derivation, transaction builders
- `config.ts`: Program IDs, RPC endpoints
- `ethereum.ts`: Sepolia token holder queries
- `merkle-tree.ts`: Proof generation for claims

## Ethereum Integration (`/dummy-erc20`)

Test ERC-20 token for cross-chain bridge testing.

```
dummy-erc20/
├── contracts/
│   └── DummyToken.sol      # ZOMB token (1M supply)
├── scripts/
│   ├── deploy.js           # Sepolia deployment
│   └── distribute.js       # Token distribution
├── send-zomb.js            # Transfer utility
├── hardhat.config.js
└── package.json
```

**Deployed Contract:**
- Address: `0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d`
- Network: Ethereum Sepolia Testnet
- Decimals: 18

## Protocol Templates (`/templates`)

Starter code for resurrected protocols.

```
templates/
├── yield_farm/
│   └── template.rs         # Staking/farming logic
├── lending_vault/
│   └── template.rs         # Collateral + borrowing
└── README.md               # Template usage guide
```

## Scripts (`/scripts`)

Deployment and utility scripts.

```
scripts/
├── deploy-devnet.sh        # Deploy to Solana devnet
├── prepare-deploy.sh       # Pre-deployment checks
└── add-zomb-votes.js       # Add test voting data
```

## Documentation (`/docs`)

Architecture and deployment guides.

```
docs/
├── ARCHITECTURE.md         # System design overview
├── DEPLOYMENT.md           # Mainnet deployment guide
├── SECURITY_CHECKLIST.md   # Pre-launch security audit
└── WORMHOLE_INTEGRATION.md # Cross-chain bridge details
```

## Configuration Files

### Root Level
- `Anchor.toml`: Anchor workspace config, program IDs
- `Cargo.toml`: Rust workspace config
- `package.json`: Root build scripts
- `netlify.toml`: Frontend deployment config

### Frontend
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind v4 theme (necro/grave colors)
- `tsconfig.json`: TypeScript strict mode config
- `playwright.config.ts`: E2E test configuration

## Key File Patterns

### Naming Conventions
- **Components**: PascalCase (e.g., `MigrationDashboard.tsx`)
- **Utilities**: camelCase (e.g., `anchor-client.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `NECROBRIDGE_PROGRAM_ID`)
- **Rust files**: snake_case (e.g., `lib.rs`)

### Import Paths
Use TypeScript path aliases:
```typescript
import { config } from '@/lib/config';
import { MigrationDashboard } from '@/components/MigrationDashboard';
```

### Component Structure
```typescript
'use client'; // If interactive

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export function ComponentName() {
  // Hooks
  const wallet = useWallet();
  const [state, setState] = useState();

  // Handlers
  const handleAction = async () => { };

  // Render
  return (
    <div className="bg-surface border border-white/10">
      {/* Content */}
    </div>
  );
}
```

## Design System Tokens

Located in `frontend/src/styles/globals.css`:

**Colors:**
- `text-text-primary`: #ffffff (main text)
- `text-text-secondary`: #b3b3b3 (secondary text)
- `text-text-muted`: #808080 (disabled text)
- `bg-surface`: #0a0a0a (darkest background)
- `bg-surface-light`: #121212 (cards)
- `bg-surface-lighter`: #1e1e1e (hover states)

**Borders:**
- `border-white/10`: Default borders
- `border-white/20`: Focus/hover borders
- `border-white/30`: Active borders

**Effects:**
- `backdrop-blur-sm`: Glass morphism
- `shadow-lg` → `shadow-2xl`: Elevation on hover
- `hover:-translate-y-1`: Floating card effect

## Build Artifacts

### Generated Files (Git Ignored)
- `target/`: Rust build artifacts
- `frontend/.next/`: Next.js build output
- `frontend/node_modules/`: Dependencies
- `node_modules/`: Root dependencies
- `dummy-erc20/artifacts/`: Hardhat compilation output

### Deployment Artifacts
- `target/deploy/necro_migrate.so`: Compiled Solana program
- `frontend/.next/`: Production build for Netlify

## Working with the Structure

### Adding a New Component
1. Create in `frontend/src/components/`
2. Use design tokens from globals.css
3. Export from component file
4. Import in page using `@/components/`

### Adding a New Program Instruction
1. Add to `programs/necro_migrate/src/lib.rs`
2. Define account struct with `#[derive(Accounts)]`
3. Implement instruction handler
4. Update IDL and regenerate types

### Adding a New Page
1. Create folder in `frontend/src/app/`
2. Add `page.tsx` (and optionally `layout.tsx`)
3. Use server components by default
4. Add 'use client' only if needed

### Adding API Routes
1. Create in `frontend/src/app/api/`
2. Export GET/POST handlers
3. Use Next.js 16 route handler syntax
4. Return JSON responses

## Testing Structure

### Unit Tests
- Mollusk tests in `programs/necro_migrate/tests/`
- Fast, in-process, no validator needed

### E2E Tests
- Playwright tests in `frontend/tests/`
- Test user flows across pages

### Integration Tests
- Root `tests/` directory
- Test program + frontend interaction
