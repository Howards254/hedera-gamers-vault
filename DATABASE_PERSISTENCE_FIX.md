# Database Persistence Fix

## Problem

Your NFTs, games, and marketplace listings disappear after every code deployment because:
- Render rebuilds the container on each deploy
- SQLite database (`marketplace.db`) is stored in the container
- Container is destroyed → Database is lost ❌

## Solution: Add Persistent Disk Storage

### Step 1: Configure Persistent Disk on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your service**: `gamersnft-backend`
3. **Click "Disks" in left sidebar**
4. **Click "Add Disk"** button
5. **Configure the disk**:
   ```
   Name: database
   Mount Path: /opt/render/project/src/server
   Size: 1 GB (free tier)
   ```
6. **Click "Save"**
7. **Render will redeploy automatically**

### Step 2: Verify It's Working

After Render finishes deploying:

1. **Mint a test NFT** on https://gamersnft.netlify.app
2. **Make a code change** (e.g., add a comment in any file)
3. **Push to GitHub** - Render will redeploy
4. **Check if NFT still exists** after deployment ✅

### What Changed in Code

Updated `server/database.js` to use absolute path:
```javascript
// Before (relative path - gets lost on redeploy)
const db = new Database('marketplace.db');

// After (absolute path in server directory - persists)
const db = new Database(path.join(__dirname, 'marketplace.db'));
```

## How Persistent Disks Work

### Without Persistent Disk
```
Deploy 1:
Container created → marketplace.db created → NFTs minted
                                              ↓
Deploy 2:
Container destroyed → marketplace.db LOST ❌
New container created → Empty marketplace.db → No NFTs
```

### With Persistent Disk
```
Deploy 1:
Container created → marketplace.db on disk → NFTs minted
                                              ↓
Deploy 2:
Container destroyed → marketplace.db SAFE ✅ (on disk)
New container created → Mounts same disk → NFTs still there!
```

## Render Free Tier Disk Limits

- **Size**: 1 GB (plenty for SQLite)
- **Persistence**: Survives redeploys
- **Backups**: Manual (download via Render shell)
- **Performance**: Same as container storage

## Alternative: Upgrade to PostgreSQL

For production, consider migrating to PostgreSQL:

### Benefits
- Better for concurrent users
- Automatic backups
- Better performance at scale
- Industry standard

### How to Migrate

1. **Add PostgreSQL on Render**:
   - Dashboard → New → PostgreSQL
   - Free tier: 256 MB storage

2. **Update database.js**:
   ```javascript
   // Replace better-sqlite3 with pg
   import pg from 'pg';
   const { Pool } = pg;
   
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     ssl: { rejectUnauthorized: false }
   });
   ```

3. **Migrate schema**:
   - Convert CREATE TABLE statements
   - Run migration script

## Backup Your Database

### Download Current Database

1. **Open Render Shell**:
   - Dashboard → Your service → Shell tab
   
2. **Download database**:
   ```bash
   cat server/marketplace.db > /tmp/backup.db
   ```

3. **Copy to local**:
   - Use Render's file download feature
   - Or use `scp` if you have SSH access

### Restore Database

1. **Upload to Render**:
   ```bash
   # In Render shell
   cat > server/marketplace.db
   # Paste database content
   # Press Ctrl+D
   ```

2. **Restart service**:
   - Dashboard → Manual Deploy → Deploy latest commit

## Monitoring Database Size

Check database size in Render shell:
```bash
ls -lh server/marketplace.db
```

SQLite is very efficient:
- 1,000 NFTs ≈ 1 MB
- 10,000 NFTs ≈ 10 MB
- 100,000 NFTs ≈ 100 MB

## Troubleshooting

### Disk not mounting
**Symptom**: Database still resets after adding disk
**Fix**: 
- Verify mount path is `/opt/render/project/src/server`
- Check Render logs for mount errors
- Redeploy manually

### Database locked
**Symptom**: "Database is locked" error
**Fix**:
- SQLite doesn't handle concurrent writes well
- Consider PostgreSQL for production
- Or add write queue in code

### Disk full
**Symptom**: "No space left on device"
**Fix**:
- Check disk usage in Render shell
- Clean up old data
- Upgrade to larger disk (paid)

## Next Steps

1. ✅ **Add persistent disk** (follow Step 1 above)
2. ✅ **Push updated code** (already done)
3. ✅ **Test persistence** (mint NFT, redeploy, check)
4. 📅 **Plan PostgreSQL migration** (for production)
5. 📅 **Set up automated backups** (future)

## Summary

**Before**: Database resets on every deploy ❌  
**After**: Database persists across deploys ✅

**Action Required**: Add persistent disk on Render (5 minutes)

Once configured, your NFTs, games, and listings will survive all future deployments!
