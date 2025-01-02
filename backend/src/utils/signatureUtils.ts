import { ethers } from "ethers";

// Verifies the signature from the owner or bidder
export const verifySignature = (message: string, signature: string, signerAddress: string): boolean => {
    // Recover the address from the signature and compare it to the signer address
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === signerAddress.toLowerCase();
};

// Generates a message to be signed by the owner/bidder
export const generateSignatureMessage = (nftAddress: string, owner: string, minPrice: number, erc20Address: string, bidder: string, amount: number): string => {
    return ''
}
