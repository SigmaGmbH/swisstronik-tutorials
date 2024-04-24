import {ethers} from "hardhat";
import {sendShieldedQuery} from "./utils";

async function main() {
  // Construct instance of SampleCrossChainCounter in Swisstronik
  const provider = new ethers.JsonRpcProvider(process.env.SWISSTRONIK_RPC);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_KEY!);
  const signer = wallet.connect(provider);

  const contract = await ethers.getContractAt("SampleCrossChainCounter",  process.env.SWISSTRONIK_CONTRACT_ADDRESS!);

  // Obtain value of counter
  const encodedCounterCall = contract.interface.encodeFunctionData("counter");
  const resBefore = await sendShieldedQuery(provider, process.env.SWISSTRONIK_CONTRACT_ADDRESS!, encodedCounterCall);
  const counterValue = contract.interface.decodeFunctionResult("counter", resBefore)[0];
  console.log('Counter value in Swisstronik: ', counterValue.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
