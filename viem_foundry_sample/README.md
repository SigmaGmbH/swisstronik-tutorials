# Swisstronik Viem Client Example Usage

## Clone forge

`git submodule update --init --recursive`

## Install

`forge soldeer update`

## Build

`forge build`

## Import private key into keystore

`cast wallet import dev --interactive`

## Deploy & Verify

To deploy and verify it on the explorer run:

`forge create src/Counter.sol:Counter --account dev --broadcast --rpc-url https://json-rpc.testnet.swisstronik.com`

## Install JS deps

`npm i`

## Add private key to .env for Node

`PRIVATE_KEY=0x.....`

## Add your contract address

in index.ts:

`const COUNTER_CONTRACT = "0xYOUR_CONTRACT_ADDRESS";`

## Run the sample

`npm run start`

You can stop the execution by CTRL+C
