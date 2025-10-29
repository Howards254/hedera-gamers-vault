# Quick Start Guide

Get your Hedera Gamers Vault NFT marketplace running in 5 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Get Pinata Credentials (2 min)

1. Go to https://pinata.cloud and sign up (free)
2. Click "API Keys" in dashboard
3. Click "New Key" → Select "Admin" → Create
4. Copy the JWT token (starts with "eyJ...")
5. Go to "Gateways" → Copy your gateway URL (e.g., `amber-gentle-swan-123.mypinata.cloud`)

## Step 3: Configure Environment (1 min)

Update `.env` file:

```env
# Keep these as is
MY_ACCOUNT_ID = 0.0.7010419
M_PRIVATE_KEY = 0x7d4cc1b44ae9ab24fbdf8b2035a6e282e40b78056b46091becb61aa8a7b045c7
VITE_APP_ID = "Hedera Gamers Vault"
VITE_PROJECT_ID = "hedera-gamers-vault-dapp"
VITE_HEDERA_NETWORK = "testnet"

# Add your Pinata credentials here
VITE_PINATA_JWT = "paste_your_jwt_token_here"
VITE_PINATA_GATEWAY = "paste_your_gateway_url_here"
```

## Step 4: Run Development Server (30 sec)

```bash
npm run dev
```

Visit http://localhost:8080

## Step 5: Test the App (30 sec)

### Install HashPack Wallet
- Chrome: https://chrome.google.com/webstore (search "HashPack")
- Or download mobile app

### Get Test HBAR
1. Create account in HashPack
2. Go to https://portal.hedera.com/faucet
3. Enter your account ID
4. Get 10,000 test HBAR

### Connect & Test
1. Click "Connect Wallet" in the app
2. Approve in HashPack
3. Navigate to "Mint NFT"
4. Upload an image and fill the form
5. Click "Mint NFT"
6. Approve transaction in HashPack
7. Wait 10 seconds
8. Go to "My Collectibles" to see your NFT!

## Troubleshooting

### "Pinata JWT not configured"
- Make sure you added `VITE_PINATA_JWT` to `.env`
- Restart dev server after changing `.env`

### "HashConnect not initialized"
- Refresh the page
- Check browser console for errors
- Make sure HashPack is installed

### NFT not showing
- Wait 10-15 seconds for Mirror Node to index
- Click "Refresh" button
- Check transaction on https://hashscan.io/testnet

### Images not loading
- Verify `VITE_PINATA_GATEWAY` is correct
- Check Pinata dashboard for uploaded files
- Try a different image format (PNG/JPG)

## What's Next?

✅ **You're ready for production!**

### Deploy to Vercel (Free)
1. Push code to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy!

### Customize
- Update branding in `src/pages/Index.tsx`
- Change colors in `tailwind.config.ts`
- Add more NFT attributes
- Implement advanced marketplace features

### Go to Mainnet
1. Create Hedera Mainnet account
2. Change `VITE_HEDERA_NETWORK` to `"mainnet"`
3. Update Mirror Node URLs in `src/lib/hedera.ts`
4. Test thoroughly!

## Need Help?

- 📖 Full docs: See `README.md`
- 🚀 Deployment: See `DEPLOYMENT.md`
- 💬 Hedera Discord: https://hedera.com/discord
- 📚 Hedera Docs: https://docs.hedera.com

## Features Included

✅ Wallet connection (HashPack)
✅ NFT minting with IPFS storage
✅ View NFT collection
✅ Marketplace (buy/sell)
✅ Royalty fees
✅ HIP-412 compliant metadata
✅ Mobile responsive
✅ Production ready

**Happy building! 🎮🚀**