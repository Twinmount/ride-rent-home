'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/map-dialog';
import { MapVehicleCardType } from '@/types/vehicle-types';
import VehicleMapCard from '../card/vehicle-card/main-card/VehicleMapCard';
import { Fragment } from 'react';

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-fit max-h-[80%] w-fit max-w-md z-[9999]">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {vehicles.length === 1
              ? 'Vehicle Details'
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
