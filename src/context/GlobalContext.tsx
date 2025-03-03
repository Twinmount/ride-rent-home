"use client";

import React, { createContext, useContext, useState } from "react";
import { VehicleCardContextProvider } from "./VehicleCardContext";

type GlobalContextType = {
  isPageLoading: boolean;
  setIsPageLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

// global context
const GlobalContext = createContext<GlobalContextType | null>(null);

// wrapper component for global context
export const GlobalContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPageLoading, setIsPageLoading] = useState(false);

  return (
    <GlobalContext.Provider value={{ isPageLoading, setIsPageLoading }}>
      {/* vehicle card context provider */}
      <VehicleCardContextProvider>{children}</VehicleCardContextProvider>
    </GlobalContext.Provider>
  );
};

// custom hook for global context
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      "useGlobalContext must be used within a GlobalContextProvider",
    );
  }

  return context;
};
