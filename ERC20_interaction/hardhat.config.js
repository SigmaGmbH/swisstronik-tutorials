require("@nomicfoundation/hardhat-toolbox");

const PRIVATE_KEY = "d5a63c3b252ef2ac23a65320e6e79e5ddd36dd477b9ee20e86e8c0b7d74e80f4";
// Remember to use the private key of a testing account
// For better security practices, it's recommended to use npm i dotenv for storing secret variables

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.19",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: [`0x` + `${PRIVATE_KEY}`],
    },
  },
};
