// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
    FACINATIONS — FRACTIONAL VAULT CONTRACT
    --------------------------------------
    • ERC-1155 fractional ownership
    • EIP-2981 royalty support
    • Designed for secondary market compatibility
*/

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract FractionalVault is ERC1155, IERC2981, Ownable {
    // ===============================
    // Vault Metadata
    // ===============================

    string public vaultId;
    string public legalURI;

    // ===============================
    // Royalty Configuration
    // ===============================

    address private _royaltyReceiver;
    uint96 private _royaltyFee; // basis points (e.g. 500 = 5%)

    // ===============================
    // Constructor
    // ===============================

    constructor(
        string memory _vaultId,
        string memory _uri,
        string memory _legalURI,
        address royaltyReceiver_,
        uint96 royaltyFee_
    ) ERC1155(_uri) {
        vaultId = _vaultId;
        legalURI = _legalURI;
        _royaltyReceiver = royaltyReceiver_;
        _royaltyFee = royaltyFee_;
    }

    // ===============================
    // Minting (Fraction Creation)
    // ===============================

    function mintFraction(
        address to,
        uint256 tokenId,
        uint256 amount
    ) external onlyOwner {
        _mint(to, tokenId, amount, "");
    }

    // ===============================
    // Royalty Standard (EIP-2981)
    // ===============================

    function royaltyInfo(
        uint256,
        uint256 salePrice
    ) external view override returns (address receiver, uint256 royaltyAmount) {
        uint256 amount = (salePrice * _royaltyFee) / 10000;
        return (_royaltyReceiver, amount);
    }

    // ===============================
    // Admin Controls
    // ===============================

    function updateRoyalty(address receiver, uint96 fee) external onlyOwner {
        _royaltyReceiver = receiver;
        _royaltyFee = fee;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
