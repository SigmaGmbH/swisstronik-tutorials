// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { SwisstronikPlugin } = require("@swisstronik/web3-plugin-swisstronik");

hre.web3.registerPlugin(new SwisstronikPlugin(hre.network.config.url));

async function main() {
  // Address of the deployed contract
  const contractAddress = "0x7D804090e7a1FF0709d743d115bccE6757Bbe208";

  // Get the signer (your account)
  const [from] = await hre.web3.eth.getAccounts();

  // Create a contract instance
  const contractFactory = await hre.ethers.getContractFactory("TestToken");

  const ABI = JSON.parse(contractFactory.interface.formatJson());

  const contract = new hre.web3.eth.Contract(ABI, contractAddress);

  const mint100TokensTx = await contract.methods.mint100tokens().send({ from });

  console.log("Transaction Receipt: ", mint100TokensTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
