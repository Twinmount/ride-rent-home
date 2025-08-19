"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useVehicleCardContext } from "@/context/VehicleCardContext";
import { FC } from "react";

/**
 * A minimal dialog that shows the selected vehicle’s image and title.
 */
const BookingDialog: FC = () => {
  const { selectedVehicle, closeDialog } = useVehicleCardContext();
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
      <DialogContent className="max-w-md rounded-xl bg-white p-4 shadow-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Booking Vehicle</DialogTitle>
          <DialogDescription className="sr-only">
            Quick view of selected vehicle
          </DialogDescription>
        </DialogHeader>

        {selectedVehicle && (
          <div className="flex items-center gap-4">
            {/* Vehicle Image */}
            <div className="h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
              <img
                src={selectedVehicle.thumbnail}
                alt={selectedVehicle.vehicleTitle}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Vehicle Title */}
            <div className="flex-1">
              <h2 className="text-base font-medium text-gray-800">
                {selectedVehicle.vehicleTitle}
              </h2>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
