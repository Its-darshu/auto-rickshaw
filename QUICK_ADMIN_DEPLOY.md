# 🚀 Quick Admin Domain Setup

## Easiest Method: Two Vercel Projects

### Step 1: Deploy Main App (Users)
```bash
# In your project folder
vercel --prod

# When prompted:
# Project name: village-auto-connect
# Result: https://village-auto-connect.vercel.app
```

### Step 2: Deploy Admin App (Separate Domain)
```bash
# Deploy admin version
vercel --prod --local-config vercel-admin.json

# When prompted:
# Project name: village-auto-admin  
# Result: https://village-auto-admin.vercel.app
```

## 🎯 Final URLs:
- **Users**: `https://village-auto-connect.vercel.app` 
- **Admins**: `https://village-auto-admin.vercel.app` (auto-redirects to /admin66)

## ⚡ Quick Commands Added:
```bash
# Deploy user app
npm run deploy:user

# Deploy admin app
npm run deploy:admin
```

Both use the same Firebase backend - just different entry points! 🎉