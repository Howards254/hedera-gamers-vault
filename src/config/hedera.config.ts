/**
 * Hedera Configuration
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. NFT.Storage API Key:
 *    - Get a free API key from: https://nft.storage/
 *    - Replace YOUR_NFT_STORAGE_API_KEY below
 * 
 * 2. Hedera Account (for minting):
 *    - Create a testnet account: https://portal.hedera.com/
 *    - Or use an existing account
 *    - Replace YOUR_ACCOUNT_ID and YOUR_PRIVATE_KEY below
 * 
 * 3. Marketplace Contract Address:
 *    - Deploy the Marketplace.sol contract (see docs)
 *    - Replace YOUR_MARKETPLACE_CONTRACT_ADDRESS below
 */

export const HEDERA_CONFIG = {
  // NFT.Storage Configuration
  nftStorageApiKey: 'YOUR_NFT_STORAGE_API_KEY',
  
  // Hedera Account Configuration (for minting NFTs)
  treasuryAccountId: 'YOUR_ACCOUNT_ID', // e.g., '0.0.123456'
  treasuryPrivateKey: 'YOUR_PRIVATE_KEY', // Your account's private key
  
  // Marketplace Contract (deploy in Phase 3)
  marketplaceContractAddress: 'YOUR_MARKETPLACE_CONTRACT_ADDRESS',
  
  // Network Configuration
  network: 'testnet',
  mirrorNodeUrl: 'https://testnet.mirrornode.hedera.com/api/v1',
  ipfsGateway: 'https://nftstorage.link/ipfs/',
  
  // Collection Settings
  collectionName: 'GamersNFT Collection',
  collectionSymbol: 'GNFT',
  royaltyPercentage: 10, // 10% royalty on sales
};

// Helper to check if configuration is complete
export const isConfigured = () => {
  return (
    HEDERA_CONFIG.nftStorageApiKey !== 'YOUR_NFT_STORAGE_API_KEY' &&
    HEDERA_CONFIG.treasuryAccountId !== 'YOUR_ACCOUNT_ID' &&
    HEDERA_CONFIG.treasuryPrivateKey !== 'YOUR_PRIVATE_KEY'
  );
};

export const isMarketplaceConfigured = () => {
  return HEDERA_CONFIG.marketplaceContractAddress !== 'YOUR_MARKETPLACE_CONTRACT_ADDRESS';
};
