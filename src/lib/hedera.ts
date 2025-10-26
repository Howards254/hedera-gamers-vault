// Hedera SDK utility functions

/**
 * TODO: Phase 1 - Setup Hedera Client
 * Initialize the Hedera client for Testnet
 */
export const initializeHederaClient = () => {
  // TODO: Create and configure Hedera client
  // Use Client.forTestnet()
  // Set operator if needed
  
  console.log('TODO: Initialize Hedera client');
};

/**
 * TODO: Phase 2 - Upload to IPFS (nft.storage)
 */
export const uploadToIPFS = async (file: File) => {
  // TODO: Upload file to nft.storage
  // Return IPFS CID
  
  console.log('TODO: Upload file to IPFS:', file.name);
  return '';
};

/**
 * TODO: Phase 2 - Create metadata and upload
 */
export const createAndUploadMetadata = async (metadata: any) => {
  // TODO: Create metadata.json following HIP-412
  // Upload to nft.storage
  // Return IPFS CID
  
  console.log('TODO: Create and upload metadata');
  return '';
};

/**
 * TODO: Phase 2 - Create NFT Collection (HTS Token)
 */
export const createNFTCollection = async (
  name: string,
  symbol: string,
  royaltyFee: number
) => {
  // TODO: Use TokenCreateTransaction
  // Set tokenType to NON_FUNGIBLE_UNIQUE
  // Configure custom royalty fee
  // Return token ID
  
  console.log('TODO: Create NFT collection:', { name, symbol, royaltyFee });
  return '';
};

/**
 * TODO: Phase 2 - Mint NFT
 */
export const mintNFT = async (tokenId: string, metadataCID: string) => {
  // TODO: Use TokenMintTransaction
  // Set metadata to IPFS CID
  // Return serial number
  
  console.log('TODO: Mint NFT:', { tokenId, metadataCID });
  return '';
};

/**
 * TODO: Phase 1 - Query account balance
 */
export const getAccountBalance = async (accountId: string) => {
  // TODO: Use AccountBalanceQuery
  // Return HBAR balance
  
  console.log('TODO: Get account balance:', accountId);
  return '0';
};

/**
 * TODO: Phase 4 - Query Mirror Node for NFTs
 */
export const queryAccountNFTs = async (accountId: string) => {
  // TODO: Query Hedera Mirror Node REST API
  // GET /api/v1/accounts/{accountId}/nfts
  // Return array of NFTs
  
  console.log('TODO: Query account NFTs:', accountId);
  return [];
};
