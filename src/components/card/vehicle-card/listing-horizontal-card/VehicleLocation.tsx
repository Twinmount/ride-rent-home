import React from "react";
import { IoLocationOutline } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

type VehicleLocationProps = {
  state: string | null;
  vehicleDetailsPageLink: string;
};

const VehicleLocation: React.FC<VehicleLocationProps> = ({
  state,
  vehicleDetailsPageLink,
}) => {
  const locationLabel = state ? state : "N/A";

  return (
    <Link
      href={vehicleDetailsPageLink}
      target="_blank"
      className="flex items-center h-8 text-sm gap-x-1 text-gray-700 gap-y-[0.1rem]"
    >
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="flex justify-start items-center">
            <IoLocationOutline size={17} />{" "}
            <span className="capitalize text-[0.95rem] overflow-hidden text-ellipsis whitespace-nowrap w-fit max-w-[5rem] text-left">
              {locationLabel}
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
            <p>{locationLabel || "Not Available"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
};

export default VehicleLocation;
