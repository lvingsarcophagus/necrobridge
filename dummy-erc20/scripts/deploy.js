const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Account balance:", (await deployer.provider.getBalance(deployer.address)).toString());

  const DummyToken = await hre.ethers.getContractFactory("DummyToken");
  const dummyToken = await DummyToken.deploy();

  // Handle both ethers v5 and v6
  const deploymentTx = await dummyToken.deploymentTransaction();
  if (deploymentTx) {
    await deploymentTx.wait();
  } else if (dummyToken.deployed) {
    await dummyToken.deployed();
  } else if (dummyToken.waitForDeployment) {
    await dummyToken.waitForDeployment();
  }

  const tokenAddress = dummyToken.address || (await dummyToken.getAddress());

  console.log("\n✅ DummyToken deployed to:", tokenAddress);
  console.log("\n📋 Add this to your NecroBridge app:");
  console.log(`Sepolia Contract Address: ${tokenAddress}`);
  console.log("Symbol: ZOMB");
  console.log("Name: Zombie Token");
  console.log("Decimals: 18");
  console.log("Total Supply: 1,000,000 ZOMB");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
