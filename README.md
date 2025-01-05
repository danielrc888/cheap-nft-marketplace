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

## Project setup

Note: This project uses node version 22.11.0 and foundry

### Prerequisites

1. Node version 22.11.0 (you can install it using [nvm](https://github.com/nvm-sh/nvm))
2. Foundry (you can see the installation [docs](https://book.getfoundry.sh/getting-started/installation))

### Steps

1. Clone the repository
    ```
    git clone https://github.com/danielrc888/cheap-nft-marketplace.git
    ```

2. Go to root directory

    ```
    cd cheap-nft-marketplace/
    ```

2. Go to `backend` folder 
    ```
    $ cd /backend
    ```

3. Install dependencies

    ```
    npm install
    ```

4. Build the module

    ```
    npm run build
    ```

5. Run the express server at `http://localhost:3000`

    ```
    npm start
    ```

6. Go to `on_chain` folder

    ```
    cd ../on_chain
    ```

7. Install foundry dependencies

    ```
    forge install foundry-rs/forge-std --no-commit
    forge install OpenZeppelin/openzeppelin-contracts@v5.0.0 --no-commit
    ```

8. Build contracts

    ```
    forge build
    ```

9. Run tests

    ```
    forge test
    ```

10. To run deploy scripts you need to create an `.env` file and set the following variables `DEPLOYER_PRIVATE_KEY`, `NFT_OWNER_PRIVATE_KEY`, `BIDDER_PRIVATE_KEY` and `ETHERSCAN_API_KEY` (optionallly if you want to verify your contracts). You can paste the content of `.env.sample` and replace with your values

## Demo

### Smart Contract Deployments and Wallets Setup on Sepolia Testnet

We used the following address to make the demo

- Deployer: 0x87B06f8ecAeE3378a414aaD45Aa08F8a18003FD4

- Bidder: 0xA359eB575FB4Bf3815bcBf435a16bD5AD51b938a

- NFT Owner: 0x3BE0cA6E3c28Ff03EF63AAE512FE0B57B62ab34D

And this contracts were deployed resulted from demo

- Marketplace: 0xD55b5f702aE1DF6a4991D11e42238e5577BB97df 

- ERC20 Token: 0xe51EFaD079B7c75Bd30210d21Fb286ca4556796E

- ERC721 Token: 0xB00569a4817D84FBE713e72bb665b560f29a18F6


The steps for this demo are described here:

1. Deploy the 3 smart contract using following the script:

    ```
    forge script --chain sepolia script/Script.s.sol:DeployScript --rpc-url <your_rpc_url> --broadcast  --verify -vvvv
    ```

    Marketplace deploy tx hash: 0xe2db8bcd42cb3ea5cf9b0278f730c7ca36109b2e8487d3391d3eecee3bd5e1c7

    ERC20 token deploy tx hash: 0xdd0a230837256d5f522fca96c9850c6f97e1815eaa72b727b1399ec39269a9ba

    NFT deploy tx hash: 0x493e8023574bc3841584b36ad8bebe648369009c44f203241196858b9bd0eccd


2. Mint an NFT to the NFT Owner

   ```
    forge script --chain sepolia script/Script.s.sol:TransferNFTScript --rpc-url <your_rpc_url> --broadcast
    ```

    Tx hash: 0xe36fa6c5e8d412ca3f5d9cde917fdff95e7c03952d2ecc5f61af5f85843616b7

3. Transfer ERC20 to the bidder

    ```
    forge script --chain sepolia script/Script.s.sol:TransferNFTScript --rpc-url <your_rpc_url> --broadcast
    ```

    Tx hash: 0x9f0698615bc52198738a90355b8af33fb686b4eadb0aa49182557995c5ccd0db

3. NFT Owner approves all NFT's to the Marketplace

    ```
    forge script --chain sepolia script/Script.s.sol:ApproveNFTScript --rpc-url <your_rpc_url> --broadcast
    ```

    Tx hash: 0x89f6af1dcf0a9544cc13a6128a445de85304bcd2f99a9c73c0c4a013011ab93e

4. Bidder approves ERC20 tokens to the Marketplace

    ```
    forge script --chain sepolia script/Script.s.sol:ApproveERC20Script --rpc-url <your_rpc_url> --broadcast
    ```

    Tx hash: 0x33096a33f0a3bcbdacead0d1546675ef49ab4af378417916ab078e99bc5ac47d

### Auction simulation on Sepolia Testnet

1. Setup the following variables insider the `src/scripts/simulateAuction.ts` file: `provider`, `nftOwnerPrivateKey`, `bidderPrivateKey` and `erc20Address`

2. Build the project

    ```
    npm run build
    ```

3. Run the express server

    ```
    npm start
    ```

4. Run the script located in `backend/src/scripts/simulateAuction.ts`

    ```
    node dist/scripts/simulateAuction.ts
    ```

The script follows this steps:

1. NFT Owner create an auction
2. A Bidder place a bid for the auction
3. NFT Owner approve the bid
4. The NFT Owner or the Bidder retrieve the auction with their two signatures
5. The NFT Owner or the Bidder Settle the Auction on-chain

    Tx hash: 0x6f65c60963e1e81999bc2ac376b2639b069ece108251fe6c6bd71aebe71c7a0b

6. The NFT is transfered the the Bidder an the ERC20 token is transfered to the NFT Onwer is a single transaction


## Future Actions

- Implement a UI with that integrates the backend system

## Screenshots

### Deployment of the Marketplace, ERC20 Token and the NFT

![image](https://github.com/user-attachments/assets/3fcf662c-bdff-409c-a57a-c9a2dd16104f)

![image](https://github.com/user-attachments/assets/a6a4b909-f82c-445b-8120-ca9243344ae8)

![image](https://github.com/user-attachments/assets/9f2afead-7afe-467e-85ef-2082aac4d807)

![image](https://github.com/user-attachments/assets/e244f18f-6e9a-471a-9660-480bcb2b5283)

### Mint the NFT to the NFT Owner

![image](https://github.com/user-attachments/assets/b378a971-fba7-46f8-8eda-0530ce24caca)

### Transfer of the ERC20 Token to the Bidder

![image](https://github.com/user-attachments/assets/af1b2bea-fe49-4aad-8b65-29e58c6e9441)

### Approval of the NFT to the Marketplace

![image](https://github.com/user-attachments/assets/b344ff96-dc41-4838-a736-ba6e060a4334)

### Approval of the ERC20 Token to the Marketplace
![image](https://github.com/user-attachments/assets/1d5ef903-5b20-40ce-b1a2-bf2fbbacbfa4)

### Settled Auction

![image](https://github.com/user-attachments/assets/41ac3c86-ddd6-46d1-a0a8-4479d55153a3)


