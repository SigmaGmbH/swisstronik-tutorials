import { AbiInput, Web3 } from "web3";
import { abi } from "./TestContract";
import { SwisstronikPlugin } from "@swisstronik/web3-plugin-swisstronik";
import { encryptDataField, decryptNodeResponse } from "@swisstronik/utils";

const NODE_HTTP_URL = "https://json-rpc.testnet.swisstronik.com";
const SWTR_CONTRACT = "0x8292EAebc2764183e0De8c9088129Ee514d4c292";
const ADDRESS = "0xc288ca632d39c1dC003B9F835D5CFf3c871Ac00F";

const web3 = new Web3(NODE_HTTP_URL);
web3.registerPlugin(new SwisstronikPlugin());

function getContract() {
  return new web3.eth.Contract(abi, SWTR_CONTRACT);
}

async function sendShieldedQuery(destination: string, data: string) {
  let encryptedData: string;
  let usedEncryptionKey: Uint8Array;

  // Encrypt the call data using SwisstronikJS's encryption function
  [encryptedData, usedEncryptionKey] = await encryptDataField(
    NODE_HTTP_URL,
    data
  );

  // Execute the query/call using the provider
  const response = await web3.eth.call({
    to: destination,
    data: encryptedData,
  });

  // Decrypt the response using SwisstronikJS's decryption function
  const decryptedResponse = await decryptNodeResponse(
    NODE_HTTP_URL,
    response,
    usedEncryptionKey!
  );

  return "0x" + Buffer.from(decryptedResponse).toString("hex");
}

function decodeCall(methodName: string, bytes: string) {
  const input = (abi.find((x) => x.name === methodName) as any)
    ?.outputs as AbiInput[];

  return web3.eth.abi.decodeParameters(input, bytes);
}

async function balanceOfWithPlugin() {
  const contract = new web3.swisstronik.Contract(abi, SWTR_CONTRACT);
  const balanceOf = await contract.methods.balanceOf(ADDRESS).call();
  console.log("balanceOfWithPlugin:", balanceOf);
}

async function balanceOfWithoutPlugin() {
  const contract = new web3.eth.Contract(abi, SWTR_CONTRACT);
  const data = contract.methods.balanceOf(ADDRESS).encodeABI();
  const responseMessage = await sendShieldedQuery(SWTR_CONTRACT, data);

  const balanceOf = decodeCall("balanceOf", responseMessage)[0];
  console.log("balanceOfWithoutPlugin:", balanceOf);
}

async function main() {
  console.log("Doing swisstronik call...");
  await balanceOfWithPlugin();
  await balanceOfWithoutPlugin();
}

main();
