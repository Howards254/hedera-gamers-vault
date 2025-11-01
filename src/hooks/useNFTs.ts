import { useState, useEffect } from 'react';
import { useWallet } from './useWallet';
import { queryAccountNFTs, getNFTMetadata } from '@/lib/hedera';
import { API_BASE_URL } from '@/config';

export interface NFT {
  id?: number;
  token_id: string;
  serial_number: number;
  metadata: string;
  account_id: string;
  created_timestamp: string;
  listed_for_sale?: number;
  price?: number;
  metadataJson?: any;
}

export const useNFTs = () => {
  const { walletState } = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNFTs = async () => {
    if (!walletState.account?.accountId) {
      setNfts([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/my-nfts/${walletState.account.accountId}`);
      
      if (!response.ok) {
        throw new Error('Backend server not responding');
      }
      
      const { nfts: dbNFTs } = await response.json();
      
      const accountNFTs = dbNFTs.map(nft => ({
        id: nft.id,
        token_id: nft.token_id,
        serial_number: nft.serial_number,
        metadata: nft.metadata_cid,
        account_id: nft.owner_account_id,
        created_timestamp: nft.created_at,
        listed_for_sale: nft.listed_for_sale,
        price: nft.price
      }));
      
      // Fetch metadata for each NFT
      const nftsWithMetadata = await Promise.all(
        accountNFTs.map(async (nft) => {
          try {
            const metadataJson = await getNFTMetadata(nft.metadata);
            return { ...nft, metadataJson };
          } catch {
            return { ...nft, metadataJson: null };
          }
        })
      );

      setNfts(nftsWithMetadata);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch NFTs');
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [walletState.account?.accountId]);

  return {
    nfts,
    isLoading,
    error,
    refetch: fetchNFTs,
  };
};