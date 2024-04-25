import { ethers } from "hardhat";
import { sendShieldedTransaction } from "./utils";

const SWISSTRONIK_CHAIN_ID = 1291;
const BSC_TESTNET_CHAIN_ID = 97;

const SWISSTRONIK_MAILBOX = "0x62FDf16882959440FB6E30f262266d7dC74AE09d";
const SWISSTRONIK_MERKLE_TREE_HOOK = "0xae3915bAd34189E8bC5356C4a8E8E466295f54d2";
const SWISSTRONIK_ISM = "0xb28A8333AD28712D48Af2D4AbBA0AFe5f176e125";

const BSC_TESTNET_MERKLE_TREE_HOOK = "0xc6cbF39A747f5E28d1bDc8D9dfDAb2960Abd5A8f";
const BSC_TESTNET_MAILBOX = "0xF9F6F5646F478d5ab4e20B0F910C92F1CCC9Cc6D";
const BSC_TESTNET_ISM = "0xc35376DD9b009c2aB7E62365759897F0365BDa37";

async function main() {
  if (!process.env.DEPLOYER_KEY) {
    console.log('Please specify DEPLOYER_KEY in .env file');
    throw new Error('DEPLOYER_KEY is empty');
  }

  console.log('Preparing signers for both networks');
  const wallet = new ethers.Wallet(process.env.DEPLOYER_KEY);
  const bscTestnetProvider = new ethers.JsonRpcProvider(process.env.BSC_TESTNET_RPC);
  const swisstronikProvider = new ethers.JsonRpcProvider(process.env.SWISSTRONIK_RPC);
  const bscTestnetSigner = wallet.connect(bscTestnetProvider);
  const swisstronikSigner = wallet.connect(swisstronikProvider);

  console.log('Deploying SampleCrossChainCounter to Swisstronik');
  const swtrContract = await ethers.deployContract(
    "SampleCrossChainCounter",
    [
      SWISSTRONIK_MAILBOX,
      SWISSTRONIK_MERKLE_TREE_HOOK,
      BSC_TESTNET_CHAIN_ID, // destination chain id,
      SWISSTRONIK_ISM,
    ],
    swisstronikSigner,
  );
  await swtrContract.waitForDeployment();

  console.log('Deploying SampleCrossChainCounter to BSC Testnet');
  const bscTestnetContract = await ethers.deployContract(
    "SampleCrossChainCounter",
    [
      BSC_TESTNET_MAILBOX,
      BSC_TESTNET_MERKLE_TREE_HOOK,
      SWISSTRONIK_CHAIN_ID, // destination chain id
      BSC_TESTNET_ISM,
    ],
    bscTestnetSigner,
  );
  await bscTestnetContract.waitForDeployment();

  console.log('Configure recipient address in Swisstronik');
  const swisstronikContractAddress = await swtrContract.getAddress();
  const bscTestnetContractAddress = await bscTestnetContract.getAddress();

  const encodedSwtrTxData = swtrContract.interface.encodeFunctionData(
    "setCounterContractInOtherChain",
    [bscTestnetContractAddress]
  );

  await sendShieldedTransaction(
    swisstronikSigner, 
    swisstronikContractAddress,
    encodedSwtrTxData,
    0
  );

  console.log('Configure recipient address in BSC Testnet');
  await bscTestnetContract.setCounterContractInOtherChain(swisstronikContractAddress);

  console.log('Contracts were deployed');
  console.log('Swisstronik: ', swisstronikContractAddress);
  console.log('BSC Testnet: ', bscTestnetContractAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
