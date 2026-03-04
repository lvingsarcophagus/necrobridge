# Technology Stack

## Build System

- **Package Manager**: pnpm (frontend), cargo (Rust programs)
- **Build Tool**: Anchor CLI 0.30+ for Solana programs
- **Deployment**: Netlify (frontend), Solana CLI (programs)

## Frontend Stack (Modern 2026)

### Core Framework
- **Next.js 16** with App Router (React 19)
- **TypeScript 5.0+** with strict mode
- **Tailwind CSS v4** (zero-runtime, ~40% smaller bundles)

### Solana Integration
- **@solana/web3.js** v1.95.0 (legacy compatibility)
- **@solana/client** v1.7.0 (modern typed client)
- **@solana/kit** v6.0.1 (framework-kit patterns)
- **@solana/wallet-adapter** for wallet connections
- **@coral-xyz/anchor** v0.32.1 for program interaction

### Cross-Chain
- **ethers.js v6** for Ethereum Sepolia integration
- **@wormhole-foundation/sdk** v0.8.0 for cross-chain messaging
- **merkletreejs** v0.3.11 for proof generation

### UI Libraries
- **Radix UI** for accessible components
- **Lucide React** for icons
- **class-variance-authority** for component variants
- **tailwind-merge** for className utilities

### State & Data
- **SWR** for data fetching and caching
- **Firebase** v12.9.0 for real-time voting data
- **Axios** for API requests

## Backend Stack

### Solana Programs
- **Anchor Framework 0.30** (Rust-based)
- **anchor-lang** and **anchor-spl** for SPL token operations
- **spl-token v4** for token program interactions
- **sha2** and **blake3** for cryptographic hashing

### Testing
- **Mollusk SDK** for fast in-process unit tests (no validator needed)
- **Playwright** for E2E frontend testing
- **Jest** for unit testing

## Development Tools

### Code Generation
- **Codama CLI** v1.4.4 for IDL-based client generation
- **@codama/nodes-from-anchor** for Anchor IDL parsing

### Linting & Formatting
- **ESLint** with Next.js config
- **TypeScript** type checking

## Common Commands

### Frontend Development
```bash
cd frontend

# Install dependencies
pnpm install

# Development server (http://localhost:3000)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Type checking
pnpm type-check

# Run E2E tests
pnpm test
```

### Solana Program Development
```bash
# Build Anchor program
anchor build

# Run tests
anchor test

# Deploy to devnet
solana config set --url devnet
anchor deploy --provider.cluster devnet

# Check program deployment
solana program show 2z3U1Wwq7bgHnkEuD5Yfw97g8uGyimDyRafRar21Bsva
```

### Testing
```bash
# Mollusk unit tests (fast, no validator)
pnpm test

# Playwright E2E tests
cd frontend
pnpm test:ui  # Interactive mode
pnpm test:debug  # Debug mode
```

### Solana CLI Utilities
```bash
# Configure network
solana config set --url devnet

# Request airdrop (devnet only)
solana airdrop 10

# Check balance
solana balance

# Check account info
solana account <ADDRESS>
```

### Code Generation
```bash
# Generate Codama clients from IDL
pnpx @codama/cli generate
```

## Environment Configuration

### Frontend (.env.local)
```bash
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
# Or use Helius for better reliability
NEXT_PUBLIC_RPC_URL=https://devnet.helius-rpc.com/?api-key=YOUR_KEY
```

### Solana CLI
```bash
# Set default keypair
solana config set --keypair ~/.config/solana/id.json

# Set network
solana config set --url devnet  # or mainnet-beta
```

## Architecture Patterns

### Modern Solana Stack (2026)
- **@solana/kit first**: Use typed Address/Signer instead of PublicKey
- **web3-compat boundary**: Isolate legacy web3.js for Wormhole/external libs
- **Codama for codegen**: Single IDL source of truth
- **Mollusk for testing**: Fast in-process tests, no validator overhead

### Frontend Patterns
- **Server Components**: Use React 19 server components where possible
- **Client Components**: Mark interactive components with 'use client'
- **Tailwind v4**: Use design tokens (text-text-primary, bg-surface, etc.)
- **Glass morphism**: backdrop-blur-sm with border-white/10 for cards

### Program Patterns
- **PDA derivation**: Use seeds like `[b"migration", admin, source_chain]`
- **Merkle proofs**: SHA256-based verification for trustless claims
- **Token operations**: Use anchor-spl TokenInterface for SPL compatibility
- **Error handling**: Custom error codes with descriptive messages

## Key Dependencies Versions

| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.0.0 | Frontend framework |
| React | 19.0.0 | UI library |
| Tailwind CSS | 4.0.0 | Styling |
| Anchor | 0.30 | Solana program framework |
| @solana/web3.js | 1.95.0 | Solana client |
| ethers | 6.0.0 | Ethereum integration |
| TypeScript | 5.0.0 | Type safety |

## Build Optimization

- **Tailwind v4**: Zero-runtime CSS, static generation at build time
- **Next.js 16**: Improved compilation, better tree-shaking
- **Anchor release profile**: LTO enabled, optimized for size
- **pnpm**: Efficient dependency management with content-addressable storage
