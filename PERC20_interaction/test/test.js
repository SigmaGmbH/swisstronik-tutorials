const { ethers } = require("hardhat");
const { expect } = require("chai")
const { sendSignedShieldedQuery } = require("./utils");

describe("Sample PERC20", function () {
  let perc20, wallet

  before(async () => {
    // Deploy PERC20Sample.sol
    const PERC20 = await ethers.getContractFactory("PERC20Sample")
    perc20 = await PERC20.deploy()
    await perc20.deployed()

    // We restore wallet from private key, since hardhat signer does not support
    // transaction signing without sending it
    const [signer] = await ethers.getSigners()
    wallet = new ethers.Wallet(process.env.PRIVATE_KEY)
    wallet = wallet.connect(signer.provider)

    // Send 100 uswtr to convert them to PSWTR
    const tx = await wallet.sendTransaction({
        from: wallet.address,
        to: perc20.address,
        value: 100,
    })
    await tx.wait()
  })

  it('Should return signer address', async () => {
    const [signer] = await ethers.getSigners()
    const senderWallet = ethers.Wallet.createRandom().connect(signer.provider)
    const req = await sendSignedShieldedQuery(
        senderWallet,
        perc20.address,
        perc20.interface.encodeFunctionData("getSender", []),
    );

    const result = perc20.interface.decodeFunctionResult("getSender", req)[0]
    expect(result).to.be.equal(senderWallet.address)
  })

  it('Wrap some SWTR into pSWTR and check balance', async () => {
    // Obtain balance
    const req = await sendSignedShieldedQuery(
      wallet,
      perc20.address,
      perc20.interface.encodeFunctionData("getSender", []),
    );

    const result = perc20.interface.decodeFunctionResult("getSender", req)[0]
    expect(result).to.be.equal(wallet.address)
  })
})
