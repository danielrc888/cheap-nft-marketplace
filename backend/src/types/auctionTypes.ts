export interface Auction {
  id: string;
  nftAddress: string;
  nftTokenId: number;
  owner: string;
  minPrice: number;
  erc20Address: string;
  approvedBidId?: string | null;
  ownerSignature?: string;
  bidderSignature?: string;
}

export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  signature: string;
}

export interface CreateAuctionParams {
  nftAddress: string;
  nftTokenId: number;
  owner: string;
  minPrice: number;
  erc20Address: string;
}

export interface CreateBidParams {
  nftAddress: string;
  nftTokenId: number;
  owner: string;
  minPrice: number;
  erc20Address: string;
  bidder: string;
  amount: number;
  bidderSignature: string;
}

export interface ApproveBidParams {
  bidId: string;
  nftAddress: string;
  nftTokenId: number;
  owner: string;
  minPrice: number;
  erc20Address: string;
  bidder: string;
  amount: number;
  ownerSignature: string;
}
