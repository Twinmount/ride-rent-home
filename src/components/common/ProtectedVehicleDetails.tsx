"use client";

import React from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

interface ProtectedVehicleDetailsProps {
  children: React.ReactNode;
}

export const ProtectedVehicleDetails: React.FC<
  ProtectedVehicleDetailsProps
> = ({ children }) => {
  return (
    <div>{children}</div>
    // <ProtectedRoute showLoginModal={true} fallbackPath="/">
    //   {children}
    // </ProtectedRoute>
  );
};

export default ProtectedVehicleDetails;
