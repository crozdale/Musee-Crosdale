// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FractionalToken is ERC20 {
    address public vault;

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 totalSupply_,
        address vaultAddress
    ) ERC20(name_, symbol_) {
        vault = vaultAddress;
        _mint(vaultAddress, totalSupply_);
    }
}
