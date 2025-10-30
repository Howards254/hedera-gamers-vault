import Database from 'better-sqlite3';

try {
  const db = new Database('marketplace.db');
  
  console.log('\n=== PAYMENT LOGS ===');
  const payments = db.prepare('SELECT * FROM payment_logs ORDER BY created_at DESC LIMIT 20').all();
  
  if (payments.length === 0) {
    console.log('No payment logs found');
  } else {
    payments.forEach(p => {
      console.log(`\nID: ${p.id}`);
      console.log(`NFT ID: ${p.nft_id}`);
      console.log(`Buyer: ${p.buyer_account_id}`);
      console.log(`Seller: ${p.seller_account_id}`);
      console.log(`Amount: ${p.amount} HBAR`);
      console.log(`Status: ${p.status}`);
      console.log(`Payment TX: ${p.payment_tx_id || 'N/A'}`);
      console.log(`Forward TX: ${p.forward_tx_id || 'N/A'}`);
      console.log(`Error: ${p.error_message || 'N/A'}`);
      console.log(`Created: ${p.created_at}`);
      console.log('---');
    });
  }
  
  console.log('\n=== PENDING PURCHASES ===');
  const pending = db.prepare('SELECT * FROM pending_purchases ORDER BY created_at DESC LIMIT 10').all();
  
  if (pending.length === 0) {
    console.log('No pending purchases');
  } else {
    pending.forEach(p => {
      console.log(`\nID: ${p.id}`);
      console.log(`NFT ID: ${p.nft_id}`);
      console.log(`Buyer: ${p.buyer_account_id}`);
      console.log(`Expected: ${p.expected_amount} HBAR`);
      console.log(`Status: ${p.status}`);
      console.log(`Created: ${p.created_at}`);
      console.log('---');
    });
  }
  
  db.close();
} catch (error) {
  console.error('Error:', error.message);
  console.log('\nDatabase may not exist yet. Start the server first to create it.');
}
