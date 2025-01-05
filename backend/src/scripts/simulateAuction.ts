import { ethers } from "ethers";
import axios from "axios";

const provider = new ethers.JsonRpcProvider(""); // Here goes your RPC provider

// Define the NFT Owner
const nftOwnerPrivateKey = ""; // NFT owner private key
const nftOwnerWallet = new ethers.Wallet(nftOwnerPrivateKey, provider);

// NFT Data
const nftAddress = "0xB00569a4817D84FBE713e72bb665b560f29a18F6";
const nftTokenId = 1;
const nftOwner = nftOwnerWallet.address;

// Define the bidder
const bidderPrivateKey = ""; // Bidder private key
const bidderWallet = new ethers.Wallet(bidderPrivateKey, provider);
const bidder = bidderWallet.address;

// Bid Data
const erc20Address = "0xe51EFaD079B7c75Bd30210d21Fb286ca4556796E"; // ERC 20 address used for the auction

const backendUrl = "http://localhost:3000";
const marketPlaceAddress = "0xD55b5f702aE1DF6a4991D11e42238e5577BB97df";
const marketPlaceABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "nftOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "bidder",
        type: "address",
      },
    ],
    name: "AuctionSettled",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "nftAddress", type: "address" },
      { internalType: "address", name: "nftOwner", type: "address" },
      { internalType: "uint256", name: "nftTokenId", type: "uint256" },
      { internalType: "uint256", name: "minPrice", type: "uint256" },
      { internalType: "address", name: "erc20Address", type: "address" },
      { internalType: "address", name: "bidder", type: "address" },
      { internalType: "uint256", name: "bidAmount", type: "uint256" },
      { internalType: "bytes", name: "ownerSignature", type: "bytes" },
      { internalType: "bytes", name: "bidderSignature", type: "bytes" },
    ],
    name: "settleAuction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// It is assumed that nftOwner and bidder has

async function simulateAuction() {
  // Create an Auction with the NFT Owner
  const minPrice = 100;

  const auctionData = {
    nftAddress,
    nftTokenId,
    owner: nftOwner,
    minPrice,
    erc20Address,
  };
  const auction = (
    await axios.post(`${backendUrl}/auction/create`, auctionData)
  ).data;

  // Place a bid with the bidder
  const bidAmount = 500;
  const auctionHash = ethers.solidityPackedKeccak256(
    [
      "address",
      "address",
      "uint256",
      "uint256",
      "address",
      "address",
      "uint256",
    ],
    [
      nftAddress, // nft address
      nftOwner, // nftOwner address
      nftTokenId, // nftTokenId
      minPrice, // minPrice
      erc20Address, // ERC20 token address
      bidder, // bidder address
      bidAmount, // bidAmount
    ],
  );
  const auctionHashBytes = ethers.toBeArray(auctionHash);
  const bidderSignature =
    await bidderWallet.signingKey.sign(auctionHashBytes).serialized;

  const createBidBody = {
    ...auctionData,
    bidder,
    amount: bidAmount,
    bidderSignature,
  };
  const bid = (
    await axios.post(
      `${backendUrl}/auction/${auction.id}/bid/create`,
      createBidBody,
    )
  ).data;

  // Approve the bid
  const nftOwnerSignature =
    await nftOwnerWallet.signingKey.sign(auctionHashBytes).serialized;

  const approveBidBody = {
    ...auctionData,
    bidder,
    amount: bidAmount,
    ownerSignature: nftOwnerSignature,
    bidId: bid.id,
  };

  const approvedAuction = (
    await axios.post(
      `${backendUrl}/auction/${auction.id}/bid/approve`,
      approveBidBody,
    )
  ).data;

  // Get the auction signed by the nft owner and bidder
  const marketplaceContract = new ethers.Contract(
    marketPlaceAddress,
    marketPlaceABI,
    nftOwnerWallet,
  );
  // return
  try {
    // Sending the transaction to settle the auction
    const tx = await marketplaceContract.settleAuction(
      nftAddress,
      nftOwner,
      nftTokenId,
      minPrice,
      erc20Address,
      bidder,
      bidAmount,
      approvedAuction.ownerSignature,
      approvedAuction.bidderSignature,
    );

    console.log("Transaction sent:", tx.hash);
    // Wait for the transaction to be mined
    await tx.wait();
    console.log("Transaction mined!");
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

simulateAuction();
