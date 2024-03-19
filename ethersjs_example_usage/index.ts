import { ethers } from "@swisstronik/ethers";
import { abi } from "./TestContract";

const MUMBAI_CONTRACT = "0x2CEc6767FEc921587Ac7A2a35f07b5EFb5088DA0";
const SWTR_CONTRACT = "0x9e7AEfB3eA21DEe24366592B4699e1C7aBD77b80";
const PK = "0x..." // Private key;

function getSigner(isSwisstronik: boolean): ethers.Signer {
    const wallet = new ethers.Wallet(PK);
    if (isSwisstronik) {
        // Construct swisstronik signer
        const provider = new ethers.providers.JsonRpcProvider("https://json-rpc.testnet.swisstronik.com")
        return wallet.connect(provider)
    } else {
        // Construct mumbai signer
        const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/polygon_mumbai")
        return wallet.connect(provider)
    }
}

function getContract(isSwisstronik: boolean): ethers.Contract {
    const signer = getSigner(isSwisstronik);
    return new ethers.Contract(
        isSwisstronik ? SWTR_CONTRACT : MUMBAI_CONTRACT,
        abi,
        signer
    );
}

async function performCall(isSwisstronik: boolean) {
    const contract = getContract(isSwisstronik)
    const res = await contract.counter();
    console.log('call result: ', res)
}

async function performEstimateGas(isSwisstronik: boolean) {
    const contract = getContract(isSwisstronik)
    const res = await contract.estimateGas.counter();
    console.log('estimateGas result: ', res)
}

async function performSendTransaction(isSwisstronik: boolean) {
  const signer = getSigner(isSwisstronik)
  const contract = getContract(isSwisstronik)
  const tx = await contract.populateTransaction.counter();
  const res = await signer.sendTransaction(tx);

  console.log('sendTransaction result: ', res)
}
async function main() {
    console.log("Doing mumbai call...")
    await performCall(false)
    await performEstimateGas(false)
    await performSendTransaction(false)
    console.log("Doing swisstronik call...")
    await performCall(true)
    await performEstimateGas(true)
    await performSendTransaction(true)
}

main()
