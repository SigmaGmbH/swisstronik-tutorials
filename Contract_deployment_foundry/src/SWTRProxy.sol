// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import {TransparentUpgradeableProxy} from "@openzeppelin/contracts/proxy/transparent/TransparentUpgradeableProxy.sol";

contract SWTRProxy is TransparentUpgradeableProxy {
    constructor(
        address _logic
    ) TransparentUpgradeableProxy(_logic, msg.sender, "") {}

    // We call upgradeToAndCall to this address
    function proxyAdmin() external virtual returns (address) {
        return _proxyAdmin();
    }
}
