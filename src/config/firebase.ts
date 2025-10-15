// Firebase Configuration for Village Auto Connect
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase config - Sullia Auto Connect Project
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyC_CsK5PAJcP9VclF7u42IQc0ClI6fOZdw",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "sullia-auto-connect.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "sullia-auto-connect",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "sullia-auto-connect.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "648404312897",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:648404312897:web:22218d3a3a4109b587f7c0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Configure Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;