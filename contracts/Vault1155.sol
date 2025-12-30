// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vault1155 is ERC1155, Ownable {
    struct VaultMeta {
        string vaultId;
        uint256 maxSupply;
        bool active;
    }

    mapping(uint256 => VaultMeta) public vaults;

    constructor(string memory uri_) ERC1155(uri_) {}

    function createVault(
        uint256 tokenId,
        string calldata vaultId,
        uint256 maxSupply
    ) external onlyOwner {
        require(vaults[tokenId].maxSupply == 0, "Vault exists");
        vaults[tokenId] = VaultMeta(vaultId, maxSupply, true);
    }

    function mint(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        require(vaults[tokenId].active, "Vault inactive");
        require(
            totalSupply(tokenId) + amount <= vaults[tokenId].maxSupply,
            "Exceeds supply"
        );
        _mint(to, tokenId, amount, "");
    }

    function totalSupply(uint256 id) public view returns (uint256) {
        return balanceOf(address(this), id);
    }
}
