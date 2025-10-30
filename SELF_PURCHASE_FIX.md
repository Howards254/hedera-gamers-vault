# Self-Purchase Bug Fix & Recovery Guide

## What Happened

You discovered a critical bug where users could buy their own NFTs. When this happens:

1. **User pays full price** (e.g., 100 HBAR) to the platform account
2. **Platform forwards back** only 87.5-92.5% (depending on royalty settings)
3. **User loses 7.5-12.5%** of their money to platform fees and royalties

### Example Loss Calculation
If you bought your own NFT for 100 HBAR:
- You paid: **100 HBAR**
- Platform forwarded back: **87.5-92.5 HBAR** (depending on game royalty)
- **You lost: 7.5-12.5 HBAR**

## What Was Fixed

### Backend Protection (server/index.js)
Added validation in both purchase endpoints:
```javascript
// Prevent self-purchase
if (nft.owner_account_id === buyerAccountId) {
  return res.status(400).json({ error: 'You cannot buy your own NFT' });
}
```

### Frontend Protection (Marketplace.tsx)
- Buy button is now hidden for your own NFTs
- Shows "Your NFT" instead of "Seller: 0.0.xxx..."

## How to Check Your Lost Payment

### Option 1: Check Admin Panel
1. Make sure your account is in `VITE_ADMIN_ACCOUNTS` in `.env`
2. Navigate to `/admin` in the app
3. Check "Failed Payments" tab for any stuck payments

### Option 2: Run Database Check Script
```bash
node check-payments.js
```

This will show:
- All payment logs with status
- Pending purchases
- Transaction IDs for verification

### Option 3: Check Hedera Mirror Node Directly
Visit: `https://hashscan.io/testnet/account/YOUR_ACCOUNT_ID`

Look for recent transactions to see:
- Payment sent to platform account
- Payment received back from platform account
- Calculate the difference

## Recovery Options

### If Payment is Logged as "FORWARD_FAILED"
The system detected the issue and logged it. You can:
1. Check the admin panel
2. Manually refund from platform account using HashPack
3. Or wait for automated refund system (future feature)

### If Payment Completed Successfully
The money was forwarded back to you, but you lost the fees. To recover:

1. **Check your actual balance** on HashScan
2. **Calculate loss**: Original payment - Amount received back
3. **Manual refund** from platform account:
   ```
   Send [lost amount] HBAR from platform account to your account
   ```

### If Payment is Stuck
1. Check `payment_logs` table for status
2. If status is "PAYMENT_RECEIVED" but not "COMPLETED":
   - Payment was received but not forwarded
   - Full refund needed from platform account
3. If status is "VERIFICATION_FAILED":
   - Payment might not have been detected
   - Check blockchain directly

## Prevention Going Forward

### For Users
- ✅ Buy button is now hidden for your own NFTs
- ✅ Backend rejects self-purchase attempts
- ✅ Clear error message if attempted

### For Developers
- ✅ Always validate buyer ≠ seller
- ✅ Log all payment attempts
- ✅ Monitor admin panel for failed payments
- ✅ Consider adding automated refund system

## Testing the Fix

1. **Restart the backend server**:
   ```bash
   cd /home/karol/Downloads/hedera-gamers-vault-main
   node server/index.js
   ```

2. **Test in browser**:
   - List one of your NFTs for sale
   - Go to Marketplace
   - Verify you see "Your NFT" instead of Buy button
   - Try to buy via API (should get error)

3. **Verify error message**:
   ```bash
   curl -X POST http://localhost:3001/api/initiate-purchase \
     -H "Content-Type: application/json" \
     -d '{"nftId": 1, "buyerAccountId": "0.0.YOUR_ACCOUNT"}'
   ```
   Should return: `{"error": "You cannot buy your own NFT"}`

## Next Steps

1. ✅ **Fix is deployed** - Self-purchase is now blocked
2. 🔍 **Check your loss** - Use one of the methods above
3. 💰 **Request refund** - If loss is significant, manually refund from platform account
4. 📊 **Monitor admin panel** - Watch for any future payment issues
5. 🚀 **Consider automation** - Build automated refund system for failed payments

## Questions to Answer

1. **How much did you lose?**
   - Check HashScan transaction history
   - Compare payment sent vs received

2. **Was it logged?**
   - Run `node check-payments.js`
   - Check admin panel

3. **Do you want a refund?**
   - If yes, send HBAR from platform account manually
   - Or implement automated refund system

## Contact

If you need help recovering funds:
1. Share your account ID
2. Share the transaction ID of the payment
3. Share the NFT ID that was purchased
4. I can help trace the exact flow and calculate refund amount
