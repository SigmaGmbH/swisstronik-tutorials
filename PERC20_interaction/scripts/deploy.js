const { ethers } = require("hardhat");

async function main() {
  const perc20 = await ethers.deployContract("PERC20Sample");
  await perc20.deployed();

  console.log(`PERC20Sample was deployed to ${perc20.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
