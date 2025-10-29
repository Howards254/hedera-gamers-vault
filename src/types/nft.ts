// NFT and Marketplace types following HIP-412 standard
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  type: string;
  attributes: NFTAttribute[];
  creator: string;
  creatorDID?: string;
  properties?: {
    [key: string]: string | number;
  };
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
  display_type?: string;
}

export interface GameCollectible extends NFTMetadata {
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  damage?: number;
  defense?: number;
  speed?: number;
  level?: number;
}

export interface NFT {
  tokenId: string;
  serialNumber: string;
  metadata: NFTMetadata;
  owner: string;
  metadataURI: string;
}

export interface MarketplaceListing {
  tokenId: string;
  serialNumber: string;
  seller: string;
  price: string;
  listedAt: number;
  nft: NFT;
}

export interface MintFormData {
  name: string;
  description: string;
  image: File | null;
  type: string;
  rarity: string;
  attributes: { trait: string; value: string }[];
}
