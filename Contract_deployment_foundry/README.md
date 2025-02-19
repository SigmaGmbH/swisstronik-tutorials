# Counter with Foundry

## Install

`forge soldeer update`

## Build

`forge build`

## Import private key into keystore

`cast wallet import dev --interactive`

## Deploy & Verify

To deploy and verify it on the explorer run:


`forge create src/Counter.sol:Counter --account dev --broadcast --rpc-url https://json-rpc.testnet.swisstronik.com  --verifier custom --verifier-api-key ANY --verifier-url https://explorer-evm.testnet.swisstronik.com/api --verify`
