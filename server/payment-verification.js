import { Client, TransferTransaction, Hbar, AccountId, PrivateKey } from '@hashgraph/sdk';

const PLATFORM_FEE_PERCENTAGE = 2.5; // 2.5% platform fee
const PLATFORM_ACCOUNT_ID = process.env.VITE_MY_ACCOUNT_ID;

export async function verifyPayment(buyerAccountId, sellerAccountId, listingPrice) {
  try {
    await new Promise(resolve => setTimeout(resolve, 5000));

    const response = await fetch(
      `https://testnet.mirrornode.hedera.com/api/v1/transactions?account.id=${buyerAccountId}&transactiontype=CRYPTOTRANSFER&order=desc&limit=10`
    );
    
    const data = await response.json();
    
    for (const tx of data.transactions || []) {
      const transfers = tx.transfers || [];
      const platformTransfer = transfers.find(t => t.account === PLATFORM_ACCOUNT_ID && t.amount > 0);
      
      if (platformTransfer) {
        const amountReceived = platformTransfer.amount / 100000000;
        if (Math.abs(amountReceived - listingPrice) < 0.01) {
          return {
            verified: true,
            transactionId: tx.transaction_id,
            timestamp: tx.consensus_timestamp,
          };
        }
      }
    }
    
    return { verified: false };
  } catch (error) {
    console.error('Payment verification error:', error);
    return { verified: false };
  }
}

export async function forwardPaymentToSeller(sellerAccountId, listingPrice, royaltyPercentage = 0, developerAccountId = null) {
  try {
    const client = Client.forTestnet();
    const operatorId = AccountId.fromString(process.env.VITE_MY_ACCOUNT_ID);
    const operatorKey = PrivateKey.fromStringED25519(process.env.VITE_MY_PRIVATE_KEY);
    
    client.setOperator(operatorId, operatorKey);

    // Calculate splits
    const platformFee = listingPrice * (PLATFORM_FEE_PERCENTAGE / 100);
    const royaltyAmount = listingPrice * (royaltyPercentage / 100);
    const sellerAmount = listingPrice - platformFee - royaltyAmount;

    console.log(`Payment split - Seller: ${sellerAmount}, Royalty: ${royaltyAmount}, Platform: ${platformFee}`);

    // Build transaction with all transfers
    const transaction = new TransferTransaction()
      .addHbarTransfer(operatorId, new Hbar(-(sellerAmount + royaltyAmount)))
      .addHbarTransfer(sellerAccountId, new Hbar(sellerAmount));
    
    // Add royalty payment if applicable
    if (royaltyAmount > 0 && developerAccountId) {
      transaction.addHbarTransfer(developerAccountId, new Hbar(royaltyAmount));
    }

    const txResponse = await transaction.execute(client);
    await txResponse.getReceipt(client);

    return {
      success: true,
      transactionId: txResponse.transactionId.toString(),
      sellerAmount,
      royaltyAmount,
      platformFee
    };
  } catch (error) {
    console.error('Error forwarding payment:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
