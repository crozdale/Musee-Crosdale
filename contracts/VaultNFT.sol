
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VaultNFT is ERC721, Ownable {
    uint256 public tokenId;
    address public fractionalToken;

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_) {}

    function mintToVault(address vaultAddress) external onlyOwner {
        tokenId++;
        _mint(vaultAddress, tokenId);
    }

    function setFractionalToken(address token) external onlyOwner {
        fractionalToken = token;
    }
}
