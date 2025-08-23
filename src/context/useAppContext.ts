'use client';

import { useGlobalContext } from './GlobalContext';
import { useAuthContext } from './AuthContext';

/**
 * Combined hook that provides access to both Global and Auth contexts
 * This is a convenience hook to access all app-wide state and functionality
 */
export const useAppContext = () => {
  const globalContext = useGlobalContext();
  const authContext = useAuthContext();

  return {
    // Global context
    global: globalContext,
    
    // Auth context
    auth: authContext,
    
    // Convenience getters for frequently used values
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: globalContext.isPageLoading || authContext.isLoading,
    currency: globalContext.currency,
    country: globalContext.country,
  };
};

// Type for the combined context
export type AppContextType = ReturnType<typeof useAppContext>;
