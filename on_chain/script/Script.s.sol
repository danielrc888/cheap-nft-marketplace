// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";

import "src/Marketplace.sol";
import "src/NiceERC20Token.sol";
import "src/NiceERC721Token.sol";


contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        new NiceERC20Token();
        new NiceERC721Token();
        new Marketplace();
        vm.stopBroadcast();
    }
}


contract TransferNFTScript is Script {
    function run() external {
        address nftAddress = address(0xB00569a4817D84FBE713e72bb665b560f29a18F6);
        address nftOwner = address(0x3BE0cA6E3c28Ff03EF63AAE512FE0B57B62ab34D);
        uint256 nftTokenId = 1;

        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        NiceERC721Token nft = NiceERC721Token(nftAddress);
        nft.mint(nftOwner, nftTokenId);
        vm.stopBroadcast();
    }
}

contract TransferERC20Script is Script {
    function run() external {
        address erc20Address = address(0xe51EFaD079B7c75Bd30210d21Fb286ca4556796E);
        address bidder = address(0xA359eB575FB4Bf3815bcBf435a16bD5AD51b938a);
        uint256 amount = 1000000;

        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);
        NiceERC20Token erc20 = NiceERC20Token(erc20Address);
        erc20.transfer(bidder, amount);
        vm.stopBroadcast();
    }
}


contract ApproveERC20Script is Script {
    function run() external {
        address erc20Address = address(0xe51EFaD079B7c75Bd30210d21Fb286ca4556796E);
        address marketplace = address(0xD55b5f702aE1DF6a4991D11e42238e5577BB97df);
        uint256 amount = 1000000;

        uint256 bidderPrivateKey = vm.envUint("BIDDER_PRIVATE_KEY");
        vm.startBroadcast(bidderPrivateKey);
        NiceERC20Token erc20 = NiceERC20Token(erc20Address);
        erc20.approve(address(marketplace), amount);
        vm.stopBroadcast();
    }
}

contract ApproveNFTScript is Script {
    function run() external {
        address marketplace = address(0xD55b5f702aE1DF6a4991D11e42238e5577BB97df);
        address nftAddress = address(0xB00569a4817D84FBE713e72bb665b560f29a18F6);

        uint256 nftOwnerPrivateKey = vm.envUint("NFT_OWNER_PRIVATE_KEY");
        vm.startBroadcast(nftOwnerPrivateKey);
        NiceERC721Token nft = NiceERC721Token(nftAddress);
        nft.setApprovalForAll(marketplace, true);
        vm.stopBroadcast();
    }
}
