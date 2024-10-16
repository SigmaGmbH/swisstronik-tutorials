import { abi } from "./TestContract";
import {
  createSwisstronikClient,
  swisstronikTestnet,
} from "@swisstronik/viem-client";

const SWTR_CONTRACT = "0x8292EAebc2764183e0De8c9088129Ee514d4c292";
const ADDRESS = "0xc288ca632d39c1dC003B9F835D5CFf3c871Ac00F";

// Client with decorated Actions, which includes all the Actions available in the library.
const swisstronikClient = createSwisstronikClient({
  chain: swisstronikTestnet,
});

async function main() {
  // Get balance
  const balanceOf = await swisstronikClient.readContract({
    address: SWTR_CONTRACT,
    abi,
    functionName: "balanceOf",
    args: [ADDRESS],
  });
  console.log("balanceOf:", balanceOf);
}

main();
