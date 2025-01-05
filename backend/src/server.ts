import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import {
  createAuction,
  placeBid,
  approveBid,
  getAuctionDetails,
  getAllBids,
  getAllAuctions,
} from "./services/auctionService";
import {
  generateSignatureMessage,
  verifySignature,
} from "./utils/signatureUtils";
import {
  CreateAuctionParams,
  CreateBidParams,
  ApproveBidParams,
} from "./types/auctionTypes";

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Create an auction
app.post(
  "/auction/create",
  (req: Request<{}, {}, CreateAuctionParams>, res: Response) => {
    const { nftAddress, nftTokenId, owner, minPrice, erc20Address } = req.body;
    const auction = createAuction(
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
    );
    res.json(auction);
  },
);

// Get all auctions
app.get("/auction/list", (req: Request, res: Response) => {
  const auctions = getAllAuctions();
  res.json(auctions);
});

// Get auction details
app.get("/auction/:auctionId", (req: Request, res: Response) => {
  const { auctionId } = req.params;
  const auction = getAuctionDetails(auctionId);
  if (auction) {
    res.json(auction);
    return;
  }
  res.status(404).send("Auction not found.");
});

// Get all bids for an auction
app.get("/auction/:auctionId/bid/list", (req: Request, res: Response) => {
  const { auctionId } = req.params;
  const bids = getAllBids(auctionId);
  res.json(bids);
});

// Create a bid
app.post(
  "/auction/:auctionId/bid/create",
  (req: Request<{ auctionId: string }, {}, CreateBidParams>, res: Response) => {
    const { auctionId } = req.params;
    const auction = getAuctionDetails(auctionId);
    if (!auction) {
      res.status(404).send("Auction not found.");
      return;
    }
    const {
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
      bidder,
      amount,
      bidderSignature,
    } = req.body;
    const message = generateSignatureMessage(
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
      bidder,
      amount,
    );
    if (verifySignature(message, bidderSignature, bidder)) {
      const bid = placeBid(auctionId, bidder, amount, bidderSignature);
      res.json(bid);
      return;
    }
    res.status(400).send("Invalid signature.");
  },
);

// Approve a bid
app.post(
  "/auction/:auctionId/bid/approve",
  (
    req: Request<{ auctionId: string }, {}, ApproveBidParams>,
    res: Response,
  ) => {
    const { auctionId } = req.params;
    const auction = getAuctionDetails(auctionId);
    if (!auction) {
      res.status(404).send("Auction not found.");
      return;
    }
    if (auction.approvedBidId) {
      res.status(400).send("Auction has an approved bid.");
      return;
    }
    const {
      bidId,
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
      bidder,
      amount,
      ownerSignature,
    } = req.body;
    const message = generateSignatureMessage(
      nftAddress,
      nftTokenId,
      owner,
      minPrice,
      erc20Address,
      bidder,
      amount,
    );
    if (verifySignature(message, ownerSignature, auction.owner)) {
      const auction = approveBid(auctionId, bidId, ownerSignature);
      if (!auction) {
        res.status(400).send("Can't approve bid.");
        return;
      }
      res.json(auction);
      return;
    }
    res.status(400).send("Invalid owner signature.");
  },
);

app.listen(port, () => {
  console.log(`Auction system listening at http://localhost:${port}`);
});
