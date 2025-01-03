//SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NiceERC721Token is ERC721 {
    constructor() ERC721("NiceNFT", "NNFT") {}

    function mint(address to, uint256 tokenId) public {
        _safeMint(to, tokenId);
    }
}