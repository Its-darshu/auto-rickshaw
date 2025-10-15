# 🌐 Separate Domain Deployment Guide

## 🎯 Goal: Deploy Admin Panel on Separate Domain

You'll have:
- **User App**: `https://village-auto.vercel.app` (main domain)
- **Admin Panel**: `https://admin-village-auto.vercel.app` (admin domain)

## 🚀 Method 1: Two Separate Vercel Projects (Recommended)

### Step 1: Deploy User App (Main Domain)
```bash
# Deploy main user app
vercel --prod

# This creates: https://your-project.vercel.app
# Users access: https://your-project.vercel.app
```

### Step 2: Deploy Admin App (Separate Domain)
```bash
# Deploy admin-only version
vercel --prod --local-config vercel-admin.json

# This creates: https://your-project-admin.vercel.app
# Admins access: https://your-project-admin.vercel.app
```

### Step 3: Configure Custom Domains (Optional)
In Vercel Dashboard:
- **User Project** → Add domain: `villageauto.com`
- **Admin Project** → Add domain: `admin.villageauto.com`

---

## 🚀 Method 2: Single Project with Subdomain Routing

### Step 1: Update vercel.json for Subdomain Detection
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html",
      "has": [
        {
          "type": "host",
          "value": "admin.your-domain.com"
        }
      ]
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Step 2: Update React Router for Subdomain Detection
```typescript
// In App.tsx or routing setup
const isAdminDomain = window.location.hostname.startsWith('admin.');

function App() {
  return (
    <Router>
      <Routes>
        {isAdminDomain ? (
          // Admin-only routes
          <Route path="/*" element={<Navigate to="/admin66" replace />} />
        ) : (
          // User routes
          <>
            <Route path="/" element={<UserDashboard />} />
            <Route path="/admin66" element={<AdminPanel />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
```

---

## 🛠️ Method 3: Environment-Based Builds

### Step 1: Create Environment-Specific Builds
```bash
# Build for users
REACT_APP_BUILD_TYPE=user npm run build

# Build for admin
REACT_APP_BUILD_TYPE=admin npm run build
```

### Step 2: Update App.tsx to Handle Build Types
```typescript
// In App.tsx
const buildType = process.env.REACT_APP_BUILD_TYPE;

function App() {
  if (buildType === 'admin') {
    // Admin-only app
    return (
      <Router>
        <Routes>
          <Route path="/*" element={<Navigate to="/admin66" replace />} />
          <Route path="/admin66" element={<AdminPanel />} />
        </Routes>
      </Router>
    );
  }

  // Regular user app
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/admin66" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
```

---

## 📋 Deployment Commands

### For Method 1 (Separate Projects):
```bash
# Deploy user app
npm run deploy:user

# Deploy admin app  
npm run deploy:admin
```

### For Method 2 (Subdomain):
```bash
# Single deployment with subdomain routing
vercel --prod
```

### For Method 3 (Environment Builds):
```bash
# Deploy user version
REACT_APP_BUILD_TYPE=user vercel --prod

# Deploy admin version to new project
REACT_APP_BUILD_TYPE=admin vercel --prod
```

---

## 🎯 Recommended Setup: Method 1

### Step-by-Step:

1. **Deploy Main App**:
   ```bash
   vercel --prod
   # Result: https://village-auto.vercel.app
   ```

2. **Deploy Admin App**:
   ```bash
   vercel --prod --local-config vercel-admin.json
   # Result: https://village-auto-admin.vercel.app
   ```

3. **Custom Domains** (Optional):
   - Main: `villageauto.com`
   - Admin: `admin.villageauto.com`

### Benefits:
- ✅ **Separate domains** for security
- ✅ **Independent deployments** 
- ✅ **Different configurations** possible
- ✅ **Easy access control** via domain

### Security:
- **Admin domain** can have additional security
- **User domain** is public and fast
- **Firebase rules** handle data access control

---

## 🔧 Firebase Configuration

Your Firebase configuration remains the same for both domains since they use the same project. The security is handled by:

1. **Admin authentication** in your React app
2. **Firestore security rules** (already configured)
3. **Domain-based access control** (optional)

---

## 🎉 Final URLs:

After deployment:
- **Users**: `https://your-project.vercel.app`
- **Admins**: `https://your-project-admin.vercel.app/admin66`

Both apps share the same Firebase backend but have separate domains! 🚀