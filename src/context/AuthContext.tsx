'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { UseAuthReturn } from '@/types/auth.types';

const AuthContext = createContext<UseAuthReturn | null>(null);

export const AuthContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const authHook = useAuth();

  useEffect(() => {
    //add session validation logic here if needed
    //checking if stored token is still valid
    const token = authHook.auth.token;
    if (token) {
      // Optionally validate token with server
      console.log('Auth session restored from storage');
    }
  }, []);

  return (
    <AuthContext.Provider value={authHook}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an AuthContextProvider'
    );
  }

  return context;
};

// Export the context for advanced usage
export { AuthContext };

// Type for the context value
export type AuthContextType = UseAuthReturn;
