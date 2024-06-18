# SWTRPRoxy with Foundry

## Install

`forge soldeer update`

## Build

`forge build`

## Deploy

To deploy implementation run:
`forge create src/SWTRImplementation.sol:SWTRImplementation --rpc-url https://json-rpc.testnet.swisstronik.com --private-key <your_private_key>`

To deploy Proxy run:

`forge create src/SWTRProxy.sol:SWTRProxy --rpc-url https://json-rpc.testnet.swisstronik.com --private-key <your_private_key> --constructor-args <your_implementation>`
