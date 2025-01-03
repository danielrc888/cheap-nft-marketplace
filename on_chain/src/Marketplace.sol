// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace {
    event AuctionSettled(address indexed nftOwner, address indexed bidder);

    // Settle the auction and transfer tokens
    function settleAuction(
        address nftAddress,
        address nftOwner,
        uint256 nftTokenId,
        uint256 minPrice,
        address erc20Address,
        address bidder,
        uint256 bidAmount,
        bytes calldata ownerSignature,
        bytes calldata bidderSignature
    ) external {
        require(bidAmount >= minPrice, "Bid amount is less than min price");

        bytes32 auctionHash = keccak256(
            abi.encodePacked(
                nftAddress,
                nftOwner,
                nftTokenId,
                minPrice,
                erc20Address,
                bidder,
                bidAmount
            )
        );

        address recoveredOwner = recoverSigner(auctionHash, ownerSignature);
        address recoveredBidder = recoverSigner(auctionHash, bidderSignature);

        require(nftOwner == recoveredOwner, "Recovered nftOwner doesn't match");
        require(bidder == recoveredBidder, "Recovered bidder doesn't match");
        require(nftOwner == msg.sender || bidder == msg.sender, "Msg sender must be the owner or bidder");

        // Transfer ERC20 tokens from bidder to owner
        IERC20(erc20Address).transferFrom(bidder, nftOwner, bidAmount);

        // Transfer NFT from owner to bidder
        IERC721(nftAddress).transferFrom(nftOwner, bidder, nftTokenId);

        emit AuctionSettled(nftOwner, bidder);
    }

    // Utility function to recover the signer from a message hash
    function recoverSigner(bytes32 hash, bytes memory signature) internal pure returns (address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);
        return ecrecover(hash, v, r, s);
    }

    function splitSignature(bytes memory sig) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        require(sig.length == 65, "Invalid signature length");
        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}