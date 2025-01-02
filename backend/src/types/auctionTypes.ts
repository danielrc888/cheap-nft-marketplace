export interface Auction {
    id: string;
    nftAddress: string;
    owner: string;
    minPrice: number;
    erc20Address: string;
    approvedBidId: string | null;
}

export interface Bid {
    id: string;
    bidder: string;
    amount: number;
    signature: string;
}

export interface CreateAuctionParams {
    nftAddress: string;
    owner: string;
    minPrice: number;
    erc20Address: string;
}

export interface CreateBidParams {
    nftAddress: string;
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
    owner: string;
    minPrice: number;
    erc20Address: string;
    bidder: string;
    amount: number;
    ownerSignature: string;
}

export interface SignedAuctionApproved {
    nftAddress: string;
    owner: string;
    minPrice: number;
    erc20Address: string;
    bidder: string;
    amount: number;
    ownerSignature: string;
    bidderSignature: string;
}
