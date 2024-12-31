import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatKeyForIcon } from "@/helpers";
import { VehicleCardType } from "@/types/vehicle-types";

type VehicleSpecsGridProps = {
  vehicleSpecs: VehicleCardType["vehicleSpecs"];
  vehicleCategory: string;
};

const VehicleSpecsGrid: React.FC<VehicleSpecsGridProps> = ({
  vehicleSpecs,
  vehicleCategory,
}) => {
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className="flex justify-between flex-wrap gap-y-2 gap-x-2 mb-1 bg-slate-100 p-2 rounded-[0.5rem]">
      {Object.entries(vehicleSpecs).map(([key, spec]) => (
        <TooltipProvider delayDuration={200} key={key}>
          <Tooltip>
            <TooltipTrigger className="min-w-[5rem] w-full max-w-[30%] flex items-center gap-x-1 text-left text-sm leading-snug text-gray-500">
              <img
                src={`${baseAssetsUrl}/icons/vehicle-specifications/${vehicleCategory}/${formatKeyForIcon(
                  key
                )}.svg`}
                alt={`${spec.name} icon`}
                className="flex-shrink-0"
              />
              <div className="w-full h-auto overflow-hidden whitespace-nowrap text-ellipsis">
                {key === "Mileage" && spec.value
                  ? `${spec.value} mileage range`
                  : spec.name || "N/A"}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 text-white rounded-xl shadow-md">
              <p>
                {key === "Mileage" && spec.value
                  ? `${spec.value} mileage range`
                  : spec.name || "N/A"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
};

export default VehicleSpecsGrid;
