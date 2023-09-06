# Example of PERC20 (Private ERC20)

This project demonstrates a basic PERC20 contract without comprensive access-control logic. The main differences between ERC20 and PERC20 are protected `balanceOf` function and disabled `Transfer` and `Approval` events

### Build

To compile contracts, use following command:
`npm run compile`

### Testing

<b>NOTE</b>: tests are not compatible with hardhat network / ganache, so you have to start Swisstronik local node or use public testnet



Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
