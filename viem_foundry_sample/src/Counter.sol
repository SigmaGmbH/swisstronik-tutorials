// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import "@openzeppelin-contracts-5.2.0/utils/Base64.sol";
import "@openzeppelin-contracts-5.2.0/utils/Strings.sol";

contract Counter {
    uint256 public number;

    event NumberOperation(
        uint256 indexed newValue,
        string encodedData
    );

    function setNumber(uint256 newNumber) public {
        number = newNumber;

        string memory encoded = Base64.encode(bytes(string(abi.encodePacked("Operation: Set, Value: ", Strings.toString(newNumber)))));

        emit NumberOperation(newNumber, encoded);
    }

    function increment() public {
        number++;
    }
}
