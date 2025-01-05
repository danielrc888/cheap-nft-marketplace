import { Auction, Bid } from "../types/auctionTypes";
import { v4 as uuidv4 } from "uuid";

export class AuctionModel {
  private auctions: Record<string, Auction> = {}; // Auction ID -> Auction
  private bids: Record<string, Bid[]> = {}; // Auction ID -> Bids

  createAuction(
    nftAddress: string,
    nftTokenId: number,
    owner: string,
    minPrice: number,
    erc20Address: string,
  ) {
    const auctionId = uuidv4();
    const auction: Auction = {
      id: auctionId,
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
      approvedBidId: null,
    };
    this.auctions[auctionId] = auction;
    return auction;
  }

  createBid(
    auctionId: string,
    bidder: string,
    amount: number,
    signature: string,
  ) {
    if (!this.auctions[auctionId]) return null;
    const bidId = uuidv4();
    const bid: Bid = { id: bidId, bidder, amount, signature };
    if (!this.bids[auctionId]) this.bids[auctionId] = [];
    this.bids[auctionId].push(bid);
    return bid;
  }

  getAuction(auctionId: string) {
    return this.auctions[auctionId];
  }

  getAllAuctions(): Auction[] {
    return Object.values(this.auctions);
  }

  getBids(auctionId: string) {
    return this.bids[auctionId] || [];
  }

  getBid(auctionId: string, bidId: string) {
    const bids = this.getBids(auctionId);
    return bids.find((bid) => bid.id == bidId);
  }

  approveBid(auctionId: string, bidId: string, ownerSignature: string) {
    if (!this.auctions[auctionId]) return null;
    const auction = this.auctions[auctionId];
    const bid = this.getBid(auctionId, bidId);
    if (!bid) return null;
    if (auction && auction.approvedBidId === null) {
      auction.approvedBidId = bidId;
      auction.ownerSignature = ownerSignature;
      auction.bidderSignature = bid.signature;
      return auction;
    }
    return null;
  }
}
