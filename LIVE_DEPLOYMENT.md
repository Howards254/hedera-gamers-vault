# Live Deployment Information

## 🚀 Production URLs

### Frontend
- **URL**: https://gamersnft.netlify.app
- **Platform**: Netlify
- **Status**: ✅ Live

### Backend API
- **URL**: https://gamersnft-backend.onrender.com
- **Platform**: Render (Free Tier)
- **Status**: ✅ Live

### Network
- **Blockchain**: Hedera Testnet
- **Platform Account**: 0.0.7098883

## 🔗 Quick Links

- **Live Demo**: https://gamersnft.netlify.app
- **API Health**: https://gamersnft-backend.onrender.com/api/v1/games
- **GitHub Repo**: https://github.com/Howards254/hedera-gamers-vault
- **WalletConnect Project**: https://cloud.walletconnect.com

## 📋 Environment Configuration

### Frontend (Netlify)
```
VITE_BACKEND_URL=https://gamersnft-backend.onrender.com
VITE_MY_ACCOUNT_ID=0.0.7098883
VITE_PROJECT_ID=dfe22a1aca8d834168d51a5ac05cec7b
VITE_HEDERA_NETWORK=testnet
VITE_PINATA_JWT=[your_jwt]
VITE_PINATA_GATEWAY=gateway.pinata.cloud
VITE_ADMIN_ACCOUNTS=0.0.7098883
NODE_VERSION=18
SECRETS_SCAN_ENABLED=false
```

### Backend (Render)
```
VITE_MY_ACCOUNT_ID=0.0.7098883
VITE_MY_PRIVATE_KEY=[your_private_key]
VITE_PINATA_JWT=[your_jwt]
VITE_PINATA_GATEWAY=gateway.pinata.cloud
VITE_ADMIN_ACCOUNTS=0.0.7098883
FRONTEND_URL=https://gamersnft.netlify.app
NODE_VERSION=18
```

## 🔧 WalletConnect Setup

**Project ID**: `dfe22a1aca8d834168d51a5ac05cec7b`

**Allowed Origins** (must be configured at https://cloud.walletconnect.com):
- `https://gamersnft.netlify.app`
- `http://localhost:8080` (for local development)
- `http://localhost:5173` (for Vite dev server)

## 🎮 Testing the Platform

### 1. Connect Wallet
- Visit https://gamersnft.netlify.app
- Click "Connect Wallet"
- Approve in HashPack extension

### 2. Mint NFT (Optional)
- Go to "Mint NFT" page
- Upload image, fill details
- Approve transaction

### 3. Browse Marketplace
- Go to "Marketplace"
- See listed NFTs
- Purchase with HBAR

### 4. Developer API
- Register game at `/developer`
- Get API key
- Create templates
- Mint NFTs via API

## 📊 Platform Status

### Current Features
- ✅ Wallet connection (HashConnect v3)
- ✅ NFT minting (template & dynamic)
- ✅ Marketplace with instant payment verification
- ✅ Developer API & SDK
- ✅ Admin panel
- ✅ Documentation

### Known Limitations (Free Tier)
- **Render**: Backend sleeps after 15 min inactivity (30s cold start)
- **Netlify**: 100GB bandwidth/month limit
- **Database**: SQLite (file-based, resets on Render restart)

## 🔄 Deployment Process

### Frontend (Netlify)
1. Push to GitHub `gamersnft` branch
2. Netlify auto-deploys
3. Build time: ~2 minutes
4. Live at: https://gamersnft.netlify.app

### Backend (Render)
1. Push to GitHub `gamersnft` branch
2. Render auto-deploys
3. Build time: ~3 minutes
4. Live at: https://gamersnft-backend.onrender.com

## 🐛 Troubleshooting

### Wallet Won't Connect
**Issue**: "Unauthorized: origin not allowed"
**Fix**: Add `https://gamersnft.netlify.app` to WalletConnect allowed origins

### Backend Not Responding
**Issue**: 502 Bad Gateway or timeout
**Fix**: Render free tier sleeps. First request wakes it (30s delay)

### NFTs Not Loading
**Issue**: Marketplace shows no NFTs
**Fix**: Database resets on Render restart. Re-mint NFTs or use persistent storage

### Payment Verification Fails
**Issue**: "Payment not found"
**Fix**: Wait 5 seconds after sending HBAR, then click "Verify Payment"

## 📈 Monitoring

### Check Backend Health
```bash
curl https://gamersnft-backend.onrender.com/api/v1/games
```

### Check Frontend
```bash
curl -I https://gamersnft.netlify.app
```

### View Logs
- **Netlify**: Dashboard → Deploys → Deploy log
- **Render**: Dashboard → Logs tab

## 🚀 Next Steps

### For Production (Mainnet)
1. Create new Hedera mainnet account
2. Update all environment variables
3. Enable Netlify secrets scanning
4. Use persistent database (PostgreSQL)
5. Upgrade Render to paid tier (no sleep)
6. Set up monitoring (Sentry, LogRocket)
7. Configure custom domain
8. Enable HTTPS everywhere

### Recommended Upgrades
- **Database**: Migrate to PostgreSQL (Render add-on or Supabase)
- **Storage**: Use S3 for uploaded images
- **Monitoring**: Add error tracking
- **CDN**: CloudFlare for better performance
- **Backup**: Automated database backups

## 📞 Support

For deployment issues:
- **Email**: karolonyango18@gmail.com
- **GitHub**: https://github.com/Howards254/hedera-gamers-vault/issues
- **Render Support**: https://render.com/docs
- **Netlify Support**: https://docs.netlify.com

## 📝 Changelog

### 2024-01-XX - Initial Deployment
- ✅ Frontend deployed to Netlify
- ✅ Backend deployed to Render
- ✅ WalletConnect configured
- ✅ Payment system working
- ✅ Dynamic minting implemented
