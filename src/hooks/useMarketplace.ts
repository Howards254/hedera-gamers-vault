import { useState } from 'react';
import { MarketplaceListing, NFT } from '@/types/nft';
import { 
  getMarketplaceListings, 
  listItemOnMarketplace, 
  buyItemFromMarketplace, 
  cancelListingOnMarketplace 
} from '@/lib/contract';
import { 
  AccountAllowanceApproveTransaction, 
  NftId,
  Client,
  PrivateKey,
} from '@hashgraph/sdk';
import { HEDERA_CONFIG, isMarketplaceConfigured } from '@/config/hedera.config';

const MARKETPLACE_CONTRACT_ADDRESS = HEDERA_CONFIG.marketplaceContractAddress;
const MIRROR_NODE_URL = HEDERA_CONFIG.mirrorNodeUrl;
const IPFS_GATEWAY = HEDERA_CONFIG.ipfsGateway;

export const useMarketplace = () => {
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchListings = async () => {
    setIsLoading(true);
    
    try {
      if (!isMarketplaceConfigured()) {
        console.warn('Marketplace contract not deployed yet');
        setListings([]);
        setIsLoading(false);
        return;
      }

      // Fetch all listings from smart contract
      const contractListings = await getMarketplaceListings(MARKETPLACE_CONTRACT_ADDRESS);
      
      // Fetch NFT metadata for each listing
      const listingsWithMetadata = await Promise.all(
        contractListings.map(async (listing: any) => {
          try {
            // Fetch NFT info from mirror node
            const nftResponse = await fetch(
              `${MIRROR_NODE_URL}/tokens/${listing.tokenAddress}/nfts/${listing.serialNumber}`
            );
            
            const nftData = await nftResponse.json();
            const metadataCID = Buffer.from(nftData.metadata, 'base64').toString('utf-8');
            
            // Fetch metadata from IPFS
            const metadataResponse = await fetch(`${IPFS_GATEWAY}${metadataCID}`);
            const metadata = await metadataResponse.json();
            
            if (metadata.image && metadata.image.startsWith('ipfs://')) {
              metadata.image = metadata.image.replace('ipfs://', IPFS_GATEWAY);
            }

            const nft: NFT = {
              tokenId: listing.tokenAddress,
              serialNumber: listing.serialNumber,
              metadata,
              owner: listing.seller,
              metadataURI: `ipfs://${metadataCID}`,
            };

            return {
              tokenId: listing.tokenAddress,
              serialNumber: listing.serialNumber,
              seller: listing.seller,
              price: listing.price,
              listedAt: listing.listedAt || Date.now(),
              nft,
            };
          } catch (error) {
            console.error('Error fetching listing metadata:', error);
            return null;
          }
        })
      );

      const validListings = listingsWithMetadata.filter(
        (listing): listing is MarketplaceListing => listing !== null
      );
      
      setListings(validListings);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const listNFT = async (
    tokenId: string, 
    serialNumber: string, 
    price: string,
    accountId: string,
    privateKey: string
  ) => {
    try {
      if (!isMarketplaceConfigured()) {
        throw new Error('Marketplace contract not deployed. Please deploy the contract first.');
      }

      const client = Client.forTestnet();
      const key = PrivateKey.fromString(privateKey);
      client.setOperator(accountId, key);

      // Step 1: Approve marketplace contract to transfer NFT
      const nftId = new NftId(tokenId, parseInt(serialNumber));
      
      const approvalTx = new AccountAllowanceApproveTransaction()
        .approveTokenNftAllowance(
          nftId,
          accountId,
          MARKETPLACE_CONTRACT_ADDRESS
        );

      const approvalResponse = await approvalTx.execute(client);
      await approvalResponse.getReceipt(client);

      // Step 2: Call smart contract's listItem function
      await listItemOnMarketplace(
        MARKETPLACE_CONTRACT_ADDRESS,
        tokenId,
        serialNumber,
        price
      );

      // Refresh listings
      await fetchListings();
    } catch (error) {
      console.error('Error listing NFT:', error);
      throw error;
    }
  };

  const buyNFT = async (
    tokenId: string, 
    serialNumber: string, 
    price: string,
    accountId: string,
    privateKey: string
  ) => {
    try {
      if (!isMarketplaceConfigured()) {
        throw new Error('Marketplace contract not deployed');
      }

      // Call smart contract's buyItem function (with HBAR payment)
      await buyItemFromMarketplace(
        MARKETPLACE_CONTRACT_ADDRESS,
        tokenId,
        serialNumber,
        price
      );

      // Refresh listings
      await fetchListings();
    } catch (error) {
      console.error('Error buying NFT:', error);
      throw error;
    }
  };

  const cancelListing = async (
    tokenId: string, 
    serialNumber: string,
    accountId: string,
    privateKey: string
  ) => {
    try {
      if (!isMarketplaceConfigured()) {
        throw new Error('Marketplace contract not deployed');
      }

      // Call smart contract's cancelListing function
      await cancelListingOnMarketplace(
        MARKETPLACE_CONTRACT_ADDRESS,
        tokenId,
        serialNumber
      );

      // Refresh listings
      await fetchListings();
    } catch (error) {
      console.error('Error canceling listing:', error);
      throw error;
    }
  };

  return {
    listings,
    isLoading,
    fetchListings,
    listNFT,
    buyNFT,
    cancelListing,
  };
};
