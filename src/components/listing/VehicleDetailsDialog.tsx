"use client";
import { BlurDialog } from "@/components/ui/blur-dialog";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  generateCompanyProfilePageLink,
  generateVehicleDetailsUrl,
} from "@/helpers";
import { Car } from "lucide-react";
import Link from "next/link";

interface Vehicle {
  vehicleModel: string;
  rentalDetails: {
    day: string | null;
    week: string | null;
    month: string | null;
    hour: string | null;
  };
  vehicleCode: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  companyShortId: string;
  companyName: string;
  originalLocation?: {
    lat: number;
    lng: number;
    address: string;
  };
  isAdjusted?: boolean;
  companyLogo?: string;
}

export function VehicleDetailsDialog({
  open,
  vehicles,
  setOpen,
  country,
  state,
  category,
  baseUrl,
  convert,
}: {
  open: boolean;
  vehicles: Vehicle[];
  setOpen: (open: boolean) => void;
  country: string;
  state: string;
  category: string;
  baseUrl: string;
  convert: (text: number) => number;
}) {
  return (
    <>
      <BlurDialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className={`h-fit rounded-xl bg-white py-6 max-md:w-[95%] sm:max-w-[800px]`}
        >
          <DialogHeader>
            <DialogTitle>
              {vehicles.length === 1
                ? "Vehicle Details"
                : `${vehicles.length} Vehicles Available`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {vehicles.map((vehicle: Vehicle) => {
              const aagentLink = generateCompanyProfilePageLink(
                vehicle.companyName,
                vehicle.companyShortId,
                country,
              );

              const vehicleDetailsPageLink = generateVehicleDetailsUrl({
                vehicleTitle: vehicle.vehicleModel,
                state: state,
                vehicleCategory: category,
                vehicleCode: vehicle.vehicleCode,
                country: country,
              });

              return (
                <div
                  key={vehicle.vehicleCode}
                  className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-lg transition-all hover:shadow-xl"
                >
                  {/* Vehicle Details Box */}
                  <Link
                    target="_blank"
                    href={`https://dev.ride.rent${vehicleDetailsPageLink}`}
                    className="block rounded-lg border border-blue-100 bg-blue-50 p-4 transition hover:border-blue-400 hover:bg-white"
                  >
                    <div className="flex items-start justify-between">
                      {/* Left: Vehicle Info */}
                      <div>
                        <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-blue-900">
                          <Car className="h-5 w-5 text-blue-500" />
                          {vehicle.vehicleModel}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Code: {vehicle.vehicleCode}
                        </p>
                        {vehicle.isAdjusted && (
                          <p className="text-orange-600 mt-1 text-xs font-medium">
                            ⚠ Position adjusted for visibility
                          </p>
                        )}
                      </div>

                      {/* Right: Price Info */}
                      <div className="space-y-1 text-right text-yellow">
                        {vehicle.rentalDetails.day && (
                          <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                            {convert(Number(vehicle.rentalDetails.day))}
                            <span className="ml-1 text-xs text-gray-500">
                              / day
                            </span>
                          </p>
                        )}
                        {vehicle.rentalDetails.week && (
                          <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                            {convert(Number(vehicle.rentalDetails.week))}
                            <span className="ml-1 text-xs text-gray-500">
                              / week
                            </span>
                          </p>
                        )}
                        {vehicle.rentalDetails.month && (
                          <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                            {convert(Number(vehicle.rentalDetails.month))}
                            <span className="ml-1 text-xs text-gray-500">
                              / month
                            </span>
                          </p>
                        )}
                        {vehicle.rentalDetails.hour && (
                          <p className="flex items-center justify-end gap-1 text-sm font-semibold">
                            {convert(Number(vehicle.rentalDetails.hour))}
                            <span className="ml-1 text-xs text-gray-500">
                              / hour
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>

                  {/* Vendor Box */}
                  <Link
                    target="_blank"
                    href={`https://dev.ride.rent${aagentLink}`}
                    className="flex items-center gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4 transition hover:border-blue-400 hover:bg-white"
                  >
                    {/* Logo */}
                    {vehicle.companyLogo ? (
                      <img
                        src={`${baseUrl}/file/stream?path=${vehicle.companyLogo}`}
                        alt={vehicle.companyName}
                        className="h-12 w-12 rounded-full border border-gray-200 object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm text-gray-600">
                        N/A
                      </div>
                    )}

                    {/* Name */}
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold text-gray-800">
                        Vendor:
                      </span>{" "}
                      {vehicle.companyName}
                    </p>
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
