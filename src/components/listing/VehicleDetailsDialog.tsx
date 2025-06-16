"use client";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleCardType } from "@/types/vehicle-types";
import Link from "next/link";
import { generateVehicleDetailsUrl } from "@/helpers";
import VehicleMainMapCard from "../card/vehicle-card/main-card/VehicleMainMapCard";

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
        <DialogContent
          className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-[400px]`}
        >
          <DialogHeader>
            <DialogTitle>
              {vehicles.length === 1
                ? "Vehicle Details"
                : `${vehicles.length} Vehicles Available`}
            </DialogTitle>
          </DialogHeader>

          <div>
            {vehicles.map((vehicle, index) => {
              const vehicleDetailsPageLink = generateVehicleDetailsUrl({
                vehicleTitle: vehicle.model,
                state: state,
                vehicleCategory: category,
                vehicleCode: vehicle.vehicleCode,
                country: country,
              });
              return (
                <div key={vehicle.vehicleCode}>
                  <Link
                    target="_blank"
                    href={`https://dev.ride.rent${vehicleDetailsPageLink}`}
                  >
                    <VehicleMainMapCard
                      vehicle={vehicle}
                      index={index}
                      country={country}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </BlurDialog>
    </>
  );
}
