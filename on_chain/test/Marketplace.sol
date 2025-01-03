// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "src/Marketplace.sol";
import "src/NiceERC20Token.sol";
import "src/NiceERC721Token.sol";


contract MarketplaceTest is Test {
    Marketplace marketplace;
    address nftOwner;
    address bidder;
    address erc20Address;
    address nftAddress;
    uint256 nftTokenId = 1;
    uint256 minPrice = 100;
    uint256 bidAmount = 1000;
    address otherWallet;

    // Mock ERC20 token
    NiceERC20Token erc20;

    // Mock ERC721 token
    NiceERC721Token nft;

    // Helper variables for signatures
    bytes ownerSignature;
    bytes bidderSignature;
    bytes32 auctionHash;

    // Set up the test environment
    function setUp() public {
        // Deploy the ERC20 token and NFT contract
        erc20 = new NiceERC20Token();
        nft = new NiceERC721Token();

        // Deploy the Marketplace contract
        marketplace = new Marketplace();

        // Set up addresses
        nftOwner = address(0xbF3f4229680C62d06C67eF17A8d422d917d2b204);
        bidder = address(0x1d088A4a0A985815786e0E3247fdF467B446917f);
        otherWallet = address(0x12332);
        // Mint an NFT to the nftOwner
        nft.mint(nftOwner, nftTokenId);

        // Give some ERC20 tokens to the bidder for the auction
        erc20.transfer(bidder, bidAmount);

        vm.prank(bidder);
        erc20.approve(address(marketplace), bidAmount);
        vm.stopPrank();

        vm.prank(nftOwner);
        nft.setApprovalForAll(address(marketplace), true);
        vm.stopPrank();

        // Create the auction hash
        auctionHash = keccak256(
            abi.encodePacked(
                address(nft),
                nftOwner,
                nftTokenId,
                minPrice,
                address(erc20),
                bidder,
                bidAmount
            )
        );

        // Sign the auction hash with the nftOwner's private key
        uint256 nftOwnerPrivateKey = 0xb9465a472351a8735dc329815a6309b862cc3b632ae361d61a0056ea50437449;
        uint256 bidderPrivateKey = 0x3c5b1c79392629b5a7dfcd3e2718d2060cb98fc3b026ebf0724d83a1b36c1a48;

        // Sign the auction hash with the nftOwner's private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(nftOwnerPrivateKey, auctionHash);  // Sign with nftOwner's private key
        ownerSignature = abi.encodePacked(r, s, v);  // Convert to bytes
        // Sign the auction hash with the bidder's private key
        (v, r, s) = vm.sign(bidderPrivateKey, auctionHash);  // Sign with bidder's private key
        bidderSignature = abi.encodePacked(r, s, v);  // Convert to bytes
    }

    // Test the settleAuction functionality
    function testSettleAuctionByNFTOwner() public {
        // Expect the auction settlement event
        vm.expectEmit(true, true, true, true);
        emit Marketplace.AuctionSettled(nftOwner, bidder);

        vm.prank(nftOwner);
        // Call the settleAuction function
        marketplace.settleAuction(
            address(nft),
            nftOwner,
            nftTokenId,
            minPrice,
            address(erc20),
            bidder,
            bidAmount,
            ownerSignature,
            bidderSignature
        );
        vm.stopPrank();

        // Check that the NFT was transferred
        assertEq(nft.ownerOf(nftTokenId), bidder);

        // Check that the ERC20 tokens were transferred
        assertEq(erc20.balanceOf(nftOwner), bidAmount);
        assertEq(erc20.balanceOf(bidder), 0);
    }

    function testSettleAuctionByBidder() public {
        // Expect the auction settlement event
        vm.expectEmit(true, true, true, true);
        emit Marketplace.AuctionSettled(nftOwner, bidder);

        vm.prank(bidder);
        // Call the settleAuction function
        marketplace.settleAuction(
            address(nft),
            nftOwner,
            nftTokenId,
            minPrice,
            address(erc20),
            bidder,
            bidAmount,
            ownerSignature,
            bidderSignature
        );
        vm.stopPrank();

        // Check that the NFT was transferred
        assertEq(nft.ownerOf(nftTokenId), bidder);

        // Check that the ERC20 tokens were transferred
        assertEq(erc20.balanceOf(nftOwner), bidAmount);
        assertEq(erc20.balanceOf(bidder), 0);
    }

    function testSettleAuctionNotAuthorized() public {
        // Use other wallet
        vm.prank(otherWallet);
        vm.expectRevert("Msg sender must be the owner or bidder");
        marketplace.settleAuction(
            address(nft),
            nftOwner,
            nftTokenId,
            minPrice,
            address(erc20),
            bidder,
            bidAmount,
            ownerSignature,
            bidderSignature
        );
        vm.stopPrank();
    }

    // Test invalid settleAuction (e.g., when signatures don't match)
    function testInvalidSignature() public {
        // Use an invalid signature for testing
        bytes memory invalidSignature = abi.encodePacked(bytes32(0), bytes32(0), uint8(0));  // Invalid 'v'

        // Expect the transaction to revert with the invalid signature error
        vm.expectRevert("Recovered nftOwner doesn't match");
        marketplace.settleAuction(
            address(nft),
            nftOwner,
            nftTokenId,
            minPrice,
            address(erc20),
            bidder,
            bidAmount,
            invalidSignature,  // Invalid signature for the owner
            bidderSignature
        );
    }

    function testBidAmountLessThanMinPrice() public {
        // Use an invalid signature for testing
        bytes memory invalidSignature = abi.encodePacked(bytes32(0), bytes32(0), uint8(0));  // Invalid 'v'
        // Expect the transaction to revert with the invalid signature error
        vm.expectRevert("Bid amount is less than min price");
        marketplace.settleAuction(
            address(nft),
            nftOwner,
            nftTokenId,
            1000,
            address(erc20),
            bidder,
            999,
            invalidSignature,  // Invalid signature for the owner
            bidderSignature
        );
    }
}

