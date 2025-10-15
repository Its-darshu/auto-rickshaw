# 🚀 Quick Vercel Deploy - 5 Minutes

## Step 1: Go to Vercel
- Visit [vercel.com](https://vercel.com)
- Sign in with GitHub
- Click "New Project"

## Step 2: Import Repository
- Select `Its-darshu/auto-rickshaw`
- Click "Import"
- Click "Deploy" (settings auto-detected)

## Step 3: Add Environment Variables
Go to Settings → Environment Variables, add:

```
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 4: Redeploy
- Go to Deployments
- Click "..." → Redeploy

## Step 5: Test Your App
- **User App**: `https://your-app.vercel.app`
- **Admin Panel**: `https://your-app.vercel.app/admin66`

## 🔥 Get Firebase Config
Firebase Console → Project Settings → Config

## ✅ Done!
Auto-deployments enabled. Push to GitHub = Auto-deploy 🎉