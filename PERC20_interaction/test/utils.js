const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const hre = require("hardhat");
const { web3 } = require("hardhat");
const { decodeMethodReturn } = require("web3-eth-contract");

const NODE_URL = hre.network.config.url;


module.exports.hexStripZeros = (value) => {
  value = value.substring(2);
  let offset = 0;
  while (offset < value.length && value[offset] === "0") { offset++; }
  return "0x" + value.substring(offset);
}

module.exports.decodeCall = (abi, methodName, bytes) => {
  const abiFragment = abi.find((x) => x.name === methodName);

  return decodeMethodReturn(abiFragment, bytes);
};

module.exports.sendShieldedQuery = async (destination, data, value) => {
  // Encrypt call data
  const [encryptedData, usedEncryptedKey] = await encryptDataField(
    NODE_URL,
    data
  );

  // Do call
  const response = await web3.eth.call({
    to: destination,
    data: encryptedData,
    value,
  });

  // Decrypt call result
  const decryptedResponse = await decryptNodeResponse(
    NODE_URL,
    response,
    usedEncryptedKey
  );
  return "0x" + Buffer.from(decryptedResponse).toString("hex");
};

module.exports.sendSignedShieldedQuery = async (wallet, destination, data) => {
  // Encrypt call data
  const [encryptedData, usedEncryptedKey] = await encryptDataField(
    NODE_URL,
    data
  );

  // Get chain id for signature
  const chainId = await web3.eth.getChainId();

  // We use nonce to create some kind of reuse-protection
  const nonce = await web3.eth.getTransactionCount(wallet.address);

  const gasPrice = await web3.eth.getGasPrice();

  // We treat signed call as a transaction, but it will be sent using eth_call
  const callData = {
    from: wallet.address,
    to: destination,
    data: encryptedData,
    chainId: web3.utils.toHex(chainId),
    nonce: web3.utils.toHex(nonce),
    gasPrice: web3.utils.toHex(gasPrice),
    gas: web3.utils.toHex(100_000n), // It is important to use `gas`, not `gasLimit`
  };

  const signedTx = await wallet.signTransaction(callData);
  const callParams = {
    ...callData,
    v: this.hexStripZeros(signedTx.v),
    r: this.hexStripZeros(signedTx.r),
    s: this.hexStripZeros(signedTx.s),
  }

  // Do the call
  const response = await web3.eth.provider.request({method: "eth_call", params: [callParams, "latest"]});

  // Decrypt call result
  const decryptedResponse = await decryptNodeResponse(
    NODE_URL,
    response,
    usedEncryptedKey
  );
  return "0x" + Buffer.from(decryptedResponse).toString("hex");
};
