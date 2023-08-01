require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: ["0xd5a63c3b252ef2ac23a65320e6e79e5ddd36dd477b9ee20e86e8c0b7d74e80f4"],
    },
  },
};
