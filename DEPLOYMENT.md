# GamersNFT Deployment Guide (Testnet)

Complete guide to deploy your NFT marketplace to production on Hedera Testnet.

---

## 📋 Pre-Deployment Checklist

### 1. Local Testing
- [ ] Delete `marketplace.db` and restart server for fresh database
- [ ] Test wallet connection with HashPack
- [ ] Register a test game in Developer Dashboard
- [ ] Create NFT templates
- [ ] Mint an NFT (both manual and via game API)
- [ ] List NFT for sale
- [ ] Buy NFT and verify auto-payment processing
- [ ] Check admin panel access with your account
- [ ] Test on different browsers (Chrome, Firefox, Safari)

### 2. Code Preparation
- [ ] Remove any console.logs with sensitive data
- [ ] Verify all API endpoints use environment variables
- [ ] Check `.gitignore` includes `.env` and `marketplace.db`
- [ ] Update `README.md` with production URLs
- [ ] Test build locally: `npm run build`

### 3. Accounts & Services
- [ ] Hedera Testnet account with sufficient HBAR (get from [portal.hedera.com](https://portal.hedera.com))
- [ ] Pinata account with API key ([pinata.cloud](https://pinata.cloud))
- [ ] WalletConnect Project ID ([cloud.walletconnect.com](https://cloud.walletconnect.com))

---

## 🚀 Part 1: Deploy Backend (Node.js Server)

### Option A: Railway (Recommended - Easy & Free Tier)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - Root Directory: `/` (or leave empty)
   - Build Command: `npm install`
   - Start Command: `node server/index.js`

4. **Add Environment Variables**
   Go to Variables tab and add:
   ```
   VITE_MY_ACCOUNT_ID=0.0.YOUR_TESTNET_ACCOUNT
   VITE_MY_PRIVATE_KEY=your_private_key_here
   VITE_PROJECT_ID=your_walletconnect_project_id
   VITE_HEDERA_NETWORK=testnet
   VITE_PINATA_JWT=your_pinata_jwt
   VITE_PINATA_GATEWAY=gateway.pinata.cloud
   VITE_ADMIN_ACCOUNTS=0.0.YOUR_TESTNET_ACCOUNT
   PORT=3001
   ```

5. **Add Persistent Storage (Important!)**
   - Go to "Data" tab
   - Click "Add Volume"
   - Mount Path: `/app/server`
   - This ensures `marketplace.db` persists across deployments

6. **Deploy**
   - Railway will auto-deploy
   - Copy your backend URL (e.g., `https://your-app.railway.app`)
   - Test: `https://your-app.railway.app/api/v1/games`

### Option B: Render

1. **Sign up at [render.com](https://render.com)**

2. **Create Web Service**
   - New → Web Service
   - Connect GitHub repository
   - Name: `gamersnft-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/index.js`

3. **Add Environment Variables** (same as Railway)

4. **Add Disk Storage**
   - Go to "Disks"
   - Add Disk
   - Mount Path: `/app/server`
   - Size: 1GB (free tier)

5. **Deploy** and copy URL

### Option C: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create gamersnft-backend

# Add environment variables
heroku config:set VITE_MY_ACCOUNT_ID=0.0.YOUR_ACCOUNT
heroku config:set VITE_MY_PRIVATE_KEY=your_key
# ... add all other variables

# Deploy
git push heroku main
```

---

## 🌐 Part 2: Deploy Frontend (React App)

### Option A: Vercel (Recommended - Optimized for React)

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: `/` (leave default)

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   VITE_MY_ACCOUNT_ID=0.0.YOUR_TESTNET_ACCOUNT
   VITE_PROJECT_ID=your_walletconnect_project_id
   VITE_HEDERA_NETWORK=testnet
   VITE_PINATA_JWT=your_pinata_jwt
   VITE_PINATA_GATEWAY=gateway.pinata.cloud
   VITE_ADMIN_ACCOUNTS=0.0.YOUR_TESTNET_ACCOUNT
   VITE_BACKEND_URL=https://your-backend.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy
   - Copy your frontend URL (e.g., `https://gamersnft.vercel.app`)

### Option B: Netlify

1. **Sign up at [netlify.com](https://netlify.com)**

2. **Import Project**
   - Sites → Add new site → Import from Git
   - Connect GitHub
   - Select repository

3. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Add Environment Variables** (same as Vercel)

5. **Deploy**

---

## 🔗 Part 3: Connect Frontend to Backend

### Update API Calls

Create `src/config.ts`:
```typescript
export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

### Update All Fetch Calls

Replace all instances of:
```typescript
fetch('http://localhost:3001/api/...')
```

With:
```typescript
import { API_BASE_URL } from '@/config';
fetch(`${API_BASE_URL}/api/...`)
```

### Files to Update:
- `src/hooks/useMarketplace.ts`
- `src/hooks/useNFTs.ts`
- `src/pages/DeveloperDashboard.tsx`
- `src/pages/Marketplace.tsx`
- `src/pages/AdminPayments.tsx`
- `src/lib/hedera.ts`

### Quick Find & Replace:
```bash
# In your code editor, find and replace:
Find: 'http://localhost:3001
Replace: `${API_BASE_URL}

# Don't forget to add the import at the top of each file!
```

---

## 🔒 Part 4: Configure CORS

Update `server/index.js`:

```javascript
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:8080',
  'https://gamersnft.vercel.app', // Your Vercel URL
  'https://your-custom-domain.com' // If you have one
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 🗄️ Part 5: Database Setup

### For Railway/Render (Persistent Volume)
- Database automatically persists in mounted volume
- No additional setup needed

### For Production (Recommended: PostgreSQL)

If you want to scale, migrate from SQLite to PostgreSQL:

1. **Add PostgreSQL on Railway/Render**
   - Railway: Add PostgreSQL plugin
   - Render: Create PostgreSQL database

2. **Update `server/database.js`**
   ```javascript
   // Replace better-sqlite3 with pg
   import pg from 'pg';
   const { Pool } = pg;

   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

3. **Migrate Schema**
   - Convert CREATE TABLE statements to PostgreSQL syntax
   - Run migration script

---

## 🧪 Part 6: Post-Deployment Testing

### 1. Smoke Tests
- [ ] Visit your frontend URL
- [ ] Check all pages load (Home, Marketplace, Docs, etc.)
- [ ] Verify no console errors
- [ ] Test on mobile device

### 2. Wallet Connection
- [ ] Connect HashPack wallet
- [ ] Verify account ID displays correctly
- [ ] Check balance shows up
- [ ] Disconnect and reconnect

### 3. Developer Dashboard
- [ ] Register a test game
- [ ] Verify API key generated
- [ ] Create NFT template
- [ ] Copy API key and test in demo game

### 4. NFT Minting
- [ ] Mint NFT manually from Mint page
- [ ] Verify NFT appears in "My Collectibles"
- [ ] Check metadata loads from IPFS
- [ ] Test game API minting (use demo game)

### 5. Marketplace
- [ ] List NFT for sale
- [ ] Search for NFT
- [ ] Filter by game/rarity
- [ ] Buy NFT with different account
- [ ] Verify auto-payment processing (wait 10 seconds)
- [ ] Check NFT ownership transferred
- [ ] Verify royalty distribution

### 6. Admin Panel
- [ ] Access `/admin/payments` with admin account
- [ ] Verify non-admin accounts are blocked
- [ ] Check failed payments tab
- [ ] Test platform overview

---

## 📊 Part 7: Monitoring & Maintenance

### Set Up Monitoring

1. **Backend Logs**
   - Railway: View logs in dashboard
   - Render: Logs tab
   - Set up log alerts for errors

2. **Frontend Errors**
   - Add Sentry: `npm install @sentry/react`
   - Configure in `src/main.tsx`

3. **Uptime Monitoring**
   - Use [UptimeRobot](https://uptimerobot.com) (free)
   - Monitor both frontend and backend
   - Get alerts if site goes down

### Database Backups

```bash
# For SQLite (Railway/Render with volume)
# Set up daily backups via cron job or Railway plugin

# For PostgreSQL
# Enable automatic backups in hosting dashboard
```

### Performance Monitoring

- Check Vercel Analytics
- Monitor API response times
- Watch for slow IPFS loads
- Track payment processing times

---

## 🐛 Troubleshooting

### Issue: CORS Errors
**Solution**: Verify backend CORS config includes your frontend URL

### Issue: Environment Variables Not Working
**Solution**: 
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Verify `VITE_` prefix for frontend variables

### Issue: Database Resets on Deploy
**Solution**: Ensure persistent volume is mounted correctly

### Issue: Payment Verification Fails
**Solution**:
- Check Hedera Mirror Node API is accessible
- Verify account IDs are correct
- Check backend logs for errors

### Issue: IPFS Images Not Loading
**Solution**:
- Verify Pinata JWT is valid
- Check gateway URL is correct
- Test IPFS CID directly in browser

### Issue: HashConnect Not Connecting
**Solution**:
- Verify WalletConnect Project ID is correct
- Check network is set to "testnet"
- Clear browser cache and try again

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Frontend loads without errors  
✅ Wallet connects successfully  
✅ Can register games and create templates  
✅ NFTs mint and display correctly  
✅ Marketplace shows listings  
✅ Payments process automatically  
✅ Royalties distribute correctly  
✅ Admin panel accessible only to you  
✅ No failed payments in admin panel  
✅ Site works on mobile devices  

---

## 📈 Next Steps After Deployment

1. **Announce Beta Launch**
   - Post on Twitter/Discord
   - Invite developers to test
   - Gather feedback

2. **Monitor for 1-2 Weeks**
   - Watch for bugs
   - Track user behavior
   - Collect feature requests

3. **Iterate Based on Feedback**
   - Fix critical bugs
   - Improve UX
   - Add requested features

4. **Prepare for Mainnet**
   - See `MAINNET_MIGRATION.md` (coming next)
   - Plan launch strategy
   - Set up real payment processing

---

## 🆘 Need Help?

- **Hedera Discord**: [discord.gg/hedera](https://discord.gg/hedera)
- **Hedera Docs**: [docs.hedera.com](https://docs.hedera.com)
- **HashPack Support**: [hashpack.app/support](https://hashpack.app/support)

---

## 📝 Deployment Checklist Summary

```
Pre-Deployment:
□ Local testing complete
□ Code cleaned and optimized
□ Accounts and API keys ready

Backend Deployment:
□ Railway/Render/Heroku configured
□ Environment variables set
□ Persistent storage added
□ Backend URL copied

Frontend Deployment:
□ Vercel/Netlify configured
□ Environment variables set
□ Backend URL configured
□ Frontend URL copied

Configuration:
□ CORS configured
□ API calls updated
□ Database persisting

Testing:
□ All features tested in production
□ Mobile testing complete
□ Admin access verified

Monitoring:
□ Logs accessible
□ Uptime monitoring set up
□ Error tracking configured

Launch:
□ Announcement prepared
□ Documentation updated
□ Support channels ready
```

---

**Congratulations! Your GamersNFT marketplace is now live on Hedera Testnet! 🎉**

Next: See `MAINNET_MIGRATION.md` for switching to mainnet when ready.
