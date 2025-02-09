import { ENV } from "@/config/env";
import { formatKeyForIcon } from "@/helpers";
import { VehicleCardType } from "@/types/vehicle-types";

type SpecsGridProps = {
  vehicle: VehicleCardType;
};

export default function SpecsGrid({ vehicle }: SpecsGridProps) {
  // Base URL for fetching icons
  const baseAssetsUrl = ENV.ASSETS_URL || ENV.NEXT_PUBLIC_ASSETS_URL;

  return (
    <div className="mb-1 flex w-full max-w-full flex-wrap gap-x-1 gap-y-2">
      {Object.entries(vehicle.vehicleSpecs).map(([key, spec]) => {
        // Using the  formatted spec name to dynamically fetch the icon
        const imgSrc = `${baseAssetsUrl}/icons/vehicle-specifications/${vehicle.vehicleCategory}/${formatKeyForIcon(key)}.svg`;

        return (
          <div
            key={key}
            className="relative flex w-[31%] max-w-[31%] items-center justify-start gap-x-1 text-[0.8rem] leading-[1.2] text-gray-800"
          >
            {/* Using the formatted spec name to dynamically fetch the icon */}
            <img src={imgSrc} alt={`${spec.name} icon`} className="shrink-0" />
            <div className="break-word relative h-auto w-full overflow-hidden text-ellipsis whitespace-nowrap hover:absolute hover:z-10 hover:overflow-visible hover:whitespace-normal hover:rounded-md hover:bg-white hover:p-1 hover:text-black hover:shadow-lg">
              {key === "Mileage" && spec.value
                ? `${spec.value} mileage range`
                : spec.name || "N/A"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
