import { AuctionModel } from "../models/auctionModel";
import { Auction, Bid } from "../types/auctionTypes";

const auctionModel = new AuctionModel();

export const createAuction = (nftAddress: string, nftTokenId: number, owner: string, minPrice: number, erc20Address: string): Auction => {
    return auctionModel.createAuction(nftAddress, nftTokenId, owner, minPrice, erc20Address);
};

export const placeBid = (auctionId: string, bidder: string, amount: number, signature: string): Bid | null => {
    return auctionModel.createBid(auctionId, bidder, amount, signature);
};

export const approveBid = (auctionId: string, bidId: string, ownerSignature: string): Auction | null => {
    return auctionModel.approveBid(auctionId, bidId, ownerSignature);
};

export const getAuctionDetails = (auctionId: string) => {
    return auctionModel.getAuction(auctionId);
};

export const getAllAuctions = () => {
    return auctionModel.getAllAuctions();
};

export const getAllBids = (auctionId: string) => {
    return auctionModel.getBids(auctionId);
};

export const getBidDetails = (auctionId: string, bidId: string) => {
    return auctionModel.getBid(auctionId, bidId);
}