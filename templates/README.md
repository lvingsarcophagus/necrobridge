# Protocol Templates

Ready-made Anchor program starters for common dead-protocol types.

## Templates Included

1. **yield_farm/** — Staking/yield farming
2. **lending_vault/** — Simple lending protocol
3. **dao_governance/** — DAO voting & treasury (coming)
4. **nft_collection/** — Compressed NFTs (coming)

## Quick Start

1. Copy template directory
2. Replace `declare_id!()` with your program ID
3. Customize state/logic as needed
4. `anchor build && anchor deploy`

## Next Steps

Link to NecroBridge:
- Call `necrobridge::initialize_migration()` with your SPL mint
- Users claim tokens → stake in your template program
- Enable full protocol resurrection
