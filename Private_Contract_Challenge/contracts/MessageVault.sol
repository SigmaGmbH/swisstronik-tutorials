// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageVault {
    string private message;

    function writeMessage(string memory _message) public {
        require(bytes(message).length > 0, "Message cannot be empty");
        message = _message;
    }

    function getMessage() public view returns (string memory) {
        return message;
    }

    function deleteMessage() public {
        delete message;
    }

}
