#!/bin/bash

# Deploy NecroBridge Anchor Program to Solana Devnet
# Prerequisites:
# - Solana CLI installed and configured for devnet
# - Wallet with devnet SOL funded
# - Anchor CLI installed

set -e

echo "🚀 Deploying NecroBridge to Solana Devnet"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}Checking prerequisites...${NC}"

if ! command -v solana &> /dev/null; then
    echo -e "${RED}❌ Solana CLI not found${NC}"
    exit 1
fi

if ! command -v anchor &> /dev/null; then
    echo -e "${RED}❌ Anchor CLI not found${NC}"
    exit 1
fi

# Verify devnet config
CLUSTER=$(solana config get | grep "RPC URL" | awk '{print $NF}')
if [[ $CLUSTER != *"devnet"* ]]; then
    echo -e "${YELLOW}Setting Solana cluster to devnet...${NC}"
    solana config set --url devnet
fi

# Check wallet balance
echo -e "${YELLOW}Checking wallet balance...${NC}"
BALANCE=$(solana balance | awk '{print $1}')
echo "Current SOL balance: $BALANCE"

if (( $(echo "$BALANCE < 1" | bc -l) )); then
    echo -e "${RED}❌ Insufficient SOL balance (need at least 1 SOL)${NC}"
    echo "Request devnet SOL:"
    echo "  solana airdrop 10"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

# Build program
echo ""
echo -e "${YELLOW}Building program...${NC}"
cargo build --release

if [ ! -f "target/release/necro_migrate.so" ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build successful${NC}"

# Deploy
echo ""
echo -e "${YELLOW}Deploying to devnet...${NC}"
anchor deploy --provider.cluster devnet

# Get program ID
PROGRAM_ID=$(solana address -p target/deploy/necro_migrate-keypair.json 2>/dev/null || echo "Fg6PaFpoGXkYsLMsmcNb9hQkpQxcZcwX5KHZewF34Zap")

echo ""
echo -e "${GREEN}✅ Deployment successful!${NC}"
echo ""
echo "Program ID: $PROGRAM_ID"
echo ""
echo "Verify deployment:"
echo "  solana program show $PROGRAM_ID --url devnet"
echo ""
echo "View in Solana Explorer:"
echo "  https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
