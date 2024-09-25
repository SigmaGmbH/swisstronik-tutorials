const { web3 } = require("hardhat");
const {
  abi,
  bytecode,
} = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");

async function main() {
  // Get the signer (your account)
  const [deployer] = await web3.eth.getAccounts();
  console.log(`Deploying contract with the account: ${deployer}`);

  const perc20 = await new web3.eth.Contract(abi)
    .deploy({
      data: bytecode,
      arguments: [],
    })
    .send({
      from: deployer,
    });

  console.log(`PERC20Sample was deployed to ${perc20.options.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// The deployed() function is no longer available on the contract instance returned by deployContract().
// Instead, the contract is considered deployed as soon as deployContract() resolves.
// this modified script solved the error of "TypeError: perc20.deployed is not a function"
