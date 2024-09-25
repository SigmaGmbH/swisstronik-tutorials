const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const hre = require("hardhat");
const { web3 } = require("hardhat");
const { decodeMethodReturn } = require("web3-eth-contract");

const NODE_URL = hre.network.config.url;

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
    chainId,
    nonce,
    gasPrice,
    gasLimit: 100_000n,
  };

  // Sign the call
  const signedTx = await wallet.signTransaction(callData);

  // Do the call
  const response = await web3.eth.call({
    ...callData,
    v: signedTx.v,
    r: signedTx.r,
    s: signedTx.s,
  });

  // Decrypt call result
  const decryptedResponse = await decryptNodeResponse(
    NODE_URL,
    response,
    usedEncryptedKey
  );
  return "0x" + Buffer.from(decryptedResponse).toString("hex");
};
