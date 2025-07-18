"use client";

import { NewVehicleCardType } from "@/types/vehicle-types";
import React, { createContext, useState, useContext } from "react";

interface VehicleCardContextType {
  selectedVehicle: NewVehicleCardType;
  openDialog: (vehicle: NewVehicleCardType) => void;
  closeDialog: () => void;
}

const VehicleCardContext = createContext<VehicleCardContextType | undefined>(
  undefined,
);

export const VehicleCardContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const openDialog = (vehicle: any) => {
    setSelectedVehicle(vehicle);
  };

  const closeDialog = () => {
    setSelectedVehicle(null);
  };

  return (
    <VehicleCardContext.Provider
      value={{
        selectedVehicle,
        openDialog,
        closeDialog,
      }}
    >
      {children}
    </VehicleCardContext.Provider>
  );
};

export const useVehicleCardContext = (): VehicleCardContextType => {
  const context = useContext(VehicleCardContext);
  if (!context) {
    throw new Error(
      "useVehicleCardContext must be used within a VehicleCardProvider",
    );
  }
  return context;
};
