'use client';
import { BlurDialog } from '@/components/ui/blur-dialog';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/map-dialog';
import { VehicleCardType } from '@/types/vehicle-types';
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
  vehicles: VehicleCardType[];
  setOpen: (open: boolean) => void;
  country: string;
  state: string;
  category: string;
}) {
  return (
    <>
      <BlurDialog open={open} onOpenChange={setOpen}>
        <DialogContent className={`h-fit max-h-fit w-fit max-w-fit`}>
          <DialogHeader className="sr-only">
            <DialogTitle>
              {vehicles.length === 1
                ? 'Vehicle Details'
                : `${vehicles.length} Vehicles Available`}
            </DialogTitle>
          </DialogHeader>

          <div>
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
      </BlurDialog>
    </>
  );
}
