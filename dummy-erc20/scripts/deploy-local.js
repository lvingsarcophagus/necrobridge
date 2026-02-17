const hre = require("hardhat");

async function main() {
  console.log("🧟 NecroBridge Test Token - Local Deployment");
  console.log("=".repeat(50));
  console.log("");

  const [deployer, wallet1, wallet2, wallet3] = await hre.ethers.getSigners();

  console.log("📋 Test Accounts:");
  console.log(`  Deployer: ${deployer.address}`);
  console.log(`  Wallet 1: ${wallet1.address}`);
  console.log(`  Wallet 2: ${wallet2.address}`);
  console.log(`  Wallet 3: ${wallet3.address}`);
  console.log("");

  // Deploy token
  console.log("🚀 Deploying DummyToken...");
  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const token = await DummyToken.deploy();
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();

  console.log(`✅ DummyToken deployed to: ${tokenAddress}`);
  console.log("");

  // Get initial balance
  const deployerBalance = await token.balanceOf(deployer.address);
  console.log(`💰 Deployer balance: ${hre.ethers.formatUnits(deployerBalance, 18)} ZOMB`);
  console.log("");

  // Distribute tokens
  console.log("📦 Distributing tokens to test wallets...");
  const amounts = [
    { wallet: wallet1, amount: "10000" },
    { wallet: wallet2, amount: "50000" },
    { wallet: wallet3, amount: "25000" },
  ];

  for (const { wallet, amount } of amounts) {
    const tx = await token.transfer(
      wallet.address,
      hre.ethers.parseUnits(amount, 18)
    );
    await tx.wait();
    const balance = await token.balanceOf(wallet.address);
    console.log(
      `  ✓ ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}: ${hre.ethers.formatUnits(balance, 18)} ZOMB`
    );
  }

  console.log("");
  console.log("✅ Test Setup Complete!");
  console.log("");
  console.log("📋 Test Configuration:");
  console.log(`   Token Address: ${tokenAddress}`);
  console.log(`   Symbol: ZOMB`);
  console.log(`   Name: Zombie Token`);
  console.log(`   Decimals: 18`);
  console.log(`   Total Supply: 1,000,000`);
  console.log("");
  console.log("🧪 Test Wallets & Balances:");
  for (const { wallet, amount } of amounts) {
    const balance = await token.balanceOf(wallet.address);
    console.log(
      `   ${wallet.address}: ${hre.ethers.formatUnits(balance, 18)} ZOMB`
    );
  }
  console.log("");
  console.log("📝 Next Steps:");
  console.log("   1. Use this token for local testing");
  console.log("   2. Update .env with SEPOLIA_RPC_URL and PRIVATE_KEY");
  console.log("   3. Run: pnpm hardhat run scripts/deploy.js --network sepolia");
  console.log("");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
