"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDialogContext } from "@/context/VehicleCardDialogContext";
import EnquirePriceDialogCard from "@/components/card/vehicle-card/EnquirePriceDialogCard";

const PriceEnquireDialog: React.FC = () => {
  const { selectedVehicle, closeDialog } = useDialogContext();
  const isOpen = Boolean(selectedVehicle);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
        }
      }}
    >
      <DialogContent className="max-w-96 rounded-xl bg-white">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            Enquire Best Prices
          </DialogTitle>

          <DialogDescription className="text-center text-sm text-gray-600">
            Responds in less than 5 minutes
          </DialogDescription>

          {/* Card Component */}
          <EnquirePriceDialogCard vehicle={selectedVehicle} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PriceEnquireDialog;
