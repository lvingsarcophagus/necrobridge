#!/bin/bash
# NecroBridge Setup Script
# Installs all dependencies and builds the project locally

set -e

echo "🧟 NecroBridge Setup"
echo "==================="
echo ""

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo "📦 Installing Rust..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
fi

# Check Solana
if ! command -v solana &> /dev/null; then
    echo "📦 Installing Solana..."
    sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
fi

# Check Anchor
if ! command -v anchor &> /dev/null; then
    echo "📦 Installing Anchor..."
    cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
fi

# Build Anchor program
echo ""
echo "🔨 Building Anchor program..."
anchor build

# Setup frontend
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure Solana: solana config set --url devnet"
echo "  2. Build: anchor build"
echo "  3. Deploy: anchor deploy --provider.cluster devnet"
echo "  4. Test: anchor test"
