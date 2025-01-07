"use client";

import React, { createContext, useContext, useState } from "react";

type NavbarContextType = {
  isHidden: boolean;
  setIsHidden: (hidden: boolean) => void;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <NavbarContext.Provider value={{ isHidden, setIsHidden }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within a NavbarProvider");
  }
  return context;
};
