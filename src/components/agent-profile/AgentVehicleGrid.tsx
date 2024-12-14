import { FetchVehicleCardsResponse } from "@/types/vehicle-types";
import MainCard from "../card/vehicle-card/main-card/MainCard";
import { VehicleCardType } from "@/types";
import { Suspense } from "react";
import Pagination from "../general/pagination/Pagination";

type Props = {
  filter: string;
  page: number;
  companyId: string;
};

interface RequestBody {
  page: string;
  limit: string;
  sortOrder: "ASC" | "DESC";
  category: string;
}

export default async function AgentVehicleGrid({ filter, page, companyId }: Props) {

  const baseUrl = process.env.API_URL;
  

  const requestBody: RequestBody = {
    page: page.toString(),
    limit: "9",
    sortOrder: "DESC",
    category: filter, 
  };

  // Fetch vehicles from the backend
  const response = await fetch(`${baseUrl}/vehicle/company/?page=1&companyId=${companyId}&limit=6&sortOrder=DESC&category=${filter}`, {
    method: "GET",
    next: { revalidate: 600 },
  });

  // Parse the JSON response
  const data: FetchVehicleCardsResponse = await response.json();

  const totalPages = data?.result?.totalNumberOfPages || 1;
  const vehicles = data.result.list || [];

  return (
    <div>
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
