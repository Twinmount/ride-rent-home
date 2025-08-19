'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/map-dialog';
import { MapVehicleCardType } from '@/types/vehicle-types';
import Link from 'next/link';
import { generateVehicleDetailsUrl } from '@/helpers';
import VehicleMapCard from '../card/new-vehicle-card/main-card/VehicleMapCard';
import { Fragment } from 'react';

export function VehicleDetailsDialog({
  open,
  vehicles,
  setOpen,
  country,
  state,
  category,
}: {
  open: boolean;
  vehicles: MapVehicleCardType[];
  setOpen: (open: boolean) => void;
  country: string;
  state: string;
  category: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="h-fit max-h-[80%] w-fit max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>
            {vehicles.length === 1
              ? 'Vehicle Details'
              : `${vehicles.length} Vehicles Available`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {vehicles.map((vehicle) => {
            const vehicleDetailsPageLink = generateVehicleDetailsUrl({
              vehicleTitle: vehicle.model,
              state: state,
              vehicleCategory: category,
              vehicleCode: vehicle.vehicleCode,
              country: country,
            });
            return (
              <Fragment key={vehicle.vehicleCode}>
                <Link
                  target="_blank"
                  href={`https://dev.ride.rent${vehicleDetailsPageLink}`}
                >
                  <VehicleMapCard vehicle={vehicle} country={country} />
                </Link>
              </Fragment>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
