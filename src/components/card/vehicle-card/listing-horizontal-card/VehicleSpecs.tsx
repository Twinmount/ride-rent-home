import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatKeyForIcon } from "@/helpers";

type VehicleSpecsProps = {
  vehicleSpecs: Record<string, { name: string; value?: string }>;
  vehicleCategory: string;
};

const VehicleSpecs: React.FC<VehicleSpecsProps> = ({
  vehicleSpecs,
  vehicleCategory,
}) => {
  const baseAssetsUrl = process.env.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className="w-[98%] max-w-[98%] bg-gray-100 flex items-center justify-start gap-x-1 px-[0.3rem]  py-1 text-sm leading-snug text-gray-500 rounded-[0.5rem]">
      {Object.entries(vehicleSpecs).map(([key, spec]) => (
        <TooltipProvider delayDuration={200} key={key}>
          <Tooltip>
            <TooltipTrigger className="w-[16.67%] max-w-[16.7%] min-w-[16.7%] flex items-center justify-start gap-x-1 text-sm leading-snug text-gray-500">
              <img
                src={`${baseAssetsUrl}/icons/vehicle-specifications/${vehicleCategory}/${formatKeyForIcon(
                  key
                )}.svg`}
                alt={`${spec.name} icon`}
                className="flex-shrink-0"
              />
              <div className="w-full h-auto overflow-hidden whitespace-nowrap text-ellipsis break-words text-left">
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

export default VehicleSpecs;
