# Village Auto Connect - Simple 2-Interface App

This app has been simplified to focus on just **2 core interfaces**:
1. **User Dashboard** - Find and contact auto drivers
2. **Admin Panel** - Manage drivers and stages

## 🔥 Firebase Firestore Integration

### Key Features:
- **Real-time Updates**: Admin changes are instantly reflected in user dashboard
- **Cloud Database**: All data stored in Firebase Firestore
- **Simplified UI**: All user features in one dashboard, no separate pages
- **Admin Authentication**: Google OAuth authentication for secure admin access

## 🚀 Deployment Instructions

### Prerequisites:
1. Firebase project set up with Firestore enabled
2. Vercel account
3. Node.js installed locally

### 1. Firebase Setup:
```bash
# Enable Firestore in Firebase Console
1. Go to Firebase Console → Firestore Database
2. Create database (start in production mode)
3. Set up security rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all users
    match /drivers/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /stages/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}

4. Enable Authentication → Google provider
```

### 2. Deploy to Vercel:

#### Single Deployment (Recommended):
```bash
# Clone and deploy
git clone <your-repo>
cd auto-rickshaw

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# REACT_APP_FIREBASE_API_KEY=your_api_key
# REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
# REACT_APP_FIREBASE_PROJECT_ID=your_project_id
# REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
# REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
# REACT_APP_FIREBASE_APP_ID=your_app_id
```

#### Separate User/Admin Deployments (Optional):
If you want separate domains for user and admin:

1. **User Dashboard**: 
   - Deploy normally: `vercel --prod`
   - Domain: `your-app.vercel.app`

2. **Admin Panel**: 
   - Create new Vercel project
   - Deploy with different domain: `admin-your-app.vercel.app`
   - Both use same Firebase backend

## 🛠 Admin Panel Features

### Access:
- URL: `your-domain.com/admin66`
- Authentication: Google OAuth only
- Authorized emails configured in `src/context/AuthContext.tsx`

### Features:
- **Real-time Updates**: All changes instantly sync to user dashboard
- **Sample Data**: Initialize demo data if starting fresh
- **CRUD Operations**: Add, edit, delete drivers and stages
- **Loading States**: User feedback during operations
- **Error Handling**: Graceful error messages

### First Time Setup:
1. Navigate to `/admin66`
2. Sign in with authorized Google account
3. Click "Initialize Sample Data" if database is empty
4. Start adding/managing drivers and stages

### 📱 User Dashboard Features (Single Page)

### Real-time Data:
- **Live Updates**: Sees admin changes immediately
- **Universal Search**: Find drivers by name, phone, or vehicle number
- **Emergency Drivers**: Always shown first for 24/7 availability
- **Stage Selection**: Click any stage to see its drivers
- **Direct Contact**: Call or WhatsApp drivers instantly
- **Back Navigation**: Easy return from stage view to main dashboard

## 🔧 Technical Architecture

### Data Flow:
```
Admin Panel → Firebase Firestore → User Dashboard
     ↑                              ↓
 Real-time sync ←←←←←←←←←←←←←←←←←←←←← Real-time listeners
```

### Collections:
- `drivers`: Driver information and contact details
- `stages`: Location/stage information with coordinates

### Security:
- Read access: Public (for user dashboard)
- Write access: Authenticated users only (admin panel)
- Admin verification: Email whitelist in AuthContext

## 🌐 Environment Variables

Create `.env.local` for local development:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## 📊 Database Schema

### Drivers Collection:
```typescript
{
  id: string,
  name: string,
  phoneNumber: string,
  vehicleNumber: string,
  stageId: string,
  isEmergency: boolean,
  whatsappNumber?: string,
  createdAt: Date,
  updatedAt?: Date
}
```

### Stages Collection:
```typescript
{
  id: string,
  name: string,
  nameKn: string,
  latitude?: number,
  longitude?: number,
  createdAt: Date,
  updatedAt?: Date
}
```

### 🌐 Live URLs (After Deployment):

- **User Dashboard**: `https://your-app.vercel.app` (Main page with all user features)
- **Admin Panel**: `https://your-app.vercel.app/admin66` (Admin management interface)

## ✅ Testing Real-time Updates:

1. Open user dashboard in one browser tab
2. Open admin panel in another tab
3. Add/edit a driver in admin panel
4. Watch it appear/update instantly in user dashboard
5. Test with multiple user dashboard tabs open

## 🔐 Admin Configuration:

Update admin emails in `src/context/AuthContext.tsx`:
```typescript
const ADMIN_EMAILS = [
  'your_admin@gmail.com',
  'another_admin@email.com',
];
```

The system is now fully integrated with real-time data synchronization! 🎉