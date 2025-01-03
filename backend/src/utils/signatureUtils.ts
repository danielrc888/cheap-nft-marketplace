import { ethers } from "ethers";

// Verifies the signature from the owner or bidder
export const verifySignature = (hash: Uint8Array | string, signature: string, signerAddress: string): boolean => {
    // Recover the address from the signature and compare it to the signer address
    const recoveredAddress = ethers.recoverAddress(hash, signature);
    return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
};

// Generates a message to be signed by the owner/bidder
export const generateSignatureMessage = (nftAddress: string, nftTokenId: number, owner: string, minPrice: number, erc20Address: string, bidder: string, amount: number): Uint8Array => {
    const auctionHash = ethers.solidityPackedKeccak256(
        ["address", "address", "uint256", "uint256", "address", "address", "uint256"],
        [
            nftAddress,  // nft address
            owner,  // nftOwner address
            nftTokenId,  // nftTokenId
            minPrice,  // minPrice
            erc20Address,  // ERC20 token address
            bidder,  // bidder address
            amount  // bidAmount
        ]
    );
    return ethers.toBeArray(auctionHash)
}
