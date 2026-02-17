const { ethers } = require('ethers');

// Configuration
const ZOMB_CONTRACT = '0x5ef2539ae4555FeC2e6831485097b78d15Fa5e4d';
const SEPOLIA_RPC = 'https://eth-sepolia.g.alchemy.com/v2/demo';
const PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY; // Set this as env var

// ERC20 minimal ABI for transfer
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) public returns (bool)',
  'function balanceOf(address account) public view returns (uint256)',
  'function decimals() public view returns (uint8)',
];

async function sendZombTokens(recipientAddress, amountInTokens = 10) {
  try {
    if (!PRIVATE_KEY) {
      throw new Error('❌ DEPLOYER_PRIVATE_KEY not set in environment variables');
    }

    // Connect to Sepolia
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC);
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);

    console.log(`📝 Sender address: ${signer.address}`);
    console.log(`📨 Recipient address: ${recipientAddress}`);
    console.log(`💰 Amount: ${amountInTokens} ZOMB`);

    // Connect to ZOMB contract
    const zombContract = new ethers.Contract(ZOMB_CONTRACT, ERC20_ABI, signer);

    // Get decimals
    const decimals = await zombContract.decimals();
    const amount = ethers.parseUnits(amountInTokens.toString(), decimals);

    console.log(`\n⏳ Sending ${amountInTokens} ZOMB (${amount} wei)...`);

    // Send transaction
    const tx = await zombContract.transfer(recipientAddress, amount);
    console.log(`✅ Transaction submitted: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt?.blockNumber}`);
    console.log(`✅ Gas used: ${receipt?.gasUsed.toString()}`);

    // Verify balance
    const balance = await zombContract.balanceOf(recipientAddress);
    const humanBalance = ethers.formatUnits(balance, decimals);
    console.log(`\n🎉 New balance for ${recipientAddress}: ${humanBalance} ZOMB`);

    return tx.hash;
  } catch (error) {
    console.error('❌ Error sending tokens:', error.message);
    throw error;
  }
}

// Get recipient from command line args
const recipientAddress = process.argv[2];
const amount = process.argv[3] || 10;

if (!recipientAddress) {
  console.log('Usage: node send-zomb.js <recipient-address> [amount]');
  console.log('Example: node send-zomb.js 0x7e5F4552091A69125d5DfCb7b8C2659029395bdf4 100');
  process.exit(1);
}

if (!ethers.isAddress(recipientAddress)) {
  console.error('❌ Invalid Ethereum address');
  process.exit(1);
}

sendZombTokens(recipientAddress, amount)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
