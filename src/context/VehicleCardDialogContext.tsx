"use client";

import { VehicleCardType } from "@/types/vehicle-types";
import React, { createContext, useState, useContext, useEffect } from "react";

interface DialogContextType {
  selectedVehicle: VehicleCardType;
  openDialog: (vehicle: VehicleCardType) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const VehicleCardDialogProvider: React.FC<{
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
    <DialogContext.Provider
      value={{ selectedVehicle, openDialog, closeDialog }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialogContext = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error(
      "useDialog must be used within a VehicleCardDialogProvider",
    );
  }
  return context;
};
