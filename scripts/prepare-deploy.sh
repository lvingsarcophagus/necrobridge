#!/bin/bash

# Prepare for NecroBridge Anchor Program Deployment
# This script sets up the environment and checks all prerequisites

set -e

echo "🔧 Preparing for NecroBridge Deployment"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Install Rust
if ! command -v rustc &> /dev/null; then
    echo -e "${YELLOW}Installing Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source $HOME/.cargo/env
    echo -e "${GREEN}✓ Rust installed${NC}"
else
    echo -e "${GREEN}✓ Rust already installed${NC}"
fi

# Install Solana
if ! command -v solana &> /dev/null; then
    echo -e "${YELLOW}Installing Solana CLI...${NC}"
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.12/install)"
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo -e "${GREEN}✓ Solana CLI installed${NC}"
else
    echo -e "${GREEN}✓ Solana CLI already installed${NC}"
fi

# Install Anchor
if ! command -v anchor &> /dev/null; then
    echo -e "${YELLOW}Installing Anchor CLI...${NC}"
    cargo install --git https://github.com/coral-xyz/anchor --tag v0.30.0 anchor-cli --locked
    echo -e "${GREEN}✓ Anchor CLI installed${NC}"
else
    echo -e "${GREEN}✓ Anchor CLI already installed${NC}"
fi

# Setup devnet
echo ""
echo -e "${YELLOW}Setting up Solana devnet...${NC}"
solana config set --url devnet
echo -e "${GREEN}✓ Configured for devnet${NC}"

# Check/create wallet
if [ ! -f ~/.config/solana/id.json ]; then
    echo -e "${YELLOW}Creating wallet...${NC}"
    solana-keygen new --no-bip39-passphrase -o ~/.config/solana/id.json
    echo -e "${GREEN}✓ Wallet created${NC}"
else
    echo -e "${GREEN}✓ Wallet exists${NC}"
fi

# Display wallet address
WALLET=$(solana address)
echo ""
echo "Wallet Address: $WALLET"

# Request devnet SOL
BALANCE=$(solana balance | awk '{print $1}')
echo "Current Balance: $BALANCE SOL"

if (( $(echo "$BALANCE < 1" | bc -l) )); then
    echo ""
    echo -e "${YELLOW}Requesting devnet SOL...${NC}"
    solana airdrop 10 $WALLET --url devnet
    echo -e "${GREEN}✓ Airdrop requested${NC}"
fi

# Final check
echo ""
echo -e "${YELLOW}Verifying versions...${NC}"
rustc --version
cargo --version
solana --version
anchor --version

echo ""
echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Build the program:"
echo "   cargo build --release"
echo ""
echo "2. Deploy to devnet:"
echo "   anchor deploy --provider.cluster devnet"
