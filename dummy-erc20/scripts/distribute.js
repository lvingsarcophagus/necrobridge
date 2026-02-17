const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  if (!process.env.TOKEN_ADDRESS) {
    console.error("❌ TOKEN_ADDRESS not set in .env");
    process.exit(1);
  }

  console.log("📦 Distributing tokens from:", deployer.address);

  const DummyToken = await hre.ethers.getContractAt("DummyToken", process.env.TOKEN_ADDRESS);

  // Detect ethers version for API compatibility
  const parseUnits = hre.ethers.parseUnits || hre.ethers.utils.parseUnits;
  const formatUnits = hre.ethers.formatUnits || hre.ethers.utils.formatUnits;

  // Test wallet addresses (update these)
  const testWallets = [
    {
      address: "0x1234567890123456789012345678901234567890", // placeholder
      amount: parseUnits("10000", 18), // 10k tokens
      name: "Test Wallet 1",
    },
    {
      address: "0x0987654321098765432109876543210987654321", // placeholder
      amount: parseUnits("50000", 18), // 50k tokens
      name: "Test Wallet 2",
    },
  ];

  for (const wallet of testWallets) {
    try {
      const tx = await DummyToken.transfer(wallet.address, wallet.amount);
      await tx.wait();
      console.log(`✅ Sent ${formatUnits(wallet.amount, 18)} ZOMB to ${wallet.name} (${wallet.address})`);
    } catch (error) {
      console.error(`❌ Failed to send to ${wallet.name}:`, error.message);
    }
  }

  console.log("\n✅ Distribution complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
