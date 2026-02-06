# Portfolio Website Deployment Guide

## Prerequisites
- GitHub account (free)
- MongoDB Atlas account (free cloud database)
- Vercel account (free)
- Railway account (free)

---

## Step 1: MongoDB Atlas Setup (Cloud Database)

### 1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign Up with Email"
3. Fill in your details and verify email
4. Accept terms and create account

### 1.2 Create a Cluster
1. Click "Create a Deployment"
2. Choose **M0 (Free Forever)** tier
3. Select your region (closest to your users)
4. Click "Create Deployment"
5. Wait 3-5 minutes for cluster to be ready

### 1.3 Create Database User
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Username: `admin`
4. Password: Create a **strong password** (copy it!)
5. Database User Privileges: "Atlas Admin"
6. Click "Add User"

### 1.4 Get Connection String
1. In the left sidebar, click "Clusters"
2. Click "Connect" button
3. Choose "Drivers"
4. Copy the connection string
5. Replace `<username>` and `<password>` with your credentials
6. Replace `myFirstDatabase` with `lx_portfolio`

**Example:**
```
mongodb+srv://admin:MyPassword123@cluster0.a1b2c.mongodb.net/lx_portfolio?retryWrites=true&w=majority
```

---

## Step 2: GitHub Setup

### 2.1 Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Repository name: `portfolio` (or any name)
3. Description: "Personal Portfolio Website"
4. Choose **Public** or **Private**
5. Click "Create repository"

### 2.2 Push Your Code
In your terminal (at `c:\Projects\lx`):

```powershell
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 3: Prepare Backend for Railway

### 3.1 Update `.env` in server folder

Create `server/.env` with:
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lx_portfolio?retryWrites=true&w=majority
JWT_SECRET=nanah_812_secret_key_god_tier
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Nanah@812
NODE_ENV=production
```

### 3.2 Commit to GitHub
```powershell
git add server/.env
git commit -m "Add production environment variables"
git push
```

---

## Step 4: Deploy Backend to Railway

### 4.1 Connect Railway to GitHub
1. Go to [railway.app](https://railway.app)
2. Click "Start New Project"
3. Click "Deploy from GitHub repo"
4. Connect your GitHub account (authorize if needed)
5. Select your repository
6. Railway will auto-detect it's a Node.js app

### 4.2 Set Environment Variables on Railway
1. In Railway dashboard, click your project
2. Click the "server" service
3. Go to "Variables" tab
4. Copy all variables from `server/.env`:
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=nanah_812_secret_key_god_tier`
   - `ADMIN_USERNAME=admin`
   - `ADMIN_PASSWORD=Nanah@812`
   - `NODE_ENV=production`

5. Click "Deploy"
6. Wait for deployment to complete (~2 minutes)

### 4.3 Get Backend URL
1. In Railway, click your project
2. Click "server" service
3. Copy the URL shown (e.g., `https://portfolio-production-abc123.railway.app`)
4. **Save this URL** - you'll need it for the frontend

---

## Step 5: Prepare Frontend for Vercel

### 5.1 Update Frontend Environment Variables

Create `c:\Projects\lx\.env.production` with:
```env
VITE_API_URL=https://your-railway-backend-url.railway.app
```

Replace with your actual Railway backend URL from Step 4.3

### 5.2 Commit to GitHub
```powershell
git add .env.production
git commit -m "Add production API URL"
git push
```

---

## Step 6: Deploy Frontend to Vercel

### 6.1 Connect Vercel to GitHub
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Click "Import Git Repository"
4. Paste your GitHub repository URL and click "Import"
5. Or: Connect your GitHub account → select repository

### 6.2 Configure Build Settings
Vercel should auto-detect:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

If not, set them manually.

### 6.3 Set Environment Variables
1. Before deploying, go to "Environment Variables"
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-railway-backend-url.railway.app`
3. Click "Add"
4. Click "Deploy"

### 6.4 Wait for Deployment
- Deployment takes ~3-5 minutes
- Once complete, Vercel shows your live URL (e.g., `https://portfolio-xyz.vercel.app`)

---

## Step 7: Test Your Deployment

### 7.1 Test Frontend
1. Visit your Vercel URL
2. Check all pages load correctly
3. Verify images and animations work

### 7.2 Test Admin Dashboard
1. Go to `/admin/login`
2. Login with:
   - Username: `admin`
   - Password: `Nanah@812`
3. Test creating a skill or work
4. Verify data saves to MongoDB

### 7.3 Test Contact Form
1. Fill out the contact form
2. Check your email for submission
3. Verify message appears in admin dashboard

---

## Step 8: Custom Domain (Optional)

### Connect Your Domain to Vercel
1. In Vercel, go to "Domains"
2. Add your domain
3. Update your domain's DNS records with Vercel's nameservers
4. Wait 24-48 hours for DNS propagation

---

## Troubleshooting

### Backend not connecting?
- Check MongoDB connection string (username/password)
- Check Railway environment variables are set
- View Railway logs for errors

### Frontend not calling API?
- Verify `.env.production` has correct `VITE_API_URL`
- Check browser console for CORS errors
- Restart Vercel deployment

### Admin dashboard empty?
- Seed your MongoDB database:
  ```powershell
  cd server
  node seed.js
  ```

### SSL Certificate Issues
- Railway automatically provides SSL
- Vercel automatically provides SSL
- No action needed

---

## Updating Your Site

Whenever you make changes:

```powershell
# Commit and push to GitHub
git add .
git commit -m "Update message"
git push origin main
```

Both Vercel and Railway will automatically redeploy!

---

## Important URLs
- **Frontend:** https://portfolio-xyz.vercel.app
- **Backend API:** https://your-railway-app.railway.app
- **Admin Panel:** https://portfolio-xyz.vercel.app/admin
- **MongoDB:** https://cloud.mongodb.com (for database management)

---

## Security Notes
⚠️ **DO NOT commit `.env` to GitHub** (except `.env.example`)
- Only use `.env.local` for local development
- Always set variables in Vercel/Railway dashboards for production
- Use strong passwords for admin accounts
- Keep JWT_SECRET private

---

Need Help?
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- MongoDB Docs: https://docs.mongodb.com
