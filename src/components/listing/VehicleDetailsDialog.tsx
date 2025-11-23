"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/map-dialog";
import { MapVehicleCardType } from "@/types/vehicle-types";
import VehicleMapCard from "../card/vehicle-card/main-card/VehicleMapCard";
import { Fragment } from "react";

export function VehicleDetailsDialog({
  open,
  vehicles,
  setOpen,
  country,
}: {
  open: boolean;
  vehicles: MapVehicleCardType[];
  setOpen: (open: boolean) => void;
  country: string;
}) {
  // console.log("vehicles: ", vehicles);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="z-[9999] h-fit max-h-[80%] w-fit max-w-md">
        <DialogHeader className="m-3 mb-2">
          <DialogTitle className="pt-2 font-normal">
            {vehicles.length === 1
              ? "Vehicle Details"
              : `${vehicles.length} Vehicles Available`}
          </DialogTitle>
        </DialogHeader>

        <div>
          {vehicles.map((vehicle) => {
            return (
              <Fragment key={vehicle.vehicleCode}>
                <VehicleMapCard vehicle={vehicle} country={country} />
              </Fragment>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
