import { generateVehicleDetailsUrl } from "@/helpers";
import { VehicleSearchItems } from "@/types";
import Link from "next/link";

type VehicleModelsSearchResultProps = {
  vehicles: VehicleSearchItems[];
  state: string;
};

export default function VehicleModelsSearchResult({
  vehicles,
  state,
}: VehicleModelsSearchResultProps) {
  if (vehicles.length === 0) return null;

  return (
    <div className="rounded-[0.4rem] bg-slate-50 p-1">
      <h3 className="mb-2 border-b px-3 py-2 text-sm font-semibold text-gray-700">
        Models
      </h3>
      <div className="flex flex-col rounded-[0.25rem] p-1">
        {vehicles.map((item) => {
          // dynamic link to navigate to vehicle details page
          const vehicleDetailsPageLink = generateVehicleDetailsUrl({
            vehicleTitle: item.title,
            state,
            vehicleCategory: item.category,
            vehicleCode: item.code,
          });

          return (
            <Link
              key={item._id}
              href={vehicleDetailsPageLink}
              className="cursor-pointer rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-200"
            >
              {item.title || "N/A"}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
