// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;
import {ISWTRProxy} from "@swisstronik/sdi-contracts/contracts/interfaces/ISWTRProxy.sol";

//This contract is only intended for testing purposes

contract Swisstronik {
    string private message;


    ISWTRProxy public swtrProxy;

    function getLatestIssuers() public returns (address[]) {
        uint256 count = swtrProxy.issuerRecordCount();

        //TODO: rest of the function
    }

    /**
     * @dev Constructor is used to set the initial message for the contract
     * @param _message: The message to be associated to the message variable
     */
    constructor(string memory _message) payable {
        message = _message;
        swtrProxy = ISWTRProxy(0xBF896E5616d12fE6Bd7a376D2DBb924ff531CFDF);
    }

    /**
     * @dev setMessage() updates the stored message in the contract
     * @param _message The new message to replace the existing one
     */
    function setMessage(string memory _message) public {
        message = _message;
    }

    /**
     * @dev getMessage() retrieves the currently stored message in the contract
     * @return The message associated with the contract
     */
    function getMessage() public view returns(string memory){
        return message;
    }
}
