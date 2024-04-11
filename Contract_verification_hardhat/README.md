# Contract Verification with Hardhat Etherscan Plugin
 
## Setup

- `npm i`
- Set `PRIVATE_KEY` in hardhat.config.js
- Add Swisstronik Testnet to the list of networks in hardhat.config.js
- For Contract verification, add Swisstronik Tesnet in `etherscan.customChains` in hardhat.config.js
- `etherscan.apiKey` can be any string hardhat.config.js


## Deployment + Verification

You can verify the contract programatically
- Run `npx hardhat run scripts/deploy/deploy_verify.js --network swisstronik`

## Verification using the Hardhat CLI

You can also verify the contract by the CLI
- Run `npx hardhat verify [CONTRACT_ADDRESS] [...constructorArgsParams] --network swisstronik`. Example: `npx hardhat verify 0x0f2846b17D72c1D7679c14e8A2e5c4920b93F2be 1893456010 --network swisstronik`. Check `npx hardhat verify --help` for more info