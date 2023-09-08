# Example of PERC20 (Private ERC20)

This project demonstrates a basic PERC20 contract without comprensive access-control logic. The main differences between ERC20 and PERC20 are protected `balanceOf` function and disabled `Transfer` and `Approval` events

### Build

To compile contracts, use following command:
```sh 
npm run compile
```

### Testing & Deployment

<b>NOTE</b>: tests are not compatible with hardhat network / ganache, so you have to start Swisstronik local node or use public testnet

Create `.env` file from example
```sh
cp example.env .env
```
Add `PRIVATE_KEY` in `.env` with actual private key to interact with network. If you're using other network than local testnet you also should replace `url` in `hardhat.config.ts`

To run tests, use following command:

```sh
npm run test
```

To deploy contracts, use check `scripts/deploy.ts` script and use following command:
```sh
npm run deploy
```
