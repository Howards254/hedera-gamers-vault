import { NFTStorage, File as NFTFile } from 'nft.storage';
import {
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  CustomRoyaltyFee,
  CustomFixedFee,
  Hbar,
  PrivateKey,
  Client,
} from '@hashgraph/sdk';
import { HEDERA_CONFIG } from '@/config/hedera.config';

const nftStorageClient = HEDERA_CONFIG.nftStorageApiKey !== 'YOUR_NFT_STORAGE_API_KEY' 
  ? new NFTStorage({ token: HEDERA_CONFIG.nftStorageApiKey })
  : null;

/**
 * Upload file to IPFS via NFT.Storage
 */
export const uploadToIPFS = async (file: File): Promise<string> => {
  if (!nftStorageClient) {
    throw new Error('NFT.Storage API key not configured. Please add your API key in src/lib/hedera.ts');
  }

  try {
    const imageFile = new NFTFile(
      [await file.arrayBuffer()],
      file.name,
      { type: file.type }
    );

    const cid = await nftStorageClient.storeBlob(imageFile);
    return `ipfs://${cid}`;
  } catch (error) {
    console.error('IPFS upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
};

/**
 * Create HIP-412 compliant metadata and upload to IPFS
 */
export const createMetadata = async (
  name: string,
  description: string,
  imageURL: string,
  attributes: any[],
  creator: string,
  type: string,
  rarity: string
): Promise<string> => {
  if (!nftStorageClient) {
    throw new Error('NFT.Storage API key not configured');
  }

  const metadata = {
    name,
    description,
    image: imageURL,
    type,
    creator,
    attributes: [
      { trait_type: 'Rarity', value: rarity },
      ...attributes.map(attr => ({
        trait_type: attr.trait,
        value: attr.value,
      })),
    ],
    properties: {
      category: type,
      rarity,
    },
  };

  try {
    const metadataBlob = new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    });

    const metadataFile = new NFTFile([metadataBlob], 'metadata.json', {
      type: 'application/json',
    });

    const cid = await nftStorageClient.storeBlob(metadataFile);
    return cid;
  } catch (error) {
    console.error('Metadata upload error:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

/**
 * Create NFT Collection (Token) with royalty fees
 * NOTE: This requires a Hedera account with private key for signing
 */
export const createNFTCollection = async (
  collectionName: string,
  collectionSymbol: string,
  royaltyFee: number, // percentage (e.g., 10 for 10%)
  treasuryAccountId: string,
  treasuryPrivateKey: string
): Promise<string> => {
  try {
    const client = Client.forTestnet();
    const treasuryKey = PrivateKey.fromString(treasuryPrivateKey);
    
    client.setOperator(treasuryAccountId, treasuryKey);

    // Create royalty fee (percentage of sale price)
    const royaltyFeeObj = new CustomRoyaltyFee()
      .setNumerator(royaltyFee)
      .setDenominator(100)
      .setFeeCollectorAccountId(treasuryAccountId)
      .setFallbackFee(new CustomFixedFee().setHbarAmount(new Hbar(1)));

    const transaction = new TokenCreateTransaction()
      .setTokenName(collectionName)
      .setTokenSymbol(collectionSymbol)
      .setTokenType(TokenType.NonFungibleUnique)
      .setDecimals(0)
      .setInitialSupply(0)
      .setTreasuryAccountId(treasuryAccountId)
      .setSupplyType(TokenSupplyType.Infinite)
      .setSupplyKey(treasuryKey)
      .setCustomFees([royaltyFeeObj])
      .setMaxTransactionFee(new Hbar(30));

    const response = await transaction.execute(client);
    const receipt = await response.getReceipt(client);
    const tokenId = receipt.tokenId;

    console.log('Created NFT collection:', tokenId?.toString());
    return tokenId?.toString() || '';
  } catch (error) {
    console.error('NFT collection creation error:', error);
    throw new Error('Failed to create NFT collection');
  }
};

/**
 * Mint NFT with metadata CID
 */
export const mintNFT = async (
  tokenId: string,
  metadataCID: string,
  supplyPrivateKey: string
): Promise<string> => {
  try {
    const client = Client.forTestnet();
    const supplyKey = PrivateKey.fromString(supplyPrivateKey);

    // Convert CID to bytes
    const metadata = Buffer.from(metadataCID);

    const transaction = new TokenMintTransaction()
      .setTokenId(tokenId)
      .setMetadata([metadata])
      .setMaxTransactionFee(new Hbar(20));

    const signedTx = await transaction.sign(supplyKey);
    const response = await signedTx.execute(client);
    const receipt = await response.getReceipt(client);
    
    const serialNumber = receipt.serials[0];
    console.log('Minted NFT serial:', serialNumber.toString());
    
    return serialNumber.toString();
  } catch (error) {
    console.error('NFT minting error:', error);
    throw new Error('Failed to mint NFT');
  }
};
