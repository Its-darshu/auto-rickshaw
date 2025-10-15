import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// List of admin email addresses (in production, store this in Firebase or a secure database)
const ADMIN_EMAILS = [
  'darshan99806@gmail.com',
  'admin@villageautoconnect.com',
  // Add more admin emails as needed
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async (): Promise<void> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user is admin
      if (ADMIN_EMAILS.indexOf(user.email || '') === -1) {
        await signOut(auth);
        throw new Error('Access denied. Only authorized administrators can access this panel.');
      }
      
      console.log('Admin signed in:', user.email);
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Only set user if they are an admin
      if (user && ADMIN_EMAILS.indexOf(user.email || '') !== -1) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
        // If non-admin tries to stay signed in, sign them out
        if (user && ADMIN_EMAILS.indexOf(user.email || '') === -1) {
          signOut(auth);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const isAdmin = currentUser !== null && ADMIN_EMAILS.indexOf(currentUser.email || '') !== -1;

  const value: AuthContextType = {
    currentUser,
    loading,
    signInWithGoogle,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};