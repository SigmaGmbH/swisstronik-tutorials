// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {Test, console} from "forge-std/Test.sol";

contract Counter {
    uint256 public number;

    function setNumber(uint256 newNumber) public {
        number = newNumber;
        console.log("Number set to: %d", number);
    }

    function increment() public {
        number++;
        console.log("Number incremented to: %d", number);
    }
}
