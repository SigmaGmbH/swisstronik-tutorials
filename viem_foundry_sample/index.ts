import {
  createSwisstronikClient,
  swisstronikTestnet,
} from "@swisstronik/viem-client";
import { readFileSync } from 'fs';
import { join } from 'path';
import {privateKeyToAccount} from "viem/accounts";
import 'dotenv/config'

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY is required in .env file')
}

const counterArtifact = JSON.parse(
  readFileSync(
    join(__dirname, 'out/Counter.sol/Counter.json'),
    'utf8'
  )
);

const COUNTER_CONTRACT = "0xYOUR_CONTRACT_ADDRESS";

// Client with decorated Actions, which includes all the Actions available in the library.
// Encrypted RPC, for unencrypted RPC use regular client with https://json-rpc.testnet.swisstronik.com/unencrypted/
const swisstronikClient = createSwisstronikClient({
  chain: swisstronikTestnet,
});

const counterContract = {
  address: COUNTER_CONTRACT,
  abi: counterArtifact.abi,
} as const;

// Create account from private key (add 0x prefix if not present)
const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY.replace('0x', '')}`);

async function main() {
  swisstronikClient.watchContractEvent({
    ...counterContract,
    eventName: 'NumberOperation',
    onLogs: (logs) => {
      console.log(logs)
    }
  });

  // Get balance
  const setNumberTX = await swisstronikClient.writeContract({
    ...counterContract,
    account,
    functionName: "setNumber",
    args: [1291n],
  });

  console.log("setNumber transaction:", setNumberTX);

  const receipt = await swisstronikClient.waitForTransactionReceipt({
    hash: setNumberTX,
    timeout: 30_000, // timeout in milliseconds (default: 0)
  })
  console.log("Tx mined, receipt: ", receipt);


  const number = await swisstronikClient.readContract({
    ...counterContract,
    functionName: "number",
    args: [],
  });

  console.log("number:", number);

}

main();
