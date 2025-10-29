# Mainnet Migration Guide

Guide to migrate GamersNFT from Hedera Testnet to Mainnet.

---

## ⚠️ Before You Start

### Prerequisites
- [ ] Testnet deployment running smoothly for 1-2 weeks
- [ ] No critical bugs reported
- [ ] Payment system tested thoroughly
- [ ] At least 10+ successful test transactions
- [ ] User feedback collected and addressed
- [ ] Mainnet Hedera account created with sufficient HBAR

### Cost Estimation

**Initial Setup:**
- Create NFT collection: ~$1 USD
- Mint NFT: ~$0.001 USD per NFT
- Transfer NFT: ~$0.001 USD

**Monthly Operating Costs (estimated):**
- 1,000 NFT mints: ~$1 USD
- 1,000 transfers: ~$1 USD
- 10,000 API queries: Free (Mirror Node)
- Total: ~$2-5 USD/month for moderate usage

**Recommended Starting Balance:** 100 HBAR (~$5-10 USD)

---

## 🔑 Step 1: Create Mainnet Account

### Option A: HashPack Wallet (Recommended)
1. Open HashPack extension
2. Switch to "Mainnet" in settings
3. Create new account or use existing
4. **CRITICAL**: Backup your recovery phrase securely
5. Fund account with HBAR from exchange (Binance, Kraken, etc.)

### Option B: Hedera Portal
1. Go to [portal.hedera.com](https://portal.hedera.com)
2. Create mainnet account
3. Save account ID and private key securely
4. Fund with HBAR

### Security Best Practices
- ✅ Store private keys in password manager (1Password, Bitwarden)
- ✅ Never commit private keys to Git
- ✅ Use separate account for platform treasury
- ✅ Enable 2FA on all related accounts
- ❌ Never share private keys via email/chat
- ❌ Don't store keys in plain text files

---

## 🔄 Step 2: Update Environment Variables

### Backend (.env)
```env
# OLD (Testnet)
VITE_MY_ACCOUNT_ID=0.0.7098883
VITE_MY_PRIVATE_KEY=302e020100300506032b65700422042060300874e23c9b2336eb8ef0984fc8e25c6bb7535873922304a616b8ba31d806
VITE_HEDERA_NETWORK=testnet

# NEW (Mainnet)
VITE_MY_ACCOUNT_ID=0.0.YOUR_MAINNET_ACCOUNT
VITE_MY_PRIVATE_KEY=your_mainnet_private_key
VITE_HEDERA_NETWORK=mainnet
```

### Update Admin Accounts
```env
# Add your mainnet account to admin whitelist
VITE_ADMIN_ACCOUNTS=0.0.YOUR_MAINNET_ACCOUNT
```

### Keep Same (No Changes)
```env
VITE_PROJECT_ID=your_walletconnect_project_id
VITE_PINATA_JWT=your_pinata_jwt
VITE_PINATA_GATEWAY=gateway.pinata.cloud
```

---

## 💻 Step 3: Update Code for Mainnet

### Update `src/hooks/useWallet.ts`

**Find:**
```typescript
const hc = new HashConnect(
  LedgerId.TESTNET,
  ...
);
```

**Replace with:**
```typescript
const network = import.meta.env.VITE_HEDERA_NETWORK === 'mainnet' 
  ? LedgerId.MAINNET 
  : LedgerId.TESTNET;

const hc = new HashConnect(
  network,
  ...
);
```

**Find:**
```typescript
const client = Client.forTestnet();
```

**Replace with:**
```typescript
const client = import.meta.env.VITE_HEDERA_NETWORK === 'mainnet'
  ? Client.forMainnet()
  : Client.forTestnet();
```

### Update `server/nft-service.js`

**Find:**
```javascript
const client = Client.forTestnet();
```

**Replace with:**
```javascript
const client = process.env.VITE_HEDERA_NETWORK === 'mainnet'
  ? Client.forMainnet()
  : Client.forTestnet();
```

### Update `server/payment-verification.js`

**Find:**
```javascript
const response = await fetch(
  `https://testnet.mirrornode.hedera.com/api/v1/transactions?...`
);
```

**Replace with:**
```javascript
const mirrorNodeUrl = process.env.VITE_HEDERA_NETWORK === 'mainnet'
  ? 'https://mainnet-public.mirrornode.hedera.com'
  : 'https://testnet.mirrornode.hedera.com';

const response = await fetch(
  `${mirrorNodeUrl}/api/v1/transactions?...`
);
```

---

## 🗄️ Step 4: Database Migration

### Option A: Fresh Start (Recommended)
```bash
# Backup testnet database
cp marketplace.db marketplace-testnet-backup.db

# Delete testnet database
rm marketplace.db

# Restart server (creates fresh mainnet database)
npm run server
```

### Option B: Migrate Data
If you want to keep test games/templates:

```javascript
// migration-script.js
import Database from 'better-sqlite3';

const testnetDb = new Database('marketplace-testnet-backup.db');
const mainnetDb = new Database('marketplace.db');

// Migrate games (update developer account IDs to mainnet)
const games = testnetDb.prepare('SELECT * FROM games').all();
games.forEach(game => {
  // Update developer_account_id to mainnet equivalent
  const mainnetAccountId = '0.0.YOUR_MAINNET_ACCOUNT';
  mainnetDb.prepare(`
    INSERT INTO games (name, description, developer_account_id, api_key, royalty_percentage, logo_url, website_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(game.name, game.description, mainnetAccountId, game.api_key, game.royalty_percentage, game.logo_url, game.website_url);
});

// Migrate templates
const templates = testnetDb.prepare('SELECT * FROM nft_templates').all();
templates.forEach(template => {
  mainnetDb.prepare(`
    INSERT INTO nft_templates (game_id, template_id, name, description, image_url, type, rarity, attributes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(template.game_id, template.template_id, template.name, template.description, template.image_url, template.type, template.rarity, template.attributes);
});

console.log('Migration complete!');
```

---

## 🚀 Step 5: Deploy to Production

### Update Environment Variables in Hosting

**Railway:**
1. Go to your project
2. Variables tab
3. Update `VITE_MY_ACCOUNT_ID`, `VITE_MY_PRIVATE_KEY`, `VITE_HEDERA_NETWORK`
4. Click "Deploy"

**Vercel:**
1. Project Settings → Environment Variables
2. Update mainnet variables
3. Redeploy

**Render:**
1. Environment tab
2. Update variables
3. Manual Deploy

### Verify Deployment
```bash
# Test backend
curl https://your-backend.railway.app/api/v1/games

# Should return empty array (fresh database)
```

---

## ✅ Step 6: Post-Migration Testing

### Critical Tests (Do in Order)

1. **Wallet Connection**
   - [ ] Connect HashPack on mainnet
   - [ ] Verify correct network (should show mainnet account)
   - [ ] Check balance displays

2. **Developer Dashboard**
   - [ ] Register a real game
   - [ ] Create NFT template
   - [ ] Copy API key

3. **NFT Minting (Small Test)**
   - [ ] Mint 1 test NFT manually
   - [ ] Verify it costs real HBAR (~$0.001)
   - [ ] Check NFT appears in "My Collectibles"
   - [ ] Verify metadata loads from IPFS

4. **Marketplace (Small Transaction)**
   - [ ] List test NFT for 1 HBAR
   - [ ] Buy with different account
   - [ ] Verify payment processes
   - [ ] Check royalty distribution
   - [ ] Confirm ownership transfer

5. **Admin Panel**
   - [ ] Access with mainnet admin account
   - [ ] Verify no failed payments
   - [ ] Check platform overview

6. **Game API Integration**
   - [ ] Test demo game on mainnet
   - [ ] Mint NFT via API
   - [ ] Verify costs real HBAR

### Monitor for 24 Hours
- Check for any failed transactions
- Monitor HBAR balance
- Watch for error logs
- Test with small amounts only

---

## 💰 Step 7: Financial Setup

### Set Up Accounting
- Track all HBAR transactions
- Monitor platform fees collected
- Calculate royalty distributions
- Set up monthly reports

### Pricing Strategy
```
Recommended Pricing (Mainnet):
- Minimum NFT listing: 5 HBAR (~$0.25)
- Suggested game NFT rewards: 1-10 HBAR
- Platform fee: 2.5% (already configured)
- Creator royalty: 2-10% (configurable per game)
```

### Revenue Projections
```
Example: 1,000 NFT sales at 10 HBAR average
- Total volume: 10,000 HBAR
- Platform fees (2.5%): 250 HBAR (~$12.50)
- Creator royalties (5% avg): 500 HBAR
- Sellers receive: 9,250 HBAR
```

---

## 📢 Step 8: Launch Announcement

### Pre-Launch Checklist
- [ ] All tests passed
- [ ] No critical bugs
- [ ] Documentation updated
- [ ] Support channels ready
- [ ] Marketing materials prepared

### Announcement Template

```
🚀 GamersNFT is now LIVE on Hedera Mainnet!

The easiest way to add NFT rewards to your game is now in production.

✨ Features:
• 10,000x cheaper than Ethereum ($0.001 vs $50)
• 3-5 second transactions
• 5-minute integration
• Auto-verified payments
• Creator royalties (2-10%)

🎮 For Game Developers:
• Register your game
• Create NFT templates
• Integrate our SDK
• Start rewarding players

🎯 For Players:
• Earn NFTs by playing
• Trade on marketplace
• Own your achievements

Try it now: https://your-domain.com

#Hedera #NFT #Gaming #Web3
```

### Where to Announce
- Twitter/X
- Hedera Discord
- Reddit (r/Hedera, r/gamedev)
- Product Hunt
- Indie Hackers
- Your email list

---

## 🔐 Security Considerations

### Mainnet-Specific Security

1. **Private Key Management**
   - Use hardware wallet for large amounts
   - Rotate keys periodically
   - Never expose in logs

2. **Rate Limiting**
   Add to `server/index.js`:
   ```javascript
   import rateLimit from 'express-rate-limit';

   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });

   app.use('/api/', limiter);
   ```

3. **API Key Security**
   - Implement key rotation
   - Add usage limits per game
   - Monitor for abuse

4. **Payment Verification**
   - Already implemented with auto-verification
   - Monitor failed payments daily
   - Set up alerts for anomalies

---

## 📊 Monitoring & Maintenance

### Daily Checks
- [ ] Check failed payments in admin panel
- [ ] Monitor HBAR balance
- [ ] Review error logs
- [ ] Check uptime status

### Weekly Tasks
- [ ] Analyze transaction volume
- [ ] Review user feedback
- [ ] Update documentation
- [ ] Plan feature improvements

### Monthly Tasks
- [ ] Financial reconciliation
- [ ] Security audit
- [ ] Performance optimization
- [ ] User growth analysis

---

## 🆘 Rollback Plan

If critical issues arise on mainnet:

### Emergency Rollback to Testnet

1. **Stop accepting new transactions**
   - Add maintenance banner to frontend
   - Disable game registrations

2. **Revert environment variables**
   ```env
   VITE_HEDERA_NETWORK=testnet
   VITE_MY_ACCOUNT_ID=0.0.YOUR_TESTNET_ACCOUNT
   ```

3. **Restore testnet database**
   ```bash
   cp marketplace-testnet-backup.db marketplace.db
   ```

4. **Redeploy**

5. **Communicate with users**
   - Announce on all channels
   - Explain issue and timeline
   - Offer refunds if needed

---

## 📈 Success Metrics

Track these KPIs after mainnet launch:

### Week 1
- [ ] 0 critical bugs
- [ ] 10+ games registered
- [ ] 50+ NFTs minted
- [ ] 10+ marketplace transactions
- [ ] 0 failed payments

### Month 1
- [ ] 50+ games registered
- [ ] 500+ NFTs minted
- [ ] 100+ marketplace sales
- [ ] $50+ in platform fees
- [ ] 5+ active game integrations

### Month 3
- [ ] 200+ games
- [ ] 5,000+ NFTs
- [ ] 1,000+ sales
- [ ] $500+ revenue
- [ ] 20+ active games

---

## 🎯 Next Steps After Mainnet

1. **Marketing Push**
   - Paid ads (Twitter, Google)
   - Influencer partnerships
   - Game developer outreach

2. **Feature Expansion**
   - Auction system
   - NFT bundles
   - Staking/rewards
   - Mobile app

3. **Partnerships**
   - Game studios
   - NFT projects
   - Hedera ecosystem

4. **Scaling**
   - Optimize database
   - Add caching
   - CDN for images
   - Load balancing

---

## 📝 Mainnet Migration Checklist

```
Preparation:
□ Testnet stable for 1-2 weeks
□ Mainnet account created and funded
□ Private keys backed up securely
□ Migration plan reviewed

Code Updates:
□ Network detection implemented
□ Mirror Node URLs updated
□ Client initialization updated
□ All hardcoded testnet references removed

Environment:
□ Mainnet account ID set
□ Mainnet private key set
□ Network set to "mainnet"
□ Admin accounts updated

Database:
□ Testnet database backed up
□ Fresh mainnet database created
□ Migration script tested (if needed)

Deployment:
□ Backend deployed with mainnet config
□ Frontend deployed with mainnet config
□ CORS configured correctly
□ SSL/HTTPS enabled

Testing:
□ Wallet connection works
□ NFT minting works (small test)
□ Marketplace works (small transaction)
□ Payment processing works
□ Royalties distribute correctly
□ Admin panel accessible

Launch:
□ Monitoring set up
□ Support channels ready
□ Announcement prepared
□ Documentation updated

Post-Launch:
□ Daily monitoring for 1 week
□ User feedback collected
□ Issues addressed promptly
□ Success metrics tracked
```

---

**You're ready for mainnet! 🎉**

Remember: Start small, monitor closely, scale gradually.

Good luck with your launch! 🚀
