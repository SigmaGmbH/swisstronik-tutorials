import { ethers } from "hardhat";

async function main() {
  const tx = await ethers.deployContract("PERC20Sample");
  await tx.waitForDeployment();
  
  console.log(`PERC20Sample was deployed to ${tx.target}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
