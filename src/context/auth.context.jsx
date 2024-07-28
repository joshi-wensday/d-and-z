// src/context/auth.context.jsx

import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithGoogle, 
  signInWithApple, 
  signUp, 
  signIn, 
  signOut,
  onAuthStateChangedListener
} from '../utils/firebase/firebase.utils';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(setUser);
    return unsubscribe;
  }, []);

  const contextValue = {
    user,
    signIn: async (email, password) => {
      const user = await signIn(email, password);
      setUser(user);
    },
    signUp: async (email, password, displayName) => {
      const user = await signUp(email, password, displayName);
      setUser(user);
    },
    signInWithGoogle: async () => {
      const user = await signInWithGoogle();
      setUser(user);
    },
    signInWithApple: async () => {
      const user = await signInWithApple();
      setUser(user);
    },
    signOut: async () => {
      await signOut();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};