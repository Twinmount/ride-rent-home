import AgentProfile from "@/components/agent-profile/AgentProfile";
import AgentVehicleFilter from "@/components/agent-profile/AgentVehicleFilter";
import AgentVehicleGrid from "@/components/agent-profile/AgentVehicleGrid";
import VehicleCardSkeleton from "@/components/skelton/VehicleCardSkeleton";
import { FetchCompanyDetailsResponse } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { fetchCompanyDetails, generateCompanyMetadata } from "./profile-metadata";

type PropsType = {
  searchParams: { [key: string]: string | undefined };
  params: { companyId: string };
};

// // Generate Meta Data
export async function generateMetadata({
  params: { companyId },
}: PropsType): Promise<Metadata> {
  const data = await fetchCompanyDetails(companyId);

  if (!data || !data.result) {
    return notFound();
  }

  return generateCompanyMetadata(data.result, companyId);
}

export default async function AgentProfilePage({
  searchParams,
  params: { companyId },
}: PropsType) {
  const baseUrl = process.env.API_URL;

  // Default filter category set to "car"
  const filter = searchParams.filter;
  const page = parseInt(searchParams.page || "1", 10);

  // Fetch Data from API
  const response = await fetch(
    `${baseUrl}/company/public?companyId=${companyId}`,
    {
      method: "GET",
      cache: "no-cache",
    }
  );

  const data: FetchCompanyDetailsResponse = await response.json();

  // Handle API errors or invalid data
  if (!response.ok || !data.result) {
    console.error("Invalid API response:", response.statusText);
    return notFound();
  }

  // Extract company details and filters
  const companyDetails = data.result;
  const filters = data.result.categories || [];

  return (
    <section className="wrapper bg-white">
      {/* agent details */}
      <AgentProfile companyDetails={companyDetails} />

      <h1 className="text-2xl lg:text-3xl font-semibold mt-6 text-center">
        Our Vehicles Available For Rent / Lease
      </h1>
      <AgentVehicleFilter filters={filters} />
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <VehicleCardSkeleton />
          </div>
        }
      >
        <AgentVehicleGrid
          filter={filter as string}
          page={page}
          companyId={companyId}
        />
      </Suspense>
    </section>
  );
}
