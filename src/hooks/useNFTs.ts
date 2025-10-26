import { useState } from 'react';
import { NFT, NFTMetadata } from '@/types/nft';
import { HEDERA_CONFIG } from '@/config/hedera.config';

const MIRROR_NODE_URL = HEDERA_CONFIG.mirrorNodeUrl;
const IPFS_GATEWAY = HEDERA_CONFIG.ipfsGateway;

export const useNFTs = (accountId?: string) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserNFTs = async () => {
    if (!accountId) return;
    
    setIsLoading(true);
    
    try {
      // Fetch all NFTs owned by the account from Hedera Mirror Node
      const response = await fetch(
        `${MIRROR_NODE_URL}/accounts/${accountId}/nfts`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch NFTs from Mirror Node');
      }

      const data = await response.json();
      const nftData = data.nfts || [];

      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        nftData.map(async (nft: any) => {
          try {
            // Metadata is stored as base64-encoded CID
            const metadataCID = Buffer.from(nft.metadata, 'base64').toString('utf-8');
            const metadata = await fetchNFTMetadata(metadataCID);

            return {
              tokenId: nft.token_id,
              serialNumber: nft.serial_number.toString(),
              metadata: metadata || {
                name: 'Unknown NFT',
                description: 'Metadata not available',
                image: '',
                type: 'Unknown',
                attributes: [],
                creator: '',
              },
              owner: accountId,
              metadataURI: `ipfs://${metadataCID}`,
            };
          } catch (error) {
            console.error('Error fetching NFT metadata:', error);
            return null;
          }
        })
      );

      // Filter out failed fetches
      const validNFTs = nftsWithMetadata.filter((nft): nft is NFT => nft !== null);
      setNfts(validNFTs);
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNFTMetadata = async (cid: string): Promise<NFTMetadata | null> => {
    try {
      const url = `${IPFS_GATEWAY}${cid}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch metadata from IPFS');
      }

      const metadata = await response.json();
      
      // Handle image URL - convert IPFS URIs to gateway URLs
      if (metadata.image && metadata.image.startsWith('ipfs://')) {
        metadata.image = metadata.image.replace('ipfs://', IPFS_GATEWAY);
      }

      return metadata;
    } catch (error) {
      console.error('Error fetching metadata from IPFS:', error);
      return null;
    }
  };

  return {
    nfts,
    isLoading,
    fetchUserNFTs,
    fetchNFTMetadata,
  };
};
