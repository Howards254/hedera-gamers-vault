import { 
  Client, 
  PrivateKey, 
  AccountId,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TransferTransaction,
  TokenAssociateTransaction,
  Hbar
} from '@hashgraph/sdk';
import dotenv from 'dotenv';

dotenv.config();

const client = Client.forTestnet();
client.setOperator(
  AccountId.fromString(process.env.VITE_MY_ACCOUNT_ID),
  PrivateKey.fromString(process.env.VITE_MY_PRIVATE_KEY)
);

export async function createNFTCollection(name, symbol) {
  const supplyKey = PrivateKey.fromString(process.env.VITE_MY_PRIVATE_KEY);
  
  const transaction = await new TokenCreateTransaction()
    .setTokenName(name)
    .setTokenSymbol(symbol)
    .setTokenType(TokenType.NonFungibleUnique)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(process.env.VITE_MY_ACCOUNT_ID)
    .setSupplyType(TokenSupplyType.Infinite)
    .setSupplyKey(supplyKey)
    .setMaxTransactionFee(new Hbar(20))
    .freezeWith(client);

  const signTx = await transaction.sign(supplyKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  
  return receipt.tokenId.toString();
}

export async function mintNFT(tokenId, metadataCID, recipientAccountId) {
  const supplyKey = PrivateKey.fromString(process.env.VITE_MY_PRIVATE_KEY);
  const metadata = Buffer.from(metadataCID);
  
  const mintTx = await new TokenMintTransaction()
    .setTokenId(tokenId)
    .setMetadata([metadata])
    .setMaxTransactionFee(new Hbar(20))
    .freezeWith(client);

  const signMintTx = await mintTx.sign(supplyKey);
  const mintResponse = await signMintTx.execute(client);
  const mintReceipt = await mintResponse.getReceipt(client);
  const serialNumber = mintReceipt.serials[0].toNumber();

  if (recipientAccountId && recipientAccountId !== process.env.VITE_MY_ACCOUNT_ID) {
    try {
      const transferTx = await new TransferTransaction()
        .addNftTransfer(tokenId, serialNumber, process.env.VITE_MY_ACCOUNT_ID, recipientAccountId)
        .setMaxTransactionFee(new Hbar(20))
        .freezeWith(client);

      await transferTx.execute(client);
    } catch (error) {
      if (error.message.includes('TOKEN_NOT_ASSOCIATED')) {
        console.log('Token not associated, keeping NFT in treasury');
      } else {
        throw error;
      }
    }
  }
  
  return serialNumber;
}
