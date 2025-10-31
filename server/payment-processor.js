import { getPendingPurchases, updatePendingPurchaseStatus, getListedNFTs, purchaseNFT, logPayment } from './database.js';
import { verifyPayment, forwardPaymentToSeller } from './payment-verification.js';
import db from './database.js';

export async function processPendingPayments() {
  const pending = await getPendingPurchases();
  
  for (const purchase of pending) {
    try {
      const nfts = await getListedNFTs();
      const nft = nfts.find(n => n.id === purchase.nft_id);
      if (!nft) {
        await updatePendingPurchaseStatus(purchase.id, 'NFT_NOT_FOUND');
        continue;
      }

      // Verify payment on blockchain
      const verification = await verifyPayment(purchase.buyer_account_id, nft.owner_account_id, purchase.expected_amount);
      
      if (!verification.verified) {
        continue; // Keep checking
      }

      console.log(`✅ Payment verified for purchase ${purchase.id}`);
      
      // Log payment received
      const paymentLogId = await logPayment(purchase.nft_id, purchase.buyer_account_id, nft.owner_account_id, purchase.expected_amount, 'PAYMENT_RECEIVED', verification.transactionId);
      
      // Get game info for royalty
      const gameResult = await db.execute({ sql: 'SELECT * FROM games WHERE id = ?', args: [nft.game_id] });
      const game = gameResult.rows[0];
      const royaltyPercentage = game?.royalty_percentage || 0;
      const developerAccountId = game?.developer_account_id;
      
      // Forward payment to seller
      const forwardResult = await forwardPaymentToSeller(nft.owner_account_id, purchase.expected_amount, royaltyPercentage, developerAccountId);
      
      if (!forwardResult.success) {
        await db.execute({
          sql: "UPDATE payment_logs SET status = 'FORWARD_FAILED', error_message = ? WHERE id = ?",
          args: [forwardResult.error, paymentLogId]
        });
        await updatePendingPurchaseStatus(purchase.id, 'FORWARD_FAILED');
        continue;
      }
      
      // Update log with forward transaction
      await db.execute({
        sql: 'UPDATE payment_logs SET forward_tx_id = ? WHERE id = ?',
        args: [forwardResult.transactionId, paymentLogId]
      });
      
      // Transfer ownership
      await purchaseNFT(purchase.nft_id, purchase.buyer_account_id);
      
      // Mark as completed
      await db.execute({ sql: "UPDATE payment_logs SET status = 'COMPLETED' WHERE id = ?", args: [paymentLogId] });
      await updatePendingPurchaseStatus(purchase.id, 'COMPLETED');
      
      console.log(`✅ Purchase ${purchase.id} completed successfully`);
      
    } catch (error) {
      console.error(`Error processing purchase ${purchase.id}:`, error);
      await updatePendingPurchaseStatus(purchase.id, 'ERROR');
    }
  }
}

export function startPaymentProcessor() {
  console.log('🔄 Payment processor started - checking every 10 seconds');
  setInterval(async () => {
    await processPendingPayments();
  }, 10000); // Check every 10 seconds
}
