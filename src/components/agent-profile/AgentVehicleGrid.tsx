import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import MainCard from "../card/vehicle-card/main-card/VehicleMainCard";
import { Suspense } from "react";
import Pagination from "../common/Pagination";
import { ENV } from "@/config/env";

type Props = {
  filter: string;
  page: number;
  companyId: string;
};

export const revalidate = 600;

export default async function AgentVehicleGrid({
  filter,
  page,
  companyId,
}: Props) {
  const baseUrl = ENV.API_URL;

  const params = new URLSearchParams({
    page: page.toString(),
    companyId,
    limit: "9",
    sortOrder: "DESC",
    vehicleCategory: filter,
  }).toString();

  const url = `${baseUrl}/vehicle/vehicle/company/list?${params}`;

  // Fetch vehicles from the backend
  const response = await fetch(url);

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;
  const vehicles = data.result.list || [];

  return (
    <div>
      {vehicles.length > 0 ? (
        <div className="mx-auto !grid w-fit max-w-fit grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <MainCard key={vehicle.vehicleId} index={index} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex-center h-72 text-lg font-thin">
          No Vehicles Found&nbsp; :/
        </div>
      )}
      {vehicles.length > 0 && (
        <Suspense fallback={<div>Loading Pagination...</div>}>
          <Pagination page={page} totalPages={totalPages} />
        </Suspense>
      )}
    </div>
  );
}
