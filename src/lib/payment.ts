import { TransferTransaction, Hbar, AccountId } from '@hashgraph/sdk';

export async function createPaymentTransaction(
  hashConnect: any,
  topic: string,
  buyerAccountId: string,
  sellerAccountId: string,
  priceInHbar: number
) {
  const transaction = new TransferTransaction()
    .addHbarTransfer(buyerAccountId, new Hbar(-priceInHbar))
    .addHbarTransfer(sellerAccountId, new Hbar(priceInHbar));

  const result = await hashConnect.sendTransaction(topic, {
    topic,
    byteArray: transaction.toBytes(),
    metadata: {
      accountToSign: buyerAccountId,
      returnTransaction: false,
    },
  });

  return result;
}
