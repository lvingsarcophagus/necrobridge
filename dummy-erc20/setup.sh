#!/bin/bash

# NecroBridge Dummy ERC-20 Token Setup Script
# This script validates your setup and provides next steps

echo "🧟 NecroBridge Dummy ERC-20 Token Setup"
echo "======================================"
echo ""

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Check pnpm
if command -v pnpm &> /dev/null; then
  PNPM_VERSION=$(pnpm -v)
  echo "✓ pnpm version: $PNPM_VERSION"
else
  echo "✗ pnpm not found. Install with: npm install -g pnpm"
  exit 1
fi

echo ""
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Create .env file with your secrets:"
echo "   cp .env.local .env"
echo ""
echo "2. Get Sepolia test ETH:"
echo "   👉 https://sepoliafaucet.com"
echo ""
echo "3. Get Infura RPC URL:"
echo "   👉 https://www.infura.io (create project for Sepolia)"
echo ""
echo "4. Get MetaMask private key:"
echo "   👉 MetaMask → Settings → Security & Privacy → Show Private Key"
echo ""
echo "5. Edit .env:"
echo "   - SEPOLIA_RPC_URL: Infura Sepolia URL"
echo "   - PRIVATE_KEY: Your MetaMask private key (with 0x prefix)"
echo ""
echo "6. Deploy token:"
echo "   pnpm hardhat run scripts/deploy.js --network sepolia"
echo ""
echo "7. Update .env with deployed TOKEN_ADDRESS"
echo ""
echo "8. Distribute tokens:"
echo "   - Edit scripts/distribute.js with test wallet addresses"
echo "   - Run: pnpm hardhat run scripts/distribute.js --network sepolia"
echo ""
echo "9. Add to NecroBridge:"
echo "   - Go to http://localhost:3000/nominate"
echo "   - Paste contract address"
echo "   - Submit nomination"
echo ""
echo "10. Test merkle snapshot & claim:"
echo "    - Generate snapshot on NecroBridge"
echo "    - Issue on-chain claim transaction"
echo ""
echo "Happy testing! 🚀"
