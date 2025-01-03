# Cheap NFT Marketplace

## Description

NFT marketplaces often use techniques for reducing transaction fees. Some of these techniques require users to use these marketplaces with an off-chain sibling system that assist the on-chain pieces.

## Requirements

- NFT Onwers can create auctions using the off-chain system.
- Bidders can place a bid for an auction using the off-chain system.
- The off-chain system can verify bidders and nft owners requests.
- Bidders can prove their bid request by signing their message
- NFT Owners can prove their approval request by signing their message.
- The on-chain smart contract enable trades between an ERC721 and a ERC20 with a single transaction.
- It's needed the nft owner and bidder signs to proceed with the trade.

## Auction Flow
1. Owner of the NFT approves all NFT’s to the Marketplace
2. Owner of the NFT signs to create an off-chain auction listing with a
minimum price
3. Bidder approves ERC20 tokens to Marketplace
4. Bidder signs a bid for the auction
5. If owner approves the bid, signs it back and retrieve to bidder
6. Anyone with both signatures can settle the transaction, the owner takes the ERC20 whilst the bidder takes the NFT.

## Implementation

We implemented two components: a) backend (off-chain system) and b) smart contract (on-chain)

### Off Chain System

It is implemented using express.js, some endpoints are implemented

- `GET  /auction/list`

    List all auctions


- `POST /auction/create`

    Create an auction

- `GET  /auction/:auctionId`

    Get auction detail by its `id`

- `GET  /auction/:auctionId/bid/list`

    Get all bids of an auction

- `POST /auction/:auctionId/bid/create`

    Create a bid for an auction

- `POST /auction/:auctionId/approve`

    Approve an auction

### On Chain Smart Contract

The smart contract is developed using foundry

#### Design

The smart contract is designed with the following considerations:

- The Marketplace can swap ERC721 (NFT Owner) and ERC20 tokens (Bidder).
- The Marketplace can verify NFT Owner and Bidder signatures.
- It is needed that the NFT Owner approves their NFTs to the Marketplace.
- It is needed that the Bidder approves its ERC20 tokens to the Marketplace.


```
contract Marketplace {
    ...
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
    ) { ... }
    ...
}
```

#### Security Considerations

- Only NFT Owner or Bidder can settle an auction but they need both signed messages
- Other wallets can not settle the transaction even if they have both signed messages

#### Tests

The following tests are covered:
- test settle auction by nft owner
- test settle auction by bidder
- test settle auction not authorized
- test invalid signature
- test bid amount less than min price

## Demo

For the demo we deployed 3 smart contracts on Sepolia Testnet:

- A simple ERC20 token contract
- A simple ERC721 token contract
- The Marketplace contract

We used 3 wallets

- The Marketplace Deployer
- The NFT Owner
- The Bidder


### Smart Contract Deployments and Wallets Setup on Sepolia Testnet

1. Deploy the 3 smart contract using following the script:

    ```
    forge script --chain sepolia script/Script.s.sol:DeployScript --rpc-url <your_rpc_url> --broadcast  --verify -vvvv
    ```
![image](https://github.com/user-attachments/assets/3fcf662c-bdff-409c-a57a-c9a2dd16104f)

![image](https://github.com/user-attachments/assets/a6a4b909-f82c-445b-8120-ca9243344ae8)

![image](https://github.com/user-attachments/assets/9f2afead-7afe-467e-85ef-2082aac4d807)


2. NFT Owner approves all NFT's to the Marketplace

3. Bidder approves ERC20 tokens to the Marketplace



## Future Actions

- Implement a UI with that integrates the backend system


