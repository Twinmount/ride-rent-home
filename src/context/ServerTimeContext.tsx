"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchServerTime } from "@/lib/api/general-api";
import { ServerTimeResponse } from "@/types";

interface ServerTimeContextValue {
  serverTime: Date;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const ServerTimeContext = createContext<ServerTimeContextValue | undefined>(
  undefined
);

interface ServerTimeContextProviderProps {
  children: ReactNode;
  country: string;
}

export function ServerTimeContextProvider({
  children,
  country,
}: ServerTimeContextProviderProps) {
  const { data, isLoading, error, refetch } = useQuery<ServerTimeResponse>({
    queryKey: ["serverTime", country],
    queryFn: () => fetchServerTime(country),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0, // Always consider stale to refetch on focus
    gcTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 3,
    retryDelay: 1000,
  });

  // Use server time if available, fallback to client time
  const serverTime = data?.result?.serverTime
    ? new Date(data.result.serverTime)
    : new Date();

  const value: ServerTimeContextValue = {
    serverTime,
    isLoading,
    error: error as Error | null,
    refetch,
  };

  return (
    <ServerTimeContext.Provider value={value}>
      {children}
    </ServerTimeContext.Provider>
  );
}

// Hook to access the context
export function useServerTimeContext(): ServerTimeContextValue {
  const context = useContext(ServerTimeContext);
  if (!context) {
    throw new Error(
      "useServerTimeContext must be used within ServerTimeContextProvider"
    );
  }
  return context;
}
