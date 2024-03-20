const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

/**
 * Make a shielded query/call on the Swisstronik blockchain.
 *
 * @param {object} provider - The provider object for making the call.
 * @param {string} destination - The contract address to call.
 * @param {string} data - Encoded data for the function call.
 *
 * @returns {Promise<Uint8Array>} - Encrypted response from the blockchain.
 */
const sendShieldedQuery = async (provider, destination, data) => {
  // Obtain the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt the call data using SwisstronikJS' encryption function
  const [encryptedData, usedEncryptionKey] = await encryptDataField(
    rpcLink,
    data
  );

  // Execute the query/call using the provider
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the response using SwisstronikJS' decryption function
  return await decryptNodeResponse(rpcLink, response, usedEncryptionKey);
};
// Main function to interact with the contract and retrieve data
async function main() {
  // Address of the deployed contract
  const replace_contractAddress = "0x7D804090e7a1FF0709d743d115bccE6757Bbe208";

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();

  // Create a contract instance
  const replace_contractFactory = await hre.ethers.getContractFactory(
    "TestToken"
  );
  const contract = replace_contractFactory.attach(replace_contractAddress);

  // Perform a shielded query to retrieve data from the contract
  const replace_functionName = "totalSupply";
  const replace_functionArgs = ""; // Replace with specific arguments if required
  const responseMessage = await sendShieldedQuery(
    signer.provider,
    replace_contractAddress,
    contract.interface.encodeFunctionData(
      replace_functionName,
      replace_functionArgs
    )
  );

  // Decode the Uint8Array response into a readable string
  console.log(
    "Decoded response:",
    contract.interface.decodeFunctionResult(
      replace_functionName,
      responseMessage
    )[0]
  );
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
