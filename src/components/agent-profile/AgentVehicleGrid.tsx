import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import MainCard from "../card/vehicle-card/main-card/MainCard";
import { Suspense } from "react";
import Pagination from "../general/pagination/Pagination";

type Props = {
  filter: string;
  page: number;
  companyId: string;
};

export default async function AgentVehicleGrid({
  filter,
  page,
  companyId,
}: Props) {
  const baseUrl = process.env.API_URL;

  // Fetch vehicles from the backend
  const response = await fetch(
    `${baseUrl}/vehicle/vehicle/company/list?page=1&companyId=${companyId}&limit=9&sortOrder=DESC&vehicleCategory=${filter}`,
    {
      method: "GET",
      next: { revalidate: 600 },
    }
  );

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;
  const vehicles = data.result.list || [];

  return (
    <div>
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-fit max-w-fit mx-auto gap-4">
          {vehicles.map((vehicle, index) => (
            <MainCard key={index} vehicle={vehicle} />
          ))}
        </div>
      ) : (
        <div className="flex-center h-72 font-thin text-lg">
          No Vehicles Found for category&nbsp;
          <span className="capitalize bg-slate-200 px-1 rounded-lg italic text-slate-800">
            {filter}
          </span>
          &nbsp; :/
        </div>
      )}
      <Suspense fallback={<div>Loading Pagination...</div>}>
        <Pagination page={page} totalPages={totalPages} />
      </Suspense>
    </div>
  );
}
