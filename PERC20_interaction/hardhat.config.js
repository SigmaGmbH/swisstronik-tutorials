require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: "0.8.18",
  networks: {
    swisstronik: {
<<<<<<< HEAD
      // If you're using local testnet, replace `url` with local json-rpc address
=======
      // If you're using local testnet, replace `url` with local json-rpc address 
>>>>>>> 16f446d9da9d7c449eb73ae6d44d3930df14f4a0
      url: "https://json-rpc.testnet.swisstronik.com/",
      accounts: [`0x` + `${process.env.PRIVATE_KEY}`],
    },
  },
};
