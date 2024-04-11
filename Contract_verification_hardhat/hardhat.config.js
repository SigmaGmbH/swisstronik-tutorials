require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
// Remember to use the private key of a testing account
// For better security practices, it's recommended to use npm i dotenv for storing secret variables

// hh verify 0x00ab1e607fAD7E2f6923624b4242A7506397fd2D --contract contracts/Lock.sol:Lock 1893456000

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.19",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com",
      accounts: [`0x` + `${PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `ANY_STRING_WILL_DO`,
    customChains: [
      {
        network: "swisstronik",
        chainId: 1291,
        urls: {
          apiURL: "https://explorer-evm.testnet.swisstronik.com/api",
          browserURL: "https://explorer-evm.testnet.swisstronik.com",
        },
      },
    ],
  },
};
