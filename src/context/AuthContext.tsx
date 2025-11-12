import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
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

  const signInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Check if user is admin
      if (ADMIN_EMAILS.indexOf(user.email || '') === -1) {
        await signOut(auth);
        throw new Error('Access denied. Only authorized administrators can access this panel.');
      }
      
      console.log('Admin signed in:', user.email);
    } catch (error: any) {
      console.error('Email sign-in error:', error);
      
      // Provide user-friendly error messages
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password. Please try again.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed login attempts. Please try again later.');
      } else if (error.message.includes('Access denied')) {
        throw error;
      } else {
        throw new Error('Failed to sign in. Please try again.');
      }
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
    signInWithEmail,
    logout,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};