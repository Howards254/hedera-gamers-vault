# Deploy Backend to Render (Free)

Complete guide to deploy your Node.js backend on Render's free tier.

## Step 1: Sign Up

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Authorize Render to access your repositories

## Step 2: Create Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select your repo from the list

## Step 3: Configure Service

Fill in these settings:

```
Name: gamersnft-backend
Region: Oregon (US West) or closest to you
Branch: main
Root Directory: (leave empty)
Runtime: Node
Build Command: npm install
Start Command: node server/index.js
```

## Step 4: Select Free Plan

- Instance Type: **Free**
- Click **Advanced** to add environment variables

## Step 5: Add Environment Variables

Click **Add Environment Variable** for each:

```
VITE_MY_ACCOUNT_ID = 0.0.7098883
VITE_MY_PRIVATE_KEY = 302e020100300506032b65700422042060300874e23c9b2336eb8ef0984fc8e25c6bb7535873922304a616b8ba31d806
VITE_PROJECT_ID = dfe22a1aca8d834168d51a5ac05cec7b
VITE_HEDERA_NETWORK = testnet
VITE_PINATA_JWT = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkNzBmYjgyZS1hODEwLTRmOGQtYWVmZS1iYTE4Y2E0NjQzMzciLCJlbWFpbCI6Imthcm9sb255YW5nbzE4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiIxNTQzMzJhYzRiZjlhYTMzNTM1NyIsInNjb3BlZEtleVNlY3JldCI6IjVlOGU4NGQzMWI4ZGQwOTEwNDk4YjJhYjJhNTZmMmJhNmM4MGEyOTY4NTJjMzRjMDY2OWM4MWYzZDBjNTBmMDkiLCJleHAiOjE3OTMxMzM0Njh9.-R-fUQ1PZewcQ8LQZzxaHX0IK4X4X-0jvZBXSBBTt6Q
VITE_PINATA_GATEWAY = gateway.pinata.cloud
VITE_ADMIN_ACCOUNTS = 0.0.7098883
PORT = 3001
```

## Step 6: Add Persistent Disk

1. Scroll down to **Disks**
2. Click **Add Disk**
3. Settings:
   - Name: `database`
   - Mount Path: `/app/server`
   - Size: 1 GB (free)
4. Click **Save**

## Step 7: Create Web Service

Click **Create Web Service**

Render will:
- Clone your repo
- Install dependencies
- Start your server
- Give you a URL like: `https://gamersnft-backend.onrender.com`

## Step 8: Copy Your Backend URL

Once deployed, copy your service URL (e.g., `https://gamersnft-backend.onrender.com`)

## Step 9: Update Netlify

1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Update `VITE_BACKEND_URL` to your Render URL
4. Redeploy Netlify

## Step 10: Update CORS

1. Go back to Render
2. Environment → Add variable:
   ```
   FRONTEND_URL = https://your-site.netlify.app
   ```
3. Manual Deploy → Deploy latest commit

## ⚠️ Important: Free Tier Limitations

**Render Free Tier:**
- ✅ 750 hours/month (enough for 1 app)
- ✅ 512 MB RAM
- ✅ 1 GB persistent disk
- ⚠️ **Spins down after 15 minutes of inactivity**
- ⚠️ **Cold start takes 30-60 seconds**

**What this means:**
- First request after inactivity will be slow
- Users might see "Loading..." for 30-60 seconds
- Subsequent requests are fast

**Solutions:**
1. **Keep-alive service** (ping your backend every 14 minutes)
2. **Upgrade to paid** ($7/month - no cold starts)
3. **Use Fly.io** (no cold starts on free tier)

## 🔄 Auto-Deploy

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Render will detect the push and redeploy automatically.

## 📊 Monitor Your Service

1. **Logs:** Click on your service → Logs tab
2. **Metrics:** See CPU, memory, requests
3. **Events:** Track deploys and errors

## 🐛 Troubleshooting

### Service won't start
- Check logs for errors
- Verify start command: `node server/index.js`
- Ensure all environment variables are set

### Database resets
- Verify disk is mounted at `/app/server`
- Check disk is attached to service

### CORS errors
- Add FRONTEND_URL environment variable
- Redeploy after adding

### Cold starts too slow
- Consider upgrading to paid plan
- Or use Fly.io (no cold starts)

## ✅ Success!

Your backend is now live on Render!

Test it: `https://your-backend.onrender.com/api/v1/games`

Should return: `{"games":[]}`
