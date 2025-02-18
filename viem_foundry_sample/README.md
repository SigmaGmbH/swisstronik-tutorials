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

`forge create src/Counter.sol:Counter --account dev --broadcast --rpc-url https://json-rpc.testnet.swisstronik.com  --verifier custom --verifier-api-key ANY --verifier-url https://explorer-evm.testnet.swisstronik.com/api --verify --evm-version shanghai`

## Install JS deps

`npm i`

## Add private key to .env for Node

`PRIVATE_KEY=0x.....`

## Run the sample

`npm run start`

You can stop the execution by CTRL+C
