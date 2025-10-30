import { getPendingPurchases, updatePendingPurchaseStatus, getListedNFTs, purchaseNFT, logPayment } from './database-switch.js';
import { verifyPayment, forwardPaymentToSeller } from './payment-verification.js';
import db from './database-switch.js';

export async function processPendingPayments() {
  const pending = getPendingPurchases();
  
  for (const purchase of pending) {
    try {
      const nft = getListedNFTs().find(n => n.id === purchase.nft_id);
      if (!nft) {
        updatePendingPurchaseStatus(purchase.id, 'NFT_NOT_FOUND');
        continue;
      }

      // Verify payment on blockchain
      const verification = await verifyPayment(purchase.buyer_account_id, nft.owner_account_id, purchase.expected_amount);
      
      if (!verification.verified) {
        continue; // Keep checking
      }

      console.log(`✅ Payment verified for purchase ${purchase.id}`);
      
      // Log payment received
      const paymentLogId = logPayment(purchase.nft_id, purchase.buyer_account_id, nft.owner_account_id, purchase.expected_amount, 'PAYMENT_RECEIVED', verification.transactionId);
      
      // Get game info for royalty
      const game = db.prepare('SELECT * FROM games WHERE id = ?').get(nft.game_id);
      const royaltyPercentage = game?.royalty_percentage || 0;
      const developerAccountId = game?.developer_account_id;
      
      // Forward payment to seller
      const forwardResult = await forwardPaymentToSeller(nft.owner_account_id, purchase.expected_amount, royaltyPercentage, developerAccountId);
      
      if (!forwardResult.success) {
        db.prepare("UPDATE payment_logs SET status = 'FORWARD_FAILED', error_message = ? WHERE id = ?")
          .run(forwardResult.error, paymentLogId);
        updatePendingPurchaseStatus(purchase.id, 'FORWARD_FAILED');
        continue;
      }
      
      // Update log with forward transaction
      db.prepare('UPDATE payment_logs SET forward_tx_id = ? WHERE id = ?')
        .run(forwardResult.transactionId, paymentLogId);
      
      // Transfer ownership
      purchaseNFT(purchase.nft_id, purchase.buyer_account_id);
      
      // Mark as completed
      db.prepare("UPDATE payment_logs SET status = 'COMPLETED' WHERE id = ?").run(paymentLogId);
      updatePendingPurchaseStatus(purchase.id, 'COMPLETED');
      
      console.log(`✅ Purchase ${purchase.id} completed successfully`);
      
    } catch (error) {
      console.error(`Error processing purchase ${purchase.id}:`, error);
      updatePendingPurchaseStatus(purchase.id, 'ERROR');
    }
  }
}

export function startPaymentProcessor() {
  console.log('🔄 Payment processor started - checking every 10 seconds');
  setInterval(async () => {
    await processPendingPayments();
  }, 10000); // Check every 10 seconds
}
