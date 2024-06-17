// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

interface IComplianceBridge {
    struct VerificationData {
        // Verification type
        uint32 verificationType;
        // Verification Id
        bytes verificationId;
        // Verification issuer address
        address issuerAddress;
        // From which chain proof was transferred
        string originChain;
        // Original issuance timestamp
        uint32 issuanceTimestamp;
        // Original expiration timestamp
        uint32 expirationTimestamp;
        // Original proof data (ZK-proof)
        bytes originalData;
        // ZK-proof original schema
        string schema;
        // Verification id for checking(KYC/KYB/AML etc) from issuer side
        string issuerVerificationId;
        // Version
        uint32 version;
    }

    enum VerificationType {
        VT_UNSPECIFIED, // VT_UNSPECIFIED defines an invalid/undefined verification type.
        VT_KYC, // Know Your Custom
        VT_KYB, // Know Your Business
        VT_KYW, // Know Your Wallet
        VT_HUMANITY, // Check humanity
        VT_AML, // Anti Money Laundering (check transactions)
        VT_ADDRESS,
        VT_CUSTOM,
        VT_CREDIT_SCORE
    }

    function addVerificationDetails(
        address userAddress,
        string memory originChain,
        uint32 verificationType,
        uint32 issuanceTimestamp,
        uint32 expirationTimestamp,
        bytes memory proofData,
        string memory schema,
        string memory issuerVerificationId,
        uint32 version
    ) external;

    function hasVerification(
        address userAddress,
        uint32 verificationType,
        uint32 expirationTimestamp,
        address[] memory allowedIssuers
    ) external returns (bool);

    function getVerificationData(
        address userAddress,
        address issuerAddress
    ) external returns (bytes memory);
}
