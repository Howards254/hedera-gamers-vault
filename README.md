# GamersNFT - NFT Marketplace

A production-ready NFT marketplace for gaming collectibles built on Hedera Hashgraph.

## Features

✅ **Phase 1 - Wallet Integration**
- HashConnect v3 wallet connection
- HashPack browser extension & mobile support
- Session persistence
- Real-time balance updates

✅ **Phase 2 - NFT Minting**
- Upload images to Pinata IPFS
- HIP-412 compliant metadata
- NFT collection creation with royalties
- Mint unique gaming collectibles

✅ **Phase 3 - NFT Management**
- View your NFT collection
- Query NFTs from Hedera Mirror Node
- Display metadata and attributes
- IPFS image rendering

✅ **Phase 4 - Marketplace**
- List NFTs for sale
- Buy NFTs with HBAR
- Automatic token association
- Royalty fee distribution

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create `.env` file in project root:

```env
# Your Hedera Testnet Account
VITE_MY_ACCOUNT_ID=0.0.YOUR_ACCOUNT_ID
VITE_MY_PRIVATE_KEY=your_private_key_here

# HashConnect Configuration
VITE_APP_ID="Hedera Gamers Vault"
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_HEDERA_NETWORK=testnet

# Pinata IPFS (Get from https://pinata.cloud)
VITE_PINATA_JWT=your_pinata_jwt_token
VITE_PINATA_GATEWAY=gateway.pinata.cloud

# Admin Access (your account ID)
VITE_ADMIN_ACCOUNTS=0.0.YOUR_ACCOUNT_ID

# Backend URL (for local dev)
VITE_BACKEND_URL=http://localhost:3001
```

### 3. Get Pinata Credentials

1. Sign up at [Pinata.cloud](https://pinata.cloud)
2. Create a new API key (JWT)
3. Get your dedicated gateway URL
4. Add both to `.env` file

### 4. Run Development Server
```bash
npm run dev
```

**Live Demo**: https://gamersnft.onrender.com  
**Local Development**: http://localhost:8080

## Usage

### Connect Wallet
1. Click "Connect Wallet" button
2. Approve connection in HashPack
3. Your account ID and balance will display

### Mint NFT
1. Navigate to "Mint NFT" page
2. Upload an image
3. Fill in name, description, type, and rarity
4. Add custom attributes (optional)
5. Click "Mint NFT"
6. Approve transactions in HashPack

### View Collection
1. Navigate to "My Collectibles"
2. See all your minted NFTs
3. View metadata and attributes

### Marketplace
1. Navigate to "Marketplace"
2. Browse available NFTs
3. Click "Buy" to purchase
4. Approve transaction in HashPack

## Architecture

### Frontend
- **React 18** + TypeScript
- **Vite** for fast development
- **Tailwind CSS** + shadcn/ui components
- **React Router** for navigation

### Blockchain
- **Hedera Testnet** for NFT operations
- **HashConnect v3** for wallet integration
- **@hashgraph/sdk** for blockchain interactions

### Storage
- **Pinata** for IPFS file storage
- **HIP-412** compliant metadata standard

## Project Structure

```
src/
├── components/       # UI components
│   ├── MintForm.tsx
│   ├── NFTCard.tsx
│   ├── WalletConnect.tsx
│   └── Navigation.tsx
├── hooks/           # Custom React hooks
│   ├── useWallet.ts
│   ├── useNFTs.ts
│   └── useMarketplace.ts
├── lib/             # Utility functions
│   └── hedera.ts    # Hedera SDK functions
├── pages/           # Route pages
│   ├── Index.tsx
│   ├── MintNFT.tsx
│   ├── MyCollectibles.tsx
│   └── Marketplace.tsx
└── types/           # TypeScript types
```

## Key Functions

### Hedera Operations (`src/lib/hedera.ts`)

- `uploadToPinata()` - Upload files to IPFS
- `uploadMetadataToPinata()` - Upload JSON metadata
- `createNFTCollection()` - Create HTS token
- `mintNFT()` - Mint NFT with metadata
- `transferNFT()` - Transfer NFT between accounts
- `associateToken()` - Associate token with account
- `queryAccountNFTs()` - Get NFTs from Mirror Node
- `getNFTMetadata()` - Fetch metadata from IPFS

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set environment variables in dashboard
3. Deploy

### Important Notes
- Never commit `.env` file
- Use environment variables for all secrets
- Test on Hedera Testnet before mainnet
- Ensure Pinata has sufficient storage

## Troubleshooting

### Wallet Connection Issues
- Ensure HashPack extension is installed
- Check browser console for errors
- Verify VITE_PROJECT_ID is set

### Minting Fails
- Verify Pinata JWT token is valid
- Check account has sufficient HBAR
- Ensure image file size < 10MB

### NFTs Not Showing
- Wait for Mirror Node to index (5-10 seconds)
- Click "Refresh" button
- Check Pinata gateway is accessible

## Security

- Private keys never exposed to frontend
- All transactions signed by user's wallet
- IPFS ensures immutable metadata
- Royalty fees enforced on-chain

## License

MIT

## 🌐 Live Demo

- **Frontend**: https://gamersnft.onrender.com
- **Backend API**: https://gamersnft-backend.onrender.com
- **Network**: Hedera Testnet
- **Status**: ✅ Production Ready

## 🎮 For Game Developers

Integrate NFT rewards into your game:
- See `/sdk/README.md` for SDK documentation
- Visit `/developers` page to register your game
- Get API key and start minting NFTs for players

## 👥 Team

### Karol Onyango - Founder & Lead Developer
- **Hedera Certified Developer** - [View Certification](https://drive.google.com/file/d/1OYh2PzHG0ehhTCDr898MVjXB95rWZTvn/view?usp=drive_link)
- Full-stack blockchain developer specializing in Hedera Hashgraph
- Built complete NFT marketplace with gaming integration
- Expertise in React, TypeScript, Node.js, and Hedera SDK

## Support

For issues or questions:
- GitHub Issues: https://github.com/Howards254/hedera-gamers-vault
- Hedera Discord
- Documentation: https://docs.hedera.com
