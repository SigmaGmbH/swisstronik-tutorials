import {ethers} from "hardhat";
import {encryptDataField, decryptNodeResponse} from "@swisstronik/utils";
import {sendShieldedTransaction} from "./utils"

async function main() {
  // Construct instance of SampleCrossChainCounter in Swisstronik
  const provider = new ethers.JsonRpcProvider(process.env.SWISSTRONIK_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_KEY!);
  const signer = wallet.connect(provider);

  const contract = await ethers.getContractAt("SampleCrossChainCounter", process.env.SWISSTRONIK_CONTRACT_ADDRESS!);

  // Obtain value of counter
  const encodedCounterCall = contract.interface.encodeFunctionData("counter");
  const resBefore = await sendShieldedQuery(provider, process.env.SWISSTRONIK_CONTRACT_ADDRESS!, encodedCounterCall);
  const counterBefore = contract.interface.decodeFunctionResult("counter", resBefore)[0];

  // Send transaction with call of `increment` function
  const encodedIncrementData = contract.interface.encodeFunctionData("incrementCounter");
  const tx = await sendShieldedTransaction(
    signer,
    process.env.SWISSTRONIK_CONTRACT_ADDRESS!,
    encodedIncrementData,
    0
  );
  await tx.wait();

  // Obtain updated counter value
  const resAfter = await sendShieldedQuery(provider, process.env.SWISSTRONIK_CONTRACT_ADDRESS!, encodedCounterCall);
  const counterAfter = contract.interface.decodeFunctionResult("counter", resAfter)[0];

  console.log(`Counter at Swisstronik was updated ${counterBefore} -> ${counterAfter}`);
}

const sendShieldedQuery = async (
  provider: any,
  destination: any,
  data: any
) => {
  const rpclink = process.env.SWISSTRONIK_RPC;

  // Encrypt the call data using the SwisstronikJS function encryptDataField()
  const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink!, data);

  // Execute the call/query using the provider
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the call result using SwisstronikJS function decryptNodeResponse()
  return await decryptNodeResponse(rpclink!, response, usedEncryptedKey);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
