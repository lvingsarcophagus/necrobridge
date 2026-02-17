#!/bin/bash

# NecroBridge Sepolia Deployment Checker
# Verifies your setup before deploying to Sepolia

echo "🔍 NecroBridge Sepolia Deployment Checker"
echo "========================================="
echo ""

# Check .env file
if [ ! -f ".env" ]; then
  echo "❌ .env file not found!"
  echo ""
  echo "Create it from template:"
  echo "  cp .env.local .env"
  echo ""
  exit 1
fi

echo "✓ .env file found"
echo ""

# Check for required env variables
check_env_var() {
  local var_name=$1
  local var_value=$(grep "^${var_name}=" .env | cut -d'=' -f2- | sed 's/"//g')
  
  if [ -z "$var_value" ] || [ "$var_value" = "YOUR_INFURA_PROJECT_ID" ] || [ "$var_value" = "YOUR_API_KEY_HERE" ] || [ "$var_value" = "0xYourMetaMaskPrivateKeyHere" ]; then
    echo "❌ ${var_name} not configured"
    return 1
  else
    echo "✓ ${var_name} configured"
    return 0
  fi
}

echo "📋 Checking environment variables..."
check_env_var "SEPOLIA_RPC_URL"
rpc_ok=$?
check_env_var "PRIVATE_KEY"
key_ok=$?

echo ""

if [ $rpc_ok -ne 0 ] || [ $key_ok -ne 0 ]; then
  echo "⚠️  Missing required configuration!"
  echo ""
  echo "Get these values:"
  echo ""
  echo "1️⃣  SEPOLIA_RPC_URL"
  echo "   👉 Go to https://www.infura.io"
  echo "   👉 Sign up (free)"
  echo "   👉 Create new project → select Sepolia"
  echo "   👉 Copy RPC URL: https://sepolia.infura.io/v3/YOUR_PROJECT_ID"
  echo ""
  echo "2️⃣  PRIVATE_KEY"
  echo "   👉 Open MetaMask"
  echo "   👉 Go to: Settings → Security & Privacy"
  echo "   👉 Click: Show Private Key"
  echo "   👉 Copy it (includes 0x prefix)"
  echo "   ⚠️  NEVER share this!"
  echo ""
  echo "3️⃣  Sepolia Test ETH"
  echo "   👉 Get from https://sepoliafaucet.com"
  echo "   👉 Need ~0.01 SEP for deployment"
  echo ""
  echo "Then update .env and run again:"
  echo "  bash check-setup.sh"
  echo ""
  exit 1
fi

echo "✅ All checks passed!"
echo ""
echo "🚀 Ready to deploy to Sepolia!"
echo ""
echo "Run deployment:"
echo "  pnpm hardhat run scripts/deploy.js --network sepolia"
echo ""
