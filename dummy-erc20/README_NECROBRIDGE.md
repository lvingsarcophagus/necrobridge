# Hardhat Dummy ERC-20 Token for NecroBridge Testing

Complete setup for deploying a test ERC-20 token on Sepolia testnet and using it with NecroBridge.

## Quick Start

### 1. Get Sepolia Test ETH
- Visit: https://sepoliafaucet.com
- Or: https://www.alchemy.com/faucets/ethereum-sepolia
- Paste your wallet address and get ~0.5 SEP

### 2. Create `.env` file
Copy `.env.example` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:
```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID
PRIVATE_KEY=0xYourMetaMaskPrivateKeyHere
ETHERSCAN_API_KEY=YourEtherscanApiKeyIfYouWantToVerify
TOKEN_ADDRESS=0xDeployedTokenAddressHere
```

**Get Infura Project ID:**
1. Go to https://www.infura.io
2. Sign up (free)
3. Create a new project → select Sepolia
4. Copy the RPC URL or Project ID

**Get Private Key from MetaMask:**
1. Open MetaMask → Settings → Security & Privacy
2. Show Private Key (requires password)
3. Copy it (includes 0x prefix)

### 3. Deploy Token to Sepolia
```bash
pnpm hardhat run scripts/deploy.js --network sepolia
```

**Output will show:**
```
✅ DummyToken deployed to: 0xAbc123...
📋 Add this to your NecroBridge app:
Sepolia Contract Address: 0xAbc123...
Symbol: ZOMB
Name: Zombie Token
Decimals: 18
Total Supply: 1,000,000 ZOMB
```

Save the contract address! You'll need it for NecroBridge.

### 4. Distribute Tokens to Test Wallets

**Option A: Using distribute.js script**
Edit `scripts/distribute.js` and update `testWallets` array with your addresses:

```javascript
const testWallets = [
  {
    address: "0xYourTestWallet1",
    amount: hre.ethers.parseUnits("10000", 18),
    name: "Test Wallet 1",
  },
  {
    address: "0xYourTestWallet2",
    amount: hre.ethers.parseUnits("50000", 18),
    name: "Test Wallet 2",
  },
];
```

Then run:
```bash
pnpm hardhat run scripts/distribute.js --network sepolia
```

**Option B: Using Hardhat console (interactive)**
```bash
pnpm hardhat console --network sepolia
```

Then in the console:
```javascript
const token = await ethers.getContractAt("DummyToken", "0xYourDeployedAddress");
await token.transfer("0xRecipientAddress", ethers.parseUnits("10000", 18));
```

### 5. Use in NecroBridge

1. Go to http://localhost:3000/nominate
2. Click "Nominate"
3. Fill in:
   - Project Name: `Zombie Token Recovery`
   - Ticker: `ZOMB`
   - Source Chain: `Ethereum`
   - Contract Address: `0xYourDeployedAddress` (from step 3)
   - Reason: `Trustless Zombie token resurrection via merkle snapshot`
4. Click Submit

### 6. Test the Full Flow

1. **Generate Snapshot**
   - Go to /projects → click ZOMB
   - Click "Snapshot + Claims" tab
   - Click "Generate Snapshot"
   - See merkle tree of all holders from Sepolia

2. **View Token Holders**
   - Use Etherscan: https://sepolia.etherscan.io/token/0xYourContractAddress
   - See all your test wallets with their balances

3. **Bridge via Wormhole NTT** (if configured)
   - Burn on Sepolia via bridge
   - Tokens appear on Solana devnet

4. **Claim on Solana**
   - Use your merkle proof
   - Test the full on-chain claim transaction

## Network Details

**Sepolia Testnet:**
- Chain ID: 11155111
- RPC: https://sepolia.infura.io/v3/{YOUR_KEY}
- Block Explorer: https://sepolia.etherscan.io
- Faucet: https://sepoliafaucet.com

## Files

- `contracts/DummyToken.sol` - The ERC-20 token contract
- `scripts/deploy.js` - Deploy to Sepolia
- `scripts/distribute.js` - Distribute tokens to test wallets
- `hardhat.config.js` - Hardhat configuration
- `.env` - Private keys and RPC URLs (NEVER commit!)

## Troubleshooting

**Error: "Insufficient balance"**
- Get more Sepolia ETH from https://sepoliafaucet.com

**Error: "Invalid PRIVATE_KEY format"**
- Make sure it starts with `0x` and is from MetaMask export

**Error: "Cannot find module '@openzeppelin/contracts'"**
- Run: `pnpm i`

**Contract not verified on Etherscan?**
- Set `ETHERSCAN_API_KEY` in .env
- Run: `pnpm hardhat verify --network sepolia 0xYourContractAddress`

## Next Steps

After deploying and distributing:
1. ✅ Deploy ZOMB to Sepolia
2. ✅ Send ZOMB to test wallets
3. ✅ Nominate ZOMB in NecroBridge
4. ✅ View merkle snapshot of holders
5. ✅ Bridge ZOMB to Solana (if NTT configured)
6. ✅ Claim ZOMB on Solana with merkle proof
7. ✅ Verify transaction on Solscan

This is a complete end-to-end test of the NecroBridge migration flow!
