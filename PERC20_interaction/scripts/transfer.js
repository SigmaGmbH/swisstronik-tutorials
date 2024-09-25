// Import necessary modules from Hardhat and SwisstronikJS
const { network, web3 } = require("hardhat");
const { abi } = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");
const { SwisstronikPlugin } = require("@swisstronik/web3-plugin-swisstronik");

async function main() {
  // Register the Swisstronik plugin
  web3.registerPlugin(new SwisstronikPlugin(network.config.url));

  // Address of the deployed contract
  const contractAddress = "CONTRACT_ADDRESS";

  // Get the signer (your account)
  const [from] = await web3.eth.getAccounts();
  const to = "RECEIVER_ADDRESS";
  const amount = 1*10**18;

  console.log("Transferring tokens from account", from);

  // Create a contract instance
  const contract = new web3.eth.Contract(abi, contractAddress);

  // Call the transfer function
  const transferTx = await contract.methods.transfer(to, amount).send({ from });

  console.log("Transaction Receipt: ", transferTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
