// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { IMailbox } from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import { IPostDispatchHook } from "@hyperlane-xyz/core/contracts/interfaces/hooks/IPostDispatchHook.sol";
import { IMessageRecipient } from "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";
import { IInterchainSecurityModule, ISpecifiesInterchainSecurityModule } from "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";

// This contract contains basic functionality of cross chain counter. 
// It accepts messages from Hyperlane Mailbox contract and verifies them.
// If message is correct it updates counter in chain where contract was deployed.
contract SampleCrossChainCounter is Ownable, IMessageRecipient, ISpecifiesInterchainSecurityModule {
    // ISM for our contract
    IInterchainSecurityModule public interchainSecurityModule;
    // Hyperlane Mailbox contract to listen to
    IMailbox public mailbox;
    // Hyperlane post dispatch hook. Should be MerkleTreeHook contract instance
    IPostDispatchHook public hook;
    // instance of SampleCrossChainCounter in other chain
    address public counterContractInOtherChain;
    // Current counter state
    uint256 public counter;
    // ID of destination chain
    uint32 public destinationChain;

    event ReceivedCounterValue(uint256 receivedValue);
    event MessageSent(bytes32 messageId);

    modifier onlyMailbox() {
        require(msg.sender == address(mailbox), "This function can be called only by Mailbox");
        _;
    }

    constructor(
        IMailbox _mailbox,
        IPostDispatchHook _hook,
        uint32 _destinationChain,
        IInterchainSecurityModule _ism
    ) Ownable(msg.sender) {
        mailbox = _mailbox;
        hook = _hook;
        destinationChain = _destinationChain;
        interchainSecurityModule = _ism;
    }

    // The Mailbox contract calls this function at `recipient` contract, therefore
    // any contract which want to accept messages from Hyperlane Mailbox should 
    // implement this function.
    //
    // In case of cross chain counter contract, this function does the following:
    //  - handles incoming requests from Hyperlane Mailbox
    //  - checks if messsage was delivered from expected chain
    //  - checks if _sender is CrossChainCounter instance, deployed in other chain
    //  - increments the counter
    //  - emits event with `counter` value in other chain 
    // 
    // We do not set `counter` value in this contract to received `counter` value, because Mailbox 
    // does not guarantee execution order.
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    ) external payable onlyMailbox {
        // Check if message was delivered from expected chain
        require(_origin == destinationChain, "Message was delivered from unknown chain");

        // Check if message was sent by our contract in other chain
        address decodedSender = address(uint160(uint256(_sender)));
        require(decodedSender == counterContractInOtherChain, "Cross-chain transaction should be initiated by CrossChainCounter");

        // Decode message body and emit event
        (uint256 decodedCounterValue) = abi.decode(_message, (uint256));
        emit ReceivedCounterValue(decodedCounterValue);

        // Increment counter value
        counter++;
    }

    // This function increments `counter` in original chain and calls `dispatch` function at Mailbox contract
    // to sync `counter` value with contract, deployed in other chain.
    function incrementCounter() public payable {
        // At least 1 wei should be sent within transaction to cover transaction fees
        require(msg.value > 0, "At least 1 wei should be sent within transaction to cover transaction fees");

        // Increment counter
        counter++;
        
        // Encode recipient address
        bytes32 encodedAddress = bytes32(uint256(uint160(counterContractInOtherChain)));

        // Encode message data
        bytes memory encodedCounterValue = abi.encode(counter);

        // Hook metadata. In our case it can be empty
        bytes memory hookMetadata = new bytes(0);
        
        // Call `dispatch` function at Mailbox contract to broadcast message
        bytes32 messageId = mailbox.dispatch{value: msg.value}(
            destinationChain,
            encodedAddress,
            encodedCounterValue,
            hookMetadata,
            hook
        );

        // Emit event with message id 
        emit MessageSent(messageId);
    }

    function setMailboxAddress(IMailbox _mailbox) public onlyOwner {
        mailbox = _mailbox;
    }

    function setHookAddress(IPostDispatchHook _hook) public onlyOwner {
        hook = _hook;
    }

    function setCounterContractInOtherChain(address _counterContractInOtherChain) public onlyOwner {
        counterContractInOtherChain = _counterContractInOtherChain;
    }

    function setDestinationChain(uint32 _destinationChain) public onlyOwner {
        destinationChain = _destinationChain;
    }

    function setInterchainSecurityModule(address _ism) external onlyOwner {
        interchainSecurityModule = IInterchainSecurityModule(_ism);
    }
}