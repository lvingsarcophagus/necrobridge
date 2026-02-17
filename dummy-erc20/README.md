# 🧟 Dummy ERC-20 Token for NecroBridge Testing

This Hardhat project deploys a dummy `ZOMB` (Zombie Token) on Sepolia testnet for testing the NecroBridge migration and merkle claim flow.

## ✅ Deployment Status

**Token Successfully Deployed!**

```
Contract Address: 0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d
Network: Sepolia Testnet
Name: Zombie Token
Symbol: ZOMB
Supply: 1,000,000 ZOMB
```

View on Etherscan: https://sepolia.etherscan.io/token/0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d

**See [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md) for full details.**

## Quick Start

### Already Deployed ✅

The token is already deployed to Sepolia. To use it with NecroBridge:

1. Go to http://localhost:3000/nominate
2. Enter contract address: `0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d`
3. Vote for approval (need 100%)
4. Generate merkle snapshot
5. Test on-chain claims on Solana

### Manual Setup (for new deployment)

#### 1. Prerequisites

- Node.js 18+
- pnpm (package manager)
- MetaMask or any Ethereum wallet
- Sepolia test ETH from: https://sepoliafaucet.com

#### 2. Configure Environment

The `.env` file is already configured with:
- **SEPOLIA_RPC_URL**: Infura endpoint
- **PRIVATE_KEY**: Deployer account
- **TOKEN_ADDRESS**: Deployed contract address

To redeploy or use different credentials, edit `.env`:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=0xYOUR_PRIVATE_KEY
TOKEN_ADDRESS=0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d
```

#### 3. Deploy New Token (Optional)

```bash
# Install dependencies if needed
pnpm install

# Deploy to Sepolia
pnpm hardhat run scripts/deploy.js --network sepolia

# Copy new token address to .env
# TOKEN_ADDRESS=0xNewAddress...
```

#### 4. Distribute Tokens

Edit test wallet addresses in `scripts/distribute.js`, then:

```bash
pnpm hardhat run scripts/distribute.js --network sepolia
```

#### 5. Use in NecroBridge

Go to: http://localhost:3000/nominate
- Contract: `0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d` (or your new address)
- Name: `Zombie Token`
- Symbol: `ZOMB`
- Decimals: `18`

Vote for 100% approval, then generate snapshot and test claims.

## File Structure

```
dummy-erc20/
├── contracts/
│   └── DummyToken.sol              # ERC-20 contract
├── scripts/
│   ├── deploy.js                   # Deployment script ✅
│   └── distribute.js               # Distribution script
├── hardhat.config.js               # Network configuration
├── package.json                    # Dependencies
├── .env                            # Configuration (with TOKEN_ADDRESS)
├── DEPLOYMENT_COMPLETE.md          # Deployment details
├── README_NECROBRIDGE.md           # Detailed setup guide
└── README.md                       # This file
```

## Project Details

### DummyToken.sol

Standard ERC-20 token with:
- **Name:** Zombie Token
- **Symbol:** ZOMB
- **Supply:** 1,000,000 tokens
- **Decimals:** 18
- **Features:** Basic ERC-20 + public mint()

### Network Configuration

**Sepolia Testnet:**
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/{API_KEY}
- Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com

## Available Commands

```bash
# Compile contract
pnpm hardhat compile

# Deploy to Sepolia
pnpm hardhat run scripts/deploy.js --network sepolia

# Deploy to local Hardhat network
pnpm hardhat run scripts/deploy.js

# Distribute tokens
pnpm hardhat run scripts/distribute.js --network sepolia

# Verify on Etherscan
pnpm hardhat verify --network sepolia 0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d

# Run tests
pnpm hardhat test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No token address" | Run deploy.js first or update .env |
| "Insufficient funds" | Get test ETH from Sepolia faucet |
| "Network error" | Check RPC URL and internet connection |
| "Invalid private key" | Ensure "0x" prefix and correct format |

## Integration with NecroBridge

### End-to-End Flow

```
Sepolia ZOMB → NecroBridge Vote → Merkle Snapshot → On-Chain Claim → Solana Tokens
```

1. **Nominate** ZOMB on NecroBridge
2. **Vote** for approval (100% target)
3. **Generate Snapshot** of all token holders
4. **Claim** with merkle proof on Solana
5. **Receive** tokens in Solana wallet

## Resources

- [Hardhat Documentation](https://hardhat.org)
- [Ethers.js v6](https://docs.ethers.org/v6/)
- [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/latest/tokens/ERC20/)
- [Sepolia Faucet](https://sepoliafaucet.com)
- [Solidity Docs](https://docs.soliditylang.org)

## Notes

- ⚠️ This is a test token on testnet - no real value
- 🔐 Private keys in .env are for testing only
- 🚀 Deployment costs minimal ETH on testnet
- 💰 Get free test ETH from faucets

---

**Status:** Ready for NecroBridge testing
**Contract:** 0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d
**Network:** Sepolia Testnet

For detailed deployment information, see [DEPLOYMENT_COMPLETE.md](./DEPLOYMENT_COMPLETE.md)


1. Go to http://localhost:3000/nominate
2. Paste the `TOKEN_ADDRESS` from step 3 as the contract address
3. Generate snapshot → tokens from all holders appear
4. Bridge via Wormhole NTT → tokens burn on Sepolia, mint on Solana devnet
5. Claim on Solana with merkle proof

## Contract Details

- **Name**: Zombie Token
- **Symbol**: ZOMB
- **Decimals**: 18
- **Initial Supply**: 1,000,000 ZOMB (to deployer)
- **Network**: Sepolia Testnet
- **Source**: OpenZeppelin ERC-20

## Useful Commands

```bash
# Compile contracts
pnpm hardhat compile

# Run tests
pnpm hardhat test

# Deploy to Sepolia
pnpm hardhat run scripts/deploy.js --network sepolia

# Distribute tokens
pnpm hardhat run scripts/distribute.js --network sepolia

# Hardhat console (interactive)
pnpm hardhat console --network sepolia
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid private key" | Check PRIVATE_KEY in .env without `0x` prefix |
| "Network error" | Verify SEPOLIA_RPC_URL is correct and active |
| "Insufficient balance" | Get Sepolia ETH from faucet |
| "Unknown account" | Ensure deployed address is in `.env` |

## View on Sepolia

After deployment, view your contract at:
```
https://sepolia.etherscan.io/address/YOUR_TOKEN_ADDRESS
```

## Next Steps

1. ✅ Deploy & distribute ZOMB on Sepolia
2. → Nominate token in NecroBridge UI
3. → Generate merkle snapshot
4. → Bridge via Wormhole NTT
5. → Claim on Solana devnet
