import { encryptDataField, decryptNodeResponse } from "@swisstronik/utils"

export const sendShieldedTransaction = async (
    signer: any,
    destination: string,
    data: string,
    value: number
) => {
    const rpclink = process.env.SWISSTRONIK_RPC;

    // Encrypt transaction data
    const [encryptedData] = await encryptDataField(rpclink!, data);

    // Construct and sign transaction with encrypted data
    return await signer.sendTransaction({
        from: signer.address,
        to: destination,
        data: encryptedData,
        value,
    });
};

export const sendShieldedQuery = async (
    provider: any,
    destination: any,
    data: any
) => {
    const rpclink = process.env.SWISSTRONIK_RPC;

    // Encrypt the call data using the SwisstronikJS function encryptDataField()
    const [encryptedData, usedEncryptedKey] = await encryptDataField(rpclink!, data);

    // Execute the call/query using the provider
    const response = await provider.call({
        to: destination,
        data: encryptedData,
    });

    // Decrypt the call result using function decryptNodeResponse()
    return await decryptNodeResponse(rpclink!, response, usedEncryptedKey);
};