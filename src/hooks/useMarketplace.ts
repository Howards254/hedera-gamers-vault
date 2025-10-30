import { useState, useEffect } from 'react';
import { getNFTMetadata } from '@/lib/hedera';
import type { NFT } from './useNFTs';
import { API_BASE_URL } from '@/config';

export const useMarketplace = () => {
  const [listings, setListings] = useState<(NFT & { price: number; seller: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMarketplaceListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/marketplace`);
      const { nfts: dbNFTs } = await response.json();
      
      const listingsWithMetadata = await Promise.all(
        dbNFTs.map(async (nft: any) => {
          try {
            const metadataJson = await getNFTMetadata(nft.metadata_cid);
            return {
              id: nft.id,
              token_id: nft.token_id,
              serial_number: nft.serial_number,
              metadata: nft.metadata_cid,
              account_id: nft.owner_account_id,
              owner_account_id: nft.owner_account_id,
              game_id: nft.game_id,
              created_timestamp: nft.created_at,
              metadataJson,
              price: nft.price,
              seller: nft.owner_account_id,
            };
          } catch {
            return null;
          }
        })
      );

      setListings(listingsWithMetadata.filter(Boolean) as any[]);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeListing = async (nftId: number) => {
    // Handled by purchase endpoint
    await fetchMarketplaceListings();
  };

  useEffect(() => {
    fetchMarketplaceListings();
  }, []);

  return {
    listings,
    isLoading,
    removeListing,
    refetch: fetchMarketplaceListings,
  };
};