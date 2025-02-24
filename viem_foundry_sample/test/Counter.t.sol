// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    event NumberOperation(uint256 indexed newValue, string encodedData);

    function setUp() public {
        counter = new Counter();
        counter.setNumber(0);
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }

    function test_SetNumberEvent() public {
        uint256 newNumber = 42;

        string memory expectedEncoded = "T3BlcmF0aW9uOiBTZXQsIFZhbHVlOiA0Mg=="; // "Operation: Set, Value: 42" in Base64

        vm.expectEmit(true, false, false, true);
        emit NumberOperation(newNumber, expectedEncoded);

        counter.setNumber(newNumber);
    }
}
