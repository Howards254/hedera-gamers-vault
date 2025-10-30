import {
  Client,
  AccountId,
  PrivateKey,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  AccountBalanceQuery,
  TokenAssociateTransaction,
  Hbar,
} from '@hashgraph/sdk';
import { API_BASE_URL } from '@/config';

export const uploadToPinata = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const pinataJWT = import.meta.env.VITE_PINATA_JWT;
  if (!pinataJWT) {
    throw new Error('Pinata JWT not configured');
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pinataJWT}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload to Pinata');
  }

  const data = await response.json();
  return data.IpfsHash;
};

export const uploadMetadataToPinata = async (metadata: any): Promise<string> => {
  const pinataJWT = import.meta.env.VITE_PINATA_JWT;
  if (!pinataJWT) {
    throw new Error('Pinata JWT not configured');
  }

  const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${pinataJWT}`,
    },
    body: JSON.stringify({
      pinataContent: metadata,
      pinataMetadata: {
        name: `${metadata.name}-metadata.json`,
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to upload metadata to Pinata');
  }

  const data = await response.json();
  return data.IpfsHash;
};

export const createNFTMetadata = (
  name: string,
  description: string,
  imageCID: string,
  attributes: { trait_type: string; value: string }[],
  rarity?: string
) => {
  return {
    name,
    description,
    image: `ipfs://${imageCID}`,
    type: rarity || "image/png",
    properties: {
      attributes,
    },
    creator: "Hedera Gamers Vault",
  };
};

export const createNFTCollection = async (
  hashConnect: any,
  topic: string,
  accountId: string,
  name: string,
  symbol: string,
  royaltyFee: number = 5,
  publicKey?: string
): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/api/create-collection`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, symbol }),
  });

  if (!response.ok) throw new Error('Failed to create collection');
  
  const { tokenId } = await response.json();
  return tokenId;
};

export const mintNFT = async (
  hashConnect: any,
  topic: string,
  accountId: string,
  tokenId: string,
  metadataCID: string
): Promise<number> => {
  const response = await fetch(`${API_BASE_URL}/api/mint-nft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId, metadataCID, recipientAccountId: accountId }),
  });

  if (!response.ok) throw new Error('Failed to mint NFT');
  
  const { serialNumber } = await response.json();
  return serialNumber;
};

export const associateToken = async (
  hashConnect: any,
  topic: string,
  accountId: string,
  tokenId: string
): Promise<void> => {
  const transaction = new TokenAssociateTransaction()
    .setAccountId(accountId)
    .setTokenIds([tokenId]);

  await hashConnect.sendTransaction(topic, {
    topic,
    byteArray: transaction.toBytes(),
    metadata: {
      accountToSign: accountId,
      returnTransaction: false,
    },
  });
};

export const transferNFT = async (
  hashConnect: any,
  topic: string,
  fromAccountId: string,
  toAccountId: string,
  tokenId: string,
  serialNumber: number,
  price: number
): Promise<void> => {
  const client = Client.forTestnet();
  const operatorKey = PrivateKey.fromString(import.meta.env.VITE_MY_PRIVATE_KEY);
  const operatorId = AccountId.fromString(import.meta.env.VITE_MY_ACCOUNT_ID);
  
  client.setOperator(operatorId, operatorKey);

  const transaction = await new TransferTransaction()
    .addNftTransfer(tokenId, serialNumber, fromAccountId, toAccountId)
    .freezeWith(client);

  const txResponse = await transaction.execute(client);
  await txResponse.getReceipt(client);
};

export const getAccountBalance = async (accountId: string): Promise<string> => {
  try {
    const client = Client.forTestnet();
    const query = new AccountBalanceQuery().setAccountId(AccountId.fromString(accountId));
    const balance = await query.execute(client);
    return balance.hbars.toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    return '0';
  }
};

export const queryAccountNFTs = async (accountId: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch NFTs');
    }
    
    const data = await response.json();
    return data.nfts || [];
  } catch (error) {
    console.error('Error querying NFTs:', error);
    return [];
  }
};

export const getNFTMetadata = async (metadataCID: string): Promise<any> => {
  try {
    const gateway = import.meta.env.VITE_PINATA_GATEWAY || 'gateway.pinata.cloud';
    const response = await fetch(`https://${gateway}/ipfs/${metadataCID}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch metadata');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return null;
  }
};