# Demo Cross-Chain contract Swisstronik <-> Bsc Testnet

## Overview
This project demonstrates basic Cross-Chain contract which is using Hyperlane Mailbox to broadcast messages across chains.

The contract itself can be found here: [SampleCrossChainCounter.sol](/hyperlane_sample_crosschain_contract/contracts/SampleCrossChainCounter.sol)

## Useful links

- Swisstronik Faucet: https://faucet.testnet.swisstronik.com
- BSC Testnet Faucet: https://www.bnbchain.org/en/testnet-faucet

## Socials

- Discord: https://link.swisstronik.com/a46c36
- Twitter: https://twitter.com/swisstronik

## Build
Install dependencies:
```sh
npm install
```
Compile contracts:
```sh
npm run compile
```

## Deploy
We will deploy 2 instances of `SampleCrossChainCounter`, one in Swisstronik and one in BSC Testnet.

Before deployment, create `.env` file by running the following command:
```sh
cp .env.sample .env
```
Then, in `.env` file, fill `DEPLOYER_KEY` env var with private key, which will be used to deploy contracts in both networks. Account, associated with this private key, should be funded in both networks.

Optional - 

When `.env` file is fulfilled, you can deploy contracts using the following command:
```sh
npm run deploy
```
Command above will output you contract addresses in both networks. If you want, you can use those custom deployed contracts with your .env file.

## Interact

We've prepared multiple scripts for interaction with deployed contracts.

You can use these scripts with already deployed contracts.
However,if you wish you can deploy your own and update contract addresses in .env file to addresses of deployed contracts.

- `BSC_TESTNET_CONTRACT_ADDRESS` should be filled with address of `SampleCrossChainCounter` deployed in BSC Testnet
- `SWISSTRONIK_CONTRACT_ADDRESS` should be filled with address of `SampleCrossChainCounter` deployed in Swisstronik

### Increment counter in BSC Testnet

We will start from incrementing counter in BSC Testnet network. You can use the command below:
```sh
npm run increment:bsctestnet
```
The command above will output you previous and new value of counter. During the counter update, the contract calls `dispatch` function at Hyperlane Mailbox to increment value at Swisstronik `SampleCrossChainCounter` instance also.

The cross-chain transaction takes about 1 minute. You can check, if cross-chain transaction was succeed by checking state of Swisstronik's instance. You can use command below to check counter state in Swisstronik:
```sh
npm run counter:swisstronik
```

### Increment counter in Swisstronik Network

To increment counter in Swisstronik and sync its value with BSC Testnet instance, you can use the following command:
```sh
npm run increment:swisstronik
```
The command above works the same as in BSC Testnet, but now Swisstronik instance calls Hyperlane Mailbox, deployed in Swisstronik, to initiate cross-chain transaction.

You can check if cross-chain transaction from Swisstronik to BSC Testnet was succeed by running the following command:
```sh
npm run counter:bsctestnet
```
