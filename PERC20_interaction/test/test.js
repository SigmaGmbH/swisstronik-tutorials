const { web3 } = require("hardhat");
const { sendSignedShieldedQuery, decodeCall } = require("./utils");
const {
  abi,
  bytecode,
} = require("../artifacts/contracts/PERC20Sample.sol/PERC20Sample.json");
const { expect } = require("chai");

describe("PERC20 Example", function () {
  let perc20, wallet;
  let amount = 100n;

  before(async () => {
    web3.wallet.add("0x" + process.env.PRIVATE_KEY);
    wallet = web3.wallet[0];

    perc20 = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [],
      })
      .send({
        from: wallet.address,
      });

    // Convert some uswtr to pSWTR token
    await web3.eth.sendTransaction(
      {
        from: wallet.address,
        to: perc20.options.address,
        value: amount,
      },
      null,
      {
        checkRevertBeforeSending: false,
      }
    );
  });

  it("Should obtain balance with signed query", async () => {
    const res = await sendSignedShieldedQuery(
      wallet,
      perc20.options.address,
      perc20.methods.balanceOf(wallet.address).encodeABI()
    );
    console.log("res: ", res);
    const balance = decodeCall(abi, "balanceOf", res);
    console.log("balance: ", balance);

    expect(balance).to.equal(amount);
  });
});
