#!/bin/bash

# NecroBridge Anchor Program Build Script
# Run this in WSL2 or Linux to build the necro_migrate program

set -e

echo "🔨 Building NecroBridge Anchor Program..."
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command -v rustc &> /dev/null; then
    echo "❌ Rust not found. Installing..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

if ! command -v solana &> /dev/null; then
    echo "❌ Solana CLI not found. Installing..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.12/install)"
    export PATH="/root/.local/share/solana/install/active_release/bin:$PATH"
fi

if ! command -v anchor &> /dev/null; then
    echo "❌ Anchor not found. Installing..."
    cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked
fi

echo -e "${GREEN}✓ All dependencies ready${NC}"

# Build
echo ""
echo -e "${YELLOW}Building program...${NC}"
cargo build --release

# Check build
if [ -f "target/release/necro_migrate.so" ]; then
    SIZE=$(ls -lh target/release/necro_migrate.so | awk '{print $5}')
    echo -e "${GREEN}✓ Build successful!${NC}"
    echo "   Program: target/release/necro_migrate.so ($SIZE)"
else
    echo "❌ Build failed - .so file not found"
    exit 1
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Configure Solana CLI for devnet:"
echo "   solana config set --url devnet"
echo ""
echo "2. Create a keypair (if needed):"
echo "   solana-keygen new --outfile ~/.config/solana/devnet-keypair.json"
echo ""
echo "3. Request devnet SOL:"
echo "   solana airdrop 10"
echo ""
echo "4. Deploy:"
echo "   cd /path/to/necrobridge"
echo "   anchor deploy --provider.cluster devnet"
