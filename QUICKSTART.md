# Quick Start Guide

Get your Hedera Gamers Vault NFT marketplace running locally in 5 minutes!

**Already deployed?** Visit https://gamersnft.onrender.com to use the live version!

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

Create `.env` file in project root:

```env
# Your Hedera Testnet Account (get from portal.hedera.com)
VITE_MY_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
VITE_MY_PRIVATE_KEY=your_private_key_here

# HashConnect (get from cloud.walletconnect.com)
VITE_APP_ID="Hedera Gamers Vault"
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_HEDERA_NETWORK=testnet

# Pinata IPFS (get from pinata.cloud)
VITE_PINATA_JWT=your_pinata_jwt_token
VITE_PINATA_GATEWAY=gateway.pinata.cloud

# Admin & Backend
VITE_ADMIN_ACCOUNTS=0.0.YOUR_ACCOUNT_ID
VITE_BACKEND_URL=http://localhost:3001
```

## Step 4: Run Backend & Frontend (30 sec)

**Terminal 1 - Backend:**
```bash
node server/index.js
```

**Terminal 2 - Frontend:**
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

### Use the Live Site
- Visit https://gamersnft.onrender.com
- Connect your HashPack wallet
- Start minting and trading NFTs!

### Deploy Your Own
- See `LIVE_DEPLOYMENT.md` for deployment guide
- Backend: Render (free)
- Frontend: Render (free)

### For Game Developers
- Register your game at `/developers`
- Get API key
- See `/sdk/README.md` for integration
- Mint NFTs for your players!

### Go to Mainnet
- See `MAINNET_MIGRATION.md` when ready
- Test thoroughly on testnet first!

## Need Help?

- 📖 Full docs: See `README.md`
- 🚀 Deployment: See `LIVE_DEPLOYMENT.md`
- 🎮 Game Integration: See `/sdk/README.md`
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