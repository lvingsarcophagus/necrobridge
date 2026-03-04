# Product Overview

NecroBridge is a trustless protocol resurrection kit for migrating abandoned blockchain protocols to Solana. Built for the Solana Graveyard Hackathon 2026 (Migrations Track).

## Core Mission

Enable communities to resurrect dead protocols from any blockchain onto Solana trustlessly and on-chain, without manual migrations or trust requirements.

## Key Features

1. **Trustless Token Migration**: Merkle tree-based snapshot verification for cross-chain token claims
2. **Quadratic Governance**: Community voting on resurrection proposals (√SOL staked prevents whale dominance)
3. **Position Claims**: On-chain verification of holder balances with client-side proof generation
4. **DAO Liquidity Pools**: Community-controlled liquidity to prevent "day 2 death"
5. **Protocol Templates**: Starter templates for yield farms, lending vaults, and DAOs

## Architecture

- **Frontend**: Next.js 16 dashboard for project nomination, voting, and token claims
- **Solana Programs**: Anchor-based smart contracts for migration, claims, and governance
- **Cross-Chain Bridge**: Ethereum Sepolia ↔ Solana Devnet integration with real token verification
- **Sunrise DeFi Partnership**: Coordinated market formation for approved projects

## Target Users

- Communities with abandoned protocols seeking revival
- Token holders wanting to migrate positions to Solana
- DAOs looking to resurrect governance on Solana
- Protocol teams coordinating official revivals

## Deployment Status

- Program ID: `2z3U1Wwq7bgHnkEuD5Yfw97g8uGyimDyRafRar21Bsva` (devnet)
- Test Token (ZOMB): `0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d` (Ethereum Sepolia)
- Frontend: Production-ready Next.js 16 application
