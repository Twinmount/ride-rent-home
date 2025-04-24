import { VehicleSeriesSearchItems } from "@/types";
import Link from "next/link";

type VehiclesSeriesSearchResultProps = {
  vehicleSeries: VehicleSeriesSearchItems[];
  state: string;
};

export default function VehiclesSeriesSearchResult({
  vehicleSeries,
  state,
}: VehiclesSeriesSearchResultProps) {
  if (vehicleSeries.length === 0) return null;

  return (
    <div className="mb-3 rounded-[0.4rem] bg-slate-50 p-1">
      <h3 className="mb-2 border-b px-3 py-2 text-sm font-semibold text-gray-700">
        Available Vehicles
      </h3>
      <div className="flex flex-col rounded-[0.25rem] p-1">
        {vehicleSeries.map((item) => (
          <Link
            key={item._id}
            href={`/${state}/rent/${item.brand}/${item.urlTitle}`}
            target="_blank"
            className="cursor-pointer rounded px-3 py-2 text-sm text-gray-900 hover:bg-gray-200"
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
